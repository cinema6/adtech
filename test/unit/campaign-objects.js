var lib = {};
lib.bannerInfoObjectIn = {
    assetTypeId: 0,
    bannerNumber: 1,
    bannerReferenceId: 24030672,
    campaignId: 6262256,
    campaignVersion: 5,
    description: '',
    entityFrequencyConfig: {
       frequencyCookiesOnly: true,
       frequencyDistributed: false,
       frequencyInterval: 0,
       frequencyTypeId: -1,
       uniqueFrequencyId: 115920876
    },
    extId: "",
    id: 431070639,
    isVersion: false,
    mainNetwork: 5491,
    mediaTypeId: 0,
    name: 'une banner',
    sequenceNo: 1,
    sizeTypeId: -1,
    statusId: 1,
    styleTypeId: -1,
    subNetwork: 1,
    weight: 50
};

lib.bannerInfoObjectOut = {
    assetTypeId: 0,
    bannerNumber: 1,
    bannerReferenceId: 24030672,
    campaignId: 6262256,
    campaignVersion: 5,
    description: '',
    entityFrequencyConfig: {
       frequencyCookiesOnly: 1,
       frequencyDistributed: 0,
       frequencyInterval: 0,
       frequencyTypeId: -1,
       uniqueFrequencyId: 115920876
    },
    extId: "",
    id: 431070639,
    isVersion: 0,
    mainNetwork: 5491,
    mediaTypeId: 0,
    name: 'une banner',
    sequenceNo: 1,
    sizeTypeId: -1,
    statusId: 1,
    styleTypeId: -1,
    subNetwork: 1,
    weight: 50
};

lib.bannerInfoObjectListIn = [ lib.bannerInfoObjectIn ];

lib.bannerInfoObjectListOut = {
    Items : {
        attributes : {
            'xmlns:bi' : 'http://systinet.com/wsdl/de/adtech/helios/BannerManagement/'
        },
        Item : [
            {
                attributes : {
                    'xsi:type' : 'bi:BannerInfo'
                },
                assetTypeId: 0,
                bannerNumber: 1,
                bannerReferenceId: 24030672,
                campaignId: 6262256,
                campaignVersion: 5,
                description: '',
                entityFrequencyConfig: {
                   frequencyCookiesOnly: 1,
                   frequencyDistributed: 0,
                   frequencyInterval: 0,
                   frequencyTypeId: -1,
                   uniqueFrequencyId: 115920876
                },
                extId: '',
                id: 431070639,
                isVersion: 0,
                mainNetwork: 5491,
                mediaTypeId: 0,
                name: 'une banner',
                sequenceNo: 1,
                sizeTypeId: -1,
                statusId: 1,
                styleTypeId: -1,
                subNetwork: 1,
                weight: 50
            }
        ]
    }
};

lib.bannerTimeRangeObjectIn = {
    bannerDeliveryTypeId: 1,
    bannerInfoList: lib.bannerInfoObjectListIn,
    campaignVersion: 3,
    comment: "",
    creativeList: [],
    description: "",
    endDate :new Date(1421070000000),
    extId: "",
    hasValidationError: false,
    id: 109367675,
    isVersion: false,
    mainNetwork: 5491,
    name: "",
    startDate :new Date(1421070000000),
    subNetwork: 1,
    todo: false
};

lib.bannerTimeRangeObjectOut = {
    bannerDeliveryTypeId: 1,
    bannerInfoList: lib.bannerInfoObjectListOut,
    campaignVersion: 3,
    comment: "",
    creativeList: [],
    description: "",
    endDate: '2015-01-12T13:40:00.000Z',
    extId: "",
    hasValidationError: 0,
    id: 109367675,
    isVersion: 0,
    mainNetwork: 5491,
    name: "",
    startDate: '2015-01-12T13:40:00.000Z',
    subNetwork: 1,
    todo: 0
};

lib.bannerTimeRangeObjectListIn = [ lib.bannerTimeRangeObjectIn ];

