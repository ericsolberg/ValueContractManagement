sap.ui.define([
  "sap/fe/core/AppComponent",
  "sap/ui/model/json/JSONModel"
], function (AppComponent, JSONModel) {
  "use strict";

  return AppComponent.extend("valuecontractmanagement.contracts.Component", {
    metadata: {
      manifest: "json"
    },

    init: function () {
      // Always call base class init first so FE runtime initializes correctly
      AppComponent.prototype.init.apply(this, arguments);

      // --- Add assets model (works in cds watch, BAS, and Work Zone) ---
      const baseUrl = sap.ui.require.toUrl("valuecontractmanagement/contracts/assets/");
      const oAssetsModel = new JSONModel({
        baseUrl: baseUrl,
        pdfFile: "prospect-report-after.pdf",
        pdfBefore: "prospect-report-before.pdf",
        pdfAfter: "prospect-report-after.pdf",
        contractIcon: "ContractIcon.png"
      });

      // Register model globally as "assets"
      this.setModel(oAssetsModel, "assets");
    }
  });
});
