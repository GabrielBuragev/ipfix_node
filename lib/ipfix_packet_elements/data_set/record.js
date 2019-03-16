var FieldSpecifier = require('./field_specifier');
var DataSetRecord = function(buffer, params){
    this.templateId = undefined;
    this.dataSetType = undefined;
    this.Fields = [];
    var template = params.template;

    var self = this;

    var _construct = function() {
        var i = 0;
        self.templateId = buffer.readUInt16BE(i);
        //Prepare buffer for the record
        buffer = buffer.slice(4);

        var currentField = 0;

        var CachedFieldSpecifiers = template.FieldSpecifiers;
        var cfsLength = Object.keys(CachedFieldSpecifiers).length
        var currentField = 0;
        
        while (currentField < cfsLength) {
            var cachedField = CachedFieldSpecifiers[currentField];
            var FreshField = new FieldSpecifier(buffer, cachedField, params);
            self.Fields.push(FreshField);
            buffer = buffer.slice(FreshField.sizeInBytes);
            currentField++;
        }
    
        return this;
    };

    _construct();
    return this;
};

module.exports = DataSetRecord;