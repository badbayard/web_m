'use strict'

import Vue from 'vue';
import Vuex from 'vuex';

import Constants from '../includes/constants.js';
import SocketUtil from '../includes/socket.js';


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // Utilisateur
        isAdmin: false,
        userId: null,
        pseudo: Constants.loadFromLocalStorage("pseudo"),
        urlImage: Constants.loadFromLocalStorage("urlImage"),
        pos: { // Position courante
            lat: 45.782,
            lon: 4.8656
        },
        geoPos: { // Position GPS
            lat: 45.782,
            lon: 4.8656
        },
        positions: Constants.loadFromLocalStorage("setPositions"), // Liste des tentatives,
        lastEnnemyShoot: null,

        // Carte
        map: null,
        zoom: Constants.loadFromLocalStorage("zoom"),

        // Timer
        timer: null,
        time: null,

        gameIsRunning: false,
        myTurn: -1,
        markers : [],

        geolocation: false,
        vibrate: false,
        websocket: null,
        logs: []
    },
    getters: {
        pseudo:         state => state.pseudo,
        urlImage:       state => state.urlImage,
        gameIsRunning:  state => state.gameIsRunning,
        zoom:           state => state.zoom,
        lat:            state => state.pos.lat,
        lon:            state => state.pos.lon,
        pos:            state => state.pos,
        geoLat:         state => state.geoPos.lat,
        geoLon:         state => state.geoPos.lon,
        geoPos:         state => state.geoPos,
        map:            state => state.map,
        userId:         state => state.userId,
        myTurn:         state => state.myTurn,
        geolocation:    state => state.geolocation,
        vibrate:        state => state.vibrate,
        time:           state => state.time,
        isTimerRunning: state => state.timer != null,
        websocket:      state => state.websocket,
        logs:           state => state.logs,
        isAdmin:        state => state.isAdmin,
        markers:        state => state.markers

    },
    mutations: {
        // Game
        changeZoom(state, zoom) {
            state.zoom = zoom;
        },
        changeLat(state, lat) {
            state.pos.lat = lat;
            $("#lat").val(lat);
        },
        changeLon(state, lon) {
            $("#lon").val(lon);
            state.pos.lon = lon;
        },
        changeGeoLat(state, lat) {
            state.geoPos.lat = lat;
        },
        changeGeoLon(state, lon) {
            state.geoPos.lon = lon;
        },
        setMap(state, map) {
            state.map = map;
        },
        updateMap(state){
            state.map.setView([state.pos.lat, state.pos.lon], state.zoom);
        },
        updateMapGeo(state){
            state.map.setView([state.geoPos.lat, state.geoPos.lon], state.zoom);
        },

        updateId(state, id) {
            state.userId = id;
        },
        setIsAdmin(state, isAdmin){
            state.isAdmin = isAdmin;
        },
        updateMyTurn(state, turn) {
            if(state.gameIsRunning && state.myTurn != turn) {
                if (turn) {
                    $("#message").html('<p>A votre tour !</p>');
                    // this.commit('updateTime'); // Décommenter si jeu sur ordi
                    $("#attack").removeAttr("disabled");
                    Constants.vibrate(Constants.VIBRATE);
                } else {
                    $("#message").html("<p>A l'adversaire de jouer</p>");
                    $("#attack").attr("disabled", "disabled");

                }
            }
            state.myTurn = turn;
        },

        appendPosition(state, position) {
            state.positions.push(position);
        },
        resetPositions(state){
            state.positions = [];
        },
        updateLastEnnemyShoot(state, lastShoot){
            if(state.lastEnnemyShoot !== null)
                state.map.removeLayer(state.lastEnnemyShoot);

            state.lastEnnemyShoot = L.marker([lastShoot.lat, lastShoot.lon], {icon: Constants.getIcon(Constants.RED_MARKER)});
            state.lastEnnemyShoot.addTo(state.map);
        },

        // Inscription
        updatePseudo(state, pseudo) {
            state.pseudo = pseudo;
        },
        updateImage(state, urlImage) {
            state.urlImage = urlImage;
        },

        setGameIsRunning(state, gameIsRunning) {
            state.gameIsRunning = gameIsRunning;
        },

        // Capteurs
        setGeolocation(state, geolocation){
            state.geolocation = geolocation;
        },
        setVibrate(state, vibrate) {
            state.vibrate = vibrate;
        },

        // Gestion du temps
        setTimer(state, timer) {
            state.timer = timer;
        },
        clearTimer(state) {
            if(state.timer != null) {
                window.clearInterval(state.timer);
                state.timer = null;
            }
        },
        updateTime(state) {
            state.time = new Date();
            Constants.runTimer();
        },
        resetTime(state){
            state.time = null;
        },

        // setSocket
        setSocket(state, socket){
            state.websocket = socket;
            if(socket != null)
                SocketUtil.socketEvent();
        },

        // Admin
        updateLogs(state, logs){
            if(logs.length >= 1){
                state.logs = state.logs.concat(logs);
            }
        },
        resetLogs(state){
            state.logs = [];
        },

        reset(state) {
            this.commit("setGameIsRunning", false);
            this.commit("updatePseudo", "");
            this.commit("updateImage", "");
            this.commit("updateZoom", 15);
            this.commit("changeLat", 45.782);
            this.commit("changeLon", 4.8656);
            this.commit("resetPositions");
            this.commit("updateId", null);
            this.commit("updateMyTurn", false);
            this.commit("resetTime");
            this.getters.websocket.close();
            this.commit("setSocket", null);
            this.commit("resetLogs");
        },

        storeInLocalStorage(state) {
            Constants.storeInLocalStorage("pseudo",         this.state.pseudo);
            Constants.storeInLocalStorage("urlImage",       this.state.urlImage);
            Constants.storeInLocalStorage("setPositions",   JSON.stringify(this.state.positions));
            Constants.storeInLocalStorage("zoom",           this.state.zoom);
        },

        storeMarker(state, marker){
            state.markers.push(marker);
        }

    }
});