var numLoad = 8;
$(document).ready(function () {
    startSpinner('loading..', 1); 
    // initTabStrip();
    initTabStrip();
    $('#txtPeriodFrom').hide();
    $('#txtPeriodTo').hide();
    $('#txtPeriodFrom').prop('disabled', true);
    $('#txtPeriodTo').prop('disabled', true);

    $.get(MAA_API_Server + 'masterData/getRegion', function (data) {
        $("#txtRegion").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            optionLabel: "Select Region",
            filter: "contains",
            dataSource: JSON.parse(data),
            index: 0,
            select: function (e) {
                var dataItem = e.dataItem;
                if (ddtOps !== undefined) {
                    ddtOps.enable(false);
                }
                if (ddtOpsPromo !== undefined) {
                    ddtOpsPromo.enable(false);
                }
                $.ajax({
                    type: "GET",
                    url: MAA_API_Server + 'masterData/getOperation?param=' + dataItem.Key,
                    async: true,
                    success: function (response) {
                        var dataRes = JSON.parse(response);
                        var newData = new kendo.data.DataSource({
                            data: dataRes
                        });
                        if (ddtOps !== undefined) {
                            ddtOps.setDataSource(JSON.parse(response));
                            ddtOps.refresh();

                            ddtOps.enable(true);
                        };
                        if (ddtOpsPromo !== undefined) {
                            ddtOpsPromo.dataSource.data(dataRes);
                            ddtOpsPromo.refresh();

                            ddtOpsPromo.enable(true);
                        };
                    }
                });
            }
        });
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'PromoProgram/GetAllData', function (data) {
        $("#optPromoType").kendoDropDownList({
            dataTextField: "PromotionType",
            dataValueField: "PromotionKey",
            optionLabel: "Select Promotion Type",
            dataSource: JSON.parse(data),
            index: 0,
            template: "<span data-id='${data.PromotionKey}'>${data.PromotionType}</span>"
        });
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getOperation', function (data) {
        ddtOps = $("#txtOperation").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            optionLabel: "Select Operation",
            dataSource: JSON.parse(data),
            index: 0
        }).data("kendoDropDownList");
        ddtOpsPromo = $("#listViewOperation").kendoDropDownTree({
            dataTextField: "Value",
            dataValueField: "Key",
            checkboxes: true,
            checkAll: true,
            autoClose: false,
            filter: "contains",
            dataSource: JSON.parse(data),
            index: 0
        }).data("kendoDropDownTree");
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getSubTradeChannel', function (data) {
        ddtTradeChannelPromo = $("#listViewSubTChannel").kendoDropDownTree({
            dataTextField: "Value",
            dataValueField: "Key",
            checkboxes: true,
            checkAll: true,
            autoClose: false,
            filter: "contains",
            dataSource: JSON.parse(data),
            index: 0
        }).data("kendoDropDownTree");
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getSalesDistrict', function (data) {
        ddtSalesDistrict = $("#listViewSalesDistrict").kendoDropDownTree({
            dataTextField: "Value",
            dataValueField: "Key",
            checkboxes: true,
            checkAll: true,
            autoClose: false,
            filter: "contains",
            dataSource: JSON.parse(data),
            index: 0
        }).data("kendoDropDownTree");
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getCustomerType', function (data) {
        ddtCustTypePromo = $("#listViewCustomerType").kendoDropDownTree({
            dataTextField: "Value",
            dataValueField: "Key",
            checkboxes: true,
            checkAll: true,
            autoClose: false,
            filter: "contains",
            dataSource: JSON.parse(data),
            index: 0
        }).data("kendoDropDownTree");
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getMarket', function (data) {
        var dataMarket = [];
        dataMarket.push({ Key: "*", Value: "All" });
        var arr = JSON.parse(data);
        for (var a = 0; a < arr.length; a++) {
            dataMarket.push(arr[a]);
        };

        $("#txtMarket").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            optionLabel: "Select Market",
            dataSource: dataMarket,
            index: 0
        });
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getChannel', function (data) {
        $("#txtChannel").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            optionLabel: "Select Channel",
            dataSource: JSON.parse(data),
            index: 0
        });
        numLoad -= 1;
    });
    
    $('#txtPromoUpReqNumber').prop('disabled', true);
    $('#txtCreatedDate').prop('disabled', true);
    $('#txtRequestor').prop('disabled', true);
    $('#txtDepartment').prop('disabled', true);
    $('input[name=tName]').prop('disabled', true);
    $('input[name=prmCategory]').prop('disabled', true);
    $('#txtPromoPrevNumberStr').prop('disabled', true);
    if (RequestorName != "") {
        document.getElementById('txtRequestor').value = RequestorName;
    }
    document.getElementById('txtPromoUpReqNumber').value = "POP/NO-" + generateAutoNumber($("#txtRequestor").val());
    document.getElementById('txtCreatedDate').value = generateCreateDate();
    
    bindPrevNumber();
});

