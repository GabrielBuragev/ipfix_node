### Ipfix deserializer in Node.js.

##### This module is still in development mode.
##### Its purpose is to deserialize ipfix NetFlows exported from software like "softflowd", and return them as [entity data](https://www.iana.org/assignments/ipfix/ipfix.xhtml).

### **Installation**
```
npm install ipfix_node
```

### Usage
```javascript
var IpfixDeserializer = require('ipfix_node')();

IpfixDeserializer.deserialize(data)
    .then(function(deserializedData) {
        // Do something with deserialized data (JSON format)
    })
    .catch(function(err) {
        // Catch errors ...
    });

```

"data" parameter is the Buffer data collected from a netflow exporting software.

The library is using internal Maps for storing [Template Records](https://tools.ietf.org/html/rfc7011#section-3.4.1) and [Option Template Records](https://tools.ietf.org/html/rfc7011#section-3.4.2). Take a look at the options below to disable the internal storage so you can use your own storing mechanism. 

Options
----
#### useInternalStorage 

Should the library not use the default internal storage strategy then set this to <b>false</b>.
Default: <b>true</b>.

When setting this field to <b>false</b> you must provide a <b>function</b> via [templateProvider](#templateProvider) option.

If you dont want to switch to your own storage strategy then you can access the internal storage at any time by using the Storage property.

```javascript
var IpfixDeserializer = require('ipfix_node')();
var storage = IpfixDeserializer.Storage;
```

#### templateProvider

Callback function to provide the decoder with the required template which is needed to deserialize the [Data Record](https://tools.ietf.org/html/rfc7011#section-3.4.3) portion found inside the binary buffer. Used together with <b>useInternalStorage:false</b> option.

You should always <b>return</b> the templates inside this function in the same format they are given to you in the [onNewTemplate]() callback function.

Function arguments: <b>templateId</b> (the id of the template which is needed by the deserializer) 

#### onNewTemplate

Callback function which gets called whenever there are new Templates (Template Records/Option Template Records) found in the binary buffer.

!!! Its important that you define a custom callback function for this option and store the new templates found if you are using <b>useInternalStorage:false</b> option, since they are going to be needed in the following flow exports for deserializing the DataRecords and the deserializer will expect you to provide them inside <b>templateProvider</b> callback. 

Function arguments: <b>template</b>, <b>templateType</b>

- <b>template</b> format :
```json
{
  templateId: 1024,
  numberFields: 16,
  setId: 2,
  sizeInBytes: 72,
  FieldSpecifiers: 
   [ 
     { fieldId: 8, fieldLength: 4 },
     { fieldId: 12, fieldLength: 4 },
     { fieldId: 1, fieldLength: 4 },
     { fieldId: 2, fieldLength: 4 },
     { fieldId: 10, fieldLength: 4 },
     { fieldId: 14, fieldLength: 4 },
     { fieldId: 7, fieldLength: 2 },
     { fieldId: 11, fieldLength: 2 },
     { fieldId: 4, fieldLength: 1 },
     { fieldId: 6, fieldLength: 1 },
     { fieldId: 60, fieldLength: 1 },
     { fieldId: 5, fieldLength: 1 },
     { fieldId: 32, fieldLength: 2 },
     { fieldId: 58, fieldLength: 2 },
     { fieldId: 22, fieldLength: 4 },
     { fieldId: 21, fieldLength: 4 } 
  ]
}
```

- <b>templateType</b> (string) can be "DataTemplate" or "OptionsTemplate" so you can  

#### parseDataValues

Boolean option which tells the deserializer whether it should detect and parse values inside Data Records automatically or it should return raw UINT data instead.

Default: <b>true</b>
