var numLoad = 0;
var loadInterval = setInterval(checkCallback, 2000);

function checkCallback() {
    if (numLoad <= 0) {
        window.clearInterval(loadInterval);
        startSpinner('loading..', 0);
    }
}

$(document).ready(function () {
    startSpinner('loading..', 1);
    initTabStrip();

    var statusDoc = "DRAFT";
    $('#statusDoc').html(statusDoc);
   // getbrand();
    if (dmeNumberModel) {        
        bindDataByModel();
        disabledField();
        document.getElementById("txtDMERealization").disabled = true;
        document.getElementById("txtInternalOrder").value = internalOrderModel;
        document.getElementById("txtPONumber").value = PONumberModel;
        document.getElementById("txtDescription").value = MarketingProgramDescriptionModel;

        bindGridAttachment(attachments);
    }
    else {
        numLoad = 1;
        disabledField();
        loadRequestNumber();
    }

});

var validationMessage = '';
var _gridBrand;
var _gridChannel;
var _gridReq;

var actPeriodFrom = "";
var actPeriodTo = "";
var invSettlementDate = "";
var globalAmountReq = 0;
var stateProcess = 0;

var partialDocNum = "";
var products = [];
var channels = [];
var brands = [];
var marketList = [];
var channelList = [];
var brandList = [];
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

var pageSettingGridOperation = {
    info: false,
    refresh: false,
    pageSizes: false,
    previousNext: false,
    numeric: false
};