var loadInterval = setInterval(checkCallback, 2000);

function checkCallback() {
    if (numLoad <= 0) {
        window.clearInterval(loadInterval);
        startSpinner('loading..', 0);

        if (PromoNumberModel !== "") {
            $('#slcPrevNumber').hide();
        }
        else {
            $('#txtPromoPrevNumberStr').hide();
        }
        initData();
    }
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
    $(".tabnavigator > ul > li.active-tab").removeClass("active-tab");
    $("#tabNavigator-li-" + tabIndex).addClass("active-tab");
}
// #endregion
var ddtTradeChannelPromo, ddtOpsPromo, ddtSalesDistrict, ddtCustTypePromo, ddtOps;
var gridQuantity, gridTradeName, gridConsMaterial, gridRwdMaterial, gridAttachment;
var ApprovalList1, ApprovalList2;
function initData() {
    $("#txtRegion").data('kendoDropDownList').enable(false);
    $('#txtOperation').data('kendoDropDownList').enable(false);
    $('#txtMarket').data('kendoDropDownList').enable(false);
    $('#txtPrgName').prop('disabled', true);
    $('#txtChannel').data('kendoDropDownList').enable(false);
    $('#txtPrgCategory').prop('disabled', true);
    $('#optPromoType').data('kendoDropDownList').enable(false);
    $('input[name=prmPriceCon]').prop('disabled', true);
    $('#txtPromoID').prop('disabled', true);
    $('#listViewOperation').data('kendoDropDownTree').enable(false);
    $('#listViewSubTChannel').data('kendoDropDownTree').enable(false);
    $('#listViewSalesDistrict').data('kendoDropDownTree').enable(false);
    $('#listViewCustomerType').data('kendoDropDownTree').enable(false);
    $('#divFromActivityPeriod').prop('disabled', true);
    $('#divFromActivityPeriodTo').prop('disabled', true);
    if (PromoNumberModel !== "") {
        document.getElementById('txtPromoUpReqNumber').value = PromoNumberModel;
    }
    if (PromPrevNum !== "") {
        $('#txtPromoPrevNumber').prop('disabled', true);
        document.getElementById('txtPromoPrevNumber').value = PromPrevNum;
        document.getElementById('txtPromoPrevNumberStr').value = PromPrevNum;
    }
    if (RequestorName != "") {
        document.getElementById('txtRequestor').value = RequestorName;
    }
    if (DepartmentName != "") {
        document.getElementById('txtDepartment').value = DepartmentName;
    }
    if (createdDateModel !== "") {
        document.getElementById('txtCreatedDate').value = createdDateModel;
    }
    if (OpRegion !== "") {
        $("#txtRegion").data('kendoDropDownList').value(OpRegion);
    }
    if (OperationName !== "") {
        $("#txtOperation").data('kendoDropDownList').value(OperationName);
    }
    if (Opmarket !== "") {
        $("#txtMarket").data('kendoDropDownList').value(Opmarket);
    }
    if (Opchan !== "") {
        $("#txtChannel").data('kendoDropDownList').value(Opchan);
    }
    if (ProgramName !== "") {
        document.getElementById('txtPrgName').value = ProgramName;
    }
    if (PromotypeType !== "") {
        $("#optPromoType ").data('kendoDropDownList').value(PromotypeType);
    }
    if (ProgramCategory !== "") {
        $("input[name=prmCategory][value=" + ProgramCategory + "]").attr('checked', 'checked');
    }
    if (PromotionID !== "") {
        document.getElementById('txtPromoID').value = PromotionID;
    }
    if (PromoPerFrom) {
        var FromDate = PromoPerFrom;
        PromoPerFrom = returnDateFromYYYYMMDDT(PromoPerFrom);
        if (isNaN(Date.parse(PromoPerFrom))) {
            PromoPerFrom = returnDateFromDDMMYYYY(FromDate);
        }
        $('#divFromActivityPeriod').datepicker({
            dateFormat: 'dd/mm/yyyy'
        }).datepicker('setDate', PromoPerFrom);
        document.getElementById('divFromActivityPeriod').value = formateDate(PromoPerFrom);
        document.getElementById('txtPeriodFrom').value = formateDate(PromoPerFrom);
    }
    if (PromoPerTo) {
        var ToDate = PromoPerTo;
        PromoPerTo = returnDateFromYYYYMMDDT(PromoPerTo);
        if (isNaN(Date.parse(PromoPerTo))) {
            PromoPerTo = returnDateFromDDMMYYYY(ToDate);
        }
        $('#divFromActivityPeriodTo').datepicker({
            dateFormat: 'dd/mm/yyyy'
        }).datepicker('setDate', PromoPerTo);
        document.getElementById('divFromActivityPeriodTo').value = formateDate(PromoPerTo);
        document.getElementById('txtPeriodTo').value = formateDate(PromoPerTo);
    }
    if (dataOpsPromo !== "") {
        if ($.type(dataOpsPromo) !== "array") {
            dataOpsPromo = JSON.parse(dataOpsPromo);
        }
        ddtOpsPromo.value(dataOpsPromo);
    }
    if (dataTradeChannelPromo !== "") {
        if ($.type(dataTradeChannelPromo) !== "array") {
            dataTradeChannelPromo = JSON.parse(dataTradeChannelPromo);
        }
        ddtTradeChannelPromo.value(dataTradeChannelPromo);
    }
    if (dataSalesDistrictPromo !== "") {
        if ($.type(dataSalesDistrictPromo) !== "array") {
            dataSalesDistrictPromo = JSON.parse(dataSalesDistrictPromo);
        }
        ddtSalesDistrict.value(dataSalesDistrictPromo);
    }
    if (dataCustTypePromo !== "") {
        if ($.type(dataCustTypePromo) !== "array") {
            dataCustTypePromo = JSON.parse(dataCustTypePromo);
        }
        ddtCustTypePromo.value(dataCustTypePromo);
    }
    if (AllTradeName !== "") {
        $("input[name=tName][value=" + AllTradeName + "]").attr('checked', 'checked');
    }
    initGrid();

    if (DocumentStatusModel !== "" && DocumentStatusModel !== null && DocumentStatusModel !== undefined) {
        document.getElementById('lbldocstatus').innerHTML = "- " + DocumentStatusModel;
    }
    if (ApprovalStatusModel === "4") {
        document.getElementById('lblapprovestatus').innerHTML = 'In Process';
        $('#divbtnSubmit').hide();
    }
    else if (ApprovalStatusModel === "1") {
        $('#divbtnSubmit').hide();
        $('#divbtnApprove').hide();
        $('#divbtnReject').hide();
        $('#divbtnSendBack').hide();
        document.getElementById('lblapprovestatus').innerHTML = 'Completed';
        document.getElementById('lbldocstatus').innerHTML = '- Promo Done';
    }
    else if (ApprovalStatusModel === "2") {
        $('#divbtnSubmit').hide();
        $("#divbtnReject").hide();
        $("#divbtnApprove").hide();
        $('#divbtnSendBack').hide();
        document.getElementById('lblapprovestatus').innerHTML = 'Rejected';
    }
    else if (ApprovalStatusModel === "3") {
        document.getElementById('lblapprovestatus').innerHTML = 'Send Back';
        $("#divbtnReject").hide();
        $("#divbtnApprove").hide();
        $('#divbtnSendBack').hide();
        $("#txtPeriodFrom").hide();
        $("#txtPeriodTo").hide();
        $("#divFromActivityPeriod").show();
        $("#divFromActivityPeriodTo").show();

        //$('#txtPromoPrevNumber').prop('disabled', false);
        //$('#txtPromoPrevNumber').data("kendoDropDownList").value(PromPrevNum);
        //$('#slcPrevNumber').show();
        //$('#txtPromoPrevNumberStr').hide();
    }
    else if (ApprovalStatusModel === null || ApprovalStatusModel === undefined || ApprovalStatusModel === "") {
        $("#divbtnReject").hide();
        $("#divbtnApprove").hide();
        $('#divbtnSendBack').hide();
        document.getElementById('lblapprovestatus').innerHTML = 'Draft';
        document.getElementById('lbldocstatus').innerHTML = '- Created';
    }

    if (ApprovalStatusModel === "4" || ApprovalStatusModel === "1" || ApprovalStatusModel === "2") {
        $("#txtPeriodFrom").show();
        $("#txtPeriodTo").show();
        $("#divFromActivityPeriod").hide();
        $("#divFromActivityPeriodTo").hide();
    }
};

