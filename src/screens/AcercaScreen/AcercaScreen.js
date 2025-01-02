import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Vestimenta from '../../../assets/images/Vestimenta.png';

const GymScreen = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('http://172.20.10.7:3000/api/EFC_client/getAllSchedules');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const formatTime = (time) => {
    const hour = parseInt(time.slice(0, 2));
    const ampm = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${time.slice(3, 5)} ${ampm}`;
  };

  const renderScheduleTable = () => {
    return (
      <View style={styles.tableContainer}>
        <Text style={styles.title}>Gym Schedule</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.headerCell}>Day</Text>
            <Text style={styles.headerCell}>Time</Text>
          </View>
          {schedules.map((schedule, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{schedule.day}</Text>
              <Text style={styles.cell}>{`${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.section, { marginTop: 10 }]}>
        {renderScheduleTable()}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Gym Rules</Text>
        <Text style={styles.subtitle}>The following dress code is required for gym use:</Text>
        <View style={styles.ruleContainer}>
          <Ionicons name="shirt" size={20} color="green" />
          <Text style={styles.ruleText}>Athletic shirt for physical activity.</Text>
        </View>
        <View style={styles.ruleContainer}>
          <Ionicons name="basketball" size={20} color="green" />
          <Text style={styles.ruleText}>Shorts to the knee or long sport pants.</Text>
        </View>
        <View style={styles.ruleContainer}>
          <Ionicons name="walk" size={20} color="green" />
          <Text style={styles.ruleText}>Proper sports shoes for weightlifting exercises.</Text>
        </View>

        <Text style={styles.subtitle}>Not allowed:</Text>
        <View style={styles.ruleContainer}>
          <Ionicons name="close-circle" size={20} color="red" />
          <Text style={styles.ruleText}>Use of short tights only; must have shorts or long shirt that covers the hips.</Text>
        </View>
        <View style={styles.ruleContainer}>
          <Ionicons name="close-circle" size={20} color="red" />
          <Text style={styles.ruleText}>Shirts that expose part of the chest and back or have a hole larger than the size of the hand.</Text>
        </View>
        <View style={styles.ruleContainer}>
          <Ionicons name="close-circle" size={20} color="red" />
          <Text style={styles.ruleText}>Proper sports shoes for weightlifting exercises.</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={Vestimenta} style={styles.image} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30, // Reducing the bottom space to make the table smaller in length
    overflow: 'hidden', // Hiding any content that extends beyond the maximum height
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ruleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ruleText: {
    marginLeft: 10,
    flexWrap: 'wrap',
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    width: 300,
    height: 250,
    resizeMode: 'contain',
  },
  tableContainer: {
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
});

export default GymScreen;
