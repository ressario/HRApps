var numLoad = 1;
var loadInterval = setInterval(checkCallback, 2000);
var formTypeValue = "";
var docStatusValue = "";
var appStatusValue = "";
var dateFrom = "";
var dateTo = "";
var statusLoad = "";
var txtSearch = "";
$(document).ready(function () {
    startSpinner('loading..', 1);
    $("#dmeType").hide();
    $("#samplingType").hide();
    $("#promoType").hide();
    $("#pricingType").hide();
    
    displayChildMenu();
    initPage();
    showDocument('pending');
   
    loadPendingDefault(dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
    //loadDocument();

    $('#txtSearch').keyup(function (e) {

        txtSearch = "";
        txtSearch = $('#txtSearch').val();

        if (e.keyCode === 13) {                       
            if (statusLoad === "pending") {
                loadPendingDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }
            if (statusLoad === "document") {
                loadDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }
        }
    });

    $("#leftFilter_DtpRequestDate_FROM").kendoDatePicker({     
        format: "yyyy-MM-dd",
        change: function (e) {
            if (this.value() !== null || this.value() !== undefined) {              
                dateFrom = $("#leftFilter_DtpRequestDate_FROM").val();
            }
        }
    });

    $("#leftFilter_DtpRequestDate_TO").kendoDatePicker({
        format: "yyyy-MM-dd",
        change: function (e) {
            if (this.value() !== null || this.value() !== undefined) {              
                dateTo = $("#leftFilter_DtpRequestDate_TO").val();
                if (statusLoad === "pending") {
                    loadPendingDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
                }
                if (statusLoad === "document") {
                    loadDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
                }
                
            }
        }
    });
    

    var gridFormType = $("#gridFilterFormType").kendoGrid({
        dataSource: {
            data: FilterFormType,
            pageSize: 9
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
        columns: [{ template: "<input type='checkbox' class='checkbox' />" },
            {
            field: "Name",
            title: "Name"
        }, {
            field: "Count",
                title: "Count",
                attributes: { class: "text-right" }
        }]
    }).data("kendoGrid");
    gridFormType.table.on("click", ".checkbox", selectRowFormType);
    var checkedIdFormType = {};
    function selectRowFormType() {
        var checked = this.checked,
            row = $(this).closest("tr"),
            grid = $("#gridFilterFormType").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        if (dataItem.Name === "DME Submission") {
            formTypeValue = "Submission";
        }
        if (dataItem.Name === "DME Top Up") {
            formTypeValue = "Top Up";
        }
        if (dataItem.Name === "DME Reverse") {
            formTypeValue = "Reversal";
        }
        if (dataItem.Name === "Sampling Direct") {
            formTypeValue = "Sampling Direct";
        }
        if (dataItem.Name === "Sampling Indirect") {
            formTypeValue = "Sampling Indirect";
        }
        if (dataItem.Name === "Promo On Invoice Period") {
            formTypeValue = "Discount Period";
        }
        if (dataItem.Name === "Promo On Invoice Request") {
            formTypeValue = "Discount";
        }
        if (dataItem.Name === "Pricing GWP") {
            formTypeValue = "Pricing GWP";
        }
        if (dataItem.Name === "Pricing Held Base") {
            formTypeValue = "Pricing HPB";
        }
        
        checkedIdFormType[dataItem.id] = checked;

        if (checked) {        
            row.addClass("k-state-selected");
            if (statusLoad === "pending") {
                loadPendingDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }
            if (statusLoad === "document") {
                loadDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }
        } else {        
            row.removeClass("k-state-selected");            
            formTypeValue = "";
            if (statusLoad === "pending") {
                loadPendingDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }
            if (statusLoad === "document") {
                loadDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }
        }               
    }
 
    var gridDocStatus= $("#gridFilterDocStatus").kendoGrid({
        dataSource: {
            data: FilterDocStatus,
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
        columns: [{ template: "<input type='checkbox' class='checkbox' />" },
        {
            field: "Name",
            title: "Name"
        }, {
            field: "Count",
            title: "Count",
            attributes: { class: "text-right" }
        }]
    }).data("kendoGrid");
    gridDocStatus.table.on("click", ".checkbox", selectRowDocStatus);
    var checkedIdDocStatus = {};
    function selectRowDocStatus() {
        var checked = this.checked,
            row = $(this).closest("tr"),
            grid = $("#gridFilterDocStatus").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        docStatusValue = dataItem.Name;   
        checkedIdDocStatus[dataItem.id] = checked;

        if (checked) {        
            row.addClass("k-state-selected");
            if (statusLoad === "pending") {
                loadPendingDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }
            if (statusLoad === "document") {
                loadDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }
        } else {        
            row.removeClass("k-state-selected");
            docStatusValue = "";
            if (statusLoad === "pending") {
                loadPendingDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }
            if (statusLoad === "document") {
                loadDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }
        }
                     
    }

   
    var gridAppStatus = $("#gridFilterApprovalStatus").kendoGrid({
        dataSource: {
            data: FilterApprovalStatus,
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
        columns: [{ template: "<input type='checkbox' class='checkbox' />" },
        {
            field: "Name",
            title: "Name"
        }, {
            field: "Count",
            title: "Count",
            attributes: { class: "text-right" }
        }]
    }).data("kendoGrid");
    gridAppStatus.table.on("click", ".checkbox", selectRow);
    var checkedIds = {};
    function selectRow() {
        var checked = this.checked,
            row = $(this).closest("tr"),
            grid = $("#gridFilterApprovalStatus").data("kendoGrid"),
            dataItem = grid.dataItem(row);

        appStatusValue = dataItem.Name;       
        checkedIds[dataItem.id] = checked;

        if (checked) {            
            if (statusLoad === "pending") {
                loadPendingDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }
            if (statusLoad === "document") {
                loadDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }
            row.addClass("k-state-selected");
        } else {            
            row.removeClass("k-state-selected");
            appStatusValue = "";
            if (statusLoad === "pending") {
                loadPendingDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }
            if (statusLoad === "document") {
                loadDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
            }

        }
      
    }
    
    resizeDivLeftFilter();
    $(window).resize(function (e) {
        resizeDivLeftFilter();
    });

    var windowWidth = $(window).width();
    if (windowWidth >= 992) {
        $("#div-filters").addClass("in");
    }

});

$(document).on('click', '[src*=search]', function () {
    
    txtSearch = "";
    txtSearch = $('#txtSearch').val();    
    if (statusLoad === "pending") {
        loadPendingDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
    }
    if (statusLoad === "document") {
        loadDocument(txtSearch, dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
    }
});


function checkCallback() {
    if (numLoad <= 0) {
        window.clearInterval(loadInterval);
        startSpinner('loading..', 0);
    }
}


function countForm(result) {
   
    var submissionCount = 0;
    var reversalCount = 0;
    var topUpCount = 0;
    var sampDirectCount = 0;
    var sampIndirectCount = 0;
    var hpbCount = 0;
    var gwpCount = 0;
    var discountCount = 0;
    var discountPeriodCount = 0;

    for (var c = 0; c < result.length; c++) {
        if (result[c].Form === "Submission") {
            submissionCount += 1;
        }
        if (result[c].Form === "Top Up") {
            topUpCount += 1;            
        }
        if (result[c].Form === "Reversal") {
            reversalCount += 1;
        }
        if (result[c].Form === "Sampling Direct") {
            sampDirectCount += 1;
        }
        if (result[c].Form === "Sampling Indirect") {
            sampIndirectCount += 1;
        }
        if (result[c].Form === "Pricing HPB") {
            hpbCount += 1;
        }
        if (result[c].Form === "Pricing GWP") {
            gwpCount += 1;
        }
        if (result[c].Form === "Discount") {
            discountCount += 1;
        }
        if (result[c].Form === "Discount Period") {
            discountPeriodCount += 1;
        }
        
    }
    
    //Assign the value from counter        
    var submissionItem = $('#gridFilterFormType').data().kendoGrid.dataSource.data()[0];         
    submissionItem["Count"] = submissionCount;   
    var topUpItem = $('#gridFilterFormType').data().kendoGrid.dataSource.data()[1];
    topUpItem["Count"] = topUpCount;
    var reversalItem = $('#gridFilterFormType').data().kendoGrid.dataSource.data()[2];
    reversalItem["Count"] = reversalCount;           
    var directItem = $('#gridFilterFormType').data().kendoGrid.dataSource.data()[3];
    directItem["Count"] = sampDirectCount;   
    var indirectItem = $('#gridFilterFormType').data().kendoGrid.dataSource.data()[4];
    indirectItem["Count"] = sampIndirectCount;             
    var periodItem = $('#gridFilterFormType').data().kendoGrid.dataSource.data()[5];
    periodItem["Count"] = discountPeriodCount;   
    var discountItem = $('#gridFilterFormType').data().kendoGrid.dataSource.data()[6];
    discountItem["Count"] = discountCount;   
    var gwpItem = $('#gridFilterFormType').data().kendoGrid.dataSource.data()[7];
    gwpItem["Count"] = gwpCount;  
    var hpbItem = $('#gridFilterFormType').data().kendoGrid.dataSource.data()[8];
    hpbItem["Count"] = hpbCount;   
    $('#gridFilterFormType').data('kendoGrid').refresh();
       
}

function countDocStatus(result) {

    var realInprogressCount = 0;
    var revInProgressCount = 0;
    var revDoneCount = 0;
    var promoDoneCount = 0;
    var priceDoneCount = 0;

    for (var d = 0; d < result.length; d++) {
        if (result[d].StatusDesc === "Completed - Realization in Progress") {
            realInprogressCount += 1;
        }
        if (result[d].StatusDesc === "Completed - Reversal in Progress") {
            revInProgressCount += 1;
        }
        if (result[d].StatusDesc === "Completed - Reversal Done") {
            revDoneCount += 1;
        }
        if (result[d].StatusDesc === "Completed - Promo Done") {
            promoDoneCount += 1;
        }
        if (result[d].StatusDesc === "Completed - Pricing Done") {
            priceDoneCount += 1;
        }
    }

    var realItem = $('#gridFilterDocStatus').data().kendoGrid.dataSource.data()[0];
    realItem["Count"] = realInprogressCount;
    var revItem = $('#gridFilterDocStatus').data().kendoGrid.dataSource.data()[1];
    revItem["Count"] = revInProgressCount;
    var revDoneItem = $('#gridFilterDocStatus').data().kendoGrid.dataSource.data()[2];
    revDoneItem["Count"] = revDoneCount;
    var promoDoneItem = $('#gridFilterDocStatus').data().kendoGrid.dataSource.data()[3];
    promoDoneItem["Count"] = promoDoneCount;
    var priceDoneItem = $('#gridFilterDocStatus').data().kendoGrid.dataSource.data()[4];
    priceDoneItem["Count"] = priceDoneCount;   

    $('#gridFilterDocStatus').data('kendoGrid').refresh();
}

function countApprovalStatus(result) {

    var draftCount = 0;
    var inProcessCount = 0;
    var rejectCount = 0;
    var sendBackCount = 0;
    var completedCount = 0;

    for (var e = 0; e < result.length; e++) {
        if (result[e].ApprovalStatusDesc === "Draft") {
            draftCount += 1;
        }
        if (result[e].ApprovalStatusDesc === "In Process") {
            inProcessCount += 1;
        }
        if (result[e].ApprovalStatusDesc === "Rejected") {
            rejectCount += 1;
        }
        if (result[e].ApprovalStatusDesc === "Send Back") {
            sendBackCount += 1;
        }
        if (result[e].ApprovalStatusDesc === "Completed") {
            completedCount += 1;
        }
    }

    var draftItem = $('#gridFilterApprovalStatus').data().kendoGrid.dataSource.data()[0];
    draftItem["Count"] = draftCount;
    var inProcessItem = $('#gridFilterApprovalStatus').data().kendoGrid.dataSource.data()[1];
    inProcessItem["Count"] = inProcessCount;
    var rejectItem = $('#gridFilterApprovalStatus').data().kendoGrid.dataSource.data()[2];
    rejectItem["Count"] = rejectCount;
    var sendBackItem = $('#gridFilterApprovalStatus').data().kendoGrid.dataSource.data()[3];
    sendBackItem["Count"] = sendBackCount;
    var completedItem = $('#gridFilterApprovalStatus').data().kendoGrid.dataSource.data()[4];
    completedItem["Count"] = completedCount;

    $('#gridFilterApprovalStatus').data('kendoGrid').refresh();
   
}

function loadPendingDefault(fromDate, toDate, formValue, docValue, appValue) {
    var requestorEmail = $('#CreatedBy').val();
    $.ajax({
        type: "GET",
        data: { filterDateFrom: fromDate, filterDateTo: toDate, filterForm: formValue, filterDoc: docValue, filterApp: appValue, filterUser: requestorEmail },
        url: MAA_API_Server + 'Home/GetPendingDocumentWithParam',
        success: function (result) {
            var dataResult = JSON.parse(result);
            dataResult = JSON.parse(dataResult.Message);
            
            countForm(dataResult);
            countDocStatus(dataResult);
            countApprovalStatus(dataResult);

            pendingDocDefault = dataResult;
            bindGridPendingDocument();
            numLoad -= 1;
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
        }
    });
}

function loadPendingDocument(keyword, fromDate, toDate, formValue, docValue, appValue) {
    startSpinner('loading..', 1);
    var requestorEmail = $('#CreatedBy').val();
    $.ajax({
        type: "GET",
        data: { keyword: keyword, filterDateFrom: fromDate, filterDateTo: toDate, filterForm: formValue, filterDoc: docValue, filterApp: appValue, filterUser: requestorEmail},
        url: MAA_API_Server + 'Home/GetPendingDocumentWithParam',       
        success: function (result) {         
            var dataResult = JSON.parse(result);
            dataResult = JSON.parse(dataResult.Message);
                    
            pendingDocDefault = dataResult;                 
            bindGridPendingDocument();  

            numLoad -= 1;     
            startSpinner('loading..', 0);
        },
        error: function (data) {
            alert('Something Went Wrong');     
            numLoad -= 1;    
        }
    });
}

function loadDocumentDefault(fromDate, toDate, formValue, docValue, appValue) {
    startSpinner('loading..', 1);
    var requestorEmail = $('#CreatedBy').val();
    $.ajax({
        type: "GET",
        data: { filterDateFrom: fromDate, filterDateTo: toDate, filterForm: formValue, filterDoc: docValue, filterApp: appValue, filterUser: requestorEmail },
        url: MAA_API_Server + 'Home/GetDocumentWithParam',
        success: function (result) {
            var dataResult = JSON.parse(result);
            dataResult = JSON.parse(dataResult.Message);           
            countForm(dataResult);
            countDocStatus(dataResult);
            countApprovalStatus(dataResult);

            docList = dataResult;
            bindGridDocument();

            numLoad -= 1;
            startSpinner('loading..', 0);
        },
        error: function (data) {
            alert('Something Went Wrong');
            //numLoad -= 1;           

        }
    });
}

function loadDocument(keyword, fromDate, toDate, formValue, docValue, appValue) {
    startSpinner('loading..', 1);
    var requestorEmail = $('#CreatedBy').val();
    $.ajax({
        type: "GET",
        data: { keyword: keyword, filterDateFrom: fromDate, filterDateTo: toDate, filterForm: formValue, filterDoc: docValue, filterApp: appValue, filterUser: requestorEmail },
        url: MAA_API_Server + 'Home/GetDocumentWithParam',
        success: function (result) {
            var dataResult = JSON.parse(result);
            dataResult = JSON.parse(dataResult.Message);
                    
            docList = dataResult;
            bindGridDocument();

            numLoad -= 1;
            startSpinner('loading..', 0);
        },
        error: function (data) {
            alert('Something Went Wrong');
            //numLoad -= 1;           

        }
    });
}

function bindGridPendingDocument() {    
    $("#grid").kendoGrid({
        dataSource: {
            data: pendingDocDefault,
            schema: {
                model: {
                    fields: {                       
                        Form: { type: "string" },
                        RequestNumber: { type: "string" },                   
                        CreatedDate: { type: "date" },                                  
                        Requestor: { type: "string" },                                          
                        MarketingProgramDesc: { type: "string" },                     
                        ActivityDesc: { type: "string"},                     
                        AdvertisingTypeDesc: { type: "string"},
                        OperationDesc: { type: "string" },                    
                        ChannelDesc: { type: "string" },
                        ReasonCodeDesc: { type: "string" }
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
  "else if(Form == 'Reversal') { #<a href='" + url_Web + "DMEReverse?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                    "else if (Form == 'Sampling Direct') { #<a href='" + url_Web + "SamplingDirect?id=#=RequestNumber#' >#:RequestNumber#</a># } " +
                    "else if (Form == 'Sampling Indirect') { #<a href='" + url_Web + "SamplingIndirect?id=#=RequestNumber#' >#:RequestNumber#</a># } " +
                    "else if(Form == 'Pricing HPB') { #<a href='" + url_Web + "PricingHeldBase?id=#=RequestNumber#' >#:RequestNumber#</a># } " +
                    "else if(Form == 'Pricing GWP') { #<a href='" + url_Web + "PricingGWP?id=#=RequestNumber#' >#:RequestNumber#</a># } " +
  "else if(Form == 'Discount') { #<a href='" + url_Web + "PromoOnInvoiceRequest?id=#=RequestNumber#' >#:RequestNumber#</a># } " + 
  "else if(Form == 'Discount Period') { #<a href='" + url_Web + "PromoOnInvoicePeriod?id=#=RequestNumber#' >#:RequestNumber#</a># } #",

            title: "Request Number"                
            }, {
                field: "CreatedDate",
                title: "Created Date",
                type: "date",
                format: "{0:dd/MM/yyyy}" 
          
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
            
            }, {
                field: "ReasonCodeDesc",
                title:"Reason Code"
           
            }, {
                field: "",
                title: "Promotion Type"
           
            }, {
                field: "ChannelDesc",
                title: "Channel"
          
            }, {
                field: "",
                title: "Pending By"
         
            }, {
                field: "",
                title: "Aging (Days)"
          
        }, {
            field: "AmountRequest",
            format: "{0:#,0}",
            attributes: { class: "text-right" },
            title: "Total Amount"
        }]
    });
}

function bindGridDocument() {
    $("#gridDoc").kendoGrid({
        dataSource: {
            data: docList,
            schema: {
                model: {
                    fields: {
                        Form: { type: "string" },
                        RequestNumber: { type: "string" },
                        CreatedDate: { type: "date" },
                        Requestor: { type: "string" },
                        MarketingProgramDesc: { type: "string" },
                        ActivityDesc: { type: "string" },
                        AdvertisingTypeDesc: { type: "string" },
                        OperationDesc: { type: "string" },
                        ChannelDesc: { type: "string" },
                        ReasonCodeDesc: { type: "string" }
                        //requestType: { type: "string" },
                        //dmeNumber: { type: "string" },
                        //dmeReverseNumber: { type: "string" },
                        //createdDate: { type: "date" },
                        //activityPeriodFrom: { type: "date" },
                        //documentStatus: { type: "string" },
                        ////approvalStatus:{}
                        //requestorName: { type: "string" },
                        //operation: { type: "string" },
                        //advertysingtype: { type: "string" },
                        //activity: { type: "string" },
                        //marketingProgramDescription: { type: "string" },
                        //joinActivity: { type: "string" },
                        //market: { type: "string" },
                        //amountRequest: { type: "number" },
                        //activityName: { type: "string" },
                        //marketName: { type: "string" },
                        //joinActivityName: { type: "string" },
                        //advertysingName: { type: "string" },
                        //operationName: { type: "string" },
                        //programName: { type: "string" }
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
                "else if(Form == 'Reversal') { #<a href='" + url_Web + "DMEReverse?id=#=RequestNumber#'>#:RequestNumber#</a># } " +
                "else if (Form == 'Sampling Direct') { #<a href='" + url_Web + "SamplingDirect?id=#=RequestNumber#' >#:RequestNumber#</a># } " +
                "else if (Form == 'Sampling Indirect') { #<a href='" + url_Web + "SamplingIndirect?id=#=RequestNumber#' >#:RequestNumber#</a># } " +
                "else if(Form == 'Pricing HPB') { #<a href='" + url_Web + "PricingHeldBase?id=#=RequestNumber#' >#:RequestNumber#</a># } " +
                "else if(Form == 'Pricing GWP') { #<a href='" + url_Web + "PricingGWP?id=#=RequestNumber#' >#:RequestNumber#</a># } " +
                "else if(Form == 'Discount') { #<a href='" + url_Web + "PromoOnInvoiceRequest?id=#=RequestNumber#' >#:RequestNumber#</a># } " +
                "else if(Form == 'Discount Period') { #<a href='" + url_Web + "PromoOnInvoicePeriod?id=#=RequestNumber#' >#:RequestNumber#</a># } #",

            title: "Request Number"
        }, {
            field: "CreatedDate",
            title: "Created Date",
            type: "date",
            format: "{0:dd/MM/yyyy}"

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

        }, {
            field: "ReasonCodeDesc",
            title: "Reason Code"

        }, {
            field: "",
            title: "Promotion Type"

        }, {
            field: "ChannelDesc",
            title: "Channel"

        }, {
            field: "",
            title: "Pending By"

        }, {
            field: "",
            title: "Aging (Days)"

        }, {
            field: "AmountRequest",
            format: "{0:#,0}",
            attributes: { class: "text-right" },
            title: "Total Amount"
        }]
    });
}

// #region resize heightFilter
function resizeDivLeftFilter() {
    var divLeftFilter = $("#div-leftfilter");

    var windowWidth = $(window).width();
    if (windowWidth >= 992) {
        var windowHeight = $(window).height();
        var divRightContentHeight = $("#div-right-content").height();
        var divLeftContentHeight = windowHeight - 30;
        if (divRightContentHeight > windowHeight) {
            divLeftContentHeight = divRightContentHeight;
        }

        var divLeftFilterHeight = divLeftContentHeight - divLeftFilter.position().top;
        divLeftFilter.height(divLeftFilterHeight);
        $(".home-leftfilter").height(divLeftFilterHeight);
    } else {
        divLeftFilter.height("100%");
        $(".home-leftfilter").height("100%");
    }
}
// #end region
function leftFilter_BtnClearDtpRequestDate_FROM_Clicked() {
    $("#leftFilter_DtpRequestDate_FROM").data("kendoDatePicker").value(null);
}
function leftFilter_BtnClearDtpRequestDate_TO_Clicked() {
    $("#leftFilter_DtpRequestDate_TO").data("kendoDatePicker").value(null);
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

function btnShowPopUpCreateNewRequest_Clicked() {
  
    var divPopUpCreate = $("#window");
    resetRbRequest();
    enableDisableButtonCreateRequest();
    divPopUpCreate.data("kendoWindow").center().open();
}

function initPopUpCreate() {
    var divPopUpCreate = $("#window");

    divPopUpCreate.kendoWindow({
        width: "80%",
        title: "Create new Request",
        visible: false,
        actions: [
            "Close"
        ],
        modal: true
    });
}

function initPage() {
    initPopUpCreate();
}

function goToDocument() {

    var el = document.getElementById('textGrid').innerText;
    
    if (el === "My Pending Document") {
        statusLoad = "document";
        showDocument('');
        document.getElementById("textGrid").innerText = "My Document";
        document.getElementById("btnText").innerText = "Go to Pending Document";
        loadDocumentDefault(dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
    }
    else {
        statusLoad = "pending";
        showDocument('pending');
        document.getElementById("textGrid").innerText = "My Pending Document";
        document.getElementById("btnText").innerText = "Go to My Document";
        loadPendingDefault(dateFrom, dateTo, formTypeValue, docStatusValue, appStatusValue);
    }                  
  
}


function btnCreateNewRequest_Clicked() {
    
   
    var targetUrl = $("input[name='rdCust']:checked").val();
    if (targetUrl === 'dme') {   
        var targetUrlBranchDME = $("input[name='rdDME']:checked").val();
        window.location.href = url_Web + targetUrlBranchDME;
    }
    if (targetUrl === 'sampling') {
        var targetUrlBranchSampling = $("input[name='rdSamp']:checked").val();
        window.location.href = url_Web + targetUrlBranchSampling;
    }

    if (targetUrl === 'promo') {
        var targetUrlBranchPromo = $("input[name='rdPromo']:checked").val();
        window.location.href = url_Web + targetUrlBranchPromo;
    }

    if (targetUrl === 'pricing') {
        var targetUrlBranchPricing = $("input[name='rdPrice']:checked").val();
        window.location.href = url_Web + targetUrlBranchPricing;
    }


}

function showDME() {
    resetRbForm();
    enableDisableButtonCreateRequest();
        document.getElementById("dmeType").style.display = 'block';
    document.getElementById("samplingType").style.display = 'none';
    document.getElementById("promoType").style.display = 'none';
    document.getElementById("pricingType").style.display = 'none';

}

function showSampling() {
    resetRbForm();
    enableDisableButtonCreateRequest();
        document.getElementById("dmeType").style.display = 'none';
    document.getElementById("samplingType").style.display = 'block';
    document.getElementById("promoType").style.display = 'none';
    document.getElementById("pricingType").style.display = 'none';
}

function showPromo() {
    resetRbForm();
    enableDisableButtonCreateRequest();
        document.getElementById("dmeType").style.display = 'none';
    document.getElementById("samplingType").style.display = 'none';
    document.getElementById("promoType").style.display = 'block';
    document.getElementById("pricingType").style.display = 'none';
}

function showPricing() {
    resetRbForm();
    enableDisableButtonCreateRequest();
        document.getElementById("dmeType").style.display = 'none';
    document.getElementById("samplingType").style.display = 'none';
    document.getElementById("promoType").style.display = 'none';
    document.getElementById("pricingType").style.display = 'block';
}
function resetRbRequest() {
    $('input[name="rdCust"]').prop('checked', false);
    resetRbForm();

}

function resetRbForm() {
    document.getElementById("dmeType").style.display = 'none';
    document.getElementById("samplingType").style.display = 'none';
    document.getElementById("promoType").style.display = 'none';
    document.getElementById("pricingType").style.display = 'none';

    $('input[name="rdDME"]').prop('checked', false);
    $('input[name="rdSamp"]').prop('checked', false);
    $('input[name="rdPromo"]').prop('checked', false);
    $('input[name="rdPrice"]').prop('checked', false);

}

function enableDisableButtonCreateRequest() {
    if ($('input[name="rdDME"]').is(':checked') || $('input[name="rdSamp"]').is(':checked') || $('input[name="rdPromo"]').is(':checked') || $('input[name="rdPrice"]').is(':checked')) {
        $('button[name="btnCreateNewRequest"]').removeAttr("disabled");
    }
    else {
        $('button[name="btnCreateNewRequest"]').attr("disabled", "disabled");
    }
}

function showDocument(status) {
    if (status === "pending") {
        //alert('a');
        statusLoad = "pending";
        $("#gridDoc").hide();
        $("#grid").show();
    }
    else {
        //alert('b');
        statusLoad = "document";
        $("#grid").hide();
        $("#gridDoc").show();
    }
}

function toggleFormTypeOnClick() {
    if ($("#gridFilterFormType").hasClass("collapse")) {
        $('#gridFilterFormType').removeClass('collapse');

    } else {
        $('#gridFilterFormType').addClass('collapse');

    }
}

function toggleDocStatusOnClick() {
    if ($("#gridFilterDocStatus").hasClass("collapse")) {
        $('#gridFilterDocStatus').removeClass('collapse');

    } else {
        $('#gridFilterDocStatus').addClass('collapse');

    }
}

function toggleApprovalStatusOnClick() {
    if ($("#gridFilterApprovalStatus").hasClass("collapse")) {
        $('#gridFilterApprovalStatus').removeClass('collapse');

    } else {
        $('#gridFilterApprovalStatus').addClass('collapse');

    }
}