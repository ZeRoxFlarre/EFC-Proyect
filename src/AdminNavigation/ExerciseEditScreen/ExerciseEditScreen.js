import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons'; // Importar Feather desde Expo

const ExerciseEditScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, margin: 20 }}>Admin Editing Tool:</Text>

      {/* Botón para editar ejercicios */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ExerciseUpdateScreen')}
      >
        <Feather name="edit" size={24} color="white" />
        <Text style={styles.buttonText}>Edit Exercises</Text>
      </TouchableOpacity>

      {/* Botón para añadir ejercicios */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ExerciseAddScreen')}
      >
        <Feather name="plus" size={24} color="white" />
        <Text style={styles.buttonText}>Add Exercises</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    margin: 15,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default ExerciseEditScreen;
