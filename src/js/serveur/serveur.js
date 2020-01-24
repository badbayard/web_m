'use strict'

const express = require('express');
const expressWs = require('express-ws');
const webpack = require('webpack');
var bodyParser = require('body-parser');
const http = require('http');

// Port
const port = 3000;

const app = express();
const server = http.createServer(app).listen(port, () => console.log('MifMap Run on port ' + port + '!'));
expressWs(app, server);
var router = express.Router();

// Model
let applicationModel = require('./model/application.js');
const Position = require('./model/position.js');
const Timer = require('./utils/timer.js');

// Exposition des dossiers
app.use(express.static("dist"));
app.use("/lib", express.static("node_modules"));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

router.use(function (req,res,next) {
    console.log("/" + req.method);
    next();
});

// WebSocket
app.ws('/', function(ws, req) {

    let index = null;
    let isAdmin = false;

    ws.on('message', function (msg) {
        let message = JSON.parse(msg);
        let obj = {};

        switch (message.type) {

            // INIT User or Admin
            case 'init':
                let response = 0;
                if(message.pseudo !== undefined) {
                    if (message.urlImage !== undefined) {
                        applicationModel.logs.push("Nouveau joueur : " + message.pseudo + ", image accessible à l'adresse : " + message.urlImage);
                        response = applicationModel.addUser(message.pseudo, message.urlImage);

                        obj.type = 'init';
                        obj.added = response;

                        if(response){
                            applicationModel.addSocket(ws);
                            obj.id = applicationModel.users.length - 1;
                        }

                    } else {
                        applicationModel.logs.push("Nouvel Administrateur : " + message.pseudo);
                        response = applicationModel.addAdmin(message.pseudo);

                        obj.type = 'initAdmin';
                        obj.id = applicationModel.admins.length - 1;

                        isAdmin = true;
                    }

                    index = obj.id;
                }


                ws.send(JSON.stringify(obj));
                break;

            case 'updatePseudoImage':

                if(!message.isAdmin) {
                    if (message.urlImage !== undefined && message.urlImage !== "") {
                        applicationModel.logs.push("Le joueur " + applicationModel.users[message.id].pseudo + " a mis à jour son image");
                        applicationModel.users[message.id].urlImage = message.urlImage;
                    }

                    if (message.pseudo !== undefined && message.pseudo !== "") {
                        applicationModel.logs.push("Le joueur " + applicationModel.users[message.id].pseudo + " s'appelle désormais " + message.pseudo);
                        applicationModel.users[message.id].pseudo = message.pseudo;
                    }
                }else{
                    if (message.pseudo !== undefined && message.pseudo !== "") {
                        applicationModel.logs.push("L'administrateur " + applicationModel.admins[message.id].pseudo + " s'appelle désormais " + message.pseudo);
                        applicationModel.admins[message.id].pseudo = message.pseudo;
                    }
                }

                break;

            case 'tryPosition':
                let id = message.id;

                if(id !== undefined && id === applicationModel.turn && applicationModel.state === 2){ // Si c'est bien son tour
                    let lat = message.lat;
                    let lon = message.lon;
                    let lastPositionSent = new Position(lat, lon);
                    applicationModel.logs.push("TIR : "+applicationModel.getCurrentUser().pseudo+" a essayé sur la position ["+lastPositionSent.lat+","+lastPositionSent.lon+"]");

                    obj = applicationModel.newPos(lastPositionSent);
                }

                obj.type = 'tryPosition';

                ws.send(JSON.stringify(obj));
                break;

            case 'intervalPosition':
                if(applicationModel.state === 2) {
                    applicationModel.logs.push("MAJ, l'utilisateur " + applicationModel.users[message.id].pseudo + " se situe au : " + message.place_name);
                    applicationModel.users[message.id].position = message.position;

                    // On reset le timeout et on le relance
                    if (applicationModel.users[message.id].timer !== null)
                        clearTimeout(applicationModel.users[message.id].timer);
                    applicationModel.users[message.id].timer = Timer(ws, message.id);
                }
                break;

            case 'admin':
                let nbMessages = message.nb;
                obj = {
                    type: 'admin',
                    logs: applicationModel.logs.slice(nbMessages), // On ne renvoit que les messages non reçu
                    nbMessages: applicationModel.logs.length // Et on met à jour côté client le nombre de messages déjà stockés
                };
                ws.send(JSON.stringify(obj));
                break;

            case 'adminPositions':

                obj.type = 'adminPositions';
                obj.positions = [];

                for(let idUser in applicationModel.users){
                    obj.positions[idUser] = {};
                    obj.positions[idUser].geoPos = applicationModel.users[idUser].position;
                    obj.positions[idUser].lastShoot = applicationModel.users[idUser].positions[applicationModel.users[idUser].positions.length -1];
                }

                ws.send(JSON.stringify(obj));
                break;

            case 'messageToAll':
                if(message.isAdmin)
                    applicationModel.logs.push("Nouveau message de l'administrateur "+applicationModel.admins[index].pseudo+" : "+message.message);
                else
                    applicationModel.logs.push("Nouveau message du joueur "+applicationModel.users[index].pseudo+" : "+message.message);

                for(let userS in applicationModel.users){
                    obj = {
                        type: 'adminMessage',
                        message: applicationModel.admins[index].pseudo+" : "+message.message
                    };
                    applicationModel.sockets[userS].send(JSON.stringify(obj));
                }
                break;

            case 'state':
                let userId = message.id;

                obj = {
                    type: 'state',
                    state: applicationModel.state
                };

                let msg = "";

                switch (applicationModel.state) {
                    case 2:
                        obj.turn = applicationModel.turn;
                        obj.lastShoot = applicationModel.users[(userId+1)%2].positions[applicationModel.users[(userId+1)%2].positions.length -1];
                        break;
                    case 3:
                        obj.winner = applicationModel.winner;
                        break;
                    default:
                        break;
                }


                ws.send(JSON.stringify(obj));
                break;

            default:
                break;
        }
    });

    ws.on('close', function (code, msg) {
        console.log('Fermeture socket, message --');
        applicationModel.closeSocket(index, isAdmin);
    });

    console.log('Connexion socket :', req.connection.remoteAddress);
});
