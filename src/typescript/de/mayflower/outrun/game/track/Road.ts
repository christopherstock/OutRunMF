
    /** ****************************************************************************************************************
    *   Constants for customizing road sections.
    *
    *   TODO refactor to enums
    *   TODO create enums for CURVE_LEFT / CURVE_RIGHT and HILL_UP / HILL_DOWN
    *******************************************************************************************************************/
    export abstract class Road
    {
        /** Specifies attributes for the length of the road. */
        public      static      readonly        LENGTH              :any                    =
        {
            NONE:        0,
            MINIMUM:     10,
            SHORT:       25,
            MEDIUM:      50,
            LONG:        100,
            DOUBLE_LONG: 200,
        };

        /** Specifies attributes for the height of hills. */
        public      static      readonly        HILL                :any                    =
        {
            NONE:    0,
            MINIMUM: 10,
            LOW:     20,
            MEDIUM:  40,
            HIGH:    60,
            EXTREME: 100,
        };

        /** Specifies attributes for the severity of curves. */
        public      static      readonly        CURVE               :any                    =
        {
            NONE:    0,
            EASY:    2,
            MEDIUM:  4,
            HARD:    6,
            TIGHT:   8,
            EXTREME: 10,
        }
    }
