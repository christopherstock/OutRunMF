
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Creates all segments for one stage.
    *******************************************************************************************************************/
    export class StageBuilder
    {
        /** The collection of segments one stage consists of. */
        private                 readonly            segments                :outrun.Segment[]       = null;

        /** ************************************************************************************************************
        *   Creates a new stage builder.
        ***************************************************************************************************************/
        public constructor()
        {
            this.segments = [];
        }

        /** ************************************************************************************************************
        *   Returns all segments being created by this stage builder.
        ***************************************************************************************************************/
        public assemble() : outrun.Segment[]
        {
            return this.segments;
        }

        /** ************************************************************************************************************
        *   Adds straight road segments to the stage segments.
        *
        *   @param color The color for the straight segments.
        *   @param count The number of straight segments to add.
        ***************************************************************************************************************/
        public addStraight( color:outrun.SegmentColorSet, count:outrun.RoadLength ) : void
        {
            this.addRoad( count, count, count, outrun.RoadCurve.NONE, outrun.RoadHill.NONE, color );
        }

        /** ************************************************************************************************************
        *   Adds straight road segments with an ascend or descend to the stage segments.
        *
        *   @param color  The color for the straight segments.
        *   @param count  The number of straight segments to add.
        *   @param height The height delta of this hill.
        ***************************************************************************************************************/
        public addHill( color:outrun.SegmentColorSet, count:outrun.RoadLength, height:number ) : void
        {
            this.addRoad( count, count, count, outrun.RoadCurve.NONE, height, color );
        }

        /** ************************************************************************************************************
        *   Adds a curve to the stage segments.
        *
        *   @param color  The color for the straight segments.
        *   @param count  The number of straight segments to add.
        *   @param curve      The curve situation for this road.
        *   @param height The height delta of this hill.
        ***************************************************************************************************************/
        public addCurve
        (
            color  :outrun.SegmentColorSet,
            count  :outrun.RoadLength,
            curve  :outrun.RoadCurve,
            height :number
        )
        : void
        {
            this.addRoad( count, count, count, curve, height, color );
        }

        /** ************************************************************************************************************
        *   Creates some low rolling hills to the track.
        ***************************************************************************************************************/
        public addLowRollingHills
        (
            color  :outrun.SegmentColorSet,
            count  :outrun.RoadLength,
            curve  :outrun.RoadCurve,
            height :number
        )
        : void
        {
            this.addRoad( count, count, count, outrun.RoadCurve.NONE, height / 2,  color );
            this.addRoad( count, count, count, outrun.RoadCurve.NONE, -height,     color );
            this.addRoad( count, count, count, curve,                  height,      color );
            this.addRoad( count, count, count, outrun.RoadCurve.NONE, 0,           color );
            this.addRoad( count, count, count, -curve,                 -height / 2, color );
            this.addRoad( count, count, count, outrun.RoadCurve.NONE, 0,           color );
        }

        /** ************************************************************************************************************
        *   The LEGACY implementation of low rolling hills.
        ***************************************************************************************************************/
        public addLowRollingHillsLegacy( color:outrun.SegmentColorSet, count:outrun.RoadLength, height:number ) : void
        {
            this.addRoad( count, count, count, outrun.RoadCurve.NONE,  height / 2, color );
            this.addRoad( count, count, count, outrun.RoadCurve.NONE,  -height,    color );
            this.addRoad( count, count, count, outrun.RoadCurve.EASY,  height,     color );
            this.addRoad( count, count, count, outrun.RoadCurve.NONE,  0,          color );
            this.addRoad( count, count, count, -outrun.RoadCurve.EASY, height / 2, color );
            this.addRoad( count, count, count, outrun.RoadCurve.NONE,  0,          color );
        }

        /** ************************************************************************************************************
        *   Adds some S-curves to the track.
        *
        *   @param height The ascend/descend of the S curves.
        *   @param color  The color of the segments to add.
        ***************************************************************************************************************/
        // tslint:disable:max-line-length
        public addSCurves( height:number, color:outrun.SegmentColorSet ) : void
        {
            this.addRoad( outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, -outrun.RoadCurve.EASY,   outrun.RoadHill.NONE, color );
            this.addRoad( outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadCurve.MEDIUM,  height,                color );
            this.addRoad( outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadCurve.EASY,    -height / 2,           color );
            this.addRoad( outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, -outrun.RoadCurve.EASY,   height / 2,            color );
            this.addRoad( outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, -outrun.RoadCurve.MEDIUM, -height,               color );
        }

        /** ************************************************************************************************************
        *   Adds some S-curves to the track.
        *
        *   @param color The color of the segments to add.
        ***************************************************************************************************************/
        // tslint:disable:max-line-length
        public addSCurvesLegacy( color:outrun.SegmentColorSet ) : void
        {
            this.addRoad( outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, -outrun.RoadCurve.EASY,   outrun.RoadHill.NONE,    color );
            this.addRoad( outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadCurve.MEDIUM,  outrun.RoadHill.MEDIUM,  color );
            this.addRoad( outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadCurve.EASY,    -outrun.RoadHill.LOW,    color );
            this.addRoad( outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, -outrun.RoadCurve.EASY,   outrun.RoadHill.MEDIUM,  color );
            this.addRoad( outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, outrun.RoadLength.MEDIUM, -outrun.RoadCurve.MEDIUM, -outrun.RoadHill.MEDIUM, color );
        }

        /** ************************************************************************************************************
        *   Adds some bumps to the track.
        ***************************************************************************************************************/
        public addBumps( count:outrun.RoadLength, height:number, color:outrun.SegmentColorSet) : void
        {
            this.addRoad( count, count, count, 0, height,  color );
            this.addRoad( count, count, count, 0, -height, color );
            this.addRoad( count, count, count, 0, height,  color );
            this.addRoad( count, count, count, 0, -height, color );
            this.addRoad( count, count, count, 0, height,  color );
            this.addRoad( count, count, count, 0, -height, color );
            this.addRoad( count, count, count, 0, height,  color );
            this.addRoad( count, count, count, 0, -height, color );
        }

        /** ************************************************************************************************************
        *   The LEGACY implementation of adding bumps to the track.
        ***************************************************************************************************************/
        public addBumpsLegacy( color:outrun.SegmentColorSet) : void
        {
            this.addRoad( 10, 10, 10, 0, 5,  color );
            this.addRoad( 10, 10, 10, 0, -2, color );
            this.addRoad( 10, 10, 10, 0, -5, color );
            this.addRoad( 10, 10, 10, 0, 8,  color );
            this.addRoad( 10, 10, 10, 0, 5,  color );
            this.addRoad( 10, 10, 10, 0, -7, color );
            this.addRoad( 10, 10, 10, 0, 5,  color );
            this.addRoad( 10, 10, 10, 0, -2, color );
        }

        /** ************************************************************************************************************
        *   The legacy method for adding a downhill track till the level end.
        ***************************************************************************************************************/
        public addDownhillToEndLegacy( color:outrun.SegmentColorSet, count:outrun.RoadLength ) : void
        {
            this.addRoad( count, count, count, -outrun.RoadCurve.EASY, -this.lastY() / outrun.SettingGame.SEGMENT_LENGTH, color );
        }

        /** ************************************************************************************************************
        *   Sets the startGameLoop and the finish line.
        *
        *   @param playerZ The initial z position of the player.
        ***************************************************************************************************************/
        public addStartAndFinish( playerZ:number ) : void
        {
            // set startGameLoop and finish
            this.segments[ outrun.Stage.findSegment( this.segments, playerZ ).getIndex() + 2 ].setColor( outrun.SettingColor.START );
            this.segments[ outrun.Stage.findSegment( this.segments, playerZ ).getIndex() + 3 ].setColor( outrun.SettingColor.START );
            for (let n:number = 0; n < outrun.SettingGame.RUMBLE_LENGTH; n++ )
            {
                this.segments[ this.segments.length - 1 - n ].setColor( outrun.SettingColor.FINISH );
            }
        }

        /** ************************************************************************************************************
        *   Adds a bunch of road segments to the segment stack.
        *
        *   @param countEnter The number of segments to create for easing in this road.
        *   @param countHold  The number of segments to create.
        *   @param countLeave The number of segments to create for easing out this road.
        *   @param curve      The curve situation for this road.
        *   @param hill       The hill  situation for this road.
        *   @param color      The color set for this road segment.
        ***************************************************************************************************************/
        private addRoad
        (
            countEnter :number,
            countHold  :number,
            countLeave :number,

            curve      :outrun.RoadCurve,
            hill       :outrun.RoadHill,
            color      :outrun.SegmentColorSet
        )
        : void
        {
            // calculate elevation
            const startY :number = this.lastY();
            const endY   :number = startY + (outrun.MathUtil.toInt( hill ) * outrun.SettingGame.SEGMENT_LENGTH);

            const total  :number = ( countEnter + countHold + countLeave );

            for ( let n:number = 0; n < countEnter; n++ )
            {
                this.addSegment
                (
                    outrun.MathUtil.easeIn( 0, curve, n / countEnter ),
                    outrun.MathUtil.easeInOut( startY, endY, n / total ),
                    color
                );
            }

            for ( let n:number = 0; n < countHold; n++ )
            {
                this.addSegment
                (
                    curve,
                    outrun.MathUtil.easeInOut( startY, endY, ( countEnter + n ) / total ),
                    color
                );
            }

            for ( let n:number = 0; n < countLeave; n++ )
            {
                this.addSegment
                (
                    outrun.MathUtil.easeInOut( curve, 0, n / countLeave ),
                    outrun.MathUtil.easeInOut( startY, endY, ( countEnter + countHold + n ) / total ),
                    color
                );
            }
        }

        /** ************************************************************************************************************
        *   Adds a road segment.
        *
        *   @param curve Specifies if this segment is a curve?
        *   @param y     The Y location of this segment.
        *   @param color The color set for this segment.
        ***************************************************************************************************************/
        private addSegment( curve:outrun.RoadCurve, y:number, color:outrun.SegmentColorSet ) : void
        {
            const index :number = this.segments.length;
            const lastY :number = this.lastY();

            this.segments.push
            (
                new outrun.Segment
                (
                    index,
                    new outrun.SegmentPoint(
                        new outrun.Vector( 0, lastY, index * outrun.SettingGame.SEGMENT_LENGTH )
                    ),
                    new outrun.SegmentPoint(
                        new outrun.Vector( 0, y, ( index + 1 ) * outrun.SettingGame.SEGMENT_LENGTH )
                    ),
                    curve,
                    [],
                    [],
                    color,
                    false,
                    0,
                    0
                )
            );
        }

        /** ************************************************************************************************************
        *   Returns the Y value of the last segment's P2 (?) or 0 if no segments exist.
        *
        *   @return Y of last segment's P2 or 0 if the collection of segments is empty.
        ***************************************************************************************************************/
        private lastY() : number
        {
            return(
                this.segments.length === 0
                ? 0
                : this.segments[ this.segments.length - 1 ].getP2().getWorld().y
            );
        }
    }
