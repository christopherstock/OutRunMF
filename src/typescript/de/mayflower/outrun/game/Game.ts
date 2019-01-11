
    import * as outrun from '..';

    require( 'FPSMeter' );

    /** ****************************************************************************************************************
    *   Manages the game logic.
    *******************************************************************************************************************/
    export class Game
    {
        /** The key system that manages pressed keys. */
        public              keySystem               :outrun.KeySystem               = null;
        /** The canvas system that manages the canvas. */
        public              canvasSystem            :outrun.CanvasSystem            = null;
        /** The image system that manages all images. */
        public              imageSystem             :outrun.ImageSystem             = null;

        /** The legacy game instance. */
        public              outRun                  :outrun.OutRun                  = null;

        public              fpsMeter                :FPSMeter                       = null;

        /** ************************************************************************************************************
        *   Inits the game from scratch.
        ***************************************************************************************************************/
        public init() : void
        {
            outrun.Debug.init.log( 'Init game engine' );

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
            // start legacy game loop
            this.outRun = new outrun.OutRun( this.canvasSystem );
            this.outRun.changeToLevel( new outrun.LevelTest() );
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
