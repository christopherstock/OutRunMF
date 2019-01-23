
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one point (startGameLoop or end) of one road segment.
    *******************************************************************************************************************/
    export class SegmentPoint
    {
        /** Segment's world coordinate. */
        private     readonly    world                           :outrun.Vector             = null;
        /** Segment's screen projection coordinate. */
        private     readonly    screen                          :outrun.Vector              = null;
        /** Segment's camera projection coordinate. */
        private     readonly    player                          :outrun.Vector             = null;

        public constructor( world:outrun.Vector )
        {
            this.world  = world;
            this.screen = new outrun.Vector( 0, 0 );
            this.player = new outrun.Vector( 0, 0 );
        }

        public getWorld() : outrun.Vector
        {
            return this.world;
        }

        public getScreen() : outrun.Vector
        {
            return this.screen;
        }

        public getPlayer() : outrun.Vector
        {
            return this.player;
        }

        public updateProjectionPoints
        (
            playerX     :number,
            playerY     :number,
            playerZ     :number,
            cameraDepth :number,
            roadWidth   :number
        )
        : void
        {
            const width  :number = outrun.Main.game.engine.canvasSystem.getWidth();
            const height :number = outrun.Main.game.engine.canvasSystem.getHeight();

            this.player.x     = ( this.world.x || 0 ) - playerX;
            this.player.y     = ( this.world.y || 0 ) - playerY;
            this.player.z     = ( this.world.z || 0 ) - playerZ;

            this.screen.scale = ( cameraDepth / this.player.z );

            this.screen.x     = Math.round( ( width  / 2 ) + ( this.screen.scale * this.player.x  * width  / 2 ) );
            this.screen.y     = Math.round( ( height / 2 ) - ( this.screen.scale * this.player.y  * height / 2 ) );
            this.screen.w     = Math.round(                  ( this.screen.scale * roadWidth      * width  / 2 ) );
        }
    }
