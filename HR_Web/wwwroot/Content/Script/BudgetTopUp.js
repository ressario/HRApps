var dmeNumber = [];
var topUpAmt = 0;
var reqAmt = 0;
var totAmt = 0;
var _gridReq;
var _gridChannel;
var _gridBrand;
var activityParam;
var advertisingtypeParam;
var budgetyearParam;
var dmeNumberVal;
var brandList = [];
var marketList = [];
var channelList = [];
var revNum = "";
var columnGridOperation = [
    { field: "operationDesc", title: "Operation", width: "130px", editor: operationDropDownEditor, template: "#=operationDesc#", aggregates: ["count"], footerTemplate: "<div align=center>Total</div>" },
    { field: "originalBudget", title: "Original Budget", format: "{0:#,0}", attributes: { class: "text-right " }, width: "130px", aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { field: "adjustment", title: "Adjustment", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { field: "adjBudgetBalance", title: "Adj. Budget Balance", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { field: "ytdDme", title: "YTD DME", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { field: "totalRequest", title: "Total Request", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(calcRequest(sum), \"n0\") #</div>" },
    { field: "samplingAmount", title: "Sampling Amount", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(calcSampling(sum), \"n0\") #</div>" },
    { command: ["edit"], title: "&nbsp;", width: "120px" }

];

var columnGridBrand = [
    { field: "brand", title: "Brand", width: "130px", aggregates: ["count"], editor: brandDropDownEditor, template: "#=brand#", footerTemplate: "<div align=center>Total</div>" },
    { field: "request", title: "Request", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { command: ["edit"], title: "&nbsp;", width: "120px" }
];

var columnGridMarket = [
    { field: "market", title: "Market Name", width: "130px", editor: marketDropDownEditor, template: "#=market#" },
    { field: "channel", title: "Channel", width: "130px", editor: channelDropDownEditor, template: "#=channel#", aggregates: ["count"], footerTemplate: "<div align=center>Total</div>" },
    { field: "request", title: "Request", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { command: ["edit"], title: "&nbsp;", width: "120px" }
];

var pageSettingGridOperation = {
    info: false,
    refresh: false,
    pageSizes: false,
    previousNext: false,
    numeric: false
};

var pageSettingGridBrand = {
    info: false,
    refresh: false,
    pageSizes: false,
    previousNext: false,
    numeric: false
};

var pageSettingGridMarket = {
    info: false,
    refresh: false,
    pageSizes: false,
    previousNext: false,
    numeric: false
};

$(document).ready(function () {
    initTabStrip();
    initialSetting();
});

function initialSetting() {
    $('#txtTopUpAmount').removeAttr('disabled');
    bindDMENumber();
    getbrand();
    getmarket();
    getchannel();
    document.getElementById("dtActivityperiodFrom").disabled = true;
    document.getElementById("dtActivityperiodTo").disabled = true;
    document.getElementById("dtInvoiceSettlementDate").disabled = true;
    $('#divFromActivityPeriodTo, #divFromActivityPeriod, #divdtInvoiceSettlementDate').datepicker('remove');
    if (!dmeNumberModel) {
        $('#divbtnDraft').show();
        $('#divbtnSubmit').show();
        document.getElementById('txtCreatedDate').value = generateCreateDate();
       // document.getElementById('txtRequestor').value = "Arya Eka Wirawan";

        document.getElementById('txtTopUpReqNumber').value = 'TOP/NO-' + generateAutoNumber($('#txtRequestor').val());
        $('#lbldocstatus').html("");
        $('#lblApprovalStatus').html("");
        
    }
    else {
        bindGridAttachment(attachments);
        $('#txtTopUpAmount').val(addCommas(TopUpAmountModel));
        topUpAmt = TopUpAmountModel;
        amountCalc();
       
       // LoadDMEReq();
        if (ApprovalStatusModel !== "0") {
            $('#divAttachment').hide();
            $('#divbtnSubmit').hide();
            $('#divbtnDraft').hide();
            $('#txtDMEReqNumber').attr('disabled', 'disabled');
            $('#txtTopUpAmount').attr('disabled', 'disabled');

            columnGridOperation = [
                { field: "operationDesc", title: "Operation", width: "130px", editor: operationDropDownEditor, template: "#=operationDesc#", aggregates: ["count"], footerTemplate: "<div align=center>Total</div>" },
                { field: "originalBudget", title: "Original Budget", format: "{0:#,0}", attributes: { class: "text-right " }, width: "130px", aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
                { field: "adjustment", title: "Adjustment", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
                { field: "adjBudgetBalance", title: "Adj. Budget Balance", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
                { field: "ytdDme", title: "YTD DME", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
                { field: "totalRequest", title: "Total Request", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
                { field: "samplingAmount", title: "Sampling Amount", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" }

            ];

            columnGridBrand = [
                { field: "brand", title: "Brand", width: "130px", aggregates: ["count"], editor: brandDropDownEditor, template: "#=brand#", footerTemplate: "<div align=center>Total</div>" },
                { field: "request", title: "Request", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" }
            ];

            columnGridMarket = [
                { field: "market", title: "Market Name", width: "130px", editor: marketDropDownEditor, template: "#=market#" },
                { field: "channel", title: "Channel", width: "130px", editor: channelDropDownEditor, template: "#=channel#", aggregates: ["count"], footerTemplate: "<div align=center>Total</div>" },
                { field: "request", title: "Request", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" }
            ];
            pageSettingGridOperation = {
                info: true,
                refresh: true,
                pageSizes: true,
                previousNext: true,
                numeric: true
            };

            pageSettingGridBrand = {
                info: true,
                refresh: true,
                pageSizes: true,
                previousNext: true,
                numeric: true
            };

            pageSettingGridMarket = {
                info: true,
                refresh: true,
                pageSizes: true,
                previousNext: true,
                numeric: true
            };
        }
        else if (ApprovalStatusModel === "0") {
            $('#divbtnDraft').show();
            $('#divbtnSubmit').show();
            $('#txtTopUpAmount').removeAttr('disabled');
            $('#lbldocstatus').html('- ' + DocumentStatusModel);
            $('#lblApprovalStatus').html("Draft");
        }
        if (ApprovalStatusModel === "4") {
            $('#divapprove').show();
            $('#divreject').show();
            $('#divsendback').show();
           // $('#divcompleted').show();
            $('#lbldocstatus').html('- ' + DocumentStatusModel);
            $('#lblApprovalStatus').html("In Process");
        }
        if (ApprovalStatusModel === "1") {
            $('#lblApprovalStatus').html("Completed");
            $('#lbldocstatus').html('- ' + DocumentStatusModel);
            if (DocumentStatusModel === "Budget in Progress") {
                $('#divcompleted').show();
            }
            if (DocumentStatusModel === "Realization In Progress" || DocumentStatusModel === "Top Up Done & Realization In Progress" || DocumentStatusModel === "Top Up Done &amp; Realization In Progress" || DocumentStatusModel === "Reversal In Progrees" || DocumentStatusModel === "Reversal Done") {
                $('#divbtnReverse').show();
            }
           
        }
        if (ApprovalStatusModel === "2") {
            $('#lblApprovalStatus').html("Rejected");
        }
        //if ($('#txtDMEReqNumber').val()) {
           
        //}
        
    }

 
}

function bindDMENumber() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DME/GetActiveDMERequestTopUp',
        success: function (msg) {

           
           // autocomplete(document.getElementById("txtDMEReqNumber"), dmeNumber, 'budgettopup');
           
            if (DMEReverseNumberModel && !dmeNumberModel) {
                var dmenumval = getUrlVars()["dmenum"];
                if (dmenumval) {
                    $('#txtDMEReqNumber').attr('disabled', 'disabled');
                }
                for (var i = 0; i < msg.length; i++) {
                    $("#txtDMEReqNumber").append('<option value="' + msg[i].dmeRequestNumber + '">' + msg[i].dmeRequestNumber + '</option>');
                }
                $("#txtDMEReqNumber option[value='" + DMEReverseNumberModel + "']").attr("selected", "selected");
                LoadDMEReqDatatopUp();
               
            }
            else if (!dmeNumberModel) {
                for (var x = 0; x < msg.length; x++) {
                    $("#txtDMEReqNumber").append('<option value="' + msg[x].dmeRequestNumber + '">' + msg[x].dmeRequestNumber + '</option>');
                }
            }
            else if (dmeNumberModel) {
                $("#txtDMEReqNumber").append('<option value="' + DMEReverseNumberModel + '">' + DMEReverseNumberModel + '</option>');
                $("#txtDMEReqNumber option[value='" + DMEReverseNumberModel + "']").attr("selected", "selected");
                LoadDMEReqData();
            }
            $('#txtDMEReqNumber').selectpicker('refresh');
            $('#txtDMEReqNumber').selectpicker('render');
        },
        error: function (data) {
            alert('Something Went Wrong');
        }
    });
}

function ontxtDMEReqNumberChanged() {
    LoadDMEReqDatatopUp();
}

// #region Tab Strip
function initTabStrip() {
    $("#tabStrip").width(100);
    $("#tabStrip").kendoTabStrip({
        animation: {
            open: { effects: "fadeIn" }
        },
        scrollable: false
    });
    $("#tabStrip").width("100%");

    $(".request-viewrequest .tabstrip .k-item").addClass("tabstrip-item");
    $(".request-viewrequest .tabstrip .k-item").removeClass("k-item");

    selectTab(0);
}

function selectTab(tabIndex) {
    $("#tabStrip").data("kendoTabStrip").select(tabIndex);
    tabStrip_OnSelect(tabIndex);
}

function tabStrip_OnSelect(tabIndex) {
    //var tabIndex = e.item.tabIndex;
    //alert(tabIndex);

    $(".tabnavigator > ul > li.active-tab").removeClass("active-tab");
    $("#tabNavigator-li-" + tabIndex).addClass("active-tab");
}
    // #endregion


$('#divFromActivityPeriod').datepicker({
    format: 'dd/mm/yyyy',
    todayBtn: 'linked',
    autoclose: true
});
$('#divFromActivityPeriodTo').datepicker({
    format: 'dd/mm/yyyy',
    todayBtn: 'linked',
    autoclose: true
});
$('#divdtInvoiceSettlementDate').datepicker({
    format: 'dd/mm/yyyy',
    todayBtn: 'linked',
    autoclose: true
});


// #region GridOperation
function getOperationList(dmenum, act) {
    var urlapi = "";
    if (act === "search") {
        urlapi = MAA_API_Server + 'DME/GetDMEDetailOperation';
    }
    else {
        urlapi = MAA_API_Server + 'DMETopRequest/GetTopUpDetailOperation';
    }
    $.ajax({
        type: "GET",
        url: urlapi,
        data: 'dmenum=' + dmenum,
        success: function (msg) {

            products = msg;
            bindGridOperation();
            unCommiteCalc();
            startSpinner('loading..', 0);
            $('#divgridReq').show();
        },
        error: function (data) {
            alert('Something Went Wrong');
            startSpinner('loading..', 0);
        }
    });

}
function bindGridOperation() {
    _gridReq = $("#gridReq").kendoGrid({
        dataSource: {
            data: products,
            schema: {
                model: {
                    fields: {
                        operationItem: { editable: false},
                        operationDesc: { type: "string" },
                        originalBudget: { type: "number" },
                        adjustment: { type: "number" },
                        adjBudgetBalance: { type: "number" },
                        ytdDme: { type: "number" },
                        totalRequest: { type: "number", validation: { required: false, min: 0, defaultValue: 0 } },
                        samplingAmount: {
                            type: "number", defaultValue: "", validation: { required: false, min: 0 }
                        }
                    }
                }
            },
            pageSize: 20,
            aggregate: [
                { field: "originalBudget", aggregate: "sum" },
                { field: "adjustment", aggregate: "sum" },
                { field: "adjBudgetBalance", aggregate: "sum" },
                { field: "ytdDme", aggregate: "sum" },
                { field: "totalRequest", aggregate: "sum" },
                { field: "samplingAmount", aggregate: "sum" }
            ]
        },
        scrollable: true,
        sortable: true,
        filterable: false,
        pageable: pageSettingGridOperation,
        columns: columnGridOperation,
        editable: "inline",
        noRecords: true,
        edit: function (e) {
            var numeric = e.container.find("input[name=originalBudget]").data("kendoNumericTextBox");
            numeric.enable(false);
            var adjustment = e.container.find("input[name=adjustment]").data("kendoNumericTextBox");
            adjustment.enable(false);
            var AdjBudgetBalance = e.container.find("input[name=adjBudgetBalance]").data("kendoNumericTextBox");
            AdjBudgetBalance.enable(false);
            var YTDDME = e.container.find("input[name=ytdDme]").data("kendoNumericTextBox");
            YTDDME.enable(false);
            var dropDown = e.container.find("[data-role='dropdownlist']").data("kendoDropDownList");
            dropDown.readonly();

        },
        cancel: function (e) {
            $('#gridReq').data('kendoGrid').dataSource.cancelChanges();
        },
        dataBinding: function (e) {
            unCommiteCalc();
        }
    }).data("kendoGrid");
}
function unCommiteCalc() {
    if (_gridReq) {
        var requestData = _gridReq.dataSource.data();
        var unCommitted = 0;
        for (var i = 0; i < requestData.length; i++) {
            unCommitted = unCommitted + ((requestData[i].originalBudget * 1) + (requestData[i].adjustment * 1) - (requestData[i].ytdDme * 1) - (requestData[i].totalRequest * 1) - (requestData[i].samplingAmount * 1));
        }
        unCommitted = currencyFormat(unCommitted);
        document.getElementById('unCommitValue').innerHTML = unCommitted;
    }

}
function operationDropDownEditor(container, options) {
    $("<input required  data-bind='value:operationDesc'  />")
        .attr("id", "ddl_opration")
        .appendTo(container)
        .kendoDropDownList({
            dataSource: {
                severFiltering: true,
                transport: {
                    read: {
                        dataType: "json",
                        url: MAA_API_Server + 'budgetprofile/GetBudgetProfileJoinOperation',
                        data: {
                            activity: activityParam,
                            advertisingtype: advertisingtypeParam,
                            budgetyear: budgetyearParam
                        }
                    }
                }
            },
            dataTextField: "operationDesc",
            dataValueField: "operationDesc",
            template: "<span data-id='${data.operation}' data-ytddme='${data.ytdDME}' data-originalbudget='${data.originalBudget}' data-budgetadjustment='${data.adjustment}'>${data.operationDesc}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var originalBudget = e.item.find("span").attr("data-originalbudget");
                var budgetAdjustment = e.item.find("span").attr("data-budgetadjustment");
                var ytdDME = e.item.find("span").attr("data-ytddme");
               
                var operation = _gridReq.dataItem($(e.sender.element).closest("tr"));
                var budgetBalance = (budgetAdjustment * 1) + (originalBudget * 1);
                operation.operationItem = id;
                operation.set("originalBudget", originalBudget);
                operation.set("adjustment", budgetAdjustment);
                operation.set("adjBudgetBalance", budgetBalance);
                operation.set("ytdDme", ytdDME);

            }
        });
}
function calcSampling(val) {
    var totRequestSampling = 0;
    if (_gridReq !== undefined) {
        var requestData = _gridReq.dataSource.data();
        var reqAmt = 0;
        for (var i = 0; i < requestData.length; i++) {
            if (requestData[i].samplingAmount === null) {
                reqAmt = 0;
                requestData[i].samplingAmount = 0;
            }
            else {
                reqAmt = requestData[i].samplingAmount;
            }
            totRequestSampling = totRequestSampling + (reqAmt * 1);
        }
    }
    return totRequestSampling;
}
function calcRequest(val) {
    var totRequest = 0;
    if (_gridReq !== undefined) {
        var requestData = _gridReq.dataSource.data();
        var reqAmt = 0;
        for (var i = 0; i < requestData.length; i++) {
            if (requestData[i].totalRequest === null) {
                reqAmt = 0;
                requestData[i].totalRequest = 0;
            }
            else {
                reqAmt = requestData[i].totalRequest;
            }
            totRequest = totRequest + (reqAmt * 1);
        }
    }
    return totRequest;
}
function replaceNullValue() {
    if (_gridReq !== undefined) {
        var requestData = _gridReq.dataSource.data();
        for (var i = 0; i < requestData.length; i++) {
            if (requestData[i].samplingAmount === null) {
                requestData[i].samplingAmount = 0;
            }
            if (requestData[i].totalRequest === null) {
                requestData[i].totalRequest = 0;
            }
        }
    }
}
// #endregion

// #region GridBrand


function getBrandList(dmenum, act) {
    if (act === "search") {
        urlapi = MAA_API_Server + 'DME/GetDMEDetailBrand';
    }
    else {
        urlapi = MAA_API_Server + 'DMETopRequest/GetTopUpDetailBrand';
    }
    $.ajax({
        type: "GET",
        url: urlapi,
        data: 'dmenum=' + dmenum,
        success: function (msg) {
            brands = msg;
            console.log('brand: ' + msg);
            bindGridBrand();
        },
        error: function (data) {
            alert('Something Went Wrong');

        }
    });

}
function bindGridBrand() {
    _gridBrand = $("#gridBrandDetail").kendoGrid({
        dataSource: {
            data: brands,
            schema: {
                model: {
                    id: "brandid",
                    fields: {
                        brandid: { editable: false, nullable: false, validation: { required: true } },
                        brand: { type: "string", validation: { required: true } },
                        request: { type: "number", validation: { required: true, min: 0, defaultValue: 0 } }

                    }
                }
            },
            pageSize: 20,
            aggregate: [
                { field: "Brand", aggregate: "count" },
                { field: "request", aggregate: "sum" }
            ]
        },
        scrollable: true,
        sortable: true,
        filterable: false,
        pageable: pageSettingGridBrand,
        columns: columnGridBrand,
        editable: "inline",
        cancel: function (e) {
            $('#gridBrandDetail').data('kendoGrid').dataSource.cancelChanges();
        },
        edit: function (e) {
            var dropDown = e.container.find("[data-role='dropdownlist']").data("kendoDropDownList");
            dropDown.readonly();
        },
        noRecords: true
    }).data("kendoGrid");
}
function editNumber(container, options) {
    $('<input required data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            spinners: false
        });
}
function brandDropDownEditor(container, options) {
    var input = $('<input required id="brandid" name="brand">');
    input.appendTo(container);

    input.kendoDropDownList({
        dataTextField: "Value",
        dataValueField: "Value",
        dataSource: brandList,
        template: "<span data-id='${data.Key}'>${data.Value}</span>",
        select: function (e) {
            var id = e.item.find("span").attr("data-id");
            var BrandItem = _gridBrand.dataItem($(e.sender.element).closest("tr"));
            BrandItem.brandid = id;
        }
    }).appendTo(container);
}
function getbrand() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getBrand',
        success: function (msg) {
            brandList = JSON.parse(msg);
        },
        error: function (data) {
            alert('Something Went Wrong');
        }
    });
}
    // #endregion


// #region GridChannel

function getChannelList(dmenum, act) {
    if (act === "search") {
        urlapi = MAA_API_Server + 'DME/GetDMEDetailMarket';
    }
    else {
        urlapi = MAA_API_Server + 'DMETopRequest/GetTopUpDetailMarket';
    }
    $.ajax({
        type: "GET",
        url: urlapi,
        data: 'dmenum=' + dmenum,
        success: function (msg) {
            channels = msg;
            bindGridChannel();
        },
        error: function (data) {
            alert('Something Went Wrong');

        }
    });
}
function bindGridChannel() {
    _gridChannel = $("#gridChannel").kendoGrid({
        dataSource: {
            data: channels,
            schema: {
                model: {
                    fields: {
                        idmarket: { editable: false, nullable: false, validation: { required: true } },
                        market: { type: "string" },
                        idchannel: { editable: false, nullable: false, validation: { required: true } },
                        channel: { type: "string" },
                        request: { type: "number", validation: { required: true, min: 0, defaultValue: 0 } }

                    }
                }
            },
            pageSize: 20,
            aggregate: [{ field: "channel", aggregate: "count" },
            { field: "request", aggregate: "sum" }
            ]
        },
        scrollable: true,
        sortable: true,
        filterable: false,
        pageable: pageSettingGridMarket,
        columns: columnGridMarket,
        editable: "inline",
        cancel: function (e) {
            $('#gridChannel').data('kendoGrid').dataSource.cancelChanges();
        },
        edit: function (e) {
            var dropDown = e.container.find("[data-role='dropdownlist']").data("kendoDropDownList");
            dropDown.readonly();
            var dropDown1 = e.container.find("[id='idchannel']").data("kendoDropDownList");
            dropDown1.readonly();
        },
        noRecords: true
    }).data("kendoGrid");
}
function marketDropDownEditor(container, options) {
    var input = $('<input required id="idmarket" name="market">');
    input.appendTo(container);

    input.kendoDropDownList({
        dataTextField: "Value",
        dataValueField: "Value",
        dataSource: marketList,
        template: "<span data-id='${data.Key}'>${data.Value}</span>",
        select: function (e) {
            var id = e.item.find("span").attr("data-id");
            var channelItem = _gridChannel.dataItem($(e.sender.element).closest("tr"));
            channelItem.idmarket = id;
        }
    }).appendTo(container);
}
function channelDropDownEditor(container, options) {
    var input = $('<input required id="idchannel" name="channel">');
    input.appendTo(container);
    input.kendoDropDownList({
        dataTextField: "Value",
        dataValueField: "Value",
        dataSource: channelList,
        template: "<span data-id='${data.Key}'>${data.Value}</span>",
        select: function (e) {
            var id = e.item.find("span").attr("data-id");
            var channelItem = _gridChannel.dataItem($(e.sender.element).closest("tr"));
            channelItem.idchannel = id;
        }
    }).appendTo(container);
}
function getmarket() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getMarket',
        success: function (msg) {
            marketList = JSON.parse(msg);
        },
        error: function (data) {
            alert('Something Went Wrong');
        }
    });
}
function getchannel() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getChannel',
        success: function (msg) {
            channelList = JSON.parse(msg);
        },
        error: function (data) {
            alert('Something Went Wrong');
        }
    });
}


// #endregion


$("#gridApproval1").kendoGrid({
    dataSource: {
        data: ApprovalList1,
        schema: {
            model: {
                fields: {
                    Approval1: { type: "string" },
                    Approval2: { type: "string" },
                    Approval3: { type: "string" },
                    Approval4: { type: "string" },
                    Approval5: { type: "string" }
                }
            }
        },
        pageSize: 20
    },
    height: 150,
    scrollable: true,
    sortable: true,
    filterable: false,
    //pageable: {
    //    info: false,
    //    refresh: false,
    //    pageSizes: false,
    //    previousNext: false,
    //    numeric: false,
    //    input: false
    //},
    columns: [
        { field: "Approval1", title: "Approval 1 <br/> Trade Marketing Manager", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval2", title: "Approval 2 <br/> Commersial Manager", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval3", title: "Approval 3 <br/> Finance Manager", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval4", title: "Approval 4 <br/> Sales Marketing Director", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval5", title: "Approval 5 <br/> Finance Director", attributes: { class: "text-center" }, width: "130px", encoded: false }
    ]
});

$("#gridApproval2").kendoGrid({
    dataSource: {
        data: ApprovalList2,
        schema: {
            model: {
                fields: {
                    Approval1: { type: "string" },
                    Approval2: { type: "string" },
                    Approval3: { type: "string" },
                    Approval4: { type: "string" },
                    Approval5: { type: "string" }
                }
            }
        },
        pageSize: 20
    },
    height: 150,
    scrollable: true,
    sortable: true,
    filterable: false,
  
    columns: [
        { field: "Approval1", title: "Approval 6 <br/> President Director", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval2", title: "Approval 7 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval3", title: "Approval 8 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval4", title: "Approval 9 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval5", title: "Approval 10 ", attributes: { class: "text-center" }, width: "130px", encoded: false }
    ]
});

// #region gridAttachment
var _gridAttachment;
function bindGridAttachment(response) {
    _gridAttachment = $("#gridAttachment").kendoGrid({
        dataSource: {
            data: response,
            schema: {
                model: {
                    fields: {
                        name: { type: "string" },
                        extension: { type: "string" }
                    }
                }

            },

            pageSize: 10

        },
        //height: 270,
        width: 120,
        scrollable: true,
        sortable: true,
        filterable: false,
        resizable: true,
        pageable: {
            info: false,
            refresh: false,
            pageSizes: false,
            previousNext: false,
            numeric: false,
            input: false
        },
        columns: [
            {
                field: "Name", width: "30px", attributes: { class: "text-center" },
                template: "# {#<a href='#=Url#'>#:Name#</a>#} #",
                title: "Attachment Name"
            },
            {
                field: "Extension", title: "Extension", width: "30px", attributes: { class: "text-center" }
            }
        ]
    });
}
// #endregion
// #region Attachment
function getBase64(file, cb) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(false, reader.result);
    };
    reader.onerror = function (error) {
        cb(true, error);
    };
}
var fileName = "";
var uploadedFile = [];
$("i").click(function () {
    $("input[type='file']").trigger('click');
});
$('#file-input').change(function () {
    var filename = this.value;
    var lastIndex = filename.lastIndexOf("\\");
    var imgCont = "";
    if (lastIndex >= 0) {
        filename = filename.substring(lastIndex + 1);
    }
    var files = $('#file-input')[0].files;
    res = Array.prototype.slice.call(files);
    for (var i = 0; i < files.length; i++) {
        if (files[i].size / 1024 > maxFileSize) {
            swal("Failed!", "File exceeding maximum allowed size!", "error");
            delete files[i];
            return;
        }

        for (var j = 0; j < uploadedFile.length; j++) {
            if (uploadedFile[j] && uploadedFile[j].name === files[i].name) {
                swal("Failed!", "The attachment already contain file with name " + files[i].name + ".", "error");
                delete files[i];
                return;
                //if (!confirm("The attachment already contain file with name " + files[i].name + ". Do you want to replace?")) {
                //    return;
                //} else {
                //    delete uploadedFile[j];
                //}
            }
        }

        var totalSize = files[i].size / 1024;
        for (j = 0; j < uploadedFile.length; j++) {
            if (uploadedFile[j] && uploadedFile[j].size) {
                totalSize += uploadedFile[j].size;
            }
        }

        if (totalSize / 1024 > maxUploadSize) {
            swal("Failed!", "Total uploaded file exceeding allowed size!", "error");
            delete files[i];
            return;
        }

        var extension = files[i].name.replace(/^.*\./, '');
        var fileTypes = allowedAttachmentType.split(',');
        var fileTypeMatch = false;
        for (j = 0; j < fileTypes.length; j++) {
            if (fileTypes[j] === extension) {
                fileTypeMatch = true;
            }
        }

        if (!fileTypeMatch) {
            swal("Failed!", "File type not allowed!", "error");
            document.getElementById("file-input").value = "";
            delete files[i];
            return;
        }

        var name = files[i].name;

        var fileSize = files[i].size / 1024; //in Kb

        getBase64(files[i], function (error, result) {
            if (!error) {
                var id = Math.floor(Math.random() * 10000);
                uploadedFile.push({
                    id: id,
                    name: name,
                    content: result.substr(result.indexOf(',') + 1),
                    extension: extension,
                    url: '',
                    size: fileSize
                });
                if (extension.toLowerCase() === "png" || extension.toLowerCase() === "jpg" || extension.toLowerCase() === "jpeg") {
                    imgCont = "<img src='" + url_Web + "/images/image.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + id + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "xlsx" || extension.toLowerCase() === "xls") {
                    imgCont = "<img src='" + url_Web + "/images/excel.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + id + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "pdf") {
                    imgCont = "<img src='" + url_Web + "/images/pdf.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + id + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "doc" || extension.toLowerCase() === "docx") {
                    imgCont = "<img src='" + url_Web + "/images/word.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + id + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "ppt" || extension.toLowerCase() === "pptx") {
                    imgCont = "<img src='" + url_Web + "/images/ppt.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + id + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "msg") {
                    imgCont = "<img src='" + url_Web + "/images/mail.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + id + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else {
                    imgCont = "<img src='" + url_Web + "/images/document.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + id + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                $('.filename-container').append("<div class='text-center' id='attachment-" + id + "' style='display:inline' >" + imgCont + "<span  class='filename' style='font-size:8px;display:inline'>" + name + "</span></div>").show();

            } else {
                swal("Failed!", error, "error");
            }
        });
    }
});
function removeAttachment(e) {
    if (confirm('Are you sure want to remove the attachment?')) {
        $('#attachment-' + e).remove();
        var name = '';
        for (var i = 0; i < uploadedFile.length; i++) {
            if (uploadedFile[i].id === e) {
                name = uploadedFile[i].name;
                uploadedFile.splice(i, 1);

            }
        }
        document.getElementById("file-input").value = "";
    }
}
// #endregion


function btnSubmitClicked() {
    startSpinner('loading..', 1);
    validationPage();
}
var validationMessage = '';

function tabMandatory(textTab) {
    if (!validationMessage.includes(textTab)) {
        if (validationMessage) {
            validationMessage = validationMessage + '<br/>';
        }
        validationMessage = validationMessage + '<font size="3"><b>Please Review ' + textTab + ':</b></font> <br/>';
    }
}

function validationPage() {
    var textTab1 = $('#tab1').text();
    var textTab2 = $('#tab2').text();
    var textTab3 = $('#tab3').text();

    var DMEReqNumber = $('#txtDMEReqNumber').val();
    var Description = $('#txtDescription').val();
    var TopUpAmount = removeCommas($('#txtTopUpAmount').val());

    validationMessage = '';

    if (!DMEReqNumber) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select DME Request Number.' + '\n';
    }

   
    if (!TopUpAmount) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please fill Top Up Amount.' + '\n';
    }
    if (uploadedFile === undefined || uploadedFile === null || uploadedFile.length < 1) {
        tabMandatory(textTab2);
        validationMessage = validationMessage + 'Attachment file is required.' + '\n';
    }
    if (_gridReq !== undefined || _gridChannel !== undefined || _gridBrand !== undefined) {
        var requestData = _gridReq.dataSource.data();
        var gridChannelRequest = _gridChannel.dataSource.data();
        var gridBrandRequest = _gridBrand.dataSource.data();

        var unCommitted = 0;
        var totRequestItem = 0;
        var totRequestChannel = 0;
        var totRequestBrand = 0;
        var totRequestSampling = 0;
        var totRequest = 0;

        for (var i = 0; i < requestData.length; i++) {
            unCommitted = unCommitted + ((requestData[i].originalBudget * 1) + (requestData[i].adjustment * 1) - (requestData[i].ytdDme * 1) - (requestData[i].totalRequest * 1) - (requestData[i].samplingAmount * 1));
            totRequestItem = totRequestItem + (requestData[i].totalRequest * 1);
            totRequestSampling = totRequestSampling + (requestData[i].samplingAmount * 1);
        }
        totRequest = (totRequestSampling * 1) + (totRequestItem * 1);
        for (var x = 0; x < gridChannelRequest.length; x++) {
            totRequestChannel = totRequestChannel + (gridChannelRequest[x].request * 1);
        }

        for (var y = 0; y < gridBrandRequest.length; y++) {
            totRequestBrand = totRequestBrand + (gridBrandRequest[y].request * 1);
        }

        if (unCommitted < 0) {
            tabMandatory(textTab2);
            validationMessage = validationMessage + " DME Budget is not sufficient, please check your Top Up Amount " + '\n';
        }

        if (TopUpAmount) {
            if ((totRequest !== TopUpAmount * 1) || (totRequestChannel !== TopUpAmount * 1) || (totRequestBrand !== TopUpAmount * 1)) {
                tabMandatory("Request Amount");
                validationMessage = validationMessage + " Please ensure Top Up Amount must same amount with Total Request Item, Request Amount by Channel and Request Amount by Brand " + '\n';
            }
        }
    }

   

    if (validationMessage) {
        startSpinner('loading..', 0);
        validationForm(validationMessage);
    }
    else {
        saveData();
       // successPrompt();
    }

}

