var soapUtils = require('./soaputils'),
    q         = require('q'),
    kWsdl     = __dirname + '/wsdl/WSCampaignAdmin_v28.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSCampaignAdmin_v28/'
    },
    lib = {},
    nil             = soapUtils.nil,
    isEmpty         = soapUtils.isEmpty,
    isAPIObject     = soapUtils.isAPIObject,
    processResponse = soapUtils.processResponse,
    hashMapify      = soapUtils.hashMapify;

//////////////////////////////////////////////////////////////
// These are used for controlling how attributes
// are set for the node-soap library on the objectTo calls
//
lib.defaultContext = {
    campaignManagement : {
        nameSpace : 'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/',
        prefix    : 'cm'
    },
    xmlSchema : {
        nameSpace : 'http://www.w3.org/2001/XMLSchema',
        prefix    : 'xsd'
    }
};

function CampaignFeatures(context){
    this._featureSet = {};
    this._context = context;
}

CampaignFeatures.prototype.set = function(name,val) {
    var v = { locked : false, shared : false, visible : true },k;

    if (val === null || val === undefined){
        throw new SyntaxError('CampaignFeatures.set requires name,value parameters.');
    }
    else
    if (typeof val === 'object'){
        for (k in val) {
            if (val[k] !== undefined){
                v[k] = !!(val[k]);
            }
        }
    } 
    else 
    if (val !== undefined) {
        v.visible = !!val;
    }

    this._featureSet[name] = v;
    return this;
};

CampaignFeatures.prototype.get = function(name) {
    var v = this._featureSet[name], result = null;
    if (v !== undefined){
        result = {
            locked : v.locked,
            shared : v.shared,
            visible : v.visible
        };
    }
    return result;
};

CampaignFeatures.prototype.remove = function(name) {
    delete this._featureSet[name];
    return this;
};

CampaignFeatures.prototype.valueOf = function() {
    var result, k, v, fmtBool,
        nsCm   = lib.defaultContext.campaignManagement.nameSpace,
        pfxCm  = lib.defaultContext.campaignManagement.prefix,
        nsXsd  = lib.defaultContext.xmlSchema.nameSpace,
        pfxXsd = lib.defaultContext.xmlSchema.prefix;

    if (isEmpty(this._featureSet)){
        return soapUtils.nil;
    }

    if (this._context && this._context.campaignManagement) {
        nsCm  = this._context.campaignManagement.nameSpace;
        pfxCm = this._context.campaignManagement.prefix;
    }

    if (this._context && this._context.xmlSchema) {
        nsXsd  = this._context.xmlSchema.nameSpace;
        pfxXsd = this._context.xmlSchema.prefix;
    }

    fmtBool = function(v){ return !!v ? '1' : '0'; };

    result = {
        attributes: {},
        Keys   : { Item : [] },
        Values : { Item : [] }
    };

    if (nsCm) {
        result.attributes['xmlns:' + pfxCm] = nsCm;
    }
    if (nsXsd) {
        result.attributes['xmlns:' + pfxXsd] = nsXsd;
    }

    for (k in this._featureSet){
        v = this._featureSet[k];
        result.Keys.Item.push({ 
            attributes: {
                'xsi:type': pfxXsd + ':string' 
            },
            $value: k
        });

        result.Values.Item.push({
            attributes: { 'xsi:type': pfxCm + ':CampaignFeatureSettings' },
            locked:  {attributes:{'xsi:type': pfxXsd + ':boolean'},$value: fmtBool(v.locked)},
            shared:  {attributes:{'xsi:type': pfxXsd + ':boolean'},$value: fmtBool(v.shared)},
            visible: {attributes:{'xsi:type': pfxXsd + ':boolean'},$value: fmtBool(v.visible)}
        });
    }

    return result;
};

lib.CampaignFeatures = CampaignFeatures;

