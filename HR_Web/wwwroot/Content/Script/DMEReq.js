var numLoad = 8;
var loadInterval = setInterval(checkCallback, 2000);
var marketList = [];
var channelList = [];
var brandList = [];
$(document).ready(function () {
    startSpinner('loading..', 1);
    initTabStrip();
    initialSetting();
   

});

function checkCallback() {
    if (numLoad <= 0) {
        window.clearInterval(loadInterval);
        startSpinner('loading..', 0);
    }
}

var dmeNo = "";
var data = new FormData();
var _gridBrand;
var _gridChannel;
var _gridReq;
var samplingNumber = '';
// #region Initialize
var columnGridOperation = [
    { field: "operationDesc", title: "Operation", width: "130px", editor: operationDropDownEditor, template: "#=operationDesc#", aggregates: ["count"], footerTemplate: "<div align=center>Total</div>" },
    { field: "originalBudget", title: "Original Budget", format: "{0:#,0}", attributes: { class: "text-right " }, width: "130px", aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { field: "adjustment", title: "Adjustment", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { field: "adjBudgetBalance", title: "Adj. Budget Balance", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { field: "ytdDme", title: "YTD DME", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { field: "totalRequest", title: "Total Request", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(calcRequest(sum), \"n0\") #</div>" },
    { field: "samplingAmount", title: "Sampling Amount", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(calcSampling(sum), \"n0\") #</div>" },
    { command: ["edit", "destroy"], title: "&nbsp;", width: "120px" }

];



var columnGridBrand = [
    { field: "brand", title: "Brand", width: "130px", aggregates: ["count"], editor: brandDropDownEditor, template: "#=brand#", footerTemplate: "<div align=center>Total</div>" },
    { field: "request", title: "Request", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { command: ["edit", "destroy"], title: "&nbsp;", width: "120px" }
];

var columnGridMarket = [
    { field: "market", title: "Market Name", width: "130px", editor: marketDropDownEditor, template: "#=market#" },
    { field: "channel", title: "Channel", width: "130px", editor: channelDropDownEditor, template: "#=channel#", aggregates: ["count"], footerTemplate: "<div align=center>Total</div>" },
    { field: "request", title: "Request", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { command: ["edit", "destroy"], title: "&nbsp;", width: "120px" }
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

function initialSetting() {
   
   // bindOperationList();
    bindRegionList();
    bindMarketList();
    bindAdvertisingTypeList();
   
    bindJoinActivityList();
    bindMarketingProgramNameList();
    getmarket();
    getchannel();
    getbrand();
    var setDateServerYear = new Date(dateServer);
    setDateServerYear = setDateServerYear.getFullYear();
    $('#divFromActivityPeriod').datepicker({
        format: 'dd/mm/yyyy',
        todayBtn: 'linked',
        autoclose: true,
        startDate: '01/01/' + setDateServerYear
    }).on('changeDate', function (selected) {
        var minDate = new Date(selected.date.valueOf());
        $('#divFromActivityPeriodTo').datepicker('setStartDate', minDate);
    });

    $('#divFromActivityPeriodTo').datepicker({
        format: 'dd/mm/yyyy',
        todayBtn: 'linked',
        autoclose: true,
        startDate: '01/01/' + setDateServerYear
    }).on('changeDate', function (selected) {
        var minDate = new Date(selected.date.valueOf());
        //var SettleDate = new Date(selected.date.valueOf());
        //SettleDate = SettleDate.setMonth(SettleDate.getMonth() + 3);

        $('#divFromActivityPeriod').datepicker('setEndDate', minDate);
        var SettleDateDefault = minDate.setMonth(minDate.getMonth() + 1);
        SettleDateDefault = new Date(SettleDateDefault);

        let dd = SettleDateDefault.getDate();
        let mm = SettleDateDefault.getMonth() + 1;
        const yyyy = SettleDateDefault.getFullYear();
        if (dd < 10) {
            dd = `0${dd}`;
        }

        if (mm < 10) {
            mm = `0${mm}`;
        } 

        document.getElementById('dtInvoiceSettlementDate').value = `${dd}/${mm}/${yyyy}`;

        var SettleDate = new Date(minDate.setMonth(minDate.getMonth() + 2));

        $('#divdtInvoiceSettlementDate').datepicker('setEndDate', SettleDate);
        enableAddNewReq();
    });

    $('#divdtInvoiceSettlementDate').datepicker({
        format: 'dd/mm/yyyy',
        todayBtn: 'linked',
        autoclose: true,
        startDate: '01/01/' + setDateServerYear
    });
    if (!DocumentStatusModel) {
        $('#divbtnDraft').show();
        $('#divbtnSubmit').show();
       // document.getElementById("txtInternalOrder").disabled = true;
        document.getElementById('txtCreatedDate').value = generateCreateDate();
        //document.getElementById('txtRequestor').value = "Arya Eka Wirawan";
        document.getElementById('dtActivityperiodTo').value = "";
        document.getElementById('dtActivityperiodFrom').value = "";
        document.getElementById('dtInvoiceSettlementDate').value = "";
        document.getElementById('txtAmountRequest').value = "";
        document.getElementById('txtDMEReqNumber').value = 'DME/NO-' + generateAutoNumber($('#txtRequestor').val());

        bindGridBrand();
        bindGridChannel();
        bindGridOperation();
        $('#lbldocstatus').html("");
        $('#lblApprovalStatus').html("");
    } else {
        numLoad = numLoad + 3;
        bindGridAttachment(attachments);
        getBrandList(dmeNumberModel);
        getChannelList(dmeNumberModel);
        getOperationList(dmeNumberModel);
        var amtReq = $('#txtAmountRequest').val().split(".");
       
        if (amtReq < 0) {
            document.getElementById('txtAmountRequest').value = '-' + addCommas(amtReq[0]);
        } else {
            document.getElementById('txtAmountRequest').value = addCommas(amtReq[0]);
        }
        document.getElementById('txtCreatedDate').value = createdDateModel;
       // document.getElementById("txtInternalOrder").disabled = false;
        if (ActivityPeriodFromModel) {
          //  ActivityPeriodFromModel = toMMDDYYYY(ActivityPeriodFromModel);


            $('#dtActivityperiodFrom').datepicker({
                dateFormat: 'dd/mm/yyyy'
            }).datepicker('setDate', ActivityPeriodFromModel);

            document.getElementById('dtActivityperiodFrom').value = ActivityPeriodFromModel;
        }
       
        if (ActivityPeriodToModel) {
           // ActivityPeriodToModel = toMMDDYYYY(ActivityPeriodToModel);


            $('#dtActivityperiodTo').datepicker({
                dateFormat: 'dd/mm/yyyy'
            }).datepicker('setDate', ActivityPeriodToModel);

            document.getElementById('dtActivityperiodTo').value = ActivityPeriodToModel;
        }
        if (InvoiceSettlementDateModel) {
            // ActivityPeriodToModel = toMMDDYYYY(ActivityPeriodToModel);


            $('#dtInvoiceSettlementDate').datepicker({
                dateFormat: 'dd/mm/yyyy'
            }).datepicker('setDate', InvoiceSettlementDateModel);

            document.getElementById('dtInvoiceSettlementDate').value = InvoiceSettlementDateModel;
        }
       
        if (ApprovalStatusModel !== "0") {
            $('#divAttachment').hide();
            $('#divbtnSubmit').hide();
            $('#divbtnDraft').hide();
           

            document.getElementById("txtOperation").disabled = true;
            document.getElementById("txtRegion").disabled = true;
            document.getElementById("txtMarket").disabled = true;
            document.getElementById("txtAdvertisingType").disabled = true;
            document.getElementById("txtActivity").disabled = true;
            //document.getElementById("txtPPASamplingNumber").disabled = true;
            document.getElementById("txtJoinActivity").disabled = true;
            document.getElementById("txtPONumber").disabled = true;
            document.getElementById("txtMarketingProgramName").disabled = true;
            document.getElementById("txtDescription").disabled = true;
            //document.getElementById("txtInternalOrder").disabled = false;
            document.getElementById("dtActivityperiodFrom").disabled = true;
            document.getElementById("dtActivityperiodTo").disabled = true;
            document.getElementById("dtInvoiceSettlementDate").disabled = true;
            document.getElementById("txtAmountRequest").disabled = true;
            $('#divFromActivityPeriodTo, #divFromActivityPeriod, #divdtInvoiceSettlementDate').datepicker('remove');
            $('#btnAddNewOperation, #btnAddNewChannel, #btnAddNewBrand').hide();


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
            //temp
            bindSampling();

          
           
        }
        //$('#lblApprovalStatus').html("Waiting Approval");
        if (ApprovalStatusModel === "0") {
            $('#lbldocstatus').html('- ' + DocumentStatusModel);
            $('#lblApprovalStatus').html("Draft");
            $('#divbtnDraft').show();
            $('#divbtnSubmit').show();
        }
        if (ApprovalStatusModel === "4") {
            $('#divapprove').show();
            $('#divreject').show();
            $('#divsendback').show();
            $('#lbldocstatus').html('- ' + DocumentStatusModel);
            $('#lblApprovalStatus').html("In Process");
           // document.getElementById("txtInternalOrder").disabled = false;
        }
        if (ApprovalStatusModel === "2") {
            $('#lblApprovalStatus').html("Rejected");
        }
        
        if (ApprovalStatusModel === "1") {
            if (DocumentStatusModel === "IO in Progress" || DocumentStatusModel === "Budget in Progress") {
                document.getElementById("txtInternalOrder").disabled = false;
                $('#divsubmitio').show();
            }
            $('#lblApprovalStatus').html("Completed");
            $('#lbldocstatus').html('- ' + DocumentStatusModel);
           
           
            if (DocumentStatusModel === "Budget in Progress") {
                $('#divcompleted').show();
            }

            if (DocumentStatusModel === "Realization In Progress" || DocumentStatusModel === "Top Up Done & Realization In Progress" || DocumentStatusModel === "Top Up Done &amp; Realization In Progress") {
              

                if (JoinActivityModel === "02" || JoinActivityModel === "03") {
                    if (isExecModel === "0") {
                        document.getElementById("dtInvoiceSettlementDate").disabled = false;
                        $('#divdtInvoiceSettlementDate').datepicker({
                            format: 'dd/mm/yyyy',
                            todayBtn: 'linked',
                            autoclose: true,
                            startDate: '0d'
                        });
                        $('#divmanual').show();
                    }
                  

                }
                else {
                    $('#divbtnTopUp').show();
                    if (ActiveDmeModel === "True") {
                        $('#divbtnReverse').hide();
                    }
                    else {
                        $('#divbtnReverse').show();
                    }
                }
            }

           

            
            //if (DocumentStatusModel === "Reversal In Progrees" || DocumentStatusModel === "Reversal Done") {
            //    $('#divbtnReverse').show();
            //    if (ActiveDmeModel === "False") {
            //        $('#divbtnTopUp').hide();
            //    }
            //    else {
            //        $('#divbtnTopUp').show();
            //    }
            //}
        }

    }
}

function enableAddNewReq() {
    if ($('#txtAdvertisingType').val() && $('#txtActivity').val() && $('#dtActivityperiodTo').val()) {
        document.getElementById("btnAddNewRowRequest").disabled = false;
        $('#textValidationAddNewRowRequest').hide();
    }

   
}

function bindOperationList() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getOperation',
        data: { param: $('#txtRegion').val() },
        success: function (msg) {
            $("#txtOperation").empty();
            $("#txtOperation").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);

            for (var i = 0; i < data.length; i++) {
                $("#txtOperation").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
          //  startSpinner('loading..', 0);
            $("#txtOperation option[value='" + OperationModel + "']").attr("selected", "selected");
            $('#txtOperation').selectpicker('refresh');
            $('#txtOperation').selectpicker('render');
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
            startSpinner('loading..', 0);
        }
    });
}

function bindRegionList() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getRegion',
        success: function (msg) {
            //$("#txtRegion").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);
            for (var i = 0; i < data.length; i++) {
                $("#txtRegion").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
            $("#txtRegion option[value='" + RegionModel + "']").attr("selected", "selected");
            $('#txtRegion').selectpicker('refresh');
            $('#txtRegion').selectpicker('render');

            if (OperationModel) {
                ontxtRegionChanged();
            }

        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });
}

function bindMarketList() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getMarket',
        success: function (msg) {
         //   $("#txtMarket").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);

            for (var i = 0; i < data.length; i++) {
                $("#txtMarket").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
            $("#txtMarket option[value='" + MarketModel + "']").attr("selected", "selected");
            $('#txtMarket').selectpicker('refresh');
            $('#txtMarket').selectpicker('render');
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });
   
}

function bindAdvertisingTypeList() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getAdverstisingType',
        success: function (msg) {
            //$("#txtAdvertisingType").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);

            for (var i = 0; i < data.length; i++) {
                $("#txtAdvertisingType").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            $('#txtAdvertisingType').addClass('selectpicker');
            numLoad -= 1;
            $("#txtAdvertisingType option[value='" + AdvertysingtypeModel + "']").attr("selected", "selected");
            $('#txtAdvertisingType').selectpicker('refresh');
            $('#txtAdvertisingType').selectpicker('render');
            enableAddNewReq();

            if (ActivityModel) {
                ontxtAdvertisingTypeChanged();
            }

        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });
}

function bindActivityList() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getActivity',
        data: { param: $('#txtAdvertisingType').val()},
        success: function (msg) {
            $("#txtActivity").empty();
            $("#txtActivity").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);
            for (var i = 0; i < data.length; i++) {
                $("#txtActivity").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
            $("#txtActivity option[value='" + ActivityModel + "']").attr("selected", "selected");
            $('#txtActivity').selectpicker('refresh');
            $('#txtActivity').selectpicker('render');
            enableAddNewReq();
          //  startSpinner('loading..', 0);
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
            startSpinner('loading..', 0);


        }
    });
}

