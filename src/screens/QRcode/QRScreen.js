import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRoute } from '@react-navigation/native';
import { usePreventScreenCapture } from 'expo-screen-capture';


export default function QRCodeScreen() {
  usePreventScreenCapture();

  
  const route = useRoute();
  const [userData, setUserData] = useState(null);
  const [randomString, setRandomString] = useState('');
  useEffect(() => {
    // Función para generar una cadena aleatoria única
    const generateRandomString = () => {
      return Math.random().toString(36).substring(7);
    };
   
    const { email } = route.params;
    const fetchData = async () => {
      try {
        const response = await fetch(`http://172.20.10.3:3000/api/EFC_client/Clients?email=${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
        setRandomString(generateRandomString()); // Generar una nueva cadena aleatoria al iniciar sesión
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();

    return () => {
      setRandomString('undefined'); // Establecer la cadena como "undefined" al desmontar el componente
    };
  }, [route.params]);
  
  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const { ID, first_name, last_name, email, category, phone, membership_status, start_date, end_date } = userData ?? {};
  const userDataString = `${ID}, ${first_name}, ${last_name}, ${email}, ${category}, ${phone}, ${membership_status}, ${start_date}, ${end_date}, ${randomString}`;

  // Formatear la fecha end_date en el formato YYYY-MM-DD
  const formattedEndDate = new Date(end_date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <View style={styles.container}>
      <QRCode value={randomString === 'undefined' ? undefined : userDataString} size={200} />
      <Text style={styles.text}>Membership Expire: {formattedEndDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
