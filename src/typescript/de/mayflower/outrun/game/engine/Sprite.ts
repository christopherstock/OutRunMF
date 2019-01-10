
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one sprite.
    *
    *   TODO add private!
    *******************************************************************************************************************/
    export class Sprite
    {
        public                          source                          :string                     = null;

        public                          offset                          :number                     = null;

        public constructor( source:string, offset:number )
        {
            this.source = source;
            this.offset = offset;
        }
    }
