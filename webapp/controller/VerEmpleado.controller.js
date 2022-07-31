sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (BaseController, MessageBox, Filter, FilterOperator) {
        "use strict";

        return BaseController.extend("proyectofinal.proyectofinal.controller.controller.VerEmpleado", {

            onInit() {

                this._SA_VerEmployee = this.byId("SA_VerEmployee");

            },

            onBuscar(oEvent) {

                var oFilters = [];

                var oValue = oEvent.getSource().getValue();

                var oList = this.byId("allEmplo");

                var oBinding = oList.getBinding("items");

                if (oValue.length > 0) {

                    var oFilter = new Filter({
                        filters: [
                            new Filter({
                                path: 'FirstName',
                                operator: FilterOperator.Contains,
                                value1: oValue
                            }),
                            new Filter({
                                path: 'LastName',
                                operator: FilterOperator.Contains,
                                value1: oValue
                            }),
                            new Filter({
                                path: 'Dni',
                                operator: FilterOperator.Contains,
                                value1: oValue
                            })
                        ],
                        and: false
                    })

                    oFilters.push(oFilter);
                }

                oBinding.filter(oFilters);

            },

            onBack() {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                oRouter.navTo("RouteMainView", {}, true);
            },

            onItem(oEvent) {

                this._SA_VerEmployee.to(this.createId("detalleEmp"));

                var oContext = oEvent.getParameter("listItem").getBindingContext("oDataModel");

                this.employeeId = oContext.getProperty("EmployeeId");

                var oDetail = this.byId("detalleEmp");

                oDetail.bindElement("oDataModel>/Users(EmployeeId='" + this.employeeId + "',SapId='" + this.getOwnerComponent().SapId + "')");

            },

            onDownload(oEvent) {

                const sPath = oEvent.getSource().getBindingContext("oDataModel").getPath();

                window.open("sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");

            },

            onDarBaja() {

                MessageBox.warning("Se dará de baja al Empleado, ¿Desea continuar?", {

                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],

                    emphasizedAction: MessageBox.Action.OK,

                    onClose: function (sAction) {

                        if (sAction === "OK") {

                            this.getView().getModel("oDataModel").remove("/Users(EmployeeId='" + this.employeeId + "',SapId='" + this.getOwnerComponent().SapId + "')", {

                                success: function (data) {

                                    sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("BajaEmpleado"));

                                    this._splitAppEmployee.to(this.createId("detailSelectEmployee"));

                                }.bind(this),

                                error: function (e) {

                                    sap.base.Log.info(e);

                                }.bind(this)
                            });
                        }
                    }
                });
            },

            onAscender() {

                if (!this.riseDialog) {

                    this.riseDialog = sap.ui.xmlfragment("proyectofinal/proyectofinal/fragment/Ascender", this);

                    this.getView().addDependent(this.riseDialog);
                }

                this.riseDialog.setModel(new sap.ui.model.json.JSONModel({}), "oModAsc");

                this.riseDialog.open();
            },

            onDialogOk() {

                var oModel = this.riseDialog.getModel("oModAsc");

                var oData = oModel.getData();

                var oBody = {

                    Ammount: oData.Ammount,

                    CreationDate: oData.CreationDate,

                    Comments: oData.Comments,

                    SapId: this.getOwnerComponent().SapId,

                    EmployeeId: this.employeeId
                };

                this.getView().setBusy(true);

                this.getView().getModel("oDataModel").create("/Salaries", oBody, {

                    success: function () {

                        this.getView().setBusy(false);

                        MessageBox.success("Ascenso Correcto");

                        this.onCloseRiseDialog();

                    }.bind(this),

                    error: function () {

                        this.getView().setBusy(false);

                        MessageBox.error("Fallo en Ascender");

                    }.bind(this)

                });

            },

            onDialogCancel() {

                this.riseDialog.close();

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
            }
        });
    }
);