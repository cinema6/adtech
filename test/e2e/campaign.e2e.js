xdescribe('adtech.campaignAdmin',function(){
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
    
    it('gets the optimzier type list', function(done){
        adtech.campaignAdmin.getOptimizerTypeList()
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var ol = resolveSpy.arg().sort(function(a,b){ return a.id  - b.id; });
            expect(ol[0].id).toEqual(1);
            expect(ol[0].name).toEqual('campaign.optimizertype.classicOpenImp');
            expect(ol[1].id).toEqual(2);
            expect(ol[1].name).toEqual('campaign.optimizertype.averageImp');
            expect(ol[2].id).toEqual(3);
            expect(ol[2].name).toEqual('campaign.optimizertype.weekdayImp');
            expect(ol[3].id).toEqual(4);
            expect(ol[3].name).toEqual('campaign.optimizertype.averageClick');
            expect(ol[4].id).toEqual(5);
            expect(ol[4].name).toEqual('campaign.optimizertype.fastClick');
            expect(ol[5].id).toEqual(6);
            expect(ol[5].name).toEqual('campaign.optimizertype.fastOpenImp');
        })
        .done(done,done);
    });

    it('gets the campaign type list', function(done){
        adtech.campaignAdmin.getCampaignTypeList()
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var ol = resolveSpy.arg().sort(function(a,b){ return a.name  > b.name; });
            expect(ol[0].name).toEqual('campaign.option.clickcommandCampaign');
            expect(ol[1].name).toEqual('campaign.option.forecastCampaign');
            expect(ol[2].name).toEqual('campaign.option.guaranteedCampaign');
            expect(ol[3].name).toEqual('campaign.option.guaranteedCampaign');
            expect(ol[4].name).toEqual('campaign.option.houseCampaign');
            expect(ol[5].name).toEqual('campaign.option.masterCampaign');
            expect(ol[6].name).toEqual('campaign.option.openCampaign');
            expect(ol[7].name).toEqual('campaign.option.openCampaign');
            expect(ol[8].name).toEqual('campaign.option.standaloneCampaign');
        })
        .done(done,done);
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
        aove.addExpression(new adtech.AOVE.IntExpression('statusTypeId',20,'!='));
        adtech.campaignAdmin.getCampaignList(null,null,aove)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var campaign = resolveSpy.arg().sort(function(a,b){ return a.id - b.id; });
//            console.log(JSON.stringify(campaign,null,3));
            expect(campaign.length).toEqual(4);
            expect(campaign[0].id).toEqual(5846488);
            expect(campaign[1].id).toEqual(5849126);
            expect(campaign[2].id).toEqual(5849127);
            expect(campaign[3].id).toEqual(5849135);
        })
        .done(done,done);
    });

});
