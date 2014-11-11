describe('customer',function(){
    var flush = true, admin, mockSUtils, mockClient;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        admin        = require('../../lib/customer');
        mockSUtils   = require('../../lib/soaputils');
        
        mockClient = {
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
        admin.createAdmin(mockKey,mockCert);
        args = mockSUtils.makeAdmin.calls[0].args;
        expect(args[0]).toEqual(mockKey);
        expect(args[1]).toEqual(mockCert);
        expect(args[2]).toEqual(admin);
        expect(args[3]).toEqual([
            'createAdvertiser',
            'deleteAdvertiser',
            'getAdvertiserByExtId',
            'getAdvertiserById',
            'getAdvertiserList',
            'updateAdvertiser',
            'createCustomer',
            'deleteCustomer',
            'getCustomerByExtId',
            'getCustomerById',
            'getCustomerList',
            'updateCustomer'
        ]);
    });
    
    it('createClient', function(){
        var args, key = {}, cert = {};
        admin.createClient(key,cert);
        args = mockSUtils.createSoapSSLClient.calls[0].args;
        expect(args[0]).toMatch('/wsdl/WSCustomerAdmin_v4.wsdl');
        expect(args[1]).toEqual({
            strict : true,
            endpoint :'https://ws.us-ec.adtechus.com/WSCustomerAdmin_v4/'
        });
        expect(args[2]).toEqual(key);
        expect(args[3]).toEqual(cert);
    });
    
    it('createAdvertiser', function(){
        var obj = {};
        admin.createAdvertiser(mockClient,obj);
        expect(mockSUtils.createObject)
            .toHaveBeenCalledWith('createAdvertiser','ad',[mockClient,obj]);
    });
    
    it('deleteAdvertiser', function(){
        admin.deleteAdvertiser(mockClient,1);
        expect(mockSUtils.deleteObject)
            .toHaveBeenCalledWith('deleteAdvertiser','id',[mockClient,1]);
    });
    
    it('getAdvertiserByExtId', function(){
        admin.getAdvertiserByExtId(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getAdvertiserByExtId','eid',[mockClient,1]);
    });

    it('getAdvertiserById', function(){
        admin.getAdvertiserById(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getAdvertiserById',['id','col'],[mockClient,1]);
    });

    it('getAdvertiserList', function(){
        admin.getAdvertiserList(mockClient);
        expect(mockSUtils.getList)
            .toHaveBeenCalledWith('getAdvertiserList','Advertiser','order',[mockClient]);
    });

    it('updateAdvertiser', function(){
        var upd = {};
        admin.updateAdvertiser(mockClient,upd);
        expect(mockSUtils.updateObject)
            .toHaveBeenCalledWith('updateAdvertiser','ad',[mockClient,upd]);
    });
    
    it('createCustomer', function(){
        var obj = {};
        admin.createCustomer(mockClient,obj);
        expect(mockSUtils.createObject)
            .toHaveBeenCalledWith('createCustomer','cust',[mockClient,obj]);
    });
    
    it('deleteCustomer', function(){
        admin.deleteCustomer(mockClient,1);
        expect(mockSUtils.deleteObject)
            .toHaveBeenCalledWith('deleteCustomer','id',[mockClient,1]);
    });
    
    it('getCustomerByExtId', function(){
        admin.getCustomerByExtId(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getCustomerByExtId','eid',[mockClient,1]);
    });

    it('getCustomerById', function(){
        admin.getCustomerById(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getCustomerById',['id','col'],[mockClient,1]);
    });

    it('getCustomerList', function(){
        admin.getCustomerList(mockClient);
        expect(mockSUtils.getList)
            .toHaveBeenCalledWith('getCustomerList','Customer','order',[mockClient]);
    });

    it('updateCustomer', function(){
        var upd = {};
        admin.updateCustomer(mockClient,upd);
        expect(mockSUtils.updateObject)
            .toHaveBeenCalledWith('updateCustomer','cust',[mockClient,upd]);
    });


});
