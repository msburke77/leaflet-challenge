// Add console.log
console.log("it_works");

// Make the basemap with OpenStreetMap
let basemap = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:'Map via openstreetmap.org &copy;'
    }
);

let map = L.map("map", {
    center: [40, -10],
    zoom: 2.4
})

basemap.addTo(map);

// Create a marker based on the magnitude - larger radius for higher magnitude
function getRadius(magnitude) {
    if(magnitude === 0) {
        return 1
    }
    return magnitude * 4
}

// Show depth of the earthquake by color
function getColor(depth) {
    if(depth === 0) {
        return "#ffffe6"
    }
    else if (depth < 5) {
        return "#ffffaa"
    }
    else if (depth < 10) {
        return "#ffee99"
    }
    else if (depth < 20) {
        return "#ffcc88"
    }
    else if (depth < 30) {
        return "#ffbb77"
    }
    else if (depth < 40) {
        return "#ffaa66"
    }
    else if (depth < 50) {
        return "#ff9955"
    }
    else if (depth < 60) {
        return "#ff8855"
    }
    else if (depth < 70) {
        return "#ff7755"
    }
    else if (depth < 80) {
        return "#ff7733"
    }
    else if (depth < 90) {
        return "#ff6622"
    }
    else if (depth < 100) {
        return "#ff3322"
    }
    else if (depth < 150) {
        return "#ff1111"
    }
    else if (depth < 300) {
        return "#660000"
    }
    else {
        return "#000000"
   }
}

// Get the earthquake data in json format from last day from earthquake.usgs.gov

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(function(data){
    function styleInfo(feature){
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        }
    }


// Pull the json data.  Set the marker shape as a circle and customize based on earthquake features.
        L.geoJson(data, {
            pointToLayer: function(feature,latlng){
                return L.circleMarker(latlng);
            },
            style: styleInfo,
            onEachFeature: function(feature,layer){
                layer.bindPopup(`
                    Depth: ${feature.geometry.coordinates[2]} <br>
                    Magnitude: ${feature.properties.mag} <br>
                    Location: ${feature.properties.place}`);
            }
        }).addTo(map);
    

// Add map legend
let legend = L.control({
    position: "bottomleft"
});

legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Add legend title
    div.innerHTML = "<strong>Earthquake depth (km)</strong><br>";

    let grades = [0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 300];
    let colors = ["#ffffe6", "#ffffaa", "#ffee99", "#ffcc88", "#ffbb77", "#ffaa66", "#ff9955", "#ff8855", "#ff7755", "#ff7733", "#ff6622", "#ff3322", "#ff1111", "#660000"];

    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            "<span class='legend-item' style='background-color: " + colors[i] + "'></span>" +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }

    return div;

};

legend.addTo(map);
        
});    