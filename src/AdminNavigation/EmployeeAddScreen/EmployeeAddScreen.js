import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const EmployeeAddScreen = () => {
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newCategory, setNewCategory] = useState(0); // Default value for Inactive

  const handleAddEmployee = async () => {
    try {
      if (!newFirstName.trim() || !newLastName.trim() || !newPassword.trim()) {
        Alert.alert('Error', 'All fields are required. Please provide all the information.');
        return;
      }

      const response = await fetch('http://172.20.10.3:3000/api/EFC_client/addEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: newFirstName,
          last_name: newLastName,
          password: newPassword,
          category: newCategory,
        }),
      });

      if (!response.ok) {
        throw new Error('Error adding employee');
      }

      // Reset input fields after successful addition
      setNewFirstName('');
      setNewLastName('');
      setNewPassword('');
      setNewCategory(0); // Reset category to Inactive

      Alert.alert('Success', 'Employee added successfully');
    } catch (error) {
      console.error('Error adding employee:', error);
      Alert.alert('Error', 'An error occurred while adding employee');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Employee</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={styles.input}
          value={newFirstName}
          onChangeText={setNewFirstName}
          placeholder="Enter First Name"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={newLastName}
          onChangeText={setNewLastName}
          placeholder="Enter Last Name"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter Password"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Inactive"
          onPress={() => setNewCategory(0)}
          color={newCategory === 0 ? '#add8e6' : '#ccc'}
        />
        <Button
          title="Active"
          onPress={() => setNewCategory(1)}
          color={newCategory === 1 ? '#add8e6' : '#ccc'}
        />
      </View>
      <Button title="Add Employee" onPress={handleAddEmployee} />
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
    
    marginBottom: 20,
  },
});

export default EmployeeAddScreen;