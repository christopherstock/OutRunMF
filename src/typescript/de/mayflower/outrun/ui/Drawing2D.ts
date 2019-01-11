
    import * as outrun from '../index'

    /** ****************************************************************************************************************
    *   canvas rendering helpers.
    *******************************************************************************************************************/
    // tslint:disable:max-line-length
    export class Drawing2D
    {
        public static rect( ctx:CanvasRenderingContext2D, left:number, top:number, width:number, height:number, color:string, alpha:number = 1.0 ) : void
        {
            if ( alpha !== 1.0 )
            {
                ctx.globalAlpha = alpha;
            }

            ctx.fillStyle = color;
            ctx.fillRect( left, top, width, height );

            if ( alpha !== 1.0 )
            {
                ctx.globalAlpha = 1.0;
            }
        }

        public static polygon( ctx:CanvasRenderingContext2D, x1:number, y1:number, x2:number, y2:number, x3:number, y3:number, x4:number, y4:number, color:string ) : void
        {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.lineTo(x4, y4);
            ctx.closePath();
            ctx.fill();
        }

        public static background( ctx:CanvasRenderingContext2D, width:number, height:number, sprite:string, rotation:number, offset:number ) : void
        {
            const image:HTMLImageElement = outrun.Main.game.imageSystem.getImage( sprite );

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

        // TODO remove width and height and replace with canvasSystem.getWidth..!
        public static sprite( ctx:CanvasRenderingContext2D, width:number, height:number, resolution:number, roadWidth:number, sprite:string, scale:number, destX:number, destY:number, offsetX:number, offsetY:number, clipY:number ) : void
        {
            const image:HTMLImageElement = outrun.Main.game.imageSystem.getImage( sprite );

            //  scale for projection AND relative to roadWidth (for tweakUI)
            const destW:number  = (image.width  * scale * width/2) * (outrun.SettingGame.SPRITE_SCALE * roadWidth);
            const destH:number  = (image.height * scale * width/2) * (outrun.SettingGame.SPRITE_SCALE * roadWidth);

            destX = destX + (destW * (offsetX || 0));
            destY = destY + (destH * (offsetY || 0));

            const clipH:number = clipY ? Math.max( 0, destY + destH - clipY ) : 0;
            if (clipH < destH)
            {
                ctx.drawImage(image, 0, 0, image.width, image.height - (image.height * clipH/destH), destX, destY, destW, destH - clipH);
            }
        }

        public static fog( ctx:CanvasRenderingContext2D, x:number, y:number, width:number, height:number, fog:number, color:string ) : void
        {
            if ( fog < 1 ) {
                Drawing2D.rect( ctx, x, y, width, height, color, ( 1 - fog ) );
            }
        }
    }
