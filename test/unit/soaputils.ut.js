xdescribe('soaputils',function(){
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

