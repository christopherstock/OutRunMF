
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
                )
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
            outrun.StageFactory.addStraight(        this.segments, outrun.Road.LENGTH.LONG );
            outrun.StageFactory.addCurve(           this.segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.NONE );
/*
            outrun.StageFactory.addLowRollingHills( this.segments, outrun.Road.LENGTH.SHORT, outrun.Road.HILL.LOW );
            outrun.StageFactory.addSCurves(         this.segments );
            outrun.StageFactory.addBumps(           this.segments );
            outrun.StageFactory.addLowRollingHills( this.segments, outrun.Road.LENGTH.SHORT, outrun.Road.HILL.LOW );
            outrun.StageFactory.addCurve(           this.segments, outrun.Road.LENGTH.LONG * 2, outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.MEDIUM);
            outrun.StageFactory.addStraight(        this.segments, outrun.Road.LENGTH.MEDIUM );
            outrun.StageFactory.addHill(            this.segments, outrun.Road.LENGTH.MEDIUM, outrun.Road.HILL.HIGH);
            outrun.StageFactory.addSCurves(         this.segments );
            outrun.StageFactory.addCurve(           this.segments, outrun.Road.LENGTH.LONG, -outrun.Road.CURVE.MEDIUM, outrun.Road.HILL.NONE);
            outrun.StageFactory.addHill(            this.segments, outrun.Road.LENGTH.LONG, outrun.Road.HILL.HIGH);
            outrun.StageFactory.addCurve(           this.segments, outrun.Road.LENGTH.LONG, outrun.Road.CURVE.MEDIUM, -outrun.Road.HILL.LOW);
            outrun.StageFactory.addBumps(           this.segments );
            outrun.StageFactory.addHill(            this.segments, outrun.Road.LENGTH.LONG, -outrun.Road.HILL.MEDIUM);
            outrun.StageFactory.addStraight(        this.segments, outrun.Road.LENGTH.MEDIUM );
            outrun.StageFactory.addSCurves(         this.segments );
            outrun.StageFactory.addDownhillToEnd(   this.segments, outrun.Road.LENGTH.DOUBLE_LONG );
*/
        }

        /** ************************************************************************************************************
        *   Creates all decoration sprites for this stage.
        ***************************************************************************************************************/
        protected createSprites() : void
        {
        }
    }
