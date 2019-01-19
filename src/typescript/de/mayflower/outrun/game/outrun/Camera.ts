
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   The legacy camera.
    *
    *   TODO remove!
    *******************************************************************************************************************/
    export class Camera
    {
        /** z distance camera is from screen (computed) */
        private     readonly    depth               :number                     = null;

        public constructor()
        {
            this.depth = ( 1 / Math.tan( ( outrun.SettingEngine.CAMERA_FIELD_OF_VIEW / 2 ) * Math.PI / 180 ) );
        }

        public getDepth() : number
        {
            return this.depth;
        }

        public getStartupPlayerZ() : number
        {
            return ( outrun.SettingEngine.CAMERA_HEIGHT * this.getDepth() );
        }
    }