function bindPrevNumber() {
    $.post(MAA_API_Server + 'PromoOnInvoice/ListForPOP', function (data) {
        var Response = JSON.parse(data);
        if (Response.Success === true) {
            $("#txtPromoPrevNumber").kendoDropDownList({
                dataTextField: "Value",
                dataValueField: "Value",
                optionLabel: "Select Prev Promo Number",
                template: "<span data-id='${data.Value}'>${data.Value}</span>",
                filter: "contains",
                dataSource: JSON.parse(Response.Message),
                select: function (e) {
                    var dataItem = e.dataItem;

                    loadPrevData(dataItem.Value);
                }
            });
        };
    });

    
}

function loadPrevData(prevNum) {
    startSpinner('loading..', 1); 
    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'PromoOnInvoice/GetByID?id=' + prevNum,
        beforeSend: function () {
            //loading icon...
        },
        success: function (data) {
            var response = JSON.parse(data);
            if (response.Success) {
                prevPOIdata = JSON.parse(response.Message);

                PromoNumberModel = "";
                PromPrevNum = prevPOIdata.PromoNumber;
                //createdDateModel = prevPOIdata.CreatedDate;
                //date_arr = createdDateModel.split("T");
                //createdDateModel = date_arr[0].split("/").reverse().join("/");
                createdDateModel = generateCreateDate();
                //RequestorName = prevPOIdata.RequestorName;
                OperationName = prevPOIdata.OperationName;
                DepartmentName = prevPOIdata.DepartmentName;
                OpRegion = prevPOIdata.OpRegion;
                Opmarket = prevPOIdata.Opmarket;
                Opchan = prevPOIdata.Opchan;
                ProgramName = prevPOIdata.ProgramName;
                ProgramCategory = prevPOIdata.ProgramCategory;
                PromotypeType = prevPOIdata.PromotypeType;
                PromotionID = prevPOIdata.PromotionID;
                PromoPerFrom = prevPOIdata.PromoPerFrom;
                PromoPerTo = prevPOIdata.PromoPerTo;
                AllTradeName = prevPOIdata.AllTradeName;
                DocumentStatusModel = "";
                ApprovalStatusModel = "";
                attachments = prevPOIdata.attachments;
                dataQuantity = prevPOIdata.POIQtyScaling;
                dataTradeName = prevPOIdata.POITradeData;
                dataConsMaterial = prevPOIdata.POIConsMaterial;
                dataRawMaterial = prevPOIdata.POIRwdMaterial;
                dataOpsPromo = prevPOIdata.OperationPromo;
                dataCustTypePromo = prevPOIdata.CustomerTypePromo;
                dataTradeChannelPromo = prevPOIdata.SubTradeChannelPromo;
                dataSalesDistrictPromo = prevPOIdata.SalesDistrictPromo;
                
                initData();
                startSpinner('loading..', 0);
            } else {
                startSpinner('loading..', 0);
                alert("fail");
            };
        },
        error: function (response) {
            startSpinner('loading..', 0);
            alert("fail");
        }
    });
};

