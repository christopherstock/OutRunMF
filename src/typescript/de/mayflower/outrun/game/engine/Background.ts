
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   The stage background.
    *******************************************************************************************************************/
    export class Background
    {
        /** The assigned image for the sky. */
        private     readonly    skyImage            :string                     = null;
        /** The assigned image for the hills. */
        private     readonly    hillImage           :string                     = null;
        /** The assigned image for the trees. */
        private     readonly    treeImage           :string                     = null;

        /** current sky scroll offset */
        private                 skyOffset           :number                     = 0;
        /** current hill scroll offset */
        private                 hillOffset          :number                     = 0;
        /** current tree scroll offset */
        private                 treeOffset          :number                     = 0;

        public constructor( skyImage:string, hillImage:string, treeImage:string )
        {
            this.skyImage  = skyImage;
            this.hillImage = hillImage;
            this.treeImage = treeImage;
        }

        /** ************************************************************************************************************
        *   Draws the background for a specific scene.
        *
        *   @param ctx        The canvas rendering context to draw onto.
        *   @param resolution The resolution to draw the background in.
        *   @param playerY    The player position Y for assigning the Y position of this background.
        ***************************************************************************************************************/
        public draw( ctx:CanvasRenderingContext2D, resolution:number, playerY:number ) : void
        {
            outrun.Drawing2D.background( ctx, outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), this.skyImage,  this.skyOffset,  resolution * outrun.SettingGame.SKY_SPEED  * playerY );
            outrun.Drawing2D.background( ctx, outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), this.hillImage, this.hillOffset, resolution * outrun.SettingGame.HILL_SPEED * playerY );
            outrun.Drawing2D.background( ctx, outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), this.treeImage, this.treeOffset, resolution * outrun.SettingGame.TREE_SPEED * playerY );
        }

        public updateOffsets( playerSegment:outrun.Segment, camera:outrun.Camera, startPosition:number ) : void
        {
            this.skyOffset  = outrun.MathUtil.increase( this.skyOffset,  outrun.SettingGame.SKY_SPEED  * playerSegment.curve * (camera.getZ() - startPosition) / outrun.SettingGame.SEGMENT_LENGTH, 1 );
            this.hillOffset = outrun.MathUtil.increase( this.hillOffset, outrun.SettingGame.HILL_SPEED * playerSegment.curve * (camera.getZ() - startPosition) / outrun.SettingGame.SEGMENT_LENGTH, 1 );
            this.treeOffset = outrun.MathUtil.increase( this.treeOffset, outrun.SettingGame.TREE_SPEED * playerSegment.curve * (camera.getZ() - startPosition) / outrun.SettingGame.SEGMENT_LENGTH, 1 );
        }
    }
