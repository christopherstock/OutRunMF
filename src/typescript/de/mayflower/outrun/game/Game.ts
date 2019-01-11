
    import * as outrun from '..'

    /** ****************************************************************************************************************
    *   The main legacy game engine.
    *******************************************************************************************************************/
    // tslint:disable:max-line-length
    export class Game
    {
        /** The game engine. */
        public                  engine              :outrun.Engine                  = null;

        /** The game stage. */
        public                  stage               :outrun.Stage                   = null;

        /** ************************************************************************************************************
        *   Inits the game's engine.
        ***************************************************************************************************************/
        public init() : void
        {
            outrun.Debug.init.log( 'Init game engine' );

            this.engine = new outrun.Engine();
            this.engine.init( this.onEngineInitCompleted );
        }

        /** ************************************************************************************************************
        *   Changes to the specified level.
        *
        *   @param newLevel The level to change to.
        ***************************************************************************************************************/
        public changeToLevel( newLevel:outrun.Stage ) : void
        {
            this.stage = newLevel;
            this.stage.init();
        }

        /** ************************************************************************************************************
        *   Being invoked when the game engine is fully initialized.
        ***************************************************************************************************************/
        private onEngineInitCompleted = () :void =>
        {
            outrun.Debug.init.log( 'Game engine fully initialized' );

            // switch to initial level and startGameLoop the game loop
            this.changeToLevel( new outrun.LevelTest() );
            this.startGameLoop();
        };

        /** ************************************************************************************************************
        *   Starts the game loop.
        ***************************************************************************************************************/
        private startGameLoop() : void
        {
            requestAnimationFrame( this.tick );
        }

        /** ************************************************************************************************************
        *   Performs one tick of the game loop.
        ***************************************************************************************************************/
        private tick = () :void =>
        {
            outrun.Main.game.engine.fpsMeter.tickStart();

            this.checkGlobalKeys();
            this.update( outrun.SettingEngine.STEP );
            this.draw
            (
                this.engine.canvasSystem.getCanvasContext(),
                this.engine.canvasSystem.getResolution()
            );

            outrun.Main.game.engine.fpsMeter.tick();

            requestAnimationFrame( this.tick );
        };

        /** ************************************************************************************************************
        *   Updates the game world.
        *
        *   @param dt The delta time to update the game.
        ***************************************************************************************************************/
        private update( dt:number ) : void
        {
            this.stage.update( dt );
        }

        /** ************************************************************************************************************
        *   Checks and performs global keys.
        ***************************************************************************************************************/
        private checkGlobalKeys() : void
        {
            if ( outrun.Main.game.engine.keySystem.isPressed( outrun.KeyCodes.KEY_1 ) )
            {
                outrun.Main.game.engine.keySystem.setNeedsRelease( outrun.KeyCodes.KEY_1 );
                this.changeToLevel( new outrun.LevelTest() );
            }

            if ( outrun.Main.game.engine.keySystem.isPressed( outrun.KeyCodes.KEY_2 ) )
            {
                outrun.Main.game.engine.keySystem.setNeedsRelease( outrun.KeyCodes.KEY_2 );
                this.changeToLevel( new outrun.LevelPreset() );
            }
        }

        /** ************************************************************************************************************
        *   Renders the current tick of the legacy game.
        *
        *   @param ctx        The 2D drawing context.
        *   @param resolution The scaling factor for all images to draw.
        ***************************************************************************************************************/
        private draw( ctx:CanvasRenderingContext2D, resolution:number ) : void
        {
            // clear canvas
            ctx.clearRect( 0, 0, this.engine.canvasSystem.getWidth(), this.engine.canvasSystem.getHeight() );

            // draw stage
            this.stage.draw( ctx, resolution );

            // draw HUD?

        }
    }
