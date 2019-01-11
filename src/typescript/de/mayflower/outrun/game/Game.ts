
    import * as outrun from '..';

    /** ****************************************************************************************************************
    *   Manages the game logic.
    *******************************************************************************************************************/
    export class Game
    {
        /** The key system that manages pressed keys. */
        public              keySystem               :outrun.KeySystem             = null;
        /** The canvas system that manages the canvas. */
        public              canvasSystem            :outrun.CanvasSystem          = null;
        /** The image system that manages all images. */
        public              imageSystem             :outrun.ImageSystem           = null;

        public              outRun                  :outrun.OutRun                = null;

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

            outrun.Debug.init.log( 'Init window resize system' );
            window.addEventListener( 'resize', this.onWindowResize );

            outrun.Debug.init.log( 'Init image system' );
            this.imageSystem = new outrun.ImageSystem( outrun.ImageFile.FILE_NAMES, this.onImagesLoaded );
        }

        /** ************************************************************************************************************
        *   Being invoked when all images are loaded.
        ***************************************************************************************************************/
        public onImagesLoaded=() : void =>
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
