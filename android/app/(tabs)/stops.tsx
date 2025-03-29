import { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Platform } from 'react-native';
import { apiService } from '@/services/api';

interface Stop {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function StopsScreen() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const data = await apiService.getAllStops();
        setStops(data);
      } catch (error) {
        console.error('Error fetching stops:', error);
      }
    };

    fetchStops();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadMapComponent = async () => {
      if (Platform.OS !== 'web') {
        try {
          const module = await import('react-native-maps');
          if (isMounted) {
            setMapComponent({
              MapView: module.default,
              Marker: module.Marker,
            });
          }
        } catch (error) {
          console.error('Error loading map component:', error);
        }
      }
    };

    loadMapComponent();

    return () => {
      isMounted = false;
    };
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <Text style={styles.title}>Bus Stops</Text>
        <View style={styles.stopsGrid}>
          {stops.map((stop) => (
            <View key={stop.id} style={styles.stopCard}>
              <Text style={styles.stopName}>{stop.name}</Text>
              <Text style={styles.stopDetails}>
                Location: {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
              </Text>
              <Text style={styles.stopId}>Stop ID: {stop.id}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (!MapComponent) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  const { MapView, Marker } = MapComponent;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.7128,
          longitude: -74.0060,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {stops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.latitude,
              longitude: stop.longitude,
            }}
            title={stop.name}
            description={`Stop ID: ${stop.id}`}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  stopsGrid: {
    display: 'grid' as any,
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 20,
    padding: 10,
  },
  stopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    transition: '0.3s all ease' as any,
  },
  stopName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#007AFF',
  },
  stopDetails: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 8,
    lineHeight: 22,
  },
  stopId: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});