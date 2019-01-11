
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
        private                     x                   :number                     = 0;
        /** player relative z distance from camera (computed) */
        public                      playerZ             :number                     = null;
        /** current player speed */
        public                      speed               :number                     = 0;

        // TODO create members and make all fields private!

        public constructor( playerZ:number )
        {
            this.playerZ = playerZ;
        }

        public getX() : number
        {
            return this.x;
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
                this.x = this.x - dx;
            else if (this.keyRight)
                this.x = this.x + dx;

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
            Player.player(
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

        public checkCentrifugalForce( dx:number, speedPercent:number, playerSegment:outrun.Segment )
        {
            this.x = this.x - ( dx * speedPercent * playerSegment.curve * outrun.SettingGame.CENTRIFUGAL );
        }

        public clipBoundsForX()
        {
            this.x = outrun.MathUtil.limit( this.x, -3, 3 );
        }

        public checkOffroad( playerSegment:outrun.Segment, playerW:number, dt:number, stageLength:number, camera:outrun.Camera )
        {
            if ((this.x < -1) || (this.x > 1)) {

                // clip to offroad speed
                if (this.speed > outrun.SettingGame.OFF_ROAD_LIMIT)
                    this.speed = outrun.MathUtil.accelerate(this.speed, outrun.SettingGame.OFF_ROAD_DECELERATION, dt);

                // check player collision with sprite
                for ( const sprite of playerSegment.getSprites() ) {
                    const spriteW:number = outrun.Main.game.imageSystem.getImage(sprite.source).width * outrun.SettingGame.SPRITE_SCALE;

                    if (outrun.MathUtil.overlap(this.x, playerW, sprite.offset + spriteW / 2 * (sprite.offset > 0 ? 1 : -1), spriteW, 0)) {
                        this.speed = outrun.SettingGame.MAX_SPEED / 5;
                        camera.setZ( outrun.MathUtil.increase(playerSegment.p1.world.z, -this.playerZ, stageLength) ); // stop in front of sprite (at front of segment)
                        break;
                    }
                }
            }
        }

        // TODO resolve static method!
        public static player( ctx:CanvasRenderingContext2D, width:number, height:number, resolution:number, roadWidth:number, speedPercent:number, scale:number, destX:number, destY:number, steer:number, updown:number ) : void
        {
            const bounce :number = ( 1.5 * Math.random() * speedPercent * resolution ) * outrun.MathUtil.randomChoice( [ -1, 1 ] );
            let   sprite :string;

            if ( steer < 0 )
            {
                sprite = ( updown > 0 ) ? outrun.ImageFile.PLAYER_UPHILL_LEFT : outrun.ImageFile.PLAYER_LEFT;
            }
            else if ( steer > 0 )
            {
                sprite = ( updown > 0 ) ? outrun.ImageFile.PLAYER_UPHILL_RIGHT : outrun.ImageFile.PLAYER_RIGHT;
            }
            else
            {
                sprite = ( updown > 0 ) ? outrun.ImageFile.PLAYER_UPHILL_STRAIGHT : outrun.ImageFile.PLAYER_STRAIGHT;
            }

            outrun.Drawing2D.sprite( ctx, width, height, resolution, roadWidth, sprite, scale, destX, destY + bounce, -0.5, -1, 0 );
        }
    }
