
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   Specifies all colors for the game.
    *******************************************************************************************************************/
    // tslint:disable:max-line-length
    export class SettingColor
    {
        public      static      DEFAULT_SKY     :string                     = '#72d7ee';
        public      static      DEFAULT_FOG     :string                     = '#005108'; // ( TREE color! )
        public      static      DEFAULT_LIGHT   :outrun.ColorCombo          = new outrun.ColorCombo( '#6b6b6b', '#10aa10', '#555555', '#cccccc' );
        public      static      DEFAULT_DARK    :outrun.ColorCombo          = new outrun.ColorCombo( '#696969', '#009a00', '#bbbbbb', null      );

        public      static      RED_SKY         :string                     = '#ee7872';
        public      static      RED_FOG         :string                     = '#9d3a17'; // ( TREE color! )
        public      static      RED_LIGHT       :outrun.ColorCombo          = new outrun.ColorCombo( '#515151', '#aa5110', '#ef0000', '#ffffff' );
        public      static      RED_DARK        :outrun.ColorCombo          = new outrun.ColorCombo( '#484848', '#9a5000', '#ffffff', null      );

        // TODO prune?
        public      static      START           :outrun.ColorCombo          = new outrun.ColorCombo( 'white',   'white',   'white',   null      );
        public      static      FINISH          :outrun.ColorCombo          = new outrun.ColorCombo( 'black',   'black',   'black',   null      );
    }
