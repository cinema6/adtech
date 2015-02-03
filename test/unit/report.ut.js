describe('report',function(){
    var flush = true, reports, mockSUtils, mockClient, startDate, endDate;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        reports       = require('../../lib/report');
        mockSUtils   = require('../../lib/soaputils');
        mockClient = { };
        
        spyOn(mockSUtils,'createSoapSSLClient');
        spyOn(mockSUtils,'makeAdmin');
        spyOn(mockSUtils,'getObject');
        startDate = new Date(2014,11,1,0,0,0,0);
        endDate   = new Date(2014,11,31,23,59,59,999);
    });
    
    it('uses soaputils makeAdmin to create admin',function(){
        var args, mockKey = {}, mockCert = {};
        reports.createAdmin(mockKey,mockCert);
        args = mockSUtils.makeAdmin.calls[0].args;
        expect(args[0]).toEqual(mockKey);
        expect(args[1]).toEqual(mockCert);
        expect(args[2]).toEqual(reports);
        expect(args[3]).toEqual([
            'getReportById',
            'getReportQueueEntryById',
            'requestReport',
            'requestReportByEntities'
        ]);
    });
    
    it('createClient', function(){
        var args, key = {}, cert = {};
        reports.createClient(key,cert);
        args = mockSUtils.createSoapSSLClient.calls[0].args;
        expect(args[0]).toMatch('/wsdl/WSReportAdmin_v6.wsdl');
        expect(args[1]).toEqual({
            strict : true,
            endpoint :'https://ws.us-ec.adtechus.com/WSReportAdmin_v6/'
        });
        expect(args[2]).toEqual(key);
        expect(args[3]).toEqual(cert);
    });
    
    it('getReportByReportId', function(){
        reports.getReportById(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getReportById',['reportId'],[mockClient,1]);
    });

    it('getReportQueueEntryById', function(){
        reports.getReportQueueEntryById(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getReportQueueEntryById',['id'],[mockClient,1]);
    });

    it('requestReport with date objects', function(){
        reports.requestReport(mockClient,1,startDate,endDate);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('requestReport',
                ['reportId','reportStartDate','reportEndDate'],
                [mockClient,1,'2014-12-01T05:00:00.000Z', '2015-01-01T04:59:59.999Z']);
    });

    it('requestReport with date strings', function(){
        reports.requestReport(mockClient,1,'startDate','endDate');
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('requestReport',
                ['reportId','reportStartDate','reportEndDate'],
                [mockClient,1,'startDate','endDate']);
    });

    it('requestReportByEntities with date objects and single entity', function(){
        reports.requestReportByEntities(mockClient,1,startDate,endDate,2,3,4);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('requestReportByEntities',
                ['reportId','reportStartDate','reportEndDate','entityType',
                'reportCategory', 'reportEntityIds'],
                [mockClient,1,'2014-12-01T05:00:00.000Z', '2015-01-01T04:59:59.999Z',2,3,
                { Items : { Item : [ { attributes : { 'xsi:type' : 'cm:long' }, $value : 4 } ],
                attributes : { 'xmlns:cm' : 'http://www.w3.org/2001/XMLSchema' } } }]);
    });

    it('requestReportByEntities with date strings and single entity', function(){
        reports.requestReportByEntities(mockClient,1,'startDate','endDate',2,3,4);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('requestReportByEntities',
                ['reportId','reportStartDate','reportEndDate','entityType',
                'reportCategory', 'reportEntityIds'],
                [mockClient,1,'startDate','endDate',2,3,
                { Items : { Item : [ { attributes : { 'xsi:type' : 'cm:long' }, $value : 4 } ],
                attributes : { 'xmlns:cm' : 'http://www.w3.org/2001/XMLSchema' } } }]);
    });

    it('requestReportByEntities with entity list', function(){
        reports.requestReportByEntities(mockClient,1,startDate,endDate,2,3,[4,5]);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('requestReportByEntities',
                ['reportId','reportStartDate','reportEndDate','entityType',
                'reportCategory', 'reportEntityIds'],
                [mockClient,1,'2014-12-01T05:00:00.000Z', '2015-01-01T04:59:59.999Z',2,3,
                { Items : { Item : [ 
                      { attributes : { 'xsi:type' : 'cm:long' }, $value : 4 },
                      { attributes : { 'xsi:type' : 'cm:long' }, $value : 5 }
                ],
                attributes : { 'xmlns:cm' : 'http://www.w3.org/2001/XMLSchema' } } }]);
    });

    
});
