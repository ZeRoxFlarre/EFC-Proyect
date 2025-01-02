import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton'; 
import { useNavigation, useRoute} from '@react-navigation/native'; 
import { useState, useEffect } from 'react';
const AccountClientsScreen = () => {
  const navigation = useNavigation(); 

  const route = useRoute(); // Initialize route
  const [employeeInfo, setEmployeeInfo] = useState(null); // State to store employee information
  const [loading, setLoading] = useState(true); // State to track loading status

  const SignUpScreen = () => {
    if (route.params && route.params.id) {
    navigation.navigate('SignUp', { id: route.params.id }); // Cambia 'SignUp' por 'Scanner' si es la pantalla correcta
  }else{
    navigation.navigate('SignUp');
  }
  };
  
  const ManagementAccountScreen = () => {
    if (route.params && route.params.id) {
      navigation.navigate('ManagementAccount', { id: route.params.id });
    }else{
      navigation.navigate('ManagementAccount');
    }
  };
  

  useEffect(() => {
    if (route.params && route.params.id) {
      fetchEmployeeInfo(route.params.id); // Fetch employee info when component mounts or ID changes
    }
  }, [route.params]);

  // Function to fetch employee information by ID
  const fetchEmployeeInfo = async (id) => {
    try {
      const response = await fetch(`http://172.20.10.3:3000/api/EFC_client/getEmployee/${id}`);
      const data = await response.json();
      console.log('Employee data:', data);
      if (response.ok) {
        setEmployeeInfo(data);
      } else {
        console.error('Error fetching employee:', data.message);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false); // Set loading to false after fetch completes
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="person-add" size={100} color="#3B71F3" style={styles.icon} />
      <Text style={styles.title}>Student Account</Text>
      <View style={styles.buttonContainer}>
        <CustomButton onPress={ManagementAccountScreen} text="Student Account" type="PRIMARY" icon={<Icon name="md-person" size={24} color="white" />} />
        <CustomButton onPress={SignUpScreen} text="Create Account" type="SECONDARY" icon={<Icon name="md-people" size={24} color="#3B71F3" />} />
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

export default AccountClientsScreen;
