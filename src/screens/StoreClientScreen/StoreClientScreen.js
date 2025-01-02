import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Logo from '../../../assets/images/agua-removebg-preview.png';
import Logo1 from '../../../assets/images/Powerade.png';
import Logo2 from '../../../assets/images/Quest.png';
import Logo3 from '../../../assets/images/ProteinFairLife.png';
import Logo4 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/Screenshot 2024-04-24 at 3.53.00 PM.png';
import Logo5 from '/Users/vinre/Desktop/React-NativeApp fix  2/EFCMetro/assets/images/Screenshot 2024-04-24 at 3.52.26 PM-fotor-bg-remover-2024043002011.png';

const StoreScreen = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://172.20.10.3:3000/api/EFC_client/getAllProducts');
      if (!response.ok) {
        throw new Error('Error fetching products');
      }
      let data = await response.json();
      // Ordenar los productos alfabéticamente por nombre
      data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setProductos(data);
    } catch (error) {
      console.error(error);
      setProductos([]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.sectionTitle}>Products</Text>
      {productos.map((producto) => (
        <View key={producto.id} style={styles.productoContainer}>
          <Image source={getImageSource(producto.id)} style={styles.logo} /> 
          
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.text}>{producto.nombre}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.text}><>$</>{producto.precio}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const getImageSource = (productId) => {
  switch (productId) {
    case 1:
      return Logo;
    case 2:
      return Logo1;
    case 4:
      return Logo2;
    case 5:
      return Logo3;
    case 6:
      return Logo5;
    case 7:
      return Logo4;
    default:
      return null;
  }
};

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
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
  },
});

export default StoreScreen;
