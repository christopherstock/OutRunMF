
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   The parent class of all game objects.
    *******************************************************************************************************************/
    export abstract class GameObject
    {
        /** The image system for this game object. */
        protected                           imageSystem                 :outrun.ImageSystem         = null;
        /** The image that represents this game object. */
        protected                           image                       :HTMLImageElement           = null;
        /** The width of this game object. */
        protected           readonly        width                       :number                     = 0;

        protected constructor( imageSystem:outrun.ImageSystem, image:HTMLImageElement )
        {
            this.imageSystem = imageSystem;
            this.image       = image;
            this.width       = ( this.image.width * outrun.SettingEngine.SPRITE_SCALE );
        }

        public getWidth() : number
        {
            return this.width;
        }

        protected setSprite( sprite:string ) : void
        {
            this.image = this.imageSystem.getImage( sprite );

            // ignore possible new image width!
        }
    }
