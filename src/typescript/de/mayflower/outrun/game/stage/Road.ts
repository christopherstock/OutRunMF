
    /** ****************************************************************************************************************
    *   Constants for customizing road sections.
    *******************************************************************************************************************/
    export abstract class Road
    {
        /** Specifies attributes for the length of the road. */
        public      static      readonly        LENGTH              :any                    =
        {
            NONE:        0,
            SHORT:       25,
            MEDIUM:      50,
            LONG:        100,
            DOUBLE_LONG: 200,
        };

        /** Specifies attributes for the height of hills. */
        public      static      readonly        HILL                :any                    =
        {
            NONE:   0,
            LOW:    20,
            MEDIUM: 40,
            HIGH:   60,
        };

        /** Specifies attributes for the severity of curves. */
        public      static      readonly        CURVE               :any                    =
        {
            NONE:   0,
            EASY:   2,
            MEDIUM: 4,
            HARD:   6,
        }
    }
