var soapUtils = require('./soaputils'),
    q         = require('q'),
    kWsdl     = './wsdl/WSBannerAdmin_v13',
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
        });
};


lib.createBannerAdmin = function(/*opts*/){
//    return lib.createClient(opts)
//        .then(function(client){
//            var admin = {},
//            wrapper = function(){
//                return function(){
//                    return lib[method].apply(args); 
//                }
//            };
//
//            admin.createBanner = wrap('createBanner');
//                
//        });
};

lib.constants  = {
    IBanner : {
        STYLE_IMAGE          : 1,
        STYLE_APPLET         : 2,
        STYLE_HTML           : 3,
        STYLE_REDIRECT       : 4,
        STYLE_RAW            : 10,
        STYLE_VIDEO          : 11,
        STYLE_VIDEO_REDIRECT : 12,

        STATUS_PENDING  : 0,
        STATUS_ACTIVE   : 1,
        STATUS_ARCHIVED : 2,
        STATUS_DELETED  : 2,

        FILE_TYPE_SWF   : 'zip',
        FILE_TYPE_ZIP   : 'zip',
        FILE_TYPE_GIF   : 'gif',
        FILE_TYPE_JPG   : 'jpg',
        FILE_TYPE_PNG   : 'png',
        FILE_TYPE_HTML  : 'html'
    }
};

module.exports = lib;
