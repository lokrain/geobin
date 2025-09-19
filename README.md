# Geobin - Mapbox Playground

An interactive web-based playground for exploring and visualizing geospatial data using Mapbox GL JS.

## Features

- **Interactive Map**: Pan, zoom, and explore maps with multiple style options
- **Geospatial Data Visualization**: Load and display GeoJSON data
- **Drawing Tools**: Create markers and draw polygons directly on the map
- **Multiple Map Styles**: Switch between different Mapbox styles (Streets, Satellite, Dark, etc.)
- **Data Import**: Load GeoJSON files to visualize custom geospatial data
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

1. Open `index.html` in a web browser
2. The map will load with default settings centered on New York City
3. Use the controls panel to interact with the map

## Usage

### Map Controls

- **Map Style**: Use the dropdown to switch between different map styles
- **Add Marker**: Click the button, then click on the map to place a marker
- **Draw Polygon**: Click to start drawing, click on the map to add points, then click "Finish Drawing"
- **Clear All**: Remove all markers and polygons from the map
- **Load GeoJSON**: Upload a GeoJSON file to visualize your own data

### Navigation

- **Pan**: Click and drag to move around the map
- **Zoom**: Use mouse wheel or the +/- buttons
- **Fullscreen**: Click the fullscreen button in the map controls
- **Geolocate**: Click the location button to center on your current location

### Sample Data

A sample GeoJSON file (`sample-data.geojson`) is included with example points and polygons around New York City. You can load this file using the "Load GeoJSON" control to see the data visualization in action.

## Technical Details

### Dependencies

- **Mapbox GL JS v2.15.0**: For map rendering and interaction
- **Modern Web Browser**: Supports ES6+ features

### Files Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript application logic
├── sample-data.geojson # Sample GeoJSON data
└── README.md           # Documentation
```

### Mapbox Access Token

The playground uses a demo Mapbox access token. For production use, you should:

1. Sign up for a [Mapbox account](https://www.mapbox.com/)
2. Get your own access token
3. Replace the token in `script.js`

### Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Features in Detail

### Interactive Mapping
- Multiple base map styles (streets, satellite, dark mode, etc.)
- Smooth pan and zoom interactions
- Fullscreen mode support
- Geolocation integration

### Data Visualization
- Point markers with custom popups
- Polygon rendering with customizable styling
- GeoJSON file import support
- Real-time coordinate display

### Drawing Tools
- Click-to-place marker functionality
- Interactive polygon drawing
- Visual feedback during drawing operations
- Easy clearing of all drawn elements

### Responsive Interface
- Mobile-friendly layout
- Collapsible controls panel
- Touch-friendly interactions
- Adaptive grid system

## Contributing

This is an open-source project. Feel free to submit issues and pull requests to improve the playground.

## License

Licensed under the Apache License 2.0. See LICENSE file for details.