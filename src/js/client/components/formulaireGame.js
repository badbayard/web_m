'use strict'
import store from '../store/store.js';

import Constants from '../includes/constants.js';
import Minuteur from './minuteur.js';
import router from '../router/router.js';

import $ from "jquery";

export default {
    name: "formulaireJeu",
    components: {
        Minuteur
    },
    template:
    "<div class='form-game'>" +
        "<Minuteur></Minuteur>" +
        "<form class='pure-form pure-form-aligned'>" +
            "<h4>Position</h4>" +

            "<fieldset id='fieldset'>" +
                "<div class='pure-control-group'>" +
                    "<label for='lat'>Latitude : </label>" +
                    "<input @input='inputUpdateLat' type='number' step='0.0000000000000001' id='lat' name='lat'>" +
                "</div>" +

                "<div class='pure-control-group'>" +
                    "<label for='lon'>Longitude : </label>" +
                    "<input @input='inputUpdateLon' type='number' step='0.0000000000000001' id='lon' name='lon'>" +
                "</div>" +

                "<div class='pure-control-group'>" +
                    "<label for='zoom'>Zoom : <span>{{ $store.getters.zoom }}</span></label>" +
                    "<input type='range' @input='inputUpdateZoom' id='zoom' min='1' max='20'>" +
                "</div>" +
                "<div class='pure-control-group'>" +
                    "<input id='attack' class='sign-in-form-button' type='button' @click='ajaxTry' value='Attaquer'/>" +
                "</div>" +

            "</fieldset>" +
        "</form>" +
    "</div>",
    methods: {
        ajaxTry: function () {
            if (store.getters.myTurn && store.getters.isTimerRunning) {

                // On arrête le timer
                store.commit('clearTimer');
                $("#time").html("");

                let userId = store.getters.userId;
                let lat = store.getters.lat;
                let lon = store.getters.lon;
                let ws = store.getters.websocket;

                // On stocke la position
                store.commit('appendPosition', {lat: lat, lon: lon});
                L.marker([lat, lon], {icon: Constants.getIcon(Constants.BLACK_MARKER)}).addTo(store.getters.map);

                let obj = {
                    type: 'tryPosition',
                    id: userId,
                    lat: lat,
                    lon: lon
                };

                ws.send(JSON.stringify(obj));
            }
        },

        // Map
        inputUpdateZoom: function () {
            store.commit('changeZoom', event.target.value);
            this.updateMap();
        },
        inputUpdateLat: function () {
            store.commit('changeLat', event.target.value);
            this.updateMap();
        },
        inputUpdateLon: function () {
            store.commit('changeLon', event.target.value);
            this.updateMap();
        },
        updateMap: function () {
            store.commit("updateMap");
            // store.getters.map.setView([store.getters.lat, store.getters.lon], store.getters.zoom);
        },
        sendPosition: function () {

            let obj = {
                type: "intervalPosition",
                position: store.getters.geoPos,
                id: store.getters.userId
            };

            $.ajax({
                url: "https://api.mapbox.com/v4/geocode/mapbox.places/"+store.getters.geoLon+","+store.getters.geoLat+".json?access_token="+Constants.MAP_BOX_TOKEN,
                method: "GET",
                success: function(data){

                    obj.place_name = data.features[0].place_name;
                    $('div.leaflet-bottom.leaflet-left').html('<div class="leaflet-control-attribution leaflet-control">'+obj.place_name+'</div>');

                    store.getters.websocket.send(JSON.stringify(obj));
                },
                error: function(e){
                    console.error("Une erreur s'est produite lors de la récupération de l'adresse aux coordonnées ["+store.getters.geoLon+","+store.getters.geoLat+"]", e);

                }
            });
        }
    },
    mounted: function () {

        if(store.getters.userId === null) {
            router.push(Constants.INIT_PATH);
        } else {

            if(store.getters.isAdmin){
                $("form.pure-form.pure-form-aligned").hide();

                setInterval(function () {

                    let obj = {
                        type: 'adminPositions',
                        id: store.getters.userId
                    };

                    store.getters.websocket.send(JSON.stringify(obj));
                }, Constants.SEC_5);

            }else{

                let init = true;
                let markerPlayer = null;

                    // On charge les inputs
                $("#lat").val(store.getters.lat);
                $("#lon").val(store.getters.lon);
                $("#zoom").val(store.getters.zoom);

                // Utilisation des capteurs
                if (store.getters.geolocation) {
                    navigator.geolocation.watchPosition(function (position) {
                        store.commit('setGeolocation', true);

                        // On met à jour la position GPS
                        store.commit('changeGeoLat', position.coords.latitude);
                        store.commit('changeGeoLon', position.coords.longitude);

                        if(markerPlayer != null)
                            store.getters.map.removeLayer(markerPlayer);

                        // On place un marker pour que le joueur se voit
                        markerPlayer = L.marker([store.getters.geoLat, store.getters.geoLon], {icon: Constants.getIcon(Constants.BLUE_MARKER)});
                        markerPlayer.addTo(store.getters.map);

                        // Si ce n'est pas notre tour, on met à jour la carte pour voir où l'on se situe
                        if(!store.getters.myTurn){
                            store.commit("updateMapGeo");
                        }

                        // A ne réaliser qu'une fois
                        if(init){
                            init = false;

                            // On met à jour les coordonnées du formulaire pour être cohérent avec  le GPS
                            store.commit("changeLat", store.getters.geoLat);
                            store.commit("changeLon", store.getters.geoLon);
                            store.commit("updateMap");
                        }
                    });
                }

                // On exécute une prémière fois la fonction pour setter la position
                this.sendPosition();

                // Et on la met à jour toutes les 10 secondes
                setInterval(this.sendPosition, Constants.SEC_10);

                // On récupère l'état toutes les secondes
                setInterval(function () {

                    let obj = {
                        type: 'state',
                        id: store.getters.userId
                    };

                    store.getters.websocket.send(JSON.stringify(obj))
                }, 1000);
            }
        }
    }
}



