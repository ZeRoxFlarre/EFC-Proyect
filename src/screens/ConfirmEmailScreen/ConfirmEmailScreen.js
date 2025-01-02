import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

const ConfirmEmailScreen = ({ route }) => {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState(route.params.email);
  const [first_name, setFirst_name] = useState(route.params.first_name);
  const [last_name, setLast_name] = useState(route.params.last_name);
  const [password, setPassword] = useState(route.params.password);
  const [category, setCategory] = useState(route.params.category.toString()); // Cambio realizado aquí
  const [phone, setPhone] = useState(route.params.phone);
  const navigation = useNavigation();

  const onConfirmPressed = () => {
    navigation.navigate('Home');
  };

  const onResendPressed = () => {
    console.warn('onResendPressed');
  };

  const URL = 'http://192.168.1.103:3000/api/EFC_client/Verify';

  const onSignUpPress = async () => {
    try {
      const deleteResponse = await fetch('http://192.168.1.103:3000/api/EFC_client/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (deleteResponse.ok) {
        console.log('User deleted successfully');
      } else {
        console.error('Failed to delete user');
      }

      navigation.navigate('SignUp');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Verificar el OTP primero
      const otpResponse = await fetch('http://172.20.10.3:3000/api/EFC_client/Verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp_code: code,
          first_name: first_name ? first_name : null,
          last_name: last_name ? last_name : null,
          category: category,
          phone: phone ? phone : null,
          password: password ? password : null,
        }),
      });

      if (!otpResponse.ok) {
        console.error('Invalid OTP');
        // Aquí puedes mostrar un mensaje al usuario indicando que el OTP es inválido
        return;
      }

      navigation.navigate('SignUp');
    } catch (error) {
      console.error('Error:', error);
      // Manejar errores de red u otros errores
    }
  };

  const resendOTP = async () => {
    try {
      const response = await fetch('http://172.20.10.3:3000/api/EFC_client', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: route.params.email
        }),
      });

      if (response.ok) {
        console.log('OTP sent successfully');
      } else {
        console.error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Confirm your email</Text>
        <CustomInput placeholder="Enter your confirmation code" value={code} setValue={setCode} />
        <CustomButton text="Confirm" onPress={handleSubmit} />
        <CustomButton text="Resend Code" onPress={resendOTP} type="SECONDARY" />
        <CustomButton text="Back to Sign up" onPress={onSignUpPress} type="TERTIARY" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    marginVertical: 20,
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#051C60',
    marginVertical: 10,
  },
});

export default ConfirmEmailScreen;
