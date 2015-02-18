var soapUtils = require('./soaputils'),
    kWsdl     = __dirname + '/wsdl/WSStatisticsAdmin_v4.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSStatisticsAdmin_v4/'
    },
    lib = {};

lib.createClient = function(sslKeyPath, sslCertPath){
    return soapUtils.createSoapSSLClient(kWsdl,kOpts,sslKeyPath,sslCertPath);
};

lib.createAdmin = function(sslKeyPath, sslCertPath) {
    return soapUtils.makeAdmin(sslKeyPath, sslCertPath, lib, [
        'getCampaignStatisticsByCampaignId'
    ]);
};

lib.getCampaignStatisticsByCampaignId = function(client,id){
    var item = {
        attributes : {
          'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema',
          'xsi:type': 'xsd:long'
        },
        $value : id
    };
    return soapUtils.getObject('getCampaignStatisticsByCampaignId',['camId'],[client,item]);
//            Array.prototype.slice.call(arguments, 0));
};

module.exports = lib;
