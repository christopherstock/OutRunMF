
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one segment of the road.
    *******************************************************************************************************************/
    export class Segment
    {
        private         readonly        index               :number                 = 0;
        private         readonly        laneCount           :number                 = 0;
        private         readonly        roadDrawingWidth    :number                 = 0;

        private         readonly        pointLeft           :outrun.SegmentPoint    = null;
        private         readonly        pointRight          :outrun.SegmentPoint    = null;
        private         readonly        curve               :outrun.RoadCurve       = 0;

        private                         color               :outrun.SegmentColor    = null;
        private                         looped              :boolean                = false;
        private                         fog                 :number                 = 0;
        private                         clip                :number                 = 0;

        // TODO outsource to Stage ??


        private         readonly        obstacles           :outrun.Obstacle[]      = [];



        private         readonly        cars                :outrun.Car[]           = [];

        public constructor
        (
            index            :number,
            laneCount        :number,
            roadDrawingWidth :number,

            pointLeft        :outrun.SegmentPoint,
            pointRight       :outrun.SegmentPoint,
            curve            :outrun.RoadCurve,
            color            :outrun.SegmentColorSet
        )
        {
            this.index            = index;
            this.laneCount        = laneCount;
            this.roadDrawingWidth = roadDrawingWidth;

            this.pointLeft        = pointLeft;
            this.pointRight       = pointRight;
            this.curve            = curve;

            this.color            = (
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

        public getRoadDrawingWidth() : number
        {
            return this.roadDrawingWidth;
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

        public draw( canvasSystem:outrun.CanvasSystem, fogColor:string ) : void
        {
            const ctx         :CanvasRenderingContext2D = canvasSystem.getRenderingContext();
            const canvasWidth :number                   = canvasSystem.getWidth();

            const leftX  :number = this.pointLeft.getScreen().x;
            const leftY  :number = this.pointLeft.getScreen().y;
            const leftW  :number = this.pointLeft.getScreen().w;

            const rightX :number = this.pointRight.getScreen().x;
            const rightY :number = this.pointRight.getScreen().y;
            const rightW :number = this.pointRight.getScreen().w;

            const leftRumbleWidth      :number = this.calculateRumbleWidth(     leftW  );
            const rightRumbleWidth     :number = this.calculateRumbleWidth(     rightW );
            const leftLaneMarkerWidth  :number = this.calculateLaneMarkerWidth( leftW  );
            const rightLaneMarkerWidth :number = this.calculateLaneMarkerWidth( rightW );

            // TODO extract all to separate methods!

            // draw offroad
            outrun.Drawing2D.drawRect( ctx, 0, rightY, canvasWidth, leftY - rightY, this.color.offroad );

            // draw left rumble
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
            // draw right rumble
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
            // draw road
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
                const lanew1 :number = leftW * 2 / this.laneCount;
                const lanew2 :number = rightW * 2 / this.laneCount;
                let   lanex1 :number = leftX - leftW + lanew1;
                let   lanex2 :number = rightX - rightW + lanew2;

                for ( let lane:number = 1; lane < this.laneCount; lane++ )
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

        private calculateRumbleWidth( projectedRoadWidth:number ) : number
        {
            return ( projectedRoadWidth / Math.max( 6,  2 * this.laneCount ) );
        }

        private calculateLaneMarkerWidth( projectedRoadWidth:number ) : number
        {
            return ( projectedRoadWidth / Math.max( 32, 8 * this.laneCount ) );
        }
    }
