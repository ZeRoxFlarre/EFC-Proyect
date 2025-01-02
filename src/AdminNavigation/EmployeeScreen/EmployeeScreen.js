import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native';

const AdminScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (route.params && route.params.id) {
      fetchEmployeeInfo(route.params.id);
    }
  }, [route.params]);

  const fetchEmployeeInfo = async (id) => {
    try {
      const response = await fetch(`http://172.20.10.3:3000/api/EFC_client/getEmployee/${id}`);
      const data = await response.json();
      if (response.ok) {
        setEmployeeInfo(data);
      } else {
        console.error('Error fetching employee:', data.message);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToScannerScreen = () => {
    navigation.navigate('ScannerQR');
  };

  const goToAccountClients = () => {
    if (route.params && route.params.id) {
      navigation.navigate('AccountClients', { id: route.params.id });
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="settings" size={100} color="#3B71F3" style={styles.icon} />
      <Text style={styles.title}>Employee Panel</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : employeeInfo ? (
        <View style={styles.employeeInfoContainer}>
          <Text style={styles.employeeName}>ID: {employeeInfo.id}</Text>
          <Text style={styles.employeeName}>Employee: {employeeInfo.first_name} {employeeInfo.last_name}</Text>
        </View>
      ) : (
        <Text>No employee found</Text>
      )}
      <View style={styles.buttonContainer}>
        <CustomButton onPress={goToAccountClients} text="Student Account" type="PRIMARY" />
        <CustomButton onPress={goToScannerScreen} text="Scanner" type="PRIMARY" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  icon: {
    marginBottom: 50,
  },
  employeeInfoContainer: {
    position: 'absolute',
    top: 50,
    left: 5,
    padding: 10,
  },
  employeeName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default AdminScreen;
