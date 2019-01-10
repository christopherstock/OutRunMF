
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one segment of the road.
    *
    *   TODO add private!
    *******************************************************************************************************************/
    export class Segment
    {
        public                          p1              :outrun.SegmentPoint    = null;

        public                          p2              :outrun.SegmentPoint    = null;

        public                          sprites         :outrun.Sprite[]        = null;

        public                          cars            :outrun.Car[]           = null;

        public                          color           :outrun.ColorCombo      = null;

        public                          fogColor        :string                 = null;

        public                          looped          :boolean                = false;

        public                          fog             :number                 = null;

        public                          clip            :number                 = 0;

        public                          curve           :number                 = 0;

        public                          index           :number                 = 0;

        public constructor
        (
            index    :number,
            p1       :outrun.SegmentPoint,
            p2       :outrun.SegmentPoint,
            curve    :number,
            sprites  :outrun.Sprite[],
            cars     :outrun.Car[],
            color    :outrun.ColorCombo,
            looped   :boolean,
            fog      :number,
            clip     :number,
            fogColor :string
        )
        {
            this.index    = index;
            this.p1       = p1;
            this.p2       = p2;
            this.curve    = curve;
            this.sprites  = sprites;
            this.cars     = cars;
            this.color    = color;
            this.looped   = looped;
            this.fog      = fog;
            this.clip     = clip;
            this.fogColor = fogColor;
        }

        public draw( ctx:CanvasRenderingContext2D ) : void
        {
            Segment.segment(
                ctx,
                outrun.Main.game.canvasSystem.getWidth(),
                outrun.SettingGame.LANES,
                this.p1.screen.x,
                this.p1.screen.y,
                this.p1.screen.w,
                this.p2.screen.x,
                this.p2.screen.y,
                this.p2.screen.w,
                this.fog,
                this.color,
                this.fogColor
            );
        }

        // TODO merge with draw()
        public static segment( ctx:CanvasRenderingContext2D, width:number, lanes:number, x1:number, y1:number, w1:number, x2:number, y2:number, w2:number, fog:number, color:outrun.ColorCombo, colorFog:string ) : void
        {
            const r1 :number = outrun.Drawing2D.rumbleWidth(     w1, lanes );
            const r2 :number = outrun.Drawing2D.rumbleWidth(     w2, lanes );
            const l1 :number = outrun.Drawing2D.laneMarkerWidth( w1, lanes );
            const l2 :number = outrun.Drawing2D.laneMarkerWidth( w2, lanes );

            let lanew1 :number = 0;
            let lanew2 :number = 0;
            let lanex1 :number = 0;
            let lanex2 :number = 0;

            ctx.fillStyle = color.grass;
            ctx.fillRect(0, y2, width, y1 - y2);

            // draw rumble
            outrun.Drawing2D.polygon( ctx, x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, color.rumble );
            outrun.Drawing2D.polygon( ctx, x1 + w1 + r1, y1, x1 + w1, y1, x2 + w2, y2, x2 + w2 + r2, y2, color.rumble );

            // draw road
            outrun.Drawing2D.polygon( ctx, x1 - w1,      y1, x1 + w1, y1, x2 + w2, y2, x2 - w2,      y2, color.road   );

            // draw lane
            if ( color.lane )
            {
                lanew1 = w1 * 2 / lanes;
                lanew2 = w2 * 2 / lanes;
                lanex1 = x1 - w1 + lanew1;
                lanex2 = x2 - w2 + lanew2;
                for ( let lane:number = 1; lane < lanes; lane++ )
                {
                    outrun.Drawing2D.polygon
                    (
                        ctx,
                        lanex1 - l1 / 2,
                        y1, lanex1 + l1 / 2,
                        y1, lanex2 + l2 / 2,
                        y2, lanex2 - l2 / 2,
                        y2,
                        color.lane
                    );

                    lanex1 += lanew1;
                    lanex2 += lanew2;
                }
            }

            // draw fog
            outrun.Drawing2D.fog( ctx, 0, y1, width, y2 - y1, fog, colorFog );
        }
    }
