
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   The legacy game stage.
    *******************************************************************************************************************/
    export abstract class Stage
    {
        // TODO private and enable different segment colors per level ..
        public          readonly    segmentColor        :outrun.SegmentColorSet     = null;

        /** array of cars on the road */
        private                     cars                :outrun.Car[]               = [];
        /** array of road segments */
        private                     segments            :outrun.Segment[]           = [];
        /** z length of entire track (computed) */
        private                     stageLength         :number                     = 0;

        /** The number of cars to create in this stage. */
        private         readonly    carCount            :number                     = 0;
        /** The stage camera. */
        private         readonly    camera              :outrun.Camera              = null;
        /** The player. */
        private         readonly    player              :outrun.Player              = null;
        /** The stage background. */
        private         readonly    background          :outrun.Background          = null;
        /** The bg color of the sky for this stage */
        private         readonly    skyColor            :string                     = null;
        /** The color of the fog in this stage */
        private         readonly    fogColor            :string                     = null;

        /** ************************************************************************************************************
        *   Creates a new stage.
        *
        *   @param carCount     The number of cars to create in this stage.
        *   @param background   The background to use for this stage.
        *   @param segmentColor The color for the segments.
        *   @param skyColor     The color of the sky.
        *   @param fogColor     The color of the fog.
        ***************************************************************************************************************/
        protected constructor
        (
            carCount     :number,
            background   :outrun.Background,
            segmentColor :outrun.SegmentColorSet,
            skyColor     :string,
            fogColor     :string
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
            this.segmentColor = segmentColor;
            this.skyColor     = skyColor;
            this.fogColor     = fogColor;
        }

        /** ************************************************************************************************************
        *   Initializes all properties of this stage.
        ***************************************************************************************************************/
        public init() : void
        {
            const playerZ:number = this.player.getZ();

            // create the road
            this.segments = this.createRoad( playerZ );

            // add sprites and cars
            this.createSprites( this.segments.length );
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
            // update player segment
            this.player.setPlayerSegment(
                Stage.findSegment( this.segments, this.camera.getZ() + this.player.getZ() )
            );
            this.player.speedPercent  = this.player.getSpeed() / outrun.SettingGame.PLAYER_MAX_SPEED;

            // at top speed, should be able to cross from left to right (-1 to 1) in 1 second
            const dx            :number = ( dt * 2 * this.player.speedPercent );
            const startPosition :number = this.camera.getZ();

            // update cars
            this.updateCars( dt, this.player );

            // update camera ( this currently affects the player!! )
            this.camera.update( dt, this.player.getSpeed(), this.stageLength );

            // update player segment ( for smooth collisions ... :( )
            this.player.setPlayerSegment(
                Stage.findSegment( this.segments, this.camera.getZ() + this.player.getZ() )
            );

            // update player
            this.player.update
            (
                dx,
                dt,
                this.stageLength,
                this.camera
            );

            // update backgrounds
            this.background.updateOffsets( this.player.getPlayerSegment(), this.camera, startPosition );
        }

        /** ************************************************************************************************************
        *   Renders the current tick of the legacy game.
        *
        *   @param ctx        The 2D drawing context.
        *   @param resolution The scaling factor for all images to draw.
        ***************************************************************************************************************/
        // tslint:disable:max-line-length
        public draw( ctx:CanvasRenderingContext2D, resolution:number ) : void
        {
            // update player segment again
            this.player.setPlayerSegment(
                Stage.findSegment( this.segments, this.camera.getZ() + this.player.getZ() )
            );

            const baseSegment   :outrun.Segment = Stage.findSegment( this.segments, this.camera.getZ() );
            const basePercent   :number         = outrun.MathUtil.percentRemaining(this.camera.getZ(), outrun.SettingGame.SEGMENT_LENGTH);
            const playerPercent :number         = outrun.MathUtil.percentRemaining(this.camera.getZ() + this.player.getZ(), outrun.SettingGame.SEGMENT_LENGTH);
            const playerY       :number = outrun.MathUtil.interpolate
            (
                this.player.getPlayerSegment().getP1().getWorld().y,
                this.player.getPlayerSegment().getP2().getWorld().y,
                playerPercent
            );

            let   maxY          :number = outrun.Main.game.engine.canvasSystem.getHeight();
            let   x             :number = 0;
            let   dx            :number = -(baseSegment.curve * basePercent);

            // clear/fill canvas with sky color
            outrun.Drawing2D.rect( ctx, 0, 0, outrun.Main.game.engine.canvasSystem.getWidth(), outrun.Main.game.engine.canvasSystem.getHeight(), this.skyColor );

            // draw the bg
            this.background.draw( ctx, resolution, playerY );

            // browse all segments from far to near
            for ( let n:number = 0; n < outrun.SettingEngine.DRAW_DISTANCE; n++ )
            {
                const segment:outrun.Segment = this.segments[(baseSegment.getIndex() + n) % this.segments.length];

                // assign new segment properties
                segment.looped = segment.getIndex() < baseSegment.getIndex();
                segment.fog    = outrun.MathUtil.exponentialFog( n / outrun.SettingEngine.DRAW_DISTANCE, outrun.SettingGame.FOG_DENSITY );
                segment.clip   = maxY;

                // calculate road segment projections
                segment.getP1().updateProjectionPoints( ( this.player.getX() * outrun.SettingGame.HALF_ROAD_WIDTH ) - x,      playerY + outrun.SettingEngine.CAMERA_HEIGHT, this.camera.getZ() - ( segment.looped ? this.stageLength : 0 ), this.camera.getDepth(), outrun.SettingGame.HALF_ROAD_WIDTH );
                segment.getP2().updateProjectionPoints( ( this.player.getX() * outrun.SettingGame.HALF_ROAD_WIDTH ) - x - dx, playerY + outrun.SettingEngine.CAMERA_HEIGHT, this.camera.getZ() - ( segment.looped ? this.stageLength : 0 ), this.camera.getDepth(), outrun.SettingGame.HALF_ROAD_WIDTH );

                x = x + dx;
                dx = dx + segment.curve;

                if (
                    (segment.getP1().getCamera().z <= this.camera.getDepth() ) || // behind us
                    (segment.getP2().getScreen().y >= segment.getP1().getScreen().y)     || // back face cull
                    (segment.getP2().getScreen().y >= maxY)                       // clip by (already rendered) hill
                ) {
                    continue;
                }

                // draw segment road
                segment.draw( ctx, this.fogColor );

                // assign maxY ?
                maxY = segment.getP1().getScreen().y;
            }

            // draw all segments from far to near
            for ( let n:number = ( outrun.SettingEngine.DRAW_DISTANCE - 1 ); n > 0; n-- )
            {
                const segment:outrun.Segment = this.segments[ ( baseSegment.getIndex() + n ) % this.segments.length ];

                // draw cars
                for ( const car of segment.cars )
                {
                    car.draw( ctx, resolution, segment );
                }

                // draw all sprites of this segment
                for ( const obstacle of segment.getObstacles() )
                {
                    obstacle.draw
                    (
                        ctx,
                        resolution,
                        segment.getP1(),
                        segment.getClip()
                    );
                }

                // draw player
                if ( segment === this.player.getPlayerSegment() ) {

                    this.player.draw( ctx, resolution, this.player.getPlayerSegment(), this.camera, playerPercent );
                }
            }
        }

        /** ************************************************************************************************************
        *   Creates the road of this stage.
        *
        *   @param playerZ The initial z position of the player.
        *
        *   @return All segments the road consists of.
        ***************************************************************************************************************/
        protected abstract createRoad( playerZ:number ) : outrun.Segment[];

        /** ************************************************************************************************************
        *   Creates all decoration sprites for this stage.
        *
        *   @param segmentCount The number of segments this level consists of.
        ***************************************************************************************************************/
        protected abstract createSprites( segmentCount:number ) : void;

        /** ************************************************************************************************************
        *   Adds a sprite to the segment with the specified index.
        ***************************************************************************************************************/
        protected addSprite( index:number, source:string, offset:number ) : void
        {
            if ( this.segments.length > index )
            {
                this.segments[ index ].addSprite( new outrun.Obstacle( source, offset )  );
            }
        }

        /** ************************************************************************************************************
        *   Updates the cars in the game world.
        *
        *   @param dt     The delta time to update the game.
        *   @param player The player.
        ***************************************************************************************************************/
        private updateCars( dt:number, player:outrun.Player ) : void
        {
            for ( const car of this.cars )
            {
                car.update( dt, this.segments, this.player, this.stageLength );
            }
        }

        /** ************************************************************************************************************
        *   Resets all cars on the road to their initial state.
        ***************************************************************************************************************/
        private createCars() : void
        {
            this.cars = [];

            for ( let i:number = 0; i < this.carCount; i++ )
            {
                const offset  :number = Math.random() * outrun.MathUtil.randomChoice( [ -0.8, 0.8 ] );
                const sprite  :string = outrun.MathUtil.randomChoice( outrun.ImageFile.CARS );
                const z       :number = Math.floor(
                    Math.random() * this.segments.length
                ) * outrun.SettingGame.SEGMENT_LENGTH;
                const speed   :number = (
                    ( outrun.SettingGame.PLAYER_MAX_SPEED / 4 )
                    + (
                        Math.random()
                        * outrun.SettingGame.PLAYER_MAX_SPEED
                        / ( sprite === outrun.ImageFile.TRUCK2 ? 4 : 2 )
                    )
                );
                const car     :outrun.Car     = new outrun.Car( offset, z, sprite, speed );
                const segment :outrun.Segment = Stage.findSegment( this.segments, car.getZ() );

                // add to segment and to global cars collection
                segment.cars.push( car );
                this.cars.push(    car );
            }
        }

        /** ************************************************************************************************************
        *   Finds the segment that contains the current Z position.
        ***************************************************************************************************************/
        public static findSegment( segments:outrun.Segment[], z:number ) : outrun.Segment
        {
            return segments[ Math.floor( z / outrun.SettingGame.SEGMENT_LENGTH ) % segments.length ];
        }
    }
