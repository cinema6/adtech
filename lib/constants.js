module.exports = {
    IBanner : {
        STYLE_IMAGE          : 1,
        STYLE_APPLET         : 2,
        STYLE_HTML           : 3,
        STYLE_REDIRECT       : 4,
        STYLE_RAW            : 10,
        STYLE_VIDEO          : 11,
        STYLE_VIDEO_REDIRECT : 12,

        STATUS_PENDING       : 0,
        STATUS_ACTIVE        : 1,
        STATUS_ARCHIVED      : 2,
        STATUS_DELETED       : 2,

        FILE_TYPE_SWF        : 'zip',
        FILE_TYPE_ZIP        : 'zip',
        FILE_TYPE_GIF        : 'gif',
        FILE_TYPE_JPG        : 'jpg',
        FILE_TYPE_PNG        : 'png',
        FILE_TYPE_HTML       : 'html'
    },

    IFrequencyInformation : {
        FREQUENCY_NONE : -1,
        FREQUENCY_SESSION : 8,
        FREQUENCY_SESSION_BROWSER : 11,
        FREQUENCY_5_MINUTES : 18,
        FREQUENCY_15_MINUTES : 12,
        FREQUENCY_1_HOUR : 0,
        FREQUENCY_2_HOURS : 1,
        FREQUENCY_3_HOURS : 13,
        FREQUENCY_4_HOURS : 2,
        FREQUENCY_6_HOURS : 14,
        FREQUENCY_8_HOURS : 3,
        FREQUENCY_12_HOURS : 15,
        FREQUENCY_24_HOURS : 10,
        FREQUENCY_36_HOURS : 16,
        FREQUENCY_48_HOURS : 17,
        FREQUENCY_DAILY : 4,
        FREQUENCY_3_DAYS : 9,
        FREQUENCY_WEEKLY : 5,
        FREQUENCY_MONTHLY : 6,
        FREQUENCY_CAMPAIGN_LIFETIME : 7,
        FREQUENCY_CATEGORY_CAMPAIGN : 1,
        CAPPING_TYPE_IMPRESSION : 0,
        CAPPING_TYPE_CLICK : 1,
        CAPPING_TYPE_VIEW : 2
    },

    IAttributeOperatorValueExpression : {
        OP_EQUAL         : '==',
        OP_GREATERTHAN   : '>',
        OP_LESSTHAN      : '<',
        OP_GREATER_EQUAL : '>=',
        OP_LESS_EQUAL    : '<=',
        OP_BETWEEN       : 'BETWEEN',
        OP_OUTSIDE       : 'OUTSIDE',
        OP_LIKE          : 'LIKE',
        OP_NOT_LIKE      : 'NOT_LIKE',
        OP_NOT_EQUAL     : '!=',
        OP_NOT_IN        : 'NOT_IN',
        OP_IN            : 'IN',
        OP_CONTAINS      : 'CONTAINS'
    },

    ICampaign : {
        ADGOAL_TYPE_STD_OPEN : 'campaign.adgoaltype.standardOpen',
        ADGOAL_TYPE_STD_GUARANTEED : 'campaign.adgoaltype.standardGuar',
        ADGOAL_TYPE_EXCLUSIVE : 'campaign.adgoaltype.exclusive',
        ADGOAL_TYPE_HOUSE : 'campaign.adgoaltype.house',
        ADGOAL_TYPE_BELL_CURVE : 'campaign.adgoaltype.bellCurve',
        ADGOAL_TYPE_DISTRIBUTED : 'campaign.adgoaltype.distributed',
        ADGOAL_TYPE_CLICK_COMMAND : 'campaign.adgoaltype.clickCommand',
        ADGOAL_TYPE_FLAT_FEE : 'campaign.adgoaltype.flatFee',
        ADGOAL_TYPE_PERCENT : 'campaign.adgoaltype.percentage',
        ADGOAL_TYPE_STATIC : 'campaign.adgoaltype.stdStatic',

        CAMPAIGN_TYPE_MASTER : 'campaign.option.masterCampaign',
        CAMPAIGN_TYPE_HOUSE : 'campaign.option.houseCampaign',
        CAMPAIGN_TYPE_OPEN : 'campaign.option.openCampaign',
        CAMPAIGN_TYPE_GUARANTEED : 'campaign.option.guaranteedCampaign',
        CAMPAIGN_TYPE_CLICKCOMMAND : 'campaign.option.clickcommandCampaign',
        CAMPAIGN_TYPE_PERCENTAGE : 'campaign.option.percentage',
        CAMPAIGN_TYPE_FORECAST : 'campaign.option.forecastCampaign',
        CAMPAIGN_TYPE_AGENCY : 'campaign.option.agencyCampaign',
        CAMPAIGN_TYPE_AGENCY_FLIGHT : 'campaign.option.agencyFlight',
        CAMPAIGN_TYPE_STANDALONE : 'campaign.option.standaloneCampaign',
        CAMPAIGN_TYPE_ROADBLOCK : 'campaign.option.roadblockCampaign',
        CAMPAIGN_TYPE_AOL_GUARANTEED : 'aol.guaranteed.cpm',
        CAMPAIGN_TYPE_AOL_BULK : 'aol.bulk.cpm',
        CAMPAIGN_TYPE_AOL_ROADBLOCK : 'aol.roadblock.cpd',
        CAMPAIGN_TYPE_INTERNATIONALREDIRECT : 'campaign.option.internationalRedirect',
        CAMPAIGN_TYPE_CROSSNETWORKROADBLOCK : 'campaign.option.crossNetwork.roadblock',
        CAMPAIGN_TYPE_SHAREOFVOICE : 'campaign.option.shareOfVoiceCampaign',
        CAMPAIGN_TYPE_STATIC : 'campaign.option.static',
        
        EXCLUSIVE_TYPE_NONE : 0,
        EXCLUSIVE_TYPE_IMPRESSION_TARGET : 1,
        EXCLUSIVE_TYPE_END_DATE : 2,

        FEATURE_ADCOMBANNERCREATOR : 'adcombannercreator',
        FEATURE_ADLOCAL : 'adlocal',
        FEATURE_AGENCY : 'agency',
        FEATURE_BANNER : 'banner',
        FEATURE_CARRIERTARGETING : 'carriertargeting',
        FEATURE_CLICKCOMMAND : 'clickcommand',
        FEATURE_COMMENTSANDINSTRUCTIONS : 'commentsandinstructions',
        FEATURE_COMPANIONFLIGHTS : 'companionflights',
        FEATURE_CONTENTPERFORMANCE : 'contentperformance',
        FEATURE_COOKIETARGETING : 'cookietargeting',
        FEATURE_DELIVERYWEIGHT : 'deliveryweighting',
        FEATURE_DEVICETARGETING : 'devicetargeting',
        FEATURE_ECPM : 'ecpm',
        FEATURE_FREQUENCY : 'frequency',
        FEATURE_GEOFENCING : 'geofencing',
        FEATURE_GEOTARGETING : 'geotargeting',
        FEATURE_KEYWORDLEVEL : 'keywordLevel',
        FEATURE_KEYWORDLEVELONE : 'keywordLevelOne',
        FEATURE_KEYWORDS : 'keywords',
        FEATURE_KEYWORDTREE : 'keywordtree',
        FEATURE_MASTERDATA : 'masterdata',
        FEATURE_MOBILEKWTREE : 'mobilekwtree',
        FEATURE_NGKEYWORD : 'ngkeyword',
        FEATURE_PERCENTAGE : 'percentage',
        FEATURE_PLACEMENTS : 'placements',
        FEATURE_POSTCLICK : 'postclick',
        FEATURE_RETARGETING : 'retargeting',
        FEATURE_SCHEDULE : 'schedule',
        FEATURE_SHARE_OF_VOICE_OVERBOOKING : 'SOVinclOverbooking',
        FEATURE_SIMULATIONCAMPAIGN : 'simulationcampaign',
        FEATURE_TAGSEND : 'tagsend',
        FEATURE_TARGETING : 'targeting',
        FEATURE_VOLUME : 'volume',

        FREQUENCY_TYPE_1_HOUR : 0,
        FREQUENCY_TYPE_2_HOURS : 1,
        FREQUENCY_TYPE_4_HOURS : 2,
        FREQUENCY_TYPE_8_HOURS : 3,
        FREQUENCY_TYPE_DAILY : 4,
        FREQUENCY_TYPE_WEEKLY : 5,
        FREQUENCY_TYPE_MONTHLY : 6,
        FREQUENCY_TYPE_LIVETIME : 7,
        FREQUENCY_TYPE_NONE : -1,
        FREQUENCY_TYPE_SESSION : 8,
        FREQUENCY_TYPE_3_DAYS : 9,
        FREQUENCY_TYPE_24_HOURS : 10,
        FREQUENCY_TYPE_BROWSER : 11,
        FREQUENCY_TYPE_15_MINUTES : 12,
        FREQUENCY_TYPE_3_HOURS : 13,
        FREQUENCY_TYPE_6_HOURS : 14,
        FREQUENCY_TYPE_12_HOURS : 15,
        FREQUENCY_TYPE_36_HOURS : 16,
        FREQUENCY_TYPE_48_HOURS : 17,

        MEDIA_TYPE_ALL : -1,
        MEDIA_TYPE_DISPLAY : 0,
        MEDIA_TYPE_VIDEO : 1,

        OPTIMIZER_TYPE_ASAP : 'campaign.optimizertype.asfastaspossible',
        OPTIMIZER_TYPE_FAST_CLICK_NEW : 'campaign.optimizertype.fastClickNew',
        OPTIMIZER_TYPE_AVG_FRONTLOADING : 'campaign.optimizertype.frontloadingAverage',
        OPTIMIZER_TYPE_WEEKDAY_FRONTLOADING : 'campaign.optimizertype.frontloadingWeekday',
        OPTIMIZER_TYPE_CLICK_FRONTLOADING : 'campaign.optimizertype.frontloadingClick',
        OPTIMIZER_TYPE_FAST_CLICK : 'campaign.optimizertype.fastClick',
        OPTIMIZER_TYPE_AVERAGE_TRANSACTIONS : 'campaign.optimizertype.averageTransactions',
        OPTIMIZER_TYPE_FAST_TRANSACTIONS : 'campaign.optimizertype.fastTransactions',
        OPTIMIZER_TYPE_AVERAGECLICKNEW : 'campaign.optimizertype.averageClickNew',
        OPTIMIZER_TYPE_FRONTLOADINGAVERAGE : 'campaign.optimizertype.frontloadingAverage',
        OPTIMIZER_TYPE_FRONTLOADINGWEEKDAY : 'campaign.optimizertype.frontloadingWeekday',
        OPTIMIZER_TYPE_FRONTLOADINGCLICK : 'campaign.optimizertype.frontloadingClick',
        OPTIMIZER_TYPE_AVG_IMP : 'campaign.optimizertype.averageImp',
        OPTIMIZER_TYPE_WEEKDAY_IMP : 'campaign.optimizertype.weekdayImp',
        OPTIMIZER_TYPE_AVG_CLICK : 'campaign.optimizertype.averageClick',
        OPTIMIZER_TYPE_FASTCLICK : 'campaign.optimizertype.fastClick',
        OPTIMIZER_TYPE_FAST_OPEN_IMP : 'campaign.optimizertype.fastOpenImp',
        OPTIMIZER_TYPE_CLASSIC_OPEN_IMP : 'campaign.optimizertype.classicOpenImp',
        OPTIMIZER_TYPE_HOUSE : 'campaign.optimizertype.house',
        OPTIMIZER_TYPE_FLATFEE : 'campaign.optimizertype.flatfee',
        OPTIMIZER_TYPE_CLICK_COMMAND : 'campaign.optimizertype.clickCommand',
        OPTIMIZER_TYPE_ASFASTASPOSSIBLEVIEWS : 'campaign.optimizertype.asfastaspossibleView',
        OPTIMIZER_TYPE_FRONTLOADINGAVERAGEVIEW : 
            'campaign.optimizertype.frontloadingAverageView',
        OPTIMIZER_TYPE_FRONTLOADINGWEEKDAYVIEW :
            'campaign.optimizertype.frontloadingWeekdayView',
        OPTIMIZER_TYPE_PERCENTAGE : 'campaign.optimizertype.percentage',
        OPTIMIZER_TYPE_CLASSICOPENVIEW : 'campaign.optimizertype.classicOpenView',
        OPTIMIZER_TYPE_AVERAGEVIEW : 'campaign.optimizertype.averageView',
        OPTIMIZER_TYPE_WEEKDAYVIEW : 'campaign.optimizertype.weekdayView',
        OPTIMIZER_TYPE_FASTOPENVIEW : 'campaign.optimizertype.fastOpenView',
        OPTIMIZER_TYPE_STDSTATIC : 'campaign.optimizertype.averageStaticImp',
        OPTIMIZER_TYPE_FASTSTATIC : 'campaign.optimizertype.fastStaticImp',

        STATUS_ENTERED : 1,
        STATUS_VALIDATED : 2,
        STATUS_OUTOFMONEY : 3,
        STATUS_EXPIRED : 4,
        STATUS_ACTIVE : 5,
        STATUS_INVALID : 6,
        STATUS_RESERVED : 9,
        STATUS_PENDING : 10,
        STATUS_STARTING : 11,
        STATUS_UPDATING : 12,
        STATUS_STOPPING : 13,
        STATUS_HOLD : 14,
        STATUS_DELETED : 20,
        STATUS_ERROR_STARTING : 111,
        STATUS_ERROR_UPDATING : 112,
        STATUS_ERROR_STOPPING : 113
    },

    IReport : {
        REPORT_ENTITY_TYPE_ADVERTISER : 10,
        REPORT_ENTITY_TYPE_CUSTOMER : 11,
        REPORT_ENTITY_TYPE_CAMPAIGN : 12,
        REPORT_ENTITY_TYPE_MASTERCAMPAIGN : 13,
        REPORT_ENTITY_TYPE_NETWORK : 14,
        REPORT_ENTITY_TYPE_WEBSITE : 15,
        
        REPORT_CATEGORY_CAMPAIGN : 100,
        REPORT_CATEGORY_CAMPAIGN_TEMPLATE : 101,
        REPORT_CATEGORY_WEBSITE : 102,
        REPORT_CATEGORY_PAGE : 103,
        REPORT_CATEGORY_PLACEMENT : 104,
        REPORT_CATEGORY_PAGE_CATEGORY : 105,
        REPORT_CATEGORY_CUSTOMER : 106,
        REPORT_CATEGORY_ADVERTISER : 107,
        REPORT_CATEGORY_BANNERSIZE : 108
    },

    IReportQueueEntry : {
        STATE_ENTERED : 0,
        STATE_BUSY : 1,
        STATE_FINISHED : 2,
        STATE_DELETED : 3,
        STATE_FAILED : 4,
        STATE_WAITING_FOR_BRE : 5,
        STATE_WAITING_FOR_SCHEDULER : 6
    }
};
