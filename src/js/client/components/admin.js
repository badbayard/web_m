
import Menu from './menu.js';
import store from '../store/store.js';
import router from "../router/router";
import Constants from '../includes/constants.js';

export default {
    name: 'Admin',
    template:
        '<div>'+
            '<Menu></Menu>'+
            '<div class="admin">' +
                '<h2>Bienvenue sur la console d\'administration <button @click="changeVue">Changer la vue</button></h2>' +
                '<div class="container">' +

                    '<div class="overlay">' +
                        '<div class="shadowContainer">' +
                            '<div class="shadow radialShadowTop"></div>' +
                            '<div class="shadow radialShadowBottom"></div>' +
                        '</div>' +
                        '<div class="content">' +
                            '<div class="shadowCoverTop"></div>' +
                            '<div class="text">' +
                                '<ul class="console"></ul>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +

                "<fieldset id='fieldsetAdmin' style='display:none'  class='pure-group'>" +
                    "<div class='pure-control-group'>" +
                        "<h2>Veuillez saisir votre message pour les joueurs</h2>" +
                    "</div>" +

                    "<div class='pure-control-group'>" +
                        "<label for='textarea'>Message (500 caractères max) : </label>" +
                        "<textarea class='pure-input-1-2' type='text' maxlength='500' id='textarea' name='textarea'></textarea>" +
                    "</div>" +

                    "<div class='pure-control-group'>" +
                        "<button @click='envoyerMessage' id='envoyer' name='envoyer'>Envoyer</button>" +
                    "</div>" +
                "</fieldset>" +
            '</div>'+
        '</div>',
    components:{
        Menu
    },
    mounted: function(){

        if(store.getters.userId === null) {
            router.push(Constants.INIT_PATH);

        } else {
            setInterval(function () {
                let nb = store.getters.logs.length;
                let obj = {
                    type: 'admin',
                    nb: nb
                };
                store.getters.websocket.send(JSON.stringify(obj));

            }, Constants.SEC_5);
        }
    },
    methods:{
        changeVue:function () {
            if($('#fieldsetAdmin').is(':hidden')){
                $('#fieldsetAdmin').show();
                $("div.container").hide();
            }else{
                $('#fieldsetAdmin').hide();
                $("div.container").show();
            }
        },
        envoyerMessage: function () {
            let message = $("#textarea").val();
            if(message !== undefined && message !== ""){

                let obj = {
                    type: 'messageToAll',
                    isAdmin: store.getters.isAdmin,
                    message: message
                };

                store.getters.websocket.send(JSON.stringify(obj));

                $("#textarea").val("");
                this.changeVue();
            }
        }
    }
}