import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native'; // Importa useNavigation
import { useEffect } from 'react';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Initialize route

  const [employeeInfo, setEmployeeInfo] = useState(null); // State to store employee information
  const [loading, setLoading] = useState(true); // State to track loading status

  const onTermsOfUsePressed = () => {
    console.warn('onTermsOfUsePressed');
  };

  const onPrivacyPolicyPressed = () => {
    console.warn('onPrivacyPolicyPressed');
  };

  const URL = 'http://172.20.10.3:3000/api/EFC_clients';
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [category, setCategory] = useState(null); // Set initial state to null
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChangesInitial = (name, value) => setFirst_name({ ...first_name, [name]: value });
  const handleChangesLast = (name, value) => setLast_name({ ...last_name, [name]: value });
  const handleChanges = (value) => setEmail(value);
  const handleChangesPas = (name, value) => setPassword({ ...password, [name]: value });
  const handleChangesPasR = (name, value) => setPasswordRepeat({ ...passwordRepeat, [name]: value });
  const handlePhoneChange = (name, value) => setPhone({ ...phone, [name]: value });

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async () => {
    // Expresión regular para verificar que el número de teléfono contenga solo números y guiones
    const phoneRegex = /^[0-9-]+$/;
  
    if (!first_name.trim() || !last_name.trim()) {
      Alert.alert('Error', 'Please enter your first and last name');
    } else if (password.length < 8 || passwordRepeat.length < 8) {
      Alert.alert('Error', 'Password should be at least 8 characters long');
    } else if (!email.includes('@') || (!email.includes('.com') && !email.includes('.edu'))) {
      Alert.alert('Error', 'Invalid email format');
    } else if (password !== passwordRepeat) {
      Alert.alert('Error', 'Passwords do not match');
    } else if (!phone.includes('-') || !phone.match(phoneRegex)) {
      Alert.alert('Error', 'Invalid phone number format. Please use only numbers and dashes (-)');
    } else if (![0, 1, 2].includes(category)) { // Verifica si la categoría está dentro de las opciones permitidas
      Alert.alert('Error', 'Please select Student, Faculty, or External');
    } else {
      try {
        // Check if the email already exists in the database
        const response = await fetch(`${URL}/email/${email}`); // GET request
        const data = await response.json();
        console.log(data);
  
        if (data.length > 0) {
          // If the data array is not empty, the email is already registered in the database
          Alert.alert('Error', 'The email is already registered');
        } else {
          // The email does not exist in the database, proceed with the registration
          const registerResponse = await fetch(URL, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, category }), // Send email, password, and category
          });
  
          if (registerResponse.ok) {
            // Navigate to ConfirmEmailScreen and pass the information
            navigation.navigate('ConfirmEmail', { email, first_name, last_name, password, category, phone });
            console.log(email);
  
            if (route.params && route.params.id) {
              // Fetch para agregar el cambio al historial
              const changeTime = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
              fetch(`http://172.20.10.3:3000/api/EFC_client/changeHistory/${route.params.id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  changeTime: changeTime
                })
              })
              .then(response => {
                if (response.ok) {
                  console.log('Change added to history successfully');
                } else {
                  console.error('Error adding change to history:', response.status, response.statusText);
                }
              })
              .catch(error => console.error('Error adding change to history:', error));
            }
          } else {
            Alert.alert('Error', 'Failed to register. Please try again later.');
          }
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        Alert.alert('Error', 'An error occurred while verifying the email');
      }
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
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create an Account</Text>

        <CustomInput placeholder="First Name" value={first_name} setValue={setFirst_name} onChangeText={(text) => handleChangesInitial('First_Name', text)} />
        <CustomInput placeholder="Last Name" value={last_name} setValue={setLast_name} onChangeText={(text) => handleChangesLast('Last_Name', text)} />
        <CustomInput placeholder="Email" value={email} setValue={setEmail} onChangeText={(text) => handleChanges('email', text)} />
        <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry={!showPassword} onChangeText={(text) => handleChangesPas('password', text)} />
        <CustomInput placeholder="Repeat Password" value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry={!showPassword} onChangeText={(text) => handleChangesPasR('Repeat_Password', text)} />
        <CustomInput placeholder="Phone Number" value={phone} setValue={setPhone} onChangeText={(text) => handlePhoneChange('Phone_Number', text)} />

        <View style={styles.userTypeContainer}>
          <TouchableOpacity style={[styles.userTypeButton, category === 1 && styles.selectedUserType]} onPress={() => setCategory(1)}>
            <Text style={styles.userTypeButtonText}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.userTypeButton, category === 2 && styles.selectedUserType]} onPress={() => setCategory(2)}>
            <Text style={styles.userTypeButtonText}>Faculty</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.userTypeButton, category === 0 && styles.selectedUserType]} onPress={() => setCategory(0)}>
            <Text style={styles.userTypeButtonText}>External</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={toggleShowPassword}>
          <Text style={styles.showPasswordButton}>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
        </TouchableOpacity>

        <CustomButton text="Register" onPress={handleSubmit} />
        <Text style={styles.text}>
          By registering, you confirm that you accept our
          <Text style={styles.link} onPress={onTermsOfUsePressed}> Terms of Use </Text>
          and{" "}
          <Text style={styles.link} onPress={onPrivacyPolicyPressed}>Privacy Policy</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 40,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  userTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedUserType: {
    backgroundColor: '#4CAF50',
  },
  userTypeButtonText: {
    color: '#051C60',
  },
  showPasswordButton: {
    color: '#0099FF',
    marginBottom: 15,
    marginTop: 5,
  },
});

export default SignUpScreen;
