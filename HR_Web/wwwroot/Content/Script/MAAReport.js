var numLoad = 20;
var filteryear, filteroperation, filteradvtype, filteractivity, filteryearSubTotal= "";
var loadInterval = setInterval(checkCallback, 2000);
$(document).ready(function () {
    startSpinner('loading..', 1);
    showDocument('maaList');
    displayChildMenu();
    
    loadOperationList();
    loadAdvertisingTypeList();
    loadActivityList();
    
    
    $("#txtMAAYear").kendoDatePicker({
        start: "decade",
        depth: "decade",
        format: "yyyy",
        change: function (e) {
            if (this.value() !== null || this.value() !== undefined) {
                //loadBudgetProfileHistoryList();
            }
        }
    });
    $("#txtMAAYearSubTotal").kendoDatePicker({
        start: "decade",
        depth: "decade",
        format: "yyyy",
        change: function (e) {
            if (this.value() !== null || this.value() !== undefined) {
                //loadBudgetProfileHistoryList();
            }
        }
    });

    bindGridMAAListDefault();
    bindGridSubTotalDefault();

    $('#txtMAAYear').on("change", function (e) {

        startSpinner('loading..', 1);
        filteryear = $("#txtMAAYear").val();
        filteroperation = $("#txtOperation").val();
        filteradvtype = $("#txtAdvertisingType").val();
        filteractivity = $("#txtActivity").val();
        

        if (filteryear === "" || filteryear === null) {
            filteryear = "";
        }
        if (filteroperation === "" || filteroperation === null) {
            filteroperation = "";
        }
        if (filteradvtype === "" || filteradvtype === null) {
            filteradvtype = "";
        }
        if (filteractivity === "" || filteractivity === null) {
            filteractivity = "";
        }

        $.ajax({
            type: "GET",
            data: { filteryear: filteryear, filteroperation: filteroperation, filteradvtype: filteradvtype, filteractivity: filteractivity },
            url: MAA_API_Server + 'MAAReport/GetMMAList',
            success: function (result) {
                var dataResult = JSON.parse(result);
                dataResult = JSON.parse(dataResult.Message);
                console.log(dataResult);
                maaList = dataResult;
                bindGridMAAList();

                numLoad -= 1;
                startSpinner('loading..', 0);
            },
            error: function (data) {
                alert('Something Went Wrong');
                numLoad -= 1;
                startSpinner('loading..', 0);
            }
        });

    }); 

    $('#txtOperation').on("change", function (e) {
     
        startSpinner('loading..', 1);
        filteryear = $("#txtMAAYear").val();
        filteroperation = $("#txtOperation").val();               
        filteradvtype = $("#txtAdvertisingType").val();
        filteractivity = $("#txtActivity").val();

        if (filteryear === "" || filteryear === null) {
            filteryear = "";
        }
        if (filteroperation === "" || filteroperation === null) {
            filteroperation = "";
        }
        if (filteradvtype === "" || filteradvtype === null) {
            filteradvtype = "";
        }
        if (filteractivity === "" || filteractivity === null) {
            filteractivity = "";
        }        
     
        $.ajax({
            type: "GET",
            data: { filteryear: filteryear, filteroperation: filteroperation, filteradvtype: filteradvtype, filteractivity: filteractivity },
            url: MAA_API_Server + 'MAAReport/GetMMAList',
            success: function (result) {
                var dataResult = JSON.parse(result);
                dataResult = JSON.parse(dataResult.Message);               
                maaList = dataResult;
                bindGridMAAList();

                numLoad -= 1;
                startSpinner('loading..', 0);
            },
            error: function (data) {
                alert('Something Went Wrong');
                numLoad -= 1;
                startSpinner('loading..', 0);
            }
        });

    }); 

    $('#txtAdvertisingType').on("change", function (e) {

        startSpinner('loading..', 1);
        filteryear = $("#txtMAAYear").val();
        filteroperation = $("#txtOperation").val();      
        filteradvtype = $("#txtAdvertisingType").val();
        filteractivity = $("#txtActivity").val();
        if (filteryear === "" || filteryear === null) {
            filteryear = "";
        }
        if (filteroperation === "" || filteroperation === null) {
            filteroperation = "";
        }
        if (filteradvtype === "" || filteradvtype === null) {
            filteradvtype = "";
        }
        if (filteractivity === "" || filteractivity === null) {
            filteractivity = "";
        }
             
        $.ajax({
            type: "GET",
            data: { filteryear: filteryear, filteroperation: filteroperation, filteradvtype: filteradvtype, filteractivity: filteractivity },
            url: MAA_API_Server + 'MAAReport/GetMMAList',
            success: function (result) {
                var dataResult = JSON.parse(result);
                dataResult = JSON.parse(dataResult.Message);
                maaList = dataResult;
                bindGridMAAList();

                numLoad -= 1;
                startSpinner('loading..', 0);
              
            },
            error: function (data) {
                alert('Something Went Wrong');
                numLoad -= 1;
                startSpinner('loading..', 0);
            }
        });
    }); 

    $('#txtActivity').on("change", function (e) {

        startSpinner('loading..', 1);
        filteryear = $("#txtMAAYear").val();
        filteroperation = $("#txtOperation").val();      
        filteradvtype = $("#txtAdvertisingType").val();
        filteractivity = $("#txtActivity").val();
        if (filteryear === "" || filteryear === null) {
            filteryear = "";
        }
        if (filteroperation === "" || filteroperation === null) {
            filteroperation = "";
        }
        if (filteradvtype === "" || filteradvtype === null) {
            filteradvtype = "";
        }
        if (filteractivity === "" || filteractivity === null) {
            filteractivity = "";
        }      
      
        $.ajax({
            type: "GET",
            data: { filteryear: filteryear, filteroperation: filteroperation, filteradvtype: filteradvtype, filteractivity: filteractivity },
            url: MAA_API_Server + 'MAAReport/GetMMAList',
            success: function (result) {
                var dataResult = JSON.parse(result);
                dataResult = JSON.parse(dataResult.Message);
                maaList = dataResult;
                bindGridMAAList();

                numLoad -= 1;
                startSpinner('loading..', 0);
             
            },
            error: function (data) {
                alert('Something Went Wrong');
                numLoad -= 1;
                startSpinner('loading..', 0);
            }
        });
    }); 

    $("#chkOperation").click(function () {
        startSpinner('loading..', 1);
        var isCheckedOperation = $('#chkOperation').is(":checked");
        var isCheckedAdvertisingType = $('#chkAdv').is(":checked");
        var isCheckedActivity = $('#chkActivity').is(":checked");
        txtMAAYearSubTotal = $("#txtMAAYearSubTotal").val();

        if (txtMAAYearSubTotal === "" || txtMAAYearSubTotal === null) {
            txtMAAYearSubTotal = "";
        }
        $.ajax({
            type: "GET",
            data: { filteryear: txtMAAYearSubTotal, filteroperation: isCheckedOperation, filteradvtype: isCheckedAdvertisingType, filteractivity: isCheckedActivity },
            url: MAA_API_Server + 'MAAReport/GetMMASubtotal',
            success: function (result) {
                var resultData = JSON.parse(result);
                resultData = JSON.parse(resultData.Message);             
                subTotalList = resultData;
                bindGridSubTotal();

                numLoad -= 1;
                startSpinner('loading..', 0);
            },
            error: function (data) {
                alert('Something Went Wrong');
                numLoad -= 1;
                startSpinner('loading..', 0);
            }
        });
    });

    $("#chkAdv").click(function () {
        startSpinner('loading..', 1);
        var isCheckedOperation = $('#chkOperation').is(":checked");
        var isCheckedAdvertisingType = $('#chkAdv').is(":checked");
        var isCheckedActivity = $('#chkActivity').is(":checked");
        txtMAAYearSubTotal = $("#txtMAAYearSubTotal").val();

        if (txtMAAYearSubTotal === "" || txtMAAYearSubTotal === null) {
            txtMAAYearSubTotal = "";
        }
        $.ajax({
            type: "GET",
            data: { filteryear: txtMAAYearSubTotal, filteroperation: isCheckedOperation, filteradvtype: isCheckedAdvertisingType, filteractivity: isCheckedActivity },
            url: MAA_API_Server + 'MAAReport/GetMMASubtotal',
            success: function (result) {
                var resultData = JSON.parse(result);
                resultData = JSON.parse(resultData.Message);              
                subTotalList = resultData;
                bindGridSubTotal();

                numLoad -= 1;
                startSpinner('loading..', 0);
            },
            error: function (data) {
                alert('Something Went Wrong');
                numLoad -= 1;
                startSpinner('loading..', 0);
            }
        });
    
    });

    $("#chkActivity").click(function () {
        startSpinner('loading..', 1);
        var isCheckedOperation = $('#chkOperation').is(":checked");
        var isCheckedAdvertisingType = $('#chkAdv').is(":checked");
        var isCheckedActivity = $('#chkActivity').is(":checked");
        txtMAAYearSubTotal = $("#txtMAAYearSubTotal").val();

        if (txtMAAYearSubTotal === "" || txtMAAYearSubTotal === null) {
            txtMAAYearSubTotal = "";
        }
        $.ajax({
            type: "GET",
            data: { filteryear: txtMAAYearSubTotal, filteroperation: isCheckedOperation, filteradvtype: isCheckedAdvertisingType, filteractivity: isCheckedActivity },
            url: MAA_API_Server + 'MAAReport/GetMMASubtotal',
            success: function (result) {
                var resultData = JSON.parse(result);
                resultData = JSON.parse(resultData.Message);
             
                subTotalList = resultData;
                bindGridSubTotal();

                numLoad -= 1;
                startSpinner('loading..', 0);
            },
            error: function (data) {
                alert('Something Went Wrong');
                numLoad -= 1;
                startSpinner('loading..', 0);
            }
        });
       
    });

    $('#txtMAAYearSubTotal').on("change", function (e) {

        startSpinner('loading..', 1);
        var isCheckedOperation = $('#chkOperation').is(":checked");
        var isCheckedAdvertisingType = $('#chkAdv').is(":checked");
        var isCheckedActivity = $('#chkActivity').is(":checked");
        txtMAAYearSubTotal = $("#txtMAAYearSubTotal").val();

        if (txtMAAYearSubTotal === "" || txtMAAYearSubTotal === null) {
            txtMAAYearSubTotal = "";
        }
        $.ajax({
            type: "GET",
            data: { filteryear: txtMAAYearSubTotal, filteroperation: isCheckedOperation, filteradvtype: isCheckedAdvertisingType, filteractivity: isCheckedActivity },
            url: MAA_API_Server + 'MAAReport/GetMMASubtotal',
            success: function (result) {
                var resultData = JSON.parse(result);
                resultData = JSON.parse(resultData.Message);

                subTotalList = resultData;
                bindGridSubTotal();

                numLoad -= 1;
                startSpinner('loading..', 0);
            },
            error: function (data) {
                alert('Something Went Wrong');
                numLoad -= 1;
                startSpinner('loading..', 0);
            }
        });

    }); 
 
});

