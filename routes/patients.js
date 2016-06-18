var express = require('express');
var router = express.Router();
var debug = require('debug')('router');

var Patient = require('../models/patient');
var User = require('../models/userController');
var CaseTemplate = require('../models/casetemplate');

var Upload = require('../models/upload');


var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	 console.log("Session is authenticated: "+ JSON.stringify(req.session, null, 4));
    if (req.isAuthenticated() /*&& req.session.passport.user === req.query.recMaster*/)
		return next();
	// if the user is not authenticated then redirect him to the login page
    console.log("Not Authenticated.......")
	res.redirect('/');
}

module.exports = function(passport){
router.get('/', isAuthenticated, function(req, res, next) {
    
		//if(req.session.me){	
          Patient.getPatients(function(err, patients){
            if(err){
                console.log(err);
            }
            res.json(patients);
          });
        //}
        //else {
          //  res.writeHead(401);
          //  res.end('Login first.');
       // }
       
});

router.get('/:id', isAuthenticated, function(req, res, next) {
    
            console.log("in get :id :");
            Patient.getPatientById(req.params.id, function(err, patient){
             if(err){
                console.log(err);
             }
              console.log("in get :id :" + patient);
             res.json(patient);
          });
        
        
});

router.get('/date/:date', isAuthenticated, function(req, res, next) {
   // if(req.session.me){
        console.log("Session1: "+ JSON.stringify(req.session, null, 4));

            console.log("req.params.date1: " + req.params.date);
              Patient.getPatientsByDate(req.params.date, req.query.recMaster, function(err, patients){
                  console.log("Query Results Date: " + patients);
                if(err){
                    console.log(err);
                }
                res.json(patients);
              });
    //}
    //else {
       // res.writeHead(401);
       // res.end('Login first.');
    //}
    
    
});

router.get('/getFiles/:patientId', isAuthenticated, function(req, res, next){
    //if(req.session.me){
        console.log("req.params.patientId: " + req.params.patientId);
        // console.log("AAA11" + JSON.stringify(req.body, null, 4));
      //  console.log("AAA11" + JSON.stringify(req.files, null, 4));
            Upload.getFiles(req.params.patientId, function(err, files){
          console.log("Query Results Files: " + files);
        if(err){
            console.log(err);
        }
        res.json(files);

      });
   // }
    //else {
     //   res.writeHead(401);
     //   res.end('Login first.');
    //}
});


router.get('/search/patients', isAuthenticated, function(req, res, next) {
    //if(req.session.me){
        console.log("req.params.searchFor: " + req.query.searchFor);
        console.log("req.params: " + JSON.stringify(req.query, null, 4));
        var searchFor = req.query.searchFor;
        var searchOpt = req.query.searchOpt;
        if(searchOpt === 'fname'){
            Patient.getPatientsByFname(searchFor, req.query.recMaster, function(err, patients){
            console.log("Query Results : " + patients);
             if(err){
            console.log(err);
             }
             res.json(patients);

            });
           }
           else if(searchOpt === 'lname'){
            Patient.getPatientsByLname(searchFor, req.query.recMaster, function(err, patients){
            console.log("Query Results : " + patients);
             if(err){
            console.log(err);
             }
             res.json(patients);

            });

        }
        else if(searchOpt === 'mobile') {
            Patient.getPatientsByMobile(searchFor, req.query.recMaster, function(err, patients){
            console.log("Query Results : " + patients);
             if(err){
            console.log(err);
             }
             res.json(patients);

            });    
       
        }
   // }
    //else {
     //   res.writeHead(401);
     //   res.end('Login first.');
    //}
    
 
});

router.get('/dashboard/age', isAuthenticated, function(req, res, next) {
    //if(req.session.me){
        console.log("req.params.range: " + req.query.age1);
        var range = {};
        range.age1 = req.query.age1;
        range.age2 = req.query.age2;
        var recOwner = req.query.recMaster;
      Patient.getPatientsByAgeRange(range, recOwner, function(err, patients){
          console.log("Query Results Age Range: " + patients);
        if(err){
            console.log(err);
        }
        res.json(patients);

      });
    //}
    //else {
     //   res.writeHead(401);
     //   res.end('Login first.');
    //}
});

router.get('/dashboard/date', isAuthenticated, function(req, res, next) {
   // if(req.session.me){
        console.log("req.params.range: " + req.query.date1);
        var range = {};
        range.date1 = req.query.date1;
        range.date2 = req.query.date2;
        var option = req.query.option;
        var recOwner = req.query.recMaster;
        if(option === "FL"){
            Patient.getPatientsByDateRange(range, recOwner, function(err, patients){
          console.log("Query Results Date Range: " + JSON.stringify(patients, null,4));
                 if(err){
                    console.log(err);
             }
             res.json(patients);
            });
        }
        else if(option == "NR"){
            Patient.getNewPatientsByDateRange(range, recOwner, function(err, patients){
          console.log("Query Results Date Range: " + JSON.stringify(patients, null,4));
                 if(err){
                    console.log(err);
             }
             res.json(patients);
            });
        }
    //}
    //else {
     //   res.writeHead(401);
     //   res.end('Login first.');
    //}
});

router.post('/', isAuthenticated, function(req, res, next){
	//if(req.session.me){
        // Get Form Values
        var title = req.body.title;
        var category = req.body.category;
        var body = req.body.body;

        console.log("Request Body: "+ req.body);

        // Patient Object
        var newPatient = new Patient(req.body);

        // Create Patient
        Patient.createPatient(newPatient, function(err, patient){
            if(err){
                console.log(err);
            }

            //res.location('/patients');
            //res.redirect('/patients');
        });
   // }
    //else {
    //    res.writeHead(401);
    //    res.end('Login first.');
   // }
});


// Update Patient
router.put('/', isAuthenticated, function(req, res, next){
	//if(req.session.me){
        var id	= req.body._id;
        var data = req.body;
        console.log("Update ID: "+ id);

        // Update Patient
        Patient.updatePatient(id, data, function(err, patient){
            if(err){
                console.log(err);
            }

            //res.location('/patients');
            //res.redirect('/patients');
        });
   // }
    //else {
     //   res.writeHead(401);
     //   res.end('Login first.');
    //}
});


// Remove Patient
router.delete('/:id', isAuthenticated, function(req, res, next){
	//if(req.session.me){
        var id	= req.params.id;
        // Remove Patient
        Patient.removePatient(id, function(err, patient){
            if(err){
                console.log(err);
            }
            console.log('In Remove: '+ id);
            //res.location('/');
            //res.redirect(200, '/');

        });
    //}
    //else {
     //   res.writeHead(401);
     //   res.end('Login first.');
   // }
});

router.get('/config/:filename', function(req, res, next){
    //if(req.session.me){
        console.log("AAA11" + JSON.stringify(req.params, null, 4));
      //  console.log("AAA11" + JSON.stringify(req.files, null, 4));
            Upload.readConfig(req, res, function(err, content){
                if(err){
                    console.log(err);
                }
                console.log(content);
                res.json(content);
            });
   // }
    //else {
      //  res.writeHead(401);
      //  res.end('Login first.');
   // }
});

 
router.get('/upload/:filename', isAuthenticated, function(req, res, next){
    
   //	if(req.session.me){	
        Upload.read(req, res);
    //}
    //else{
    //    res.writeHead(401);
        //res.end('Login first');
    //}
});

router.get('/pyScript/run', function(req, res, next){
    
    // console.log("AAA11" + JSON.stringify(req.body, null, 4));
  console.log("AAA11" + JSON.stringify(req.body, null, 4));
		Upload.getPyScriptResult(req, res, function(err, data){
            console.log("PyShell Return: "+ data);
            
            res.json(data);
        });
});
	
	
router.post('/upload', isAuthenticated, function(req, res, next){
    
   //	if(req.session.me){	
        Upload.create(req, res);
    //}
    //else{
     //   res.writeHead(401);
    //    res.end('Login first');
   // }
});

router.post('/templates/addTemplate', isAuthenticated, function(req, res, next){
	console.log('addTemplate', JSON.stringify(req.body, null, 4));
    var caseTemplate = new CaseTemplate(req.body);
    
    CaseTemplate.createCaseTemplate(caseTemplate,function(err, ct){
            if(err){
                console.log(err);
            }
         res.json({success: true, message: 'Template added successfully'});
            
        });
});
    
router.get('/templates/getTemplates', isAuthenticated, function(req, res, next){
	console.log('getTemplates', JSON.stringify(req.body, null, 4));
    
    console.log('CT is: '+ CaseTemplate);
    CaseTemplate.find({}, function(err, data)
        {
        if(err) throw err;
        
        res.json(data)
    });
});
    
router.get('/templates/getTemplate/:name', isAuthenticated, function(req, res, next){
	console.log('addTemplate', JSON.stringify(req.body, null, 4));
    //var caseTemplate = new CaseTemplate(req.body);
    
    CaseTemplate.createCaseTemplate(caseTemplate,function(err, ct){
            if(err){
                console.log(err);
            }
         res.json({success: true, message: 'Template added successfully'});
            
        });
});

    /* GET login page. */
router.get('/user/login', function(req, res) {
    	// Display the Login page with any flash message, if any
		//res.render('login.view');
});
/* Handle Login POST */
	router.post('/user/login', function(req, res, next){
        passport.authenticate('login', function(err, user, info) {
            console.log("Here...3")
    if (err) { 
        return next(err); 
    }
    if (!user) { 
        console.log("Here...4" );
        res.status(500);
        return res.json(req.flash().message); 
    }
    req.logIn(user, function(err) {
        console.log("Here...2")
      if (err) { return next(err); }
        console.log("Here...");
      return res.json(req.session.passport.user);
    });
  })(req, res, next);
    });

	/* GET Registration Page */
router.get('/user/signup', function(req, res){
		res.redirect('/patients/user/signup',{message: req.flash('message')});
	});

	/* Handle Registration POST */
router.post('/user/signup', function(req, res, next){
        passport.authenticate('signup', function(err, user, info) {
            console.log("Here...3")
    if (err) { return next(err); }
    if (!user) { 
        console.log("Here...4" + JSON.stringify(info, null, 4));
        res.status(500);
        return res.json(req.flash().message); 
    }
    else {
        res.json(user.email);
    }
    })(req, res, next);
});

	

	/* Handle Logout */
router.get('/user/logout', function(req, res) {
    console.log("logout1" + JSON.stringify(req.session, null, 4));
		req.logout();
		res.status(200);
    console.log("logout4" + JSON.stringify(req.session, null, 4));
    res.send('Logout Done...')
	});

router.get('/user/confirmLogin', function(req, res){
    console.log("Confirm Login:" + JSON.stringify(req.user, null, 4));
    res.send(req.session.passport == undefined? {user: ""} : req.session.passport.user);
});


return router;
}




//module.exports = router;
