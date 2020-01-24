'use strict'

import '../../../css/style.css';

import Vue from "vue";
import VueRouter from 'vue-router';

import Game from "../components/jeu.js";
import DashBoard from "../components/accueil.js";
import Admin from "../components/admin.js";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: "Accueil",
        component : DashBoard
    },
    {
        path: '/Game',
        name: "Jeu",
        component : Game
    },
    {
        path: '/Admin',
        name: "Administration",
        component : Admin
    }
];

let router = new VueRouter({
    'routes': routes // short for `routes: routes`
});


export default router;