describe('AOVE',function(){
    var AOVE, nil;
    beforeEach(function(){
        AOVE = require('../../lib/aove');
        nil  = require('../../lib/soaputils').nil;
    });

    describe('Expressions',function(){
        it('IntExpression',function(){
            var e = new AOVE.IntExpression('attr1',10);
            expect(e.valueOf()).toEqual({
                attributes : {
                    'xsi:type' : 'hel:AttributeOperatorValueExpression'
                },
                expressions : nil,
                attribute   : 'attr1',
                operator    : '==',
                value : {
                    attributes : {
                        'xsi:type' : 'xsd:int'
                    },
                    $value : 10
                }
            });
        });
        
        it('LongExpression',function(){
            var e = new AOVE.LongExpression('attr1',10);
            expect(e.valueOf()).toEqual({
                attributes : {
                    'xsi:type' : 'hel:AttributeOperatorValueExpression'
                },
                expressions : nil,
                attribute   : 'attr1',
                operator    : '==',
                value : {
                    attributes : {
                        'xsi:type' : 'xsd:long'
                    },
                    $value : 10
                }
            });
        });
        
        it('StringExpression',function(){
            var e = new AOVE.StringExpression('attr1','val1');
            expect(e.valueOf()).toEqual({
                attributes : {
                    'xsi:type' : 'hel:AttributeOperatorValueExpression'
                },
                expressions : nil,
                attribute   : 'attr1',
                operator    : '==',
                value : {
                    attributes : {
                        'xsi:type' : 'xsd:string'
                    },
                    $value : 'val1' 
                }
            });
        });

        it('BooleanExpression',function(){
            var e = new AOVE.BooleanExpression('attr1',true);
            expect(e.valueOf()).toEqual({
                attributes : {
                    'xsi:type' : 'hel:AttributeOperatorValueExpression'
                },
                expressions : nil,
                attribute   : 'attr1',
                operator    : '==',
                value : {
                    attributes : {
                        'xsi:type' : 'xsd:boolean'
                    },
                    $value : true
                }
            });
        });
    });
    
    describe('AOVE',function(){
        var filter, e1, e2;
        beforeEach(function(){
            filter = new AOVE();    
            e1 = new AOVE.LongExpression('field1',1);
            e2 = new AOVE.StringExpression('field2','val2','LIKE');
        });
        it('initializes with empty expressions', function(){
            expect(filter.expressions.length).toEqual(0); 
        });

        it('addExpression adds expressions objects to expressions list',function(){
            expect(filter.expressions.length).toEqual(0); 
            filter.addExpression(e1);
            filter.addExpression(e2);
            expect(filter.expressions.length).toEqual(2); 
            expect(filter.expressions[0]).toBe(e1);   
            expect(filter.expressions[1]).toBe(e2);   
        });

        it('valueOf generates object literal', function(){
            filter.addExpression(e1);
            filter.addExpression(e2);
            expect(filter.valueOf()).toEqual({
                expressions : {
                    Items : {
                        attributes : {
                            'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema',
                            'xmlns:hel' : 'http://systinet.com/wsdl/de/adtech/helios/'
                        },
                        Item : [
                            {
                                attributes : {
                                    'xsi:type' : 'hel:AttributeOperatorValueExpression'
                                },
                                expressions : nil,
                                attribute   : 'field1',
                                operator    : '==',
                                value : {
                                    attributes : {
                                        'xsi:type' : 'xsd:long'
                                    },
                                    $value : 1
                                }
                            },
                            {
                                attributes : {
                                    'xsi:type' : 'hel:AttributeOperatorValueExpression'
                                },
                                expressions : nil,
                                attribute   : 'field2',
                                operator    : 'LIKE',
                                value : {
                                    attributes : {
                                        'xsi:type' : 'xsd:string'
                                    },
                                    $value : 'val2' 
                                }
                            }                    
                        ]
                    }
                }
            });
        });

        it('valueOf empty aove throws an error',function(){
            expect(function(){
                filter.valueOf()
            }).toThrow('AOVE has no expressions!');

        });

    });

});


