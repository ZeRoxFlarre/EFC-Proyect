import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomInput from '../../components/CustomInput';

const NewPasswordScreen = () => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();

  const onSubmitPressed = async () => {
    try {
      if (newPassword !== passwordRepeat) {
        Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.', [{ text: 'OK' }]);
        return;
      }

      const email = route.params.email;

      const response = await fetch('http://172.20.10.3:3000/api/EFC_client/ChangePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp_code: code, password: newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Password changed successfully', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SignIn'), // Navegar hacia la pantalla de inicio de sesión
          },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Something went wrong. Please try again later.', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.', [{ text: 'OK' }]);
    }
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Reset your password</Text>

        <CustomInput placeholder="Code received" value={code} setValue={setCode} />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={secureTextEntry}
          />
          <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.iconContainer}>
            <Icon name={secureTextEntry ? 'eye-slash' : 'eye'} size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Repeat new password"
            value={passwordRepeat}
            onChangeText={setPasswordRepeat}
            secureTextEntry={secureTextEntry}
          />
          <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.iconContainer}>
            <Icon name={secureTextEntry ? 'eye-slash' : 'eye'} size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <CustomButton text="Submit" onPress={onSubmitPressed} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    marginVertical: 20,
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

export default NewPasswordScreen;
