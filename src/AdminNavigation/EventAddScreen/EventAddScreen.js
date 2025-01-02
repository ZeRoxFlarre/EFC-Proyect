import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const EventAddScreen = () => {
  const [activities, setActivities] = useState([]);
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityDate, setNewActivityDate] = useState(new Date());
  const [newActivityTime, setNewActivityTime] = useState(new Date());
  const [newActivityLocation, setNewActivityLocation] = useState('');
  const [addingActivity, setAddingActivity] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('http://172.20.10.7:3000/api/EFC_client/getAllActivity');
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      Alert.alert('Error', 'An error occurred while fetching activities');
    }
  };

  const handleAddActivity = async () => {
    try {
      if (newActivityName.trim() === '' || newActivityLocation.trim() === '') {
        Alert.alert('Error', 'All fields are required. Please provide all the information.');
        return;
      }

      // Combinar fecha y hora seleccionadas
      const combinedDateTime = new Date(newActivityDate.getFullYear(), newActivityDate.getMonth(), newActivityDate.getDate(), newActivityTime.getHours(), newActivityTime.getMinutes());

      const response = await fetch('http://172.20.10.7:3000/api/EFC_client/addActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Event_Name: newActivityName,
          Activity_Date: combinedDateTime.toISOString(), // Guardar la fecha combinada como una cadena ISO
          Location: newActivityLocation,
        }),
      });

      if (!response.ok) {
        throw new Error('Error adding activity');
      }

      const data = await response.json();
      console.log('Activity added successfully:', data);
      fetchActivities();
      setNewActivityName('');
      setNewActivityDate(new Date());
      setNewActivityTime(new Date());
      setNewActivityLocation('');
      setAddingActivity(false);
      Alert.alert('Success', 'Activity added successfully');
    } catch (error) {
      console.error('Error adding activity:', error);
      Alert.alert('Error', 'An error occurred while adding activity');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Activity</Text>
      <ScrollView style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Event Name</Text>
          <Text style={styles.headerCell}>Activity Date</Text>
          <Text style={styles.headerCell}>Location</Text>
        </View>
        {activities.map((activity) => (
          <View key={activity.id} style={styles.row}>
            <Text style={styles.cell}>{activity.Event_Name}</Text>
            <Text style={styles.cell}>{new Date(activity.Activity_Date).toLocaleString()}</Text>
            <Text style={styles.cell}>{activity.Location}</Text>
          </View>
        ))}
      </ScrollView>
      {addingActivity ? (
        <View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Event Name:</Text>
            <TextInput
              placeholder="Activity Name"
              style={styles.input}
              value={newActivityName}
              onChangeText={setNewActivityName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Activity Date:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{newActivityDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newActivityDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNewActivityDate(selectedDate);
                  }
                }}
              />
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Activity Time:</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateText}>{newActivityTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={newActivityTime}
                mode="time"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowTimePicker(false);
                  if (selectedDate) {
                    setNewActivityTime(selectedDate);
                  }
                }}
              />
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location:</Text>
            <TextInput
              placeholder="Location"
              style={styles.input}
              value={newActivityLocation}
              onChangeText={setNewActivityLocation}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={() => setAddingActivity(false)}  color= "red"/>
            <Button title="Add" onPress={handleAddActivity} />
          </View>
        </View>
      ) : (
        <Button title="Add" onPress={() => setAddingActivity(true)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  table: {
    maxHeight: 400,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
});

export default EventAddScreen;
