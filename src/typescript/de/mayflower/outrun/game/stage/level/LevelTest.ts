
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

            stageBuilder.addStraight(        outrun.Road.LENGTH.LONG );
            stageBuilder.addCurve(           outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.NONE );
/*
            stageBuilder.addLowRollingHills( , outrun.Road.LENGTH.SHORT, outrun.Road.HILL.LOW );
            stageBuilder.addSCurves();
            stageBuilder.addBumps();
            stageBuilder.addLowRollingHills( outrun.Road.LENGTH.SHORT, outrun.Road.HILL.LOW );
            stageBuilder.addCurve(           outrun.Road.LENGTH.LONG * 2, outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.MEDIUM);
            stageBuilder.addStraight(        outrun.Road.LENGTH.MEDIUM );
            stageBuilder.addHill(            outrun.Road.LENGTH.MEDIUM, outrun.Road.HILL.HIGH);
            stageBuilder.addSCurves();
            stageBuilder.addCurve(           outrun.Road.LENGTH.LONG, -outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.NONE);
            stageBuilder.addHill(            outrun.Road.LENGTH.LONG, outrun.Road.HILL.HIGH);
            stageBuilder.addCurve(           outrun.Road.LENGTH.LONG, outrun.Road.CURVE.MEDIUM, -outrun.Road.HILL.LOW);
            stageBuilder.addBumps();
            stageBuilder.addHill(            outrun.Road.LENGTH.LONG, -outrun.Road.HILL.MEDIUM);
            stageBuilder.addStraight(        outrun.Road.LENGTH.MEDIUM );
            stageBuilder.addSCurves();
            stageBuilder.addDownhillToEnd(   outrun.Road.LENGTH.DOUBLE_LONG );
*/
            // set start and finish
            stageBuilder.addStartAndFinish( playerZ );

            this.segments = stageBuilder.assemble();
        }

        /** ************************************************************************************************************
        *   Creates all decoration sprites for this stage.
        ***************************************************************************************************************/
        protected createSprites() : void
        {
        }
    }
