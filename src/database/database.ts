/* eslint-disable @typescript-eslint/no-explicit-any */
import initSqlJs from 'sql.js';
import type { DBGasStation, DBUserTransaction, DBUserData } from './types';

let SQL: any = null;
let db: any = null;

async function initDB() {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });
  }
  
  if (!db) {
    const savedDb = localStorage.getItem('gas-stations-db');
    if (savedDb) {
      const uint8Array = new Uint8Array(JSON.parse(savedDb));
      db = new SQL.Database(uint8Array);
    } else {
      db = new SQL.Database();
    }
  }
  
  return db;
}

function saveDB() {
  if (db) {
    const data = db.export();
    localStorage.setItem('gas-stations-db', JSON.stringify(Array.from(data)));
  }
}

export { initDB, saveDB };

export async function initializeDatabase() {
  try {
    const database = await initDB();
    createTables(database);
    seedData(database);
    saveDB();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

function createTables(database: any) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS gas_stations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      available_pumps INTEGER NOT NULL,
      total_pumps INTEGER NOT NULL,
      regular_price REAL NOT NULL,
      premium_price REAL NOT NULL,
      diesel_price REAL NOT NULL,
      amenities TEXT NOT NULL,
      status TEXT CHECK(status IN ('open', 'busy', 'closed')) NOT NULL,
      is_open_24_hours BOOLEAN NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_transactions (
      id TEXT PRIMARY KEY,
      station_id TEXT NOT NULL,
      date TEXT NOT NULL,
      fuel_type TEXT NOT NULL,
      gallons REAL NOT NULL,
      cost REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (station_id) REFERENCES gas_stations (id)
    );

    CREATE TABLE IF NOT EXISTS user_data (
      id TEXT PRIMARY KEY DEFAULT '1',
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      member_since TEXT NOT NULL,
      total_fill_ups INTEGER NOT NULL DEFAULT 0,
      total_gallons REAL NOT NULL DEFAULT 0,
      total_cost REAL NOT NULL DEFAULT 0,
      avg_price_per_gallon REAL NOT NULL DEFAULT 0,
      favorite_station TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_station_id ON user_transactions(station_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON user_transactions(date);
  `);
}

function seedData(database: any) {
  const stationCountResult = database.exec('SELECT COUNT(*) as count FROM gas_stations');
  const stationCount = stationCountResult.length > 0 ? stationCountResult[0].values[0][0] : 0;
  
  if (stationCount === 0) {
    const mockStations: Omit<DBGasStation, 'created_at' | 'updated_at'>[] = [
      {
        id: '1',
        name: '7-Eleven Downtown',
        address: '123 Main St, Miami, FL',
        lat: 25.7617,
        lng: -80.1918,
        available_pumps: 6,
        total_pumps: 8,
        regular_price: 3.45,
        premium_price: 3.75,
        diesel_price: 3.89,
        amenities: JSON.stringify(['Slurpee', 'Hot Food', 'ATM', 'Restroom']),
        status: 'open',
        is_open_24_hours: true
      },
      {
        id: '2',
        name: '7-Eleven Airport',
        address: '2100 NW 42nd Ave, Miami, FL',
        lat: 25.7959,
        lng: -80.2870,
        available_pumps: 2,
        total_pumps: 10,
        regular_price: 3.52,
        premium_price: 3.82,
        diesel_price: 3.95,
        amenities: JSON.stringify(['Big Bite', 'Coffee', 'Lottery']),
        status: 'busy',
        is_open_24_hours: true
      },
      {
        id: '3',
        name: '7-Eleven Beach',
        address: '1701 Collins Ave, Miami Beach, FL',
        lat: 25.7907,
        lng: -80.1300,
        available_pumps: 4,
        total_pumps: 6,
        regular_price: 3.48,
        premium_price: 3.78,
        diesel_price: 3.92,
        amenities: JSON.stringify(['Slurpee', 'Snacks', 'Ice']),
        status: 'open',
        is_open_24_hours: false
      }
    ];

    for (const station of mockStations) {
      database.run(`
        INSERT INTO gas_stations (
          id, name, address, lat, lng, available_pumps, total_pumps,
          regular_price, premium_price, diesel_price, amenities, status, is_open_24_hours
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        station.id, station.name, station.address, station.lat, station.lng,
        station.available_pumps, station.total_pumps, station.regular_price,
        station.premium_price, station.diesel_price, station.amenities,
        station.status, station.is_open_24_hours
      ]);
    }

    const mockTransactions: Omit<DBUserTransaction, 'created_at'>[] = [
      {
        id: '1',
        station_id: '1',
        date: '2024-08-20',
        fuel_type: 'Regular',
        gallons: 12.5,
        cost: 43.13
      },
      {
        id: '2',
        station_id: '3',
        date: '2024-08-18',
        fuel_type: 'Premium',
        gallons: 11.8,
        cost: 44.60
      },
      {
        id: '3',
        station_id: '2',
        date: '2024-08-15',
        fuel_type: 'Regular',
        gallons: 13.2,
        cost: 46.46
      }
    ];

    for (const transaction of mockTransactions) {
      database.run(`
        INSERT INTO user_transactions (id, station_id, date, fuel_type, gallons, cost)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        transaction.id, transaction.station_id, transaction.date,
        transaction.fuel_type, transaction.gallons, transaction.cost
      ]);
    }

    const mockUserData: Omit<DBUserData, 'updated_at'> = {
      id: '1',
      name: 'Ben Lehrburger',
      email: 'ben.lehrburger@windsurf.com',
      member_since: 'January 2024',
      total_fill_ups: 47,
      total_gallons: 125.5,
      total_cost: 437.50,
      avg_price_per_gallon: 3.48,
      favorite_station: '7-Eleven Downtown'
    };

    database.run(`
      INSERT INTO user_data (id, name, email, member_since, total_fill_ups, total_gallons, total_cost, avg_price_per_gallon, favorite_station)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      mockUserData.id, mockUserData.name, mockUserData.email, mockUserData.member_since,
      mockUserData.total_fill_ups, mockUserData.total_gallons, mockUserData.total_cost,
      mockUserData.avg_price_per_gallon, mockUserData.favorite_station
    ]);
  }
}
