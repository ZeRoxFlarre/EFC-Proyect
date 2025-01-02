import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable, Modal, Button, Image, StyleSheet, Dimensions } from 'react-native';
import Logo from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ChestImages/press-de-banca-con-barra-init-pos-3832.png';
import Logo2 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ChestImages/press-de-banca-inclinado-con-barra-init-pos-5432.png';
import Logo3 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ChestImages/press-pectoral-con-mancuernas-init-pos-7112.png';
import Logo4 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ChestImages/press-pectoral-con-mancuernas-en-banco-inclinado-init-pos-8206.png';
import Logo5 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ChestImages/pullover-con-disco-init-pos-5857.png';
import Logo6 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ChestImages/pullover-con-mancuernas-apoyando-la-espalda-en-un-banco-plano-init-pos-3416.png';
import Logo7 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ChestImages/aperturas-de-pectoral-con-mancuernas-en-banco-declinado-init-pos-8331.png';
import Logo8 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ChestImages/pajaros-de-pectoral-en-maquina-init-pos-4187.png';
import Logo9 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ChestImages/press-pectoral-en-maquina-sentado-init-pos-1729.png';
import Logo10 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ChestImages/press-de-banca-en-maquina-smith-init-pos-4883.png';
import Logo11 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ChestImages/fondos-en-paralelas-en-maquina-asistida-init-pos-4380.png';
const screenWidth = Dimensions.get('window').width;

const ChestScreen = () => {
  const [data, setData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false);
  const [numColumns, setNumColumns] = useState(2);

  useEffect(() => {
    const fetchChestExercises = async () => {
      try {
        const response = await fetch('http://172.20.10.7:3000/api/Exercise/getChestExercises');
        if (response.ok) {
          const chestExercises = await response.json();
          setData(chestExercises);
        } else {
          console.error('Error fetching chest exercises:', response.status);
        }
      } catch (error) {
        console.error('Error fetching chest exercises:', error);
      }
    };

    fetchChestExercises();
  }, []);

  const handleExercisePress = (exercise) => {
    setSelectedExercise(exercise); 
    setModalVisible(true); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chest Exercises</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {data.map((item, index) => (
          <Pressable key={item.ID} onPress={() => handleExercisePress(item)}>
            <View style={styles.buttonContainer}>
              <View style={styles.imageContainer}>
                <Image 
                  source={
                    index === 10 ? Logo11:
                    index === 9 ? Logo10 :
                    index === 8 ? Logo9 :
                    index === 7 ? Logo8 :
                    index === 6 ? Logo7 :
                    index === 5 ? Logo6 :
                    index === 4 ? Logo5 :
                    index === 3 ? Logo4 :
                    index === 2 ? Logo3 :
                    index === 1 ? Logo2 :
                    Logo
                  } 
                  style={styles.logo} 
                  resizeMode="contain" 
                />
              </View>
              <Text style={styles.exerciseName}>{item.Name}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, {fontWeight: 'bold'}]}>{selectedExercise?.Name}</Text>
            <Text style={styles.modalText}>Region: {selectedExercise?.Region}</Text>
            <Text style={styles.modalText}>Positioning: {selectedExercise?.Positioning}</Text>
            <Text style={styles.modalText}>Execution: {selectedExercise?.Execution}</Text>
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  scrollViewContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    width: screenWidth / 2 - 20,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 120, // Ajusta el tamaño de la imagen aquí
    height: 120, // Ajusta el tamaño de la imagen aquí
    marginBottom: 5,
  },
  exerciseName: {
    fontSize: 18,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 5,
  },
});

export default ChestScreen;
