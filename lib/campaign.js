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


function CampaignFeatures(){
    this._featureSet = {};
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
    var result, k, v, fmtBool;
  
    if (isEmpty(this._featureSet)){
        return soapUtils.nil;
    }

    fmtBool = function(v){ return !!v ? '1' : '0'; };

    result = {
        attributes: {
          'xmlns:cm'  : 'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/',
          'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema'
        },
        Keys   : { Item : [] },
        Values : { Item : [] }
    };

    for (k in this._featureSet){
        v = this._featureSet[k];
        result.Keys.Item.push({ 
            attributes: {
                'xsi:type': 'xsd:string' 
            },
            $value: k
        });

        result.Values.Item.push({
            attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
            locked:  {attributes:{'xsi:type':'xsd:boolean'},$value: fmtBool(v.locked)},
            shared:  {attributes:{'xsi:type':'xsd:boolean'},$value: fmtBool(v.shared)},
            visible: {attributes:{'xsi:type':'xsd:boolean'},$value: fmtBool(v.visible)}
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
        'updateCampaignStatusValues'
    ]);
};

lib.createClient = function(sslKeyPath, sslCertPath){
    return soapUtils.createSoapSSLClient(kWsdl,kOpts,sslKeyPath,sslCertPath);
};

lib.makeDateRangeList = function(client,items){
    return soapUtils.makeTypedList(
        'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/',
        'DateRange',
        items
     );
};


lib.makePlacementIdList = function(client,items){
    return soapUtils.makeTypedList(
        'http://www.w3.org/2001/XMLSchema',
        'long',
        items
     );
};

lib.makeCampaignFeatures = function(client,fset){
    var features = new CampaignFeatures(), k;
    for (k in fset){
        features.set(k,fset[k]);
    }
    return features.valueOf();
};

lib.createCampaign = function(){
    return soapUtils.createObject('createCampaign','wcam',
            Array.prototype.slice.call(arguments, 0));
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
            'http://www.w3.org/2001/XMLSchema','string',idList) : nil;
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
    if ((!items) || (!items.length)) {
        return nil;
    }
    return soapUtils.makeTypedList(
        'http://systinet.com/wsdl/de/adtech/helios/BannerManagement/',
        'BannerInfo',
        items.map(lib.objectToBannerInfo),
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

lib.objectToBannerTimeRangeList = function(items){
    if (!items) {
        return nil;
    }
    return soapUtils.makeTypedList(
        'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/',
        'BannerTimeRange',
        items.map(lib.objectToBannerTimeRange),
        'bt'
     );
};

lib.objectToCampaignFeatures = function(fset){
    var features = new CampaignFeatures(), k;
    for (k in fset){
        features.set(k,fset[k]);
    }
    return features.valueOf();
};

//lib.objectToDateRange = function(obj){
//
//
//};

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

lib.objectToTimeRangeList = function(items){
    if (!items) {
        return nil;
    }
    return soapUtils.makeTypedList(
        'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/',
        'TimeRange',
        items.map(lib.objectToTimeRange),
        'tr'
     );
};

lib.objectToWeekdays = function(obj){
    var c = soapUtils.makePropCopier(obj,{});
    c.dest.daysOfWeek = { };
    c.dest.daysOfWeek.boolean = obj.daysOfWeek.boolean.map(function(v){
        return {
          'attributes': {
             'i:type': 'xsd:boolean'
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
    c.dest.timeRanges = lib.objectToTimeRangeList(obj.timeRanges);
    return c.dest;
};

lib.objectToWeekdaysList = function(items){
    if (!items) {
        return nil;
    }
    return soapUtils.makeTypedList(
        'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/',
        'Weekdays',
        items.map(lib.objectToWeekdays),
        'wd'
     );
};

lib.objectToCampaign = function(obj) {
    var c = soapUtils.makePropCopier(obj,{});

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
    c.dest.bannerTimeRangeList = lib.objectToBannerTimeRangeList(obj.bannerTimeRangeList);
    c.dest.campaignFeatures    = lib.objectToCampaignFeatures(obj.campaignFeatures);
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
    
    return c.dest;
};

lib.updateCampaign = function(client, wcam){
    return soapUtils.updateObject('updateCampaign','wcam', client, this.prepareCampaign(wcam));
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

module.exports = lib;

