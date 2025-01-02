import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { StyleSheet, Text, View, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(false); 
  const [id, setID] = useState(null); 
  const [firstName, setFirstName] = useState(null); 
  const [lastName, setLastName] = useState(null); 
  const [membershipStatus, setMembershipStatus] = useState(null); 
  const [membershipExp, setMembershipExp] = useState(null); 

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    const { id, firstName, lastName, membershipStatus, membershipExp } = parseQRData(data);
  
    setID(id);
    setFirstName(firstName);
    setLastName(lastName);
    setMembershipStatus(membershipStatus);
    setMembershipExp(membershipExp);
    setScanData(data);
    setScanSuccess(true);
    
    const timestamp = new Date().toISOString();

    fetch('http://172.20.10.7:3000/api/RegistroCliente/Register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id, timestamp: timestamp}), 
    })
    .then(response => {
      if (response.ok) {
        console.log('Data successfully sent to backend');
        console.log({ id: id, timestamp: timestamp})
      } else {
        console.error('Failed to send data to backend');
       
      }
    })
    .catch(error => {
      console.error('Error sending data to backend:', error);
    });
  };
  
  const parseQRData = (data) => {
    const dataArray = data.split(',');
    const id = dataArray.length > 0 ? dataArray[0].trim() : null;
    const firstName = dataArray.length > 1 ? dataArray[1].trim() : null;
    const lastName = dataArray.length > 2 ? dataArray[2].trim() : null;
    const membershipExpString = dataArray.length > 8 ? dataArray[8].trim() : null;
    const membershipStatus = dataArray.length > 6 ? dataArray[6].trim() : null;
  
    // Parse membershipExpString to get only YYYY-MM-DD
    const membershipExpDate = membershipExpString ? new Date(membershipExpString) : null;
    const membershipExpFormatted = membershipExpDate ? membershipExpDate.toISOString().slice(0, 10) : null;
  
    return { id, firstName, lastName, membershipStatus, membershipExp: membershipExpFormatted };
  };
  
  

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  console.log("Membership expiration:", membershipExp);

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.auto}
        onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
      />
      <View style={styles.personContainer}>
        {scanData && firstName && lastName && (
          <>
            <Text style={styles.personName}>Name: {firstName} {lastName}</Text>
            <Text style={styles.membershipStatus}>Category: {membershipStatus}</Text>
            <Text style={styles.membershipStatus}>Membership Expire: {membershipExp}</Text>
          </>
        )}
      </View>
      <View style={styles.successMessageContainer}>
        {scanData && (
          <>
            <Text style={styles.successMessage}>QR code success!</Text>
            <Button title="Scan Again?" onPress={() => {
              setScanData(null);
              setScanSuccess(false);
              setFirstName(null);
              setLastName(null);
              setMembershipStatus(null);
            }} />
          </>
        )}
      </View>
      <StatusBar style="auto" />
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
  camera: {
    flex: 1,
    width: '100%',
  },
  successMessageContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  personContainer: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successMessage: {
    color: '#fff',
    fontSize: 18,
  },
  personName: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  membershipStatus: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
});