$('#divFromActivityPeriod').datepicker({
    format: 'dd/mm/yyyy',
    todayBtn: 'linked',
    autoclose: true
}).on('changeDate', function (selected) {
    var minDate = new Date(selected.date.valueOf());
    $('#divFromActivityPeriodTo').datepicker('setStartDate', minDate);
});

$('#divFromActivityPeriodTo').datepicker({
    format: 'dd/mm/yyyy',
    todayBtn: 'linked',
    autoclose: true
});

function initGrid() {
    gridQuantity = $("#gridQuantity").kendoGrid({
        dataSource: {
            data: dataQuantity,
            schema: {
                model: {
                    fields: {
                        OrderID: { type: "number" },
                        MinQty: { type: "number" },
                        Amount: { type: "number" }
                    }
                }
            },
            pageSize: 20
        },
        columns: [
            { field: "OrderID", title: "No", width: "10%", format: "{0:#,0}" },
            { field: "MinQty", title: "Min Qty", width: "25%", attributes: { class: "text-right " }, format: "{0:#,0}" },
            { field: "Amount", title: "Amount", width: "25%", attributes: { class: "text-right " }, format: "{0:#,0}" },
        ],
        scrollable: true,
        sortable: true,
        filterable: false,
        editable: false,
        pageable: gridPage,
        noRecords: true
    }).data("kendoGrid");

    gridTradeName = $("#gridTradeName").kendoGrid({
        dataSource: {
            data: dataTradeName,
            schema: {
                model: {
                    fields: {
                        ID: { type: "number" },
                        TradeID: { type:"string" },
                        TradeName: { type: "string" },
                        CustomerID: { type: "string" },
                        CustomerName: { type: "string" }
                    }
                }
            },
            pageSize: 10
        },
        height: 150,
        scrollable: false,
        sortable: true,
        filterable: false,
        editable: false,
        pageable: gridPage,
        columns: [
            { field: "ID", title: "No", width: "10%", template: "<span class='row-number'></span>" },
            { field: "TradeName", title: "Trade Name", width: "10%", template: "#=TradeName#" },
            { field: "CustomerName", title: "Customer Name", width: "10%", template: "#=CustomerName#" }
        ],
        dataBound: function () {
            var rows = this.items();
            $(rows).each(function () {
                var index = $(this).index() + 1;
                var rowLabel = $(this).find(".row-number");
                $(rowLabel).html(index);
            });
        }
    }).data("kendoGrid");

    gridConsMaterial = $("#gridConsMaterial").kendoGrid({
        dataSource: {
            data: dataConsMaterial,
            schema: {
                model: {
                    fields: {
                        ID: { type: "string" },
                        MaterialID: { type: "string"  },
                        MaterialGroup: { type: "string" },
                        MaterialNumber: { type: "string" },
                        MaterialDesc: { type: "string" },
                        Qty: { type: "number" }
                    }
                }
            },
            pageSize: 10
        },
        height: 150,
        scrollable: false,
        sortable: true,
        filterable: false,
        editable: false,
        pageable: gridPage,
        columns: [
            { field: "ID", title: "No", width: "10%", template: "<span class='row-number'></span>" },
            { field: "MaterialGroup", title: "Material Group", width: "10%", template: "#=MaterialGroup#" },
            { field: "MaterialNumber", title: "Material Number", width: "10%", template: "#=MaterialNumber#" },
            { field: "MaterialDesc", title: "Material Description", width: "10%" },
            { field: "Qty", title: "Qty", width: "10%", attributes: { class: "text-right " }, format: "{0:#,0}" }
        ],
        dataBound: function () {
            var rows = this.items();
            $(rows).each(function () {
                var index = $(this).index() + 1;
                var rowLabel = $(this).find(".row-number");
                $(rowLabel).html(index);
            });
        }
    }).data("kendoGrid");

    gridRwdMaterial = $("#gridRwdMaterial").kendoGrid({
        dataSource: {
            data: dataRawMaterial,
            schema: {
                model: {
                    fields: {
                        No: { type: "string" },
                        MaterialID: { type: "string" },
                        MaterialGroup: { type: "string" },
                        MaterialNumber: { type: "string" },
                        MaterialDescription: { type: "string" },
                        EstimatedQty: { type: "number" },
                        PricePerCase: { type: "number" },
                        PercentDiscPerCase: { type: "number" },
                        DiscPerCase: { type: "number" },
                        NewPricePerCase: { type: "number" },
                        totDiscount: { type: "number" }
                    }
                }
            },
            pageSize: 20,
            aggregate: [
                { field: "No", aggregate: "count" },
                { field: "EstimatedQty", aggregate: "sum" },
                { field: "totDiscount", aggregate: "sum" }
            ]
        },
        scrollable: true,
        sortable: true,
        filterable: false,
        pageable: gridPage,
        editable:false,
        columns: [
            { field: "No", title: "No", width: "10%", template: "<span class='row-number'></span>" },
            { field: "MaterialGroup", title: "Material Group", width: "10%", template: "#=MaterialGroup#" },
            { field: "MaterialNumber", title: "Material Number", width: "10%", template: "#=MaterialNumber#" },
            { field: "MaterialDescription", title: "Material Description", width: "10%", footerTemplate: "Total Quantity" },
            { field: "EstimatedQty", title: "Estimated Qty", width: "10%", attributes: { class: "text-right " }, format: "{0:#,0}", aggregates: ["sum"], footerTemplate: "#= kendo.toString(sum, \"n0\") #", footerAttributes: { class: "text-right" } },
            { field: "PricePerCase", title: "Price / Case (Rp)", width: "10%", attributes: { class: "text-right " }, format: "{0:#,0}" },
            { field: "PercentDiscPerCase", title: "% Discount / Case (Rp)", width: "10%", attributes: { class: "text-right " }, format: "{0:#,0}" },
            { field: "DiscPerCase", title: "Discount / Case (Rp)", width: "10%", attributes: { class: "text-right " }, format: "{0:#,0}" },
            { field: "NewPricePerCase", title: "New Price / Case (Rp)", width: "10%", attributes: { class: "text-right " }, format: "{0:#,0}", footerTemplate: "Total Amount" },
            { field: "totDiscount", title: "Total Discount / Case (Rp)", width: "10%", attributes: { class: "text-right " }, format: "{0:#,0}", aggregates: ["sum"], format: "{0:#,0.00}", footerTemplate: "#= kendo.toString(sum, \"n2\") #", footerAttributes: { class: "text-right" } },
        ],
        dataBound: function () {
            var rows = this.items();
            $(rows).each(function () {
                var index = $(this).index() + 1;
                var rowLabel = $(this).find(".row-number");
                $(rowLabel).html(index);
            });
        }
    }).data("kendoGrid");

    gridAttachment = $("#gridAttachment").kendoGrid({
        dataSource: {
            data: attachments,
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
        pageable: gridPage,
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
    }).data("kendoGrid");
}

var gridPage = {
    info: true,
    refresh: true,
    pageSizes: true,
    previousNext: true,
    numeric: true
};

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
    
    columns: [
        { field: "Approval1", title: "Approval 1 <br/> GM Supermarket", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval2", title: "Approval 2 <br/> Pricing Commitee", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval3", title: "Approval 3 <br/> ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval4", title: "Approval 4 <br/> ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval5", title: "Approval 5 <br/> ", attributes: { class: "text-center" }, width: "130px", encoded: false }
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
        { field: "Approval1", title: "Approval 6 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval2", title: "Approval 7 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval3", title: "Approval 8 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval4", title: "Approval 9 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval5", title: "Approval 10 ", attributes: { class: "text-center" }, width: "130px", encoded: false }
    ]
});

