import BaseComponent from "sap/ui/core/UIComponent";
import { createDeviceModel } from "./model/models";
import { initializeFirebase } from "./model/firebase";
import BusyIndicator from "sap/ui/core/BusyIndicator";

import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.san.portfolio
 */
export default class Component extends BaseComponent {
	public firebaseInitPromise: Promise<void> | null = null;

	public static metadata = {
		manifest: "json",
        interfaces: [
            "sap.ui.core.IAsyncContentCreation"
        ]
	};

	public init() : void {
		BusyIndicator.show(0);
		// call the base component's init function
		super.init();

        // set the device model
        this.setModel(createDeviceModel(), "device");

		// set the firebase model
		const fbModel = new JSONModel();
		this.setModel(fbModel, "firebase");
		this.firebaseInitPromise = initializeFirebase(fbModel);

        // enable routing
        this.getRouter().initialize();

		BusyIndicator.hide();
	}
}