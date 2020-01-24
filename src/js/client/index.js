'use strict'

// CSS
import "leaflet";
import "leaflet-css";
import "purecss";

import '../../css/style.css';

// JS
import Vue from 'vue';

import router from './router/router.js';
import store from './store/store.js';
import './includes/Modernizr.js';
import Constants from "./includes/constants.js";

const app = new Vue({
    el: "#app",
    store,
    router
});

setInterval(function () {
    store.commit('storeInLocalStorage');
}, Constants.MIN_1);
