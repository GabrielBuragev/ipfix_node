var IPFIX_ENTITIES = require('./ipfix_entities');
var IpfixHeader = require('./ipfix_header');
var IpfixTemplateSet = require('./template_set/record');
var IpfixOptionsTemplateSet = require('./options_template_set/record');
var IpfixDataSet = require('./data_set/record');
var IpfixGenericSet = require('./ipfix_generic_set');

var IpfixPacket = function(params) {
    var self = this;
    var buffer = params.buffer;
    this.Header = undefined;
    this.TemplateSets = [];
    this.OptionsTemplateSets = [];
    this.DataSets = [];

    var _construct = function(buffer) {
        self.Header = new IpfixHeader(buffer);
        buffer = buffer.slice(self.Header.sizeInBytes);
        while (buffer.byteLength > 0) {
            

            var Template = new IpfixGenericSet(buffer);
            if (Template.Set instanceof IpfixTemplateSet) {
                TemplateSetMap.set(Template.Set.templateId, Template.Set);
                self.TemplateSets.push(Template.Set);
            } else if (Template.Set instanceof IpfixDataSet)
                self.DataSets.push(Template.Set);
            else if (Template.Set instanceof IpfixOptionsTemplateSet){
                OptionsTemplateSetMap.set(Template.Set.templateId, Template.Set);   
                self.OptionsTemplateSets.push(Template.Set);
            }

            
            buffer = buffer.slice(Template.sizeInBytes);
        }
    }

    var clearPaddingIfAny = function(buff){
        console.log(buff.readUInt16BE(2));
    }
    _construct(buffer);
    return this;
}

IpfixPacket.prototype.IpfixHeader = IpfixHeader;
module.exports = IpfixPacket;