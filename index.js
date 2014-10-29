
function wrap (m,o){
    return function(){
        var args = Array.prototype.slice.call(arguments, 0);
        return m.apply(args).then(function(r){
            module.exports[o] = r; 
            return r;
        });
    };
}

module.exports = {
    bannerAdmin         : null,
    websiteAdmin        : null,
    
    AOVE                : require('./lib/aove'),
    constants           : require('./lib/constants'),
    createBannerAdmin   : wrap(require('./lib/banner').createAdmin, 'bannerAdmin'),
    createWebsiteAdmin  : wrap(require('./lib/website').createAdmin,'websiteAdmin')
};