lib.createAdmin = function(sslKeyPath, sslCertPath) {
    return soapUtils.makeAdmin(sslKeyPath, sslCertPath, lib, [
        'createCampaign',
        'deleteCampaign',
        'getAdGoalTypeList',
        'getCampaignByExtId',
        'getCampaignById',
        'getCampaignList',
        'getCampaignStatusValues',
        'getCampaignTypeList',
        'getOptimizerTypeList',
        'makeDateRangeList',
        'makeCampaignFeatures',
        'makePlacementIdList',
        'updateCampaign',
        'updateCampaignDesiredImpressions',
        'updateCampaignStatusValues',
        'updatePlacementsInCampaigns'
    ]);
};

lib.createClient = function(sslKeyPath, sslCertPath){
    return soapUtils.createSoapSSLClient(kWsdl,kOpts,sslKeyPath,sslCertPath);
};

lib.makeDateRangeList = function(client,items){
    return soapUtils.makeTypedList(
        'DateRange',
        items,
        'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/'
     );
};


lib.makePlacementIdList = function(client,items){
    return soapUtils.makeTypedList(
        'long',
        items,
        'http://www.w3.org/2001/XMLSchema'
     );
};

lib.makeCampaignFeatures = function(client,fset){
    var features = new CampaignFeatures(), k;
    for (k in fset){
        features.set(k,fset[k]);
    }
    return features.valueOf();
};

lib.objectToBannerInfo = function(obj) {
    if (isAPIObject(obj)){
        return obj;
    }
    var c = soapUtils.makePropCopier(obj,{});
    c.copy('assetTypeId');
    c.copy('bannerNumber');
    c.copy('bannerReferenceId');
    c.copy('campaignId');
    c.copy('campaignVersion');
    c.copy('description');
    c.copy('entityFrequencyConfig.frequencyCookiesOnly');
    c.copy('entityFrequencyConfig.frequencyDistributed');
    c.copy('entityFrequencyConfig.frequencyInterval');
    c.copy('entityFrequencyConfig.frequencyTypeId');
    c.copy('entityFrequencyConfig.uniqueFrequencyId');
    c.copy('extId');
    c.copy('id');
    c.copy('isVersion');
    c.copy('mainNetwork');
    c.copy('mediaTypeId');
    c.copy('name');
    c.copy('sequenceNo');
    c.copy('sizeTypeId');
    c.copy('statusId');
    c.copy('styleTypeId');
    c.copy('subNetwork');
    c.copy('weight');

    return c.dest;
};

lib.objectToBannerInfoList = function(items){
    if (isAPIObject(items)){
        return items;
    }
    if ((!items) || (!items.length)) {
        return nil;
    }
    return soapUtils.makeTypedList(
        'BannerInfo',
        items.map(lib.objectToBannerInfo),
        'http://systinet.com/wsdl/de/adtech/helios/BannerManagement/',
        'bi'
     );
};

lib.objectToBannerTimeRange = function(obj){
    if (isAPIObject(obj)){
        return obj;
    }
    var c = soapUtils.makePropCopier(obj,{});
    c.copy('bannerDeliveryTypeId');
    c.dest.bannerInfoList = lib.objectToBannerInfoList(obj.bannerInfoList);
	c.copy('campaignVersion');
	c.copy('comment');
	c.copy('creativeList');
	c.copy('description');
	c.copy('endDate');
	c.copy('extId');
	c.copy('hasValidationError');
	c.copy('id');
	c.copy('isVersion');
	c.copy('mainNetwork');
	c.copy('name');
	c.copy('startDate');
	c.copy('subNetwork');
	c.copy('todo');
    return c.dest;
};

lib.objectToBannerTimeRangeList = function(items,context){
    if (isAPIObject(items)){
        return items;
    }
    if (!items) {
        return nil;
    }
    if (!context) {
        context = lib.defaultContext;
    }
    return soapUtils.makeTypedList(
        'BannerTimeRange',
        items.map(lib.objectToBannerTimeRange),
        context.campaignManagement.nameSpace,
        context.campaignManagement.prefix
     );
};

