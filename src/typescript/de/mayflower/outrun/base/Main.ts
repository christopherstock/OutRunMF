
    require( '../css/global.less' );

    import * as outrun from '..';

    /** ****************************************************************************************************************
    *   The main class containing the point of entry and a single game instance.
    *
    *   =====================
    *   TODO Primal
    *   =====================
    *   TODO Create a possibility to change levels via debug keys 1-x.
    *   TODO Add FPS counter via Lib.
    *
    *   TODO Add class curve?
    *   TODO Clear all TODOs.
    *
    *   ==============================
    *   TODO Secondary - game creation
    *   ==============================
    *   TODO Enable additional segment forms left or right of the road (seaside?).
    *   TODO New images and sprites.
    *   TODO New stage system for creating different stages.
    *   TODO Extract level creation to separate Factory / StageBuilder class?
    *   TODO Add sound effects?
    *   TODO Add main menu?
    *   TODO Combine different road widths? ( different lane counts etc.)
    *   TODO prune finsh line?
    *   TODO Enable fullscreen mode.
    *
    *   =====================
    *   TODO Code Quality
    *   =====================
    *   TODO Ask CSP for a code review.
    *******************************************************************************************************************/
    export class Main
    {
        /** The singleton instance of the game. */
        public      static          game                    :outrun.Game                = null;

        /** ************************************************************************************************************
        *   This method is invoked when the application starts.
        ***************************************************************************************************************/
        public static main() : void
        {
            outrun.HTML.setTitle( outrun.SettingGame.APP_TITLE );
            outrun.HTML.setFavicon( 'favicon.ico' );

            Main.acclaim();

            Main.game = new outrun.Game();
            Main.game.init();
        }

        /** ************************************************************************************************************
        *   Acclaims the debug console.
        ***************************************************************************************************************/
        private static acclaim() : void
        {
            outrun.Debug.acclaim.log( outrun.SettingGame.APP_TITLE );

            outrun.Debug.acclaim.log( outrun.Version.getCurrent() );
            outrun.Debug.acclaim.log();
        }
    }
