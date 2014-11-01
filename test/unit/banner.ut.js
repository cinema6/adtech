describe('banner',function(){
    var flush = true, q, banner, mockSUtils, resolveSpy, rejectSpy, mockClient;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        banner       = require('../../lib/banner');
        mockSUtils   = require('../../lib/soaputils');
        q            = require('q');
        resolveSpy   = jasmine.createSpy('resolve');
        rejectSpy    = jasmine.createSpy('reject');
        
        mockClient = {
            createBanner  : jasmine.createSpy('createBanner'),
            deleteBanner  : jasmine.createSpy('deleteBanner'),
            getBannerList : jasmine.createSpy('getBannerList'),
            updateBanner  : jasmine.createSpy('updateBanner')
        };

    });

    describe('createClient',function(){
        beforeEach(function(){
            spyOn(mockSUtils,'createSoapSSLClient');
        });

        it('should resolve with a client if succeeds',function(done){
            var client = {}, key = {}, cert = {};
            mockSUtils.createSoapSSLClient.andReturn(q(client));
            banner.createClient(key,cert)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(client);
                    expect(rejectSpy).not.toHaveBeenCalled(); 

                    var args = mockSUtils.createSoapSSLClient.calls[0].args;
                    expect(args[0]).toMatch('./wsdl/WSBannerAdmin_v13.wsdl');
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
        beforeEach(function(){
            mockClient.createBanner.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : {}  }]);
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

    describe('deleteBanner', function(){
        it('returns true if the banner is deleted',function(done){
            mockClient.deleteBanner.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[ {}, "" ]);
                });
            });

            banner.deleteBanner(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                   
                    expect(resolveSpy).toHaveBeenCalledWith(true);
                    expect(mockClient.deleteBanner.calls[0].args[0])
                        .toEqual({bannerId:1});
                })
                .done(done);
        });

        it('rejects if the banner is not deleted', function(done){
            var e = new Error('error');
            mockClient.deleteBanner.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(e);
                });
            });

            banner.deleteBanner(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(e);
                })
                .done(done);
        });

    });

    describe('getBannerList', function(){
        it ('returns an array with one result if one result is found', function(done){
            var mockBanner = {
                name : 'test',
                id   : 1
            };
            mockClient.getBannerList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : { Banner : mockBanner  }  }, '']);
                });
            });
            
            banner.getBannerList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockBanner]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });


        it ('returns an array with multipe results if multiple results found', function(done){
            var mockBanner = {
                name : 'test',
                id   : 1
            };
            mockClient.getBannerList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : { Banner:{0:mockBanner,1:mockBanner} } }, '']);
                });
            });
            
            banner.getBannerList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockBanner,mockBanner]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });

        it('returns an empty array if no results are found', function(done){
            mockClient.getBannerList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ }, '']);
                });
            });
            
            banner.getBannerList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });
    });

    describe('updateBanner', function(){
        it('returns true if the banner is updated',function(done){
            var ban = {};
            mockClient.updateBanner.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[ { response : { x : 1 } }, "" ]);
                });
            });

            banner.updateBanner(mockClient,ban)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                   
                    expect(resolveSpy).toHaveBeenCalledWith({x:1});
                    expect(mockClient.updateBanner.calls[0].args[0]).toEqual({bann:ban});
                })
                .done(done);
        });

        it('rejects if the banner is not updated', function(done){
            var e = new Error('error');
            mockClient.updateBanner.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(e);
                });
            });

            banner.updateBanner(mockClient,{})
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(e);
                })
                .done(done);
        });
    });

    describe('createAdmin', function(){
        beforeEach(function(){
            spyOn(mockSUtils,'makeAdmin');
        });

        it('uses soaputils makeAdmin to create admin',function(done){
            var mockKey = {}, mockCert = {};
            mockSUtils.makeAdmin.andReturn(q({}));
            
            banner.createAdmin(mockKey,mockCert)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    var args = mockSUtils.makeAdmin.calls[0].args;
                    expect(args[0]).toEqual(mockKey);
                    expect(args[1]).toEqual(mockCert);
                    expect(args[2]).toEqual(banner);
                    expect(args[3]).toEqual([
                        'createBanner',
                        'deleteBanner',
                        'getBannerInfoList',
                        'getBannerList',
                        'updateBanner' 
                    ]);
                })
                .done(done);
        });
    });
});
