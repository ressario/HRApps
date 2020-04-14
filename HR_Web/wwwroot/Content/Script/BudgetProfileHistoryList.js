function downloadCSV() {
    if ($('#txtBudgetYear').val() == '') {
        return;
    }

    var advertisingTypeId, activityId, operationId, budgetYear = null;
    advertisingTypeId = $('#txtAdvertisingType').val();
    activityId = $('#txtActivity').val();
    operationId = $('#txtOperation').val();
    budgetYear = $('#txtBudgetYear').val();

    var query =
        'AdvertisingTypeId=' + advertisingTypeId +
        '&ActivityId=' + activityId +
        '&OperationId=' + operationId +
        '&Year=' + budgetYear;
    

    window.open(MAA_API_Server + 'budget/historyListGetCSV?' + query, '_blank', '');
}

function loadBudgetProfileHistoryList() {
    if ($('#txtBudgetYear').val() == '') {
        return;
    }

    var advertisingTypeId, activityId, operationId, budgetYear = null;
    advertisingTypeId = $('#txtAdvertisingType').val();
    activityId = $('#txtActivity').val();
    operationId = $('#txtOperation').val();
    budgetYear = $('#txtBudgetYear').val();

    var data = {
        'AdvertisingTypeId': advertisingTypeId,
        'ActivityId': activityId,
        'OperationId': operationId,
        'Year': budgetYear,
        'Skip': 0,
        'Take': 10
    };

    function getGridDataSource(resultObj, page, pageSize) {
        var result = JSON.parse(resultObj)
        if (!result.Success) {
            return false;
        }
        var dataSource = new kendo.data.DataSource({
            type: "json",
            data: JSON.parse(result.Message),
            serverGrouping: true,
            schema: {
                model: {
                    fields: {
                        Form: { type: "string" },
                        CreatedBy: { type: "string" },
                        BudgetYear: { type: "number" },
                        Operation: { type: "string" },
                        AdvertisingType: { type: "string" },
                        Activity: { type: "string" },
                        BudgetAmount: { type: "string" }
                    }
                },
                total: function (data) {
                    var d = JSON.parse(result.Message);
                    if (d && d.length > 0) {
                        return d[0].TotalRow;
                    }

                    return 0;
                },
            },
            page: page,
            pageSize: pageSize,
            serverPaging: true
        });

        return dataSource;
    }
    window.kendo.ui.progress($("#budgetAdjustmentHistory"), true);
    $.post(MAA_API_Server + 'budget/historyList', data, function (result) {
        $('#budgetAdjustmentHistory').show();
        window.kendo.ui.progress($("#budgetAdjustmentHistory"), false);
        $("#budgetAdjustmentHistory").kendoGrid({
            
            dataSource: getGridDataSource(result, 1, 10),
            pageable: {
                refresh: false,
                buttonCount: 5,
                pageSizes: [10, 50, 100]
            },
            autoBind: true,
            scrollable: false,
            sortable: false,
            filterable: false,
            columns: [
                { field: "Form", title: "Form", width: "130px" },
                { field: "CreatedBy", title: "Activity", width: "130px" },
                { field: "BudgetYear", title: "Year", width: "130px" },
                { field: "Operation", title: "Operation", width: "130px" },
                { field: "AdvertisingType", title: "Advertising Type", width: "130px" },
                { field: "Activity", title: "Activity", width: "130px" },
                { field: "BudgetAmount", title: "Budget Amount", width: "130px", attributes: { class: "text-right " }, format: "{0:#,0}" }
            ]
        });
        var grid = $("#budgetAdjustmentHistory").data("kendoGrid");

        function page_item(e) {
            window.kendo.ui.progress($("#budgetAdjustmentHistory"), true);
            grid.unbind("dataBound");
            data = {
                'AdvertisingTypeId': advertisingTypeId,
                'ActivityId': activityId,
                'OperationId': operationId,
                'Year': budgetYear,
                'Skip': e.sender.dataSource.skip(),
                'Take': e.sender.dataSource.pageSize()
            };
            $.post(MAA_API_Server + 'budget/historyList', data, function (result2) {
                grid.setDataSource(getGridDataSource(result2, e.sender.dataSource.page(), e.sender.dataSource.pageSize()));
                grid.bind("dataBound", page_item);
                window.kendo.ui.progress($("#budgetAdjustmentHistory"), false);
            });
        };
        grid.bind("dataBound", page_item);
    });
}

$(document).ready(function () {
    $("#budgetAdjustmentHistory").kendoGrid({
        pageable: {
            refresh: false,
            buttonCount: 5,
            pageSizes: [10, 50, 100]
        },
        autoBind: true,
        scrollable: false,
        sortable: false,
        filterable: false,
        columns: [
            { field: "Form", title: "Form", width: "130px" },
            { field: "CreatedBy", title: "Created By", width: "130px" },
            { field: "Year", title: "Year", width: "130px" },
            { field: "Operation", title: "Operation", width: "130px" },
            { field: "AdvertisingType", title: "Advertising Type", width: "130px" },
            { field: "Activity", title: "Activity", width: "130px" },
            { field: "BudgetAmount", title: "BudgetAmount", width: "130px" }
        ]
    });

    $("#txtBudgetYear").kendoDatePicker({
        start: "decade",
        depth: "decade",
        format: "yyyy",
        change: function (e) {
            if (this.value() != null || this.value() != undefined) {
                loadBudgetProfileHistoryList();
            }
        }
    });
    $.get(MAA_API_Server + 'masterData/getAdverstisingType' + '?id=' + new Date().getTime(), function (data) {
        $("#txtAdvertisingType").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            index: 0,
            change: function (e) {
                if (this.value() != "-1") {
                    $.get(MAA_API_Server + 'masterData/getActivity' + '?param=' + this.value(), function (data) {
                        $("#txtActivity").kendoDropDownList({
                            dataTextField: "Value",
                            dataValueField: "Key",
                            dataSource: JSON.parse(data),
                            index: 0,
                            change: function (e) {
                                if (this.value() != "-1") {
                                    loadBudgetProfileHistoryList();
                                }
                            }
                        });
                    });
                }
            }
        });
    });
    
    $.get(MAA_API_Server + 'masterData/getOperation' + '?id=' + new Date().getTime(), function (data) {
        $("#txtOperation").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            index: 0,
            change: function (e) {
                if (this.value() != "-1") {
                    loadBudgetProfileHistoryList();
                }
            }
        });
    });

    $("#clearDate").click(function () {
        $("#txtBudgetYear").data("kendoDatePicker").value(null);
        $("#budgetAdjustmentHistory").kendoGrid({
            pageable: {
                refresh: false,
                buttonCount: 5,
                pageSizes: [10, 50, 100]
            },
            autoBind: true,
            scrollable: false,
            sortable: false,
            filterable: false,
            columns: [
                { field: "Form", title: "Form", width: "130px" },
                { field: "CreatedBy", title: "Activity", width: "130px" },
                { field: "BudgetYear", title: "Year", width: "130px" },
                { field: "Operation", title: "Operation", width: "130px" },
                { field: "AdvertisingType", title: "Advertising Type", width: "130px" },
                { field: "Activity", title: "Activity", width: "130px" },
                { field: "BudgetAmount", title: "Budget Amount", width: "130px" }
            ]
        });
        var grid = $("#budgetAdjustmentHistory").data("kendoGrid");
        grid.dataSource.data([]);
        return false;

    });
    $("#btnGetCSV").click(function () {
        downloadCSV();
        return false;

    });
    $("#btnText").click(function () {
        window.location = url_Web
    });
});