var columnGridBrand = [
    { field: "brand", title: "Brand", width: "130px", aggregates: ["count"], editor: brandDropDownEditor, template: "#=brand#", footerTemplate: "<div align=center>Total</div>" },
    { field: "request", title: "Request", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { command: ["edit", "destroy"], title: "&nbsp;", width: "120px" }
];

var columnGridMarket = [
    { field: "market", title: "Market Name", width: "130px", editor: marketDropDownEditor,  template: "#=market#" },
    { field: "channel", title: "Channel", width: "130px", editor: channelDropDownEditor, template: "#=channel#", aggregates: ["count"], footerTemplate: "<div align=center>Total</div>" },
    { field: "request", title: "Request", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { command: ["edit", "destroy"], title: "&nbsp;", width: "120px" }
];

var columnGridOperation = [
    { field: "operationDesc", title: "Operation", width: "130px", editor: operationDropDownEditor, template: "#=operationDesc#", aggregates: ["count"], footerTemplate: "<div align=center>Total</div>" },
    { field: "originalBudget", title: "Original Budget", format: "{0:#,0}", attributes: { class: "text-right " }, width: "130px", aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { field: "adjustment", title: "Adjustment", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { field: "adjBudgetBalance", title: "Adj. Budget Balance", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { field: "ytdDme", title: "YTD DME", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { field: "totalRequest", title: "Total Request", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { field: "samplingAmount", title: "Sampling Amount", width: "130px", format: "{0:#,0}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n0\") #</div>" },
    { command: ["edit", "destroy"], title: "&nbsp;", width: "120px" }

];

function loadRequestNumber() {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DMEReverse/GetListData',
        success: function (result) {
           
           // $("#txtDMEReqNumber").append('<option value="" selected disabled>Please select</option>');
            for (var i = 0; i < result.length; i++) {
                $("#txtDMEReqNumber").append('<option value="' + result[i].dmeNumber + '">' + result[i].dmeNumber + '</option>');
            }
            var dmenumval = getUrlVars()["dmenum"];
            if (dmenumval) {
                $("#txtDMEReqNumber option[value='" + dmenumval + "']").attr("selected", "selected"); 
                document.getElementById("txtDMEReqNumber").disabled = true;
                $('#txtDMEReqNumber').attr('disabled', 'disabled');
                loadDMEData();
            }
            $('#txtDMEReqNumber').selectpicker('refresh');
            $('#txtDMEReqNumber').selectpicker('render');
            numLoad -= 1;
        },
        error: function (data) {           
            alert('Something Went Wrong');
            numLoad -= 1;
        }
    });
}

function loadRequestDetail(reqNumber) {

    startSpinner('loading..', 1);
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DMEReverse/GetDMEDataByRequestNumber',
        data: 'requestNumber=' + reqNumber,
        success: function (result) {
            numLoad = 11;
            loadInterval = setInterval(checkCallback, 2000);
            console.log(result);          
            bindDataByRequestNumber(result);                              
        }, 
        error: function (data) {
            alert('Something Went Wrong');
            //numLoad -= 1;

        }
    });
}

function bindDataByModel() {
    if (DocumentStatusModel !== "0") {
        $('#divAttachment').hide();
        $('#divBtnSubmit').hide();

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
        document.getElementById("txtReverseRequestNumber").disabled = true;
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
        bindSampling(dmeNumberModel);

        //$('#lblDocStatus').html("Submitted");
        document.getElementById("txtInternalOrder").disabled = false;
    }
   
    if (DocumentStatusModel === "Waiting Approval") {
        $('#lblDocStatus').html("Waiting Approval");    
        $('#lblApprovalStatus').html("In Process");
        $('#divBtnApprove').show();
    }
    if (ApprovalStatusModel === "1") {
       // $('#lblDocStatus').html("Completed");
        $('#lblApprovalStatus').html("Completed");
    }
    
    document.getElementById('txtReverseRequestNumber').value = dmeNumberModel;//dmeNumDisplayModel;//'REV/' + revNum + 'XXXX';       
    document.getElementById('txtRequestor').value = requestorNameModel;
    document.getElementById('txtCreatedDate').value = createdDateModel;

    if (amountReqModel <= 0) {
        if (amountReqModel !== 0) {
            document.getElementById('txtAmountReverse').value = addCommas(amountReqModel);
            document.getElementById('txtAmountReverse').value = "-" + $('#txtAmountReverse').val();
        }
        else {
            document.getElementById('txtAmountReverse').value = amountReqModel;
        }
      
    }
    else {
        document.getElementById('txtAmountReverse').value = addCommas(amountReqModel);
    }    
    
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
    numLoad = 11;
    loadInterval = setInterval(checkCallback, 2000);
    getReqNumber(dmeNumberModel);
  
    bindOperationList(OperationModel);
    bindRegionList(RegionModel);
    bindMarketList(MarketModel);
    bindAdvertisingTypeList(AdvertysingtypeModel);
    bindActivityList(ActivityModel);
    bindJoinActivityList(JoinActivityModel);
    bindMarketingProgramNameList(MarketingProgramNameModel);
}

function bindDataByRequestNumber(result) {

    //$('#lblDocStatus').html("Draft");

    var amtReq = String(result.amountRequest);  
    var reqNumberDME = $("#txtDMEReqNumber").val();
    var remainingBalance = String(result.remainingBalanceAmount);

    actPeriodFrom = result.activityPeriodFrom;
    actPeriodTo = result.activityPeriodTo;
    invSettlementDate = result.invoiceSettlementDate;
    
    document.getElementById('txtRequestor').value = result.requestorName;   
    document.getElementById('txtPONumber').value = result.poNumber;    
    document.getElementById('txtCreatedDate').value = formateDate(dateServer);
    document.getElementById('txtDescription').value = result.marketingProgramDescription;
    document.getElementById('txtInternalOrder').value = result.internalOrder;    

    if (amtReq < 0) {
        document.getElementById('txtAmountRequest').value = '-' + addCommas(amtReq);

    }
    else {
        document.getElementById('txtAmountRequest').value = addCommas(amtReq);   

    }
    document.getElementById('dtActivityperiodFrom').value = formateDate(result.activityPeriodFrom);    
    document.getElementById('dtActivityperiodTo').value = formateDate(result.activityPeriodTo);  
    document.getElementById('dtInvoiceSettlementDate').value = formateDate(result.invoiceSettlementDate);   

    //if (result.realizationAmount) {
        if (result.realizationAmount !== 0) {
            document.getElementById('txtDMERealization').value = addCommas(result.realizationAmount.toString());
        } else {
            document.getElementById('txtDMERealization').value = result.realizationAmount;

        }
        if (result.realizationAmount > 0) {
            $('#txtDMERealization').attr('disabled', 'disabled');
        }
    //}

    //if (result.remainingBalanceAmount) {
        if (result.remainingBalanceAmount !== 0) {
            document.getElementById('txtAmountReverse').value = addCommas(result.remainingBalanceAmount.toString());
        } else {
            document.getElementById('txtAmountReverse').value = result.remainingBalanceAmount;
            alert("DME Realization is not found for this request");
        }
    //}

    getBrandList(reqNumberDME, 'reverse');
    getChannelList(reqNumberDME, 'reverse');
    getOperationList(reqNumberDME, 'reverse');
   // getAmountRequestByReqNumber(result.dmeNumber);
  //  getAttachments(reqNumberDME);
  
    bindSampling(reqNumberDME);
    bindOperationList(result.operation);
    bindRegionList(result.region);
    bindMarketList(result.market);
    bindAdvertisingTypeList(result.advertysingtype);
    bindActivityList(result.activity);
    bindJoinActivityList(result.joinActivity);
    bindMarketingProgramNameList(result.marketingProgramName);
    countRequest();
}
var baseDMENumber = "";
function getReqNumber(revNum) {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DMEReverse/GetDMENumberByReverseNumber',
        data: 'reverseRequestNumber=' + revNum,
        success: function (msg) {    
            
            baseDMENumber = msg.dmeRequestNumber;
            $("#txtDMEReqNumber").empty();            
            $("#txtDMEReqNumber").append('<option value="' + baseDMENumber + '">' + baseDMENumber + '</option>');
            $('#txtDMEReqNumber').selectpicker('refresh');
            $('#txtDMEReqNumber').selectpicker('render');
           
            $('#txtDMEReqNumber').attr('disabled', 'disabled');
            var amReq = String(msg.amountRequest);
            var resAmt = $('#txtAmountReverse').val();
            resAmt = removeCommas(resAmt);
            if (amReq !== 0) {
                if (amReq < 0) {
                    document.getElementById('txtAmountRequest').value = '-' + addCommas(amReq);

                }
                else {
                    document.getElementById('txtAmountRequest').value = addCommas(amReq);

                }
            } else {
                document.getElementById('txtAmountRequest').value = amReq;

            }
            var realAmt = (msg.amountRequest * 1) + (resAmt * 1);
            if (!msg.ytdmaaRealization) {
                if (realAmt !== 0) {
                    document.getElementById('txtDMERealization').value = addCommas(realAmt.toString());

                } else {
                    document.getElementById('txtDMERealization').value = realAmt;

                }
            } else {
                document.getElementById('txtDMERealization').value = addCommas(msg.ytdmaaRealization.toString());
            }
            

            if (msg.documentStatus === "Reversal In Progrees") {
                $('#divBtnCompleted').show();
            }

            getBrandList(revNum);
            getChannelList(revNum);
            getOperationList(revNum);
        },
        error: function (data) {
            alert('Something Went Wrong');
            //numLoad -= 1;
        }
    });
}

function getAmountRequestByReqNumber(dmenum) {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DMEReverse/GetAmountRequestByReqNumber',
        data: 'requestNumber=' + dmenum,
        success: function (msg) {
            if (msg === undefined || msg === null) {
                document.getElementById('txtAmountRequest').value = "-";
            }
            else {
                var amtReq = String(msg.DMERemainingBalance);
                if (msg.DMERemainingBalance !== 0) {
                    //document.getElementById('txtAmountRequest').value = addCommas(amtReq);
                    if (amtReq < 0) {
                        document.getElementById('txtAmountRequest').value = '-' + addCommas(amtReq);

                    }
                    else {
                        document.getElementById('txtAmountRequest').value = addCommas(amtReq);

                    }

                }
                else {
                    document.getElementById('txtAmountRequest').value = amtReq;

                }
            }
        },
        error: function (data) {
            alert('Something Went Wrong');
            //numLoad -= 1;
        }
    });

}

