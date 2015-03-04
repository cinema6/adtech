var soapUtils = require('./soaputils'),
    q         = require('q'),
    isArray   = require('util').isArray,
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
        'getCampaignStatisticsIdList',
        'getCampaignStatisticsList',
        'getPlacementStatisticsByPlacementId',
        'getPlacementStatisticsIdList',
        'getPlacementStatisticsList'
    ]);
};

lib.getStatsRqsXml = function (method, tagName, argv){
    var client   = argv[0],
        tagValue = argv[1],    
        rqs = '<ns0:' + tagName + ' xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
        'xsi:type="xsd:long">' + tagValue + '</ns0:' + tagName + '>';

    return q.ninvoke(client,method,rqs)
        .then(function(result){
            if (soapUtils.isEmpty(result[0])){
                return q.reject(new Error('Unable to locate object with id (' + 
                    tagValue + ') for method ' + method + '.'));
            }
            return soapUtils.processResponse(result[0].response || result[0]);
        });
};

lib.getListXml = function(method, argv) {
    var client   = argv[0],
        start    = argv[1],
        end      = argv[2],
        boolExpr = argv[3],
        rqs;
    if ((start === undefined) || (start === null)){
        rqs = '<ns0:startlist xsi:nil="true"/>';
    } else {
        rqs = '<ns0:startlist>' + start + '</ns0:startlist>';
    }
    
    if ((end === undefined) || (end === null)){
        rqs += '<ns0:endlist xsi:nil="true"/>';
    } else {
        rqs += '<ns0:endlist>' + end + '</ns0:endlist>';
    }

    if ((boolExpr === undefined) || (boolExpr === null)){
        rqs += '<ns0:boolExpr xsi:nil="true"/>';
    } else {
        rqs += boolExpr.toXml();
    }
    rqs += '<ns0:order xsi:nil="true"/>';
    
    return q.ninvoke(client,method,rqs)
        .then(function(result){
            var retval;
            if (soapUtils.isEmpty(result[0])){
                return [];
            }
            retval = soapUtils.processResponse(result[0].response || result[0]);
            if (isArray(retval.long)){
                return retval.long;
            }
            return retval;
        });
};

lib.getCampaignStatisticsByCampaignId = function(){
    return lib.getStatsRqsXml('getCampaignStatisticsByCampaignId','camId',
            Array.prototype.slice.call(arguments, 0));
};

lib.getCampaignStatisticsIdList = function(){
    return lib.getListXml('getCampaignStatisticsIdList',
            Array.prototype.slice.call(arguments, 0));
};

lib.getCampaignStatisticsList = function(){
    return lib.getListXml('getCampaignStatisticsList',
            Array.prototype.slice.call(arguments, 0));
};

lib.getPlacementStatisticsByPlacementId = function(){
    return lib.getStatsRqsXml('getPlacementStatisticsByPlacementId','plcId',
            Array.prototype.slice.call(arguments, 0));
};

lib.getPlacementStatisticsIdList = function(){
    return lib.getListXml('getPlacementStatisticsIdList',
            Array.prototype.slice.call(arguments, 0));
};

lib.getPlacementStatisticsList = function(){
    return lib.getListXml('getPlacementStatisticsList',
            Array.prototype.slice.call(arguments, 0));
};

module.exports = lib;
