'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
    directive('myGrid', function() {
        return {
            restrict: 'E',
            template: '<div id="jqxgrid"></div>',
            controller: function($scope, $element, $attrs, $http, $log) {
                $('#events').jqxPanel({ width: 300, height: 80});
                $("#jqxgrid").on("sort", function (event) {
                    $("#events").jqxPanel('clearcontent');
                    var sortinformation = event.args.sortinformation;
                    var sortdirection = sortinformation.sortdirection.ascending ? "ascending" : "descending";
                    if (!sortinformation.sortdirection.ascending && !sortinformation.sortdirection.descending) {
                        sortdirection = "null";
                    }
                    var eventData = "Triggered 'sort' event <div>Column:" + sortinformation.sortcolumn + ", Direction: " + sortdirection + "</div>";
                    $('#events').jqxPanel('prepend', '<div style="margin-top: 5px;">' + eventData + '</div>');
                });
                $('#clearsortingbutton').jqxButton({ height: 25});
                $('#sortbackground').jqxCheckBox({checked: true, height: 25});
                // clear the sorting.
                $('#clearsortingbutton').click(function () {
                    $("#jqxgrid").jqxGrid('removesort');
                });
                // show/hide sort background
                $('#sortbackground').on('change', function (event) {
                    $("#jqxgrid").jqxGrid({ showsortcolumnbackground: event.args.checked });
                });



                $scope.syncData = [
                    { name: 'Billy', sname: 'Fisher'},
                    { name: 'Billy2', sname: 'Clain'},
                    { name: 'Billy3', sname: 'Brown'},
                    { name: 'Billy4', sname: 'Adams'}];
                $scope.loadData = function() {
                    $http({method: 'GET', url: '/api/data'}).
                        success(function(data, status, headers, config) {
                            $scope.syncData = data;
                        }).
                        error(function(data, status, headers, config) {
                            $log.log('Error');
                        });
                }
            },
            link:function($scope, element, attrs) {
                $scope.$watch(attrs.syncData,function(value){
                    console.log($scope.syncData);



                   // $('#jqxgrid').jqxGrid('setGridParam', {data: $scope.syncData}).trigger('reloadGrid');
                });

                // prepare the data
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: 'name', type: 'string' },
                        { name: 'sname', type: 'string' }
                    ],
                    localData: $scope.syncData,
                    sortcolumn: 'name',
                    sortdirection: 'asc'
                };
                var dataAdapter = new $.jqx.dataAdapter(source);
                // create jqxgrid.
                $("#jqxgrid").jqxGrid(
                    {
                        width: 670,
                        height: 450,
                        source: dataAdapter,
                        sortable: true,
                        filterable: true,
                        altrows: true,
                        columns: [
                            { text: ' Name', datafield: 'name', width: 250 },
                            { text: ' SName', datafield: 'sname', width: 250 }
                        ]
                    }
                );

            }

        }
    });
