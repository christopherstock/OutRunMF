
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   The legacy game stage.
    *******************************************************************************************************************/
    export abstract class Stage
    {
        // TODO all to private!

        /** array of road segments */
        public                      segments            :outrun.Segment[]           = [];

        /** array of cars on the road */
        public                      cars                :outrun.Car[]               = [];
        /** z length of entire track (computed) */
        public                      stageLength         :number                     = 0;

        /** The player. */
        public                      player              :outrun.Player              = null;
        /** The stage background. */
        public                      background          :outrun.Background          = null;
        /** The stage camera. */
        public                      camera              :outrun.Camera              = null;

        /** The number of cars to create in this stage. */
        private         readonly    carCount            :number                     = 0;

        /** ************************************************************************************************************
        *   Creates a new stage.
        *
        *   @param carCount The number of cars to create in this stage.
        ***************************************************************************************************************/
        protected constructor( carCount:number )
        {
            // assign car count
            this.carCount = carCount;

            // create the player
            this.player = new outrun.Player();

            // create the camera
            this.camera = new outrun.Camera();

            // specify player's initial Z position TODO suspicious dependency
            this.player.playerZ = ( outrun.SettingGame.CAMERA_HEIGHT * this.camera.getDepth() );

            // create the background
            this.background = new outrun.Background();
        }

        /** ************************************************************************************************************
        *   Initializes all properties of this stage.
        ***************************************************************************************************************/
        public init() : void
        {
            const playerZ:number = this.player.playerZ;

            // create the road
            this.createRoad( playerZ );

            // set start and finish
            this.setStartAndFinish( playerZ );

            // add sprites and cars
            this.createSprites();
            this.createCars();

            // assign full stage length
            this.stageLength = this.segments.length * outrun.SettingGame.SEGMENT_LENGTH;
        }

        /** ************************************************************************************************************
        *   Finds the segment that contains the current Z position.
        *
        *   TODO to class 'segment' !
        ***************************************************************************************************************/
        public findSegment( z:number ) : any
        {
            return this.segments[ Math.floor( z / outrun.SettingGame.SEGMENT_LENGTH ) % this.segments.length ];
        }

        public render( ctx:CanvasRenderingContext2D, resolution:number, keyLeft:boolean, keyRight:boolean ) : void
        {
            const baseSegment   :any    = this.findSegment(this.camera.getZ());
            const basePercent   :number = outrun.MathUtil.percentRemaining(this.camera.getZ(), outrun.SettingGame.SEGMENT_LENGTH);
            const playerSegment :any    = this.findSegment(this.camera.getZ() + this.player.playerZ);
            const playerPercent :number = outrun.MathUtil.percentRemaining(this.camera.getZ() + this.player.playerZ, outrun.SettingGame.SEGMENT_LENGTH);

            // TODO to player!
            const playerY       :number = outrun.MathUtil.interpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);

            let   maxY          :number = outrun.Main.game.canvasSystem.getHeight();
            let   x             :number = 0;
            let   dx            :number = -(baseSegment.curve * basePercent);

            // fill canvas with sky color
            outrun.Drawing2D.rect( ctx, 0, 0, outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), outrun.SettingColor.SKY );

            // draw the bg
            this.background.draw( ctx, resolution, playerY );

            let   spriteScale :number = 0;
            let   spriteX     :number = 0;
            let   spriteY     :number = 0;

            for ( let n:number = 0; n < outrun.SettingGame.DRAW_DISTANCE; n++ )
            {
                const segment:any = this.segments[(baseSegment.index + n) % this.segments.length];
                segment.looped = segment.index < baseSegment.index;
                segment.fog = outrun.MathUtil.exponentialFog(n / outrun.SettingGame.DRAW_DISTANCE, outrun.SettingGame.FOG_DENSITY);
                segment.clip = maxY;

                outrun.MathUtil.project(segment.p1, (this.player.playerX * outrun.SettingGame.ROAD_WIDTH) - x, playerY + outrun.SettingGame.CAMERA_HEIGHT, this.camera.getZ() - (segment.looped ? this.stageLength : 0), this.camera.getDepth(), outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), outrun.SettingGame.ROAD_WIDTH);
                outrun.MathUtil.project(segment.p2, (this.player.playerX * outrun.SettingGame.ROAD_WIDTH) - x - dx, playerY + outrun.SettingGame.CAMERA_HEIGHT, this.camera.getZ() - (segment.looped ? this.stageLength : 0), this.camera.getDepth(), outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), outrun.SettingGame.ROAD_WIDTH);

                x = x + dx;
                dx = dx + segment.curve;

                if (
                    (segment.p1.camera.z <= this.camera.getDepth() ) || // behind us
                    (segment.p2.screen.y >= segment.p1.screen.y)     || // back face cull
                    (segment.p2.screen.y >= maxY)                       // clip by (already rendered) hill
                ) {
                    continue;
                }

                outrun.Drawing2D.segment(
                    ctx,
                    outrun.Main.game.canvasSystem.getWidth(),
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
                const segment:any = this.segments[(baseSegment.index + n) % this.segments.length];

                for ( const car of segment.cars )
                {
                    spriteScale = outrun.MathUtil.interpolate(segment.p1.screen.scale, segment.p2.screen.scale, car.percent);
                    spriteX = outrun.MathUtil.interpolate(segment.p1.screen.x, segment.p2.screen.x, car.percent) + (spriteScale * car.offset * outrun.SettingGame.ROAD_WIDTH * outrun.Main.game.canvasSystem.getWidth() / 2);
                    spriteY = outrun.MathUtil.interpolate(segment.p1.screen.y, segment.p2.screen.y, car.percent);
                    outrun.Drawing2D.sprite(ctx, outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), resolution, outrun.SettingGame.ROAD_WIDTH, car.sprite, spriteScale, spriteX, spriteY, -0.5, -1, segment.clip);
                }

                for ( const sprite of segment.sprites )
                {
                    spriteScale = segment.p1.screen.scale;
                    spriteX = segment.p1.screen.x + (spriteScale * sprite.offset * outrun.SettingGame.ROAD_WIDTH * outrun.Main.game.canvasSystem.getWidth() / 2);
                    spriteY = segment.p1.screen.y;
                    outrun.Drawing2D.sprite(ctx, outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), resolution, outrun.SettingGame.ROAD_WIDTH, sprite.source, spriteScale, spriteX, spriteY, (sprite.offset < 0 ? -1 : 0), -1, segment.clip);
                }

                if (segment === playerSegment) {
                    outrun.Drawing2D.player(
                        ctx,
                        outrun.Main.game.canvasSystem.getWidth(),
                        outrun.Main.game.canvasSystem.getHeight(),
                        resolution,
                        outrun.SettingGame.ROAD_WIDTH,
                        this.player.speed / outrun.SettingGame.MAX_SPEED,
                        this.camera.getDepth() / this.player.playerZ,
                        outrun.Main.game.canvasSystem.getWidth() / 2,
                        (outrun.Main.game.canvasSystem.getHeight() / 2) - (this.camera.getDepth() / this.player.playerZ * outrun.MathUtil.interpolate(playerSegment.p1.camera.y, playerSegment.p2.camera.y, playerPercent) * outrun.Main.game.canvasSystem.getHeight() / 2),
                        this.player.speed * ( keyLeft ? -1 : keyRight ? 1 : 0 ),
                        playerSegment.p2.world.y - playerSegment.p1.world.y
                    );
                }
            }
        }

        /** ************************************************************************************************************
        *   Creates the road of this stage.
        *
        *   @param playerZ The initial z position of the player.
        ***************************************************************************************************************/
        protected abstract createRoad( playerZ:number ) : void;

        /** ************************************************************************************************************
        *   Creates all decoration sprites for this stage.
        ***************************************************************************************************************/
        protected abstract createSprites() : void;

        /** ************************************************************************************************************
        *   Sets the start and the finish line.
        *
        *   TODO Move to LevelPreset?
        *
        *   @param playerZ The initial z position of the player.
        ***************************************************************************************************************/
        protected setStartAndFinish( playerZ:number ) : void
        {
            // set start and finish
            this.segments[ this.findSegment( playerZ ).index + 2 ].color = outrun.SettingColor.START;
            this.segments[ this.findSegment( playerZ ).index + 3 ].color = outrun.SettingColor.START;
            for (let n:number = 0; n < outrun.SettingGame.RUMBLE_LENGTH; n++ )
            {
                this.segments[ this.segments.length - 1 - n ].color = outrun.SettingColor.FINISH;
            }
        }

        /** ************************************************************************************************************
        *   TODO to class segment!
        ***************************************************************************************************************/
        protected addSprite( n:number, source:string, offset:number ) : void
        {
            if ( this.segments.length > n )
            {
                this.segments[ n ].sprites.push( { source: source, offset: offset } );
            }
        }

        /** ************************************************************************************************************
        *   Resets all cars on the road to their initial state.
        ***************************************************************************************************************/
        private createCars() : void
        {
            // TODO duplicated in segment.cars - remove one of both??
            this.cars = [];

            for ( let i:number = 0; i < this.carCount; i++ )
            {
                const offset  :number         = Math.random() * outrun.MathUtil.randomChoice([-0.8, 0.8]);
                const z       :number         = Math.floor(Math.random() * this.segments.length) * outrun.SettingGame.SEGMENT_LENGTH;
                const sprite  :string         = outrun.MathUtil.randomChoice( outrun.ImageFile.CARS );

                // TODO map speeds for cars!
                const speed   :number         = outrun.SettingGame.MAX_SPEED / 4 + Math.random() * outrun.SettingGame.MAX_SPEED / (sprite === outrun.ImageFile.TRUCK2 ? 4 : 2);
                const car     :outrun.Car     = { offset: offset, z: z, sprite: sprite, speed: speed, percent: 0 };
                const segment :outrun.Segment = this.findSegment( car.z );

                segment.cars.push(car);
                this.cars.push(car);
            }
        }
    }