//$("i").click(function () {
//    $("input[type='file']").trigger('click');
//});
//$('.file-input').change(function () {
//    var filename = this.value;
//    var lastIndex = filename.lastIndexOf("\\");
//    var imgCont = "";
//    if (lastIndex >= 0) {
//        filename = filename.substring(lastIndex + 1);
//    }
//    files = $('#file-input')[0].files;
//    res = Array.prototype.slice.call(files);
//    for (var i = 0; i < files.length; i++) {
//        var extension = files[i].name.replace(/^.*\./, '');
//        if (extension.toLowerCase() === "png" || extension.toLowerCase() === "jpg" || extension.toLowerCase() === "jpeg") {
//            imgCont = "<img src='/images/image.ico' width='50' height='50'></img>";
//        }
//        else if (extension.toLowerCase() === "xlsx" || extension.toLowerCase() === "xls") {
//            imgCont = "<img src='/images/excel.ico' width='50' height='50'></img>";
//        }
//        else if (extension.toLowerCase() === "pdf") {
//            imgCont = "<img src='/images/pdf.ico' width='50' height='50'></img>";
//        }
//        else {
//            imgCont = "<img src='/images/document.ico' width='50' height='50'></img>";
//        }
//        $('.filename-container').append("<div class='text-center col-sm-6' >" + imgCont + "<br/><span  class='filename'>" + files[i].name + "</span></div>").show();
//    }
//});

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
    
    validationMessage = '';
    if (isNaN(Date.parse($('#divFromActivityPeriod').datepicker('getDate')))) {
        validationMessage = validationMessage + "Please re-choose Promotion Period From." + "\n";
    }
    else {
        var d = new Date();
        var newData = new Date(d.valueOf() + (1000 * 3600 * 24 * POIPromoStart));
        if ($("#divFromActivityPeriod").datepicker('getDate') < newData) {
            tabMandatory(textTab1);
            validationMessage = validationMessage + 'Promotion Period From must be 3 days after today.' + '\n';
        }
    }
    if (isNaN(Date.parse($('#divFromActivityPeriodTo').datepicker('getDate')))) {
        validationMessage = validationMessage + "Please re-choose Promotion Period To" + "\n";
    }
    else {
        if ($("#divFromActivityPeriodTo").datepicker('getDate') < $("#divFromActivityPeriod").datepicker('getDate')) {
            tabMandatory(textTab1);
            validationMessage = validationMessage + 'Please check Promotion Period To.' + '\n';
        }
    }

    if (validationMessage !== "") {
        validationForm(validationMessage);
    }

}

