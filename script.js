// Mapbox Playground - Main JavaScript
class MapboxPlayground {
    constructor() {
        // Set a default access token for demo purposes
        // Note: In production, this should be loaded from environment variables
        mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
        
        this.map = null;
        this.markers = [];
        this.polygons = [];
        this.isDrawing = false;
        this.drawingPoints = [];
        
        this.init();
    }
    
    init() {
        this.initMap();
        this.setupEventListeners();
        this.updateInfo();
    }
    
    initMap() {
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-74.006, 40.7128], // New York City
            zoom: 10
        });
        
        // Add navigation controls
        this.map.addControl(new mapboxgl.NavigationControl());
        
        // Add fullscreen control
        this.map.addControl(new mapboxgl.FullscreenControl());
        
        // Add geolocate control
        this.map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true
            })
        );
        
        // Map event listeners
        this.map.on('load', () => {
            this.onMapLoad();
        });
        
        this.map.on('click', (e) => {
            this.onMapClick(e);
        });
        
        this.map.on('move', () => {
            this.updateInfo();
        });
        
        this.map.on('zoom', () => {
            this.updateInfo();
        });
    }
    
    onMapLoad() {
        // Add source for polygons
        this.map.addSource('polygons', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: []
            }
        });
        
        // Add layer for polygons
        this.map.addLayer({
            id: 'polygons-fill',
            type: 'fill',
            source: 'polygons',
            paint: {
                'fill-color': '#667eea',
                'fill-opacity': 0.3
            }
        });
        
        this.map.addLayer({
            id: 'polygons-line',
            type: 'line',
            source: 'polygons',
            paint: {
                'line-color': '#667eea',
                'line-width': 2
            }
        });
        
        console.log('Map loaded successfully');
    }
    
    setupEventListeners() {
        // Map style selector
        document.getElementById('map-style').addEventListener('change', (e) => {
            this.map.setStyle(e.target.value);
        });
        
        // Add marker button
        document.getElementById('add-marker').addEventListener('click', () => {
            this.addMarkerMode();
        });
        
        // Draw polygon button
        document.getElementById('draw-polygon').addEventListener('click', () => {
            this.toggleDrawingMode();
        });
        
        // Clear all button
        document.getElementById('clear-all').addEventListener('click', () => {
            this.clearAll();
        });
        
        // GeoJSON file input
        document.getElementById('geojson-input').addEventListener('change', (e) => {
            this.loadGeoJSON(e.target.files[0]);
        });
    }
    
    onMapClick(e) {
        const coordinates = [e.lngLat.lng, e.lngLat.lat];
        
        // Update coordinates display
        document.getElementById('coordinates').textContent = 
            `Lat: ${coordinates[1].toFixed(6)}, Lng: ${coordinates[0].toFixed(6)}`;
        
        if (this.isDrawing) {
            this.addDrawingPoint(coordinates);
        }
    }
    
    addMarkerMode() {
        const button = document.getElementById('add-marker');
        button.textContent = 'Click on map to add marker';
        button.style.background = '#e53e3e';
        
        const clickHandler = (e) => {
            this.addMarker([e.lngLat.lng, e.lngLat.lat]);
            this.map.off('click', clickHandler);
            button.textContent = 'Add Marker';
            button.style.background = '#667eea';
        };
        
        this.map.once('click', clickHandler);
    }
    
    addMarker(coordinates, popupText = null) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            popupText || `
                <div>
                    <strong>Marker</strong><br>
                    Lat: ${coordinates[1].toFixed(6)}<br>
                    Lng: ${coordinates[0].toFixed(6)}
                </div>
            `
        );
        
        const marker = new mapboxgl.Marker()
            .setLngLat(coordinates)
            .setPopup(popup)
            .addTo(this.map);
        
        this.markers.push(marker);
        this.updateDataList();
        
        return marker;
    }
    
    toggleDrawingMode() {
        const button = document.getElementById('draw-polygon');
        
        if (this.isDrawing) {
            this.finishDrawing();
            button.textContent = 'Draw Polygon';
            button.style.background = '#667eea';
        } else {
            this.startDrawing();
            button.textContent = 'Finish Drawing';
            button.style.background = '#e53e3e';
        }
    }
    
    startDrawing() {
        this.isDrawing = true;
        this.drawingPoints = [];
        this.map.getCanvas().style.cursor = 'crosshair';
    }
    
    addDrawingPoint(coordinates) {
        this.drawingPoints.push(coordinates);
        
        // Add temporary marker for drawing point
        const marker = new mapboxgl.Marker({ color: '#e53e3e', scale: 0.5 })
            .setLngLat(coordinates)
            .addTo(this.map);
        
        // Store marker reference for cleanup
        if (!this.tempMarkers) this.tempMarkers = [];
        this.tempMarkers.push(marker);
    }
    
    finishDrawing() {
        if (this.drawingPoints.length < 3) {
            alert('A polygon needs at least 3 points');
            this.cancelDrawing();
            return;
        }
        
        // Close the polygon by adding the first point at the end
        const polygonCoordinates = [...this.drawingPoints, this.drawingPoints[0]];
        
        const polygon = {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [polygonCoordinates]
            },
            properties: {
                id: Date.now(),
                name: `Polygon ${this.polygons.length + 1}`
            }
        };
        
        this.polygons.push(polygon);
        this.updatePolygonsLayer();
        this.cleanupTempMarkers();
        
        this.isDrawing = false;
        this.map.getCanvas().style.cursor = '';
        this.updateDataList();
    }
    
    cancelDrawing() {
        this.isDrawing = false;
        this.drawingPoints = [];
        this.cleanupTempMarkers();
        this.map.getCanvas().style.cursor = '';
    }
    
    cleanupTempMarkers() {
        if (this.tempMarkers) {
            this.tempMarkers.forEach(marker => marker.remove());
            this.tempMarkers = [];
        }
    }
    
    updatePolygonsLayer() {
        const source = this.map.getSource('polygons');
        if (source) {
            source.setData({
                type: 'FeatureCollection',
                features: this.polygons
            });
        }
    }
    
    clearAll() {
        // Remove all markers
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
        
        // Clear polygons
        this.polygons = [];
        this.updatePolygonsLayer();
        
        // Cancel drawing if active
        if (this.isDrawing) {
            this.cancelDrawing();
            const button = document.getElementById('draw-polygon');
            button.textContent = 'Draw Polygon';
            button.style.background = '#667eea';
        }
        
        this.updateDataList();
    }
    
    loadGeoJSON(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const geojson = JSON.parse(e.target.result);
                this.processGeoJSON(geojson);
            } catch (error) {
                alert('Error parsing GeoJSON file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
    
    processGeoJSON(geojson) {
        if (geojson.type === 'FeatureCollection') {
            geojson.features.forEach(feature => this.addGeoJSONFeature(feature));
        } else if (geojson.type === 'Feature') {
            this.addGeoJSONFeature(geojson);
        } else {
            // Assume it's a geometry
            this.addGeoJSONFeature({
                type: 'Feature',
                geometry: geojson,
                properties: {}
            });
        }
        
        this.updateDataList();
    }
    
    addGeoJSONFeature(feature) {
        const geometry = feature.geometry;
        const properties = feature.properties || {};
        
        switch (geometry.type) {
            case 'Point':
                this.addMarker(geometry.coordinates, this.createPopupContent(properties));
                break;
            case 'Polygon':
            case 'MultiPolygon':
                this.polygons.push(feature);
                this.updatePolygonsLayer();
                break;
            default:
                console.log('Unsupported geometry type:', geometry.type);
        }
    }
    
    createPopupContent(properties) {
        let content = '<div><strong>GeoJSON Feature</strong><br>';
        for (const [key, value] of Object.entries(properties)) {
            content += `${key}: ${value}<br>`;
        }
        content += '</div>';
        return content;
    }
    
    updateInfo() {
        if (!this.map) return;
        
        const zoom = this.map.getZoom();
        document.getElementById('zoom-level').textContent = `Zoom: ${zoom.toFixed(2)}`;
    }
    
    updateDataList() {
        const dataList = document.getElementById('data-list');
        dataList.innerHTML = '';
        
        // Add markers to list
        this.markers.forEach((marker, index) => {
            const li = document.createElement('li');
            li.textContent = `Marker ${index + 1}`;
            dataList.appendChild(li);
        });
        
        // Add polygons to list
        this.polygons.forEach((polygon, index) => {
            const li = document.createElement('li');
            li.textContent = polygon.properties.name || `Polygon ${index + 1}`;
            dataList.appendChild(li);
        });
        
        if (this.markers.length === 0 && this.polygons.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No data loaded';
            li.style.fontStyle = 'italic';
            li.style.color = '#999';
            dataList.appendChild(li);
        }
    }
}

// Initialize the playground when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new MapboxPlayground();
    } catch (error) {
        console.error('Error initializing Mapbox Playground:', error);
        
        // Show error message to user
        const mapContainer = document.getElementById('map');
        mapContainer.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #e53e3e;">
                <h3>Error Loading Map</h3>
                <p>There was an error initializing the Mapbox map. Please check the console for details.</p>
                <p><small>Make sure you have a valid Mapbox access token configured.</small></p>
            </div>
        `;
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapboxPlayground;
}