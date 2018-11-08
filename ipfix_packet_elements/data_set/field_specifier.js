var bignum = require('bignum');
var DataSetFieldSpecifier = function(buffer, cachedField) {
    var self = this;
    var cachedFieldLength = cachedField.fieldLength;
    var cachedFieldMetadata = IPFIX_ENTITIES[cachedField.fieldId];
    this.fieldId = cachedField.fieldId;
    this.fieldValue = undefined;
    this.sizeInBytes = undefined;
    var _construct = function() {
        var dataType = cachedFieldMetadata['DataType'];
        if(cachedFieldLength == 1){
            var UINT8 = buffer.readUInt8(0);
            self.sizeInBytes = 1;
            try{
                self.fieldValue = ByteParser.parseByType(dataType, UINT8);
            }catch(e){
                // console.log(e);
                self.fieldValue = UINT8;
            }
        }
        else if(cachedFieldLength == 2){
            var UINT16 = buffer.readUInt16BE(0);
            self.sizeInBytes = 2;

            try{
                self.fieldValue = ByteParser.parseByType(dataType, UINT16);
            }catch(e){
                // console.log(e);
                self.fieldValue = UINT16;
            }

        }else if(cachedFieldLength == 4){
            var UINT32 = buffer.readUInt32BE(0);
            self.sizeInBytes = 4;

            try{
                self.fieldValue = ByteParser.parseByType(dataType, UINT32);
            }catch(e){
                // console.log(e);
                self.fieldValue = UINT32
            }
        }else if(cachedFieldLength == 8){
            // TODO ::
            self.sizeInBytes = 8;
            self.fieldValue = bignum.fromBuffer(buffer.slice(0,8)).toString();
        }
        return;
    };
    _construct();
    return this;
};
module.exports = DataSetFieldSpecifier;