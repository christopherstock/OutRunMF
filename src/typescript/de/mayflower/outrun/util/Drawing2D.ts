
    import * as outrun from '..'

    /** ****************************************************************************************************************
    *   canvas rendering helpers.
    *
    *   TODO remove or move too special 'helper' functions
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

        public static drawSprite( ctx:CanvasRenderingContext2D, resolution:number, roadWidth:number, image:HTMLImageElement, scale:number, destX:number, destY:number, offsetX:number, offsetY:number, clipY:number ) : void
        {
            const width :number           = outrun.Main.game.engine.canvasSystem.getWidth();

            //  scale for projection AND relative to roadWidth (for tweakUI)
            const destW:number  = (image.width  * scale * width / 2) * (outrun.SettingEngine.SPRITE_SCALE * roadWidth);
            const destH:number  = (image.height * scale * width / 2) * (outrun.SettingEngine.SPRITE_SCALE * roadWidth);

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