function getBrandList(dmenum, page) {

    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DME/GetDMEDetailBrand',
        data: 'dmenum=' + dmenum + '&page=' + page,
        success: function (msg) {
            brands = msg;
            bindGridBrand();
            numLoad -= 1;
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });
}

function getChannelList(dmenum, page) {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DME/GetDMEDetailMarket',
        data: 'dmenum=' + dmenum + '&page=' + page,
        success: function (msg) {
            channels = msg;
            bindGridChannel();
            numLoad -= 1;

        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });
}

function getOperationList(dmenum, page) {

    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DME/GetDMEDetailOperation',
        data: 'dmenum=' + dmenum + '&page=' + page,
        success: function (msg) {

            products = msg;
            bindGridOperation();
            unCommiteCalc();
            numLoad -= 1;
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });

}

function getAttachments(dmenum) {
    console.log(dmenum);
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DMEReverse/GetAttachmentByRequestNumber',
        data: 'dmeRequestNumber=' + dmenum,
        success: function (msg) {            
            var attachmentFiles = msg[0].attachment;
            bindGridAttachment(attachmentFiles);
            numLoad -= 1;
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
        }
    });
}

function bindOperationList(operationKey) {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getOperation',
        success: function (msg) {
            $("#txtOperation").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);

            for (var i = 0; i < data.length; i++) {
                $("#txtOperation").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
            var operationNameKey = "";
            for (var j = 0; j < data.length; j++) {
                if (data[j].Key === operationKey) {
                    operationNameKey = data[j].Key;
                    break;
                }
            }      
            $("#txtOperation option[value='" + operationNameKey + "']").attr("selected", "selected");

        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });
}

