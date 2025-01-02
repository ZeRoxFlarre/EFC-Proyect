import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable, Modal, Button, Image, StyleSheet, Dimensions } from 'react-native';
import Logo from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/TricepImages/extension-de-triceps-a-dos-manos-con-mancuerna-sentado-init-pos-4899.png';
import Logo2 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/TricepImages/extension-de-triceps-a-dos-manos-con-mancuerna-sentado-init-pos-4899.png';
import Logo3 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/TricepImages/extension-de-brazos-apoyado-en-banco-plano-init-pos-5153.png';
import Logo4 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/TricepImages/extension-de-triceps-con-una-mancuerna-de-pie-init-pos-2785.png';
import Logo5 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/TricepImages/extension-triceps-o-press-frances-con-barra-de-pie-init-pos-6325.png';
import Logo6 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/TricepImages/extension-de-triceps-de-pie-con-polea-alta-init-pos-2088.png';
import Logo7 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/TricepImages/extension-de-triceps-a-una-mano-con-cable-polea-init-pos-5917.png';
import Logo8 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/TricepImages/extension-inversa-triceps-cable-polea-init-pos-6338.png';

const screenWidth = Dimensions.get('window').width;

const TricepScreen = () => {
  const [data, setData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false);
  const [numColumns, setNumColumns] = useState(2);

  useEffect(() => {
    const fetchTricepExercises = async () => {
      try {
        const response = await fetch('http://172.20.10.7:3000/api/Exercise/getTricepExercises');
        if (response.ok) {
          const bicepExercises = await response.json();
          setData(bicepExercises);
        } else {
          console.error('Error fetching bicep exercises:', response.status);
        }
      } catch (error) {
        console.error('Error fetching bicep exercises:', error);
      }
    };

    fetchTricepExercises();
  }, []);

  const handleExercisePress = (exercise) => {
    setSelectedExercise(exercise); 
    setModalVisible(true); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tricep Exercises</Text>

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
    marginBottom: 5,
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

export default TricepScreen;
