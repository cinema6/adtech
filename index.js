var q = require('q');
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
    campaignAdmin       : null,
    customerAdmin       : null,
    websiteAdmin        : null,
    
    AOVE                : require('./lib/aove'),
    constants           : require('./lib/constants'),
    createBannerAdmin   : wrap(require('./lib/banner').createAdmin,   'bannerAdmin'),
    createCampaignAdmin : wrap(require('./lib/campaign').createAdmin, 'campaignAdmin'),
    createCustomerAdmin : wrap(require('./lib/customer').createAdmin, 'customerAdmin'),
    createWebsiteAdmin  : wrap(require('./lib/website').createAdmin,  'websiteAdmin'),

    createClient : function() {
        var self = this, 
            args = Array.prototype.slice.call(arguments, 0),
            methods = Object.keys(self).filter(function(method){
                return method.match(/create\w+Admin/);
            });
       
        return q.all(methods.map(function(method){
            return self[method].apply(self,args); 
        })).then(function(){
            return self;
        });
    }
};
