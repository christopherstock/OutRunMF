
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

        public constructor( worldX:number, worldY:number, worldZ:number )
        {
            this.worldVector  = new outrun.Vector( worldX, worldY, worldZ );
            this.screenVector = new outrun.Vector( 0,      0,      0      );
            this.playerVector = new outrun.Vector( 0,      0,      0      );
        }

        /** ************************************************************************************************************
        *   Returns the world vector.
        *
        *   @return The current world vector.
        ***************************************************************************************************************/
        public getWorld() : outrun.Vector
        {
            return this.worldVector;
        }

        /** ************************************************************************************************************
        *   Returns the screen vector.
        *
        *   @return The current screen vector.
        ***************************************************************************************************************/
        public getScreen() : outrun.Vector
        {
            return this.screenVector;
        }

        /** ************************************************************************************************************
        *   Returns the player vector.
        *
        *   @return The current player vector.
        ***************************************************************************************************************/
        public getPlayer() : outrun.Vector
        {
            return this.playerVector;
        }

        /** ************************************************************************************************************
        *   Updates the projection points for this segment.
        ***************************************************************************************************************/
        public updateProjectionPoints
        (
            canvasSystem :outrun.CanvasSystem,
            playerX      :number,
            playerY      :number,
            playerZ      :number,
            cameraDepth  :number,
            roadWidth    :number
        )
        : void
        {
            const width  :number = canvasSystem.getWidth();
            const height :number = canvasSystem.getHeight();

            this.playerVector.x     = this.worldVector.x - playerX;
            this.playerVector.y     = this.worldVector.y - playerY;
            this.playerVector.z     = this.worldVector.z - playerZ;

            this.screenVector.scale = ( cameraDepth / this.playerVector.z );

            this.screenVector.x = Math.round
            (
                ( width  / 2 )
                + ( this.screenVector.scale * this.playerVector.x * width / 2 )
            );
            this.screenVector.y = Math.round
            (
                ( height / 2 )
                - ( this.screenVector.scale * this.playerVector.y  * height / 2 )
            );
            this.screenVector.w = Math.round
            (
                ( this.screenVector.scale * roadWidth * width / 2 )
            );
        }
    }