//#region checkboxList
//function bindingOperationCheckBox() {
//    function checkboxEventBindingChannel() {
//        $('#checkallOperation').bind('click', function (e) {
//            if (this.checked) {
//                $('.item.clickOperation input').attr('checked', 'checked');
//            }
//            else {
//                $('.item.clickOperation input').removeAttr('checked');
//            }
//            console.log($(".item.clickOperation input").serialize());
//        });
//    }
//    $("#listViewOperation").kendoListView({
//        dataSource: operations,
//        template: kendo.template($("#OperationTemplate").html()),
//        headertemplate: "<div class='item clickOperation' id='headerTemp' data='*'>       <input type='checkbox' class='clickOperation' /><span class='checkbox'>All</span></div>",
//        dataBound: function (e) {
//            checkboxEventBindingChannel();
//        }
//    });
//}

//function bindingChannelCheckBox() {
//    function checkboxEventBindingOperation() {
//        $('#checkallSubTChannel').bind('click', function (e) {
//            if (this.checked) {
//                $('.item.clickChannel input').attr('checked', 'checked');
//            }
//            else {
//                $('.item.clickChannel input').removeAttr('checked');
//            }
//            console.log($(".item.clickChannel input").serialize());
//        });
//    }
//    $("#listViewSubTChannel").kendoListView({
//        dataSource: subtchannels,
//        template: kendo.template($("#ChannelTemplate").html()),
//        headertemplate: "<div class='item clickChannel' id='headerTemp' data='*'>       <input type='checkbox' class='clickChannel' /><span class='checkbox'>All</span></div>",
//        dataBound: function (e) {
//            checkboxEventBindingOperation();
//        }
//    });
//}

