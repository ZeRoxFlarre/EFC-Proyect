import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, LogBox } from 'react-native';
import ImageSlider from './ImageSlider';

LogBox.ignoreLogs(['ViewPropTypes will be removed']); // Ignorar advertencia específica

const EventScreen = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('http://172.20.10.7:3000/api/EFC_client/getAllActivity');
      if (!response.ok) {
        throw new Error('Error fetching activities');
      }
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error(error);
      setActivities([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const renderItem = ({ item }) => (
    <View style={styles.activityContainer}>
      <Text style={styles.activityItem}>{item.Event_Name}</Text>
      <Text style={styles.activityItem}>{formatDate(item.Activity_Date)}</Text>
      <Text style={styles.activityItem}>{item.Location}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageSlider />

      <View style={styles.headerTopBar}>
        <Text style={styles.headerTopBarText}>Activities</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.heading}>Event Name</Text>
        <Text style={styles.heading}>Activity Date</Text>
        <Text style={styles.heading}>Location</Text>
      </View>

      <FlatList
        data={activities}
        keyExtractor={(item, index) => index.toString()} // Utiliza el índice como clave única
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 2, // Agrega un poco más de espacio hacia abajo
  },
  headerTopBar: {
    backgroundColor: '#6AB7E2',
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 2,
    marginBottom: 10,
  },
  headerTopBarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    marginBottom: 10,
  },
  heading: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  activityItem: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 10,
  },
});

export default EventScreen;
