
    /* eslint-disable max-len */

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
                20,
                [ outrun.ImageFile.TRUCK1, outrun.ImageFile.TRUCK2 ],
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
        protected createRoad( playerZ:number ) : outrun.Segment[]
        {
            const stageBuilder :outrun.StageBuilder = new outrun.StageBuilder();

            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT, 4 );
            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT, 3 );
            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT, 2 );
            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT, 1 );
            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT, 2 );
            stageBuilder.addStraight(        outrun.SettingColor.RED,     outrun.RoadLength.SHORT, 3 );
            stageBuilder.addLowRollingHills( outrun.SettingColor.RED,     outrun.RoadLength.SHORT, outrun.RoadCurve.NONE, outrun.RoadHill.MEDIUM, 3 );

/*
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
            for ( let n:number = 100; n < 500; n += 5 ) {

                this.createObstacle( n, outrun.ImageFile.COLUMN, 1.5  );
                this.createObstacle( n, outrun.ImageFile.TREE2,  -1.5 );
            }
        }
    }
