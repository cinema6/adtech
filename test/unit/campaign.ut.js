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
            getCampaignById  : jasmine.createSpy('getCampaignById')
        };

    });
    
    describe('createAdmin', function(){
        beforeEach(function(){
            spyOn(mockSUtils,'makeAdmin');
        });

        it('uses soaputils makeAdmin to create admin',function(done){
            var mockKey = {}, mockCert = {};
            mockSUtils.makeAdmin.andReturn(q({}));
            
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
                        'getCampaignById',
                        'getCampaignList'
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

    describe('getCampaignById', function(){
        it ('proxies to the client getCampaignById', function(done){
            mockClient.getCampaignById.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : {}  }]);
                });
            });
            
            campaign.getCampaignById(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    expect(mockClient.getCampaignById.calls[0].args[0])
                        .toEqual({id:1});
                })
                .done(done);
        });

        it('rejects with error if not found', function(done){
            mockClient.getCampaignById.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{},'<>']);
                });
            });
            campaign.getCampaignById(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy.calls[0].args[0].message)
                        .toEqual('Unable to locate campaign: 1.');
                })
                .done(done);
        });
    });



});
