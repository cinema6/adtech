var soapUtils = require('./soaputils'),
    kWsdl     = __dirname + '/wsdl/WSCampaignAdmin_v28.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSCampaignAdmin_v28/'
    },
    lib = {};

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
        'makeDateRangeList'
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

