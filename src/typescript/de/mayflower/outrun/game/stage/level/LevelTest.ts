
    import * as outrun from '../../..'

    /** ****************************************************************************************************************
    *   A test level for testing all different stage components.
    *******************************************************************************************************************/
    export class LevelTest extends outrun.Stage
    {
        /** ************************************************************************************************************
        *   Creates the test level that tests various stage components.
        ***************************************************************************************************************/
        public constructor( imageSystem:outrun.ImageSystem )
        {
            super
            (
                imageSystem,
                3,
                new outrun.Background
                (
                    imageSystem,
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

            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT, 3 );
            stageBuilder.addCurve(           outrun.SettingColor.DEFAULT, outrun.RoadLength.LONG, outrun.RoadCurve.EASY, outrun.RoadHill.LOW, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addBumps(           outrun.RoadLength.MINIMUM,   outrun.RoadHill.MINIMUM, outrun.SettingColor.RED, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addSCurves(         outrun.RoadHill.MEDIUM,     outrun.SettingColor.GREEN, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addLowRollingHills( outrun.SettingColor.GREEN,   outrun.RoadLength.MEDIUM, outrun.RoadCurve.MEDIUM, outrun.RoadHill.MEDIUM, 2 );
            stageBuilder.addHill(            outrun.SettingColor.RED,     outrun.RoadLength.SHORT, outrun.RoadHill.EXTREME, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addCurve(           outrun.SettingColor.DEFAULT, outrun.RoadLength.LONG, -outrun.RoadCurve.EASY, -outrun.RoadHill.LOW, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addHill(            outrun.SettingColor.RED,     outrun.RoadLength.SHORT, -outrun.RoadHill.EXTREME, 3 );
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
