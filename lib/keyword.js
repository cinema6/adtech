var soapUtils = require('./soaputils'),
    kWsdl     = __dirname + '/wsdl/WSKeywordAdmin_v5.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSKeywordAdmin_v5/'
    },
    lib = {};

lib.createAdmin = function(sslKeyPath, sslCertPath) {
    return soapUtils.makeAdmin(sslKeyPath, sslCertPath, lib, [
        'getKeywordById',
        'getKeywordMapByIdList',
        'registerKeyword',
        'makeIdList'
    ]);
};

lib.makeIdList = function(client, items) {
    return {
        attributes: { 'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema' },
        long: items.map(function(item) {
            return {
                attributes: { 'xsi:type': 'xsd:long' },
                '$value': String(item)
            };
        })
    };
};

lib.createClient = function(sslKeyPath, sslCertPath){
    return soapUtils.createSoapSSLClient(kWsdl,kOpts,sslKeyPath,sslCertPath);
};

lib.getKeywordById = function() {
    return soapUtils.getObject('getKeywordById','$value',
            Array.prototype.slice.call(arguments, 0));
};

lib.getKeywordMapByIdList = function() {
    return soapUtils.getObject('getKeywordMapByIdList',null,
            Array.prototype.slice.call(arguments, 0));
};

lib.registerKeyword = function() {
    return soapUtils.createObject('registerKeyword','$value',
            Array.prototype.slice.call(arguments, 0));
};


module.exports = lib;
