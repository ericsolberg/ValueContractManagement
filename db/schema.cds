namespace valuecontract.db;

using {
    cuid,
    managed,
    Currency
} from '@sap/cds/common';

entity KeyCustomers : cuid, managed {
    customerNumber     : String(20)      @title: 'Customer Number'       @mandatory;
    name               : String(100)     @title: 'Customer Name'         @mandatory;
    industry           : String(50)      @title: 'Industry';
    riskCategory       : String(10)      @title: 'Risk Category'         @values                       : [
        'Low',
        'Medium',
        'High'
    ]  default 'Medium';
    totalContractValue : Decimal(15, 2)  @title: 'Total Contract Value'  @Semantics.amount.currencyCode: 'EUR';

    // Navigation
    contracts          : Composition of many ValueContracts
                             on contracts.customer = $self;
    creditProfile      : Composition of one CreditProfiles
                             on creditProfile.customer = $self;
}

entity ValueContracts : cuid, managed {
    contractNumber  : String(20)                   @title: 'Contract Number'  @mandatory;
    customer        : Association to KeyCustomers  @title: 'Customer'         @mandatory;
    contractValue   : Decimal(15, 2)               @title: 'Contract Value'   @Semantics.amount.currencyCode: 'EUR'  @mandatory;
    totalSpend      : Decimal(15, 2)               @title: 'Total Spend'      @Semantics.amount.currencyCode: 'EUR'  default 0;
    status          : String(20)                   @title: 'Status'           @values                       : [
        'Draft',
        'Active',
        'Completed',
        'Terminated'
    ]  default 'Draft';
    startDate       : Date                         @title: 'Start Date';
    endDate         : Date                         @title: 'End Date';
    creditStatus    : String(20)                   @title: 'Credit Status'    @values                       : [
        'Pending',
        'Approved',
        'Rejected',
        'Under Review'
    ]  default 'Pending';
    prospectReport  : LargeString                  @title: 'Prospect Report';

    // Navigation
    assessments     : Composition of many CreditAssessments
                          on assessments.contract = $self;
    items           : Composition of many ContractItems
                          on items.contract = $self;
}

entity CreditProfiles : cuid, managed {
    customer           : Association to one KeyCustomers  @title: 'Customer'          @mandatory;
    creditLimit        : Decimal(15, 2)                   @title: 'Credit Limit'      @Semantics.amount.currencyCode: 'EUR';
    currentExposure    : Decimal(15, 2)                   @title: 'Current Exposure'  @Semantics.amount.currencyCode: 'EUR'  default 0;
    creditRating       : String(10)                       @title: 'Credit Rating'     @values                       : [
        'AAA',
        'AA',
        'A',
        'BBB',
        'BB',
        'B',
        'CCC',
        'CC',
        'C',
        'D'
    ];
    lastAssessmentDate : DateTime                         @title: 'Last Assessment Date';
    riskScore          : Integer                          @title: 'Risk Score'        @assert.range                 : [
        0,
        100
    ];
}

entity CreditAssessments : cuid, managed {
    contract        : Association to ValueContracts  @title: 'Contract'         @mandatory;
    assessmentDate  : DateTime                       @title: 'Assessment Date'  @mandatory;
    riskScore       : Integer                        @title: 'Risk Score'       @assert.range: [
        0,
        100
    ];
    recommendation  : String(20)                     @title: 'Recommendation'   @values      : [
        'Approve',
        'Reject',
        'Review Required'
    ];
    aiAgentFindings : LargeString                    @title: 'AI Agent Findings';
    assessor        : String(100)                    @title: 'Assessor';
    status          : String(20)                     @title: 'Status'           @values      : [
        'In Progress',
        'Completed'
    ]  default 'In Progress';
}

entity ContractItems : cuid, managed {
    contract    : Association to ValueContracts  @title: 'Contract'      @mandatory;
    itemNumber  : Integer                        @title: 'Item Number'   @mandatory;
    description : String(200)                    @title: 'Description';
    quantity    : Decimal(13, 3)                 @title: 'Quantity';
    unitPrice   : Decimal(15, 2)                 @title: 'Unit Price'    @Semantics.amount.currencyCode: 'EUR';
    totalAmount : Decimal(15, 2)                 @title: 'Total Amount'  @Semantics.amount.currencyCode: 'EUR';
}
