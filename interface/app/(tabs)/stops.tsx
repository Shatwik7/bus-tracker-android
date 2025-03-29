import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { apiService } from '@/utils/api';
import type { Stop } from '@/types/api';
import { router } from 'expo-router';

export default function StopsScreen() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStops();
  }, []);

  const loadStops = async () => {
    try {
      const data = await apiService.getAllStops();
      setStops(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleStopsPress = (stopId: number) => {
    router.push(`/stops/${stopId}`);
  };
  const renderStopCard = ({ item: stop }: { item: Stop }) => (
    <View style={styles.card} >
      <Text style={styles.stopName} onPress={() => handleStopsPress(stop.id)}>{stop.name}</Text>
      <Text style={styles.address}>{stop.address}</Text>
      
      <View style={styles.facilitiesContainer}>
        {stop.facilities.map((facility, index) => (
          <View key={index} style={styles.facilityTag}>
            <Text style={styles.facilityText}>{facility}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.busLinesContainer}>
        <Text style={styles.sectionTitle}>Bus Lines:</Text>
        <View style={styles.busLinesList}>
          {stop.busLines.map((line, index) => (
            <View key={index} style={styles.busLineTag}>
              <Text style={styles.busLineText}>{line}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading stops...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Stops</Text>
      <FlatList
        data={stops}
        renderItem={renderStopCard}
        keyExtractor={stop => stop.id.toString()}
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
  stopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  address: {
    color: '#64748B',
    marginBottom: 12,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  facilityTag: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  facilityText: {
    color: '#475569',
    fontSize: 12,
  },
  busLinesContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  busLinesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  busLineTag: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  busLineText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '500',
  },
});