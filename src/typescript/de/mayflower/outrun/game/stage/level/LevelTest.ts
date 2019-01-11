
    import * as outrun from '../../..'

    /** ****************************************************************************************************************
    *   A test level for testing all different stage components.
    *******************************************************************************************************************/
    export class LevelTest extends outrun.Stage
    {
        /** ************************************************************************************************************
        *   Creates the test level that tests various stage components.
        ***************************************************************************************************************/
        public constructor()
        {
            super
            (
                3,
                new outrun.Background
                (
                    outrun.ImageFile.BG_SKY2,
                    outrun.ImageFile.BG_HILL2,
                    outrun.ImageFile.BG_TREE2
                ),
                outrun.SettingColor.RED_LIGHT,
                outrun.SettingColor.RED_DARK,

                outrun.SettingColor.RED_SKY,
                outrun.SettingColor.RED_FOG
            );
        }

        /** ************************************************************************************************************
        *   Creates the road of this stage.
        *
        *   @param playerZ The initial z position of the player.
        ***************************************************************************************************************/
        // tslint:disable:max-line-length
        protected createRoad( playerZ:number ) : void
        {
            const stageBuilder :outrun.StageBuilder = new outrun.StageBuilder();

            outrun.StageBuilder.addStraight(        this.segments, outrun.Road.LENGTH.LONG );
            outrun.StageBuilder.addCurve(           this.segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.NONE );
/*
            outrun.StageBuilder.addLowRollingHills( this.segments, outrun.Road.LENGTH.SHORT, outrun.Road.HILL.LOW );
            outrun.StageBuilder.addSCurves(         this.segments );
            outrun.StageBuilder.addBumps(           this.segments );
            outrun.StageBuilder.addLowRollingHills( this.segments, outrun.Road.LENGTH.SHORT, outrun.Road.HILL.LOW );
            outrun.StageBuilder.addCurve(           this.segments, outrun.Road.LENGTH.LONG * 2, outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.MEDIUM);
            outrun.StageBuilder.addStraight(        this.segments, outrun.Road.LENGTH.MEDIUM );
            outrun.StageBuilder.addHill(            this.segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.HILL.HIGH);
            outrun.StageBuilder.addSCurves(         this.segments );
            outrun.StageBuilder.addCurve(           this.segments, outrun.Road.LENGTH.LONG, -outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.NONE);
            outrun.StageBuilder.addHill(            this.segments, outrun.Road.LENGTH.LONG, outrun.Road.HILL.HIGH);
            outrun.StageBuilder.addCurve(           this.segments, outrun.Road.LENGTH.LONG, outrun.Road.CURVE.MEDIUM, -outrun.Road.HILL.LOW);
            outrun.StageBuilder.addBumps(           this.segments );
            outrun.StageBuilder.addHill(            this.segments, outrun.Road.LENGTH.LONG, -outrun.Road.HILL.MEDIUM);
            outrun.StageBuilder.addStraight(        this.segments, outrun.Road.LENGTH.MEDIUM );
            outrun.StageBuilder.addSCurves(         this.segments );
            outrun.StageBuilder.addDownhillToEnd(   this.segments, outrun.Road.LENGTH.DOUBLE_LONG );
*/
        }

        /** ************************************************************************************************************
        *   Creates all decoration sprites for this stage.
        ***************************************************************************************************************/
        protected createSprites() : void
        {
        }
    }
