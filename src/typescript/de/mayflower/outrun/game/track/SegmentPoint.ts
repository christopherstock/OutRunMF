
    import * as outrun from '../..'

    /** ****************************************************************************************************************
    *   Represents one point (startGameLoop or end) of one road segment.
    *******************************************************************************************************************/
    export class SegmentPoint
    {
        /** Segment's world coordinate. */
        private     readonly    worldVector                         :outrun.Vector             = null;
        /** Segment's screen projection coordinate. */
        private     readonly    screenVector                        :outrun.Vector              = null;
        /** Segment's camera projection coordinate. */
        private     readonly    playerVector                        :outrun.Vector             = null;

        public constructor( world:outrun.Vector )
        {
            this.worldVector  = world;
            this.screenVector = new outrun.Vector( 0, 0, 0 );
            this.playerVector = new outrun.Vector( 0, 0, 0 );
        }

        public getWorld() : outrun.Vector
        {
            return this.worldVector;
        }

        public getScreen() : outrun.Vector
        {
            return this.screenVector;
        }

        public getPlayer() : outrun.Vector
        {
            return this.playerVector;
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

            this.playerVector.x     = this.worldVector.x - playerX;
            this.playerVector.y     = this.worldVector.y - playerY;
            this.playerVector.z     = this.worldVector.z - playerZ;

            this.screenVector.scale = ( cameraDepth / this.playerVector.z );

            this.screenVector.x     = Math.round
            (
                ( width  / 2 )
                + ( this.screenVector.scale * this.playerVector.x * width / 2 )
            );
            this.screenVector.y     = Math.round
            (
                ( height / 2 )
                - ( this.screenVector.scale * this.playerVector.y  * height / 2 )
            );
            this.screenVector.w     = Math.round
            (
                ( this.screenVector.scale * roadWidth * width / 2 )
            );
        }
    }
