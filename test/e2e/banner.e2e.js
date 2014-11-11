xdescribe('adtech.bannerAdmin',function(){
    var adtech, testId, expectSuccess, expectFailure, resolveSpy, rejectSpy,
        IBanner, IFreq, campaignId, scriptTag;
    beforeEach(function(done){
        var helpers = require('./helpers');
        resolveSpy    = helpers.setupSpy('resolve');
        rejectSpy     = helpers.setupSpy('reject');
        expectSuccess = helpers.setExpectation('resolve');
        expectFailure = helpers.setExpectation('reject',true);
        
        if (adtech){ return done(); }

        adtech       = require('../../index');
        q            = require('q');
        testId       = 'c6-e2e-' + helpers.uuid();
        
        IBanner      = adtech.constants.IBanner;
        IFreq        = adtech.constants.IFrequencyInformation;

        campaignId   = 6088191;
        scriptTag = new Buffer(
            "<script type=\"text/javascript\">window.c6.addReel('_ADBNEXTID_','_ADCUID_','_ADCLICK_','_ADADID_' );</script>"
        );
        adtech.createBannerAdmin()
        .then(function(){
            return adtech.createCampaignAdmin();          
        })
        .catch(done)
        .finally(done);
    });

    it('creates an admin', function(){
        expect(adtech.bannerAdmin).not.toBeNull();
    });

    it('creates a banner', function(done){

        var banner = {
            data            : scriptTag.toString('base64'),
            description     : 'test banner 1',
            extId           : testId + '_banner1',
            fileType        : 'html',
            id              : -1,
            mainFileName    : 'index.html',
            name            : 'banner1',
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
                frequencyTypeId      : IFreq.FREQUENCY_5_MINUTES
            },
            name                    : banner.name,
            statusId                : banner.statusId
        };

        adtech.bannerAdmin.createBanner(campaignId,banner,bannerInfo)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var testBanner = resolveSpy.arg();
            expect(testBanner.name).toEqual('banner1');
            expect(testBanner.extId).toEqual(testId + '_banner1');
        })
        .done(done,done);
    });

    it('gets banners for campaign', function(done){
        adtech.campaignAdmin.getCampaignById(campaignId)
        .then(function(campaign){
            var aove = new adtech.AOVE(),
                campaignVersion = campaign.bannerTimeRangeList.Items.Item.campaignVersion;
            console.log('CAMP version:',campaignVersion);
            aove.addExpression(new adtech.AOVE.LongExpression('campaignId',campaignId));
            aove.addExpression(new adtech.AOVE.IntExpression('campaignVersion',campaignVersion));
            return adtech.bannerAdmin.getBannerList(null,null,aove)
        })
        .then(resolveSpy,rejectSpy)
        .then(expectFailure)
//        .then(function(){
//            var banners = resolveSpy.arg();
//            console.log(JSON.stringify(banners,null,3));
//            //expect(banners.length).toEqual(1);
//            //expect(banners[0].name).toEqual('banner1');
//            //expect(banners[0].extId).toEqual(testId + '_banner1');
//        })
        .done(done,done);
    });

});
