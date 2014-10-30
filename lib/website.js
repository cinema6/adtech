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

lib.createPage = function(client, page){
    return q.ninvoke(client,'createPage',{
            page              : page
        }).then(function(result){
            return soapUtils.processResponse(result[0].response);
        });
};

lib.deletePage = function(client, id) {
    return q.ninvoke(client,'deletePage',{
            pageId : id,
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return true;
            }
            return soapUtils.processResponse(result[0].response);
        });
};

lib.getPageByExtId = function(client, extid) {
    return q.ninvoke(client,'getPageByExtId',{
            extid              : extid
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate page: '  + extid + '.'));
            }
            return soapUtils.processResponse(result[0].response);
        });
};

lib.getPageById = function(client, id) {
    return q.ninvoke(client,'getPageById',{
            id              : id,
           col              : soapUtils.nil
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate page: '  + id + '.'));
            }
            return soapUtils.processResponse(result[0].response);
        });
};

lib.getPageList = function(client, start, end, aove, col) {
    var nil = soapUtils.nil, aoveParam;
    if (aove && aove.valueOf){
        aoveParam = aove.valueOf();
    } else {
        aoveParam = nil;
    }
    return q.ninvoke(client,'getPageList',{
           start    : isNaN(parseInt(start,10)) ? nil : start,
           end      : isNaN(parseInt(end,10))   ? nil : end,
           boolExpr : aoveParam,
           col      : col   || nil
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return [];
            }
            var res = [], idx, resp = soapUtils.processResponse(result[0].response);
            if (resp.Page['0']) {
                for (idx in resp.Page){
                    res.push(resp.Page[idx]);
                }
            } else {
                res.push(resp.Page);
            }
            return res;
        });
};

lib.updatePage = function(client, page) {
    return q.ninvoke(client,'updatePage',{
            page : page,
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate page: '  + page.id + '.'));
            }
            return soapUtils.processResponse(result[0].response);
        });
};

lib.createPlacement = function(client, placement){
    return q.ninvoke(client,'createPlacement',{
            pl              : placement
        }).then(function(result){
            return soapUtils.processResponse(result[0].response);
        });
};

lib.deletePlacement = function(client, id) {
    return q.ninvoke(client,'deletePlacement',{
            placeId : id,
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return true;
            }
            return soapUtils.processResponse(result[0].response);
        });
};

lib.getPlacementByExtId = function(client, extid) {
    return q.ninvoke(client,'getPlacementByExtId',{
            extid              : extid
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate page: '  + extid + '.'));
            }
            return soapUtils.processResponse(result[0].response);
        });
};

lib.getPlacementById = function(client, id) {
    return q.ninvoke(client,'getPlacementById',{
            id              : id,
           col              : soapUtils.nil
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate page: '  + id + '.'));
            }
            return soapUtils.processResponse(result[0].response);
        });
};

lib.getPlacementList = function(client, start, end, aove, col) {
    var nil = soapUtils.nil, aoveParam;
    if (aove && aove.valueOf){
        aoveParam = aove.valueOf();
    } else {
        aoveParam = nil;
    }
    return q.ninvoke(client,'getPlacementList',{
           start    : isNaN(parseInt(start,10)) ? nil : start,
           end      : isNaN(parseInt(end,10))   ? nil : end,
           boolExpr : aoveParam,
           col      : col   || nil
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return [];
            }
            var res = [], idx, resp = soapUtils.processResponse(result[0].response);
            if (resp.Placement['0']) {
                for (idx in resp.Placement){
                    res.push(resp.Placement[idx]);
                }
            } else {
                res.push(resp.Placement);
            }
            return res;
        });
};

lib.updatePlacement = function(client, plc) {
    return q.ninvoke(client,'updatePlacement',{
            pl : plc,
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate placement: ' + plc.id + '.'));
            }
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

lib.createWebsite = function (client,website) {
    return q.ninvoke(client,'createWebsite',{
            site              : website
        }).then(function(result){
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

lib.getWebsiteByExtId = function(client, extid) {
    return q.ninvoke(client,'getWebsiteByExtId',{
            extid              : extid
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate website: '  + extid + '.'));
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


lib.createAdmin = function(sslKeyPath, sslCertPath) {
    return soapUtils.makeAdmin(sslKeyPath, sslCertPath, lib,
        [
                'createPage',
                'createPlacement',
                'createWebsite',
                'deletePage',
                'deletePlacement',
                'deleteWebsite',
                'getPageByExtId',
                'getPageById',
                'getPageList',
                'getPlacementByExtId',
                'getPlacementById',
                'getPlacementList',
                'getWebsiteByExtId',
                'getWebsiteById',
                'getWebsiteList',
                'updatePage',
                'updatePlacement',
                'updateWebsite'
        ]
    );
};

module.exports = lib;

