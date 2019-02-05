
    require( '../css/global.less' );

    import * as outrun from '..';

    /** ****************************************************************************************************************
    *   The main class containing the point of entry and a single game instance.
    *
    *   ==============================
    *   TODO Refactorings
    *   ==============================
    *   TODO Different lane count for different segments
    *   TODO Different road widths and lanes per segment?
    *   TODO Stage.createCars() remove duplicated car arrays in Stage and Segment? Add car.currentSegment ?
    *   TODO Extract level (also cars and sprites?) creation to separate Factory / StageBuilder class?
    *   TODO Save sprites in Stage and add field 'segment' to sprite?
    *
    *   ==============================
    *   TODO Game creation
    *   ==============================
    *   TODO Enable additional segment forms left or right of the road (seaside?).
    *   TODO Add new images and sprites and alter existent ones.
    *   TODO Stage.createCars: create speed map for all cars.
    *   TODO Add sound effects?
    *   TODO Create new segments? Enable widening and narrowing the road etc.?
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