function saveData() {
    if (dmeNumberModel) {
        dmeNum = dmeNumberModel;
    } else {
        dmeNum = $("#txtTopUpReqNumber").val();
    }
    replaceNullValue();

    var Save_DMERequestData = {
        TopUpRequestNumber: dmeNum,
        DMENumber: dmeNumberVal,
        RequestType: "Top Up",
        CreatedDate: new Date(dateServer).toJSON(),
        RequestorName: $("#txtRequestor").val(),
        TopUpAmount: removeCommas($("#txtTopUpAmount").val()),
        DocumentStatus: "Waiting Approval",
        ApprovalStatus: 4,
        BrandList: JSON.stringify(_gridBrand.dataSource.data().toJSON()),
        ChannelList: JSON.stringify(_gridChannel.dataSource.data().toJSON()),
        OperationList: JSON.stringify(_gridReq.dataSource.data().toJSON()),
        Attachment: uploadedFile,
        RequestorPositionID: $("#RequestorPositionID").val(),
        RequestorPosition: $("#RequestorPosition").val(),
        RequestorPINID: $('#RequestorPINID').val(),
        CreatedBy: $('#CreatedBy').val()
    };
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'DMETopRequest/SaveDMERequestData',
        data: Save_DMERequestData,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {
            var msg = JSON.parse(response);
            if (msg.Message === "success") {
                startSpinner('loading..', 0);
                swal({
                    type: 'success',
                    title: 'Success',
                    text: 'Your Request Number : ' + msg.Result
                }).then(function () {
                    window.location = url_Web;
                });
            }
            else {
                startSpinner('loading..', 0);
                swal("Failed!", msg.Message, "error");
            }
        },
        error: function (response) {
            startSpinner('loading..', 0);

            alert("fail");
        }
    });

}

