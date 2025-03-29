import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiService } from '@/utils/api';
import type { Bus, Stop, BusRoute } from '@/types/api';
import { MapPin, Clock, Route, Users } from 'lucide-react-native';

export default function BusDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bus, setBus] = useState<Bus | null>(null);
  const [route, setRoute] = useState<BusRoute | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPassengers, setCurrentPassengers] = useState('');
  const [selectedStop, setSelectedStop] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadBusDetails();
  }, [id]);

  const loadBusDetails = async () => {
    try {
      const [busData, routeData, stopsData] = await Promise.all([
        apiService.getBusById(Number(id)),
        apiService.getBusRoute(Number(id)),
        apiService.getAllStops(),
      ]);
      setBus(busData);
      setRoute(routeData);
      setStops(stopsData);
      setCurrentPassengers(String(busData.currentPassengers));
      setSelectedStop(busData.nextStop);
    } catch (err) {
      setError('Failed to load bus details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBus = async () => {
    if (!bus || !selectedStop) return;
    
    try {
      setUpdating(true);
      const updatedBus = await apiService.updateBusLocation(
        bus.currentStop,
        selectedStop,
        parseInt(currentPassengers)
      );
      setBus(updatedBus.bus);
      router.back();
    } catch (err) {
      setError('Failed to update bus');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading bus details...</Text>
      </View>
    );
  }

  if (error || !bus || !route) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error || 'Bus not found'}</Text>
      </View>
    );
  }

  const currentStop = stops.find(s => s.id === bus.currentStop);
  const nextStop = stops.find(s => s.id === bus.nextStop);
  const routeStops = stops.filter(stop => route.stops.includes(stop.id));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.busNumber}>{bus.number}</Text>
          <Text style={[styles.status]}>
            {bus.status.replace('_', ' ')}
          </Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            {bus.currentPassengers}/{bus.capacity} passengers
          </Text>
        </View>
      </View>

      {/* Driver Update Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Bus Information</Text>
        
        <View style={styles.formGroup}>
          <View style={styles.inputGroup}>
            <Users size={20} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="Current Passengers"
              value={currentPassengers}
              onChangeText={setCurrentPassengers}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>

        <Text style={styles.label}>Select Next Stop:</Text>
        <View style={styles.stopsList}>
          {routeStops.map(stop => (
            <TouchableOpacity
              key={stop.id}
              style={[
                styles.stopButton,
                selectedStop === stop.id && styles.selectedStop,
              ]}
              onPress={() => setSelectedStop(stop.id)}>
              <Text
                style={[
                  styles.stopButtonText,
                  selectedStop === stop.id && styles.selectedStopText,
                ]}>
                {stop.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.updateButton, updating && styles.updatingButton]}
          onPress={handleUpdateBus}
          disabled={updating}>
          <Text style={styles.updateButtonText}>
            {updating ? 'Updating...' : 'Update Bus'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.currentLocation}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color="#64748B" />
            <Text style={styles.sectionTitle}>Current Location</Text>
          </View>
          <Text style={styles.stopName}>{currentStop?.name}</Text>
          <Text style={styles.address}>{currentStop?.address}</Text>
        </View>

        <View style={styles.nextStop}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Next Stop</Text>
          </View>
          <Text style={styles.stopName}>{nextStop?.name}</Text>
          <Text style={styles.address}>{nextStop?.address}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.routeHeader}>
          <Route size={20} color="#64748B" />
          <Text style={styles.sectionTitle}>Route Information</Text>
        </View>
        <View style={styles.routeInfo}>
          <View style={styles.routeDetail}>
            <Clock size={16} color="#64748B" />
            <Text style={styles.routeText}>
              {route.estimatedDuration} mins total duration
            </Text>
          </View>
          <Text style={styles.routeText}>
            {route.distance} km total distance
          </Text>
          <Text style={styles.routeText}>
            Every {route.frequency} mins frequency
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Stops</Text>
        <View style={styles.timeline}>
          {routeStops.map((stop, index) => (
            <View
              key={stop.id}
              style={[
                styles.timelineItem,
                index === routeStops.length - 1 && styles.lastTimelineItem,
              ]}>
              <View
                style={[
                  styles.timelineDot,
                  bus.currentStop === stop.id && styles.currentDot,
                  bus.nextStop === stop.id && styles.nextDot,
                ]}
              />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>{stop.name}</Text>
                <Text style={styles.timelineSubtitle}>{stop.address}</Text>
                {stop.facilities.length > 0 && (
                  <View style={styles.facilitiesContainer}>
                    {stop.facilities.map((facility, i) => (
                      <View key={i} style={styles.facilityTag}>
                        <Text style={styles.facilityText}>{facility}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  nextStop: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  busNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '600',
    alignSelf: 'flex-start',
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
  stats: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 8,
  },
  statsText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  stopsList: {
    gap: 8,
    marginBottom: 16,
  },
  stopButton: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
  },
  selectedStop: {
    backgroundColor: '#2563EB',
  },
  stopButtonText: {
    fontSize: 16,
    color: '#475569',
  },
  selectedStopText: {
    color: 'white',
    fontWeight: '500',
  },
  updateButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  updatingButton: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  currentLocation: {
    marginBottom: 16,
  },
  stopName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  address: {
    color: '#64748B',
    fontSize: 14,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  routeInfo: {
    gap: 8,
  },
  routeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    color: '#475569',
    fontSize: 14,
  },
  timeline: {
    marginTop: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingBottom: 24,
    position: 'relative',
  },
  lastTimelineItem: {
    paddingBottom: 0,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#CBD5E1',
    marginRight: 16,
    marginTop: 6,
  },
  currentDot: {
    backgroundColor: '#16A34A',
    width: 16,
    height: 16,
    marginRight: 14,
    marginTop: 4,
  },
  nextDot: {
    backgroundColor: '#2563EB',
    width: 16,
    height: 16,
    marginRight: 14,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  timelineSubtitle: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 8,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  error: {
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 20,
  },
});