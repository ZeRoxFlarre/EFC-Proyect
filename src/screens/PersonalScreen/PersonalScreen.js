import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const PersonalScreen = () => {
  const [bossData, setBossData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchPersonal();
  }, []);

  const fetchPersonal = async () => {
    try {
      const response = await fetch('http://172.20.10.3:3000/api/EFC_client/getAllPersonal');
      if (!response.ok) {
        throw new Error('Error fetching personal');
      }
      const data = await response.json();
      // Filter data for Boss and Staff
      const boss = data.filter(item => item.id === 1 && item.Working === "Active");
      const staff = data.filter(item => item.id !== 1 && item.Working === "Active");
      setBossData(boss);
      setStaffData(staff);
    } catch (error) {
      console.error(error);
      setBossData([]);
      setStaffData([]);
    }
  };

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return "N/A";
    }
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);
    return `${formattedStartTime} - ${formattedEndTime}`;
  };
  

  const formatTime = (time) => {
    const hours = parseInt(time.substring(0, 2));
    const minutes = time.substring(3, 5);
    const meridiem = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${meridiem}`;
  };

  const renderBossItems = () => {
    return bossData.map(item => (
      <TouchableOpacity key={item.id} onPress={() => handleEmployeePress(item)}>
        <View style={styles.row}>
          <Text style={styles.cell}>{item.nombre}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  const renderStaffItems = () => {
    return staffData.map(item => (
      <TouchableOpacity key={item.id} onPress={() => handleEmployeePress(item)}>
        <View style={styles.row}>
          <Text style={styles.cell}>{item.nombre}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  const handleEmployeePress = (employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Information</Text>
      <View style={styles.table}>
        <Text style={styles.sectionTitle}>Boss</Text>
        <View style={styles.divider} />
        {renderBossItems()}
      </View>
      <ScrollView style={styles.table}>
        <Text style={styles.sectionTitle}>Staff</Text>
        <View style={styles.divider} />
        {renderStaffItems()}
      </ScrollView>

     
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Employee Details</Text>
            <Text>Name: {selectedEmployee?.nombre}</Text>
            <Text>Email: {selectedEmployee?.email}</Text>
            <Text>Schedule: {formatTimeRange(selectedEmployee?.start_time, selectedEmployee?.end_time)}</Text>
            <Text>Day Work: {selectedEmployee?.DayOfWeek}</Text>
            <Text>Working: {selectedEmployee?.Working}</Text> 
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
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
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  closeButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default PersonalScreen;
