
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one impartial and CPU-driven car.
    *
    *   TODO add private!
    *******************************************************************************************************************/
    export class Car
    {
        public                          offset                          :number                     = 0;

        public                          z                               :number                     = 0;

        public                          percent                         :number                     = 0;

        public                          speed                           :number                     = 0;

        // TODO add class Sprite!

        /** The image ID of this car's sprite. TODO to class ImageID? */
        public                          sprite                          :string                     = null;
    }
