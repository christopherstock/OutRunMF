
    /** ****************************************************************************************************************
    *   The parent class of all game objects.
    *******************************************************************************************************************/
    export abstract class GameObject
    {
        /** The image ID of this car's sprite. TODO save image instead of sprite? */
        protected                           sprite                          :string                 = null;

        protected constructor( sprite:string )
        {
            this.sprite = sprite;
        }

        protected setSprite( sprite:string ) : void
        {
            this.sprite = sprite;
        }
    }
