sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/m/UploadCollectionParameter"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.m.UploadCollectionParameter} UploadCollectionParameter
     */
    function (BaseController, MessageBox, UploadCollectionParameter) {
        "use strict";

        return BaseController.extend("proyectofinal.proyectofinal.controller.controller.CrearEmpleado", {

            onInit() {

                this._wizard = this.byId("W_CrearEmpleado");

                this._oNavContainer = this.byId("NC_CrearEmpleado");

                this._model = new sap.ui.model.json.JSONModel({});

                this.getView().setModel(this._model);

                var oFirstStep = this._wizard.getSteps()[0];

                this._wizard.discardProgress(oFirstStep);

                this._wizard.goToStep(oFirstStep);

                oFirstStep.setValidated(false);

            },

            onStep2(oEvent) {

                var typeEmployeeStep = this.byId("WS_Tipo_Emp");

                var dataEmployeeStep = this.byId("WS_Data_Emp");

                var Salary = 0;

                var Type = "";

                var oTypeSel = oEvent.getParameters().item.getText();

                switch (oTypeSel) {

                    case "Interno": Salary = 24000; Type = "0"; break;

                    case "Autonomo": Salary = 400; Type = "1"; break;

                    case "Gerente": Salary = 70000; Type = "2"; break;

                    default:

                        break;
                }

                this._model.setData({
                    _type: oTypeSel,
                    Type: Type,
                    Salary: Salary
                });

                if (this._wizard.getCurrentStep() === typeEmployeeStep.getId()) {

                    $.sap.ValidarNombre = false;

                    $.sap.ValidarApellido = false;

                    $.sap.ValidarDNI = false;

                    $.sap.ValidarFecha = false;

                    this._wizard.nextStep();

                } else {

                    this._wizard.goToStep(dataEmployeeStep);

                }

            },

            onValidateDNI(oEvent) {

                var isValid = true;

                if (this.getView().getModel().getData().Type !== "1") {

                    var dni = oEvent.getParameter("value");

                    var number;

                    var letter;

                    var letterList;

                    var regularExp = /^\d{8}[a-zA-Z]$/;

                    //Se comprueba que el formato es válido

                    if (regularExp.test(dni) === true) {

                        //Número

                        number = dni.substr(0, dni.length - 1);

                        //Letra

                        letter = dni.substr(dni.length - 1, 1);

                        number = number % 23;

                        letterList = "TRWAGMYFPDXBNJZSQVHLCKET";

                        letterList = letterList.substring(number, number + 1);

                        if (letterList !== letter.toUpperCase()) {

                            this._model.setProperty("/_DniState", "Error");

                            isValid = false;

                        } else {

                            this._model.setProperty("/_DniState", "None");

                        }

                    } else {

                        this._model.setProperty("/_DniState", "Error");

                        isValid = false;
                    }

                    $.sap.ValidarDNI = isValid;

                } else {

                    var isValid = true;

                    if (!oEvent.getSource().getValue()) {

                        this._model.setProperty("/_DniState", "Error");

                        isValid = false;

                        this._wizard.invalidateStep(this.byId("WS_Data_Emp"));

                    } else {

                        this._model.setProperty("/_DniState", "None");

                        this._wizard.validateStep(this.byId("WS_Data_Emp"));
                    };

                    $.sap.ValidarDNI = isValid;

                }
            },

            onValidarNombre() {

                $.sap.ValidarNombre = true;

                var object = this._model.getData().FirstName;

                if (!object || object.length < 0) {

                    $.sap.ValidarNombre = false;

                } else {

                    this._model.setProperty("/_FirstNameState", "None");

                    this._wizard.validateStep(this.byId("WS_Data_Emp"));
                }

            },

            onValidarApellido() {

                $.sap.ValidarApellido = true;

                var object = this._model.getData().LastName;

                if (!object || object.length < 0) {

                    $.sap.ValidarApellido = false;

                } else {

                    this._model.setProperty("/_LastNameState", "None");

                    this._wizard.validateStep(this.byId("WS_Data_Emp"));
                }

            },

            onValidarFecha() {

                $.sap.ValidarFecha = true;

                var object = this._model.getData().CreationDate;

                if (!object || object.length < 0) {

                    $.sap.ValidarFecha = false;

                } else {

                    this._model.setProperty("/_CreationDateState", "None");

                    this._wizard.validateStep(this.byId("WS_Data_Emp"));
                }

            },

            onValidateData() {

                if ($.sap.ValidarNombre === false) {

                    this._wizard.setCurrentStep(this.byId("WS_Data_Emp"));

                    this._model.setProperty("/_FirstNameState", "Error");

                    this._wizard.invalidateStep(this.byId("WS_Data_Emp"));

                };

                if ($.sap.ValidarApellido === false) {

                    this._wizard.setCurrentStep(this.byId("WS_Data_Emp"));

                    this._model.setProperty("/_LastNameState", "Error");

                    this._wizard.invalidateStep(this.byId("WS_Data_Emp"));

                };

                if ($.sap.ValidarFecha === false) {

                    this._wizard.setCurrentStep(this.byId("WS_Data_Emp"));

                    this._model.setProperty("/_CreationDateState", "Error");

                    this._wizard.invalidateStep(this.byId("WS_Data_Emp"));
                };

                if ($.sap.ValidarDNI === false) {

                    this._wizard.setCurrentStep(this.byId("WS_Data_Emp"));

                    this._model.setProperty("/_DniState", "Error");

                    this._wizard.invalidateStep(this.byId("WS_Data_Emp"));

                };

            },

            onFileChange() {

                let oUplodCollection = oEvent.getSource();

                let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({

                    name: "x-csrf-token",

                    value: this.getView().getModel("oDataModel").getSecurityToken()

                });

                oUplodCollection.addHeaderParameter(oCustomerHeaderToken);
            },

            onFileBeforeUpload() {

                let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({

                    name: "slug",

                    value: this.getOwnerComponent().SapId + ";" + this.employeeId + ";" + oEvent.getParameter("fileName")

                });

                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

            },

            onFileUploadComplete() {

                oEvent.getSource().getBinding("items").refresh();

            },

            onFileDeleted() {

                var oUploadCollection = oEvent.getSource();

                var sPath = oEvent.getParameter("item").getBindingContext("oDataModel").getPath();

                this.getView().getModel("oDataModel").remove(sPath, {

                    success: function () {

                        oUploadCollection.getBinding("items").refresh();

                    },

                    error: function () {

                    }
                });
            },

            onEditType() {

                var oEditType = function () {

                    this._wizard.goToStep(this._wizard.getSteps()[0]);

                    this._oNavContainer.detachAfterNavigate(oEditType);

                }.bind(this);

                this._oNavContainer.attachAfterNavigate(oEditType);

                this._oNavContainer.back();
            },

            onEditData() {

                var oEditData = function () {

                    this._wizard.goToStep(this._wizard.getSteps()[1]);

                    this._oNavContainer.detachAfterNavigate(oEditData);

                }.bind(this);

                this._oNavContainer.attachAfterNavigate(oEditData);

                this._oNavContainer.back();

            },

            onEditDataAdic() {

                var oEditDataAdic = function () {

                    this._wizard.goToStep(this._wizard.getSteps()[2]);

                    this._oNavContainer.detachAfterNavigate(oEditDataAdic);

                }.bind(this);

                this._oNavContainer.attachAfterNavigate(oEditDataAdic);

                this._oNavContainer.back();
            },

            onSaveEmp() {

                var oItems = this.getView().byId("uploadCollection").getItems();

                var oArray = [];

                this._model.setProperty("/_numFiles", oItems.length);

                if (oItems.length > 0) {

                    for (let i in oItems) {

                        oArray.push({ DocName: oItems[i].getFileName(), MimeType: oItems[i].getMimeType() });

                    };

                    this._model.setProperty("/_files", arrayFiles);

                } else {

                    this._model.setProperty("/_files", []);

                    this._wizard.goToStep(this.byId("WS_Data_Emp"));

                    this._oNavContainer.to(this.byId("revisarData"));

                };
            },

            onSave() {

                var oData = this.getView().getModel().getData();

                var oDataFinal = {};

                for (var i in oData) {


                    if (i.indexOf("_") !== 0) {

                        oDataFinal[i] = oData[i];
                    }
                };

                var oBody = {
                    Type: (oDataFinal.Type === 'Interno' ? '0' : oDataFinal.Type === 'Autonomo' ? '1' : '2'),
                    SapId: this.getOwnerComponent().SapId,
                    FirstName: oDataFinal.FirstName,
                    LastName: oDataFinal.LastName,
                    Dni: oDataFinal.Dni,
                    CreationDate: oDataFinal.CreationDate,
                    Comments: oDataFinal.Comments,
                    UserToSalary: [{
                        Amount: parseFloat(oDataFinal.Salary).toString(),
                        Comments: oDataFinal.Comments,
                        Waers: "EUR"
                    }]
                };

                this.getView().getModel("oDataModel").create("/Users", oBody, {
                    success: function (data) {
                        this.newUser = data.EmployeeId;
                        this.onStartUpload();
                        MessageBox.success("Cambios guardados");
                    }.bind(this),
                    error: function () {
                        MessageBox.error("Cambios no guardados");
                    }.bind(this)
                });
            },

            onStartUpload() {

                var oUploadCollection = this.byId("uploadCollection");

                oUploadCollection.upload();

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                oRouter.navTo("RouteMainView", {}, true);
            },

            onCancel() {

                var oEditType = function () {

                    this._wizard.goToStep(this._wizard.getSteps()[0]);

                    this._oNavContainer.detachAfterNavigate(oEditType);

                }.bind(this);

                this._oNavContainer.attachAfterNavigate(oEditType);

                this._oNavContainer.back()

            },

            onCancelFirst() {

                this._wizard.discardProgress(this._wizard.getSteps()[0]);

                this._model.setData({
                    Type: "Interno",
                    FirstNameState: "Error",
                    LastNameState: "Error",
                    DniState: "Error"
                });

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                oRouter.navTo("RouteMainView", {}, true);
            }

        });
    });