lib.objectToCampaignFeatures = function(fset,context){
    var features = new CampaignFeatures(context), k;
    for (k in fset){
        features.set(k,fset[k]);
    }
    return features.valueOf();
};

lib.objectToTimeRange = function(obj){
    var c = soapUtils.makePropCopier(obj,{});
	c.copy('deleted');
	c.copy('description');
	c.copy('endHour');
	c.copy('endMinute');
	c.copy('extId');
	c.copy('id');
	c.copy('name');
	c.copy('pos');
	c.copy('startHour');
	c.copy('startMinute');
    return c.dest;
};

lib.objectToTimeRangeList = function(items,context){
    if (isAPIObject(items)){
        return items;
    }
    if (!items) {
        return nil;
    }
    if (!context) {
        context = lib.defaultContext;
    }
    return soapUtils.makeTypedList(
        'TimeRange',
        items.map(lib.objectToTimeRange),
        context.campaignManagement.nameSpace,
        context.campaignManagement.prefix
     );
};

lib.objectToWeekdays = function(obj,context){
    var c = soapUtils.makePropCopier(obj,{});
    if (!context) {
        context = lib.defaultContext;
    }
    c.dest.daysOfWeek = { };
    if (context.xmlSchema.nameSpace) {
        c.dest.daysOfWeek.attributes = { };
        c.dest.daysOfWeek.attributes['xmlns:' + context.xmlSchema.prefix] =
            context.xmlSchema.nameSpace;
    }
    c.dest.daysOfWeek.boolean = obj.daysOfWeek.boolean.map(function(v){
        return {
          attributes: {
             'xsi:type': context.xmlSchema.prefix + ':boolean'
          },
          $value: v ? 1 : 0
       };
    });
    c.copy('deleted');
    c.copy('description');
    c.copy('extId');
    c.copy('id');
    c.copy('name');
    c.copy('pos');
    c.dest.timeRanges = lib.objectToTimeRangeList(obj.timeRanges,context);
    return c.dest;
};

lib.objectToWeekdaysList = function(items,context){
    if (isAPIObject(items)){
        return items;
    }
    if (!items) {
        return nil;
    }
    if (!context) {
        context = lib.defaultContext;
    }
    return soapUtils.makeTypedList(
        'Weekdays',
        items.map(function(item){
            return lib.objectToWeekdays(item,context);
        }),
        context.campaignManagement.nameSpace,
        context.campaignManagement.prefix
     );
};

lib.objectToDateRange = function(obj,context){
    var c = soapUtils.makePropCopier(obj,{});
    c.copy('deleted');
    c.copy('deliveryGoal.clicks');
    c.copy('deliveryGoal.dailyClickCapping');
    c.copy('deliveryGoal.dailyImpressionCapping');
    c.copy('deliveryGoal.desiredImpressions');
    c.copy('deliveryGoal.distributedVol');
    c.copy('deliveryGoal.flatFeeLimitationPeriod');
    c.copy('deliveryGoal.flatFeeLimitationType');
    c.copy('deliveryGoal.flatFeeLimitationValue');
    c.copy('deliveryGoal.guaranteedDeliveredImpressions');
    c.copy('deliveryGoal.guaranteedImpressions');
    c.copy('deliveryGoal.hasDailyClickCapping');
    c.copy('deliveryGoal.hasDailyImpressionCapping');
    c.copy('deliveryGoal.hasFlatFeeLimitation');
    c.copy('deliveryGoal.hasImpressionLimit');
    c.copy('deliveryGoal.imsInventory');
    c.copy('deliveryGoal.limitVol');
    c.copy('deliveryGoal.transactions');
    c.copy('deliveryGoal.views');
    c.copy('endDate');
    c.copy('id');
    c.copy('imsReservationDate');
    c.copy('imsReservationId');
    c.copy('imsReservationPriority');
    c.copy('pos');
    c.copy('startDate');
    c.dest.weekdayList = lib.objectToWeekdaysList(obj.weekdayList,context);
    return c.dest;
};

