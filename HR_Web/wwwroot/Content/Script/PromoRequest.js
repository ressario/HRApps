var numLoad = 10;
var loadInterval = setInterval(checkCallback, 2000);

function checkCallback() {
    if (numLoad <= 0) {
        window.clearInterval(loadInterval);
        startSpinner('loading..', 0);

        if (!PromoNumberModel) {
            document.getElementById('txtCreatedDate').value = generateCreateDate();

            $('#divAttachment')[0].style.display = "block";

            var d = new Date();
            $('#divFromActivityPeriod').datepicker('setStartDate', new Date(d.valueOf() + (1000 * 3600 * 24 * POIPromoStart)));

            if (RequestorName != "") {
                document.getElementById('txtRequestor').value = RequestorName;
            }
            if (DepartmentName != "") {
                document.getElementById('txtDepartment').value = DepartmentName;
            }
            document.getElementById('txtPromoUpReqNumber').value = "POI/NO-" + generateAutoNumber($("#txtRequestor").val());

            $("input[name=tName][value=N]").attr('checked', 'checked');
            $("input[name=tName]").trigger("change");
            $('input[name=tName]').prop('disabled', true);
        }
        else {
            document.getElementById('txtPromoUpReqNumber').value = PromoNumberModel;
            document.getElementById('txtCreatedDate').value = createdDateModel;
            document.getElementById('txtRequestor').value = RequestorName;

            if (PromoPerFrom) {
                var tempFrom = PromoPerFrom;
                PromoPerFrom = formateDate(toMMDDYYYYDate(PromoPerFrom));
                $('#divFromActivityPeriod').datepicker({
                    dateFormat: 'dd/mm/yyyy'
                }).datepicker('setDate', toMMDDYYYYDate(tempFrom));

                document.getElementById('divFromActivityPeriod').value = PromoPerFrom;
                document.getElementById('txtPeriodFrom').value = PromoPerFrom;
            }

            if (PromoPerTo) {
                var tempTo = PromoPerTo;
                PromoPerTo = formateDate(toMMDDYYYYDate(PromoPerTo));
                //PromoPerTo = toMMDDYYYY(PromoPerTo);
                $('#divFromActivityPeriodTo').datepicker({
                    dateFormat: 'dd/mm/yyyy'
                }).datepicker('setDate', toMMDDYYYYDate(tempTo));
                document.getElementById('divFromActivityPeriodTo').value = PromoPerTo;
                document.getElementById('txtPeriodTo').value = PromoPerTo;
            }
            $("#txtRegion").data('kendoDropDownList').value(OpRegion);
            $("#txtOperation").data('kendoDropDownList').value(OperationName);
            $("#optMarket").data('kendoDropDownList').value(Opmarket);
            $("#optChannel").data('kendoDropDownList').value(Opchan);
            if (ProgramCategory !== null && ProgramCategory !== undefined && ProgramCategory !== "") {
                $("input[name=prmCategory][value=" + ProgramCategory + "]").attr('checked', 'checked');
            }
            $("#optPromoType").data('kendoDropDownList').value(PromotypeType);
            if (ApprovalStatusModel === "0") { AllTradeName = "N"; }
            if (AllTradeName === null || AllTradeName === undefined || AllTradeName === "") { AllTradeName = "N";}
            $("input[name=tName][value=" + AllTradeName + "]").attr('checked', 'checked');
            $("input[name='tName']").trigger("change");
            $('input[name=tName]').prop('disabled', true);

            document.getElementById('txtPrgName').value = ProgramName;
            document.getElementById('divFromActivityPeriodTo').value = formateDate(PromoPerTo);
            $('#divAttachment')[0].style.display = "none";
            bindGridAttachment(attachments);

            ddtOpsPromo.value(JSON.parse(dataOpsPromo));
            ddtTradeChannelPromo.value(JSON.parse(dataTradeChannelPromo));
            ddtSalesDistrict.value(JSON.parse(dataSalesDistrictPromo));
            ddtCustTypePromo.value(JSON.parse(dataCustTypePromo));
            if (PromotionID !== "") {
                document.getElementById('txtPromoID').value = PromotionID;
            }
        }

        $("#txtPromoID").prop('disabled', true);
        $("#txtPromoUpReqNumber").prop('disabled', true);
        $("#txtRequestor").prop('disabled', true);
        $("#txtDepartment").prop('disabled', true);
        $("#txtCreatedDate").prop('disabled', true);
        $("#txtPrgCategory").prop('disabled', true);

        if (DocumentStatusModel !== "" && DocumentStatusModel !== null && DocumentStatusModel !== undefined) {
            document.getElementById('lbldocstatus').innerHTML = "- " + DocumentStatusModel;
        }
        if (ApprovalStatusModel === "0") {
            document.getElementById('lblapprovestatus').innerHTML = 'Draft';
            $('#divAttachment')[0].style.display = "block";
            $("#divbtnReject").hide();
            $("#divbtnApprove").hide();
            $("#divbtnSendBack").hide();
            $("#divbtnComplete").hide();
        }
        else if (ApprovalStatusModel === "4") {
            $('#divbtnSubmit').hide();
            $('#divbtnDraft').hide();
            document.getElementById('lblapprovestatus').innerHTML = 'In Process';
            $("#divbtnComplete").hide();
        }
        else if (ApprovalStatusModel === "1") {
            $('#divbtnSubmit').hide();
            $('#divbtnDraft').hide();
            $("#divbtnReject").hide();
            $("#divbtnApprove").hide();
            $("#divbtnSendBack").hide();
            document.getElementById('lblapprovestatus').innerHTML = 'Completed';
            if (PromotionID === "") {
                $("#divbtnComplete").show();
                $('#txtPromoID').prop('disabled', false);
            }
            else {
                $("#divbtnComplete").hide();
            }
        }
        else if (ApprovalStatusModel === "2") {
            $('#divbtnSubmit').hide();
            $('#divbtnDraft').hide();
            $("#divbtnReject").hide();
            $("#divbtnApprove").hide();
            $("#divbtnSendBack").hide();
            $("#divbtnComplete").hide();
            document.getElementById('lblapprovestatus').innerHTML = 'Rejected';
        }
        else if (ApprovalStatusModel === "3") {
            document.getElementById('lblapprovestatus').innerHTML = 'Send Back';
            $('#divAttachment')[0].style.display = "block";
            $("#divbtnReject").hide();
            $("#divbtnApprove").hide();
            $("#divbtnSendBack").hide();
            $("#divbtnComplete").hide();
        }
        else if (ApprovalStatusModel === null || ApprovalStatusModel === undefined || ApprovalStatusModel === "") {
            $("#divbtnReject").hide();
            $("#divbtnApprove").hide();
            $("#divbtnSendBack").hide();
            $("#divbtnComplete").hide();
            document.getElementById('lblapprovestatus').innerHTML = 'Draft';
            document.getElementById('lbldocstatus').innerHTML = '- Created';
        }

        if (ApprovalStatusModel === "1" || ApprovalStatusModel === "2" || ApprovalStatusModel === "4") {
            $('#divAttachment').hide();
            $('#divbtnSubmit').hide();
            $('#divbtnDraft').hide();
            $("#txtRegion").data('kendoDropDownList').enable(false);
            $('#txtOperation').data('kendoDropDownList').enable(false);
            $('#optMarket').data('kendoDropDownList').enable(false);
            $('#optChannel').data('kendoDropDownList').enable(false);
            $('#txtPrgName').prop('disabled', true);
            $('#txtPrgCategory').prop('disabled', true);
            $('#optPromoType').data('kendoDropDownList').enable(false);
            $('input[name=prmCategory]').prop('disabled', true);
            $('#txtPeriodFrom').show();
            $('#txtPeriodTo').show();
            $('#divFromActivityPeriod').hide();
            $('#divFromActivityPeriodTo').hide();
            $('#txtOperationPromo').data('kendoDropDownTree').enable(false);
            $('#optSubTChannel').data('kendoDropDownTree').enable(false);
            $('#optSalesDistrict').data('kendoDropDownTree').enable(false);
            $('#optCustomerType').data('kendoDropDownTree').enable(false);
            $('input[name=tName]').prop('disabled', true);
            $('#btnAddQtyScale').prop('disabled', true);
            $('#btnAddTrade').prop('disabled', true);
            $('#btnAddConsMat').prop('disabled', true);
            $('#btnAddRwdMat').prop('disabled', true);
            $("#gridQuantity").data("kendoGrid").setOptions({ editable: false }); 
            $("#gridTradeName").data("kendoGrid").setOptions({ editable: false }); 
            $("#gridConsMaterial").data("kendoGrid").setOptions({ editable: false }); 
            $("#gridRwdMaterial").data("kendoGrid").setOptions({ editable: false }); 
            _gridAttachment.hideColumn("command");
            gridQuantity.hideColumn("command");
            gridTradeName.hideColumn("command");
            gridConsMaterial.hideColumn("command");
            gridRwdMaterial.hideColumn("command");

            $("#btnAddQtyScale").hide();
            $("#btnAddTrade").hide();
            $("#btnAddConsMat").hide();
            $("#btnAddRwdMat").hide();
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

$("input[name='tName']").change(function () {
    if ($("input[name='tName']:checked").val() === "Y") {
        $('#gridTradeName')[0].style.display = "none";
        $('#btnAddTrade')[0].style.display = "none";
        document.getElementById('vwTrade').style.display = "none";
    }
    else {
        $('#gridTradeName')[0].style.display = "block";
        $('#btnAddTrade')[0].style.display = "block";
        document.getElementById('vwTrade').style.display = "block";
    }
});

var ApprovalList1 = [];
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

var ApprovalList2 = [];
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


$("i").click(function () {
    $("input[type='file']").trigger('click');
});
var uploadedFile = [];
$('#fileInput').change(function () {
    var filename = this.value;
    var lastIndex = filename.lastIndexOf("\\");
    var imgCont = "";
    if (lastIndex >= 0) {
        filename = filename.substring(lastIndex + 1);
    }
    var files = $('#fileInput')[0].files;
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
                name = uploadedFile[i].name
                uploadedFile.splice(i, 1);

            }
        }
        document.getElementById("fileInput").value = "";
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
var _gridAttachment;
function bindGridAttachment(response) {
    _gridAttachment = $("#gridAttachment").kendoGrid({
        dataSource: {
            data: response,
            schema: {
                model: {
                    fields: {
                        Name: { type: "string" },
                        Extension: { type: "string" },
                        Url: { type: "string" },
                        UrlNoAzurePath: { type: "string" },
                    }
                }

            },

            pageSize: 10

        },
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
            { field: "command", command: { text: "Delete", click: RemoveAttachmentAzure }, title: "&nbsp;", width: "20%" }
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
                    url: MAA_API_Server + 'PromoOnInvoice/POIRemoveAttachment',
                    data: dataPos,
                    success: function (response) {
                        if (response.message.includes("OK")) {
                            var dataRow = _gridAttachment.dataSource.getByUid(dataItem.uid);
                            _gridAttachment.dataSource.remove(dataRow);
                            for (var i = 0; i < attachments.length; i++) {
                                if (attachments[i].UrlNoAzurePath == dataItem.UrlNoAzurePath) {
                                    attachments.splice(i, 1);
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

var gridQuantity;
var gridTradeName;
var ddlTradeNameData = [];
var ddlCustNameData = [];
var gridConsMaterial;
var ddlMaterialData = [];
var gridRwdMaterial;
var inputPercentDiscPerCase = false;
var inputDiscPerCase = false;
var inputNewPricePerCase = false;
var isMandatoryReward = true;
var dataPromoProgram = [];
var dataMaterialNumCons, dataMaterialNumRwd;
var itemKendoMaterialNum, itemKendoMaterialNumRwd, itemCustName, itemPricePerCase;

var ddtOpsPromo, ddtTradeChannelPromo, ddtSalesDistrict, ddtCustTypePromo, ddtOps;

$(document).ready(function () {
    startSpinner('loading..', 1); 
    initTabStrip();
    $('#txtPeriodFrom').hide();
    $('#txtPeriodTo').hide();
    $('#txtPeriodFrom').prop('disabled', true);
    $('#txtPeriodTo').prop('disabled', true);
    $("#txtPromoID").attr('maxlength', '20');

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
    $.get(MAA_API_Server + 'masterData/getOperation', function (data) {
        ddtOps = $("#txtOperation").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            optionLabel: "Select Operation",
            filter: "contains",
            dataSource: JSON.parse(data),
            index: 0
        }).data("kendoDropDownList");
        ddtOpsPromo = $("#txtOperationPromo").kendoDropDownTree({
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

        $("#optMarket").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            optionLabel: "Select Market",
            dataSource: dataMarket,
            filter: "contains",
            index: 0
        });
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getChannel', function (data) {
        $("#optChannel").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            optionLabel: "Select Channel",
            dataSource: JSON.parse(data),
            filter: "contains",
            index: 0
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
            template: "<span data-id='${data.PromotionKey}' data-PercentDiscCase='${data.PercentDiscCase}' data-DiscountCase='${data.DiscountCase}' data-NewPriceCase='${data.NewPriceCase}' data-IsMandatoryReward='${data.IsMandatoryReward}'>${data.PromotionType}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var PercentDiscCase = e.item.find("span").attr("data-PercentDiscCase");
                var DiscountCase = e.item.find("span").attr("data-DiscountCase");
                var NewPriceCase = e.item.find("span").attr("data-NewPriceCase");
                var tempMandatoryReward = e.item.find("span").attr("data-IsMandatoryReward");

                inputPercentDiscPerCase = PercentDiscCase == "Y" ? true : false;
                inputDiscPerCase = DiscountCase == "Y" ? true : false;
                inputNewPricePerCase = NewPriceCase == "Y" ? true : false;
                isMandatoryReward = tempMandatoryReward == "Y" ? true : false;
            }
        });
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getSubTradeChannel', function (data) {
        ddtTradeChannelPromo = $("#optSubTChannel").kendoDropDownTree({
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
        ddtSalesDistrict = $("#optSalesDistrict").kendoDropDownTree({
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
        ddtCustTypePromo = $("#optCustomerType").kendoDropDownTree({
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
    $.get(MAA_API_Server + 'masterData/getTradeName', function (data) {
        ddlTradeNameData.push({ Key: "*", Value: "All" });
        var arr = JSON.parse(data);
        for (var a = 0; a < arr.length; a++) {
            ddlTradeNameData.push(arr[a]);
        };
        //ddlTradeNameData = JSON.parse(data);
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getMaterial', function (data) {
        ddlMaterialData = JSON.parse(data);
        numLoad -= 1;
    });
    
    gridQuantity = $("#gridQuantity").kendoGrid({
        dataSource: {
            data: dataQuantity,
            schema: {
                model: {
                    fields: {
                        OrderID: { type: "number", validation: { required: true, min: 1, defaultValue: "" } },
                        MinQty: { type: "number", validation: { required: true, min: 1, defaultValue: "" } },
                        Amount: { type: "number", validation: { required: true, min: 1, defaultValue: "" } }
                    }
                }
            },
            pageSize: 20
        },
        columns: [
            { field: "OrderID", title: "No", width: "10%", format: "{0:#,0}" },
            { field: "MinQty", title: "Min Qty", width: "25%", attributes: { class: "text-right " }, format: "{0:#,0}" },
            { field: "Amount", title: "Amount", width: "25%", attributes: { class: "text-right " }, format: "{0:#,0}" },
            { field: "command", command: ["edit", "destroy"], title: "&nbsp;", width: "120px" }
        ],
        scrollable: true,
        sortable: true,
        filterable: false,
        editable: "inline",
        pageable: gridPage,
        edit: function (e) {
            if ($('#optPromoType').val() == POIBonusStok) {
                if (gridQuantity.dataSource._total <= 0) {
                    e.preventDefault();
                }
            } else if ($('#optPromoType').val() == POIBasket) {
                if (gridQuantity.dataSource._total <= 0) {
                    e.preventDefault();
                }
            };
        },
        noRecords: true
    }).data("kendoGrid");
    gridTradeName = $("#gridTradeName").kendoGrid({
        dataSource: {
            data: dataTradeName,
            schema: {
                model: {
                    fields: {
                        ID: { type: "string", editable: false },
                        TradeID: { editable: false, nullable: false, validation: { required: true } },
                        TradeName: { type: "string" },
                        CustomerID: { editable: false },
                        CustomerName: { type: "string" }
                    }
                }
            },
            pageSize: 20
        },
        columns: [
            { field: "ID", title: "No", width: "5%", editable: false, sortable: false, filterable: false, template: "<span class='row-number'></span>" },
            { field: "TradeName", title: "Trade Name", width: "35%", editor: ddlTradeName, template: "#=TradeName#" },
            { field: "CustomerName", title: "Customer Name", width: "45%", editor: ddlCustName, template: "#=CustomerName#" },
            { field: "command", command: ["edit", "destroy"], title: "&nbsp;", width: "15%" }
        ],
        scrollable: true,
        sortable: true,
        filterable: false,
        editable: "inline",
        pageable: gridPage,
        noRecords: true,
        //edit: function (e) {
        //    var numeric = e.container.find("input[name=ID]").data("kendoNumericTextBox");
        //    numeric.enable(false);
        //},
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
                        ID: { type: "string", editable: false },
                        MaterialID: { editable: false, nullable: false, validation: { required: true } },
                        MaterialGroup: { type: "string" },
                        MaterialNumberID: { type: "string", editable:false },
                        MaterialNumber: { type: "string", validation: { required: false, defaultValue: "" }  },
                        MaterialDesc: { type: "string" },
                        Qty: { type: "number", validation: { required: true, min: 1, defaultValue: "" }  }
                    }
                }
            },
            pageSize: 10
        },
        columns: [
            { field: "ID", title: "No", width: "5%", template: "<span class='row-number'></span>", editable: false },
            { field: "MaterialGroup", title: "Material Group", width: "25%", editor: ddlMaterial, template: "#=MaterialGroup#"  },
            { field: "MaterialNumber", title: "Material Number", width: "25%", editor: ddlMaterialNum, template: "#=MaterialNumber#"  },
            { field: "MaterialDesc", title: "Material Description", width: "25%" },
            { field: "Qty", title: "Qty", width: "10%", attributes: { class: "text-right " }, format: "{0:#,0}" },
            { field: "command", command: ["edit", "destroy"], title: "&nbsp;", width: "10%" }
        ],
        scrollable: true,
        sortable: true,
        filterable: false,
        editable: "inline",
        pageable: gridPage,
        noRecords: true,
        dataBound: function () {
            var rows = this.items();
            $(rows).each(function () {
                var index = $(this).index() + 1;
                var rowLabel = $(this).find(".row-number");
                $(rowLabel).html(index);
            });
        },
        //edit: function (e) {
        //    var numeric = e.container.find("input[name=MaterialDesc]").data("kendoNumericTextBox");
        //    numeric.enable(false);
        //}
    }).data("kendoGrid");
    gridRwdMaterial = $("#gridRwdMaterial").kendoGrid({
        dataSource: {
            data: dataRawMaterial,
            schema: {
                model: {
                    fields: {
                        No: { type: "string", editable:false },
                        MaterialID: { editable: false, nullable: false, validation: { required: true } },
                        MaterialGroup: { type: "string" },
                        MaterialNumberID: { type: "string", editable: false },
                        MaterialNumber: { type: "string" },
                        MaterialDescription: { type: "string" },
                        EstimatedQty: { type: "number", validation: { required: true, min: 1, defaultValue: "" }},
                        PricePerCase: { type: "number", validation: { required: true, min: 1, defaultValue: "" } },
                        PercentDiscPerCase: { type: "number" },
                        DiscPerCase: { type: "number" },
                        NewPricePerCase: { type: "number" },
                        totDiscount: { type: "number" }
                    }
                }
            },
            pageSize: 10,
            aggregate: [
                { field: "No", aggregate: "count" },
                { field: "EstimatedQty", aggregate: "sum" },
                { field: "totDiscount", aggregate: "sum" }
            ]
        },
        columns: [
            { field: "No", title: "No", width: "5%", template: "<span class='row-number'></span>", editable: false },
            { field: "MaterialGroup", title: "Material Group", width: "10%", editor: ddlMaterialRwd, template: "#=MaterialGroup#" },
            { field: "MaterialNumber", title: "Material Number", width: "10%", editor: ddlMaterialNumRwd, template: "#=MaterialNumber#" },
            { field: "MaterialDescription", title: "Material Description", width: "10%", footerTemplate: "Total Quantity" },
            { field: "EstimatedQty", title: "Estimated Qty", width: "10%", attributes: { class: "text-right " }, format: "{0:#,0}", aggregates: ["sum"], footerTemplate: "#= kendo.toString(sum, \"n0\") #", footerAttributes: { class: "text-right" } },
            { field: "PricePerCase", title: "Price / Case (Rp)", width: "10%", editor: ddlPricePerCase, attributes: { class: "text-right " }, format: "{0:#,0}"  },
            { field: "PercentDiscPerCase", title: "% Discount / Case (Rp)", width: "10%", attributes: { class: "text-right " }, format: "{0:#,0}"  },
            { field: "DiscPerCase", title: "Discount / Case (Rp)", width: "10%", attributes: { class: "text-right " }, format: "{0:#,0}"  },
            { field: "NewPricePerCase", title: "New Price / Case (Rp)", width: "10%", attributes: { class: "text-right " }, format: "{0:#,0}", footerTemplate: "Total Amount"  },
            { field: "totDiscount", title: "Total Discount / Case (Rp)", width: "10%", attributes: { class: "text-right " }, format: "{0:#,0}", aggregates: ["sum"], footerTemplate: "#= kendo.toString(sum, \"n0\") #", footerAttributes: { class: "text-right" } },
            { field: "command", command: ["edit", "destroy"], title: "&nbsp;", width: "120px" }
        ],
        scrollable: true,
        sortable: true,
        filterable: false,
        pageable: gridPage,
        editable: "inline",
        dataBound: function (e) {
            var rows = this.items();
            $(rows).each(function () {
                var index = $(this).index() + 1;
                var rowLabel = $(this).find(".row-number");
                $(rowLabel).html(index);
            });
        },
        selectable: "row",
        edit: function (e) {
            var PercentDiscPerCase = e.container.find("input[name=PercentDiscPerCase]").data("kendoNumericTextBox");
            var DiscPerCase = e.container.find("input[name=DiscPerCase]").data("kendoNumericTextBox");
            var NewPricePerCase = e.container.find("input[name=NewPricePerCase]").data("kendoNumericTextBox");
            var totDiscount = e.container.find("input[name=totDiscount]").data("kendoNumericTextBox");

            if (!inputPercentDiscPerCase) {
                PercentDiscPerCase.enable(false);
            }
            if (!inputDiscPerCase) {
                DiscPerCase.enable(false);
            }
            if (!inputNewPricePerCase) {
                NewPricePerCase.enable(false);
            }

            totDiscount.enable(false);
        },
        save: function (e) {
            var PercentDiscPerCase = e.model.PercentDiscPerCase <= 0 ? 1 : e.model.PercentDiscPerCase;
            var DiscPerCase = e.model.DiscPerCase <= 0 ? 0 : e.model.DiscPerCase;
            var NewPricePerCase = e.model.NewPriceCase <= 0 ? 0 : e.model.NewPricePerCase;
            var totDiscount = (PercentDiscPerCase * (e.model.PricePerCase - DiscPerCase - NewPricePerCase)) * e.model.EstimatedQty;

            if ($("#optPromoType").val() == "10") {
                //Dollar Off
                totDiscount = (e.model.PricePerCase - DiscPerCase) * e.model.EstimatedQty;
            }
            else if ($("#optPromoType").val() == "20") {
                //Percentage Off
                totDiscount = (PercentDiscPerCase / 100 * e.model.PricePerCase) * e.model.EstimatedQty;
            }
            else if ($("#optPromoType").val() == "30") {
                //Replacement Price
                totDiscount = (e.model.PricePerCase - NewPricePerCase) * e.model.EstimatedQty;
            }
            else if ($("#optPromoType").val() == "40") {
                //Bonus Stok
                totDiscount = e.model.PricePerCase * e.model.EstimatedQty;
            }
            gridRwdMaterial.dataSource.getByUid(e.model.uid).set("totDiscount", totDiscount);
        }
    }).data("kendoGrid");
});

var gridPage = {
    info: true,
    refresh: true,
    pageSizes: true,
    previousNext: true,
    numeric: true
};

function onAddQuantity() {
    if ($('#optPromoType').val() == POIBonusStok || $('#optPromoType').val() == POIBasket) {
        if (gridQuantity.dataSource._total <= 0) {
            var grid = $("#gridQuantity").data("kendoGrid");
            grid.addRow();
        }
    } else {
        var grid = $("#gridQuantity").data("kendoGrid");
        grid.addRow();
    }
}

function onAddTradeName() {
    var grid = $("#gridTradeName").data("kendoGrid");
    grid.addRow();
}

function onAddConsMaterial() {
    var grid = $("#gridConsMaterial").data("kendoGrid");
    grid.addRow();
}

function onAddRewardMaterial() {
    var grid = $("#gridRwdMaterial").data("kendoGrid");
    grid.addRow();
}

function textAreaEditor(container, options) {
    $('<textarea class="k-textbox" name="' + options.field + '" style="width:100%;" />').appendTo(container);
}

function ddlTradeName(container, options) {
    $("<input required data-bind='value:TradeName'  />")
        .attr("TradeID", "ddl_trade")
        .appendTo(container)
        .kendoDropDownList({
            dataSource: ddlTradeNameData,
            dataTextField: "Value",
            dataValueField: "Value",
            optionLabel: "Select Trade Name",
            filter: "contains",
            template: "<span data-id='${data.Key}' data-value='${data.Value}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var value = e.item.find("span").attr("data-value");
                var TradeItem = gridTradeName.dataItem($(e.sender.element).closest("tr"));
                TradeItem.TradeID = id;
                TradeItem.TradeName = value;

                if (TradeItem.TradeID != "*") {
                    var Data = {
                        OperationalRegion: $("#txtOperation").val(), //Operation
                        TradeName: id,
                        OperationalTradeChannel: $('#optChannel').val(), //Channel
                        SubTradeChannel: JSON.stringify($('#optSubTChannel').data("kendoDropDownTree").value()), //Sub Trade Channel
                        SalesDistrict: JSON.stringify($("#optSalesDistrict").data("kendoDropDownTree").value()),
                        CustomerType: JSON.stringify($("#optCustomerType").data("kendoDropDownTree").value())
                    };

                    $.ajax({
                        type: "POST",
                        url: MAA_API_Server + 'masterData/getCustNameByAttr',
                        data: Data, // ID of country selected
                        async: true,
                        success: function (response) {
                            var dataRes = JSON.parse(response);
                            if (dataRes.Success == true) {
                                var dataCustName = [];
                                dataCustName.push({ Storeno: "", Name2: "All" });
                                if (dataRes.Message != "[]") {
                                    var arr = JSON.parse(dataRes.Message);
                                    for (var a = 0; a < arr.length; a++) {
                                        dataCustName.push(arr[a]);
                                    };
                                }
                                var dataSource = new kendo.data.DataSource({
                                    data: dataCustName
                                });
                                itemCustName.setDataSource(dataSource);
                                itemCustName.refresh();

                                itemCustName.enable(true);
                            }
                        }
                    });
                }
                else {
                    var dataCustName = [];
                    dataCustName.push({ Storeno: "", Name2: "All" });
                    var dataSource = new kendo.data.DataSource({
                        data: dataCustName
                    });
                    itemCustName.setDataSource(dataSource);
                    itemCustName.refresh();
                    itemCustName.enable(true);
                    itemCustName.value(dataCustName[0]);
                    var uid = gridTradeName.dataItem($(container.closest("tr"))).uid;
                    gridTradeName.dataSource.getByUid(uid).set("CustomerID", dataCustName[0].Storeno);
                    gridTradeName.dataSource.getByUid(uid).set("CustomerName", dataCustName[0].Name2);
                };
            }
        });
};

function ddlCustName(container, options) {
    itemCustName = $("<input required data-bind='value:CustomerName'  />")
        .attr("CustomerID", "ddl_custname")
        .appendTo(container)
        .kendoDropDownList({
            dataTextField: "Name2",
            dataValueField: "Name2",
            optionLabel: "Select Customer Name",
            template: "<span data-id='${data.Storeno}'>${data.Name2}</span>",
            enable: false,
            filter: "contains",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var CustNameItem = gridTradeName.dataItem($(e.sender.element).closest("tr"));
                CustNameItem.CustomerID = id;
            }
        }).data("kendoDropDownList");
}

function ddlMaterial(container, options) {
    $("<input id='ddlMaterialID' required  data-bind='value:MaterialGroup'  />")
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
                var MaterialItem = gridConsMaterial.dataItem($(e.sender.element).closest("tr"));
                MaterialItem.MaterialID = id;
                document.getElementById("valueMaterialGroupCons").value = id;
                
                $.ajax({
                    type: "GET",
                    url: MAA_API_Server + 'masterData/getMaterialNum?MaterialGroup=' + document.getElementById("valueMaterialGroupCons").value,
                    data: JSON.stringify(document.getElementById("valueMaterialGroupCons").value), // ID of country selected
                    dataType: "json",
                    contentType: "application/json",
                    async: true,
                    success: function (response) {                       
                        var dataSource = new kendo.data.DataSource({
                            data: JSON.parse(response)
                        });
                        itemKendoMaterialNum.setDataSource(dataSource);
                        itemKendoMaterialNum.refresh();

                        itemKendoMaterialNum.enable(true);
                    }
                });
            }
        }).data("kendoDropDownList");
}

function ddlMaterialNum(container, options) {
    itemKendoMaterialNum = $("<input required id='ConsNumList' data-bind='value:MaterialNumber' />")
        .attr("MaterialNumberID", "ddl_materialnum")
        .appendTo(container)
        .kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Value",
            filter: "contains",
            optionLabel: "Select Material Number",
            template: "<span data-id='${data.Key}' data-value='${data.Value}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var value = e.item.find("span").attr("data-value");
                var MaterialItem = gridConsMaterial.dataItem($(e.sender.element).closest("tr"));
                MaterialItem.MaterialNumberID = id;
                MaterialItem.set("MaterialDesc", value);
            },
            enable: false,
        }).data("kendoDropDownList");
}

function ddlMaterialRwd(container, options) {
    $("<input required  data-bind='value:MaterialGroup'  />")
        .attr("MaterialID", "ddl_material")
        .appendTo(container)
        .kendoDropDownList({
            dataSource: ddlMaterialData,
            dataTextField: "Value",
            dataValueField: "Value",
            filter: "contains",
            optionLabel: "Select Material Group",
            template: "<span data-id='${data.Key}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var MaterialItem = gridRwdMaterial.dataItem($(e.sender.element).closest("tr"));
                MaterialItem.MaterialID = id;
                document.getElementById("valueMaterialGroupCons").value = id;

                $.ajax({
                    type: "GET",
                    url: MAA_API_Server + 'masterData/getMaterialNum?MaterialGroup=' + document.getElementById("valueMaterialGroupCons").value,
                    data: JSON.stringify(document.getElementById("valueMaterialGroupCons").value), // ID of country selected
                    dataType: "json",
                    contentType: "application/json",
                    async: true,
                    success: function (response) {
                        var dataSource = new kendo.data.DataSource({
                            data: JSON.parse(response)
                        });
                        itemKendoMaterialNumRwd.setDataSource(dataSource);
                        itemKendoMaterialNumRwd.refresh();

                        itemKendoMaterialNumRwd.enable(true);
                    }
                });
            }
        });
}