lib.bannerTimeRangeObjectListOut = {
    Items : {
        attributes : {
           'xmlns:bt' : 'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/'
        },
        Item : [
            {
                attributes : {
                    'xsi:type' : 'bt:BannerTimeRange'
                },
                bannerDeliveryTypeId: 1,
                bannerInfoList: lib.bannerInfoObjectListOut,
                campaignVersion: 3,
                comment: "",
                creativeList: [],
                description: "",
                endDate: '2015-01-12T13:40:00.000Z',
                extId: "",
                hasValidationError: 0,
                id: 109367675,
                isVersion: 0,
                mainNetwork: 5491,
                name: "",
                startDate: '2015-01-12T13:40:00.000Z',
                subNetwork: 1,
                todo: 0
            }
        ]
    }
};

lib.campaignFeaturesIn = {
    ecpm            : { locked: false, shared: false, visible: false },
    targeting       : { locked: false, shared: false, visible: true },
    keywords        : { locked: false, shared: false, visible: false },
    placements      : { locked: false, shared: false, visible: true },
    geofencing      : { locked: false, shared: false, visible: false },
    devicetargeting : { locked: false, shared: false, visible: false },
    cookietargeting : { locked: false, shared: false, visible: false },
    frequency       : { locked: false, shared: false, visible: true },
    schedule        : { locked: false, shared: false, visible: true },
    ngkeyword       : { locked: false, shared: false, visible: true },
    keywordLevel    : { locked: false, shared: false, visible: true },
    volume          : { locked: false, shared: false, visible: true },
    postclick       : { locked: false, shared: false, visible: false },
    carriertargeting: { locked: false, shared: false, visible: false }
};

lib.campaignFeaturesOut = {
    attributes: {
      'xmlns:cm'  : 'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/',
      'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema'
    },
    Keys: {
        Item: [
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'ecpm' },
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'targeting' },
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'keywords' },
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'placements' },
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'geofencing' },
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'devicetargeting' },
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'cookietargeting' },
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'frequency' },
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'schedule' },
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'ngkeyword' },
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'keywordLevel' },
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'volume' },
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'postclick' },
            { attributes: { 'xsi:type': 'xsd:string' }, $value: 'carriertargeting' }
        ]
    },
    Values : {
        Item: [
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'0'}
            },
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'1'}
            },
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'0'}
            },
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'1'}
            },
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'0'}
            },
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'0'}
            },
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'0'}
            },
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'1'}
            },
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'1'}
            },
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'1'}
            },
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'1'}
            },
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'1'}
            },
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'0'}
            },
            {
               attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
               locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
               visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'0'}
            }
        ]
    }
};

lib.timeRangeObjectIn = {
    deleted: false,
    endHour: 23,
    endMinute: 59,
    id: 0,
    pos: 0,
    startHour: 0,
    startMinute: 0
};

lib.timeRangeObjectOut = {
    deleted: 0,
    endHour: 23,
    endMinute: 59,
    id: 0,
    pos: 0,
    startHour: 0,
    startMinute: 0
};

lib.timeRangeObjectListIn = [ lib.timeRangeObjectIn ];

lib.timeRangeObjectListOut = {
    Items: {
        attributes : {
            'xmlns:tr' : 'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/'
        },
        Item: [
            {
                attributes: {
                    'xsi:type': 'tr:TimeRange'
                },
                deleted: 0,
                endHour: 23,
                endMinute: 59,
                id: 0,
                pos: 0,
                startHour: 0,
                startMinute: 0
            }
        ]
    }
};

lib.weekDaysObjectIn = {
    daysOfWeek: { boolean: [ 1, 1, 1, 1, 1, 1, 1 ] },
    deleted: false,
    id: -1,
    pos: -1,
    timeRanges : lib.timeRangeObjectListIn
};

lib.weekDaysObjectOut = {
    daysOfWeek: {
        attributes : {
            'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema'
        },
        boolean: [
            { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 },
            { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 },
            { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 },
            { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 },
            { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 },
            { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 },
            { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 }
        ]
     },
     deleted: 0,
     id: -1,
     pos: -1,
     timeRanges : lib.timeRangeObjectListOut
};

lib.weekDaysObjectListIn = [ lib.weekDaysObjectIn ];

