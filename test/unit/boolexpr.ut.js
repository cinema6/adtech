describe('boolexpr',function(){
    var BoolExpression, AOVE, nil;
    beforeEach(function(){
        BoolExpression = require('../../lib/boolexpr');
        AOVE     = require('../../lib/aove');
        nil      = require('../../lib/soaputils').nil;
    });

    describe('toXml',function(){
        var expr;
        beforeEach(function(){
            expr = new BoolExpression();
        });

        it('uses ns0:boolExpr as a default tagName',function(){
            expect(expr.toXml()).toMatch('<ns0:boolExpr');
        });

        it('uses passed tagname if set',function(){
            expect(expr.toXml('myTag')).toMatch('<myTag');
        });

        it('returns nil tag if no expressions set',function(){
            expect(expr.toXml()).toEqual('<ns0:boolExpr xsi:nil="true"/>');
        });

        it('formats a valid xml tag if it has list expressions',function(){
            var e = new AOVE.LongListExpression('attr1',[12345, 23456]);
            expr.addExpression(e);
            expect(expr.toXml()).toEqual('<ns0:boolExpr xmlns:hel="http://systinet.com/wsdl/de/adtech/helios/" xmlns:sys="http://systinet.com/containers/literal/ms.net" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xsi:type="hel:BoolExpression"><hel:expressions xsi:type="sys:Vector"><sys:Items><sys:Item xsi:type="hel:AttributeOperatorValueExpression"><hel:expressions xsi:nil="true" /><hel:attribute xsi:type="xsd:string">attr1</hel:attribute><hel:operator xsi:type="xsd:string">IN</hel:operator><hel:value xsi:type="sys:Vector" ><sys:Items xmlns:cm="http://www.w3.org/2001/XMLSchema"><sys:Item xsi:type="cm:long">12345</sys:Item><sys:Item xsi:type="cm:long">23456</sys:Item></sys:Items></hel:value></sys:Item></sys:Items></hel:expressions></ns0:boolExpr>');
        });
        it('formats a valid xml tag if it has value',function(){
            var e = new AOVE.LongExpression('attr1',12345);
            expr.addExpression(e);
            expect(expr.toXml()).toEqual('<ns0:boolExpr xmlns:hel="http://systinet.com/wsdl/de/adtech/helios/" xmlns:sys="http://systinet.com/containers/literal/ms.net" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xsi:type="hel:BoolExpression"><hel:expressions xsi:type="sys:Vector"><sys:Items><sys:Item xsi:type="hel:AttributeOperatorValueExpression"><hel:expressions xsi:nil="true" /><hel:attribute xsi:type="xsd:string">attr1</hel:attribute><hel:operator xsi:type="xsd:string">==</hel:operator><hel:value xsi:type="xsd:long">12345</hel:value></sys:Item></sys:Items></hel:expressions></ns0:boolExpr>');
        });
    });
});

