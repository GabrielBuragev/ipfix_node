var IpfixPacket = require('./lib/ipfix_packet_elements/ipfix_packet');

var Deserializer = function(params) {
    var self = this;
    var defaultConf = {
        parseDataValues: true,
        templateProvider: undefined,
        onNewTemplate: undefined,
        useInternalStorage: true,
    }
    this.Storage = require('./lib/storage/template_storage.js');
    this.conf = Object.assign(defaultConf, params);
    this.deserialize = function(buffer) {

        if (typeof IpfixPacket == 'function') {
            return new Promise(function(resolve, reject) {
                try{
                    var parseParams = prepareParams();
                    parseParams = Object.assign(parseParams, {buffer:buffer});
                    var ParsedPacket = new IpfixPacket(parseParams);
                    resolve(ParsedPacket);
                }catch(e){
                    reject(e);
                }
            });
        } else {
            return console.error('Please provide a template, or tell the developer to provide this script with a default one !');
        }

    };
    var prepareParams = function(){
        var params = {};
        params = Object.assign(params, self.conf);
        if(typeof self.conf.templateProvider == 'undefined')
            params = Object.assign(params, { templates: self.Storage });

        return params;
    }
    var getStorageByType = function(type){
        if(type == 'DataTemplate')
            return Storage.DataTemplateMap;
        else if(type == 'OptionsTemplate')
            return Storage.OptionsTemplateMap;
    }
    return this;
}

module.exports = function(params) {
    var params = params || {};
    return new Deserializer(params);
}