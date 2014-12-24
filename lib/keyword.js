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

/*jshint maxlen: 200 */ //TODO: remove
/* node terminal util;
var adtech, q, err, resp;
function reRequire() { adtech = null; for (key in require.cache) { delete require.cache[key]; }; adtech = require('./index.js'); q = require('q'); adtech.createClient(null, console.log); }
function success(response) { console.log('got resp'); resp = response; }
function failure(error) { err = error; console.log('got error: '); console.log(err.root.Envelope.Body); }
var err = null; var resp = null; adtech.keywordAdmin.getKeywordById(3171661).then(success, failure);
var poop = process.on('uncaughtException', function(data) { console.log('uncaught: '); console.log(data); });
*/
/*jshint maxlen: 100 */
