var TemplateRecordFieldSpecifier = function(buffer) {
    var self = this;
    this.fieldId = undefined;
    this.fieldLength = undefined;
    var _construct = function() {
        self.fieldId = buffer.readUInt16BE(0);
        self.fieldLength = buffer.readUInt16BE(2);
        return;
    };

    _construct();
    return this;
};

module.exports = TemplateRecordFieldSpecifier;