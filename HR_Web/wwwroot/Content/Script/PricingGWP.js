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

var isEditMode = false;
var isDraft = false;
var ddlOperation;
var isSelectOps = "";

var numLoad = 4;
var loadInterval = setInterval(checkCallback, 2000);

function checkCallback() {
    if (numLoad <= 0) {
        window.clearInterval(loadInterval);
        startSpinner('loading..', 0);

        if (DraftId === "") {
            let now = new Date();
            $('#txtCreatedDate').val(generateCreateDate());
            $('#txtRequestor').val(fullname);
            $('#txtPricingSetupRequestNumber').val("GWP/NO-" + generateAutoNumber($("#txtRequestor").val()));

            $('#gridAttachment').hide();
        }
        else {
            $('#txtRequestor').val(fullname);
            $('#txtPricingSetupRequestNumber').val(DraftId);

            var strSplit = CreationDate.split(" ");
            var createdDateModel = strSplit[0];
            $('#txtCreatedDate').val(createdDateModel);

            $("#txtOPRegion").data('kendoDropDownList').value(RegionId);
            bindOperationList(RegionId);
            isSelectOps = OperationId;
            $("#txtOperation").data('kendoDropDownList').value(OperationId);
            $("#txtChannel").data('kendoDropDownList').value(ChannelId);
            $("#txtProgramCategory").data('kendoDropDownList').value(ProgramCategory);

            if (IsBasePrice === "True") { $("#basePrice").attr('checked', 'checked'); };
            if (IsChannelAdjustment === "True") { $("#channelAdjustment").attr('checked', 'checked'); };
            if (IsBulkSurcharge === "True") { $("#bulkCharge").attr('checked', 'checked'); };
            if (IsProfitCenterVariance === "True") { $("#profitCenter").attr('checked', 'checked'); };

            bindingAttachment(Attachment);
            bindingPricingAttachment(pricingAttachment);
            $('#gridAttachment').show();
        }

        if (DocumentStatus !== "" && DocumentStatus !== null && DocumentStatus !== undefined) {
            document.getElementById('lbldocstatus').innerHTML = "- " + DocumentStatus;
        }
        if (ApprovalStatus === "0") {
            $("#divbtnReject").hide();
            $("#divbtnApprove").hide();
            $("#divbtnSendBack").hide();
            $("#divbtnComplete").hide();
            document.getElementById('lblapprovestatus').innerHTML = 'Draft';
        }
        else if (ApprovalStatus === "4") {
            $('#divbtnSubmit').hide();
            $('#divbtnDraft').hide();
            document.getElementById('lblapprovestatus').innerHTML = 'In Process';
            $("#divbtnComplete").hide();
        }
        else if (ApprovalStatus === "1") {
            $('#divbtnSubmit').hide();
            $('#divbtnDraft').hide();
            document.getElementById('lblapprovestatus').innerHTML = 'Completed';
            $("#divbtnReject").hide();
            $("#divbtnApprove").hide();
            $("#divbtnSendBack").hide();
            if (DocumentStatus === "Pricing Done") {
                $("#divbtnComplete").hide();
            }
        }
        else if (ApprovalStatus === "2") {
            $('#divbtnSubmit').hide();
            $('#divbtnDraft').hide();
            document.getElementById('lblapprovestatus').innerHTML = 'Rejected';
            $("#divbtnReject").hide();
            $("#divbtnApprove").hide();
            $("#divbtnSendBack").hide();
            $("#divbtnComplete").hide();
        }
        else if (ApprovalStatus === "3") {
            document.getElementById('lblapprovestatus').innerHTML = 'Send Back';
            $('#divAttachment').show();
            $("#divbtnReject").hide();
            $("#divbtnApprove").hide();
            $("#divbtnSendBack").hide();
            $("#divbtnComplete").hide();
        }
        else if (ApprovalStatus === null || ApprovalStatus === undefined || ApprovalStatus === "") {
            $("#divbtnReject").hide();
            $("#divbtnApprove").hide();
            $("#divbtnSendBack").hide();
            $("#divbtnComplete").hide();
            document.getElementById('lblapprovestatus').innerHTML = 'Draft';
            document.getElementById('lbldocstatus').innerHTML = '- Created';
        }

        if (ApprovalStatus === "1" || ApprovalStatus === "2" || ApprovalStatus === "4") {
            $('#divAttachment').hide();
            $('#gridAttachment').show();
            $("#divbtnComplete").hide();
            _gridAttachment.hideColumn("command");
            if (ApprovalStatus === "1") {
                $("#allGWPAttachment").show();
                if (DocumentStatus === "Pricing In Progress") {
                    $('#divAttachment2').show();
                    $('#gridAttachment2').hide();
                    $("#divbtnComplete").show();
                }
                else if (DocumentStatus === "Pricing Done") {
                    $('#divAttachment').hide();
                    $('#gridAttachment').show();
                    $('#divAttachment2').hide();
                    $('#gridAttachment2').show();
                    $("#divbtnComplete").hide();
                    $("#divbtnApprove").hide();
                    $("#divbtnReject").hide();
                    $("#divbtnSendBack").hide();
                }
            }

            $("#txtOPRegion").data('kendoDropDownList').enable(false);
            $("#txtOperation").data('kendoDropDownList').enable(false);
            $("#txtChannel").data('kendoDropDownList').enable(false);
            $("#txtProgramCategory").data('kendoDropDownList').enable(false);
            $("#basePrice").prop('disabled', true);
            $("#channelAdjustment").prop('disabled', true);
            $("#bulkCharge").prop('disabled', true);
            $("#profitCenter").prop('disabled', true);
        };
    };
};

