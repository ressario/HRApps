var numLoad = 7;
var loadInterval = setInterval(checkCallback, 2000);
var hdnsamplingdata = "";
$(document).ready(function () {
    //startSpinner('loading..', 1);
    // initTabStrip();
    initTabStrip();
    initFileUpload();
    initialSetting();
});

function bindDMENumber() {

    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'SamplingIndirect/GetActiveDMERequest',
        success: function (msg) {
            var dmeNumber1 = [];
            for (var i = 0; i < msg.length; i++) {
                dmeNumber1.push(msg[i].dmeRequestNumber);
            }
            console.log('bind: ' + dmeNumber1);

            autocomplete(document.getElementById("txtDMENumber"), dmeNumber1);
        },
        error: function (data) {
            alert('Something Went Wrong');
        }
    });
}
function initialSetting() {
    bindRegionList();
    bindChannelList();
    bindReasonCodeList();
    console.log(samplingNumberModel);
    bindDMENumberList();
    document.getElementById("txtSamplingReqNumber").disabled = true;
    document.getElementById("txtCreatedDate").disabled = true;
    document.getElementById("txtDepartment").disabled = true;
    document.getElementById("txtDMENumber").disabled = true;
    $('#txtRequestor').val(requestorModel);
    $('#txtDepartment').val(departmentModel);
    if (!samplingNumberModel) {
        bindOperationList(null);
        bindGridSampling(null);
        document.getElementById('txtSamplingReqNumber').value = 'SOI/NO-' + generateAutoNumber($('#txtRequestor').val());
        document.getElementById('txtCreatedDate').value = generateCreateDate();
        $('#lbldocstatus').html("Created");
        $('#lblapprovalstatus').html("Draft");
        $('#divbtnApprove').hide();
        $('#divbtnReject').hide();
    } else {
        bindOperationList(opRegionModel);
        $('#txtSamplingReqNumber').val(samplingNumberModel);
        $('#txtCreatedDate').val(formateDate(createdDateModel));
        $('#txtDepartment').val(departmentModel);
        $('#txtOperation').val(operationModel);
        $('#txtProgramName').val(programNameModel);
        console.log(channelModel);
        $('#txtChannel').val(channelModel);
        $('#txtProgramCategory').val(progcatModel);
        $('#txtReasonCode').val(reasonCodeModel);
        $('#txtDMENumber').val(dmeNumberModel);
        $('#txtNotes').val(dmeNotesModel);
        getDetailSamplingList(samplingNumberModel);
        bindGridAttachment(attachments);
        
        if (approvalStatusModel !== "0") {
            $('#divAttachment').hide();
            $('#divbtnSubmit').hide();
            $('#divbtnDraft').hide();

            document.getElementById("txtRequestor").disabled = true;
            document.getElementById("txtOPRegion").disabled = true;
            document.getElementById("txtOperation").disabled = true;
            document.getElementById("txtProgramName").disabled = true;
            document.getElementById("txtChannel").disabled = true;
            document.getElementById("txtProgramCategory").disabled = true;
            document.getElementById("txtReasonCode").disabled = true;
            document.getElementById("txtDMENumber").disabled = true;
            document.getElementById("txtNotes").disabled = true;
            $('#uploaddiv').hide();

            if (approvalStatusModel === "4") {
                $('#lblapprovalstatus').html("In Process");
                $('#lbldocstatus').html("Waiting Approval");

            }

            else if (approvalStatusModel === "1") {
                $('#lblapprovalstatus').html("Completed");
                $('#lbldocstatus').html("Completed");
                $('#divbtnApprove').hide();
                $('#divbtnReject').hide();

            }
            //reject
            else if (approvalStatusModel === "2") {
                $('#lblapprovalstatus').html("Rejected");
                $('#lbldocstatus').html("Rejected");

                $('#divbtnApprove').hide();
                $('#divbtnReject').hide();
            }
        }
        else {
            $('#lbldocstatus').html("Created");
            $('#lblapprovalstatus').html("Draft");
            $('#divbtnApprove').hide();
            $('#divbtnReject').hide();
            $('#txtSamplingReqNumber').val('SOI/NO-' + generateAutoNumber($('#txtRequestor').val()));
        }
    }
    
}

