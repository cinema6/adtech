var q = require('q');
function wrap (m,o){
    return function(){
        var args = Array.prototype.slice.call(arguments, 0);
        return m.apply(null, args).then(function(r){
            module.exports[o] = r; 
            return r;
        });
    };
}

module.exports = {
    bannerAdmin         : null,
    campaignAdmin       : null,
    customerAdmin       : null,
    geoAdmin            : null,
    keywordAdmin        : null,
    pushAdmin           : null,
    reportAdmin         : null,
    statsAdmin          : null,
    websiteAdmin        : null,
    
    AOVE                : require('./lib/aove'),
    BoolExpression      : require('./lib/boolexpr'),
    constants           : require('./lib/constants'),
    createBannerAdmin   : wrap(require('./lib/banner').createAdmin,   'bannerAdmin'),
    createCampaignAdmin : wrap(require('./lib/campaign').createAdmin, 'campaignAdmin'),
    createCustomerAdmin : wrap(require('./lib/customer').createAdmin, 'customerAdmin'),
    createGeoAdmin      : wrap(require('./lib/geo').createAdmin, 'geoAdmin'),
    createKeywordAdmin  : wrap(require('./lib/keyword').createAdmin, 'keywordAdmin'),
    createPushAdmin     : wrap(require('./lib/push').createAdmin,     'pushAdmin'),
    createReportAdmin   : wrap(require('./lib/report').createAdmin,     'reportAdmin'),
    createStatsAdmin    : wrap(require('./lib/stats').createAdmin,     'statsAdmin'),
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
