sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"valuecontractmanagement/customers/test/integration/pages/KeyCustomersList",
	"valuecontractmanagement/customers/test/integration/pages/KeyCustomersObjectPage"
], function (JourneyRunner, KeyCustomersList, KeyCustomersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('valuecontractmanagement/customers') + '/test/flpSandbox.html#valuecontractmanagementcustome-tile',
        pages: {
			onTheKeyCustomersList: KeyCustomersList,
			onTheKeyCustomersObjectPage: KeyCustomersObjectPage
        },
        async: true
    });

    return runner;
});

