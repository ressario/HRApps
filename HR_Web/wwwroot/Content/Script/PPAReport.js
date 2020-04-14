var numLoad = 3;
var loadInterval = setInterval(checkCallback, 2000);

function checkCallback() {
    if (numLoad <= 0) {
        window.clearInterval(loadInterval);
        startSpinner('loading..', 0);
    }
};

$(document).ready(function () {
    startSpinner('loading..', 1);
    showDocument('ppaList');
    displayChildMenu();

    ReportYear();
    AllOperationFunction();
    AllReasonCodeFunction();
    AllPromoTypeFunction();

    checkboxSubTotal();
});

var status = "ppaList";
var ddlYear, ddlOps, ddlReason, ddlPromo, ppaList;
var ddlYearSubTotal, subTotalList;
var filteroperation, filterReason, filterPromoType;
function ReportYear() {
    ddlYear = $("#txtBudgetYear").kendoDatePicker({
        start: "decade",
        depth: "decade",
        format: "yyyy",
        change: function (e) {
            if (this.value() !== null || this.value() !== undefined) {
                LoadPPAList();
            }
        }
    }).data("kendoDatePicker");
    $("#clearDate").click(function () {
        $("#txtBudgetYear").data("kendoDatePicker").value(null);
    });

    ddlYearSubTotal = $("#txtYearSubTotal").kendoDatePicker({
        start: "decade",
        depth: "decade",
        format: "yyyy",
        change: function (e) {
            if (this.value() !== null || this.value() !== undefined) {
                LoadPPASubTotal();
            }
        }
    }).data("kendoDatePicker");
    $("#clearDateSubTotal").click(function () {
        $("#txtYearSubTotal").data("kendoDatePicker").value(null);
    });
}

function AllOperationFunction() {
    $.get(MAA_API_Server + 'masterData/getOperation', function (data) {
        ddlOps = $("#txtOperation").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            optionLabel: "All",
            filter: "contains",
            dataSource: JSON.parse(data),
            index: 0,
            select: function (e) {
                filteroperation = e.dataItem.Key;
                LoadPPAList();
            }
        }).data("kendoDropDownList");
        numLoad -= 1;
    });
}

function AllReasonCodeFunction() {
    $.get(MAA_API_Server + 'masterData/getReasonCode', function (data) {
        ddlReason = $("#txtReasonCode").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            optionLabel: "All",
            dataSource: JSON.parse(data),
            index: 0,
            select: function (e) {
                filterReason = e.dataItem.Key;
                LoadPPAList();
            }
        }).data("kendoDropDownList");
        numLoad -= 1;
    });
}

function AllPromoTypeFunction() {
    $.get(MAA_API_Server + 'PromoProgram/GetAllData', function (data) {
        ddlPromo = $("#txtPromoType").kendoDropDownList({
            dataTextField: "PromotionType",
            dataValueField: "PromotionKey",
            optionLabel: "All",
            dataSource: JSON.parse(data),
            index: 0,
            select: function (e) {
                filterPromoType = e.dataItem.PromotionKey;
                LoadPPAList();
            }
        }).data("kendoDropDownList");
        numLoad -= 1;
    });
}

function LoadPPAList() {
    startSpinner('loading..', 1);
    var filteryear = $("#txtBudgetYear").val();
    //filteroperation = $("#txtOperation").val();
    //filterReason = $("#txtReasonCode").val();
    //filterPromoType = $("#txtPromoType").val();
    if (filteryear === "" || filteryear === null || filteryear === undefined) {
        filteryear = "";
    }
    if (filteroperation === "" || filteroperation === null || filteroperation === undefined) {
        filteroperation = "";
    }
    if (filterReason === "" || filterReason === null || filterReason === undefined) {
        filterReason = "";
    }
    if (filterPromoType === "" || filterPromoType === null || filterPromoType === undefined) {
        filterPromoType = "";
    }

    $.ajax({
        type: "GET",
        data: { filteryear: filteryear, filteroperation: filteroperation, filterReason: filterReason, filterPromoType: filterPromoType },
        url: MAA_API_Server + 'PPAReport/GetPPAList',
        success: function (result) {
            var dataResult = JSON.parse(result);
            startSpinner('loading..', 0);
            if (dataResult.Success) {
                dataResult = JSON.parse(dataResult.Message);
                ppaList = dataResult;
                bindGridPPAList();
            }
            else {
                swal({
                    type: 'warning',
                    title: 'Error',
                    text: dataResult.Message
                });
            };
        },
        error: function (data) {
            alert('Something Went Wrong');
            startSpinner('loading..', 0);
        }
    });
}

