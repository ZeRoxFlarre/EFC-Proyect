import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const UpdatePersonalScreen = () => {
  const [personalList, setPersonalList] = useState([]);
  const [selectedPersonal, setSelectedPersonal] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDays, setSelectedDays] = useState(new Set());
  const [workingStatus, setWorkingStatus] = useState('Active');
  const [fieldsVisible, setFieldsVisible] = useState(true);
  const [showSelectDayMessage, setShowSelectDayMessage] = useState(true);
  const [nameError, setNameError] = useState('');
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  useEffect(() => {
    fetchPersonalList();
    setShowSelectDayMessage(personalList.length === 0);
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

  const handleUpdatePersonal = async () => {
    try {
      if (!selectedPersonal) {
        Alert.alert('Error', 'Please select a personal to update.');
        return;
      }
      
      if (!nombre) {
        setNameError('Please fill in the name field.');
        return;
      } else {
        setNameError('');
      }

      if (/\d/.test(nombre)) {
        Alert.alert('Error', 'Name should not contain numbers.');
        return;
      }
  
      
      if (selectedDays.size === 0) {
        Alert.alert('Error', 'Please select a Day of the week');
        return;
      }
      
      const response = await fetch(`http://172.20.10.3:3000/api/EFC_client/updatePersonalInfo/${selectedPersonal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          start_time: startTime,
          end_time: endTime,
          DaysOfWeek: Array.from(selectedDays),
          Working: workingStatus,
        }),
      });
      const data = await response.json();
      Alert.alert('Success', data.message);
      setFieldsVisible(false);
      fetchPersonalList();
    } catch (error) {
      console.error('Error updating personal information:', error);
      Alert.alert('Error', 'An error occurred while updating the personal information.');
    }
  };
  
  const isValidTimeFormat = (time) => {
    const regex = /^([01]?[0-9]|2[0-3])(:[0-5][0-9])?(:[0-5][0-9])?$/;
    return regex.test(time);
  };

  const handleCancel = () => {
    setFieldsVisible(false);
    setNombre('');
    setEmail('');
    setStartTime('');
    setEndTime('');
    setSelectedDays(new Set());
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity key={item.id} style={styles.row} onPress={() => handleSelectPersonal(item)}>
      <Text style={styles.cell}>{item.nombre}</Text>
      <Button title="Edit" onPress={() => handleSelectPersonal(item)} />
    </TouchableOpacity>
  );
  

  const handleSelectPersonal = (personal) => {
    setSelectedPersonal(personal);
    setNombre(personal.nombre);
    setEmail(personal.email);
    setStartTime(personal.start_time);
    setEndTime(personal.end_time);
    setSelectedDays(new Set(personal.DaysOfWeek));
    setWorkingStatus(personal.Working);
    setFieldsVisible(true);
  };

  const handleDayToggle = (day) => {
    const updatedSelectedDays = new Set(selectedDays);
    if (updatedSelectedDays.has(day)) {
      updatedSelectedDays.delete(day);
    } else {
      updatedSelectedDays.add(day);
    }
    setSelectedDays(updatedSelectedDays);
    setShowSelectDayMessage(updatedSelectedDays.size === 0);
  };

  const renderDayButton = (day) => (
    <TouchableOpacity
      key={day}
      style={[styles.dayButton, selectedDays.has(day) && styles.selectedDayButton]}
      onPress={() => handleDayToggle(day)}
    >
      <Text style={styles.dayButtonText}>{day}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Personal Information</Text>
      <ScrollView style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, { flex: 8 }]}> Name</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}></Text>
        </View>
        {personalList.map((item) => (
          renderItem({ item })
        ))}
      </ScrollView>
      {fieldsVisible && selectedPersonal && (
        <View style={styles.formContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              placeholder='Name'
              style={[styles.input, styles.largeInput]}
              value={nombre}
              onChangeText={setNombre}
            />
          </View>
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              placeholder='Email'
              style={[styles.input, styles.largeInput]}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Start Time:</Text>
            <TouchableOpacity
              onPress={() => setStartTimePickerVisible(true)}
              style={[styles.input, styles.largeInput]}
            >
              <Text>{startTime ? startTime : 'Select Start Time'}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isStartTimePickerVisible}
              mode="time"
              onConfirm={(time) => {
                setStartTime(time.toLocaleTimeString());
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
              style={[styles.input, styles.largeInput]}
            >
              <Text>{endTime ? endTime : 'Select End Time'}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isEndTimePickerVisible}
              mode="time"
              onConfirm={(time) => {
                setEndTime(time.toLocaleTimeString());
                setEndTimePickerVisible(false);
              }}
              onCancel={() => setEndTimePickerVisible(false)}
              textColor="#007bff"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Working:</Text>
            
            <View style={[styles.buttonGroup, { marginRight: 80 }]}>
              <Button
                title="Active"
                onPress={() => setWorkingStatus('Active')}
                color={workingStatus === 'Active' ? 'green' : '#999'}
                style={styles.button} // No hay necesidad de ajustar el margen aquí
              />
              <Button
                title="Inactive"
                onPress={() => setWorkingStatus('Inactive')}
                color={workingStatus === 'Inactive' ? 'red' : '#999'}
                style={styles.button} // No hay necesidad de ajustar el margen aquí
              />
            </View>
          </View>
          <View style={styles.daysContainer}>
            {renderDayButton("Sunday")}
            {renderDayButton("Monday")}
            {renderDayButton("Tuesday")}
            {renderDayButton("Wednesday")}
            {renderDayButton("Thursday")}
            {renderDayButton("Friday")}
          </View>
          {showSelectDayMessage && (
            <Text style={styles.selectDayMessage}>Please select at least one day.</Text>
          )}
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={handleCancel} color="red" />
            <Button title="Update" onPress={handleUpdatePersonal} />
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    maxHeight: 400,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    flex: 1,
    marginRight: 10,
    textAlign: 'right',
  },
  input: {
    flex: 2,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fafafa',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  iosPicker: {
    height: 200,
    paddingTop: 10, // Ajuste adicional para evitar que el texto se solape con el borde superior
  },
  pickerItem: {
    fontSize: 18, // Ajusta el tamaño de fuente para que sea más legible en iOS
  },
  androidPicker: {
    width: '100%',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dayButton: {
    margin: 5,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  selectedDayButton: {
    backgroundColor: '#90EE90',
  },
  dayButtonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  selectDayMessage: {
    textAlign: 'center',
    color: 'red',
    marginBottom: 10,
  },
  largeInput: {
    height: 50,
    fontSize: 18,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
});

export default UpdatePersonalScreen;
