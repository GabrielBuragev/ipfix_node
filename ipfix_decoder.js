var fs = require('fs');
var IpfixPacket = require('./ipfix_packet_elements/ipfix_packet');
var IPFIX_ENTITIES = require('./ipfix_packet_elements/ipfix_entities');
var Parsers = require('./ipfix_packet_elements/byte_parsers');
global.TemplateSetMap = new Map();
global.OptionsTemplateSetMap = new Map();
global.IPFIX_ENTITIES = IPFIX_ENTITIES;
global.ByteParser = Parsers;
var Decoder = function(params) {
    var parseWithTemplate = params.parsingTemplate || IpfixPacket;
    // return console.log(parseWithTemplate);
    this._decode = function(buffer) {

        if (typeof IpfixPacketSkeleton != 'undefined' || typeof IpfixPacket == 'function') {
            return new Promise(function(resolve, reject) {
                var ParsedPacket = new IpfixPacket({
                    buffer: buffer,
                });
                // console.log(ParsedPacket);
                resolve(ParsedPacket);
            });
            return ParsedPacket;
        } else {
            return console.error('Please provide a template, or tell the developer to provide this script with a default one !');
        }

    };

    return this;
}

module.exports = function(params) {
    var params = params || {};
    return new Decoder(params);
}