// #region Attachment
$("#inputIcon").click(function () {
    $("#fileInput").trigger('click');
});

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
$('#fileInput').change(function () {
    isEditMode = true;
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
                alert("The attachment already contain file with name " + files[i].name + ".");
                delete files[i];
                return;
            }
        }

        var totalSize = files[i].size / 1024;
        for (var j = 0; j < uploadedFile.length; j++) {
            if (uploadedFile[j] && uploadedFile[j].size) {
                totalSize += uploadedFile[j].size;
            }
        }

        if (totalSize / 1024 > maxUploadSize) {
            alert("Total uploaded file exceeding allowed size!");
            delete files[i]
            return;
        }

        var extension = files[i].name.replace(/^.*\./, '');
        var fileTypes = allowedAttachmentType.split(',');
        var fileTypeMatch = false;
        for (var j = 0; j < fileTypes.length; j++) {
            if (fileTypes[j].toLowerCase() == extension.toLowerCase()) {
                fileTypeMatch = true;
            }
        }

        if (!fileTypeMatch) {
            alert("File type not allowed!");
            document.getElementById("fileInput").value = "";
            delete files[i]
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
                    imgCont = "<img src='" + url_Web + "/images/image.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "xlsx" || extension.toLowerCase() === "xls") {
                    imgCont = "<img src='" + url_Web + "/images/excel.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "pdf") {
                    imgCont = "<img src='" + url_Web + "/images/pdf.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "doc" || extension.toLowerCase() === "docx") {
                    imgCont = "<img src='" + url_Web + "/images/word.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "ppt" || extension.toLowerCase() === "pptx") {
                    imgCont = "<img src='" + url_Web + "/images/ppt.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "msg") {
                    imgCont = "<img src='" + url_Web + "/images/mail.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else {
                    imgCont = "<img src='" + url_Web + "/images/document.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                $('.filename-container').append("<div class='text-center' id='attachment-" + id + "' style='display:inline' >" + imgCont + "<span  class='filename' style='font-size:8px;display:inline'>" + name + "</span></div>").show();

            } else {
                alert(error);
            }
        });
    }
});
function removeAttachment(e) {
    if (confirm('Are you sure want to remove the attachment?')) {
        $('#attachment-' + e).remove();

        for (var i = 0; i < uploadedFile.length; i++) {
            if (uploadedFile[i].id == e) {

                uploadedFile.splice(i, 1);

            }
        }
        document.getElementById("fileInput").value = "";
    }
};

var _gridAttachment;
function bindingAttachment(data) {
    _gridAttachment = $("#gridAttachment").kendoGrid({
        dataSource: {
            data: data,
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
            { field: "command", command: { text: "Delete", click: RemoveAttachmentAzure }, title: "&nbsp;", width: "20%" }
        ]
    }).data("kendoGrid");
};