function checkCallback() {
    if (numLoad <= 0) {
        window.clearInterval(loadInterval);
        startSpinner('loading..', 0);
    }
}

function loadOperationList() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getOperation',
     
        success: function (msg) {
            $("#txtOperation").empty();
            $("#txtOperation").append('<option value="" selected>All</option>');
            var data = JSON.parse(msg);
          
            for (var i = 0; i < data.length; i++) {
                $("#txtOperation").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }          
            numLoad -= 1;
            startSpinner('loading..', 0);
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
            startSpinner('loading..', 0);
        }
    });
}

function loadAdvertisingTypeList() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getAdverstisingType',
        success: function (msg) {
            $("#txtAdvertisingType").empty();
            $("#txtAdvertisingType").append('<option value="" selected>All</option>');
            var data = JSON.parse(msg);
         
            for (var i = 0; i < data.length; i++) {
                $("#txtAdvertisingType").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
            startSpinner('loading..', 0);
        },
        error: function (data) {
            alert('Something Went Wrong');  
            numLoad -= 1;
            startSpinner('loading..', 0);
        }
    });
}

function loadActivityList() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getActivity',
        data: { param: $('#txtAdvertisingType').val() },
        success: function (msg) {
            $("#txtActivity").empty();
            $("#txtActivity").append('<option value="" selected >All</option>');
            var data = JSON.parse(msg);
           
            for (var i = 0; i < data.length; i++) {
                $("#txtActivity").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
            startSpinner('loading..', 0);
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
            startSpinner('loading..', 0);
        }
    });
}

