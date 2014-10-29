var adtech = require('../index'), AOVE = adtech.AOVE, admin;

function setAdmin(a) {
    admin = a;
    return admin;
}

function createSite(){
    console.log('Created website admin, create website..');

    var website = {
        URL             : 'http://www.mutants.com',
        name            : 'MutantPlayground JS'
    };

    return admin.createWebsite(website);
}

function deleteSite(){
    return admin.deleteWebsite(222799);
}

function getSite() {
    return admin.getWebsiteById(208628);
}

function getSiteList(){
    var aove = new AOVE();
    aove.addExpression(new AOVE.StringExpression('name','Cinema','LIKE'));
    var sort = { 
        Items : {
//                attributes : {
//                    'xmlns:hel' : 'http://systinet.com/wsdl/de/adtech/helios/',
//                    'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema'
//                },
                Item : [ 
                    { 
//                        attributes : {
//                            'xsi:type' : 'hel:QueryOrderParameter'
//                        },
//                        order        : 'ascending',
                        $value : 'name'
                    } 
                ] 
        }
    };
    return admin.getWebsiteList(null,null,aove,sort);
}

console.log('Create website admin!');
adtech.createWebsiteAdmin()
.then(setAdmin)
.then(deleteSite)
.then(function(result){
    console.log('result:',JSON.stringify(result,null,3));
})
.catch(function(err){
    console.log('Error:',err.message);
});

