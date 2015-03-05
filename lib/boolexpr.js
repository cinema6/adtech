function BoolExpression(){
    this.expressions = [];
}

BoolExpression.prototype.addExpression = function(expr){
    this.expressions.push(expr);   
};

function attrify(attrs){
    var result = '', attr;
    for (attr in attrs) {
        result += ' ' + attr + '="' + attrs[attr] + '"';
    }
    return result;
}

BoolExpression.prototype.toXml = function(tagName){
    var result = '';
    tagName = tagName || 'ns0:boolExpr';
    if (this.expressions.length < 1) {
        return '<' + tagName + ' xsi:nil="true"/>';
    }

    result = '<' + tagName + attrify({
        'xmlns:hel' : 'http://systinet.com/wsdl/de/adtech/helios/',
        'xmlns:sys' : 'http://systinet.com/containers/literal/ms.net',
        'xmlns:xsd' : 'http://www.w3.org/2001/XMLSchema',
        'xsi:type'  : 'hel:BoolExpression' 
    }) + '>';
    result += '<hel:expressions xsi:type="sys:Vector">';
    result += '<sys:Items>';
    this.expressions.forEach(function(expr){
        var itm = expr.valueOf();
        //console.log('ITEM:',JSON.stringify(itm,null,3));
        result += '<sys:Item xsi:type="hel:AttributeOperatorValueExpression">';
        result += '<hel:expressions xsi:nil="true" />';
        result += '<hel:attribute xsi:type="xsd:string">' + itm.attribute + '</hel:attribute>';
        result += '<hel:operator xsi:type="xsd:string">' + itm.operator + '</hel:operator>';
        if (itm.value.$value){
            result += '<hel:value' + attrify(itm.value.attributes) + '>';
            result += itm.value.$value + '</hel:value>';
        } else 
        if (itm.value.Items) {
            result += '<hel:value xsi:type="sys:Vector" >';
            result += '<sys:Items' + attrify(itm.value.Items.attributes) + '>';
            itm.value.Items.Item.forEach(function(itm){
                result += '<sys:Item' + attrify(itm.attributes) + '>';
                result += itm.$value + '</sys:Item>';
            });
            result += '</sys:Items>';
            result += '</hel:value>';
        }
        result += '</sys:Item>';
    });
    result += '</sys:Items>';
    result += '</hel:expressions>';
    result += '</' + tagName + '>';

    return result;
};


module.exports = BoolExpression;

