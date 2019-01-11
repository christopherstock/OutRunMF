
    /** ****************************************************************************************************************
    *   Represents one obstacle.
    *******************************************************************************************************************/
    export class Obstacle
    {
        private             readonly    sprite                      :string                 = null;

        private             readonly    x                           :number                 = null;

        public constructor( source:string, x:number )
        {
            this.sprite = source;
            this.x      = x;
        }

        public getSprite() : string
        {
            return this.sprite;
        }

        public getX() : number
        {
            return this.x;
        }
    }
