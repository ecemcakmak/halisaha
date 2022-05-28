/* Openlayers */
/* ���*/
var Ol4Master = (function Ol4Master() {
    // private variables
    var view, layers, layer, vectorLayer, map;
    var _harita =
        "http://cbs.izmir.bel.tr/arcgis/rest/services/CbsRehberGeo/MapServer/export";
    var _olMode = "default";
    var _singletonObj = {};
    var _bouncerTimer;
    var vectorSource = new ol.source.Vector({});
    var defaultIcon = "/assets/images/icon/marker.png";

    /* Default style'lar */
    return function Init() {
        /*cache */
        var _this = this;
        /*kamera - viewport */
        view = new ol.View({
            center: ol.proj.fromLonLat([4.33, 35.7]),
            //sol, alt?, sa�, �st
            extent: [
                409228.05273368064, 4179901.550792531, 630228.05273368064,
                4359901.550792531,
            ],

            zoom: 10,

            minZoom: 9,
            maxZoom: 17,
        });
        /* Katmanlar - altliklar */
        layers = new ol.layer.Tile({
            source: new ol.source.OSM(),
        });
        layer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                params: {
                    F: "image",
                    FORMAT: "PNG32",
                    TRANSPARENT: "TRUE",
                    BBOXSR: "4917",
                    IMAGESR: "4917",
                    SIZE: "256,256",
                    DPI: 96,
                },
                url: _harita,
            }),
        });
        vectorLayer = new ol.layer.Vector({
            source: vectorSource,
        });
        /* harita */
        map = new ol.Map({
            target: "map",
            layers: [layer, vectorLayer],
            view: view,
        });

        /* Functions */
        /* size update */
        _this.UpdateMap = function() {
            map.updateSize();
        };
        //singleton pinleme için geliştirildi
        _this.SetModeSingleton = function(coords, popup, content, iconUrl) {
            _this.ClearMap();
            _olMode = "modeSingleton";
            coords = coords ? coords : [511721.2041286666, 4254261.5661930125];
            iconUrl = iconUrl ? iconUrl : defaultIcon;
            if (coords[0] == "" || coords[1] == "") {
                console.log("Adres Yok");
            } else {
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point([coords[0], coords[1]]),
                    content: content,
                    type: "poi",
                    popup: true,
                });

                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        src: iconUrl,
                        size: [20, 25],
                        scale: 0.9,
                    }),
                });
                iconFeature.setStyle(iconStyle);
                vectorSource.addFeature(iconFeature);
                _singletonObj = iconFeature;
                var dragInteraction = new ol.interaction.Modify({
                    features: new ol.Collection([iconFeature]),
                    pointerStyle: [],
                });
                map.addInteraction(dragInteraction);

                iconFeature.on(
                    "change",
                    function() {
                        // bouncer pattern => sürekli çalışmasın diye
                        if (this._bouncerTimer !== 0) {
                            clearTimeout(this._bouncerTimer);
                        }
                        this._bouncerTimer = setTimeout(() => {
                            if (singletonCoordChanged) {
                                singletonCoordChanged(this.getGeometry().getCoordinates());
                            }

                            //console.log('koordinatım:' + this.getGeometry().getCoordinates());
                        }, 500);
                    },
                    iconFeature
                );
            }
        };
        _this.ClearMap = function() {
            vectorSource.clear();
        };
        /* Nokta ekle*/
        _this.AddPoi = function(coords, popup, content, iconUrl, todoFunc, arg1) {
            iconUrl = iconUrl ? iconUrl : defaultIcon;
            if (coords[0] == "" || coords[1] == "") {
                console.log("Adres Yok");
            } else {
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point([coords[0], coords[1]]),
                    content: content,
                    type: "poi",
                    popup: true,
                });

                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        src: iconUrl,
                        size: [20, 25],
                        scale: 0.9,
                    }),
                });
                iconFeature.setStyle(iconStyle);
                vectorSource.addFeature(iconFeature);
            }
        };
        /* Nokta ekle */
        _this.AddPoiWithDesc = function(
            coords,
            popup,
            content,
            iconUrl,
            todoFunc,
            arg1
        ) {
            iconUrl = iconUrl ? iconUrl : defaultIcon;
            if (coords[0] == "" || coords[1] == "") {
                console.log("Adres Yok");
            } else {
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point([coords[0], coords[1]]),
                    content: content,
                    type: "poi",
                    event: todoFunc,
                    arg1: arg1,
                    popup: false,
                });

                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        src: iconUrl,
                        size: [20, 25],
                        scale: 0.9,
                    }),
                    text: new ol.style.Text({
                        font: "12px Calibri,sans-serif",
                        fill: new ol.style.Fill({
                            color: "#000",
                        }),
                        stroke: new ol.style.Stroke({
                            color: "#fff",
                            width: 2,
                        }),
                        text: content,
                        textAlign: "left",
                        offsetX: 7,
                    }),
                });
                iconFeature.setStyle(iconStyle);
                vectorSource.addFeature(iconFeature);
            }
        };
        /* Yol Ekle */
        _this.AddPath = function(
            lineString,
            popup,
            content,
            color_width,
            todoFunc
        ) {
            var jsonColorWidth = eval(color_width);
            var stylesx = [];
            /* i�ten d��a do�ru cok renkli yol olu�turulabiliyor */
            for (var x = 0; x < jsonColorWidth.length; x++) {
                var _stroke = new ol.style.Stroke({
                    color: jsonColorWidth[x].color,
                    width: jsonColorWidth[x].width,
                });
                var styl = new ol.style.Style({
                    stroke: _stroke,
                });
                stylesx.push(styl);
            }

            var feature = new ol.Feature({
                geometry: new ol.geom.LineString(lineString),
                content: content,
                type: "path",
            });
            feature.setStyle(stylesx);
            vectorSource.addFeature(feature);
        };
        /* Alan Ekle */
        _this.AddPolygon = function(
            ringString,
            popup,
            content,
            color,
            fill,
            event
        ) {
            var _color = color == "" ? "rgba(155, 100, 150, 0.8)" : color;
            var _fill = fill == "" ? "rgba(155, 100, 150, 0.3)" : fill;

            var feature = new ol.Feature({
                geometry: new ol.geom.Polygon([ringString]),
                content: content,
                event: event,
                type: "polygon",
            });

            var style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: _fill,
                }),
                stroke: new ol.style.Stroke({
                    width: 1,
                    color: _color,
                }),
            });
            feature.setStyle(style);
            vectorSource.addFeature(feature);
        };
        /* Bulk Load */
        _this.AddFeatures = function(json) {
            features = json.features;
            for (var i = 0; i < features.length; i++) {
                //  console.log("json " + i)
                var feature = features[i];
                if (feature.geometry.type == "MultiPolygon") {
                    _this.AddPolygon(
                        feature.geometry.coordinates,
                        1,
                        feature.content,
                        feature.strokecolor,
                        feature.bgcolor,
                        feature.todoFunc
                    );
                }
                if (feature.geometry.type == "MultiLineString") {
                    _this.AddPath(
                        feature.geometry.coordinates,
                        1,
                        feature.content,
                        feature.strokecolor,
                        feature.todoFunc
                    );
                }
                if (feature.geometry.type == "Point") {
                    _this.AddPoi(
                        feature.geometry.coordinates[0],
                        1,
                        feature.content,
                        feature.icon
                    );
                }
            }
        };
        _this.ZoomToVector = function(konum) {
            if (konum) {
                var extent = vectorSource.getExtent();
                extent[0] -= 1000;
                extent[1] -= 1000;
                extent[2] += 1000;
                extent[3] += 1000;
                map.getView().fit(extent, {
                    duration: 1000,
                });
            } else {
                var extent = vectorSource.getExtent();
                extent[0] -= 48000;
                extent[1] -= 18000;
                extent[2] += 18000;
                extent[3] += 18000;
                map.getView().fit(extent, {
                    duration: 1000,
                });
            }
        };
        /* Event Handlers */
        /* Pointer cursor*/

        map.on("pointermove", function(evt) {
            var hit = map.hasFeatureAtPixel(evt.pixel);
            map.getTargetElement().style.cursor = hit ? "pointer" : "";
        });
        /* Click Popup*/

        map.on("click", function(evt) {
            $(".ol-selectable").remove();
            var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                return feature;
            });

            if (feature) {
                var yoffset = feature.O.type == "poi" ? -5 : 0;
                var pointer_coord = map.getEventCoordinate(evt.originalEvent);
                //    var closest = vectorSource.getClosestFeatureToCoordinate(pointer_coord);
                //    feature = closest;

                var element = document.getElementById("popup").cloneNode();
                var popup = new ol.Overlay({
                    element: element,
                    positioning: "bottom-center",
                    stopEvent: false,
                    offset: [0, yoffset],
                });
                map.addOverlay(popup);
                var coord = feature.getGeometry().getCoordinates();
                coord = coord[0].constructor === Array ? pointer_coord : coord;
                if (feature.get("event")) {
                    var funcName = feature.get("event");
                    executeFunctionByName(funcName, window, feature.get("arg1"));
                }
                if (feature.get("popup")) {
                    popup.setPosition(coord);
                    $(element).popover({
                        placement: "top",
                        html: true,
                        content: feature.get("content"),
                    });
                    $(element).popover("show");
                }
            } else {
                if (_olMode === "modeSingleton") {
                    _singletonObj.getGeometry().setCoordinates(evt.coordinate);
                }
            }
        });
    };
})();

function executeFunctionByName(functionName, context /*, args */ ) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}

function loggg() {
    console.log("can be dynmaic function");
}

/* json */
function jsonGetir() {
    return (jsonExample = {
        type: "FeatureCollection",
        crs: {
            type: "name",
            properties: {
                name: "EPSG:4917",
            },
        },
        features: [],
    });
}

function CreateFeature(
    coords,
    type,
    content,
    strokecolor,
    bgcolor,
    todofunc,
    icon
) {
    return (feature = {
        type: "Feature",
        geometry: {
            type: type,
            coordinates: coords,
        },
        content: content,
        strokecolor: strokecolor,
        bgcolor: bgcolor,
        todoFunc: todofunc,
        icon: icon,
    });
}