function bindJoinActivityList() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getJoinActivity',
        success: function (msg) {
           // $("#txtJoinActivity").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);
            for (var i = 0; i < data.length; i++) {
                $("#txtJoinActivity").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
            $("#txtJoinActivity option[value='" + JoinActivityModel + "']").attr("selected", "selected");
            $('#txtJoinActivity').selectpicker('refresh');
            $('#txtJoinActivity').selectpicker('render');
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });
}

function bindMarketingProgramNameList() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getMarketingProgram',
        success: function (msg) {
           // $("#txtMarketingProgramName").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);
            for (var i = 0; i < data.length; i++) {
                $("#txtMarketingProgramName").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
            $("#txtMarketingProgramName option[value='" + MarketingProgramNameModel + "']").attr("selected", "selected");
            $('#txtMarketingProgramName').selectpicker('refresh');
            $('#txtMarketingProgramName').selectpicker('render');
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });
}

function bindSampling() {
    //dmeNumberModel

    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'SamplingDirect/GetSamplingRequestDataByDMENumber',
        data: 'dmenumber=' + dmeNumberModel,
        success: function (msg) {
          
            $('#divSamplingNumber').show();
            for (var i = 0; i < msg.length; i++) {
                //samplingNumber
                samplingNumber = msg[i].samplingNumber;
                var url = url_Web + 'samplingdirect?id=' + samplingNumber;
                $("#divContainerSampling").append("<p><a href=" + url + " class='i - link linkDoc'>" + samplingNumber + "</a></p>");

            }
        },
        error: function (data) {
            alert('Something Went Wrong');

        }
    });

   

}

