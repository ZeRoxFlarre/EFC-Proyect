import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const EventAddScreen = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editedActivity, setEditedActivity] = useState({
    id: null,
    Event_Name: '',
    Activity_Date: new Date(),
    Location: ''
  });
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

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setEditedActivity({
      id: activity.id,
      Event_Name: activity.Event_Name,
      Activity_Date: new Date(activity.Activity_Date),
      Location: activity.Location
    });
  };
  
  const handleSaveActivity = async () => {
    try {
      const response = await fetch(`http://172.20.10.7:3000/api/EFC_client/updateActivity/${editedActivity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Event_Name: editedActivity.Event_Name,
          Activity_Date: editedActivity.Activity_Date.toISOString(),
          Location: editedActivity.Location
        }),
      });
      if (!response.ok) {
        throw new Error('Error updating activity');
      }
      const data = await response.json();
      console.log('Activity updated successfully:', data);
      fetchActivities();
      setSelectedActivity(null);
      setEditedActivity({
        id: null,
        Event_Name: '',
        Activity_Date: new Date(),
        Location: ''
      });
      Alert.alert('Success', 'Activity updated successfully');
    } catch (error) {
      console.error('Error updating activity:', error);
      Alert.alert('Error', 'An error occurred while updating activity');
    }
  };

  const handleCancelActivity = () => {
    setSelectedActivity(null);
    setEditedActivity({
      id: null,
      Event_Name: '',
      Activity_Date: new Date(),
      Location: ''
    });
  };

  const handleDeleteActivity = async () => {
    try {
      const response = await fetch(`http://172.20.10.7:3000/api/EFC_client/deleteActivity/${editedActivity.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Error deleting activity');
      }
      const data = await response.json();
      console.log('Activity deleted successfully:', data);
      fetchActivities();
      setSelectedActivity(null);
      setEditedActivity({
        id: null,
        Event_Name: '',
        Activity_Date: new Date(),
        Location: ''
      });
      Alert.alert('Success', 'Activity deleted successfully');
    } catch (error) {
      console.error('Error deleting activity:', error);
      Alert.alert('Error', 'An error occurred while deleting activity');
    }
  };

  const handleEditChange = (key, value) => {
    setEditedActivity({
      ...editedActivity,
      [key]: value
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Activities</Text>
      <ScrollView style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, { marginLeft: 20 }]}>Event Name</Text>
          <Text style={[styles.headerCell, { marginLeft: 50 }]}>Activity Date</Text>
          <Text style={[styles.headerCell, { marginLeft: 40 }]}>Location</Text>
          <Text style={[styles.headerCell, { marginLeft: 'auto' }]}></Text>
        </View>
        {activities.map((activity) => (
          <TouchableOpacity 
            key={activity.id} 
            style={styles.row} 
            onPress={() => handleEditActivity(activity)}
          >
            <Text style={[styles.cell, { marginLeft: 10 }]}>{activity.Event_Name}</Text>
            <Text style={[styles.cell, { marginLeft: 10 }]}>{new Date(activity.Activity_Date).toLocaleString()}</Text>
            <Text style={[styles.cell, { marginLeft: 10 }]}>{activity.Location}</Text>
            <TouchableOpacity style={[styles.editButton, { marginLeft: 'auto' }]} onPress={() => handleEditActivity(activity)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedActivity && (
        <View style={styles.editForm}>
          <Text style={styles.editFormTitle}>Edit Activity</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Event Name:</Text>
            <TextInput
              style={styles.input}
              value={editedActivity.Event_Name}
              onChangeText={(text) => handleEditChange('Event_Name', text)}
              placeholder="Event Name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Activity Date:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text>{editedActivity.Activity_Date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={editedActivity.Activity_Date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || editedActivity.Activity_Date;
                  setShowDatePicker(Platform.OS === 'ios');
                  handleEditChange('Activity_Date', currentDate);
                }}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Activity Time:</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text>{editedActivity.Activity_Date.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {showTimePicker && (
  <DateTimePicker
    value={editedActivity.Activity_Date}
    mode="time" // Cambiar a "time" para seleccionar solo la hora
    display="default"
    onChange={(event, selectedDate) => {
      const currentDate = selectedDate || editedActivity.Activity_Date;
      setShowTimePicker(Platform.OS === 'ios');
      handleEditChange('Activity_Date', currentDate);
    }}
  />
)}

          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Location:</Text>
            <TextInput
              style={styles.input}
              value={editedActivity.Location}
              onChangeText={(text) => handleEditChange('Location', text)}
              placeholder="Location"
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={handleCancelActivity} />
            <Button title="Delete" onPress={handleDeleteActivity} color="red" />
            <Button title="Save" onPress={handleSaveActivity} />
          </View>
        </View>
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
    alignItems: 'center',
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
  editButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  editForm: {
    marginTop: 20,
  },
  editFormTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    flex: 1,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    marginLeft: 10,
    width: '20%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default EventAddScreen;
