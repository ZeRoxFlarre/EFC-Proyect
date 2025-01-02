import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AcercaEditScreen = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [fieldsVisible, setFieldsVisible] = useState(false);

  const [nombre, setNombre] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('http://172.20.10.3:3000/api/EFC_client/getAllSchedules');
      if (!response.ok) {
        throw new Error('Error fetching schedules');
      }
      const data = await response.json();
  
      // Formatear los horarios antes de establecerlos en el estado
      const formattedSchedules = data.map(schedule => {
        return {
          ...schedule,
          start_time: formatTime(schedule.start_time),
          end_time: formatTime(schedule.end_time)
        };
      });
  
      setSchedules(formattedSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      Alert.alert('Error', 'An error occurred while fetching schedules');
    }
  };
  
  // Función para formatear la hora en formato de 12 horas con AM/PM
  const formatTime = (time) => {
    // Separar las partes de la hora (hora, minutos, segundos)
    const [hour, minute] = time.split(':');
    // Convertir la hora a formato de 12 horas con AM/PM
    let formattedHour = parseInt(hour, 10);
    const ampm = formattedHour >= 12 ? 'PM' : 'AM';
    formattedHour = formattedHour % 12 || 12; // Si es 0, convertir a 12 en vez de 0
    // Concatenar las partes de la hora formateada
    const formattedTime = `${formattedHour}:${minute} ${ampm}`;
    return formattedTime;
  };
  
  
  

  const handleUpdateSchedule = async () => {
    if (!selectedSchedule) {
      Alert.alert('Error', 'Please select a schedule to update.');
      return;
    }

    // Validar que el campo "Day" solo contenga letras
    if (!/^[A-Za-z]+$/.test(nombre)) {
      Alert.alert('Error', 'Day should only contain letters.');
      return;
    }

    // Verificar si los datos son iguales al anterior
    if (
      selectedSchedule.day === nombre &&
      selectedSchedule.start_time === startTime &&
      selectedSchedule.end_time === endTime
    ) {
      Alert.alert('Error', 'Please make a change to update information.');
      return;
    }
  
    try {
      const response = await fetch(`http://172.20.10.3:3000/api/EFC_client/updateSchedules/${selectedSchedule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          day: nombre,
          start_time: startTime,
          end_time: endTime,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error updating schedule');
      }
  
      Alert.alert('Success', 'Schedule updated successfully.');
      fetchSchedules();
      setSelectedSchedule(null);
      setFieldsVisible(false);
    } catch (error) {
      console.error('Error updating schedule:', error);
      Alert.alert('Error', 'An error occurred while updating the schedule.');
    }
  };
  

  const handleCancel = () => {
    setNombre('');
    setStartTime('');
    setEndTime('');
    setSelectedSchedule(null);
    setFieldsVisible(false);
  };

  const handleSelectSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setNombre(schedule.day);
    setStartTime(schedule.start_time);
    setEndTime(schedule.end_time);
    setFieldsVisible(true);
  };

  const handleStartTimeConfirm = (time) => {
    // Formatear la hora seleccionada al formato de 12 horas con AM/PM
    const formattedTime = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    setStartTime(formattedTime);
    setStartTimePickerVisible(false);
  };
    
  const handleEndTimeConfirm = (time) => {
    // Formatear la hora seleccionada al formato de 12 horas con AM/PM
    const formattedTime = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    setEndTime(formattedTime);
    setEndTimePickerVisible(false);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Schedule Information</Text>
      <ScrollView style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Day</Text>
          <Text style={styles.headerCell}>Start Time</Text>
          <Text style={styles.headerCell}>End Time</Text>
          <Text style={styles.headerCell}></Text>
        </View>
        {schedules.map((schedule, index) => (
          <TouchableOpacity key={index} style={styles.row} onPress={() => handleSelectSchedule(schedule)}>
            <Text style={styles.cell}>{schedule.day}</Text>
            <Text style={styles.cell}>{schedule.start_time}</Text>
            <Text style={styles.cell}>{schedule.end_time}</Text>
            <Button title="Edit" onPress={() => handleSelectSchedule(schedule)} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {fieldsVisible && selectedSchedule && (
        <View style={styles.formContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Day:</Text>
            <TextInput
              placeholder='Day'
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Start Time:</Text>
            <TouchableOpacity onPress={() => setStartTimePickerVisible(true)}>
              <Text style={styles.timeText}>{startTime}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isStartTimePickerVisible}
              mode="time"
              onConfirm={handleStartTimeConfirm}
              onCancel={() => setStartTimePickerVisible(false)}
              textColor="#007bff"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>End Time:</Text>
            <TouchableOpacity onPress={() => setEndTimePickerVisible(true)}>
              <Text style={styles.timeText}>{endTime}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isEndTimePickerVisible}
              mode="time"
              onConfirm={handleEndTimeConfirm}
              onCancel={() => setEndTimePickerVisible(false)}
              textColor="#007bff"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={handleCancel} color="red" />
            <Button title="Update" onPress={handleUpdateSchedule} />
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
  },
  headerCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginLeft: 30,
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
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    width: 50,
    marginRight: 10,
    textAlign: 'left',
    fontSize: 16,
  },
  input: {
    flex: 2,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  timeText: {
    flex: 2,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    textAlignVertical: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default AcercaEditScreen;
