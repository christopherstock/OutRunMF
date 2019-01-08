
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one point (start or end) of one road segment.
    *
    *   TODO add private!
    *******************************************************************************************************************/
    export class SegmentPoint
    {
        // TODO Add class Vector

        public                  world                           :outrun.Vector             = null;

        public                  screen                          :outrun.Vector              = null;

        public                  camera                          :outrun.Vector             = null;

        public constructor( world:outrun.Vector )
        {
            this.world  = world;
            this.screen = new outrun.Vector( 0, 0 );
            this.camera = new outrun.Vector( 0, 0 );
        }
    }

