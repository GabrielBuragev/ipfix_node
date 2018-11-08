### Ipfix decoder for Node.js.

##### This module is still in development mode.
##### Its purpose is to decode ipfix NetFlows exported from software like "softflowd", and return them as [entity data](https://www.iana.org/assignments/ipfix/ipfix.xhtml).

### **Installation**
```
npm install ipfix_node
```

### Usage:
```
var IpfixDecoder = require('ipfix_node')();

...

IpfixDecoder._decode(data)
    .then(function(decodedData) {
        // Do something with decoded data (JSON format)
    })
    .catch(function(err) {
        // Catch weird errors ...
    });

```

"data" parameter is the Buffer data collected from a netflow exporting software

### Thats it !