function bindRegionList(regionKey) {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getRegion',
        success: function (msg) {
            $("#txtRegion").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);
            for (var i = 0; i < data.length; i++) {
                $("#txtRegion").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
            var regionNameKey = "";
            for (var j = 0; j < data.length; j++) {
                if (data[j].Key === regionKey) {
                    regionNameKey = data[j].Key;
                    break;
                }
            }      
            $("#txtRegion option[value='" + regionNameKey + "']").attr("selected", "selected");

        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
        }
    });
}

function bindMarketList(marketKey) {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getMarket',
        success: function (msg) {
            $("#txtMarket").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);

            for (var i = 0; i < data.length; i++) {
                $("#txtMarket").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
            var marketNameKey = "";
            for (var j = 0; j < data.length; j++) {
                if (data[j].Key === marketKey) {
                    marketNameKey = data[j].Key;
                    break;
                }
            }          
            $("#txtMarket option[value='" + marketNameKey + "']").attr("selected", "selected");

        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });

}

function bindAdvertisingTypeList(advName) {
    console.log(advName);
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getAdverstisingType',
        success: function (msg) {
            $("#txtAdvertisingType").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);

            for (var i = 0; i < data.length; i++) {
                $("#txtAdvertisingType").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');               
            }

            var advNameKey = "";
            for (var j = 0; j < data.length; j++) {             
                if (data[j].Key === advName) {                   
                    advNameKey = data[j].Key;                                                    
                    break;
                }
            }          
                                 
            $("#txtAdvertisingType option[value='" + advNameKey + "']").attr("selected", "selected");

            numLoad -= 1;
           
            //enableAddNewReq();

            //if (ActivityModel) {
            //    ontxtAdvertisingTypeChanged();
            //}

        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });
}

function bindActivityList(activityKey) {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getActivity',
        data: { param: $('#txtAdvertisingType').val() },
        success: function (msg) {
            $("#txtActivity").empty();
            $("#txtActivity").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);
            for (var i = 0; i < data.length; i++) {
                $("#txtActivity").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
            var activityNameKey = "";
            for (var j = 0; j < data.length; j++) {
                if (data[j].Key === activityKey) {
                    activityNameKey = data[j].Key;
                    break;
                }
            }     
            $("#txtActivity option[value='" + activityNameKey + "']").attr("selected", "selected");
            //enableAddNewReq();
            //startSpinner('loading..', 0);
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;
          //  startSpinner('loading..', 0);


        }
    });
}

function bindJoinActivityList(joinActKey) {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getJoinActivity',
        success: function (msg) {
            $("#txtJoinActivity").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);
            for (var i = 0; i < data.length; i++) {
                $("#txtJoinActivity").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
            var joinActNameKey = "";
            for (var j = 0; j < data.length; j++) {
                if (data[j].Key === joinActKey) {
                    joinActNameKey = data[j].Key;
                    break;
                }
            }     
            $("#txtJoinActivity option[value='" + joinActNameKey + "']").attr("selected", "selected");

        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });
}

