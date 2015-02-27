var soapUtils = require('./soaputils'),
    q         = require('q'),
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
        'getCampaignStatisticsByCampaignId',
        'getPlacementStatisticsByPlacementId',
        'getWebsiteStatisticsByWebsiteId'
    ]);
};

lib.xmlRequest = function (client, method, tagName, tagValue){
    var rqs = '<ns0:' + tagName + ' xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
        'xsi:type="xsd:long">' + tagValue + '</ns0:' + tagName + '>';

    return q.ninvoke(client,method,rqs)
        .then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate object with id: ' + 
                    tagValue + '.'));
            }
            return soapUtils.processResponse(result[0].response || result[0]);
        });
};

lib.getCampaignStatisticsByCampaignId = function(client,campaignId){
    return lib.xmlRequest(client,'getCampaignStatisticsByCampaignId','camId', campaignId);
};

lib.getPlacementStatisticsByPlacementId = function(client,plcId){
    return lib.xmlRequest(client,'getPlacementStatisticsByPlacementId','plcId', plcId);
};

lib.getWebsiteStatisticsByWebsiteId = function(client,weId){
    return lib.xmlRequest(client,'getWebsiteStatisticsByWebsiteId','weId', weId);
};

module.exports = lib;
