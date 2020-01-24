
import Vue from 'vue';
import store from '../store/store.js';

export default {
    name: 'Minuteur',
    template:

    '<div class="minuteur">' +
        '<div>' +
            '<img id="image">' +
            '<h4 class="pseudo"></h4>' +
        '</div>' +
        '<div id="adminMessage"></div>' +
        '<div id="message"></div>' +
        '<div id="time"></div>' +
    '</div>',

    mounted: function () {
        $("#image").attr("src", store.getters.urlImage)
        .on("error", function(e) {
            $("#image").addClass("default-image");
            $("#image").attr("src", $("#image").css("content").match(/http.*jpg/));
        });

        $(".pseudo").html(store.getters.pseudo);

    }
};