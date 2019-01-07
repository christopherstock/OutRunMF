
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   The legacy game stage.
    *******************************************************************************************************************/
    export abstract class Stage
    {
        /** array of road segments */
        public                  segments            :outrun.Segment[]           = [];
        /** array of cars on the road */
        public                  cars                :any[]                      = [];
        /** z length of entire track (computed) */
        public                  stageLength         :number                     = 0;

        /** ************************************************************************************************************
        *   Creates a new stage.
        ***************************************************************************************************************/
        protected constructor()
        {
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
            this.resetSprites();
            this.resetCars();

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
        *   Sets the start and the finish line.
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
        private addSprite( n:number, source:string, offset:number ) : void
        {
            if ( this.segments.length > n )
            {
                this.segments[ n ].sprites.push({source: source, offset: offset});
            }
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private resetSprites() : void
        {
            this.addSprite( 20,  outrun.ImageFile.BILLBOARD07, -1 );
            this.addSprite( 40,  outrun.ImageFile.BILLBOARD06, -1 );
            this.addSprite( 60,  outrun.ImageFile.BILLBOARD08, -1 );
            this.addSprite( 80,  outrun.ImageFile.BILLBOARD09, -1 );
            this.addSprite( 100, outrun.ImageFile.BILLBOARD01, -1 );
            this.addSprite( 120, outrun.ImageFile.BILLBOARD02, -1 );
            this.addSprite( 140, outrun.ImageFile.BILLBOARD03, -1 );
            this.addSprite( 160, outrun.ImageFile.BILLBOARD04, -1 );
            this.addSprite( 180, outrun.ImageFile.BILLBOARD05, -1 );

            this.addSprite( 240, outrun.ImageFile.BILLBOARD07, -1.2 );
            this.addSprite( 240, outrun.ImageFile.BILLBOARD06, 1.2 );
            this.addSprite( this.segments.length - 25, outrun.ImageFile.BILLBOARD07, -1.2 );
            this.addSprite( this.segments.length - 25, outrun.ImageFile.BILLBOARD06, 1.2  );

            for ( let n:number = 10; n < 200; n += 4 + Math.floor(n / 100) ) {
                this.addSprite(n, outrun.ImageFile.PALM_TREE, 0.5 + Math.random() * 0.5);
                this.addSprite(n, outrun.ImageFile.PALM_TREE, 1 + Math.random() * 2);
            }

            for ( let n:number = 250; n < 1000; n += 5 ) {
                this.addSprite(n, outrun.ImageFile.COLUMN, 1.1);
                this.addSprite(n + outrun.MathUtil.randomInt(0, 5), outrun.ImageFile.TREE1, -1 - (Math.random() * 2));
                this.addSprite(n + outrun.MathUtil.randomInt(0, 5), outrun.ImageFile.TREE2, -1 - (Math.random() * 2));
            }

            for ( let n:number = 200; n < this.segments.length; n += 3 ) {
                this.addSprite(n, outrun.MathUtil.randomChoice(outrun.ImageFile.PLANTS), outrun.MathUtil.randomChoice([1, -1]) * (2 + Math.random() * 5));
            }

            let side   :number = 0;
            let sprite :any    = null;
            let offset :number = 0;

            for ( let n:number = 1000; n < (this.segments.length - 50); n += 100 ) {
                side = outrun.MathUtil.randomChoice([1, -1]);
                this.addSprite(n + outrun.MathUtil.randomInt(0, 50), outrun.MathUtil.randomChoice(outrun.ImageFile.BILLBOARDS), -side);
                for ( let i:number = 0; i < 20; i++ ) {
                    sprite = outrun.MathUtil.randomChoice(outrun.ImageFile.PLANTS);
                    offset = side * (1.5 + Math.random());
                    this.addSprite(n + outrun.MathUtil.randomInt(0, 50), sprite, offset);
                }
            }
        }

        /** ************************************************************************************************************
        *   Resets all cars on the road to their initial state.
        ***************************************************************************************************************/
        private resetCars() : void
        {
            this.cars = [];

            let segment :any = null;
            let sprite  :any = null;
            let car     :any = null;

            for ( let n:number = 0; n < outrun.SettingGame.TOTAL_CARS; n++ )
            {
                const offset :number = Math.random() * outrun.MathUtil.randomChoice([-0.8, 0.8]);
                const z      :number = Math.floor(Math.random() * this.segments.length) * outrun.SettingGame.SEGMENT_LENGTH;
                sprite = outrun.MathUtil.randomChoice(outrun.ImageFile.CARS);
                const speed  :number = outrun.SettingGame.MAX_SPEED / 4 + Math.random() * outrun.SettingGame.MAX_SPEED / (sprite === outrun.ImageFile.TRUCK2 ? 4 : 2);
                car = {offset: offset, z: z, sprite: sprite, speed: speed};
                segment = this.findSegment(car.z);
                segment.cars.push(car);
                this.cars.push(car);
            }
        }
    }
