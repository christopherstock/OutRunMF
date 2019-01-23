
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Creates stage segments.
    *******************************************************************************************************************/
    export class StageBuilder
    {
        private                 readonly                segments                        :outrun.Segment[]       = null;

        public constructor()
        {
            this.segments = [];
        }

        public assemble() : outrun.Segment[]
        {
            return this.segments;
        }

        /** ************************************************************************************************************
        *   Adds straight road segments to the specified array.
        *
        *   @param color The color for the straight segments.
        *   @param count The number of straight segments to add.
        ***************************************************************************************************************/
        public addStraight( color:outrun.SegmentColorSet, count:number ) : void
        {
            this.addRoad( count, count, count, 0, 0, color );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public addHill( color:outrun.SegmentColorSet, num:number, height:number ) : void
        {
            this.addRoad( num, num, num, 0, height, color );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public addCurve( color:outrun.SegmentColorSet, num:number, curve:number, height:number ) : void
        {
            this.addRoad( num, num, num, curve, height, color );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public addLowRollingHills( color:outrun.SegmentColorSet, num:number, height:number ) : void
        {
            this.addRoad( num, num, num, 0, height / 2, color );
            this.addRoad( num, num, num, 0, -height, color );
            this.addRoad( num, num, num, outrun.Road.CURVE.EASY, height, color );
            this.addRoad( num, num, num, 0, 0, color );
            this.addRoad( num, num, num, -outrun.Road.CURVE.EASY, height / 2, color );
            this.addRoad( num, num, num, 0, 0, color );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        // tslint:disable:max-line-length
        public addSCurves( color:outrun.SegmentColorSet ) : void
        {
            this.addRoad( outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, -outrun.Road.CURVE.EASY,   outrun.Road.HILL.NONE,    color );
            this.addRoad( outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.MEDIUM,  outrun.Road.HILL.MEDIUM,  color );
            this.addRoad( outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.EASY,    -outrun.Road.HILL.LOW,    color );
            this.addRoad( outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, -outrun.Road.CURVE.EASY,   outrun.Road.HILL.MEDIUM,  color );
            this.addRoad( outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, -outrun.Road.CURVE.MEDIUM, -outrun.Road.HILL.MEDIUM, color );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public addBumps( color:outrun.SegmentColorSet) : void
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
        *
        ***************************************************************************************************************/
        public addDownhillToEnd( color:outrun.SegmentColorSet, num:number ) : void
        {
            this.addRoad( num, num, num, -outrun.Road.CURVE.EASY, -this.lastY() / outrun.SettingGame.SEGMENT_LENGTH, color );
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
        *
        ***************************************************************************************************************/
        private addRoad
        (
            enter :number,
            hold  :number,
            leave :number,
            curve :number,
            y     :number,
            color :outrun.SegmentColorSet
        )
        : void
        {
            const startY :number = this.lastY();
            const endY   :number = startY + (outrun.MathUtil.toInt( y ) * outrun.SettingGame.SEGMENT_LENGTH);
            const total  :number = ( enter + hold + leave );

            for ( let n:number = 0; n < enter; n++ )
            {
                this.addSegment
                (
                    outrun.MathUtil.easeIn( 0, curve, n / enter ),
                    outrun.MathUtil.easeInOut( startY, endY, n / total ),
                    color
                );
            }

            for ( let n:number = 0; n < hold; n++ )
            {
                this.addSegment
                (
                    curve,
                    outrun.MathUtil.easeInOut( startY, endY, ( enter + n ) / total ),
                    color
                );
            }

            for ( let n:number = 0; n < leave; n++ )
            {
                this.addSegment
                (
                    outrun.MathUtil.easeInOut( curve, 0, n / leave ),
                    outrun.MathUtil.easeInOut( startY, endY, ( enter + hold + n ) / total ),
                    color
                );
            }
        }

        /** ************************************************************************************************************
        *   Adds a road segment.
        *
        *   @param curve Specifies if this segment is a curve?
        *   @param y     The Y location of this segment.
        *   @param color The color for this segment.
        ***************************************************************************************************************/
        private addSegment( curve:number, y:number, color:outrun.SegmentColorSet ) : void
        {
            const n:number = this.segments.length;
            const lastY:number = this.lastY();

            this.segments.push
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
