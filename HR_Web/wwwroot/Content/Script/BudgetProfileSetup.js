var selectedAdvertisingType = null;
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
                alert("The attachment already contain file with name " + files[i].name + ".");
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

function showWindow(title, templateId, isMinus, controlId) {
    var window = $("<div/>").kendoWindow({
        width: "500px",
        height: '300px',
        animation: false,
        resizable: false,
        iframe: false,
        modal: true,
        title: title,
        visible: false,
        draggable: false,
        autoFocus: true,
        actions: [
        ],
        close: function (e) {
        },
    }).data("kendoWindow");
    window.content($('#' + templateId).html());
    $("#btnAddAmount").on("click", function () {
        setTimeout(function () {
            txtOriginalBudget.value($("#txtAmount").val());
            txtOriginalBudget.trigger("change");

            $("#txtAmount").data('kendoNumericTextBox').destroy();
            $("#txtAmount").empty();
            $("#txtAmount").remove();
            $("#btnAddAmount").unbind("click");
            $("#btnAddAmount").remove();
            window.center().close();

            $("#attachmentControl").show();
            $("#budgetControl").show();
            $("#btnSave").show();
            isEditMode = true;
        }, 0);

    });
    if (isMinus) {
        $("#txtAmount").kendoNumericTextBox({
            max: 0,
            step: 5,
        });
    } else {
        $("#txtAmount").kendoNumericTextBox({
            min: 0,
            step: 5,
        });

    }

    window.center().open();
}

$('#originalBudgetPlus').click(function () {
    showWindow('Increase budget', 'tpBudgetInput', false, 'txtOriginalBudget');
});
$('#originalBudgetMinus').click(function () {
    showWindow('Decrease budget', 'tpBudgetInput', true, 'txtOriginalBudget');
});

var uniqId = (function () {
    var i = 0;
    return function () {
        return i++;
    }
})();

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

