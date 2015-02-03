ddescribe('stats',function(){
    var flush = true, stats, mockSUtils, mockClient;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        stats       = require('../../lib/stats');
        mockSUtils   = require('../../lib/soaputils');
        mockClient = { };
        
        spyOn(mockSUtils,'createSoapSSLClient');
        spyOn(mockSUtils,'makeAdmin');
        spyOn(mockSUtils,'getObject');
    });
    
    it('uses soaputils makeAdmin to create admin',function(){
        var args, mockKey = {}, mockCert = {};
        stats.createAdmin(mockKey,mockCert);
        args = mockSUtils.makeAdmin.calls[0].args;
        expect(args[0]).toEqual(mockKey);
        expect(args[1]).toEqual(mockCert);
        expect(args[2]).toEqual(stats);
        expect(args[3]).toEqual([
            'getCampaignStatisticsByCampaignId'
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
    
    it('getCampaignStatisticsByCampaignId', function(){
        stats.getCampaignStatisticsByCampaignId(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getCampaignStatisticsByCampaignId',['camId'],[mockClient,
                {
                    attributes : {
                        'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema',
                        'xsi:type'  : 'xsd:long'
                    },
                    $value : 1
                }
            ]);
    });
});

