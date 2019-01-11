
    /** ****************************************************************************************************************
    *   Represents one sprite.
    *******************************************************************************************************************/
    export class Sprite
    {
        private             readonly    source                          :string                     = null;

        private             readonly    offset                          :number                     = null;

        public constructor( source:string, offset:number )
        {
            this.source = source;
            this.offset = offset;
        }

        public getSource() : string
        {
            return this.source;
        }

        public getOffset() : number
        {
            return this.offset;
        }
    }
