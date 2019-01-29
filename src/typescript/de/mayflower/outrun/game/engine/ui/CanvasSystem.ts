
    import * as outrun from '../../..';

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
        private         readonly    renderingContext        :CanvasRenderingContext2D       = null;

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
            this.renderingContext = this.canvas.getContext( '2d' );

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
            let width  :number = window.innerWidth;
            let height :number = window.innerHeight;

            // clip to minimum canvas dimensions
            if ( width  < outrun.SettingEngine.CANVAS_MIN_WIDTH  ) width  = outrun.SettingEngine.CANVAS_MIN_WIDTH;
            if ( height < outrun.SettingEngine.CANVAS_MIN_HEIGHT ) height = outrun.SettingEngine.CANVAS_MIN_HEIGHT;

            // clip to maximum canvas dimensions
            if ( width  > outrun.SettingEngine.CANVAS_MAX_WIDTH  ) width  = outrun.SettingEngine.CANVAS_MAX_WIDTH;
            if ( height > outrun.SettingEngine.CANVAS_MAX_HEIGHT ) height = outrun.SettingEngine.CANVAS_MAX_HEIGHT;

            // determine dimension change
            const dimensionsChanged:boolean =
            (
                   this.canvas.width  !== width
                || this.canvas.height !== height
            );

            // assign new dimensions to HTML5 canvas
            this.canvas.width  = width;
            this.canvas.height = height;

            // specify canvas resolution according to its current height
            this.resolution = height / CanvasSystem.RESOLUTION_DIVIDER;

            outrun.Debug.canvas.log( ' Updated canvas dimensions to [' + width + 'x' + height + ']' );

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
        *   Returns the current canvas rendering context.
        *
        *   @return The 2D rendering context.
        ***************************************************************************************************************/
        public getRenderingContext() : CanvasRenderingContext2D
        {
            return this.renderingContext;
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
