
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   Specifies all colors for the game.
    *******************************************************************************************************************/
    // tslint:disable:max-line-length
    export class SettingColor
    {
        public      static      DEFAULT_SKY     :string                     = '#72d7ee';
        public      static      DEFAULT_FOG     :string                     = '#005108'; // ( TREE color! )

        public      static      RED_SKY         :string                     = '#ee7872';
        public      static      RED_FOG         :string                     = '#ffffff';

        public      static      DEFAULT_LIGHT   :outrun.SegmentColor        = new outrun.SegmentColor( '#6b6b6b', '#10aa10', '#555555', '#cccccc' );
        public      static      DEFAULT_DARK    :outrun.SegmentColor        = new outrun.SegmentColor( '#696969', '#009a00', '#bbbbbb', null      );
        public      static      DEFAULT         :outrun.SegmentColorSet     = new outrun.SegmentColorSet( SettingColor.DEFAULT_LIGHT, SettingColor.DEFAULT_DARK );

        public      static      RED_LIGHT       :outrun.SegmentColor        = new outrun.SegmentColor( '#515151', '#aa5110', '#ef0000', '#ffffff' );
        public      static      RED_DARK        :outrun.SegmentColor        = new outrun.SegmentColor( '#484848', '#9a5000', '#ffffff', null      );
        public      static      RED             :outrun.SegmentColorSet     = new outrun.SegmentColorSet( SettingColor.RED_LIGHT, SettingColor.RED_DARK );

        public      static      START           :outrun.SegmentColor        = new outrun.SegmentColor( 'white',   'white',   'white',   null      );
        public      static      FINISH          :outrun.SegmentColor        = new outrun.SegmentColor( 'black',   'black',   'black',   null      );
    }
