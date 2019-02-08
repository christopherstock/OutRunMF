
    /** ****************************************************************************************************************
    *   Specifies all different images used in the game.
    *
    *   TODO class to enum! Array external!
    *******************************************************************************************************************/
    // tslint:disable:max-line-length
    export class ImageFile
    {
        public  static  readonly    BILLBOARD01             :string         = 'sprite/billboard01.png';
        public  static  readonly    BILLBOARD02             :string         = 'sprite/billboard02.png';
        public  static  readonly    BILLBOARD03             :string         = 'sprite/billboard03.png';
        public  static  readonly    BILLBOARD04             :string         = 'sprite/billboard04.png';
        public  static  readonly    BILLBOARD05             :string         = 'sprite/billboard05.png';
        public  static  readonly    BILLBOARD06             :string         = 'sprite/billboard06.png';
        public  static  readonly    BILLBOARD07             :string         = 'sprite/billboard07.png';
        public  static  readonly    BILLBOARD08             :string         = 'sprite/billboard08.png';
        public  static  readonly    BILLBOARD09             :string         = 'sprite/billboard09.png';
        public  static  readonly    BOULDER1                :string         = 'sprite/boulder1.png';
        public  static  readonly    BOULDER2                :string         = 'sprite/boulder2.png';
        public  static  readonly    BOULDER3                :string         = 'sprite/boulder3.png';
        public  static  readonly    BUSH1                   :string         = 'sprite/bush1.png';
        public  static  readonly    BUSH2                   :string         = 'sprite/bush2.png';
        public  static  readonly    CACTUS                  :string         = 'sprite/cactus.png';
        public  static  readonly    CAR01                   :string         = 'sprite/car01.png';
        public  static  readonly    CAR02                   :string         = 'sprite/car02.png';
        public  static  readonly    CAR03                   :string         = 'sprite/car03.png';
        public  static  readonly    CAR04                   :string         = 'sprite/car04.png';
        public  static  readonly    COLUMN                  :string         = 'sprite/column.png';
        public  static  readonly    DEAD_TREE1              :string         = 'sprite/deadTree1.png';
        public  static  readonly    DEAD_TREE2              :string         = 'sprite/deadTree2.png';
        public  static  readonly    PALM_TREE               :string         = 'sprite/palmTree.png';
        public  static  readonly    PLAYER_LEFT             :string         = 'sprite/playerLeft.png';
        public  static  readonly    PLAYER_RIGHT            :string         = 'sprite/playerRight.png';
        public  static  readonly    PLAYER_STRAIGHT         :string         = 'sprite/playerStraight.png';
        public  static  readonly    PLAYER_UPHILL_LEFT      :string         = 'sprite/playerUphillLeft.png';
        public  static  readonly    PLAYER_UPHILL_RIGHT     :string         = 'sprite/playerUphillRight.png';
        public  static  readonly    PLAYER_UPHILL_STRAIGHT  :string         = 'sprite/playerUphillStraight.png';
        public  static  readonly    STUMP                   :string         = 'sprite/stump.png';
        public  static  readonly    TREE1                   :string         = 'sprite/tree1.png';
        public  static  readonly    TREE2                   :string         = 'sprite/tree2.png';
        public  static  readonly    TRUCK1                  :string         = 'sprite/truck1.png';
        public  static  readonly    TRUCK2                  :string         = 'sprite/truck2.png';

        public  static  readonly    BG_HILL1                :string         = 'background/hill1.png';
        public  static  readonly    BG_SKY1                 :string         = 'background/sky1.png';
        public  static  readonly    BG_TREE1                :string         = 'background/tree1.png';

        public  static  readonly    BG_HILL2                :string         = 'background/hill2.png';
        public  static  readonly    BG_SKY2                 :string         = 'background/sky2.png';
        public  static  readonly    BG_TREE2                :string         = 'background/tree2.png';

        /** This array contains all filenames of all images that shall be loaded. */
        public  static  readonly    FILE_NAMES              :string[]       =
        [
            ImageFile.BILLBOARD01,
            ImageFile.BILLBOARD02,
            ImageFile.BILLBOARD03,
            ImageFile.BILLBOARD04,
            ImageFile.BILLBOARD05,
            ImageFile.BILLBOARD06,
            ImageFile.BILLBOARD07,
            ImageFile.BILLBOARD08,
            ImageFile.BILLBOARD09,

            ImageFile.BOULDER1,
            ImageFile.BOULDER1,
            ImageFile.BOULDER2,
            ImageFile.BOULDER2,
            ImageFile.BOULDER3,
            ImageFile.BOULDER3,
            ImageFile.BUSH1,
            ImageFile.BUSH1,
            ImageFile.BUSH2,
            ImageFile.BUSH2,
            ImageFile.CACTUS,
            ImageFile.CACTUS,
            ImageFile.CAR01,
            ImageFile.CAR01,
            ImageFile.CAR02,
            ImageFile.CAR02,
            ImageFile.CAR03,
            ImageFile.CAR03,
            ImageFile.CAR04,
            ImageFile.CAR04,
            ImageFile.COLUMN,
            ImageFile.COLUMN,
            ImageFile.DEAD_TREE1,
            ImageFile.DEAD_TREE1,
            ImageFile.DEAD_TREE2,
            ImageFile.DEAD_TREE2,
            ImageFile.PALM_TREE,
            ImageFile.PALM_TREE,
            ImageFile.PLAYER_LEFT,
            ImageFile.PLAYER_LEFT,
            ImageFile.PLAYER_RIGHT,
            ImageFile.PLAYER_RIGHT,
            ImageFile.PLAYER_STRAIGHT,
            ImageFile.PLAYER_STRAIGHT,
            ImageFile.PLAYER_UPHILL_LEFT,
            ImageFile.PLAYER_UPHILL_LEFT,
            ImageFile.PLAYER_UPHILL_RIGHT,
            ImageFile.PLAYER_UPHILL_RIGHT,
            ImageFile.PLAYER_UPHILL_STRAIGHT,
            ImageFile.PLAYER_UPHILL_STRAIGHT,
            ImageFile.TRUCK2,
            ImageFile.TRUCK2,
            ImageFile.STUMP,
            ImageFile.STUMP,
            ImageFile.TREE1,
            ImageFile.TREE1,
            ImageFile.TREE2,
            ImageFile.TREE2,
            ImageFile.TRUCK1,

            ImageFile.BG_HILL1,
            ImageFile.BG_SKY1,
            ImageFile.BG_TREE1,

            ImageFile.BG_HILL2,
            ImageFile.BG_SKY2,
            ImageFile.BG_TREE2,
        ];

        public  static  readonly    BILLBOARDS              :string[]       = [ ImageFile.BILLBOARD01, ImageFile.BILLBOARD02, ImageFile.BILLBOARD03, ImageFile.BILLBOARD04, ImageFile.BILLBOARD05, ImageFile.BILLBOARD06, ImageFile.BILLBOARD07, ImageFile.BILLBOARD08, ImageFile.BILLBOARD09 ];
        public  static  readonly    PLANTS                  :string[]       = [ ImageFile.TREE1, ImageFile.TREE2, ImageFile.DEAD_TREE1, ImageFile.DEAD_TREE2, ImageFile.PALM_TREE, ImageFile.BUSH1, ImageFile.BUSH2, ImageFile.CACTUS, ImageFile.STUMP, ImageFile.BOULDER1, ImageFile.BOULDER2, ImageFile.BOULDER3 ];
        public  static  readonly    CARS                    :string[]       = [ ImageFile.CAR01, ImageFile.CAR02, ImageFile.CAR03, ImageFile.CAR04, ImageFile.TRUCK2, ImageFile.TRUCK1 ];
    }
