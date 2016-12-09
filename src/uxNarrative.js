import marked from 'marked'
import waypoint from 'waypoints/lib/noframework.waypoints.js'


L.UxNarrative = L.Control.extend({
    options: {
        story: 'ux_narrative.md',
        position: 'topleft',
        icon: 'https://tangrams.github.io/ux_narrative/ux_narrative.png',
        start_open: false,
        ignore_up: false,
        markers_offset: '10%',
        width: '500px'
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function(map) {
        var icon_size = 26;
        var container_width = this.options.width;
        var state_open = this.options.start_open;
        var ignore_up = this.options.ignore_up;
        var markers_offset = this.options.markers_offset;

        var default_draggin = map.dragging._enabled;

        // CONTAINER
        // -------------------------------------------------------------
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom ux_narrative-container');

        // ICON
        // -------------------------------------------------------------
        var icon =  L.DomUtil.create('img', 'ux_narrative-icon', container);
        icon.src = this.options.icon;

        var markdown_container = L.DomUtil.create('div', 'ux_narrative-story', container);

        function resize_container() {
            if (state_open) {
                var bbox = container.getBoundingClientRect();
                container.style.width = container_width;
                container.style.height = (window.innerHeight-Math.min(bbox.top,bbox.bottom)-10.)+'px';
                markdown_container.style.visibility = "visible";
            } else {
                container.style.width = icon_size+'px';
                container.style.height = icon_size+'px';
                markdown_container.style.visibility = "hidden";
            }
        }
        
        var waypoints = []
        function loadStory (url) {
            // Make the request and wait for the reply
            fetch(url)
                .then(function (response) {
                    // If we get a positive response...
                    if (response.status !== 200) {
                        console.log('Error getting shader. Status code: ' + response.status);
                        return;
                    }
                    // console.log(response);
                    return response.text();
                })
                .then(function(content) {
                    markdown_container.innerHTML = marked(content);
                    var markers = markdown_container.getElementsByClassName('marker');
                    for (var i = 0; i < markers.length; i++ ) {
                        waypoints.push(new Waypoint( {
                                                        element: markers[i],
                                                        context: markdown_container,
                                                        handler: function(direction) {
                                                            if (ignore_up && direction == 'up') { return; }

                                                            var options = { animate: true, duration: 1., easeLinearity: 10.};

                                                            if (this.element.hasAttribute('duration')) {
                                                                options.duration = parseFloat(this.element.getAttribute('duration'));
                                                            }

                                                            if (this.element.hasAttribute('lat')&&
                                                                this.element.hasAttribute('lng')&&
                                                                this.element.hasAttribute('zoom')) {
                                                                
                                                                var lat = parseFloat(this.element.getAttribute('lat'));
                                                                var lng = parseFloat(this.element.getAttribute('lng'));
                                                                var zoom = parseFloat(this.element.getAttribute('zoom'));
                                                                map.flyTo({lon: lng, lat: lat}, zoom, options);
                                                            } else if (this.element.hasAttribute('location')) {
                                                                var hash = this.element.getAttribute('location').split('/');
                                                                if (hash.length == 3) {
                                                                    var lat = parseFloat(hash[1]);
                                                                    var lng = parseFloat(hash[2]);
                                                                    var zoom = parseFloat(hash[0]);
                                                                    console.log({lon: lng, lat: lat}, zoom, options);
                                                                    map.flyTo({lon: lng, lat: lat}, zoom, options);
                                                                }
                                                            }
                                                        },
                                                        offset: markers_offset
                                                    } ));
                    }
                })
            resize_container()
        }

        // EVENTS 
        map.on('mouseover', function(event) { 
            // console.log('mouseover map');
            if (default_draggin) {
                map.dragging.enable();
            }
            
            map.scrollWheelZoom.enable();
        });

        map.addEventListener('click', function() { 
            // console.log('click map');
            if (default_draggin) {
                map.dragging.enable();
            }
            map.scrollWheelZoom.enable(); 
        });

        map.addEventListener('mousedown', function(event) {
            // console.log('map container');
            if (default_draggin) {
                map.dragging.enable();
            }
            map.scrollWheelZoom.enable();
        });

        container.addEventListener('mouseover', function(event) { 
            // console.log('mouseover story');
            map.scrollWheelZoom.disable(); 
            event.stopPropagation();
        });

        container.addEventListener('mousedown', function(event) {
            // console.log('mousedown container');
            if (default_draggin) {
                map.dragging.disable();
            }
            
            map.scrollWheelZoom.disable(); 
            event.stopPropagation();
        });

        container.addEventListener('click', function(event) {
            if (default_draggin) {
                map.dragging.disable();
            }
            
            map.scrollWheelZoom.disable(); 
            event.stopPropagation();
        });

        container.addEventListener('mouseup', function(event) {
            if (default_draggin) {
                map.dragging.enable();
            }
        });

        window.addEventListener('resize', function(event) {
            resize_container();
        });

        icon.addEventListener('click', function(event) {
            state_open = !state_open;
            resize_container();
            event.stopPropagation();
        });

        loadStory(this.options.story); 

        return container;
    },

    onRemove: function (map) {
        // when removed
    }
});

L.uxNarrative = function(options) { return new L.UxNarrative(options); };