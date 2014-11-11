var soapUtils = require('./soaputils'),
    kWsdl     = __dirname + '/wsdl/WSCustomerAdmin_v4.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSCustomerAdmin_v4/'
    },
    lib = {};

lib.createAdmin = function(sslKeyPath, sslCertPath) {
    return soapUtils.makeAdmin(sslKeyPath, sslCertPath, lib, [
        'createAdvertiser',
        'deleteAdvertiser',
        'getAdvertiserByExtId',
        'getAdvertiserById',
        'getAdvertiserList',
        'updateAdvertiser',
        'createCustomer',
        'deleteCustomer',
        'getCustomerByExtId',
        'getCustomerById',
        'getCustomerList',
        'updateCustomer',
        'makeAdvertiserList'
    ]);
};

lib.makeAdvertiserList = function(client, items){
    var theList = {
        Items : {
            attributes : { 
                'xmlns:cm' : 'http://systinet.com/wsdl/de/adtech/helios/CustomerManagement/'
            },
            Item : [ ]
        }
    };
    
    items.forEach(function(item){
        var prop, listItem = {
            attributes : {
                'xsi:type' : 'cm:Advertiser'
            }
        };
        for (prop in item){
            listItem[prop] = item[prop];
        }

        theList.Items.Item.push(listItem);
    });

    return theList;
};

lib.createClient = function(sslKeyPath, sslCertPath){
    return soapUtils.createSoapSSLClient(kWsdl,kOpts,sslKeyPath,sslCertPath);
};

lib.createAdvertiser = function(){
    return soapUtils.createObject('createAdvertiser','ad',
            Array.prototype.slice.call(arguments, 0));
};

lib.deleteAdvertiser = function(){
    return soapUtils.deleteObject('deleteAdvertiser','id',
            Array.prototype.slice.call(arguments, 0));
};

lib.getAdvertiserByExtId = function(){
    return soapUtils.getObject('getAdvertiserByExtId','eid',
            Array.prototype.slice.call(arguments, 0));
};

lib.getAdvertiserById = function(){
    return soapUtils.getObject('getAdvertiserById',['id','col'],
            Array.prototype.slice.call(arguments, 0));
};

lib.getAdvertiserList = function(){
    return soapUtils.getList('getAdvertiserList','Advertiser','order',
            Array.prototype.slice.call(arguments, 0));
};

lib.updateAdvertiser = function(){
    return soapUtils.updateObject('updateAdvertiser','ad',
            Array.prototype.slice.call(arguments, 0));
};

lib.createCustomer = function(){
    return soapUtils.createObject('createCustomer','cust',
            Array.prototype.slice.call(arguments, 0));
};

lib.deleteCustomer = function(){
    return soapUtils.deleteObject('deleteCustomer','id',
            Array.prototype.slice.call(arguments, 0));
};

lib.getCustomerByExtId = function(){
    return soapUtils.getObject('getCustomerByExtId','eid',
            Array.prototype.slice.call(arguments, 0));
};

lib.getCustomerById = function(){
    return soapUtils.getObject('getCustomerById',['id','col'],
            Array.prototype.slice.call(arguments, 0));
};

lib.getCustomerList = function(){
    return soapUtils.getList('getCustomerList','Customer','order',
            Array.prototype.slice.call(arguments, 0));
};

lib.updateCustomer = function(){
    return soapUtils.updateObject('updateCustomer','cust',
            Array.prototype.slice.call(arguments, 0));
};


module.exports = lib;
