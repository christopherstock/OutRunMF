
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
        /** current player speed */
        private                     speed               :number                     = 0;
        /** player relative z distance from camera (computed) */
        private     readonly        z                   :number                     = null;

        public constructor( z:number )
        {
            this.z = z;
        }

        public getX() : number
        {
            return this.x;
        }

        public getZ() : number
        {
            return this.z;
        }

        public getSpeed() : number
        {
            return this.speed;
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

        public checkCollidingWithCar( car:outrun.Car, playerW:number, carW:number, camera:outrun.Camera, stageLength:number ) : boolean
        {
            if ( outrun.MathUtil.overlap( this.x, playerW, car.getOffset(), carW, 0.8 ) ) {

                this.speed = car.getSpeed() * (car.getSpeed() / this.getSpeed());
                camera.setZ( outrun.MathUtil.increase( car.getZ(), -this.z, stageLength ) );

                return true;
            }

            return false;
        }

        public draw
        (
            ctx           :CanvasRenderingContext2D,
            resolution    :number,
            playerSegment :outrun.Segment,
            camera        :outrun.Camera,
            playerPercent :number

        )
        : void
        {
            const roadWidth    :number = outrun.SettingGame.ROAD_WIDTH;
            const speedPercent :number = ( this.speed / outrun.SettingGame.MAX_SPEED );
            const scale        :number = ( camera.getDepth() / this.z );
            const destX        :number = ( outrun.Main.game.canvasSystem.getWidth() / 2 );
            const destY        :number = (
                (outrun.Main.game.canvasSystem.getHeight() / 2)
                - (
                    camera.getDepth() / this.z * outrun.MathUtil.interpolate
                    (
                        playerSegment.getP1().getCamera().y,
                        playerSegment.getP2().getCamera().y,
                        playerPercent
                    )
                    * outrun.Main.game.canvasSystem.getHeight() / 2
                )
            );
            const steer        :number = ( this.speed * ( this.keyLeft ? -1 : this.keyRight ? 1 : 0 ) );
            const updown       :number = ( playerSegment.getP2().getWorld().y - playerSegment.getP1().getWorld().y );

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

            outrun.Drawing2D.drawSprite( ctx, resolution, roadWidth, sprite, scale, destX, destY + bounce, -0.5, -1, 0 );
        }

        public checkCentrifugalForce( dx:number, speedPercent:number, playerSegment:outrun.Segment ) : void
        {
            this.x = this.x - ( dx * speedPercent * playerSegment.curve * outrun.SettingGame.CENTRIFUGAL );
        }

        public clipBoundsForX() : void
        {
            this.x = outrun.MathUtil.limit( this.x, -3, 3 );
        }

        public clipSpeed() : void
        {
            this.speed = outrun.MathUtil.limit( this.speed, 0, outrun.SettingGame.MAX_SPEED );
        }

        public checkOffroad( playerSegment:outrun.Segment, playerW:number, dt:number, stageLength:number, camera:outrun.Camera ) : void
        {
            if ((this.x < -1) || (this.x > 1)) {

                // clip to offroad speed
                if (this.speed > outrun.SettingGame.OFF_ROAD_LIMIT)
                    this.speed = outrun.MathUtil.accelerate(this.speed, outrun.SettingGame.OFF_ROAD_DECELERATION, dt);

                // check player collision with sprite
                for ( const sprite of playerSegment.getSprites() )
                {
                    const spriteW:number = outrun.Main.game.imageSystem.getImage( sprite.getSource() ).width * outrun.SettingGame.SPRITE_SCALE;

                    if ( outrun.MathUtil.overlap( this.x, playerW, sprite.getOffset() + spriteW / 2 * ( sprite.getOffset() > 0 ? 1 : -1 ), spriteW, 0 ) )
                    {
                        this.speed = outrun.SettingGame.MAX_SPEED / 5;
                        camera.setZ( outrun.MathUtil.increase(playerSegment.getP1().getWorld().z, -this.z, stageLength) ); // stop in front of sprite (at front of segment)
                        break;
                    }
                }
            }
        }
    }