function ddlMaterialNumRwd(container, options) {
    itemKendoMaterialNumRwd = $("<input required  data-bind='value:MaterialNumber'  />")
        .attr("MaterialNumberID", "ddl_materialnum")
        .appendTo(container)
        .kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Value",
            optionLabel: "Select Material Number",
            filter: "contains",
            template: "<span data-id='${data.Key}' data-value='${data.Value}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var value = e.item.find("span").attr("data-value");
                var MaterialItem = gridRwdMaterial.dataItem($(e.sender.element).closest("tr"));
                MaterialItem.MaterialNumberID = id;
                MaterialItem.set("MaterialDescription", value);
                document.getElementById("valueMaterialNumber").value = id;
                
                /*var Data = {
                    GridTrade: JSON.stringify(gridTradeName.dataSource.data().toJSON()),
                    MaterialGroup: MaterialItem.MaterialID,
                    MarketTypeId: $('#optMarket').val(),
                    OperationalRegionId: $('#txtOperation').val(),
                };*/
                var Data = {
                    GridTrade: "",
                    MaterialGroup: MaterialItem.MaterialID,
                    MarketTypeId: $('#optMarket').val(),
                    OperationalRegionId: $('#txtOperation').val(),
                };

                $.ajax({
                    type: "POST",
                    url: MAA_API_Server + 'masterData/getPricePerCase',
                    data: Data, // ID of country selected
                    async: true,
                    success: function (response) {
                        var dataResponse = JSON.parse(response);
                        var dataSource = new kendo.data.DataSource({
                            data: dataResponse
                        });

                        itemPricePerCase.setDataSource(dataSource);
                        itemPricePerCase.refresh();

                        itemPricePerCase.enable(true);
                        if (dataResponse.length == 1) {
                            itemPricePerCase.value(dataResponse[0].Value);
                            var uid = gridRwdMaterial.dataItem($(container).closest("tr")).uid;
                            gridRwdMaterial.dataSource.getByUid(uid).set("PricePerCase", dataResponse[0].Value);
                        }
                    }
                });
            },
            enable: false,
        }).data("kendoDropDownList");
}