function bindGridPPAList() {
    $("#gridPPAList").kendoGrid({
        dataSource: {
            data: ppaList,
            schema: {
                model: {
                    fields: {
                        Form: { type: "string" },
                        RequestNumber: { type: "string" },
                        Period: { type: "string" },
                        RequestStatus: { type: "string" },
                        Requestor: { type: "string" },
                        OperationID: { type: "string" },
                        Operation: { type: "string" },
                        ReasonCodeID: { type: "string" },
                        ReasonCode: { type: "string" },
                        PromotionTypeID: { type: "string" },
                        PromotionType: { type: "string" },
                        PeriodStart: { type: "string" },
                        PeriodEnd: { type: "string" },
                        PendingBy: { type: "string" },
                        TotalDiscount: { type: "number" }
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
                template: "#if(Form  == 'Sampling Direct') {#<a href='" + url_Web + "SamplingDirect?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                    "else if(Form  == 'Sampling Indirect') { #<a href='" + url_Web + "SamplingIndirect?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                    "else if(Form  == 'Held Base Price') { #<a href='" + url_Web + "PricingHeldBase?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                    "else if(Form  == 'Pricing') { #<a href='" + url_Web + "PricingGWP?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                    "else if(Form  == 'Promo Period') { #<a href='" + url_Web + "PromoOnInvoicePeriod?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                    "else if(Form == 'Promo On Invoice') { #<a href='" + url_Web + "PromoOnInvoiceRequest?id=#=RequestNumber#'>#:RequestNumber#</a># } #",
            title: "Request Number"
            }, {
                field: "Period",
                title: "Period"
        }, {
                field: "RequestStatus",
                title: "Request Status"
        }, {
                field: "Requestor",
                title: "Requestor"
        }, {
                field: "Operation",
                title: "Operation"
        }, {
                field: "ReasonCode",
                title: "ReasonCode"
        }, {
                field: "PromotionType",
                title: "Promotion Type"
        }, {
                field: "PeriodStart",
                title: "Period Start"
        }, {
                field: "PeriodEnd",
                title: "Period End"
        }, {
                field: "PendingBy",
                title: "Pending By"
        }, {
                field: "TotalDiscount",
                format: "{0:#,0}",
                attributes: { class: "text-right" },
                title: "Total Discount"
        }]
    });
}

function checkboxSubTotal() {
    $("#chkRequestor").click(function () {
        LoadPPASubTotal();
    });
    $("#chkOperation").click(function () {
        LoadPPASubTotal();
    });
    $("#chkReason").click(function () {
        LoadPPASubTotal();
    });
    $("#chkPromotion").click(function () {
        LoadPPASubTotal();
    });
    $("#chkProgCat").click(function () {
        LoadPPASubTotal();
    });
}

function LoadPPASubTotal() {
    startSpinner('loading..', 1);
    var isRequestor = $('#chkRequestor').is(":checked");
    var isOperation = $('#chkOperation').is(":checked");
    var isReason = $('#chkReason').is(":checked");
    var isPromotion = $('#chkPromotion').is(":checked");
    var isProgram = $('#chkProgCat').is(":checked");
    var txtSubTotalYear = $("#txtYearSubTotal").val();

    if (txtSubTotalYear === "" || txtSubTotalYear === null || txtSubTotalYear === undefined) {
        txtSubTotalYear = "";
    }
    $.ajax({
        type: "GET",
        data: {
            filteryear: txtSubTotalYear,
            filterRequestor: isRequestor,
            filteroperation: isOperation,
            filterReason: isReason, 
            filterPromoType: isPromotion,
            filterProgCat: isProgram
        },
        url: MAA_API_Server + 'PPAReport/GetPPASubtotal',
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
                        RequestStatus: { type: "string" },
                        Requestor: { type: "string" },
                        OperationID: { type: "string" },
                        Operation: { type: "string" },
                        ReasonCodeID: { type: "string" },
                        ReasonCode: { type: "string" },
                        PromotionTypeID: { type: "string" },
                        PromotionType: { type: "string" },
                        ProgramCategory: { type: "string" },
                        PeriodEnd: { type: "string" },
                        PendingBy: { type: "string" },
                        TotalDiscount: { type: "number" }
                    }
                }
            },
            pageSize: 10,
            aggregate: [
                { field: "TotalDiscount", aggregate: "sum" }
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
                field: "RequestNumber",
                template: "#if(Form  == 'Sampling Direct') {#<a href='" + url_Web + "SamplingDirect?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                    "else if(Form  == 'Sampling Indirect') { #<a href='" + url_Web + "SamplingIndirect?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                    "else if(Form  == 'Held Base Price') { #<a href='" + url_Web + "PricingHeldBase?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                    "else if(Form  == 'Pricing') { #<a href='" + url_Web + "PricingGWP?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                    "else if(Form  == 'Promo Period') { #<a href='" + url_Web + "PromoOnInvoicePeriod?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                    "else if(Form == 'Promo On Invoice') { #<a href='" + url_Web + "PromoOnInvoiceRequest?id=#=RequestNumber#'>#:RequestNumber#</a># } #",
                title: "Request Number"
            }, {
                field: "Period",
                title: "Period"
            }, {
                field: "RequestStatus",
                title: "Request Status"
            }, {
                field: "Requestor",
                title: "Requestor"
            }, {
                field: "Operation",
                title: "Operation"
            }, {
                field: "ReasonCode",
                title: "ReasonCode"
            }, {
                field: "PromotionType",
                title: "Promotion Type"
            }, {
                field: "ProgramCategory",
                title: "Program Category"
            }, {
                field: "PeriodStart",
                title: "Period Start"
            }, {
                field: "PeriodEnd",
                title: "Period End"
            }, {
                field: "PendingBy",
                title: "Pending By"
            }, {
                field: "TotalDiscount",
                title: "Total Discount",
                format: "{0:#,0}",
                aggregates: ["sum"],
                attributes: { class: "text-right" },
                footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>",
                footerAttributes: { class: "text-right" }
            }]
    });
}

