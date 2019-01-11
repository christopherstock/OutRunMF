
    import * as outrun from '..';

    /** ****************************************************************************************************************
    *   The legacy player.
    *******************************************************************************************************************/
    export class Player
    {
        /** Indicates if the 'steer left' key is pressed this game tick. */
        private                     keyLeft             :boolean                    = false;
        /** Indicates if the 'steer right' key is pressed this game tick. */
        private                     keyRight            :boolean                    = false;
        /** Indicates if the 'faster' key is pressed this game tick. */
        private                     keyFaster           :boolean                    = false;
        /** Indicates if the 'slower' key is pressed this game tick. */
        private                     keySlower           :boolean                    = false;

        /** player x offset from center of road (-1 to 1 to stay independent of roadWidth) */
        public                      playerX             :number                     = 0;
        /** player relative z distance from camera (computed) */
        public                      playerZ             :number                     = null;
        /** current player speed */
        public                      speed               :number                     = 0;

        // TODO create members and make all fields private!


        public constructor( playerZ:number )
        {
            this.playerZ = playerZ;
        }

        public handlePlayerKeys() : void
        {
            this.keyLeft   = outrun.Main.game.keySystem.isPressed( outrun.KeyCodes.KEY_LEFT  );
            this.keyRight  = outrun.Main.game.keySystem.isPressed( outrun.KeyCodes.KEY_RIGHT );
            this.keyFaster = outrun.Main.game.keySystem.isPressed( outrun.KeyCodes.KEY_UP    );
            this.keySlower = outrun.Main.game.keySystem.isPressed( outrun.KeyCodes.KEY_DOWN  );
        }

        public update( dx:number, dt:number ) : void
        {
            // steer
            if (this.keyLeft)
                this.playerX = this.playerX - dx;
            else if (this.keyRight)
                this.playerX = this.playerX + dx;

            // accelerate or decelerate
            if (this.keyFaster)
                this.speed = outrun.MathUtil.accelerate( this.speed, outrun.SettingGame.ACCELERATION_RATE, dt );
            else if (this.keySlower)
                this.speed = outrun.MathUtil.accelerate( this.speed, outrun.SettingGame.BREAKING_RATE, dt );
            else
                this.speed = outrun.MathUtil.accelerate( this.speed, outrun.SettingGame.NATURAL_DECELERATION_RATE, dt );
        }

        public draw
        (
            ctx           :CanvasRenderingContext2D,
            resolution    :number,
            playerSegment :outrun.Segment,
            camera        :outrun.Camera,
            playerPercent :number

        ) : void
        {
            // TODO resolve static method!
            outrun.Drawing2D.player(
                ctx,
                outrun.Main.game.canvasSystem.getWidth(),
                outrun.Main.game.canvasSystem.getHeight(),
                resolution,
                outrun.SettingGame.ROAD_WIDTH,
                this.speed / outrun.SettingGame.MAX_SPEED,
                camera.getDepth() / this.playerZ,
                outrun.Main.game.canvasSystem.getWidth() / 2,
                (
                    (outrun.Main.game.canvasSystem.getHeight() / 2)
                    - (
                        camera.getDepth() / this.playerZ * outrun.MathUtil.interpolate
                        (
                            playerSegment.p1.camera.y,
                            playerSegment.p2.camera.y,
                            playerPercent
                        )
                        * outrun.Main.game.canvasSystem.getHeight() / 2
                    )
                ),
                this.speed * ( this.keyLeft ? -1 : this.keyRight ? 1 : 0 ),
                playerSegment.p2.world.y - playerSegment.p1.world.y
            );
        }
    }
