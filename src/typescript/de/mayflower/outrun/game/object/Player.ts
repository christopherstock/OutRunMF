
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

        /** player x offset from center of road (-1 to 1 to stay independent of roadWidth) */
        private                     x                   :number                     = 0;
        /** current camera Z position (add playerZ to get player's absolute Z position) */
        private                     z                   :number                     = 0;

        /** current player speed */
        private                     speed               :number                     = 0;

        /** z distance camera is from screen (computed) */
        private     readonly        cameraDepth         :number                     = null;

        /** player constant camera offset Z. */
        private     readonly        offsetZ             :number                     = null;

        public constructor()
        {
            super( outrun.Main.game.engine.imageSystem.getImage( outrun.ImageFile.PLAYER_STRAIGHT ) );

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

        public getPlayerSegment() : outrun.Segment
        {
            return this.playerSegment;
        }

        public updatePlayerSegment( segments:outrun.Segment[] ) : void
        {
            this.playerSegment = outrun.Stage.findSegment( segments, this.z + this.offsetZ );
        }

        public getSpeedPercent() : number
        {
            return this.speedPercent;
        }

        public update
        (
            dx          :number,
            dt          :number,
            stageLength :number
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

            // check centrifugal force modification if player is in a curve
            this.checkCentrifugalForce( dx, this.speedPercent, this.playerSegment );

            // check if player is off-road
            this.checkOffroad( this.playerSegment, this.width, dt, stageLength );

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

            // dont ever let it go too far out of bounds
            this.clipBoundsForX();
        }

        public updatePosition( dt:number, stageLength:number ) : void
        {
            this.z =
            (
                outrun.MathUtil.increase
                (
                    this.z,
                    dt * this.speed,
                    stageLength
                )
            );
        }

        public draw
        (
            ctx           :CanvasRenderingContext2D,
            resolution    :number,
            playerPercent :number
        )
        : void
        {
            const speedPercent :number = ( this.speed / outrun.SettingGame.PLAYER_MAX_SPEED );
            const bounce       :number = (
                outrun.SettingGame.PLAYER_MAX_BOUNCE * Math.random() * speedPercent * resolution
            ) * outrun.MathUtil.randomChoice( [ -1, 1 ] );
            const scale        :number = ( this.cameraDepth / this.offsetZ );
            const destX        :number = ( outrun.Main.game.engine.canvasSystem.getWidth() / 2 );
            const destY        :number = (
                (outrun.Main.game.engine.canvasSystem.getHeight() / 2)
                - (
                    this.cameraDepth / this.offsetZ * outrun.MathUtil.interpolate
                    (
                        this.playerSegment.getP1().getPlayer().y,
                        this.playerSegment.getP2().getPlayer().y,
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
                this.image,
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

        private checkCollidingWithCar( car:outrun.Car, playerW:number, carW:number, stageLength:number ) : boolean
        {
            if ( outrun.MathUtil.overlap( this.x, playerW, car.getOffset(), carW, 0.8 ) ) {

                // decelerate the player
                this.speed = car.getSpeed() * ( car.getSpeed() / this.speed );
                this.z = outrun.MathUtil.increase( car.getZ(), -this.offsetZ, stageLength );

                return true;
            }

            return false;
        }

        private checkCentrifugalForce( dx:number, speedPercent:number, playerSegment:outrun.Segment ) : void
        {
            this.x = this.x - ( dx * speedPercent * playerSegment.getCurve() * outrun.SettingGame.CENTRIFUGAL );
        }

        /** ************************************************************************************************************
        *   Clips the player to the maximum bounds when offroad.
        ***************************************************************************************************************/
        private clipBoundsForX() : void
        {
            this.x = outrun.MathUtil.limit
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
            this.speed = outrun.MathUtil.limit( this.speed, 0, outrun.SettingGame.PLAYER_MAX_SPEED );

            // calculate speed percentage ..
            this.speedPercent  = this.speed / outrun.SettingGame.PLAYER_MAX_SPEED;
        }

        private checkOffroad( playerSegment:outrun.Segment, playerW:number, dt:number, stageLength:number ) : void
        {
            if ( ( this.x < -1 ) || ( this.x > 1 ) )
            {
                // clip to offroad speed
                if ( this.speed > outrun.SettingGame.OFF_ROAD_LIMIT )
                {
                    this.speed = outrun.MathUtil.accelerate( this.speed, outrun.SettingGame.DECELERATION_OFF_ROAD, dt );
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
                            0
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
    }
