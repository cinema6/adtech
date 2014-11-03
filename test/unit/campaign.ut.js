describe('campaign',function(){
    var flush = true, q, campaign, mockSUtils, resolveSpy, rejectSpy, mockClient;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        campaign     = require('../../lib/campaign');
        mockSUtils   = require('../../lib/soaputils');
        q            = require('q');
        resolveSpy   = jasmine.createSpy('resolve');
        rejectSpy    = jasmine.createSpy('reject');
        
        mockClient = {
            deleteCampaign       : jasmine.createSpy('deleteCampaign'),
            getCampaignByExtId   : jasmine.createSpy('getCampaignByExtId'),
            getCampaignById      : jasmine.createSpy('getCampaignById'),
            getCampaignList      : jasmine.createSpy('getCampaignList'),
            getCampaignTypeList  : jasmine.createSpy('getCampaignTypeList'),
            getOptimizerTypeList : jasmine.createSpy('getOptimizerTypeList')
        };

        spyOn(mockSUtils,'makeAdmin');
        spyOn(mockSUtils,'deleteObject');
        spyOn(mockSUtils,'getList');
        spyOn(mockSUtils,'getObject');
    });
    
    describe('createAdmin', function(){
        it('uses soaputils makeAdmin to create admin',function(done){
            var mockKey = {}, mockCert = {};
            mockSUtils.makeAdmin.andReturn(q({}));
            mockSUtils.deleteObject.andReturn(q({}));
            mockSUtils.getList.andReturn(q({}));
            mockSUtils.getObject.andReturn(q({}));
            
            campaign.createAdmin(mockKey,mockCert)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    var args = mockSUtils.makeAdmin.calls[0].args;
                    expect(args[0]).toEqual(mockKey);
                    expect(args[1]).toEqual(mockCert);
                    expect(args[2]).toEqual(campaign);
                    expect(args[3]).toEqual([
                        'deleteCampaign',
                        'getCampaignByExtId',
                        'getCampaignById',
                        'getCampaignList',
                        'getCampaignTypeList',
                        'getOptimizerTypeList'
                    ]);
                })
                .done(done);
        });
    });

    describe('createClient',function(){
        beforeEach(function(){
            spyOn(mockSUtils,'createSoapSSLClient');
        });

        it('should resolve with a client if succeeds',function(done){
            var client = {}, key = {}, cert = {};
            mockSUtils.createSoapSSLClient.andReturn(q(client));
            campaign.createClient(key,cert)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(client);
                    expect(rejectSpy).not.toHaveBeenCalled(); 

                    var args = mockSUtils.createSoapSSLClient.calls[0].args;
                    expect(args[0]).toMatch('./wsdl/WSCampaignAdmin_v28.wsdl');
                    expect(args[1]).toEqual({
                        strict : true,
                        endpoint :'https://ws.us-ec.adtechus.com/WSCampaignAdmin_v28/'
                    });
                    expect(args[2]).toEqual(key);
                    expect(args[3]).toEqual(cert);
                })
                .done(done);
        });

        it('should reject with an error if it fails', function(done){
            var err = {};
            mockSUtils.createSoapSSLClient.andCallFake(function(){
                return q.reject(err);
            });
            campaign.createClient()
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(err); 
                })
                .done(done);
        });

    });

    describe ('simple wrappers',function(){
        it('deleteCampaign', function(){
            campaign.deleteCampaign(mockClient,1);
            expect(mockSUtils.deleteObject)
                .toHaveBeenCalledWith('deleteCampaign','camid',[mockClient,1]);
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
    });
});
