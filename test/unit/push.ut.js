describe('push',function(){
    var flush = true, push, mockSUtils, mockClient;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        push       = require('../../lib/push');
        mockSUtils   = require('../../lib/soaputils');
        mockClient = { };
        
        spyOn(mockSUtils,'createSoapSSLClient');
        spyOn(mockSUtils,'makeAdmin');
        spyOn(mockSUtils,'exec');

    });
    
    it('uses soaputils makeAdmin to create admin',function(){
        var args, mockKey = {}, mockCert = {};
        push.createAdmin(mockKey,mockCert);
        args = mockSUtils.makeAdmin.calls[0].args;
        expect(args[0]).toEqual(mockKey);
        expect(args[1]).toEqual(mockCert);
        expect(args[2]).toEqual(push);
        expect(args[3]).toEqual([
            'holdCampaignById',
            'startCampaignById',
            'stopCampaignById'
        ]);
    });

    
    it('createClient', function(){
        var args, key = {}, cert = {};
        push.createClient(key,cert);
        args = mockSUtils.createSoapSSLClient.calls[0].args;
        expect(args[0]).toMatch('/wsdl/WSPushAdmin_v5.wsdl');
        expect(args[1]).toEqual({
            strict : true,
            endpoint :'https://ws.us-ec.adtechus.com/WSPushAdmin_v5/'
        });
        expect(args[2]).toEqual(key);
        expect(args[3]).toEqual(cert);
    });

    it('holdCampaignById', function(){
        push.holdCampaignById(mockClient,1);
        expect(mockSUtils.exec)
            .toHaveBeenCalledWith('holdCampaignById','camId',[mockClient,1]);
    });
    
    it('startCampaignById', function(){
        push.startCampaignById(mockClient,1);
        expect(mockSUtils.exec)
            .toHaveBeenCalledWith('startCampaignById','camId',[mockClient,1]);
    });
    
    it('stopCampaignById', function(){
        push.stopCampaignById(mockClient,1);
        expect(mockSUtils.exec)
            .toHaveBeenCalledWith('stopCampaignById','camId',[mockClient,1]);
    });
    
    
});
