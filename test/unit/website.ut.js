describe('website',function(){
    var flush = true, website, mockSUtils, mockClient;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        website      = require('../../lib/website');
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
        website.createAdmin(mockKey,mockCert);
        args = mockSUtils.makeAdmin.calls[0].args;
        expect(args[0]).toEqual(mockKey);
        expect(args[1]).toEqual(mockCert);
        expect(args[2]).toEqual(website);
        expect(args[3]).toEqual([
            'createPage',
            'createPlacement',
            'createWebsite',
            'deletePage',
            'deletePlacement',
            'deleteWebsite',
            'getPageByExtId',
            'getPageById',
            'getPageList',
            'getPlacementByExtId',
            'getPlacementById',
            'getPlacementList',
            'getWebsiteByExtId',
            'getWebsiteById',
            'getWebsiteList',
            'updatePage',
            'updatePlacement',
            'updateWebsite'    
        ]);
    });
    
    it('createClient', function(){
        var args, key = {}, cert = {};
        website.createClient(key,cert);
        args = mockSUtils.createSoapSSLClient.calls[0].args;
        expect(args[0]).toMatch('/wsdl/WSWebsiteAdmin_v15.wsdl');
        expect(args[1]).toEqual({
            strict : true,
            endpoint :'https://ws.us-ec.adtechus.com/WSWebsiteAdmin_v15/'
        });
        expect(args[2]).toEqual(key);
        expect(args[3]).toEqual(cert);
    });

    it('createPage', function(){
        var pg = {};
        website.createPage(mockClient,pg);
        expect(mockSUtils.createObject)
            .toHaveBeenCalledWith('createPage','page',[mockClient,pg]);
    });
    
    it('deletePage', function(){
        website.deletePage(mockClient,1);
        expect(mockSUtils.deleteObject)
            .toHaveBeenCalledWith('deletePage','pageId',[mockClient,1]);
    });
    
    it('getPageByExtId', function(){
        website.getPageByExtId(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getPageByExtId','extid',[mockClient,1]);
    });

    it('getPageById', function(){
        website.getPageById(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getPageById',['id','col'],[mockClient,1]);
    });

    it('getPageList', function(){
        website.getPageList(mockClient);
        expect(mockSUtils.getList)
            .toHaveBeenCalledWith('getPageList','Page','col',[mockClient]);
    });

    it('updatePage', function(){
        var upd = {};
        website.updatePage(mockClient,upd);
        expect(mockSUtils.updateObject)
            .toHaveBeenCalledWith('updatePage','page',[mockClient,upd]);
    });

    it('createPlacement', function(){
        var pl = {};
        website.createPlacement(mockClient,pl);
        expect(mockSUtils.createObject)
            .toHaveBeenCalledWith('createPlacement','pl',[mockClient,pl]);
    });

    it('deletePlacement', function(){
        website.deletePlacement(mockClient,1);
        expect(mockSUtils.deleteObject)
            .toHaveBeenCalledWith('deletePlacement','placeId',[mockClient,1]);
    });
    
    it('getPlacementByExtId', function(){
        website.getPlacementByExtId(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getPlacementByExtId','extid',[mockClient,1]);
    });

    it('getPlacementById', function(){
        website.getPlacementById(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getPlacementById',['id','col'],[mockClient,1]);
    });
    
    it('getPlacementList', function(){
        website.getPlacementList(mockClient);
        expect(mockSUtils.getList)
            .toHaveBeenCalledWith('getPlacementList','Placement','col',[mockClient]);
    });

    it('updatePlacement', function(){
        var upd = {};
        website.updatePlacement(mockClient,upd);
        expect(mockSUtils.updateObject)
            .toHaveBeenCalledWith('updatePlacement','pl',[mockClient,upd]);
    });
    
    it('createWebsite', function(){
        var obj = {};
        website.createWebsite(mockClient,obj);
        expect(mockSUtils.createObject)
            .toHaveBeenCalledWith('createWebsite','site',[mockClient,obj]);
    });

    it('deleteWebsite', function(){
        website.deleteWebsite(mockClient,1);
        expect(mockSUtils.deleteObject)
            .toHaveBeenCalledWith('deleteWebsite','websiteId',[mockClient,1]);
    });
    
    it('getWebsiteByExtId', function(){
        website.getWebsiteByExtId(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getWebsiteByExtId','extid',[mockClient,1]);
    });

    it('getWebsiteById', function(){
        website.getWebsiteById(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getWebsiteById',['id','col'],[mockClient,1]);
    });
    
    it('getWebsiteList', function(){
        website.getWebsiteList(mockClient);
        expect(mockSUtils.getList)
            .toHaveBeenCalledWith('getWebsiteList','Website','col',[mockClient]);
    });

    it('updateWebsite', function(){
        var upd = {};
        website.updateWebsite(mockClient,upd);
        expect(mockSUtils.updateObject)
            .toHaveBeenCalledWith('updateWebsite','site',[mockClient,upd]);
    });

});
