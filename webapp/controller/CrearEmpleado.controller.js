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

                this._model = new sap.ui.model.json.JSONModel({});

                this.getView().setModel(this._model);

                var oFirstStep = this._wizard.getSteps()[0];

                this._wizard.discardProgress(oFirstStep);

                this._wizard.goToStep(oFirstStep);

                oFirstStep.setValidated(false);

            },

            onStep2(oEvent) {

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
                    _Salary: Salary
                });

            },

            onValidateDNI(oEvent) {

                if (this._model.getProperty("_type") !== "Autonomo") {

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

                        } else {

                            this._model.setProperty("/_DniState", "None");

                            this.dataEmployeeValidation();

                        }

                    } else {

                        this._model.setProperty("/_DniState", "Error");
                    }
                }
            },

            onValidarData(oEvent) {

                var oData = this._model.getData();

                var oValid = false;

                var oObject = object;

                var oEvent1 = oEvent;

                //Nombre
                if (!object.FirstName) {
                    object._FirstNameState = "Error";
                    isValid = false;
                } else {
                    object._FirstNameState = "None";
                }

                

                //Apellidos
                if (!object.LastName) {
                    object._LastNameState = "Error";
                    isValid = false;
                } else {
                    object._LastNameState = "None";
                }

                //Fecha
                if (!object.CreationDate) {
                    object._CreationDateState = "Error";
                    isValid = false;
                } else {
                    object._CreationDateState = "None";
                }

                //DNI
                if (!object.Dni) {
                    object._DniState = "Error";
                    isValid = false;
                } else {
                    object._DniState = "None";
                }

                if (isValid) {
                    this._wizard.validateStep(this.byId("dataEmployeeStep"));
                } else {
                    this._wizard.invalidateStep(this.byId("dataEmployeeStep"));
                }
                //Si hay callback se devuelve el valor isValid
                if (callback) {
                    callback(isValid);
                }

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
                _editStep.bind(this)("WS_Tipo_Emp");
            },

            onEditData() {
                _editStep.bind(this)("WS_Data_Emp");
            },

            onEditDataAdic() {
                _editStep.bind(this)("WS_Data_Adic");
            }

        });
    });