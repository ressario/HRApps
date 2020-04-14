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

var numLoad = 8;
var loadInterval = setInterval(checkCallback, 2000);

function checkCallback() {
    if (numLoad <= 0) {
        window.clearInterval(loadInterval);

        startSpinner('loading..', 0);

        if (!HBPNumber) {
            var d = new Date();
            document.getElementById('txtCreatedDate').value = generateCreateDate();
            $('#gridAttachmentPricing')[0].style.display = 'none';
            $('#gridAttachment')[0].style.display = 'none';

            if (Requestor != "") {
                document.getElementById('txtRequestor').value = Requestor;
            }
            document.getElementById('txtPricingSetupRequestNumber').value = "HPB/NO-" + generateAutoNumber($("#txtRequestor").val());
        }
        else {
            document.getElementById('txtPricingSetupRequestNumber').value = HBPNumber;
            document.getElementById('txtCreatedDate').value = createdDateModel;
            document.getElementById('txtRequestor').value = Requestor;

            $('#gridAttachmentPricing')[0].style.display = 'block';
            $('#gridAttachment')[0].style.display = 'block';

            $("#txtRegion").data('kendoDropDownList').value(Region);
            $("#txtOperation").data('kendoDropDownList').value(Operation);
            $("#txtChannel").data('kendoDropDownList').value(Channel);
            $("input[name=prmPriceCon][value=" + PriceCondition + "]").attr('checked', 'checked');
            $("input[name='prmPriceCon']").trigger("change");

            if (ValidDateFrom) {
                var tempFrom = ValidDateFrom;
                ValidDateFrom = formateDate(toMMDDYYYYDate(ValidDateFrom));
                $('#divFromActivityPeriod').datepicker({
                    dateFormat: 'dd/mm/yyyy'
                }).datepicker('setDate', toMMDDYYYYDate(tempFrom));
                document.getElementById('divFromActivityPeriod').value = ValidDateFrom;
                document.getElementById('txtPeriodFrom').value = ValidDateFrom;
            }
            if (ValidDateTo) {
                var tempTo = ValidDateTo;
                ValidDateTo = formateDate(toMMDDYYYYDate(tempTo));
                $('#divFromActivityPeriodTo').datepicker({
                    dateFormat: 'dd/mm/yyyy'
                }).datepicker('setDate', toMMDDYYYYDate(tempTo));
                document.getElementById('divFromActivityPeriodTo').value = ValidDateTo;
                document.getElementById('txtPeriodTo').value = ValidDateTo;
            }

            bindingAttachment(attachment);
            bindingPricingAttachment(pricingAttachment);

            if (ApprovalStatusModel === "1" || ApprovalStatusModel === "2" || ApprovalStatusModel === "4") {
                $('#divAttachment').hide();
                if (ApprovalStatusModel === "1") {
                    $("#allPricingAttachment").show();
                    if (DocumentStatusModel === "Pricing In Progress") {
                        $('#divAttachmentPricing').show();
                        $('#gridAttachmentPricing').hide();
                    }
                    else if (DocumentStatusModel === "Pricing Done") {
                        $('#divAttachmentPricing').hide();
                        $('#gridAttachmentPricing').show();
                        $("#divbtnComplete").hide();
                        $("#divBtnApprove").hide();
                        $("#divBtnReject").hide();
                        $("#divBtnSendBack").hide();
                    }
                }
                $('#txtPeriodFrom').show();
                $('#txtPeriodTo').show();
                $('#divFromActivityPeriod').hide();
                $('#divFromActivityPeriodTo').hide();
                $('#divbtnSubmit').hide();
                $('#divbtnDraft').hide();
                $('#divFromActivityPeriod').prop('disabled', true);
                $('#divFromActivityPeriodTo').prop('disabled', true);
                document.getElementById("divFromActivityPeriod").disabled = true;
                document.getElementById("divFromActivityPeriodTo").disabled = true;
                $("#txtRegion").data('kendoDropDownList').enable(false);
                $("#txtOperation").data('kendoDropDownList').enable(false);
                $("#txtChannel").data('kendoDropDownList').enable(false);
                $('input[name=prmPriceCon]').prop('disabled', true);
                $('#btnAddTrade').prop('disabled', true);
                $('#btnAddPricebook').prop('disabled', true);
                $('#btnAddChannelOperation').prop('disabled', true);
                $('#btnAddOutlet').prop('disabled', true);
                $("#gridOutLet").data("kendoGrid").setOptions({ editable: false });
                $("#gridTrade").data("kendoGrid").setOptions({ editable: false });
                $("#gridChannelOperation").data("kendoGrid").setOptions({ editable: false });
                $("#gridPricebook").data("kendoGrid").setOptions({ editable: false });
                $("#btnAddOutlet").hide();
                $("#btnAddChannelOperation").hide();
                $("#btnAddTrade").hide();
                $("#btnAddPricebook").hide();
            }
        }

        if (DocumentStatusModel !== "" && DocumentStatusModel !== null && DocumentStatusModel !== undefined) {
            document.getElementById('lbldocstatus').innerHTML = "- " + DocumentStatusModel;
        }
        if (ApprovalStatusModel === "0") {
            document.getElementById('lblapprovestatus').innerHTML = 'Draft';
            $("#divBtnReject").hide();
            $("#divBtnApprove").hide();
            $("#divBtnSendBack").hide();
            $("#divbtnComplete").hide();
        }
        else if (ApprovalStatusModel === "4") {
            $('#divbtnSubmit').hide();
            $('#divbtnDraft').hide();
            $("#divbtnComplete").hide();
            document.getElementById('lblapprovestatus').innerHTML = 'In Process';
        }
        else if (ApprovalStatusModel === "1") {
            $('#divbtnSubmit').hide();
            $('#divbtnDraft').hide();
            $("#divBtnApprove").hide();
            $("#divBtnReject").hide();
            $("#divBtnSendBack").hide();
            document.getElementById('lblapprovestatus').innerHTML = 'Completed';
        }
        else if (ApprovalStatusModel === "2") {
            $('#divbtnSubmit').hide();
            $('#divbtnDraft').hide();
            document.getElementById('lblapprovestatus').innerHTML = 'Rejected';
            $("#divBtnReject").hide();
            $("#divBtnApprove").hide();
            $("#divBtnSendBack").hide();
            $("#divbtnComplete").hide();
        }
        else if (ApprovalStatusModel === "3") {
            document.getElementById('lblapprovestatus').innerHTML = 'Send Back';
            $('#divAttachment').show();
            $("#divBtnReject").hide();
            $("#divBtnApprove").hide();
            $("#divBtnSendBack").hide();
            $("#divbtnComplete").hide();
        }
        else if (ApprovalStatusModel === null || ApprovalStatusModel === undefined || ApprovalStatusModel === "") {
            $("#divBtnReject").hide();
            $("#divBtnApprove").hide();
            $("#divBtnSendBack").hide();
            $("#divbtnComplete").hide();
            document.getElementById('lblapprovestatus').innerHTML = 'Draft';
            document.getElementById('lbldocstatus').innerHTML = '- Created';
        }

        if (ApprovalStatusModel === "2" || ApprovalStatusModel === "1" || ApprovalStatusModel === "4") {
            gridOutLet.hideColumn("command");
            gridTrade.hideColumn("command");
            gridChannelOperation.hideColumn("command");
            gridPricebook.hideColumn("command");
            _gridAttachment.hideColumn("command");
        }
    }
}

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
$('#divdtInvoiceSettlementDate').datepicker({
    format: 'dd/mm/yyyy',
    todayBtn: 'linked',
    autoclose: true
});

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
        { field: "Approval1", title: "Approval 1 <br/> NKAM Manager", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval2", title: "Approval 2 <br/> Commersial Manager", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval3", title: "Approval 3 <br/> ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval4", title: "Approval 4 <br/> ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval5", title: "Approval 5 <br/> ", attributes: { class: "text-center" }, width: "130px", encoded: false }
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
        { field: "Approval1", title: "Approval 6 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval2", title: "Approval 7 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval3", title: "Approval 8 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval4", title: "Approval 9 ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval5", title: "Approval 10 ", attributes: { class: "text-center" }, width: "130px", encoded: false }
    ]
});

