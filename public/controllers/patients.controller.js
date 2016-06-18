angular.module("kB")
/*.controller('ConfigCtrl', ['$scope','$http', 'auth', '$location', 'searchPatients', function($scope, $http, auth, $location, searchPatients){
   
    $scope.currentDate = new Date();
    $http.get('/patients/config/config.json').success(function(data){
		$scope.configs = data;
	   });
    
    
     /*$scope.doLogout = function(){
        $http.get('/patients/user/logout').success(function(data){
            LoginService.user.email = {};
            searchPatients.dateFilter = new Date();
            searchPatients.dataFilter = "";
            searchPatients.searchFor = "";
            searchPatients.searchForDate = new Date();
           
            $location.path('/patients/user/login');
        });
    }
   $scope.isLoggedIn = auth.isLoggedIn();
    
}])*/

.controller('PatientsCtrl', ['$scope','$http', '$modal', '$filter', function($scope, $http, $modal, $filter){
    $scope.patients = {};
    $scope.textFilter = "";
    
    //paginator stuff
    $scope.currentPage = 1;
    $scope.pageSize = 5;
    //ends
    
    var followupDate = $filter('date')(new Date(), 'yyyy-MM-dd', 'UTC');
	$http.get('/patients/date/'+followupDate).success(function(data){
		$scope.patients = data;
	});
    $scope.isDetails = false;
    $scope.setDetailsFlag = function(){
        $scope.isDetails = !$scope.isDetails;
    }
    
    
    console.log($scope.patients);
    
    $scope.open = function (p) {
        var modalInstance = $modal.open({
            animation: true,
          template: '<button type="button" class="close" ng-click="cancel();"><i class="fa fa-times-circle-o" style="margin:10px;color:blue;"></i></button><div class="modal-header"><h3 class="modal-title">Observations</h3></div><div class="modal-body"><p>{{ p }} </p></div>',
            controller: [
                            '$scope', '$modalInstance', function($scope, $modalInstance, item){
                                $scope.cancel = function () {
                                    $modalInstance.close();
                                };
                                $scope.p = p;
                            }
                        ]  ,
           
                               
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            
        });
    };
    
     
    
}])
.controller('PatientsSearchResultsCtrl', ['$scope','$http', '$routeParams', '$modal', 'searchPatients', 'auth', '$location', 'toastr', function($scope, $http, $routeParams, $modal, searchPatients, auth, $location, toastr){
    //paginator stuff
    $scope.currentPage = 1;
    $scope.pageSize = 5;
    //ends
    console.log('auth.user' + auth.currentUser());
    $scope.user = auth.currentUser();
    $scope.patients = searchPatients.searchResults;
    $scope.searchOption = searchPatients.searchOption;
    $scope.dataFilter=searchPatients.searchFor;
    $scope.dateFilter = searchPatients.searchForDate;
    //$scope.dateFilter=searchPatients.searchFor;
    
    
     $scope.$watch('searchOption', function(){
        searchPatients.searchOption = $scope.searchOption;
        
        // if($scope.searchOption !== 'fdate'){
            $scope.dataFilter = $scope.dataFilter === "" ? "" : $scope.dataFilter;
         //}
        // else {
            $scope.dateFilter = $scope.dateFilter === "" ? new Date() : new Date($scope.dateFilter);
        // }
    
    });
    $scope.$watch('dataFilter', function(){
        searchPatients.searchFor = $scope.dataFilter;
    
    });
    $scope.$watch('dateFilter', function(){
        searchPatients.searchForDate = $scope.dateFilter;
    
    });
    
    $scope.searchData = function(){
      
    var sp = searchPatients.searchPatientsFor().success(function(data){
            if(data.length === 0){
                toastr.success('No data found', 'Info', {
					closeButton: true
				});
            }
            $scope.patients = data;
        });
       
    };
    
     /*$scope.redirectToLogin = function(){
      
        $location.path('patients/user/login');
        };*/
       
    
    
    if(auth.isLoggedIn()){
        searchPatients.recOwner = auth.currentUser();
        //LoginService.authenticated = true;
        $scope.searchData();
    }
    /*else {
        $scope.redirectToLogin();
    }*/
    
    
     $scope.open = function (p) {
        var modalInstance = $modal.open({
            animation: true,
          template: '<button type="button" class="close" ng-click="cancel();"><i class="fa fa-times-circle-o" style="margin:10px;color:blue;"></i></button><div class="modal-header"><h3 class="modal-title">Observations</h3></div><div class="modal-body"><p>{{ p }} </p></div>',
            controller: [
                            '$scope', '$modalInstance', function($scope, $modalInstance, item){
                                $scope.cancel = function () {
                                    $modalInstance.close();
                                };
                                $scope.p = p;
                            }
                        ]  ,
           
                               
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            
        });
    };
}])
.service('searchPatients', ['$http', '$filter', function( $http, $filter){

    
    this.searchFor = "";
    this.searchForDate = new Date();
    this.searchOption = "fdate";
    this.searchResults = {};
    this.recOwner = "";
    
    this.searchPatientsFor = function(){ 
           if(this.searchOption === 'fdate'){
          this.searchForDate = $filter('date')(new Date(this.searchForDate), 'yyyy-MM-dd');
        return $http.get('/patients/date/'+this.searchForDate, {params: {recMaster: this.recOwner}}).success(function(data){
		this.searchResults = data;
        this.searchFor = "";
        return data;
	});
    
    }else {
           
           return $http.get('/patients/search/patients',{params: {searchFor:this.searchFor, searchOpt:this.searchOption, recMaster: this.recOwner}}).success(function(data){
		  this.searchResults = data;
          return data;
	}).error(function(err, status){
        console.log(err);
       });
    }
}

}])

