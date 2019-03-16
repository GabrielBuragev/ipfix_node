var bignum = require('bignum');
var ByteParser = require('../../utils/byte_parsers');
var IPFIX_ENTITIES = require('../../../static/ipfix_entities');
var DataSetFieldSpecifier = function(buffer, cachedField, params) {
    var self = this;

    var shouldParse = params.parseDataValues;
    var cachedFieldLength = cachedField.fieldLength;
    var cachedFieldMetadata = IPFIX_ENTITIES[cachedField.fieldId];
    this.fieldId = cachedField.fieldId;
    this.fieldValue = undefined;
    this.sizeInBytes = undefined;
    var _construct = function() {
        var dataType = cachedFieldMetadata['DataType'];
        if(cachedFieldLength == 1){
            var UINT8 = buffer.readUInt8(0);
            self.fieldValue = "" + UINT8;
            self.sizeInBytes = 1;
            if(shouldParse){
                try{
                    self.fieldValueParsed = "" + ByteParser.parseByType(dataType, UINT8);
                }catch(e){
                    self.fieldValueParsed = "" + UINT8;
                }
            }
        }
        else if(cachedFieldLength == 2){
            var UINT16 = buffer.readUInt16BE(0);
            self.fieldValue = "" + UINT16;
            self.sizeInBytes = 2;
            if(shouldParse){
                try{
                    self.fieldValueParsed = "" + ByteParser.parseByType(dataType, UINT16);
                }catch(e){
                    self.fieldValueParsed = "" + UINT16;
                }
            }
        }else if(cachedFieldLength == 4){
            var UINT32 = buffer.readUInt32BE(0);
            self.fieldValue = "" + UINT32;
            self.sizeInBytes = 4;
            if(shouldParse){
                try{
                    self.fieldValueParsed = "" + ByteParser.parseByType(dataType, UINT32);
                }catch(e){
                    self.fieldValueParsed = "" + UINT32
                }
            }
        }else if(cachedFieldLength == 8){
            self.sizeInBytes = 8;
            var UINT64 = bignum.fromBuffer(buffer.slice(0,8)).toString();
            self.fieldValue = "" + UINT64
            if(shouldParse)
            self.fieldValueParsed = "" + UINT64;
        }else if(cachedFieldLength == 16){
            self.sizeInBytes = 16;
            var uint8Array = new Uint8Array(16);

            for(var i = 0 ; i < uint8Array.length; i++){
                var uint8 = buffer.readUInt8(i);
                uint8Array[i] = uint8;
            }
            if(shouldParse){
                try{
                    self.fieldValueParsed = "" + ByteParser.parseByType(dataType, uint8Array);
                }catch(e){
                    // No idea what to do with unsupported 16 byte data ..
                    self.fieldValueParsed = "NOT_SUPPORTED";
                }
            }
        }
        return;
    };
    _construct();
    return this;
};
module.exports = DataSetFieldSpecifier;