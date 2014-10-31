var soapUtils = require('./soaputils'),
    q         = require('q'),
    kWsdl     = __dirname + '/wsdl/WSBannerAdmin_v13.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSBannerAdmin_v13/'
    },
    lib = {};

lib.createClient = function(sslKeyPath, sslCertPath){
    return soapUtils.createSoapSSLClient(kWsdl,kOpts,sslKeyPath,sslCertPath);
};

lib.createBanner = function (client,campaignId,banner,bannerInfo,timeRangeNo) {
    timeRangeNo = timeRangeNo || 1;
    return q.ninvoke(client,'createBanner',{
            bann              : banner,
            campaignId        : campaignId,
            bannerInfo        : bannerInfo,
            bannerTimeRangeNo : timeRangeNo 
        }).then(function(result){
            return soapUtils.processResponse(result[0].response);
        });
};

lib.deleteBanner = function(client,id){
    return q.ninvoke(client,'deleteBanner',{
            bannerId : id,
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return true;
            }
            return soapUtils.processResponse(result[0].response);
        });
};

/*
lib.getBannerByExtId = function(client,extId){

};

lib.getBannerById = function(client,bannerId){

};

*/

lib.getBannerInfoList = function(client, start, end, aove, order){
    var nil = soapUtils.nil, aoveParam;
    if (aove && aove.valueOf){
        aoveParam = aove.valueOf();
    } else {
        aoveParam = nil;
    }
    return q.ninvoke(client,'getBannerInfoList',{
           start    : isNaN(parseInt(start,10)) ? nil : start,
           end      : isNaN(parseInt(end,10))   ? nil : end,
           boolExpr : aoveParam,
           order    : order || nil
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return [];
            }
            var res = [], idx, resp = soapUtils.processResponse(result[0].response);
            if (resp.BannerInfo['0']) {
                for (idx in resp.BannerInfo){
                    res.push(resp.BannerInfo[idx]);
                }
            } else {
                res.push(resp.BannerInfo);
            }
            return res;
        });
};

lib.getBannerList = function(client, start, end, aove, order) {
    var nil = soapUtils.nil, aoveParam;
    if (aove && aove.valueOf){
        aoveParam = aove.valueOf();
    } else {
        aoveParam = nil;
    }
    return q.ninvoke(client,'getBannerList',{
           start    : isNaN(parseInt(start,10)) ? nil : start,
           end      : isNaN(parseInt(end,10))   ? nil : end,
           boolExpr : aoveParam,
           order    : order || nil
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return [];
            }
            var res = [], idx, resp = soapUtils.processResponse(result[0].response);
            if (resp.Banner['0']) {
                for (idx in resp.Banner){
                    res.push(resp.Banner[idx]);
                }
            } else {
                res.push(resp.Banner);
            }
            return res;
        });
};

lib.updateBanner = function(client, banner){
    return q.ninvoke(client,'updateBanner',{
            bann : banner,
        }).then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to update banner: '  + banner.id + '.'));
            }
            return soapUtils.processResponse(result[0].response);
        });
};


lib.createAdmin = function(sslKeyPath, sslCertPath) {
    return soapUtils.makeAdmin(sslKeyPath, sslCertPath, lib, [
        'createBanner',
        'deleteBanner',
        'getBannerInfoList',
        'getBannerList',
        'updateBanner'
    ]);
};

module.exports = lib;
