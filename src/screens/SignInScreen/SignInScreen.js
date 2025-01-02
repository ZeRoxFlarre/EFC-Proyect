import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Logo from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/Logo2.png';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomInput = ({ placeholder, value, setValue, secureTextEntry, icon }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        secureTextEntry={secureTextEntry}
      />
      {icon && <View style={styles.iconContainer}>{icon}</View>}
    </View>
  );
};

const SignInScreen = () => {
  const URL = 'http://172.20.10.3:3000/api/EFC_client/Login';
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleChanges = (value) => setEmail(value);
  const handleChangesPas = (value) => setPassword(value);

  const { height } = useWindowDimensions();

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const fetchEFC_clients = async () => {
    try {
      // Verificar credenciales de administrador
      if (email.trim() === 'Admin' && password === 'Admin123') {
        // Si son credenciales de administrador, navegar a la pantalla de administrador
        navigation.navigate('Admin');
        return; // Salir de la función para evitar la solicitud fetch
      }
  
      // Si no son credenciales de administrador, continuar con la solicitud fetch
      const res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (res.ok) {
        const responseJson = await res.json();
        await AsyncStorage.setItem('token', responseJson.token);
        // Verificar si el email no está vacío antes de navegar
        if (email.trim() !== '') {
          console.log('Email:', email);
          navigation.navigate('QRcode', { email: email });
        } else {
          // Manejar el caso en el que el email esté vacío
          Alert.alert('Error', 'El email está vacío');
        }
      } else {
        const errorResponse = await res.json();
        Alert.alert('Error', errorResponse.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };
  
  const LoginEmployee = async () => {
    try {
      const res = await fetch('http://172.20.10.3:3000/api/EFC_client/LoginEmployee', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: email.trim(), password }), // Envía el ID del usuario y el password
      });
  
      if (res.ok) {
        const userData = await res.json();
        console.log('User Data:', userData);
        // Aquí puedes manejar la respuesta del servidor y actualizar el estado de tu aplicación según sea necesario
        navigation.navigate('Employee', { id: email.trim() }); // Navegar a la pantalla de Employee después de iniciar sesión

      } else {
        const errorResponse = await res.json();
        console.error('Error fetching user data:', errorResponse);
        // Manejar errores de la solicitud
      }
    } catch (error) {
      console.error('Error:', error);
      // Manejar errores de la solicitud
    }
  };

  return (
    <View style={styles.root}>
      <Image source={Logo} style={[styles.logo, { height: height * 0.3 }]} resizeMode="contain" />
      <CustomInput placeholder="Email" value={email} setValue={setEmail} onChangeText={(text) => handleChanges(text)} />
      <CustomInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry={secureTextEntry}
        onChangeText={(text) => handleChangesPas(text)}
        icon={
          <TouchableOpacity onPress={toggleSecureTextEntry}>
            <Icon name={secureTextEntry ? 'eye-slash' : 'eye'} size={20} color="#000" />
          </TouchableOpacity>
        }
      />
      <CustomButton text="Sign In" onPress={fetchEFC_clients} />
      <CustomButton text="Employee Sign In" onPress={LoginEmployee} type="TERTIARY" />
      <CustomButton text="Forgot Password?" onPress={onForgotPasswordPressed} type="TERTIARY" />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 300,
    maxWidth: 300,
    maxHeight: 300,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  iconContainer: {
    marginLeft: 10,
  },
});

export default SignInScreen;
