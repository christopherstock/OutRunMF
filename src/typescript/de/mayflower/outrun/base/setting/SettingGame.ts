
    /* eslint-disable max-len */

    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   Specifies all adjustments for the gameplay.
    *******************************************************************************************************************/
    export class SettingGame
    {
        /** The application title. */
        public  static  readonly    APP_TITLE                   :string             = 'Mayflower™ OutRun, v.0.1 MVP';
        /** The application favicon. */
        public  static  readonly    APP_FAVICON                 :string             = 'favicon.ico';

        /** centrifugal force multiplier when going around curves */
        public  static  readonly    CENTRIFUGAL                 :number             = 0.3;

        /** background sky layer scroll speed when going around curve (or up hill) */
        public  static  readonly    SKY_SPEED                   :number             = 0.001;
        /** background hill layer scroll speed when going around curve (or up hill) */
        public  static  readonly    HILL_SPEED                  :number             = 0.002;
        /** background tree layer scroll speed when going around curve (or up hill) */
        public  static  readonly    TREE_SPEED                  :number             = 0.003;

        /** actually half the roads width, easier math if the road spans from -roadWidth to +roadWidth. */
        public  static  readonly    HALF_ROAD_DRAWING_WIDTH     :number             = 2000;
        /** default number of lanes */
        public  static  readonly    DEFAULT_LANE_COUNT          :number             = 4;

        /** length of a single segment */
        public  static  readonly    SEGMENT_LENGTH              :number             = 200;
        /** number of segments per red/white strip */
        public  static  readonly    RUMBLE_LENGTH               :number             = 3;

        /** exponential fog density */
        public  static  readonly    FOG_DENSITY                 :number             = 5;

        /** top speed (ensure we can't move more than 1 segment in a single frame to make collision detection easier) */
        public  static  readonly    PLAYER_MAX_SPEED            :number             = (
            SettingGame.SEGMENT_LENGTH / outrun.SettingEngine.STEP
        );
        /** maximum multiplier for player bouncing */
        public  static  readonly    PLAYER_MAX_BOUNCE           :number             = 1.5;
        /** acceleration rate - tuned until it 'felt' right */
        public  static  readonly    PLAYER_ACCELERATION_RATE    :number             = SettingGame.PLAYER_MAX_SPEED / 5;
        /** deceleration rate when braking */
        public  static  readonly    PLAYER_BREAKING_RATE        :number             = -SettingGame.PLAYER_MAX_SPEED;

        /** limit when off road deceleration no longer applies (minimum speed when driving off road). */
        public  static  readonly    SPEED_LIMIT_OFF_ROAD        :number             = SettingGame.PLAYER_MAX_SPEED / 4;

        /** 'natural' deceleration rate when neither accelerating, nor braking */
        public  static  readonly    DECELERATION_RATE_NATURAL   :number             = -SettingGame.PLAYER_MAX_SPEED / 5;
        /** speed multiplier for off road - off road deceleration is somewhere in between */
        public  static  readonly    DECELERATION_RATE_OFF_ROAD  :number             = -SettingGame.PLAYER_MAX_SPEED / 2;
    }
