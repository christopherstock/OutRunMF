
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   Represents one impartial and CPU-driven car.
    *******************************************************************************************************************/
    export class Car extends outrun.GameObject
    {
        /** Current position X */
        private                         x                               :number                     = 0;
        /** Current position Z */
        private                         z                               :number                     = 0;
        /** Constant speed */
        private         readonly        speed                           :number                     = 0;

        /** This is useful for interpolation during rendering phase */
        private                         percent                         :number                     = 0;

        public constructor( offset:number, z:number, image:HTMLImageElement, speed:number )
        {
            super( image );

            this.x      = offset;
            this.z      = z;
            this.speed  = speed;
        }

        public getWidth() : number
        {
            return this.width;
        }

        public getSpeed() : number
        {
            return this.speed;
        }

        public getOffset() : number
        {
            return this.x;
        }

        public getZ() : number
        {
            return this.z;
        }

        public update( dt:number, segments:outrun.Segment[], player:outrun.Player, stageLength:number ) : void
        {
            const oldSegment:outrun.Segment = outrun.Stage.findSegment( segments, this.z );

            this.x = this.x + this.updateCarOffset
            (
                segments,
                player,
                oldSegment,
                player.getPlayerSegment(),
                player.getWidth()
            );
            this.z = outrun.MathUtil.increase( this.z, dt * this.speed, stageLength );

            // this is useful for interpolation during rendering phase
            this.percent = outrun.MathUtil.percentRemaining( this.z, outrun.SettingGame.SEGMENT_LENGTH );

            const newSegment:outrun.Segment = outrun.Stage.findSegment( segments, this.z );

            if ( oldSegment !== newSegment )
            {
                const index:number = oldSegment.getCars().indexOf( this );
                oldSegment.getCars().splice( index, 1 );
                newSegment.getCars().push( this );
            }
        }

        public draw
        (
            ctx:CanvasRenderingContext2D,
            resolution:number,
            segment:outrun.Segment
        )
        : void
        {
            const spriteScale :number = outrun.MathUtil.interpolate(
                segment.getP1().getScreen().scale,
                segment.getP2().getScreen().scale,
                this.percent
            );
            const spriteX     :number = outrun.MathUtil.interpolate(
                segment.getP1().getScreen().x,
                segment.getP2().getScreen().x,
                this.percent
            )
            + (
                spriteScale
                * this.x
                * outrun.SettingGame.HALF_ROAD_WIDTH
                * ( outrun.Main.game.engine.canvasSystem.getWidth() / 2 )
            );
            const spriteY     :number = outrun.MathUtil.interpolate(
                segment.getP1().getScreen().y,
                segment.getP2().getScreen().y,
                this.percent
            );

            outrun.Drawing2D.drawSprite(
                ctx,
                resolution,
                outrun.SettingGame.HALF_ROAD_WIDTH,
                this.image,
                spriteScale,
                spriteX,
                spriteY,
                -0.5,
                -1,
                segment.getClip()
            );
        }

        /** ************************************************************************************************************
        *   Updates the offset for this car.
        ***************************************************************************************************************/
        private updateCarOffset
        (
            segments      :outrun.Segment[],
            player        :outrun.Player,
            carSegment    :outrun.Segment,
            playerSegment :outrun.Segment,
            playerW       :number
        )
        : number
        {
            const lookahead :number = 20;
            let   dir       :number = 0;

            // optimization, dont bother steering around other cars when 'out of sight' of the player
            if ( ( carSegment.getIndex() - playerSegment.getIndex() ) > outrun.SettingEngine.DRAW_DISTANCE )
                return 0;

            for ( let i:number = 1; i < lookahead; i++ )
            {
                const segment:outrun.Segment = segments[(carSegment.getIndex() + i) % segments.length];

                // check if cars drives into player
                if (
                    (segment === playerSegment)
                    && ( this.speed > player.getSpeed() )
                    && (outrun.MathUtil.overlap(player.getX(), playerW, this.x, this.width, 1.2))
                ) {
                    if (player.getX() > 0.5)
                        dir = -1;
                    else if (player.getX() < -0.5)
                        dir = 1;
                    else
                        dir = ( this.x > player.getX() ) ? 1 : -1;

                    // the closer the cars (smaller i) and the greater the speed ratio, the larger the offset
                    return dir / i * ( this.speed - player.getSpeed() ) / outrun.SettingGame.PLAYER_MAX_SPEED;
                }

                // check if car drives into a different car
                for ( const otherCar of segment.getCars() )
                {
                    if (
                        ( this.speed > otherCar.speed )
                        && outrun.MathUtil.overlap( this.x, this.width, otherCar.x, otherCar.width, 1.2 )
                    )
                    {
                        if ( otherCar.x > 0.5 )
                            dir = -1;
                        else if ( otherCar.x < -0.5 )
                            dir = 1;
                        else
                            dir = ( this.x > otherCar.x ) ? 1 : -1;
                        return dir / i * ( this.speed - otherCar.speed ) / outrun.SettingGame.PLAYER_MAX_SPEED;
                    }
                }
            }

            // if no cars ahead, but I have somehow ended up off road, then steer back on
            if ( this.x < -0.9 )
                return 0.1;
            else if ( this.x > 0.9 )
                return -0.1;
            else
                return 0;
        }
    }
