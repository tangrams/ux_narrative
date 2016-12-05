import marked from 'marked';
import Waypoint from 'waypoints/lib/noframework.waypoints.js'

L.UxNarrative = L.Control.extend({
        options: {
        position: 'topleft',
        icon: 'https://tangrams.github.io/ux_narrative/ux_narrative.png'
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function(map) {
        var icon_size = 26;
        var state_open = false;

        // CONTAINER
        // -------------------------------------------------------------
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom ux_narrative-container');
        container.addEventListener('mousedown', function(e) {
            map.dragging.disable();
            e.stopPropagation();
        });

        container.addEventListener('mouseup', function(e) {
            map.dragging.enable();
        });

        // ICON
        // -------------------------------------------------------------
        var icon =  L.DomUtil.create('img', 'ux_narrative-icon', container);
        icon.src = this.options.icon;

        return container;
    },

    onRemove: function (map) {
        // when removed
    }
});

L.uxNarrative = function(options) { return new L.UxNarrative(options); };