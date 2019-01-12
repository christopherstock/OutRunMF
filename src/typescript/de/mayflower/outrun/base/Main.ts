
    require( '../css/global.less' );

    import * as outrun from '..';

    /** ****************************************************************************************************************
    *   The main class containing the point of entry and a single game instance.
    *
    *   ==============================
    *   TODO Refactorings
    *   ==============================
    *   TODO Remove/Improve Z variable for Camera and constant Z variable for player!
    *   TODO Stage.createCars() remove duplicated car arrays in Stage and Segment?
    *   TODO Change 'Obstacle' to class 'Deco'.
    *   TODO Introduce sprite field for all game objects!
    *   TODO Create abstract parent class 'GameObject'.
    *
    *   ==============================
    *   TODO Game creation
    *   ==============================
    *   TODO Different road widths and lanes per level!
    *   TODO Enable additional segment forms left or right of the road (seaside?).
    *   TODO New images and sprites.
    *   TODO New stage system for creating different stages.
    *   TODO Extract level creation to separate Factory / StageBuilder class?
    *   TODO Add sound effects?
    *   TODO Combine different road widths in one level?? ( different lane counts etc.)
    *   TODO prune finsh line?
    *   TODO Create new segments? Widening and narrowing the road etc.?
    *   TODO Stage.createCars: create speed map for all cars.
    *
    *   ==============================
    *   TODO Secondary / Decorative features
    *   ==============================
    *   TODO Enable fullscreen mode.
    *   TODO Add intro
    *   TODO Add main menu?
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
            outrun.HTML.setTitle(   outrun.SettingGame.APP_TITLE   );
            outrun.HTML.setFavicon( outrun.SettingGame.APP_FAVICON );

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
