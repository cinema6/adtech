var soap = require('soap'),
    q    = require('q'),
    lib  = {};

lib.nil = { attributes : { 'xsi:nil' : true } , $value : '' };

lib.createSoapSSLClient = function(wsdl,soapOpts, sslKey, sslCert) {
    return q.ninvoke(soap,'createClient',wsdl, soapOpts).then(function(client){
        client.setSecurity(new soap.ClientSSLSecurity(sslKey, sslCert));
        return client;
    });
};

module.exports = lib;
