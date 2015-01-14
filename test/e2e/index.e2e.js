describe('adtech.index',function(){
    var adtech, q, expectSuccess, expectFailure, resolveSpy, rejectSpy,
        testData, testRun, companyData, kCamp;

    function checkForCampaignStatus(campaignId,desiredStatus,attempts) {
        var lastStatus = null;
        if (!attempts){
            attempts = 5;
        }
        return (function getStatus(){
            if (attempts-- < 1){
                return q.reject('Expected status ',desiredStatus,' got ',lastStatus );
            }

            return adtech.campaignAdmin.getCampaignStatusValues([campaignId])
                .then(function(result){
                    lastStatus = result[campaignId];
                    if (lastStatus == desiredStatus) {
                        return q(result[campaignId]);
                    } else {
                        return q.delay(3000).then(getStatus);
                    }
                });
        }());
    }

    beforeEach(function(done){
        var helpers = require('./helpers');
        resolveSpy    = helpers.setupSpy('resolve');
        rejectSpy     = helpers.setupSpy('reject');
        expectSuccess = helpers.setExpectation('resolve');
        expectFailure = helpers.setExpectation('reject',true);

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        jasmine.getEnv().defaultTimeoutInterval = 30000;
        if (adtech){
            return done();
        }
        
        adtech       = require('../../index');
        q            = require('q');
        testRun      = 'c6-e2e-' + helpers.uuid() + '-';
        testData     = new helpers.TestData(testRun);
        testData.createRecord('Adv1');
        testData.createRecord('Bann1');
        testData.createRecord('Cust1');
        testData.createRecord('Site1');
        testData.createRecord('Page1');
        testData.createRecord('Plc1');
        testData.createRecord('Camp1');
        testData.createRecord('Camp2');
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
            plcRec  = testData.getRecord('Plc1'),
            adGoalTypeRec = testData.getRecord('adGoalType'),
            cmpTypeRec = testData.getRecord('campaignType'),
            optTypeRec = testData.getRecord('optimizerType'),
            dtStart = new Date(),
            dtEnd = new Date(dtStart.valueOf() + (60 * 60 * 24 * 365 * 1000));
            campaign = {
                adGoalTypeId    : adGoalTypeRec.id,
                advertiserId    : advRec.id,
                campaignFeatures  : adtech.campaignAdmin.makeCampaignFeatures({
                    keywordLevel : true,
                    placements   : true,
                    volume       : true
                }),
                campaignTypeId  : cmpTypeRec.id,
                customerId      : custRec.id,
                dateRangeList   : adtech.campaignAdmin.makeDateRangeList([{
                    deliveryGoal : {
                        desiredImpressions : 999999999
                    },
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
                placementIdList : adtech.campaignAdmin.makePlacementIdList([plcRec.id]),
                pricingConfig :  {
                    cpm: 0
                }
            };
//        console.log('CREATE:',require('util').inspect(campaign,{ depth: 99}));
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

    it('creates Camp2', function(done){
        var custRec = testData.getRecord('Cust1'),
            advRec  = testData.getRecord('Adv1'),
            campRec = testData.getRecord('Camp2'),
            plcRec  = testData.getRecord('Plc1'),
            adGoalTypeRec = testData.getRecord('adGoalType'),
            cmpTypeRec = testData.getRecord('campaignType'),
            optTypeRec = testData.getRecord('optimizerType'),
            dtStart = new Date(),
            dtEnd = new Date(dtStart.valueOf() + (60 * 60 * 24 * 365 * 1000));
            campaign = {
                adGoalTypeId    : adGoalTypeRec.id,
                advertiserId    : advRec.id,
                campaignFeatures  : {
                    keywordLevel    : { locked: false, shared: false, visible: true },
                    placements      : { locked: false, shared: false, visible: true },
                    volume          : { locked: false, shared: false, visible: true }
                },
                campaignTypeId  : cmpTypeRec.id,
                customerId      : custRec.id,
                dateRangeList   : [{
                    deliveryGoal : {
                        desiredImpressions : 999999999
                    },
                    endDate: dtEnd,
                    startDate: dtStart
                }],
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
                placementIdList : [plcRec.id],
                pricingConfig :  {
                    cpm: 0
                }
            };
//        console.log('CREATE:',require('util').inspect(campaign,{ depth: 99}));
        adtech.campaignAdmin.createCampaign(campaign)
        .then(resolveSpy,rejectSpy)
//        .then(expectFailure)
        .then(function(){
            var result = resolveSpy.arg();
            expect(result.name).toEqual(campaign.name);
            expect(result.extId).toEqual(campaign.extId);
            testData.set('Camp2',result.id,result);
        })
        .done(done,done);
    });


    it('creates Bann1', function(done){
        var campRec = testData.getRecord('Camp1'),
            bannRec = testData.getRecord('Bann1'),
            IBanner = adtech.constants.IBanner,
            IFrequencyInformation = adtech.constants.IFrequencyInformation,
            scriptTag = new Buffer("<script type=\"text/javascript\">window.c6.addReel('_ADBNEXTID_','_ADCUID_','_ADCLICK_','_ADADID_' );</script>");

        var banner = {
            data            : scriptTag.toString('base64'),
            description     : '',
            extId           : bannRec.extId,
            fileType        : 'html',
            id              : -1,
            mainFileName    : 'index.html',
            name            : bannRec.uname,
            originalData    : scriptTag.toString('base64'),
            sizeTypeId      : 16,
            statusId        : IBanner.STATUS_ACTIVE,
            styleTypeId     : IBanner.STYLE_HTML
        };

        var bannerInfo = {
            bannerReferenceId       : banner.id,
            entityFrequencyConfig   : {
                frequencyCookiesOnly : true,
                frequencyDistributed : true,
                frequencyInterval    : 30,
                frequencyTypeId      : IFrequencyInformation.FREQUENCY_5_MINUTES
            },
            name                    : banner.name,
            statusId                : banner.statusId
        };

        adtech.bannerAdmin.createBanner(campRec.id,banner,bannerInfo)
        .then(resolveSpy,rejectSpy)
//        .then(expectFailure)
        .then(function(){
            var result = resolveSpy.arg();
            expect(result.name).toEqual(banner.name);
            expect(result.extId).toEqual(banner.extId);
            testData.set('Bann1',result.id,result);
        })
        .done(done,done);
    });

    it('starts Camp1',function(done){
        var campRec = testData.getRecord('Camp1');
        adtech.pushAdmin.startCampaignById(campRec.id)
        .then(resolveSpy,rejectSpy)
        .then(function(){
            var result = resolveSpy.arg();
            expect(result.campaignId).toEqual(campRec.id);
            expect(result.errorId).toEqual(0);
            expect(result.errorMsg).toEqual('');
            resolveSpy.reset();
            rejectSpy.reset();
            return checkForCampaignStatus(campRec.id,kCamp.STATUS_ACTIVE);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .done(done,done);
    });

    it('stops Camp1', function(done){
        var campRec = testData.getRecord('Camp1');
        adtech.pushAdmin.stopCampaignById(campRec.id)
        .then(resolveSpy,rejectSpy)
        .then(function(){
            expect(resolveSpy.arg()).toEqual(true);
            resolveSpy.reset();
            rejectSpy.reset();
            return checkForCampaignStatus(campRec.id,kCamp.STATUS_EXPIRED);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .done(done,done);
    });

    it('deletes Everything', function(done){
        var deleteCampaign1 = function(){
                var rec = testData.getRecord('Camp1');
                return adtech.campaignAdmin.deleteCampaign(rec.id);
            },
            deleteCampaign2 = function(){
                var rec = testData.getRecord('Camp2');
                return adtech.campaignAdmin.deleteCampaign(rec.id);
            },
            deleteAdvertiser = function(){
                var rec = testData.getRecord('Adv1');
                return adtech.customerAdmin.deleteAdvertiser(rec.id);
            },
            deleteCustomer = function(){
                var rec = testData.getRecord('Cust1');
                return adtech.customerAdmin.deleteCustomer(rec.id);
            },
            deleteWebsite = function(){
                var rec = testData.getRecord('Site1');
                return adtech.websiteAdmin.deleteWebsite(rec.id);
            };

        deleteCampaign1()
        .then(deleteCampaign2)
        .then(deleteAdvertiser)
        .then(deleteCustomer)
        .then(deleteWebsite)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .done(done,done);
    });
});

