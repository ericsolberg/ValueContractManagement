sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (MessageToast, MessageBox) {
    'use strict';

    return {
        onCreditCheckPress: function (oContext, aSelectedContexts) {

             MessageToast.show("You are here.");

            // Check if any contexts are selected
            if (!aSelectedContexts || aSelectedContexts.length === 0) {
                MessageToast.show("Please select at least one contract to perform credit check.");
                return;
            }

            // Get the model from the first selected context
            const oModel = aSelectedContexts[0].getModel();

            // Process each selected contract
            aSelectedContexts.forEach(function (oSelectedContext) {
                const sPath = oSelectedContext.getPath();
                const contractData = oSelectedContext.getObject();

                if (contractData.creditStatus == "Approved") {
                    oModel.bindContext(sPath + "/ValueContractService.setCreditPending(...)").execute().then(function () {
                        oModel.refresh();
                    });
                }
                else {

                    oModel.bindContext(sPath + "/ValueContractService.setCreditUnderReview(...)").execute().then(function () {
                        oModel.refresh();
                        MessageToast.show(`Starting Prospect Research Agent check for contract ${contractData.contractNumber || contractData.ID}...`);
                        // Call the CAP bound action performCreditCheck
                        const sActionPath = sPath + "/ValueContractService.performCreditCheck(...)";
                        setTimeout(() => {

                            oModel.bindContext(sActionPath).execute().then(function () {
                                MessageToast.show(`Prospect Research Agent check completed successfully for contract ${contractData.contractNumber || contractData.ID}!`);
                                // Refresh the model to show updated data
                                oModel.refresh();
                            }).catch(function (oError) {
                                console.error("Error calling performCreditCheck:", oError);
                                let errorMessage = "Prospect Research Agent check failed";

                                if (oError.message) {
                                    errorMessage = oError.message;
                                } else if (oError.error && oError.error.message) {
                                    errorMessage = oError.error.message;
                                }

                                MessageBox.error(`Prospect Research Agent check failed for contract ${contractData.contractNumber || contractData.ID}: ${errorMessage}`);
                            });

                        }, 10000);
                    });
                }
            });
        }
    };
});
