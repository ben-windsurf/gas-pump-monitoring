import { useState } from 'react'
import { MapPin, Fuel, QrCode, User, Car } from 'lucide-react'
import MapView from './components/MapView'
import StationDetails from './components/StationDetails'
import QRScanner from './components/QRScanner'
import UserProfile from './components/UserProfile'
import { useGasStations, useUserTransactions } from './hooks/useDatabase'
import type { GasStation } from './database/types'
import './App.css'

type View = 'map' | 'details' | 'scanner' | 'profile'

function App() {
  const [currentView, setCurrentView] = useState<View>('map')
  const [selectedStation, setSelectedStation] = useState<GasStation | null>(null)
  const [isFueling, setIsFueling] = useState(false)
  
  const { stations, loading: stationsLoading } = useGasStations()
  const { addTransaction } = useUserTransactions()

  const handleStationSelect = (station: GasStation) => {
    setSelectedStation(station)
    setCurrentView('details')
  }

  const handleStartFueling = () => {
    setCurrentView('scanner')
  }

  const handleQRScan = (result: string) => {
    console.log('QR Code scanned:', result)
    
    if (selectedStation) {
      addTransaction({
        station_id: selectedStation.id,
        date: new Date().toISOString().split('T')[0],
        fuelType: 'Regular',
        gallons: 0,
        cost: 0
      })
    }
    
    setIsFueling(true)
    setCurrentView('map')
  }

  const renderView = () => {
    if (stationsLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner">
            <Fuel className="text-red-600" size={48} />
            <p>Loading gas stations...</p>
          </div>
        </div>
      )
    }

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
