var IpfixHeader = require('./ipfix_header');
var TemplateRecord = require('./template_set/record');
var OptionsTemplateRecord = require('./options_template_set/record');
var DataSetRecord = require('./data_set/record');

var IpfixPacket = function(params) {
    var self = this;
    var buffer = params.buffer;
    var cachedTemplates = params.templates;
    var templateProvider = params.templateProvider;
    var onNewTemplate = params.onNewTemplate;
    var useInternalStorage = params.useInternalStorage;
    this.Header = undefined;
    this.TemplateSets = [];
    this.OptionsTemplateSets = [];
    this.DataSets = [];
    var _construct = function(buffer) {
        self.Header = new IpfixHeader(buffer);
        buffer = buffer.slice(self.Header.sizeInBytes);
        while (buffer.byteLength > 0) {
            var setId = buffer.readUInt16BE(0);
            var setType = getSetType(setId);
            var sizeInBytes = buffer.readUInt16BE(2);
            if (setType == 'DataTemplate') {
                var TemplateSet = new TemplateRecord(buffer);

                storeTemplate(TemplateSet);
                self.TemplateSets.push(TemplateSet);
            } else if (setType == 'OptionTemplate') {
                var OptionsTemplateSet = new OptionsTemplateRecord(buffer);
                storeTemplate(OptionsTemplateSet);
                self.OptionsTemplateSets.push(OptionsTemplateSet);
            } else if (setType == 'DataSet'){
                // Try to decode DataSet with templates for exporter
                var templateNeeded = getTemplateMD(buffer);
                var template = undefined;
                if(!useInternalStorage)
                {
                    if(typeof templateProvider === 'function')
                        template = templateProvider(templateNeeded.id);
                    else
                    throw new Error('Please provide a templateProvider function or set useInternalStorage to true !');
                }
                else if(typeof cachedTemplates != 'undefined'){
                    if(cachedTemplates.DataTemplateMap.has(templateNeeded.id))
                        template = cachedTemplates.DataTemplateMap.get(templateNeeded.id);
                    else if(cachedTemplates.OptionsTemplateMap.has(templateNeeded.id))
                        template = cachedTemplates.OptionsTemplateMap.get(templateNeeded.id);
                    else{
                        console.error(`Couldn't deserialize template with id ${templateNeeded.id}`);
                        return console.error(`Missing template with id ${templateNeeded.id} in local storage ! `);
                    }
                }
                else {
                    throw new Error('Please provide a templateProvider function or set useInternalStorage to true !');
                }  
                if(typeof template == 'undefined')
                    return console.error(`Couldn't fetch template with id ${templateNeeded.id}`)
                try{
                    var DataSet = new DataSetRecord(buffer,{template: template, parseDataValues: params.parseDataValues});
                    self.DataSets.push(DataSet);
                }catch(e){
                    console.error(e);
                    console.error(`Couldn't deserialize template with id ${templateNeeded.id}`);
                    console.error(`Template with id ${templateNeeded.id} has invalid structure !`);
                }
            }

            buffer = buffer.slice(sizeInBytes);
        }
    };
    var getTemplateMD = function(buffer){
        var templateId = buffer.readUInt16BE(0);
        return {
            id: templateId
        };
    };
    var storeTemplate = function(template){
        var templateType = undefined;
        if(template instanceof OptionsTemplateRecord)
            templateType = 'OptionsTemplate';
        else if(template instanceof TemplateRecord)
            templateType = 'DataTemplate';
        if(useInternalStorage){
            if(templateType == 'OptionsTemplate')
                cachedTemplates.OptionsTemplateMap.set(template.templateId, template);
            else if(templateType == 'DataTemplate')
                cachedTemplates.DataTemplateMap.set(template.templateId, template);
        }
        else{
            if(typeof onNewTemplate != 'undefined')
                onNewTemplate.call(self,template,templateType);
            else
                console.error(`Please provde a 'onNewTemplate' option so we can keep you updated with templates, otherwise set 'useInternalStorage' to true so i can do all the work by myself.`);
        }
    }
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
}

IpfixPacket.prototype.IpfixHeader = IpfixHeader;
module.exports = IpfixPacket;