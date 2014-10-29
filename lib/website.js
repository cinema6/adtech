var soapUtils = require('./soaputils'),
    q         = require('q'),
    kWsdl     = __dirname + '/wsdl/WSWebsiteAdmin_v15.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSWebsiteAdmin_v15/'
    },
    lib = {};

lib.createClient = function(sslKeyPath, sslCertPath){
    return soapUtils.createSoapSSLClient(kWsdl,kOpts,sslKeyPath,sslCertPath);
};

lib.createWebsite = function (client,website) {
    return q.ninvoke(client,'createWebsite',{
            site              : website
        }).then(function(result){
            return soapUtils.processResponse(result[0].response);
        });
};

lib.deleteWebsite = function(client, id) {
    return q.ninvoke(client,'deleteWebsite',{
            websiteId : id,
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return true;
            }
            return soapUtils.processResponse(result[0].response);
        });
};

lib.updateWebsite = function(client, site) {
    return q.ninvoke(client,'updateWebsite',{
            site : site,
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate website: '  + site.id + '.'));
            }
            return soapUtils.processResponse(result[0].response);
        });
};

lib.getWebsiteById = function(client, id) {
    return q.ninvoke(client,'getWebsiteById',{
            id              : id,
           col              : soapUtils.nil
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate website: '  + id + '.'));
            }
            return soapUtils.processResponse(result[0].response);
        });
};

lib.getWebsiteList = function(client, start, end, aove, col) {
    var nil = soapUtils.nil, aoveParam;
    if (aove && aove.valueOf){
        aoveParam = aove.valueOf();
    } else {
        aoveParam = nil;
    }
    return q.ninvoke(client,'getWebsiteList',{
           start    : isNaN(parseInt(start,10)) ? nil : start,
           end      : isNaN(parseInt(end,10))   ? nil : end,
           boolExpr : aoveParam,
           col      : col   || nil
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return [];
            }
            var res = [], idx, resp = soapUtils.processResponse(result[0].response);
            if (resp.Website['0']) {
                for (idx in resp.Website){
                    res.push(resp.Website[idx]);
                }
            } else {
                res.push(resp.Website);
            }
            return res;
        });
};

lib.createAdmin = function(sslKeyPath, sslCertPath) {
    return soapUtils.makeAdmin(sslKeyPath, sslCertPath, lib,
        [
                'createWebsite',
                'deleteWebsite',
                'getWebsiteById',
                'getWebsiteList',
                'updateWebsite'
        ]
    );
};

module.exports = lib;

