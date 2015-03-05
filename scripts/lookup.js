var adtech       = require('../index'),
    request      = require('request'),
    q            = require('q'),
    kCamp        = adtech.constants.ICampaign;

function getCampaign(){
    return adtech.campaignAdmin.getCampaignById(6518757);
}

function getCustomerList(){
    return adtech.customerAdmin.getCustomerList();
}

function getAdGoalList(){
    return adtech.campaignAdmin.getAdGoalTypeList();
}

function getCampaignStatus() {
    return adtech.campaignAdmin.getCampaignStatusValues(['6293522','6262256']);
}

function getCampaignStatisticsIdList(){
    var boolExpr = new adtech.BoolExpression();
    var exp = new adtech.AOVE.LongExpression('todaysImps',100,'>');
    //var exp = new adtech.AOVE.LongListExpression('campaignId',[99999,88888]);
    boolExpr.addExpression(exp);
    return adtech.statsAdmin.getCampaignStatisticsIdList(null,null,boolExpr);
}
function getCampaignStatisticsList(){
    var boolExpr = new adtech.BoolExpression();
    var exp = new adtech.AOVE.LongExpression('todaysImps',100,'>');
    //var exp = new adtech.AOVE.LongListExpression('campaignId',[99999,88888]);
    boolExpr.addExpression(exp);
    return adtech.statsAdmin.getCampaignStatisticsList(null,null,boolExpr);
}
function getCampaignStats(){
    return adtech.statsAdmin.getCampaignStatisticsByCampaignId(6410434);
}

function getPlacementStats(){
    return adtech.statsAdmin.getPlacementStatisticsByPlacementId(3492067);
}
function getPlacementStatisticsList(){
    var boolExpr = new adtech.BoolExpression();
    var exp = new adtech.AOVE.LongExpression('todaysImps',100,'>');
//    var exp = new adtech.AOVE.LongListExpression('placementId',[3481880,3492067,3481901]);
    boolExpr.addExpression(exp);
    return adtech.statsAdmin.getPlacementStatisticsList(null,null,boolExpr);
}

function getCampaignStatusValues(){
    var aove = new adtech.AOVE();
    aove.addExpression(
        new adtech.AOVE.StringExpression('name','Fuzzy Wuzzy3')
    );
    return adtech.campaignAdmin.getCampaignStatusValues(['6255177','6255627','9999999'],aove);
    //return adtech.campaignAdmin.getCampaignStatusValues(null,aove);
};

function getReportById(){
    return adtech.reportAdmin.getReportById(311);
};

function requestEntityReport(){
    var kconst = adtech.constants.IReportQueueEntry,
        IReport = adtech.constants.IReport,
        startDate = new Date(2015,1,4,0,0,0,0),
        endDate   = new Date(2015,1,8,23,59,59,999),
        stateNames = {};
    stateNames[kconst.STATE_ENTERED] = 'entered';
    stateNames[kconst.STATE_BUSY]    = 'busy';
    stateNames[kconst.STATE_FINISHED] = 'finished';
    stateNames[kconst.STATE_DELETED]  = 'deleted';
    stateNames[kconst.STATE_FAILED]   = 'failed';
    stateNames[kconst.STATE_WAITING_FOR_BRE] = 'waiting_for_bre';
    stateNames[kconst.STATE_WAITING_FOR_SCHEDULER] = 'waiting for scheduler';

    function requestReport(reportId){
        console.log('request Entity Report type:',reportId);
        return adtech.reportAdmin
            .requestReportByEntities(reportId,startDate.toISOString(),endDate.toISOString(),
                IReport.REPORT_ENTITY_TYPE_ADVERTISER, IReport.REPORT_CATEGORY_CAMPAIGN,
                    [6455871,6455872]);
    }

    function getReportQueueEntryById(id){
        console.log('request Report Queue Entry:',id);
        return adtech.reportAdmin
            .getReportQueueEntryById(id);
    }

    function downloadReport(entry){
        console.log('Report Queue Entry state: ',stateNames[entry.state]);
        if (entry.state === kconst.STATE_DELETED || entry.state === kconst.STATE_FAILED){
            throw new Error('Invalid entry state!');
        }

        if (entry.state === kconst.STATE_FINISHED) {
            var deferred = q.defer(), rqs;
            console.log('REPORT AVAILABLE AT:',entry.resultURL + '&format=csv');
            rqs = request(entry.resultURL + '&view=imp_viewcount&format=csv&devel=-9', function(err,res,body){
                if (err){
                    return deferred.reject(err);
                }

                return deferred.resolve(body);
            });
            return deferred.promise;
        }

        return q.delay(5000)
            .then(function(){return getReportQueueEntryById(entry.id);})
            .then(downloadReport);
    }

    return requestReport(561).then(downloadReport);
};


