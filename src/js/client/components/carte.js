'use strict'

import store from '../store/store.js'

export default {
    name: "Carte",
    template:
    '<section class="map-container">'+
        '<div id="map"></div>' +
    '</section>',
    mounted: function () {
        this.initMap();

        store.getters.map.on('zoomend', function(){
            store.commit('changeZoom', this.getZoom());
            $("#zoom").val(this.getZoom());
        });
    },
    methods: {
        initMap: function () {
            store.commit('setMap', L.map('map'));

            L.Icon.Default.imagePath = '/lib/leaflet-css/dist/images/';

            // Création d'un "tile layer" (permet l'affichage sur la carte)
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibTFpZjEzIiwiYSI6ImNqczBubmhyajFnMnY0YWx4c2FwMmRtbm4ifQ.O6W7HeTW3UvOVgjCiPrdsA', {
                maxZoom: 20,
                minZoom: 1,
                dragging: !L.Browser.mobile,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox.streets'
            }).addTo(store.getters.map);

            store.getters.map.on('click', this.clickMap);
            store.commit("updateMap");

        },
        clickMap : function (e) {
            // console.log(e.latlng)
            // L.popup().setContent("Vous avez cliqué sur la latitude "+e.latlng.lat+", et sur une longitude de "+e.latlng.lng).setLatLng(e.latlng).openOn(store.getters.map);

            store.commit("changeLat", e.latlng.lat);
            store.commit("changeLon", e.latlng.lng);

            $("#lat").val(e.latlng.lat);
            $("#lon").val(e.latlng.lng);
        }
    }
}