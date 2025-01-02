import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

const AdminScreen = () => {
  const navigation = useNavigation();

  const goToScannerScreen = () => {
    navigation.navigate('ScannerQR');
  };

  const goToAccountClients = () => {
    navigation.navigate('AccountClients');
  };

  const RegistrationReport = () => {
    navigation.navigate('RegistrationReport');
  };

  const EditTools = () => {
    navigation.navigate('EditTools');
  };

  const createEmployee = () => {
    navigation.navigate('EmployeeEditScreen'); // Navegar a la pantalla de edición de empleados
  };

  return (
    <View style={styles.container}>
      <Icon name="settings" size={100} color="#3B71F3" style={styles.icon} />
      <Text style={styles.title}>Admin Panel</Text>
      <View style={styles.buttonContainer}>
        <CustomButton onPress={EditTools} text="Edit Tool" type="PRIMARY" />
        <CustomButton onPress={goToAccountClients} text="Student Account" type="PRIMARY" />
        <CustomButton onPress={createEmployee} text="Employee Account" type="PRIMARY" /> 
        <CustomButton onPress={RegistrationReport} text="Registration Report" type="PRIMARY" />
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
});

export default AdminScreen;