function LoadDMEReqData() {
    startSpinner('loading..', 1);
    dmeNumberVal = $('#txtDMEReqNumber').val();
    if ($('#txtDMEReqNumber').val()) {
        $.ajax({
            type: "GET",
            url: MAA_API_Server + 'DME/GetDMERequestDataByRequestNumber',
            data: 'dmeRequestNumber=' + dmeNumberVal + '&page=topup',
            success: function (msg) {
                if (msg !== null && msg.message !== "fail") {
                    msg = JSON.parse(msg);
                    msg = JSON.parse(msg.Message);
                    console.log(msg);

                    if (msg !== null) {
                        $('#txtOperation').val(msg.OperationName);
                        $('#txtRegion').val(msg.RegionName);
                        $('#txtMarket').val(msg.MarketName);
                        $('#txtAdvertisingType').val(msg.AdvertysingName);
                        $('#txtActivity').val(msg.ActivityName);
                        $('#txtJoinActivity').val(msg.JoinActivityName);
                        $('#txtPONumber').val(msg.PONumber);
                        $('#txtMarketingProgramName').val(msg.ProgramName);
                        $('#txtInternalOrder').val(msg.InternalOrder);
                        $('#txtDescription').val(msg.MarketingProgramDescription);
                        document.getElementById('dtActivityperiodFrom').value = msg.ActivityPeriodFromDisplay;
                        document.getElementById('dtActivityperiodTo').value = msg.ActivityPeriodToDisplay;
                        document.getElementById('dtInvoiceSettlementDate').value = msg.InvoiceSettlementDateDisplay;
                        revNum = msg.DMEReverseNumber;
                        document.getElementById('txtTotalAmount').value = addCommas(totAmt.toString());
                        activityParam = msg.Activity;
                        advertisingtypeParam = msg.Advertysingtype;
                        budgetyearParam = msg.ActivityPeriodToDisplay;
                        bindSampling(dmeNumberVal);

                        reqAmt = msg.AmountRequest;
                        totAmt = (reqAmt * 1) + (topUpAmt * 1);
                        document.getElementById('txtAmountRequest').value = addCommas(msg.AmountRequest.toString());
                        document.getElementById('txtTotalAmount').value = addCommas(totAmt.toString());

                        if (DocumentStatusModel === "0") {
                            $('#txtTopUpAmount').removeAttr("disabled");
                        }

                        getOperationList(dmeNumberModel);
                        getBrandList(dmeNumberModel);
                        getChannelList(dmeNumberModel);
                    }
                    else {
                        startSpinner('loading..', 0);
                    }


                }
                else {
                    startSpinner('loading..', 0);
                    swal("Failed!", "Request failed!", "error");
                }

            },
            error: function (data) {
                startSpinner('loading..', 0);

                alert('Something Went Wrong');
                numLoad -= 1;

            }
        });
    }
   
}

