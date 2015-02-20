var util = require('util'),
    soapUtils = require('./soaputils'),
    nil = soapUtils.nil,
    k = require('./constants').IAttributeOperatorValueExpression;

function Expression(attr, val, op) {
    this.attr = attr;
    this.val  = val;
    this.op   = op || k.OP_EQUAL;
}

Expression.prototype.valueOf = function(){
    return {
        attributes : {
            'xsi:type' : 'hel:AttributeOperatorValueExpression'
        },
        expressions : nil, //TODO: make sure to trim this for IN operations; maybe trim always?
        attribute   : this.attr,
        operator    : this.op,
        value : {
            attributes : {
                'xsi:type' : this.type
            },
            $value : this.val
        }
    };
};

function makeExpression(typ){
    var fn = function(){
        Expression.apply(this,Array.prototype.slice.call(arguments, 0)); 
        this.type = typ;
    };
    util.inherits(fn, Expression);
    return fn;
}

function ListExpression(attr, arr, op) {
    this.attr = attr;
    this.val  = arr;
    this.op   = op || k.OP_IN;
}

ListExpression.prototype.valueOf = function() {
    var collection = soapUtils.makeTypedList(
        this.type,
        this.val,
        'http://www.w3.org/2001/XMLSchema'
    );
    collection.attributes = {
        'xmlns:sys': 'http://systinet.com/containers/literal/ms.net',
        'xsi:type': 'sys:Collection'
    };

    return {
        attributes : {
            'xsi:type' : 'hel:AttributeOperatorValueExpression'
        },
        attribute   : this.attr,
        operator    : this.op,
        value : collection
    };
};

function makeListExpression(typ){
    var fn = function(){
        ListExpression.apply(this,Array.prototype.slice.call(arguments, 0)); 
        this.type = typ;
    };
    util.inherits(fn, ListExpression);
    return fn;
}

function AOVE(){
    this.expressions = [];
}

AOVE.IntExpression    = makeExpression('xsd:int');
AOVE.LongExpression   = makeExpression('xsd:long');
AOVE.StringExpression = makeExpression('xsd:string');
AOVE.BooleanExpression = makeExpression('xsd:boolean');

AOVE.IntListExpression    = makeListExpression('int');
AOVE.LongListExpression   = makeListExpression('long');
AOVE.StringListExpression = makeListExpression('string');

AOVE.prototype.clear = function() {
    this.expressions = [];
};

AOVE.prototype.addExpression = function(expr){
    this.expressions.push(expr);   
};

AOVE.prototype.valueOf = function(){
    if (!this.expressions.length){
        throw new Error('AOVE has no expressions!');
    }

    var result = {
        expressions : {
            Items : {
                attributes : {
                    'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema',
                    'xmlns:hel' : 'http://systinet.com/wsdl/de/adtech/helios/'
                },
                Item : []
            }
        }
    };

    this.expressions.forEach(function(expr){
        result.expressions.Items.Item.push(expr.valueOf());
    });

    return result;
};

module.exports = AOVE;
