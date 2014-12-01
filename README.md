adtech
======

Node.js wrapper library for adtech web services.

### Overview
adtech is a promise based library that wraps SOAP based web services from adtech.  A few key points:

* Certificate and private key files are required to use the library.  
* The library will provide most of the marshalling required to convert JS to SOAP, however it does not enforce the ordering of the fields passed on ADTECH messages.  Because the ADTECH server requires fields to be passed in sequence, messages without out of sequence fields will be rejected.  Fields are typically ordered alphabetically, but you can verify by comparing to the wsdl files found under lib/wsdl.

```javascript
var adtech = require('adtech');

adtech.createClient()
.then(function(){
  return adtech.campaignAdmin.getCampaignById(111111);
})
.then(function(campaign){
  console.log(JSON.stringify(campaign,null,3));
  process.exit(0);
})
.catch(function(err){
  console.log('Error:',err);
  process.exit(1);
});
```

### Initialization

The adtech library can be initialized with a single admin

```javascript
  var adtech = require('adtech');
  adtech.createCampaignAdmin()
```

Or with all admins in a single call

```javascript
  var adtech = require('adtech');
  adtech.createClient()
```

In either case optional parameters can be passed for specifying PEM encoded SSL key and certificate files

```javascript
  var adtech = require('adtech');
  adtech.createClient(myKey,myCert);
```

The default key and certificate files are:
```
  key file:  $HOME/.ssh/adtech.key
  cert file: $HOME/.ssh.adtech.crt
```

### The adtech object

The adtech object provides the primary interface for the adtech library.

#### methods

For creating individual admins
* createBannerAdmin
* createCampaignAdmin
* createCustomerAdmin
* createWebsiteAdmin

For creating all admins
* createClient

#### properties

Admin interfaces (instantiated by createXXXAdmin method or createClient)
* bannerAdmin
* campaignAdmin
* customerAdmin
* websiteAdmin

AOVE - Constructor for filter object

constants - Holds all of the library constants

### Filters

Queries to ADTECH can be filtered using the Attribute Operator Value Expression (AOVE) Constructor.

```
var adtech = require('adtech'),
    AOVE = adtech.AOVE;

adtech.createClient()
.then(function(){
  var filter = new AOVE();
  filter.addExpression(new AOVE.StringExpression('name','Test','LIKE'));
  return adtech.customerAdmin.getCustomerList(null, null, filter);
});
```

AOVE filters can contain more than one expression, evaluated as ANDS.  The following expressions are implemented by the adtech library:

* AOVE.StringExpression
* AOVE.LongExpression
* AOVE.IntExpression

All three expressions take the following parameters:

* fieldName - name of the message field to filter
* value - value to filter for
* operator - See constants.IAttributeOperatorValueExpression, default is OP_EQUAL.

AOVE filters are used with admin Get-XXX-List methods, which typically follow the argument pattern of

* start - starting record number (pass null for default)
* end - ending record number (pass null for default)
* filter - instantiated AOVE object

