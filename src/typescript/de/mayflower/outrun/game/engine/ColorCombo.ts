
    /** ****************************************************************************************************************
    *   Represents one color combination for one stripe of the road.
    *
    *   TODO all private!
    *******************************************************************************************************************/
    export class ColorCombo
    {
        public                          road                                :string                     = null;

        public                          grass                               :string                     = null;

        public                          rumble                              :string                     = null;

        public                          lane                                :string                     = null;

        public constructor( road:string, grass:string, rumble:string, lane:string )
        {
            this.road   = road;
            this.grass  = grass;
            this.rumble = rumble;
            this.lane   = lane;
        }
    }
