
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   Represents one obstacle.
    *******************************************************************************************************************/
    export class Obstacle extends outrun.GameObject
    {
        private             readonly    x                           :number                 = null;

        public constructor( sprite:string, x:number )
        {
            super( sprite );

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
