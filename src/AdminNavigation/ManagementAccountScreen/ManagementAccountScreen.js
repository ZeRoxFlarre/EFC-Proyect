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
import { Ionicons } from '@expo/vector-icons'; // Importar Ionicons
import { useRoute } from '@react-navigation/native'; // Importar useRoute

const ManagementAccountScreen = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newMembershipStatus, setNewMembershipStatus] = useState(false);
  const [newCategory, setNewCategory] = useState('Student');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newStartDateText, setNewStartDateText] = useState('');
  const [newEndDateText, setNewEndDateText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editTableVisible, setEditTableVisible] = useState(false);

  const route = useRoute(); // Initialize route

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    fetch('http://172.20.10.3:3000/api/EFC_client/ClientsUpdate')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => console.error('Error fetching clients:', error));
  };

  const handleUpdateClient = () => {
    if (!selectedClient) {
      console.error('No client selected');
      return;
    }
  
    const { id } = selectedClient;
  
    const formattedStartDate = newStartDateText ? new Date(newStartDateText).toISOString().slice(0, 19).replace('T', ' ') : null;
    const formattedEndDate = newEndDateText ? new Date(newEndDateText).toISOString().slice(0, 19).replace('T', ' ') : null;
  
    const membershipStatus = newMembershipStatus ? 'Active' : 'Inactive';
  
    fetch(`http://172.20.10.3:3000/api/EFC_client/Update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: newFirstName,
        last_name: newLastName,
        email: newEmail,
        category: newCategory,
        phone: newPhone,
        membership_status: membershipStatus,
        start_date: formattedStartDate,
        end_date: formattedEndDate
      })
    })
    .then(response => {
      if (response.ok) {
        console.log('Client successfully updated');
        setSuccessMessage('Client information updated successfully!');
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          setEditVisible(false);
          setEditTableVisible(false);
        }, 3000);
  
        if (route.params && route.params.id) {
          // Fetch para agregar el cambio al historial
          const changeTime = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
          fetch(`http://172.20.10.3:3000/api/EFC_client/History/${id}/${route.params.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              changeTime: changeTime
            })
          })
          .then(response => {
            if (response.ok) {
              console.log('Change added to history successfully');
            } else {
              console.error('Error adding change to history:', response.status, response.statusText);
            }
          })
          .catch(error => console.error('Error adding change to history:', error));
        }
      } else {
        console.error('Error updating client:', response.status, response.statusText);
      }
    })
    .catch(error => console.error('Error updating client:', error));
  };

  const handleClientSelection = (client) => {
    setSelectedClient(client);
    setNewFirstName(client.first_name);
    setNewLastName(client.last_name);
    setNewEmail(client.email);
    setNewPhone(client.phone);
    setNewMembershipStatus(client.membership_status);
  
    switch (client.category) {
      case 2:
        setNewCategory('Faculty');
        break;
      case 1:
        setNewCategory('Student');
        break;
      case 0:
        setNewCategory('External');
        break;
      default:
        setNewCategory('Student');
        break;
    }
  
    setNewStartDate(client.start_date);
    setNewEndDate(client.end_date);
    setNewStartDateText(formatDateTime(client.start_date));
    setNewEndDateText(formatDateTime(client.end_date));
    setEditTableVisible(true);
  };
  
  

  const handleCancelEdit = () => {
    setEditTableVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => handleClientSelection(item)}
    >
      <Text style={[styles.cell, styles.nameCell]}>{item.first_name} {item.last_name}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleClientSelection(item)}
      >
        <Text>Edit</Text>
      </TouchableOpacity>
     
      {selectedClient && selectedClient.id === item.id && (
        <View style={styles.selectedCategoryIndicator}></View>
      )}
    </TouchableOpacity>
  );

  const filteredClients = clients.filter(client => {
    const fullName = `${client.first_name} ${client.last_name}`;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="black" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for a client"
        />
      </View>
      <Text style={styles.title}>Select a client to update:</Text>
      <FlatList
        data={filteredClients}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.table}
      />
      {editTableVisible && (
        <>
          <Text style={styles.title}>Edit Client:</Text>
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
            <Text style={styles.inputLabel}>Email:</Text>
            <TextInput
              style={styles.input}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Email"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category:</Text>
            <View style={styles.categoryButtons}>
              <TouchableOpacity
                style={[styles.categoryButton, newCategory === 'Student' && styles.selectedCategoryButton]}
                onPress={() => setNewCategory('Student')}
              >
                <Text style={styles.categoryButtonText}>Student</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryButton, newCategory === 'Faculty' && styles.selectedCategoryButton]}
                onPress={() => setNewCategory('Faculty')}
              >
                <Text style={styles.categoryButtonText}>Faculty</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryButton, newCategory === 'External' && styles.selectedCategoryButton]}
                onPress={() => setNewCategory('External')}
              >
                <Text style={styles.categoryButtonText}>External</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone:</Text>
            <TextInput
              style={styles.input}
              value={newPhone}
              onChangeText={setNewPhone}
              placeholder="Phone"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Membership Status:</Text>
            <View style={styles.membershipButtons}>
              <TouchableOpacity
                style={[styles.membershipButton, newMembershipStatus && styles.selectedMembershipButton]}
                onPress={() => setNewMembershipStatus(true)}
              >
                <Text style={styles.membershipButtonText}>Active</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.membershipButton, !newMembershipStatus && styles.selectedMembershipButton]}
                onPress={() => setNewMembershipStatus(false)}
              >
                <Text style={styles.membershipButtonText}>Inactive</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Start Date:</Text>
            <TextInput
              style={styles.input}
              value={newStartDateText}
              onChangeText={setNewStartDateText}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>End Date:</Text>
            <TextInput
              style={styles.input}
              value={newEndDateText}
              onChangeText={setNewEndDateText}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={handleCancelEdit} title="Cancel" color="#FF0000" />
            <Button onPress={handleUpdateClient} title="Update Client" />
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

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
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
    width: 100,
  
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
    marginTop: 40,
  },
  categoryButtons: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: '#add8e6',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 30,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: '#4CAF50',
  },
  categoryButtonText: {
    color: 'white',
  },
  membershipButtons: {
    flexDirection: 'row',
  },
  membershipButton: {
    backgroundColor: '#add8e6',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedMembershipButton: {
    backgroundColor: '#4CAF50',
  },
  membershipButtonText: {
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: 30,
  },
  selectedCategoryIndicator: {
    backgroundColor: 'green',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default ManagementAccountScreen;
