
    import * as outrun from '..'

    /** ****************************************************************************************************************
    *   The main legacy game engine.
    *******************************************************************************************************************/
    // tslint:disable:max-line-length
    export class OutRun
    {
        /** The game stage. */
        public                  stage               :outrun.Stage                 = null;

        /** The canvas system. */
        private     readonly    canvasSystem        :outrun.CanvasSystem          = null;

        /** ************************************************************************************************************
        *   Creates a new legacy game system.
        *
        *   @param canvasSystem The canvas system to use for rendering.
        ***************************************************************************************************************/
        public constructor( canvasSystem:outrun.CanvasSystem )
        {
            this.canvasSystem = canvasSystem;
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
        *   Starts the legacy game.
        ***************************************************************************************************************/
        public start() : void
        {
/*
            const frame:()=>void = (): void =>
            {
                this.update( this.STEP );
                this.draw();

                requestAnimationFrame( frame );
            };
            frame();
*/
            // TODO remove! check FPS
            let now  :number = null;
            let last :number = new Date().getTime();
            let dt   :number = 0;
            let gdt  :number = 0;

            const frame :()=>void = ():void =>
            {
                this.checkGlobalKeys();

                now = new Date().getTime();

                // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
                dt = Math.min( 1, ( now - last ) / 1000 );

                gdt = gdt + dt;
                while (gdt > outrun.SettingGame.STEP) {
                    gdt = gdt - outrun.SettingGame.STEP;

                    this.update(outrun.SettingGame.STEP);
                }
                this.draw( this.canvasSystem.getCanvasContext(), this.canvasSystem.getResolution() );

                last = now;
                requestAnimationFrame( frame );
            };
            frame(); // lets get this party started
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
            if ( outrun.Main.game.keySystem.isPressed( outrun.KeyCodes.KEY_1 ) )
            {
                outrun.Main.game.keySystem.setNeedsRelease( outrun.KeyCodes.KEY_1 );
                this.changeToLevel( new outrun.LevelTest() );
            }

            if ( outrun.Main.game.keySystem.isPressed( outrun.KeyCodes.KEY_2 ) )
            {
                outrun.Main.game.keySystem.setNeedsRelease( outrun.KeyCodes.KEY_2 );
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
            ctx.clearRect( 0, 0, this.canvasSystem.getWidth(), this.canvasSystem.getHeight() );

            // draw stage
            this.stage.draw( ctx, resolution );

            // draw HUD?

        }
    }
