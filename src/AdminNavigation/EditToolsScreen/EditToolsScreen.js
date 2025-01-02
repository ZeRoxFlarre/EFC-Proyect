import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

const AdminPanel = () => {
    const navigation = useNavigation(); // Obtiene el objeto de navegación

    const onSchedule = () => {
        navigation.navigate('AcercaEditScreen');
    };

    const onEditPersonal = () => {
        navigation.navigate('EditPersonal');
    };

    const onEditEvent = () => {
        navigation.navigate('EditEvent');
    };

    const onEditStore = () => {
        navigation.navigate('Store');
    };

    const onEditExercise = () => {
        navigation.navigate('ExerciseEditScreen');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Administration Panel</Text>
            <TouchableOpacity style={styles.button} onPress={onEditPersonal}>
                <FontAwesome5 name="user" size={24} color="white" />
                <Text style={styles.buttonText}>Edit Personal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onEditEvent}>
                <FontAwesome5 name="calendar" size={24} color="white" />
                <Text style={styles.buttonText}>Edit Event</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onSchedule}>
                <FontAwesome5 name="clock" size={24} color="white" />
                <Text style={styles.buttonText}>Change Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onEditStore}>
                <FontAwesome5 name="store" size={24} color="white" />
                <Text style={styles.buttonText}>Edit Store</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onEditExercise}>
                <FontAwesome5 name="dumbbell" size={24} color="white" />
                <Text style={styles.buttonText}>Edit Exercise</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Alinea los elementos horizontalmente
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginVertical: 10,
        width: '80%', // Ancho del 80% del contenedor
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        marginLeft: 10,
    },
});

export default AdminPanel;
