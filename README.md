Ipfix decoder for Node.js

<h5> This module is still in development mode
<h5> Its purpose is to decode ipfix NetFlows exported from software like "softflowd", and return them as [entity data] (https://www.iana.org/assignments/ipfix/ipfix.xhtml)

<h2>Installation
```
npm install ipfix_node
```

<h2>Usage
```
var IpfixDecoder = require('ipfix_node');

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

Thats it !