// #endregion


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



// #region GridOperation
function getOperationList(dmenum) {
    startSpinner('loading..', 1);
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DME/GetDMEDetailOperation',
        data: 'dmenum=' + dmenum,
        success: function (msg) {
         
            products = msg;
            bindGridOperation();
            unCommiteCalc();
          //  startSpinner('loading..', 0);
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
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
                        operationItem: { editable: false, nullable: false, validation: { required: true } },
                        operationDesc: { type: "string" },
                        originalBudget: { type: "number" },
                        adjustment: { type: "number" },
                        adjBudgetBalance: { type: "number" },
                        ytdDme: { type: "number" },
                        totalRequest: { type: "number", validation: { required: false, min: 0, defaultValue: 0 } },
                        samplingAmount: {
                            type: "number", validation: {
                                required: false, min: 0, defaultValue: 0}
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
        cancel: function (e) {
            $('#gridReq').data('kendoGrid').dataSource.cancelChanges();
        },
        edit: function (e) {
            var numeric = e.container.find("input[name=originalBudget]").data("kendoNumericTextBox");
            numeric.enable(false);
            var adjustment = e.container.find("input[name=adjustment]").data("kendoNumericTextBox");
            adjustment.enable(false);
            var AdjBudgetBalance = e.container.find("input[name=adjBudgetBalance]").data("kendoNumericTextBox");
            AdjBudgetBalance.enable(false);
            var YTDDME = e.container.find("input[name=ytdDme]").data("kendoNumericTextBox");
            YTDDME.enable(false);
            var samplingAmount = e.container.find("input[name=samplingAmount]").data("kendoNumericTextBox");
            if (samplingAmount.value() === null) {
                samplingAmount.value(0);
            }
            var totalRequest = e.container.find("input[name=totalRequest]").data("kendoNumericTextBox");
            if (totalRequest.value() === null) {
                totalRequest.value(0);
            }
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
    var budgetYeardate = new Date($('#dtActivityperiodTo').val());
    budgetYeardate = budgetYeardate.getFullYear();
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
                            activity: $('#txtActivity').val(),
                            advertisingtype: $('#txtAdvertisingType').val(),
                            budgetyear: $('#dtActivityperiodTo').val()
                        }
                    }
                }
            },
            dataTextField: "operationDesc",
            dataValueField: "operationDesc",
            optionLabel: "Select Operation",
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

