'use strict'

import router from '../router/router.js';
import store from '../store/store.js';

import Constants from "../includes/constants.js";

export default {
    name: "FormulaireInscription",
    template:
        "<form class='inscription pure-form pure-form-stacked pure-form-aligned'>"+
            "<h2>Bienvenue sur l'appli de chasse humaine</h2>" +
            "<fieldset>" +
                "<p>" +
                    "Veuillez saisir un pseudo et choisir une URL pour votre image." +
                "</p>" +
                "<p>" +
                    "Si vous ne saisissez pas d'image, vous serez Administrateur." +
                "</p>" +
                "<hr>" +
                "<div class='pure-control-group'>" +
                    "<label for='pseudo'>Pseudo : </label>"+
                    "<input type='input' @input='inputUpdatePseudo' id='pseudo' name='pseudo' autofocus value=''>"+
                "</div>" +
                "<div class='pure-control-group'>" +
                    "<label for='urlImage'>Url d'image : </label>"+
                    "<input type='input' @input='inputUpdateImage' id='urlImage' name='urlImage' value=''>" +
                "</div>" +

                "<input id='inscription' type='button' @click='ajaxInit' value='Inscription'>" +
                "<input id='update' type='button' @click='ajaxUpdate' value='Mettre à jour'>" + // Amélioration de mise à jour du pseudo
            "</fieldset>" +
        "</form>",
    methods: {
        inputUpdatePseudo: function (event) {
            store.commit('updatePseudo', event.target.value);
        },
        inputUpdateImage: function (event) {
            store.commit('updateImage', event.target.value);
        },
        ajaxInit: function () {
            let pseudo = store.getters.pseudo;
            let urlImage = store.getters.urlImage;

            if(pseudo !== ""){
                // Init socket
                const serverURL = window.location.hostname + (window.location.port === '' ? '' : ':' + window.location.port) + window.location.pathname.replace('index.html', '');
                let ws = new WebSocket("wss:"+serverURL);
                store.commit('setSocket', ws);

                ws.addEventListener('open', function () {
                    let obj = {
                        type: "init",
                        pseudo: pseudo,
                        urlImage: urlImage===""? undefined : urlImage
                    };

                    ws.send(JSON.stringify(obj));
                });
            }
        },
        ajaxUpdate: function () {

            let id          = store.getters.userId;
            let pseudo      = store.getters.pseudo;
            let urlImage    = store.getters.urlImage;


            if(pseudo !== "") {
                let obj = {
                    type: "updatePseudoImage",
                    id: id,
                    pseudo: pseudo,
                    urlImage: urlImage
                };

                store.getters.websocket.send(JSON.stringify(obj));
            }

            router.push(Constants.GAME_PATH);

        }
    },
    mounted:function () {
        store.getters.userId != null ? ($("#inscription").hide(), $("#update").show()) : ($("#inscription").show(), $("#update").hide());
        store.commit("setGeolocation", Modernizr.geolocation);

        if(store.getters.pseudo !== undefined && store.getters.pseudo !== ""){
            $("#pseudo").val(store.getters.pseudo);
        }

        if(store.getters.urlImage !== undefined && store.getters.urlImage !== ""){
            $("#urlImage").val(store.getters.urlImage);
        }
    }
}