import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { apiService } from '@/services/api';

export default function DriverScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [busDetails, setBusDetails] = useState<any>(null);
  
  const handleLogin = async () => {
    try {
      const response =await apiService.login( email,password);
      await fetchBusDetails();
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  const fetchBusDetails = async () => {
    try {
      const data = await apiService.getDriverBus();
      setBusDetails(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bus details');
    }
  };

  if (!token) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Driver Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Details</Text>
      {busDetails && (
        <View style={styles.busDetails}>
          <Text style={styles.busInfo}>Bus Number: {busDetails.number}</Text>
          <Text style={styles.busInfo}>Driver: {busDetails.driver}</Text>
          <Text style={styles.busInfo}>Current Stop: {busDetails.currentStop}</Text>
          <Text style={styles.busInfo}>Next Stop: {busDetails.nextStop}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  busDetails: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busInfo: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
});