lib.objectToDateRangeList = function(items,context){
    if (isAPIObject(items)){
        return items;
    }
    if (!items) {
        return nil;
    }
    if (!context) {
        context = lib.defaultContext;
    }
    return soapUtils.makeTypedList(
        'DateRange',
        items.map(function(item){
            return lib.objectToDateRange(item,context);
        }),
        context.campaignManagement.nameSpace,
        context.campaignManagement.prefix
     );
};

lib.objectToIdList = function(items,context){
    if (isAPIObject(items)){
        return items;
    }
    if (!items) {
        return nil;
    }
    if (!context) {
        context = lib.defaultContext;
    }
    return soapUtils.makeTypedList(
        'long',
        items,
        context.xmlSchema.nameSpace,
        context.xmlSchema.prefix
     );
};

lib.objectToCampaign = function(obj) {
    if (isEmpty(obj)){ return obj; }    // makes unit testing a bit easier
    var c = soapUtils.makePropCopier(obj,{}), context;
    c.dest.attributes = {};
    c.dest.attributes['xmlns:' + lib.defaultContext.campaignManagement.prefix] = 
        lib.defaultContext.campaignManagement.nameSpace;
    c.dest.attributes['xmlns:' + lib.defaultContext.xmlSchema.prefix] = 
        lib.defaultContext.xmlSchema.nameSpace;

    context = {
        campaignManagement : {
            nameSpace : null,
            prefix    : lib.defaultContext.campaignManagement.prefix
        },
        xmlSchema : {
            nameSpace : null,
            prefix    : lib.defaultContext.xmlSchema.prefix
        }
    };

    c.copy('absoluteEndDate');
    c.copy('absoluteStartDate');
    c.copy('adGoalTypeId');
    c.copy('adLocalTargetingSetList');
    c.copy('advertiserId');
    c.copy('advertiserId');
    c.copy('advisibilitySetting');
    c.copy('affinityGroupId');
    c.copy('allowDisplayCampaigns');
    c.copy('archiveDate');
    c.copy('archiveStatus');
    c.copy('bannerDeliveryTypeId');
    c.copy('bannerReservation');
    c.dest.bannerTimeRangeList = lib.objectToBannerTimeRangeList(
        obj.bannerTimeRangeList,context
    );
    c.dest.campaignFeatures    = lib.objectToCampaignFeatures(obj.campaignFeatures,context);
	c.copy('campaignFrequencyCategory');
	c.copy('campaignTypeCategoryId');
	c.copy('campaignTypeId');
	c.copy('categoryId');
	c.copy('categoryTreeNodeList');
	c.copy('companion');
	c.copy('cookieGroupId');
	c.copy('createdAt');
	c.copy('createdBy');
	c.copy('customFields');
	c.copy('customSalesPerson');
	c.copy('customerId');
	c.copy('customerPricingConfigs');
    c.dest.dateRangeList        = lib.objectToDateRangeList(obj.dateRangeList,context);
    c.copy('defaultAltText');
    c.copy('defaultLinkUrl');
    c.copy('deleted');
    c.copy('deliveryId');
    c.copy('deliveryWeightList');
    c.copy('description');
    c.copy('exclusive');
    c.copy('exclusiveType');
    c.copy('extId');
    c.copy('fraudProtectConfig.enableClickFraudLogging');
    c.copy('fraudProtectConfig.minClickIntervalInSeconds');
    c.copy('frequencyConfig.cappingType');
    c.copy('frequencyConfig.distributed');
    c.copy('frequencyConfig.noCookieDelivery');
    c.copy('frequencyConfig.type');
    c.copy('frequencyConfig.views');
    c.copy('groupDistinct');
    c.copy('id');
    c.copy('isSynchronized');
    c.copy('isTemplate');
    c.copy('isTriggerCampaign');
    c.copy('keyGroupId');
    c.copy('keywordIdList');
    c.copy('keywordNodeList');
    c.copy('keywordOperator');
    c.copy('lastModifiedAt');
    c.copy('lastModifiedBy');
    c.copy('leadingCampanionFlight');
    c.copy('leadingCompanionFlightId');
    c.copy('mainNetwork');
    c.copy('masterCampaignId');
    c.copy('mediaTypeId');
    c.copy('name');
    c.copy('natureType');
    c.copy('numberOfBanners');
    c.copy('observerIdList');
    c.copy('optimizerSystemId');
    c.copy('optimizerTypeId');
    c.copy('optimizingConfig.ECPM');
    c.copy('optimizingConfig.delayedStop');
    c.copy('optimizingConfig.delayedStopAfterDays');
    c.copy('optimizingConfig.ecpmMode');
    c.copy('optimizingConfig.minClickRate');
    c.copy('optimizingConfig.minNoPlacements');
    c.copy('optimizingConfig.optimizingOptionList');
    c.copy('optimizingConfig.placementPerformanceOptimized');
    c.copy('optimizingConfig.runOverFlexTree');
    c.copy('optimizingConfig.runOverNetwork');
    c.copy('optimizingConfig.runOverPage');
    c.copy('optimizingConfig.runOverPlacementFormula');
    c.copy('optimizingConfig.runOverWebsite');
    c.copy('pacingTriggerId');
    c.copy('pacingTypeId');
    c.copy('passbackType');
    c.copy('paymentTypeId');
    c.copy('placementDescriptors');
    c.dest.placementIdList = lib.objectToIdList(obj.placementIdList,context);
    c.copy('placementPositionIdList');
    c.copy('placementTypeIdList');
    c.copy('postclickData.clickValidityPeriod');
    c.copy('postclickData.commission');
    c.copy('postclickData.commissionType');
    c.copy('postclickData.onlyFirst');
    c.copy('postclickData.postClickBeaconId');
    c.copy('postclickData.thirdPartyBeaconTags');
    c.copy('postclickData.userTrackBeaconId');
    c.copy('postclickData.viewValidityPeriod');
    c.copy('preSyncStatusTypeId');
    c.copy('pricingConfig.clickrate');
    c.copy('pricingConfig.cpc');
    c.copy('pricingConfig.cpe');
    c.copy('pricingConfig.cpm');
    c.copy('pricingConfig.cpt');
    c.copy('pricingConfig.cpv');
    c.copy('pricingConfig.discrepancy');
    c.copy('pricingConfig.flatfee');
    c.copy('pricingConfig.invoiceClicks');
    c.copy('pricingConfig.invoiceImpressions');
    c.copy('pricingConfig.invoiceTransactions');
    c.copy('pricingConfig.staticRevenueType');
    c.copy('pricingConfig.target');
    c.copy('pricingConfig.targetType');
    c.copy('pricingConfig.viewCountRevenue');
    c.copy('priority');
    c.dest.priorityLevelOneKeywordIdList = lib.objectToIdList(
        obj.priorityLevelOneKeywordIdList, context
    );
    c.dest.priorityLevelThreeKeywordIdList = lib.objectToIdList(
        obj.priorityLevelThreeKeywordIdList, context
    );
    c.dest.priorityLevelTwoKeywordIdList = lib.objectToIdList(
        obj.priorityLevelTwoKeywordIdList, context
    );
    c.copy('rateTypeId');
    c.copy('replicateTemplateChanges');
    c.copy('reservedSizeIds');
    c.copy('salesUserId');
    c.copy('statusTypeId');
    c.copy('subNetwork');
    c.copy('targetingSetList');
    c.copy('templateGroupId');
    c.copy('templateIdUsed');
    c.copy('tilingIdList');
    c.copy('tilingSameAd');
    c.copy('traffickingInfo.traffickingComment');
    c.copy('treeTypeId');
    c.copy('useSizeFilter');
    c.copy('useUserTime');
    c.copy('userPriority');
    c.copy('version');
    c.copy('videoTilingAdBreak');
    c.copy('viewCount');
    c.copy('virtual');
//    console.log(require('util').inspect(c.dest,{ depth: 99}));
    return c.dest;
};

