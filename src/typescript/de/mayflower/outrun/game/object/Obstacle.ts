
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   Represents one obstacle.
    *******************************************************************************************************************/
    export class Obstacle extends outrun.GameObject
    {
        private             readonly    x                           :number                 = null;

        public constructor( sprite:string, x:number )
        {
            super( sprite );

            this.x      = x;
        }

        public getSprite() : string
        {
            return this.sprite;
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
            const spriteX     :number = p1.getScreen().x + (spriteScale * this.x * outrun.SettingGame.HALF_ROAD_WIDTH * outrun.Main.game.engine.canvasSystem.getWidth() / 2);
            const spriteY     :number = p1.getScreen().y;

            outrun.Drawing2D.drawSprite( ctx, resolution, outrun.SettingGame.HALF_ROAD_WIDTH, this.sprite, spriteScale, spriteX, spriteY, (this.x < 0 ? -1 : 0), -1, clip );
        }
    }
