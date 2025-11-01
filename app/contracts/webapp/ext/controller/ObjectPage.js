sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (MessageToast, MessageBox) {
    "use strict";

    return {
        /**
         * Works on the Object Page's current context (no selected rows).
         * @param {sap.ui.base.Event} oEvent press event from the header action
         */
        onCreditCheckPress: function (oCtx) {

            if (!oCtx) {
                MessageToast.show("No contract context found on the Object Page.");
                return;
            }

            const oModel = oCtx.getModel();
            const sPath = oCtx.getPath();
            const contractData = oCtx.getObject();

            const contractId = contractData.contractNumber || contractData.ID || "(unknown)";

            // Helper to refresh UI after actions
            const applySideEffects = async (oCtx, aProps = ["creditStatus"]) => {
                try {
                    await oModel.submitBatch(oModel.getUpdateGroupId());
                    await oCtx.requestSideEffects(aProps.map(p => ({ $PropertyPath: p })));
                } catch (e) {
                    // optional: log
                }
            };

            // If already Approved → set to Pending; otherwise → set UnderReview then run the long check
            if (contractData.creditStatus === "Approved") {
                oModel.bindContext(sPath + "/ValueContractService.setCreditPending(...)")
                    .execute()
                    .then(async () => {
                        await applySideEffects(oCtx, ["creditStatus"]);
                    })
                    .catch((err) => {
                        console.error("setCreditPending failed:", err);
                        MessageBox.error("Failed to set credit status to Pending.");
                    });
            } else {
                oModel.bindContext(sPath + "/ValueContractService.setCreditUnderReview(...)")
                    .execute()
                    .then(async () => {
                        await applySideEffects(oCtx, ["creditStatus"]);
                        MessageToast.show(`Starting Prospect Research Agent check for contract ${contractId}...`);

                        // Call the long-running check after a short delay (as in your LR code)
                        const sActionPath = sPath + "/ValueContractService.performCreditCheck(...)";
                        setTimeout(() => {
                            oModel.bindContext(sActionPath)
                                .execute()
                                .then(async () => {
                                    MessageToast.show(`Prospect Research Agent check completed for contract ${contractId}.`);
                                    await applySideEffects(oCtx, ["creditStatus"]);
                                })
                                .catch((oError) => {
                                    console.error("performCreditCheck failed:", oError);
                                    let errorMessage = "Prospect Research Agent check failed";
                                    if (oError?.message) {
                                        errorMessage = oError.message;
                                    } else if (oError?.error?.message) {
                                        errorMessage = oError.error.message;
                                    }
                                    MessageBox.error(`Prospect Research Agent check failed for contract ${contractId}: ${errorMessage}`);
                                });
                        }, 5000);
                    })
                    .catch((err) => {
                        console.error("setCreditUnderReview failed:", err);
                        MessageBox.error("Failed to set credit status to Under Review.");
                    });
            }
        },

        /*
        onInit: function () {
            console.log("Here you are. wow.");
            this.extensionAPI.getTransactionController().attachAfterActivate(function () {
                // Your custom code to be executed after draft activation
                sap.m.MessageBox.success("Draft activated successfully!");
                // Example: Navigate to another page or refresh data
            });
        }
        onInit: function () {
            console.log("You are at the start");
            const api = this.base.getExtensionAPI();
            const ef = api.getEditFlow();

            // Before Save: set creditStatus to "Pending" when contractValue increased
            ef.attachBeforeSave(() => {
                const view = this.base.getView();
                const ctx = view.getBindingContext();      // OData V4 Context
                if (!ctx) { return; }
                const model = ctx.getModel();                // OData V4 Model

                // Current (possibly edited) value
                const curr = Number(ctx.getProperty("contractValue"));
                // Original value from server (pre-edit)
                const orig = Number(model.getOriginalProperty("contractValue", ctx));

                if (Number.isFinite(curr) && Number.isFinite(orig) && curr > orig) {
                    ctx.setProperty("creditStatus", "Pending"); // included in the same save
                }
            });

            // After Save: refresh affected fields on the page
            ef.attachAfterSave(async () => {
                const ctx = this.base.getView().getBindingContext();
                if (ctx) {
                    await ctx.requestSideEffects([
                        { $PropertyPath: "creditStatus" },
                        { $PropertyPath: "lastCreditCheck" } // include if you also show it
                    ]);
                }
            });
            console.log("You are at the end");
        }
        */
    }
});
