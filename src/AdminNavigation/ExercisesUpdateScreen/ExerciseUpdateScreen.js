import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { Picker } from '@react-native-picker/picker'; // Import Picker from @react-native-picker/picker

const ExerciseUpdateScreen = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [newRegion, setNewRegion] = useState('Chest'); // Default region
  const [newName, setNewName] = useState('');
  const [newPositioning, setNewPositioning] = useState('');
  const [newExecution, setNewExecution] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editTableVisible, setEditTableVisible] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = () => {
    fetch('http://172.20.10.3:3000/api/Exercise/getAllExercises')
      .then(response => response.json())
      .then(data => setExercises(data))
      .catch(error => console.error('Error fetching exercises:', error));
  };

  const handleUpdateExercise = () => {
    if (!selectedExercise) {
      console.error('No exercise selected');
      return;
    }

    const { ID } = selectedExercise;

    fetch(`http://172.20.10.3:3000/api/Exercise/updateExercise/${ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Region: newRegion,
        Name: newName,
        Positioning: newPositioning,
        Execution: newExecution
      })
    })
    .then(response => {
      if (response.ok) {
        console.log('Exercise successfully updated');
        setSuccessMessage('Exercise information updated successfully!');
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          setEditVisible(false);
          setEditTableVisible(false);
        }, 3000);
      } else {
        console.error('Error updating exercise:', response.status, response.statusText);
      }
    })
    .catch(error => console.error('Error updating exercise:', error));
  };
  
  const handleExerciseSelection = (exercise) => {
    setSelectedExercise(exercise);
    setNewRegion(exercise.Region);
    setNewName(exercise.Name);
    setNewPositioning(exercise.Positioning);
    setNewExecution(exercise.Execution);
    setEditTableVisible(true);
  };

  const handleCancelEdit = () => {
    setEditTableVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => handleExerciseSelection(item)}
    >
      <Text style={[styles.cell, styles.nameCell]}>{item.Name}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleExerciseSelection(item)}
      >
        <Text>Edit</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const filteredExercises = exercises.filter(exercise => {
    return exercise.Name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="black" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for an exercise"
        />
      </View>
      <Text style={styles.title}>Select an exercise to update:</Text>
      <FlatList
        data={filteredExercises}
        renderItem={renderItem}
        keyExtractor={item => item.ID.toString()}
        style={styles.table}
      />
      {editTableVisible && (
        <>
          <Text style={styles.title}>Edit Exercise:</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Region:</Text>
            <Picker
              style={styles.input}
              selectedValue={newRegion}
              onValueChange={(itemValue, itemIndex) =>
                setNewRegion(itemValue)
              }>
              <Picker.Item label="Chest" value="Chest" />
              <Picker.Item label="Back" value="Back" />
              <Picker.Item label="Shoulder" value="Shoulder" />
              <Picker.Item label="Bicep" value="Bicep" />
              <Picker.Item label="Tricep" value="Tricep" />
              <Picker.Item label="Leg" value="Leg" />
            </Picker>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name:</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Positioning:</Text>
            <TextInput
              style={styles.input}
              value={newPositioning}
              onChangeText={setNewPositioning}
              placeholder="Positioning"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Execution:</Text>
            <TextInput
              style={styles.input}
              value={newExecution}
              onChangeText={setNewExecution}
              placeholder="Execution"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={handleCancelEdit} title="Cancel" color="#FF0000" />
            <Button onPress={handleUpdateExercise} title="Update Exercise" />
          </View>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{successMessage}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#add8e6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    width: 120,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  nameContainer: {
    flexDirection: 'row',
    flex: 9,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    top: 30,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
});

export default ExerciseUpdateScreen;