function bindMarketingProgramNameList(markProgKey) {
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'masterData/getMarketingProgram',
        success: function (msg) {
            $("#txtMarketingProgramName").append('<option value="" selected disabled>Please select</option>');
            var data = JSON.parse(msg);
            for (var i = 0; i < data.length; i++) {
                $("#txtMarketingProgramName").append('<option value="' + data[i].Key + '">' + data[i].Value + '</option>');
            }
            numLoad -= 1;
            var markProgNameKey = "";
            for (var j = 0; j < data.length; j++) {
                if (data[j].Key === markProgKey) {
                    markProgNameKey = data[j].Key;
                    break;
                }
            }    
            $("#txtMarketingProgramName option[value='" + markProgNameKey + "']").attr("selected", "selected");

        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

        }
    });
}

function bindSampling(dmenum) {
    
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'SamplingDirect/GetSamplingRequestDataByDMENumber',
        data: 'dmenumber=' + dmenum,
        success: function (msg) {

            $('#divSamplingNumber').show();
            for (var i = 0; i < msg.length; i++) {
                //samplingNumber
                samplingNumber = msg[i].samplingNumber;
                var url = url_Web + 'samplingdirect?id=' + samplingNumber;
                $("#divContainerSampling").append("<p><a href=" + url + " class='i - link linkDoc'>" + samplingNumber + "</a></p>");
            }
            numLoad -= 1;
        },
        error: function (data) {
            alert('Something Went Wrong');
            numLoad -= 1;

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
                        request: { type: "number", validation: { required: false, defaultValue: 0 } }

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
        edit: function (e) {
            var dropDown = e.container.find("[data-role='dropdownlist']").data("kendoDropDownList");
            dropDown.readonly();
        },
        cancel: function (e) {
            $('#gridBrandDetail').data('kendoGrid').dataSource.cancelChanges();
        },
        noRecords: true
    }).data("kendoGrid");
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
                        request: { type: "number", validation: { required: false, defaultValue: 0 } }

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
                        totalRequest: { type: "number", validation: { required: false, defaultValue: 0 } },
                        samplingAmount: {
                            type: "number", defaultValue: 0, validation: { required: false }
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

function editNumber(container, options) {
    $('<input required data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            spinners: false
        });
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

function brandDropDownEditor(container, options) {
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
                            activity: $('#txtActivity').val(),
                            advertisingtype: $('#txtAdvertisingType').val(),
                            budgetyear: $('#dtActivityperiodTo').val()
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

            console.log(error);

            alert("there was error uploading files!");
        }
    });
}

function disabledField() {
    
    document.getElementById("txtReverseRequestNumber").disabled = true;
    document.getElementById("txtCreatedDate").disabled = true;    
    document.getElementById("txtRequestor").disabled = true;
    //document.getElementById("txtOperation").disabled = true;
    //document.getElementById("txtRegion").disabled = true;
    //document.getElementById("txtMarket").disabled = true;
    //document.getElementById("txtAdvertisingType").disabled = true;
    //document.getElementById("txtActivity").disabled = true;    
    //document.getElementById("txtJoinActivity").disabled = true;
    //document.getElementById("txtPONumber").disabled = true;
    //document.getElementById("txtMarketingProgramName").disabled = true;
    //document.getElementById("txtDescription").disabled = true;
    //document.getElementById("txtPPASamplingNumber").disabled = true;
    document.getElementById("txtInternalOrder").disabled = true;
    //document.getElementById("dtActivityperiodFrom").disabled = true;
    //document.getElementById("dtActivityperiodTo").disabled = true;
    //document.getElementById("dtInvoiceSettlementDate").disabled = true;
    document.getElementById("txtAmountRequest").disabled = true;
    document.getElementById("txtAmountReverse").disabled = true;
    document.getElementById("txtDMERealization").disabled = true;
   
    
    $('#divFromActivityPeriodTo, #dtActivityperiodFrom, #dtInvoiceSettlementDate').datepicker('remove');
    
}

function onDMERealizationKeyUp() {
    document.getElementById('txtDMERealization').value = addCommas($('#txtDMERealization').val());
    countRequest();
}

