var mongoose = require('mongoose');

var caseTemplateSchema = mongoose.Schema({
            
    name: {type: String,
          unique: true
          },
    details: {
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
});

var CaseTemplate = module.exports = mongoose.model('CaseTemplate', caseTemplateSchema);

// Get All Templates
module.exports.getCaseTemplates = function(callback){
	CaseTemplate.find(callback).sort({donf: 1});
}

// Get Temaplate By Name
module.exports.getCaseTemplateByName = function(name, callback){
    console.log('In getTemaplateById' + name);
	CaseTemplate.find({name: name}, callback);
}

// Add a Temaplate
module.exports.createCaseTemplate = function(newTemplate, callback){
    console.log("New Temaplate: "+ newTemplate);
	newTemplate.save(callback);
}

// Remove Temaplate
module.exports.removeCaseTemplate = function(id, callback){
	CaseTemplate.find({_id: id}).remove(callback);
}