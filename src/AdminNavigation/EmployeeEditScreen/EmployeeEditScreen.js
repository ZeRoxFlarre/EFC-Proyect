import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton'; 
import { useNavigation } from '@react-navigation/native'; 

const EmployeeEditScreen = () => {
  const navigation = useNavigation(); 

  const EmployeeUpdateScreen = () => {
    navigation.navigate('EmployeeEdit'); 
  };
  const EmployeeAddScreen = () => {
    navigation.navigate('EmployeeAddScreen');
  };

  return (
    <View style={styles.container}>
      <Icon name="person-add" size={100} color="#3B71F3" style={styles.icon} />
      <Text style={styles.title}>Employee Account</Text>
      <View style={styles.buttonContainer}>
        <CustomButton onPress={EmployeeUpdateScreen} text="Employee Account" type="PRIMARY" icon={<Icon name="md-person" size={24} color="white" />} />
        <CustomButton onPress={EmployeeAddScreen} text="Create Employee Account" type="SECONDARY" icon={<Icon name="md-people" size={24} color="#3B71F3" />} />
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

export default EmployeeEditScreen;