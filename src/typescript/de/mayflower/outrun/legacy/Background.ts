
    import * as outrun from '..';

    /** ****************************************************************************************************************
    *   The legacy stage background.
    *******************************************************************************************************************/
    export class Background
    {
        /** current sky scroll offset */
        private                 skyOffset           :number                     = 0;
        /** current hill scroll offset */
        private                 hillOffset          :number                     = 0;
        /** current tree scroll offset */
        private                 treeOffset          :number                     = 0;

        /** ************************************************************************************************************
        *   Draws the background for a specific scene.
        *
        *   @param ctx     The canvas rendering context to draw onto.
        *   @param playerY The player position Y for assigning the Y position of this background.
        *
        *   TODO remove resolution here!
        ***************************************************************************************************************/
        public draw( ctx:CanvasRenderingContext2D, resolution:number, playerY:number ) : void
        {
            outrun.Drawing2D.background( ctx, outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), outrun.ImageFile.SKY,  this.skyOffset,  resolution * outrun.SettingGame.SKY_SPEED  * playerY );
            outrun.Drawing2D.background( ctx, outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), outrun.ImageFile.HILL, this.hillOffset, resolution * outrun.SettingGame.HILL_SPEED * playerY );
            outrun.Drawing2D.background( ctx, outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), outrun.ImageFile.TREE, this.treeOffset, resolution * outrun.SettingGame.TREE_SPEED * playerY );
        }

        // TODO introduce class Camera

        public updateOffsets( playerSegment:outrun.Segment, camera:any, startPosition:number ) : void
        {
            this.skyOffset  = outrun.MathUtil.increase( this.skyOffset,  outrun.SettingGame.SKY_SPEED  * playerSegment.curve * (camera.getZ() - startPosition) / outrun.SettingGame.SEGMENT_LENGTH, 1 );
            this.hillOffset = outrun.MathUtil.increase( this.hillOffset, outrun.SettingGame.HILL_SPEED * playerSegment.curve * (camera.getZ() - startPosition) / outrun.SettingGame.SEGMENT_LENGTH, 1 );
            this.treeOffset = outrun.MathUtil.increase( this.treeOffset, outrun.SettingGame.TREE_SPEED * playerSegment.curve * (camera.getZ() - startPosition) / outrun.SettingGame.SEGMENT_LENGTH, 1 );
        }
    }
