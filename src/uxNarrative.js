L.UxNarrative = L.Control.extend({
        options: {
        position: 'topleft',
        icon: 'https://tangrams.github.io/ux_layers/ux_layers.png',
        icon_picker: 'https://tangrams.github.io/ux_layers/ux_picker.png',
        scene: null,
        layer: null
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function(map) {
        // CONTAINER
        // -------------------------------------------------------------
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom ux_layers-container');
        container.addEventListener('mousedown', function(e) {
            map.dragging.disable();
            e.stopPropagation();
        });

        container.addEventListener('mouseup', function(e) {
            map.dragging.enable();
        });

        return container;
    },

    onRemove: function (map) {
        // when removed
    }
});

L.uxNarrative = function(options) { return new L.UxNarrative(options); };