.controller('PatientsDateCtrl', ['$scope','$http', '$routeParams', '$modal', 'auth', function($scope, $http, $routeParams, $modal, auth){
    if(auth.isLoggedIn()){
        
        //paginator stuff
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        //ends
        $scope.dateFilter = new Date($routeParams.date);
        console.log("Date Query: "+ new Date($routeParams.date).toISOString());
        $http.get('/patients/date/'+$routeParams.date).success(function(data){
            $scope.patients = data;
            $scope.dateFilter = $routeParams.date;
        });
    }
    
     $scope.open = function (p) {
        var modalInstance = $modal.open({
            animation: true,
          template: '<button type="button" class="close" ng-click="cancel();"><i class="fa fa-times-circle-o" style="margin:10px;color:blue;"></i></button><div class="modal-header"><h3 class="modal-title">Observations</h3></div><div class="modal-body"><p>{{ p }} </p></div>',
            controller: [
                            '$scope', '$modalInstance', function($scope, $modalInstance, item){
                                $scope.cancel = function () {
                                    $modalInstance.close();
                                };
                                $scope.p = p;
                            }
                        ]  ,
           
                               
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            
        });
    };
}])
.controller('PatientCreateCtrl', ['$scope','$http','$routeParams', '$location', '$filter', 'auth', function($scope, $http, $routeParams, $location, $filter, auth){
	
    if(auth.isLoggedIn()){
        $scope.gender = ['M', 'F', 'TG', 'DNWTD'];
        $scope.patient = {};
        $scope.patient.address = {};
        $scope.patient.followupDetails = [];
        //defaulting City, State and Country
        $scope.patient.address.city = "Pune";
        $scope.patient.address.state = "MH";
        $scope.patient.address.country = "IN";
        $scope.patient.donf = new Date();
        var unique1 = new Date().getTime() % 1000000;
        var unique =  Math.floor((Math.random()*unique1)+1);

        $scope.patient._id = unique;
        $scope.patient.recMaster = auth.currentUser();


            //$filter('date')($scope.patient.dof, 'yyyy-MM-dd');

        $scope.addPatient = function(){
            /*var data = {
                title: $scope.title,
                body: $scope.body,
                category: $scope.category
            }*/
            console.log($scope.patient.donf);
            $scope.patient.donf = $filter('date')(new Date($scope.patient.donf), 'yyyy-MM-dd', 'UTC');
            $scope.patient.donf = new Date($scope.patient.donf);
            var followupDate = $filter('date')(new Date(), 'yyyy-MM-dd', 'UTC');
            followupDate = new Date(followupDate);

            $scope.patient.dor = $filter('date')(new Date(), 'yyyy-MM-dd', 'UTC');
            $scope.patient.dor = new Date($scope.patient.dor);
            //var regDate = $filter('date')(new Date(), 'yyyy-MM-dd', 'UTC');
            //regDate = new Date(regDate);


            var followupDetails = {dof: followupDate, observations: $scope.observations, fee: $scope.fee};
            $scope.patient.followupDetails.push(followupDetails);

            $http.post('/patients', $scope.patient).success(function(data, status){
                console.log(status);
            });

            $location.path('/patients/searchResults');
        }
}
   
    
    
}])

