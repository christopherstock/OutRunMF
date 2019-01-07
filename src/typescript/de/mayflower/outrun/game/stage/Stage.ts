
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   The legacy game stage.
    *******************************************************************************************************************/
    export abstract class Stage
    {
        // TODO add private!

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
        *
        *   @param playerZ The initial z position of the player.
        ***************************************************************************************************************/
        public init( playerZ:number ) : void
        {
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
