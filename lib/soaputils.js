var path = require('path'),
    soap = require('soap'),
    q    = require('q'),
    isArray = require('util').isArray,
    lib  = {};

lib.nil = { attributes : { 'xsi:nil' : true } , $value : '' };

lib.isEmpty = function(obj,key) {
    for (key in obj){
        return false;
    }
    return true;
};

function getResponseValue (datum){
    var rawType = Object.keys(datum.attributes).reduce(function(prev,cur){
        if (cur.match(/:type$/)){
            return datum.attributes[cur].split(':');
        }
    },1);

    if (rawType === undefined) {
        return datum.$value;
    }

    if ((rawType[1] === 'long') || (rawType[1] === 'int')){
        return parseInt(datum.$value,10);
    } else
    if ((rawType[1] === 'float') || (rawType[1] === 'double')){
        return parseFloat(datum.$value);
    } else
    if (rawType[1] === 'dateTime'){
        return new Date(datum.$value);
    } else
    if ((rawType[1] === 'boolean') && (datum.$value === '0')){
        return false; 
    } else
    if ((rawType[1] === 'boolean') && (datum.$value === '1')){
        return true; 
    }
     
    return datum.$value;
}

lib.processResponse = function (data){
    var key, i, len, result;
    for (key in data){
        result = result || {};
        if (data[key].$value){ // simple value
            result[key] = getResponseValue(data[key]);
        } else
        if (data[key].Items && data[key].Items.Item){ // special Items.Item handling
            if (!isArray(data[key].Items.Item)){
                data[key] = [ data[key].Items.Item ];
            } else {
                data[key] = data[key].Items.Item;
            }
            result[key] = [];
            len = data[key].length;
            for (i = 0; i < len; i++) {
                if (data[key][i].$value){ // array is list of simple elts
                    result[key].push(data[key][i].$value);
                } else { // array is list of complex elts
                    result[key].push(lib.processResponse(data[key][i]));
                }
            }
        } else
        if (data[key].Items && this.isEmpty(data[key].Items)) {
            result[key] = [];
        } else
        if (data[key].Item && !data[key].attributes && !data[key].$value){ 
            // special .Item handling
            if (!isArray(data[key].Item)){
                data[key] = [ data[key].Item ];
            } else {
                data[key] = data[key].Item;
            }
            result[key] = [];
            len = data[key].length;
            for (i = 0; i < len; i++) {
                if (data[key][i].$value){ // array is list of simple elts
                    result[key].push(data[key][i].$value);
                } else { // array is list of complex elts
                    result[key].push(lib.processResponse(data[key][i]));
                }
            }
        } else
        if (key !== 'attributes') {
            if (isArray(data[key])){
                result[key] = [];
                len = data[key].length;
                for (i = 0; i < len; i++) {
                    if (data[key][i].$value){ // array is list of simple elts
                        result[key].push(data[key][i].$value);
                    } else { //array is list of complex elts
                        result[key].push(lib.processResponse(data[key][i]));
                    }
                }
            } else
            if (typeof data[key] === 'object'){
                result[key] = lib.processResponse(data[key]);
            } else {
                result[key] = data[key];
            }
        }
    }
    if (lib.isEmpty(result)){
        result = null;
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
