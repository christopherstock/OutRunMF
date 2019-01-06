
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   The legacy game stage.
    *******************************************************************************************************************/
    export class Stage
    {
        /** array of road segments */
        public                  segments            :any[]                      = [];
        /** array of cars on the road */
        public                  cars                :any[]                      = [];
        /** z length of entire track (computed) */
        public                  trackLength         :number                     = 0;

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

            // save full stage length
            this.trackLength = this.segments.length * outrun.SettingGame.SEGMENT_LENGTH;
        }

        /** ************************************************************************************************************
        *   Creates the road of this stage.
        *
        *   @param playerZ The initial z position of the player.
        ***************************************************************************************************************/
        // tslint:disable:max-line-length
        protected createRoad( playerZ:number ) : void
        {
            this.addStraight(outrun.StageFactory.ROAD.LENGTH.SHORT);
            this.addLowRollingHills(0, 0);
            this.addSCurves();
            this.addCurve(outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.CURVE.MEDIUM, outrun.StageFactory.ROAD.HILL.LOW);
            this.addBumps();
            this.addLowRollingHills(0, 0);
            this.addCurve(outrun.StageFactory.ROAD.LENGTH.LONG * 2, outrun.StageFactory.ROAD.CURVE.MEDIUM, outrun.StageFactory.ROAD.HILL.MEDIUM);
            this.addStraight(0);
            this.addHill(outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.HILL.HIGH);
            this.addSCurves();
            this.addCurve(outrun.StageFactory.ROAD.LENGTH.LONG, -outrun.StageFactory.ROAD.CURVE.MEDIUM, outrun.StageFactory.ROAD.HILL.NONE);
            this.addHill(outrun.StageFactory.ROAD.LENGTH.LONG, outrun.StageFactory.ROAD.HILL.HIGH);
            this.addCurve(outrun.StageFactory.ROAD.LENGTH.LONG, outrun.StageFactory.ROAD.CURVE.MEDIUM, -outrun.StageFactory.ROAD.HILL.LOW);
            this.addBumps();
            this.addHill(outrun.StageFactory.ROAD.LENGTH.LONG, -outrun.StageFactory.ROAD.HILL.MEDIUM);
            this.addStraight(0);
            this.addSCurves();
            this.addDownhillToEnd(0);
        }

        protected setStartAndFinish( playerZ:number ) : void
        {
            // set start and finish
            this.segments[this.findSegment(playerZ).index + 2].color = outrun.SettingColor.START;
            this.segments[this.findSegment(playerZ).index + 3].color = outrun.SettingColor.START;
            for (let n:number = 0; n < outrun.SettingGame.RUMBLE_LENGTH; n++ )
            {
                this.segments[ this.segments.length - 1 - n ].color = outrun.SettingColor.FINISH;
            }
        }

        /** ************************************************************************************************************
        *   Finds the segment with the specified index.
        *
        *   TODO create class 'segment' !
        ***************************************************************************************************************/
        public findSegment( z:number ) : any
        {
            return this.segments[Math.floor(z / outrun.SettingGame.SEGMENT_LENGTH) % this.segments.length];
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private addSprite( n:number, source:string, offset:number ) : void
        {
            this.segments[n].sprites.push({source: source, offset: offset});
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private addRoad( enter:number, hold:number, leave:number, curve:number, y:number ) : void
        {
            const startY :number = this.lastY();
            const endY   :number = startY + (outrun.MathUtil.toInt( y ) * outrun.SettingGame.SEGMENT_LENGTH);
            const total  :number = ( enter + hold + leave );

            for ( let n:number = 0; n < enter; n++ )
            {
                this.addSegment
                (
                    outrun.MathUtil.easeIn(0, curve, n / enter),
                    outrun.MathUtil.easeInOut(startY, endY, n / total)
                );
            }

            for ( let n:number = 0; n < hold; n++ )
            {
                this.addSegment
                (
                    curve,
                    outrun.MathUtil.easeInOut(startY, endY, (enter + n) / total)
                );
            }

            for ( let n:number = 0; n < leave; n++ )
            {
                this.addSegment
                (
                    outrun.MathUtil.easeInOut(curve, 0, n / leave),
                    outrun.MathUtil.easeInOut(startY, endY, (enter + hold + n) / total)
                );
            }
        }

        /** ************************************************************************************************************
        *
        *   @param num The road length?
        *
        *   TODO to stage factory.
        ***************************************************************************************************************/
        private addStraight( num:number ) : void
        {
            num = num || outrun.StageFactory.ROAD.LENGTH.MEDIUM;
            this.addRoad(num, num, num, 0, 0);
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private addHill( num:number, height:number ) : void
        {
            num = num || outrun.StageFactory.ROAD.LENGTH.MEDIUM;
            height = height || outrun.StageFactory.ROAD.HILL.MEDIUM;
            this.addRoad(num, num, num, 0, height);
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private addCurve( num:number, curve:number, height:number ) : void
        {
            num = num || outrun.StageFactory.ROAD.LENGTH.MEDIUM;
            curve = curve || outrun.StageFactory.ROAD.CURVE.MEDIUM;
            height = height || outrun.StageFactory.ROAD.HILL.NONE;
            this.addRoad(num, num, num, curve, height);
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private addLowRollingHills( num:number, height:number ) : void
        {
            num = num || outrun.StageFactory.ROAD.LENGTH.SHORT;
            height = height || outrun.StageFactory.ROAD.HILL.LOW;
            this.addRoad(num, num, num, 0, height / 2);
            this.addRoad(num, num, num, 0, -height);
            this.addRoad(num, num, num, outrun.StageFactory.ROAD.CURVE.EASY, height);
            this.addRoad(num, num, num, 0, 0);
            this.addRoad(num, num, num, -outrun.StageFactory.ROAD.CURVE.EASY, height / 2);
            this.addRoad(num, num, num, 0, 0);
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        // tslint:disable:max-line-length
        private addSCurves() : void
        {
            this.addRoad( outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, -outrun.StageFactory.ROAD.CURVE.EASY,   outrun.StageFactory.ROAD.HILL.NONE    );
            this.addRoad( outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.CURVE.MEDIUM,  outrun.StageFactory.ROAD.HILL.MEDIUM  );
            this.addRoad( outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.CURVE.EASY,    -outrun.StageFactory.ROAD.HILL.LOW    );
            this.addRoad( outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, -outrun.StageFactory.ROAD.CURVE.EASY,   outrun.StageFactory.ROAD.HILL.MEDIUM  );
            this.addRoad( outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, -outrun.StageFactory.ROAD.CURVE.MEDIUM, -outrun.StageFactory.ROAD.HILL.MEDIUM );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private addBumps() : void
        {
            this.addRoad(10, 10, 10, 0, 5);
            this.addRoad(10, 10, 10, 0, -2);
            this.addRoad(10, 10, 10, 0, -5);
            this.addRoad(10, 10, 10, 0, 8);
            this.addRoad(10, 10, 10, 0, 5);
            this.addRoad(10, 10, 10, 0, -7);
            this.addRoad(10, 10, 10, 0, 5);
            this.addRoad(10, 10, 10, 0, -2);
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private addDownhillToEnd( num:number ) : void
        {
            num = num || 200;
            this.addRoad(num, num, num, -outrun.StageFactory.ROAD.CURVE.EASY, -this.lastY() / outrun.SettingGame.SEGMENT_LENGTH);
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private resetSprites() : void
        {
            this.addSprite(20, outrun.ImageFile.BILLBOARD07, -1);
            this.addSprite(40, outrun.ImageFile.BILLBOARD06, -1);
            this.addSprite(60, outrun.ImageFile.BILLBOARD08, -1);
            this.addSprite(80, outrun.ImageFile.BILLBOARD09, -1);
            this.addSprite(100, outrun.ImageFile.BILLBOARD01, -1);
            this.addSprite(120, outrun.ImageFile.BILLBOARD02, -1);
            this.addSprite(140, outrun.ImageFile.BILLBOARD03, -1);
            this.addSprite(160, outrun.ImageFile.BILLBOARD04, -1);
            this.addSprite(180, outrun.ImageFile.BILLBOARD05, -1);

            this.addSprite(240, outrun.ImageFile.BILLBOARD07, -1.2);
            this.addSprite(240, outrun.ImageFile.BILLBOARD06, 1.2);
            this.addSprite(this.segments.length - 25, outrun.ImageFile.BILLBOARD07, -1.2);
            this.addSprite(this.segments.length - 25, outrun.ImageFile.BILLBOARD06, 1.2);

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

            for (let n:number = 0; n < outrun.SettingGame.TOTAL_CARS; n++ ) {
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

        /** ************************************************************************************************************
        *   Adds a road segment.
        *
        *   @param curve Specifies if this segment is a curve?
        *   @param y     The Y location of this segment.
        *
        *   TODO to factory!
        ***************************************************************************************************************/
        private addSegment( curve:any, y:number ) : void
        {
            const n:number = this.segments.length;
            this.segments.push({
                index: n,
                p1: {world: {y: this.lastY(), z: n * outrun.SettingGame.SEGMENT_LENGTH}, camera: {}, screen: {}},
                p2: {world: {y: y, z: (n + 1) * outrun.SettingGame.SEGMENT_LENGTH}, camera: {}, screen: {}},
                curve: curve,

                // TODO create class Sprite

                sprites: [],
                cars: [],
                color: Math.floor
                (
                    n / outrun.SettingGame.RUMBLE_LENGTH) % 2
                    ? outrun.SettingColor.DARK
                    : outrun.SettingColor.LIGHT
                }
            );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private lastY() : number
        {
            return (this.segments.length === 0) ? 0 : this.segments[this.segments.length - 1].p2.world.y;
        }
    }
