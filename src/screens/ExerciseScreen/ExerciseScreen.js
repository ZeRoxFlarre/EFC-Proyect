import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native'; // Import Pressable and Image
import { useNavigation } from '@react-navigation/native';

const ExerciseScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.root}>
        <Text style={{ fontWeight: 'bold', fontSize: 25, margin: 20 }}>Choose a bodypart:</Text>

        <Pressable onPress={() => navigation.navigate('ChestScreen')}>
          <Image
            source={require('/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/chest-3a-seated-machine-chest-flye--4-sets-15-reps.jpg')}
            style={styles.image}
          />
          <Text style={styles.buttonText}>Chest</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('BackScreen')}>
          <Image
            source={require('/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/shutterstock_673719400_637e0012eec6f.jpeg')}
            style={styles.image}
          />
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('ShoulderScreen')}>
          <Image
            source={require('/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/shoulder-standing-d-press-490x326.jpg.webp')}
            style={styles.image}
          />
          <Text style={styles.buttonText}>Shoulders</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('BicepScreen')}>
          <Image
            source={require('/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/long_head_bicep_exercises_2000x.jpg.webp')}
            style={styles.image}
          />
          <Text style={styles.buttonText}>Biceps</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('TricepScreen')}>
          <Image
            source={require('/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/hero-image.fill.size_1248x702.v1710535646.jpg')}
            style={styles.image}
          />
          <Text style={styles.buttonText}>Triceps</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('LegScreen')}>
          <Image
            source={require('/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/gettyimages-867359800.jpg')}
            style={styles.image}
          />
          <Text style={styles.buttonText}>Legs</Text>
        </Pressable>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  root: {
    alignItems: 'center',
    padding: 30,
    margin: 15,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ExerciseScreen;