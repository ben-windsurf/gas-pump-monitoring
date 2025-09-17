# 7-Eleven Gas Finder

A modern React application for locating 7-Eleven gas stations and managing fuel purchases. Built with TypeScript, Vite, and Mapbox GL JS.

## Features

- **Interactive Map**: View 7-Eleven gas stations on an interactive map with real-time pump availability
- **Station Details**: Get detailed information about fuel prices, pump availability, and amenities
- **QR Code Scanner**: Quickly start fueling sessions by scanning pump QR codes
- **User Profile**: Track your fuel purchase history and manage your account
- **Real-time Updates**: See live availability and status of gas pumps
- **Location Services**: Find nearby 7-Eleven stations based on your current location


## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Mapping**: Mapbox GL JS
- **Styling**: CSS3 with custom properties
- **Icons**: Lucide React
- **QR Scanning**: react-webcam + jsQR
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Mapbox access token

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pump-monitoring
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Mapbox access token:
```env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

- `VITE_MAPBOX_ACCESS_TOKEN`: Your Mapbox access token for map functionality

## Project Structure

```
src/
├── components/          # React components
│   ├── MapView.tsx     # Interactive map component
│   ├── StationDetails.tsx # Gas station details
│   ├── QRScanner.tsx   # QR code scanning functionality
│   └── UserProfile.tsx # User account and history
├── test/               # Test utilities and setup
├── App.tsx            # Main application component
├── App.css            # Global styles
├── main.tsx           # Application entry point
└── vite-env.d.ts      # Vite type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Features in Detail

### Map View
- Interactive map powered by Mapbox GL JS
- Color-coded markers indicating station status (open/busy/closed)
- Search functionality to find specific 7-Eleven locations
- Popup information showing pump availability and fuel prices

### Station Details
- Comprehensive gas station information
- Real-time pump availability
- Current fuel prices for Regular, Premium, and Diesel
- 24/7 operating hours information
- Amenities and services available
- Direct integration with fueling session start

### QR Scanner
- Camera-based QR code scanning for gas pumps
- Manual pump code entry fallback
- Secure fueling session initiation
- Integration with 7-Eleven payment systems

### User Profile
- Fuel purchase history and fill-up sessions
- Usage statistics including total gallons and average price per gallon
- Account management
- Favorite 7-Eleven stations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Mapbox for mapping services
- Lucide for beautiful icons
- React community for excellent tooling
- 7-Eleven for gas station data and services
