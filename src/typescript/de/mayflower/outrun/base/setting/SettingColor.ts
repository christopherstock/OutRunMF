
    import * as outrun from '../..';

    /** ****************************************************************************************************************
    *   Specifies all colors for the game.
    *******************************************************************************************************************/
    // tslint:disable:max-line-length
    export class SettingColor
    {
        public      static      SKY           :string      = '#72d7ee';
        public      static      TREE          :string      = '#005108';
        public      static      FOG           :string      = '#005108';

        public      static      LIGHT         :any         = new outrun.ColorCombo( '#6b6b6b', '#10aa10', '#555555', '#cccccc' );
        public      static      DARK          :any         = new outrun.ColorCombo( '#696969', '#009a00', '#bbbbbb', null      );

        public      static      START         :any         = new outrun.ColorCombo( 'white',   'white',   'white',   null      );
        public      static      FINISH        :any         = new outrun.ColorCombo( 'black',   'black',   'black',   null      );
    }