$('.attachmentInput').click(function () {
    $(".file-inputAttachment").trigger('click');
});
var uploadedFile = [];
$('.file-inputAttachment').change(function () {
    var filename = this.value;
    var lastIndex = filename.lastIndexOf("\\");
    var imgCont = "";
    if (lastIndex >= 0) {
        filename = filename.substring(lastIndex + 1);
    }
    var files = $('#file-inputAttachment')[0].files;
    res = Array.prototype.slice.call(files);
    for (var i = 0; i < files.length; i++) {
        if (files[i].size / 1024 > maxFileSize) {
            alert("File exceeding maximum allowed size!");
            delete files[i]
            return;
        }

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
        for (var k = 0; k < uploadedFile.length; k++) {
            if (uploadedFile[k] && uploadedFile[k].size) {
                totalSize += uploadedFile[k].size;
            }
        }

        if (totalSize / 1024 > maxUploadSize) {
            alert("Total uploaded file exceeding allowed size!");
            delete files[i]
            return;
        }

        var name = files[i].name;
        var extension = files[i].name.replace(/^.*\./, '');
        var fileSize = files[i].size / 1024; //in Kb
        getBase64(files[i], function (error, result) {
            if (!error) {
                uploadedFile.push({
                    id: (i + 1),
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
                $('.filename-containerAttachment').append("<div class='text-center' id='attachment-" + (i + 1) + "' style='display:inline' >" + imgCont + "<span  class='filename' style='font-size:8px;display:inline'>" + name + "</span></div>").show();
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
                name = uploadedFile[i].name
                uploadedFile.splice(i, 1);

            }
        }
        document.getElementById("file-inputAttachment").value = "";
    }
}

$('.attachmentPricingInput').click(function () {
    $(".attachmentPricingInputFile").trigger('click');
});
var uploadedPricingFile = [];
$('.file-inputAttachmentPricing').change(function () {
    var filename = this.value;
    var lastIndex = filename.lastIndexOf("\\");
    var imgCont = "";
    if (lastIndex >= 0) {
        filename = filename.substring(lastIndex + 1);
    }
    var files = $('#file-inputAttachmentPricing')[0].files;
    res = Array.prototype.slice.call(files);
    for (var i = 0; i < files.length; i++) {
        if (files[i].size / 1024 > maxFileSize) {
            alert("File exceeding maximum allowed size!");
            delete files[i]
            return;
        }

        for (var j = 0; j < uploadedPricingFile.length; j++) {
            if (uploadedPricingFile[j] && uploadedPricingFile[j].name === files[i].name) {
                if (!confirm("The attachment already contain file with name " + files[i].name + ". Do you want to replace?")) {
                    return;
                } else {
                    delete uploadedPricingFile[j];
                }
            }
        }

        var totalSize = files[i].size / 1024;
        for (var k = 0; k < uploadedPricingFile.length; k++) {
            if (uploadedPricingFile[k] && uploadedPricingFile[k].size) {
                totalSize += uploadedPricingFile[k].size;
            }
        }

        if (totalSize / 1024 > maxUploadSize) {
            alert("Total uploaded file exceeding allowed size!");
            delete files[i]
            return;
        }

        var name = files[i].name;
        var extension = files[i].name.replace(/^.*\./, '');
        var fileSize = files[i].size / 1024; //in Kb
        getBase64(files[i], function (error, result) {
            if (!error) {
                uploadedPricingFile.push({
                    id: (i + 1),
                    name: name,
                    content: result.substr(result.indexOf(',') + 1),
                    extension: extension,
                    url: '',
                    size: fileSize
                });

                if (extension.toLowerCase() === "png" || extension.toLowerCase() === "jpg" || extension.toLowerCase() === "jpeg") {
                    imgCont = "<img src='" + url_Web + "/images/image.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removePricingAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "xlsx" || extension.toLowerCase() === "xls") {
                    imgCont = "<img src='" + url_Web + "/images/excel.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removePricingAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "pdf") {
                    imgCont = "<img src='" + url_Web + "/images/pdf.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removePricingAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "doc" || extension.toLowerCase() === "docx") {
                    imgCont = "<img src='" + url_Web + "/images/word.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removePricingAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "ppt" || extension.toLowerCase() === "pptx") {
                    imgCont = "<img src='" + url_Web + "/images/ppt.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removePricingAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "msg") {
                    imgCont = "<img src='" + url_Web + "/images/mail.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removePricingAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else {
                    imgCont = "<img src='" + url_Web + "/images/document.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick='removePricingAttachment(" + (i + 1) + ")' style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                $('.filename-containerAttachmentPricing').append("<div class='text-center' id='attachment-" + (i + 1) + "' style='display:inline' >" + imgCont + "<span  class='filename' style='font-size:8px;display:inline'>" + name + "</span></div>").show();
            } else {
                alert(error);
            }
        });
    }
});

function removePricingAttachment(e) {
    if (confirm('Are you sure want to remove the attachment?')) {
        $('#attachment-' + e).remove();
        var name = '';
        for (var i = 0; i < uploadedPricingFile.length; i++) {
            if (uploadedPricingFile[i].id === e) {
                name = uploadedPricingFile[i].name
                uploadedPricingFile.splice(i, 1);

            }
        }
        document.getElementById("file-inputAttachmentPricing").value = "";
    }
}

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

$("input[name='prmPriceCon']").change(function () {
    var valueChecked = $("input[name='prmPriceCon']:checked").val();
    if (valueChecked === "ChannelOperation") {
        document.getElementById('vwByOutlet').style.display = "none";
        document.getElementById('vwByChannelOperation').style.display = "block";
        document.getElementById('vwByChannelTradename').style.display = "none";
        document.getElementById('vwByPricebook').style.display = "none";
    }
    else if (valueChecked === "Outlet") {
        document.getElementById('vwByOutlet').style.display = "block";
        document.getElementById('vwByChannelOperation').style.display = "none";
        document.getElementById('vwByChannelTradename').style.display = "none";
        document.getElementById('vwByPricebook').style.display = "none";
    }
    else if (valueChecked === "ChannelTradename") {
        document.getElementById('vwByOutlet').style.display = "none";
        document.getElementById('vwByChannelOperation').style.display = "none";
        document.getElementById('vwByChannelTradename').style.display = "block";
        document.getElementById('vwByPricebook').style.display = "none";
    }
    else {
        document.getElementById('vwByOutlet').style.display = "none";
        document.getElementById('vwByChannelOperation').style.display = "none";
        document.getElementById('vwByChannelTradename').style.display = "none";
        document.getElementById('vwByPricebook').style.display = "block";
    }
});

var gridOutLet, gridChannelOperation, gridTrade, gridPricebook;
var approval1s, approval2s;
var ddlCustNameData, ddlMaterialData, ddlOperationData, ddlChannelData, ddlTradeNameData, dllOperationData, ddlSubChannelData, ddlPricebookData;
var ddtOpsFlow;

$(document).ready(function () {
    startSpinner('loading..', 1);
    initTabStrip();

    $("#txtPricingSetupRequestNumber").prop('disabled', true);
    $("#txtRequestor").prop('disabled', true);
    $("#txtCreatedDate").prop('disabled', true);
    $("#txtRequestor").prop('disabled', true);
    $("#txtProgCat").prop('disabled', true);
    $("#allPricingAttachment").hide();
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
                $.ajax({
                    type: "GET",
                    url: MAA_API_Server + 'masterData/getOperation?param=' + dataItem.Key,
                    async: true,
                    success: function (response) {
                        var dataRes = JSON.parse(response);
                        var newData = new kendo.data.DataSource({
                            data: dataRes
                        });
                        if (ddtOpsFlow !== undefined) {
                            ddtOpsFlow.setDataSource(newData);
                            ddtOpsFlow.refresh();

                            ddtOpsFlow.enable(true);
                        };
                    }
                });
            }
        });
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getOperation', function (data) {
        ddtOpsFlow = $("#txtOperation").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            optionLabel: "Select Operation",
            filter: "contains",
            index: 0
        }).data("kendoDropDownList");
        ddlOperationData = JSON.parse(data);
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getChannel', function (data) {
        $("#txtChannel").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            optionLabel: "Select Channel",
            filter: "contains",
            index: 0,
        });
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getMaterial', function (data) {
        ddlMaterialData = JSON.parse(data);
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getTradeName', function (data) {
        ddlTradeNameData = JSON.parse(data);
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getSubChannel', function (data) {
        ddlSubChannelData = JSON.parse(data);
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getPricebook', function (data) {
        ddlPricebookData = JSON.parse(data);
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getSubChannel', function (data) {
        ddlSubChannelData = JSON.parse(data);
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getMarket', function (data) {
        ddlChannelData = JSON.parse(data);
        numLoad -= 1;
    });

    gridOutLet = $("#gridOutLet").kendoGrid({
        dataSource: {
            data: dataGridOutlet,
            schema: {
                model: {
                    fields: {
                        CustID: { type: "string", validation: { required: true } },
                        CustName: { type: "string" },
                        MaterialID: { editable: false, nullable: false, validation: { required: true } },
                        MaterialGroup: { type: "string" },
                        HeldBasePrice: { type: "number", validation: { required: true, min: 1, defaultValue: "" } }
                    }
                }
            },
            pageSize: 20
        },
        columns: [
            { field: "CustName", title: "Customer Name", width: "25%", editor: ddlCustName, template: "#=CustName#" },
            { field: "MaterialGroup", title: "Material Group", width: "25%", editor: ddlMaterialOutlet, template: "#=MaterialGroup#" },
            { field: "HeldBasePrice", title: "Held Base Price", width: "25%", attributes: { class: "text-right" }, format: "{0:#,0}" },
            { field: "command", command: ["edit", "destroy"], title: "&nbsp;", width: "120px" }
        ],
        scrollable: true,
        sortable: true,
        filterable: false,
        editable: "inline",
        pageable: gridPage,
        noRecords: true
    }).data("kendoGrid");
    gridTrade = $("#gridTrade").kendoGrid({
        dataSource: {
            data: dataGridTrade,
            schema: {
                model: {
                    fields: {
                        ChannelID: { editable: false, nullable: false, validation: { required: true } },
                        Channel: { type: "string" },
                        TradeID: { editable: false, nullable: false, validation: { required: true } },
                        TradeName: { type: "string" },
                        MaterialID: { editable: false, nullable: false, validation: { required: true } },
                        MaterialGroup: { type: "string" },
                        HeldBasePrice: { type: "number", validation: { required: true, min: 1, defaultValue: "" } }
                    }
                }
            },
            pageSize: 20
        },
        columns: [
            { field: "Channel", title: "Market", width: "25%", editor: ddlChannel, template: "#=Channel#" },
            { field: "TradeName", title: "Trade Name", width: "25%", editor: ddlTrade, template: "#=TradeName#" },
            { field: "MaterialGroup", title: "Material Group", width: "25%", editor: ddlMaterialTrade, template: "#=MaterialGroup#" },
            { field: "HeldBasePrice", title: "Held Base Price", width: "25%", attributes: { class: "text-right" }, format: "{0:#,0}" },
            { field: "command", command: ["edit", "destroy"], title: "&nbsp;", width: "120px" }
        ],
        scrollable: true,
        sortable: true,
        filterable: false,
        editable: "inline",
        pageable: gridPage,
        noRecords: true
    }).data("kendoGrid");
    gridChannelOperation = $("#gridChannelOperation").kendoGrid({
        dataSource: {
            data: dataGridOperation,
            schema: {
                model: {
                    fields: {
                        ChannelID: { editable: false, nullable: false, validation: { required: true } },
                        Channel: { type: "string" },
                        OperationID: { editable: false, nullable: false, validation: { required: true } },
                        Operation: { type: "string" },
                        SubChannelID: { editable: false, nullable: false, validation: { required: true } },
                        SubChannel: { type: "string" },
                        MaterialID: { editable: false, nullable: false, validation: { required: true } },
                        MaterialGroup: { type: "string" },
                        HeldBasePrice: { type: "number", validation: { required: true, min: 1, defaultValue: "" } }
                    }
                }
            },
            pageSize: 20
        },
        columns: [
            { field: "Channel", title: "Market", width: "25%", editor: ddlChannelOps, template: "#=Channel#" },
            { field: "Operation", title: "Operation", width: "25%", editor: ddlOperation, template: "#=Operation#" },
            { field: "SubChannel", title: "Sub Channel", width: "25%", editor: ddlSubChannel, template: "#=SubChannel#" },
            { field: "MaterialGroup", title: "Material Group", width: "25%", editor: ddlMaterialOperation, template: "#=MaterialGroup#" },
            { field: "HeldBasePrice", title: "Held Base Price", width: "25%", attributes: { class: "text-right" }, format: "{0:#,0}" },
            { field: "command", command: ["edit", "destroy"], title: "&nbsp;", width: "120px" }
        ],
        scrollable: true,
        sortable: true,
        filterable: false,
        editable: "inline",
        pageable: gridPage,
        noRecords: true
    }).data("kendoGrid");
    gridPricebook = $("#gridPricebook").kendoGrid({
        dataSource: {
            data: dataGridPricebook,
            schema: {
                model: {
                    fields: {
                        PricebookID: { editable: false, nullable: false, validation: { required: true } },
                        Pricebook: { type: "string" },
                        MaterialID: { editable: false, nullable: false, validation: { required: true } },
                        MaterialGroup: { type: "string" },
                        HeldBasePrice: { type: "number", validation: { required: true, min: 1, defaultValue: "" } }
                    }
                }
            },
            pageSize: 20
        },
        columns: [
            { field: "Pricebook", title: "Pricebook", width: "25%", editor: ddlPricebook, template: "#=Pricebook#" },
            { field: "MaterialGroup", title: "Material Group", width: "25%", editor: ddlMaterialPricebook, template: "#=MaterialGroup#" },
            { field: "HeldBasePrice", title: "Held Base Price", width: "25%", attributes: { class: "text-right" }, format: "{0:#,0}" },
            { field: "command", command: ["edit", "destroy"], title: "&nbsp;", width: "120px" }
        ],
        scrollable: true,
        sortable: true,
        filterable: false,
        editable: "inline",
        pageable: gridPage,
        noRecords: true
    }).data("kendoGrid");
});

