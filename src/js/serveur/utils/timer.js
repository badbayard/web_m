
const applicationModel = require('../model/application.js');

let timer = function (ws, index) {
    return setTimeout(function () {
        if(applicationModel.sockets.length > 1){
            let obj = {
                type: 'reset'
            };

            let indexEnnemy = (index+1)%2;

            applicationModel.sockets[indexEnnemy].send(JSON.stringify(obj));

            applicationModel.reset();
        }
    }, 40000);
};

module.exports = timer;