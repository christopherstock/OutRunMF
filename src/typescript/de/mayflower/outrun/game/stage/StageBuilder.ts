
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Creates stage segments.
    *
    *   TODO to non-static 'StageBuilder'! Add track color fields!
    *******************************************************************************************************************/
    export class StageBuilder
    {
        /** ************************************************************************************************************
        *   Adds a straight segment of road to the specified array.
        *
        *   @param segments The array of existent segments where this segment is appended.
        *   @param num      The desired segment length.
        ***************************************************************************************************************/
        public static addStraight( segments:outrun.Segment[], num:number ) : void
        {
            StageBuilder.addRoad( segments, num, num, num, 0, 0 );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addHill( segments:outrun.Segment[], num:number, height:number ) : void
        {
            StageBuilder.addRoad( segments, num, num, num, 0, height );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addCurve( segments:outrun.Segment[], num:number, curve:number, height:number ) : void
        {
            StageBuilder.addRoad( segments, num, num, num, curve, height );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addLowRollingHills( segments:outrun.Segment[], num:number, height:number ) : void
        {
            StageBuilder.addRoad( segments, num, num, num, 0, height / 2 );
            StageBuilder.addRoad( segments, num, num, num, 0, -height );
            StageBuilder.addRoad( segments, num, num, num, outrun.Road.CURVE.EASY, height );
            StageBuilder.addRoad( segments, num, num, num, 0, 0 );
            StageBuilder.addRoad( segments, num, num, num, -outrun.Road.CURVE.EASY, height / 2 );
            StageBuilder.addRoad( segments, num, num, num, 0, 0 );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        // tslint:disable:max-line-length
        public static addSCurves( segments:outrun.Segment[] ) : void
        {
            StageBuilder.addRoad( segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, -outrun.Road.CURVE.EASY,   outrun.Road.HILL.NONE    );
            StageBuilder.addRoad( segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.MEDIUM,  outrun.Road.HILL.MEDIUM  );
            StageBuilder.addRoad( segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.EASY,    -outrun.Road.HILL.LOW    );
            StageBuilder.addRoad( segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, -outrun.Road.CURVE.EASY,   outrun.Road.HILL.MEDIUM  );
            StageBuilder.addRoad( segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, -outrun.Road.CURVE.MEDIUM, -outrun.Road.HILL.MEDIUM );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addBumps( segments:outrun.Segment[] ) : void
        {
            StageBuilder.addRoad( segments, 10, 10, 10, 0, 5  );
            StageBuilder.addRoad( segments, 10, 10, 10, 0, -2 );
            StageBuilder.addRoad( segments, 10, 10, 10, 0, -5 );
            StageBuilder.addRoad( segments, 10, 10, 10, 0, 8  );
            StageBuilder.addRoad( segments, 10, 10, 10, 0, 5  );
            StageBuilder.addRoad( segments, 10, 10, 10, 0, -7 );
            StageBuilder.addRoad( segments, 10, 10, 10, 0, 5  );
            StageBuilder.addRoad( segments, 10, 10, 10, 0, -2 );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public static addDownhillToEnd( segments:outrun.Segment[], num:number ) : void
        {
            StageBuilder.addRoad( segments, num, num, num, -outrun.Road.CURVE.EASY, -StageBuilder.lastY( segments ) / outrun.SettingGame.SEGMENT_LENGTH );
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
            const startY :number = StageBuilder.lastY( segments );
            const endY   :number = startY + (outrun.MathUtil.toInt( y ) * outrun.SettingGame.SEGMENT_LENGTH);
            const total  :number = ( enter + hold + leave );

            for ( let n:number = 0; n < enter; n++ )
            {
                StageBuilder.addSegment
                (
                    segments,
                    outrun.MathUtil.easeIn( 0, curve, n / enter ),
                    outrun.MathUtil.easeInOut( startY, endY, n / total )
                );
            }

            for ( let n:number = 0; n < hold; n++ )
            {
                StageBuilder.addSegment
                (
                    segments,
                    curve,
                    outrun.MathUtil.easeInOut( startY, endY, ( enter + n ) / total )
                );
            }

            for ( let n:number = 0; n < leave; n++ )
            {
                StageBuilder.addSegment
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
            const lastY:number = StageBuilder.lastY( segments );

            segments.push
            (
                new outrun.Segment
                (
                    n,
                    new outrun.SegmentPoint(
                        new outrun.Vector( lastY, n * outrun.SettingGame.SEGMENT_LENGTH )
                    ),
                    new outrun.SegmentPoint(
                        new outrun.Vector( y, ( n + 1 ) * outrun.SettingGame.SEGMENT_LENGTH )
                    ),
                    curve,
                    [],
                    [],
                    (
                        Math.floor( n / outrun.SettingGame.RUMBLE_LENGTH ) % 2
                        ? outrun.Main.game.outRun.stage.trackColorDark
                        : outrun.Main.game.outRun.stage.trackColorLight
                    ),
                    false,
                    0,
                    0,
                    outrun.Main.game.outRun.stage.fogColor
                )
            );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private static lastY( segments:outrun.Segment[] ) : number
        {
            return ( segments.length === 0 ? 0 : segments[ segments.length - 1 ].getP2().getWorld().y );
        }
    }
