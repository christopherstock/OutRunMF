
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
                outrun.SettingColor.DEFAULT_LIGHT,
                outrun.SettingColor.DEFAULT_DARK,

                outrun.SettingColor.DEFAULT_SKY,
                outrun.SettingColor.DEFAULT_FOG
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

            stageBuilder.addStraight(        outrun.Road.LENGTH.SHORT );
            stageBuilder.addLowRollingHills( outrun.Road.LENGTH.SHORT, outrun.Road.HILL.LOW );
            stageBuilder.addSCurves();
            stageBuilder.addCurve(           outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.LOW);
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

            // set startGameLoop and finish
            stageBuilder.addStartAndFinish( playerZ );

            this.segments = stageBuilder.assemble();
        }

        /** ************************************************************************************************************
        *   Creates all decoration sprites for this stage.
        ***************************************************************************************************************/
        protected createSprites() : void
        {
            this.addSprite( 20,  outrun.ImageFile.BILLBOARD07, -1 );
            this.addSprite( 40,  outrun.ImageFile.BILLBOARD06, -1 );
            this.addSprite( 60,  outrun.ImageFile.BILLBOARD08, -1 );
            this.addSprite( 80,  outrun.ImageFile.BILLBOARD09, -1 );
            this.addSprite( 100, outrun.ImageFile.BILLBOARD01, -1 );
            this.addSprite( 120, outrun.ImageFile.BILLBOARD02, -1 );
            this.addSprite( 140, outrun.ImageFile.BILLBOARD03, -1 );
            this.addSprite( 160, outrun.ImageFile.BILLBOARD04, -1 );
            this.addSprite( 180, outrun.ImageFile.BILLBOARD05, -1 );

            this.addSprite( 240, outrun.ImageFile.BILLBOARD07, -1.2 );
            this.addSprite( 240, outrun.ImageFile.BILLBOARD06, 1.2 );
            this.addSprite( this.segments.length - 25, outrun.ImageFile.BILLBOARD07, -1.2 );
            this.addSprite( this.segments.length - 25, outrun.ImageFile.BILLBOARD06, 1.2  );

            for ( let n:number = 10; n < 200; n += 4 + Math.floor(n / 100) ) {
                this.addSprite(n, outrun.ImageFile.PALM_TREE, 0.5 + Math.random() * 0.5);
                this.addSprite(n, outrun.ImageFile.PALM_TREE, 1   + Math.random() * 2);
            }

            for ( let n:number = 250; n < 1000; n += 5 ) {
                this.addSprite(n, outrun.ImageFile.COLUMN, 1.1);
                this.addSprite(n + outrun.MathUtil.randomInt(0, 5), outrun.ImageFile.TREE1, -1 - (Math.random() * 2));
                this.addSprite(n + outrun.MathUtil.randomInt(0, 5), outrun.ImageFile.TREE2, -1 - (Math.random() * 2));
            }

            for ( let n:number = 200; n < this.segments.length; n += 3 ) {
                this.addSprite(n, outrun.MathUtil.randomChoice(outrun.ImageFile.PLANTS), outrun.MathUtil.randomChoice([1, -1]) * (2 + Math.random() * 5));
            }

            let side   :number = 0;
            let offset :number = 0;

            for ( let n:number = 1000; n < (this.segments.length - 50); n += 100 ) {
                side = outrun.MathUtil.randomChoice([1, -1]);
                this.addSprite(n + outrun.MathUtil.randomInt(0, 50), outrun.MathUtil.randomChoice(outrun.ImageFile.BILLBOARDS), -side);
                for ( let i:number = 0; i < 20; i++ ) {
                    const sprite:string = outrun.MathUtil.randomChoice(outrun.ImageFile.PLANTS);
                    offset = side * (1.5 + Math.random());
                    this.addSprite(n + outrun.MathUtil.randomInt(0, 50), sprite, offset);
                }
            }
        }
    }
