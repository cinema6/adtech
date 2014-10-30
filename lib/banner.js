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
/*
lib.deleteBanner = function(client,bannerId){

};

lib.getBannerByExtId = function(client,extId){

};

lib.getBannerById = function(client,bannerId){

};

lib.getBannerInfoList = function(client, start, end, aove, col){

};

lib.getBannerList = function(client, start, end, aove, col){

};

lib.updateBanner = function(client, banner){

};
*/
lib.createAdmin = function(sslKeyPath, sslCertPath) {
    return soapUtils.makeAdmin(sslKeyPath, sslCertPath, lib, [
        'createBanner'
    ]);
};

module.exports = lib;
