var app = angular.module('kB',['ngRoute', 'angularUtils.directives.dirPagination', 'ui.bootstrap', 'ngAnimate', 'ngMessages', 'toastr']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	
       /* when('/patients',{
			templateUrl: 'views/patients.view.html',
			controller: 'PatientsCtrl'
		}).*/
		when('/patients/details/:id',{
			templateUrl: 'views/patient_details.view.html',
			controller: 'PatientDetailsCtrl'
		}).
		when('/patients/date/:date',{
			templateUrl: 'views/date_patients.view.html',
			controller: 'PatientsDateCtrl'
		}).
    
        when('/patients/delete',{
			redirectTo: 'views/delete_patient.view.html',
			controller: 'PatientDetailsCtrl'
		}).
        when('/patients/searchResults',{
			templateUrl: 'views/searchResults-patients.view.html',
			controller: 'PatientsSearchResultsCtrl'
		}).		
		when('/patients/add',{
			templateUrl: 'views/add_patient.view.html',
			controller: 'PatientCreateCtrl'
		}).
		when('/patients/edit/:id',{
			templateUrl: 'views/edit_patients.view.html',
			controller: 'PatientEditCtrl'
		}).
        when('/patients/dashboard',{
			templateUrl: 'views/dashboard_patients.view.html',
			controller: 'PatientsDashboardCtrl'
		}).
        /*when('/patients/upload',{
			templateUrl: 'views/upload_patients.view.html',
			controller: 'uploadCtrl'
		}).*/
        when('/patients/pyScript/run',{
			templateUrl: 'views/pyScript.view.html',
			controller: 'pyScriptCtrl'
		}).
        when('/patients/user/login', {
            templateUrl: 'views/login.view.html',
            controller: 'LoginCtrl'
        }).
        when('/patients/user/signup', {
            templateUrl: 'views/signup.view.html',
            controller: 'SignupCtrl' 
        }).
		otherwise({redirectTo: '/patients/user/login'})
}]);