var typeReport = "";

function showDocument(status) {
    if (status === "maaList") {
      
        $("#subTotalFilter").hide();
        $("#maaListFilter").show();
        $("#gridSubTotal").hide();
        $("#gridMAAList").show();
        typeReport = "maaList";
    }
    else {
    
        $("#maaListFilter").hide();
        $("#subTotalFilter").show();
        //bindGridFilterSubTotal();
        $("#gridMAAList").hide();
        $("#gridSubTotal").show();
        typeReport = "subTotal";
    }
}

function exportCSV() {
    startSpinner('loading..', 1);
    var urlExport = "";
    var query = "";
    if (typeReport === "maaList") {
      
        filteryear = $("#txtMAAYear").val();
        filteroperation = $("#txtOperation").val();
        filteradvtype = $("#txtAdvertisingType").val();
        filteractivity = $("#txtActivity").val();
        
        query =
            'filteradvtype=' + filteradvtype +
            '&filteractivity=' + filteractivity +
            '&filteroperation=' + filteroperation +
            '&filteryear=' + filteryear;

        urlExport = MAA_API_Server + 'MAAReport/GetMMAListCSV';
       

    }
    else {
        var isCheckedOperation = $('#chkOperation').is(":checked");
        var isCheckedAdvertisingType = $('#chkAdv').is(":checked");
        var isCheckedActivity = $('#chkActivity').is(":checked");
        txtMAAYearSubTotal = $("#txtMAAYearSubTotal").val();

        query =
            'filteradvtype=' + isCheckedAdvertisingType +
            '&filteractivity=' + isCheckedActivity +
            '&filteroperation=' + isCheckedOperation +
            '&filteryear=' + txtMAAYearSubTotal;

       // window.open(MAA_API_Server + 'MAAReport/GetMMASubtotalCSV?' + querySub, '_blank', '');
        urlExport = MAA_API_Server + 'MAAReport/GetMMASubtotalCSV';

    }

    $.ajax({
        url: urlExport,
        method: 'GET',
        data: query,
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data) {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = 'MAAReport.csv';
            a.click();
            window.URL.revokeObjectURL(url);
            startSpinner('loading..', 0);
        },
        error: function (data) {
            alert('Something Went Wrong');
            // numLoad -= 1;
            startSpinner('loading..', 0);
        }
    });

}