$("#gridApproval1").kendoGrid({
    dataSource: {
        data: approval1s,
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
    pageable: {
        info: false,
        refresh: false,
        pageSizes: false,
        previousNext: false,
        numeric: false,
        input: false
    },
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
        data: approval2s,
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
    pageable: {
        info: false,
        refresh: false,
        pageSizes: false,
        previousNext: false,
        numeric: false,
        input: false
    },
    columns: [
        { field: "Approval1", title: "Approval 6 <br/> President Director", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval2", title: "Approval 7 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval3", title: "Approval 8 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval4", title: "Approval 9 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval5", title: "Approval 10 ", attributes: { class: "text-center" }, width: "130px", encoded: false }
    ]
});

// #region GridBrand


function getBrandList(dmenum) {
    startSpinner('loading..', 1);
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DME/GetDMEDetailBrand',
        data: 'dmenum=' + dmenum,
        success: function (msg) {
            brands = msg;
         
            bindGridBrand();
          //  startSpinner('loading..', 0);
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
            startSpinner('loading..', 0);

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
        columns:columnGridBrand,
        editable: "inline",
        cancel: function (e) {
            $('#gridBrandDetail').data('kendoGrid').dataSource.cancelChanges();
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
    //$("<input required  data-bind='value:brand'  />")
    //    .attr("brandid", "ddl_brand")
    //    .appendTo(container)
    //    .kendoDropDownList({
    //        dataSource: {
    //            severFiltering: true,
    //            transport: {
    //                read: {
    //                    dataType: "json",
    //                    url: MAA_API_Server + 'master/GetDDLBrand'
    //                }
    //            }
    //        },
    //        dataTextField: "brand",
    //        dataValueField: "brand",
    //        template: "<span data-id='${data.id}'>${data.brand}</span>",
    //        select: function (e) {
    //            var id = e.item.find("span").attr("data-id");
    //            var BrandItem = _gridBrand.dataItem($(e.sender.element).closest("tr"));
    //            BrandItem.brandid = id;
    //        }
    //    });

    var input = $('<input required id="brandid" name="brand">');
    input.appendTo(container);

    input.kendoDropDownList({
        dataTextField: "Value",
        dataValueField: "Value",
        dataSource: brandList,
        optionLabel: "Select Brand",
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
            numLoad -= 1;
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
        }
    });
}
    // #endregion

// #region GridChannel

function getChannelList(dmenum) {
    startSpinner('loading..', 1);

    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DME/GetDMEDetailMarket',
        data: 'dmenum=' + dmenum,
        success: function (msg) {
            channels = msg;
            bindGridChannel();
            numLoad -= 1;
          //  startSpinner('loading..', 0);
            

        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
            startSpinner('loading..', 0);

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
                        market: {
                            type: "string", validation: { required: true } },
                        idchannel: { editable: false, nullable: false, validation: { required: true } },
                        channel: {
                            type: "string", validation: { required: true }},
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
        noRecords: true
    }).data("kendoGrid");
}
function getmarket() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getMarket',
        success: function (msg) {
            marketList = JSON.parse(msg);
            //console.log('market: ' + marketList);
            numLoad -= 1;
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
        }
    });
}
function getchannel() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getChannel',
        success: function (msg) {
            channelList = JSON.parse(msg);
            //console.log('channel: ' + channelList);

            numLoad -= 1;
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
        }
    });
}
var channelListParam = [];
var inputChannel;
function marketDropDownEditor(container, options) {
    var input = $('<input required id="idmarket" name="market">');
    input.appendTo(container);

    input.kendoDropDownList({
        dataTextField: "Value",
        dataValueField: "Value",
        dataSource: marketList,
        optionLabel: "Select Market",
        template: "<span data-id='${data.Key}' data-param='${data.Param}'>${data.Value}</span>",
        select: function (e) {
            var id = e.item.find("span").attr("data-id");
            var param = e.item.find("span").attr("data-param");
            var channelItem = _gridChannel.dataItem($(e.sender.element).closest("tr"));
            channelItem.idmarket = id;
            //channelListParam = [];
            //for (var i = 0; i < channelList.length; i++) {
            //    if (channelList[i].Key === param) {
            //        var KeyChannel = channelList[i].Key;
            //        var ValueChannel = channelList[i].Value;

            //        channelListParam.push({
            //            Key: KeyChannel,
            //            Value: ValueChannel
            //        });
                   
            //    }
                
            //}

           
            
            //inputChannel.setDataSource(channelListParam);
            ////$("#grid").data("kendoGrid").setData(ds);
            ////inputChannel.setd(channelListParam);
            //inputChannel.refresh();
            inputChannel.enable(true);
            console.log(param);
        }
    }).appendTo(container);

}

