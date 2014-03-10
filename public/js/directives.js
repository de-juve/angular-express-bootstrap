'use strict';

/* Directives */
var myGrid = function ($scope, $http, $q, options) {
    var self = this;
    var p = $q.defer();
    var r = p.promise;

    self.sync = true;
    self.data = [];
    self.source = {};
    self.columnDefs = {};

    self.load = function(options, p) {
        if (typeof options.columnDefs === "string") {
            self.columnDefs = $scope.$eval(options.columnDefs);
        } else {
            self.columnDefs = options.columnDefs;
        }

        if(options.sync == true){
            self.data = $scope.$eval(options.data);
            self.source = {
                datatype: "json",
                localData: self.data
            };
            p.resolve();
        } else {
            $http({method: 'GET', url: '/api/data'}).
                success(function (data, status, headers, config) {
                    console.log(data);
                    self.data = data;
                    self.source = {
                        datatype: "json",
                        localData: self.data
                    };
                    p.resolve();
                });
        }
    }

    self.load(options, p);


    self.init = function(p) {
        var dataAdapter = new $.jqx.dataAdapter(self.source);

        // create jqxgrid.
        $("#jqxgrid").jqxGrid(
            {
                width: 670,
                height: 450,
                source: dataAdapter,
                sortable: true,
                filterable: true,
                altrows: true,
                columns: self.columnDefs,
                ready: function()
                {
                    $("#jqxgrid").jqxGrid('focus');
                },
                selectionmode: 'singlecell',
                handlekeyboardnavigation: function(event)
                {
                    var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
                    if (key == 13) {
                        alert('Pressed Enter Key.');
                        return true;
                    }
                    else if (key == 27) {
                        alert('Pressed Esc Key.');
                        return true;
                    }
                }
            }
        );

        $("#jqxgrid").on('rowselect', function (event) {
            console.log("row: "+event.args.rowindex);
            //$("#selectrowindex").text(event.args.rowindex);
        });
        // display selected row index.
        $("#jqxgrid").on('cellselect', function (event) {
            var columnheader = $("#jqxgrid").jqxGrid('getcolumn', event.args.datafield).text;
            console.log("Row: " + event.args.rowindex + ", Column: " + columnheader);
        });
        return p.resolve();
    }

    self.reload = function(options) {
        console.log(options);
        var p = $q.defer();
        var r = p.promise;
        self.load(options, p);
        r.then(function() {
            console.log(self.source);
            var dataAdapter = new $.jqx.dataAdapter(self.source);

            // create jqxgrid.
            $("#jqxgrid").jqxGrid(
                {
                    width: 670,
                    height: 450,
                    source: dataAdapter,
                    sortable: true,
                    filterable: true,
                    altrows: true,
                    columns: self.columnDefs
                }
            );
        });

    }

}

angular.module('myApp.directives', []).
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]).
    directive('myGrid', ['$compile', '$http', '$q', '$log', function($compile, $http, $q, $log) {
        var myGridDirective = {
            restrict: 'E',
            scope: true,
            template: '<div id="jqxgrid"></div>',
            compile: function() {
                return {
                    pre: function($scope, iElement, iAttrs) {
                        var options = $scope.$eval(iAttrs.gridOpt);
                        var grid = new myGrid($scope, $http, $q, options);
                        var p = $q.defer();
                        var resolve = p.promise;
                        grid.init(p);
                        return  resolve.then(function() {
                            $scope.$parent.$watch('gridOptions', function (value) {
                                if(options.sync !== value.sync) {
                                    options = value;
                                    grid.reload(options);
                                } else {
                                    var cols = {}, newCols = {};
                                    if (typeof options.columnDefs === "string") {
                                        cols = $scope.$eval(options.columnDefs);
                                    } else {
                                        cols = options.columnDefs;
                                    }
                                    if (typeof value.columnDefs === "string") {
                                        newCols = $scope.$eval(value.columnDefs);
                                    } else {
                                        newCols = value.columnDefs;
                                    }
                                    if(cols.length != newCols.length) {
                                        options = value;
                                        grid.reload(options);
                                        return;
                                    }
                                    for(i = 0; i < cols.length; i++) {
                                        if(cols[i].text !== newCols[i].text ) {
                                            options = value;
                                            grid.reload(options);
                                            return;
                                        }
                                    }
                                }
                            });
                        })

                    }
                }

            }
        }
        return myGridDirective;

    }]);
