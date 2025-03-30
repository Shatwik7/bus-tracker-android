import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '@/utils/api';
import type { Bus, Stop } from '@/types/api';

export default function DriverScreen() {
  const router = useRouter();
  const [bus, setBus] = useState<Bus | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [currentPassengers, setCurrentPassengers] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [busData, stopsData] = await Promise.all([
        apiService.getDriverBus(),
        apiService.getAllStops(),
      ]);
      setBus(busData);
      setStops(stopsData);
      if(busData && busData.currentPassengers){
        setCurrentPassengers(busData.currentPassengers.toString());
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = async (stopId: number) => {
    try {
      if (!bus) return;
      const updatedBus = await apiService.updateBusLocation(bus.nextStop, stopId, parseInt(currentPassengers));
      setBus(updatedBus.bus);
      Alert.alert('Success', 'Location updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update location');
    }
  };

  const handleLogout = () => {
    apiService.clearToken();
    router.replace('/');
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData().finally(() => setRefreshing(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!bus) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No bus assigned</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Driver Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.busInfo}>
        <Text style={styles.busNumber}>{bus.number}</Text>
        <Text style={[styles.status]}>{bus.status?.replace('_', ' ') || 'Unknown Status'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Passengers</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={currentPassengers}
          onChangeText={setCurrentPassengers}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Stop</Text>
        <Text style={styles.stopName}>{stops.find(s => s.id === bus.currentStop)?.name || 'Unknown'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Next Stop</Text>
        <Text style={styles.stopName}>{stops.find(s => s.id === bus.nextStop)?.name || 'Unknown'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Next Stop</Text>
        <View style={styles.stopsList}>
          {stops.map(stop => (
            <TouchableOpacity
              key={stop.id}
              style={[styles.stopButton, bus.nextStop === stop.id && styles.activeStop]}
              onPress={() => handleUpdateLocation(stop.id)}>
              <Text style={[styles.stopButtonText, bus.nextStop === stop.id && styles.activeStopText]}>
                {stop.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  status: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  busNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
  },
  busInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  section: {
    backgroundColor: 'white',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  stopName: {
    fontSize: 18,
    fontWeight: '500',
  },
  stopsList: {
    gap: 8,
  },
  stopButton: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
  },
  activeStop: {
    backgroundColor: '#2563EB',
  },
  stopButtonText: {
    fontSize: 16,
    color: '#475569',
  },
  activeStopText: {
    color: 'white',
    fontWeight: '500',
  },
  error: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
});
