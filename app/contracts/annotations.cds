using ValueContractService as service from '../../srv/service';

annotate service.ValueContracts with @(
    UI.HeaderInfo                : {
        TypeName      : 'Value Contract',
        TypeNamePlural: 'Value Contracts',
        Title         : {
            $Type: 'UI.DataField',
            Value: contractNumber
        },
        Description   : {
            $Type: 'UI.DataField',
            Value: customer.name
        },
        ImageUrl : 'https://gartner-lcap-2025.workzone.cfapps.us10.hana.ondemand.com/lcapcontracts.valuecontractmanagementcontracts-0.0.1/assets/ContractIcon.png',
    },
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: contractNumber,
            },
            {
                $Type: 'UI.DataField',
                Value: contractValue,
            },
            {
                $Type: 'UI.DataField',
                Value: totalSpend,
            },
            {
                $Type: 'UI.DataField',
                Value: status,
            },
            {
                $Type: 'UI.DataField',
                Value: startDate,
            },
            {
                $Type: 'UI.DataField',
                Value: endDate,
            },
            {
                $Type: 'UI.DataField',
                Value: creditStatus,
            },
        ],
    },
    UI.Facets                    : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup',
    }, ],
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Value: contractNumber,
            Label: 'Contract Number',
        },
        {
            $Type : 'UI.DataField',
            Label : 'contractValue',
            Value : contractValue,
            Criticality : {$edmJson: {$If: [{$Gt: [{$Path: 'contractValue'}, 500000]}, 1, 3]}},
            CriticalityRepresentation : #WithIcon,
        },
        {
            $Type: 'UI.DataField',
            Value: totalSpend,
            Label: 'Total Spend',
        },
        {
            $Type: 'UI.DataField',
            Value: status,
            Label: 'Status',
        },
        {
            $Type: 'UI.DataField',
            Value: startDate,
            Label: 'Start Date',
        },
        {
            $Type: 'UI.DataField',
            Value: endDate,
            Label: 'End Date',
        },
        {
            $Type: 'UI.DataField',
            Value: creditStatus,
            Label: 'Credit Status',
        },
    ],
);

annotate service.ValueContracts with {
    customer @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'KeyCustomers',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: customer_ID,
                ValueListProperty: 'ID',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'customerNumber',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'name',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'industry',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'riskCategory',
            },
        ],
    }
};
annotate service.ValueContracts with {
    status @Common.FieldControl : #ReadOnly
};

annotate service.ValueContracts with {
    creditStatus @Common.FieldControl : #ReadOnly
};

