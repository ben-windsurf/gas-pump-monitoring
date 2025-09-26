import { ArrowLeft, Navigation, Fuel, Clock, DollarSign, MapPin, Wifi, Car, Coffee } from 'lucide-react'
import type { GasStation } from '../database/types'

interface StationDetailsProps {
  station: GasStation
  onStartFueling: () => void
  onBack: () => void
}

export default function StationDetails({ station, onStartFueling, onBack }: StationDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-orange-100 text-orange-800'
      case 'closed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi size={16} />
      case 'slurpee': case 'hot food': case 'big bite': case 'coffee': return <Coffee size={16} />
      case 'restroom': case 'atm': return <MapPin size={16} />
      case 'lottery': case 'snacks': case 'ice': return <Car size={16} />
      default: return <MapPin size={16} />
    }
  }

  const handleGetDirections = () => {
    const url = `https://maps.google.com/?q=${station.lat},${station.lng}`
    window.open(url, '_blank')
  }

  return (
    <div className="station-details">
      {/* Header */}
      <div className="details-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
        </button>
        <h2 className="details-title">Gas Station Details</h2>
      </div>

      {/* Station Info Card */}
      <div className="details-card">
        <div className="station-main-info">
          <div className="station-title-section">
            <h1 className="station-title">{station.name}</h1>
            <span className={`status-pill ${getStatusColor(station.status)}`}>
              {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
            </span>
          </div>
          <p className="station-location">{station.address}</p>
        </div>

        {/* Availability and Fuel Prices */}
        <div className="station-metrics">
          <div className="metric-card">
            <div className="metric-icon">
              <Fuel className="text-red-600" size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-value">{station.availablePumps}/{station.totalPumps}</span>
              <span className="metric-label">Pumps Available</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-value">${station.regularPrice}</span>
              <span className="metric-label">Regular /gal</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-value">${station.premiumPrice}</span>
              <span className="metric-label">Premium /gal</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <Clock className="text-orange-500" size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-value">{station.isOpen24Hours ? '24/7' : 'Limited'}</span>
              <span className="metric-label">Hours</span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="amenities-section">
          <h3 className="amenities-title">Amenities</h3>
          <div className="amenities-grid">
            {station.amenities.map((amenity, index) => (
              <div key={index} className="amenity-item">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            onClick={handleGetDirections}
            className="btn-secondary directions-button"
          >
            <Navigation size={20} />
            Get Directions
          </button>
          
          <button 
            onClick={onStartFueling}
            className="btn-primary fuel-button"
            disabled={station.status === 'closed'}
          >
            <Fuel size={20} />
            {station.status === 'closed' ? 'Closed' : 'Start Fueling'}
          </button>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <div className="info-item">
            <span className="info-label">Brand:</span>
            <span className="info-value">7-Eleven</span>
          </div>
          <div className="info-item">
            <span className="info-label">Fuel Types:</span>
            <span className="info-value">Regular, Premium, Diesel</span>
          </div>
          <div className="info-item">
            <span className="info-label">Diesel Price:</span>
            <span className="info-value">${station.dieselPrice}/gal</span>
          </div>
          <div className="info-item">
            <span className="info-label">Hours:</span>
            <span className="info-value">{station.isOpen24Hours ? '24/7' : '6 AM - 11 PM'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
