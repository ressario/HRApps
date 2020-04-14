var isEditMode = false;
$("#inputIcon").click(function () {
    $("input[type='file']").trigger('click');
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
            if (fileTypes[j] == extension) {
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
                alert(error);
            }
        });
    }
});

var existingbudget=0;
function loadExistingBudget() {

    if ($('#txtAdvertisingTypeFrom').val() == -1) {
        return;
    }

    if ($('#txtActivityFrom').val() == -1) {
        return;
    }

    if ($('#txtOperationFrom').val() == -1) {
        return;
    }

    if ($('#txtBudgetYearFrom').val() == '') {
        return;
    }

    var advertisingTypeId, activityId, operationId, budgetYear = null;
    advertisingTypeId = $('#txtAdvertisingTypeFrom').val();
    activityId = $('#txtActivityFrom').val();
    operationId = $('#txtOperationFrom').val();
    budgetYear = $('#txtBudgetYearFrom').val();

    var data = {
        'AdvertisingTypeId': advertisingTypeId,
        'ActivityId': activityId,
        'OperationId': operationId,
        'Year': budgetYear,
        'OriginalBudget': 0,
        'Skip': 0,
        'Take': 10
    };
    $.post(MAA_API_Server + 'budget/getBudgetCalculationAll', data, function (countResult) {
        var countResultObj = JSON.parse(countResult);
        if (countResultObj.Success) {
            var calculationResult = JSON.parse(countResultObj.Message);
            $("#lblCurrentAmount").text(formatRupiah(calculationResult.FinalBudget.toString(), 'Rp'));
            existingbudget = calculationResult.FinalBudget;
        }
    });
}

function formatRupiah(angka, prefix) {
    var number_string = angka.replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}
function selectTab(tabIndex, url) {
    window.location = url;
    $(".tabnavigator > ul > li.active-tab").removeClass("active-tab");
    $("#tabNavigator-li-" + tabIndex).addClass("active-tab");
}

var txtOperationTo = null;
$(document).ready(function () {
    txtOriginalBudgetTo = $("#txtOriginalBudgetTo").kendoNumericTextBox({
        min: 1,
        step: 5,
        max: 9999999999999,
        format: 'n0'
    }).data("kendoNumericTextBox").wrapper.width("100%");
    $("#originalBudgetPlus").prop('disabled', true);
    $("#originalBudgetMinus").prop('disabled', true);
    $("#originalBudgetRemove").prop('disabled', true);
    $.get(MAA_API_Server + 'masterData/getAdverstisingType' + '?id=' + new Date().getTime(), function (data) {
        $("#txtAdvertisingTypeFrom").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            index: 0,
            change: function (e) {
                if (this.value() != "-1") {
                    $.get(MAA_API_Server + 'masterData/getActivity' + '?param=' + this.value(), function (data) {
                        $("#txtActivityFrom").kendoDropDownList({
                            dataTextField: "Value",
                            dataValueField: "Key",
                            dataSource: JSON.parse(data),
                            index: 0,
                            change: function (e) {
                                if (this.value() != "-1") {
                                    loadExistingBudget();
                                }
                            }
                        });
                    });
                }
            }
        });
        $("#txtAdvertisingTypeTo").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            index: 0,
            change: function (e) {
                if (this.value() != "-1") {
                    $.get(MAA_API_Server + 'masterData/getActivity' + '?param=' + this.value(), function (data) {
                        $("#txtActivityTo").kendoDropDownList({
                            dataTextField: "Value",
                            dataValueField: "Key",
                            dataSource: JSON.parse(data),
                            index: 0,
                            change: function (e) {
                                if (this.value() != "-1") {
                                    loadExistingBudget();
                                }
                            }
                        });
                    });
                }
            }
        });
    });
    
    $.get(MAA_API_Server + 'masterData/getOperation' + '?id=' + new Date().getTime(), function (data) {
        txtOperationTo = $("#txtOperationTo").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            index: 0,
            change: function (e) {
                if (this.value() != "-1") {
                    loadExistingBudget();
                }
            }
        }).data("kendoDropDownList");
        txtOperationTo.enable(false);

        $("#txtOperationFrom").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            index: 0,
            change: function (e) {
                if (this.value() != "-1") {
                    txtOperationTo.value(this.value());
                    txtOperationTo.trigger("change");
                    loadExistingBudget();
                }
            }
        });
       
    });
    $("#txtBudgetYearFrom").kendoDatePicker({
        start: "decade",
        depth: "decade",
        format: "yyyy",
        change: function (e) {
            if (this.value() != null || this.value() != undefined) {
                loadExistingBudget();
            }
        }
    });
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
}
$("#btnCancel").on('click', function () {
    window.location = url_Web;
});
$("#btnSave").on("click", function () {
    if ($('#txtAdvertisingTypeFrom').val() == -1) {
        alert('Transfer From Advertising Type is required');
        return;
    }
    if ($('#txtAdvertisingTypeTo').val() == -1) {
        alert('Transfer To Advertising Type is required');
        return;
    }

    if ($('#txtActivityFrom').val() == -1) {
        alert('Transfer From Activity is required');
        return;
    }

    if ($('#txtActivityTo').val() == -1) {
        alert('Transfer To Activity is required');
        return;
    }

    if ($('#txtOperationFrom').val() == -1) {
        alert('Operation is required');
        return;
    }

    if ($('#txtBudgetYearFrom').val() == '') {
        alert('Year is required');
        return;
    }
    
    if ($('#txtAmount').val() == '') {
        alert('Transfer Amount is required!');
        return;
    }
    
    if (existingbudget < $('#txtOriginalBudgetTo').val()) {
        alert('Transfer amount not sufficient !');
        return;
    }
   
    if (uploadedFile == undefined || uploadedFile == null || uploadedFile.length < 1) {
        alert('Attachment file is required');
        return;
    }

    var data = {
        'AdvertisingTypeIdFrom': $('#txtAdvertisingTypeFrom').val(),
        'ActivityIdFrom': $('#txtActivityFrom').val(),
        'OperationIdFrom': $('#txtOperationFrom').val(),
        'Year': $('#txtBudgetYearFrom').val(),
        'OriginalBudget': 0,
        'AdvertisingTypeIdTo': $('#txtAdvertisingTypeTo').val(),
        'ActivityIdTo': $('#txtActivityTo').val(),
        'OperationIdTo': $('#txtOperationTo').val(),
        'TransferAmount': $('#txtOriginalBudgetTo').val(),
        'Attachment': uploadedFile,
        'CreatedBy': $('#CreatedBy').val(),
        'RequestorPINID': $('#RequestorPINID').val(),
        'RequestorName': $('#RequestorName').val(),
        'RequestorPositionID': $('#RequestorPositionID').val(),
        'RequestorPosition': $('#RequestorPosition').val()
    };

    $.post(MAA_API_Server + 'budget/addTransfer', data, function (result) {
        var resultObj = JSON.parse(result);
        if (!resultObj.Success) {
            alert(resultObj.Message);
        } else {
            alert('Budget Transfer Successfully Registered!');
            windows.location = url_Web;
        }
    });
})