$('#btnAddOutlet').click(function () {
    var grid = $("#gridOutLet").data("kendoGrid");
    grid.addRow();
});
$('#btnAddChannelOperation').click(function () {
    var grid = $("#gridChannelOperation").data("kendoGrid");
    grid.addRow();
});
$('#btnAddTrade').click(function () {
    var grid = $("#gridTrade").data("kendoGrid");
    grid.addRow();
});
$('#btnAddPricebook').click(function () {
    var grid = $("#gridPricebook").data("kendoGrid");
    grid.addRow();
});

function ddlCustName(container, options) {
    var urlImages = url_Web + '/images/search.png';
    $('<input class="k-textbox" id=editorDDL' + options.field + ' style="width:75%;" type="text" />').appendTo(container);
    $('<button type="button" class="btn btn-info right-button" id=btnDDL' + options.field + ' style="width:5%;"><img src=' + urlImages + ' width="15" height="15"></img></button>').appendTo(container);
    $('#btnDDLCustName').click(function () {
        $("#editorDDLCustName").prop('disabled', true);
        $.ajax({
            type: "GET",
            url: MAA_API_Server + 'masterData/getCustomerName',
            data: { storeNo: $('#editorDDLCustName').val() },
            async: true,
            success: function (response) {
                $("#editorDDLCustName").prop('disabled', false);
                var dataRes = JSON.parse(response);
                if (dataRes.Success) {
                    var dataCust = JSON.parse(dataRes.Message);
                    var uid = gridOutLet.dataItem($(container).closest("tr")).uid;
                    gridOutLet.dataSource.getByUid(uid).set("CustID", dataCust.Storeno);
                    gridOutLet.dataSource.getByUid(uid).set("CustName", dataCust.Name2);
                    document.getElementById('editorDDLCustName').value = dataCust.Name2;
                };
            }
        });
    });
}