function channelDropDownEditor(container, options) {

    inputChannel = $("<input required  id='idchannel' name='channel'  />")
        .attr("MaterialNumberID", "ddl_materialnum")
        .appendTo(container)
        .kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Value",
            dataSource: channelList,
            optionLabel: "Select Channel",
            template: "<span data-id='${data.Key}' >${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var channelItem = _gridChannel.dataItem($(e.sender.element).closest("tr"));
                channelItem.idchannel = id;
            },
            enable: false
        }).data("kendoDropDownList");

}

// #endregion


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

// #region action and save data
function btnSubmitClicked() {
    startSpinner('loading..', 1);

   validationPage();
    //SaveData();
   // console.log(uploadedFile);
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
    var Operation = $('#txtOperation').val();
    var Region = $('#txtRegion').val();
    var Market = $('#txtMarket').val();
    var AdvertisingType = $('#txtAdvertisingType').val();
    var Activity = $('#txtActivity').val();
    var JoinActivity = $('#txtJoinActivity').val();
    var MarketingProgramName = $('#txtMarketingProgramName').val();
    var Description = $('#txtDescription').val();
    var ActivityperiodFrom = $('#dtActivityperiodFrom').val();
    var ActivityperiodTo = $('#dtActivityperiodTo').val();
    var InvoiceSettlementDate = $('#dtInvoiceSettlementDate').val();
    var AmountRequest = removeCommas($('#txtAmountRequest').val());
    var txtPONumber = $('#txtPONumber').val();

    validationMessage = '';

    if (!Operation) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select Operation.' + '\n';
    }

    if (!Region) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select Region.' + '\n';
    }

    if (!Market) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select Market.' + '\n';
    }

    if (!AdvertisingType) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select Advertising Type.' + '\n';
    }
    if (!Activity) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select Activity.' + '\n';
    }
    if (!JoinActivity) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select Join Activity.' + '\n';
    }

    if (JoinActivity === '03' || JoinActivity==='02'){
        if (!txtPONumber) {
            tabMandatory(textTab1);
            validationMessage = validationMessage + 'Please fill PO Number.' + '\n';
        }
    }

    if (!MarketingProgramName) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select Marketing Program Name.' + '\n';
    }

    if (!Description) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please fill Description.' + '\n';
    }

    if (!ActivityperiodFrom || !ActivityperiodTo) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select Promotion Period.' + '\n';
    }
    if (!InvoiceSettlementDate) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select Invoice Settlement Date.' + '\n';
    }
    if (!AmountRequest) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please fill Amount Request.' + '\n';
    }

    if (uploadedFile === undefined || uploadedFile === null || uploadedFile.length < 1) {
        tabMandatory(textTab2);
        validationMessage = validationMessage + 'Attachment file is required.' + '\n';
    }

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
        totRequestBrand = totRequestBrand + (gridBrandRequest[y].request * 1) ;
    }

    if (unCommitted < 0) {
        tabMandatory(textTab2);
        validationMessage = validationMessage + " DME Budget is not sufficient, please check your DME Request Amount " + '\n';
    }

    if (AmountRequest) {
        if ((totRequest !== AmountRequest * 1) || (totRequestChannel !== AmountRequest * 1) || (totRequestBrand !== AmountRequest * 1)) {
            tabMandatory("Request Amount");
            validationMessage = validationMessage + " Please ensure DME Request Amount must same amount with Total Request Item, Request Amount by Channel and Request Amount by Brand " + '\n';
        }
    }


    if (validationMessage) {
        startSpinner('loading..', 0);

        validationForm(validationMessage);
    }
    else {
        SaveData();
    }

}

