describe('campaign',function(){
    var flush = true, q, campaign, mockSUtils, resolveSpy, rejectSpy, mockClient;
    beforeEach(function(){
        if (flush) { for (var m in require.cache){ delete require.cache[m]; } flush = false; }
        campaign     = require('../../lib/campaign');
        mockSUtils   = require('../../lib/soaputils');
        q            = require('q');
        resolveSpy   = jasmine.createSpy('resolve');
        rejectSpy    = jasmine.createSpy('reject');
        
        mockClient = {
            deleteCampaign       : jasmine.createSpy('deleteCampaign'),
            getCampaignByExtId   : jasmine.createSpy('getCampaignByExtId'),
            getCampaignById      : jasmine.createSpy('getCampaignById'),
            getCampaignList      : jasmine.createSpy('getCampaignList'),
            getCampaignTypeList  : jasmine.createSpy('getCampaignTypeList'),
            getOptimizerTypeList : jasmine.createSpy('getOptimizerTypeList')
        };

    });
    
    describe('createAdmin', function(){
        beforeEach(function(){
            spyOn(mockSUtils,'makeAdmin');
        });

        it('uses soaputils makeAdmin to create admin',function(done){
            var mockKey = {}, mockCert = {};
            mockSUtils.makeAdmin.andReturn(q({}));
            
            campaign.createAdmin(mockKey,mockCert)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    var args = mockSUtils.makeAdmin.calls[0].args;
                    expect(args[0]).toEqual(mockKey);
                    expect(args[1]).toEqual(mockCert);
                    expect(args[2]).toEqual(campaign);
                    expect(args[3]).toEqual([
                        'deleteCampaign',
                        'getCampaignByExtId',
                        'getCampaignById',
                        'getCampaignList',
                        'getCampaignTypeList',
                        'getOptimizerTypeList'
                    ]);
                })
                .done(done);
        });
    });

    describe('createClient',function(){
        beforeEach(function(){
            spyOn(mockSUtils,'createSoapSSLClient');
        });

        it('should resolve with a client if succeeds',function(done){
            var client = {}, key = {}, cert = {};
            mockSUtils.createSoapSSLClient.andReturn(q(client));
            campaign.createClient(key,cert)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith(client);
                    expect(rejectSpy).not.toHaveBeenCalled(); 

                    var args = mockSUtils.createSoapSSLClient.calls[0].args;
                    expect(args[0]).toMatch('./wsdl/WSCampaignAdmin_v28.wsdl');
                    expect(args[1]).toEqual({
                        strict : true,
                        endpoint :'https://ws.us-ec.adtechus.com/WSCampaignAdmin_v28/'
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
            campaign.createClient()
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(err); 
                })
                .done(done);
        });

    });

    describe('deleteCampaign', function(){
        it('returns true if the website is deleted',function(done){
            mockClient.deleteCampaign.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[ {}, "" ]);
                });
            });

            campaign.deleteCampaign(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                   
                    expect(resolveSpy).toHaveBeenCalledWith(true);
                    expect(mockClient.deleteCampaign.calls[0].args[0])
                        .toEqual({camid:1});
                })
                .done(done);
        });

        it('rejects if the website is not deleted', function(done){
            var e = new Error('error');
            mockClient.deleteCampaign.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(e);
                });
            });

            campaign.deleteCampaign(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy).toHaveBeenCalledWith(e);
                })
                .done(done);
        });

    });

    describe('getCampaignByExtId', function(){
        it ('proxies to the client getCampaignByExtId', function(done){
            mockClient.getCampaignByExtId.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : {}  }]);
                });
            });
            
            campaign.getCampaignByExtId(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    expect(mockClient.getCampaignByExtId.calls[0].args[0])
                        .toEqual({extid:1});
                })
                .done(done);
        });

        it('rejects with error if not found', function(done){
            mockClient.getCampaignByExtId.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{},'<>']);
                });
            });
            campaign.getCampaignByExtId(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy.calls[0].args[0].message)
                        .toEqual('Unable to locate campaign: 1.');
                })
                .done(done);
        });

    });

    describe('getCampaignById', function(){
        it ('proxies to the client getCampaignById', function(done){
            mockClient.getCampaignById.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : {}  }]);
                });
            });
            
            campaign.getCampaignById(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalled();
                    expect(rejectSpy).not.toHaveBeenCalled();
                    
                    expect(mockClient.getCampaignById.calls[0].args[0])
                        .toEqual({id:1});
                })
                .done(done);
        });

        it('rejects with error if not found', function(done){
            mockClient.getCampaignById.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{},'<>']);
                });
            });
            campaign.getCampaignById(mockClient,1)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).not.toHaveBeenCalled();
                    expect(rejectSpy.calls[0].args[0].message)
                        .toEqual('Unable to locate campaign: 1.');
                })
                .done(done);
        });
    });

    describe('getCampaignList', function(){
        it ('returns an array with one result if one result is found', function(done){
            var mockCampaign = {
                name : 'test',
                id   : 1
            };
            mockClient.getCampaignList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : { Campaign : mockCampaign  }  }, '']);
                });
            });
            
            campaign.getCampaignList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockCampaign]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });


        it ('returns an array with multipe results if multiple results found', function(done){
            var mockCampaign = {
                name : 'test',
                id   : 1
            };
            mockClient.getCampaignList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response:{Campaign: [mockCampaign,mockCampaign]}}, '']);
                });
            });
            
            campaign.getCampaignList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockCampaign,mockCampaign]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });

        it('returns an empty array if no sites are found', function(done){
            mockClient.getCampaignList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ }, '']);
                });
            });
            
            campaign.getCampaignList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });
    });

    describe('getCampaignTypeList', function(){
        it ('returns an array with one result if one result is found', function(done){
            var mockCampType = {
                name : 'test',
                id   : 1
            };
            mockClient.getCampaignTypeList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : { CampaignType : mockCampType  }  }, '']);
                });
            });
            
            campaign.getCampaignTypeList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockCampType]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });


        it ('returns an array with multipe results if multiple results found', function(done){
            var mockCampType = {
                name : 'test',
                id   : 1
            };
            mockClient.getCampaignTypeList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response:{CampaignType: [mockCampType,mockCampType]}}, '']);
                });
            });
            
            campaign.getCampaignTypeList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockCampType,mockCampType]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });

        it('returns an empty array if no sites are found', function(done){
            mockClient.getCampaignTypeList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ }, '']);
                });
            });
            
            campaign.getCampaignTypeList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });
    });

    describe('getOptimizerTypeList', function(){
        it ('returns an array with one result if one result is found', function(done){
            var mockOptType = {
                name : 'test',
                id   : 1
            };
            mockClient.getOptimizerTypeList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response : { OptimizerType : mockOptType  }  }, '']);
                });
            });
            
            campaign.getOptimizerTypeList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockOptType]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });


        it ('returns an array with multipe results if multiple results found', function(done){
            var mockOptType = {
                name : 'test',
                id   : 1
            };
            mockClient.getOptimizerTypeList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ response:{OptimizerType: [mockOptType,mockOptType]}}, '']);
                });
            });
            
            campaign.getOptimizerTypeList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([mockOptType,mockOptType]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });

        it('returns an empty array if no sites are found', function(done){
            mockClient.getOptimizerTypeList.andCallFake(function(opts,cb){
                process.nextTick(function(){
                    cb(null,[{ }, '']);
                });
            });
            
            campaign.getOptimizerTypeList(mockClient)
                .then(resolveSpy,rejectSpy)
                .then(function(){
                    expect(resolveSpy).toHaveBeenCalledWith([]);
                    expect(rejectSpy).not.toHaveBeenCalled();
                })
                .done(done);
        });
    });


});
