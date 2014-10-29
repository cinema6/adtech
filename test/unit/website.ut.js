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
            createPage          : jasmine.createSpy('createPage'),
            deletePage          : jasmine.createSpy('deletePage'),
            getPageByExtId      : jasmine.createSpy('getPageByExtId'),
            getPageById         : jasmine.createSpy('getPageById'),
            getPageList         : jasmine.createSpy('getPageList'),
            updatePage          : jasmine.createSpy('updatePage'),
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
    
    describe('createPage', function(){
        it('maps parameters to parameter properties',function(done){
            var page = {  };
            mockClient.createPage.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : {}  }]);
                });
            });

            website.createPage(mockClient,page)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    var args = mockClient.createPage.calls[0].args;
                    expect(args[0]).toEqual({
                        page : page
                    });
                })
                .done(done);
        });
        
        it('rejects if the website create fails',function(done){
            var page = {  }, err = new Error('err');
            mockClient.createPage.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(err);
                });
            });

            website.createPage(mockClient,page)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(err);
                })
                .done(done);
        });
    });
    
    describe('deletePage', function(){
        it('returns true if the website is deleted',function(done){
            mockClient.deletePage.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[ {}, "" ]);
                });
            });

            website.deletePage(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                   
                    expect(resolveSpy).toHaveBeenCalledWith(true);
                    expect(mockClient.deletePage.calls[0].args[0])
                        .toEqual({pageId:1});
                })
                .done(done);
        });

        it('rejects if the website is not deleted', function(done){
            var e = new Error('error');
            mockClient.deletePage.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(e);
                });
            });

            website.deletePage(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(e);
                })
                .done(done);
        });

    });

    describe('getPageById', function(){
        it ('proxies to the client getPageById', function(done){
            mockClient.getPageById.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : {}  }]);
                });
            });
            
            website.getPageById(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    expect(mockClient.getPageById.calls[0].args[0])
                        .toEqual({id:1,col:mockSUtils.nil});
                })
                .done(done);
        });

        it('rejects with error if not found', function(done){
            mockClient.getPageById.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{},'<>']);
                });
            });
            website.getPageById(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy.calls[0].args[0].message)
                        .toEqual('Unable to locate page: 1.');
                })
                .done(done);
        });
    });

    describe('getPageByExtId', function(){
        it ('proxies to the client getPageByExtId', function(done){
            mockClient.getPageByExtId.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : {}  }]);
                });
            });
            
            website.getPageByExtId(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    expect(mockClient.getPageByExtId.calls[0].args[0])
                        .toEqual({extid:1});
                })
                .done(done);
        });

        it('rejects with error if not found', function(done){
            mockClient.getPageByExtId.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{},'<>']);
                });
            });
            website.getPageByExtId(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy.calls[0].args[0].message)
                        .toEqual('Unable to locate page: 1.');
                })
                .done(done);
        });

    });

    describe('getPageList', function(){
        it ('returns an array with one result if one result is found', function(done){
            var mockPage = {
                name : 'test',
                id   : 1
            };
            mockClient.getPageList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : { Page : mockPage  }  }, '']);
                });
            });
            
            website.getPageList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockPage]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });


        it ('returns an array with multipe results if multiple results found', function(done){
            var mockPage = {
                name : 'test',
                id   : 1
            };
            mockClient.getPageList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : { Page : { 0 : mockPage, 1 : mockPage } } }, '']);
                });
            });
            
            website.getPageList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockPage,mockPage]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });

        it('returns an empty array if no sites are found', function(done){
            mockClient.getPageList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ }, '']);
                });
            });
            
            website.getPageList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });
    });
    
    describe('updatePage', function(){
        it('returns true if the page is updated',function(done){
            var page = {};
            mockClient.updatePage.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[ { response : {} }, "" ]);
                });
            });

            website.updatePage(mockClient,page)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                   
                    expect(resolveSpy).toHaveBeenCalledWith({});
                    expect(mockClient.updatePage.calls[0].args[0]).toEqual({page:page});
                })
                .done(done);
        });

        it('rejects if the page is not updated', function(done){
            var e = new Error('error');
            mockClient.updatePage.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(e);
                });
            });

            website.updatePage(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(e);
                })
                .done(done);
        });

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
                        .toEqual({pageId:1});
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
                    cb(null,[ { response : {} }, "" ]);
                });
            });

            website.updatePlacement(mockClient,placement)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                   
                    expect(resolveSpy).toHaveBeenCalledWith({});
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
                    cb(null,[ { response : {} }, "" ]);
                });
            });

            website.updateWebsite(mockClient,site)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                   
                    expect(resolveSpy).toHaveBeenCalledWith({});
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
                })
                .done(done);
        });
    });
});
