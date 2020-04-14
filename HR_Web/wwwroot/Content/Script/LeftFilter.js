
function leftFilter_Init() {
    $("#leftFilter_DtpCreatedDate_FROM").kendoDatePicker({
        format: "dd-MMM-yyyy",
        change: leftFilter_Changed_Internal
    });
    $('#leftFilter_DtpCreatedDate_FROM').attr('disabled', 'disabled');
    $("#leftFilter_DtpCreatedDate_TO").kendoDatePicker({
        format: "dd-MMM-yyyy",
        change: leftFilter_Changed_Internal
    });
    $('#leftFilter_DtpCreatedDate_TO').attr('disabled', 'disabled');
    leftFilter_InitGrid("leftFilter_GridFilterRefGroupTypeName", url_OVPAPI + "Filter/ListGroupTypeForLeftFilter");
    leftFilter_InitGrid("leftFilter_GridFilterRefRequestTypeName", url_OVPAPI + "Filter/ListRequestTypeForLeftFilter");
    leftFilter_InitGrid("leftFilter_GridFilterRefMaintenanceTypeName", url_OVPAPI + "Filter/ListMaintenanceTypeForLeftFilter");
    leftFilter_InitGrid("leftFilter_GridFilterRequestStatus", url_OVPAPI + "Filter/ListRequestStatusForLeftFilter");
}

function leftFilter_InitGrid(gridFilterId, dataUrl) {
    $("#" + gridFilterId).kendoGrid({
        dataSource: {
            type: "webapi",
            schema: {
                data: 'Data',
                total: 'Total',
                model: {
                    fields: {
                        FilterValue: { type: "string" },
                        CountRequestData: { type: "number" }
                    }
                }
            },
            transport: {
                read: {
                    url: dataUrl,
                    cache: false,
                    dataType: "json",
                    type: "get"
                }
            },
            error: function (e) {
                this.cancelChanges();
            }
        },
        editable: false,
        change: leftFilter_Changed_Internal,
        columns: [
            {
                selectable: true,
                width: "30px"
            }
            , {
                field: "FilterValue",
                title: "Name"
            }
            , {
                field: "CountRequestData",
                title: "CountRequestData",
                width: "50px",
                template: "(#:CountRequestData#)"
            }
        ],
        filter: leftFilter_DefaultFilter(),
    });

    $("#" + gridFilterId + " .k-grid-header").hide();
}

function leftFilter_DefaultFilter() {
    var filterCreatedBy = 'ronald.shah@ccamatil.com';
    var filterIsAdmin = true;

    var filter = {
        logic: 'and'
    }
    filter.filters = [];

    if (filterCreatedBy) {
        filter.filters.push({
            field: "CreatedBy",
            operator: "eq",
            value: filterCreatedBy,
            FilterName: "filterCreatedBy"
        });
    }

    if (filterIsAdmin || (filterIsAdmin == false)) {
        filter.filters.push({
            field: "IsAdmin",
            operator: "eq",
            value: filterIsAdmin,
            FilterName: "filterIsAdmin"
        });
    }
    return filter;
}


function leftFilter_GetAllKendoFilters() {
    var result = [];

    var leftFilter_DtpCreatedDate_FROM = $("#leftFilter_DtpCreatedDate_FROM").data("kendoDatePicker");
    if (leftFilter_DtpCreatedDate_FROM) {
        var filterCreatedDate_FROM = leftFilter_DtpCreatedDate_FROM.value();
        if (filterCreatedDate_FROM) {
            result.push({
                field: "CreatedDate_FROM",
                operator: "eq",
                value: filterCreatedDate_FROM,
                FilterName: "filterCreatedDate_FROM"
            });
        }
    }

    var leftFilter_DtpCreatedDate_TO = $("#leftFilter_DtpCreatedDate_TO").data("kendoDatePicker");
    if (leftFilter_DtpCreatedDate_TO) {
        var filterCreatedDate_TO = leftFilter_DtpCreatedDate_TO.value();
        if (filterCreatedDate_TO) {
            result.push({
                field: "CreatedDate_TO",
                operator: "eq",
                value: filterCreatedDate_TO,
                FilterName: "filterCreatedDate_TO"
            });
        }
    }

    var kendoFilter_RefGroupTypeName = gridFilter_BuildKendoFilter("leftFilter_GridFilterRefGroupTypeName", "RefGroupTypeName_IN", "filterRefGroupTypeName", function (item) { return "'" + item.FilterValue + "'"; })
    if (kendoFilter_RefGroupTypeName) {
        result.push(kendoFilter_RefGroupTypeName);
    }

    var kendoFilter_RefRequestTypeName = gridFilter_BuildKendoFilter("leftFilter_GridFilterRefRequestTypeName", "RefRequestTypeName_IN", "filterRefRequestTypeName", function (item) { return "'" + item.FilterValue + "'"; })
    if (kendoFilter_RefRequestTypeName) {
        result.push(kendoFilter_RefRequestTypeName);
    }

    var kendoFilter_RefMaintenanceTypeName = gridFilter_BuildKendoFilter("leftFilter_GridFilterRefMaintenanceTypeName", "RefMaintenanceTypeName_IN", "filterRefMaintenanceTypeName", function (item) { return "'" + item.FilterValue + "'"; })
    if (kendoFilter_RefMaintenanceTypeName) {
        result.push(kendoFilter_RefMaintenanceTypeName);
    }

    var kendoFilter_RequestStatus = gridFilter_BuildKendoFilter("leftFilter_GridFilterRequestStatus", "RequestStatus", "filterRequestStatus", function (item) { return "'" + item.FilterValue + "'"; })
    if (kendoFilter_RequestStatus) {
        result.push(kendoFilter_RequestStatus);
    }

    return result;
}

function leftFilter_Changed_Internal() {
    if (leftFilter_Changed) {
        leftFilter_Changed();
    }
}

function leftFilter_BtnClearDtpRequestDate_FROM_Clicked() {
    var leftFilter_DtpRequestDate_FROM = $("#leftFilter_DtpRequestDate_FROM").data("kendoDatePicker");
    leftFilter_DtpRequestDate_FROM.value(null);
   // leftFilter_Changed_Internal();
}

function leftFilter_BtnClearDtpRequestDate_TO_Clicked() {
    var leftFilter_DtpRequestDate_TO = $("#leftFilter_DtpRequestDate_TO").data("kendoDatePicker");
    leftFilter_DtpRequestDate_TO.value(null);
  //  leftFilter_Changed_Internal();
}