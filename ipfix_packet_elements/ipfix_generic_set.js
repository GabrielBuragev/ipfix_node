var TemplateRecord = require('./template_set/record');
var OptionsTemplateRecord = require('./options_template_set/record');
var DataSetRecord = require('./data_set/record');
var GenericSet = function(buffer) {
    var self = this;
    this.setType = undefined;
    this.setId = undefined;
    this.sizeInBytes = undefined;
    this.Set = undefined;
    var _construct = function(buffer) {

        self.setId = buffer.readUInt16BE(0);
        self.setType = getSetType(self.setId);
        self.sizeInBytes = buffer.readUInt16BE(2);
        if (self.setType == 'DataTemplate') {
            return self.Set = new TemplateRecord(buffer);
        } else if (self.setType == 'OptionTemplate') {
            return self.Set = new OptionsTemplateRecord(buffer);
        } else if (self.setType == 'DataSet')
            return self.Set = new DataSetRecord(buffer);

        return;
    };
    var getSetType = function(setId) {
        if (setId == 2)
            return 'DataTemplate';
        else if (setId == 3)
            return 'OptionTemplate';
        else if (setId > 255)
            return 'DataSet';
    }
    _construct(buffer);
    return this;
};
module.exports = GenericSet;