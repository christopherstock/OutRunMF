
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   Represents one obstacle.
    *******************************************************************************************************************/
    export class Obstacle extends outrun.GameObject
    {
        /** Constant obstacle position X. */
        private             readonly    x                           :number                 = null;

        public constructor( image:HTMLImageElement, x:number )
        {
            super( image );

            this.x = x;
        }

        public getX() : number
        {
            return this.x;
        }

        public draw
        (
            ctx        :CanvasRenderingContext2D,
            resolution :number,
            p1         :outrun.SegmentPoint,
            clip       :number
        )
        : void
        {
            const spriteScale :number = p1.getScreen().scale;
            const spriteX     :number = p1.getScreen().x + (
                spriteScale
                * this.x
                * outrun.SettingGame.HALF_ROAD_WIDTH
                * ( outrun.Main.game.engine.canvasSystem.getWidth() / 2 )
            );
            const spriteY     :number = p1.getScreen().y;

            outrun.Drawing2D.drawSprite
            (
                ctx,
                resolution,
                outrun.SettingGame.HALF_ROAD_WIDTH,
                this.image,
                spriteScale,
                spriteX,
                spriteY,
                ( this.x < 0 ? -1 : 0 ),
                -1,
                clip
            );
        }
    }
