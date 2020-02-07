
    // eslint-disable-next-line import/no-deprecated
    import './de/mayflower/outrun/css/global.less';

    import * as outrun from './de/mayflower/outrun';

    /*******************************************************************************************************************
    *   Being invoked when the page is loaded completely.
    *******************************************************************************************************************/
    window.onload = () : void  =>
    {
        outrun.Main.main();
    };

    /*******************************************************************************************************************
    *   Being invoked when the page is left.
    *******************************************************************************************************************/
    window.onunload = () : void  =>
    {
    };
