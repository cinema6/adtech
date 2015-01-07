describe('CampaignFeatures',function(){
    var flush = true, campaign;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        campaign     = require('../../lib/campaign');
    });

    it('can be instantiated',function(){
        var c1 = new campaign.CampaignFeatures(),
            c2 = new campaign.CampaignFeatures();
        expect(c1).toBeDefined();
        expect(c1._featureSet).toBeDefined();
        expect(c2).toBeDefined();
        expect(c2._featureSet).toBeDefined();
        expect(c1).not.toBe(c2);
        expect(c1._featureSet).not.toBe(c2._featureSet);
    });

    it('set method sets a feature with boolean true',function(){
        var c1 = new campaign.CampaignFeatures();
        expect(c1._featureSet.f1).not.toBeDefined();
        c1.set('f1',true);
        expect(c1._featureSet.f1).toEqual({
            locked: false,
            shared: false,
            visible: true
        });
    });

    it('set method sets a feature with boolean false',function(){
        var c1 = new campaign.CampaignFeatures();
        expect(c1._featureSet.f1).not.toBeDefined();
        c1.set('f1',false);
        expect(c1._featureSet.f1).toEqual({
            locked: false,
            shared: false,
            visible: false
        });
    });

    it('set method takes an object for feature value', function(){
        var c1 = new campaign.CampaignFeatures();
        expect(c1._featureSet.f1).not.toBeDefined();
        c1.set('f1',{ locked: false, shared: false, visible: true });
        expect(c1._featureSet.f1).toEqual({
            locked: false,
            shared: false,
            visible: true
        });
    });

    it('set method takes an object with partial values for feature value', function(){
        var c1 = new campaign.CampaignFeatures();
        expect(c1._featureSet.f1).not.toBeDefined();
        c1.set('f1',{  visible: true });
        expect(c1._featureSet.f1).toEqual({
            locked: false,
            shared: false,
            visible: true
        });
    });

    it('set method with no feature value throws an exception', function(){
        expect(function(){
            var c1 = new campaign.CampaignFeatures();
            c1.set('f1');
        }).toThrow('CampaignFeatures.set requires name,value parameters.');
    });

    it('set method with null feature value defaults to true', function(){
        expect(function(){
            var c1 = new campaign.CampaignFeatures();
            c1.set('f1');
        }).toThrow('CampaignFeatures.set requires name,value parameters.');
    });

    it('set method overrides earlier feature setting',function(){
        var c1 = new campaign.CampaignFeatures();
        expect(c1._featureSet.f1).not.toBeDefined();
        c1.set('f1',true);
        expect(c1._featureSet.f1).toEqual({
            locked: false,
            shared: false,
            visible: true
        });
        c1.set('f1',false);
        expect(c1._featureSet.f1).toEqual({
            locked: false,
            shared: false,
            visible: false
        });
    });

    it('get method returns a copy of the feature setting if it exists',function(){
        var c1 = new campaign.CampaignFeatures(), v1;
        c1.set('f1',true);
        v1 = c1.get('f1');
        expect(v1).toEqual({
            locked: false,
            shared: false,
            visible: true
        });
        expect(v1).not.toBe(c1._featureSet.f1);
        v1.visible = false;
        expect(c1._featureSet.f1.visible).toEqual(true);
    });

    it('get method returns null if feature setting does not exist',function(){
        var c1 = new campaign.CampaignFeatures();
        expect(c1.get('f1')).toBeNull();
    });

    it('remove method removes a setting from the feature set',function(){
        var c1 = new campaign.CampaignFeatures();
        c1.set('f1',true);
        expect(c1.get('f1')).not.toBeNull();
        c1.remove('f1');
        expect(c1.get('f1')).toBeNull();
    });

    it('remove method is ok if called on non existing feature',function(){
        var c1 = new campaign.CampaignFeatures();
        expect(c1.get('f1')).toBeNull();
        c1.remove('f1');
        expect(c1.get('f1')).toBeNull();
    });

    it('valueOf returns node-soap formatted object', function(){
        var c1 = new campaign.CampaignFeatures();
        c1.set('f1',true);
        c1.set('f2',true);
        c1.set('f3',false);
        expect(c1.valueOf()).toEqual({
            attributes: {
              'xmlns:cm'  : 'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/',
              'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema'
            },
            Keys: {
                Item: [
                    { attributes: { 'xsi:type': 'xsd:string' }, $value: 'f1' },
                    { attributes: { 'xsi:type': 'xsd:string' }, $value: 'f2' },
                    { attributes: { 'xsi:type': 'xsd:string' }, $value: 'f3' }
                ]
            },
            Values : {
                Item: [
                    {
                       attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
                       locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
                       shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
                       visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'1'}
                    },
                    {
                       attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
                       locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
                       shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
                       visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'1'}
                    },
                    {
                       attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
                       locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
                       shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
                       visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'0'}
                    }
                ]
            }
        });
    });
    
    it('valueOf empty set returns null', function(){
        var c1 = new campaign.CampaignFeatures();
        expect(c1.valueOf()).toEqual({ attributes : { 'xsi:nil' : true } , $value : '' });
    });
});

describe('campaign',function(){
    var flush = true, campaign, mockSUtils, mockClient, resolveSpy, rejectSpy;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        campaign     = require('../../lib/campaign');
        mockSUtils   = require('../../lib/soaputils');
        resolveSpy   = jasmine.createSpy('resolve');
        rejectSpy    = jasmine.createSpy('reject');
        
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
            'getCampaignStatusValues',
            'getCampaignTypeList',
            'getOptimizerTypeList',
            'makeDateRangeList',
            'makeCampaignFeatures'
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

    it('getCampaignStatusValues', function(done){
        mockClient.getCampaignStatusValues = jasmine.createSpy('getCampaignStatusValues');
        mockClient.getCampaignStatusValues.andCallFake(function(a,b){
            return b(null,{});
        });

        campaign.getCampaignStatusValues(mockClient,['123','456'])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([]);
                    expect(rejectSpy).not.toHaveBeenCalled(); 
                    expect(mockSUtils.makeTypedList)
                        .toHaveBeenCalledWith(
                            'http://www.w3.org/2001/XMLSchema',
                            'string',
                            ['123','456']
                            );

                    expect(mockClient.getCampaignStatusValues).toHaveBeenCalled();
                })
                .done(done);
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

    it('makeCampaignFeatures',function(){
        var features = {
            'f1' : true,
            'f2' : true,
            'f3' : false
        };

        expect(campaign.makeCampaignFeatures(mockClient,features)).toEqual({
            attributes: {
              'xmlns:cm'  : 'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/',
              'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema'
            },
            Keys: {
                Item: [
                    { attributes: { 'xsi:type': 'xsd:string' }, $value: 'f1' },
                    { attributes: { 'xsi:type': 'xsd:string' }, $value: 'f2' },
                    { attributes: { 'xsi:type': 'xsd:string' }, $value: 'f3' }
                ]
            },
            Values : {
                Item: [
                    {
                       attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
                       locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
                       shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
                       visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'1'}
                    },
                    {
                       attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
                       locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
                       shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
                       visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'1'}
                    },
                    {
                       attributes: { 'xsi:type': 'cm:CampaignFeatureSettings' },
                       locked:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
                       shared:  {attributes:{'xsi:type':'xsd:boolean'},$value:'0'},
                       visible: {attributes:{'xsi:type':'xsd:boolean'},$value:'0'}
                    }
                ]
            }
        });
    });
});


