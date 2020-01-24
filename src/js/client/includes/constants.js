import store from '../store/store.js';
import $ from "jquery";

import './Modernizr.js';

// MAP BOX TOKEN
let MAP_BOX_TOKEN = "pk.eyJ1Ijoia2V2aW4wNiIsImEiOiJjanU5eWt0Y3Ywb2hrNDRwZHFhdWJkcTcyIn0.wDK-JJjFVjytz9PlllbBaQ";

// Durée de vibration en ms
let VIBRATE = 500;

// Valeur de sensibilité
let SENSITIVITY_VALUE = 20;

// Temps en millisecondes
let SEC_5 = 5000;
let SEC_10 = 10000;
let MIN_1 = 60000;

// Chemins
let INIT_PATH = "/";
let GAME_PATH = "/Game";
let ADMIN_PATH = "/Admin";

// Clé pour le local storage
let LOCAL_STORAGE_KEY = "MIF15_";

// Markers classes
let BLACK_MARKER = "black-marker";
let BLUE_MARKER = "blue-marker";
let GREEN_MARKER = "green-marker";
let RED_MARKER = "red-marker";

// Fonctions
let vibrate = function (time) {
    if (Modernizr.vibrate) {
        window.navigator.vibrate(time);
    }
};

let runTimer = function () {

    store.commit('setTimer', setInterval(function () {

        let secs = Math.trunc((SEC_10 - (new Date().getTime() - store.getters.time.getTime())) / 1000);

        $("#time").html('<p>Il vous reste <span>' + secs + '</span> secondes</p>');

        if (secs === 0) {
            $("#attack").click();
        }
    }, 500));
};

let loadFromLocalStorage = function (key) {

    let value = null;

    value = localStorage.getItem(LOCAL_STORAGE_KEY + key);

    value = ((key === "setPositions") ? (value === "" ? [] : JSON.parse(value)) : value);

    if (value === null) {
        switch (key) {
            case 'zoom':
                value = 15;
                break;
            case 'setPositions':
                value = [];
                break;
            case 'pseudo':
            case 'urlImage':
                value = ""
                break;
            default:
                break;
        }
    }

    return value;
};

let storeInLocalStorage = function (key, value) {
    localStorage.setItem(LOCAL_STORAGE_KEY + key, value);
};

let getIcon = function (classIcon) {
    return L.divIcon({
        className: classIcon,
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
    });
};


export default {
    // Fonctions
    vibrate: vibrate,
    runTimer: runTimer,
    loadFromLocalStorage: loadFromLocalStorage,
    storeInLocalStorage: storeInLocalStorage,
    getIcon: getIcon,

    INIT_PATH: INIT_PATH,
    GAME_PATH: GAME_PATH,
    ADMIN_PATH: ADMIN_PATH,

    MAP_BOX_TOKEN: MAP_BOX_TOKEN,

    BLACK_MARKER: BLACK_MARKER,
    BLUE_MARKER: BLUE_MARKER,
    GREEN_MARKER: GREEN_MARKER,
    RED_MARKER: RED_MARKER,

    SEC_5: SEC_5,
    SEC_10: SEC_10,
    MIN_1: MIN_1,
    VIBRATE: VIBRATE,
    SENSITIVITY_VALUE: SENSITIVITY_VALUE
};
