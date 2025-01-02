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

const EmployeeUpdateScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newCategory, setNewCategory] = useState(0); // Default value for Inactive
  const [successMessage, setSuccessMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editTableVisible, setEditTableVisible] = useState(false);
  const [refresh, setRefresh] = useState(false); // State variable for screen refresh

  useEffect(() => {
    fetchEmployees();
  }, [refresh]); // Refresh the screen when the refresh state changes

  const fetchEmployees = () => {
    fetch('http://172.20.10.3:3000/api/EFC_client/getEmployees')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        return response.json();
      })
      .then(data => {
        setEmployees(data);
      })
      .catch(error => console.error('Error fetching employees:', error));
  };
  

  const handleUpdateEmployee = () => {
    if (!selectedEmployee) {
      console.error('No employee selected');
      return;
    }

    const { id } = selectedEmployee;

    fetch(`http://172.20.10.3:3000/api/EFC_client/updateEmployee/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: newFirstName,
        last_name: newLastName,
        password: newPassword,
        category: newCategory,
      })
    })
    .then(response => {
      if (response.ok) {
        console.log('Employee successfully updated');
        setSuccessMessage('Employee information updated successfully!');
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          setEditTableVisible(false);
          setRefresh(prevState => !prevState); // Toggle refresh state to trigger screen refresh
        }, 3000);
      } else {
        console.error('Error updating employee:', response.status, response.statusText);
      }
    })
    .catch(error => console.error('Error updating employee:', error));
  };

  const handleEmployeeSelection = (employee) => {
    setSelectedEmployee(employee);
    setNewFirstName(employee.first_name);
    setNewLastName(employee.last_name);
    setNewPassword(employee.password);
    setNewCategory(employee.category);
    setEditTableVisible(true);
  };

  const handleCancelEdit = () => {
    setEditTableVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => handleEmployeeSelection(item)}
    >
      <Text style={[styles.cell, styles.nameCell]}>{item.first_name} {item.last_name}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEmployeeSelection(item)}
      >
        <Text>Edit</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.first_name} ${employee.last_name}`;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="black" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for an employee"
        />
      </View>
      <Text style={styles.title}>Select an employee to update:</Text>
      <FlatList
        data={filteredEmployees}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.table}
      />
      {editTableVisible && (
        <>
          <Text style={styles.title}>Edit Employee:</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>First Name:</Text>
            <TextInput
              style={styles.input}
              value={newFirstName}
              onChangeText={setNewFirstName}
              placeholder="First Name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Last Name:</Text>
            <TextInput
              style={styles.input}
              value={newLastName}
              onChangeText={setNewLastName}
              placeholder="Last Name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password:</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Password"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category:</Text>
            <View style={styles.buttonContainer}>
              <Button onPress={() => setNewCategory(0)} title="Inactive" color={newCategory === 0 ? "#add8e6" : "#ccc"} />
              <Button onPress={() => setNewCategory(1)} title="Active" color={newCategory === 1 ? "#add8e6" : "#ccc"} />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={handleCancelEdit} title="Cancel" color="#FF0000" />
            <Button onPress={handleUpdateEmployee} title="Update Employee" />
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
    marginTop: 20,
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
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default EmployeeUpdateScreen;