sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/san/portfoli/model/models",
	"com/san/portfoli/firebase"
], function (UIComponent, Device, models,Firebase) {
	"use strict";

	return UIComponent.extend("com.san.portfoli.Component", {
		
		metadata: {
			manifest: "json",
			card:"json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			sap.ui.core.BusyIndicator.show(3000);
			
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// Import Firebase in the sap.ui.define
			// set the firebase model by calling the initializeFirebase function in the Firebase.js file
		this.setModel(Firebase.initializeFirebase(), "firebase");
		sap.ui.core.BusyIndicator.hide();
		}
	});
});
