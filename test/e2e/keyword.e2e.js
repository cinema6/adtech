describe('adtech.keywordAdmin',function(){
    var adtech, expectSuccess, expectFailure, resolveSpy, rejectSpy, keywordId;
    beforeEach(function(done){
        var helpers = require('./helpers');
        resolveSpy    = helpers.setupSpy('resolve');
        rejectSpy     = helpers.setupSpy('reject');
        expectSuccess = helpers.setExpectation('resolve');
        expectFailure = helpers.setExpectation('reject',true);
        
        if (adtech){ return done(); }

        adtech       = require('../../index');
        q            = require('q');
        
        adtech.createKeywordAdmin()
        .catch(done)
        .finally(done);
    });

    it('creates an admin', function(){
        expect(adtech.keywordAdmin).not.toBeNull();
    });
    
    it('registers a keyword', function(done) {
        adtech.keywordAdmin.registerKeyword('e2e tests are great')
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            keywordId = resolveSpy.arg();
            expect(typeof keywordId).toBe('string');
        })
        .done(done,done);
    });
    
    it('gets a keyword by id', function(done) {
        adtech.keywordAdmin.getKeywordById(keywordId)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function(){
            expect(resolveSpy.arg()).toBe('e2e tests are great');
        })
        .done(done,done);
    });
    
    it('gets multiple keywords using a list of ids', function(done) {
        var list = adtech.keywordAdmin.makeIdList([3171662, keywordId]);
        adtech.keywordAdmin.getKeywordMapByIdList(list)
        .then(resolveSpy,rejectSpy)
        .then(expectSuccess)
        .then(function() {
            var map = resolveSpy.arg();
            expect(Object.keys(map)).toEqual(['3171662', String(keywordId)]);
            expect(map['3171662']).toBe('gloop');
            expect(map[keywordId]).toBe('e2e tests are great');
        })
        .done(done,done);
    });
});

