var soapUtils = require('./soaputils'),
    isArray   = require('util').isArray,
    kWsdl     = __dirname + '/wsdl/WSAdLocalAdmin_v3.wsdl',
    kOpts     = {
        strict   : true,
        endpoint : 'https://ws.us-ec.adtechus.com/WSAdLocalAdmin_v3/'
    },
    lib = {};

lib.createAdmin = function(sslKeyPath, sslCertPath) {
    return soapUtils.makeAdmin(sslKeyPath, sslCertPath, lib, [
        'getAdLocalTargetListByCampaignId',
        'getCountrySubGroupList',
        'getCountrySubGroupMemberList',
        'createAdLocalTargetList'
    ]);
};

lib.createClient = function(sslKeyPath, sslCertPath){
    return soapUtils.createSoapSSLClient(kWsdl,kOpts,sslKeyPath,sslCertPath);
};

lib.getListXml = function(method, argv) { //TODO: modularize properly with lib/stats.js version
    var client   = argv[0],
        start    = argv[1],
        end      = argv[2],
        boolExpr = argv[3],
        rqs;
    if ((start === undefined) || (start === null)){
        rqs = '<ns0:start xsi:nil="true"/>';
    } else {
        rqs = '<ns0:start>' + start + '</ns0:start>';
    }
    
    if ((end === undefined) || (end === null)){
        rqs += '<ns0:end xsi:nil="true"/>';
    } else {
        rqs += '<ns0:end>' + end + '</ns0:end>';
    }

    if ((boolExpr === undefined) || (boolExpr === null)){
        rqs += '<ns0:boolExpr xsi:nil="true"/>';
    } else {
        rqs += boolExpr.toXml();
    }
    rqs += '<ns0:order xsi:nil="true"/>';
    
    return q.ninvoke(client, method, rqs)
        .then(function(result){
            var retval;
            if (soapUtils.isEmpty(result[0])){
                return [];
            }
            retval = soapUtils.processResponse(result[0].response || result[0]);
            if (isArray(retval.long)){
                return retval.long;
            }
            return retval;
        });
};



lib.getAdLocalTargetListByCampaignId = function() {
    return soapUtils.getObject('getAdLocalTargetListByCampaignId', '$value',
            Array.prototype.slice.call(arguments, 0));
};

lib.getCountrySubGroupList = function() {
    return lib.getListXml('getCountrySubGroupList',
            Array.prototype.slice.call(arguments, 0));
};

lib.getCountrySubGroupMemberList = function() {
    return lib.getListXml('getCountrySubGroupMemberList',
            Array.prototype.slice.call(arguments, 0));
};

lib.createAdLocalTargetList = function() {
    return soapUtils.createObject('createAdLocalTargetList', ['ArrayOfAdLocalTarget', 'campaignId'],
            Array.prototype.slice.call(arguments, 0));
};
/* TODO: so for createAdLocalTargetList(), we need to do something that eventually produces this xml:
<soap:Envelope
 xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
 xmlns:map="http://systinet.com/mapping/"
 xmlns:ns0="http://systinet.com/xsd/SchemaTypes/"
 xmlns:tns="http://systinet.com/wsdl/de/adtech/webservices/helios/lowLevel/AdLocalManagement_v3/"
 xmlns:xns4="http://systinet.com/wsdl/de/adtech/helios/AdLocalManagement/"
 xmlns:xns5="http://systinet.com/wsdl/de/adtech/webservices/helios/lowLevel/AdLocalManagement_v3/"
 xmlns:xns6="http://systinet.com/wsdl/de/adtech/helios/"
 xmlns:xns7="http://systinet.com/wsdl/de/adtech/helios/CampaignManagement/"
 xmlns:xns8="http://systinet.com/containers/literal/ms.net"
 xmlns:xns9="http://systinet.com/wsdl/java/lang/">
<soap:Header>
</soap:Header>
<soap:Body>
    <ns0:alts>
        <tns:AdLocalTarget>
            <ns0:campaignId>7289572</ns0:campaignId>
            <ns0:countryId>1</ns0:countryId>
            <ns0:countryName>USA</ns0:countryName>
            <ns0:subGroupId>106548</ns0:subGroupId>
            <ns0:subGroupMemberId>38</ns0:subGroupMemberId>
            <ns0:subGroupMemberName>baltimore</ns0:subGroupMemberName>
            <ns0:subGroupName>subgroup.usa.dma</ns0:subGroupName>
        </tns:AdLocalTarget>
        <tns:AdLocalTarget>
            <ns0:campaignId>7289572</ns0:campaignId>
            <ns0:countryId>1</ns0:countryId>
            <ns0:countryName>USA</ns0:countryName>
            <ns0:subGroupId>322</ns0:subGroupId>
            <ns0:subGroupMemberId>104677</ns0:subGroupMemberId>
            <ns0:subGroupMemberName>arizona</ns0:subGroupMemberName>
            <ns0:subGroupName>States</ns0:subGroupName>
        </tns:AdLocalTarget>
    </ns0:alts>
    <ns0:campaignId>7289572</ns0:campaignId>
</soap:Body>
</soap:Envelope>
*/


/*
    TODO: as for editing... doesn't look like there's any updateAdLocalTarget anything
    so maybe we'd have to delete then re-create?
    but there's only deleteAdLocalTarget, which takes in one AdLocalTarget obj, so we'd have to do that for each one?
    probably will need to email support and ask if there's a sensible way to edit campaign's geo targeting
    
    also further investigate adLocalTargetingSetList on campaign... maybe this is usable?
*/


module.exports = lib;
