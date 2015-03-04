describe('stats',function(){
    var flush = true, stats, mockSUtils, mockClient, mockQ;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        stats       = require('../../lib/stats');
        mockSUtils  = require('../../lib/soaputils');
        mockQ       = require('q');
        mockClient = { };
        
        spyOn(mockSUtils,'createSoapSSLClient');
        spyOn(mockSUtils,'makeAdmin');
        spyOn(mockSUtils,'getObject');
        spyOn(mockQ,'ninvoke').andReturn(mockQ());
    });
    
    it('uses soaputils makeAdmin to create admin',function(){
        var args, mockKey = {}, mockCert = {};
        stats.createAdmin(mockKey,mockCert);
        args = mockSUtils.makeAdmin.calls[0].args;
        expect(args[0]).toEqual(mockKey);
        expect(args[1]).toEqual(mockCert);
        expect(args[2]).toEqual(stats);
        expect(args[3]).toEqual([
            'getCampaignStatisticsByCampaignId',
            'getCampaignStatisticsIdList',
            'getCampaignStatisticsList',
            'getPlacementStatisticsByPlacementId',
            'getPlacementStatisticsIdList',
            'getPlacementStatisticsList'
        ]);
    });
    
    it('createClient', function(){
        var args, key = {}, cert = {};
        stats.createClient(key,cert);
        args = mockSUtils.createSoapSSLClient.calls[0].args;
        expect(args[0]).toMatch('/wsdl/WSStatisticsAdmin_v4.wsdl');
        expect(args[1]).toEqual({
            strict : true,
            endpoint : 'https://ws.us-ec.adtechus.com/WSStatisticsAdmin_v4/'
        });
        expect(args[2]).toEqual(key);
        expect(args[3]).toEqual(cert);
    });

    it('getStatsRqsXml makes soap request with raw xml',function(){
        stats.getStatsRqsXml('someMethod','someTag',[mockClient, 1]);
        expect(mockQ.ninvoke).toHaveBeenCalledWith(mockClient,'someMethod','<ns0:someTag xmlns:xsd="http://www.w3.org/2001/XMLSchema" xsi:type="xsd:long">1</ns0:someTag>');
    });
    
    describe('stats method',function(){
        beforeEach(function(){
            spyOn(stats,'getStatsRqsXml');
            spyOn(stats,'getListXml');
        });

        it('getCampaignStatisticsByCampaignId',function(){
            stats.getCampaignStatisticsByCampaignId(mockClient,111);
            expect(stats.getStatsRqsXml).toHaveBeenCalledWith(
                'getCampaignStatisticsByCampaignId','camId',[mockClient,111]
            );
        });
        
        it('getCampaignStatisticsIdList',function(){
            stats.getCampaignStatisticsIdList(mockClient);
            expect(stats.getListXml).toHaveBeenCalledWith(
                'getCampaignStatisticsIdList',[mockClient]
            );
        });
        
        it('getCampaignStatisticsIdList(0,100)',function(){
            stats.getCampaignStatisticsIdList(mockClient,0,100);
            expect(stats.getListXml).toHaveBeenCalledWith(
                'getCampaignStatisticsIdList',[mockClient,0,100]
            );
        });
        
        it('getCampaignStatisticsList',function(){
            stats.getCampaignStatisticsList(mockClient);
            expect(stats.getListXml).toHaveBeenCalledWith(
                'getCampaignStatisticsList',[mockClient]
            );
        });
        
        it('getCampaignStatisticsList(0,100)',function(){
            stats.getCampaignStatisticsList(mockClient,0,100);
            expect(stats.getListXml).toHaveBeenCalledWith(
                'getCampaignStatisticsList',[mockClient,0,100]
            );
        });
        
        it('getPlacementStatisticsByPlacementId',function(){
            stats.getPlacementStatisticsByPlacementId(mockClient,111);
            expect(stats.getStatsRqsXml).toHaveBeenCalledWith(
                'getPlacementStatisticsByPlacementId','plcId',[mockClient,111]
            );
        });
        
        it('getPlacementStatisticsIdList',function(){
            stats.getPlacementStatisticsIdList(mockClient);
            expect(stats.getListXml).toHaveBeenCalledWith(
                'getPlacementStatisticsIdList',[mockClient]
            );
        });
        
        it('getPlacementStatisticsIdList(0,100)',function(){
            stats.getPlacementStatisticsIdList(mockClient,0,100);
            expect(stats.getListXml).toHaveBeenCalledWith(
                'getPlacementStatisticsIdList',[mockClient,0,100]
            );
        });
        
        it('getPlacementStatisticsList',function(){
            stats.getPlacementStatisticsList(mockClient);
            expect(stats.getListXml).toHaveBeenCalledWith(
                'getPlacementStatisticsList',[mockClient]
            );
        });
        
        it('getPlacementStatisticsList(0,100)',function(){
            stats.getPlacementStatisticsList(mockClient,0,100);
            expect(stats.getListXml).toHaveBeenCalledWith(
                'getPlacementStatisticsList',[mockClient,0,100]
            );
        });
    });
});

