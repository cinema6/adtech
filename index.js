var banner = require('./lib/banner'),
    adtech = {
        constants: {}; 
    };

function copyConstants(module) {
    var cls, constants = module.constants;
    for (cls in constants){
        adtech.constants[cls] = constants[cls]; 
    }
}

copyConstants(banner);

adtech.createBannerAdmin = banner.createBannerAdmin;



module.exports = adtech;