function ddlPricePerCase(container, options) {
    itemPricePerCase = $("<input required  data-bind='value:PricePerCase'  />")
        .attr("PricePerCase", "ddl_price")
        .appendTo(container)
        .kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Value",
            optionLabel: "Select Price",
            filter: "contains",
            template: "<span data-id='${data.Key}' data-value='${data.Value}'>${data.Value}</span>",
            select: function (e) {
                var id = e.item.find("span").attr("data-id");
                var value = e.item.find("span").attr("data-value");
                var MaterialItem = gridRwdMaterial.dataItem($(e.sender.element).closest("tr"));
                MaterialItem.PricePerCase = id;
            },
            enable: false,
        }).data("kendoDropDownList");
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

function validation() {
    var textTab1 = $('#tab1').text();
    var textTab2 = $('#tab2').text();
    var textTab3 = $('#tab3').text();

    validationMessage = '';
    var alertStr = "";
    var adaIsi = false;
    var adaPendingInput = false;

    if ($('#txtRegion').val() === "-1" || $('#txtRegion').val() === undefined || $('#txtRegion').val() === "") {
        alertStr += "Please choose Region." + "\n";
    }
    if ($('#txtOperation').val() === "-1" || $('#txtOperation').val() === undefined || $('#txtOperation').val() === "") {
        alertStr += "Please choose Operation." + "\n";
    }
    if ($('#optMarket').val() === "-1" || $('#optMarket').val() === undefined || $('#optMarket').val() === "") {
        alertStr += "Please choose Market." + "\n";
    }
    if ($('#optChannel').val() === "-1" || $('#optChannel').val() === undefined || $('#optChannel').val() === "") {
        alertStr += "Please choose Channel." + "\n";
    }
    if ($('#txtPrgName').val() === "" || $('#txtPrgName').val() === undefined || $('#txtPrgName').val() === "") {
        alertStr += "Please input Program Name." + "\n";
    }
    if ($("input[name='prmCategory']:checked").val() === "" || $("input[name='prmCategory']:checked").val() === undefined) {
        alertStr += "Please input Promotion Category." + "\n";
    }
    if (isNaN(Date.parse($('#divFromActivityPeriod').datepicker('getDate')))) {
        alertStr += "Promotion Period From is empty." + "\n";
    }
    if (isNaN(Date.parse($('#divFromActivityPeriodTo').datepicker('getDate')))) {
        alertStr += "Promotion Period To is empty." + "\n";
    }
    if ($('#divFromActivityPeriod').datepicker('getDate') > $('#divFromActivityPeriodTo').datepicker('getDate')) {
        alertStr += "Promotion Period From is bigger than Promotion Period To." + "\n";
    }
    if (gridQuantity.dataSource.data().length <= 0) {
        alertStr += "Please input Quantity Scaling Material." + "\n";
    //} else if ($('#optPromoType').val() !== POIBonusStok && gridQuantity.dataSource.data().length <= 0) {
    //    alertStr += "Please input Quantity Scaling Material." + "\n";
    } else if (($('#optPromoType').val() !== POIBonusStok && $('#optPromoType').val() !== POIBasket) && gridQuantity.dataSource.data().length > 0) {
        adaIsi = false;
        adaPendingInput = false;
        for (var a = 0; a < gridQuantity.dataSource.data().length; a++) {
            if (gridQuantity.dataSource.data()[a].MinQty !== "" &&
                gridQuantity.dataSource.data()[a].MinQty !== undefined &&
                gridQuantity.dataSource.data()[a].MinQty > 0 &&
                gridQuantity.dataSource.data()[a].Amount !== "" &&
                gridQuantity.dataSource.data()[a].Amount !== undefined &&
                gridQuantity.dataSource.data()[a].Amount > 0) {
                adaIsi = true;
            }
            if (gridQuantity.dataSource.data()[a].MinQty === "" ||
                gridQuantity.dataSource.data()[a].MinQty === undefined ||
                gridQuantity.dataSource.data()[a].MinQty <= 0 ||
                gridQuantity.dataSource.data()[a].Amount === "" ||
                gridQuantity.dataSource.data()[a].Amount === undefined ||
                gridQuantity.dataSource.data()[a].Amount <= 0) {
                adaPendingInput = true;
            }
        }
        if (!adaIsi || adaPendingInput) {
            alertStr += "Please input Quantity Scaling Material." + "\n";
        }
    }
    if ($('#txtOperationPromo').data("kendoDropDownTree").value().length <= 0) {
        alertStr += "Please input Operation Promo." + "\n";
    }
    if ($('#optSubTChannel').data("kendoDropDownTree").value().length <= 0) {
        alertStr += "Please input Sub Trade Channel Promo." + "\n";
    }
    if ($('#optSalesDistrict').data("kendoDropDownTree").value().length <= 0) {
        alertStr += "Please input Sales District Promo." + "\n";
    }
    //if ($('#optCustomerType').data("kendoDropDownTree").value().length <= 0) {
    //    alertStr += "Please input Customer Type." + "\n";
    //}
    if ($('#optPromoType').val() === undefined || $('#optPromoType').val() === "") {
        alertStr += "Please input Promotion Type." + "\n";
    }
    else if ($('#optPromoType').val() == POIBonusStok && gridQuantity.dataSource.data().length > 1) {
        alertStr += "Bonus Stock only need 1 Quantity Scaling." + "\n";
    } else if ($('#optPromoType').val() == POIBasket && gridQuantity.dataSource.data().length > 1) {
        alertStr += "Basket - % only need 1 Quantity Scaling." + "\n";
    }
    if (alertStr !== "") {
        tabMandatory(textTab1);
        validationMessage = alertStr;
        alertStr = "";
    }
    if ($("input[name='tName']:checked").val() === "N" && gridTradeName.dataSource.data().length <= 0) {
        alertStr += "Please input All Trade Name Grid." + "\n";
    } else if ($("input[name='tName']:checked").val() === "N" && gridTradeName.dataSource.data().length > 0) {
        adaIsi = false;
        adaPendingInput = false;
        for (var a = 0; a < gridTradeName.dataSource.data().length; a++) {
            if (gridTradeName.dataSource.data()[a].TradeID !== "" &&
                gridTradeName.dataSource.data()[a].TradeID !== undefined) {
                adaIsi = true;
            }
            if (gridTradeName.dataSource.data()[a].TradeID === "" ||
                gridTradeName.dataSource.data()[a].TradeID === undefined) {
                adaPendingInput = true;
            }
        }
        if (!adaIsi || adaPendingInput) {
            alertStr += "Please input All Trade Name Grid." + "\n";
        }
    }
    if (gridConsMaterial.dataSource.data().length <= 0 && $('#optPromoType').val() !== POIBasket) {
        alertStr += "Please input Considerable Material." + "\n";
    } else if (gridConsMaterial.dataSource.data().length > 0) {
        adaIsi = false;
        adaPendingInput = false;
        for (var a = 0; a < gridConsMaterial.dataSource.data().length; a++) {
            if (gridConsMaterial.dataSource.data()[a].MaterialID !== "" &&
                gridConsMaterial.dataSource.data()[a].MaterialNumberID !== "" &&
                gridConsMaterial.dataSource.data()[a].MaterialID !== undefined &&
                gridConsMaterial.dataSource.data()[a].MaterialNumberID !== undefined &&
                gridConsMaterial.dataSource.data()[a].Qty > 0) {
                adaIsi = true;
            }
            if (gridConsMaterial.dataSource.data()[a].MaterialID === "" ||
                gridConsMaterial.dataSource.data()[a].MaterialNumberID === "" ||
                gridConsMaterial.dataSource.data()[a].MaterialID === undefined ||
                gridConsMaterial.dataSource.data()[a].MaterialNumberID === undefined ||
                gridConsMaterial.dataSource.data()[a].Qty <= 0) {
                adaPendingInput = true;
            }
        }
        if (!adaIsi || adaPendingInput) {
            alertStr += "Please input Considerable Material." + "\n";
        }
    }
    if (isMandatoryReward && gridRwdMaterial.dataSource.data().length <= 0 && $('#optPromoType').val() !== POIBasket) {
        alertStr += "Please input Reward Material." + "\n";
    } else if (isMandatoryReward && gridRwdMaterial.dataSource.data().length > 0) {
        adaIsi = false;
        adaPendingInput = false;
        for (var a = 0; a < gridRwdMaterial.dataSource.data().length; a++) {
            if (gridRwdMaterial.dataSource.data()[a].MaterialID !== "" &&
                gridRwdMaterial.dataSource.data()[a].MaterialNumberID !== "" &&
                gridRwdMaterial.dataSource.data()[a].MaterialID !== undefined &&
                gridRwdMaterial.dataSource.data()[a].MaterialNumberID !== undefined &&
                gridRwdMaterial.dataSource.data()[a].EstimatedQty > 0 &&
                gridRwdMaterial.dataSource.data()[a].PricePerCase > 0) {
                adaIsi = true;
            }
            if (gridRwdMaterial.dataSource.data()[a].MaterialID === "" ||
                gridRwdMaterial.dataSource.data()[a].MaterialNumberID === "" ||
                gridRwdMaterial.dataSource.data()[a].MaterialID === undefined ||
                gridRwdMaterial.dataSource.data()[a].MaterialNumberID === undefined ||
                gridRwdMaterial.dataSource.data()[a].EstimatedQty <= 0 ||
                gridRwdMaterial.dataSource.data()[a].PricePerCase <= 0) {
                adaPendingInput = true;
            }
        }
        if (!adaIsi || adaPendingInput) {
            alertStr += "Please input Reward Material." + "\n";
        }
    }
    if ($('#optPromoType').val() !== POIBonusStok) {
        var rewardMaterialGrid = gridRwdMaterial.dataSource.data();
        var consMaterialGrid = gridConsMaterial.dataSource.data();
        if (rewardMaterialGrid.length != consMaterialGrid.length) {
            alertStr += "Considerable Material must be equal to Reward Material." + "\n";
        } 

        //for (var i = 0; i < consMaterialGrid.length; i++) {
        //    if (consMaterialGrid[i].MaterialID != rewardMaterialGrid[i].MaterialID) {
        //        alertStr += "Material Group and Material Number columns of Considerable Material must be equal to Reward Material." + "\n";
        //        break;
        //    } else if (consMaterialGrid[i].MaterialNumberID != rewardMaterialGrid[i].MaterialNumberID) {
        //        alertStr += "Material Group and Material Number columns of Considerable Material must be equal to Reward Material." + "\n";
        //        break;
        //    }
        //}
        

        for (var i = 0; i < consMaterialGrid.length; i++) {
            var counter = 0;
            var counterb = 0;
            for (var j = 0; j < rewardMaterialGrid.length; j++) {
                if (consMaterialGrid[i].MaterialID == rewardMaterialGrid[j].MaterialID) {
                    counter++;
                }
                if (consMaterialGrid[i].MaterialNumberID == rewardMaterialGrid[j].MaterialNumberID) {
                    counterb++;
                }
            }
            if (counter <= 0) {
                alertStr += "Material Group and Material Number columns of Considerable Material must be equal to Reward Material." + "\n";
                break;
            }
            if (counterb <= 0) {
                alertStr += "Material Group and Material Number columns of Considerable Material must be equal to Reward Material." + "\n";
                break;
            }
        }
    }
    if (attachments === null) { attachments = []; }
    if (uploadedFile.length <= 0 && attachments.length <= 0) {
        alertStr += "No file uploaded." + "\n";
    }

    if (alertStr !== "") {
        tabMandatory(textTab2);
        validationMessage += alertStr;
        alertStr = "";
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
            PromoNumber: $("#txtPromoUpReqNumber").val(),
            RequestorName: $('#txtRequestor').val(),
            OpRegion: $('#txtRegion').val(),
            OperationName: $('#txtOperation').val(),
            DepartmentName: $('#txtDepartment').val(),
            Opmarket: $('#optMarket').val(),
            Opchan: $('#optChannel').val(),
            ProgramName: $('#txtPrgName').val(),
            ProgramCategory: $("input[name='prmCategory']:checked").val(),
            PromotypeType: $('#optPromoType').val(),
            PromoPerFromString: $("#divFromActivityPeriod").datepicker('getDate'),
            PromoPerToString: $("#divFromActivityPeriodTo").datepicker('getDate'),
            DocumentStatus: "Waiting Approval",
            ApprovalStatus: "4",
            AllTradeName: $("input[name='tName']:checked").val(),
            attachments: uploadedFile,
            OperationPromoString: JSON.stringify($("#txtOperationPromo").data("kendoDropDownTree").value()),
            SalesDistrictPromoString: JSON.stringify($("#optSalesDistrict").data("kendoDropDownTree").value()),
            SubTradeChannelPromoString: JSON.stringify($("#optSubTChannel").data("kendoDropDownTree").value()),
            CustomerTypePromoString: JSON.stringify($("#optCustomerType").data("kendoDropDownTree").value()),
            POITradeDataString: JSON.stringify(gridTradeName.dataSource.data().toJSON()),
            POIQtyScalingString: JSON.stringify(gridQuantity.dataSource.data().toJSON()),
            POIConsMaterialString: JSON.stringify(gridConsMaterial.dataSource.data().toJSON()),
            POIRwdMaterialString: JSON.stringify(gridRwdMaterial.dataSource.data().toJSON()),
            RequestorPositionID: $("#RequestorPositionID").val(),
            RequestorPosition: $("#RequestorPosition").val(),
            RequestorPINID: $('#RequestorPINID').val(),
            CreatedBy: $('#CreatedBy').val(),
            CreatedDate: new Date(dateServer).toJSON()
        };
        $.ajax({
            type: "POST",
            url: MAA_API_Server + 'PromoOnInvoice/SaveData',
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
    };
});

