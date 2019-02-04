
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   The legacy game stage.
    *******************************************************************************************************************/
    export abstract class Stage
    {
        /** array of road segments */
        private                     segments            :outrun.Segment[]           = [];
        /** computed z length of the entire track */
        private                     stageLength         :number                     = 0;

        /** The player. */
        private         readonly    player              :outrun.Player              = null;

        /** The number of cars to create in this stage. */
        private         readonly    carCount            :number                     = 0;
        /** array of cars on the road */
        private                     cars                :outrun.Car[]               = [];

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
        *   @param skyColor     The color of the sky.
        *   @param fogColor     The color of the fog.
        ***************************************************************************************************************/
        protected constructor
        (
            carCount   :number,
            background :outrun.Background,
            skyColor   :string,
            fogColor   :string
        )
        {
            // assign car count
            this.carCount = carCount;

            // create the player
            this.player = new outrun.Player();

            // create the background
            this.background = background;

            // assign track colors
            this.skyColor     = skyColor;
            this.fogColor     = fogColor;
        }

        /** ************************************************************************************************************
        *   Initializes all properties of this stage.
        ***************************************************************************************************************/
        public init() : void
        {
            const playerZ:number = this.player.getOffsetZ();

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
        *   @param dt        The delta time to update the game.
        *   @param keySystem The key system that handles pressed keys.
        ***************************************************************************************************************/
        public update( dt:number, keySystem:outrun.KeySystem ) : void
        {
            // at top speed, should be able to cross from left to right (-1 to 1) in 1 second
            const deltaX        :number = ( dt * 2 * this.player.getSpeedPercent() );
            const startPosition :number = this.player.getZ();

            // update player
            this.player.update( deltaX, dt, this.stageLength, this.segments, keySystem );

            // update cars
            this.updateCars( dt );

            // update background
            this.background.updateOffsets( this.player.getPlayerSegment(), this.player, startPosition );
        }

        /** ************************************************************************************************************
        *   Draws one tick of the stage.
        *
        *   @param canvasSystem The canvas system.
        ***************************************************************************************************************/
        public draw( canvasSystem:outrun.CanvasSystem ) : void
        {
            const ctx:CanvasRenderingContext2D = canvasSystem.getRenderingContext();

            const baseSegment   :outrun.Segment = Stage.findSegment( this.segments, this.player.getZ() );
            const basePercent   :number         = outrun.MathUtil.percentRemaining(
                this.player.getZ(),
                outrun.SettingGame.SEGMENT_LENGTH
            );
            const playerPercent :number         = outrun.MathUtil.percentRemaining(
                this.player.getZ() + this.player.getOffsetZ(),
                outrun.SettingGame.SEGMENT_LENGTH
            );
            const playerY       :number         = outrun.MathUtil.interpolate
            (
                this.player.getPlayerSegment().getP1().getWorld().y,
                this.player.getPlayerSegment().getP2().getWorld().y,
                playerPercent
            );

            let   maxY          :number         = canvasSystem.getHeight();
            let   x             :number         = 0;
            let   dx            :number         = -(baseSegment.getCurve() * basePercent);

            // fill canvas with sky color
            outrun.Drawing2D.drawRect(
                ctx,
                0,
                0,
                canvasSystem.getWidth(),
                canvasSystem.getHeight(),
                this.skyColor
            );

            // draw bg
            this.background.draw( canvasSystem, playerY );

            // draw road
            for ( let n:number = 0; n < outrun.SettingEngine.DRAW_DISTANCE; n++ )
            {
                const segment:outrun.Segment = this.segments[(baseSegment.getIndex() + n) % this.segments.length];

                // assign new segment properties
                segment.updateProperties(
                    segment.getIndex() < baseSegment.getIndex(),
                    outrun.MathUtil.exponentialFog
                    (
                        n / outrun.SettingEngine.DRAW_DISTANCE,
                        outrun.SettingGame.FOG_DENSITY
                    ),
                    maxY
                );

                // calculate road segment projections
                segment.getP1().updateProjectionPoints(
                    canvasSystem,
                    ( this.player.getX() * outrun.SettingGame.HALF_ROAD_WIDTH ) - x,
                    playerY + outrun.SettingEngine.CAMERA_HEIGHT,
                    this.player.getZ() - ( segment.isLooped() ? this.stageLength : 0 ),
                    this.player.getCameraDepth(),
                    outrun.SettingGame.HALF_ROAD_WIDTH
                );
                segment.getP2().updateProjectionPoints(
                    canvasSystem,
                    ( this.player.getX() * outrun.SettingGame.HALF_ROAD_WIDTH ) - x - dx,
                    playerY + outrun.SettingEngine.CAMERA_HEIGHT,
                    this.player.getZ() - ( segment.isLooped() ? this.stageLength : 0 ),
                    this.player.getCameraDepth(),
                    outrun.SettingGame.HALF_ROAD_WIDTH
                );

                x  = x + dx;
                dx = dx + segment.getCurve();

                if (
                    // behind us
                    (segment.getP1().getPlayer().z <= this.player.getCameraDepth() )
                    // back face cull
                    || (segment.getP2().getScreen().y >= segment.getP1().getScreen().y)
                    // clip by (already rendered) hill
                    || (segment.getP2().getScreen().y >= maxY)
                ) {
                    continue;
                }

                // draw segment road
                segment.draw( canvasSystem, this.fogColor );

                // assign maxY ?
                maxY = segment.getP1().getScreen().y;
            }

            // draw all cars, obstacles and player
            for ( let n:number = ( outrun.SettingEngine.DRAW_DISTANCE - 1 ); n > 0; n-- )
            {
                const segment:outrun.Segment = this.segments[ ( baseSegment.getIndex() + n ) % this.segments.length ];

                // draw cars
                for ( const car of segment.getCars() )
                {
                    car.draw( canvasSystem, segment );
                }

                // draw all obstacles of this segment
                for ( const obstacle of segment.getObstacles() )
                {
                    obstacle.draw
                    (
                        canvasSystem,
                        segment.getP1(),
                        segment.getClip()
                    );
                }

                // draw player
                if ( segment === this.player.getPlayerSegment() )
                {
                    this.player.draw( canvasSystem, playerPercent );
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
        protected addObstacle( index:number, sprite:string, offset:number ) : void
        {
            if ( this.segments.length > index )
            {
                this.segments[ index ].addObstacle
                (
                    new outrun.Obstacle( outrun.Main.game.engine.imageSystem.getImage( sprite ), offset )
                );
            }
        }

        /** ************************************************************************************************************
        *   Updates the cars in the game world.
        *
        *   @param dt The delta time to update the game.
        ***************************************************************************************************************/
        private updateCars( dt:number ) : void
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
            for ( let i:number = 0; i < this.carCount; i++ )
            {
                const offset  :number = Math.random() * outrun.MathUtil.getRandomElement( [ -0.8, 0.8 ] );
                const sprite  :string = outrun.MathUtil.getRandomElement( outrun.ImageFile.CARS );
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
                const car      :outrun.Car     = new outrun.Car
                (
                    offset,
                    z,
                    outrun.Main.game.engine.imageSystem.getImage( sprite ),
                    speed
                );
                const segment :outrun.Segment = Stage.findSegment( this.segments, car.getZ() );

                // add to segment and to global cars collection
                segment.getCars().push( car );
                this.cars.push( car );
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
