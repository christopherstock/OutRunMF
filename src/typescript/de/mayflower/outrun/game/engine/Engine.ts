
    import * as outrun from '../..';

    require( 'FPSMeter' );

    /** ****************************************************************************************************************
    *   Manages the game logic.
    *******************************************************************************************************************/
    export class Engine
    {
        /** The key system that manages pressed keys. */
        public              keySystem               :outrun.KeySystem               = null;
        /** The canvas system that manages the canvas. */
        public              canvasSystem            :outrun.CanvasSystem            = null;
        /** The image system that manages all images. */
        public              imageSystem             :outrun.ImageSystem             = null;
        /** The FPS meter. */
        public              fpsMeter                :FPSMeter                       = null;

        /** The key system that manages pressed keys. */
        private             onInitComplete          :() => void                     = null;

        /** ************************************************************************************************************
        *   Inits the game from scratch.
        ***************************************************************************************************************/
        public init( onInitComplete: () => void ) : void
        {
            this.onInitComplete = onInitComplete;

            outrun.Debug.init.log( 'Init key system' );
            this.keySystem = new outrun.KeySystem();

            outrun.Debug.init.log( 'Init canvas system' );
            this.canvasSystem = new outrun.CanvasSystem();
            this.canvasSystem.updateDimensions();

            outrun.Debug.init.log( 'Init FPS meter' );
            this.initFpsCounter();

            outrun.Debug.init.log( 'Init window resize system' );
            window.addEventListener( 'resize', this.onWindowResize );

            outrun.Debug.init.log( 'Init image system' );
            this.imageSystem = new outrun.ImageSystem( outrun.ImageFile.FILE_NAMES, this.onImagesLoaded );
        }

        /***************************************************************************************************************
        *   Inits the FPS counter.
        ***************************************************************************************************************/
        private initFpsCounter() : void
        {
            this.fpsMeter = new FPSMeter(
                null,
                {
                    graph:    1,
                    decimals: 1,
                    position: 'absolute',
                    zIndex:   10,
                    top:      'auto',
                    right:    '25px',
                    bottom:   '25px',
                    left:     'auto',
                    margin:   '0',
                    heat:     1,
                }
            );
        }

        /** ************************************************************************************************************
        *   Being invoked when all images are loaded.
        ***************************************************************************************************************/
        private onImagesLoaded=() : void =>
        {
            // notify engine load complete
            this.onInitComplete();
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