function loadMAAList() {
    filteryear = $("#txtMAAYear").val();
    filteroperation = $("#txtOperation").val();
    filteradvtype = $("#txtAdvertisingType").val();
    filteractivity = $("#txtActivity").val();

    var query1 =
        'filteradvtype=' + filteradvtype +
        '&filteractivity=' + filteractivity +
        '&filteroperation=' + filteroperation +
        '&filteryear=' + filteryear;
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'MAAReport/GetMMAList',
        data: query1,
        success: function (result) {                     
            var dataResult = JSON.parse(result);
            dataResult = JSON.parse(dataResult.Message);
           
            maaList = dataResult;
            bindGridMAAList();
            //numLoad -= 1;
        },
        error: function (data) {
            alert('Something Went Wrong');
           // numLoad -= 1;
        }
    });
}

function loadSubTotal() {    
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'MAAReport/GetMMASubtotal',
        success: function (result) {
            var resultData = JSON.parse(result);
            resultData = JSON.parse(resultData.Message);
            console.log(resultData);
            subTotalList = resultData;
            bindGridSubTotal();
            //numLoad -= 1;
        },
        error: function (data) {
            alert('Something Went Wrong');
            //numLoad -= 1;
        }
    });
}

function bindGridMAAList() {
    $("#gridMAAList").kendoGrid({
        dataSource: {
            data: maaList,
            schema: {
                model: {
                    fields: {
                        Form: { type: "string" },
                        RequestNumber: { type: "string" },
                        Period: { type: "string" },
                        Requestor: { type: "string" },
                        Operation: { type: "string" },
                        AdvertisingType: { type: "string" },
                        Activity: { type: "string" },
                        MarketingProgram: { type: "string" },
                        Market: { type: "string" },
                        PendingBy: { type: "string" },
                        DocumentStatus: { type: "string" },
                        ApprovalStatus: { type: "number" },
                        AmountRequest: { type: "number" },
                        ApprovalStatusDesc: { type: "string" },
                        OperationDesc: { type: "string" },
                        AdvertisingTypeDesc: { type: "string" },
                        ActivityDesc: { type: "string" },
                        MarketingProgramDesc: { type: "string" },
                        MarketDesc: { type: "string" },
                        JoinActivityDesc: { type: "string" },
                        RegionDesc: { type: "string" },
                        StatusDesc: { type: "string" },
                        ActivityPeriodFrom: {type:"date"},
                        ActivityPeriodTo: { type: "date" },
                        Description: { type: "string" },
                        ReferenceNumber: { type: "string" }
                    }
                }
            },
            pageSize: 10
        },

        groupable: false,
        sortable: true,
        noRecords: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [{
            field: "Form",
            title: "Form"
        }, {
                field: "RequestNumber",
                template: "#if(Form  == 'Submission') {#<a href='" + url_Web + "DMERequest?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                    "else if(Form  == 'Top Up') { #<a href='" + url_Web + "BudgetTopUp?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                    "else if(Form == 'Reversal') { #<a href='" + url_Web + "DMEReverse?id=#=RequestNumber#'>#:RequestNumber#</a># } #",
            title: "Request Number"
            }, {
                field: "ReferenceNumber",
                title: "Reference Number"
            },
            {
            field: "Period",
            title: "Period"
        }, {
            field: "StatusDesc",
            title: "Request Status"              
        }, {
            field: "ActivityPeriodFrom",
            title: "Period From",
            type: "date",
            format: "{0:dd/MM/yyyy}"
        }, {
            field: "ActivityPeriodTo",
            title: "Period To",
            type: "date",
            format: "{0:dd/MM/yyyy}"
        },{
            field: "Requestor",
            title: "Requestor"
        }, {
            field: "RegionDesc",
            title: "Region"
        },{
            field: "OperationDesc",
            title: "Operation"
        }, {
            field: "AdvertisingTypeDesc",
            title: "Advertising Type"
        }, {
            field: "ActivityDesc",
            title: "Activity"
        }, {
            field: "MarketingProgramDesc",
            title: "Marketing Program"
        }, {
        field: "Description",
        title: "Description"
        },
            {
            field: "JoinActivityDesc",
            title: "Join Activity"
        }, {
            field: "MarketDesc",
            title: "Market"
        }, {
            field: "PendingBy",
            title: "Pending By"
        }, {
            field: "AmountRequest",
            format: "{0:#,0}",
            attributes: { class: "text-right" },
            title: "Budget Amount"
        }]
    });
}

function bindGridSubTotal() {
    $("#gridSubTotal").kendoGrid({
        dataSource: {
            data: subTotalList,
            schema: {
                model: {
                    fields: {
                        Form: { type: "string" },
                        RequestNumber: { type: "string" },
                        Period: { type: "string" },
                        Requestor: { type: "string" },
                        Operation: { type: "string" },
                        AdvertisingType: { type: "string" },
                        Activity: { type: "string" },
                        MarketingProgram: { type: "string" },
                        Market: { type: "string" },
                        PendingBy: { type: "string" },
                        DocumentStatus: { type: "string" },
                        ApprovalStatus: { type: "number" },
                        AmountRequest: { type: "number" },
                        ApprovalStatusDesc: { type: "string" },
                        OperationDesc: { type: "string" },
                        AdvertisingTypeDesc: { type: "string" },
                        ActivityDesc: { type: "string" },
                        MarketingProgramDesc: { type: "string" },
                        MarketDesc: { type: "string" },
                        JoinActivityDesc: { type: "string" },
                        RequestYear: {type:"string"}

                    }
                }
            },
            pageSize: 10,
            aggregate: [
                { field: "AmountRequest", aggregate: "sum" }
            ]
        },

        groupable: false,
        sortable: true,
        noRecords: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [{
            field: "Form",
            title: "Form"
        }, {
            field: "Requestor",
            title: "Created By"
        }, {
            field: "RequestYear",
            title: "Year"
        },  {
            field: "OperationDesc",
            title: "Operation"
        }, {
            field: "AdvertisingTypeDesc",
            title: "Advertising Type"
        }, {
            field: "ActivityDesc",
            title: "Activity"
        }, {
            field: "AmountRequest",
            title: "Budget Amount",
            format: "{0:#,0}",
            aggregates: ["sum"],
            attributes: { class: "text-right" },          
            footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>"
               
        }]
    });
}

function bindGridFilterSubTotal() {
    $("#gridFilterSubTotal").kendoGrid({
        dataSource: {
            data: FilterSubTotal,
            pageSize: 5
        },

        groupable: false,
        sortable: false,
        scrollable: false,
        pageable: {
            info: false,
            refresh: false,
            pageSizes: false,
            previousNext: false,
            numeric: false,
            input: false
        },
        columns: [{ selectable: true, width: "30px" },
        {
            field: "Name",
            title: "Name"
        }]
    });
}

function goToSubTotal() {

    var el = document.getElementById('textGrid').innerText;

    if (el === "MAA List") {
        showDocument('');
        document.getElementById("textGrid").innerText = "Sub Total";
        document.getElementById("btnSubTotal").innerText = "MAA List";
    }
    else {
        showDocument('maaList');
        document.getElementById("textGrid").innerText = "MAA List";
        document.getElementById("btnSubTotal").innerText = "Sub Total";
    }

}

function displayChildMenu() {
    jQuery(function ($) {
        $('.active a.clickable').on("click", function (e) {
            if ($(this).hasClass('panel-collapsed')) {
                // expand the panel
                $(this).parents('.active').find('.collapsein').slideDown();
                $(this).removeClass('panel-collapsed');
                $(this).find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            }
            else {
                // collapse the panel
                $(this).parents('.active').find('.collapsein').slideUp();
                $(this).addClass('panel-collapsed');
                $(this).find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            }
        });
    });
}

function bindGridMAAListDefault() {
    $("#gridMAAList").kendoGrid({
        dataSource: {
            data: loadMAAList(),
            schema: {
                model: {
                    fields: {
                        Form: { type: "string" },
                        RequestNumber: { type: "string" },
                        Period: { type: "string" },
                        Requestor: { type: "string" },
                        Operation: { type: "string" },
                        AdvertisingType: { type: "string" },
                        Activity: { type: "string" },
                        MarketingProgram: { type: "string" },
                        Market: { type: "string" },
                        PendingBy: { type: "string" },
                        DocumentStatus: { type: "string" },
                        ApprovalStatus: { type: "number" },
                        AmountRequest: { type: "number" },
                        ApprovalStatusDesc: { type: "string" },
                        OperationDesc: { type: "string" },
                        AdvertisingTypeDesc: { type: "string" },
                        ActivityDesc: { type: "string" },
                        MarketingProgramDesc: { type: "string" },
                        MarketDesc: { type: "string" },
                        JoinActivityDesc: { type: "string" },
                        RegionDesc: { type: "string" },
                        StatusDesc: { type: "string" },
                        ActivityPeriodFrom: { type: "date" },
                        ActivityPeriodTo: { type: "date" },
                        Description: { type: "string" },
                        ReferenceNumber: { type: "string" }

                    }
                }
            },
            pageSize: 10
        },

        groupable: false,
        sortable: true,
        noRecords: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [{
            field: "Form",
            title: "Form"
        }, {
            field: "RequestNumber",
            title: "Request Number"
        },{
            field: "ReferenceNumber",
            title: "Reference Number"
        },{
            field: "Period",
            title: "Period"
        }, {
            field: "StatusDesc",
            title: "Request Status"
        },{
            field: "ActivityPeriodFrom",
            title: "Period From",
            type: "date",
            format: "{0:dd/MM/yyyy}"
        },{
            field: "ActivityPeriodTo",
            title: "Period To",
            type: "date",
            format: "{0:dd/MM/yyyy}"
        },
        {
            field: "Requestor",
            title: "Requestor"
        }, {
            field: "RegionDesc",
            title: "Region"
        }, {
            field: "OperationDesc",
            title: "Operation"
        }, {
            field: "AdvertisingTypeDesc",
            title: "Advertising Type"
        }, {
            field: "ActivityDesc",
            title: "Activity"
        }, {
            field: "MarketingProgramDesc",
            title: "Marketing Program"
            },
        {
            field: "Description",
            title: "Description"
        },
            {
            field: "JoinActivityDesc",
            title: "Join Activity"
        }, {
            field: "MarketDesc",
            title: "Market"
        }, {
            field: "PendingBy",
            title: "Pending By"
        }, {
            field: "AmountRequest",
            format: "{0:#,0}",
            attributes: { class: "text-right" },
            title: "Budget Amount"
        }]
    });
}

function bindGridSubTotalDefault() {
    $("#gridSubTotal").kendoGrid({
        dataSource: {
            data: loadSubTotal(),
            schema: {
                model: {
                    fields: {
                        Form: { type: "string" },
                        RequestNumber: { type: "string" },
                        Period: { type: "string" },
                        Requestor: { type: "string" },
                        Operation: { type: "string" },
                        AdvertisingType: { type: "string" },
                        Activity: { type: "string" },
                        MarketingProgram: { type: "string" },
                        Market: { type: "string" },
                        PendingBy: { type: "string" },
                        DocumentStatus: { type: "string" },
                        ApprovalStatus: { type: "number" },
                        AmountRequest: { type: "number" },
                        ApprovalStatusDesc: { type: "string" },
                        OperationDesc: { type: "string" },
                        AdvertisingTypeDesc: { type: "string" },
                        ActivityDesc: { type: "string" },
                        MarketingProgramDesc: { type: "string" },
                        MarketDesc: { type: "string" },
                        JoinActivityDesc: { type: "string" },
                        RequestYear: { type: "string" }

                    }
                }
            },
            pageSize: 10
        },

        groupable: false,
        sortable: true,
        noRecords: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [{
            field: "Form",
            title: "Form"
        }, {
            field: "Requestor",
            title: "Created By"
        }, {
            field: "RequestYear",
            title: "Year"
        }, {
            field: "OperationDesc",
            title: "Operation"
        }, {
            field: "AdvertisingTypeDesc",
            title: "Advertising Type"
        }, {
            field: "ActivityDesc",
            title: "Activity"
        }, {
            field: "AmountRequest",
            format: "{0:#,0}",
            attributes: { class: "text-right" },
            title: "Total Request Amount"
        }]
    });
}