//lib.createCampaign = function(){
//    return soapUtils.createObject('createCampaign','wcam',
//            Array.prototype.slice.call(arguments, 0));
//};

lib.createCampaign = function(client, wcam){
    return soapUtils.createObject('createCampaign','wcam',
            [client, lib.objectToCampaign(wcam)]);
};

lib.deleteCampaign = function() {
    return soapUtils.deleteObject('deleteCampaign','camid',
            Array.prototype.slice.call(arguments, 0));
};

lib.getAdGoalTypeList = function(){
    return soapUtils.getList('getAdGoalTypeList','AdGoalType','order',
            Array.prototype.slice.call(arguments, 0));
};

lib.getCampaignByExtId = function(){
    return soapUtils.getObject('getCampaignByExtId','extid',
            Array.prototype.slice.call(arguments, 0));
};

lib.getCampaignById = function(){
    return soapUtils.getObject('getCampaignById','id',
            Array.prototype.slice.call(arguments, 0));
};

lib.getCampaignList = function(){
    return soapUtils.getList('getCampaignList','Campaign','order',
            Array.prototype.slice.call(arguments, 0));
};

lib.getCampaignStatusValues = function(client,idList,boolExpr){
    var params = {};
    params.campaignIds = (idList && idList.length) ? soapUtils.makeTypedList(
            'string',idList,'http://www.w3.org/2001/XMLSchema') : nil;
    params.boolExpr   = (boolExpr && boolExpr.valueOf)  ? boolExpr.valueOf() : nil;
    return q.ninvoke(client,'getCampaignStatusValues',params).then(function(result){
            if (isEmpty(result[0])){
                return null;
            }
            return hashMapify(processResponse(result[0].response));
        });

};

