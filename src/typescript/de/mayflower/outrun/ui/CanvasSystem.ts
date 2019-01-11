
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
            // get inner window dimensions
            const canvasWidth:number  = outrun.SettingGame.CANVAS_WIDTH;  // window.innerWidth;
            const canvasHeight:number = outrun.SettingGame.CANVAS_HEIGHT; // window.innerHeight;
/*
            // clip to minimum canvas dimensions
            if ( canvasWidth  < outrun.SettingGame.CANVAS_MIN_WIDTH  ) canvasWidth  = outrun.SettingGame.CANVAS_MIN_WIDTH;
            if ( canvasHeight < outrun.SettingGame.CANVAS_MIN_HEIGHT ) canvasHeight = outrun.SettingGame.CANVAS_MIN_HEIGHT;
*/
            const dimensionsChanged:boolean =
            (
                   this.canvas.width  !== canvasWidth
                || this.canvas.height !== canvasHeight
            );

            // assign new dimensions to canvas
            this.canvas.width  = canvasWidth;
            this.canvas.height = canvasHeight;

            // specify canvas resolution according to its current height
            this.resolution = canvasHeight / CanvasSystem.RESOLUTION_DIVIDER;

            outrun.Debug.canvas.log
            (
                'Updated canvas dimensions to [' + canvasWidth + 'x' + canvasHeight + '] '
                + 'resolution [' + this.resolution   + ']'
                + 'changed ['    + dimensionsChanged + ']'
            );

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