function countRequest() {
       
    var amtRequest = removeCommas($('#txtAmountRequest').val());
    var amtRealization = removeCommas($('#txtDMERealization').val());

    if (amtRequest === "") {
        amtRequest = 0;
    }

    if (amtRealization === "") {
        amtRealization = 0;
    }

    var amtReverse = parseFloat(amtRealization) - parseFloat(amtRequest) ;    
    var strAmtReverse = String(amtReverse);
    
    globalAmountReq = strAmtReverse;

    if (amtReverse < 0) {
        document.getElementById('txtAmountReverse').value = addCommas(strAmtReverse);
        document.getElementById('txtAmountReverse').value = "-" + $('#txtAmountReverse').val();
    }
    else {
        document.getElementById('txtAmountReverse').value = addCommas(strAmtReverse);
    }

    operationCalc();
}

function operationCalc() {
   
    if (products !== undefined) {
        for (var i = 0; i < products.length; i++) {
            var propReq = products[i].totalRequestPercent * globalAmountReq / 100; 
            propReq = (Math.ceil(propReq * 20) / 20).toFixed(0);
            products[i].totalRequest = propReq * 1;
            var propSampling = products[i].totalSamplingPercent * globalAmountReq / 100; 
            propSampling = (Math.ceil(propSampling * 20) / 20).toFixed(0);
            products[i].samplingAmount = propSampling * 1;
        }
        bindGridOperation();
    }

    if (channels !== undefined) {
        for (var j = 0; j < channels.length; j++) {
            var channelReq = channels[j].totalRequestPercent * globalAmountReq / 100;
            channelReq = (Math.ceil(channelReq * 20) / 20).toFixed(0);
            channels[j].request = channelReq * 1;
        }
       
        bindGridChannel();
    }

    if (brands !== undefined) {
        for (var z = 0; z < brands.length; z++) {
            var brandReq = brands[z].totalRequestPercent * globalAmountReq / 100;
            brandReq = (Math.ceil(brandReq * 20) / 20).toFixed(0);
            brands[z].request = brandReq * 1;
        }
        console.log('brandCalc ' + brands);
        bindGridBrand();
    }
}

function loadReversalDetail() {

}

//function btnSaveDraft() {
//    stateProcess = 1;
//    validationPage(stateProcess);
//}

function btnSubmitClicked() {  
    stateprocess = 1;
    validationPage(stateprocess);     
}
var docstatus = "";
function btnApprove() {
    stateProcess = 3;
    validationPage(stateProcess);
}

function btnCompleted() {
    stateProcess = 4;
    validationPage(stateProcess);
}

function tabMandatory(textTab) {
    if (!validationMessage.includes(textTab)) {
        if (validationMessage) {
            validationMessage = validationMessage + '<br/>';
        }
        validationMessage = validationMessage + '<font size="3"><b>Please Review ' + textTab + ':</b></font> <br/>';
    }
}

function validationPage(state) {
    var textTab1 = $('#tab1').text();
    var textTab2 = $('#tab2').text();
    var textTab3 = $('#tab3').text();

    var DMEReqNumber = $('#txtDMEReqNumber').val();
    var RealizationAmount = removeCommas($('#txtDMERealization').val());
    var TopUpAmount = removeCommas($('#txtAmountReverse').val());
   

    validationMessage = '';
    
    if (!DMEReqNumber) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select DME Request Number.' + '\n';
    }
    if (!RealizationAmount) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please fill DME Realization.' + '\n';
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
            validationMessage = validationMessage + " DME Budget is not sufficient, please check your Reverse Amount " + '\n';
        }

        if (TopUpAmount) {
            if ((totRequest !== TopUpAmount * 1) || (totRequestChannel !== TopUpAmount * 1) || (totRequestBrand !== TopUpAmount * 1)) {
                tabMandatory("Request Amount");
                validationMessage = validationMessage + " Please ensure Reverse Amount must same amount with Total Request Item, Request Amount by Channel and Request Amount by Brand " + '\n';
            }
        }
    }

    if (state === 1) {
        if (uploadedFile === undefined || uploadedFile === null || uploadedFile.length < 1) {
            tabMandatory(textTab2);
            validationMessage = validationMessage + 'Attachment file is required.' + '\n';
        }
    }

    if (validationMessage) {
        validationForm(validationMessage);
    }
    else {
     
        if (state === 1) {
            processSubmit();         
        }
        //if (state === 3) {
        //    docstatus = "Reversal In Progrees";

        //    processApprove();
        //}
        if (state === 3) {
            docstatus = "Reversal Done";

            processApprove();
        }
    }
}