function checkCallback() {
    if (numLoad <= 0) {
        window.clearInterval(loadInterval);
        startSpinner('loading..', 0);
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
    //var tabIndex = e.item.tabIndex;
    //alert(tabIndex);

    $(".tabnavigator > ul > li.active-tab").removeClass("active-tab");
    $("#tabNavigator-li-" + tabIndex).addClass("active-tab");
}
    // #endregion

$('#divFromActivityPeriod').datepicker({
    format: 'mm/dd/yyyy',
    todayBtn: 'linked',
    autoclose: true
});
$('#divFromActivityPeriodTo').datepicker({
    format: 'mm/dd/yyyy',
    todayBtn: 'linked',
    autoclose: true
});
$('#divdtInvoiceSettlementDate').datepicker({
    format: 'mm/dd/yyyy',
    todayBtn: 'linked',
    autoclose: true
});

var _gridSamplingDirect;

function bindGridSampling(response) {
    _gridSamplingDirect = $("#gridSamplingDirect").kendoGrid({
        dataSource: {
            //type: "webapi",
            data: response,
            schema: {
                model: {
                    fields: {

                        //no: { type: "int" },
                        CustomerSoldToDesc: { type: "string" },
                        CustomerShipToDesc: { type: "string" },
                        //Agreement: { type: "string" },
                        ArticleCode: { type: "string" },
                        ArticleDescription: { type: "string" },
                        ArticleGroup: { type: "string" },
                        InternalOrder: { type: "string" },
                        //ReasonCode: { type: "string" },
                        DeliveryDate: { type: "date" },
                        Qty: { type: "int" },
                        Plant: { type: "string" },
                        //YTDDME: { type: "number" },
                        //sampling: { type: "number" }
                        SamplingPrice: { type: "int" },
                        TotalDiscount: { type: "int" }
                    }
                }

            },
            //transport: {
            //    read: {
            //        url: url_Web + 'SamplingDirect/GetExcelData',
            //        cache: false,
            //        dataType: "json",
            //        type: "get"
            //    }
            //},
            //error: function (e) {
            //    this.cancelChanges();
            //    alert("Status: " + e.status + "; Error message: Error when retrieving data from API");
            //},
            pageSize: 10,
            aggregate: [{ field: "SamplingPrice", aggregate: "sum" },
                { field: "TotalDiscount", aggregate: "sum" }
            ]
        },
        //height: 270,
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
            //{
            //    selectable: true, width: "50px"
            //},
            //{
            //    field: "no", title: "No", width: "30px", attributes: { class: "text-right" }
            //},
            { field: "CustomerSoldToDesc", title: "Customer - Sold To", width: "90px" },
            { field: "CustomerShipToDesc", title: "Customer - Ship To", width: "90px" },
            //{ field: "Agreement", title: "Agreement", width: "70px" },
            { field: "ArticleCode", title: "Material Number", width: "80px" },
            { field: "ArticleDescription", title: "Material Desc", width: "80px" },
            { field: "ArticleGroup", title: "Material Group", width: "80px" },
            { field: "InternalOrder", title: "Internal Order", width: "50px" },
            //{ field: "ReasonCode", title: "Reason Code", width: "60px", attributes: { class: "text-right" } },
            { field: "DeliveryDate", title: "Delivery Date", width: "70px", format: "{0:MM-dd-yyyy}" },
            { field: "Qty", title: "Qty", width: "30px", attributes: { class: "text-right" } },
            {
                field: "Plant", title: "Plant", width: "65px", attributes: { class: "text-right" },
                footerTemplate: "<div align=left>Grand Total</div>"
            },
            //{
            //    field: "SamplingPrice", title: "Sampling Price / Case (Rp)", format: "{0:#,0.00}",
            //    width: "70px", attributes: { class: "text-right" }, aggregates: ["sum"],
            //    footerTemplate: "<div align=right>#= kendo.toString(sum, \"n2\") #</div>"
            //},
            {
                field: "SamplingPrice", title: "Sampling Price / Case (Rp)", format: "{0:#,0.00}",
                width: "70px", attributes: { class: "text-right" }
            },
            {
                field: "TotalDiscount", title: "Total Discount (Rp)", format: "{0:#,0.00}",
                width: "80px", attributes: { class: "text-right" }, aggregates: ["sum"],
                footerTemplate: "<div align=right>#= kendo.toString(sum, \"n2\") #</div>"
            }
            
        ]

        //columns: [
        //    {
        //        selectable: true, width: "50px"
        //    },
        //    {
        //        field: "dmeRequestNumber",
        //        title: "DME Request Number"
        //    },
        //    {
        //        field: "requestorName",
        //        title: "Requestor Name"
        //    },
        //    //{
        //    //    field: "createdDate",
        //    //    title: "Created Date"
        //    //},
        //    {
        //        field: "poNumber",
        //        title: "PO Number"
        //    },
        //    {
        //        field: "marketName",
        //        title: "Market Name"
        //    },
        //    {
        //        field: "amountRequest",
        //        title: "Amount Request"
        //    }
        //]
    });
}

