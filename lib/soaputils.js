var path = require('path'),
    soap = require('soap'),
    q    = require('q'),
    lib  = {};

lib.nil = { attributes : { 'xsi:nil' : true } , $value : '' };

lib.isEmpty = function(obj,key) {
    for (key in obj){
        return false;
    }
    return true;
};

lib.processResponse = function (data,result){
    var key;
    result = result || {};
    for (key in data){
        if (data[key].$value){
            result[key] = data[key].$value;
        } else
        if ((key !== 'attributes') && ((typeof data[key]) === 'object')){
            result[key] = lib.processResponse(data[key]);
        } else
        if (key !== 'attributes'){
            result[key] = data[key];
        }
    }
    return result;
};

lib.createSoapSSLClient = function(wsdl, soapOpts, sslKey, sslCert) {
    var sslKeyPath  = sslKey  || path.join(process.env.HOME,'.ssh','adtech.key'),
        sslCertPath = sslCert || path.join(process.env.HOME,'.ssh','adtech.crt');

    if (!wsdl){
        return q.reject('Wsdl parameter is required!');
    }

    return q.ninvoke(soap,'createClient',wsdl, soapOpts).then(function(client){
        client.setSecurity(new soap.ClientSSLSecurity(sslKeyPath, sslCertPath));
        return client;
    });
};

/**
 * Helper for creating admins.. basically wrapping a call to the
 * passed library's createClient, and then wrapping the libs methods
 * to use the client as the first arg to the libs methods.
 */
lib.makeAdmin = function(sslKeyPath, sslCertPath, adminLib, methods){
    return adminLib.createClient(sslKeyPath, sslCertPath)
        .then(function(client){
            var admin = {}, i,
            methodCt = methods.length,
            wrap = function(l,c,m){
                if (l[m] === undefined){
                    throw ('Missing method: "' + m + '".');
                }
                
                if (typeof l[m] !== 'function'){
                    throw ('Not a method: "' + m + '".');
                }
                return function(){
                    var args = Array.prototype.slice.call(arguments, 0);
                    args.unshift(c);
                    return l[m].apply(l,args); 
                };
            };

            for (i = 0; i < methodCt; i++) {
                admin[methods[i]] = wrap(adminLib,client,methods[i]);
            }

            return admin;
        });
};

module.exports = lib;
