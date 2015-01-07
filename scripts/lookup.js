var adtech       = require('../index'),
    kCamp        = adtech.constants.ICampaign;

function getCampaign(){
    return adtech.campaignAdmin.getCampaignById(6189968);
}

function getCustomerList(){
    return adtech.customerAdmin.getCustomerList();
}

function getAdGoalList(){
    return adtech.campaignAdmin.getAdGoalTypeList();
}

function getCampaignStatusValues(){
    var aove = new adtech.AOVE();
    aove.addExpression(
        new adtech.AOVE.StringExpression('name','Fuzzy Wuzzy3')
    );
    return adtech.campaignAdmin.getCampaignStatusValues(['6255177','6255627','9999999'],aove);
    //return adtech.campaignAdmin.getCampaignStatusValues(null,aove);
};

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
    return getCampaignStatusValues();
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
