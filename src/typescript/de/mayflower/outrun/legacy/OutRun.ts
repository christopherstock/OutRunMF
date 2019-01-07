
    import * as outrun from '..'

    /** ****************************************************************************************************************
    *   The main legacy game engine.
    *******************************************************************************************************************/
    // tslint:disable:max-line-length
    export class OutRun
    {
        /** The canvas system. */
        private     readonly    canvasSystem        :outrun.CanvasSystem          = null;

        /** The game stage. */
        private                 stage               :outrun.Stage                 = null;

        /** scaling factor to provide resolution independence (computed) */
        private                 resolution          :number                     = null;

        /** Indicates if the 'steer left' key is pressed this game tick. */
        private                 keyLeft             :boolean                    = false;
        /** Indicates if the 'steer right' key is pressed this game tick. */
        private                 keyRight            :boolean                    = false;
        /** Indicates if the 'faster' key is pressed this game tick. */
        private                 keyFaster           :boolean                    = false;
        /** Indicates if the 'slower' key is pressed this game tick. */
        private                 keySlower           :boolean                    = false;

        /** ************************************************************************************************************
        *   Creates a new legacy game system.
        *
        *   @param canvasSystem The canvas system to use for rendering.
        ***************************************************************************************************************/
        public constructor( canvasSystem:outrun.CanvasSystem )
        {
            this.canvasSystem = canvasSystem;
        }

        /** ************************************************************************************************************
        *   Resets the legacy game to its initial defaults.
        ***************************************************************************************************************/
        public reset() : void
        {
            // specify canvas resolution according to its current height
            this.resolution = this.canvasSystem.getHeight() / 480;

            // rebuild the stage TODO create enum for different levels?
            this.stage = new outrun.LevelTest();
            this.stage.init( this.stage.player.playerZ );
        }

        /** ************************************************************************************************************
        *   Starts the legacy game.
        ***************************************************************************************************************/
        public start() : void
        {
/*
            const frame:()=>void = (): void =>
            {
                this.update( this.STEP );
                this.render();

                requestAnimationFrame( frame );
            };
            frame();
*/
            // TODO remove! check FPS
            let now  :number = null;
            let last :number = new Date().getTime();
            let dt   :number = 0;
            let gdt  :number = 0;

            const frame :()=>void = ():void =>
            {
                now = new Date().getTime();

                // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
                dt = Math.min(1, (now - last) / 1000);

                gdt = gdt + dt;
                while (gdt > outrun.SettingGame.STEP) {
                    gdt = gdt - outrun.SettingGame.STEP;
                    this.update(outrun.SettingGame.STEP);
                }
                this.render();
                last = now;
                requestAnimationFrame( frame );
            };
            frame(); // lets get this party started
        };

        /** ************************************************************************************************************
        *   Updates the game world.
        *
        *   @param dt The delta time to update the game.
        ***************************************************************************************************************/
        private update( dt:number ) : void
        {
            let   n             :number     = 0;
            let   car           :outrun.Car = null;
            let   carW          :number     = 0;
            let   sprite        :any        = null;
            let   spriteW       :number     = 0;

            const playerSegment :any     = this.stage.findSegment(this.stage.camera.getZ() + this.stage.player.playerZ);
            const playerW       :number  = 80 * outrun.SettingGame.SPRITE_SCALE;
            const speedPercent  :number  = this.stage.player.speed / outrun.SettingGame.MAX_SPEED;
            const dx            :number  = dt * 2 * speedPercent; // at top speed, should be able to cross from left to right (-1 to 1) in 1 second
            const startPosition :number  = this.stage.camera.getZ();

            this.updateCars( dt, playerSegment, playerW );

            this.stage.camera.setZ( outrun.MathUtil.increase(this.stage.camera.getZ(), dt * this.stage.player.speed, this.stage.stageLength) );

            // check pressed keys
            this.keyLeft = outrun.Main.game.keySystem.isPressed(outrun.KeyCodes.KEY_LEFT);
            this.keyRight = outrun.Main.game.keySystem.isPressed(outrun.KeyCodes.KEY_RIGHT);
            this.keyFaster = outrun.Main.game.keySystem.isPressed(outrun.KeyCodes.KEY_UP);
            this.keySlower = outrun.Main.game.keySystem.isPressed(outrun.KeyCodes.KEY_DOWN);

            // Check keys TODO to class Player !
            if (this.keyLeft)
                this.stage.player.playerX = this.stage.player.playerX - dx;
            else if (this.keyRight)
                this.stage.player.playerX = this.stage.player.playerX + dx;

            // check centrifugal force modification if player is in a curve
            this.stage.player.playerX = this.stage.player.playerX - (dx * speedPercent * playerSegment.curve * outrun.SettingGame.CENTRIFUGAL);

            // accelerate or decelerate
            if (this.keyFaster)
                this.stage.player.speed = outrun.MathUtil.accelerate(this.stage.player.speed, outrun.SettingGame.ACCELERATION_RATE, dt);
            else if (this.keySlower)
                this.stage.player.speed = outrun.MathUtil.accelerate(this.stage.player.speed, outrun.SettingGame.BREAKING_RATE, dt);
            else
                this.stage.player.speed = outrun.MathUtil.accelerate(this.stage.player.speed, outrun.SettingGame.NATURAL_DECELERATION_RATE, dt);

            if ((this.stage.player.playerX < -1) || (this.stage.player.playerX > 1)) {

                if (this.stage.player.speed > outrun.SettingGame.OFF_ROAD_LIMIT)
                    this.stage.player.speed = outrun.MathUtil.accelerate(this.stage.player.speed, outrun.SettingGame.OFF_ROAD_DECELERATION, dt);

                for (n = 0; n < playerSegment.sprites.length; n++) {
                    sprite = playerSegment.sprites[n];
                    spriteW = outrun.Main.game.imageSystem.getImage(sprite.source).width * outrun.SettingGame.SPRITE_SCALE;

                    if (outrun.MathUtil.overlap(this.stage.player.playerX, playerW, sprite.offset + spriteW / 2 * (sprite.offset > 0 ? 1 : -1), spriteW, 0)) {
                        this.stage.player.speed = outrun.SettingGame.MAX_SPEED / 5;
                        this.stage.camera.setZ( outrun.MathUtil.increase(playerSegment.p1.world.z, -this.stage.player.playerZ, this.stage.stageLength) ); // stop in front of sprite (at front of segment)
                        break;
                    }
                }
            }

            for (n = 0; n < playerSegment.cars.length; n++) {
                car = playerSegment.cars[n];
                carW = outrun.Main.game.imageSystem.getImage(car.sprite).width * outrun.SettingGame.SPRITE_SCALE;
                if (this.stage.player.speed > car.speed) {
                    if (outrun.MathUtil.overlap(this.stage.player.playerX, playerW, car.offset, carW, 0.8)) {
                        this.stage.player.speed = car.speed * (car.speed / this.stage.player.speed);
                        this.stage.camera.setZ( outrun.MathUtil.increase( car.z, -this.stage.player.playerZ, this.stage.stageLength ) );
                        break;
                    }
                }
            }

            this.stage.player.playerX = outrun.MathUtil.limit(this.stage.player.playerX, -3, 3);     // dont ever let it go too far out of bounds
            this.stage.player.speed = outrun.MathUtil.limit(this.stage.player.speed, 0, outrun.SettingGame.MAX_SPEED); // or exceed maxSpeed

            this.stage.background.skyOffset  = outrun.MathUtil.increase( this.stage.background.skyOffset,  outrun.SettingGame.SKY_SPEED  * playerSegment.curve * (this.stage.camera.getZ() - startPosition) / outrun.SettingGame.SEGMENT_LENGTH, 1 );
            this.stage.background.hillOffset = outrun.MathUtil.increase( this.stage.background.hillOffset, outrun.SettingGame.HILL_SPEED * playerSegment.curve * (this.stage.camera.getZ() - startPosition) / outrun.SettingGame.SEGMENT_LENGTH, 1 );
            this.stage.background.treeOffset = outrun.MathUtil.increase( this.stage.background.treeOffset, outrun.SettingGame.TREE_SPEED * playerSegment.curve * (this.stage.camera.getZ() - startPosition) / outrun.SettingGame.SEGMENT_LENGTH, 1 );
        }

        /** ************************************************************************************************************
        *   Updates the cars in the game world.
        *
        *   @param dt            The delta time to update the game.
        *   @param playerSegment The segment the player is currently in.
        *   @param playerW       The current width of the player.
        ***************************************************************************************************************/
        private updateCars( dt:number, playerSegment:number, playerW:number ) : void
        {
            for ( const car of this.stage.cars )
            {
                const oldSegment:any = this.stage.findSegment(car.z);

                car.offset = car.offset + this.updateCarOffset(car, oldSegment, playerSegment, playerW);
                car.z = outrun.MathUtil.increase(car.z, dt * car.speed, this.stage.stageLength);
                car.percent = outrun.MathUtil.percentRemaining(car.z, outrun.SettingGame.SEGMENT_LENGTH); // useful for interpolation during rendering phase

                const newSegment:any = this.stage.findSegment(car.z);

                if ( oldSegment !== newSegment )
                {
                    const index:number = oldSegment.cars.indexOf( car );
                    oldSegment.cars.splice( index, 1 );
                    newSegment.cars.push( car );
                }
            }
        }

        /** ************************************************************************************************************
        *   Updates the offset for the player car.
        ***************************************************************************************************************/
        private updateCarOffset( car:any, carSegment:any, playerSegment:any, playerW:number ) : number
        {
            const lookahead :number = 20;
            const carW      :number = outrun.Main.game.imageSystem.getImage(car.sprite).width * outrun.SettingGame.SPRITE_SCALE;

            let   dir       :number = 0;    // TODO create enum for direction
            let   otherCarW :number = 0;

            // optimization, dont bother steering around other cars when 'out of sight' of the player
            if ((carSegment.index - playerSegment.index) > outrun.SettingGame.DRAW_DISTANCE)
                return 0;

            for ( let i:number = 1; i < lookahead; i++ )
            {
                const segment:any = this.stage.segments[(carSegment.index + i) % this.stage.segments.length];

                if ((segment === playerSegment) && (car.speed > this.stage.player.speed) && (outrun.MathUtil.overlap(this.stage.player.playerX, playerW, car.offset, carW, 1.2))) {
                    if (this.stage.player.playerX > 0.5)
                        dir = -1;
                    else if (this.stage.player.playerX < -0.5)
                        dir = 1;
                    else
                        dir = (car.offset > this.stage.player.playerX) ? 1 : -1;
                    return dir / i * (car.speed - this.stage.player.speed) / outrun.SettingGame.MAX_SPEED; // the closer the cars (smaller i) and the greated the speed ratio, the larger the offset
                }

                for ( const otherCar of segment.cars )
                {
                    otherCarW = outrun.Main.game.imageSystem.getImage(otherCar.sprite).width * outrun.SettingGame.SPRITE_SCALE;
                    if ((car.speed > otherCar.speed) && outrun.MathUtil.overlap(car.offset, carW, otherCar.offset, otherCarW, 1.2)) {
                        if (otherCar.offset > 0.5)
                            dir = -1;
                        else if (otherCar.offset < -0.5)
                            dir = 1;
                        else
                            dir = (car.offset > otherCar.offset) ? 1 : -1;
                        return dir / i * (car.speed - otherCar.speed) / outrun.SettingGame.MAX_SPEED;
                    }
                }
            }

            // if no cars ahead, but I have somehow ended up off road, then steer back on
            if (car.offset < -0.9)
                return 0.1;
            else if (car.offset > 0.9)
                return -0.1;
            else
                return 0;
        };

        /** ************************************************************************************************************
        *   Renders the current tick of the legacy game.
        *
        *   TODO Add param ctx
        ***************************************************************************************************************/
        private render() : void
        {
            // TODO move to stage!

            const baseSegment   :any    = this.stage.findSegment(this.stage.camera.getZ());
            const basePercent   :number = outrun.MathUtil.percentRemaining(this.stage.camera.getZ(), outrun.SettingGame.SEGMENT_LENGTH);
            const playerSegment :any    = this.stage.findSegment(this.stage.camera.getZ() + this.stage.player.playerZ);
            const playerPercent :number = outrun.MathUtil.percentRemaining(this.stage.camera.getZ() + this.stage.player.playerZ, outrun.SettingGame.SEGMENT_LENGTH);
            const playerY       :number = outrun.MathUtil.interpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);

            let   maxY          :number = this.canvasSystem.getHeight();
            let   x             :number = 0;
            let   dx            :number = -(baseSegment.curve * basePercent);

            // clear canvas
            this.canvasSystem.getCanvasContext().clearRect(0, 0, this.canvasSystem.getWidth(), this.canvasSystem.getHeight());

            // fill canvas with sky color
            outrun.Drawing2D.rect(this.canvasSystem.getCanvasContext(), 0, 0, this.canvasSystem.getWidth(), this.canvasSystem.getHeight(), outrun.SettingColor.SKY);

            outrun.Drawing2D.background( this.canvasSystem.getCanvasContext(), this.canvasSystem.getWidth(), this.canvasSystem.getHeight(), outrun.ImageFile.SKY,  this.stage.background.skyOffset,  this.resolution * outrun.SettingGame.SKY_SPEED  * playerY );
            outrun.Drawing2D.background( this.canvasSystem.getCanvasContext(), this.canvasSystem.getWidth(), this.canvasSystem.getHeight(), outrun.ImageFile.HILL, this.stage.background.hillOffset, this.resolution * outrun.SettingGame.HILL_SPEED * playerY );
            outrun.Drawing2D.background( this.canvasSystem.getCanvasContext(), this.canvasSystem.getWidth(), this.canvasSystem.getHeight(), outrun.ImageFile.TREE, this.stage.background.treeOffset, this.resolution * outrun.SettingGame.TREE_SPEED * playerY );

            let   spriteScale :number = 0;
            let   spriteX     :number = 0;
            let   spriteY     :number = 0;

            for ( let n:number = 0; n < outrun.SettingGame.DRAW_DISTANCE; n++ )
            {
                const segment:any = this.stage.segments[(baseSegment.index + n) % this.stage.segments.length];
                segment.looped = segment.index < baseSegment.index;
                segment.fog = outrun.MathUtil.exponentialFog(n / outrun.SettingGame.DRAW_DISTANCE, outrun.SettingGame.FOG_DENSITY);
                segment.clip = maxY;

                outrun.MathUtil.project(segment.p1, (this.stage.player.playerX * outrun.SettingGame.ROAD_WIDTH) - x, playerY + outrun.SettingGame.CAMERA_HEIGHT, this.stage.camera.getZ() - (segment.looped ? this.stage.stageLength : 0), this.stage.camera.getDepth(), this.canvasSystem.getWidth(), this.canvasSystem.getHeight(), outrun.SettingGame.ROAD_WIDTH);
                outrun.MathUtil.project(segment.p2, (this.stage.player.playerX * outrun.SettingGame.ROAD_WIDTH) - x - dx, playerY + outrun.SettingGame.CAMERA_HEIGHT, this.stage.camera.getZ() - (segment.looped ? this.stage.stageLength : 0), this.stage.camera.getDepth(), this.canvasSystem.getWidth(), this.canvasSystem.getHeight(), outrun.SettingGame.ROAD_WIDTH);

                x = x + dx;
                dx = dx + segment.curve;

                if (
                    (segment.p1.camera.z <= this.stage.camera.getDepth() ) || // behind us
                    (segment.p2.screen.y >= segment.p1.screen.y)     || // back face cull
                    (segment.p2.screen.y >= maxY)                       // clip by (already rendered) hill
                ) {
                    continue;
                }

                outrun.Drawing2D.segment(
                    this.canvasSystem.getCanvasContext(),
                    this.canvasSystem.getWidth(),
                    outrun.SettingGame.LANES,
                    segment.p1.screen.x,
                    segment.p1.screen.y,
                    segment.p1.screen.w,
                    segment.p2.screen.x,
                    segment.p2.screen.y,
                    segment.p2.screen.w,
                    segment.fog,
                    segment.color
                );

                maxY = segment.p1.screen.y;
            }

            // TODO
            for (let n:number = ( outrun.SettingGame.DRAW_DISTANCE - 1 ); n > 0; n-- )
            {
                const segment:any = this.stage.segments[(baseSegment.index + n) % this.stage.segments.length];

                for ( const car of segment.cars )
                {
                    spriteScale = outrun.MathUtil.interpolate(segment.p1.screen.scale, segment.p2.screen.scale, car.percent);
                    spriteX = outrun.MathUtil.interpolate(segment.p1.screen.x, segment.p2.screen.x, car.percent) + (spriteScale * car.offset * outrun.SettingGame.ROAD_WIDTH * this.canvasSystem.getWidth() / 2);
                    spriteY = outrun.MathUtil.interpolate(segment.p1.screen.y, segment.p2.screen.y, car.percent);
                    outrun.Drawing2D.sprite(this.canvasSystem.getCanvasContext(), this.canvasSystem.getWidth(), this.canvasSystem.getHeight(), this.resolution, outrun.SettingGame.ROAD_WIDTH, car.sprite, spriteScale, spriteX, spriteY, -0.5, -1, segment.clip);
                }

                for ( const sprite of segment.sprites )
                {
                    spriteScale = segment.p1.screen.scale;
                    spriteX = segment.p1.screen.x + (spriteScale * sprite.offset * outrun.SettingGame.ROAD_WIDTH * this.canvasSystem.getWidth() / 2);
                    spriteY = segment.p1.screen.y;
                    outrun.Drawing2D.sprite(this.canvasSystem.getCanvasContext(), this.canvasSystem.getWidth(), this.canvasSystem.getHeight(), this.resolution, outrun.SettingGame.ROAD_WIDTH, sprite.source, spriteScale, spriteX, spriteY, (sprite.offset < 0 ? -1 : 0), -1, segment.clip);
                }

                if (segment === playerSegment) {
                    outrun.Drawing2D.player(
                        this.canvasSystem.getCanvasContext(),
                        this.canvasSystem.getWidth(),
                        this.canvasSystem.getHeight(),
                        this.resolution,
                        outrun.SettingGame.ROAD_WIDTH,
                        this.stage.player.speed / outrun.SettingGame.MAX_SPEED,
                        this.stage.camera.getDepth() / this.stage.player.playerZ,
                        this.canvasSystem.getWidth() / 2,
                        (this.canvasSystem.getHeight() / 2) - (this.stage.camera.getDepth() / this.stage.player.playerZ * outrun.MathUtil.interpolate(playerSegment.p1.camera.y, playerSegment.p2.camera.y, playerPercent) * this.canvasSystem.getHeight() / 2),
                        this.stage.player.speed * ( this.keyLeft ? -1 : this.keyRight ? 1 : 0 ),
                        playerSegment.p2.world.y - playerSegment.p1.world.y
                    );
                }
            }
        }
    }
