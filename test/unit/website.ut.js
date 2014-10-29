describe('website',function(){
    var flush = true, q, website, mockSUtils, mockClient, resolveSpy, rejectSpy;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        website      = require('../../lib/website');
        mockSUtils   = require('../../lib/soaputils');
        q            = require('q');
        resolveSpy   = jasmine.createSpy('resolve');
        rejectSpy    = jasmine.createSpy('reject');
        
        mockClient = {
            createWebsite  : jasmine.createSpy('createWebsite'),
            getWebsiteById : jasmine.createSpy('getWebsiteById'),
            getWebsiteList : jasmine.createSpy('getWebsiteList'),
            deleteWebsite  : jasmine.createSpy('deleteWebsite')
        };
        
    });

    describe('createClient',function(){
        beforeEach(function(){
            spyOn(mockSUtils,'createSoapSSLClient');
        });

        it('should resolve with a client if succeeds',function(done){
            var client = {}, key = {}, cert = {};
            mockSUtils.createSoapSSLClient.andReturn(q(client));
            website.createClient(key,cert)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(client);
                    expect(rejectSpy).not.toHaveBeenCalled(); 

                    var args = mockSUtils.createSoapSSLClient.calls[0].args;
                    expect(args[0]).toMatch('./wsdl/WSWebsiteAdmin_v15.wsdl');
                    expect(args[1]).toEqual({
                        strict : true,
                        endpoint :'https://ws.us-ec.adtechus.com/WSWebsiteAdmin_v15/'
                    });
                    expect(args[2]).toEqual(key);
                    expect(args[3]).toEqual(cert);
                })
                .done(done);
        });

        it('should reject with an error if it fails', function(done){
            var err = {};
            mockSUtils.createSoapSSLClient.andCallFake(function(){
                return q.reject(err);
            });
            website.createClient()
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(err); 
                })
                .done(done);
        });

    })
    
    describe('createWebsite', function(){
        it('maps parameters to parameter properties',function(done){
            var site = {  };
            mockClient.createWebsite.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : {}  }]);
                });
            });

            website.createWebsite(mockClient,site)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    var args = mockClient.createWebsite.calls[0].args;
                    expect(args[0]).toEqual({
                        site : site
                    });
                })
                .done(done);
        });
        
        it('rejects if the website create fails',function(done){
            var site = {  }, err = new Error('err');
            mockClient.createWebsite.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(err);
                });
            });

            website.createWebsite(mockClient,site)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(err);
                })
                .done(done);
        });
    });

    describe('deleteWebsite', function(){
        it('returns true if the website is deleted',function(done){
            mockClient.deleteWebsite.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[ {}, "" ]);
                });
            });

            website.deleteWebsite(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                   
                    expect(resolveSpy).toHaveBeenCalledWith(true);
                    expect(mockClient.deleteWebsite.calls[0].args[0])
                        .toEqual({websiteId:1});
                })
                .done(done);
        });

        it('rejects if the website is not deleted', function(done){
            var e = new Error('error');
            mockClient.deleteWebsite.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(e);
                });
            });

            website.deleteWebsite(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(e);
                })
                .done(done);
        });

    });

    describe('getWebsiteById', function(){
        it ('proxies to the client getWebsiteById', function(done){
            mockClient.getWebsiteById.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : {}  }]);
                });
            });
            
            website.getWebsiteById(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    expect(mockClient.getWebsiteById.calls[0].args[0])
                        .toEqual({id:1,col:mockSUtils.nil});
                })
                .done(done);
        });

        it('rejects with error if not found', function(done){
            mockClient.getWebsiteById.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{},'<>']);
                });
            });
            website.getWebsiteById(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy.calls[0].args[0].message)
                        .toEqual('Unable to locate website: 1.');
                })
                .done(done);
        });
    });

    describe('getWebsiteList', function(){
        it ('returns an array with one result if one result is found', function(done){
            var mockSite = {
                name : 'test',
                id   : 1
            };
            mockClient.getWebsiteList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : { Website : mockSite  }  }, '']);
                });
            });
            
            website.getWebsiteList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockSite]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });


        it ('returns an array with multipe results if multiple results found', function(done){
            var mockSite = {
                name : 'test',
                id   : 1
            };
            mockClient.getWebsiteList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : { Website : { 0 : mockSite, 1 : mockSite } } }, '']);
                });
            });
            
            website.getWebsiteList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockSite,mockSite]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });

        it('returns an empty array if no sites are found', function(done){
            mockClient.getWebsiteList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ }, '']);
                });
            });
            
            website.getWebsiteList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });
    });
    
    describe('createAdmin', function(){
        beforeEach(function(){
            spyOn(mockSUtils,'makeAdmin');
        });

        it('uses soaputils makeAdmin to create admin',function(done){
            var mockKey = {}, mockCert = {};
            mockSUtils.makeAdmin.andReturn(q({}));
            
            website.createAdmin(mockKey,mockCert)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    var args = mockSUtils.makeAdmin.calls[0].args;
                    expect(args[0]).toEqual(mockKey);
                    expect(args[1]).toEqual(mockCert);
                    expect(args[2]).toEqual(website);
                    expect(args[3]).toEqual([
                        'createWebsite',
                        'deleteWebsite',
                        'getWebsiteById',
                        'getWebsiteList',
                        'updateWebsite'    
                    ]);
                })
                .done(done);
        });
    });
});
