var dmeList = [{
    Form:"Submission",
    RequestNumber: "DME/NO-RNI-2019-0001",
    Period: "January",
    DocStatus: "Waiting Approval",
    ApprovalStatus: "In Process",
    Requestor: "Ranty Ferani",
    Operation: "West Java",
    AdvertisingType: "CDE",
    Activity: "CDE Bundling",
    MarketingProgram: "Ragunan Contractual",
    JoinActivity: "CCBI",
    Market: "General Trade - Direct",
    TotalRequestAmount: "100000000"
   
}, {
        Form: "Top Up",
        RequestNumber: "TOP/NO-RNI-2019-0002",
        Period: "January",
        DocStatus: "Pending Action Request",
        //DocStatus: "Completed - Realization In Progress",
        ApprovalStatus: "In Process",
        //ApprovalStatus: "Approved",
        Requestor: "Ranty Ferani",
        Operation: "East Java",
        AdvertisingType: "CDE",
        Activity: "CDE Bundling",
        MarketingProgram: "Support Veranda",
        JoinActivity: "CCI 100 %",
        Market: "General Trade - Direct",
        TotalRequestAmount: "20000000"
    }];

var dataDocList = [{
    Form: "Submission",
    RequestNumber: "DME/NO-RNI-2019-0003",
    Period: "February",
    DocStatus: "Completed - Realization In Progress",
    ApprovalStatus: "Approved",
    Requestor: "Ranty Ferani",
    Operation: "West Java",
    AdvertisingType: "CDE",
    Activity: "CDE Bundling",
    MarketingProgram: "Ragunan Contractual",
    JoinActivity: "CCBI",
    Market: "General Trade - Direct",
    TotalRequestAmount: "50000000"

}, {
    Form: "Top Up",
    RequestNumber: "TOP/NO-RNI-2019-0004",
        Period: "February",
    DocStatus: "Completed - Realization In Progress",
    ApprovalStatus: "Approved",
    Requestor: "Ranty Ferani",
    Operation: "East Java",
    AdvertisingType: "CDE",
    Activity: "CDE Bundling",
    MarketingProgram: "Support Veranda",
    JoinActivity: "CCI 100 %",
    Market: "General Trade - Direct",
    TotalRequestAmount: "75000000"
}];

var FilterFormType = [
    {
        Name: "DME Submission",
        Count: ""
    }, {
        Name: "DME Top Up",
        Count: ""
    }, {
        Name: "DME Reverse",
        Count: ""
    }, {
        Name: "Sampling Direct",
        Count: ""
    }, {
        Name: "Sampling Indirect",
        Count: ""
    }, {
        Name: "Promo On Invoice Period",
        Count: ""
    }, {
        Name: "Promo On Invoice Request",
        Count: ""
    }, {
        Name: "Pricing GWP",
        Count: ""
    }, {
        Name: "Pricing Held Base",
        Count: ""
    }
];

var FilterDocStatus = [
    {
        Name: "Completed - Realization in Progress",
        Count: ""
    }, {
        Name: "Completed - Reversal in Progress",
        Count: ""
    }, {
        Name: "Completed - Reversal Done",
        Count: ""
    }, {
        Name: "Completed - Promo Done",
        Count: ""
    }, {
        Name: "Completed - Pricing Done",
        Count: ""
    }
];

var FilterApprovalStatus = [
    {
        Name: "Draft",
        Count: ""
    }, {
        Name: "In Process",
        Count: ""
    }, {
        Name: "Rejected",
        Count: ""
    }, {
        Name: "Send Back",
        Count: ""
    }, {
        Name: "Completed",
        Count: ""
    }
];

var FilterSubtotalBy = [
    {
        Name: "Operation",
        Count: "(38)"
    }, {
        Name: "Advertising Type",
        Count: "(38)"
    }, {
        Name: "Activity",
        Count: "(38)"
    }, {
        Name: "Period",
        Count: "(38)"
    }, {
        Name: "Marketing Program",
        Count: "(38)"
    }, {
        Name: "Join Activity",
        Count: "(38)"
    }, {
        Name: "Market",
        Count: "(38)"
    }, {
        Name: "Requestor",
        Count: "(38)"
    }
];







