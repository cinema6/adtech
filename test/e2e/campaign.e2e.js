describe('adtech.campaignAdmin',function(){
    var adtech, testId, expectSuccess, expectFailure, resolveSpy, rejectSpy ;
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
        
        adtech.createCampaignAdmin().catch(done).finally(done);
    });

    it('creates an admin', function(){
        expect(adtech.campaignAdmin).not.toBeNull();
    });
    
    it('gets a campaign by id', function(done){
        var campaignId   = 6088191;
        adtech.campaignAdmin.getCampaignById(campaignId)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var campaign = resolveSpy.arg();
            expect(parseInt(campaign.id,10)).toEqual(campaignId);
        })
        .done(done,done);
    });

    it('finds a campaign by name', function(done){
        var aove = new adtech.AOVE();
        aove.addExpression(new adtech.AOVE.StringExpression('name','Z_Dev_E2E'));
        adtech.campaignAdmin.getCampaignList(null,null,aove)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var campaign = resolveSpy.arg();
            expect(campaign.length).toEqual(1);
            expect(campaign[0].name).toEqual('Z_Dev_E2E');
            expect(campaign[0].extId).toEqual('Z_DEV_E2E');
        })
        .done(done,done);
    });

    it('finds many campaigns by name', function(done){
        var aove = new adtech.AOVE();
        aove.addExpression(new adtech.AOVE.StringExpression('name','Ybrant','LIKE'));
        adtech.campaignAdmin.getCampaignList(null,null,aove)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var campaign = resolveSpy.arg();
//            var campaign = resolveSpy.arg().sort(function(a,b){ a.id > b.id; });
            console.log(JSON.stringify(campaign,null,3));
//            expect(campaign.length).toEqual(4);
//            expect(campaign[0].id).toEqual('5846488');
//            expect(campaign[1].id).toEqual('5849126');
//            expect(campaign[2].id).toEqual('5849127');
//            expect(campaign[3].id).toEqual('5849135');
        })
        .done(done,done);
    });

});