function ddlMaterialOutlet(container, options) {
    $("<input required  data-bind='value:MaterialGroup'  />")
        .attr("MaterialID", "ddl_material")
        .appendTo(container)
        .kendoDropDownList({
            dataSource: ddlMaterialData,
            dataTextField: "Value",
            dataValueField: "Value",
            optionLabel: "Select Material Group",
            filter: "contains",
            template: "<span data-id='${data.Key}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var MaterialItem = gridOutLet.dataItem($(e.sender.element).closest("tr"));
                MaterialItem.MaterialID = id;
            }
        });
}

function ddlChannel(container, options) {
    $("<input required data-bind='value:Channel'  />")
        .attr("ChannelID", "ddl_custname")
        .appendTo(container)
        .kendoDropDownList({
            dataSource: ddlChannelData,
            dataTextField: "Value",
            dataValueField: "Value",
            optionLabel: "Select Market",
            filter: "contains",
            template: "<span data-id='${data.Key}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var ChannelItem = gridTrade.dataItem($(e.sender.element).closest("tr"));
                ChannelItem.ChannelID = id;
            }
        });
}

function ddlTrade(container, options) {
    $("<input required data-bind='value:TradeName'  />")
        .attr("TradeID", "ddl_trade")
        .appendTo(container)
        .kendoDropDownList({
            dataSource: ddlTradeNameData,
            dataTextField: "Value",
            dataValueField: "Value",
            optionLabel: "Select Trade Name",
            filter: "contains",
            template: "<span data-id='${data.Key}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var TradeItem = gridTrade.dataItem($(e.sender.element).closest("tr"));
                TradeItem.TradeID = id;
            }
        });
}

