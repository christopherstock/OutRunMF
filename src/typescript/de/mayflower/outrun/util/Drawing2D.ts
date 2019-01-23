
    import * as outrun from '..'

    /** ****************************************************************************************************************
    *   Offers independent 2D drawing operations.
    *******************************************************************************************************************/
    export class Drawing2D
    {
        /** ************************************************************************************************************
        *   Fills a rect onto the canvas context.
        *
        *   @param ctx    The 2D rendering context.
        *   @param left   Drawing position X of the left rectangle edge.
        *   @param top    Drawing position Y of the top  rectangle edge.
        *   @param width  Rectangle width.
        *   @param height Rectangle height.
        *   @param color  Fill color in css format.
        *   @param alpha  Alpha value for fill color from 0.0 (transparent) to 1.0 (opaque).
        ***************************************************************************************************************/
        public static drawRect
        (
            ctx    :CanvasRenderingContext2D,
            left   :number,
            top    :number,
            width  :number,
            height :number,
            color  :string,
            alpha  :number = 1.0
        )
        : void
        {
            if ( alpha !== 1.0 ) ctx.globalAlpha = alpha;

            ctx.fillStyle = color;
            ctx.fillRect( left, top, width, height );

            if ( alpha !== 1.0 ) ctx.globalAlpha = 1.0;
        }

        /** ************************************************************************************************************
        *   Fills a polygon onto the canvas context.
        *
        *   @param ctx   The 2D rendering context.
        *   @param x1    Polygon's 1st coordinate X.
        *   @param y1    Polygon's 1st coordinate Y.
        *   @param x2    Polygon's 2nd coordinate X.
        *   @param y2    Polygon's 2nd coordinate Y.
        *   @param x3    Polygon's 3rd coordinate X.
        *   @param y3    Polygon's 3rd coordinate Y.
        *   @param x4    Polygon's 4th coordinate X.
        *   @param y4    Polygon's 4th coordinate Y.
        *   @param color Fill color in css format.
        ***************************************************************************************************************/
        public static drawPolygon
        (
            ctx   :CanvasRenderingContext2D,
            x1    :number,
            y1    :number,
            x2    :number,
            y2    :number,
            x3    :number,
            y3    :number,
            x4    :number,
            y4    :number,
            color :string
        )
        : void
        {
            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.moveTo( x1, y1 );
            ctx.lineTo( x2, y2 );
            ctx.lineTo( x3, y3 );
            ctx.lineTo( x4, y4 );
            ctx.closePath();

            ctx.fill();
        }

        /** ************************************************************************************************************
        *   Draws an image onto the canvas context.
        *
        *   @param ctx           The 2D rendering context.
        *   @param resolution    The drawing resolution of the canvas.
        *   @param halfRoadWidth The half width of the road.
        *   @param image         The image to draw.
        *   @param scale         The scale factor of the image draw operatiom.
        *   @param destX         Drawing destination X.
        *   @param destY         Drawing destination Y.
        *   @param offsetX       Drawing modifier X.
        *   @param offsetY       Drawing modifier Y.
        *   @param clipY         The clipping axis Y.
        ***************************************************************************************************************/
        public static drawImage
        (
            ctx           :CanvasRenderingContext2D,
            resolution    :number,
            halfRoadWidth :number,
            image         :HTMLImageElement,
            scale      :number,
            destX      :number,
            destY      :number,
            offsetX    :number,
            offsetY    :number,
            clipY      :number
        )
        : void
        {
            const canvasWidth :number = outrun.Main.game.engine.canvasSystem.getWidth();
            const scalation   :number = scale * canvasWidth / 2 * outrun.SettingEngine.SPRITE_SCALE * halfRoadWidth;

            //  scale for projection AND relative to roadWidth (for tweakUI)
            const destW:number = image.width  * scalation;
            const destH:number = image.height * scalation;

            destX = destX + ( destW * offsetX );
            destY = destY + ( destH * offsetY );

            // draw image if not outside clip
            const clipH:number = clipY ? Math.max( 0, destY + destH - clipY ) : 0;
            if (clipH < destH)
            {
                ctx.drawImage
                (
                    image,
                    0,
                    0,
                    image.width,
                    image.height - ( image.height * clipH / destH ),
                    destX,
                    destY,
                    destW,
                    destH - clipH
                );
            }
        }
    }
