import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const AddPersonalScreen = () => {
  const [personalList, setPersonalList] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [workingStatus, setWorkingStatus] = useState('Active');
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  useEffect(() => {
    fetchPersonalList();
  }, []);

  const fetchPersonalList = async () => {
    try {
      const response = await fetch('http://172.20.10.3:3000/api/EFC_client/getAllPersonal');
      const data = await response.json();
      setPersonalList(data);
    } catch (error) {
      console.error('Error fetching personal list:', error);
      Alert.alert('Error', 'An error occurred while fetching personal list');
    }
  };

  const handleAddPersonal = async () => {
    try {
      // Validations
      if (nombre.trim() === '' || !startTime || !endTime || selectedDays.length === 0) {
        Alert.alert('Error', 'Please fill in all required fields.');
        return;
      }

      const response = await fetch('http://172.20.10.3:3000/api/EFC_client/addPersonalInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          start_time: startTime,
          end_time: endTime,
          DayOfWeek: selectedDays.join(', '),
          Working: workingStatus,
        }),
      });

      const data = await response.json();
      Alert.alert('Success', data.message);
      fetchPersonalList();
      setNombre('');
      setEmail('');
      setStartTime(null);
      setEndTime(null);
      setSelectedDays([]);
      setShowAddForm(false);
      setWorkingStatus('Active');
    } catch (error) {
      console.error('Error adding personal:', error);
      Alert.alert('Error', 'An error occurred while adding personal');
    }
  };

  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(selectedDay => selectedDay !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const setActiveStatus = () => {
    setWorkingStatus('Active');
  };

  const setInactiveStatus = () => {
    setWorkingStatus('Inactive');
  };

  const renderDayButtons = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return daysOfWeek.map(day => (
      <TouchableOpacity
        key={day}
        style={[styles.dayButton, selectedDays.includes(day) ? styles.selectedDayButton : null]}
        onPress={() => handleDayToggle(day)}
      >
        <Text style={styles.dayButtonText}>{day}</Text>
      </TouchableOpacity>
    ));
  };

  const formatTime = (time) => {
    if (!time) return 'Select Time';
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Personal</Text>
      <ScrollView style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
        </View>
        {personalList.map((item) => (
          <TouchableOpacity key={item.id.toString()} onPress={() => {}}>
            <View style={styles.row}>
              <Text style={[styles.cell, { flex: 2 }]}>{item.nombre}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {showAddForm ? (
        <View style={styles.formContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              placeholder='Name'
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              placeholder='Email'
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Start Time:</Text>
            <TouchableOpacity
              onPress={() => setStartTimePickerVisible(true)}
              style={[styles.input, { flex: 1 }]}
            >
              <Text>{formatTime(startTime)}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isStartTimePickerVisible}
              mode="time"
              onConfirm={(time) => {
                setStartTime(time);
                setStartTimePickerVisible(false);
              }}
              onCancel={() => setStartTimePickerVisible(false)}
              textColor="#007bff"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>End Time:</Text>
            <TouchableOpacity
              onPress={() => setEndTimePickerVisible(true)}
              style={[styles.input, { flex: 1 }]}
            >
              <Text>{formatTime(endTime)}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isEndTimePickerVisible}
              mode="time"
              onConfirm={(time) => {
                setEndTime(time);
                setEndTimePickerVisible(false);
              }}
              onCancel={() => setEndTimePickerVisible(false)}
              textColor="#007bff"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Working:</Text>
            <TouchableOpacity
              style={[styles.statusButton, workingStatus === 'Active' ? styles.activeStatus : null]}
              onPress={setActiveStatus}
            >
              <Text style={styles.statusButtonText}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, workingStatus === 'Inactive' ? styles.inactiveStatus : null]}
              onPress={setInactiveStatus}
            >
              <Text style={styles.statusButtonText}>Inactive</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.daysContainer}>
              {renderDayButtons()}
            </View>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButtonSmall} onPress={() => setShowAddForm(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButtonSmall} onPress={handleAddPersonal}>
              <Text style={styles.addButtonText}>Add Personal</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addButtonLarge} onPress={() => setShowAddForm(true)}>
            <Text style={styles.addButtonText}>Add Personal</Text>
          </TouchableOpacity>
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
  formContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    marginRight: 10,
    textAlign: 'right',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 19,
  },
  addButtonLarge: {
    backgroundColor: '#007bff', 
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonSmall: {
    backgroundColor: '#dc3545',
    padding: 10, 
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonSmall: {
    backgroundColor: '#007bff',
    padding: 10, 
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center', 
    marginBottom: 10,
  },
  dayButton: {
    backgroundColor: '#ddd',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedDayButton: {
    backgroundColor: '#90EE90',
  },
  dayButtonText: {
    color: '#000',
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statusButton: {
    backgroundColor: '#ddd',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  activeStatus: {
    backgroundColor: '#90EE90',
  },
  inactiveStatus: {
    backgroundColor: '#FF6347',
  },
  statusButtonText: {
    color: '#000',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default AddPersonalScreen;
