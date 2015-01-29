describe('index',function(){
    var once = true, index, banner, campaign, customer, push, website,
        admin, q, resolveSpy, rejectSpy;
    beforeEach(function(){
        if (once) { 
            for (var m in require.cache){ delete require.cache[m]; }
            banner      = require('../../lib/banner');
            campaign    = require('../../lib/campaign');
            customer    = require('../../lib/customer');
            keyword     = require('../../lib/keyword');
            push        = require('../../lib/push');
            report      = require('../../lib/report');
            website     = require('../../lib/website');
            constants   = require('../../lib/constants');
            q           = require('q');
            admin       = {},
            spyOn(banner,'createAdmin').andReturn(q(admin));
            spyOn(campaign,'createAdmin').andReturn(q(admin));
            spyOn(customer,'createAdmin').andReturn(q(admin));
            spyOn(keyword,'createAdmin').andReturn(q(admin));
            spyOn(push,'createAdmin').andReturn(q(admin));
            spyOn(report,'createAdmin').andReturn(q(admin));
            spyOn(website,'createAdmin').andReturn(q(admin));
            index   = require('../../index.js');
        }
        resolveSpy   = jasmine.createSpy('resolve');
        rejectSpy    = jasmine.createSpy('reject');
    });

    describe('create_xxx_Admin',function(){
        it('createBannerAdmin is proxied',function(done){
            index.createBannerAdmin()
            .then(resolveSpy,rejectSpy)
            .then(function(){
                expect(resolveSpy).toHaveBeenCalled();
                expect(banner.createAdmin).toHaveBeenCalled();
                expect(index.bannerAdmin).toBe(admin);
            })
            .done(done);
        });
        
        it('createCampaignAdmin is proxied',function(done){
            index.createCampaignAdmin()
            .then(resolveSpy,rejectSpy)
            .then(function(){
                expect(resolveSpy).toHaveBeenCalled();
                expect(campaign.createAdmin).toHaveBeenCalled();
                expect(index.campaignAdmin).toBe(admin);
            })
            .done(done);
        });
        
        it('createCustomerAdmin is proxied',function(done){
            index.createCustomerAdmin()
            .then(resolveSpy,rejectSpy)
            .then(function(){
                expect(resolveSpy).toHaveBeenCalled();
                expect(customer.createAdmin).toHaveBeenCalled();
                expect(index.customerAdmin).toBe(admin);
            })
            .done(done);
        });

        it('createKeywordAdmin is proxied',function(done){
            index.createKeywordAdmin()
            .then(resolveSpy,rejectSpy)
            .then(function(){
                expect(resolveSpy).toHaveBeenCalled();
                expect(keyword.createAdmin).toHaveBeenCalled();
                expect(index.keywordAdmin).toBe(admin);
            })
            .done(done);
        });
        
        it('createPushAdmin is proxied',function(done){
            index.createPushAdmin()
            .then(resolveSpy,rejectSpy)
            .then(function(){
                expect(resolveSpy).toHaveBeenCalled();
                expect(push.createAdmin).toHaveBeenCalled();
                expect(index.pushAdmin).toBe(admin);
            })
            .done(done);
        });
        
        it('createReportAdmin is proxied',function(done){
            index.createReportAdmin()
            .then(resolveSpy,rejectSpy)
            .then(function(){
                expect(resolveSpy).toHaveBeenCalled();
                expect(report.createAdmin).toHaveBeenCalled();
                expect(index.reportAdmin).toBe(admin);
            })
            .done(done);
        });
        
        
        it('createWebsiteAdmin is proxied',function(done){
            index.createWebsiteAdmin()
            .then(resolveSpy,rejectSpy)
            .then(function(){
                expect(resolveSpy).toHaveBeenCalled();
                expect(website.createAdmin).toHaveBeenCalled();
                expect(index.websiteAdmin).toBe(admin);
            })
            .done(done);
        });
    });

    describe('createClient',function(){
        it('creates all admins',function(done){
            index.createClient()
            .then(resolveSpy,rejectSpy)
            .then(function(){
                expect(resolveSpy).toHaveBeenCalled();
                expect(banner.createAdmin).toHaveBeenCalled();
                expect(campaign.createAdmin).toHaveBeenCalled();
                expect(customer.createAdmin).toHaveBeenCalled();
                expect(keyword.createAdmin).toHaveBeenCalled();
                expect(push.createAdmin).toHaveBeenCalled();
                expect(website.createAdmin).toHaveBeenCalled();
                expect(index.bannerAdmin).toBe(admin);
                expect(index.campaignAdmin).toBe(admin);
                expect(index.customerAdmin).toBe(admin);
                expect(index.pushAdmin).toBe(admin);
                expect(index.websiteAdmin).toBe(admin);
            })
            .done(done);
        });
        
        it('should be able to pass custom key and cert paths to each function', function(done) {
            index.createClient('/key/path', '/cert/path')
            .then(resolveSpy,rejectSpy)
            .then(function(){
                expect(resolveSpy).toHaveBeenCalled();
                expect(banner.createAdmin).toHaveBeenCalledWith('/key/path', '/cert/path');
                expect(campaign.createAdmin).toHaveBeenCalledWith('/key/path', '/cert/path');
                expect(customer.createAdmin).toHaveBeenCalledWith('/key/path', '/cert/path');
                expect(keyword.createAdmin).toHaveBeenCalledWith('/key/path', '/cert/path');
                expect(push.createAdmin).toHaveBeenCalledWith('/key/path', '/cert/path');
                expect(website.createAdmin).toHaveBeenCalledWith('/key/path', '/cert/path');
                expect(index.bannerAdmin).toBe(admin);
                expect(index.campaignAdmin).toBe(admin);
                expect(index.customerAdmin).toBe(admin);
                expect(index.pushAdmin).toBe(admin);
                expect(index.websiteAdmin).toBe(admin);
            })
            .done(done);
        });
    });

    describe('types',function(){
        it('AOVE',function(){
            expect(index.AOVE).toBeDefined();
        });
    });

    describe('constants', function(){
        it('proxy banner constants',function(){
            expect(index.constants).toBeDefined();
            expect(index.constants).toEqual(constants);
        });

    });
});
