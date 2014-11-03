xdescribe('customer',function(){
    var flush = true, q, customer, mockSUtils, resolveSpy, rejectSpy, mockClient;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        customer     = require('../../lib/customer');
        mockSUtils   = require('../../lib/soaputils');
        q            = require('q');
        resolveSpy   = jasmine.createSpy('resolve');
        rejectSpy    = jasmine.createSpy('reject');
        
        mockClient = {
        };

    });
});
