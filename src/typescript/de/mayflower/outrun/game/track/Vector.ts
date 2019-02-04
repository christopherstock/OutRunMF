
    /** ****************************************************************************************************************
    *   Represents one point in 3D space.
    *******************************************************************************************************************/
    export class Vector
    {
        /** Vector coordinate X. */
        public                  x                               :number             = 0;
        /** Vector coordinate Y. */
        public                  y                               :number             = 0;
        /** Vector coordinate Z. */
        public                  z                               :number             = 0;

        /** Current projection scale for this point. */
        public                  scale                           :number             = 0;

        /** Unknown field .. width ? */
        public                  w                               :number             = 0;

        /** ************************************************************************************************************
        *   Creates a new point in 3D space.
        *
        *   @param x Vector coordinate X.
        *   @param y Vector coordinate Y.
        *   @param z Vector coordinate Z.
        ***************************************************************************************************************/
        public constructor( x:number, y:number, z:number )
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
