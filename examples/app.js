var net = require('net');
// Not really sophisticated storing mechanism over here. Used just for the example.
var DataTemplates = new Map();
var OptionTemplates = new Map();
var decoder = require('ipfix_node')({
    useInternalStorage: false,
    onNewTemplate: function(template, templateType){
        if(templateType == 'DataTemplate')
            DataTemplates.set(template.templateId, template);
        else if(templateType == 'OptionsTemplate')
            OptionTemplates.set(template.templateId, template);
    },
    templateProvider: function(templateId){
        if(DataTemplates.has(templateId))
            return DataTemplates.get(templateId);
        else if(OptionTemplates.has(templateId))
            return OptionTemplates.get(templateId);
    }
});
// TCP Server where you are expecting binary buffers from flow exporting software like "softflowd" 
var server = net.createServer(function(socket){
    socket.on('data', function(data){
        decoder.deserialize(data)
                .then(function(decodedData){
                    var TemplateSets = decodedData.TemplateSets;
                    var OptionTemplateSets = decodedData.OptionsTemplateSets;
                    var DataSets = decodedData.DataSets;
                    console.log('----   TEMPLATE SETS   ----');
                    TemplateSets.forEach(function(val, i){
                        var fields = val.FieldSpecifiers;
                        fields.forEach(function(field,j){
                            console.log(field);
                        });
                    });
                    console.log('----   OPTIONS TEMPLATE SETS   ----');
                    OptionTemplateSets.forEach(function(val, i){
                        var fields = val.FieldSpecifiers;
                        fields.forEach(function(field,j){
                            console.log(field);
                        });
                    });

                    console.log('----   DATA SETS   ----');
                    DataSets.forEach(function(val, i){
                        var fields = val.Fields;
                        fields.forEach(function(field,j){
                            console.log(field);
                        });
                    });

                })
                .catch(function(err){
                    console.log(err);
                });
    });
    socket.on('error', function(err){
        console.log('Socket error !');
        console.log(err);
    })
    socket.on('close', function(){
        console.log('Socket died !');
    })
});
// Server listening on port 8008
server.listen(8008);
