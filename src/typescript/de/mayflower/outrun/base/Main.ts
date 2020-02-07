
    import * as outrun from '..';

    /** ****************************************************************************************************************
    *   The main class containing the point of entry and a single game instance.
    *
    *   ==============================
    *   TODO Game creation
    *   ==============================
    *   TODO Stage.createCars: create speed map for all cars.
    *   TODO Add new images and sprites and alter existent ones.
    *
    *   TODO Different road widths per segment?
    *   TODO Enable additional segment forms left or right of the road (seaside?).
    *   TODO Create new segments? Enable widening and narrowing the road etc.?
    *   TODO Add sound effects?
    *
    *   ==============================
    *   TODO Secondary features
    *   ==============================
    *   TODO Enable fullscreen mode.
    *   TODO Add intro.
    *   TODO Add main menu.
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
