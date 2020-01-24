
const Position = require('./position.js');

class User {
    constructor(pseudo, urlImage) {
        this.id = null;
        this.pseudo = pseudo;
        this.urlImage = urlImage;
        this.zoom = 10;
        this.position = null;
        this.positions = [];
        this.active = 1;
        this.timer = null;
    }

    setPosition(pos){
        this.position = pos;
        console.log('Position updated for user '+this.pseudo+', for lat:'+this.position.lat+', and lon:'+this.position.lon);
    }

    setId(id){
        this.id = id;
    }
}

module.exports = User;