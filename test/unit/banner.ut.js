describe('banner',function(){
    var flush = true, q, banner, mockSUtils, resolveSpy, rejectSpy;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        banner       = require('../../lib/banner');
        mockSUtils   = require('../../lib/soaputils');
        q            = require('q');
        resolveSpy   = jasmine.createSpy('resolve');
        rejectSpy    = jasmine.createSpy('reject');

        spyOn(mockSUtils,'createSoapSSLClient');
    });

    describe('createClient',function(){
        it('should resolve with a client if succeeds',function(done){
            var client = {}, key = {}, cert = {};
            mockSUtils.createSoapSSLClient.andReturn(q(client));
            banner.createClient(key,cert)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(client);
                    expect(rejectSpy).not.toHaveBeenCalled(); 

                    var args = mockSUtils.createSoapSSLClient.calls[0].args;
                    expect(args[0]).toEqual('./wsdl/WSBannerAdmin_v13');
                    expect(args[1]).toEqual({
                        strict : true,
                        endpoint :'https://ws.us-ec.adtechus.com/WSBannerAdmin_v13/'
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
            banner.createClient()
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(err); 
                })
                .done(done);
        });

    })

    describe('createBanner', function(){
        var mockClient;

        beforeEach(function(){
            mockClient = {
                createBanner : jasmine.createSpy('createBanner')
            };

            mockClient.createBanner.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,{});
                });
            });
        });

        it('maps parameters to parameter properties',function(done){
            var bann = {  },
                bannerInfo = {  };

            banner.createBanner(mockClient,12345,bann,bannerInfo,2)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    var args = mockClient.createBanner.calls[0].args;
                    expect(args[0]).toEqual({
                        bann : bann,
                        campaignId : 12345,
                        bannerInfo : bannerInfo,
                        bannerTimeRangeNo : 2 
                    });
                })
                .done(done);
        });

        it('sets a default timeRangeNo to 1',function(done){
            var bann = {  },
                bannerInfo = {  };

            banner.createBanner(mockClient,12345,bann,bannerInfo)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    var args = mockClient.createBanner.calls[0].args;
                    expect(args[0]).toEqual({
                        bann : bann,
                        campaignId : 12345,
                        bannerInfo : bannerInfo,
                        bannerTimeRangeNo : 1 
                    });
                })
                .done(done);
        });


    });
});
