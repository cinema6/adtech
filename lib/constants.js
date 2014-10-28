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
    }
};