function loadExistingBudget() {

    if ($('#txtAdvertisingType').val() == -1) {
        return;
    }

    if ($('#txtActivity').val() == -1) {
        return;
    }

    if ($('#txtOperation').val() == -1) {
        return;
    }

    if ($('#txtBudgetYear').val() == '') {
        return;
    }

    var advertisingTypeId, activityId, operationId, budgetYear = null;
    advertisingTypeId = $('#txtAdvertisingType').val();
    activityId = $('#txtActivity').val();
    operationId = $('#txtOperation').val();
    budgetYear = $('#txtBudgetYear').val();

    var data = {
        'AdvertisingTypeId': advertisingTypeId,
        'ActivityId': activityId,
        'OperationId': operationId,
        'Year': budgetYear,
        'OriginalBudget': 0,
        'Skip': 0,
        'Take': 10
    };

    function getGridDataSource(resultObj, page, pageSize) {
        var dataSource = new kendo.data.DataSource({
            type: "json",
            data: JSON.parse(resultObj.Message),
            serverGrouping: true,
            schema: {
                model: {
                    fields: {
                        AdvertisingTypeId: { type: "string" },
                        ActivityId: { type: "string" },
                        OperationId: { type: "string" },
                        Year: { type: "number" },
                        OriginalBudget: { type: "number" },
                        CreatedBy: { type: "string" },
                        CreatedDate: { type: "string" },
                        Attachment: { type: "array" }
                    }
                },
                total: function (data) {
                    var d = JSON.parse(resultObj.Message);
                    if (d && d.length > 0) {
                        return d[0].TotalRow;
                    }

                    return 0;
                },
            },
            page: page,
            pageSize: pageSize,
            serverPaging: true
        });

        return dataSource;
    }

    $.post(MAA_API_Server + 'budget/get', data, function (result) {
        var resultObj = JSON.parse(result);
        if (!resultObj.Success) {
            try {
                $('#budgetAdjustmentHistory').kendoGrid('destroy').empty();
                $('#budgetAdjustmentHistory').attr('style', '');
                $('#budgetAdjustmentHistory').css('visibility', 'visible');
            } catch (e) {

            }

            $("#originalBudgetPlus").hide();
            $("#originalBudgetMinus").hide();
            $("#originalBudgetRemove").hide();

            $("#txtOriginalBudget").prop('disabled', false);
            $("#budgetControl").show();
            txtOriginalBudget.enable(true);
            setTimeout(function () {
                txtOriginalBudget.value('');
                txtOriginalBudget.trigger("change");
            }, 0);
            $("#attachmentControl").show();
            $("#budgetControl").show();
            $("#btnSave").show();
            $("#budgetCount").hide();
        } else {
            $.post(MAA_API_Server + 'budget/getBudgetCalculation', data, function (countResult) {
                var countResultObj = JSON.parse(countResult);
                if (countResultObj.Success) {
                    var calculationResult = JSON.parse(countResultObj.Message);
                    $("#budgetCount").show();
                    $("#initialBudget").text(formatRupiah(calculationResult.InitialBudget.toString(), 'Rp'));
                    $("#totalAdjustment").text(formatRupiah(calculationResult.TotalAdjustment.toString(), 'Rp'));
                    $("#finalBudget").text(formatRupiah(calculationResult.FinalBudget.toString(), 'Rp'));
                }
            });
            $("#originalBudgetPlus").show();
            $("#originalBudgetMinus").show();
            $("#originalBudgetRemove").show();

            $("#originalBudgetPlus").prop('disabled', false);
            $("#originalBudgetMinus").prop('disabled', false);
            $("#originalBudgetRemove").prop('disabled', false);

            $("#btnSave").hide();
            $("#attachmentControl").hide();
            $("#budgetControl").hide();

            txtOriginalBudget.enable(false);
            $("#txtOriginalBudget").val('');

            setTimeout(function () {
                txtOriginalBudget.value('');
                txtOriginalBudget.trigger("change");
            }, 0);

            $('#budgetAdjustmentHistory').show();
            $("#budgetAdjustmentHistory").kendoGrid({
                dataSource: getGridDataSource(resultObj,1,10),
                pageable: {
                    refresh: false,
                    buttonCount: 5,
                    pageSizes: [10, 50, 100]
                },
                autoBind: true,
                scrollable: false,
                sortable: false,
                filterable: false,
                columns: [
                    { field: "AdvertisingTypeId", title: "Advertising Type", width: "130px" },
                    { field: "ActivityId", title: "Activity", width: "130px" },
                    { field: "OperationId", title: "Operation", width: "130px" },
                    { field: "Year", title: "Budget Year", width: "130px" },
                    { field: "OriginalBudget", title: "Budget", width: "130px" },
                    { field: "CreatedBy", title: "Created By", width: "130px" },
                    { field: "CreatedDate", title: "Created Date", width: "130px" },
                    {
                        field: "Attachment", title: "Attachment", width: "130px", template: function statusTemplate(dataRow) {
                            var content = '';
                            for (var i = 0; i < dataRow.Attachment.length; i++) {
                                content += '<a href="' + dataRow.Attachment[i].Url + '">' + dataRow.Attachment[i].Name + '</a><br/>';
                            }
                             
                            return content;
                        }
                    }
                ]
            });
            var grid = $("#budgetAdjustmentHistory").data("kendoGrid");
            function page_item(e) {
                window.kendo.ui.progress($("#budgetAdjustmentHistory"), true);
                grid.unbind("dataBound");
                data = {
                    'AdvertisingTypeId': advertisingTypeId,
                    'ActivityId': activityId,
                    'OperationId': operationId,
                    'Year': budgetYear,
                    'OriginalBudget': 0,
                    'Skip': e.sender.dataSource.skip(),
                    'Take': e.sender.dataSource.pageSize()
                };
                $.post(MAA_API_Server + 'budget/get', data, function (result2) {
                    var header = JSON.parse(result2);
                    //grid.dataSource.data(JSON.parse(header.Message));
                    grid.setDataSource(getGridDataSource(header, e.sender.dataSource.page(), e.sender.dataSource.pageSize()));
                    grid.bind("dataBound", page_item);
                    window.kendo.ui.progress($("#budgetAdjustmentHistory"), false);
                });
            };
            grid.bind("dataBound", page_item);
        }
    });
}
function selectTab(tabIndex, url) {
    window.location = url;
    $(".tabnavigator > ul > li.active-tab").removeClass("active-tab");
    $("#tabNavigator-li-" + tabIndex).addClass("active-tab");
}
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
function initialView() {
    $("#originalBudgetPlus").prop('disabled', true);
    $("#originalBudgetMinus").prop('disabled', true);
    $("#originalBudgetRemove").prop('disabled', true);
}

