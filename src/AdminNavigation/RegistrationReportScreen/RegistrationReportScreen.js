import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableHighlight, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Print from 'expo-print';

// Función para formatear la fecha
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Obtiene el mes como un número
    const formattedMonth = month < 10 ? `${month}` : month; // Elimina el cero inicial si es menor que 10
    const day = date.getDate(); // No necesitas formatear aquí
    const formattedDay = day < 10 ? `${day}` : day; // Elimina el cero inicial si es menor que 10
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM'; // Determina si es AM o PM
    const twelveHourFormat = hours % 12 || 12; // Convierte la hora a formato de 12 horas
    const formattedHours = twelveHourFormat.toString().padStart(2, '0'); // Formatea las horas
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Formatea los minutos
    return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${minutes} ${ampm}`;
};



// Función para obtener los informes de clientes
const fetchClientReports = async () => {
    try {
        const response = await fetch('http://172.20.10.3:3000/api/EFC_client/Report');
        const data = await response.json();
        console.log('Client Reports data:', data);
        return data.map(client => ({
            RegistroCliente_id: client.RegistroCliente_id,
            RegistroCliente_timestamp: formatDate(client.RegistroCliente_timestamp),
            name: `${client.first_name} ${client.last_name}`,
            category: client.category,
            phone: client.phone
        }));
    } catch (error) {
        console.error('Error fetching client reports:', error);
        return [];
    }
};

// Variable para almacenar el nombre del filtro y su valor seleccionado
const filterLabels = {
    'All': 'All Clients',
    'Internal': 'Internal Clients',
    'External': 'External Clients'
};

// Función para obtener la descripción de todos los filtros seleccionados
const getFilterDescription = (filter, selectedDay, selectedMonth, selectedYear, selectedWeek, selectedFromMonth, selectedToMonth) => {
    const filterDescriptions = [
        { name: 'Filter', value: filterLabels[filter] },
        { name: 'Day', value: selectedDay },
        { name: 'Month', value: selectedMonth },
        { name: 'Year', value: selectedYear },
        { name: 'Week', value: selectedWeek },
        { name: 'From Month', value: selectedFromMonth },
        { name: 'To Month', value: selectedToMonth }
    ];

    // Filtrar solo los filtros que están en uso
    const usedFilters = filterDescriptions.filter(filter => filter.value !== 'All');

    // Construir la descripción de los filtros
    const filterDescription = usedFilters.map(filter => `${filter.name}: ${filter.value}`).join(', ');

    return filterDescription;
};

// Componente de la pantalla de lista de clientes
const ClientListScreen = () => {
    const [clientReports, setClientReports] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [filter, setFilter] = useState('All');
    const [selectedDay, setSelectedDay] = useState('All');
    const [selectedMonth, setSelectedMonth] = useState('All');
    const [selectedYear, setSelectedYear] = useState('All');
    const [selectedWeek, setSelectedWeek] = useState('All');
    const [selectedFromMonth, setSelectedFromMonth] = useState('All'); // Nuevo estado
    const [selectedToMonth, setSelectedToMonth] = useState('All'); //
    const [clientTimestamps, setClientTimestamps] = useState([]);
    const [showFilters, setShowFilters] = useState(false); // Estado para mostrar/ocultar los filtros

    useEffect(() => {
        const fetchReports = async () => {
            const reportsData = await fetchClientReports();
            setClientReports(reportsData);
        };
        
        fetchReports();
    }, []);

    // Función para aplicar el filtro
    const applyFilter = (clients) => {
        let filteredClients = clients;

        if (filter !== 'All') {
            filteredClients = filteredClients.filter(client => client.category === filter);
        }

        if (selectedDay !== 'All') {
            filteredClients = filteredClients.filter(client => {
                const day = client.RegistroCliente_timestamp.split(' ')[0].split('-')[2];
                return day === selectedDay;
            });
        }

        if (selectedMonth !== 'All') {
            filteredClients = filteredClients.filter(client => {
                const month = client.RegistroCliente_timestamp.split(' ')[0].split('-')[1];
                return month === selectedMonth;
            });
        }

        if (selectedYear !== 'All') {
            filteredClients = filteredClients.filter(client => {
                const year = client.RegistroCliente_timestamp.split(' ')[0].split('-')[0];
                return year === selectedYear;
            });
        }

        if (selectedWeek !== 'All') {
            filteredClients = filteredClients.filter(client => {
                const week = getWeekNumber(new Date(client.RegistroCliente_timestamp));
                return week === parseInt(selectedWeek);
            });
        }

        if (selectedFromMonth !== 'All' && selectedToMonth !== 'All') {
            filteredClients = filteredClients.filter(client => {
                const month = parseInt(client.RegistroCliente_timestamp.split(' ')[0].split('-')[1]);
                return month >= parseInt(selectedFromMonth) && month <= parseInt(selectedToMonth);
            });
        }

        return filteredClients;
    };

    // Función para obtener el número de semana de una fecha
    const getWeekNumber = (date) => {
        const onejan = new Date(date.getFullYear(), 0, 1);
        const millisecsInDay = 86400000;
        return Math.ceil((((date - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7);
    };

    // Manejar el evento de presionar un cliente
    const handleClientPress = (client) => {
        setSelectedClient(client);
        const timestamps = clientReports.filter(report => report.name === client.name).map(report => report.RegistroCliente_timestamp);
        setClientTimestamps(timestamps);
        setModalVisible(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setModalVisible(false);
        setSelectedClient(null);
        setClientTimestamps([]);
    };

    // Función para imprimir el reporte
    const handlePrintReport = async () => {
        // Obtener la fecha y hora actual
        const currentTimeStamp = formatDate(Date.now());
        // Obtener la descripción de los filtros seleccionados
        const filterDescription = getFilterDescription(filter, selectedDay, selectedMonth, selectedYear, selectedWeek, selectedFromMonth, selectedToMonth);

        // Construir el contenido del reporte en HTML
        const reportContent = applyFilter(clientReports)
            .map(client => `
                <div style="max-width: 600px; margin: 0 auto; margin-bottom: 20px;">
                    <h2>ID: ${client.RegistroCliente_id}</h2>
                    <p><strong>Name:</strong> ${client.name}</p>
                    <p><strong>Category:</strong> ${client.category}</p>
                    <p><strong>Phone:</strong> ${client.phone}</p>
                    <p><strong>Entry Hour:</strong> ${client.RegistroCliente_timestamp}</p>
                </div>
                <hr style="border-top: 2px solid #000;">
            `)
            .join('');
        
        // Estilos CSS para el contenido del reporte
        const htmlStyles = `
            <style>
                body { font-family: Arial, sans-serif; }
                h1 { text-align: center; } /* Estilo para centrar el título */
                h2 { font-size: 20px; margin-top: 0; }
                p { margin: 5px 0; }
            </style>
        `;
        
        // Agregar el título "EFC Reports" centrado arriba del reporte
        const htmlWithTitle = `
            <html>
            <head>
                <title>EFC Reports</title>
                ${htmlStyles}
            </head>
            <body>
                <h1>EFC Reports</h1>
                <p>${filterDescription}</p> <!-- Agregar la descripción de los filtros -->
                ${reportContent}
                <p>Printed at: ${currentTimeStamp}</p>
            </body>
            </html>
        `;

        // Imprimir el reporte
        try {
            await Print.printAsync({
                html: htmlWithTitle,
            });
        } catch (error) {
            console.error('Error al imprimir el reporte:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.filterButtonContainer}>
                    <Button
                        title="Filter"
                        onPress={() => setShowFilters(!showFilters)} // Alternar entre mostrar u ocultar los filtros
                    />
                </View>
                {showFilters && ( // Mostrar los filtros solo cuando showFilters sea verdadero
                    <>
                        <View style={styles.filterContainer}>
                            <Picker
                                selectedValue={filter}
                                onValueChange={(itemValue, itemIndex) => setFilter(itemValue)}
                                style={styles.filterPicker}
                            >
                                <Picker.Item label="All Clients" value="All" />
                                <Picker.Item label="Internal Clients" value="Internal" />
                                <Picker.Item label="External Clients" value="External" />
                            </Picker>
                        </View>
                        <View style={styles.filterContainer}>
                            <Picker
                                selectedValue={selectedDay}
                                onValueChange={(itemValue, itemIndex) => setSelectedDay(itemValue)}
                                style={styles.filterPicker}
                            >
                                <Picker.Item label="All Days" value="All" />
                                {[...Array(31).keys()].map(day => (
                                    <Picker.Item key={day} label={String(day + 1)} value={String(day + 1)} />
                                ))}
                            </Picker>
                            <Picker
                                selectedValue={selectedMonth}
                                onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}
                                style={styles.filterPicker}
                            >
                                <Picker.Item label="All Months" value="All" />
                                {[...Array(12).keys()].map(month => (
                                    <Picker.Item key={month} label={String(month + 1)} value={String(month + 1)} />
                                ))}
                            </Picker>
                            <Picker
                                selectedValue={selectedYear}
                                onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
                                style={styles.filterPicker}
                            >
                                <Picker.Item label="All Years" value="All" />
                                {[...Array(10).keys()].map(year => (
                                    <Picker.Item key={year} label={String(2022 + year)} value={String(2022 + year)} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.filterContainer}>
                            <Picker
                                selectedValue={selectedWeek}
                                onValueChange={(itemValue, itemIndex) => setSelectedWeek(itemValue)}
                                style={styles.filterPicker}
                            >
                                <Picker.Item label="All Weeks" value="All" />
                                {[...Array(52).keys()].map(week => (
                                    <Picker.Item key={week} label={String(week + 1)} value={String(week + 1)} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.filterContainer}>
                            <Picker
                                selectedValue={selectedFromMonth}
                                onValueChange={(itemValue, itemIndex) => setSelectedFromMonth(itemValue)}
                                style={styles.filterPicker}
                            >
                                <Picker.Item label="From Month" value="All" />
                                {[...Array(12).keys()].map(month => (
                                    <Picker.Item key={month} label={String(month + 1)} value={String(month + 1)} />
                                ))}
                            </Picker>
                            <Picker
                                selectedValue={selectedToMonth}
                                onValueChange={(itemValue, itemIndex) => setSelectedToMonth(itemValue)}
                                style={styles.filterPicker}
                            >
                                <Picker.Item label="To Month" value="All" />
                                {[...Array(12).keys()].map(month => (
                                    <Picker.Item key={month} label={String(month + 1)} value={String(month + 1)} />
                                ))}
                            </Picker>
                        </View>
                    </>
                )}
                <Text style={styles.title}>Registration Report</Text>
                <ScrollView>
                    <View style={styles.tableContainer}>
                        <View style={styles.table}>
                            <View style={styles.headerRow}>
                                <Text style={[styles.cell, styles.headerCell]}>ID</Text>
                                <Text style={[styles.cell, styles.headerCell]}>Name</Text>
                                <Text style={[styles.cell, styles.headerCell]}>Category</Text>
                                <Text style={[styles.cell, styles.headerCell]}>Phone</Text>
                                <Text style={[styles.cell, styles.headerCell]}>Entry Hour</Text>
                            </View>
                            {applyFilter(clientReports).map((client, index) => (
                                <TouchableHighlight 
                                    key={`${client.RegistroCliente_id}_${index}`} 
                                    onPress={() => handleClientPress(client)}
                                    underlayColor="#f2f2f2"
                                >
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.dataCell]}>{client.RegistroCliente_id}</Text>
                                        <Text style={[styles.cell, styles.dataCell]}>{client.name}</Text>
                                        <Text style={[styles.cell, styles.dataCell]}>{client.category}</Text>
                                        <Text style={[styles.cell, styles.dataCell]}>{client.phone}</Text>
                                        <Text style={[styles.cell, styles.dataCell]}>{client.RegistroCliente_timestamp}</Text>
                                    </View>
                                </TouchableHighlight>
                            ))}
                        </View>
                    </View>
                </ScrollView>
                
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Timestamps for {selectedClient && selectedClient.name}</Text>
                            {clientTimestamps.map((timestamp, index) => (
                                <View key={index} style={styles.modalInfo}>
                                    <Text style={styles.modalLabel}>{index + 1}:</Text>
                                    <Text style={styles.modalValue}>{timestamp}</Text>
                                </View>
                            ))}
                            <TouchableHighlight
                                style={styles.closeButton}
                                onPress={closeModal}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableHighlight>
                        </View>
                        
                    </View>
                </Modal>

                <Button
                    title="Print Report"
                    onPress={handlePrintReport}
                />
                
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 30,
        paddingHorizontal: 5,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    tableContainer: {
        marginLeft: 5,
        marginRight: 5,
    },
    table: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderColor: '#000',
    },
    headerCell: {
        flex: 2,
        paddingVertical: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        verticalAlign: 'middle',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingVertical: 15,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        paddingVertical: 12,
    },
    dataCell: {
        flex: 2,
    },
    filterButtonContainer: {
        marginBottom: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    filterPicker: {
        flex: 1,
        height: 60,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    modalValue: {
        fontSize: 18,
    },
    closeButton: {
        backgroundColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 10,
        marginTop: 20,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ClientListScreen;
