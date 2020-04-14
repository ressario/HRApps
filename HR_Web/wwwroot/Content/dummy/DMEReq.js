var products = [
//    {
//    Operation: "Balinusa",
//    OriginalBudget: "3000000000",
//    Adjustment: "250000000",
//    AdjBudgetBalance: "3250000000",
//    YTDDME: "1650000000",
//    TotalRequest: "1000000000",
//    SamplingAmount: ""
//}, {
//    Operation: "Central Java",
//    OriginalBudget: "200000000",
//    Adjustment: "10000000",
//    AdjBudgetBalance: "210000000",
//    YTDDME: "100000000",
//    TotalRequest: "500000000",
//    SamplingAmount: ""
//    }
];

var channels = [];

var brands = [];

var approval1s = [{
    Approval1: '<font color="orange" size="2"><b>Waiting Approval</b></font> <br/> <b>Devita Fina</b> <br/> <b>Remarks:</b> ',
    Approval2: '<font color="orange" size="2"><b>Waiting Approval</b></font> <br/> <b>Puspa</b> <br/> <b>Remarks:</b>',
    Approval3: '<font color="orange" size="2"><b>Waiting Approval</b></font> <br/> <b>Fariz Hamza</b> <br/> <b>Remarks:</b>',
    Approval4: '<font color="orange" size="2"><b>Waiting Approval</b></font> <br/> <b>Laurent Blanc</b> <br/> <b>Remarks:</b>',
    Approval5: '<font color="orange" size="2"><b>Waiting Approval</b></font> <br/> <b>Victor Valdes</b> <br/> <b>Remarks:</b>'
}];

var approval2s = [{
    Approval1: '<font color="orange" size="2"><b>Waiting Approval</b></font> <br/> <b>Victor Valdes</b> <br/> <b>Remarks:</b>',
    Approval2: '<font color="black" size="2"><b>Not Required</b></font> ',
    Approval3: '<font color="black" size="2"><b>Not Required</b></font> ',
    Approval4: '<font color="black" size="2"><b>Not Required</b></font> ',
    Approval5: '<font color="black" size="2"><b>Not Required</b></font> '
}];

var OperationList = [{
    OperationID: "1",
    OperationDesc: "National Office"
}];

var RegionList = [{
    RegionID: "1",
    RegionDesc: "East Indonesia"
}];

var MarketList = [{
    MarketID: "1",
    MarketDesc: "General Trade - DIRECT"
}];

var AdvertisingTypeList = [{
    AdvertisingTypeID: "1",
    AdvertisingTypeDesc: "GT - PICOS"
}];

var ActivityList = [{
    ActivityID: "1",
    ActivityDesc: "Permanent POSM"
}];

var JoinActivityList = [{
    JoinActivityID: "1",
    JoinActivityDesc: "CCBI 100%"
}];

var MarketingProgramNameList = [{
    MarketingProgramNameID: "1",
    MarketingProgramNameDesc: "Channel Marketing"
}];