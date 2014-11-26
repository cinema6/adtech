describe('adtech.index',function(){
    var adtech, expectSuccess, expectFailure, resolveSpy, rejectSpy,
        testData, testRun, companyData, kCamp ;
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
        testData.createRecord('Cust1');
        testData.createRecord('Site1');
        testData.createRecord('Page1');
        testData.createRecord('Plc1');
        testData.createRecord('Camp1');
        testData.createRecord('adGoalType');
        testData.createRecord('campaignType');
        testData.createRecord('optimizerType');
        companyData     = {
            address : {
                address1 : '100 Nassau Street',
                city     : 'Princeton',
                country  : 'US',
                zip      : '08540'
            },
            url : 'http://www.cinema6.com'
        };
        kCamp = adtech.constants.ICampaign;

        adtech.createClient().catch(done).finally(done,done);
    });
    
    it('creates admins', function(){
        expect(adtech.customerAdmin).not.toBeNull();
        expect(adtech.bannerAdmin).not.toBeNull();
        expect(adtech.campaignAdmin).not.toBeNull();
        expect(adtech.customerAdmin).not.toBeNull();
        expect(adtech.websiteAdmin).not.toBeNull();
    });

    it('gets AdGoalType', function(done){
        var aove = new adtech.AOVE();
        aove.addExpression(
            new adtech.AOVE.StringExpression('name',kCamp.ADGOAL_TYPE_STD_OPEN)
        );
           
        adtech.campaignAdmin.getAdGoalTypeList(null,null,aove)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var result = resolveSpy.arg();
            testData.set('adGoalType',result[0].id,result[0]);
        })
        .done(done,done);
    });

    it('gets CampaignType', function(done){
        var aove = new adtech.AOVE();

        aove.addExpression(
            new adtech.AOVE.StringExpression('name',kCamp.CAMPAIGN_TYPE_OPEN)
        );
        aove.addExpression(
            new adtech.AOVE.IntExpression('mediaTypeId',kCamp.MEDIA_TYPE_DISPLAY)
        );
           
        adtech.campaignAdmin.getCampaignTypeList(null,null,aove)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var result = resolveSpy.arg();
            testData.set('campaignType',result[0].id,result[0]);
        })
        .done(done,done);
    });
    
    it('gets OptimizerType', function(done){
        var aove = new adtech.AOVE();
        aove.addExpression(
            new adtech.AOVE.StringExpression('name',kCamp.OPTIMIZER_TYPE_FAST_OPEN_IMP)
        );
           
        adtech.campaignAdmin.getOptimizerTypeList(null,null,aove)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var result = resolveSpy.arg();
            testData.set('optimizerType',result[0].id,result[0]);
        })
        .done(done,done);
    });

    it('creates Adv1',function(done){
        var rec = testData.getRecord('Adv1'),
            ad = {
                companyData     : companyData,
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
    
    it('creates Cust1',function(done){
        var rec = testData.getRecord('Cust1'),
            adv1 = testData.getRecord('Adv1'),
            customer = {
                advertiser : adtech.customerAdmin.makeAdvertiserList([
                    { id : adv1.data.id }
                ]),
                companyData     : companyData,
                extId           : rec.extId,
                name            : rec.uname
            };
        adtech.customerAdmin.createCustomer(customer)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var result = resolveSpy.arg();
            testData.set('Cust1',result.id,result);
            expect(result.name).toEqual(customer.name);
            expect(result.advertiser.length).toEqual(1);
        })
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
    
    it('creates Page1 for Site1', function(done){
        var siteRec = testData.getRecord('Site1'),
            pageRec = testData.getRecord('Page1'),
            page = {
                extId : pageRec.extId,
                name  : pageRec.uname,
                websiteId : siteRec.id
            };
        adtech.websiteAdmin.createPage(page)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var result = resolveSpy.arg();
            expect(result.name).toEqual(page.name);
            expect(result.extId).toEqual(page.extId);
            testData.set('Page1',result.id,result);
        })
        .done(done,done);
    });
    
    it('creates Plc1 for Page1 of Site1', function(done){
        var siteRec = testData.getRecord('Site1'),
            pageRec = testData.getRecord('Page1'),
            plcRec  = testData.getRecord('Plc1'),
            plc = {
                extId  : plcRec.extId,
                name   : plcRec.uname,
                pageId : pageRec.id,
                websiteId : siteRec.id
            };
        adtech.websiteAdmin.createPlacement(plc)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var result = resolveSpy.arg();
            expect(result.name).toEqual(plc.name);
            expect(result.extId).toEqual(plc.extId);
            testData.set('Plc1',result.id,result);
        })
        .done(done,done);
    });

    it('creates Camp1', function(done){
        var custRec = testData.getRecord('Cust1'),
            advRec  = testData.getRecord('Adv1'),
            campRec = testData.getRecord('Camp1'),
            adGoalTypeRec = testData.getRecord('adGoalType'),
            cmpTypeRec = testData.getRecord('campaignType'),
            optTypeRec = testData.getRecord('optimizerType'),
            dtStart = new Date(),
            dtEnd = new Date(dtStart.valueOf() + (60 * 60 * 24 * 365 * 1000));
            campaign = {
                adGoalTypeId    : adGoalTypeRec.id,
                advertiserId    : advRec.id,
                campaignTypeId  : cmpTypeRec.id,
                customerId      : custRec.id,
                dateRangeList   : adtech.campaignAdmin.makeDateRangeList([{
                    endDate: dtEnd.toISOString(),
                    startDate: dtStart.toISOString()
                }]),
                extId           : campRec.extId,
                frequencyConfig : {
                   type: kCamp.FREQUENCY_TYPE_NONE
                },
                name            : campRec.uname,
                optimizerTypeId : optTypeRec.id,
                optimizingConfig: {
                    minClickRate: 0,
                    minNoPlacements: 0
                },
                pricingConfig :  {
                    cpm: 0
                }
            };
        
        adtech.campaignAdmin.createCampaign(campaign)
        .then(resolveSpy,rejectSpy)
//        .then(expectFailure)
        .then(function(){
            var result = resolveSpy.arg();
            expect(result.name).toEqual(campaign.name);
            expect(result.extId).toEqual(campaign.extId);
            testData.set('Camp1',result.id,result);
        })
        .done(done,done);
    });
    
//    it('deletes Adv1', function(done){
//        var rec = testData.getRecord('Adv1');
//        adtech.customerAdmin.deleteAdvertiser(rec.id)
//        .then(resolveSpy,rejectSpy)
//        .then(expectSuccess)
//        .done(done,done);
//    });
//    
//    it('deletes Site1', function(done){
//        var rec = testData.getRecord('Site1');
//        adtech.websiteAdmin.deleteWebsite(rec.id)
//        .then(resolveSpy,rejectSpy)
//        .then(expectSuccess)
//        .done(done,done);
//    });
    
});

