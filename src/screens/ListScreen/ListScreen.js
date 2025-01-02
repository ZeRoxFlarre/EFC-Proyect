import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

export default function QRCodeScreen() {
  const route = useRoute();
  const [formattedTimestamps, setFormattedTimestamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderByDesc, setOrderByDesc] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const tableTitle = 'Gym Entry Time';

  useEffect(() => {
    const { email } = route.params;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://172.20.10.3:3000/api/EFC_client/getIDByEmail/${email}`);

        if (!response.ok) {
          throw new Error('No checking in data found');
        }

        const { timestamps } = await response.json();

        let filteredTimestamps = timestamps;
        if (selectedMonth && selectedYear) {
          const targetDate = new Date(selectedYear, selectedMonth, 1);
          filteredTimestamps = timestamps.filter(timestamp => {
            const timestampDate = new Date(timestamp);
            return timestampDate.getMonth() === targetDate.getMonth() && timestampDate.getFullYear() === targetDate.getFullYear();
          });
        }

        const groupedTimestamps = filteredTimestamps.reduce((acc, curr) => {
          const dateKey = new Date(curr).toLocaleDateString();
          if (!acc[dateKey] || new Date(acc[dateKey]).getTime() > new Date(curr).getTime()) {
            acc[dateKey] = curr;
          }
          return acc;
        }, {});

        const formattedTimestamps = Object.values(groupedTimestamps).map((timestamp, index) => ({
          entry: index + 1,
          timestamp: new Date(timestamp).toLocaleString()
        }));

        const sortedTimestamps = orderByDesc
          ? formattedTimestamps.sort((a, b) => b.entry - a.entry)
          : formattedTimestamps.sort((a, b) => a.entry - b.entry);

        setFormattedTimestamps(sortedTimestamps);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [route.params, orderByDesc, selectedMonth, selectedYear]);

  const handleToggleOrderBy = () => {
    setOrderByDesc(!orderByDesc);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{"No checking in data found"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tableTitle}</Text>
      <TouchableOpacity style={styles.orderButton} onPress={handleToggleOrderBy}>
        <Text style={styles.orderButtonText}>
          Order by {orderByDesc ? 'Highest to Lowest Entry Number' : 'Lowest to Highest Entry Number'}
        </Text>
      </TouchableOpacity>
      <View style={styles.filtersContainer}>
        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => handleMonthChange(itemValue)}
        >
          <Picker.Item label="Select Month" value="" />
          {Array.from({ length: 12 }).map((_, monthIndex) => (
            <Picker.Item key={monthIndex} label={new Date(2000, monthIndex, 1).toLocaleString('default', { month: 'long' })} value={monthIndex.toString()} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => handleYearChange(itemValue)}
        >
          <Picker.Item label="Select Year" value="" />
          {Array.from({ length: 10 }, (_, index) => new Date().getFullYear() - index).map((year) => (
            <Picker.Item key={year} label={year.toString()} value={year.toString()} />
          ))}
        </Picker>
      </View>
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell]}>No.</Text>
          <Text style={[styles.cell, styles.headerCell]}>Entry Time</Text>
        </View>
        <FlatList
          data={formattedTimestamps}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{item.entry}</Text>
              <Text style={styles.cell}>{item.timestamp}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderButton: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 110, // Reducir el espacio entre los pickers y las fechas
    marginTop: 10, // Mover un poco hacia arriba las fechas
  },
  
  picker: {
    flex: 1,
    height: 30,
    marginRight: 10,
    marginBottom: 30, // Agregar margen inferior
    borderRadius: 5,
    borderColor: '#888',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  
  
  table: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerRow: {
    backgroundColor: '#ccc',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
  },
});