function LoadDMEReqDatatopUp() {
    startSpinner('loading..', 1);
    dmeNumberVal = $('#txtDMEReqNumber').val();
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DME/GetDMERequestDataByRequestNumber',
        data: 'dmeRequestNumber=' + dmeNumberVal + '&page=topup',
        success: function (msg) {
            if (msg !== null && msg.message !== "fail") {
                msg = JSON.parse(msg);
                msg = JSON.parse(msg.Message);
                console.log(msg);

                if (msg !== null) {
                    $('#txtOperation').val(msg.OperationName);
                    $('#txtRegion').val(msg.RegionName);
                    $('#txtMarket').val(msg.MarketName);
                    $('#txtAdvertisingType').val(msg.AdvertysingName);
                    $('#txtActivity').val(msg.ActivityName);
                    $('#txtJoinActivity').val(msg.JoinActivityName);
                    $('#txtPONumber').val(msg.PONumber);
                    $('#txtMarketingProgramName').val(msg.ProgramName);
                    $('#txtInternalOrder').val(msg.InternalOrder);
                    $('#txtDescription').val(msg.MarketingProgramDescription);
                  
                    document.getElementById('dtActivityperiodFrom').value = msg.ActivityPeriodFromDisplay;
                    document.getElementById('dtActivityperiodTo').value = msg.ActivityPeriodToDisplay;
                    document.getElementById('dtInvoiceSettlementDate').value = msg.InvoiceSettlementDateDisplay;

                    activityParam = msg.Activity;
                    advertisingtypeParam = msg.Advertysingtype;
                    budgetyearParam = msg.ActivityPeriodToDisplay;
                    bindSampling(dmeNumberVal);

                    reqAmt = msg.AmountRequest;
                    totAmt = (reqAmt * 1) + (topUpAmt * 1);
                    document.getElementById('txtAmountRequest').value = addCommas(msg.AmountRequest.toString());
                    document.getElementById('txtTotalAmount').value = addCommas(totAmt.toString());

                    $('#txtTopUpAmount').removeAttr("disabled");
                    getOperationList($('#txtDMEReqNumber').val(), "search");
                    getBrandList($('#txtDMEReqNumber').val(), "search");
                    getChannelList($('#txtDMEReqNumber').val(), "search");
                    
                }
                else {
                    startSpinner('loading..', 0);
                }


            }
            else {
                startSpinner('loading..', 0);
                swal("Failed!", "Request failed!", "error");
            }

        },
        error: function (data) {
            startSpinner('loading..', 0);

            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });
}

