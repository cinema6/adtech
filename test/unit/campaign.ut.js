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

describe('objectTo__',function(){
    var campaign,
        bannerInfoObjectIn, bannerInfoObjectOut,
        bannerInfoObjectListIn, bannerInfoObjectListOut,
        bannerTimeRangeObjectIn, bannerTimeRangeObjectOut,
        bannerTimeRangeObjectListIn, bannerTimeRangeObjectListOut,
        campaignFeaturesIn, campaignFeaturesOut,
        timeRangeObjectIn, timeRangeObjectOut,
        timeRangeObjectListIn, timeRangeObjectListOut,
        weekDaysObjectIn, weekDaysObjectOut,
        weekDaysObjectListIn, weekDaysObjectListOut,
        dateRangeObjectIn, dateRangeObjectOut,
        dateRangeObjectListIn, dateRangeObjectListOut;

    beforeEach(function(){
        var campaignObjects = require('./campaign-objects');
        bannerInfoObjectIn              = campaignObjects.bannerInfoObjectIn;
        bannerInfoObjectOut             = campaignObjects.bannerInfoObjectOut;
        bannerInfoObjectListIn          = campaignObjects.bannerInfoObjectListIn;
        bannerInfoObjectListOut         = campaignObjects.bannerInfoObjectListOut;
        bannerTimeRangeObjectIn         = campaignObjects.bannerTimeRangeObjectIn;
        bannerTimeRangeObjectOut        = campaignObjects.bannerTimeRangeObjectOut;
        bannerTimeRangeObjectListIn     = campaignObjects.bannerTimeRangeObjectListIn;
        bannerTimeRangeObjectListOut    = campaignObjects.bannerTimeRangeObjectListOut;
        campaignFeaturesIn              = campaignObjects.campaignFeaturesIn;
        campaignFeaturesOut             = campaignObjects.campaignFeaturesOut;
        timeRangeObjectIn               = campaignObjects.timeRangeObjectIn;
        timeRangeObjectOut              = campaignObjects.timeRangeObjectOut;
        timeRangeObjectListIn           = campaignObjects.timeRangeObjectListIn;
        timeRangeObjectListOut          = campaignObjects.timeRangeObjectListOut;
        weekDaysObjectIn                = campaignObjects.weekDaysObjectIn;
        weekDaysObjectOut               = campaignObjects.weekDaysObjectOut;
        weekDaysObjectListIn            = campaignObjects.weekDaysObjectListIn;
        weekDaysObjectListOut           = campaignObjects.weekDaysObjectListOut;
        dateRangeObjectIn               = campaignObjects.dateRangeObjectIn;
        dateRangeObjectOut              = campaignObjects.dateRangeObjectOut;
        dateRangeObjectListIn           = campaignObjects.dateRangeObjectListIn;
        dateRangeObjectListOut          = campaignObjects.dateRangeObjectListOut;
        
        campaign            = require('../../lib/campaign');
    });

    it('BannerInfo',function(){
        expect(campaign.objectToBannerInfo(bannerInfoObjectIn))
            .toEqual(bannerInfoObjectOut);
    });

    it('BannerInfoList',function(){
        expect(campaign.objectToBannerInfoList(bannerInfoObjectListIn))
            .toEqual(bannerInfoObjectListOut);
    });
    
    it('BannerTimeRange',function(){
        expect(campaign.objectToBannerTimeRange(bannerTimeRangeObjectIn))
            .toEqual(bannerTimeRangeObjectOut);
    });

    it('BannerTimeRangeList',function(){
        expect(campaign.objectToBannerTimeRangeList(bannerTimeRangeObjectListIn))
            .toEqual(bannerTimeRangeObjectListOut);
    });

    it('CampaignFeatures',function(){
        expect(campaign.objectToCampaignFeatures(campaignFeaturesIn))
            .toEqual(campaignFeaturesOut);
    });

    it('TimeRange', function(){
        expect(campaign.objectToTimeRange(timeRangeObjectIn))
            .toEqual(timeRangeObjectOut);
    });
    
    it('TimeRangeList', function(){
        expect(campaign.objectToTimeRangeList(timeRangeObjectListIn))
            .toEqual(timeRangeObjectListOut);
    });
    
    it('WeekDay', function(){
        expect(campaign.objectToWeekdays(weekDaysObjectIn))
            .toEqual(weekDaysObjectOut);
    });
    
    it('WeekDayList', function(){
        expect(campaign.objectToWeekdaysList(weekDaysObjectListIn))
            .toEqual(weekDaysObjectListOut);
    });
    
    it('DateRange', function(){
        expect(campaign.objectToDateRange(dateRangeObjectIn))
            .toEqual(dateRangeObjectOut);
    });
    
    it('DateRangeList', function(){
        expect(campaign.objectToDateRangeList(dateRangeObjectListIn))
            .toEqual(dateRangeObjectListOut);
    });
});

