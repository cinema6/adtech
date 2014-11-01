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
                list2 : [ 'apple', 'banana', 'carrot', 'dodo' ],
                list3 : [ 'alligator', 'bear', 'croc', 'dragon' ],
                list4 : [ ],
                emptyVal : null
            });
            expect(isArray(processed.list1)).toEqual(true);
            expect(isArray(processed.list2)).toEqual(true);
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
                    expect(mockFs.readFileSync.calls[0].args[0]).toEqual('/.ssh/adtech.key');
                    expect(mockFs.readFileSync.calls[1].args[0]).toEqual('/.ssh/adtech.crt');
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
});

