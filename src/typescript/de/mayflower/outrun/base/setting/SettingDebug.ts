
    /** ****************************************************************************************************************
    *   Specifies all debug adjustments for the application.
    *******************************************************************************************************************/
    // tslint:disable:max-line-length
    export class SettingDebug
    {
        /** The global switch for the debug mode. */
        public  static  readonly    DEBUG_MODE                              :boolean            = true;

        // noinspection PointlessBooleanExpressionJS
        /** Show FPS counter. */
        public  static  readonly    SHOW_FPS                                :boolean            = ( true && SettingDebug.DEBUG_MODE );

        // noinspection PointlessBooleanExpressionJS, JSUnusedGlobalSymbols
        /** Disables all sounds. */
        public  static  readonly    DISABLE_SOUND                           :boolean            = ( true && SettingDebug.DEBUG_MODE );
    }