//function updateReqNumber() {
           
//    var reverseNumber = dmeNumberModel;//$("#txtReverseRequestNumber").val();
//    $.ajax({
//        type: "GET",
//        url: MAA_API_Server + 'DMEReverse/UpdateRequestNumberReverse',
//        data: 'reverseRequestNumber=' + reverseNumber,
//        beforeSend: function () {
//            //loading icon...
//        },
//        success: function (response) {
//            successPrompt();
//            window.location = url_Web;
//        },
//        error: function (response) {
//            alert("fail");
//        }
//    });
//}

function processSubmit() {
    var date = new Date();
    var DMEData = {

        DMERequestNumber: $("#txtDMEReqNumber").val(),
        DMEReverseNumber: $("#txtReverseRequestNumber").val(),
        RequestType: "Reversal",
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
        PONumber: $("#txtPONumber").val(),
        MarketingProgramName: $("#txtMarketingProgramName").val(),
        MarketingProgramDescription: $("#txtDescription").val(),
        InternalOrder: $("#txtInternalOrder").val(),
        ActivityPeriodFrom: actPeriodFrom,
        ActivityPeriodTo: actPeriodTo, 
        InvoiceSettlementDate: invSettlementDate, 
        AmountRequest: globalAmountReq,//removeCommas($("#txtAmountReverse").val()),
        DocumentStatus: "Waiting Approval",
        ApprovalStatus: 4,
        BrandList: JSON.stringify(_gridBrand.dataSource.data().toJSON()),
        ChannelList: JSON.stringify(_gridChannel.dataSource.data().toJSON()),
        OperationList: JSON.stringify(_gridReq.dataSource.data().toJSON()),
        ModifiedDate: date.toJSON(),
        Attachment: uploadedFile,
        RequestorPositionID: $("#RequestorPositionID").val(),
        RequestorPosition: $("#RequestorPosition").val(),
        RequestorPINID: $("#RequestorPINID").val(),
        CreatedBy: $("#CreatedBy").val()
    };     
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'DMEReverse/SaveReverseRequest',
        data: DMEData,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {          
            //successPrompt();
            //window.location = url_Web;
            startSpinner('loading..', 0);
            swal({
                type: 'success',
                title: 'Success',
                text: 'Your Request Number : ' + response.result
            }).then(function () {
                window.location = url_Web;
            });
        },
        error: function (response) {
            alert("fail");
        }
    });
}
  
//function processSubmit() {
    
//    var reverseNumber = $("#txtReverseRequestNumber").val();    
//    $.ajax({
//        type: "GET",
//        url: MAA_API_Server + 'DMEReverse/SubmitReverseRequest',
//        data: 'reverseRequestNumber=' + reverseNumber,
//        beforeSend: function () {
//            //loading icon...
//        },
//        success: function (response) {
//            successPrompt();           
//            window.location = url_Web;
//        },
//        error: function (response) {
//            alert("fail");
//        }
//    });
//}

function processApprove() {
    
    var revNumberApp = dmeNumberModel;
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'DMEReverse/ApproveReverseRequest',
        data: 'reverseRequestNumber=' + revNumberApp + '&docstatus=' + docstatus,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {
            startSpinner('loading..', 0);
            swal({
                type: 'success',
                title: 'Success',
                text: 'Save Successfully'
            }).then(function () {
                window.location = url_Web;
            });
        },
        error: function (response) {
            alert("fail");
        }
    });
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


$('#txtDMEReqNumber').on("change", function (e) {
    loadDMEData();
}); 

function loadDMEData() {
    var reqNumber = $("#txtDMEReqNumber").val();
    var revNumber = reqNumber.substring(4, 20);
    //partialDocNum = 'REV/' + revNumber;
    document.getElementById('txtReverseRequestNumber').value = 'REV/' + revNumber;
    loadRequestDetail(reqNumber);
}

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

