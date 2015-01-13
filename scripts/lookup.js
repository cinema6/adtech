var adtech       = require('../index'),
    kCamp        = adtech.constants.ICampaign;

function getCampaign(){
    return adtech.campaignAdmin.getCampaignById(6262256);
}

function getCustomerList(){
    return adtech.customerAdmin.getCustomerList();
}

function getAdGoalList(){
    return adtech.campaignAdmin.getAdGoalTypeList();
}

function getCampaignStatus() {
    return adtech.campaignAdmin.getCampaignStatusValues(['6314423']);
}

function getCampaignStatusValues(){
    var aove = new adtech.AOVE();
    aove.addExpression(
        new adtech.AOVE.StringExpression('name','Fuzzy Wuzzy3')
    );
    return adtech.campaignAdmin.getCampaignStatusValues(['6255177','6255627','9999999'],aove);
    //return adtech.campaignAdmin.getCampaignStatusValues(null,aove);
};

function holdCampaign() {
    return adtech.pushAdmin.holdCampaignById('6255177');
};

function startCampaign() {
    return adtech.pushAdmin.startCampaignById('6314771');
};

function stopCampaign() {
    return adtech.pushAdmin.stopCampaignById('6255177');
};

function deleteCampaign() {
    return adtech.campaignAdmin.deleteCampaign('6255177');
};


function updateCampaignStatusValues() {
    return adtech.campaignAdmin.updateCampaignStatusValues({'6262256':2});
};

function updateDesiredImpressions() {
    return adtech.campaignAdmin.updateCampaignDesiredImpressions({'6262256':250455});
}

function updateCampaign() {
    return adtech.campaignAdmin.getCampaignById(6262256)
        .then(function(campaign){
            campaign.placementIdList = [3437144];
            campaign.priorityLevelOneKeywordIdList= [ "3171661", "3171662" ];
            campaign.priorityLevelThreeKeywordIdList= [ "3171663" ];
//            console.log('UPDATE CAMPAIGN:',campaign);
            return adtech.campaignAdmin.updateCampaign(campaign);
        });
}

function getOptimizerList(){
    var aove = new adtech.AOVE();

    aove.addExpression(
        new adtech.AOVE.StringExpression('name',kCamp.OPTIMIZER_TYPE_FAST_OPEN_IMP)
    );
       
    return adtech.campaignAdmin.getOptimizerTypeList(null,null,aove)
    .then(function(result){
        console.log(result);
    })
}

function doWork(){
    return updateCampaign();
}

adtech.createClient()
.then(doWork)
.then(function(result){
    console.log(JSON.stringify(result,null,3));
})
.catch(function(err){
    console.log('Error:',err.stack);
    process.exit(1);
});
