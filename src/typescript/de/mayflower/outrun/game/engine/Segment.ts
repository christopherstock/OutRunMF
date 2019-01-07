
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one segment of the road.
    *
    *   TODO add private!
    *******************************************************************************************************************/
    export class Segment
    {
        // TODO add class GamePoint?
        public                          p1              :any                = null;

        public                          p2              :any                = null;

        public                          index           :any                = null;

        // TODO Add class curve
        public                          curve           :any                = null;

        // TODO create class Sprite
        public                          sprites         :outrun.Sprite[]    = null;

        public                          cars            :outrun.Car[]       = null;

        public                          color           :any                = null;




    }