$('#btnDraft').click(function () {
    startSpinner('loading..', 1); 
    var draftReq = {
        PromoNumber: $("#txtPromoUpReqNumber").val(),
        RequestorName: $('#txtRequestor').val(),
        OpRegion: $('#txtRegion').val(),
        OperationName: $('#txtOperation').val(),
        DepartmentName: $('#txtDepartment').val(),
        Opmarket: $('#optMarket').val(),
        Opchan: $('#optChannel').val(),
        ProgramName: $('#txtPrgName').val(),
        ProgramCategory: $("input[name='prmCategory']:checked").val(),
        PromotypeType: $('#optPromoType').val(),
        PromoPerFromString: $("#divFromActivityPeriod").datepicker('getDate'),
        PromoPerToString: $("#divFromActivityPeriodTo").datepicker('getDate'),
        DocumentStatus: "Created",
        ApprovalStatus: "0",
        AllTradeName: $("input[name='tName']:checked").val(),
        attachments: uploadedFile,
        OperationPromoString: JSON.stringify($("#txtOperationPromo").data("kendoDropDownTree").value()),
        SalesDistrictPromoString: JSON.stringify($("#optSalesDistrict").data("kendoDropDownTree").value()),
        SubTradeChannelPromoString: JSON.stringify($("#optSubTChannel").data("kendoDropDownTree").value()),
        CustomerTypePromoString: JSON.stringify($("#optCustomerType").data("kendoDropDownTree").value()),
        POITradeDataString: JSON.stringify(gridTradeName.dataSource.data().toJSON()),
        POIQtyScalingString: JSON.stringify(gridQuantity.dataSource.data().toJSON()),
        POIConsMaterialString: JSON.stringify(gridConsMaterial.dataSource.data().toJSON()),
        POIRwdMaterialString: JSON.stringify(gridRwdMaterial.dataSource.data().toJSON()),
        RequestorPositionID: $("#RequestorPositionID").val(),
        RequestorPosition: $("#RequestorPosition").val(),
        RequestorPINID: $('#RequestorPINID').val(),
        CreatedBy: $('#CreatedBy').val(),
        CreatedDate: new Date(dateServer).toJSON()
    };
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'PromoOnInvoice/SaveData',
        data: draftReq,
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

$('#btnComplete').click(function () {
    validationMessage = "";
    if ($("#txtPromoID").val() === "") {
        var textTab1 = $('#tab1').text();
        tabMandatory(textTab1);
        validationMessage += "Please input Promotion ID." + "\n";
    }

    if (validationMessage !== "") {
        startSpinner('loading..', 0);
        validationForm(validationMessage);
    }
    else {
        startSpinner('loading..', 1); 

        var saveReq = {
            PromoNumber: $("#txtPromoUpReqNumber").val(),
            PromotionID: $('#txtPromoID').val(),
            RequestorName: $('#txtRequestor').val()
        };
        $.ajax({
            type: "POST",
            url: MAA_API_Server + 'PromoOnInvoice/CompleteData',
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

//var win = $("#inputWindow")
//    .kendoWindow({
//        actions: ["Maximize", "Close"],
//        animation: {
//            open: {
//                effects: "slideIn:down fadeIn",
//                duration: 500
//            },
//            close: {
//                effects: "slide:up fadeOut",
//                duration: 500
//            }
//        },
//        minWidth: 300,
//        modal: true,
//        resizable: true,
//        title: "Choose File to Upload",
//        visible: false,
//        close: handleUserInput
//    })
//    .data("kendoWindow")
//    .center();

//$("#btnSendBack").click(function () {
//    var wrapper = win.wrapper;
//    wrapper.css({ top: 25 });
//    win.open();
//});

//function handleUserInput (e) {
//    var userinput = ($("#userinput").val());
//    alert(userinput);
//};