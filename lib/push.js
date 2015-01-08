var soapUtils = require('./soaputils'),
    kWsdl     = __dirname + '/wsdl/WSPushAdmin_v5.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSPushAdmin_v5/'
    },
    lib = {};

lib.createClient = function(sslKeyPath, sslCertPath){
    return soapUtils.createSoapSSLClient(kWsdl,kOpts,sslKeyPath,sslCertPath);
};

lib.createAdmin = function(sslKeyPath, sslCertPath) {
    return soapUtils.makeAdmin(sslKeyPath, sslCertPath, lib, [
        'holdCampaignById',
        'startCampaignById',
        'stopCampaignById'
    ]);
};

lib.holdCampaignById = function(){
    return soapUtils.exec('holdCampaignById','camId',
            Array.prototype.slice.call(arguments, 0));
};

lib.startCampaignById = function(){
    return soapUtils.exec('startCampaignById','camId',
            Array.prototype.slice.call(arguments, 0));
};

lib.stopCampaignById = function(){
    return soapUtils.exec('stopCampaignById','camId',
            Array.prototype.slice.call(arguments, 0));
};


module.exports = lib;