var _gridAttachment;
function bindGridAttachment(response) {
    _gridAttachment = $("#gridAttachment").kendoGrid({
        dataSource: {
            //type: "webapi",
            data: response,
            schema: {
                model: {
                    fields: {

                        //no: { type: "int" },
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
            //{
            //    selectable: true, width: "50px"
            //},
            //{
            //    field: "no", title: "No", width: "30px", attributes: { class: "text-right" }
            //},
            {
                field: "Name", width: "30px", attributes: { class: "text-center" },
                //template: "# {#<a href='" + url_Web + "DMERequest?id=#=dmeNumber#'>#:dmeNumber#</a>#} #",
                
                template: "# {#<a href='#=Url#'>#:Name#</a>#} #",
                title: "Attachment Name"
            },
            {
                field: "Extension", title: "Extension", width: "30px", attributes: { class: "text-center" }
            }
        ]

      
    });
}

//function uploadExcel(response) {
    
//    bindGridSampling(response);

//}

//$("#files").kendoUpload({
//    async: {
//        saveUrl: url_Web + "SamplingDirect/UploadExcel",
//        removeUrl: "remove",
//        autoUpload: true
//    }
//});

$("#gridApproval1").kendoGrid({
    dataSource: {
        //data: approval1s,
        
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
        { field: "Approval1", title: "Approval 1 <br/> NKAM Manager", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval2", title: "Approval 2 <br/> Commersial Manager", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval3", title: "Approval 3 <br/> ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval4", title: "Approval 4 <br/> ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval5", title: "Approval 5 <br/> ", attributes: { class: "text-center" }, width: "130px", encoded: false }
    ]
});

$("#gridApproval2").kendoGrid({
    dataSource: {
        //data: approval2s,
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
        { field: "Approval1", title: "Approval 6 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval2", title: "Approval 7 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval3", title: "Approval 8 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval4", title: "Approval 9 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval5", title: "Approval 10 ", attributes: { class: "text-center" }, width: "130px", encoded: false }
    ]
});

function bindRegionList() {

    $.get(MAA_API_Server + 'masterData/getRegion', function (data) {
        $("#txtOPRegion").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            index: 0,
            optionLabel: "Please Select",
            change: onChange
        },

        );
        //numLoad -= 1;
        if (opRegionModel) {
            $('#txtOPRegion').data("kendoDropDownList").value(opRegionModel);
        }
    });
    function onChange(e) {
        startSpinner('loading..', 1);
        var dataItem = e.sender.dataItem();

        bindOperationList(dataItem.Key);

    }
}

function bindOperationList(e) {
    $.get(MAA_API_Server + 'masterData/getOperation?param=' + e, function (data) {
        $("#txtOperation").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            index: 0,
            optionLabel: "Please Select",
            change: onChange
        },

        );
        //numLoad -= 1;
        if (operationModel) {
            $('#txtOperation').data("kendoDropDownList").value(operationModel);
        }
        startSpinner('loading..', 0);
    });
    function onChange(e) {
        var dataItem = e.sender.dataItem();
        //alert(dataItem.Value);
    }

}

