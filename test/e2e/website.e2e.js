xdescribe('adtech.websiteAdmin',function(){
    var adtech, testId, expectSuccess, expectFailure, resolveSpy, rejectSpy;
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
        testId       = 'c6-e2e-' + helpers.uuid();
        adtech.createWebsiteAdmin().catch(done).finally(done,done);
    });

    it('creates an admin', function(){
        expect(adtech.websiteAdmin).not.toBeNull();
    });

    it('creates a website on ADTECH', function(done){
        var website = {
            URL             : 'http://www.cinema6-e2e-test.com',
            extId           : testId,
            name            : testId
        };

        adtech.websiteAdmin.createWebsite(website)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var testSite = resolveSpy.arg();
            expect(testSite.name).toEqual(testId);
        })
        .done(done,done);
    });
    
    it('gets a website by ExtId', function(done){
        adtech.websiteAdmin.getWebsiteByExtId(testId)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var site = resolveSpy.arg();
            expect(site.name).toEqual(testId);
            expect(site.extId).toEqual(testId);
            expect(site.URL).toEqual('http://www.cinema6-e2e-test.com');
        })
        .done(done,done);
    });

    it('gets a website by id', function(done){
        adtech.websiteAdmin.getWebsiteByExtId(testId)
        .then(function(site){
            return adtech.websiteAdmin.getWebsiteById(site.id);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var site = resolveSpy.arg();
            expect(site.name).toEqual(testId);
            expect(site.extId).toEqual(testId);
            expect(site.URL).toEqual('http://www.cinema6-e2e-test.com');
        })
        .done(done,done);
    });

    it('finds a website by name', function(done){
        var aove = new adtech.AOVE();
        aove.addExpression(new adtech.AOVE.StringExpression('name',testId));
        adtech.websiteAdmin.getWebsiteList(null,null,aove)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var sites = resolveSpy.arg();
            expect(sites.length).toEqual(1);
            expect(sites[0].name).toEqual(testId);
            expect(sites[0].extId).toEqual(testId);
            expect(sites[0].URL).toEqual('http://www.cinema6-e2e-test.com');
        })
        .done(done,done);
    });

    it('updates a website', function(done){
        var aove = new adtech.AOVE();
        aove.addExpression(new adtech.AOVE.StringExpression('extId',testId));
        adtech.websiteAdmin.getWebsiteList(null,null,aove)
        .then(function(siteList){
            var update = {
                id : siteList[0].id,
                name : siteList[0].name + '_updated'
            };
            return adtech.websiteAdmin.updateWebsite(update);            
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var site = resolveSpy.arg();
            expect(site.name).toEqual(testId + '_updated');
            expect(site.extId).toEqual(testId);
            expect(site.URL).toEqual('http://www.cinema6-e2e-test.com');
        })
        .done(done,done);
    });

    it('creates a page for a website', function(done){
        var aove = new adtech.AOVE();
        aove.addExpression(new adtech.AOVE.StringExpression('extId',testId));
        adtech.websiteAdmin.getWebsiteList(null,null,aove)
        .then(function(siteList){
            var page = {
                extId : testId + '_page1',
                name  : 'testPage1',
                websiteId : siteList[0].id
            };
            return adtech.websiteAdmin.createPage(page);            
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .done(done,done);
    });

    it('gets a page by ExtId', function(done){
        adtech.websiteAdmin.getPageByExtId(testId + '_page1')
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var page = resolveSpy.arg();
            expect(page.name).toEqual('testPage1');
            expect(page.extId).toEqual(testId + '_page1');
        })
        .done(done,done);
    });

    it('gets a page by id', function(done){
        adtech.websiteAdmin.getPageByExtId(testId + '_page1')
        .then(function(page){
            return adtech.websiteAdmin.getPageById(page.id);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var page = resolveSpy.arg();
            expect(page.name).toEqual('testPage1');
            expect(page.extId).toEqual(testId + '_page1');
        })
        .done(done,done);
    });

    it('gets a pageList for a website - extId LIKE testId', function(done){
        var pages = [],hPage;
        hPage = function(page){
            pages.push(page);
            return adtech.websiteAdmin.createPage( {
                extId : testId + '_page' + (pages.length + 1),
                name  : 'testPage' + (pages.length + 1),
                websiteId : page.websiteId
            });
        }
        adtech.websiteAdmin.getPageByExtId(testId + '_page1')
        .then(hPage)
        .then(hPage)
        .then(function(page){
            pages.push(page);
            var aove = new adtech.AOVE();
            aove.addExpression(new adtech.AOVE.StringExpression('extId',testId,'LIKE'));
            return adtech.websiteAdmin.getPageList(null,null,aove);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var pages = resolveSpy.arg();
            expect(pages.length).toEqual(3);
        })
        .done(done,done);
    });
    
    it('gets a pageList for a website - websiteId == id', function(done){
        adtech.websiteAdmin.getPageByExtId(testId + '_page1')
        .then(function(page){
            var aove = new adtech.AOVE();
            aove.addExpression(new adtech.AOVE.LongExpression('websiteId',page.websiteId));
            return adtech.websiteAdmin.getPageList(null,null,aove);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var pages = resolveSpy.arg();
            expect(pages.length).toEqual(3);
        })
        .done(done,done);
    });
    
    it('updates a page', function(done){
        adtech.websiteAdmin.getPageByExtId(testId + '_page2')
        .then(function(page){
            var update = {
                extId       : page.extId + '_updated',
                id          : page.id,
                websiteId   : page.websiteId
            };
            return adtech.websiteAdmin.updatePage(update);            
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var page = resolveSpy.arg();
            expect(page.extId).toEqual(testId + '_page2_updated');
        })
        .done(done,done);
    });


    it('deletes a page', function(done){
        adtech.websiteAdmin.getPageByExtId(testId + '_page2_updated')
        .then(function(page){
            return adtech.websiteAdmin.deletePage(page.id);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var aove = new adtech.AOVE();
            aove.addExpression(new adtech.AOVE.StringExpression('extId',testId,'LIKE'));
            return adtech.websiteAdmin.getPageList(null,null,aove);
        })
        .then(function(pageList){
            expect(pageList.length).toEqual(2);
            pageList = pageList.sort(function(a,b){
                return a.extId > b.extId;
            });
            expect(pageList[0].extId).toEqual(testId + '_page1');
            expect(pageList[1].extId).toEqual(testId + '_page3');
        })
        .done(done,done);
    });

    it('creates a placement', function(done){
        adtech.websiteAdmin.getPageByExtId(testId + '_page1')
        .then(function(page){
            var plc = {
                extId : testId + 'page1_place1',
                name : 'page1_place1',
                pageId : page.id,
                websiteId : page.websiteId
            };
            return adtech.websiteAdmin.createPlacement(plc);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var plc = resolveSpy.arg();
            expect(plc.name).toEqual('page1_place1');
        })
        .done(done,done);
    });

    it('gets a placement by extId', function(done){
        adtech.websiteAdmin.getPlacementByExtId(testId + 'page1_place1')
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var plc = resolveSpy.arg();
            expect(plc.name).toEqual('page1_place1');
        })
        .done(done,done);
    });

    it('gets a placement by id', function(done){
        adtech.websiteAdmin.getPlacementByExtId(testId + 'page1_place1')
        .then(function(plc){
            return adtech.websiteAdmin.getPlacementById(plc.id);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var plc = resolveSpy.arg();
            expect(plc.name).toEqual('page1_place1');
        })
        .done(done,done);
    });

    it('gets placements by page', function(done){
        var pageId;
        adtech.websiteAdmin.getPageByExtId(testId + '_page3')
        .then(function(page){
            pageId = page.id;
            var i = 0, plcs = [];
            for (i = 1; i <= 3; i++){
                plcs.push({
                    extId       : testId + 'page3_place' + i,
                    name        : 'page3_place' + i,
                    pageId      : page.id,
                    websiteId   : page.websiteId
                });
            }
            return plcs;
        })
        .then(function createPlacement(plcs){
            var pl = plcs.shift();
            if (!pl){
                return true;
            }

            return adtech.websiteAdmin.createPlacement(pl)
                .then(function(){ return createPlacement(plcs); });
        })
        .then(function(){
            var aove = new adtech.AOVE();
            aove.addExpression(new adtech.AOVE.LongExpression('pageId',pageId));
            return adtech.websiteAdmin.getPlacementList(null,null,aove);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var plc = resolveSpy.arg();
            plc = plc.sort(function(a,b){ return a.extId > b.extId; });
            expect(plc.length).toEqual(3);
            expect(plc[0].name).toEqual('page3_place1');
            expect(plc[1].name).toEqual('page3_place2');
            expect(plc[2].name).toEqual('page3_place3');
        })
        .done(done,done);
    });
