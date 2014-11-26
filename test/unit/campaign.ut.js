describe('campaign',function(){
    var flush = true, campaign, mockSUtils, mockClient;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        campaign     = require('../../lib/campaign');
        mockSUtils   = require('../../lib/soaputils');
        
        mockClient = { };

        spyOn(mockSUtils,'createSoapSSLClient');
        spyOn(mockSUtils,'makeAdmin');
        spyOn(mockSUtils,'makeTypedList');
        spyOn(mockSUtils,'createObject');
        spyOn(mockSUtils,'deleteObject');
        spyOn(mockSUtils,'getList');
        spyOn(mockSUtils,'getObject');
    });
    
    it('uses soaputils makeAdmin to create admin',function(){
        var args, mockKey = {}, mockCert = {};
        campaign.createAdmin(mockKey,mockCert);
        args = mockSUtils.makeAdmin.calls[0].args;
        expect(args[0]).toEqual(mockKey);
        expect(args[1]).toEqual(mockCert);
        expect(args[2]).toEqual(campaign);
        expect(args[3]).toEqual([
            'createCampaign',
            'deleteCampaign',
            'getAdGoalTypeList',
            'getCampaignByExtId',
            'getCampaignById',
            'getCampaignList',
            'getCampaignTypeList',
            'getOptimizerTypeList',
            'makeDateRangeList'
        ]);
    });

    it('createClient', function(){
        var args, key = {}, cert = {};
        campaign.createClient(key,cert);
        args = mockSUtils.createSoapSSLClient.calls[0].args;
        expect(args[0]).toMatch('/wsdl/WSCampaignAdmin_v28.wsdl');
        expect(args[1]).toEqual({
            strict : true,
            endpoint :'https://ws.us-ec.adtechus.com/WSCampaignAdmin_v28/'
        });
        expect(args[2]).toEqual(key);
        expect(args[3]).toEqual(cert);
    });

    it('createCampaign', function(){
        var obj = {};
        campaign.createCampaign(mockClient,obj);
        expect(mockSUtils.createObject)
            .toHaveBeenCalledWith('createCampaign','wcam',[mockClient,obj]);
    });

    it('deleteCampaign', function(){
        campaign.deleteCampaign(mockClient,1);
        expect(mockSUtils.deleteObject)
            .toHaveBeenCalledWith('deleteCampaign','camid',[mockClient,1]);
    });
    
    it('getAdGoalTypeList', function(){
        campaign.getAdGoalTypeList(mockClient);
        expect(mockSUtils.getList)
            .toHaveBeenCalledWith('getAdGoalTypeList','AdGoalType','order',[mockClient]);
    });

    it('getCampaignByExtId', function(){
        campaign.getCampaignByExtId(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getCampaignByExtId','extid',[mockClient,1]);
    });

    it('getCampaignById', function(){
        campaign.getCampaignById(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getCampaignById','id',[mockClient,1]);
    });

    it('getCampaignList', function(){
        campaign.getCampaignList(mockClient);
        expect(mockSUtils.getList)
            .toHaveBeenCalledWith('getCampaignList','Campaign','order',[mockClient]);
    });

    it('getCampaignTypeList', function(){
        campaign.getCampaignTypeList(mockClient);
        expect(mockSUtils.getList)
            .toHaveBeenCalledWith('getCampaignTypeList','CampaignType','order',[mockClient]);
    
    });

    it('getOptimizerTypeList', function(){
        campaign.getOptimizerTypeList(mockClient);
        expect(mockSUtils.getList)
            .toHaveBeenCalledWith('getOptimizerTypeList','OptimizerType','order',[mockClient]);
    });

    it('makeDateRangeList',function(){
        var mockList = [{p:1},{p:2}];
        campaign.makeDateRangeList(mockClient,mockList);
        expect(mockSUtils.makeTypedList)
            .toHaveBeenCalledWith(
                'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/',
                'DateRange',
                mockList
                );
    });
});