function showDocument(tempStatus) {
    status = tempStatus;
    if (tempStatus === "ppaList") {
        //alert('a');
        $("#subTotalFilter").hide();
        $("#ppaListFilter").show();
        $("#gridSubTotal").hide();
        $("#gridPPAList").show();
    }
    else {
        //alert('b');
        $("#ppaListFilter").hide();
        $("#subTotalFilter").show();
        $("#gridSubTotal").show();
        $("#gridPPAList").hide();
        //bindGridFilterSubTotal();
    }
}

function exportCSV() {
    startSpinner('loading..', 1);
    var urlExport = "";
    var query = "";

    if (status === "ppaList") {
        var filteryear = $("#txtBudgetYear").val();
        if (filteryear === "" || filteryear === null || filteryear === undefined) {
            filteryear = "";
        }
        if (filteroperation === "" || filteroperation === null || filteroperation === undefined) {
            filteroperation = "";
        }
        if (filterReason === "" || filterReason === null || filterReason === undefined) {
            filterReason = "";
        }
        if (filterPromoType === "" || filterPromoType === null || filterPromoType === undefined) {
            filterPromoType = "";
        }

        query = 'filteryear=' + filteryear +
        '&filteroperation=' + filteroperation +
        '&filterReason=' + filterReason +
        '&filterPromoType=' + filterPromoType;

        urlExport = MAA_API_Server + 'PPAReport/GetPPAListCSV';
    }
    else {
        var isRequestor = $('#chkRequestor').is(":checked");
        var isOperation = $('#chkOperation').is(":checked");
        var isReason = $('#chkReason').is(":checked");
        var isPromotion = $('#chkPromotion').is(":checked");
        var txtSubTotalYear = $("#txtYearSubTotal").val();

        if (txtSubTotalYear === "" || txtSubTotalYear === null || txtSubTotalYear === undefined) {
            txtSubTotalYear = "";
        }

        query = 'filteryear=' + txtSubTotalYear +
            '&filterRequestor=' + isRequestor +
            '&filteroperation=' + isOperation +
            '&filterReason=' + isReason +
            '&filterPromoType=' + isPromotion;

        urlExport = MAA_API_Server + 'PPAReport/GetPPASubtotalCSV';
    };

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
            a.download = 'PPAReport.csv';
            a.click();
            window.URL.revokeObjectURL(url);
            startSpinner('loading..', 0);
        },
        error: function (data) {
            alert('Something Went Wrong');
            startSpinner('loading..', 0);
        }
    });
};

var FilterSubTotal = [
    {
        Name: "Operation"
    }, {
        Name: "Advertising Type"
    }, {
        Name: "Activity"
    }, {
        Name: "Period"
    }
];
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

    if (el === "PPA List") {
        showDocument('');
        document.getElementById("textGrid").innerText = "Sub Total";
        document.getElementById("btnSubTotal").innerText = "PPA List";
    }
    else {
        showDocument('ppaList');
        document.getElementById("textGrid").innerText = "PPA List";
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