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
        'getCampaignById',
        'getCampaignList'
    ]);
};

lib.createClient = function(sslKeyPath, sslCertPath){
    return soapUtils.createSoapSSLClient(kWsdl,kOpts,sslKeyPath,sslCertPath);
};

lib.getCampaignById = function(client,id){
    return q.ninvoke(client,'getCampaignById',{
            id              : id
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate campaign: '  + id + '.'));
            }
            return soapUtils.processResponse(result[0].response);
            //return result[0].response;
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
//            return result[0].response;
            var res = [], resp = soapUtils.processResponse(result[0].response);
            if (isArray(resp.Campaign)) {
                res = resp.Campaign;
            } else {
                res.push(resp.Campaign);
            }
            return res;
        });
};


module.exports = lib;

