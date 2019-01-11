
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   Represents one impartial and CPU-driven car.
    *******************************************************************************************************************/
    export class Car
    {
        private                         offset                          :number                     = 0;

        private                         z                               :number                     = 0;

        private                         percent                         :number                     = 0;

        private         readonly        speed                           :number                     = 0;

        /** The image ID of this car's sprite. */
        private         readonly        sprite                          :string                     = null;

        public constructor( offset:number, z:number, sprite:string, speed:number )
        {
            this.offset  = offset;
            this.z       = z;
            this.sprite  = sprite;
            this.speed   = speed;
        }

        public getSprite() : string
        {
            return this.sprite;
        }

        public getSpeed() : number
        {
            return this.speed;
        }

        public getOffset() : number
        {
            return this.offset;
        }

        public getZ() : number
        {
            return this.z;
        }

        public update( dt:number, segments:outrun.Segment[], player:outrun.Player, playerSegment:outrun.Segment, playerW:number, stageLength:number ) : void
        {
            const oldSegment:outrun.Segment = outrun.Stage.findSegment( segments, this.z );

            this.offset = this.offset + this.updateCarOffset( segments, player, oldSegment, playerSegment, playerW );
            this.z = outrun.MathUtil.increase( this.z, dt * this.speed, stageLength );

            // this is useful for interpolation during rendering phase
            this.percent = outrun.MathUtil.percentRemaining( this.z, outrun.SettingGame.SEGMENT_LENGTH );

            const newSegment:outrun.Segment = outrun.Stage.findSegment( segments, this.z );

            if ( oldSegment !== newSegment )
            {
                const index:number = oldSegment.cars.indexOf( this );
                oldSegment.cars.splice( index, 1 );
                newSegment.cars.push( this );
            }
        }

        /** ************************************************************************************************************
        *   Updates the offset for this car.
        ***************************************************************************************************************/
        public updateCarOffset( segments:outrun.Segment[], player:outrun.Player, carSegment:outrun.Segment, playerSegment:outrun.Segment, playerW:number ) : number
        {
            const lookahead :number = 20;
            const carW      :number = outrun.Main.game.engine.imageSystem.getImage( this.sprite ).width * outrun.SettingGame.SPRITE_SCALE;

            let   dir       :number = 0;
            let   otherCarW :number = 0;

            // optimization, dont bother steering around other cars when 'out of sight' of the player
            if ( ( carSegment.getIndex() - playerSegment.getIndex() ) > outrun.SettingGame.DRAW_DISTANCE )
                return 0;

            for ( let i:number = 1; i < lookahead; i++ )
            {
                const segment:outrun.Segment = segments[(carSegment.getIndex() + i) % segments.length];

                if ((segment === playerSegment) && ( this.speed > player.getSpeed() ) && (outrun.MathUtil.overlap(player.getX(), playerW, this.offset, carW, 1.2))) {
                    if (player.getX() > 0.5)
                        dir = -1;
                    else if (player.getX() < -0.5)
                        dir = 1;
                    else
                        dir = ( this.offset > player.getX() ) ? 1 : -1;

                    // the closer the cars (smaller i) and the greated the speed ratio, the larger the offset
                    return dir / i * ( this.speed - player.getSpeed() ) / outrun.SettingGame.MAX_SPEED;
                }

                for ( const otherCar of segment.cars )
                {
                    otherCarW = outrun.Main.game.engine.imageSystem.getImage( otherCar.sprite ).width * outrun.SettingGame.SPRITE_SCALE;
                    if ( ( this.speed > otherCar.speed ) && outrun.MathUtil.overlap( this.offset, carW, otherCar.offset, otherCarW, 1.2 ) )
                    {
                        if ( otherCar.offset > 0.5 )
                            dir = -1;
                        else if ( otherCar.offset < -0.5 )
                            dir = 1;
                        else
                            dir = ( this.offset > otherCar.offset ) ? 1 : -1;
                        return dir / i * ( this.speed - otherCar.speed ) / outrun.SettingGame.MAX_SPEED;
                    }
                }
            }

            // if no cars ahead, but I have somehow ended up off road, then steer back on
            if (this.offset < -0.9)
                return 0.1;
            else if (this.offset > 0.9)
                return -0.1;
            else
                return 0;
        }

        public draw( ctx:CanvasRenderingContext2D, resolution:number, segment:outrun.Segment ) : void
        {
            const spriteScale :number = outrun.MathUtil.interpolate(segment.getP1().getScreen().scale, segment.getP2().getScreen().scale, this.percent);
            const spriteX     :number = outrun.MathUtil.interpolate(segment.getP1().getScreen().x,     segment.getP2().getScreen().x, this.percent) + (spriteScale * this.offset * outrun.SettingGame.ROAD_WIDTH * outrun.Main.game.engine.canvasSystem.getWidth() / 2);
            const spriteY     :number = outrun.MathUtil.interpolate(segment.getP1().getScreen().y,     segment.getP2().getScreen().y, this.percent);

            outrun.Drawing2D.drawSprite(ctx, resolution, outrun.SettingGame.ROAD_WIDTH, this.sprite, spriteScale, spriteX, spriteY, -0.5, -1, segment.clip);
        }
    }
