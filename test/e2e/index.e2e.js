describe('adtech.index',function(){
    var adtech, expectSuccess, expectFailure, resolveSpy, rejectSpy,
        testData, testRun, compData;
    beforeEach(function(done){
        var helpers = require('./helpers');
        resolveSpy    = helpers.setupSpy('resolve');
        rejectSpy     = helpers.setupSpy('reject');
        expectSuccess = helpers.setExpectation('resolve');
        expectFailure = helpers.setExpectation('reject',true);
        
        if (adtech){
            return done();
        }
        
        adtech       = require('../../index');
        q            = require('q');
        testRun      = 'c6-e2e-' + helpers.uuid() + '-';
        testData     = new helpers.TestData(testRun);
        testData.createRecord('Adv1');
        testData.createRecord('Site1');

        adtech.createClient().catch(done).finally(done,done);
    });
    
    it('creates admins', function(){
        expect(adtech.customerAdmin).not.toBeNull();
        expect(adtech.bannerAdmin).not.toBeNull();
        expect(adtech.campaignAdmin).not.toBeNull();
        expect(adtech.customerAdmin).not.toBeNull();
        expect(adtech.websiteAdmin).not.toBeNull();
    });
    
    it('creates advertiser Adv1',function(done){
        var rec = testData.getRecord('Adv1'),
            ad = {
                companyData     : { url : "http://www.cinema6.com" },
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
    
    it('deletes Adv1', function(done){
        var rec = testData.getRecord('Adv1');
        adtech.customerAdmin.deleteAdvertiser(rec.id)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .done(done,done);
    });
    
    it('creates Site1', function(done){
        var rec = testData.getRecord('Site1'),
            website = {
                URL             : 'http://www.cinema6-e2e-test.com',
                extId           : rec.extId,
                name            : rec.uname
            };

        adtech.websiteAdmin.createWebsite(website)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var result = resolveSpy.arg();
            expect(result.name).toEqual(website.name);
            expect(result.extId).toEqual(website.extId);
            testData.set('Site1',result.id,result);
        })
        .done(done,done);
    });
    
    it('deletes Site1', function(done){
        var rec = testData.getRecord('Site1');
        adtech.websiteAdmin.deleteWebsite(rec.id)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .done(done,done);
    });
    
});

