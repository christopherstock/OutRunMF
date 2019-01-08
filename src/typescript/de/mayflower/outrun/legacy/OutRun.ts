
    import * as outrun from '..'

    /** ****************************************************************************************************************
    *   The main legacy game engine.
    *******************************************************************************************************************/
    // tslint:disable:max-line-length
    export class OutRun
    {
        /** The canvas system. */
        private     readonly    canvasSystem        :outrun.CanvasSystem          = null;

        /** The game stage. */
        private                 stage               :outrun.Stage                 = null;

        /** scaling factor to provide resolution independence (computed). TODO to CanvasSystem? */
        private                 resolution          :number                     = null;

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
        *   Resets the legacy game to its initial defaults.
        ***************************************************************************************************************/
        public reset() : void
        {
            // specify canvas resolution according to its current height
            this.resolution = this.canvasSystem.getHeight() / 480;  // TODO outsource to named constant

            // rebuild the stage TODO create enum for different levels?
            this.stage = new outrun.LevelTest();
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
                this.render();

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
                now = new Date().getTime();

                // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
                dt = Math.min(1, (now - last) / 1000);

                gdt = gdt + dt;
                while (gdt > outrun.SettingGame.STEP) {
                    gdt = gdt - outrun.SettingGame.STEP;
                    this.update(outrun.SettingGame.STEP);
                }
                this.render( this.canvasSystem.getCanvasContext() );
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
        *   Renders the current tick of the legacy game.
        *
        *   @param ctx The 2D drawing context.
        ***************************************************************************************************************/
        private render( ctx:CanvasRenderingContext2D ) : void
        {
            // clear canvas
            ctx.clearRect(0, 0, this.canvasSystem.getWidth(), this.canvasSystem.getHeight());

            this.stage.render( ctx, this.resolution );
        }
    }
