var mongoose = require('mongoose');
var _ = require('underscore');
var PythonShell = require('python-shell');
var fs = require('fs');
 
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);
 
module.exports.create = function(req, res) {
 
	     	  
    
  //  console.log("AAA" + JSON.stringify(req.files, null, 4));
	    	var part = req.files.file;
    var aliasId = req.body.patientId;
 console.log("AAA" + JSON.stringify(req.body.patientId));
                var writeStream = gfs.createWriteStream({
                    aliases: aliasId,
                    filename: part.name,
    				mode: 'w',
                    content_type:part.mimetype
                });
 
 
                writeStream.on('close', function() {
                     return res.status(200).send({
						message: 'Success'
					});
                });
                
                writeStream.write(part.data);
 
                writeStream.end();
 
};
 
 
module.exports.read = function(req, res) {
 
	gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {
 
 	    if(files.length===0){
			return res.status(400).send({
				message: 'File not found'
			});
 	    }
	
		res.writeHead(200, {'Content-Type': files[0].contentType});
		
		var readstream = gfs.createReadStream({
			  filename: files[0].filename
		});
 
	    readstream.on('data', function(data) {
	        res.write(data);
	    });
	    
	    readstream.on('end', function() {
	        res.end();        
	    });
 
		readstream.on('error', function (err) {
		  console.log('An error occurred!', err);
		  throw err;
		});
	});
 
};
 
module.exports.readConfig = function(req, res, callback) {
    console.log('In read config for: '+ req.params.filename);
 
	var options = {encoding: 'utf-8', flag: 'r'};
    //synchronous way
    /*var config = fs.readFileSync('./configs/'+req.params.filename, options);
    config = JSON.parse(config);
    callback(null, config);*/
    //Asynchronous way
    fs.readFile('./configs/'+req.params.filename, options, function(err, data){
    
        if(err){
            console.log('Failure in reading file: '+ req.params.filename);
        }
        else {
            console.log('File read');
            var config = JSON.parse(data);
            
            console.log('File Content: '+ config);
            callback(err, config);
        }
    });
 
};
 
module.exports.getFiles = function(patientId, callback) {
    console.log("In Get Files: "+ patientId);
 
	gfs.files.find({ aliases: patientId }).toArray(function (err, files) {
 
 	   
        console.dir("Files found: "+ files.length);
        callback(null, files);
       
        
		
			    
	});
 
};

module.exports.getPyScriptResult = function(req, res, callback) {
    console.log("In getPyScriptResult");
    var options = {
  mode: 'text',
  pythonPath: 'C:\\Eee\\Anaconda\\python',
  pythonOptions: ['-u'],
  scriptPath: 'C:\\Eee\\PythonLearn\\',
  args: ['value1']
};
   // this is to run the script and results are what the script outputs
   /* PythonShell.run('hello.py', options, function (err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution 
  console.log('results: %j', results);
        console.log('results: ', results.length);
        callback(err, results);
});*/
    var pyshell = new PythonShell('scr1.py', options);
 
    // sends a message to the Python script via stdin 
    pyshell.send(4);
 
    pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement) 
    console.log(message);
        callback(null, message);
    });
 
// end the input stream and allow the process to exit 
    pyshell.end(function (err) {
    if (err) {
        throw err;
        callback(err, null);
    }
    console.log('finished');
    });
    
    /*var client = new zerorpc.Client();
    client.connect("tcp://127.0.0.1:4242");

    client.invoke("hello", "World!", function(error, res, more) {
    console.log(res);
        res.write(res);
    });*/
 
};
 