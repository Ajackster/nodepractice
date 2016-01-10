var app= angular.module('crowdSafetyApp', ["ngRoute"]);
app.config(function($routeProvider){
  
  $routeProvider.when("/Home", {templateUrl: "home.html", controller: "appController"})
  .when("/Home/missing", {templateUrl: "missing.html", controller: "appController"})
  .when("/Home/sanitary", {templateUrl: "sanitary.html", controller: "appController"})
  .when("/Home/suspicion", {templateUrl: "suspicion.html", controller: "appController"})
  .when("/Home/medical", {templateUrl: "medical.html", controller: "appController"})
  .when("/Home/agression", {templateUrl: "agression.html", controller: "appController"})
  .when("/Home/map", {templateUrl: "map.html", controller: "appController"})
  .when("/Home/admin", {templateUrl: "admin.html", controller: "appController"})
  .when("/Home/:form", {templateUrl: "form.html", controller: "formController"})
  .otherwise({redirectTo: "/Home"});
});

app.factory("globalReport", ["$rootScope", function($rootScope){
  
  var src= {};
  
  var reports = [
    {reportType: "T", subreportType: "e", text: "mp"}
    ];
    
  var lastIndex;
  
  src.setLastIndex= function(lI){
    
    lastIndex= lI;
  };
  
  src.getLastIndex= function(){
    
    return lastIndex;
  };
  src.getReports= function(){
    
    return reports;
  };
  
  src.deleteReport= function(index){
    
    alert(reports.length);
    reports.splice(index,1);
  };
  src.addReport= function(re){
    
    reports= re;
  };
  return src;
}]);

app.controller("formController", ["$scope", "$location", "$routeParams", "globalReport", function($scope, $location, $routeParams, globalReport){
  
  $scope.delReport= function(){
    
    globalReport.deleteReport(globalReport.getLastIndex());
    $location.path("Home");
  };
  $scope.reports= globalReport.getReports()[parseInt($routeParams.form)];
  
  $scope.goHome = function(){
    
    $location.path("Home");
  };
}]);
app.controller("appController", ["$scope", "$location", "$routeParams", "globalReport", function($scope, $location, $routeParams, globalReport){
  
  $scope.map = {
  center: [39, -121],
  options: function() {
      return {
        streetViewControl: false,
        scrollwheel: false
      }
  },
  events: {
    click: function(e, map) {
      alert(e.latLng.lat() + " " + e.latLng.lng());
    }
  }
};

  $scope.img1=[
    
    {name: "missing", imgage: "https://raw.githubusercontent.com/csc200/CrowdSafetyReport/master/CrowdSafetyAlerts/app/src/main/res/drawable/btn_missing.png"},
    {name: "sanitary", imgage: "https://raw.githubusercontent.com/csc200/CrowdSafetyReport/master/CrowdSafetyAlerts/app/src/main/res/drawable/btn_sanitary.png"},
    {name: "suspicion", imgage: "https://raw.githubusercontent.com/csc200/CrowdSafetyReport/master/CrowdSafetyAlerts/app/src/main/res/drawable/btn_suspicion.png"}
    ];
  $scope.img2=[
    
    {name: "medical", imgage: "https://raw.githubusercontent.com/csc200/CrowdSafetyReport/master/CrowdSafetyAlerts/app/src/main/res/drawable/btn_medical.png"},
    {name: "agression", imgage: "https://raw.githubusercontent.com/csc200/CrowdSafetyReport/master/CrowdSafetyAlerts/app/src/main/res/drawable/btn_aggression.png"},
    {name: "map", imgage: "https://raw.githubusercontent.com/csc200/CrowdSafetyReport/master/CrowdSafetyAlerts/app/src/main/res/drawable/btn_map.png"}
    ];
  $scope.reportTypes=[
    
    {name: "missing"},
    {name: "sanitary"},
    {name: "suspicion"},
    {name: "medical"},
    {name: "agression"}
    ];
 
  $scope.marker = {
  position: [38.8341, -77.2367],
  options: function(){
    return {
  draggable: true
    }
  },
  events: {
    click: function(e) {
      alert(e.latLng)
    }
  }
}

  $scope.openForm= function(index){
    
    globalReport.setLastIndex(index);
    $location.path("/Home/" + index);
  };
  
  $scope.reports= globalReport.getReports();
  
  $scope.openMissingForm = function(){
    
    $location.path("Home/missing");
  };
  
  $scope.selectReportType1= function(index){
    
    if(index===0){
      
      $location.path("Home/missing");
    }else if(index===1){
      
      $location.path("Home/sanitary");
    }else if(index===2){
      
      $location.path("Home/suspicion");
    }
  };
  
  $scope.selectReportType2= function(index){
    
    if(index===0){
      
      $location.path("Home/medical");
    }else if(index===1){
      
      $location.path("Home/agression");
    }else if(index===2){
      
      $location.path("Home/map");
    }
  };
  $scope.goHome = function(){
    
    $location.path("Home");
  };
  $scope.addReport = function(){
    
    var temp= {
      reportType: document.getElementById("reType").value,
      subreportType: document.getElementById("subreType").value,
      text: document.getElementById("txtField").value
    };
    
    $scope.reports.push(temp);
    $location.path("Home");
  };
}]);

var map= app.directive('mapCanvas', function() {
    return {
        restrict: 'E',
        link: function(scope, element) {
            var mapOptions = {
                zoom: 15,
                center: new google.maps.LatLng(38.8341, -77.2367)
            };
           
            var map= new google.maps.Map(element[0], mapOptions);
            
        function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array
            
            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }
        
        setMarker(map, new google.maps.LatLng(38.8330, -77.2350), 'CA', 'A');
        }
        
    };
});