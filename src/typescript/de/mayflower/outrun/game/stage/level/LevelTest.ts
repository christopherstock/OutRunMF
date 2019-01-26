
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
                outrun.SettingColor.RED_SKY,
                outrun.SettingColor.RED_FOG
            );
        }

        /** ************************************************************************************************************
        *   Creates the road of this stage.
        *
        *   @param playerZ The initial z position of the player.
        *
        *   @return All segments the road consists of.
        ***************************************************************************************************************/
        // tslint:disable:max-line-length
        protected createRoad( playerZ:number ) : outrun.Segment[]
        {
            const stageBuilder :outrun.StageBuilder = new outrun.StageBuilder();

            stageBuilder.addStraight( outrun.SettingColor.RED, 25 );
            stageBuilder.addHill(     outrun.SettingColor.RED, 25, outrun.Road.HILL.EXTREME );
            stageBuilder.addStraight( outrun.SettingColor.RED, 25 );
            stageBuilder.addHill(     outrun.SettingColor.RED, 25, -outrun.Road.HILL.EXTREME );


/*
            stageBuilder.addCurve(    outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.NONE );
            stageBuilder.addLowRollingHills( , outrun.Road.LENGTH.SHORT, outrun.Road.HILL.LOW );
            stageBuilder.addSCurves();
            stageBuilder.addBumps();
            stageBuilder.addLowRollingHills( outrun.Road.LENGTH.SHORT, outrun.Road.HILL.LOW );
            stageBuilder.addCurve(           outrun.Road.LENGTH.LONG * 2, outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.MEDIUM);
            stageBuilder.addSCurves();
            stageBuilder.addCurve(           outrun.Road.LENGTH.LONG, -outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.NONE);
            stageBuilder.addCurve(           outrun.Road.LENGTH.LONG, outrun.Road.CURVE.MEDIUM, -outrun.Road.HILL.LOW);
            stageBuilder.addBumps();
            stageBuilder.addSCurves();
*/
/*
            // set startGameLoop and finish
            stageBuilder.addStartAndFinish( playerZ );
*/
            return stageBuilder.assemble();
        }

        /** ************************************************************************************************************
        *   Creates all decoration sprites for this stage.
        *
        *   @param segmentCount The number of segments this level consists of.
        ***************************************************************************************************************/
        protected createSprites( segmentCount:number ) : void
        {
        }
    }