.controller('PatientDetailsCtrl', ['$scope','$http', '$routeParams', '$location', '$filter', 'fileUpload', '$modal', 'auth', function($scope, $http, $routeParams, $location, $filter, fileUpload, $modal, auth){
    $scope.patient = {};
    $scope.availableReports = [];
    $scope.addRow = false;
    //paginator stuff
    $scope.currentPage = 1;
    $scope.pageSize = 5;
    //ends
    //$scope.isTemplate = false;
    $scope.template = {};
    $scope.toggleAddRow = function(){
        $scope.addRow = !$scope.addRow;
        
    }
    $scope.nonTemplate = true;
    $scope.templates = [];
    $scope.moreDetails = false;
    $scope.newFollowup = {};
    $scope.newFollowup.dof = new Date();
    $scope.newFollowup.otherDetails = {};
    $scope.newFollowup.otherDetails.tastes = [];
    $scope.newFollowup.otherDetails.heataggrs = [];
    $scope.newFollowup.otherDetails.skins = [];
    $scope.newFollowup.otherDetails.miastmatic = [];
    //$scope.newFollowup.otherDetails.emotions = {};
    //$scope.newFollowup.otherDetails.confidence = {};
    $scope.newFollowup.otherDetails.menstrual = [];
    $scope.newFollowup.otherDetails.leucorrhoea = [];
    $scope.newFollowup.otherDetails.breastpain = [];
    $scope.newFollowup.otherDetails.confidence = 'Bold';
    $scope.newFollowup.otherDetails.emotions = 'Cries easily';
    $scope.newFollowup.otherDetails.iddm = 'M';
    $scope.newFollowup.otherDetails.h1 = 'M';
    $scope.newFollowup.otherDetails.thyroid = 'M';
    
    
    if(auth.isLoggedIn()){
        $http.get('/patients/'+$routeParams.id).success(function(data){
            $scope.patient = data;
            var uploadUrl = "/patients/getFiles/";
            //fetch all available reports and store
              $http.get(uploadUrl+$scope.patient._id)
            .success(function(data){

            console.log(data);
                $scope.availableReports = data;
                   console.log($scope.availableReports);
        }).error(function(err, status){
            console.log(err);
        });


        }).error(function(err, status){
            console.log(err);
        });
        
        $http.get('patients/templates/getTemplates').success(function(data){
            $scope.templates = data;
            console.log($scope.templates);
        }).error(function(err, status){
            console.log(err);
        })
    }
    //fetch all available reports and store
    

    $scope.getFile = function(fileName){
        var URL = $location.$$protocol+"://"+$location.$$host+":"+$location.$$port+"/patients/upload/"+fileName.filename
        window.open(URL, '_blank');
        //fileUpload.readFileFromUrl(fileName.filename ,'/patients/upload');
    }
   // console.log("In Details: "+ $scope.patient + "$routeParams.id: "+ $routeParams.id);
	$scope.removePatient = function(){
		$http.delete('/patients/'+$scope.patient._id).success(function(data){
			console.log(data);
            
		});

		alert("Patient's record deleted");
        //$location.path('/patients/delete');
	}
    $scope.mapCheckedValues = function(from, to){
        
         angular.forEach(from, function(item){
            if(item.truthy){
                if(to === undefined){
                    to = [];
                }
                to.push(item.name);
                
            }
        });
        //to = $scope.sanitize(to);
        /*to.reduce(function(prev, cur) {
                  return (prev.indexOf(cur) < 0) ? prev.concat([cur]) : prev;
                 }, []);*/
        
        
    };
    
    $scope.sanitize = function(a) {
        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    }    
    $scope.updatePatient = function(){
        
            $scope.mapCheckedValues($scope.tastes, $scope.newFollowup.otherDetails.tastes);
            $scope.mapCheckedValues($scope.heataggrs, $scope.newFollowup.otherDetails.heataggrs);
            $scope.mapCheckedValues($scope.skins, $scope.newFollowup.otherDetails.skins);
            $scope.mapCheckedValues($scope.miastmatic, $scope.newFollowup.otherDetails.miastmatic);
            
            $scope.mapCheckedValues($scope.menstrual, $scope.newFollowup.otherDetails.menstrual);
            $scope.mapCheckedValues($scope.leucorrhoea, $scope.newFollowup.otherDetails.leucorrhoea);
            
            $scope.mapCheckedValues($scope.breastpain, $scope.newFollowup.otherDetails.breastpain);
        
        //sanitizing arrays
        $scope.newFollowup.otherDetails.skins = $scope.sanitize($scope.newFollowup.otherDetails.skins);
        $scope.newFollowup.otherDetails.tastes = $scope.sanitize($scope.newFollowup.otherDetails.tastes);
        $scope.newFollowup.otherDetails.heataggrs = $scope.sanitize($scope.newFollowup.otherDetails.heataggrs);
        $scope.newFollowup.otherDetails.miastmatic = $scope.sanitize($scope.newFollowup.otherDetails.miastmatic);
        $scope.newFollowup.otherDetails.menstrual = $scope.sanitize($scope.newFollowup.otherDetails.menstrual);
        $scope.newFollowup.otherDetails.leucorrhoea = $scope.sanitize($scope.newFollowup.otherDetails.leucorrhoea);
                $scope.newFollowup.otherDetails.breastpain = $scope.sanitize($scope.newFollowup.otherDetails.breastpain);
        console.log($scope.newFollowup);
        
        
        $scope.newFollowup.dof = $filter('date')(new Date($scope.newFollowup.dof), 'yyyy-MM-dd');
        $scope.newFollowup.dof = new Date($scope.newFollowup.dof);
        $scope.patient.donf = $filter('date')(new Date($scope.newFollowup.donf), 'yyyy-MM-dd');
        $scope.patient.donf = new Date($scope.patient.donf);
        delete $scope.newFollowup.donf;

        $scope.patient.followupDetails.push($scope.newFollowup);
        
        $scope.patient.donf = $filter('date')(new Date($scope.patient.donf), 'yyyy-MM-dd');
        $scope.patient.donf = new Date($scope.patient.donf);
		$http.put('/patients', $scope.patient).success(function(data, status){
			console.log(status);
		});
         if($scope.template.isTemplate){
             
            $http.post('/patients/templates/addTemplate', {name: $scope.template.templateName, details: $scope.patient.followupDetails[$scope.patient.followupDetails.length - 1].otherDetails}).success(function(data, status){
                console.log(status);
            });
        };
        $scope.addRow = !$scope.addRow;
        $scope.newFollowup = {};

		$location.path('/patients/details/'+$scope.patient._id);
	}
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        if(!file){
            alert("No file chosen.");
            return;
        }
       
        console.log('file is ' + file.name);
        console.dir(file);
        var uploadUrl = "/patients/upload";
        fileUpload.uploadFileToUrl(file, $scope.patient._id, uploadUrl);
        
    };
    $scope.intializeControls = function(){
        //data to hold taste checkbox value
        $scope.tastes = [
            {name: 'Chilly'},
            {name: 'Hot'},
            {name: 'Ambi'}
        ];
        //data to hold heataggr checkbox value
        $scope.heataggrs = [
            {name: 'Hot'},
            {name: 'Cold'}

        ];
        //data to hold skin checkbox value
        $scope.skins = [
            {name: 'Oily'},
            {name: 'Dry'},
            {name: 'Hairfall'},
            {name: 'Dandruff'},
            {name: 'Graying'},
            {name: 'Suntag'}

        ];

        //data to hold skin sweating value
        $scope.sweating = [
            {name: 'Head'},
            {name: 'Axila'},
            {name: 'Nosetip'},
            {name: 'Nape of Neck'},
            {name: 'All body'}

        ];

        //data to hold skin miastmatic value
        $scope.miastmatic = [
            {name: 'Psora'},
            {name: 'Psyphilitic'},
            {name: 'Sycetic'}
        ];
        //data to hold skin checkbox value
        $scope.emotions = [
            {name: 'Cries easily'},
            {name: 'Better by consolation'}
        ];
        //data to hold skin checkbox value
        $scope.menstrual = [
            {name: 'Regular'},
            {name: 'Irregular'},
            {name: 'Heavy'},
            {name: 'Scanty'}
        ];
        //data to hold skin confidence value
        $scope.confidence = [
            {name: 'Bold'},
            {name: 'Confuse'}
        ];
        //data to hold leucorrhoea checkbox value
        $scope.leucorrhoea = [
            {name: 'Acrid'},
            {name: 'Bland'},
            {name: 'Before'},
            {name: 'After'}
        ];

        $scope.breastpain = [
            {name: 'B'},
            {name: 'D'},
            {name: 'A'}
        ];
        $scope.iddm = [
            {name: 'M'},
            {name: 'F'}
        ];

        $scope.h1 = [
            {name: 'M'},
            {name: 'F'}
        ];

        $scope.thyroid = [
            {name: 'M'},
            {name: 'F'},
            {name: 'C'}
        ];
    }
    
    $scope.intializeControls();
        





   
     $scope.open = function (p) {
        var modalInstance = $modal.open({
            animation: true,
            size: 'lg',
          templateUrl: '../views/followup-details-ro.view.html',
            controller: [
                            '$scope', '$modalInstance', function($scope, $modalInstance, item){
                                $scope.cancel = function () {
                                    $modalInstance.close();
                                };
                                $scope.moreDetailsRO = false;
                                $scope.newFollowup = p;
                            }
                        ]  ,
           
                               
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            
        });
    };
    $scope.openTemplate = function (p) {
        var modalInstance = $modal.open({
            animation: true,
            size: 'lg',
            templateUrl: '../views/followup-templates-ro.view.html',
            controller: [
                            '$scope', '$modalInstance', function($scope, $modalInstance, item){
                                $scope.cancel = function () {
                                    $modalInstance.close();
                                };
                                $scope.copyThis = function () {
                                    $modalInstance.close($scope.template);
                                };
                                //$scope.moreDetailsRO = false;
                                $scope.template = p.details;
                            }
                        ]  ,
           
                               
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            $scope.intializeControls();
            if(selectedObject === undefined){
                $scope.nonTemplate = true;
            }
            else{
                $scope.nonTemplate = false;
                angular.copy(selectedObject, $scope.newFollowup.otherDetails);

                $scope.setTruthy($scope.heataggrs, $scope.newFollowup.otherDetails.heataggrs);
                $scope.setTruthy($scope.tastes, $scope.newFollowup.otherDetails.tastes);
                $scope.setTruthy($scope.miastmatic, $scope.newFollowup.otherDetails.miastmatic);
                $scope.setTruthy($scope.skins, $scope.newFollowup.otherDetails.skins);
                $scope.setTruthy($scope.menstrual, $scope.newFollowup.otherDetails.menstrual);
                $scope.setTruthy($scope.leucorrhoea, $scope.newFollowup.otherDetails.leucorrhoea);
                $scope.setTruthy($scope.breastpain, $scope.newFollowup.otherDetails.breastpain);
            }
            
        });
    };
    $scope.setTruthy = function(to, from){
       
        for(var i=0; i < to.length; i++){
            for(var j=0; j < from.length; j++){
                if(to[i].name === from[j]){
                    to[i].truthy = true;
                }
                
            }
        }
        
    }
    
      
}])



