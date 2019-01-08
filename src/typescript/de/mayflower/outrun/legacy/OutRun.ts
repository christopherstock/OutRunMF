
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

        /** scaling factor to provide resolution independence (computed). TODO to CanvasSystem? */
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
            this.stage.init();
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
                this.render( this.canvasSystem.getCanvasContext() );
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

            // update bg offsets
            this.stage.background.updateOffsets( playerSegment, this.stage.camera, startPosition );
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
        *   @param ctx The 2D drawing context.
        ***************************************************************************************************************/
        private render( ctx:CanvasRenderingContext2D ) : void
        {
            // clear canvas
            ctx.clearRect(0, 0, this.canvasSystem.getWidth(), this.canvasSystem.getHeight());

            this.stage.render
            (
                ctx,
                this.resolution,
                this.keyLeft,
                this.keyRight
            );
        }
    }