xdescribe('objectToCampaign',function(){
    var campaign;
    beforeEach(function(){
        campaign     = require('../../lib/campaign');
    });

    it('handles dates on root campaign',function(){
        var dt = new Date(1421070000000);

        expect(campaign.objectToCampaign({
            absoluteEndDate: dt,
            absoluteStartDate: dt
        })).toEqual(jasmine.objectContaining({
            absoluteEndDate: '2015-01-12T13:40:00.000Z',
            absoluteStartDate:'2015-01-12T13:40:00.000Z' 
        }));
    });

    it('handles banner time range', function(){
        var dt = new Date(1421070000000);
        expect(campaign.prepareCampaign({
            bannerTimeRangeList: [
                {
                 bannerDeliveryTypeId: 1,
                 bannerInfoList: [
                    {
                       assetTypeId: 0,
                       bannerNumber: 1,
                       bannerReferenceId: 24030672,
                       campaignId: 6262256,
                       campaignVersion: 5,
                       description: '',
                       entityFrequencyConfig: {
                          frequencyCookiesOnly: true,
                          frequencyDistributed: false,
                          frequencyInterval: 0,
                          frequencyTypeId: -1,
                          uniqueFrequencyId: 115920876
                       },
                       extId: "",
                       id: 431070639,
                       isVersion: false,
                       mainNetwork: 5491,
                       mediaTypeId: 0,
                       name: 'une banner',
                       sequenceNo: 1,
                       sizeTypeId: -1,
                       statusId: 1,
                       styleTypeId: -1,
                       subNetwork: 1,
                       weight: 50
                    }
                 ],
                 campaignVersion: 3,
                 comment: '',
                 creativeList: [],
                 description: '',
                 endDate: dt,
                 extId: '',
                 hasValidationError: false,
                 id: 109367675,
                 isVersion: false,
                 mainNetwork: 5491,
                 name: '',
                 startDate: dt,
                 subNetwork: 1,
                 todo: false
              } 
            ]
        })).toEqual(
            jasmine.objectContaining({
                bannerTimeRangeList : {
                    Items : {
                        attributes : { 
                            "xmlns:bt" : 'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/'    },
                        Item : [
                            {
                                attributes : { "xsi:type" : 'bt:BannerTimeRange' },
                                bannerDeliveryTypeId : 1,
                                bannerInfoList : {
                                    Items : {
                                        attributes : {
                                            "xmlsns:bi" : 'http://systinet.com/wsdl/de/adtech/helios/BannerManagement/'
                                        },
                                        Item : [ 
                                            {
                                            attributes : { "xsi:type" : 'bi:BannerInfo' },
                                            assetTypeId: 0,
                                            bannerNumber: 1,
                                            bannerReferenceId: 24030672,
                                            campaignId: 6262256,
                                            campaignVersion: 5,
                                            description: '',
                                            entityFrequencyConfig: {
                                               frequencyCookiesOnly: true,
                                               frequencyDistributed: false,
                                               frequencyInterval: 0,
                                               frequencyTypeId: -1,
                                               uniqueFrequencyId: 115920876
                                            },
                                            extId: "",
                                            id: 431070639,
                                            isVersion: false,
                                            mainNetwork: 5491,
                                            mediaTypeId: 0,
                                            name: 'une banner',
                                            sequenceNo: 1,
                                            sizeTypeId: -1,
                                            statusId: 1,
                                            styleTypeId: -1,
                                            subNetwork: 1,
                                            weight: 50
                                            }
                                        ]
                                    }
                                },
                                campaignVersion: 3,
                                comment: '',
                                creativeList: [],
                                description: '',
                                endDate: '2015-01-12T13:40:00.000Z',
                                extId: '',
                                hasValidationError: 0,
                                id: 109367675,
                                isVersion: 0,
                                mainNetwork: 5491,
                                name: '',
                                startDate: '2015-01-12T13:40:00.000Z',
                                subNetwork: 1,
                                todo: 1
                            }
                        ]
                    }
                }
            })
        );
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
            'makeCampaignFeatures',
            'makePlacementIdList',
            'updateCampaign',
            'updateCampaignDesiredImpressions',
            'updateCampaignStatusValues'
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
                    expect(resolveSpy).toHaveBeenCalledWith(null);
                    expect(rejectSpy).not.toHaveBeenCalled(); 
                    expect(mockSUtils.makeTypedList)
                        .toHaveBeenCalledWith(
                            'string',
                            ['123','456'],
                            'http://www.w3.org/2001/XMLSchema'
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
                'DateRange',
                mockList,
                'http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/'
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


