import marked from 'marked'
import waypoint from 'waypoints/lib/noframework.waypoints.js'


L.UxNarrative = L.Control.extend({
    options: {
        story: 'ux_narrative.md',
        position: 'topleft',
        icon: 'https://tangrams.github.io/ux_narrative/ux_narrative.png',
        width: 500
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function(map) {
        var icon_size = 26;
        var container_width = this.options.width;
        var state_open = false;

        // CONTAINER
        // -------------------------------------------------------------
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom ux_narrative-container');
        container.addEventListener('mousedown', function(e) {
            console.log('mousedown container');
            map.dragging.disable();
            map.scrollWheelZoom.disable(); 
            e.stopPropagation();
        });

        container.addEventListener('mouseup', function(e) {
            console.log('mouseup container');
            map.dragging.enable();
        });

        // map.on('focus', function() { map.scrollWheelZoom.enable(); });
        // map.on('blur', function() { map.scrollWheelZoom.disable(); });

        // ICON
        // -------------------------------------------------------------
        var icon =  L.DomUtil.create('img', 'ux_narrative-icon', container);
        icon.src = this.options.icon;

        var story = L.DomUtil.create('div', 'ux_narrative-story', container);
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
                    story.innerHTML = marked(content);
                    var markers = story.getElementsByClassName('marker');
                    for (var i = 0; i < markers.length; i++ ) {
                        waypoints.push(new Waypoint( {
                                                        element: markers[i],
                                                        context: container,
                                                        handler: function(direction) {
                                                            //console.log(this.element);
                                                            //if (direction == 'up') { return; }

                                                            if (this.element.hasAttribute('lat')&&
                                                                this.element.hasAttribute('lng')&&
                                                                this.element.hasAttribute('zoom')) {
                                                                var options = { animate: true, duration: 1., easeLinearity: 1};

                                                                if (this.element.hasAttribute('duration')) {
                                                                    options.duration = parseFloat(this.element.getAttribute('duration'));
                                                                    //console.log(options);
                                                                }
                                                                var lat = parseFloat(this.element.getAttribute('lat'));
                                                                var lng = parseFloat(this.element.getAttribute('lng'));
                                                                var zoom = parseFloat(this.element.getAttribute('zoom'));
                                                                map.flyTo({lon: lng, lat: lat},zoom,options);
                                                            }
                                                            // if (window.timeSlider && window.timeSlider.noUiSlider && this.element.hasAttribute('hour')) {
                                                            //     var hour = (parseFloat(this.element.getAttribute('hour')) - 1 )% 24;
                                                            //     window.timeSlider.noUiSlider.set(hour)
                                                            // }
                                                        },
                                                        offset: '100%'
                                                    } ));
                    }
                })
            window.waypoints = waypoints;
        }

        loadStory (this.options.story); 
        story.style.visibility = "hidden";

        container.addEventListener('mouseover', function() { 
            console.log('mouseover story');
            map.scrollWheelZoom.disable(); 
        });

        map.on('mouseover', function() { 
            console.log('mouseover map');
        });

        map.addEventListener('click', function() { 
            console.log('click map');
            map.scrollWheelZoom.enable(); 
        });

        function resize_container() {
            if (state_open) {
                var bbox = container.getBoundingClientRect();
                container.style.width = container_width + 'px';
                container.style.height = (window.innerHeight-Math.min(bbox.top,bbox.bottom)-Math.min(bbox.right,bbox.left))+'px';
                container.style.overflow = 'scroll';
                story.style.visibility = "visible";
            } else {
                container.style.width = icon_size+'px';
                container.style.height = icon_size+'px';
                container.style.overflow = 'hidden';
                story.style.visibility = "hidden";
            }
        }

        icon.addEventListener('click', function(event) {
            state_open = !state_open;
            resize_container();
            event.stopPropagation();
        });

        resize_container();

        return container;
    },

    onRemove: function (map) {
        // when removed
    }
});

L.uxNarrative = function(options) { return new L.UxNarrative(options); };