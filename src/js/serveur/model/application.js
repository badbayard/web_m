const Utilisateur = require('./utilisateur.js');

class Application {
    constructor() {
        // Logs de la console
        this.logs = [];

        // sockets des utilisateurs
        this.sockets = [];
        // Tableau de joueurs
        this.users = [];
        // Tableau d'admins
        this.admins = [];

        // Etat de l'application
        this.state = 0.0;

        // Tour des jours
        this.turn = 0;

        // Gagnant
        this.winner = null;
    }

    addSocket(socket){
        if(this.sockets.length < 2){
            this.sockets.push(socket);

        }else{
            let obj = {
                type: "Error",
                message: "Trop de joueurs connectés"
            };

            socket.send(JSON.stringify(obj));
        }
    }

    getCurrentSocket(){
        return this.sockets[this.getCurrentUser().id];
    }

    getOverSocket(){
        return this.sockets[this.getOverUser().id];
    }

    addUser(pseudo, url) {
        var ret = 0;
        if (this.users.length < 2) {
            this.users.push(new Utilisateur(pseudo, url));
            this.users[this.users.length - 1].id = this.users.length - 1;
            console.log("Added User " + pseudo);
            this.updateState();

            ret = 1;
        } else {
            console.log("No more user can log in");
        }

        return ret;
    }

    addAdmin(pseudo){
        this.admins.push(new Utilisateur(pseudo, null));
    }

    updateState() {
        switch (this.state) {
            case 0:
                console.log("First user has logged in");
                this.state += 0.5;
                break;
            case 0.5:
                console.log("Both users has logged in");
                console.log("Game can start");
                this.state += 1.5;
                break;
            /*
            * A été enlevé car on a appris le lundi 8 que l'on ne devait pas enregistré des positions initiales
            * et tirer dessus mais qu'on devait tirer sur le joueur lui même, il n'y a donc plus besoin d'attendre que les positions soient définies
            * */
            // case 1:
            //     console.log("Wait for the last position");
            //     this.state += 0.5;
            //     break;
            // case 1.5:
            //     console.log("Positions are set, the game can start, first user can begin");
            //     this.state += 0.5;
            //     break;
            case 2:
                console.log("One player has won");
                this.winner = this.getCurrentUser().id;
                this.logs.push("The player "+this.getCurrentUser().pseudo+" has won");
                this.turn = -1;
                ++this.state;
                break;
            case 3:
                console.log("Gamed alreday ended");
                break;
        }
    }

    switchTurn() {
        this.turn = (this.turn + 1) % 2;
    }

    getCurrentUser() {
        return this.users[this.turn];
    }

    getOverUser() {
        return this.users[(this.turn + 1) % 2];
    }

    newPos(lastPositionSent) {

        let obj = {};

        if (this.winner == null) { // S'il y a jamais eu un gagnant

            // On enregistre la dernière position envoyée
            this.getCurrentUser().positions.push(lastPositionSent);

            // On calcule la distance basé sur la dernière position enregistrée et l'autre utilisateur
            let distance = this.calculDistance(lastPositionSent.lat, lastPositionSent.lon);

            // En fonction de la distance, on renvoie un objet différent
            if (distance < 10) {

                this.winner = this.getCurrentUser().id;

                // La position de l'ennemi
                let position = {
                    lat: this.getOverUser().position.lat,
                    lon: this.getOverUser().position.lon
                };

                // On défini l'objet sur found
                obj.found = {
                    position: position
                };

                // On fait finir le jeu
                this.updateState();

                this.logs.push("L'utilisateur " + this.getCurrentUser().pseudo + " a gagné en tirant à "+distance+" mètres de sa cible");

            } else {
                // Raté on renvoie un objet "distance"
                obj.distance = {
                    turn: this.getCurrentUser().id,
                    value: distance
                };

                // Et on change de tour
                this.switchTurn();
                console.log("L'utilisateur " + this.getCurrentUser().pseudo + " est à " + distance + " mètres de la cible");
            }
        }

        return obj;
    }

    convertRad(input) {
        return (Math.PI * input) / 180;
    }

    calculDistance(lat, lon) {
        let R = 6378000; //Rayon de la terre en mètre

        let lat_a = this.convertRad(lat);
        let lon_a = this.convertRad(lon);
        let lat_b = this.convertRad(this.getOverUser().position.lat);
        let lon_b = this.convertRad(this.getOverUser().position.lon);

        return  Math.abs(R * (Math.PI / 2 - Math.asin(Math.sin(lat_b) * Math.sin(lat_a) + Math.cos(lon_b - lon_a) * Math.cos(lat_b) * Math.cos(lat_a))));
    }

    closeSocket(index, isAdmin) {
        if(isAdmin){
            this.logs.push("L'Administrateur "+this.admins[index].pseudo+" s'est déconnecté");

        }else{

            this.logs.push("L'utilisateur "+this.users[index].pseudo+" s'est déconnecté");
            this.users.active = false;

            // Si 2 joueurs sont déjà connectés
            if(this.sockets.length == 2 || this.users.length == 2){

                // On calcule l'index de l'autre joueur
                let indexEnnemy = (index+1)%2;

                if(this.users[indexEnnemy].active) {
                    
                    this.logs.push("On prévient l'utilisateur " + this.users[indexEnnemy].pseudo + ", et on recommence le jeu");

                    let obj = {
                        type: 'error',
                        level: 1,
                        message: "Votre adversaire s'est déconnecté, le jeu est donc terminé, vous allez être déconnecté puis redirigé vers l'accueil dans 10 secondes"
                    };

                    this.sockets[indexEnnemy].send(JSON.stringify(obj));
                }
            }else{
                this.reset();
            }
        }
    }

    reset(){

        this.logs.push("Réinitialisation des données de jeux ...");

        delete this.sockets;
        delete this.users;
        delete this.state;
        delete this.turn;
        delete this.winner;

        this.sockets = [];
        this.users = [];
        this.state = 0.0;
        this.turn = 0;
        this.winner = null;

        this.logs.push("Réinitialisation terminée !");
    }
}

module.exports = new Application();