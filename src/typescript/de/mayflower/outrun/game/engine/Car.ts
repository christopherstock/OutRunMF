
    /** ****************************************************************************************************************
    *   Represents one impartial and CPU-driven car.
    *
    *   TODO all private!
    *******************************************************************************************************************/
    export class Car
    {
        public                          offset                          :number                     = 0;

        public                          z                               :number                     = 0;

        public                          speed                           :number                     = 0;

        public                          percent                         :number                     = 0;

        /** The image ID of this car's sprite. TODO to class ImageID? */
        private             readonly    sprite                          :string                     = null;

        public constructor( offset:number, z:number, sprite:string, speed:number )
        {
            this.offset  = offset;
            this.z       = z;
            this.sprite  = sprite;
            this.speed   = speed;
        }

        public getSprite() : string
        {
            return this.sprite;
        }
    }