function ddlMaterialTrade(container, options) {
    $("<input required  data-bind='value:MaterialGroup'  />")
        .attr("MaterialID", "ddl_material")
        .appendTo(container)
        .kendoDropDownList({
            dataSource: ddlMaterialData,
            dataTextField: "Value",
            dataValueField: "Value",
            optionLabel: "Select Material Group",
            filter: "contains",
            template: "<span data-id='${data.Key}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var MaterialItem = gridTrade.dataItem($(e.sender.element).closest("tr"));
                MaterialItem.MaterialID = id;
            }
        });
}

function ddlChannelOps(container, options) {
    $("<input required data-bind='value:Channel'  />")
        .attr("ChannelID", "ddl_ops")
        .appendTo(container)
        .kendoDropDownList({
            dataSource: ddlChannelData,
            dataTextField: "Value",
            dataValueField: "Value",
            optionLabel: "Select Market",
            filter: "contains",
            template: "<span data-id='${data.Key}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var ChannelItem = gridChannelOperation.dataItem($(e.sender.element).closest("tr"));
                ChannelItem.ChannelID = id;
            }
        });
}

function ddlOperation(container, options) {
    $("<input required  data-bind='value:Operation'  />")
        .attr("OperationID", "ddl_operation")
        .appendTo(container)
        .kendoDropDownList({
            dataSource: ddlOperationData,
            dataTextField: "Value",
            dataValueField: "Value",
            optionLabel: "Select Operation",
            filter: "contains",
            template: "<span data-id='${data.Key}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var OpsItem = gridChannelOperation.dataItem($(e.sender.element).closest("tr"));
                OpsItem.OperationID = id;
            }
        });
}

function ddlSubChannel(container, options) {
    $("<input required  data-bind='value:SubChannel'  />")
        .attr("SubChannelID", "ddl_subchannel")
        .appendTo(container)
        .kendoDropDownList({
            dataSource: ddlSubChannelData,
            dataTextField: "Value",
            dataValueField: "Value",
            optionLabel: "Select Sub Channel",
            filter: "contains",
            template: "<span data-id='${data.Key}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var subChannelItem = gridChannelOperation.dataItem($(e.sender.element).closest("tr"));
                subChannelItem.SubChannelID = id;
            }
        });
}

function ddlMaterialOperation(container, options) {
    $("<input required  data-bind='value:MaterialGroup'  />")
        .attr("MaterialID", "ddl_material")
        .appendTo(container)
        .kendoDropDownList({
            dataSource: ddlMaterialData,
            dataTextField: "Value",
            dataValueField: "Value",
            optionLabel: "Select Material Group",
            filter: "contains",
            template: "<span data-id='${data.Key}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var MaterialItem = gridChannelOperation.dataItem($(e.sender.element).closest("tr"));
                MaterialItem.MaterialID = id;
            }
        });
}

