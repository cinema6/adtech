describe('soaputils',function(){
    var flush = true, q, soapUtils, resolveSpy, rejectSpy, isArray;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        isArray    = require('util').isArray;
        soapUtils  = require('../../lib/soaputils');
        q          = require('q');
        resolveSpy = jasmine.createSpy('resolve');
        rejectSpy  = jasmine.createSpy('reject');
    });

    describe('isEmpty', function(){
        it('returns true if the object is empty',function(){
            expect(soapUtils.isEmpty({})).toEqual(true);
        });

        it('returns true if the object is undefined',function(){
            expect(soapUtils.isEmpty()).toEqual(true);
        });

        it('returns true if the object is null',function(){
            expect(soapUtils.isEmpty(null)).toEqual(true);
        });

        it('returns false if the object is not empty',function(){
            expect(soapUtils.isEmpty({x:1})).toEqual(false);
        });
    });

    describe('processResponse',function(){
        it('removes attributes and $value from objects', function(){
            var obj = {
                prop1 : {
                    attributes : { x : 1 },
                    subprop1 : {
                        attributes : { 'i:type' : 'd:boolean' },
                        $value : '1'
                    }
                },
                prop2 : { attributes : { z : 2 }, $value : 2 },
                hashMap: {
                    Keys: {
                        Item: [
                            { attributes: { 'i:type': 'd:long' }, $value: '12345' },
                            { attributes: { 'i:type': 'd:string' }, $value: 'foo' }
                        ]
                    },
                    Values: {
                        Item: [
                            { attributes: { 'i:type': 'd:string' }, $value: 'porkchops' },
                            { attributes: { 'i:type': 'd:int' }, $value: 5 }
                        ]
                    }
                },
                list1 : {
                    Items : {
                        Item : [
                            {
                                attributes : { x : 1  },
                                val1 : {
                                    attributes : { 'i:type' : 'd:long'},
                                    $value : '1'
                                },
                                val2 : {
                                    attributes : { 'i:type' : 'd:int'},
                                    $value : '1'
                                }
                            },
                            {
                                attributes : { x : 1  },
                                val1 : {
                                    attributes : { 'i:type' : 'd:float'},
                                    $value : '2.0'
                                },
                                val2 : {
                                    attributes : { 'i:type' : 'd:double'},
                                    $value : '2.0'
                                }
                            }
                        ]
                    }
                },
                list2 : {
                    Items : {
                        Item : [
                            {
                                attributes : { x : 1  },
                                $value : 'apple' 
                            },
                            {
                                attributes : { x : 1},
                                $value : 'banana' 
                            },
                            {
                                attributes : { x : 1  },
                                $value : 'carrot' 
                            },
                            {
                                attributes : { x : 1},
                                $value : 'dodo'
                            }
                        ]
                    }
                },
                list3 : {
                    Item : [
                        {
                            attributes : { x : 1  },
                            $value : 'alligator' 
                        },
                        {
                            attributes : { x : 1},
                            $value : 'bear' 
                        },
                        {
                            attributes : { x : 1  },
                            $value : 'croc' 
                        },
                        {
                            attributes : { x : 1},
                            $value : 'dragon'
                        }
                    ]
                },
                list4: {
                    "attributes" : { "i:type" : "d:Vector" },
                    "Items" : {}
                },
                map1 : {
                     "attributes": { "i:type": "wn7:HashMap" },
                     "Keys": { "Item": [
                            { "attributes": { "i:type": "d:string" }, "$value": "ecpm" },
                            { "attributes": { "i:type": "d:string" }, "$value": "targeting" },
                            { "attributes": { "i:type": "d:string" }, "$value": "keywords" }
                      ]},
                     "Values": { "Item": [
                            { "attributes": { "i:type": "d:string" }, "$value": "ecpm" },
                            { "attributes": { "i:type": "d:string" }, "$value": "targeting" },
                            { "attributes": { "i:type": "d:string" }, "$value": "keywords" }
                     ]}
                },
                map2 : {
                     "attributes": { "i:type": "wn7:HashMap" },
                     "Keys": { "Item": [
                            { "attributes": { "i:type": "d:string" }, "$value": "ecpm" },
                            { "attributes": { "i:type": "d:string" }, "$value": "targeting" },
                            { "attributes": { "i:type": "d:string" }, "$value": "keywords" }
                      ]},
                     "Values": { "Item": [
                        { 
                        "attributes":{"i:type":"wn9:CampaignFeatureSettings"},
                        "locked":{"attributes":{"i:type":"d:boolean"},"$value":"0"},
                        "shared":{"attributes":{"i:type":"d:boolean"},"$value":"0"},
                        "visible":{"attributes":{"i:type":"d:boolean"},"$value":"0"}
                        },
                        {
                        "attributes":{"i:type":"wn9:CampaignFeatureSettings"},
                        "locked":{"attributes":{"i:type":"d:boolean"},"$value":"0"},
                        "shared":{"attributes":{"i:type":"d:boolean"},"$value":"0"},
                        "visible":{"attributes":{"i:type":"d:boolean"},"$value":"1"}
                        },
                        {
                        "attributes":{"i:type":"wn9:CampaignFeatureSettings"},
                        "locked":{"attributes":{"i:type":"d:boolean"},"$value":"0"},
                        "shared":{"attributes":{"i:type":"d:boolean"},"$value":"0"},
                        "visible":{"attributes":{"i:type":"d:boolean"},"$value":"0"}
                       },
                    ]}
                },
                emptyVal : { "attributes" : { "i:type" : "d:string" } }
            };
            var processed = soapUtils.processResponse(obj);
            expect(processed).toEqual({
                prop1 : { subprop1 : true },
                prop2 : 2,
                list1 : [ 
                        { val1 : 1, val2 : 1},
                        { val1 : 2, val2 : 2}
                ],
                hashMap: { '12345': 'porkchops', 'foo': 5 },
                list2 : [ 'apple', 'banana', 'carrot', 'dodo' ],
                list3 : [ 'alligator', 'bear', 'croc', 'dragon' ],
                list4 : [ ],
                map1 : { ecpm : 'ecpm', targeting : 'targeting', keywords : 'keywords' },
                map2 : { 
                         ecpm :     { locked:false,shared:false,visible:false},
                         targeting: { locked:false,shared:false,visible:true},
                         keywords:  { locked:false,shared:false,visible:false}
                },
                emptyVal : ''
            });
            expect(isArray(processed.list1)).toEqual(true);
            expect(isArray(processed.list2)).toEqual(true);
        });
        
        it('handles simple responses', function() {
            var obj = { attributes: { 'i:type': 'd:long' }, $value: 123456 };
            expect(soapUtils.processResponse(obj)).toBe(123456);
        });
    });

    describe('copyProp',function(){
        var testObj, dstObj;
        beforeEach(function(){
            testObj = {
                prop_num1 : 1,
                prop_str1 : 'string',
                prop_dt1  : new Date(1421070000000),
                prop_bool1 : true,
                prop_bool2 : false,
                subA : {
                    subA1 : {
                        subA1Val1 : 2,
                        subA1Val2 : new Date(1421070000000)
                    },
                    subA2 : 3
                }
            };
            dstObj = {};
        });

        it('copies the property if it exists',function(){
            soapUtils.copyProp(testObj,dstObj,'prop_num1');
            expect(dstObj.prop_num1).toEqual(1);
        });

        it('ignores the property if it does not exist',function(){
            dstObj = { foo : 'bar' };
            soapUtils.copyProp(testObj,dstObj,'prop_num2');
            expect(dstObj).toEqual({ foo: 'bar' });
        });

        it('sets the property with default if it does not exist',function(){
            dstObj = { foo : 'bar' };
            soapUtils.copyProp(testObj,dstObj,'prop_num2',44);
            expect(dstObj).toEqual({ foo: 'bar', prop_num2 : 44 });
        });

        it('converts a date prop to string', function(){
            soapUtils.copyProp(testObj,dstObj,'prop_dt1');
            expect(dstObj.prop_dt1).toEqual('2015-01-12T13:40:00.000Z');
        });

        it('converts a boolean prop to number', function(){
            soapUtils.copyProp(testObj,dstObj,'prop_bool1');
            soapUtils.copyProp(testObj,dstObj,'prop_bool2');
            soapUtils.copyProp(testObj,dstObj,'prop_bool3');
            expect(dstObj).toEqual({
                prop_bool1 : 1,
                prop_bool2 : 0
            });
        });

        it('copies sub prop to empty obj',function(){
            dstObj = {};
            soapUtils.copyProp(testObj,dstObj,'subA.subA1.subA1Val1');
            expect(dstObj).toEqual({ subA : { subA1 : { subA1Val1 : 2 } } });
        });
        
        it('copies sub prop to obj with prop',function(){
            dstObj = { subA : { subA2 : 5 } };
            soapUtils.copyProp(testObj,dstObj,'subA.subA1.subA1Val1');
            expect(dstObj).toEqual({ subA : { subA1 : { subA1Val1 : 2 }, subA2 : 5 } });
        });

        it('does nothing to dest if source not there and no default',function(){
            dstObj = { subA : { subA2 : 5 } };
            soapUtils.copyProp(testObj,dstObj,'subA.subA1.subA1Val9');
            expect(dstObj).toEqual({ subA : { subA2 : 5 } });
        });
    });
   
    describe('isAPIObject',function(){
        it('returns true if has attribute property',function(){
            expect(soapUtils.isAPIObject({ attributes : { x : 1} })).toEqual(true);
        });
        
        it('returns true if has $value property',function(){
            expect(soapUtils.isAPIObject({  $value : 1 })).toEqual(true);
        });
        
        it('returns false if has no attributes or $value property',function(){
            expect(soapUtils.isAPIObject({  value : 1 })).toEqual(false);
        });
        
        it('returns false if passed undefined',function(){
            expect(soapUtils.isAPIObject()).toEqual(false);
        });
        
        it('returns false if passed null',function(){
            expect(soapUtils.isAPIObject(null)).toEqual(false);
        });
        
        it('returns false if passed string',function(){
            expect(soapUtils.isAPIObject('abc')).toEqual(false);
        });
        
        it('returns false if passed number',function(){
            expect(soapUtils.isAPIObject(1)).toEqual(false);
        });
    });

    describe('makePropCopier',function(){
        var testObj, dstObj, copier;
        beforeEach(function(){
            testObj = {
                prop_num1 : 1,
                prop_str1 : 'string',
                prop_dt1  : new Date(1421070000000),
                prop_bool1 : true,
                prop_bool2 : false
            };
            dstObj = {};
            copier = soapUtils.makePropCopier(testObj,dstObj);
            spyOn(soapUtils,'copyProp');
        });

        it('makes a property copier',function(){
            expect(copier.source).toBe(testObj);
            expect(copier.dest).toBe(dstObj);
        });

        it('copy wraps the propCopy method',function(){
            copier.copy('prop_num1');
            expect(soapUtils.copyProp)
                .toHaveBeenCalledWith(testObj,dstObj,'prop_num1',undefined);
        });

        it('copy wraps the propCopy method passing nil as default',function(){
            copier.copyNil('prop_num1');
            expect(soapUtils.copyProp)
                .toHaveBeenCalledWith(testObj,dstObj,'prop_num1',soapUtils.nil);
        });

    });

    describe('makeTypedList', function(){
        it('handles complex types',function(){
            var rawList = [
                { name : 'obj1', val  : 1 },
                { name : 'obj2', val  : 2 },
                { name : 'obj3', val  : 3 }
            ];
            expect(soapUtils.makeTypedList('TestType',rawList,'abc')).toEqual(
                {
                    Items : { 
                        attributes : { 'xmlns:cm' : 'abc' },
                        Item : [
                            {attributes:{'xsi:type':'cm:TestType'},name:'obj1',val:1},
                            {attributes:{'xsi:type':'cm:TestType'},name:'obj2',val:2},
                            {attributes:{'xsi:type':'cm:TestType'},name:'obj3',val:3}
                        ]
                    }
                }
            );
        });
        
        it('handles simple type: string',function(){
            expect(soapUtils.makeTypedList('string',['abc','def','ghi'],'abc')).toEqual(
                {
                    Items : { 
                        attributes : { 'xmlns:cm' : 'abc' },
                        Item : [
                            {attributes:{'xsi:type':'cm:string'},$value:'abc'},
                            {attributes:{'xsi:type':'cm:string'},$value:'def'},
                            {attributes:{'xsi:type':'cm:string'},$value:'ghi'}
                        ]
                    }
                }
            );
        });
        
        it('handles simple type: long',function(){
            expect(soapUtils.makeTypedList('long',[1,2,3],'abc')).toEqual(
                {
                    Items : { 
                        attributes : { 'xmlns:cm' : 'abc' },
                        Item : [
                            {attributes:{'xsi:type':'cm:long'},$value:1},
                            {attributes:{'xsi:type':'cm:long'},$value:2},
                            {attributes:{'xsi:type':'cm:long'},$value:3}
                        ]
                    }
                }
            );
        });
        
        it('handles simple type: int',function(){
            expect(soapUtils.makeTypedList('int',[1,2,3],'abc')).toEqual(
                {
                    Items : { 
                        attributes : { 'xmlns:cm' : 'abc' },
                        Item : [
                            {attributes:{'xsi:type':'cm:int'},$value:1},
                            {attributes:{'xsi:type':'cm:int'},$value:2},
                            {attributes:{'xsi:type':'cm:int'},$value:3}
                        ]
                    }
                }
            );
        });

        it('does not add ns attributes if none passed',function(){
            expect(soapUtils.makeTypedList('int',[1,2,3])).toEqual(
                {
                    Items : { 
                        Item : [
                            {attributes:{'xsi:type':'cm:int'},$value:1},
                            {attributes:{'xsi:type':'cm:int'},$value:2},
                            {attributes:{'xsi:type':'cm:int'},$value:3}
                        ]
                    }
                }
            );
        });
        
        it('overrides pfx if passed',function(){
            expect(soapUtils.makeTypedList('int',[1,2,3],null,'xx')).toEqual(
                {
                    Items : { 
                        Item : [
                            {attributes:{'xsi:type':'xx:int'},$value:1},
                            {attributes:{'xsi:type':'xx:int'},$value:2},
                            {attributes:{'xsi:type':'xx:int'},$value:3}
                        ]
                    }
                }
            );
        });
    });

    describe('makeSimpleTypedMap', function(){

        it('creates an api formatted map',function(){
            expect(soapUtils.makeSimpleTypedMap('string','string',{
                'apple' : 'orange',
                'banana' : 'yellow',
                'melon'  : 'green'
            })).toEqual({
                attributes :  { 'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema' },
                Keys : {
                    Item : [
                        { attributes:{'xsi:type':'xsd:string'},$value:'apple' },
                        { attributes:{'xsi:type':'xsd:string'},$value:'banana' },
                        { attributes:{'xsi:type':'xsd:string'},$value:'melon' }
                    ]
                },
                Values : {
                    Item : [
                        { attributes:{'xsi:type':'xsd:string'},$value:'orange' },
                        { attributes:{'xsi:type':'xsd:string'},$value:'yellow' },
                        { attributes:{'xsi:type':'xsd:string'},$value:'green' }
                    ]
                }
            });
        });
    });

    describe('createSoapSSLClient',function(){
        var mockClient, mockFs, mockSoap;
        beforeEach(function(){
            mockFs     = require('fs');
            mockSoap   = require('soap');

            mockClient = {
                setSecurity : jasmine.createSpy('setSecurity')
            };

            spyOn(mockFs,'readFileSync');
            spyOn(mockSoap,'createClient');
            spyOn(mockSoap, 'ClientSSLSecurity').andReturn('fakeSSLSecurity');
        });

        it('should resolve with an ssl client if succeeds',function(done){
            mockFs.readFileSync.andReturn({});
            mockSoap.createClient.andCallFake(function(wsdl, opts,cb){
                process.nextTick(function(){
                    cb(null,mockClient);
                });
            });
            soapUtils.createSoapSSLClient({},{},'keypath','certpath')
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(mockClient);
                    expect(rejectSpy).not.toHaveBeenCalled(); 

                    expect(mockClient.setSecurity).toHaveBeenCalled();
                })
                .done(done);
        });

        it('should use default key and cert if key and cert not passed',function(done){
            mockFs.readFileSync.andReturn({});
            mockSoap.createClient.andCallFake(function(wsdl, opts,cb){
                process.nextTick(function(){
                    cb(null,mockClient);
                });
            });
            process.env.HOME = '/';
            soapUtils.createSoapSSLClient({},{})
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(mockClient);
                    expect(rejectSpy).not.toHaveBeenCalled(); 
                    expect(mockSoap.ClientSSLSecurity).toHaveBeenCalledWith('/.ssh/adtech.key', '/.ssh/adtech.crt');
                })
                .done(done);
        });

        it('should reject with an error if missing wsdl', function(done){
            soapUtils.createSoapSSLClient()
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith('Wsdl parameter is required!'); 
                })
                .done(done);
        });

        it('should reject with an error if soap create client fails', function(done){
            var err = {};
            mockSoap.createClient.andCallFake(function(wsdl, opts, cb){
                process.nextTick(function(){
                    cb(err);
                });
            });
            soapUtils.createSoapSSLClient({},{},'keypath','certpath')
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(err); 
                })
                .done(done);
        });
    });
    
    describe('makeAdmin',function(){
        var mockKey, mockCert, mockClient, mockLib;
        beforeEach(function(){
            mockClient = { };
            mockLib = {
                createClient : jasmine.createSpy('createClient').andReturn( q(mockClient) ),
                method1      : jasmine.createSpy('method1'),
                method2      : jasmine.createSpy('method2')
            };
        });

        it('should call createClient on passed lib',function(done){
            soapUtils.makeAdmin(mockKey,mockCert,mockLib,['method1'])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled(); 
                    expect(mockLib.createClient).toHaveBeenCalledWith(mockKey,mockCert);
                })
                .done(done);
        });

        it('should attach methods passed in method array', function(done){
            soapUtils.makeAdmin(mockKey,mockCert,mockLib,['method1','method2'])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled(); 
                    var admin = resolveSpy.calls[0].args[0];
                    expect(admin.method1).toBeDefined();
                    expect(admin.method2).toBeDefined();
                })
                .done(done);
        });

        it('admin methods should proxy calls to lib methods', function(done){
            soapUtils.makeAdmin(mockKey,mockCert,mockLib,['method1','method2'])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled(); 
                    var admin = resolveSpy.calls[0].args[0];
                    admin.method1('a','b');
                    admin.method2('d','e');
                    expect(mockLib.method1).toHaveBeenCalledWith(mockClient,'a','b');
                    expect(mockLib.method2).toHaveBeenCalledWith(mockClient,'d','e');
                })
                .done(done);
        });

        it('should reject if a method does not exist', function(done){
            soapUtils.makeAdmin(mockKey,mockCert,mockLib,['method1','method2','method3'])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith('Missing method: "method3".'); 
                })
                .done(done);
        });
        
        it('should reject if method is not a method', function(done){
            mockLib.method3 = {};
            soapUtils.makeAdmin(mockKey,mockCert,mockLib,['method1','method2','method3'])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith('Not a method: "method3".'); 
                })
                .done(done);
        });
    });
    
    describe('createObject', function(){
        var mockClient, nil, optArg;
        beforeEach(function(){
            nil = soapUtils.nil;

            optArg = null;

            mockClient = {
                createMethod : jasmine.createSpy('testMethod')
            };

            mockClient.createMethod.andCallFake(function(opts,cb){
                optArg = opts;
                process.nextTick(function(){
                    cb(null,[{ }, '']);
                });
            });
            
        });
        
        it('returns created object if object is created',function(done){
            var ban = {};
            mockClient.createMethod.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[ { response : { x : 1 } }, "" ]);
                });
            });

            soapUtils.createObject('createMethod','meth',[mockClient,ban])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith({x:1});
                    expect(mockClient.createMethod.calls[0].args[0]).toEqual({meth:ban});
                })
                .done(done);
        });

        it ('uses the idProp name list', function(done){
            var obj1 = {}, obj2 = {};
            mockClient.createMethod.andCallFake(function(opts,cb){
                optArg = opts;
                process.nextTick(function(){
                    cb(null,[ { response : { x : 1 } }, "" ]);
                });
            });

            soapUtils.createObject('createMethod',['ob1','ob2'], [mockClient, obj1, obj2])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith({x:1});
                    expect(mockClient.createMethod).toHaveBeenCalled();
                    expect(optArg.ob1).toBe(obj1);
                    expect(optArg.ob2).toBe(obj2);
                })
                .done(done);
        });

        it ('uses the idProp name list', function(done){
            var obj1 = {}, obj2 = {};
            mockClient.createMethod.andCallFake(function(opts,cb){
                optArg = opts;
                process.nextTick(function(){
                    cb(null,[ { response : { x : 1 } }, "" ]);
                });
            });

            soapUtils.createObject('createMethod',['ob1','ob2'], [mockClient, obj1 ])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith({x:1});
                    expect(mockClient.createMethod).toHaveBeenCalled();
                    expect(optArg.ob1).toBe(obj1);
                    expect(optArg.ob2).toEqual(nil);
                })
                .done(done);
        });

        it('rejects if the create receives an error', function(done){
            var e = new Error('error'), ban = {};
            mockClient.createMethod.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(e);
                });
            });

            soapUtils.createObject('createMethod','meth',[mockClient,ban])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(rejectSpy).toHaveBeenCalledWith(e);
                })
                .done(done);
        });
        
        it('rejects if the create returns an empty response', function(done){
            var ban = {};
            mockClient.createMethod.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[ { }, "" ]);
                });
            });


            soapUtils.createObject('createMethod','meth',[mockClient,ban])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(rejectSpy).toHaveBeenCalled();
                })
                .done(done);
        });
    });

    describe('deleteObject',function(){
        var mockClient, nil, optArg;
        beforeEach(function(){
            nil = soapUtils.nil;

            optArg = null;

            mockClient = {
                deleteMethod : jasmine.createSpy('testMethod')
            };

            mockClient.deleteMethod.andCallFake(function(opts,cb){
                optArg = opts;
                process.nextTick(function(){
                    cb(null,[{ }, '']);
                });
            });
            
        });
        
        it('returns true if the object is deleted',function(done){
            soapUtils.deleteObject('deleteMethod','id',[mockClient,1])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(true);
                    expect(mockClient.deleteMethod.calls[0].args[0])
                        .toEqual({id:1});
                })
                .done(done);
        });

        it('rejects if the website is not deleted', function(done){
            var e = new Error('error');
            mockClient.deleteMethod.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(e);
                });
            });

            soapUtils.deleteObject('deleteMethod','id',[mockClient,1])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(rejectSpy).toHaveBeenCalledWith(e);
                })
                .done(done);
        });
    });
    
    describe('exec',function(){
        var mockClient, nil, optArg;
        beforeEach(function(){
            nil = soapUtils.nil;

            optArg = null;

            mockClient = {
                testMethod : jasmine.createSpy('testMethod')
            };

            mockClient.testMethod.andCallFake(function(opts,cb){
                optArg = opts;
                process.nextTick(function(){
                    cb(null,[{ }, '']);
                });
            });
            
        });
        
        it('returns true if the method returns nothing',function(done){
            soapUtils.exec('testMethod','id',[mockClient,1])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(true);
                    expect(mockClient.testMethod.calls[0].args[0])
                        .toEqual({id:1});
                })
                .done(done);
        });

        it('rejects if the method fails', function(done){
            var e = new Error('error');
            mockClient.testMethod.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(e);
                });
            });

            soapUtils.exec('testMethod','id',[mockClient,1])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(rejectSpy).toHaveBeenCalledWith(e);
                })
                .done(done);
        });
    });

    describe('getList', function(){
        var mockClient, mockData, nil, optArg;
        beforeEach(function(){
            nil = soapUtils.nil;

            optArg = null;

            mockData = [
                { id   : 1, name : 'testData1' },
                { id   : 2, name : 'testData2' }
            ];
            
            mockClient = {
                testMethod : jasmine.createSpy('testMethod')
            };

            mockClient.testMethod.andCallFake(function(opts,cb){
                optArg = opts;
                process.nextTick(function(){
                    cb(null,[{ response : { TestType : mockData[0] }  }, '']);
                });
            });
            
        });

        it ('calls the testMethod passed', function(done){
            soapUtils.getList('testMethod','TestType','order', [mockClient])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockData[0]]);
                    expect(mockClient.testMethod).toHaveBeenCalled();
                })
                .done(done);
        });

        it ('uses the orderProp name', function(done){
            soapUtils.getList('testMethod','TestType','fishHead', [mockClient])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockData[0]]);
                    expect(mockClient.testMethod).toHaveBeenCalled();
                    expect(optArg.fishHead).toEqual(nil);
                })
                .done(done);
        });

        it ('converts empty arguments to nill for the client method', function(done){
            var mockExpr = {}, mockOrder = {};
            soapUtils.getList('testMethod','TestType','fishHead',[mockClient])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockData[0]]);
                    expect(mockClient.testMethod).toHaveBeenCalled();
                    expect(optArg.start).toEqual(nil);
                    expect(optArg.end).toEqual(nil);
                    expect(optArg.boolExpr).toEqual(nil);
                    expect(optArg.fishHead).toEqual(nil);
                })
                .done(done);
        });

        it ('passes arguments to the client method', function(done){
            var mockExpr = {}, mockOrder = {};
            soapUtils.getList('testMethod','TestType','fishHead',
                [mockClient,1,2,mockExpr,mockOrder])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockData[0]]);
                    expect(mockClient.testMethod).toHaveBeenCalled();
                    expect(optArg.start).toEqual(1);
                    expect(optArg.end).toEqual(2);
                    expect(optArg.boolExpr).toBe(mockExpr);
                    expect(optArg.fishHead).toBe(mockOrder);
                })
                .done(done);
        });


        it ('returns an array with one result if one result is found', function(done){
            soapUtils.getList('testMethod','TestType','order', [mockClient])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockData[0]]);
                    expect(mockClient.testMethod).toHaveBeenCalled();
                })
                .done(done);
        });

        it ('returns an array with multiple results if one result is found', function(done){
            mockClient.testMethod.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : { TestType : mockData }  }, '']);
                });
            });
            soapUtils.getList('testMethod','TestType','order', [mockClient])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(mockData);
                    expect(mockClient.testMethod).toHaveBeenCalled();
                })
                .done(done);
        });

        it ('returns an empty array if no results are found', function(done){
            mockClient.testMethod.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ }, '']);
                });
            });
            soapUtils.getList('testMethod','TestType','order', [mockClient])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([]);
                    expect(mockClient.testMethod).toHaveBeenCalled();
                })
                .done(done);
        });
    });
    
    describe('getObject', function(){
        var mockClient, mockData, nil, optArg;
        beforeEach(function(){
            nil = soapUtils.nil;

            optArg = null;

            mockData = { id   : 1, name : 'testData1' };
            
            mockClient = {
                testMethod : jasmine.createSpy('testMethod')
            };

            mockClient.testMethod.andCallFake(function(opts,cb){
                optArg = opts;
                process.nextTick(function(){
                    cb(null,[{ response : mockData  }, '']);
                });
            });
            
        });

        it ('calls the testMethod passed', function(done){
            soapUtils.getObject('testMethod','id', [mockClient, 1])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(mockData);
                    expect(mockClient.testMethod).toHaveBeenCalled();
                })
                .done(done);
        });

        it ('uses the idProp name', function(done){
            soapUtils.getObject('testMethod','extid', [mockClient, 2])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(mockData);
                    expect(mockClient.testMethod).toHaveBeenCalled();
                    expect(optArg.extid).toEqual(2);
                })
                .done(done);
        });

        it ('uses the idProp name list', function(done){
            soapUtils.getObject('testMethod',['extid','id2'], [mockClient, 2, 3])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(mockData);
                    expect(mockClient.testMethod).toHaveBeenCalled();
                    expect(optArg.extid).toEqual(2);
                    expect(optArg.id2).toEqual(3);
                })
                .done(done);
        });

        it ('uses the idProp name list with nil', function(done){
            soapUtils.getObject('testMethod',['extid','id2'], [mockClient, 2 ])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(mockData);
                    expect(mockClient.testMethod).toHaveBeenCalled();
                    expect(optArg.extid).toEqual(2);
                    expect(optArg.id2).toEqual(nil);
                })
                .done(done);
        });
        
        it('simply sends the arguments if propName is not defined', function(done) {
            soapUtils.getObject('testMethod',null, [mockClient, {foo: 'bar'}])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(mockData);
                    expect(mockClient.testMethod).toHaveBeenCalled();
                    expect(optArg).toEqual({foo: 'bar'});
                })
                .done(done);
        });

        it('sends a reject if nothing is found', function(done){
            mockClient.testMethod.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ }, '']);
                });
            });
            soapUtils.getObject('testMethod','extid', [mockClient, 2])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(rejectSpy).toHaveBeenCalled();
                    var err = rejectSpy.calls[0].args[0];
                    expect(err.message).toEqual('Unable to locate object: 2.');
                })
                .done(done);
        });

    });

    describe('updateObject', function(){
        var mockClient, nil, optArg;
        beforeEach(function(){
            nil = soapUtils.nil;

            optArg = null;

            mockClient = {
                updateMethod : jasmine.createSpy('testMethod')
            };

            mockClient.updateMethod.andCallFake(function(opts,cb){
                optArg = opts;
                process.nextTick(function(){
                    cb(null,[{ }, '']);
                });
            });
            
        });
        
        it('returns updated object if object is updated',function(done){
            var ban = {};
            mockClient.updateMethod.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[ { response : { x : 1 } }, "" ]);
                });
            });

            soapUtils.updateObject('updateMethod','bann',[mockClient,ban])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith({x:1});
                    expect(mockClient.updateMethod.calls[0].args[0]).toEqual({bann:ban});
                })
                .done(done);
        });

        it('rejects if the update receives an error', function(done){
            var e = new Error('error'), ban = {};
            mockClient.updateMethod.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(e);
                });
            });

            soapUtils.updateObject('updateMethod','bann',[mockClient,ban])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(rejectSpy).toHaveBeenCalledWith(e);
                })
                .done(done);
        });
        
        it('rejects if the update returns an empty response', function(done){
            var ban = {};
            mockClient.updateMethod.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[ { }, "" ]);
                });
            });


            soapUtils.updateObject('updateMethod','bann',[mockClient,ban])
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(rejectSpy).toHaveBeenCalled();
                })
                .done(done);
        });

    });

});

