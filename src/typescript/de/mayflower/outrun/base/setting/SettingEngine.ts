
    /** ****************************************************************************************************************
    *   Specifies all settings for the game engine.
    *******************************************************************************************************************/
    // tslint:disable:max-line-length
    export class SettingEngine
    {
        /** Minimum canvas width. */
        public  static  readonly    CANVAS_MIN_WIDTH            :number             = 480;
        /** Minimum canvas height. */
        public  static  readonly    CANVAS_MIN_HEIGHT           :number             = 320;

        /** Maximum canvas width or 0 to disable. */
        public  static  readonly    CANVAS_MAX_WIDTH            :number             = 800;
        /** Maximum canvas height or 0 to disable. */
        public  static  readonly    CANVAS_MAX_HEIGHT           :number             = 528;

        /** how many 'update' frames per second */
        public  static  readonly    FPS                         :number             = 60;
        /** how long is each frame (in seconds) */
        public  static  readonly    STEP                        :number             = 1 / SettingEngine.FPS;

        /** The reference sprite width should be 1/3rd the (half-)roadWidth. */
        public  static  readonly    SPRITE_SCALE                :number             = 0.3 * (1 / 80);

        /** angle (degrees) for field of view */
        public  static  readonly    CAMERA_FIELD_OF_VIEW        :number             = 100;
        /** z height of camera */
        public  static  readonly    CAMERA_HEIGHT               :number             = 1000;

        /** number of segments to draw */
        public  static  readonly    DRAW_DISTANCE               :number             = 300;

        /** The relative path from index.html where all image resources reside. */
        public  static  readonly    PATH_IMAGE                  :string             = 'res/image/legacy/';
    }
