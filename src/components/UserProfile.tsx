import { ArrowLeft, User, Fuel, Clock, DollarSign, TrendingUp, Settings, CreditCard } from 'lucide-react'

interface UserProfileProps {
  onBack: () => void
}

export default function UserProfile({ onBack }: UserProfileProps) {
  // User data
  const userData = {
    name: 'Ben Lehrburger',
    email: 'ben.lehrburger@windsurf.com',
    memberSince: 'January 2024',
    totalFillUps: 47,
    totalGallons: 125.5, // gallons
    totalCost: 437.50,
    avgPricePerGallon: 3.48,
    favoriteStation: '7-Eleven Downtown'
  }

  const recentFillUps = [
    {
      id: '1',
      station: '7-Eleven Downtown',
      date: '2024-08-20',
      fuelType: 'Regular',
      gallons: 12.5,
      cost: 43.13
    },
    {
      id: '2',
      station: '7-Eleven Beach',
      date: '2024-08-18',
      fuelType: 'Premium',
      gallons: 11.8,
      cost: 44.60
    },
    {
      id: '3',
      station: '7-Eleven Airport',
      date: '2024-08-15',
      fuelType: 'Regular',
      gallons: 13.2,
      cost: 46.46
    }
  ]

  return (
    <div className="user-profile">
      {/* Header */}
      <div className="profile-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
        </button>
        <h2 className="profile-title">Profile</h2>
        <button className="settings-button">
          <Settings size={20} />
        </button>
      </div>

      {/* User Info Card */}
      <div className="profile-card">
        <div className="user-avatar">
          <User size={48} className="text-gray-400" />
        </div>
        <div className="user-info">
          <h3 className="user-name">{userData.name}</h3>
          <p className="user-email">{userData.email}</p>
          <p className="member-since">Member since {userData.memberSince}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Fuel className="text-red-600" size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{userData.totalFillUps}</span>
            <span className="stat-label">Fill-ups</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{userData.totalGallons}</span>
            <span className="stat-label">Gallons Purchased</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign className="text-orange-500" size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">${userData.totalCost}</span>
            <span className="stat-label">Total Spent</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock className="text-purple-600" size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">${userData.avgPricePerGallon}</span>
            <span className="stat-label">Avg Price/Gal</span>
          </div>
        </div>
      </div>

      {/* Recent Fill-ups */}
      <div className="recent-sessions">
        <h3 className="section-title">Recent Fill-ups</h3>
        <div className="sessions-list">
          {recentFillUps.map((fillup) => (
            <div key={fillup.id} className="session-card">
              <div className="session-header">
                <h4 className="session-station">{fillup.station}</h4>
                <span className="session-date">{fillup.date}</span>
              </div>
              <div className="session-details">
                <div className="session-metric">
                  <Fuel size={16} className="text-red-600" />
                  <span>{fillup.fuelType}</span>
                </div>
                <div className="session-metric">
                  <TrendingUp size={16} className="text-blue-600" />
                  <span>{fillup.gallons} gal</span>
                </div>
                <div className="session-metric">
                  <DollarSign size={16} className="text-green-600" />
                  <span>${fillup.cost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className="account-actions">
        <button className="action-button">
          <CreditCard size={20} />
          <span>Payment Methods</span>
        </button>
        <button className="action-button">
          <Settings size={20} />
          <span>Account Settings</span>
        </button>
        <button className="action-button">
          <TrendingUp size={20} />
          <span>Usage Reports</span>
        </button>
      </div>

      {/* Favorite Station */}
      <div className="favorite-station">
        <h3 className="section-title">Favorite Station</h3>
        <div className="favorite-card">
          <Fuel className="text-red-600" size={24} />
          <div>
            <h4>{userData.favoriteStation}</h4>
            <p className="text-gray-600">Most frequently used station</p>
          </div>
        </div>
      </div>
    </div>
  )
}
