
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   The legacy game stage.
    *******************************************************************************************************************/
    export abstract class Stage
    {
        // TODO all to private!

        /** array of road segments */
        public                      segments            :outrun.Segment[]           = [];

        /** z length of entire track (computed) */
        public                      stageLength         :number                     = 0;

        /** The player. */
        public                      player              :outrun.Player              = null;
        /** The stage background. */
        public                      background          :outrun.Background          = null;
        /** The stage camera. */
        public                      camera              :outrun.Camera              = null;

        /** array of cars on the road */
        private                     cars                :outrun.Car[]               = [];

        /** The number of cars to create in this stage. */
        private         readonly    carCount            :number                     = 0;

        public          readonly    trackColorLight     :outrun.ColorCombo          = null;
        public          readonly    trackColorDark      :outrun.ColorCombo          = null;

        private         readonly    skyColor            :string                     = null;
        public          readonly    fogColor            :string                     = null;

        /** ************************************************************************************************************
        *   Creates a new stage.
        *
        *   @param carCount        The number of cars to create in this stage.
        *   @param background      The background to use for this stage.
        *   @param trackColorLight The color for the road (light strip).
        *   @param trackColorDark  The color for the road (dark strip).
        *   @param skyColor        The color of the sky.
        *   @param fogColor        The color of the fog.
        ***************************************************************************************************************/
        protected constructor
        (
            carCount        :number,
            background      :outrun.Background,
            trackColorLight :outrun.ColorCombo,
            trackColorDark  :outrun.ColorCombo,
            skyColor        :string,
            fogColor        :string
        )
        {
            // assign car count
            this.carCount = carCount;

            // create the camera
            this.camera = new outrun.Camera();

            // create the player
            this.player = new outrun.Player( this.camera.getStartupPlayerZ() );

            // create the background
            this.background = background;

            // assign track colors
            this.trackColorLight = trackColorLight;
            this.trackColorDark  = trackColorDark;
            this.skyColor        = skyColor;
            this.fogColor        = fogColor;
        }

        /** ************************************************************************************************************
        *   Initializes all properties of this stage.
        ***************************************************************************************************************/
        public init() : void
        {
            const playerZ:number = this.player.getZ();

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
        *   Updates this stage for one tick of the game loop.
        *
        *   @param dt The delta time to update the game.
        ***************************************************************************************************************/
        public update( dt:number ) : void
        {
            const playerSegment :outrun.Segment = this.findSegment(this.camera.getZ() + this.player.getZ());
            const playerW       :number         = 80 * outrun.SettingGame.SPRITE_SCALE;
            const speedPercent  :number         = this.player.getSpeed() / outrun.SettingGame.MAX_SPEED;
            const dx            :number         = dt * 2 * speedPercent; // at top speed, should be able to cross from left to right (-1 to 1) in 1 second
            const startPosition :number         = this.camera.getZ();

            this.updateCars( dt, playerSegment, playerW );

            this.camera.setZ( outrun.MathUtil.increase(this.camera.getZ(), dt * this.player.getSpeed(), this.stageLength) );

            // check keys for player
            this.player.handlePlayerKeys();

            // update player
            this.player.update( dx, dt );

            // check centrifugal force modification if player is in a curve
            this.player.checkCentrifugalForce( dx, speedPercent, playerSegment );

            // check if player is off-road
            this.player.checkOffroad( playerSegment, playerW, dt, this.stageLength, this.camera );

            // browse all cars
            for ( const car of playerSegment.cars ) {

                const carW:number = outrun.Main.game.imageSystem.getImage( car.getSprite() ).width * outrun.SettingGame.SPRITE_SCALE;

                if ( this.player.getSpeed() > car.getSpeed() ) {

                    // check if player is colliding?
                    if ( this.player.checkCollidingWithCar( car, playerW, carW, this.camera, this.stageLength ) )
                    {
                        break;
                    }
                }
            }

            // dont ever let it go too far out of bounds
            this.player.clipBoundsForX();

            // clip maximum speed
            this.player.clipSpeed();

            // update bg offsets
            this.background.updateOffsets( playerSegment, this.camera, startPosition );
        }

        /** ************************************************************************************************************
        *   Finds the segment that contains the current Z position.
        *
        *   TODO to class 'segment' !
        ***************************************************************************************************************/
        public findSegment( z:number ) : outrun.Segment
        {
            return this.segments[ Math.floor( z / outrun.SettingGame.SEGMENT_LENGTH ) % this.segments.length ];
        }

        /** ************************************************************************************************************
        *   Renders the current tick of the legacy game.
        *
        *   @param ctx        The 2D drawing context.
        *   @param resolution The scaling factor for all images to draw.
        ***************************************************************************************************************/
        public draw( ctx:CanvasRenderingContext2D, resolution:number ) : void
        {
            const baseSegment   :outrun.Segment = this.findSegment(this.camera.getZ());
            const basePercent   :number         = outrun.MathUtil.percentRemaining(this.camera.getZ(), outrun.SettingGame.SEGMENT_LENGTH);
            const playerSegment :outrun.Segment = this.findSegment(this.camera.getZ() + this.player.getZ());
            const playerPercent :number         = outrun.MathUtil.percentRemaining(this.camera.getZ() + this.player.getZ(), outrun.SettingGame.SEGMENT_LENGTH);

            // TODO to player!
            const playerY       :number = outrun.MathUtil.interpolate(playerSegment.getP1().getWorld().y, playerSegment.getP2().getWorld().y, playerPercent);

            let   maxY          :number = outrun.Main.game.canvasSystem.getHeight();
            let   x             :number = 0;
            let   dx            :number = -(baseSegment.curve * basePercent);

            // fill canvas with sky color
            outrun.Drawing2D.rect( ctx, 0, 0, outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), this.skyColor );

            // draw the bg
            this.background.draw( ctx, resolution, playerY );

            let   spriteScale :number = 0;
            let   spriteX     :number = 0;
            let   spriteY     :number = 0;

            for ( let n:number = 0; n < outrun.SettingGame.DRAW_DISTANCE; n++ )
            {
                const segment:outrun.Segment = this.segments[(baseSegment.getIndex() + n) % this.segments.length];

                // TODO remove bad practice!
                segment.looped = segment.getIndex() < baseSegment.getIndex();
                segment.fog = outrun.MathUtil.exponentialFog(n / outrun.SettingGame.DRAW_DISTANCE, outrun.SettingGame.FOG_DENSITY);
                segment.clip = maxY;

                outrun.SegmentPoint.project( segment.getP1(), (this.player.getX() * outrun.SettingGame.ROAD_WIDTH) - x, playerY + outrun.SettingGame.CAMERA_HEIGHT, this.camera.getZ() - (segment.looped ? this.stageLength : 0), this.camera.getDepth(), outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), outrun.SettingGame.ROAD_WIDTH );
                outrun.SegmentPoint.project( segment.getP2(), (this.player.getX() * outrun.SettingGame.ROAD_WIDTH) - x - dx, playerY + outrun.SettingGame.CAMERA_HEIGHT, this.camera.getZ() - (segment.looped ? this.stageLength : 0), this.camera.getDepth(), outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), outrun.SettingGame.ROAD_WIDTH );

                x = x + dx;
                dx = dx + segment.curve;

                if (
                    (segment.getP1().getCamera().z <= this.camera.getDepth() ) || // behind us
                    (segment.getP2().getScreen().y >= segment.getP1().getScreen().y)     || // back face cull
                    (segment.getP2().getScreen().y >= maxY)                       // clip by (already rendered) hill
                ) {
                    continue;
                }

                // draw segment
                segment.draw( ctx );

                // assign maxY ?
                maxY = segment.getP1().getScreen().y;
            }

            // draw all segments
            for (let n:number = ( outrun.SettingGame.DRAW_DISTANCE - 1 ); n > 0; n-- )
            {
                const segment:outrun.Segment = this.segments[ ( baseSegment.getIndex() + n ) % this.segments.length ];

                for ( const car of segment.cars )
                {
                    car.draw( ctx, resolution, segment );
                }

                segment.drawSprites( ctx, resolution );

                if (segment === playerSegment) {

                    this.player.draw( ctx, resolution, playerSegment, this.camera, playerPercent );
                }
            }
        }

        /** ************************************************************************************************************
        *   Updates the cars in the game world.
        *
        *   @param dt            The delta time to update the game.
        *   @param playerSegment The segment the player is currently in.
        *   @param playerW       The current width of the player.
        ***************************************************************************************************************/
        private updateCars( dt:number, playerSegment:outrun.Segment, playerW:number ) : void
        {
            for ( const car of this.cars )
            {
                car.update( dt, this.segments, this.player, playerSegment, playerW, this.stageLength );
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
            this.segments[ this.findSegment( playerZ ).getIndex() + 2 ].color = outrun.SettingColor.START;
            this.segments[ this.findSegment( playerZ ).getIndex() + 3 ].color = outrun.SettingColor.START;
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
                this.segments[ n ].addSprite( new outrun.Sprite( source, offset )  );
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
                const offset  :number = Math.random() * outrun.MathUtil.randomChoice([-0.8, 0.8]);
                const z       :number = Math.floor(
                    Math.random() * this.segments.length
                ) * outrun.SettingGame.SEGMENT_LENGTH;
                const sprite  :string = outrun.MathUtil.randomChoice( outrun.ImageFile.CARS );

                // TODO map speeds for cars!
                const speed   :number         = (
                    ( outrun.SettingGame.MAX_SPEED / 4 )
                    + ( Math.random() * outrun.SettingGame.MAX_SPEED / ( sprite === outrun.ImageFile.TRUCK2 ? 4 : 2 ) )
                );
                const car     :outrun.Car     = new outrun.Car( offset, z, sprite, speed );
                const segment :outrun.Segment = this.findSegment( car.getZ() );

                segment.cars.push( car );
                this.cars.push(    car );
            }
        }

        public static findSegment( segments:outrun.Segment[], z:number ) : outrun.Segment
        {
            return segments[ Math.floor( z / outrun.SettingGame.SEGMENT_LENGTH ) % segments.length ];
        }
    }
