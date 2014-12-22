describe('banner',function(){
    var flush = true, banner, mockSUtils, mockClient;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        banner       = require('../../lib/banner');
        mockSUtils   = require('../../lib/soaputils');
        mockClient = { };
        
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
    
    it('createBanner - with timeRange', function(){
        var bannerObj = {}, bannerInfoObj = {};
        banner.createBanner(mockClient,1,bannerObj,bannerInfoObj,2);
        expect(mockSUtils.createObject)
            .toHaveBeenCalledWith('createBanner',
            ['bann','campaignId','bannerInfo','bannerTimeRangeNo'],
            [mockClient,bannerObj,1,bannerInfoObj,2]
        );
    });

    it('createBanner - without timeRange', function(){
        var bannerObj = {}, bannerInfoObj = {};
        banner.createBanner(mockClient,1,bannerObj,bannerInfoObj);
        expect(mockSUtils.createObject)
            .toHaveBeenCalledWith('createBanner',
            ['bann','campaignId','bannerInfo','bannerTimeRangeNo'],
            [mockClient,bannerObj,1,bannerInfoObj,1]
        );
    });


    it('deleteBanner', function(){
        banner.deleteBanner(mockClient,1);
        expect(mockSUtils.deleteObject)
            .toHaveBeenCalledWith('deleteBanner','bannerid',[mockClient,1]);
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

});
