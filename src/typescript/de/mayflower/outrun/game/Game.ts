
    import * as orts from '..';

    /** ****************************************************************************************************************
    *   Manages the game logic.
    *******************************************************************************************************************/
    export class Game
    {
        /** The key system that manages pressed keys. */
        public              keySystem               :orts.KeySystem             = null;
        /** The canvas system that manages the canvas. */
        public              canvasSystem            :orts.CanvasSystem          = null;
        /** The image system that manages all images. */
        public              imageSystem             :orts.ImageSystem           = null;

        public              outRun                  :orts.OutRun                = null;

        /** ************************************************************************************************************
        *   Inits the game from scratch.
        ***************************************************************************************************************/
        public init() : void
        {
            orts.Debug.init.log( 'Init game engine' );

            orts.Debug.init.log( 'Init key system' );
            this.keySystem = new orts.KeySystem();

            orts.Debug.init.log( 'Init canvas system' );
            this.canvasSystem = new orts.CanvasSystem();
            this.canvasSystem.updateDimensions();

            orts.Debug.init.log( 'Init window resize system' );
            window.addEventListener( 'resize', this.onWindowResize );

            orts.Debug.init.log( 'Init image system' );
            this.imageSystem = new orts.ImageSystem( orts.ImageFile.FILE_NAMES, this.onImagesLoaded );
        }

        /** ************************************************************************************************************
        *   Being invoked when all images are loaded.
        ***************************************************************************************************************/
        public onImagesLoaded=() : void =>
        {
            // start legacy game loop
            this.outRun = new orts.OutRun( this.canvasSystem );
            this.outRun.reset();
            this.outRun.start();
        };

        /** ************************************************************************************************************
        *   Being invoked when the size of the browser window is changed.
        ***************************************************************************************************************/
        private onWindowResize=() : void =>
        {
            // update canvas dimensions and check if they actually changed
            const dimensionsChanged:boolean = this.canvasSystem.updateDimensions();

            if ( dimensionsChanged )
            {
                // resize HUD etc.?

            }
        };
    }
