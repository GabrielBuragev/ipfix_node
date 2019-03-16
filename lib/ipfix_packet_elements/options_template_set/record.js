var FieldSpecifier = require('./field_specifier');
var OptionsTemplateRecord = function(buffer){
    // Self explaining
    this.templateId = undefined;
    // Number of all fields in this Options Template Record, including the Scope Fields.
    this.numberFields = undefined;
    // Number of scope fields in this Options Template Record
    this.scopeFieldCount = undefined;
    this.setId = undefined;
    this.sizeInBytes = undefined;
    this.FieldSpecifiers = [];

    var self = this;
    
    var _construct = function() {
        var i = 0;
        self.setId = buffer.readUInt16BE(i)
        self.sizeInBytes = buffer.readUInt16BE(i += 2);
        self.templateId = buffer.readUInt16BE(i += 2);
        self.numberFields = buffer.readUInt16BE(i += 2);
        self.scopeFieldCount = buffer.readUInt16BE(i += 2);
        buffer = buffer.slice(i += 2);

        while (i < self.sizeInBytes) {
            var FreshSpecifier = new FieldSpecifier(buffer);
            self.FieldSpecifiers.push(FreshSpecifier);
            buffer = buffer.slice(4);
            i += 4;
        }
        return this;
    }

    _construct();
    return this;
};

module.exports = OptionsTemplateRecord;