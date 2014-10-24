var soap = require('soap'),
    q    = require('q'),
    lib  = {};

lib.nil = { attributes : { 'xsi:nil' : true } , $value : '' };

lib.createSoapSSLClient = function(wsdl, soapOpts, sslKey, sslCert) {
    if (!wsdl){
        return q.reject('Wsdl parameter is required!');
    }
    
    if (!(!!sslKey && !!sslCert)) {
        return q.reject('SSL Key and Cert parameters are required!');
    }

    return q.ninvoke(soap,'createClient',wsdl, soapOpts).then(function(client){
        client.setSecurity(new soap.ClientSSLSecurity(sslKey, sslCert));
        return client;
    });
};

module.exports = lib;
