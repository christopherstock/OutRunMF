
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one segment of the road.
    *******************************************************************************************************************/
    export class Segment
    {
        public                          cars            :outrun.Car[]           = null;
        public                          color           :outrun.ColorCombo      = null;
        public                          fogColor        :string                 = null;
        public                          looped          :boolean                = false;
        public                          fog             :number                 = null;
        public                          clip            :number                 = 0;
        public                          curve           :number                 = 0;

        private         readonly        index           :number                 = 0;

        private         readonly        p1              :outrun.SegmentPoint    = null;
        private         readonly        p2              :outrun.SegmentPoint    = null;

        private         readonly        sprites         :outrun.Sprite[]        = null;

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

        public getIndex() : number
        {
            return this.index;
        }

        public getP1() : outrun.SegmentPoint
        {
            return this.p1;
        }

        public getP2() : outrun.SegmentPoint
        {
            return this.p2;
        }

        public addSprite( sprite:outrun.Sprite ) : void
        {
            this.sprites.push( sprite );
        }

        public draw( ctx:CanvasRenderingContext2D ) : void
        {
            Segment.segment(
                ctx,
                outrun.Main.game.canvasSystem.getWidth(),
                outrun.SettingGame.LANES,
                this.p1.getScreen().x,
                this.p1.getScreen().y,
                this.p1.getScreen().w,
                this.p2.getScreen().x,
                this.p2.getScreen().y,
                this.p2.getScreen().w,
                this.fog,
                this.color,
                this.fogColor
            );
        }

        public drawSprites( ctx:CanvasRenderingContext2D, resolution:number ) : void
        {
            for ( const sprite of this.sprites )
            {
                const spriteScale :number = this.p1.getScreen().scale;
                const spriteX     :number = this.p1.getScreen().x + (spriteScale * sprite.offset * outrun.SettingGame.ROAD_WIDTH * outrun.Main.game.canvasSystem.getWidth() / 2);
                const spriteY     :number = this.p1.getScreen().y;

                outrun.Drawing2D.sprite(ctx, outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), resolution, outrun.SettingGame.ROAD_WIDTH, sprite.source, spriteScale, spriteX, spriteY, (sprite.offset < 0 ? -1 : 0), -1, this.clip);
            }
        }

        public getSprites() : outrun.Sprite[]
        {
            return this.sprites;
        }

        // TODO merge with draw()
        public static segment( ctx:CanvasRenderingContext2D, width:number, lanes:number, x1:number, y1:number, w1:number, x2:number, y2:number, w2:number, fog:number, color:outrun.ColorCombo, colorFog:string ) : void
        {
            const r1 :number = Segment.calculateRumbleWidth(     w1, lanes );
            const r2 :number = Segment.calculateRumbleWidth(     w2, lanes );
            const l1 :number = Segment.calculateLaneMarkerWidth( w1, lanes );
            const l2 :number = Segment.calculateLaneMarkerWidth( w2, lanes );

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

        // TODO extract magic numbers!
        private static calculateRumbleWidth( projectedRoadWidth:number, lanes:number ) : number
        {
            return ( projectedRoadWidth / Math.max( 6,  2 * lanes ) );
        }

        private static calculateLaneMarkerWidth( projectedRoadWidth:number, lanes:number ) : number
        {
            return ( projectedRoadWidth / Math.max( 32, 8 * lanes ) );
        }
    }