function requestNetworkReport(){
    var kconst = adtech.constants.IReportQueueEntry,
        startDate = new Date(2015,1,4,0,0,0,0),
        endDate   = new Date(2015,1,8,23,59,59,999),
        stateNames = {};
    stateNames[kconst.STATE_ENTERED] = 'entered';
    stateNames[kconst.STATE_BUSY]    = 'busy';
    stateNames[kconst.STATE_FINISHED] = 'finished';
    stateNames[kconst.STATE_DELETED]  = 'deleted';
    stateNames[kconst.STATE_FAILED]   = 'failed';
    stateNames[kconst.STATE_WAITING_FOR_BRE] = 'waiting_for_bre';
    stateNames[kconst.STATE_WAITING_FOR_SCHEDULER] = 'waiting for scheduler';

    function requestReport(reportId){
        console.log('request Network Report type:',reportId);
        return adtech.reportAdmin
            .requestReport(reportId,startDate.toISOString(),endDate.toISOString());
    }

    function getReportQueueEntryById(id){
        console.log('request Report Queue Entry:',id);
        return adtech.reportAdmin
            .getReportQueueEntryById(id);
    }

    function downloadReport(entry){
        console.log('Report Queue Entry state: ',stateNames[entry.state]);
        if (entry.state === kconst.STATE_DELETED || entry.state === kconst.STATE_FAILED){
            throw new Error('Invalid entry state!');
        }

        if (entry.state === kconst.STATE_FINISHED) {
            var deferred = q.defer(), rqs;
            console.log('REPORT AVAILABLE AT:',entry.resultURL + '&format=csv');
            rqs = request(entry.resultURL + '&format=csv', function(err,res,body){
                if (err){
                    return deferred.reject(err);
                }

                return deferred.resolve(body);
            });
            return deferred.promise;
        }

        return q.delay(5000)
            .then(function(){return getReportQueueEntryById(entry.id);})
            .then(downloadReport);
    }

    return requestReport(311).then(downloadReport);
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
    return adtech.campaignAdmin.deleteCampaign('6314704');
};


function updateCampaignStatusValues() {
    return adtech.campaignAdmin.updateCampaignStatusValues({'6262256':2});
};

function updateDesiredImpressions() {
    return adtech.campaignAdmin.updateCampaignDesiredImpressions({'6262256':250455});
}

function updatePlacementsInCampaigns(){
    return adtech.campaignAdmin.updatePlacementsInCampaigns([
            { addPlacements : [ 3439162, 3439163], campaignId : 6262256 }
    ]);
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
//    return getPlacementStats();
//    return getCampaign();
    return getCampaignStatisticsList();
//    return getPlacementStatisticsList();
//    return getCampaignStatisticsIdList();
//    return getCampaignStats();
//    return getReportById();
//    return requestEntityReport();
//    return requestNetworkReport();
//    return getCampaignStatus();
//    return updatePlacementsInCampaigns();
}

adtech.createClient('/Users/howard/.ssh/adtech.key.prod','/Users/howard/.ssh/adtech.crt.prod')
//adtech.createClient()
.then(doWork)
.then(function(result){
    console.log(result);
})
.catch(function(err){
    console.log('Error:',err);
    process.exit(1);
});
