var soapUtils = require('./soaputils'),
    kWsdl     = __dirname + '/wsdl/WSCampaignAdmin_v28.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSCampaignAdmin_v28/'
    },
    lib = {};

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
  
    if (soapUtils.isEmpty(this._featureSet)){
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
        'getCampaignTypeList',
        'getOptimizerTypeList',
        'makeDateRangeList',
        'makeCampaignFeatures'
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

lib.getCampaignTypeList = function(){
    return soapUtils.getList('getCampaignTypeList','CampaignType','order',
            Array.prototype.slice.call(arguments, 0));
};

lib.getOptimizerTypeList = function(){
    return soapUtils.getList('getOptimizerTypeList','OptimizerType','order',
            Array.prototype.slice.call(arguments, 0));
};

module.exports = lib;
