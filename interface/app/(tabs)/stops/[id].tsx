import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { 
  View, Text, ActivityIndicator, TouchableOpacity, FlatList, StyleSheet, Dimensions 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Stop, Bus } from '@/types/api';
import { apiService } from '@/utils/api';

export default function StopDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [stop, setStop] = useState<Stop | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStopData = async () => {
      try {
        console.log("Fetching stops...");
        const stops = await apiService.getAllStops();
        console.log("Stops received:", stops);
        
        const stopDetails = stops.find((s) => s.id === Number(id));
        if (stopDetails) {
          setStop(stopDetails);
          console.log("Fetching next bus for stop:", stopDetails.id);
          
          const nextBus = await apiService.getNextBusAtStop(stopDetails.id);
          console.log("Next bus received:", nextBus);
          
          setBuses(nextBus ? [nextBus] : []);
        }
      } catch (error) {
        console.error('Error fetching stop data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStopData();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
  }

  if (!stop) {
    return <Text style={styles.errorText}>Stop not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.stopName}>{stop.name}</Text>
      <Text style={styles.details}>📍 Address: {stop.address}</Text>
      <Text style={styles.details}>🛠 Facilities: {stop.facilities?.join(', ') || 'None'}</Text>

      {/* MapView to Show Stop Location */}
      {stop.latitude && stop.longitude ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: stop.latitude,
            longitude: stop.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: stop.latitude,
              longitude: stop.longitude,
            }}
            title={stop.name}
            description={stop.address}
          />
        </MapView>
      ) : (
        <Text style={styles.noMapText}>📌 Location not available.</Text>
      )}

      <Text style={styles.subHeader}>🚍 Arriving Buses:</Text>
      {buses.length > 0 ? (
        <FlatList
          data={buses}
          keyExtractor={(bus) => (bus?.id ? bus.id.toString() : Math.random().toString())}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.busCard}
              onPress={() => router.push(`/bus/${item.id}`)}
            >
              <Text style={styles.busNumber}>🚌 Bus Number: {item.number || 'N/A'}</Text>
              <Text style={styles.busStatus}>📌 Status: {item.status || 'Unknown'}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noBusesContainer}>
          <Text style={styles.sorryBig}>😞 SORRY!</Text>
          <Text style={styles.noBusText}>No buses are arriving soon.</Text>
          <Text style={styles.waitText}>Please check again later.</Text>
        </View>
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  stopName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#007AFF',
  },
  map: {
    width: width - 40,
    height: 200,
    borderRadius: 10,
    marginVertical: 15,
  },
  busCard: {
    padding: 15,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  busNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  busStatus: {
    fontSize: 16,
    color: '#666',
  },
  noBusesContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  sorryBig: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FF3B30',
    textAlign: 'center',
  },
  noBusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  waitText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  noMapText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#FF3B30',
    marginTop: 20,
  },
});
