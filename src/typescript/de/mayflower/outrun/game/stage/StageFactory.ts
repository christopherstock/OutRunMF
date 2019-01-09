
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Creates stage segments.
    *
    *   TODO to non-static! Add track color fields!
    *******************************************************************************************************************/
    export abstract class StageFactory
    {
        /** ************************************************************************************************************
        *   Adds a straight segment of road to the specified array.
        *
        *   @param segments The array of existent segments where this segment is appended.
        *   @param num      The desired segment length.
        ***************************************************************************************************************/
        public static addStraight( segments:outrun.Segment[], num:number ) : void
        {
            StageFactory.addRoad( segments, num, num, num, 0, 0 );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addHill( segments:outrun.Segment[], num:number, height:number ) : void
        {
            StageFactory.addRoad( segments, num, num, num, 0, height );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addCurve( segments:outrun.Segment[], num:number, curve:number, height:number ) : void
        {
            StageFactory.addRoad( segments, num, num, num, curve, height );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addLowRollingHills( segments:outrun.Segment[], num:number, height:number ) : void
        {
            StageFactory.addRoad( segments, num, num, num, 0, height / 2 );
            StageFactory.addRoad( segments, num, num, num, 0, -height );
            StageFactory.addRoad( segments, num, num, num, outrun.Road.CURVE.EASY, height );
            StageFactory.addRoad( segments, num, num, num, 0, 0 );
            StageFactory.addRoad( segments, num, num, num, -outrun.Road.CURVE.EASY, height / 2 );
            StageFactory.addRoad( segments, num, num, num, 0, 0 );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        // tslint:disable:max-line-length
        public static addSCurves( segments:outrun.Segment[] ) : void
        {
            StageFactory.addRoad( segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, -outrun.Road.CURVE.EASY,   outrun.Road.HILL.NONE    );
            StageFactory.addRoad( segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.MEDIUM,  outrun.Road.HILL.MEDIUM  );
            StageFactory.addRoad( segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.EASY,    -outrun.Road.HILL.LOW    );
            StageFactory.addRoad( segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, -outrun.Road.CURVE.EASY,   outrun.Road.HILL.MEDIUM  );
            StageFactory.addRoad( segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, -outrun.Road.CURVE.MEDIUM, -outrun.Road.HILL.MEDIUM );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addBumps( segments:outrun.Segment[] ) : void
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
        public static addDownhillToEnd( segments:outrun.Segment[], num:number ) : void
        {
            StageFactory.addRoad( segments, num, num, num, -outrun.Road.CURVE.EASY, -StageFactory.lastY( segments ) / outrun.SettingGame.SEGMENT_LENGTH );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private static addRoad
        (
            segments   :outrun.Segment[],
            enter      :number,
            hold       :number,
            leave      :number,
            curve      :number,
            y          :number
        )
        : void
        {
            const startY :number = StageFactory.lastY( segments );
            const endY   :number = startY + (outrun.MathUtil.toInt( y ) * outrun.SettingGame.SEGMENT_LENGTH);
            const total  :number = ( enter + hold + leave );

            for ( let n:number = 0; n < enter; n++ )
            {
                StageFactory.addSegment
                (
                    segments,
                    outrun.MathUtil.easeIn( 0, curve, n / enter ),
                    outrun.MathUtil.easeInOut( startY, endY, n / total )
                );
            }

            for ( let n:number = 0; n < hold; n++ )
            {
                StageFactory.addSegment
                (
                    segments,
                    curve,
                    outrun.MathUtil.easeInOut( startY, endY, ( enter + n ) / total )
                );
            }

            for ( let n:number = 0; n < leave; n++ )
            {
                StageFactory.addSegment
                (
                    segments,
                    outrun.MathUtil.easeInOut( curve, 0, n / leave ),
                    outrun.MathUtil.easeInOut( startY, endY, ( enter + hold + n ) / total )
                );
            }
        }

        /** ************************************************************************************************************
        *   Adds a road segment.
        *
        *   @param segments The array of existent segments where this segment is appended.
        *   @param curve    Specifies if this segment is a curve?
        *   @param y        The Y location of this segment.
        ***************************************************************************************************************/
        private static addSegment
        (
            segments   :outrun.Segment[],
            curve      :number,
            y          :number
        )
        : void
        {
            const n:number = segments.length;
            const lastY:number = StageFactory.lastY( segments );

            // TODO introcude class Segment
            segments.push
            (
                // TODO create Segment constructor
                {
                    index: n,
                    p1: new outrun.SegmentPoint(
                        new outrun.Vector( lastY, n * outrun.SettingGame.SEGMENT_LENGTH )
                    ),
                    p2: new outrun.SegmentPoint(
                        new outrun.Vector( y, ( n + 1 ) * outrun.SettingGame.SEGMENT_LENGTH )
                    ),
                    curve: curve,
                    sprites: [],
                    cars: [],
                    color: (
                        Math.floor( n / outrun.SettingGame.RUMBLE_LENGTH ) % 2
                        ? outrun.Main.game.outRun.stage.trackColorDark
                        : outrun.Main.game.outRun.stage.trackColorLight
                    ),
                    looped: false,
                    fog: 0,
                    clip: 0
                }
            );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private static lastY( segments:outrun.Segment[] ) : number
        {
            return ( segments.length === 0 ? 0 : segments[ segments.length - 1 ].p2.world.y );
        }
    }
