    sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {sap.m.MessageToast}MessageToast
     * @param {sap.m.MessageBox}MessageBox
     */
    function (Controller,MessageToast,MessageBox) {
        "use strict";

        return Controller.extend("proyectofinal.proyectofinal.controller.MainView", {
            onInit: function () {

            },
            
            onCrearEmpleado:function(){
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("CrearEmpleado");
            },

            onVerEmpleado: function(){
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("VerEmpleado");
            },

            onFirmarPedidos: function(){
                let msg = "Problemas en Despliegue, puede revisar el codigo en GitHub: Criss-Alcantara/SAPUI5-Advance";
                MessageBox.information(msg);
            }

        });
    });
