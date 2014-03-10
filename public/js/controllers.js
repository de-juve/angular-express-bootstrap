'use strict';

/* Controllers */

function AppCtrl($scope, $http, $log) {
    $http({method: 'GET', url: '/api/name'}).
        success(function (data, status, headers, config) {
            $scope.name = data.name;
        }).
        error(function (data, status, headers, config) {
            $scope.name = 'Error!'
        });

    $scope.gridSource = {sync: 1};
    $scope.gridCols = [{name: "First name"}, {name: "Second name"}];
    $scope.gridData = [
        { name: 'Billy', sname: 'Fisher'},
        { name: 'Billy2', sname: 'Clain'},
        { name: 'Billy3', sname: 'Brown'},
        { name: 'Billy4', sname: 'Adams'}
    ];


}

function MyCtrl1() {
}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];

function MyCtrl3($scope) {
    $scope.gridOptions = {
        data: 'myData',
        sync: true,
        columnDefs: [{ text: 'Name', datafield: "name", width: 120 },
            { text: 'Age', datafield: "age", width: 120 }]
    };
    $scope.myData = [{ name: "Moroni", age: 50},
        { name: "Tiancum", age: 43 },
        { name: "Jacob", age: 27 },
        { name: "Nephi", age: 29 },
        { name: "Enos", age: 34 },
        { name: "Moroni", age: 50 },
        { name: "Tiancum", age: 43 },
        { name: "Jacob", age: 27 },
        { name: "Nephi", age: 29 },
        { name: "Enos", age: 34 },
        { name: "Moroni", age: 50 },
        { name: "Tiancum", age: 43 },
        { name: "Jacob", age: 27 },
        { name: "Nephi", age: 29 },
        { name: "Enos", age: 34 }];

    $scope.sync = function () {
        console.log('sync');
        $scope.gridOptions = {
            data: 'myData',
            sync: true,
            columnDefs: [{ text: 'Name', datafield: "name", width: 120 },
                { text: 'Age', datafield: "age", width: 120 }]
        };
    }

    $scope.async = function () {
        console.log('async');
        $scope.gridOptions = {
            sync: false,
            columnDefs: [{ text: 'Name', datafield: "name", width: 120 },
                { text: 'Sur name', datafield: "sname", width: 120 }]
        };
    }

}
MyCtrl3.$inject = ['$scope'];

function MyCtrl4() {
}
MyCtrl4.$inject = [];

