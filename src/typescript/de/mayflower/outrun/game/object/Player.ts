
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   The legacy player.
    *******************************************************************************************************************/
    export class Player extends outrun.GameObject
    {
        /** The current player speed in percent. */
        private                     speedPercent        :number                     = 0;

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

        /** Current player x offset. ( -1 to 1 to stay independent of roadWidth ) */
        private                     x                   :number                     = 0;
        /** Current player Z position. */
        private                     z                   :number                     = 0;

        /** Old player Z position. */
        private                     oldZ                :number                     = 0;

        /** current player speed */
        private                     speed               :number                     = 0;

        /** z distance camera is from screen (computed) */
        private     readonly        cameraDepth         :number                     = null;

        /** player constant camera offset Z. */
        private     readonly        offsetZ             :number                     = null;

        public constructor( imageSystem:outrun.ImageSystem )
        {
            super( imageSystem, imageSystem.getImage( outrun.ImageFile.PLAYER_STRAIGHT ) );

            this.cameraDepth = ( 1 / Math.tan( ( outrun.SettingEngine.CAMERA_FIELD_OF_VIEW / 2 ) * Math.PI / 180 ) );

            this.offsetZ = ( outrun.SettingEngine.CAMERA_HEIGHT * this.getCameraDepth() );
        }

        public getCameraDepth() : number
        {
            return this.cameraDepth;
        }

        public getX() : number
        {
            return this.x;
        }

        public getOffsetZ() : number
        {
            return this.offsetZ;
        }

        public getSpeed() : number
        {
            return this.speed;
        }

        public getWidth() : number
        {
            return this.width;
        }

        public getZ() : number
        {
            return this.z;
        }

        public getOldZ() : number
        {
            return this.oldZ;
        }

        public getPlayerSegment() : outrun.Segment
        {
            return this.playerSegment;
        }

        public update
        (
            deltaTime   :number,
            stageLength :number,
            segments    :outrun.Segment[],
            keySystem   :outrun.KeySystem
        )
        : void
        {
            // store old Z position
            this.oldZ = this.z;

            // at top speed, should be able to cross from left to right (-1 to 1) in 1 second
            const deltaX :number = ( deltaTime * 2 * this.speedPercent );

            this.handleKeys( keySystem );
            this.updateZ( deltaTime, stageLength, segments );
            this.updateX( deltaX );
            this.updateSpeed( deltaTime );
            this.updateSprite();
            this.checkCentrifugalForce( deltaX, this.speedPercent, this.playerSegment );
            this.checkOffroad( this.playerSegment, this.width, deltaTime, stageLength );
            this.checkCarColliding( stageLength );
            this.clipBoundsForX();
        }

        public draw( canvasSystem :outrun.CanvasSystem, playerPercent :number ) : void
        {
            const resolution :number = canvasSystem.getResolution();

            const speedPercent :number = ( this.speed / outrun.SettingGame.PLAYER_MAX_SPEED );
            const bounce       :number = (
                outrun.SettingGame.PLAYER_MAX_BOUNCE * Math.random() * speedPercent * resolution
            ) * outrun.MathUtil.getRandomElement( [ -1, 1 ] );
            const scale        :number = ( this.cameraDepth / this.offsetZ );
            const destX        :number = ( canvasSystem.getWidth() / 2 );
            const destY        :number = (
                ( canvasSystem.getHeight() / 2 )
                - (
                    this.cameraDepth / this.offsetZ * outrun.MathUtil.interpolate
                    (
                        this.playerSegment.getP1().getPlayer().y,
                        this.playerSegment.getP2().getPlayer().y,
                        playerPercent
                    )
                    * canvasSystem.getHeight() / 2
                )
            );

            // draw player
            outrun.Drawing2D.drawImage
            (
                canvasSystem,
                outrun.SettingGame.HALF_ROAD_WIDTH,
                this.image,
                scale,
                destX,
                destY + bounce,
                -0.5,
                -1,
                0
            );
        }

        private updatePlayerSegment( segments:outrun.Segment[] ) : void
        {
            this.playerSegment = outrun.Stage.findSegment( segments, this.z + this.offsetZ );
        }

        private handleKeys( keySystem:outrun.KeySystem ) : void
        {
            this.keyLeft   = keySystem.isPressed( outrun.KeyCodes.KEY_LEFT  );
            this.keyRight  = keySystem.isPressed( outrun.KeyCodes.KEY_RIGHT );
            this.keyFaster = keySystem.isPressed( outrun.KeyCodes.KEY_UP    );
            this.keySlower = keySystem.isPressed( outrun.KeyCodes.KEY_DOWN  );
        }

        private checkCollidingWithCar( car:outrun.Car, playerW:number, carW:number, stageLength:number ) : boolean
        {
            // check player colliding with other car
            if ( outrun.MathUtil.overlap( this.x, playerW, car.getOffset(), carW, 0.8 ) ) {

                // decelerate the player
                this.speed = car.getSpeed() * ( car.getSpeed() / this.speed );
                this.z = outrun.MathUtil.increase( car.getZ(), -this.offsetZ, stageLength );

                return true;
            }

            return false;
        }

        /** ************************************************************************************************************
        *   Checks centrifugal force modification if player is in a curve.
        ***************************************************************************************************************/
        private checkCentrifugalForce( dx:number, speedPercent:number, playerSegment:outrun.Segment ) : void
        {
            this.x = this.x - ( dx * speedPercent * playerSegment.getCurve() * outrun.SettingGame.CENTRIFUGAL );
        }

        private checkCarColliding( stageLength:number ) : void
        {
            // browse all cars
            for ( const car of this.playerSegment.getCars() ) {

                if ( this.speed > car.getSpeed() )
                {
                    // check if player is colliding?
                    if ( this.checkCollidingWithCar( car, this.width, car.getWidth(), stageLength ) )
                    {
                        break;
                    }
                }
            }
        }

        /** ************************************************************************************************************
        *   Clips the player to the maximum bounds when offroad.
        ***************************************************************************************************************/
        private clipBoundsForX() : void
        {
            this.x = outrun.MathUtil.clip
            (
                this.x,
                -outrun.SettingEngine.ROAD_MAX_BOUNDS,
                outrun.SettingEngine.ROAD_MAX_BOUNDS
            );
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
            this.speed = outrun.MathUtil.clip( this.speed, 0, outrun.SettingGame.PLAYER_MAX_SPEED );

            // calculate speed percentage ..
            this.speedPercent  = this.speed / outrun.SettingGame.PLAYER_MAX_SPEED;
        }

        /** ************************************************************************************************************
        *   Checks if the player is offroad and modifies the speed and possibly playerZ.
        ***************************************************************************************************************/
        private checkOffroad( playerSegment:outrun.Segment, playerW:number, delta:number, stageLength:number ) : void
        {
            if ( ( this.x < -1 ) || ( this.x > 1 ) )
            {
                // clip to offroad speed
                if ( this.speed > outrun.SettingGame.OFF_ROAD_LIMIT )
                {
                    this.speed = outrun.MathUtil.accelerate
                    (
                        this.speed,
                        outrun.SettingGame.DECELERATION_OFF_ROAD,
                        delta
                    );
                }

                // check player collision with obstacle
                for ( const obstacle of playerSegment.getObstacles() )
                {
                    if
                    (
                        outrun.MathUtil.overlap
                        (
                            this.x,
                            playerW,
                            obstacle.getX() + obstacle.getWidth() / 2 * ( obstacle.getX() > 0 ? 1 : -1 ),
                            obstacle.getWidth(),
                            1.0
                        )
                    )
                    {
                        // decrease player speed
                        this.speed = ( outrun.SettingGame.PLAYER_MAX_SPEED / 5 );

                        // stop in front of sprite (at front of segment)
                        this.z =
                        (
                            outrun.MathUtil.increase( playerSegment.getP1().getWorld().z, -this.offsetZ, stageLength )
                        );
                        break;
                    }
                }
            }
        }

        private updateZ( dt:number, stageLength:number, segments:outrun.Segment[] ) : void
        {
            // update Z and segment
            this.z =
            (
                outrun.MathUtil.increase
                (
                    this.z,
                    dt * this.speed,
                    stageLength
                )
            );
            this.updatePlayerSegment( segments );
        }

        private updateX( dx:number ) : void
        {
            // update X according to speed
            if ( this.keyLeft )
            {
                this.x = this.x - dx;
            }
            else if ( this.keyRight )
            {
                this.x = this.x + dx;
            }
        }

        private updateSprite() : void
        {
            // assign current sprite
            const updown :number =
            (
                this.playerSegment.getP2().getWorld().y - this.playerSegment.getP1().getWorld().y
            );

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
                this.setSprite
                (
                    ( updown > 0 )
                    ? outrun.ImageFile.PLAYER_UPHILL_STRAIGHT
                    : outrun.ImageFile.PLAYER_STRAIGHT
                );
            }
        }
    }
