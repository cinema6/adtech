var soapUtils = require('./soaputils'),
    kWsdl     = __dirname + '/wsdl/WSReportAdmin_v6.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSReportAdmin_v6/'
    },
    isDate       = require('util').isDate,
    isArray      = require('util').isArray,
    lib = {};

lib.createClient = function(sslKeyPath, sslCertPath){
    return soapUtils.createSoapSSLClient(kWsdl,kOpts,sslKeyPath,sslCertPath);
};

lib.createAdmin = function(sslKeyPath, sslCertPath) {
    return soapUtils.makeAdmin(sslKeyPath, sslCertPath, lib, [
        'getReportById',
        'getReportQueueEntryById',
        'requestReport',
        'requestReportByEntities'
    ]);
};

lib.getReportById = function(){
    return soapUtils.getObject('getReportById',['reportId'],
            Array.prototype.slice.call(arguments, 0));
};

lib.getReportQueueEntryById = function(){
    return soapUtils.getObject('getReportQueueEntryById',['id'],
            Array.prototype.slice.call(arguments, 0));
};

lib.requestReport = function(){
    var args = Array.prototype.slice.call(arguments, 0);
    if (isDate(args[2])){
        args[2] = args[2].toISOString();
    }
    if (isDate(args[3])){
        args[3] = args[3].toISOString();
    }
    return soapUtils.getObject('requestReport',['reportId','reportStartDate','reportEndDate'],
            args);
};

lib.requestReportByEntities = function(client,id,startDate,endDate,entType,rptCat,entityIds){
    var idList;
    if (isDate(startDate)){
        startDate = startDate.toISOString();
    }
    if (isDate(endDate)){
        endDate = endDate.toISOString();
    }
    if (!isArray(entityIds)){
        entityIds = [ entityIds ];
    }
    idList = soapUtils.makeTypedList(
        'long',
        entityIds,
        'http://www.w3.org/2001/XMLSchema'
    );

    return soapUtils.getObject('requestReportByEntities',
            [
                'reportId',
                'reportStartDate',
                'reportEndDate',
                'entityType',
                'reportCategory',
                'reportEntityIds'
            ],
            [
                client,
                id,
                startDate,
                endDate,
                entType,
                rptCat,idList
            ]);
};

module.exports = lib;
