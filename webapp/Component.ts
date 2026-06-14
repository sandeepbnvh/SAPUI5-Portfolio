import BaseComponent from "sap/ui/core/UIComponent";
import { createDeviceModel } from "./model/models";
import { initializeFirebase } from "./model/firebase";
import BusyIndicator from "sap/ui/core/BusyIndicator";

/**
 * @namespace com.san.portfolio
 */
export default class Component extends BaseComponent {

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
		this.setModel(initializeFirebase(), "firebase");

        // enable routing
        this.getRouter().initialize();

		BusyIndicator.hide();
	}
}