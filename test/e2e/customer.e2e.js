describe('adtech.customerAdmin',function(){
    var adtech, expectSuccess, expectFailure, resolveSpy, rejectSpy, testData, testRun;
    beforeEach(function(done){
        var helpers = require('./helpers');
        resolveSpy    = helpers.setupSpy('resolve');
        rejectSpy     = helpers.setupSpy('reject');
        expectSuccess = helpers.setExpectation('resolve');
        expectFailure = helpers.setExpectation('reject');
        
        if (adtech){
            return done();
        }
        
        adtech       = require('../../index');
        q            = require('q');
        testRun      = 'c6-e2e-' + helpers.uuid() + '-';
        testData     = new helpers.TestData(testRun);
        
        testData.createRecord('Adv1');
        testData.createRecord('Adv2');

        adtech.createCustomerAdmin().catch(done).finally(done,done);
    });

    it('creates an admin', function(){
        expect(adtech.customerAdmin).not.toBeNull();
    });
    
    it('creates advertiser Adv1',function(done){
        var rec = testData.getRecord('Adv1'),
            ad = {
                companyData     : {
                    address : {
                        address1 : '100 Nassau Street',
                        city     : 'Princeton',
                        country  : 'US',
                        zip      : '08540'
                    }
                },
                extId           : rec.extId,
                name            : rec.uname
            };

        adtech.customerAdmin.createAdvertiser(ad)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var result = resolveSpy.arg();
            expect(result.name).toEqual(ad.name);
            expect(result.extId).toEqual(ad.extId);
            testData.set('Adv1',result.id,result);
        })
        .done(done,done);
    });
    
    it('creates advertiser Adv2',function(done){
        var rec = testData.getRecord('Adv2'),
            ad = {
                companyData     : {
                    address : {
                        address1 : '242 Nassau Street',
                        city     : 'Princeton',
                        country  : 'US',
                        zip      : '08542'
                    }
                },
                extId           : rec.extId,
                name            : rec.uname
            };

        adtech.customerAdmin.createAdvertiser(ad)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var result = resolveSpy.arg();
            expect(result.name).toEqual(ad.name);
            expect(result.extId).toEqual(ad.extId);
            testData.set('Adv2',result.id,result);
        })
        .done(done,done);
    });
    
    it('gets an advertiser by extid', function(done){
        var rec = testData.getRecord('Adv1');
        adtech.customerAdmin.getAdvertiserByExtId(rec.extId)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var result = resolveSpy.arg();
            expect(result.name).toEqual(rec.uname);
            expect(result.extId).toEqual(rec.extId);
        })
        .done(done,done);
    });

    it('gets an advertiser by id', function(done){
        var rec = testData.getRecord('Adv1');
        adtech.customerAdmin.getAdvertiserById(rec.id)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var result = resolveSpy.arg();
            expect(result.name).toEqual(rec.uname);
            expect(result.extId).toEqual(rec.extId);
        })
        .done(done,done);
    });
    
    it('gets advertiser list by name', function(done){
        var aove = new adtech.AOVE();
        aove.addExpression(new adtech.AOVE.StringExpression('name','%' + testRun + '%','LIKE'));
        adtech.customerAdmin.getAdvertiserList(null,null,aove)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var ads = resolveSpy.arg();
            expect(ads.length).toEqual(2);
        })
        .done(done,done);
    });

    it('deletes Adv1', function(done){
        var rec = testData.getRecord('Adv1');
        adtech.customerAdmin.deleteAdvertiser(rec.id)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .done(done,done);
    });

    it('deletes Adv2', function(done){
        var rec = testData.getRecord('Adv2');
        adtech.customerAdmin.deleteAdvertiser(rec.id)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .done(done,done);
    });

    it('confirms advertisers are deleted', function(done){
        var aove = new adtech.AOVE();
        aove.addExpression(new adtech.AOVE.StringExpression('name','%' + testRun + '%','LIKE'));
        adtech.customerAdmin.getAdvertiserList(null,null,aove)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var ads = resolveSpy.arg();
            expect(ads.length).toEqual(0);
        })
        .done(done,done);
    });

/*
    it('creates a customer',function(done){
        var customer = {
            extId           : testId,
            name            : 'customer-' + testId
        };

        adtech.customerAdmin.createCustomer(customer)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var result = resolveSpy.arg();
            expect(result.name).toEqual(customer.name);
        })
        .done(done,done);
    });
*/
});

