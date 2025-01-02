import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable, Modal, Button, Image, StyleSheet, Dimensions } from 'react-native';
import Logo from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ShoulderImages/press-frontal-de-hombro-con-barra-sentado-con-respaldo-init-pos-2734.png';
import Logo2 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ShoulderImages/aperturas-inversas-con-cable-polea-inclinado-adelante-init-pos-2723.png';
import Logo3 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ShoulderImages/press-de-hombros-con-mancuernas-sentado-init-pos-9901.png';
import Logo4 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ShoulderImages/aperturas-con-mancuernas-inclinado-adelante-init-pos-3231.png';
import Logo5 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ShoulderImages/elevacion-frontal-de-brazo-con-mancuerna-hasta-la-vertical-init-pos-7423.png';
import Logo6 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ShoulderImages/remo-al-cuello-con-mancuernas-init-pos-7926.png';
import Logo7 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ShoulderImages/remo-al-cuello-horizontal-con-cuerda-init-pos-1931.png';
import Logo8 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/ShoulderImages/aperturas-invertidas-agarre-vertical-init-pos-5261.png';

const screenWidth = Dimensions.get('window').width;

const ShoulderScreen = () => {
  const [data, setData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false);
  const [numColumns, setNumColumns] = useState(2);

  useEffect(() => {
    const fetchShoulderExercises = async () => {
      try {
        const response = await fetch('http://172.20.10.7:3000/api/Exercise/getShoulderExercises');
        if (response.ok) {
          const backExercises = await response.json();
          setData(backExercises);
        } else {
          console.error('Error fetching chest exercises:', response.status);
        }
      } catch (error) {
        console.error('Error fetching chest exercises:', error);
      }
    };

    fetchShoulderExercises();
  }, []);

  const handleExercisePress = (exercise) => {
    setSelectedExercise(exercise); 
    setModalVisible(true); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shoulder Exercises</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {data.map((item, index) => (
          <Pressable key={item.ID} onPress={() => handleExercisePress(item)}>
            <View style={styles.buttonContainer}>
              <View style={styles.imageContainer}>
                <Image 
                  source={
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
            <Text style={styles.modalTitle}>{selectedExercise?.Name}</Text>
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
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalText: {
    marginBottom: 8,
  },
});

export default ShoulderScreen;