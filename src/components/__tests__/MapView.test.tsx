import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MapView from '../MapView'

// Mock mapbox-gl
vi.mock('mapbox-gl', () => ({
  default: {
    accessToken: '',
    Map: vi.fn(() => ({
      addControl: vi.fn(),
      flyTo: vi.fn(),
      remove: vi.fn(),
    })),
    NavigationControl: vi.fn(),
    Marker: vi.fn(() => ({
      setLngLat: vi.fn().mockReturnThis(),
      setPopup: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
    })),
    Popup: vi.fn(() => ({
      setHTML: vi.fn().mockReturnThis(),
    })),
  },
}))

// Mock CSS imports
vi.mock('mapbox-gl/dist/mapbox-gl.css', () => ({}))

// Mock environment variables
vi.mock('import.meta', () => ({
  env: {
    VITE_MAPBOX_ACCESS_TOKEN: 'test-token',
  },
}))

// Mock geolocation
Object.defineProperty(globalThis, 'navigator', {
  value: {
    geolocation: {
      getCurrentPosition: vi.fn(),
    },
  },
  writable: true,
})

// Mock data for testing
const mockStations = [
  {
    id: '1',
    name: 'Downtown Shell',
    address: '123 Main St',
    lat: 25.7617,
    lng: -80.1918,
    availablePumps: 3,
    totalPumps: 4,
    regularPrice: 3.25,
    premiumPrice: 3.55,
    dieselPrice: 3.45,
    amenities: ['WiFi', 'Restaurant', 'Shopping'],
    status: 'open' as const,
    isOpen24Hours: true,
  },
  {
    id: '2',
    name: 'Airport Exxon',
    address: '456 Airport Rd',
    lat: 25.7900,
    lng: -80.2900,
    availablePumps: 0,
    totalPumps: 6,
    regularPrice: 3.30,
    premiumPrice: 3.60,
    dieselPrice: 3.50,
    amenities: ['WiFi', 'Parking'],
    status: 'busy' as const,
    isOpen24Hours: false,
  },
  {
    id: '3',
    name: 'Mall BP Station',
    address: '789 Shopping Blvd',
    lat: 25.7500,
    lng: -80.1500,
    availablePumps: 0,
    totalPumps: 8,
    regularPrice: 3.28,
    premiumPrice: 3.58,
    dieselPrice: 3.48,
    amenities: ['Food Court', 'Shopping', 'Restrooms', 'ATM'],
    status: 'closed' as const,
    isOpen24Hours: false,
  },
]

const mockProps = {
  stations: mockStations,
  onStationSelect: vi.fn(),
  isFueling: false,
}

describe('MapView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the component with all main sections', () => {
    render(<MapView {...mockProps} />)
    
    // Check for main sections
    expect(screen.getByPlaceholderText('Search for gas stations...')).toBeInTheDocument()
    expect(screen.getByText('Nearby Gas Stations')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    
    // Check that station cards are rendered
    expect(screen.getByText('Downtown Shell')).toBeInTheDocument()
    expect(screen.getByText('Airport Exxon')).toBeInTheDocument()
    expect(screen.getByText('Mall BP Station')).toBeInTheDocument()
  })

  it('displays fueling banner when isFueling is true', () => {
    render(<MapView {...mockProps} isFueling={true} />)
    
    expect(screen.getByText('Currently fueling at 7-Eleven Downtown')).toBeInTheDocument()
    expect(screen.getByText('Pump #3 • $45.67 total')).toBeInTheDocument()
  })

  it('does not display fueling banner when isFueling is false', () => {
    render(<MapView {...mockProps} isFueling={false} />)
    
    expect(screen.queryByText('Currently fueling at 7-Eleven Downtown')).not.toBeInTheDocument()
    expect(screen.queryByText('Pump #3 • $45.67 total')).not.toBeInTheDocument()
  })

  it('filters stations based on search query', async () => {
    const user = userEvent.setup()
    render(<MapView {...mockProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search for gas stations...')
    
    // Initially all stations should be visible
    expect(screen.getByText('Downtown Shell')).toBeInTheDocument()
    expect(screen.getByText('Airport Exxon')).toBeInTheDocument()
    expect(screen.getByText('Mall BP Station')).toBeInTheDocument()
    
    // Search for "Downtown"
    await user.type(searchInput, 'Downtown')
    
    // Only Downtown Shell should be visible
    expect(screen.getByText('Downtown Shell')).toBeInTheDocument()
    expect(screen.queryByText('Airport Exxon')).not.toBeInTheDocument()
    expect(screen.queryByText('Mall BP Station')).not.toBeInTheDocument()
  })

  it('filters stations based on address in search query', async () => {
    const user = userEvent.setup()
    render(<MapView {...mockProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search for gas stations...')
    
    // Search for "Airport Rd"
    await user.type(searchInput, 'Airport Rd')
    
    // Only Airport Exxon should be visible
    expect(screen.queryByText('Downtown Shell')).not.toBeInTheDocument()
    expect(screen.getByText('Airport Exxon')).toBeInTheDocument()
    expect(screen.queryByText('Mall BP Station')).toBeInTheDocument()
  })

  it('calls onStationSelect when station card is clicked', async () => {
    const user = userEvent.setup()
    render(<MapView {...mockProps} />)
    
    const stationCard = screen.getByText('Downtown Shell').closest('.station-card')
    expect(stationCard).toBeInTheDocument()
    
    await user.click(stationCard!)
    
    expect(mockProps.onStationSelect).toHaveBeenCalledWith(mockStations[0])
    expect(mockProps.onStationSelect).toHaveBeenCalledTimes(1)
  })

  it('displays correct status colors and text for different station statuses', () => {
    render(<MapView {...mockProps} />)
    
    // Check open station (green)
    const openStatus = screen.getByText('Open')
    expect(openStatus).toHaveClass('text-green-600')
    
    // Check busy station (orange)
    const busyStatus = screen.getByText('Busy')
    expect(busyStatus).toHaveClass('text-orange-500')
    
    // Check closed station (red)
    const closedStatus = screen.getByText('Closed')
    expect(closedStatus).toHaveClass('text-red-500')
  })

  it('displays station information correctly including availability and amenities', () => {
    render(<MapView {...mockProps} />)
    
    // Check Downtown Shell details
    expect(screen.getByText('123 Main St')).toBeInTheDocument()
    expect(screen.getByText('3/4')).toBeInTheDocument()
    expect(screen.getAllByText('pumps available')).toHaveLength(3) // All stations have this text
    expect(screen.getByText('$3.25/gal')).toBeInTheDocument()
    
    // Check specific amenities that are unique to stations
    expect(screen.getByText('Restaurant')).toBeInTheDocument() // Only Downtown Shell
    expect(screen.getByText('Food Court')).toBeInTheDocument() // Only Mall BP Station
    expect(screen.getByText('Parking')).toBeInTheDocument() // Only Airport Exxon
    
    // Check Mall BP Station with more than 3 amenities
    const moreAmenitiesText = screen.getByText('+1 more')
    expect(moreAmenitiesText).toBeInTheDocument()
  })
})
