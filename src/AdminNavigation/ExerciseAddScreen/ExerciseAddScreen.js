import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker from '@react-native-picker/picker'

const ExerciseAddScreen = () => {
  const [activities, setActivities] = useState([]);
  const [newActivityRegion, setNewActivityRegion] = useState('Chest');
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityPositioning, setNewActivityPositioning] = useState('');
  const [newActivityExecution, setNewActivityExecution] = useState('');
  const [addingActivity, setAddingActivity] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('http://172.20.10.7:3000/api/Exercise/getAllExercises');
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      Alert.alert('Error', 'An error occurred while fetching exercises');
    }
  };

  const handleAddActivity = async () => {
    try {
      if (newActivityName.trim() === '' || newActivityRegion.trim() === '' || newActivityPositioning.trim() === '' || newActivityExecution.trim() === ''){
        Alert.alert('Error', 'All fields are required. Please provide all the information.');
        return;
      }

      const response = await fetch('http://172.20.10.7:3000/api/Exercise/addExercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Region: newActivityRegion,
          Name: newActivityName,
          Positioning: newActivityPositioning,
          Execution: newActivityExecution,
        }),
      });

      if (!response.ok) {
        throw new Error('Error adding exercise');
      }

      const data = await response.json();
      console.log('Exercise added successfully:', data);
      fetchActivities();
      setNewActivityRegion('');
      setNewActivityName('');
      setNewActivityPositioning('');
      setNewActivityExecution('');
      setAddingActivity(false);
      Alert.alert('Success', 'Exercise added successfully');
    } catch (error) {
      console.error('Error adding exercise:', error);
      Alert.alert('Error', 'An error occurred while adding exercise');
    }
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Exercise</Text>
      <ScrollView style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Region</Text>
          <Text style={styles.headerCell}>Name</Text>
        </View>
        {activities.map((activity, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{activity.Region}</Text>
            <Text style={styles.cell}>{activity.Name}</Text>
          </View>
        ))}
      </ScrollView>
      {addingActivity ? (
        <View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Region:</Text>
            <Picker
              style={styles.input}
              selectedValue={newActivityRegion}
              onValueChange={(itemValue, itemIndex) => setNewActivityRegion(itemValue)}>
              <Picker.Item label="Chest" value="Chest" />
              <Picker.Item label="Back" value="Back" />
              <Picker.Item label="Shoulder" value="Shoulder" />
              <Picker.Item label="Bicep" value="Bicep" />
              <Picker.Item label="Tricep" value="Tricep" />
              <Picker.Item label="Leg" value="Leg" />
            </Picker>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={newActivityName}
              onChangeText={setNewActivityName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Positioning:</Text>
            <TextInput
              style={styles.input}
              value={newActivityPositioning}
              onChangeText={setNewActivityPositioning}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Execution:</Text>
            <TextInput
              style={styles.input}
              value={newActivityExecution}
              onChangeText={setNewActivityExecution}
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
});

export default ExerciseAddScreen;