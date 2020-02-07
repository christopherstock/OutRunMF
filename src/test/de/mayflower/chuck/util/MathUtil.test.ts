
    import * as chai from 'chai';
    import * as bz   from '../../../../../typescript/de/mayflower/outrun';

    describe( 'MathUtil', () =>
    {
        it( 'gets the sinus from 90 degrees', () =>
        {
            const result:number = bz.MathUtil.toInt( 10.0 );
            chai.expect( result ).to.equal( 10 );
        });
    });
