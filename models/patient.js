var mongoose = require('mongoose');
var _ = require('underscore');

var patientSchema = mongoose.Schema({
	_id: {type: Number,
		index: true},
    recMaster: {
        type: String,
		index: true,
		required: true
    },
    fname: {type: String,
            index: true,
            required: true
    },
    lname: {type: String,
            index: true
    },
    age: {type: Number},
    sex: {type: String},
    height: {type: Number},
    weight: {type: Number},
    address: {
        address1: {type: String},
        address2: {type: String
            },
        locality: {type: String
            },
        city: {type: String},
        state: {type: String
            },
        country: {type: String
            },
        zip: {type: String}
    },
    contacts: {
        home: {type: String
            },
        mobile: {type: String},
        email: {type: String,
            index: true}
    },
    followupDetails: [{
        dof: {type: Date},
        observations: {type: String},
        fee: {type: Number},
        otherDetails: {
            tastes: [],
            heataggrs: [],
            skins: [],
            miastmatic: [],
            menstrual: [],
            leucorrhoea: [],
            breastpain: [],
            emotions: {type: String},
            confidence: {type: String},
            iddm: {type: String},
            h1: {type: String},
            thyroid: {type: String},
            complexion: {type: String},
            thirst: {type: String},
            desire: {type: String},
            bowel: {type: String},
            sleep: {type: String},
            palms: {type: String},
            majorillness: {type: String},
            constipation: {type: String},
            anger: {type: String},
            festers: {type: String},
            corns: {type: String},
            feetsole: {type: String},
            nose: {type: String},
            warts: {type: String},
            elbows: {type: String}

        }
}],
dor: {type:Date,
		default: Date.now},
donf: {type:Date,
		default: Date.now}

});

var Patient = module.exports = mongoose.model('Patient', patientSchema);

// Get All Patients
module.exports.getPatients = function(callback){
	Patient.find(callback).sort({donf: 1});
}

// Get Patient By ID
module.exports.getPatientById = function(id, callback){
    console.log('In getPatientById' + id);
	Patient.findById(id, callback);
}

// Get Category articles 
module.exports.getPatientsByDate = function(date, recOwner, callback){
    console.log("Query date: "+date)
	var query = {$and: [{'recMaster': recOwner}, {donf: date}]};
	Patient.find(query, callback);
}


module.exports.getPatientsByMobile = function(searchFor, recOwner, callback){
     
    var query = {$and: [{'recMaster': recOwner}, {'contacts.mobile': new RegExp('^'+searchFor)}]};
	Patient.find(query, callback);
}

module.exports.getPatientsByFname = function(searchFor, recOwner, callback){
     
    var query ={$and: [{'recMaster': recOwner}, {'fname': new RegExp('^'+searchFor, 'i')}]};
    console.log(query);
	Patient.find(query, callback).sort({fname: 1});
}

module.exports.getPatientsByLname = function(searchFor, recOwner, callback){
    
    var query = {$and: [{'recMaster': recOwner}, {'lname': new RegExp('^'+searchFor, 'i')}]};
	Patient.find(query, callback).sort({lname: 1});
}

// Get Patient By Age Range 
module.exports.getPatientsByAgeRange = function(range, recOwner, callback){
    console.log("Query Age Range: "+range.age1 + ":"+range.age2);
	//var query = {age: {$gte: range.age1, $lte: range.age2}};
	//Patient.find(query, callback);
    var a = Number(range.age1), b=Number(range.age2);
    var query = [
        {$match: {$and: [{'recMaster': recOwner},{age: {$gte: a, $lte: b}}]}},
        {$group: {_id: '$age', count: {$sum: 1}}}];
    console.log("Query is: "+ query);
    Patient.aggregate(query, callback);
}
// Get Patient By Date Range 
module.exports.getPatientsByDateRange = function(range, recOwner, callback){
    console.log("Query Date Range: "+range.date1 + ", "+ range.date2);
	//var query = {donf: {$gte: range.date1, $lte: range.date2}};
	//Patient.find(query, callback);
    var a = new Date(range.date1), b=new Date(range.date2);
    a = new Date(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), 0, 0 ,0);
    b = new Date(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate(), 0, 0 ,0);
    console.log("Query Date Range1: "+a + ", "+ b);
    var query = [
        {$unwind: '$followupDetails'}, //in case of arrays, 1st unwind and then match
        {$match: {$and: [{'recMaster': recOwner},{'followupDetails.dof': {$gte: a, $lte: b}}]}},
        
        {$group: {_id: '$followupDetails.dof', sum: {$sum: '$followupDetails.fee'}}}];
    console.log("Query is: "+ query);
    Patient.aggregate(query, callback);
}

// Get Patient By Date Range - New Registration
module.exports.getNewPatientsByDateRange = function(range, recOwner, callback){
    console.log("Query Date Range: "+range.date1 + ", "+ range.date2);
	//var query = {donf: {$gte: range.date1, $lte: range.date2}};
	//Patient.find(query, callback);
    var a = new Date(range.date1), b=new Date(range.date2);
    a = new Date(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), 0, 0 ,0);
    b = new Date(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate(), 0, 0 ,0);
     console.log("Query Date Range1: "+a + ", "+ b);
    var query = [
        {$unwind: '$followupDetails'},
        {$match: {$and: [{'recMaster': recOwner},{'dor': {$gte: a, $lte: b}}]}},
        
        {$group: {_id: '$dor', sum: {$sum: '$followupDetails.fee'}}}];
    console.log("Query is: "+ JSON.stringify(query, null, 4));
    Patient.aggregate(query, callback);
}


// Add an Patient
module.exports.createPatient = function(newPatient, callback){
    console.log("New Patient: "+ newPatient);
	newPatient.save(callback);
}

// Update Patient
module.exports.updatePatient = function(id, data, callback){
	var title    = data.title;
	var body     = data.body;
	var category = data.category;

	var query = {_id: id};

	Patient.findById(id, function(err, patient){
        console.log('Patient found: '+ patient);
        
		if(!patient){
			return next(new Error('Could not load patient'));
		} else {
			// Update
			//patient.title    = title;
			//patient.body     = body;
			//patient.category = category;
            //article = data;
            console.log('to update: '+ data.followupDetails[data.followupDetails.length - 1].dof);
            
            //if(patient.followupDetails.length < data.followupDetails.length){
                //patient.donf = data.followupDetails[data.followupDetails.length - 1].dof;
            //}
            patient.followupDetails = data.followupDetails;
            patient.contacts = data.contacts;
            patient.address = data.address;
            patient.fname = data.fname;
            patient.lname = data.lname;
            patient.age = data.age;
            patient.sex = data.sex;
            patient.height = data.height;
            patient.weight = data.weight;
            patient.donf = data.donf;
             console.log('to update1: '+ patient);

			patient.save(callback);
		}
	});
}

// Remove Patient
module.exports.removePatient = function(id, callback){
	Patient.find({_id: id}).remove(callback);
}
module.exports.checkUser = function(req, res){
		if(!req.session.me){
			console.log('You are NOT logged in');
			return res.view('login');
		} else {
			console.log('You are logged in');
			return res.view('dashboard');
		}
	}