.controller('PatientEditCtrl', ['$scope','$http','$routeParams', '$location', '$filter', 'auth', function($scope, $http, $routeParams, $location, $filter, auth){
	
    $scope.gender = ['M', 'F', 'TG', 'DNWTD'];

	if(auth.isLoggedIn()){
        $http.get('/patients/'+$routeParams.id).success(function(data){
            $scope.patient = data;
            $scope.patient.donf = $filter('date')(new Date($scope.patient.donf), 'yyyy-MM-dd', 'UTC');
            $scope.patient.donf = new Date($scope.patient.donf);

        });
    }
    

	
		 $scope.editPatient = function(){
             //$scope.patient.followupDetails.push($scope.newFollowup);
		$http.put('/patients', $scope.patient).success(function(data, status){
			console.log(status);
		});
        

		$location.path('/patients/details/'+$scope.patient._id);
	}
}])
.controller('OtherController', ['$scope', function($scope){
    $scope.pageChangeHandler = function(num) {
    console.log('going to page ' + num);
  };
}])
.controller('pyScriptCtrl', ['$scope', '$http', function($scope, $http){
         $http.get('patients/pyScript/run')
        .success(function(data){
		
        console.log(data);
            $scope.resultFromPyScript = data;
               console.log($scope.resultFromPyScript);
	}).error(function(err, status){
        console.log(err);
    });
}])
.controller('PatientsDashboardCtrl', ['$scope','$http', '$location', '$filter', 'auth', function($scope, $http, $location, $filter, auth){
    if(auth.isLoggedIn()){
        //paginator stuff
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        //ends
        $scope.showAgewise = false;
        $scope.showDatewise = false;
        $scope.dashboard = {};
        $scope.dashboard.ageRange = {};
        $scope.dashboard.dateRange = {};
        $scope.dashboard.option = "1";

        $scope.clearOutput = function(option){
            $scope.patients = {};
            $scope.showAgewise = false;
                $scope.showDatewise = false;
        }

        $scope.findFollowups = function(){
            console.log($scope.dashboard);
            if($scope.dashboard.option === '2'){
                $scope.showAgewise = true;
                $scope.showDatewise = false;
                $http.get('/patients/dashboard/age',{params: {age1:$scope.dashboard.ageRange.age1, age2: $scope.dashboard.ageRange.age2, recMaster: auth.currentUser()}}).success(function(data){
                  $scope.patients = data;
        });
            }
            else {
                $scope.showDatewise = true;
                $scope.showAgewise = false;
                $scope.dashboard.dateRange.date1 = $filter('date')(new Date($scope.dashboard.dateRange.date1), 'yyyy-MM-dd');
            $scope.dashboard.dateRange.date1 = new Date($scope.dashboard.dateRange.date1);
                $scope.dashboard.dateRange.date2 = $filter('date')(new Date($scope.dashboard.dateRange.date2), 'yyyy-MM-dd');
            $scope.dashboard.dateRange.date2 = new Date($scope.dashboard.dateRange.date2);
                $http.get('/patients/dashboard/date',{params: {date1:$scope.dashboard.dateRange.date1, date2: $scope.dashboard.dateRange.date2, option: 'FL', recMaster: auth.currentUser()}}).success(function(data){
                  $scope.patients = data;
        });
            }
            $location.path('/patients/dashboard');
        }

        $scope.findNewRegs = function(){
            console.log($scope.dashboard);
            $scope.showDatewise = true;
                $scope.showAgewise = false;
                $scope.dashboard.dateRange.date1 = $filter('date')(new Date($scope.dashboard.dateRange.date1), 'yyyy-MM-dd');
            $scope.dashboard.dateRange.date1 = new Date($scope.dashboard.dateRange.date1);
                $scope.dashboard.dateRange.date2 = $filter('date')(new Date($scope.dashboard.dateRange.date2), 'yyyy-MM-dd');
            $scope.dashboard.dateRange.date2 = new Date($scope.dashboard.dateRange.date2);
                $http.get('/patients/dashboard/date',{params: {date1:$scope.dashboard.dateRange.date1, date2: $scope.dashboard.dateRange.date2, option: 'NR', recMaster: auth.currentUser()}}).success(function(data){
                  $scope.patients = data;
        });
                    $location.path('/patients/dashboard');

        }
    }
}])

.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
.directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9.]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseFloat(digits);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
}})
.directive('onlyNumbers', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits,10);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
}})

.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, patientId, uploadUrl){
        var fd = new FormData();
        
        fd.append('file', file);
        fd.append('patientId', patientId);
        console.dir(fd);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
       .success(function(data){
		alert("File uploaded successfully.")
	}).error(function(err, status){
        console.log(err);
        alert("Error uploading file.")
    });
    }
    
    this.readFileFromUrl = function(reportName, uploadUrl){
                
        $http.get(uploadUrl+"/"+reportName)
        .success(function(data){
        
        console.dir("In readFileFromUrl: "+data);
            return data;
	}).error(function(err, status){
        console.log(err);
    });
    }
}])