function bindChannelList() {
    //$.ajax({
    //    type: "GET",
    //    url: MAA_API_Server + 'Master/GetDDLChannel',
    //    success: function (msg) {
    //        $("#txtChannel").append('<option value="" selected disabled>Please select</option>');
    //        for (var i = 0; i < msg.length; i++) {
    //            $("#txtChannel").append('<option value="' + msg[i].id + '">' + msg[i].channel + '</option>');
    //        }
    //        $("#txtChannel option[value='" + channelModel + "']").attr("selected", "selected");
    //    },
    //    error: function (data) {
    //        alert('Something Went Wrong');
    //    }
    //});

    $.get(MAA_API_Server + 'masterData/getChannel', function (data) {
        $("#txtChannel").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            index: 0,
            optionLabel: "Please Select",
            change: onChange
        },

        );
        //numLoad -= 1;
        if (channelModel) {
            $('#txtChannel').data("kendoDropDownList").value(channelModel);
        }
    });
    function onChange(e) {
        var dataItem = e.sender.dataItem();
        //alert(dataItem.Value);
    }
}

function bindReasonCodeList() {
    //$.ajax({
    //    type: "GET",
    //    url: MAA_API_Server + 'Master/GetDDLReasonCode',
    //    success: function (msg) {
    //        $("#txtReasonCode").append('<option value="" selected disabled>Please select</option>');
    //        for (var i = 0; i < msg.length; i++) {
    //            $("#txtReasonCode").append('<option value="' + msg[i].id + '">' + msg[i].reason + '</option>');
    //        }
    //        $("#txtReasonCode option[value='" + reasonCodeModel + "']").attr("selected", "selected");
    //    },
    //    error: function (data) {
    //        alert('Something Went Wrong');
    //    }
    //});

    $.get(MAA_API_Server + 'masterData/getReasonCode', function (data) {
        $("#txtReasonCode").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            index: 0,
            optionLabel: "Please Select",
            change: onChange
        },

        );
        //numLoad -= 1;
        if (reasonCodeModel) {
            $('#txtReasonCode').data("kendoDropDownList").value(reasonCodeModel);
        }
    });
    function onChange(e) {
        startSpinner('loading..', 1);
        var dataItem = e.sender.dataItem();
        //alert(dataItem.Value);
        //$.get(MAA_API_Server + 'masterData/GetDMEFlag?param=' + dataItem.Key, function (data) {
        //    var test = JSON.parse(data);
        //    //console.log(e.Value);
        //    alert(test.Data);
        //    if (test.Value == "Y") {
        //        document.getElementById("txtDMENumber").disabled = false;
        //    }
        //});

        $.ajax({
            type: "GET",
            url: MAA_API_Server + 'masterData/GetDMEFlag?param=' + dataItem.Key,
            success: function (msg) {
                var data = JSON.parse(msg);
                if (data.length > 0) {
                    if (data[0].Value == "Y") {

                        $('#txtDMENumber').data("kendoDropDownList").enable(true);

                    }
                    else {

                        $('#txtDMENumber').data("kendoDropDownList").enable(false);
                        $('#txtDMENumber').data("kendoDropDownList").select(0);
                    }
                }
                startSpinner('loading..', 0);
            },
            error: function (data) {
                alert('Something Went Wrong');
                numLoad -= 1;
                startSpinner('loading..', 0);
            }
        });
    }

}

function bindDMENumberList() {

    $.get(MAA_API_Server + 'SamplingDirect/GetActiveDMERequest', function (data) {
        var apidata = JSON.parse(data);
        $("#txtDMENumber").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(apidata.Message),
            index: 0,
            optionLabel: "Please Select",
            change: onChange,
            filter: "contains"

        },

        );
        //numLoad -= 1;
        if (dmeNumberModel) {
            $('#txtDMENumber').data("kendoDropDownList").value(dmeNumberModel);
        }
    });
    function onChange(e) {
        var dataItem = e.sender.dataItem();
        //alert(dataItem.Value);
    }
}

var data = new FormData();

//var fileName = "";
//$("i").click(function () {
//    //$("input[type='file']").trigger('click');
//    $("#file-input").trigger('click');
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
//        $('.filename-container').append("<div class='text-center col-sm-4' >" + imgCont + "<br/><span  class='filename'>" + files[i].name + "</span></div>").show();
//        fileName = fileName + files[i].name + ';';
//    }


//    var fileupload = $("#file-input").get(0);
//    var files = fileupload.files;

//    for (i = 0; i < files.length; i++) {
//        data.append('files', files[i]);
//    }

//});

