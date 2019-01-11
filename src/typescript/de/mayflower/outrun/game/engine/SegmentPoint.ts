
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one point (start or end) of one road segment.
    *******************************************************************************************************************/
    export class SegmentPoint
    {
        private     readonly    world                           :outrun.Vector             = null;

        private     readonly    screen                          :outrun.Vector              = null;

        private     readonly    camera                          :outrun.Vector             = null;

        public constructor( world:outrun.Vector )
        {
            this.world  = world;
            this.screen = new outrun.Vector( 0, 0 );
            this.camera = new outrun.Vector( 0, 0 );
        }

        public getWorld() : outrun.Vector
        {
            return this.world;
        }

        public getScreen() : outrun.Vector
        {
            return this.screen;
        }

        public getCamera() : outrun.Vector
        {
            return this.camera;
        }

        public static project
        (
            p           :outrun.SegmentPoint,
            cameraX     :number,
            cameraY     :number,
            cameraZ     :number,
            cameraDepth :number,
            width       :number,
            height      :number,
            roadWidth   :number
        )
        : void
        {
            p.camera.x     = (p.world.x || 0) - cameraX;
            p.camera.y     = (p.world.y || 0) - cameraY;
            p.camera.z     = (p.world.z || 0) - cameraZ;

            p.screen.scale = cameraDepth / p.camera.z;
            p.screen.x     = Math.round( ( width  / 2 ) + ( p.screen.scale * p.camera.x  * width  / 2 ) );
            p.screen.y     = Math.round( ( height / 2 ) - ( p.screen.scale * p.camera.y  * height / 2 ) );
            p.screen.w     = Math.round(                  ( p.screen.scale * roadWidth   * width  / 2 ) );
        }
    }
