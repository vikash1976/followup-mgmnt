angular.module("kB")
.controller('LoginCtrl',['$scope','$http','toastr', '$location', 'auth', function($scope, $http, toastr, $location, auth){
    
	console.log('Login Controller initialized...');

	$scope.runLogin = function(){
        auth.logIn($scope.user);
    }
     $scope.currentDate = new Date();
    $http.get('/patients/config/config.json').success(function(data){
		$scope.configs = data;
	   });
    
    
    
   $scope.isLoggedIn = auth.isLoggedIn();/*function(){
		$http.post('/patients/user/login',{
			username: $scope.user.email,
			password: $scope.user.password
		}).then(function onSuccess(user){
            LoginService.user.email = user.data;
            //LoginService.authenticated = true;
            //$scope.$apply();
			$location.path('/patients/searchResults');
		}).catch(function onError(err){
			if(err.status == 400 || 404 || 500){
				toastr.error(err.data[0], 'Error', {
					closeButton: true
				});
				return;
			}
			toastr.error('An error has occured, please try again later', 'Error', {
				closeButton: true
			});
			return;
		})
	}*/
}])
.factory('auth', ['$http', '$window', '$location', 'toastr', function($http, $window, $location, toastr){
    var auth = {};

    auth.saveToken = function (token){
       
    $window.localStorage['token'] = token;
    };

    auth.getToken = function (){
      return $window.localStorage['token'];
    };
    auth.isLoggedIn = function(){   
        var token = auth.getToken();

        if(token){
            return true;
        } else {
            return false;
        }
    };
    auth.currentUser = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            //var payload = JSON.parse($window.atob(token.split('.')[1]));

            return token;
        }
    };
        
    auth.register = function(user){
        return $http.post('/patients/user/signup', user).then(function onSuccess(response){
			toastr.success('Registered successfully.', 'Success', {
					closeButton: true
				});
            $location.path('/patients/user/login');
		})
		.catch(function onError(err){
			if(err.status == 500){
				toastr.error(err.data[0], 'Error', {
					closeButton: true
				});
				return;
			}
			toastr.error('An error has occured, please try again later', 'Error', {
				closeButton: true
			});
			return;
		})
    };
        
    auth.logIn = function(user){
        return $http.post('/patients/user/login',{
			username: user.email,
			password: user.password
		}).then(function onSuccess(user){
            auth.saveToken(user.data);
            //LoginService.authenticated = true;
            //$scope.$apply();
			$location.path('/patients/searchResults');
		}).catch(function onError(err){
			if(err.status == 400 || 404 || 500){
				toastr.error(err.data[0], 'Error', {
					closeButton: true
				});
				return;
			}
			toastr.error('An error has occured, please try again later', 'Error', {
				closeButton: true
			});
			return;
		})
    };
        
    auth.logOut = function(){
           console.log('Loging out')
            $http.get('/patients/user/logout').success(function(data){
                console.log(data);
                $window.localStorage.removeItem('token');
                $location.path('/patients/user/login');
            }).error(function(err, status){
                console.log(err);
            })
             //$window.localStorage.removeItem('token');
        };
 

    return auth;
}])
.controller('SignupCtrl',['$scope', '$http', '$location', 'toastr', 'auth', function($scope, $http, $location, toastr, auth){
    
	console.log('Signup Controller initialized...');
    $scope.matched = true;
	$scope.runSignup = function(){
        auth.register($scope.user);
    }/*function(){
		console.log('Signing Up '+$scope.username);

		
		$http.post('/patients/user/signup', $scope.user)
		.then(function onSuccess(response){
			toastr.success('Registered successfully.', 'Success', {
					closeButton: true
				});
            $location.path('/patients/user/login');
		})
		.catch(function onError(err){
			if(err.status == 500){
				toastr.error(err.data[0], 'Error', {
					closeButton: true
				});
				return;
			}
			toastr.error('An error has occured, please try again later', 'Error', {
				closeButton: true
			});
			return;
		})
	}*/
    $scope.verifyPass = function(){
        $scope.matched = $scope.user.password === $scope.user.password1;
    }
}])
.controller('NavCtrl', ['$scope','auth',function($scope, auth){
    console.log('Nav Ctrl initialized');
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;/*function(){
      $scope.currentUser = null;
      auth.logOut();
  }*/
}])
.service('LoginService', ['$location', '$rootScope', function($location, $rootScope){
    this.user = {};
    this.authenticated = false;
    //$rootScope.$apply();
    this.isLoggedIn = function(){
        if(this.user.email){
            //this.authenticated = true;
            
            return true;
        }
        else {
            //this.authenticated = false;
            $location.path('/patients/user/login');
            return false;
        }
    }
}])
.run(function (LoginService, $http) {
    $http.get('/patients/user/confirmLogin')
        .success(function (user) {
            if (user) {
                LoginService.user.email = user;
                //LoginService.authenticated = true;
            }
        });
})