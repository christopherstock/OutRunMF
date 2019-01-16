
    /** ****************************************************************************************************************
    *   Specifies the colors for one road segment.
    *******************************************************************************************************************/
    export class SegmentColor
    {
        /** The color for the road stripe. */
        public                          road                                :string                     = null;
        /** The offroad color. */
        public                          offroad                             :string                     = null;
        /** The color for the rumble stripe. */
        public                          rumble                              :string                     = null;
        /** The color for the lane stripe. */
        public                          lane                                :string                     = null;

        public constructor( road:string, offroad:string, rumble:string, lane:string )
        {
            this.road    = road;
            this.offroad = offroad;
            this.rumble  = rumble;
            this.lane    = lane;
        }
    }
