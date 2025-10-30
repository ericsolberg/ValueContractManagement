sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"valuecontractmanagement/contracts/test/integration/pages/ValueContractsList",
	"valuecontractmanagement/contracts/test/integration/pages/ValueContractsObjectPage"
], function (JourneyRunner, ValueContractsList, ValueContractsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('valuecontractmanagement/contracts') + '/test/flpSandbox.html#valuecontractmanagementcontrac-tile',
        pages: {
			onTheValueContractsList: ValueContractsList,
			onTheValueContractsObjectPage: ValueContractsObjectPage
        },
        async: true
    });

    return runner;
});

