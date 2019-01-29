
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

            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT );
            stageBuilder.addCurve(           outrun.SettingColor.DEFAULT, outrun.RoadLength.LONG, outrun.RoadCurve.EASY, outrun.Road.HILL.LOW );
            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT );
            stageBuilder.addBumps(           outrun.RoadLength.MINIMUM,   outrun.Road.HILL.MINIMUM, outrun.SettingColor.RED );
            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT );
            stageBuilder.addSCurves(         outrun.Road.HILL.MEDIUM,     outrun.SettingColor.GREEN );
            stageBuilder.addLowRollingHills( outrun.SettingColor.GREEN,   outrun.RoadLength.MEDIUM, outrun.RoadCurve.MEDIUM, outrun.Road.HILL.MEDIUM );
            stageBuilder.addHill(            outrun.SettingColor.RED,     outrun.RoadLength.SHORT, outrun.Road.HILL.EXTREME );
            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT );
            stageBuilder.addCurve(           outrun.SettingColor.DEFAULT, outrun.RoadLength.LONG, -outrun.RoadCurve.EASY, -outrun.Road.HILL.LOW );
            stageBuilder.addHill(            outrun.SettingColor.RED,     outrun.RoadLength.SHORT, -outrun.Road.HILL.EXTREME );
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
