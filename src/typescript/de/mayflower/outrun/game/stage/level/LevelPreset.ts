
    import * as outrun from '../../..'

    /** ****************************************************************************************************************
    *   The preset level from the original OutRun JS sourcecode.
    *******************************************************************************************************************/
    export class LevelPreset extends outrun.Stage
    {
        /** ************************************************************************************************************
        *   Creates the preset level that came with the OutRun JS sourcecode.
        ***************************************************************************************************************/
        public constructor()
        {
            super
            (
                200,
                new outrun.Background
                (
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

            stageBuilder.addStraight(        outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.SHORT );
            stageBuilder.addLowRollingHills( outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.SHORT, outrun.Road.HILL.LOW );
            stageBuilder.addSCurves(         outrun.SettingColor.DEFAULT );
            stageBuilder.addCurve(           outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.LOW);
            stageBuilder.addBumps(           outrun.SettingColor.DEFAULT );
            stageBuilder.addLowRollingHills( outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.SHORT, outrun.Road.HILL.LOW );
            stageBuilder.addCurve(           outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.LONG * 2, outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.MEDIUM);
            stageBuilder.addStraight(        outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.MEDIUM );
            stageBuilder.addHill(            outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.MEDIUM, outrun.Road.HILL.HIGH);
            stageBuilder.addSCurves(         outrun.SettingColor.DEFAULT );
            stageBuilder.addCurve(           outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.LONG, -outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.NONE);
            stageBuilder.addHill(            outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.LONG, outrun.Road.HILL.HIGH);
            stageBuilder.addCurve(           outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.LONG, outrun.Road.CURVE.MEDIUM, -outrun.Road.HILL.LOW);
            stageBuilder.addBumps(           outrun.SettingColor.DEFAULT );
            stageBuilder.addHill(            outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.LONG, -outrun.Road.HILL.MEDIUM);
            stageBuilder.addStraight(        outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.MEDIUM );
            stageBuilder.addSCurves(         outrun.SettingColor.DEFAULT );
            stageBuilder.addDownhillToEnd(   outrun.SettingColor.DEFAULT, outrun.Road.LENGTH.DOUBLE_LONG );

            // set startGameLoop and finish
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
            this.addObstacle( 20,  outrun.ImageFile.BILLBOARD07, -1 );
            this.addObstacle( 40,  outrun.ImageFile.BILLBOARD06, -1 );
            this.addObstacle( 60,  outrun.ImageFile.BILLBOARD08, -1 );
            this.addObstacle( 80,  outrun.ImageFile.BILLBOARD09, -1 );
            this.addObstacle( 100, outrun.ImageFile.BILLBOARD01, -1 );
            this.addObstacle( 120, outrun.ImageFile.BILLBOARD02, -1 );
            this.addObstacle( 140, outrun.ImageFile.BILLBOARD03, -1 );
            this.addObstacle( 160, outrun.ImageFile.BILLBOARD04, -1 );
            this.addObstacle( 180, outrun.ImageFile.BILLBOARD05, -1 );

            this.addObstacle( 240, outrun.ImageFile.BILLBOARD07, -1.2 );
            this.addObstacle( 240, outrun.ImageFile.BILLBOARD06, 1.2 );
            this.addObstacle( segmentCount - 25, outrun.ImageFile.BILLBOARD07, -1.2 );
            this.addObstacle( segmentCount - 25, outrun.ImageFile.BILLBOARD06, 1.2  );

            for ( let n:number = 10; n < 200; n += 4 + Math.floor(n / 100) ) {
                this.addObstacle(n, outrun.ImageFile.PALM_TREE, 0.5 + Math.random() * 0.5);
                this.addObstacle(n, outrun.ImageFile.PALM_TREE, 1   + Math.random() * 2);
            }

            for ( let n:number = 250; n < 1000; n += 5 ) {
                this.addObstacle(n, outrun.ImageFile.COLUMN, 1.1);
                this.addObstacle(n + outrun.MathUtil.getRandomInt(0, 5), outrun.ImageFile.TREE1, -1 - (Math.random() * 2));
                this.addObstacle(n + outrun.MathUtil.getRandomInt(0, 5), outrun.ImageFile.TREE2, -1 - (Math.random() * 2));
            }

            for ( let n:number = 200; n < segmentCount; n += 3 ) {
                this.addObstacle(n, outrun.MathUtil.getRandomElement(outrun.ImageFile.PLANTS), outrun.MathUtil.getRandomElement([1, -1]) * (2 + Math.random() * 5));
            }

            let side   :number = 0;
            let offset :number = 0;

            for ( let n:number = 1000; n < (segmentCount - 50); n += 100 ) {
                side = outrun.MathUtil.getRandomElement([1, -1]);
                this.addObstacle(n + outrun.MathUtil.getRandomInt(0, 50), outrun.MathUtil.getRandomElement(outrun.ImageFile.BILLBOARDS), -side);
                for ( let i:number = 0; i < 20; i++ ) {
                    const sprite:string = outrun.MathUtil.getRandomElement(outrun.ImageFile.PLANTS);
                    offset = side * (1.5 + Math.random());
                    this.addObstacle(n + outrun.MathUtil.getRandomInt(0, 50), sprite, offset);
                }
            }
        }
    }