lib.weekDaysObjectListOut = {
    Items : {
        attributes : {
            'xmlns:wd' : 'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/'
        },
        Item : [
            {
                attributes : {
                    'xsi:type': 'wd:Weekdays'
                },
                daysOfWeek: {
                    attributes : {
                        'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema'
                    },
                    boolean: [
                        { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 },
                        { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 },
                        { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 },
                        { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 },
                        { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 },
                        { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 },
                        { attributes: { 'xsi:type': 'xsd:boolean' }, $value: 1 }
                    ]
                 },
                 deleted: 0,
                 id: -1,
                 pos: -1,
                 timeRanges : lib.timeRangeObjectListOut
            }
        ]
    }
};

lib.dateRangeObjectIn = {
    deleted: false,
    deliveryGoal: {
        clicks: 0,
        dailyClickCapping: 0,
        dailyImpressionCapping: -1,
        desiredImpressions: 250455,
        distributedVol: 0,
        flatFeeLimitationPeriod: 6,
        flatFeeLimitationType: 0,
        flatFeeLimitationValue: 0,
        guaranteedDeliveredImpressions: 0,
        guaranteedImpressions: 0,
        hasDailyClickCapping: false,
        hasDailyImpressionCapping: false,
        hasFlatFeeLimitation: false,
        hasImpressionLimit: true,
        imsInventory: 0,
        limitVol: false,
        transactions: 0,
        views: 0
    },
    endDate :new Date(1421070000000),
    id: 0,
    imsReservationDate :new Date(1421070000000),
    imsReservationId: 0,
    imsReservationPriority: 0,
    pos: 0,
    startDate :new Date(1421070000000),
    weekdayList: lib.weekDaysObjectListIn
};

lib.dateRangeObjectOut = {
    deleted: 0,
    deliveryGoal: {
        clicks: 0,
        dailyClickCapping: 0,
        dailyImpressionCapping: -1,
        desiredImpressions: 250455,
        distributedVol: 0,
        flatFeeLimitationPeriod: 6,
        flatFeeLimitationType: 0,
        flatFeeLimitationValue: 0,
        guaranteedDeliveredImpressions: 0,
        guaranteedImpressions: 0,
        hasDailyClickCapping: 0,
        hasDailyImpressionCapping: 0,
        hasFlatFeeLimitation: 0,
        hasImpressionLimit: 1,
        imsInventory: 0,
        limitVol: 0,
        transactions: 0,
        views: 0
    },
    endDate: '2015-01-12T13:40:00.000Z',
    id: 0,
    imsReservationDate: '2015-01-12T13:40:00.000Z',
    imsReservationId: 0,
    imsReservationPriority: 0,
    pos: 0,
    startDate: '2015-01-12T13:40:00.000Z',
    weekdayList: lib.weekDaysObjectListOut
};

lib.dateRangeObjectListIn = [ lib.dateRangeObjectIn ];

lib.dateRangeObjectListOut = {
    Items: {
        attributes : {
            'xmlns:dr' : 'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/'
        },
        Item: [
            {
                attributes: {
                    'xsi:type': 'dr:DateRange'
                },
                deleted: 0,
                deliveryGoal: {
                    clicks: 0,
                    dailyClickCapping: 0,
                    dailyImpressionCapping: -1,
                    desiredImpressions: 250455,
                    distributedVol: 0,
                    flatFeeLimitationPeriod: 6,
                    flatFeeLimitationType: 0,
                    flatFeeLimitationValue: 0,
                    guaranteedDeliveredImpressions: 0,
                    guaranteedImpressions: 0,
                    hasDailyClickCapping: 0,
                    hasDailyImpressionCapping: 0,
                    hasFlatFeeLimitation: 0,
                    hasImpressionLimit: 1,
                    imsInventory: 0,
                    limitVol: 0,
                    transactions: 0,
                    views: 0
                },
                endDate: '2015-01-12T13:40:00.000Z',
                id: 0,
                imsReservationDate: '2015-01-12T13:40:00.000Z',
                imsReservationId: 0,
                imsReservationPriority: 0,
                pos: 0,
                startDate: '2015-01-12T13:40:00.000Z',
                weekdayList: lib.weekDaysObjectListOut
            }
        ]
    }
};


module.exports = lib;
