'use strict'

import Vue from 'vue';
import $ from "jquery";

import formulaireJeu from './formulaireGame.js';
import Carte from './carte.js';
import Menu from './menu.js';

export default {
    name: "Game",
    template:
        "<div>" +
            "<Menu></Menu>" +
            "<formulaireJeu></formulaireJeu>" +
            "<hr>" +
            "<Carte></Carte>" +
        "</div>",
    components: {
        Menu,
        formulaireJeu,
        Carte
    }
}