// #region Attachment
var fileName = "";
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
var uploadedFile = [];
$("i").click(function () {
    //$("input[type='file']").trigger('click');
    $("#file-input").trigger('click');
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
        //if (files[i].size / 1024 > maxFileSize) {
        //    alert("File exceeding maximum allowed size!");
        //    delete files[i];
        //    return;
        //}

        for (var j = 0; j < uploadedFile.length; j++) {
            if (uploadedFile[j] && uploadedFile[j].name === files[i].name) {
                if (!confirm("The attachment already contain file with name " + files[i].name + ". Do you want to replace?")) {
                    return;
                } else {
                    delete uploadedFile[j];
                }
            }
        }

        var totalSize = files[i].size / 1024;
        for (j = 0; j < uploadedFile.length; j++) {
            if (uploadedFile[j] && uploadedFile[j].size) {
                totalSize += uploadedFile[j].size;
            }
        }

        //if (totalSize / 1024 > maxUploadSize) {
        //    alert("Total uploaded file exceeding allowed size!");
        //    delete files[i];
        //    return;
        //}

        //var extension = files[i].name.replace(/^.*\./, '');
        //var fileTypes = allowedAttachmentType.split(',');
        //var fileTypeMatch = false;
        //for (var j = 0; j < fileTypes.length; j++) {
        //    if (fileTypes[j] === extension) {
        //        fileTypeMatch = true;
        //    }
        //}

        //if (!fileTypeMatch) {
        //    alert("File type not allowed!");
        //    document.getElementById("file-input").value = "";
        //    delete files[i];
        //    return;
        //}

        var name = files[i].name;
        var extension = files[i].name.replace(/^.*\./, '');
        var fileSize = files[i].size / 1024; //in Kb

        getBase64(files[i], function (error, result) {
            if (!error) {
                uploadedFile.push({
                    id: i + 1,
                    name: name,
                    content: result.substr(result.indexOf(',') + 1),
                    extension: extension,
                    url: '',
                    size: fileSize
                });
                if (extension.toLowerCase() === "png" || extension.toLowerCase() === "jpg" || extension.toLowerCase() === "jpeg") {
                    imgCont = "<img src='" + url_Web + "/images/image.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "xlsx" || extension.toLowerCase() === "xls") {
                    imgCont = "<img src='" + url_Web + "/images/excel.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "pdf") {
                    imgCont = "<img src='" + url_Web + "/images/pdf.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "doc" || extension.toLowerCase() === "docx") {
                    imgCont = "<img src='" + url_Web + "/images/word.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "ppt" || extension.toLowerCase() === "pptx") {
                    imgCont = "<img src='" + url_Web + "/images/ppt.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "msg") {
                    imgCont = "<img src='" + url_Web + "/images/mail.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else {
                    imgCont = "<img src='" + url_Web + "/images/document.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removeAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                $('.filename-container').append("<div class='text-center' id='attachment-" + (i + 1) + "' style='display:inline' >" + imgCont + "<span  class='filename' style='font-size:8px;display:inline'>" + name + "</span></div>").show();

            } else {
                alert(error);
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


function btnSubmitCliked() {
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

    var Operation = $('#txtOperation').val();
    var ProgramName = $('#txtProgramName').val();
    var Channel = $('#txtChannel').val();
    var ReasonCode = $('#txtReasonCode').val();
    var Notes = $('#txtNotes').val();
    var kendorow = $("#gridSamplingDirect").data("kendoGrid").dataSource.data().length;
    
    validationMessage = '';
    
    if (!Operation) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select Operation.' + '\n';
    }

    if (!ProgramName) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please fill Program Name.' + '\n';
    }

    if (!Channel) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select Channel.' + '\n';
    }

    if (!ReasonCode) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please select Reason Code.' + '\n';
    }

    if (!Notes) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please fill Notes.' + '\n';
    }

    if (kendorow===0) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Please upload your excel file.' + '\n';
    }

    if (uploadedFile === undefined || uploadedFile === null || uploadedFile.length < 1) {
        tabMandatory(textTab1);
        validationMessage = validationMessage + 'Attachment file is required.' + '\n';
    }

    if (validationMessage) {
        validationForm(validationMessage);
    }
    else {
        //successPrompt();
        SaveSampling();
    }

}

