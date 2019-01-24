
    /** ****************************************************************************************************************
    *   Offers additional mathematical functionality.
    *******************************************************************************************************************/
    export class MathUtil
    {
        /** ************************************************************************************************************
        *   Converts the given number into an integer value.
        *   All decimal places are cut off.
        *
        *   @param num The number to convert to an integer.
        *
        *   @return The converted value as an integer.
        ***************************************************************************************************************/
        public static toInt( num:number ) : number
        {
            return parseInt( String( num ), 10 );
        }

        /** ************************************************************************************************************
        *   Clips the given values inside the min and max bounds.
        *
        *   @param value The value to clip.
        *   @param min   The minimum bound to clip the value.
        *   @param max   The maximum bound to clip the value.
        *
        *   @return The clipped value.
        ***************************************************************************************************************/
        public static clip( value:number, min:number, max:number ) : number
        {
            return Math.max( min, Math.min( value, max ) );
        }

        /** ************************************************************************************************************
        *   Returns a random integer between the given minimum and maximum.
        *
        *   @param min The minimum value to return by random.
        *   @param max The maximum value to return by random.
        *
        *   @return A random integer in the specified range.
        ***************************************************************************************************************/
        public static getRandomInt( min:number, max:number ) : number
        {
            return Math.floor( ( Math.random() * ( max + 1 - min ) ) + min );
        }

        /** ************************************************************************************************************
        *   Returns a random element of the given collection.
        *
        *   @param collection The collection to return a random element from.
        *
        *   @return A random element of the collection.
        ***************************************************************************************************************/
        public static getRandomElement( collection:any[] ) : any
        {
            return collection[ MathUtil.getRandomInt( 0, collection.length - 1 ) ];
        }

        /** ************************************************************************************************************
        *   Modifies the specified speed with the given delta and acceleration rate.
        *
        *   @param speed        The base speed.
        *   @param acceleration The acceleration rate. May be negative for deceleration.
        *   @param delta        The speed delta.
        *
        *   @return The modified speed.
        ***************************************************************************************************************/
        public static accelerate( speed:number, acceleration:number, delta:number ) : number
        {
            return ( speed + ( acceleration * delta ) );
        }

        /** ************************************************************************************************************
        *   Determines if two lines overlap.
        *
        *   @param x1           The CENTER point of the 1st line.
        *   @param width1       The width of the 1st line.
        *   @param x2           The CENTER point of the 2nd line.
        *   @param width2       The width of the 2nd line.
        *   @param percent      The width modifier for overlap check.
        *                       Values lower 1.0 allow collision tolerance.
        *
        *   @return <code>true</code> if the two lines overlap.
        ***************************************************************************************************************/
        public static overlap( x1:number, width1:number, x2:number, width2:number, percent:number ) : boolean
        {
            // note that x1 and x2 are the center points!
            const half :number = percent / 2;

            const min1 :number = x1 - ( width1 * half );
            const max1 :number = x1 + ( width1 * half );
            const min2 :number = x2 - ( width2 * half );
            const max2 :number = x2 + ( width2 * half );

            return ! ( ( max1 < min2 ) || ( min1 > max2 ) );
        }

        public static percentRemaining( value:number, total:number ) : number
        {
            return ( ( value % total ) / total );
        }

        public static interpolate( start:number, end:number, ratio:number ) : number
        {
            return ( start + ( ( end - start ) * ratio ) );
        }

        public static easeIn( start:number, end:number, percent:number ) : number
        {
            return ( start + ( ( end - start ) * Math.pow( percent, 2 ) ) );
        }

        public static easeInOut( a:number, b:number, percent:number ) : number
        {
            return ( a + ( b - a ) * ( ( -Math.cos( percent * Math.PI ) / 2 ) + 0.5 ) );
        }

        public static exponentialFog( distance:number, density:number ) : number
        {
            return ( 1 / ( Math.pow( Math.E, ( distance * distance * density ) ) ) );
        }

        public static increase( start:number, increment:number, max:number ) : number
        {
            let result:number = ( start + increment );

            while ( result >= max )
            {
                result -= max;
            }

            while ( result < 0 )
            {
                result += max;
            }

            return result;
        }
    }
