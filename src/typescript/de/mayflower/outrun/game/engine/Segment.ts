
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

        public                          sprites         :outrun.Sprite[]        = null;

        public                          cars            :outrun.Car[]           = null;

        public                          color           :outrun.ColorCombo      = null;

        public                          fogColor        :string                 = null;

        public                          looped          :boolean                = false;

        public                          fog             :number                 = null;

        public                          clip            :number                 = 0;

        public                          curve           :number                 = 0;

        public                          index           :number                 = 0;
    }