function saveAttachment() {
    $.ajax({
        type: "post",
        url: MAA_API_Server + 'SamplingIndirect/UploadFiles',
        contentType: false,
        processData: false,
        data: data,
        success: function (response) {
            if (response.message === "success") {
                //startSpinner('loading..', 0);

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
            //startSpinner('loading..', 0);

            console.log(error);

            alert("there was error uploading files!");
        }
    });
}

function SaveSampling() {
    //alert(MAA_API_Server);
    startSpinner('loading..', 1);
    var date = new Date();
    var samplingNumber = "";
    if (!samplingNumberModel) {
        samplingNumber = $("#txtSamplingReqNumber").val()
    }
    else {
        samplingNumber = samplingNumberModel;
    }
    var save_Sampling = {

        SamplingNumber: samplingNumber,
        SamplingType: 'Sampling Indirect',
        CreatedDate: new Date(dateServer).toJSON(),
        RequestorName: $("#txtRequestor").val(),
        Department: $("#txtDepartment").val(),
        OPRegion: $("#txtOPRegion").val(),
        Operation: $("#txtOperation").val(),
        ProgramName: $("#txtProgramName").val(),
        Channel: $("#txtChannel").val(),
        ProgramCategory: $("#txtProgramCategory").val(),
        ReasonCode: $("#txtReasonCode").val(),
        DMENumber: $("#txtDMENumber").val(),
        Notes: $("#txtNotes").val(),
        DocumentStatus: "Waiting Approval",
        ApprovalStatus: 4,
        ModifiedDate: new Date(dateServer).toJSON(),
        Attachment: uploadedFile,
        SamplingDetail: hdnsamplingdata,
        RequestorPositionID: $("#RequestorPositionID").val(),
        RequestorPosition: $("#RequestorPosition").val(),
        RequestorPINID: $('#RequestorPINID').val(),
        CreatedBy: $('#CreatedBy').val()
    };
        
    $.ajax({
        type: "POST",
        url: url_Web + 'SamplingIndirect/SaveSamplingRequest',
        data: save_Sampling,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {
            if (response.Success) {
                startSpinner('loading..', 0);
                //if (data.get('files')) {
                //    //data.append("FormNumber", response.dmenumber);
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
                //startSpinner('loading..', 0);
                swal({
                    type: 'success',
                    title: 'Success',
                    text: 'Your Request Number : ' + response.Result
                }).then(function () {
                    window.location = url_Web;
                });
            } else {
                startSpinner('loading..', 0);

                swal({
                    type: 'error',
                    title: 'Error',
                    text: response.Message
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

function SaveSamplingAsDraft() {
    startSpinner('loading..', 1);
    //alert(MAA_API_Server);
    var date = new Date();
    var samplingNumber = "";
    if (!samplingNumberModel) {
        samplingNumber = $("#txtSamplingReqNumber").val()
    }
    else {
        samplingNumber = samplingNumberModel;
    }
    var save_Sampling = {

        SamplingNumber: samplingNumber,
        SamplingType: 'Sampling Indirect',
        CreatedDate: new Date(dateServer).toJSON(),
        RequestorName: $("#txtRequestor").val(),
        Department: $("#txtDepartment").val(),
        OPRegion: $("#txtOPRegion").val(),
        Operation: $("#txtOperation").val(),
        ProgramName: $("#txtProgramName").val(),
        Channel: $("#txtChannel").val(),
        ProgramCategory: $("#txtProgramCategory").val(),
        ReasonCode: $("#txtReasonCode").val(),
        DMENumber: $("#txtDMENumber").val(),
        Notes: $("#txtNotes").val(),
        DocumentStatus: "Created",
        ApprovalStatus: 0,
        ModifiedDate: new Date(dateServer).toJSON(),
        Attachment: uploadedFile,
        SamplingDetail: hdnsamplingdata
    };

    $.ajax({
        type: "POST",
        url: url_Web + 'SamplingIndirect/SaveSamplingRequest',
        data: save_Sampling,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {
            if (response.Success) {
                startSpinner('loading..', 0);
                //if (data.get('files')) {
                //    //data.append("FormNumber", response.dmenumber);
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

                //startSpinner('loading..', 0);
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
                    text: response.Message
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

//$("#files").kendoUpload({
//    async: {
//        saveUrl: url_Web + "SamplingDirect/UploadExcel",
//        removeUrl: "remove",
//        autoUpload: true
//    }
//});



function initFileUpload() {
    $("#files").kendoUpload({
        multiple: false,
        //cancel: onCancel,
        //complete: onComplete,
        //error: onError,
        //progress: onProgress,
        //remove: onRemove,
        select: onSelect,
        //success: onSuccess,
        upload: onUpload,
        validation: {
            allowedExtensions: [".xlsx"],
            maxFileSize: 10485760
        }
    });

    function onSelect(e) {
        $.each(e.files, function (index, value) {
            sizeAttachment = Math.ceil(value.size / 1024);
            filename = value.name;
            fileExtension = value.extension;

        });
        kendoConsole.log("Select :: " + filename + " (" + sizeAttachment + ") KB");
    }

    function onUpload(e) {
        kendoConsole.log("Uploading :: " + filename + " (" + sizeAttachment + ") KB");
    }

    function onSuccess(e) {
        kendoConsole.log("Success (upload) :: " + filename + " (" + sizeAttachment + ") KB");
        bindGridSampling(e);
    }

    function onError(e) {
        kendoConsole.log("Error (upload) :: " + filename + " (" + sizeAttachment + ") KB");
    }

    function onComplete(e) {
        kendoConsole.log("Complete");

        
    }

    function onRemove(e) {
        kendoConsole.log("Remove :: " + filename + " (" + sizeAttachment + ") KB");
    }

    $("#btnExcelUpload").on('click', function (e) {
        e.preventDefault(); //Stop default form submission
        startSpinner('loading..', 1);
        var formUpload = document.forms.samplingdirectForm;
        var model = new FormData(formUpload);
        var dmenumber = $('#txtDMENumber').val();
        var reasoncode = $('#txtReasonCode').val();
        model.append('dmenumber', dmenumber);
        model.append('reasoncode', reasoncode);
        $.ajax({
            type: "POST",
            url: url_Web + "SamplingIndirect/UploadExcel",
            data: model,
            processData: false,
            contentType: false,
            beforeSend: function () {
                onUpload();
                $("button[type=submit]").attr("disabled", "disabled");
                $("#indicator").removeClass("hidden");
            },
            success: function (response) {
                if (response.Success) {
                    startSpinner('loading..', 0);
                    swal({
                        title: "Upload",
                        text: "File Upload Successfully",
                        type: "success",
                        showCancelButton: false
                    }).then(function () {
                        //window.location.href = url_Web;

                        //$('#btnExcelUpload').prop('disabled', true);

                        });
                    hdnsamplingdata = response.Message;
                    onSuccess(JSON.parse(response.Message));
                }
                else {
                    startSpinner('loading..', 0);
                    swal({
                        title: "Upload",
                        text: response.Message,
                        type: "error",
                        showCancelButton: false
                    }).then(function () {
                        //window.location.href = url_Web;

                        //$('#btnExcelUpload').prop('disabled', true);

                    });
                }
            },
            error: function (error) {
                startSpinner('loading..', 0);
                onError();
                Swal.fire({
                    type: 'error',
                    title: 'Something went wrong!'
                    //text: error.responseJSON.Message
                });
            },
            complete: function () {
                onComplete();
                $("#indicator").addClass("hidden");
                $("button[type=submit]").removeAttr("disabled");
            }
        });
    });
    
}

function getDetailSamplingList(samplingnum) {

    $.ajax({
        type: "GET",
        url: MAA_API_Server + 'SamplingIndirect/GetDetailSamplingRequestDataByRequestNumber',
        data: 'samplingnum=' + samplingnum,
        success: function (msg) {
            var samplingdata = JSON.parse(msg);

            bindGridSampling(JSON.parse(samplingdata.Message));
        },
        error: function (data) {
            alert('Something Went Wrong');
            //numLoad -= 1;

        }
    });

}

function btnApproveClicked() {
    startSpinner('loading..', 1);

    var newdocstatus = "Completed";
    var newapprovalstatus = 1;
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'SamplingDirect/UpdateSamplingStatus?requestnumber=' + samplingNumberModel
            + '&&documentstatus=' + newdocstatus + '&&approvalstatus=' + newapprovalstatus,
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
    var newdocstatus = "Rejected";
    var newapprovalstatus = 2;
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'SamplingDirect/UpdateSamplingStatus?requestnumber=' + samplingNumberModel
            + '&&documentstatus=' + newdocstatus + '&&approvalstatus=' + newapprovalstatus,
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
    


