import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { apiService } from '@/services/api';
interface Bus {
  id: number;
  number: string;
  driver: string;
  currentStop: number;
  nextStop: number;
}

interface Stop {
  id: number;
  name: string;
}

export default function BusesScreen() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [busesdata , stopsdata] = await Promise.all([
        apiService.getAllBuses(),
        apiService.getAllStops()
      ]);
      setBuses(busesdata);
      setStops(stopsdata);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStopName = (stopId: number) => {
    return stops.find(stop => stop.id === stopId)?.name || 'Unknown Stop';
  };

  const renderBusItem = ({ item }: { item: Bus }) => (
    <TouchableOpacity style={styles.busCard}>
      <View style={styles.busHeader}>
        <Text style={styles.busNumber}>{item.number}</Text>
        <Text style={styles.driverName}>Driver: {item.driver}</Text>
      </View>
      <View style={styles.busInfo}>
        <Text style={styles.stopText}>
          Current Stop: {getStopName(item.currentStop)}
        </Text>
        <Text style={styles.stopText}>
          Next Stop: {getStopName(item.nextStop)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Buses</Text>
      <FlatList
        data={buses}
        renderItem={renderBusItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: '#000',
  },
  listContainer: {
    padding: 16,
  },
  busCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  busNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  driverName: {
    fontSize: 14,
    color: '#666',
  },
  busInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 8,
  },
  stopText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 2,
  },
});