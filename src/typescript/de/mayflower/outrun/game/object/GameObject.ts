
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   The parent class of all game objects.
    *******************************************************************************************************************/
    export abstract class GameObject
    {
        /** The image this game object's sprite. */
        protected                           image                       :HTMLImageElement           = null;
        /** The width of this game object. */
        protected           readonly        width                       :number                     = 0;

        protected constructor( image:HTMLImageElement )
        {
            this.image = image;
            this.width = ( this.image.width * outrun.SettingEngine.SPRITE_SCALE );
        }

        public getWidth() : number
        {
            return this.width;
        }

        protected setSprite( sprite:string ) : void
        {
            this.image = outrun.Main.game.engine.imageSystem.getImage( sprite );

            // ignore possible new image width!
        }
    }
