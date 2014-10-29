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
