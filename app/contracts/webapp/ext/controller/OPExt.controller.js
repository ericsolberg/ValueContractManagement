sap.ui.define([
	"sap/ui/core/mvc/ControllerExtension",
	"sap/m/MessageToast"
], function (ControllerExtension, MessageToast) {
	"use strict";

	return ControllerExtension.extend("valuecontractmanagement.contracts.ext.controller.OPExt", {
		override: {
			onInit: function () {
			},
			editFlow: {
				onBeforeSave: function (mParameters) {
				},
				/*				onAfterSave: async function (mParameters) {
									const view = this.base.getView();
									const oCtx = view.getBindingContext();
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
				
									oModel.bindContext(sPath + "/ValueContractService.setCreditPending(...)")
										.execute()
										.then(async () => {
											await applySideEffects(oCtx, ["creditStatus"]);
											MessageToast.show(`Credit status set to Pending for contract ${contractId}.`);
										})
										.catch((err) => {
											console.error("setCreditPending failed:", err);
											MessageBox.error("Failed to set credit status to Pending.");
										});
				
								}, */
				/*
onAfterSave: async function () {
	const view = this.base.getView();
	const extApi = this.base.getExtensionAPI();
	const ctx = view.getBindingContext();

	if (!ctx) return;

	// Invoke the bound action on the current document context (FE handles draft vs active)
	await extApi.invokeAction("ValueContractService.setCreditPending", {
		contexts: [ctx],                // target entity
		showActionParameterDialog: false
		// model: extApi.getModel(),    // optional
		// label: "Set Credit Pending"  // optional
	});

	// Refresh the fields you display
	await ctx.requestSideEffects([{ $PropertyPath: "creditStatus" }]);
	sap.m.MessageToast.show("Credit status set to Pending.");
}*/
				onAfterSavex: async function () {
					await new Promise(r => setTimeout(r, 0));
					const view = this.base.getView();
					const ctx = view.getBindingContext();
					if (!ctx) return;

					const model = ctx.getModel();

					// Get a canonical path and force IsActiveEntity=true for draft-enabled entities
					let canonical = await ctx.requestCanonicalPath(); // e.g. "/ValueContracts(ID=...,IsActiveEntity=false)"
					canonical = canonical.replace("IsActiveEntity=false", "IsActiveEntity=true");
					console.log(canonical);

					// Call the bound action on the ACTIVE instance
					await model.bindContext(`${canonical}/ValueContractService.setCreditPending(...)`).execute();

					// Refresh UI
					await ctx.requestSideEffects([{ $PropertyPath: "creditStatus" }]);
					sap.m.MessageToast.show("Credit status set to Pending.");
				}

			}
		}
	});
});
