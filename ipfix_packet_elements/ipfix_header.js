/**
 * IPFIX STATIC HEADER
 */

var Header = function(buffer) {
    var self = this;
    this.Version = undefined;
    this.Length = undefined;
    this.ExportTime = undefined;
    this.SequenceNumber = undefined;
    this.ObservationDomainId = undefined;
    this.setId = undefined;
    this.sizeInBytes = 0;
    var _construct = function() {
        self.Version = buffer.readUInt16BE(0);
        self.Length = buffer.readUInt16BE(2);
        self.ExportTime = buffer.readUInt32BE(4);
        self.SequenceNumber = buffer.readUInt32BE(8);
        self.ObservationDomainId = buffer.readUInt32BE(12);
        self.sizeInBytes = 16;
    }
    console.log('In header : ', this);
    _construct();

    return this;
};

module.exports = Header;