lib.getCampaignTypeList = function(){
    return soapUtils.getList('getCampaignTypeList','CampaignType','order',
            Array.prototype.slice.call(arguments, 0));
};

lib.getOptimizerTypeList = function(){
    return soapUtils.getList('getOptimizerTypeList','OptimizerType','order',
            Array.prototype.slice.call(arguments, 0));
};


lib.updateCampaign = function(client, wcam){
    return soapUtils.updateObject('updateCampaign','wcam',
            [client, lib.objectToCampaign(wcam)]);
};

lib.updateCampaignStatusValues = function(client, idMapping) {
    var apiMap = soapUtils.makeSimpleTypedMap('long','long',idMapping);
    return q.ninvoke(client,'updateCampaignStatusValues',{campaignDataMapping : apiMap})
            .then(function(result){
                if (isEmpty(result[0])){
                    return null;
                }
                return hashMapify(processResponse(result[0].response));
            });
};

lib.updateCampaignDesiredImpressions= function(client, dataMap) {
    var apiMap = soapUtils.makeSimpleTypedMap('long','long',dataMap);
    return q.ninvoke(client,'updateCampaignDesiredImpressions',{campaignDataMapping : apiMap})
            .then(function(result){
                if (isEmpty(result[0])){
                    return null;
                }
                return hashMapify(processResponse(result[0].response));
            });
};

lib.updatePlacementsInCampaigns = function(client,requestList){
    function objToUpdate(obj){
        return {
            addPlacements       : lib.objectToIdList( obj.addPlacements ),
            campaignId          : obj.campaignId,
            deletePlacements    : lib.objectToIdList( obj.deletePlacements )
        };
    }

    return soapUtils.exec('updatePlacementsInCampaigns','updateRequests',[client, {
        PlacementUpdateRequest : requestList.map(objToUpdate)
    } ]);

};

module.exports = lib;