function LoadDMEReq() {
   // startSpinner('loading..', 1);
    dmeNumberVal = $('#txtDMEReqNumber').val();
   
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DME/GetDMERequestDataByRequestNumber',
        data: 'dmeRequestNumber=' + dmeNumberVal,
        success: function (msg) {
            if (msg !== null && msg.message !== "fail") {
                msg = JSON.parse(msg);
                msg = JSON.parse(msg.Message);
                if (msg !== null) {
                    reqAmt = msg.AmountRequest;
                    totAmt = reqAmt + topUpAmt;
                    document.getElementById('txtAmountRequest').value = addCommas(msg.AmountRequest.toString());
                    document.getElementById('txtTotalAmount').value = addCommas(totAmt.toString());
                }
                else {
                    //startSpinner('loading..', 0);
                }
            }
            else {
              //  startSpinner('loading..', 0);
                swal("Failed!", "Request failed!", "error");
            }

        },
        error: function (data) {
            startSpinner('loading..', 0);

            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });
}

function bindSampling(dmeNumberModel) {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'SamplingDirect/GetSamplingRequestDataByDMENumber',
        data: 'dmenumber=' + dmeNumberModel,
        success: function (msg) {
            $('#divSamplingNumber').show();
            for (var i = 0; i < msg.length; i++) {
                samplingNumber = msg[i].samplingNumber;
                var url = url_Web + 'samplingdirect?id=' + samplingNumber;
                $("#divContainerSampling").append("<p><a href=" + url + " class='i - link linkDoc'>" + samplingNumber + "</a></p>");
            }

        },
        error: function (data) {
            alert('Something Went Wrong');
            startSpinner('loading..', 0);

        }
    });
}

