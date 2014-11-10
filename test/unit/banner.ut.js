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
        
        spyOn(mockSUtils,'createSoapSSLClient');
        spyOn(mockSUtils,'makeAdmin');
        spyOn(mockSUtils,'createObject');
        spyOn(mockSUtils,'deleteObject');
        spyOn(mockSUtils,'getList');
        spyOn(mockSUtils,'getObject');
        spyOn(mockSUtils,'updateObject');

    });
    
    it('uses soaputils makeAdmin to create admin',function(){
        var args, mockKey = {}, mockCert = {};
        banner.createAdmin(mockKey,mockCert);
        args = mockSUtils.makeAdmin.calls[0].args;
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
    });

    
    it('createClient', function(){
        var args, key = {}, cert = {};
        banner.createClient(key,cert);
        args = mockSUtils.createSoapSSLClient.calls[0].args;
        expect(args[0]).toMatch('/wsdl/WSBannerAdmin_v13.wsdl');
        expect(args[1]).toEqual({
            strict : true,
            endpoint :'https://ws.us-ec.adtechus.com/WSBannerAdmin_v13/'
        });
        expect(args[2]).toEqual(key);
        expect(args[3]).toEqual(cert);
    });

    it('deleteBanner', function(){
        banner.deleteBanner(mockClient,1);
        expect(mockSUtils.deleteObject)
            .toHaveBeenCalledWith('deleteBanner','bannerId',[mockClient,1]);
    });

    it('getBannerList', function(){
        banner.getBannerList(mockClient);
        expect(mockSUtils.getList)
            .toHaveBeenCalledWith('getBannerList','Banner','order',[mockClient]);
    });

    it('getBannerInfoList', function(){
        banner.getBannerInfoList(mockClient);
        expect(mockSUtils.getList)
            .toHaveBeenCalledWith('getBannerInfoList','BannerInfo','order',[mockClient]);
    });

    it('updateBanner', function(){
        var upd = {};
        banner.updateBanner(mockClient,upd);
        expect(mockSUtils.updateObject)
            .toHaveBeenCalledWith('updateBanner','bann',[mockClient,upd]);
    });


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

});