function ddlPricebook(container, options) {
    $("<input required  data-bind='value:Pricebook'  />")
        .attr("PricebookID", "ddl_material")
        .appendTo(container)
        .kendoDropDownList({
            dataSource: ddlPricebookData,
            dataTextField: "Value",
            dataValueField: "Value",
            optionLabel: "Select Pricebook",
            filter: "contains",
            template: "<span data-id='${data.Key}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var pricebookItem = gridPricebook.dataItem($(e.sender.element).closest("tr"));
                pricebookItem.PricebookID = id;
            }
        });
}

function ddlMaterialPricebook(container, options) {
    $("<input required  data-bind='value:MaterialGroup'  />")
        .attr("MaterialID", "ddl_material")
        .appendTo(container)
        .kendoDropDownList({
            dataSource: ddlMaterialData,
            dataTextField: "Value",
            dataValueField: "Value",
            optionLabel: "Select Material Group",
            filter: "contains",
            template: "<span data-id='${data.Key}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var MaterialItem = gridPricebook.dataItem($(e.sender.element).closest("tr"));
                MaterialItem.MaterialID = id;
            }
        });
}

var _gridAttachment;
function bindingAttachment(data) {
    _gridAttachment = $("#gridAttachment").kendoGrid({
        dataSource: {
            data: data,
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
                field: "Name", width: "40%", attributes: { class: "text-center" },
                template: "# {#<a href='#=Url#' target='_blank'>#:Name#</a>#} #",
                title: "Attachment Name"
            },
            {
                field: "Extension", title: "Extension", width: "40%", attributes: { class: "text-center" }
            },
            { field:"command", command: { text: "Delete", click: RemoveAttachmentAzure }, title: "&nbsp;", width: "20%" }
        ]
    }).data("kendoGrid");
}

