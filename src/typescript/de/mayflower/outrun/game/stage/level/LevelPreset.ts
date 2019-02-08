
    import * as outrun from '../../..'

    /** ****************************************************************************************************************
    *   The preset level from the original OutRun JS sourcecode.
    *******************************************************************************************************************/
    export class LevelPreset extends outrun.Stage
    {
        /** ************************************************************************************************************
        *   Creates the preset level that came with the OutRun JS sourcecode.
        ***************************************************************************************************************/
        public constructor( imageSystem:outrun.ImageSystem )
        {
            super
            (
                imageSystem,
                200,
                outrun.ImageFile.CARS,
                new outrun.Background
                (
                    imageSystem,
                    outrun.ImageFile.BG_SKY1,
                    outrun.ImageFile.BG_HILL1,
                    outrun.ImageFile.BG_TREE1
                ),
                outrun.SettingColor.DEFAULT_SKY,
                outrun.SettingColor.DEFAULT_FOG
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

            stageBuilder.addStraight(              outrun.SettingColor.DEFAULT, outrun.RoadLength.SHORT, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addLowRollingHillsLegacy( outrun.SettingColor.DEFAULT, outrun.RoadLength.SHORT, outrun.RoadHill.LOW, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addSCurvesLegacy(         outrun.SettingColor.DEFAULT, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addCurve(                 outrun.SettingColor.DEFAULT, outrun.RoadLength.MEDIUM, outrun.RoadCurve.MEDIUM, outrun.RoadHill.LOW, outrun.SettingGame.DEFAULT_LANE_COUNT);
            stageBuilder.addBumpsLegacy(           outrun.SettingColor.DEFAULT, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addLowRollingHillsLegacy( outrun.SettingColor.DEFAULT, outrun.RoadLength.SHORT, outrun.RoadHill.LOW, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addCurve(                 outrun.SettingColor.DEFAULT, outrun.RoadLength.LONG * 2, outrun.RoadCurve.MEDIUM, outrun.RoadHill.MEDIUM, outrun.SettingGame.DEFAULT_LANE_COUNT);
            stageBuilder.addStraight(              outrun.SettingColor.DEFAULT, outrun.RoadLength.MEDIUM, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addHill(                  outrun.SettingColor.DEFAULT, outrun.RoadLength.MEDIUM, outrun.RoadHill.HIGH, outrun.SettingGame.DEFAULT_LANE_COUNT);
            stageBuilder.addSCurvesLegacy(         outrun.SettingColor.DEFAULT, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addCurve(                 outrun.SettingColor.DEFAULT, outrun.RoadLength.LONG, -outrun.RoadCurve.MEDIUM, outrun.RoadHill.NONE, outrun.SettingGame.DEFAULT_LANE_COUNT);
            stageBuilder.addHill(                  outrun.SettingColor.DEFAULT, outrun.RoadLength.LONG, outrun.RoadHill.HIGH, outrun.SettingGame.DEFAULT_LANE_COUNT);
            stageBuilder.addCurve(                 outrun.SettingColor.DEFAULT, outrun.RoadLength.LONG, outrun.RoadCurve.MEDIUM, -outrun.RoadHill.LOW, outrun.SettingGame.DEFAULT_LANE_COUNT);
            stageBuilder.addBumpsLegacy(           outrun.SettingColor.DEFAULT, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addHill(                  outrun.SettingColor.DEFAULT, outrun.RoadLength.LONG, -outrun.RoadHill.MEDIUM, outrun.SettingGame.DEFAULT_LANE_COUNT);
            stageBuilder.addStraight(              outrun.SettingColor.DEFAULT, outrun.RoadLength.MEDIUM, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addSCurvesLegacy(         outrun.SettingColor.DEFAULT, outrun.SettingGame.DEFAULT_LANE_COUNT );
            stageBuilder.addDownhillToEndLegacy(         outrun.SettingColor.DEFAULT, outrun.RoadLength.DOUBLE_LONG, outrun.SettingGame.DEFAULT_LANE_COUNT );

            // set start and finish
            stageBuilder.addStartAndFinish( playerZ );

            return stageBuilder.assemble();
        }

        /** ************************************************************************************************************
        *   Creates all decoration sprites for this stage.
        *
        *   @param segmentCount The number of segments this level consists of.
        ***************************************************************************************************************/
        protected createSprites( segmentCount:number ) : void
        {
            this.createObstacle( 20,  outrun.ImageFile.BILLBOARD07, -1 );
            this.createObstacle( 40,  outrun.ImageFile.BILLBOARD06, -1 );
            this.createObstacle( 60,  outrun.ImageFile.BILLBOARD08, -1 );
            this.createObstacle( 80,  outrun.ImageFile.BILLBOARD09, -1 );
            this.createObstacle( 100, outrun.ImageFile.BILLBOARD01, -1 );
            this.createObstacle( 120, outrun.ImageFile.BILLBOARD02, -1 );
            this.createObstacle( 140, outrun.ImageFile.BILLBOARD03, -1 );
            this.createObstacle( 160, outrun.ImageFile.BILLBOARD04, -1 );
            this.createObstacle( 180, outrun.ImageFile.BILLBOARD05, -1 );

            this.createObstacle( 240, outrun.ImageFile.BILLBOARD07, -1.2 );
            this.createObstacle( 240, outrun.ImageFile.BILLBOARD06, 1.2 );
            this.createObstacle( segmentCount - 25, outrun.ImageFile.BILLBOARD07, -1.2 );
            this.createObstacle( segmentCount - 25, outrun.ImageFile.BILLBOARD06, 1.2  );

            for ( let n:number = 10; n < 200; n += 4 + Math.floor(n / 100) ) {
                this.createObstacle(n, outrun.ImageFile.PALM_TREE, 0.5 + Math.random() * 0.5);
                this.createObstacle(n, outrun.ImageFile.PALM_TREE, 1   + Math.random() * 2);
            }

            for ( let n:number = 250; n < 1000; n += 5 ) {
                this.createObstacle(n, outrun.ImageFile.COLUMN, 1.1);
                this.createObstacle(n + outrun.MathUtil.getRandomInt(0, 5), outrun.ImageFile.TREE1, -1 - (Math.random() * 2));
                this.createObstacle(n + outrun.MathUtil.getRandomInt(0, 5), outrun.ImageFile.TREE2, -1 - (Math.random() * 2));
            }

            for ( let n:number = 200; n < segmentCount; n += 3 ) {
                this.createObstacle(n, outrun.MathUtil.getRandomElement(outrun.ImageFile.PLANTS), outrun.MathUtil.getRandomElement([1, -1]) * (2 + Math.random() * 5));
            }

            let side   :number = 0;
            let offset :number = 0;

            for ( let n:number = 1000; n < (segmentCount - 50); n += 100 ) {
                side = outrun.MathUtil.getRandomElement([1, -1]);
                this.createObstacle(n + outrun.MathUtil.getRandomInt(0, 50), outrun.MathUtil.getRandomElement(outrun.ImageFile.BILLBOARDS), -side);
                for ( let i:number = 0; i < 20; i++ ) {
                    const sprite:string = outrun.MathUtil.getRandomElement(outrun.ImageFile.PLANTS);
                    offset = side * (1.5 + Math.random());
                    this.createObstacle(n + outrun.MathUtil.getRandomInt(0, 50), sprite, offset);
                }
            }
        }
    }
