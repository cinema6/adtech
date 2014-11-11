var soapUtils = require('./soaputils'),
    kWsdl     = __dirname + '/wsdl/WSWebsiteAdmin_v15.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSWebsiteAdmin_v15/'
    },
    lib = {};

lib.createClient = function(sslKeyPath, sslCertPath){
    return soapUtils.createSoapSSLClient(kWsdl,kOpts,sslKeyPath,sslCertPath);
};

lib.createPage = function(){
    return soapUtils.createObject('createPage','page',
            Array.prototype.slice.call(arguments, 0));
};

lib.deletePage = function(){
    return soapUtils.deleteObject('deletePage','pageId',
            Array.prototype.slice.call(arguments, 0));
};

lib.getPageByExtId = function(){
    return soapUtils.getObject('getPageByExtId','extid',
            Array.prototype.slice.call(arguments, 0));
};

lib.getPageById = function(){
    return soapUtils.getObject('getPageById',['id','col'],
            Array.prototype.slice.call(arguments, 0));
};

lib.getPageList = function(){
    return soapUtils.getList('getPageList','Page','col',
            Array.prototype.slice.call(arguments, 0));
};

lib.updatePage = function(){
    return soapUtils.updateObject('updatePage','page',
            Array.prototype.slice.call(arguments, 0));
};


lib.createPlacement = function(){
    return soapUtils.createObject('createPlacement','pl',
            Array.prototype.slice.call(arguments, 0));
};

lib.deletePlacement = function(){
    return soapUtils.deleteObject('deletePlacement','placeId',
            Array.prototype.slice.call(arguments, 0));
};

lib.getPlacementByExtId = function(){
    return soapUtils.getObject('getPlacementByExtId','extid',
            Array.prototype.slice.call(arguments, 0));
};


lib.getPlacementById = function(){
    return soapUtils.getObject('getPlacementById',['id','col'],
            Array.prototype.slice.call(arguments, 0));
};

lib.getPlacementList = function(){
    return soapUtils.getList('getPlacementList','Placement','col',
            Array.prototype.slice.call(arguments, 0));
};

lib.updatePlacement = function(){
    return soapUtils.updateObject('updatePlacement','pl',
            Array.prototype.slice.call(arguments, 0));
};

lib.createWebsite = function(){
    return soapUtils.createObject('createWebsite','site',
            Array.prototype.slice.call(arguments, 0));
};

lib.deleteWebsite = function(){
    return soapUtils.deleteObject('deleteWebsite','websiteId',
            Array.prototype.slice.call(arguments, 0));
};

lib.getWebsiteByExtId = function(){
    return soapUtils.getObject('getWebsiteByExtId','extid',
            Array.prototype.slice.call(arguments, 0));
};


lib.getWebsiteById = function(){
    return soapUtils.getObject('getWebsiteById',['id','col'],
            Array.prototype.slice.call(arguments, 0));
};

lib.getWebsiteList = function(){
    return soapUtils.getList('getWebsiteList','Website','col',
            Array.prototype.slice.call(arguments, 0));
};

lib.updateWebsite = function(){
    return soapUtils.updateObject('updateWebsite','site',
            Array.prototype.slice.call(arguments, 0));
};

lib.createAdmin = function(sslKeyPath, sslCertPath) {
    return soapUtils.makeAdmin(sslKeyPath, sslCertPath, lib,
        [
                'createPage',
                'createPlacement',
                'createWebsite',
                'deletePage',
                'deletePlacement',
                'deleteWebsite',
                'getPageByExtId',
                'getPageById',
                'getPageList',
                'getPlacementByExtId',
                'getPlacementById',
                'getPlacementList',
                'getWebsiteByExtId',
                'getWebsiteById',
                'getWebsiteList',
                'updatePage',
                'updatePlacement',
                'updateWebsite'
        ]
    );
};

module.exports = lib;

