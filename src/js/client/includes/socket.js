
import store from '../store/store.js';
import router from "../router/router";
import $ from "jquery";
import Constants from "./constants";

let socketEvent = function () {
    store.getters.websocket.addEventListener('message', event => {
        let obj = JSON.parse(event.data);

        if(obj.type != 'state')
            console.log(obj);

        switch(obj.type){
            case 'init':
                if (obj.added != undefined) {
                    if (obj.added) {
                        store.commit('updateId', obj.id);
                        router.push(Constants.GAME_PATH);
                    }
                }
                break;

            case 'tryPosition':
                store.commit('updateMyTurn', false);
                if (obj.distance) {

                    L.popup().setContent("Vous êtes à une distance de " + obj.distance.value).setLatLng(store.getters.pos).openOn(store.getters.map);

                } else if (obj.found) {

                    let nbTries = store.getters.logs.length;
                    L.marker([obj.found.position.lat, obj.found.position.lon], {icon: Constants.getIcon(Constants.GREEN_MARKER)});
                    $('#message').html(
                        "<p>Bien joué vous avez gagné !</p>" +
                        "<p>" +
                            (nbTries>1? "Vous avez réussi en "+nbTries +"essais" : "Vous avez réussi du premier coup !") +
                        "</p>" +
                        "<p>L'ennemi se trouve sur le marker vert</p>"
                    );

                    Constants.vibrate(Constants.VIBRATE);
                    store.commit("setGameIsRunning", false);

                } else {
                    $('#message').append("<p>Quelque chose d'improbable s'est passé, veuillez contactez le développeur</p>");
                }
                break;

            case 'reset':
                $('#message').html("<p>L'ennemi s'est déconnecté, le jeu s'arrête. Vous allez être redirigé dans 10 secondes</p>");

                setTimeout(function () {
                    router.push(Constants.INIT_PATH);
                }, Constants.SEC_10);
                break;

            case 'state':
                if(obj.message !== undefined && obj.message !== "")
                    $("#message").html(obj.message);

                switch(obj.state){
                    case 0.5:
                        $("#message").html("<p>En attente de connexion de l'autre joueur</p>");
                        store.commit("resetPositions");
                        break;
                    case 2:
                        store.commit("setGameIsRunning", true);
                        store.commit('updateMyTurn', obj.turn === store.getters.userId);

                        if(obj.lastShoot !== undefined){
                            store.commit("updateLastEnnemyShoot", obj.lastShoot);
                        }

                        if (Modernizr.devicemotion) {
                            // Variables de calcul d'accélération
                            let initAcc = {
                                x: 0,
                                y: 0,
                                z: 0
                            };
                            let initAcc2 = {
                                x: 0,
                                y: 0,
                                z: 0
                            };

                            window.addEventListener('devicemotion', function (event) {
                                initAcc.x = initAcc2.x;
                                initAcc.y = initAcc2.y;
                                initAcc.z = initAcc2.z;

                                initAcc.x = event.acceleration.x;
                                initAcc.y = event.acceleration.y;
                                initAcc.z = event.acceleration.z;

                                setInterval(function () {
                                    let diff = Math.abs(initAcc.x - initAcc2.x + initAcc.y - initAcc2.y + initAcc.z - initAcc2.z);
                                    if (diff >= Constants.SENSITIVITY_VALUE && !store.getters.isTimerRunning  && store.getters.gameIsRunning)
                                        store.commit('updateTime');
                                }, 200);
                            }, true);
                        }
                        break;
                    case 3:
                        if(store.getters.gameIsRunning){
                            store.commit("setGameIsRunning", false);
                            store.commit('updateMyTurn', false);

                            let msg = "";
                            if(obj.winner == store.getters.userId){
                                msg = "Vous avez gagné !";
                            }else{
                                msg = "Vous avez perdu, dommage ..";
                            }

                            $('#message').html("<p>"+msg+"</p>");
                        }


                        break;
                }

                break;

            case 'initAdmin':
                store.commit('updateId', obj.id);
                store.commit('setIsAdmin', true);
                router.push(Constants.ADMIN_PATH);
                break;

            case 'admin':
                store.commit('updateLogs', obj.logs);
                $("ul.console").html("");
                let nbMsg = store.getters.logs.length-20 < 0 ? 0 : store.getters.logs.length- 20;
                let sliceLogs = store.getters.logs.slice(nbMsg); // On affiche au plus les 20 derniers messages
                sliceLogs.forEach(function(msg){
                    $("ul.console").append("<li>"+msg+"</li>");
                });
                break;

            case 'adminMessage':
                $('#adminMessage').html("<p>Message de l'admnistrateur : "+obj.message+"</p>")
                $("#adminMessage").show();
                setTimeout(function () {
                    $("#adminMessage").fadeOut("slow");
                }, Constants.SEC_10);
                break;

            case 'adminPositions':

                if(store.getters.markers.length >= 1){
                    console.log("Markers are set");
                    store.getters.markers.forEach(function (marker) {
                        store.getters.map.removeLayer(marker);
                    });

                    delete store.getters.markers.values();
                }

                for(let idPos in obj.positions){

                    let numberPlayer = parseInt(idPos)+1;

                    if(obj.positions[idPos].geoPos !== null && obj.positions[idPos].geoPos !== undefined){
                        let marker = L.marker([obj.positions[idPos].geoPos.lat, obj.positions[idPos].geoPos.lon], {icon: Constants.getIcon(Constants.BLUE_MARKER)});

                        marker.bindPopup("Position du joueur "+numberPlayer);
                        marker.on('mouseover', function (e) {
                            this.openPopup();
                        });

                        marker.on('mouseout', function (e) {
                            this.closePopup();
                        });
                        store.commit('storeMarker', marker);
                    }

                    if(obj.positions[idPos].lastShoot !== null && obj.positions[idPos].lastShoot !== undefined) {
                        let lastShoot = L.marker([obj.positions[idPos].lastShoot.lat, obj.positions[idPos].lastShoot.lon], {icon: Constants.getIcon(Constants.RED_MARKER)});
                        lastShoot.bindPopup("Dernier essai du joueur " + numberPlayer);
                        lastShoot.on('mouseover', function (e) {
                            this.openPopup();
                        });

                        lastShoot.on('mouseout', function (e) {
                            this.closePopup();
                        });
                        store.commit('storeMarker', lastShoot);
                    }
                }

                store.getters.markers.forEach(function(marker){
                    marker.addTo(store.getters.map);
                });

                break;

            case 'error':
                $('#message').html(obj.message);

                switch(obj.level){
                    case 1:
                        store.commit("setGameIsRunning", false);
                        store.commit('updateMyTurn', false);

                        setTimeout(function () {
                            store.commit("reset");
                            router.push(Constants.INIT_PATH);
                        }, Constants.SEC_10);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    });

};

export default {
    socketEvent: socketEvent
}