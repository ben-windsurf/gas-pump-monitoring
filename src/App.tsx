import { useState } from 'react'
import { MapPin, Fuel, QrCode, User, Car } from 'lucide-react'
import MapView from './components/MapView'
import StationDetails from './components/StationDetails'
import QRScanner from './components/QRScanner'
import UserProfile from './components/UserProfile'
import './App.css'

type View = 'map' | 'details' | 'scanner' | 'profile'

interface GasStation {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  availablePumps: number
  totalPumps: number
  regularPrice: number
  premiumPrice: number
  dieselPrice: number
  amenities: string[]
  status: 'open' | 'busy' | 'closed'
  isOpen24Hours: boolean
}

function App() {
  const [currentView, setCurrentView] = useState<View>('map')
  const [selectedStation, setSelectedStation] = useState<GasStation | null>(null)
  const [isFueling, setIsFueling] = useState(false)

  // Mock data for 7-Eleven gas stations
  const stations: GasStation[] = [
    {
      id: '1',
      name: '7-Eleven Downtown',
      address: '123 Main St, Miami, FL',
      lat: 25.7617,
      lng: -80.1918,
      availablePumps: 6,
      totalPumps: 8,
      regularPrice: 3.45,
      premiumPrice: 3.75,
      dieselPrice: 3.89,
      amenities: ['Slurpee', 'Hot Food', 'ATM', 'Restroom'],
      status: 'open',
      isOpen24Hours: true
    },
    {
      id: '2',
      name: '7-Eleven Airport',
      address: '2100 NW 42nd Ave, Miami, FL',
      lat: 25.7959,
      lng: -80.2870,
      availablePumps: 2,
      totalPumps: 10,
      regularPrice: 3.52,
      premiumPrice: 3.82,
      dieselPrice: 3.95,
      amenities: ['Big Bite', 'Coffee', 'Lottery'],
      status: 'busy',
      isOpen24Hours: true
    },
    {
      id: '3',
      name: '7-Eleven Beach',
      address: '1701 Collins Ave, Miami Beach, FL',
      lat: 25.7907,
      lng: -80.1300,
      availablePumps: 4,
      totalPumps: 6,
      regularPrice: 3.48,
      premiumPrice: 3.78,
      dieselPrice: 3.92,
      amenities: ['Slurpee', 'Snacks', 'Ice'],
      status: 'open',
      isOpen24Hours: false
    }
  ]

  const handleStationSelect = (station: GasStation) => {
    setSelectedStation(station)
    setCurrentView('details')
  }

  const handleStartFueling = () => {
    setCurrentView('scanner')
  }

  const handleQRScan = (result: string) => {
    console.log('QR Code scanned:', result)
    setIsFueling(true)
    setCurrentView('map')
  }

  const renderView = () => {
    switch (currentView) {
      case 'map':
        return (
          <MapView 
            stations={stations} 
            onStationSelect={handleStationSelect}
            isFueling={isFueling}
          />
        )
      case 'details':
        return selectedStation ? (
          <StationDetails 
            station={selectedStation} 
            onStartFueling={handleStartFueling}
            onBack={() => setCurrentView('map')}
          />
        ) : null
      case 'scanner':
        return (
          <QRScanner 
            onScan={handleQRScan}
            onBack={() => setCurrentView('details')}
          />
        )
      case 'profile':
        return (
          <UserProfile 
            onBack={() => setCurrentView('map')}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="flex items-center gap-2">
            <Fuel className="text-red-600" size={24} />
            <h1 className="text-xl font-bold">7-Eleven Gas Finder</h1>
          </div>
          {isFueling && (
            <div className="fueling-indicator">
              <Car className="text-blue-500" size={20} />
              <span className="text-sm text-blue-600">Fueling</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${currentView === 'map' ? 'active' : ''}`}
          onClick={() => setCurrentView('map')}
        >
          <MapPin size={20} />
          <span>Find</span>
        </button>
        <button 
          className={`nav-item ${currentView === 'scanner' ? 'active' : ''}`}
          onClick={() => setCurrentView('scanner')}
        >
          <QrCode size={20} />
          <span>Scan</span>
        </button>
        <button 
          className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentView('profile')}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  )
}

export default App
