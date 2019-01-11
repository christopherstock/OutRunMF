
    import * as outrun from '..';

    /** ****************************************************************************************************************
    *   Manages the canvas.
    *******************************************************************************************************************/
    export class CanvasSystem
    {
        /** The divider to calculate the resolution from the canvas height. */
        private static  readonly    RESOLUTION_DIVIDER      :number                         = 480;

        /** The native HTML5 canvas element. */
        private         readonly    canvas                  :HTMLCanvasElement              = null;
        /** The canvas rendering context. */
        private         readonly    canvasContext           :CanvasRenderingContext2D       = null;

        /** The current resolution scale for drawing all images. */
        private                     resolution              :number                         = 0;

        /** ************************************************************************************************************
        *   Constructs a new canvas system.
        ***************************************************************************************************************/
        public constructor()
        {
            // create native canvas
            this.canvas = document.createElement( 'canvas' );

            // reference 2d rendering context
            this.canvasContext = this.canvas.getContext( '2d' );

            // append to body
            document.body.appendChild( this.canvas );
        }

        /** ************************************************************************************************************
        *   Updates the canvas dimensions according to current screen size.
        *
        *   @return <code>true</code> if the canvas dimensions have actually been changed.
        ***************************************************************************************************************/
        public updateDimensions() : boolean
        {
            // assign inner window dimensions as new dimensions
            let newWidth  :number = window.innerWidth;
            let newHeight :number = window.innerHeight;

            // clip to minimum canvas dimensions
            if ( newWidth  < outrun.SettingGame.CANVAS_MIN_WIDTH  ) newWidth  = outrun.SettingGame.CANVAS_MIN_WIDTH;
            if ( newHeight < outrun.SettingGame.CANVAS_MIN_HEIGHT ) newHeight = outrun.SettingGame.CANVAS_MIN_HEIGHT;

            // clip to maximum canvas dimensions
            if ( newWidth  > outrun.SettingGame.CANVAS_MAX_WIDTH  ) newWidth  = outrun.SettingGame.CANVAS_MAX_WIDTH;
            if ( newHeight > outrun.SettingGame.CANVAS_MAX_HEIGHT ) newHeight = outrun.SettingGame.CANVAS_MAX_HEIGHT;

            // determine dimension change
            const dimensionsChanged:boolean =
            (
                   this.canvas.width  !== newWidth
                || this.canvas.height !== newHeight
            );

            // assign new dimensions to HTML5 canvas
            this.canvas.width  = newWidth;
            this.canvas.height = newHeight;

            // specify canvas resolution according to its current height
            this.resolution = newHeight / CanvasSystem.RESOLUTION_DIVIDER;

            outrun.Debug.canvas.log( ' Updated canvas dimensions to [' + newWidth + 'x' + newHeight + ']' );

            return dimensionsChanged;
        }

        /** ************************************************************************************************************
        *   Returns the current canvas width.
        *
        *   @return The width of the current canvas.
        ***************************************************************************************************************/
        public getWidth() : number
        {
            return this.canvas.width;
        }

        /** ************************************************************************************************************
        *   Returns the current canvas height.
        *
        *   @return The width of the current canvas.
        ***************************************************************************************************************/
        public getHeight() : number
        {
            return this.canvas.height;
        }

        /** ************************************************************************************************************
        *   Returns the native HTML canvas object.
        *
        *   @return The HTML canvas object.
        ***************************************************************************************************************/
        public getNativeCanvas() : HTMLCanvasElement
        {
            return this.canvas;
        }

        /** ************************************************************************************************************
        *   Returns the current canvas rendering context.
        *
        *   @return The 2D rendering context.
        ***************************************************************************************************************/
        public getCanvasContext() : CanvasRenderingContext2D
        {
            return this.canvasContext;
        }

        /** ************************************************************************************************************
        *   Returns the current canvas rendering context.
        *
        *   @return The current resolution scale.
        ***************************************************************************************************************/
        public getResolution() : number
        {
            return this.resolution;
        }
    }
