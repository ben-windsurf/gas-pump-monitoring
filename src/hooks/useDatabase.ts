import { useState, useEffect } from 'react';
import { GasStationDAO, UserTransactionDAO, UserDataDAO } from '../database/dao';
import type { GasStation, UserTransaction, UserData } from '../database/types';

export function useGasStations() {
  const [stations, setStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const refreshStations = async () => {
    try {
      const stationsData = await GasStationDAO.getAllStations();
      setStations(stationsData);
    } catch (error) {
      console.error('Error loading stations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStations();
  }, []);

  return { stations, loading, refreshStations };
}

export function useUserTransactions() {
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const refreshTransactions = async () => {
    try {
      const transactionsData = await UserTransactionDAO.getAllTransactions();
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: { station_id: string; date: string; fuelType: string; gallons: number; cost: number }) => {
    try {
      await UserTransactionDAO.addTransaction(transaction);
      await refreshTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  useEffect(() => {
    refreshTransactions();
  }, []);

  return { transactions, loading, refreshTransactions, addTransaction };
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const refreshUserData = async () => {
    try {
      const data = await UserDataDAO.getUserData();
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  return { userData, loading, refreshUserData };
}
