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

    }
  });
});
