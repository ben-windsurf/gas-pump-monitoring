/* eslint-disable @typescript-eslint/no-explicit-any */
import { initDB, saveDB } from './database';
import type { GasStation, UserTransaction, UserData, DBGasStation } from './types';

export class GasStationDAO {
  static async getAllStations(): Promise<GasStation[]> {
    const db = await initDB();
    const result = db.exec('SELECT * FROM gas_stations ORDER BY name');
    
    if (result.length === 0) return [];
    
    const rows = result[0].values.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      address: row[2],
      lat: row[3],
      lng: row[4],
      available_pumps: row[5],
      total_pumps: row[6],
      regular_price: row[7],
      premium_price: row[8],
      diesel_price: row[9],
      amenities: row[10],
      status: row[11],
      is_open_24_hours: row[12]
    })) as DBGasStation[];
    
    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      address: row.address,
      lat: row.lat,
      lng: row.lng,
      availablePumps: row.available_pumps,
      totalPumps: row.total_pumps,
      regularPrice: row.regular_price,
      premiumPrice: row.premium_price,
      dieselPrice: row.diesel_price,
      amenities: JSON.parse(row.amenities),
      status: row.status,
      isOpen24Hours: row.is_open_24_hours
    }));
  }

  static async getStationById(id: string): Promise<GasStation | null> {
    const db = await initDB();
    const result = db.exec('SELECT * FROM gas_stations WHERE id = ?', [id]);
    
    if (result.length === 0 || result[0].values.length === 0) return null;
    
    const rowData = result[0].values[0];
    const row = {
      id: rowData[0],
      name: rowData[1],
      address: rowData[2],
      lat: rowData[3],
      lng: rowData[4],
      available_pumps: rowData[5],
      total_pumps: rowData[6],
      regular_price: rowData[7],
      premium_price: rowData[8],
      diesel_price: rowData[9],
      amenities: rowData[10],
      status: rowData[11],
      is_open_24_hours: rowData[12]
    } as DBGasStation;
    
    return {
      id: row.id,
      name: row.name,
      address: row.address,
      lat: row.lat,
      lng: row.lng,
      availablePumps: row.available_pumps,
      totalPumps: row.total_pumps,
      regularPrice: row.regular_price,
      premiumPrice: row.premium_price,
      dieselPrice: row.diesel_price,
      amenities: JSON.parse(row.amenities),
      status: row.status,
      isOpen24Hours: row.is_open_24_hours
    };
  }

  static async updateStationPrices(id: string, prices: { regular?: number; premium?: number; diesel?: number }) {
    const db = await initDB();
    const updates: string[] = [];
    const values: (string | number)[] = [];
    
    if (prices.regular !== undefined) {
      updates.push('regular_price = ?');
      values.push(prices.regular);
    }
    if (prices.premium !== undefined) {
      updates.push('premium_price = ?');
      values.push(prices.premium);
    }
    if (prices.diesel !== undefined) {
      updates.push('diesel_price = ?');
      values.push(prices.diesel);
    }
    
    if (updates.length === 0) return;
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    db.run(`UPDATE gas_stations SET ${updates.join(', ')} WHERE id = ?`, values);
    saveDB();
  }

  static async updateStationAvailability(id: string, available: number) {
    const db = await initDB();
    db.run('UPDATE gas_stations SET available_pumps = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [available, id]);
    saveDB();
  }

  static async updateStationStatus(id: string, status: 'open' | 'busy' | 'closed') {
    const db = await initDB();
    db.run('UPDATE gas_stations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
    saveDB();
  }
}

export class UserTransactionDAO {
  static async getAllTransactions(): Promise<UserTransaction[]> {
    const db = await initDB();
    const result = db.exec(`
      SELECT ut.*, gs.name as station_name 
      FROM user_transactions ut 
      JOIN gas_stations gs ON ut.station_id = gs.id 
      ORDER BY ut.date DESC
    `);
    
    if (result.length === 0) return [];
    
    const rows = result[0].values.map((row: any[]) => ({
      id: row[0],
      station_id: row[1],
      date: row[2],
      fuel_type: row[3],
      gallons: row[4],
      cost: row[5],
      station_name: row[7]
    }));
    
    return rows.map((row: any) => ({
      id: row.id,
      station: row.station_name,
      date: row.date,
      fuelType: row.fuel_type,
      gallons: row.gallons,
      cost: row.cost
    }));
  }

  static async addTransaction(transaction: { station_id: string; date: string; fuelType: string; gallons: number; cost: number }) {
    const db = await initDB();
    const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    db.run(`
      INSERT INTO user_transactions (id, station_id, date, fuel_type, gallons, cost)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, transaction.station_id, transaction.date, transaction.fuelType, transaction.gallons, transaction.cost]);
    
    await this.updateUserStats();
    saveDB();
    return id;
  }

  static async getTransactionsByDateRange(start: string, end: string): Promise<UserTransaction[]> {
    const db = await initDB();
    const result = db.exec(`
      SELECT ut.*, gs.name as station_name 
      FROM user_transactions ut 
      JOIN gas_stations gs ON ut.station_id = gs.id 
      WHERE ut.date BETWEEN ? AND ? 
      ORDER BY ut.date DESC
    `, [start, end]);
    
    if (result.length === 0) return [];
    
    const rows = result[0].values.map((row: any[]) => ({
      id: row[0],
      station_id: row[1],
      date: row[2],
      fuel_type: row[3],
      gallons: row[4],
      cost: row[5],
      station_name: row[7]
    }));
    
    return rows.map((row: any) => ({
      id: row.id,
      station: row.station_name,
      date: row.date,
      fuelType: row.fuel_type,
      gallons: row.gallons,
      cost: row.cost
    }));
  }

  private static async updateUserStats() {
    const db = await initDB();
    
    const statsResult = db.exec(`
      SELECT 
        COUNT(*) as total_fill_ups,
        SUM(gallons) as total_gallons,
        SUM(cost) as total_cost,
        AVG(cost / gallons) as avg_price_per_gallon
      FROM user_transactions
    `);
    
    const stats = statsResult.length > 0 ? {
      total_fill_ups: statsResult[0].values[0][0] || 0,
      total_gallons: statsResult[0].values[0][1] || 0,
      total_cost: statsResult[0].values[0][2] || 0,
      avg_price_per_gallon: statsResult[0].values[0][3] || 0
    } : { total_fill_ups: 0, total_gallons: 0, total_cost: 0, avg_price_per_gallon: 0 };

    const favoriteResult = db.exec(`
      SELECT gs.name, COUNT(*) as visit_count
      FROM user_transactions ut
      JOIN gas_stations gs ON ut.station_id = gs.id
      GROUP BY ut.station_id, gs.name
      ORDER BY visit_count DESC
      LIMIT 1
    `);
    
    const favorite = favoriteResult.length > 0 && favoriteResult[0].values.length > 0 
      ? favoriteResult[0].values[0][0] 
      : '';

    db.run(`
      UPDATE user_data SET 
        total_fill_ups = ?,
        total_gallons = ?,
        total_cost = ?,
        avg_price_per_gallon = ?,
        favorite_station = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = '1'
    `, [
      stats.total_fill_ups,
      stats.total_gallons,
      stats.total_cost,
      stats.avg_price_per_gallon,
      favorite
    ]);
  }
}

export class UserDataDAO {
  static async getUserData(): Promise<UserData> {
    const db = await initDB();
    const result = db.exec('SELECT * FROM user_data WHERE id = ?', ['1']);
    
    if (result.length === 0 || result[0].values.length === 0) {
      throw new Error('User data not found');
    }
    
    const rowData = result[0].values[0];
    const row = {
      id: rowData[0],
      name: rowData[1],
      email: rowData[2],
      member_since: rowData[3],
      total_fill_ups: rowData[4],
      total_gallons: rowData[5],
      total_cost: rowData[6],
      avg_price_per_gallon: rowData[7],
      favorite_station: rowData[8]
    } as any;
    
    return {
      name: row.name,
      email: row.email,
      memberSince: row.member_since,
      totalFillUps: row.total_fill_ups,
      totalGallons: row.total_gallons,
      totalCost: row.total_cost,
      avgPricePerGallon: row.avg_price_per_gallon,
      favoriteStation: row.favorite_station
    };
  }

  static async updateUserProfile(data: Partial<Pick<UserData, 'name' | 'email'>>) {
    const db = await initDB();
    const updates: string[] = [];
    const values: (string | number)[] = [];
    
    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }
    
    if (updates.length === 0) return;
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push('1');
    
    db.run(`UPDATE user_data SET ${updates.join(', ')} WHERE id = ?`, values);
    saveDB();
  }
}
