var adtech = require('../index');

console.log('Create banner admin!');
adtech.createBannerAdmin()
.then(function(bannerAdmin){
    console.log('Created banner admin, create banner..');
    var IBanner = adtech.constants.IBanner,
        IFrequencyInformation = adtech.constants.IFrequencyInformation;

    var scriptTag = new Buffer("<script type=\"text/javascript\">window.c6.addReel('_ADBNEXTID_','_ADCUID_','_ADCLICK_','_ADADID_' );</script>");

    var banner = {
        data            : scriptTag.toString('base64'),
        description     : '',
        extId           : 'knucklehead1',
        fileType        : 'html',
        id              : -1,
        mainFileName    : 'index.html',
        name            : 'Whatever',
        originalData    : scriptTag.toString('base64'),
        sizeTypeId      : 16,
        statusId        : IBanner.STATUS_ACTIVE,
        styleTypeId     : IBanner.STYLE_HTML
    };

    var bannerInfo = {
        bannerReferenceId       : banner.id,
        entityFrequencyConfig   : {
            frequencyCookiesOnly : true,
            frequencyDistributed : true,
            frequencyInterval    : 30,
            frequencyTypeId      : IFrequencyInformation.FREQUENCY_5_MINUTES
        },
        name                    : banner.name,
        statusId                : banner.statusId
    };

    return bannerAdmin.createBanner(5972094,banner,bannerInfo);
})
.then(function(banner){
    console.log('Created banner:',banner);
})
.catch(function(err){
    console.log('Error:',JSON.stringify(err,null,3));
});
