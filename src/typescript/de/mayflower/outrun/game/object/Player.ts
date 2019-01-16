
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   The legacy player.
    *******************************************************************************************************************/
    export class Player extends outrun.GameObject
    {
        /** The current player speed in percent. */
        public                      speedPercent        :number                     = 0;

        /** Indicates if the 'steer left' key is pressed this game tick. */
        private                     keyLeft             :boolean                    = false;
        /** Indicates if the 'steer right' key is pressed this game tick. */
        private                     keyRight            :boolean                    = false;
        /** Indicates if the 'faster' key is pressed this game tick. */
        private                     keyFaster           :boolean                    = false;
        /** Indicates if the 'slower' key is pressed this game tick. */
        private                     keySlower           :boolean                    = false;

        /** The segment where the player is currently located. */
        private                     playerSegment       :outrun.Segment             = null;

        /** current player speed */
        private                     speed               :number                     = 0;
        /** player x offset from center of road (-1 to 1 to stay independent of roadWidth) */
        private                     x                   :number                     = 0;
        /** player relative z distance from camera (computed) */
        private     readonly        z                   :number                     = null;
        /** player width */
        private     readonly        width               :number                     = 0;

        public constructor( z:number )
        {
            super( outrun.ImageFile.PLAYER_STRAIGHT );

            this.z     = z;
            this.width = ( 80 * outrun.SettingEngine.SPRITE_SCALE );
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

        public getWidth() : number
        {
            return this.width;
        }

        public getPlayerSegment() : outrun.Segment
        {
            return this.playerSegment;
        }

        public setPlayerSegment( playerSegment:outrun.Segment ) : void
        {
            this.playerSegment = playerSegment;
        }

        public update
        (
            dx            :number,
            dt            :number,
            stageLength   :number,
            camera        :outrun.Camera
        )
        : void
        {
            // check keys for player
            this.handlePlayerKeys();

            // steer according to keys
            if ( this.keyLeft )
                this.x = this.x - dx;
            else if ( this.keyRight )
                this.x = this.x + dx;

            // update speed
            this.updateSpeed( dt );

            // determine next sprite
            const updown :number = ( this.playerSegment.getP2().getWorld().y - this.playerSegment.getP1().getWorld().y );

            // determine sprite
            if ( this.keyLeft && this.speed > 0 )
            {
                this.setSprite( ( updown > 0 ) ? outrun.ImageFile.PLAYER_UPHILL_LEFT : outrun.ImageFile.PLAYER_LEFT );
            }
            else if ( this.keyRight && this.speed > 0 )
            {
                this.setSprite( ( updown > 0 ) ? outrun.ImageFile.PLAYER_UPHILL_RIGHT : outrun.ImageFile.PLAYER_RIGHT );
            }
            else
            {
                this.setSprite( ( updown > 0 ) ? outrun.ImageFile.PLAYER_UPHILL_STRAIGHT : outrun.ImageFile.PLAYER_STRAIGHT );
            }

            // check centrifugal force modification if player is in a curve
            this.checkCentrifugalForce( dx, this.speedPercent, this.playerSegment );

            // check if player is off-road
            this.checkOffroad( this.playerSegment, this.width, dt, stageLength, camera );

            // browse all cars
            for ( const car of this.playerSegment.cars ) {

                if ( this.getSpeed() > car.getSpeed() ) {

                    // check if player is colliding?
                    if ( this.checkCollidingWithCar( car, this.width, car.getWidth(), camera, stageLength ) )
                    {
                        break;
                    }
                }
            }

            // dont ever let it go too far out of bounds
            this.clipBoundsForX();
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
            const speedPercent :number = ( this.speed / outrun.SettingGame.PLAYER_MAX_SPEED );
            const bounce       :number = ( 1.5 * Math.random() * speedPercent * resolution ) * outrun.MathUtil.randomChoice( [ -1, 1 ] );
            const scale        :number = ( camera.getDepth() / this.z );
            const destX        :number = ( outrun.Main.game.engine.canvasSystem.getWidth() / 2 );
            const destY        :number = (
                (outrun.Main.game.engine.canvasSystem.getHeight() / 2)
                - (
                    camera.getDepth() / this.z * outrun.MathUtil.interpolate
                    (
                        playerSegment.getP1().getCamera().y,
                        playerSegment.getP2().getCamera().y,
                        playerPercent
                    )
                    * outrun.Main.game.engine.canvasSystem.getHeight() / 2
                )
            );

            // draw player
            outrun.Drawing2D.drawSprite
            (
                ctx,
                resolution,
                outrun.SettingGame.HALF_ROAD_WIDTH,
                this.sprite,
                scale,
                destX,
                destY + bounce,
                -0.5,
                -1,
                0
            );
        }

        private handlePlayerKeys() : void
        {
            this.keyLeft   = outrun.Main.game.engine.keySystem.isPressed( outrun.KeyCodes.KEY_LEFT  );
            this.keyRight  = outrun.Main.game.engine.keySystem.isPressed( outrun.KeyCodes.KEY_RIGHT );
            this.keyFaster = outrun.Main.game.engine.keySystem.isPressed( outrun.KeyCodes.KEY_UP    );
            this.keySlower = outrun.Main.game.engine.keySystem.isPressed( outrun.KeyCodes.KEY_DOWN  );
        }

        private checkCollidingWithCar( car:outrun.Car, playerW:number, carW:number, camera:outrun.Camera, stageLength:number ) : boolean
        {
            if ( outrun.MathUtil.overlap( this.x, playerW, car.getOffset(), carW, 0.8 ) ) {

                this.speed = car.getSpeed() * (car.getSpeed() / this.getSpeed());
                camera.setZ( outrun.MathUtil.increase( car.getZ(), -this.z, stageLength ) );

                return true;
            }

            return false;
        }

        private checkCentrifugalForce( dx:number, speedPercent:number, playerSegment:outrun.Segment ) : void
        {
            this.x = this.x - ( dx * speedPercent * playerSegment.curve * outrun.SettingGame.CENTRIFUGAL );
        }

        private clipBoundsForX() : void
        {
            this.x = outrun.MathUtil.limit( this.x, -3, 3 );
        }

        private updateSpeed( dt:number ) : void
        {
            // modify speed
            if ( this.keyFaster )
            {
                // accelerate
                this.speed = outrun.MathUtil.accelerate( this.speed, outrun.SettingGame.PLAYER_ACCELERATION_RATE, dt );
            }
            else if ( this.keySlower )
            {
                // break
                this.speed = outrun.MathUtil.accelerate( this.speed, outrun.SettingGame.PLAYER_BREAKING_RATE, dt );
            }
            else
            {
                // decelerate natural
                this.speed = outrun.MathUtil.accelerate( this.speed, outrun.SettingGame.DECELERATION_RATE_NATURAL, dt );
            }

            // clip speed
            this.speed = outrun.MathUtil.limit( this.speed, 0, outrun.SettingGame.PLAYER_MAX_SPEED );
        }

        private checkOffroad( playerSegment:outrun.Segment, playerW:number, dt:number, stageLength:number, camera:outrun.Camera ) : void
        {
            if ((this.x < -1) || (this.x > 1)) {

                // clip to offroad speed
                if (this.speed > outrun.SettingGame.OFF_ROAD_LIMIT)
                    this.speed = outrun.MathUtil.accelerate(this.speed, outrun.SettingGame.DECELERATION_OFF_ROAD, dt);

                // check player collision with sprite
                for ( const sprite of playerSegment.getObstacles() )
                {
                    const spriteW:number = outrun.Main.game.engine.imageSystem.getImage( sprite.getSprite() ).width * outrun.SettingEngine.SPRITE_SCALE;

                    if ( outrun.MathUtil.overlap( this.x, playerW, sprite.getX() + spriteW / 2 * ( sprite.getX() > 0 ? 1 : -1 ), spriteW, 0 ) )
                    {
                        this.speed = outrun.SettingGame.PLAYER_MAX_SPEED / 5;
                        camera.setZ( outrun.MathUtil.increase(playerSegment.getP1().getWorld().z, -this.z, stageLength) ); // stop in front of sprite (at front of segment)
                        break;
                    }
                }
            }
        }
    }
