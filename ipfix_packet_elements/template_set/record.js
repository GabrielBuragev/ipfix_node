var TemplateRecordFieldSpecifier = require('./field_specifier');
var TemplateRecord = function(buffer) {
    var self = this;
    this.templateId = undefined;
    this.numberFields = undefined;
    this.FieldSpecifiers = []
    var _construct = function() {
        var i = 0;
        self.setId = buffer.readUInt16BE(i)
        self.sizeInBytes = buffer.readUInt16BE(i += 2);
        self.templateId = buffer.readUInt16BE(i += 2);
        self.numberFields = buffer.readUInt16BE(i += 2);
        buffer = buffer.slice(i += 2);

        while (i < self.sizeInBytes) {
            var FreshSpecifier = new TemplateRecordFieldSpecifier(buffer);
            self.FieldSpecifiers.push(FreshSpecifier);
            buffer = buffer.slice(4);
            i += 4;
        }
        return this;
    }

    _construct();
    return this;
};

module.exports = TemplateRecord;