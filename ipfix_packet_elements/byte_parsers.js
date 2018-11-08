var Parsers = function(){
    var self = this;
    var SUPPORTED_TYPES = [
        'String',
        'ipv4Address',
        'ipv6Address',
        'Boolean'
    ];
    this.parseByType = function(type,int){
        if(SUPPORTED_TYPES.includes(type)){
            if(type == 'String')
                return self.String(int);
            else if(type == 'ipv4Address')
                return self.ipv4Address(int);
            else if(type == 'ipv6Address')
                return self.ipv6Address(int);
            else if(type == 'Boolean')
                return self.Boolean(int);
        }else{
            throw new Error(`Parsing by type '${type}' not supported : `)
        }
    }
    this.String = function(buffer){
        return null;
    };

    this.ipv4Address = function(int){
        var part1 = int & 255;
        var part2 = ((int >> 8) & 255);
        var part3 = ((int >> 16) & 255);
        var part4 = ((int >> 24) & 255);
    
        return part4 + "." + part3 + "." + part2 + "." + part1;
    };
    
    this.ipv6Address = function(int){
        // var part1 = int & 255;
        // var part2 = ((int >> 8) & 255);
        // var part3 = ((int >> 16) & 255);
        // var part4 = ((int >> 24) & 255);
        // var part5 = ((int >> 32) & 255);
        // var part6 = ((int >> 40) & 255);
        // return part4 + "." + part3 + "." + part2 + "." + part1;
        return null;
    };

    this.Boolean = function(buffer){
        return (int == 1);
    };


}

module.exports = new Parsers();