
import $ from 'jquery';
import Vue from 'vue';
import router from '../router/router.js';

export default {
    name:"Menu",
    template:
        '<div class="custom-menu-wrapper">' +
            '<div class="pure-menu custom-menu custom-menu-top">' +
                '<a href="#" class="pure-menu-heading custom-menu-brand">Brand</a>' +
                '<a href="#" class="custom-menu-toggle" id="toggle"><s class="bar"></s><s class="bar"></s></a>' +
            '</div>' +
            '<div class="pure-menu pure-menu-horizontal pure-menu-scrollable custom-menu custom-menu-bottom custom-menu-tucked" id="tuckedMenu">' +
                '<div class="custom-menu-screen"></div>' +
                '<ul class="pure-menu-list">' +

                    '<router-link class="pure-menu-item" tag="li" to="/">' +
                        '<a class="pure-menu-link">Accueil</a>' +
                    '</router-link>' +
                    '<router-link class="pure-menu-item" tag="li" to="/Game">' +
                        '<a class="pure-menu-link">Jeu</a>' +
                    '</router-link>' +
                    '<router-link class="pure-menu-item" tag="li" to="/Admin">' +
                        '<a class="pure-menu-link">Admin</a>' +
                    '</router-link>' +
                '</ul>' +
            '</div>' +
        '</div>',
    mounted: function (){
        $('#toggle').click(function (e) {
            $('#tuckedMenu')[0].classList.toggle('custom-menu-tucked');
            $('#toggle')[0].classList.toggle('x');
        });
    },
    methods:{
        accueil : () => router.push('/'),

    }
};