/* 
 * These work, but including them seems to interfer with how
 * adtech handles the subsequent deletion of the test site.
 *
    it('updates a placement', function(done){
        adtech.websiteAdmin.getPlacementByExtId(testId + 'page1_place1')
        .then(function(plc){
            var update = {
                id        : plc.id,
                name      : 'page1_place1_updated',
                pageId    : plc.pageId,
                websiteId : plc.websiteId
            }
            return adtech.websiteAdmin.updatePlacement(update);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            return adtech.websiteAdmin.getPlacementByExtId(testId + 'page1_place1');
        })
        .then(function(plc){
            expect(plc.name).toEqual('page1_place1_updated');
        })
        .done(done,done);
    });
 
    it('deletes a placement', function(done){
        var siteId;
        adtech.websiteAdmin.getPlacementByExtId(testId + 'page3_place2')
        .then(function(plc){
            siteId = plc.websiteId;
            return adtech.websiteAdmin.deletePlacement(plc.id);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var aove = new adtech.AOVE();
            aove.addExpression(new adtech.AOVE.LongExpression('websiteId',siteId));
            return adtech.websiteAdmin.getPlacementList(null,null,aove);
        })
        .then(function(plc){
            plc = plc.sort(function(a,b){ return a.extId > b.extId; });
            expect(plc.length).toEqual(3);
            expect(plc[0].name).toEqual('page1_place1_updated');
            expect(plc[1].name).toEqual('page3_place1');
            expect(plc[2].name).toEqual('page3_place3');
        })
        .done(done,done);
    });
*/
    it('deletes a website',function(done){
        adtech.websiteAdmin.getWebsiteByExtId(testId)
//        .delay(61000)
        .then(function(site){
            return adtech.websiteAdmin.deleteWebsite(site.id);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .done(done,done);
    }/*,90000*/);
});
