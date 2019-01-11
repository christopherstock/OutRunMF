
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   Represents one impartial and CPU-driven car.
    *
    *   TODO all private!
    *******************************************************************************************************************/
    export class Car
    {
        public                          offset                          :number                     = 0;

        public                          z                               :number                     = 0;

        public                          speed                           :number                     = 0;

        public                          percent                         :number                     = 0;

        /** The image ID of this car's sprite. TODO to class ImageID? */
        private             readonly    sprite                          :string                     = null;

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

        /** ************************************************************************************************************
        *   Updates the offset for this car.
        ***************************************************************************************************************/
        public updateCarOffset( segments:outrun.Segment[], player:outrun.Player, carSegment:outrun.Segment, playerSegment:outrun.Segment, playerW:number ) : number
        {
            const lookahead :number = 20;
            const carW      :number = outrun.Main.game.imageSystem.getImage( this.sprite ).width * outrun.SettingGame.SPRITE_SCALE;

            let   dir       :number = 0;    // TODO create enum for direction
            let   otherCarW :number = 0;

            // optimization, dont bother steering around other cars when 'out of sight' of the player
            if ((carSegment.index - playerSegment.index) > outrun.SettingGame.DRAW_DISTANCE)
                return 0;

            for ( let i:number = 1; i < lookahead; i++ )
            {
                const segment:outrun.Segment = segments[(carSegment.index + i) % segments.length];

                if ((segment === playerSegment) && (this.speed > player.speed) && (outrun.MathUtil.overlap(player.getX(), playerW, this.offset, carW, 1.2))) {
                    if (player.getX() > 0.5)
                        dir = -1;
                    else if (player.getX() < -0.5)
                        dir = 1;
                    else
                        dir = ( this.offset > player.getX() ) ? 1 : -1;
                    return dir / i * (this.speed - player.speed) / outrun.SettingGame.MAX_SPEED; // the closer the cars (smaller i) and the greated the speed ratio, the larger the offset
                }

                for ( const otherCar of segment.cars )
                {
                    otherCarW = outrun.Main.game.imageSystem.getImage( otherCar.sprite ).width * outrun.SettingGame.SPRITE_SCALE;
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
            const spriteScale :number = outrun.MathUtil.interpolate(segment.p1.screen.scale, segment.p2.screen.scale, this.percent);
            const spriteX     :number = outrun.MathUtil.interpolate(segment.p1.screen.x, segment.p2.screen.x, this.percent) + (spriteScale * this.offset * outrun.SettingGame.ROAD_WIDTH * outrun.Main.game.canvasSystem.getWidth() / 2);
            const spriteY     :number = outrun.MathUtil.interpolate(segment.p1.screen.y, segment.p2.screen.y, this.percent);

            outrun.Drawing2D.sprite(ctx, outrun.Main.game.canvasSystem.getWidth(), outrun.Main.game.canvasSystem.getHeight(), resolution, outrun.SettingGame.ROAD_WIDTH, this.sprite, spriteScale, spriteX, spriteY, -0.5, -1, segment.clip);
        }
    }
