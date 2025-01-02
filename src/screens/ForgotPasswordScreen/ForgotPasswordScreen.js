import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {

  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const onSendPressed = async () => {
    try {
      const response = await fetch('http://172.20.10.3:3000/api/EFC_client/Change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        // Si la respuesta es exitosa, navega a la pantalla de nueva contraseña
        navigation.navigate('NewPassword', { email }); // Pasa el email como parámetro
      } else {
        // Si la respuesta indica un error, muestra un mensaje al usuario
        Alert.alert('Invalid Email', 'The email provided is not valid. Please try again.', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.', [{ text: 'OK' }]);
    }
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Reset your password</Text>

        <CustomInput placeholder="Enter Email" value={email} setValue={setEmail} />

        <CustomButton text="Send" onPress={onSendPressed} />

        <CustomButton text="Back to Sign in" onPress={onSignInPress} type="TERTIARY" />
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
});

export default ForgotPasswordScreen;
