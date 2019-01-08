
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one point (start or end) of one road segment.
    *
    *   TODO add private!
    *******************************************************************************************************************/
    export class SegmentPoint
    {
        // TODO Add class Vector

        public                  screen                          :any                = null;

        public                  world                           :any                = null;

        public                  camera                          :any                = null;

        public constructor( world:any )
        {
            this.world = world;



        }
    }
