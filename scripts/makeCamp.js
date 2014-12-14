var adtech       = require('../index'),
    kCamp        = adtech.constants.ICampaign,
    q            = require('q');


function getAdGoal(goalType){
    var aove = new adtech.AOVE();
    aove.addExpression(
        new adtech.AOVE.StringExpression('name',goalType)
    );
           
    return adtech.campaignAdmin.getAdGoalTypeList(null,null,aove);
}

function getCampaignType(campType){
    var aove = new adtech.AOVE();

    aove.addExpression(
        new adtech.AOVE.StringExpression('name',campType)
    );
    aove.addExpression(
        new adtech.AOVE.IntExpression('mediaTypeId',kCamp.MEDIA_TYPE_DISPLAY)
    );
       
    return adtech.campaignAdmin.getCampaignTypeList(null,null,aove);
}

function getOptimizerType(optType){
    var aove = new adtech.AOVE();
    aove.addExpression(
        new adtech.AOVE.StringExpression('name',kCamp.OPTIMIZER_TYPE_FAST_OPEN_IMP)
    );
           
    return adtech.campaignAdmin.getOptimizerTypeList(null,null,aove);
}

function doWork(){
    return q.all([
            getAdGoal(kCamp.ADGOAL_TYPE_STD_GUARANTEED),
            getCampaignType(kCamp.CAMPAIGN_TYPE_GUARANTEED),
            getOptimizerType(kCamp.OPTIMIZER_TYPE_FAST_OPEN_IMP)
        ])
        .spread(function(adGoal,campType,optType){
            var campaign,
                customerId = 470703,
                advertiserId = 821097,
                dtStart = new Date(),
                dtEnd = new Date(dtStart.valueOf() + (60 * 60 * 24 * 365 * 1000)),
                features = {};
                features[kCamp.FEATURE_KEYWORDLEVEL]      = true;
                features[kCamp.FEATURE_PLACEMENTS]        = true;
                features[kCamp.FEATURE_VOLUME]            = true;
           
            campaign = {
                adGoalTypeId    : adGoal[0].id,
                advertiserId    : advertiserId,
                campaignFeatures  : adtech.campaignAdmin.makeCampaignFeatures(features),
                campaignTypeId  : campType[0].id,
                customerId      : customerId,
                dateRangeList   : adtech.campaignAdmin.makeDateRangeList([{
                    endDate: dtEnd.toISOString(),
                    startDate: dtStart.toISOString()
                }]),
                extId           : 'fuzzy_wuzzy3',
                frequencyConfig : {
                   type: kCamp.FREQUENCY_TYPE_NONE
                },
                name            : 'Fuzzy Wuzzy3',
                optimizerTypeId : optType[0].id,
                optimizingConfig: {
                    minClickRate: 0,
                    minNoPlacements: 0
                },
                pricingConfig :  {
                    cpm: 0
                }
            };
            return adtech.campaignAdmin.createCampaign(campaign);
        });
}

adtech.createClient()
.then(doWork)
.then(function(result){
    console.log(JSON.stringify(result,null,3));
})
.catch(function(err){
    console.log('Error:',err);
    process.exit(1);
});

