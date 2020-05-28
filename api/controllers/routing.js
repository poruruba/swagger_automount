'use strict';

const fs = require('fs');

var func_auto_table = [];

const files = fs.readdirSync("api/controllers");
for( var i = 0 ; i < files.length ; i++ ){
    var stats_dir = fs.statSync("api/controllers/" + files[i]);
    if( !stats_dir.isDirectory() )
      continue;
    try{
      fs.statSync("api/controllers/" + files[i] + "/swagger.yaml" );
    }catch(error){
      continue;
    }
    func_auto_table[files[i]] = require('./' + files[i]);
    console.log('auto mouted: ' + files[i]);
};

var exports_list = {};

for( var operationId in func_auto_table ){
  Object.keys(func_auto_table[operationId]).forEach(item =>{
    exports_list[item] = routing;
  });
}

module.exports = exports_list;

function routing(req, res) {
  var operationId = req.swagger.operation.operationId;
  return func_auto_table[req.swagger.operation["x-automount"]][operationId](req, res);
}