function ontxtTopUpAmountKeyUp() {
    document.getElementById('txtTopUpAmount').value = addCommas($('#txtTopUpAmount').val());
    topUpAmt = removeCommas($('#txtTopUpAmount').val());
    amountCalc();
}

function amountCalc() {
    totAmt = (topUpAmt * 1) + (reqAmt * 1);
    document.getElementById('txtTotalAmount').value = addCommas(totAmt.toString());
}

function btnDraftClicked() {
    startSpinner('loading..', 1);
    var reqAmt = $("#txtTopUpAmount").val();
    if (!reqAmt) {
        reqAmt = 0;
    } else {
        reqAmt = removeCommas($("#txtTopUpAmount").val());
    }

    if (dmeNumberModel) {
        dmeNum = dmeNumberModel;
    } else {
        dmeNum = $("#txtTopUpReqNumber").val();
    }
    dmeNumberVal = $('#txtDMEReqNumber').val();
    var brandListDS;
    var marketListDS;
    var operationListDS;
    replaceNullValue();

    if ( _gridBrand !== undefined) {
        brandListDS = JSON.stringify(_gridBrand.dataSource.data().toJSON());
    }
    if (_gridReq !== undefined) {
        operationListDS = JSON.stringify(_gridReq.dataSource.data().toJSON());
    }
    if (_gridChannel !== undefined) {
        marketListDS = JSON.stringify(_gridChannel.dataSource.data().toJSON());
    }
    var Save_DMERequestData = {
        TopUpRequestNumber: dmeNum,
        DMENumber: dmeNumberVal,
        RequestType: "Top Up",
        CreatedDate: new Date(dateServer).toJSON(),
        RequestorName: $("#txtRequestor").val(),
        TopUpAmount: reqAmt,
        DocumentStatus: "Created",
        ApprovalStatus: 0,
        BrandList: brandListDS,
        ChannelList: marketListDS,
        OperationList: operationListDS,
        Attachment: uploadedFile,
        RequestorPositionID: $("#RequestorPositionID").val(),
        RequestorPosition: $("#RequestorPosition").val(),
        RequestorPINID: $('#RequestorPINID').val(),
        CreatedBy: $('#CreatedBy').val()
    };

    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'DMETopRequest/SaveDMERequestData',
        data: Save_DMERequestData,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {
            var msg = JSON.parse(response);
            if (msg.Message === "success") {
                
                startSpinner('loading..', 0);
                swal({
                    type: 'success',
                    title: 'Success',
                    text: 'Save Successfully'
                }).then(function () {
                    window.location = url_Web;
                });

            } else {
                startSpinner('loading..', 0);
                alert("fail");
            }
        },
        error: function (response) {
            startSpinner('loading..', 0);
            alert("fail");
        }
    });

}

