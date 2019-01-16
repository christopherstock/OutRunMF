
    import * as outrun from '../../..';

    /** ****************************************************************************************************************
    *   Specifies the different colors for one road segment.
    *******************************************************************************************************************/
    export class SegmentColorSet
    {
        /** The light color for the segment. */
        public                          light                               :outrun.SegmentColor        = null;
        /** The dark color for the segment. */
        public                          dark                                :outrun.SegmentColor        = null;

        public constructor( light:outrun.SegmentColor, dark:outrun.SegmentColor )
        {
            this.light = light;
            this.dark  = dark;
        }
    }
