
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one point (startGameLoop or end) of one road segment.
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

        public updateProjectionPoints
        (
            cameraX     :number,
            cameraY     :number,
            cameraZ     :number,
            cameraDepth :number,
            roadWidth   :number
        )
        : void
        {
            const width  :number = outrun.Main.game.engine.canvasSystem.getWidth();
            const height :number = outrun.Main.game.engine.canvasSystem.getHeight();

            this.camera.x     = ( this.world.x || 0 ) - cameraX;
            this.camera.y     = ( this.world.y || 0 ) - cameraY;
            this.camera.z     = ( this.world.z || 0 ) - cameraZ;

            this.screen.scale = ( cameraDepth / this.camera.z );

            this.screen.x     = Math.round( ( width  / 2 ) + ( this.screen.scale * this.camera.x  * width  / 2 ) );
            this.screen.y     = Math.round( ( height / 2 ) - ( this.screen.scale * this.camera.y  * height / 2 ) );
            this.screen.w     = Math.round(                  ( this.screen.scale * roadWidth      * width  / 2 ) );
        }
    }
