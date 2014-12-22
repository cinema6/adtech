var soapUtils = require('./soaputils'),
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
    return soapUtils.createObject('createBanner',
            ['bann','campaignId','bannerInfo','bannerTimeRangeNo'],
            [client,banner,campaignId,bannerInfo,timeRangeNo]);
};

lib.deleteBanner = function(){
    return soapUtils.deleteObject('deleteBanner','bannerid',
            Array.prototype.slice.call(arguments, 0));
};

lib.getBannerInfoList = function(){
    return soapUtils.getList('getBannerInfoList','BannerInfo','order',
            Array.prototype.slice.call(arguments, 0));
};

lib.getBannerList = function(){
    return soapUtils.getList('getBannerList','Banner','order',
            Array.prototype.slice.call(arguments, 0));
};

lib.updateBanner = function(){
    return soapUtils.updateObject('updateBanner','bann',
            Array.prototype.slice.call(arguments, 0));
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
