
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Creates stage segments.
    *******************************************************************************************************************/
    export abstract class StageFactory
    {
        /** ************************************************************************************************************
        *   TODO create class for road attributes?!
        ***************************************************************************************************************/
        public static readonly ROAD :any =
        {
            LENGTH: { NONE: 0, SHORT: 25, MEDIUM: 50, LONG: 100, DOUBLE_LONG: 200 },
            HILL:   { NONE: 0, LOW:   20, MEDIUM: 40, HIGH: 60  },
            CURVE:  { NONE: 0, EASY:  2,  MEDIUM: 4,  HARD: 6   }
        };

        /** ************************************************************************************************************
        *   Creates something ...
        ***************************************************************************************************************/
        public static create() : void
        {

        }
    }