//function bindingSalesDistrictCheckBox() {
//    function checkboxEventBindingSalesDistrict() {
//        $('#checkallSalesDistrict').bind('click', function (e) {
//            if (this.checked) {
//                $('.item.clickSalesDistrict input').attr('checked', 'checked');
//            }
//            else {
//                $('.item.clickSalesDistrict input').removeAttr('checked');
//            }
//            console.log($(".item.clickSalesDistrict input").serialize());
//        });
//    }
//    $("#listViewSalesDistrict").kendoListView({
//        dataSource: salesdistricts,
//        template: kendo.template($("#SalesDistrictTemplate").html()),
//        headertemplate: "<div class='item clickSalesDistrict' id='headerTemp' data='*'>       <input type='checkbox' class='clickSalesDistrict' /><span class='checkbox'>All</span></div>",
//        dataBound: function (e) {
//            checkboxEventBindingSalesDistrict();
//        }
//    });
//}

//function bindingCustomerTypeCheckBox() {
//    function checkboxEventBindingCustomerType() {
//        $('#checkallCustomerType').bind('click', function (e) {
//            if (this.checked) {
//                $('.item.clickCustomertype input').attr('checked', 'checked');
//            }
//            else {
//                $('.item.clickCustomertype input').removeAttr('checked');
//            }
//            console.log($(".item.clickCustomertype input").serialize());
//        });
//    }
//    $("#listViewCustomerType").kendoListView({
//        dataSource: customerTypes,
//        template: kendo.template($("#CustomertypeTemplate").html()),
//        headertemplate: "<div class='item clickCustomertype' id='headerTemp' data='*'>       <input type='checkbox' class='clickCustomertype' /><span class='checkbox'>All</span></div>",
//        dataBound: function (e) {
//            checkboxEventBindingCustomerType();
//        }
//    });
//}
//#endregion

