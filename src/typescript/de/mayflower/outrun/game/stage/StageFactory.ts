
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Creates stage segments.
    *******************************************************************************************************************/
    export abstract class StageFactory
    {
        /** ************************************************************************************************************
        *   TODO create class for road attributes?!
        ***************************************************************************************************************/
        public static readonly ROAD :any =
        {
            LENGTH: { NONE: 0, SHORT: 25, MEDIUM: 50, LONG: 100, DOUBLE_LONG: 200 },
            HILL:   { NONE: 0, LOW:   20, MEDIUM: 40, HIGH: 60  },
            CURVE:  { NONE: 0, EASY:  2,  MEDIUM: 4,  HARD: 6   }
        };

        /** ************************************************************************************************************
        *
        *   @param num The road length?
        *
        *   TODO to stage factory.
        ***************************************************************************************************************/
        public static addStraight( segments:any[], num:number ) : void
        {
            StageFactory.addRoad( segments, num, num, num, 0, 0 );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addHill( segments:any[], num:number, height:number ) : void
        {
            num = num || outrun.StageFactory.ROAD.LENGTH.MEDIUM;
            height = height || outrun.StageFactory.ROAD.HILL.MEDIUM;

            StageFactory.addRoad( segments, num, num, num, 0, height );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addCurve( segments:any[], num:number, curve:number, height:number ) : void
        {
            num = num || outrun.StageFactory.ROAD.LENGTH.MEDIUM;
            curve = curve || outrun.StageFactory.ROAD.CURVE.MEDIUM;
            height = height || outrun.StageFactory.ROAD.HILL.NONE;

            StageFactory.addRoad( segments, num, num, num, curve, height );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addLowRollingHills( segments:any[], num:number, height:number ) : void
        {
            StageFactory.addRoad( segments, num, num, num, 0, height / 2 );
            StageFactory.addRoad( segments, num, num, num, 0, -height );
            StageFactory.addRoad( segments, num, num, num, outrun.StageFactory.ROAD.CURVE.EASY, height );
            StageFactory.addRoad( segments, num, num, num, 0, 0 );
            StageFactory.addRoad( segments, num, num, num, -outrun.StageFactory.ROAD.CURVE.EASY, height / 2 );
            StageFactory.addRoad( segments, num, num, num, 0, 0 );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        // tslint:disable:max-line-length
        public static addSCurves( segments:any[] ) : void
        {
            StageFactory.addRoad( segments, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, -outrun.StageFactory.ROAD.CURVE.EASY,   outrun.StageFactory.ROAD.HILL.NONE    );
            StageFactory.addRoad( segments, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.CURVE.MEDIUM,  outrun.StageFactory.ROAD.HILL.MEDIUM  );
            StageFactory.addRoad( segments, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.CURVE.EASY,    -outrun.StageFactory.ROAD.HILL.LOW    );
            StageFactory.addRoad( segments, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, -outrun.StageFactory.ROAD.CURVE.EASY,   outrun.StageFactory.ROAD.HILL.MEDIUM  );
            StageFactory.addRoad( segments, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, outrun.StageFactory.ROAD.LENGTH.MEDIUM, -outrun.StageFactory.ROAD.CURVE.MEDIUM, -outrun.StageFactory.ROAD.HILL.MEDIUM );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addBumps( segments:any[] ) : void
        {
            StageFactory.addRoad( segments, 10, 10, 10, 0, 5  );
            StageFactory.addRoad( segments, 10, 10, 10, 0, -2 );
            StageFactory.addRoad( segments, 10, 10, 10, 0, -5 );
            StageFactory.addRoad( segments, 10, 10, 10, 0, 8  );
            StageFactory.addRoad( segments, 10, 10, 10, 0, 5  );
            StageFactory.addRoad( segments, 10, 10, 10, 0, -7 );
            StageFactory.addRoad( segments, 10, 10, 10, 0, 5  );
            StageFactory.addRoad( segments, 10, 10, 10, 0, -2 );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addDownhillToEnd( segments:any[], num:number ) : void
        {
            StageFactory.addRoad( segments, num, num, num, -outrun.StageFactory.ROAD.CURVE.EASY, -StageFactory.lastY( segments ) / outrun.SettingGame.SEGMENT_LENGTH );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private static addRoad( segments:any[], enter:number, hold:number, leave:number, curve:number, y:number ) : void
        {
            const startY :number = StageFactory.lastY( segments );
            const endY   :number = startY + (outrun.MathUtil.toInt( y ) * outrun.SettingGame.SEGMENT_LENGTH);
            const total  :number = ( enter + hold + leave );

            for ( let n:number = 0; n < enter; n++ )
            {
                StageFactory.addSegment
                (
                    segments,
                    outrun.MathUtil.easeIn(0, curve, n / enter),
                    outrun.MathUtil.easeInOut(startY, endY, n / total)
                );
            }

            for ( let n:number = 0; n < hold; n++ )
            {
                StageFactory.addSegment
                (
                    segments,
                    curve,
                    outrun.MathUtil.easeInOut(startY, endY, (enter + n) / total)
                );
            }

            for ( let n:number = 0; n < leave; n++ )
            {
                StageFactory.addSegment
                (
                    segments,
                    outrun.MathUtil.easeInOut(curve, 0, n / leave),
                    outrun.MathUtil.easeInOut(startY, endY, (enter + hold + n) / total)
                );
            }
        }

        /** ************************************************************************************************************
        *   Adds a road segment.
        *
        *   @param curve Specifies if this segment is a curve?
        *   @param y     The Y location of this segment.
        *
        *   TODO to factory!
        *   TODO Add class curve
        ***************************************************************************************************************/
        private static addSegment( segments:any[], curve:any, y:number ) : void
        {
            const n:number = segments.length;
            const lastY:number = StageFactory.lastY( segments );

            // TODO introcude class Segment
            segments.push
            (
                {
                    index: n,
                    p1: {world: {y: lastY, z: n * outrun.SettingGame.SEGMENT_LENGTH}, camera: {}, screen: {}},
                    p2: {world: {y: y, z: (n + 1) * outrun.SettingGame.SEGMENT_LENGTH}, camera: {}, screen: {}},
                    curve: curve,

                    // TODO create class Sprite

                    sprites: [],
                    cars: [],
                    color: (
                        Math.floor( n / outrun.SettingGame.RUMBLE_LENGTH ) % 2
                        ? outrun.SettingColor.DARK
                        : outrun.SettingColor.LIGHT
                    )
                }
            );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private static lastY( segments:any[] ) : number
        {
            return ( segments.length === 0 ) ? 0 : segments[ segments.length - 1 ].p2.world.y;
        }
    }
