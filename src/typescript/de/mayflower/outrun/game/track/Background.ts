
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   The stage background consisting of multiple layers.
    *
    *   TODO generic layer count!
    *******************************************************************************************************************/
    export class Background
    {
        // TODO reference images!

        /** The assigned image for the sky. */
        private     readonly    skyImage            :string                     = null;
        /** The assigned image for the hills. */
        private     readonly    hillImage           :string                     = null;
        /** The assigned image for the trees. */
        private     readonly    treeImage           :string                     = null;

        /** current sky scroll offset */
        private                 skyOffset           :number                     = 0;
        /** current hill scroll offset */
        private                 hillOffset          :number                     = 0;
        /** current tree scroll offset */
        private                 treeOffset          :number                     = 0;

        public constructor( skyImage:string, hillImage:string, treeImage:string )
        {
            this.skyImage  = skyImage;
            this.hillImage = hillImage;
            this.treeImage = treeImage;
        }

        /** ************************************************************************************************************
        *   Draws the background for a specific scene.
        *
        *   @param canvasSystem The canvas system.
        *   @param playerY      The player position Y for assigning the Y position of this background.
        ***************************************************************************************************************/
        public draw( canvasSystem:outrun.CanvasSystem, playerY:number ) : void
        {
            const ctx        :CanvasRenderingContext2D = canvasSystem.getRenderingContext();
            const resolution :number                   = canvasSystem.getResolution();

            const width  :number = canvasSystem.getWidth();
            const height :number = canvasSystem.getHeight();

            Background.drawBg(
                ctx,
                width,
                height,
                this.skyImage,
                this.skyOffset,
                resolution * outrun.SettingGame.SKY_SPEED  * playerY
            );
            Background.drawBg(
                ctx,
                width,
                height,
                this.hillImage,
                this.hillOffset,
                resolution * outrun.SettingGame.HILL_SPEED * playerY
            );
            Background.drawBg(
                ctx,
                width,
                height,
                this.treeImage,
                this.treeOffset,
                resolution * outrun.SettingGame.TREE_SPEED * playerY
            );
        }

        public updateOffsets( playerSegment:outrun.Segment, oldPlayerZ:number, newPlayerZ:number ) : void
        {
            this.skyOffset  = outrun.MathUtil.increase(
                this.skyOffset,
                outrun.SettingGame.SKY_SPEED
                * playerSegment.getCurve()
                * (newPlayerZ - oldPlayerZ) / outrun.SettingGame.SEGMENT_LENGTH,
                1
            );
            this.hillOffset = outrun.MathUtil.increase(
                this.hillOffset,
                outrun.SettingGame.HILL_SPEED
                * playerSegment.getCurve()
                * (newPlayerZ - oldPlayerZ) / outrun.SettingGame.SEGMENT_LENGTH,
                1
            );
            this.treeOffset = outrun.MathUtil.increase(
                this.treeOffset,
                outrun.SettingGame.TREE_SPEED
                * playerSegment.getCurve()
                * (newPlayerZ - oldPlayerZ) / outrun.SettingGame.SEGMENT_LENGTH,
                1
            );
        }

        private static drawBg(
            ctx      :CanvasRenderingContext2D,
            width    :number,
            height   :number,
            sprite   :string,
            rotation :number,
            offset   :number
        )
        : void
        {
            const image:HTMLImageElement = outrun.Main.game.engine.imageSystem.getImage( sprite );

            const imageW:number = image.width / 2;
            const imageH:number = image.height;

            const sourceX:number = Math.floor( image.width * rotation );
            const sourceY:number = 0;
            const sourceW:number = Math.min( imageW, image.width - sourceX );
            const sourceH:number = imageH;

            const destX:number = 0;
            const destY:number = offset;
            const destW:number = Math.floor( width * ( sourceW / imageW ) );
            const destH:number = height;

            ctx.drawImage(image, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH);
            if ( sourceW < imageW )
            {
                ctx.drawImage(image, 0, sourceY, imageW - sourceW, sourceH, destW - 1, destY, width - destW, destH);
            }
        }
    }
