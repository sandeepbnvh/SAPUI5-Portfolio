import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageToast from "sap/m/MessageToast";
import Fragment from "sap/ui/core/Fragment";
import { URLHelper } from "sap/m/library";

declare const firebase: any;
declare const Email: any;
declare const process: {
    env: {
        [key: string]: string;
    };
};

/**
 * @namespace com.san.portfolio.controller
 */
export default class main extends Controller {
    private _pPopover: Promise<any> | null = null;

    public onInit(): void {
        const oView = this.getView();
        if (oView) {
            oView.setBusy(true);
            const cardManifests = new JSONModel();
            cardManifests.loadData(
                sap.ui.require.toUrl("com/san/portfolio/card.json")
            );
            oView.setModel(cardManifests, "manifests");
            
            const oTimeline = this.byId("idTimeline") as any;
            if (oTimeline) {
                oTimeline.setEnableScroll(false);
            }

            // Create default model
            const oModel = new JSONModel();
            oView.setModel(oModel);

            // Fetch from Firebase Realtime Database path 'portfolio'
            firebase.database().ref("portfolio").once("value").then((snapshot: any) => {
                const data = snapshot.val();
                if (data) {
                    oModel.setData(data);
                    oView.setBusy(false);
                } else {
                    // Seed database with local data.json if it is empty on Firebase
                    const localModel = new JSONModel();
                    localModel.attachRequestCompleted(() => {
                        const localData = localModel.getData();
                        firebase.database().ref("portfolio").set(localData).then(() => {
                            oModel.setData(localData);
                            oView.setBusy(false);
                        });
                    });
                    localModel.loadData(sap.ui.require.toUrl("com/san/portfolio/model/data.json"));
                }
            }).catch((error: any) => {
                console.error("Failed to fetch portfolio data from Firebase, using fallback data.json: ", error);
                oModel.loadData(sap.ui.require.toUrl("com/san/portfolio/model/data.json"));
                oView.setBusy(false);
            });
        }
    }

    public handleIconTabBarSelect(): void {
        // Tab selection handler (placeholder to prevent warnings)
    }

    public downloadResume(): void {
        const sURL = "https://firebasestorage.googleapis.com/v0/b/portfolio-7b056.appspot.com/o/Sandeep%20A%20N_Resume-converted.pdf?alt=media&token=487486a2-3b22-4a31-a675-a6b622422c18";
        window.open(sURL, "_blank");
    }

    public handlePopoverPress(oEvent: any): void {
        const oButton = oEvent.getSource();
        const oView = this.getView();
        if (!oView) {
            return;
        }

        if (!this._pPopover) {
            this._pPopover = Fragment.load({
                id: oView.getId(),
                name: "com.san.portfolio.fragment.detail",
                controller: this
            }).then((oPopover: any) => {
                oView.addDependent(oPopover);
                return oPopover;
            });
        }
        
        this._pPopover.then((oPopover: any) => {
            oPopover.openBy(oButton);
        });
    }

    public onSave(): void {
        const oView = this.getView();
        if (!oView) {
            return;
        }

        const nameInput = this.byId("name") as any;
        const emailInput = this.byId("email") as any;
        const msgInput = this.byId("message") as any;
        const phoneInput = this.byId("phNum") as any;

        const name = nameInput ? nameInput.getValue().trim() : "";
        const email = emailInput ? emailInput.getValue().trim() : "";
        const msg = msgInput ? msgInput.getValue().trim() : "";
        const phone = phoneInput ? phoneInput.getValue().trim() : "";

        const mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
        const phRegex = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

        if (name === "" || email === "" || phone === "") {
            MessageToast.show("Please enter Valid Details");
        } else if (!mailregex.test(email)) {
            MessageToast.show(email + " is not a valid email address");
        } else if (!phRegex.test(phone)) {
            MessageToast.show(phone + " is not a valid Phone Number");
        } else {
            const oDialog = this.byId("BusyDialog") as any;
            if (oDialog) {
                oDialog.open();
            }

            Email.send({
                SecureToken: process.env.SMTP_SECURE_TOKEN,
                To: 'sandeep.bnvh@gmail.com',
                From: 'sandeep.bnvh2@gmail.com',
                Subject: name + " sent a message -- Portfolio!!!",
                Body: "From Email :" + email + " Phone Number:" + phone + " Message:" + msg
            }).then((message: string) => {
                if (message === 'OK') {
                    try {
                        const messagesRef = firebase.database().ref("messages");
                        const newMessageRef = messagesRef.push();
                        newMessageRef.set({
                            name: name,
                            email: email,
                            msg: msg,
                            phone: phone
                        });
                    } catch (e) {
                        console.error("Firebase Database write failed: ", e);
                    }
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Submitted Successfully");
                } else {
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show(email + " is not a valid email address");
                }
            }).catch((err: any) => {
                if (oDialog) {
                    oDialog.close();
                }
                console.error("Email sending error: ", err);
                MessageToast.show("Error submitting the form.");
            });

            const oPopover = this.byId("mypopover") as any;
            if (oPopover) {
                oPopover.close();
            }
        }
    }

    public handleCloseButton(): void {
        const oPopover = this.byId("mypopover") as any;
        if (oPopover) {
            oPopover.close();
        }
    }

    public initializeForm(): void {
        const nameInput = this.byId("name") as any;
        const emailInput = this.byId("email") as any;
        const msgInput = this.byId("message") as any;
        if (nameInput) nameInput.setValue("");
        if (emailInput) emailInput.setValue("");
        if (msgInput) msgInput.setValue("");
    }

    public onLinkedIn(): void {
        window.open("https://www.linkedin.com/in/sandeepbnvh/");
    }

    public ongithub(): void {
        window.open("https://github.com/sandeepbnvh");
    }

    public onInstagram(): void {
        window.open("https://instagram.com/sandeep.a.n");
    }

    public onMail(): void {
        URLHelper.triggerEmail("sandeep.bnvh@gmail.com", "Say Hi", "");
    }
}