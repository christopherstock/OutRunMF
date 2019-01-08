
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one segment of the road.
    *
    *   TODO add private!
    *******************************************************************************************************************/
    export class Segment
    {
        public                          p1              :outrun.SegmentPoint    = null;

        public                          p2              :outrun.SegmentPoint    = null;

        public                          index           :any                    = null;

        // TODO Add class curve
        public                          curve           :any                    = null;

        // TODO create class Sprite
        public                          sprites         :outrun.Sprite[]        = null;

        public                          cars            :outrun.Car[]           = null;

        // TODO add type ..
        public                          color           :any                    = null;
    }
