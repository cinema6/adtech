var soapUtils = require('./soaputils'),
    q         = require('q'),
    isArray   = require('util').isArray,
    kWsdl     = __dirname + '/wsdl/WSCampaignAdmin_v28.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSCampaignAdmin_v28/'
    },
    lib = {};

lib.createAdmin = function(sslKeyPath, sslCertPath) {
    return soapUtils.makeAdmin(sslKeyPath, sslCertPath, lib, [
        'deleteCampaign',
        'getCampaignByExtId',
        'getCampaignById',
        'getCampaignList',
        'getCampaignTypeList',
        'getOptimizerTypeList'
    ]);
};

lib.createClient = function(sslKeyPath, sslCertPath){
    return soapUtils.createSoapSSLClient(kWsdl,kOpts,sslKeyPath,sslCertPath);
};

lib.deleteCampaign = function(client, id) {
    return q.ninvoke(client,'deleteCampaign',{
            camid : id,
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return true;
            }
            return soapUtils.processResponse(result[0].response);
        });
};

lib.getCampaignByExtId = function(client,extid){
    return q.ninvoke(client,'getCampaignByExtId',{
            extid : extid
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate campaign: '  + extid + '.'));
            }
            return soapUtils.processResponse(result[0].response);
        });
};

lib.getCampaignById = function(client,id){
    return q.ninvoke(client,'getCampaignById',{
            id              : id
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate campaign: '  + id + '.'));
            }
            return soapUtils.processResponse(result[0].response);
        });
};

lib.getCampaignList = function(client, start, end, aove, order) {
    var nil = soapUtils.nil, aoveParam;
    if (aove && aove.valueOf){
        aoveParam = aove.valueOf();
    } else {
        aoveParam = nil;
    }
    return q.ninvoke(client,'getCampaignList',{
           start    : isNaN(parseInt(start,10)) ? nil : start,
           end      : isNaN(parseInt(end,10))   ? nil : end,
           boolExpr : aoveParam,
           order    : order   || nil
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return [];
            }
            var res = [], resp = soapUtils.processResponse(result[0].response);
            if (isArray(resp.Campaign)) {
                res = resp.Campaign;
            } else {
                res.push(resp.Campaign);
            }
            return res;
        });
};

lib.getCampaignTypeList = function(client, start, end, aove, order){
    var nil = soapUtils.nil, aoveParam;
    if (aove && aove.valueOf){
        aoveParam = aove.valueOf();
    } else {
        aoveParam = nil;
    }
    return q.ninvoke(client,'getCampaignTypeList',{
           start    : isNaN(parseInt(start,10)) ? nil : start,
           end      : isNaN(parseInt(end,10))   ? nil : end,
           boolExpr : aoveParam,
           order    : order   || nil
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return [];
            }
            var res = [], resp = soapUtils.processResponse(result[0].response);
            if (isArray(resp.CampaignType)) {
                res = resp.CampaignType;
            } else {
                res.push(resp.CampaignType);
            }
            return res;
        });
};

lib.getOptimizerTypeList = function(client, start, end, aove, order){
    var nil = soapUtils.nil, aoveParam;
    if (aove && aove.valueOf){
        aoveParam = aove.valueOf();
    } else {
        aoveParam = nil;
    }
    return q.ninvoke(client,'getOptimizerTypeList',{
           start    : isNaN(parseInt(start,10)) ? nil : start,
           end      : isNaN(parseInt(end,10))   ? nil : end,
           boolExpr : aoveParam,
           order    : order   || nil
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return [];
            }
            var res = [], resp = soapUtils.processResponse(result[0].response);
            if (isArray(resp.OptimizerType)) {
                res = resp.OptimizerType;
            } else {
                res.push(resp.OptimizerType);
            }
            return res;
        });
};


module.exports = lib;

