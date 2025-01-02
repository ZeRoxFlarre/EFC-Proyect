import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import Logo from '../../../assets/images/agua-removebg-preview.png';
import Logo1 from '../../../assets/images/Powerade.png';
import Logo2 from '../../../assets/images/Quest.png';
import Logo3 from '../../../assets/images/ProteinFairLife.png';
import Logo4 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/Screenshot 2024-04-24 at 3.53.00 PM.png';
import Logo5 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/Screenshot 2024-04-24 at 3.52.26 PM-fotor-bg-remover-2024043002011.png';

const StoreScreen = () => {
  const [productos, setProductos] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://172.20.10.3:3000/api/EFC_client/getAllProducts');
      if (!response.ok) {
        throw new Error('Error fetching products');
      }
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error(error);
      setProductos([]);
    }
  };

  const handleNombreChange = (text, index) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index].nombre = text;
    setProductos(nuevosProductos);
  };

  const handlePrecioChange = (text, index) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index].precio = text;
    setProductos(nuevosProductos);
  };

  const guardarCambios = async (id, nombre, precio, index) => {
    try {
      const productoActual = productos[index];
      if (nombre.trim() !== productoActual.nombre || parseFloat(precio) !== productoActual.precio) {
        const response = await fetch(`http://172.20.10.3:3000/api/EFC_client/updateProduct/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre, precio }),
        });
  
        if (!response.ok) {
          throw new Error('Error updating product');
        }
  
        const data = await response.json();
        console.log('Product updated successfully:', data);
        fetchProductos();
        Alert.alert('Changes saved successfully.');
      } else {
        Alert.alert('You need to make a change to update the product.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('An error occurred. Please try again later.');
    }
  };
  
  

  const addNewProduct = async () => {
    try {
      if (newProductName.trim() === '' || newProductPrice.trim() === '') {
        Alert.alert('Please enter both name and price to add a new product.');
        return;
      }
  
      const response = await fetch('http://172.20.10.7:3000/api/EFC_client/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: newProductName,
          precio: parseFloat(newProductPrice),
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error adding product');
      }
  
      const data = await response.json();
      console.log('Product added successfully:', data);
      fetchProductos();
      setNewProductName('');
      setNewProductPrice('');
      Alert.alert('Product added successfully.');
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('An error occurred while adding the product. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gym Store</Text>

      <Text style={styles.sectionTitle}>Add New Product</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={newProductName}
          onChangeText={setNewProductName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Price:</Text>
        <TextInput
          style={styles.input}
          value={newProductPrice}
          onChangeText={setNewProductPrice}
          keyboardType="numeric"
        />
      </View>

      <Button
        title="Add Product"
        onPress={addNewProduct}
      />

      <Text style={styles.sectionTitle}>Products</Text>
      {productos.map((producto, index) => (
        <View key={producto.id} style={styles.productoContainer}>
          <Image source={producto.id === 1 ? Logo : producto.id === 2 ? Logo1 : producto.id === 4 ?
             Logo2 : producto.id === 5 ? Logo3 :
             producto.id === 6 ? Logo5 : producto.id === 7 ? Logo4 :  null} style={styles.logo} /> 
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={producto.nombre}
              onChangeText={(text) => handleNombreChange(text, index)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price:</Text>
            <TextInput
              style={styles.input}
              value={producto.precio.toString()}
              onChangeText={(text) => handlePrecioChange(text, index)}
              keyboardType="numeric"
            />
          </View>

          <Button
            title="Save Changes"
            onPress={() => guardarCambios(producto.id, producto.nombre, producto.precio, index)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logo: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  productoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 15,
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
});

export default StoreScreen;
