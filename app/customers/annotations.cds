using ValueContractService as service from '../../srv/service';

annotate service.KeyCustomers with @(
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: customerNumber,
            },
            {
                $Type: 'UI.DataField',
                Value: name,
            },
            {
                $Type: 'UI.DataField',
                Value: industry,
            },
            {
                $Type: 'UI.DataField',
                Value: riskCategory,
            },
            {
                $Type: 'UI.DataField',
                Value: totalContractValue,
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
            Value: customerNumber,
        },
        {
            $Type: 'UI.DataField',
            Value: name,
        },
        {
            $Type: 'UI.DataField',
            Value: industry,
        },
        {
            $Type: 'UI.DataField',
            Value: riskCategory,
        },
        {
            $Type: 'UI.DataField',
            Value: totalContractValue,
        },
    ],
);