$("input[name='tName']").change(function () {
    if ($("input[name='tName']:checked").val() === "Y") {
        $('#gridTradeName')[0].style.display = "none";
        $('#btnAddTrade')[0].style.display = "none";
    }
    else {
        $('#gridTradeName')[0].style.display = "block";
        $('#btnAddTrade')[0].style.display = "block";
    }
});

function btnSubmitClicked() {
    validationPage();
    if (validationMessage === "") {
        startSpinner('loading..', 1); 
        var saveReq = {
            PromoNumber: $("#txtPromoUpReqNumber").val(),
            PromPrevNum: $("#txtPromoPrevNumber").val(),
            RequestorName: $('#txtRequestor').val(),
            DepartmentName: $('#txtDepartment').val(),
            PromoPerFromString: $("#divFromActivityPeriod").datepicker('getDate'),
            PromoPerToString: $("#divFromActivityPeriodTo").datepicker('getDate'),
            DocumentStatus: "Waiting Approval",
            ApprovalStatus: "4",
            RequestorPositionID: $("#RequestorPositionID").val(),
            RequestorPosition: $("#RequestorPosition").val(),
            RequestorPINID: $('#RequestorPINID').val(),
            CreatedBy: $('#CreatedBy').val(),
            CreatedDate: new Date(dateServer).toJSON()
        };
        $.ajax({
            type: "POST",
            url: MAA_API_Server + 'PromoOnInvoice/POPSaveData',
            data: saveReq,
            beforeSend: function () {
                //loading icon...
            },
            success: function (response) {
                if (response.message.includes("OK")) {
                    var arrStr = response.message.split("|");
                    startSpinner('loading..', 0);
                    swal({
                        type: 'success',
                        title: 'Success',
                        text: 'Your Request Number : ' + arrStr[1],
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
};

$('#btnApprove').click(function () {
    validationMessage = "";
    if (!isNaN(Date.parse($('#divFromActivityPeriod').datepicker('getDate')))) {
        var d = new Date();
        var forCheck = new Date(d.valueOf() + (1000 * 3600 * 24 * POIPromoStart));
        if (returnDateFromDDMMYYYY($('#txtPeriodFrom').val()) <= forCheck) {
            validationMessage += "Approval date should be " + POIPromoStart + " days before Promotion Start date." + "\n";
        }
    }
    if (validationMessage !== "") {
        startSpinner('loading..', 0);
        validationForm(validationMessage);
    }
    else {
        startSpinner('loading..', 1);
        $.ajax({
            type: "POST",
            url: MAA_API_Server + 'PromoOnInvoice/Approve?id=' + document.getElementById('txtPromoUpReqNumber').value,
            data: document.getElementById('txtPromoUpReqNumber').value,
            beforeSend: function () {
                //loading icon...
            },
            success: function (response) {
                if (response.message === "OK") {
                    startSpinner('loading..', 0);
                    swal({
                        type: 'success',
                        title: 'Success',
                        text: 'Approve Successfully'
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
});

$('#btnReject').click(function () {
    startSpinner('loading..', 1); 
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'PromoOnInvoice/Reject?id=' + document.getElementById('txtPromoUpReqNumber').value,
        data: document.getElementById('txtPromoUpReqNumber').value,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {
            if (response.message === "OK") {
                startSpinner('loading..', 0);
                swal({
                    type: 'success',
                    title: 'Success',
                    text: 'Reject Successfully'
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
});

$('#btnHome').click(function () {
    swal({
        type: 'warning',
        title: 'Are you sure?',
        html: 'You will lost all your data.',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then(function (isConfirm) {
        if (isConfirm.value) { window.location.replace(url_Web); };
    });
});

$('#btnSendBack').click(function () {
    startSpinner('loading..', 1);
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'PromoOnInvoice/SendBack?id=' + document.getElementById('txtPromoUpReqNumber').value,
        data: document.getElementById('txtPromoUpReqNumber').value,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {
            if (response.message === "OK") {
                startSpinner('loading..', 0);
                swal({
                    type: 'success',
                    title: 'Success',
                    text: 'Send Back Successfully'
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
});