var txtOriginalBudget = null;
$(document).ready(function () {
    initialView();
    txtOriginalBudget = $("#txtOriginalBudget").kendoNumericTextBox({
        min: -9999999999999,
        step: 5,
        max: 9999999999999,
        format: 'n0'
    }).data("kendoNumericTextBox");
    txtOriginalBudget.wrapper.width("100%");

    $.get(MAA_API_Server + 'masterData/getAdverstisingType' + '?id=' + new Date().getTime(), function (data) {
        $("#txtAdvertisingType").kendoDropDownList({
            dataTextField: "Value",
            dataValueField: "Key",
            dataSource: JSON.parse(data),
            index: 0,
            change: function (e) {
                if (this.value() != "-1") {
                    $.get(MAA_API_Server + 'masterData/getActivity' + '?param=' + this.value(), function (data) {
                        $("#txtActivity").kendoDropDownList({
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
        $("#txtOperation").kendoDropDownList({
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
    $("#txtBudgetYear").kendoDatePicker({
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

$("#originalBudgetRemove").on("click", function () {
    $('#txtOriginalBudget').val('');
})
$("#btnCancel").on('click', function () {
    if (isEditMode) {
        if (!confirm("You haven't save your work. Do you want to leave?")) {
            return;
        } else {
            window.location = url_Web;
        }
    } else {
        window.location = url_Web;
    }
});

$("#btnSave").on("click", function () {
    if ($('#txtAdvertisingType').val() == -1) {
        alert('Advertising Type is required');
        return;
    }

    if ($('#txtActivity').val() == -1) {
        alert('Activity is required');
        return;
    }

    if ($('#txtOperation').val() == -1) {
        alert('Operation is required');
        return;
    }

    if ($('#txtBudgetYear').val() == '') {
        alert('Year is required');
        return;
    }

    if ($('#txtOriginalBudget').val() == '') {
        alert('Original Budget is required!');
        return;
    }

    var advertisingType = $('#txtAdvertisingType').val();
    var activityType = $('#txtActivity').val();
    var operation = $('#txtOperation').val();
    var budgetYear = $('#txtBudgetYear').val();
    var originalBudget = $('#txtOriginalBudget').val();

    if (uploadedFile == undefined || uploadedFile == null || uploadedFile.length < 1) {
        alert('Attachment file is required');
        return;
    }

    var data = {
        'AdvertisingTypeId': advertisingType,
        'ActivityId': activityType,
        'OperationId': operation,
        'Year': budgetYear,
        'OriginalBudget': originalBudget,
        'Attachment': uploadedFile,
        'CreatedBy': $('#CreatedBy').val(),
        'RequestorPINID': $('#RequestorPINID').val(),
        'RequestorName': $('#RequestorName').val(),
        'RequestorPositionID': $('#RequestorPositionID').val(),
        'RequestorPosition': $('#RequestorPosition').val()
    };

    $.post(MAA_API_Server + 'budget/add', data, function (result) {
        var resultObj = JSON.parse(result);
        if (!resultObj.Success) {
            alert(resultObj.Message);
        } else {
            alert(resultObj.Message);
            document.getElementById("fileInput").value = "";
            uploadedFile = [];
            $('.filename-container').html('');
            $('#attachmentControl').hide();
            isEditMode = false;
            loadExistingBudget();
        }
    });
})