function SaveData() {
    //var datePeriodFrom = $("#dtActivityperiodFrom").val(); 
    //var datePartsPeriodFrom = datePeriodFrom.split("/");
    //var dateObjectPeriodFrom = new Date(+datePartsPeriodFrom[2], datePartsPeriodFrom[1] - 1, +datePartsPeriodFrom[0]); 

    //var datePeriodTo = $("#dtActivityperiodTo").val();
    //var datePartsPeriodTo = datePeriodTo.split("/");
    //var dateObjectPeriodTo = new Date(+datePartsPeriodTo[2], datePartsPeriodTo[1] - 1, +datePartsPeriodTo[0]); 

    //var dateSettle = $("#dtInvoiceSettlementDate").val();
    //var datePartsSettle = dateSettle.split("/");
    //var dateObjectSettle = new Date(+datePartsSettle[2], datePartsSettle[1] - 1, +datePartsSettle[0]); 
    var dmeNum = "";
    if (dmeNumberModel) {
        dmeNum = dmeNumberModel;
    } else {
        dmeNum = $("#txtDMEReqNumber").val();
    }
    replaceNullValue();
    var Save_DMERequestData = {
        DMERequestNumber: dmeNum,
        DMEReverseNumber: "",
        RequestType: "Submission",
        CreatedDate: new Date(dateServer).toJSON(),
        //CreatedBy: $('#txtRequestor').val(),
        //RequestorPINID: "",
        RequestorName: $("#txtRequestor").val(),
        Operation: $("#txtOperation").val(),
        Region: $("#txtRegion").val(),
        Market: $("#txtMarket").val(),
        Advertysingtype: $("#txtAdvertisingType").val(),
        Activity: $("#txtActivity").val(),
        //SamplingNumber: $("#txtPPASamplingNumber").val(),
        JoinActivity: $("#txtJoinActivity").val(),
        PONumber: $("#dmeNumberModel").val(),
        MarketingProgramName: $("#txtMarketingProgramName").val(),
        MarketingProgramDescription: $("#txtDescription").val(),
        InternalOrder: $("#txtInternalOrder").val(),
        ActivityPeriodFrom: returnDateFromDDMMYYYY($("#dtActivityperiodFrom").val()).toJSON(),
        ActivityPeriodTo: returnDateFromDDMMYYYY($("#dtActivityperiodTo").val()).toJSON(),
        InvoiceSettlementDate: returnDateFromDDMMYYYY($("#dtInvoiceSettlementDate").val()).toJSON(),
        AmountRequest: removeCommas($("#txtAmountRequest").val()),
        DocumentStatus: "Waiting Approval",
        ApprovalStatus: 4,
        BrandList: JSON.stringify(_gridBrand.dataSource.data().toJSON()),
        ChannelList: JSON.stringify(_gridChannel.dataSource.data().toJSON()),
        OperationList: JSON.stringify(_gridReq.dataSource.data().toJSON()),
        Attachment: uploadedFile,
        RequestorPositionID: $("#RequestorPositionID").val(),
        RequestorPosition: $("#RequestorPosition").val(),
        RequestorPINID: $("#RequestorPINID").val(),
        CreatedBy: $("#CreatedBy").val()
    };
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'DME/SaveDMERequestData',
        data: Save_DMERequestData,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {
            var msg = JSON.parse(response);
            if (msg.Message === "success") {
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
                    text: 'Your Request Number : ' + msg.Result
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

function saveAttachment() {
    $.ajax({
        type: "post",
        url: MAA_API_Server + 'DME/UploadFiles',
        contentType: false,
        processData: false,
        data: data,
        success: function (response) {
            if (response.message === "success") {
                startSpinner('loading..', 0);

                swal({
                    type: 'success',
                    title: 'Success',
                    text: 'Save Successfully'
                }).then(function () {
                    window.location = url_Web;
                });
            }
        },
        error: function (error) {
            startSpinner('loading..', 0);
            alert("there was error uploading files!");
        }
    });
}

function onAddNewRowBrand() {
    var grid = $("#gridBrandDetail").data("kendoGrid");
    grid.addRow();
}

function onAddNewRowChannel() {
    var grid = $("#gridChannel").data("kendoGrid");
    grid.addRow();
}

function onAddNewRowOperation() {
    var grid = $("#gridReq").data("kendoGrid");
    grid.addRow();
}

function onAmountRequestKeyUp() {
    document.getElementById('txtAmountRequest').value = addCommas($('#txtAmountRequest').val());
}

function btnDraftClicked() {
    startSpinner('loading..', 1);

   
    var reqAmt = $("#txtAmountRequest").val();
    if (!reqAmt) {
        reqAmt = 0;
    } else {
        reqAmt = removeCommas($("#txtAmountRequest").val());
    }

    if (dmeNumberModel) {
        dmeNum = dmeNumberModel;
    } else {
        dmeNum = $("#txtDMEReqNumber").val();
    }
    replaceNullValue();
    var Save_DMERequestData = {
        DMERequestNumber: dmeNum,
        DMEReverseNumber: "",
        RequestType: "Submission",
        CreatedDate: new Date(dateServer).toJSON(),
        CreatedBy: $('#CreatedBy').val(),
        RequestorPINID: $('#RequestorPINID').val(),
        RequestorName: $("#txtRequestor").val(),
        Operation: $("#txtOperation").val(),
        Region: $("#txtRegion").val(),
        Market: $("#txtMarket").val(),
        Advertysingtype: $("#txtAdvertisingType").val(),
        Activity: $("#txtActivity").val(),
        //SamplingNumber: $("#txtPPASamplingNumber").val(),
        JoinActivity: $("#txtJoinActivity").val(),
        PONumber: $("#txtPONumber").val(),
        MarketingProgramName: $("#txtMarketingProgramName").val(),
        MarketingProgramDescription: $("#txtDescription").val(),
        InternalOrder: $("#txtInternalOrder").val(),
        ActivityPeriodFrom: returnDateFromDDMMYYYY($("#dtActivityperiodFrom").val()).toJSON(),
        ActivityPeriodTo: returnDateFromDDMMYYYY($("#dtActivityperiodTo").val()).toJSON(),
        InvoiceSettlementDate: returnDateFromDDMMYYYY($("#dtInvoiceSettlementDate").val()).toJSON(),
        AmountRequest: reqAmt,
        DocumentStatus: "Created",
        ApprovalStatus: 0,
        BrandList: JSON.stringify(_gridBrand.dataSource.data().toJSON()),
        ChannelList: JSON.stringify(_gridChannel.dataSource.data().toJSON()),
        OperationList: JSON.stringify(_gridReq.dataSource.data().toJSON()),
        Attachment: uploadedFile,
        RequestorPositionID: $("#RequestorPositionID").val(),
        RequestorPosition: $("#RequestorPosition").val()
    };

    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'DME/SaveDMERequestData',
        data: Save_DMERequestData,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {
            var msg = JSON.parse(response);
            if (msg.Message === "success") {
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

                alert("fail");
            }


        },
        error: function (response) {
            startSpinner('loading..', 0);

            alert("fail");
        }
    });
}

function btnTopUpClicked() {
    window.location = url_Web + "BudgetTopUp?dmenum=" + dmeNumberModel;
}

function btnReverseClicked() {
    var urlRev = "";
    if (DMEReverseNumberModel) {
        urlRev = "id=" + DMEReverseNumberModel;
    }
    else {
        urlRev = "dmenum=" + dmeNumberModel;
    }
    window.location = url_Web + "DMEReverse?" + urlRev;
}

function ontxtJoinActivityChanged() {
    if ($('#txtJoinActivity').val() !== null && ($('#txtJoinActivity').val() === "03" || $('#txtJoinActivity').val() === "02")) {
        $("#txtPONumber").removeAttr("disabled");
    } else {
        $("#txtPONumber").attr("disabled", "disabled");
        $("#txtPONumber").val("");
    }
}

function ontxtAdvertisingTypeChanged() {
   // startSpinner('loading..', 1);
    if ($('#txtAdvertisingType').val()) {
        if (ApprovalStatusModel === "0") {
            $('#txtActivity').removeAttr('disabled');
        }
        else if (!DocumentStatusModel) {
            $('#txtActivity').removeAttr('disabled');

        }
        bindActivityList();
    }
}

function ontxtRegionChanged() {
    //startSpinner('loading..', 1);
    if ($('#txtRegion').val()) {
        if (ApprovalStatusModel === "0") {
            $('#txtOperation').removeAttr('disabled');
        }
        else if (!DocumentStatusModel) {
            $('#txtOperation').removeAttr('disabled');

        }
        bindOperationList();
    }
}

function btnManual_Clicked() {
    startSpinner('loading..', 1);
    var settlementdate = $("#dtInvoiceSettlementDate").val();
    var textTab1 = $('#tab1').text();
    validationMessage = '';

    if (!settlementdate) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select Settlement Date.' + '\n';
    }

    if (validationMessage) {
        startSpinner('loading..', 0);

        validationForm(validationMessage);
    }
    else {
        $.ajax({
            type: "POST",
            url: MAA_API_Server + 'DME/Updatesettlementdate?settlementdate=' + settlementdate + '&&requestnumber=' + dmeNumberModel,
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

  

}

//fleming
//#region menambahkan fungsi button update document -> approve, reject
function btnApproveClicked() {
    startSpinner('loading..', 1);
    var internalorder = $("#txtInternalOrder").val();
    var joinActivity = $("#txtJoinActivity").val();
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'DME/UpdateDMEStatus?requestnumber=' + dmeNumberModel 
            + '&&documentstatus=' + DocumentStatusModel + '&&updateddocumentstatus=IO in Progress' + '&&internalorder=""&&approvalStatus=1&&joinActivity=' + joinActivity,
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
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'DME/UpdateDMEStatus?requestnumber=' + dmeNumberModel
            + '&&documentstatus=' + DocumentStatusModel + '&&updateddocumentstatus=""' + '&&internalorder=""&&approvalStatus=2',
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

function updateStatus(docStatus) {
    startSpinner('loading..', 1);
    var internalorder = $("#txtInternalOrder").val();
    var joinActivity = $("#txtJoinActivity").val();
    var textTab1 = $('#tab1').text();
    validationMessage = '';
    if (!internalorder) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please fill Internal Order.' + '\n';
    }
    if (validationMessage) {
        startSpinner('loading..', 0);

        validationForm(validationMessage);
    }
    else {
        $.ajax({
            type: "POST",
            url: MAA_API_Server + 'DME/UpdateDMEStatus?requestnumber=' + dmeNumberModel
                + '&&documentstatus=' + DocumentStatusModel + '&&updateddocumentstatus=' + docStatus + '&&internalorder=' + internalorder + '&&approvalStatus=1&&joinActivity=' + joinActivity,
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
   
}

// #endregion