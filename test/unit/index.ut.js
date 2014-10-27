describe('index',function(){
    var flush = true, index, banner;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        banner      = require('../../lib/banner');
        constants   = require('../../lib/constants');
        spyOn(banner,'createAdmin');


        index   = require('../../index.js');
    });

    describe('create_xxx_Admin',function(){
        it('createBannerAdmin is proxied',function(){
            index.createBannerAdmin();
            expect(banner.createAdmin).toHaveBeenCalled();
        });
    });

    describe('constants', function(){
        it('proxy banner constants',function(){
            expect(index.constants).toBeDefined();
            expect(index.constants).toEqual(constants);
        });

    });
});
