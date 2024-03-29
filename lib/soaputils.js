var path = require('path'),
    soap = require('soap'),
    q    = require('q'),
    util = require('util'), 
    isArray = util.isArray,
    isDate = util.isDate,
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
    var key, i, len, result, mk ;
    
    for (key in data){
        result = result || {};
        if (key === '$value') { // handle simple values
            return getResponseValue(data);
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
        if (data[key].Items && lib.isEmpty(data[key].Items)) {
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
                    result[key].push(getResponseValue(data[key][i]));
                } else { // array is list of complex elts
                    result[key].push(lib.processResponse(data[key][i]));
                }
            }
        } else
        if ( (data[key].Keys && data[key].Values) && (!data[key].$value)){ 
            if (!isArray(data[key].Keys.Item)){
                data[key].Keys = [ data[key].Keys.Item ];
            } else {
                data[key].Keys = data[key].Keys.Item;
            }
            if (!isArray(data[key].Values.Item)){
                data[key].Values = [ data[key].Values.Item ];
            } else {
                data[key].Values = data[key].Values.Item;
            }
            result[key] = {};
            len = data[key].Keys.length;
            for (i = 0; i < len; i++){
                if (data[key].Keys[i].$value){ 
                    mk = data[key].Keys[i].$value;
                } else {
                    mk = lib.processResponse(data[key].Keys[i]);
                }

                if (data[key].Values[i].$value){ 
                    result[key][mk] = data[key].Values[i].$value;
                } else {
                    result[key][mk] = lib.processResponse(data[key].Values[i]);
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
        result = '';
    }
    
    // process HashMaps
    if (result && result.Keys instanceof Array && result.Values instanceof Array) {
        result.Keys.forEach(function(mapKey, idx) {
            result[mapKey] = result.Values[idx];
        });
        delete result.Keys;
        delete result.Values;
    }
    return result;
};

lib.isAPIObject = function(obj){
    return ( (!lib.isEmpty(obj)) &&
            ((!lib.isEmpty(obj.attributes)) || obj.$value || (obj.Items))) ?
        true : false;
};

lib.copyProp = function(src,dst,propName,defaultVal){
    var sourceVal = (function(s,pn){
            return pn.split('.').reduce(function(prev,curr){
                return prev && prev[curr];
            },s);
        }(src,propName)),
        copyVal = function( d, pn, v){
            var ptr = d, lastProp, lastPtr;
            pn.split('.').reduce(function(prev,curr){
                ptr[curr] = ptr[curr] || {};
                lastProp = curr;
                lastPtr = ptr;
                ptr = ptr[curr];
                return prev && prev[curr];
            },d);
            lastPtr[lastProp] = v;
            return d;
        };

    if ((sourceVal === undefined) || (sourceVal === null)) {
        if (defaultVal) {
            copyVal(dst,propName,defaultVal);
        } 
    } else
    if (isDate(sourceVal)) {
        copyVal(dst,propName,sourceVal.toISOString());
    } else
    if ((typeof sourceVal) === 'boolean') {
        copyVal(dst,propName, (sourceVal ? 1 : 0)); 
    } else {
        copyVal(dst,propName, sourceVal);
    }
    return this;
};

function PropCopier(s,d){
    this.source = s;
    this.dest = d;
}

PropCopier.prototype.copy = function(propName,defaultValue){
    lib.copyProp(this.source,this.dest,propName,defaultValue);
};

PropCopier.prototype.copyNil = function(propName){
    lib.copyProp(this.source,this.dest,propName,lib.nil);
};

lib.makePropCopier = function(src,dst) {
    return new PropCopier(src,dst);
};

lib.makeTypedList = function(typeName,items,ns,pfx){
    var theList = {
        Items : {
            Item : [ ]
        }
    };
    pfx = pfx || 'cm';
    if (ns) {
        theList.Items.attributes = {};
        theList.Items.attributes['xmlns:' + pfx] = ns;
    }
    items.forEach(function(item){
        var prop, listItem = {
            attributes : {
                'xsi:type' : pfx + ':' + typeName
            }
        };
        if ((typeName === 'string') || (typeName === 'long') || (typeName === 'int')){
            listItem.$value = item;
        } else {
            for (prop in item){
                listItem[prop] = item[prop];
            }

        }
        theList.Items.Item.push(listItem);
    });

    return theList;
};

lib.makeSimpleTypedMap = function(keyType,valType,data) {
    var apiMap = {
        attributes: {
          'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema'
        },
        Keys   : { Item : [] },
        Values : { Item : [] }
    }, k, v;

    for (k in data){
        v = data[k];
        apiMap.Keys.Item.push({ 
            attributes: {
                'xsi:type': 'xsd:' + keyType 
            },
            $value: k
        });

        apiMap.Values.Item.push({
            attributes: { 'xsi:type': 'xsd:' + valType },
            $value: v
        });
    }

    return apiMap;
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

/*
 * exec - template method for executing a generic method call
 */

lib.exec = function(clientMethod, propName, argv) {
    var isEmpty = this.isEmpty, processResponse = this.processResponse, params = {};
    params[propName] = argv[1];
    return q.ninvoke(argv[0],clientMethod,params)
        .then(function(result){
            if (isEmpty(result[0])){
                return true;
            }
            return processResponse(result[0].response);
        });
};


/*
 * createObject - template method for creating a specific object
 */

lib.createObject = function(clientMethod, propName, argv) {
    var nil = this.nil, isEmpty = this.isEmpty, processResponse = this.processResponse,
        params = {};
    if (isArray(propName)){
        propName.forEach(function(prop,idx){
            if ((argv[idx +1] === undefined) || (argv[idx + 1] === null)){
                params[prop] = nil;         
            } else {
                params[prop] = argv[idx + 1];
            }
        });
    } else {
        params[propName] = argv[1];
    }
    return q.ninvoke(argv[0],clientMethod,params)
        .then(function(result){
            if (isEmpty(result[0])){
                return q.reject(new Error('Unable to create object: '  + argv[1] + '.'));
            }
            return processResponse(result[0].response || result[0]);
        });
};


/*
 * deleteObject - template method for deleting a specific object
 */

lib.deleteObject = function(clientMethod, propName, argv) {
    var isEmpty = this.isEmpty, processResponse = this.processResponse, params = {};
    params[propName] = argv[1];
    return q.ninvoke(argv[0],clientMethod,params)
        .then(function(result){
            if (isEmpty(result[0])){
                return true;
            }
            return processResponse(result[0].response || result[0]);
        });
};

/*
 * getObject - template method for getting a specific object
 */

lib.getObject = function(clientMethod,propName, argv){
    var nil = this.nil, isEmpty = this.isEmpty, processResponse = this.processResponse,
        params = {};
    if (!propName) {
        params = argv[1];
    } else if (isArray(propName)){
        propName.forEach(function(prop,idx){
            if ((argv[idx +1] === undefined) || (argv[idx + 1] === null)){
                params[prop] = nil;         
            } else {
                params[prop] = argv[idx + 1];
            }
        });
    } else {
        params[propName] = argv[1];
    }
    return q.ninvoke(argv[0],clientMethod,params)
        .then(function(result){
            if (isEmpty(result[0])){
                return q.reject(new Error('Unable to locate object: '  + argv[1] + '.'));
            }
            return processResponse(result[0].response || result[0]);
        });
};

/*
 * getList - template method for type specific list requests
 */

lib.getList = function(clientMethod,responseType,orderProp,argv){
    var nil = this.nil, isEmpty = this.isEmpty, processResponse = this.processResponse,
        params = {};

    params.start      = isNaN(parseInt(argv[1],10)) ? nil : argv[1];
    params.end        = isNaN(parseInt(argv[2],10))   ? nil : argv[2];
    params.boolExpr   = (argv[3] && argv[3].valueOf)  ? argv[3].valueOf() : nil;
    params[orderProp] = argv[4] || nil; 
    return q.ninvoke(argv[0],clientMethod,params).then(function(result){
            if (isEmpty(result[0])){
                return [];
            }
//            console.log(result[1]);
            var res = [], resp = processResponse(result[0].response || result[0]);
            if (isArray(resp[responseType])) {
                res = resp[responseType];
            } else {
                res.push(resp[responseType]);
            }
            return res;
        });
};

/*
 * updateObject - template method for updating a specific object
 */

lib.updateObject = function(clientMethod, propName, argv) {
    var isEmpty = this.isEmpty, processResponse = this.processResponse, params = {};
    params[propName] = argv[1];
    return q.ninvoke(argv[0],clientMethod,params)
        .then(function(result){
            if (isEmpty(result[0])){
                return q.reject(new Error('Unable to locate object: '  + argv[1] + '.'));
            }
            return processResponse(result[0].response || result[0]);
        });
};

module.exports = lib;