function btnReverseClicked() {
    //revNum
    var urlRev = "";
    if (revNum) {
        urlRev = "id=" + revNum;
    }
    else {
        urlRev = "dmenum=" + DMEReverseNumberModel;
    }
    window.location = url_Web + "DMEReverse?" + urlRev;
}

//fleming
//#region menambahkan fungsi button update document -> approve, reject
function btnApproveClicked() {
    startSpinner('loading..', 1);
    var internalorder = $("#txtInternalOrder").val();

    //var updatestatusdata = "";
    //updatestatusdata.append("requestnumber", dmeNumberModel);
    //updatestatusdata.append("documentstatus", DocumentStatusModel); 
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'DMETopRequest/UpdateDMEStatus?requestnumber=' + dmeNumberModel
            + '&&documentstatus=' + DocumentStatusModel + '&&updateddocumentstatus=Budget in Progress' + '&&internalorder=""&&approvalStatus=1',
        //data: updatestatusdata,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {
            var data = JSON.parse(response);
            if (data.Success) {
                //if (data.get('files')) {
                //    data.append("FormNumber", response.dmenumber);
                //    saveAttachment();
                //} else {
                //    startSpinner('loading..', 0);
                //    swal({
                //        type: 'success',
                //        title: 'Success',
                //        text: 'Save Successfully'
                //    }).then(function () {
                //        window.location = url_Web;
                //    });
                //}
                startSpinner('loading..', 0);
                swal({
                    type: 'success',
                    title: 'Success',
                    text: 'Save Successfully'
                }).then(function () {
                    window.location = url_Web;
                });
            } else {
                startSpinner('loading..', 0);

                swal({
                    type: 'error',
                    title: 'Error',
                    text: data.Message
                }).then(function () {
                    //window.location = url_Web;
                });
            }


        },
        error: function (response) {
            startSpinner('loading..', 0);

            alert("fail");
        }
    });
}

