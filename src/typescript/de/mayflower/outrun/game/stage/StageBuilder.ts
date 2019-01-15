
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
        *   Adds a straight segment of road to the specified array.
        *
        *   @param num      The desired segment length.
        ***************************************************************************************************************/
        public addStraight( num:number ) : void
        {
            this.addRoad( num, num, num, 0, 0 );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public addHill( num:number, height:number ) : void
        {
            this.addRoad( num, num, num, 0, height );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public addCurve( num:number, curve:number, height:number ) : void
        {
            this.addRoad( num, num, num, curve, height );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public addLowRollingHills( num:number, height:number ) : void
        {
            this.addRoad( num, num, num, 0, height / 2 );
            this.addRoad( num, num, num, 0, -height );
            this.addRoad( num, num, num, outrun.Road.CURVE.EASY, height );
            this.addRoad( num, num, num, 0, 0 );
            this.addRoad( num, num, num, -outrun.Road.CURVE.EASY, height / 2 );
            this.addRoad( num, num, num, 0, 0 );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        // tslint:disable:max-line-length
        public addSCurves() : void
        {
            this.addRoad( outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, -outrun.Road.CURVE.EASY,   outrun.Road.HILL.NONE    );
            this.addRoad( outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.MEDIUM,  outrun.Road.HILL.MEDIUM  );
            this.addRoad( outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.EASY,    -outrun.Road.HILL.LOW    );
            this.addRoad( outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, -outrun.Road.CURVE.EASY,   outrun.Road.HILL.MEDIUM  );
            this.addRoad( outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, outrun.Road.LENGTH.MEDIUM, -outrun.Road.CURVE.MEDIUM, -outrun.Road.HILL.MEDIUM );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public addBumps() : void
        {
            this.addRoad( 10, 10, 10, 0, 5  );
            this.addRoad( 10, 10, 10, 0, -2 );
            this.addRoad( 10, 10, 10, 0, -5 );
            this.addRoad( 10, 10, 10, 0, 8  );
            this.addRoad( 10, 10, 10, 0, 5  );
            this.addRoad( 10, 10, 10, 0, -7 );
            this.addRoad( 10, 10, 10, 0, 5  );
            this.addRoad( 10, 10, 10, 0, -2 );
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        public addDownhillToEnd( num:number ) : void
        {
            this.addRoad( num, num, num, -outrun.Road.CURVE.EASY, -this.lastY() / outrun.SettingGame.SEGMENT_LENGTH );
        }

        /** ************************************************************************************************************
        *   Sets the startGameLoop and the finish line.
        *
        *   @param playerZ The initial z position of the player.
        ***************************************************************************************************************/
        public addStartAndFinish( playerZ:number ) : void
        {
            // set startGameLoop and finish
            this.segments[ outrun.Stage.findSegment( this.segments, playerZ ).getIndex() + 2 ].color = outrun.SettingColor.START;
            this.segments[ outrun.Stage.findSegment( this.segments, playerZ ).getIndex() + 3 ].color = outrun.SettingColor.START;
            for (let n:number = 0; n < outrun.SettingGame.RUMBLE_LENGTH; n++ )
            {
                this.segments[ this.segments.length - 1 - n ].color = outrun.SettingColor.FINISH;
            }
        }

        /** ************************************************************************************************************
        *
        ***************************************************************************************************************/
        private addRoad
        (
            enter      :number,
            hold       :number,
            leave      :number,
            curve      :number,
            y          :number
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
                    outrun.MathUtil.easeInOut( startY, endY, n / total )
                );
            }

            for ( let n:number = 0; n < hold; n++ )
            {
                this.addSegment
                (
                    curve,
                    outrun.MathUtil.easeInOut( startY, endY, ( enter + n ) / total )
                );
            }

            for ( let n:number = 0; n < leave; n++ )
            {
                this.addSegment
                (
                    outrun.MathUtil.easeInOut( curve, 0, n / leave ),
                    outrun.MathUtil.easeInOut( startY, endY, ( enter + hold + n ) / total )
                );
            }
        }

        /** ************************************************************************************************************
        *   Adds a road segment.
        *
        *   @param curve Specifies if this segment is a curve?
        *   @param y     The Y location of this segment.
        ***************************************************************************************************************/
        private addSegment( curve :number, y :number ) : void
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
                    (
                        Math.floor( n / outrun.SettingGame.RUMBLE_LENGTH ) % 2
                        ? outrun.Main.game.stage.trackColorDark
                        : outrun.Main.game.stage.trackColorLight
                    ),
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
