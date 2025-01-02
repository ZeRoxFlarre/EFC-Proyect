import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

const EditEventScreen = () => {

    const navigation = useNavigation(); // Obtiene el objeto de navegación
    const onEditEvent = () => {
        navigation.navigate('EventEditScreen');
    };

    const onAddEvent = () => {
        navigation.navigate('EventAddScreen');
    };


    return (
        <View style={styles.container}>

            <Text style={styles.title}>Edit Event Screen</Text>
            <TouchableOpacity style={styles.button} onPress={onEditEvent}>
                <Feather name="edit" size={24} color="white" />
                <Text style={styles.buttonText}>Edit Event</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onAddEvent}>
                <Feather name="plus" size={24} color="white" />
                <Text style={styles.buttonText}>Add Event</Text>
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

export default EditEventScreen;