$("#gridReq").kendoGrid({
    dataSource: {
        data: '',//products,
        schema: {
            model: {
                fields: {
                    Operation: { type: "string" },
                    OriginalBudget: { type: "number" },
                    Adjustment: { type: "number" },
                    AdjBudgetBalance: { type: "number" },
                    YTDDME: { type: "number" },
                    TotalRequest: { type: "number" },
                    SamplingAmount: { type: "string" }
                }
            }
        },
        pageSize: 20,
        aggregate: [{ field: "OriginalBudget", aggregate: "count" },
        { field: "OriginalBudget", aggregate: "sum" },
        { field: "Adjustment", aggregate: "sum" },
        { field: "AdjBudgetBalance", aggregate: "sum" },
        { field: "YTDDME", aggregate: "sum" },
        { field: "TotalRequest", aggregate: "sum" }
        ]
    },
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
        { field: "Operation", title: "Operation", width: "130px", aggregates: ["count"], footerTemplate: "<div align=center>Total</div>" },
        { field: "OriginalBudget", title: "Original Budget", format: "{0:#,0.00}", attributes: { class: "text-right" }, width: "130px", aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n2\") #</div>" },
        { field: "Adjustment", title: "Adjustment", width: "130px", format: "{0:#,0.00}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n2\") #</div>" },
        { field: "AdjBudgetBalance", title: "Adj. Budget Balance", width: "130px", format: "{0:#,0.00}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n2\") #</div>" },
        { field: "YTDDME", title: "YTD DME", width: "130px", format: "{0:#,0.00}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n2\") #</div>" },
        { field: "TotalRequest", title: "Total Request", width: "130px", format: "{0:#,0.00}", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>#= kendo.toString(sum, \"n2\") #</div>" },
        { field: "SamplingAmount", title: "Sampling Amount", width: "130px" }

    ]
});

$("#gridChannel").kendoGrid({
    dataSource: {
        data: '',//channels,
        schema: {
            model: {
                fields: {
                    MarketName: { type: "string" },
                    Channel: { type: "string" },
                    Request: { type: "number" }

                }
            }
        },
        pageSize: 20,
        aggregate: [{ field: "Channel", aggregate: "count" },
        { field: "Request", aggregate: "sum" }
        ]
    },
   // height: 150,
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
        { field: "MarketName", title: "Market Name", width: "130px" },
        { field: "Channel", title: "Channel", width: "130px", aggregates: ["count"], footerTemplate: "<div align=center>Total</div>" },
        { field: "Request", title: "Request", width: "130px", format: "({0:#,0.00})", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>(#= kendo.toString(sum, \"n2\") #)</div>" }
    ]
});

$("#gridBrandDetail").kendoGrid({
    dataSource: {
        data: '',//brands,
        schema: {
            model: {
                fields: {
                    Brand: { type: "string" },
                    Request: { type: "number" }

                }
            }
        },
        pageSize: 20,
        aggregate: [{ field: "Brand", aggregate: "count" },
        { field: "Request", aggregate: "sum" }
        ]
    },
   // height: 150,
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
        { field: "Brand", title: "Brand", width: "130px", aggregates: ["count"], footerTemplate: "<div align=center>Total</div>" },
        { field: "Request", title: "Request", width: "130px", format: "({0:#,0.00})", attributes: { class: "text-right" }, aggregates: ["sum"], footerTemplate: "<div align=right>(#= kendo.toString(sum, \"n2\") #)</div>" }
    ]
});

$("#gridApproval1").kendoGrid({
    dataSource: {
        data:'' ,//approval1s,
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
    //height: 150,
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
        { field: "Approval2", title: "Approval 2 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval3", title: "Approval 3 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval4", title: "Approval 4 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval5", title: "Approval 5 ", attributes: { class: "text-center" }, width: "130px", encoded: false }
    ]
});

$("#gridApproval2").kendoGrid({
    dataSource: {
        data: '',//approval2s,
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
   // height: 150,
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
        { field: "Approval1", title: "Approval 6 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval2", title: "Approval 7 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval3", title: "Approval 8 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval4", title: "Approval 9 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval5", title: "Approval 10 ", attributes: { class: "text-center" }, width: "130px", encoded: false }
    ]
});


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


