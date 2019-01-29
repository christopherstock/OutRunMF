
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one segment of the road.
    *******************************************************************************************************************/
    export class Segment
    {
        private         readonly        index           :number                 = 0;

        private         readonly        pointLeft       :outrun.SegmentPoint    = null;
        private         readonly        pointRight      :outrun.SegmentPoint    = null;

        private         readonly        obstacles       :outrun.Obstacle[]      = null;

        private         readonly        cars            :outrun.Car[]           = null;
        private         readonly        curve           :outrun.RoadCurve       = 0;

        private                         color           :outrun.SegmentColor    = null;
        private                         looped          :boolean                = false;
        private                         fog             :number                 = null;
        private                         clip            :number                 = 0;

        public constructor
        (
            index      :number,
            pointLeft  :outrun.SegmentPoint,
            pointRight :outrun.SegmentPoint,
            curve      :outrun.RoadCurve,
            obstacles  :outrun.Obstacle[],
            cars       :outrun.Car[],
            color      :outrun.SegmentColorSet,
            looped     :boolean,
            fog        :number,
            clip       :number
        )
        {
            this.index      = index;
            this.pointLeft  = pointLeft;
            this.pointRight = pointRight;
            this.curve      = curve;
            this.obstacles  = obstacles;
            this.cars       = cars;
            this.looped     = looped;
            this.fog        = fog;
            this.clip       = clip;

            this.color      = (
                Math.floor( index / outrun.SettingGame.RUMBLE_LENGTH ) % 2
                ? color.dark
                : color.light
            );
        }

        public getIndex() : number
        {
            return this.index;
        }

        public getP1() : outrun.SegmentPoint
        {
            return this.pointLeft;
        }

        public getP2() : outrun.SegmentPoint
        {
            return this.pointRight;
        }

        public getClip() : number
        {
            return this.clip;
        }

        public getCars() : outrun.Car[]
        {
            return this.cars;
        }

        public getCurve() : outrun.RoadCurve
        {
            return this.curve;
        }

        public getObstacles() : outrun.Obstacle[]
        {
            return this.obstacles;
        }

        public isLooped() : boolean
        {
            return this.looped;
        }

        public addObstacle( sprite:outrun.Obstacle ) : void
        {
            this.obstacles.push( sprite );
        }

        public setColor( color:outrun.SegmentColor ) : void
        {
            this.color = color;
        }

        public updateProperties( looped:boolean, fog:number, clip:number ) : void
        {
            this.looped = looped;
            this.fog    = fog;
            this.clip   = clip;
        }

        public draw( ctx:CanvasRenderingContext2D, fogColor:string ) : void
        {
            // TODO create speaking vars!

            const leftX  :number = this.pointLeft.getScreen().x;
            const leftY  :number = this.pointLeft.getScreen().y;
            const leftW  :number = this.pointLeft.getScreen().w;

            const rightX :number = this.pointRight.getScreen().x;
            const rightY :number = this.pointRight.getScreen().y;
            const rightW :number = this.pointRight.getScreen().w;

            const canvasWidth :number = outrun.Main.game.engine.canvasSystem.getWidth();
            const laneCount   :number = outrun.SettingGame.LANES;

            const leftRumbleWidth      :number = Segment.calculateRumbleWidth(     leftW, laneCount );
            const rightRumbleWidth     :number = Segment.calculateRumbleWidth(     rightW, laneCount );
            const leftLaneMarkerWidth  :number = Segment.calculateLaneMarkerWidth( leftW, laneCount );
            const rightLaneMarkerWidth :number = Segment.calculateLaneMarkerWidth( rightW, laneCount );

            ctx.fillStyle = this.color.offroad;
            ctx.fillRect(0, rightY, canvasWidth, leftY - rightY);

            // left rumble
            outrun.Drawing2D.drawPolygon
            (
                ctx,
                leftX - leftW - leftRumbleWidth,
                leftY,
                leftX - leftW,
                leftY,
                rightX - rightW,
                rightY,
                rightX - rightW - rightRumbleWidth,
                rightY,
                this.color.rumble
            );
            // right rumble
            outrun.Drawing2D.drawPolygon
            (
                ctx,
                leftX + leftW + leftRumbleWidth,
                leftY,
                leftX + leftW,
                leftY,
                rightX + rightW,
                rightY,
                rightX + rightW + rightRumbleWidth,
                rightY,
                this.color.rumble
            );
            // road
            outrun.Drawing2D.drawPolygon
            (
                ctx,
                leftX - leftW,
                leftY,
                leftX + leftW,
                leftY,
                rightX + rightW,
                rightY,
                rightX - rightW,
                rightY,
                this.color.road
            );

            // draw lane
            if ( this.color.lane )
            {
                const lanew1 :number = leftW * 2 / laneCount;
                const lanew2 :number = rightW * 2 / laneCount;
                let   lanex1 :number = leftX - leftW + lanew1;
                let   lanex2 :number = rightX - rightW + lanew2;

                for ( let lane:number = 1; lane < laneCount; lane++ )
                {
                    outrun.Drawing2D.drawPolygon
                    (
                        ctx,
                        lanex1 - leftLaneMarkerWidth / 2,
                        leftY, lanex1 + leftLaneMarkerWidth / 2,
                        leftY, lanex2 + rightLaneMarkerWidth / 2,
                        rightY, lanex2 - rightLaneMarkerWidth / 2,
                        rightY,
                        this.color.lane
                    );

                    lanex1 += lanew1;
                    lanex2 += lanew2;
                }
            }

            // draw fog
            if ( this.fog < 1.0 )
            {
                outrun.Drawing2D.drawRect( ctx, 0, leftY, canvasWidth, rightY - leftY, fogColor, ( 1 - this.fog ) );
            }
        }

        private static calculateRumbleWidth( projectedRoadWidth:number, lanes:number ) : number
        {
            return ( projectedRoadWidth / Math.max( 6,  2 * lanes ) );
        }

        private static calculateLaneMarkerWidth( projectedRoadWidth:number, lanes:number ) : number
        {
            return ( projectedRoadWidth / Math.max( 32, 8 * lanes ) );
        }
    }
