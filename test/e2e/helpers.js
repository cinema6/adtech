module.exports = {

        uuid : function(){
            var  result = '', digit, hash;
            for (var i =0; i < 40; i++){
                digit = Math.floor(Math.random() * 999999999) % 36;
                if (digit < 26){
                    result += String.fromCharCode(digit + 97);
                } else {
                    result += (digit - 26).toString();
                }
            }
            hash = require('crypto').createHash('sha1');
            hash.update(result);
            return hash.digest('hex').slice(0,9);
        },

        findSpyArg : function(call,arg){
            if (this && this.calls && this.calls[call || 0]) {
                return this.calls[call || 0].args[arg || 0] || {};
            }
            return {};
        },

        setupSpy   : function(spyName){
            var self = this, spy = jasmine.createSpy(spyName);
            spy.arg = function(call,arg) {
                return self.findSpyArg.apply(this,call,arg);
            };

            if (!self.spies){
                self.spies = {};
            }

            self.spies[spyName] = spy;

            return spy;
        },

        setExpectation : function(spyName,log){
            var self = this;
            if (!self.spies[spyName]){
                throw new Error('Need to setupSpy ' + spyName + '.');
            }
            return function(){
                expect(self.spies[spyName]).toHaveBeenCalled();
                if (log) {
                    console.log(spyName,':',self.spies[spyName].arg());
                }
            };
        }

};