function btnRejectClicked() {
    startSpinner('loading..', 1);

    //var updatestatusdata = "";
    //updatestatusdata.append("requestnumber", dmeNumberModel);
    //updatestatusdata.append("documentstatus", DocumentStatusModel);
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'DMETopRequest/UpdateDMEStatus?requestnumber=' + dmeNumberModel
            + '&&documentstatus=' + DocumentStatusModel + '&&updateddocumentstatus=""' + '&&internalorder=""&&approvalStatus=2',
        //data: updatestatusdata,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {
            var data = JSON.parse(response);
            if (data.Success) {
                startSpinner('loading..', 0);
                swal({
                    type: 'success',
                    title: 'Success',
                    text: 'Save Successfully'
                }).then(function () {
                    window.location = url_Web;
                });
            } else {
                startSpinner('loading..', 0);

                swal({
                    type: 'error',
                    title: 'Error',
                    text: data.Message
                }).then(function () {
                    //window.location = url_Web;
                });
            }


        },
        error: function (response) {
            startSpinner('loading..', 0);

            alert("fail");
        }
    });
}
function updateStatus(docStatus) {
   // Console.log(docStatus);
    startSpinner('loading..', 1);
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'DMETopRequest/UpdateDMEStatus?requestnumber=' + dmeNumberModel
            + '&&documentstatus=' + DocumentStatusModel + '&&updateddocumentstatus=' + docStatus + '&&internalorder=""&&approvalStatus=1',
        //data: updatestatusdata,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {
            var data = JSON.parse(response);
            if (data.Success) {
                startSpinner('loading..', 0);
                swal({
                    type: 'success',
                    title: 'Success',
                    text: 'Save Successfully'
                }).then(function () {
                    window.location = url_Web;
                });
            } else {
                startSpinner('loading..', 0);

                swal({
                    type: 'error',
                    title: 'Error',
                    text: data.Message
                }).then(function () {
                    //window.location = url_Web;
                });
            }


        },
        error: function (response) {
            startSpinner('loading..', 0);

            alert("fail");
        }
    });
}

// #endregion