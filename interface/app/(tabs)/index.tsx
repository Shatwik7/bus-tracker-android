import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '@/utils/api';
import type { Bus } from '@/types/api';

export default function BusesScreen() {
  const router = useRouter();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      const data = await apiService.getAllBuses();
      setBuses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBusPress = (busId: number) => {
    router.push(`/bus/${busId}`);
  };

  const renderBusCard = ({ item: bus }: { item: Bus }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleBusPress(bus.id)}>
      <View style={styles.cardHeader}>
        <Text style={styles.busNumber}>{bus.number}</Text>
        <Text style={[styles.status, styles[bus.status.toLowerCase() as 'on_route' | 'stopped' | 'out_of_service']]}>
          {bus.status.replace('_', ' ')}
        </Text>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Driver:</Text>
          <Text style={styles.value}>{bus.driver}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Passengers:</Text>
          <Text style={styles.value}>{bus.currentPassengers}/{bus.capacity}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Last Updated:</Text>
          <Text style={styles.value}>
            {new Date(bus.lastUpdated).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading buses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Buses</Text>
      <FlatList
        data={buses}
        renderItem={renderBusCard}
        keyExtractor={bus => bus.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  list: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  busNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '600',
  },
  'on_route': {
    backgroundColor: '#DCF2E5',
    color: '#16A34A',
  },
  'stopped': {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
  },
  'out_of_service': {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#64748B',
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
});