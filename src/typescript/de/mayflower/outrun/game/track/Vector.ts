
    /** ****************************************************************************************************************
    *   Represents one point in 3D space.
    *******************************************************************************************************************/
    export class Vector
    {
        public                  w                               :number             = 0;

        public                  x                               :number             = 0;

        /** The elevation. */
        public                  y                               :number             = 0;

        public                  z                               :number             = 0;

        public                  scale                           :number             = 0;

        public constructor( y:number, z:number )
        {
            this.y = y;
            this.z = z;
        }
    }