function RemoveAttachmentAzure(e) {
    var allowRemove = false;
    if (ApprovalStatusModel === "0" || ApprovalStatusModel === "3") {
        allowRemove = true;
    };
    if (allowRemove) {
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        swal({
            type: 'warning',
            title: 'Warning',
            html: 'Are you sure want to remove ' + dataItem.Name + ' ?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then(function (isConfirm) {
            if (isConfirm.value) {
                startSpinner('loading..', 1);
                var dataPos = {
                    Name: dataItem.Name,
                    Extension: dataItem.Extension,
                    Url: dataItem.Url,
                    UrlNoAzurePath: dataItem.UrlNoAzurePath,
                };

                $.ajax({
                    type: "POST",
                    url: MAA_API_Server + 'HBP/RemoveAttachment',
                    data: dataPos,
                    success: function (response) {
                        if (response.message.includes("OK")) {
                            var dataRow = _gridAttachment.dataSource.getByUid(dataItem.uid);
                            _gridAttachment.dataSource.remove(dataRow);
                            for (var i = 0; i < attachment.length; i++) {
                                if (attachment[i].UrlNoAzurePath == dataItem.UrlNoAzurePath) {
                                    attachment.splice(i, 1);
                                    break;
                                }
                            }

                            startSpinner('loading..', 0);
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
            };
        });
    };
}

function bindingPricingAttachment(data) {
    $("#gridAttachmentPricing").kendoGrid({
        dataSource: {
            data: data,
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
    });
}

var gridPage = {
    info: true,
    refresh: true,
    pageSizes: true,
    previousNext: true,
    numeric: true
};

var validationMessage = '';
function validation() {
    validationMessage = '';
    var adaIsi = false;
    var adaPendingInput = false;
    if ($('#txtRegion').val() === "-1" || $('#txtRegion').val() === undefined || $('#txtRegion').val() === "") {
        validationMessage += "Please choose Region." + "\n";
    }
    if ($('#txtOperation').val() === "-1" || $('#txtOperation').val() === undefined || $('#txtOperation').val() === "") {
        validationMessage += "Please choose Operation." + "\n";
    }
    if ($('#txtChannel').val() === "-1" || $('#txtChannel').val() === undefined || $('#txtChannel').val() === "") {
        validationMessage += "Please choose Channel." + "\n";
    }
    if (uploadedFile.length <= 0 && attachment.length <= 0) {
        validationMessage += "No file uploaded." + "\n";
    }
    //if (uploadedPricingFile.length <= 0) {
    //    validationMessage += "No file pricing uploaded." + "\n";
    //}
    if ($("input[name='prmPriceCon']:checked").val() === undefined) {
        validationMessage += "Please input Price Condition." + "\n";
    }
    else if ($("input[name='prmPriceCon']:checked").val() === "Outlet" && gridOutLet.dataSource._total <= 0) {
        validationMessage += "Please input Held Base Price By Outlet." + "\n";
    }
    else if ($("input[name='prmPriceCon']:checked").val() === "Outlet" && gridOutLet.dataSource._total > 0) {
        adaIsi = false;
        adaPendingInput = false;
        for (var a = 0; a < gridOutLet.dataSource.data().length; a++) {
            if (gridOutLet.dataSource.data()[a].CustID !== "" &&
                gridOutLet.dataSource.data()[a].MaterialID !== "" &&
                gridOutLet.dataSource.data()[a].CustID !== undefined &&
                gridOutLet.dataSource.data()[a].MaterialID !== undefined &&
                gridOutLet.dataSource.data()[a].HeldBasePrice > 0) {
                adaIsi = true;
            }
            if (gridOutLet.dataSource.data()[a].CustID === "" ||
                gridOutLet.dataSource.data()[a].MaterialID === "" ||
                gridOutLet.dataSource.data()[a].CustID === undefined ||
                gridOutLet.dataSource.data()[a].MaterialID === undefined ||
                gridOutLet.dataSource.data()[a].HeldBasePrice <= 0) {
                adaPendingInput = true;
            }
        }
        if (!adaIsi || adaPendingInput) {
            validationMessage += "Please input Held Base Price By Outlet." + "\n";
        }
    }
    else if ($("input[name='prmPriceCon']:checked").val() === "ChannelOperation" && gridChannelOperation.dataSource._total <= 0) {
        validationMessage += "Please input Held Base Price By Channel & Operation Region." + "\n";
    }
    else if ($("input[name='prmPriceCon']:checked").val() === "ChannelOperation" && gridChannelOperation.dataSource._total > 0) {
        adaIsi = false;
        adaPendingInput = false;
        for (var a = 0; a < gridChannelOperation.dataSource.data().length; a++) {
            if (gridChannelOperation.dataSource.data()[a].ChannelID !== "" &&
                gridChannelOperation.dataSource.data()[a].OperationID !== "" &&
                gridChannelOperation.dataSource.data()[a].SubChannelID !== "" &&
                gridChannelOperation.dataSource.data()[a].MaterialID !== "" &&
                gridChannelOperation.dataSource.data()[a].ChannelID !== undefined &&
                gridChannelOperation.dataSource.data()[a].OperationID !== undefined &&
                gridChannelOperation.dataSource.data()[a].SubChannelID !== undefined &&
                gridChannelOperation.dataSource.data()[a].MaterialID !== undefined &&
                gridChannelOperation.dataSource.data()[a].HeldBasePrice > 0) {
                adaIsi = true;
            }
            if (gridChannelOperation.dataSource.data()[a].ChannelID === "" ||
                gridChannelOperation.dataSource.data()[a].OperationID === "" ||
                gridChannelOperation.dataSource.data()[a].SubChannelID === "" ||
                gridChannelOperation.dataSource.data()[a].MaterialID === "" ||
                gridChannelOperation.dataSource.data()[a].ChannelID === undefined ||
                gridChannelOperation.dataSource.data()[a].OperationID === undefined ||
                gridChannelOperation.dataSource.data()[a].SubChannelID === undefined ||
                gridChannelOperation.dataSource.data()[a].MaterialID === undefined ||
                gridChannelOperation.dataSource.data()[a].HeldBasePrice <= 0) {
                adaPendingInput = true;
            }
        }
        if (!adaIsi || adaPendingInput) {
            validationMessage += "Please input Held Base Price By Channel & Operation Region." + "\n";
        }
    }
    else if ($("input[name='prmPriceCon']:checked").val() === "ChannelTradename" && gridTrade.dataSource._total <= 0) {
        validationMessage += "Please input Held Base Price By Channel & Trade Name." + "\n";
    }
    else if ($("input[name='prmPriceCon']:checked").val() === "ChannelTradename" && gridTrade.dataSource._total > 0) {
        adaIsi = false;
        adaPendingInput = false;
        for (var a = 0; a < gridTrade.dataSource.data().length; a++) {
            if (gridTrade.dataSource.data()[a].ChannelID !== "" &&
                gridTrade.dataSource.data()[a].TradeID !== "" &&
                gridTrade.dataSource.data()[a].MaterialID !== "" &&
                gridTrade.dataSource.data()[a].ChannelID !== undefined &&
                gridTrade.dataSource.data()[a].TradeID !== undefined &&
                gridTrade.dataSource.data()[a].MaterialID !== undefined &&
                gridTrade.dataSource.data()[a].HeldBasePrice > 0) {
                adaIsi = true;
            }
            if (gridTrade.dataSource.data()[a].ChannelID === "" ||
                gridTrade.dataSource.data()[a].TradeID === "" ||
                gridTrade.dataSource.data()[a].MaterialID === "" ||
                gridTrade.dataSource.data()[a].ChannelID === undefined ||
                gridTrade.dataSource.data()[a].TradeID === undefined ||
                gridTrade.dataSource.data()[a].MaterialID === undefined ||
                gridTrade.dataSource.data()[a].HeldBasePrice <= 0) {
                adaPendingInput = true;
            }
        }
        if (!adaIsi || adaPendingInput) {
            validationMessage += "Please input Held Base Price By Channel & Trade Name." + "\n";
        }
    }
    else if ($("input[name='prmPriceCon']:checked").val() === "Pricebook" && gridPricebook.dataSource._total <= 0) {
        validationMessage += "Please input Held Base Price By Pricebook." + "\n";
    }
    else if ($("input[name='prmPriceCon']:checked").val() === "Pricebook" && gridPricebook.dataSource._total > 0) {
        adaIsi = false;
        adaPendingInput = false;
        for (var a = 0; a < gridPricebook.dataSource.data().length; a++) {
            if (gridPricebook.dataSource.data()[a].PricebookID !== "" &&
                gridPricebook.dataSource.data()[a].MaterialID !== "" &&
                gridPricebook.dataSource.data()[a].PricebookID !== undefined &&
                gridPricebook.dataSource.data()[a].MaterialID !== undefined &&
                gridPricebook.dataSource.data()[a].HeldBasePrice > 0) {
                adaIsi = true;
            }
            if (gridPricebook.dataSource.data()[a].PricebookID === "" ||
                gridPricebook.dataSource.data()[a].MaterialID === "" ||
                gridPricebook.dataSource.data()[a].PricebookID === undefined ||
                gridPricebook.dataSource.data()[a].MaterialID === undefined ||
                gridPricebook.dataSource.data()[a].HeldBasePrice <= 0) {
                adaPendingInput = true;
            }
        }
        if (!adaIsi || adaPendingInput) {
            validationMessage += "Please input Held Base Price By Pricebook." + "\n";
        }
    }

    if (isNaN(Date.parse($('#divFromActivityPeriod').datepicker('getDate')))) {
        validationMessage += "Validity Date From is empty." + "\n";
    }
    if (isNaN(Date.parse($('#divFromActivityPeriodTo').datepicker('getDate')))) {
        validationMessage += "Validity Date To is empty." + "\n";
    }
}

$('#btnSave').click(function () {
    validation();
    if (validationMessage !== "") {
        startSpinner('loading..', 0);
        validationForm(validationMessage);
    }
    else {
        startSpinner('loading..', 1);
        var saveReq = {
            HBPNumber: $("#txtPricingSetupRequestNumber").val(),
            Region: $('#txtRegion').val(),
            Operation: $('#txtOperation').val(),
            Channel: $('#txtChannel').val(),
            Requestor: $('#txtRequestor').val(),
            PriceCondition: $("input[name='prmPriceCon']:checked").val(),
            ProgramCategory: $('#txtProgCat').val(),
            ValidStrFrom: $("#divFromActivityPeriod").datepicker('getDate'),
            ValidStrTo: $("#divFromActivityPeriodTo").datepicker('getDate'),
            attachment: uploadedFile,
            //pricingAttachment: uploadedPricingFile,
            ApprovalStatus: "4",
            DocumentStatus: "Waiting Approval",
            byOutletStr: JSON.stringify(gridOutLet.dataSource.data().toJSON()),
            byTradeStr: JSON.stringify(gridTrade.dataSource.data().toJSON()),
            byOpsStr: JSON.stringify(gridChannelOperation.dataSource.data().toJSON()),
            byPricebookStr: JSON.stringify(gridPricebook.dataSource.data().toJSON()),
            RequestorName: $('#txtRequestor').val(),
            RequestorPositionID: $("#RequestorPositionID").val(),
            RequestorPosition: $("#RequestorPosition").val(),
            RequestorPINID: $('#RequestorPINID').val(),
            CreatedBy: $('#CreatedBy').val(),
            CreatedDate: new Date(dateServer).toJSON()
        };
        $.ajax({
            type: "POST",
            url: MAA_API_Server + 'HBP/SaveData',
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
});

$('#btnDraft').click(function () {
    startSpinner('loading..', 1);
    var saveReq = {
        HBPNumber: $("#txtPricingSetupRequestNumber").val(),
        Region: $('#txtRegion').val(),
        Operation: $('#txtOperation').val(),
        Channel: $('#txtChannel').val(),
        Requestor: $('#txtRequestor').val(),
        PriceCondition: $("input[name='prmPriceCon']:checked").val(),
        ProgramCategory: $('#txtProgCat').val(),
        ValidStrFrom: $("#divFromActivityPeriod").datepicker('getDate'),
        ValidStrTo: $("#divFromActivityPeriodTo").datepicker('getDate'),
        attachment: uploadedFile,
        //pricingAttachment: uploadedPricingFile,
        ApprovalStatus: "0",
        DocumentStatus: "Created",
        byOutletStr: JSON.stringify(gridOutLet.dataSource.data().toJSON()),
        byTradeStr: JSON.stringify(gridTrade.dataSource.data().toJSON()),
        byOpsStr: JSON.stringify(gridChannelOperation.dataSource.data().toJSON()),
        byPricebookStr: JSON.stringify(gridPricebook.dataSource.data().toJSON()),
        RequestorName: $('#txtRequestor').val(),
        RequestorPositionID: $("#RequestorPositionID").val(),
        RequestorPosition: $("#RequestorPosition").val(),
        RequestorPINID: $('#RequestorPINID').val(),
        CreatedBy: $('#CreatedBy').val(),
        CreatedDate: new Date(dateServer).toJSON()
    };
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'HBP/SaveData',
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
});

$('#btnApprove').click(function () {
    startSpinner('loading..', 1);
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'HBP/Approve?id=' + document.getElementById('txtPricingSetupRequestNumber').value,
        data: document.getElementById('txtPricingSetupRequestNumber').value,
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
});

$('#btnReject').click(function () {
    startSpinner('loading..', 1);
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'HBP/Reject?id=' + document.getElementById('txtPricingSetupRequestNumber').value,
        data: document.getElementById('txtPricingSetupRequestNumber').value,
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

$('#btnSendBack').click(function () {
    startSpinner('loading..', 1);
    var saveReq = {
        HBPNumber: $("#txtPricingSetupRequestNumber").val(),
        Region: $('#txtRegion').val(),
        Operation: $('#txtOperation').val(),
        Channel: $('#txtChannel').val(),
        Requestor: $('#txtRequestor').val(),
        PriceCondition: $("input[name='prmPriceCon']:checked").val(),
        ProgramCategory: $('#txtProgCat').val(),
        ValidStrFrom: $("#divFromActivityPeriod").datepicker('getDate'),
        ValidStrTo: $("#divFromActivityPeriodTo").datepicker('getDate'),
        attachment: uploadedFile,
        //pricingAttachment: uploadedPricingFile,
        ApprovalStatus: "3",
        DocumentStatus: "Waiting Approval",
        byOutletStr: JSON.stringify(gridOutLet.dataSource.data().toJSON()),
        byTradeStr: JSON.stringify(gridTrade.dataSource.data().toJSON()),
        byOpsStr: JSON.stringify(gridChannelOperation.dataSource.data().toJSON()),
        byPricebookStr: JSON.stringify(gridPricebook.dataSource.data().toJSON())
    };
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'HBP/SendBack',
        data: saveReq,
        beforeSend: function () {
            //loading icon...
        },
        success: function (response) {
            if (response.message.includes("OK")) {
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

$('#btnComplete').click(function () {
    validationMessage = "";
    if (uploadedPricingFile.length <= 0) {
        validationMessage += "No file pricing uploaded." + "\n";
    }
    if (validationMessage !== "") {
        startSpinner('loading..', 0);
        validationForm(validationMessage);
    }
    else {
        startSpinner('loading..', 1);
        var saveReq = {
            HBPNumber: $("#txtPricingSetupRequestNumber").val(),
            pricingAttachment: uploadedPricingFile
        };
        $.ajax({
            type: "POST",
            url: MAA_API_Server + 'HBP/CompleteData',
            data: saveReq,
            beforeSend: function () {
                //loading icon...
            },
            success: function (response) {
                if (response.message === "OK") {
                    startSpinner('loading..', 0);
                    swal({
                        type: 'success',
                        title: 'Success',
                        text: 'Complete Successfully'
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