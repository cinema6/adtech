describe('index',function(){
    var once = true, index, banner, website;
    beforeEach(function(){
        if (once) { 
            for (var m in require.cache){ delete require.cache[m]; }
            banner      = require('../../lib/banner');
            website     = require('../../lib/website');
            constants   = require('../../lib/constants');
            spyOn(banner,'createAdmin');
            spyOn(website,'createAdmin');
            index   = require('../../index.js');
        }
    });

    describe('create_xxx_Admin',function(){
        it('createBannerAdmin is proxied',function(){
            index.createBannerAdmin();
            expect(banner.createAdmin).toHaveBeenCalled();
        });
        
        it('createWebsiteAdmin is proxied',function(){
            index.createWebsiteAdmin();
            expect(website.createAdmin).toHaveBeenCalled();
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
