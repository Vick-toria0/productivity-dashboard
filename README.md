# Personal Productivity Dashboard

A beautiful, functional browser dashboard that serves as the perfect "New Tab" page. Built with vanilla HTML, CSS, and JavaScript, it features a modern bento-box layout with interactive widgets.

## Features

### 🕐 Dynamic Clock & Greeting
- Real-time clock updating every second
- Smart greetings that change based on time of day
- Current date display with full formatting

### 🌤️ Weather Widget
- Fetches local weather using OpenWeatherMap API
- Shows temperature and weather conditions
- Loading states and error handling
- Auto-refreshes every 10 minutes

### 🎯 Main Focus Tracker
- Daily goal input with persistent storage
- Interactive completion checkbox
- Confetti celebration when goals are completed
- Visual feedback with strikethrough effect

### 💾 Local Storage Persistence
- Saves your name and daily focus
- Remembers completion status
- Persists across browser sessions

### 🎨 Beautiful Design
- Modern glassmorphism effects
- Responsive bento-box grid layout
- Smooth hover animations
- Mobile-friendly responsive design

## Quick Start

1. **Clone or download the files**
2. **Get your OpenWeatherMap API key**:
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key
   - Replace `YOUR_OPENWEATHERMAP_API_KEY` in `script.js` with your key
3. **Open `index.html` in your browser**
4. **Set as your new tab page** in your browser settings

## Setup Instructions

### Weather API Setup
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Create a free account
3. Navigate to the API keys section
4. Copy your API key
5. Open `script.js` and replace `YOUR_OPENWEATHERMAP_API_KEY` with your actual key

### Browser Integration
- **Chrome**: Go to Settings > On startup > Add a new page > Select index.html
- **Firefox**: Go to Options > Home > New Windows and Tabs > Custom URLs > Select index.html

## Customization

### Personal Name
Click on the welcome message to set your name. It will be saved and displayed on future visits.

### Background Images
To enable dynamic Unsplash backgrounds, uncomment this line in `script.js`:
```javascript
setUnsplashBackground();
```

### Adding New Widgets
The grid layout is easily extensible. Add new widgets by creating a div with the `widget` class:
```html
<div class="widget">
    <h2>Your Widget Title</h2>
    <!-- Widget content here -->
</div>
```

## File Structure
```
├── index.html      # Main HTML structure
├── styles.css      # Styling and layout
├── script.js       # All functionality
└── README.md       # This file
```

## Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid, Flexbox, and animations
- **Vanilla JavaScript** - No frameworks required
- **OpenWeatherMap API** - Weather data
- **Canvas Confetti** - Celebration effects
- **Google Fonts (Inter)** - Typography

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Privacy
This dashboard is completely client-side. No data is sent to external servers except for:
- Weather data (with your permission)
- Optional background images from Unsplash

All personal data is stored locally in your browser using localStorage.

## Contributing
Feel free to customize and extend this dashboard for your personal productivity needs!
