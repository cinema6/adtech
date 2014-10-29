describe('adtech.websiteAdmin',function(){
    var adtech, testId, once = false, expectSuccess, expectFailure;
    beforeEach(function(done){
        resolveSpy   = jasmine.createSpy('resolve');
        rejectSpy    = jasmine.createSpy('reject');
        if (once){
            return done();
        }
        once         = true;
        adtech       = require('../../index');
        q            = require('q');
        testId       = (function(){
            var  result = '', digit, hash;
            for (var i =0; i < 40; i++){
                digit = Math.floor(Math.random() * 999999999) % 36;
                if (digit < 26){
                    result += String.fromCharCode(digit + 97);
                } else {
                    result += (digit - 26).toString();
                }
            }
            hash = require('crypto').createHash('sha1');
            hash.update(result);
            return 'c6-e2e-' + hash.digest('hex').slice(0,9);
        }());
        expectSuccess = function(){
            expect(resolveSpy).toHaveBeenCalled();
            expect(rejectSpy).not.toHaveBeenCalled();
        };
        expectFailure = function(){
            expect(resolveSpy).not.toHaveBeenCalled();
            expect(rejectSpy).toHaveBeenCalled();
        };
        adtech.createWebsiteAdmin().catch(done).finally(done);
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
            var testSite = resolveSpy.calls[0].args[0];
            expect(testSite.name).toEqual(testId);
        })
        .done(done);
    });
    
    it('gets a website by ExtId', function(done){
        adtech.websiteAdmin.getWebsiteByExtId(testId)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var site = resolveSpy.calls[0].args[0];
            expect(site.name).toEqual(testId);
            expect(site.extId).toEqual(testId);
            expect(site.URL).toEqual('http://www.cinema6-e2e-test.com');
        })
        .done(done);
    });

    it('gets a website by id', function(done){
        adtech.websiteAdmin.getWebsiteByExtId(testId)
        .then(function(site){
            return adtech.websiteAdmin.getWebsiteById(site.id);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var site = resolveSpy.calls[0].args[0];
            expect(site.name).toEqual(testId);
            expect(site.extId).toEqual(testId);
            expect(site.URL).toEqual('http://www.cinema6-e2e-test.com');
        })
        .done(done);
    });

    it('finds a website by name', function(done){
        var aove = new adtech.AOVE();
        aove.addExpression(new adtech.AOVE.StringExpression('name',testId));
        adtech.websiteAdmin.getWebsiteList(null,null,aove)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var sites = resolveSpy.calls[0].args[0];
            expect(sites.length).toEqual(1);
            expect(sites[0].name).toEqual(testId);
            expect(sites[0].extId).toEqual(testId);
            expect(sites[0].URL).toEqual('http://www.cinema6-e2e-test.com');
        })
        .done(done);
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
            var site = resolveSpy.calls[0].args[0];
            expect(site.name).toEqual(testId + '_updated');
            expect(site.extId).toEqual(testId);
            expect(site.URL).toEqual('http://www.cinema6-e2e-test.com');
        })
        .done(done);
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
        .done(done);
    });

    it('gets a page by ExtId', function(done){
        adtech.websiteAdmin.getPageByExtId(testId + '_page1')
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var page = resolveSpy.calls[0].args[0];
            expect(page.name).toEqual('testPage1');
            expect(page.extId).toEqual(testId + '_page1');
        })
        .done(done);
    });

    it('gets a page by id', function(done){
        adtech.websiteAdmin.getPageByExtId(testId + '_page1')
        .then(function(page){
            return adtech.websiteAdmin.getPageById(page.id);
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            var page = resolveSpy.calls[0].args[0];
            expect(page.name).toEqual('testPage1');
            expect(page.extId).toEqual(testId + '_page1');
        })
        .done(done);
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
            var pages = resolveSpy.calls[0].args[0];
            expect(pages.length).toEqual(3);
        })
        .done(done);
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
            var pages = resolveSpy.calls[0].args[0];
            expect(pages.length).toEqual(3);
        })
        .done(done);
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
            var page = resolveSpy.calls[0].args[0];
            expect(page.extId).toEqual(testId + '_page2_updated');
        })
        .done(done);
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
        .done(done);
    });

    it('deletes a website',function(done){
        var aove = new adtech.AOVE();
        aove.addExpression(new adtech.AOVE.StringExpression('extId',testId));
        adtech.websiteAdmin.getWebsiteList(null,null,aove)
        .then(function(siteList){
            return adtech.websiteAdmin.deleteWebsite(siteList[0].id);            
        })
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .done(done);
    });
});
