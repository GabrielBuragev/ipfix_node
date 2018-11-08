var FieldSpecifier = require('./field_specifier');
var DataSetRecord = function(buffer){
   
    this.templateId = undefined;
    this.sizeInBytes = undefined;
    this.Fields = [];

    var self = this;

    var _construct = function() {
        var i = 0;
        self.templateId = buffer.readUInt16BE(i);
        //Prepare buffer for the record
        buffer = buffer.slice(4);

        var currentField = 0;
        var CachedTemplate = TemplateSetMap.get(self.templateId) || OptionsTemplateSetMap.get(self.templateId);
        
        if(typeof CachedTemplate != 'undefined'){
            var CachedFieldSpecifiers = CachedTemplate.FieldSpecifiers;
            var currentField = 0;

            while (currentField < Object.keys(CachedFieldSpecifiers).length) {
                var cachedField = CachedFieldSpecifiers[currentField];
                var FreshField = new FieldSpecifier(buffer, cachedField);
                self.Fields.push(FreshField);
                buffer = buffer.slice(FreshField.sizeInBytes);
                currentField++;
            }

        }else{
            throw new Error(`ERROR: Cannot recognize template id for decoding : ${self.templateId} `);
        }
        
        return this;
    }

    _construct();
    return this;
};

module.exports = DataSetRecord;