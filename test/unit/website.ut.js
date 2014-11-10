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
//            createPage          : jasmine.createSpy('createPage'),
//            deletePage          : jasmine.createSpy('deletePage'),
//            getPageByExtId      : jasmine.createSpy('getPageByExtId'),
//            getPageById         : jasmine.createSpy('getPageById'),
//            getPageList         : jasmine.createSpy('getPageList'),
//            updatePage          : jasmine.createSpy('updatePage'),
            createPlacement     : jasmine.createSpy('createPlacement'),
            deletePlacement     : jasmine.createSpy('deletePlacement'),
            getPlacementByExtId : jasmine.createSpy('getPlacementByExtId'),
            getPlacementById    : jasmine.createSpy('getPlacementById'),
            getPlacementList    : jasmine.createSpy('getPlacementList'),
            updatePlacement     : jasmine.createSpy('updatePlacement'),
            createWebsite       : jasmine.createSpy('createWebsite'),
            getWebsiteByExtId   : jasmine.createSpy('getWebsiteByExtId'),
            getWebsiteById      : jasmine.createSpy('getWebsiteById'),
            getWebsiteList      : jasmine.createSpy('getWebsiteList'),
            deleteWebsite       : jasmine.createSpy('deleteWebsite'),
            updateWebsite       : jasmine.createSpy('updateWebsite')
        };
        
        spyOn(mockSUtils,'createSoapSSLClient');
        spyOn(mockSUtils,'makeAdmin');
        spyOn(mockSUtils,'createObject');
        spyOn(mockSUtils,'deleteObject');
        spyOn(mockSUtils,'getList');
        spyOn(mockSUtils,'getObject');
        spyOn(mockSUtils,'updateObject');
        
    });
    
    it('uses soaputils makeAdmin to create admin',function(){
        var args, mockKey = {}, mockCert = {};
        website.createAdmin(mockKey,mockCert);
        args = mockSUtils.makeAdmin.calls[0].args;
        expect(args[0]).toEqual(mockKey);
        expect(args[1]).toEqual(mockCert);
        expect(args[2]).toEqual(website);
        expect(args[3]).toEqual([
            'createPage',
            'createPlacement',
            'createWebsite',
            'deletePage',
            'deletePlacement',
            'deleteWebsite',
            'getPageByExtId',
            'getPageById',
            'getPageList',
            'getPlacementByExtId',
            'getPlacementById',
            'getPlacementList',
            'getWebsiteByExtId',
            'getWebsiteById',
            'getWebsiteList',
            'updatePage',
            'updatePlacement',
            'updateWebsite'    
        ]);
    });

    
    it('createClient', function(){
        var args, key = {}, cert = {};
        website.createClient(key,cert);
        args = mockSUtils.createSoapSSLClient.calls[0].args;
        expect(args[0]).toMatch('/wsdl/WSWebsiteAdmin_v15.wsdl');
        expect(args[1]).toEqual({
            strict : true,
            endpoint :'https://ws.us-ec.adtechus.com/WSWebsiteAdmin_v15/'
        });
        expect(args[2]).toEqual(key);
        expect(args[3]).toEqual(cert);
    });

    it('createPage', function(){
        var pg = {};
        website.createPage(mockClient,pg);
        expect(mockSUtils.createObject)
            .toHaveBeenCalledWith('createPage','page',[mockClient,pg]);
    });
    
    it('deletePage', function(){
        website.deletePage(mockClient,1);
        expect(mockSUtils.deleteObject)
            .toHaveBeenCalledWith('deletePage','pageId',[mockClient,1]);
    });
    
    it('getPageByExtId', function(){
        website.getPageByExtId(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getPageByExtId','extid',[mockClient,1]);
    });

    it('getPageById', function(){
        website.getPageById(mockClient,1);
        expect(mockSUtils.getObject)
            .toHaveBeenCalledWith('getPageById',['id','col'],[mockClient,1]);
    });

    it('getPageList', function(){
        website.getPageList(mockClient);
        expect(mockSUtils.getList)
            .toHaveBeenCalledWith('getPageList','Page','col',[mockClient]);
    });

    it('updatePage', function(){
        var upd = {};
        website.updatePage(mockClient,upd);
        expect(mockSUtils.updateObject)
            .toHaveBeenCalledWith('updatePage','page',[mockClient,upd]);
    });

    describe('createPlacement', function(){
        it('maps parameters to parameter properties',function(done){
            var placement = {  };
            mockClient.createPlacement.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : {}  }]);
                });
            });

            website.createPlacement(mockClient,placement)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    var args = mockClient.createPlacement.calls[0].args;
                    expect(args[0]).toEqual({
                        pl : placement
                    });
                })
                .done(done);
        });
        
        it('rejects if the placement create fails',function(done){
            var placement = {  }, err = new Error('err');
            mockClient.createPlacement.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(err);
                });
            });

            website.createPlacement(mockClient,placement)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(err);
                })
                .done(done);
        });
    });
   
    describe('deletePlacement', function(){
        it('returns true if the placement is deleted',function(done){
            mockClient.deletePlacement.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[ {}, "" ]);
                });
            });

            website.deletePlacement(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                   
                    expect(resolveSpy).toHaveBeenCalledWith(true);
                    expect(mockClient.deletePlacement.calls[0].args[0])
                        .toEqual({placeId:1});
                })
                .done(done);
        });

        it('rejects if the placement is not deleted', function(done){
            var e = new Error('error');
            mockClient.deletePlacement.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(e);
                });
            });

            website.deletePlacement(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(e);
                })
                .done(done);
        });
    });

    describe('getPlacementById', function(){
        it ('proxies to the client getPlacementById', function(done){
            mockClient.getPlacementById.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : {}  }]);
                });
            });
            
            website.getPlacementById(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    expect(mockClient.getPlacementById.calls[0].args[0])
                        .toEqual({id:1,col:mockSUtils.nil});
                })
                .done(done);
        });

        it('rejects with error if not found', function(done){
            mockClient.getPlacementById.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{},'<>']);
                });
            });
            website.getPlacementById(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy.calls[0].args[0].message)
                        .toEqual('Unable to locate page: 1.');
                })
                .done(done);
        });
    });

    describe('getPlacementByExtId', function(){
        it ('proxies to the client getPlacementByExtId', function(done){
            mockClient.getPlacementByExtId.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : {}  }]);
                });
            });
            
            website.getPlacementByExtId(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    expect(mockClient.getPlacementByExtId.calls[0].args[0])
                        .toEqual({extid:1});
                })
                .done(done);
        });

        it('rejects with error if not found', function(done){
            mockClient.getPlacementByExtId.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{},'<>']);
                });
            });
            website.getPlacementByExtId(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy.calls[0].args[0].message)
                        .toEqual('Unable to locate page: 1.');
                })
                .done(done);
        });

    });

    describe('getPlacementList', function(){
        it ('returns an array with one result if one result is found', function(done){
            var mockPlacement = {
                name : 'test',
                id   : 1
            };
            mockClient.getPlacementList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : { Placement : mockPlacement  }  }, '']);
                });
            });
            
            website.getPlacementList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockPlacement]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });


        it ('returns an array with multipe results if multiple results found', function(done){
            var mockPlacement = {
                name : 'test',
                id   : 1
            };
            mockClient.getPlacementList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : { Placement : { 0 : mockPlacement, 1 : mockPlacement } } }, '']);
                });
            });
            
            website.getPlacementList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockPlacement,mockPlacement]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });

        it('returns an empty array if no sites are found', function(done){
            mockClient.getPlacementList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ }, '']);
                });
            });
            
            website.getPlacementList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });
    });
    
    describe('updatePlacement', function(){
        it('returns true if the placement is updated',function(done){
            var placement = {};
            mockClient.updatePlacement.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[ { response : {x:1} }, "" ]);
                });
            });

            website.updatePlacement(mockClient,placement)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                   
                    expect(resolveSpy).toHaveBeenCalledWith({x:1});
                    expect(mockClient.updatePlacement.calls[0].args[0]).toEqual({pl:placement});
                })
                .done(done);
        });

        it('rejects if the placement is not updated', function(done){
            var e = new Error('error');
            mockClient.updatePlacement.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(e);
                });
            });

            website.updatePlacement(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(e);
                })
                .done(done);
        });

    });
    

    
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

    describe('updateWebsite', function(){
        it('returns true if the website is updated',function(done){
            var site = {};
            mockClient.updateWebsite.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[ { response : {x:1} }, "" ]);
                });
            });

            website.updateWebsite(mockClient,site)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                   
                    expect(resolveSpy).toHaveBeenCalledWith({x:1});
                    expect(mockClient.updateWebsite.calls[0].args[0]).toEqual({site:site});
                })
                .done(done);
        });

        it('rejects if the website is not updated', function(done){
            var e = new Error('error');
            mockClient.updateWebsite.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(e);
                });
            });

            website.updateWebsite(mockClient,1)
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

    describe('getWebsiteByExtId', function(){
        it ('proxies to the client getWebsiteByExtId', function(done){
            mockClient.getWebsiteByExtId.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : {}  }]);
                });
            });
            
            website.getWebsiteByExtId(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    expect(mockClient.getWebsiteByExtId.calls[0].args[0])
                        .toEqual({extid:1});
                })
                .done(done);
        });

        it('rejects with error if not found', function(done){
            mockClient.getWebsiteByExtId.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{},'<>']);
                });
            });
            website.getWebsiteByExtId(mockClient,1)
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
});
