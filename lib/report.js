var soapUtils = require('./soaputils'),
    kWsdl     = __dirname + '/wsdl/WSReportAdmin_v6.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSReportAdmin_v6/'
    },
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
    return soapUtils.getObject('requestReport',['reportId','reportStartDate','reportEndDate'],
            Array.prototype.slice.call(arguments, 0));
};

lib.requestReportByEntities = function(client,id,startDate,endDate,entType,rptCat,entityIds){
    var idList = soapUtils.makeTypedList(
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