function RemoveAttachmentAzure(e) {
    var allowRemove = false;
    if (ApprovalStatus === "0" || ApprovalStatus === "3") {
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
                    url: MAA_API_Server + 'GWP/RemoveAttachment',
                    data: dataPos,
                    success: function (response) {
                        if (response.message.includes("OK")) {
                            var dataRow = _gridAttachment.dataSource.getByUid(dataItem.uid);
                            _gridAttachment.dataSource.remove(dataRow);
                            for (var i = 0; i < Attachment.length; i++) {
                                if (Attachment[i].UrlNoAzurePath == dataItem.UrlNoAzurePath) {
                                    Attachment.splice(i, 1);
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
// #endregion

// #region Attachment Pricing Setup
$("#inputIcon2").click(function () {
    $("#fileInput2").trigger('click');
});

var uploadedFile2 = [];
$('#fileInput2').change(function () {
    isEditMode = true;
    var filename = this.value;
    var lastIndex = filename.lastIndexOf("\\");
    var imgCont = "";
    if (lastIndex >= 0) {
        filename = filename.substring(lastIndex + 1);
    }
    var files = $('#fileInput2')[0].files;
    res = Array.prototype.slice.call(files);
    for (var i = 0; i < files.length; i++) {
        if (files[i].size / 1024 > maxFileSize) {
            alert("File exceeding maximum allowed size!");
            delete files[i]
            return;
        }

        for (var j = 0; j < uploadedFile2.length; j++) {
            if (uploadedFile2[j] && uploadedFile2[j].name === files[i].name) {
                alert("The attachment already contain file with name " + files[i].name + ".");
                delete files[i];
                return;
            }
        }

        var totalSize = files[i].size / 1024;
        for (var j = 0; j < uploadedFile2.length; j++) {
            if (uploadedFile2[j] && uploadedFile2[j].size) {
                totalSize += uploadedFile2[j].size;
            }
        }

        if (totalSize / 1024 > maxUploadSize) {
            alert("Total uploaded file exceeding allowed size!");
            delete files[i]
            return;
        }

        var extension = files[i].name.replace(/^.*\./, '');
        var fileTypes = allowedAttachmentType.split(',');
        var fileTypeMatch = false;
        for (var j = 0; j < fileTypes.length; j++) {
            if (fileTypes[j].toLowerCase() == extension.toLowerCase()) {
                fileTypeMatch = true;
            }
        }

        if (!fileTypeMatch) {
            alert("File type not allowed!");
            document.getElementById("fileInput2").value = "";
            delete files[i]
            return;
        }

        var name = files[i].name;

        var fileSize = files[i].size / 1024; //in Kb
        getBase64(files[i], function (error, result) {
            if (!error) {
                var id = Math.floor(Math.random() * 10000);
                uploadedFile2.push({
                    id: id,
                    name: name,
                    content: result.substr(result.indexOf(',') + 1),
                    extension: extension,
                    url: '',
                    size: fileSize
                });

                if (extension.toLowerCase() === "png" || extension.toLowerCase() === "jpg" || extension.toLowerCase() === "jpeg") {
                    imgCont = "<img src='" + url_Web + "/images/image.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment2('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "xlsx" || extension.toLowerCase() === "xls") {
                    imgCont = "<img src='" + url_Web + "/images/excel.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment2('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "pdf") {
                    imgCont = "<img src='" + url_Web + "/images/pdf.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment2('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "doc" || extension.toLowerCase() === "docx") {
                    imgCont = "<img src='" + url_Web + "/images/word.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment2('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "ppt" || extension.toLowerCase() === "pptx") {
                    imgCont = "<img src='" + url_Web + "/images/ppt.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment2('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else if (extension.toLowerCase() === "msg") {
                    imgCont = "<img src='" + url_Web + "/images/mail.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment2('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                else {
                    imgCont = "<img src='" + url_Web + "/images/document.ico' width='50' height='50'></img><i class='glyphicon glyphicon-remove' onclick=removeAttachment2('" + id + "') style='cursor:pointer;color:red' title='Remove Attachment'></i>";
                }
                $('.filename-container2').append("<div class='text-center' id='attachment-" + id + "' style='display:inline' >" + imgCont + "<span  class='filename' style='font-size:8px;display:inline'>" + name + "</span></div>").show();

            } else {
                alert(error);
            }
        });
    }
});
function removeAttachment2(e) {
    if (confirm('Are you sure want to remove the attachment?')) {
        $('#attachment-' + e).remove();

        for (var i = 0; i < uploadedFile2.length; i++) {
            if (uploadedFile2[i].id == e) {

                uploadedFile2.splice(i, 1);

            }
        }
        document.getElementById("fileInput2").value = "";
    }
};

function bindingPricingAttachment(data) {
    $("#gridAttachment2").kendoGrid({
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
};
// #endregion

var gridPage = {
    info: true,
    refresh: true,
    pageSizes: true,
    previousNext: true,
    numeric: true
};

$("#gridApproval1").kendoGrid({
    dataSource: {
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
        { field: "Approval1", title: "Approval 1 <br/> GM Supermarket", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval2", title: "Approval 2 <br/> Pricing Commite", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval3", title: "Approval 3 <br/> Modern Trade Director", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval4", title: "Approval 4 <br/> ", attributes: { class: "text-center" }, width: "130px", encoded: false },
        { field: "Approval5", title: "Approval 5 <br/> ", attributes: { class: "text-center" }, width: "130px", encoded: false }
    ]
});

$("#gridApproval2").kendoGrid({
    dataSource: {
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

var validationMessage = '';
function validateForm() {
    validationMessage = "";
    if ($('#txtOPRegion').val() == -1 || $('#txtOPRegion').val() === undefined || $('#txtOPRegion').val() === "") {
        validationMessage += "Please choose Region." + "\n";
    }

    if ($('#txtOperation').val() == -1 || $('#txtOperation').val() === undefined || $('#txtOperation').val() === "") {
        validationMessage += "Please choose Operation." + "\n";
    }

    if ($('#txtChannel').val() == -1 || $('#txtChannel').val() === undefined || $('#txtChannel').val() === "") {
        validationMessage += "Please choose Channel." + "\n";
    }

    if ($('#txtProgramCategory').val() == -1 || $('#txtProgramCategory').val() === undefined || $('#txtProgramCategory').val() === "") {
        validationMessage += "Please choose Program Category." + "\n";
    }

    if (!$("#basePrice").is(':checked') && !$("#channelAdjustment").is(':checked') && !$("#bulkCharge").is(':checked') && !$("#profitCenter").is(':checked')) {
        validationMessage += "Please choose Price Condition." + "\n";
    }

    if (uploadedFile == undefined || uploadedFile == null || uploadedFile.length < 1) {
        if (Attachment == undefined || Attachment == null || Attachment.length < 1) {
            validationMessage += "No file uploaded." + "\n";
        }
    }
    if (validationMessage !== "") {
        return false;
    }

    return formPricingSetup();
}

function formPricingSetup() {
    return {
        DraftIdbefore: DraftId,
        CreationDate: $('#txtCreatedDate').val(),
        RegionId: $('#txtOPRegion').val(),
        OperationId: $('#txtOperation').val(),
        ChannelId: $('#txtChannel').val(),
        ProgramCategory: $('#txtProgramCategory').val(),
        IsBasePrice: $('#basePrice').is(":checked"),
        IsChannelAdjustment: $('#channelAdjustment').is(":checked"),
        IsBulkSurcharge: $('#bulkCharge').is(":checked"),
        IsProfitCenterVariance: $('#profitCenter').is(":checked"),
        Attachment: uploadedFile,
        RequestorName: $('#txtRequestor').val(),
        PositionId: $("#PositionId").val(),
        RequestorPosition: $("#RequestorPosition").val(),
        RequestorPinId: $('#RequestorPinId').val(),
        CreatedBy: $('#CreatedBy').val()
    };
}

function postPricingSetup(pricingSetup, cb) {
    startSpinner('loading..', 1);
    $.post(MAA_API_Server + 'pricingSetup/add', pricingSetup, function (result) {
        startSpinner('loading..', 0);
        var resultObj = JSON.parse(result);
        if (!resultObj.Success) {
            alert(resultObj.Message);
            cb(true, null);
        } else {
            swal({
                type: 'success',
                title: 'Success',
                text: 'Your Request Number : ' + resultObj.Result,
            }).then(function () {
                window.location = url_Web;
            });
            cb(false, resultObj.Result);
        }
    });
}

function updateDraft(pricingSetup, documentDraftId) {
    pricingSetup.DraftId = documentDraftId;
    $.post(MAA_API_Server + 'pricingSetup/upgrade', pricingSetup, function (result) {
        var resultObj = JSON.parse(result);
        if (!resultObj.Success) {
            alert(resultObj.Message);
            cb(true, null)
        } else {
            alert(resultObj.Message);
            cb(false, resultObj.Result)
        }
    });
}

function bindRegionList() {

    $.get(MAA_API_Server + 'masterData/getRegion', function (data) {
        $("#txtOPRegion").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            index: 0,
            optionLabel: "Please Select",
            filter: "contains",
            change: onChange
        });
        numLoad -= 1;
    });
    function onChange(e) {
        var dataItem = e.sender.dataItem();
        if (ddlOperation !== undefined) {
            ddlOperation.enable(false);
        }
        bindOperationList(dataItem.Key);

    }
}

function bindOperationList(e) {
    $.get(MAA_API_Server + 'masterData/getOperation?param=' + e, function (data) {
        ddlOperation = $("#txtOperation").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            index: 0,
            optionLabel: "Please Select",
            filter: "contains",
            change: onChange
        }).data("kendoDropDownList");
        if (ddlOperation !== undefined) {
            if (ApprovalStatus !== "1" && ApprovalStatus !== "2" && ApprovalStatus !== "4") {
                ddlOperation.enable(true);
            }
            if (isSelectOps !== "") {
                ddlOperation.value(isSelectOps);
                isSelectOps = "";
            }
        };
        numLoad -= 1;
    });
    function onChange(e) {
        var dataItem = e.sender.dataItem();
        if (this.value() != "-1") {
            isEditMode = true;
        }
    }

}

$(document).ready(function () {
    startSpinner('loading..', 1);
    initTabStrip();
    bindRegionList();
    bindOperationList(null);
    $('#divAttachment').show();
    $('#gridAttachment').hide();
    $("#allGWPAttachment").hide();

    $.get(MAA_API_Server + 'masterData/getChannel' + '?id=' + new Date().getTime(), function (data) {
        $("#txtChannel").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            optionLabel: "Please Select",
            index: 0,
            filter: "contains",
            change: function (e) {
                if (this.value() != "-1") {
                    isEditMode = true;
                }
            }
        });
        numLoad -= 1;
    });
    $.get(MAA_API_Server + 'masterData/getMarketingProgram' + '?id=' + new Date().getTime(), function (data) {
        $("#txtProgramCategory").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            optionLabel: "Please Select",
            index: 0,
            filter: "contains",
            change: function (e) {
                if (this.value() != "-1") {
                    isEditMode = true;
                }
            }
        });
        numLoad -= 1;
    });
});

$("#btnCancel").click(function () {
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
$("#btnSaveDraft").on('click', function () {
    var pricingSetup = formPricingSetup();
    if (pricingSetup) {
        pricingSetup.IsDraft = true;
        postPricingSetup(pricingSetup, function (error, result) {
            if (!error) {
                $('#txtPricingSetupRequestNumber').val(result);
                documentId = result;
                isEditMode = false;
            }
        });
    }
});
$("#btnSubmit").on('click', function () {
    var pricingSetup = validateForm();
    if (pricingSetup) {
        pricingSetup.IsDraft = false;
        if (!isDraft) {
            postPricingSetup(pricingSetup, function (error, result) {
                if (!error) {
                    $('#txtPricingSetupRequestNumber').val(result);
                    isEditMode = false;
                }
            });
        } else {

        }
    } else {
        startSpinner('loading..', 0);
        validationForm(validationMessage);
    }
});

$("#btnApprove").click(function () {
    startSpinner('loading..', 1);
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'pricingSetup/Approve?id=' + document.getElementById('txtPricingSetupRequestNumber').value,
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

$("#btnReject").click(function () {
    startSpinner('loading..', 1);
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'pricingSetup/Reject?id=' + document.getElementById('txtPricingSetupRequestNumber').value,
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

$("#btnSendBack").click(function () {
    startSpinner('loading..', 1);
    var saveReq = {
        DraftId: $("#txtPricingSetupRequestNumber").val(),
        ApprovalStatus: "3",
        DocumentStatus: "Waiting Approval"
    };
    $.ajax({
        type: "POST",
        url: MAA_API_Server + 'pricingSetup/SendBack',
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

$("#btnComplete").click(function () {
    var validationMessage = "";
    if (uploadedFile2.length <= 0) {
        validationMessage += "No file pricing uploaded." + "\n";
    }
    if (validationMessage !== "") {
        startSpinner('loading..', 0);
        validationForm(validationMessage);
    }
    else {
        startSpinner('loading..', 1);
        var saveReq = {
            DraftId: $("#txtPricingSetupRequestNumber").val(),
            pricingAttachment: uploadedFile2
        };
        $.ajax({
            type: "POST",
            url: MAA_API_Server + 'pricingSetup/CompleteData',
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