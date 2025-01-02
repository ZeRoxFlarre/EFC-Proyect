import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/FontAwesome6';
import Ico from 'react-native-vector-icons/MaterialIcons';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConfirmEmailScreen from '../screens/ConfirmEmailScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen/ForgotPasswordScreen';
import QRCode from '../screens/QRcode/QRScreen';
import AcercaScreen from "../screens/AcercaScreen";
import PersonalScreen from "../screens/PersonalScreen";
import AdminScreen from '../AdminNavigation/AdminScreen';
import ScannerQR from '../AdminNavigation/ScannerScreen';
import AccountClientsScreen from '../AdminNavigation/AccountClientsScreen/AccountClientsScreen';
import ManagementAccountScreen from '../AdminNavigation/ManagementAccountScreen/ManagementAccountScreen';
import RegistrationReportScreen from '../AdminNavigation/RegistrationReportScreen';
import StoreScreen from '../AdminNavigation/StoreScreen';
import StoreClientScreen from '../screens/StoreClientScreen';
import EventScreen from '../screens/EventScreen ';
import EventAddScreen from '../AdminNavigation/EventAddScreen';
import EventEditScreen from '../AdminNavigation/EventEditScreen';
import AcercaEditScreen from '../AdminNavigation/AcercaEditScreen';
import PersonalEditScreen from '../AdminNavigation/PersonalEditScreen';
import PersonalAddScreen from '../AdminNavigation/PersonalAddScreen/PersonalAddScreen';
import ListScreen from '../screens/ListScreen';
import EditToolsScreen from '../AdminNavigation/EditToolsScreen';
import EditPersonalScreen from '../AdminNavigation/EditPersonalScreen';
import EditEventScreen from '../AdminNavigation/EditEventScreen';
import ExerciseScreen from '../screens/ExerciseScreen/ExerciseScreen';
import BackScreen from '../screens/BackScreen/BackScreen';
import BicepScreen from '../screens/BicepsScreen/BicepScreen';
import ChestScreen from '../screens/ChestScreen/ChestScreen';
import LegScreen from '../screens/LegScreen/LegScreen';
import ShoulderScreen from '../screens/ShoulderScreen/ShoulderScreen'
import TricepScreen from '../screens/TricepScreen/TricepScreen';
import ExerciseEditScreen from '../AdminNavigation/ExerciseEditScreen';
import ExerciseAddScreen from '../AdminNavigation/ExerciseAddScreen/ExerciseAddScreen';
import ExerciseUpdateScreen from '../AdminNavigation/ExercisesUpdateScreen/ExerciseUpdateScreen';
import EmployeeScreen from '../AdminNavigation/EmployeeScreen';
import EmployeeEditScreen from '../AdminNavigation/EmployeeEditScreen';
import EmployeeEdits from '../AdminNavigation/EmployeeEdit/EmployeeEdit';
import EmployeeAddScreen from '../AdminNavigation/EmployeeAddScreen';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
 
     
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      <Stack.Screen name="ChestScreen" component={ChestScreen} />
      <Stack.Screen name="Exercise" component={ExerciseScreen} />
      <Stack.Screen name="Admin" component={AdminScreen} /> 
      <Stack.Screen name="Employee" component={EmployeeScreen} />
      <Stack.Screen name="AccountClients" component={AccountClientsScreen} />
      <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="QRcode" component={DrawerStack} />
      <Stack.Screen name="ScannerQR" component={ScannerQR} />
      <Stack.Screen name="RegistrationReport" component={RegistrationReportScreen} />
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="StoreClient" component={StoreClientScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ListScreen" component={ListScreen} />
      <Stack.Screen name="AcercaScreen" component={AcercaScreen} />
      <Stack.Screen name="ManagementAccount" component={ManagementAccountScreen} />
      <Stack.Screen name="Personal" component={PersonalScreen} />
      <Stack.Screen name="PersonalAddScreen" component={PersonalAddScreen} />
      <Stack.Screen name="PersonalEditScreen" component={PersonalEditScreen} />
      <Stack.Screen name="EditTools" component={EditToolsScreen} />
      <Stack.Screen name="EventAddScreen" component={EventAddScreen} />
      <Stack.Screen name="EventEditScreen" component={EventEditScreen} />
      <Stack.Screen name="AcercaEditScreen" component={AcercaEditScreen} />
      <Stack.Screen name="EditPersonal" component={EditPersonalScreen} />
      <Stack.Screen name="EditEvent" component={EditEventScreen} />
      <Stack.Screen name="BackScreen" component={BackScreen} />
      <Stack.Screen name="BicepScreen" component={BicepScreen} />
      <Stack.Screen name="LegScreen" component={LegScreen} />
      <Stack.Screen name="ShoulderScreen" component={ShoulderScreen} />
      <Stack.Screen name="TricepScreen" component={TricepScreen} />
      <Stack.Screen name="ExerciseEditScreen" component={ExerciseEditScreen} />
      <Stack.Screen name="ExerciseAddScreen" component={ExerciseAddScreen} />
      <Stack.Screen name="ExerciseUpdateScreen" component={ExerciseUpdateScreen} />       
      <Stack.Screen name="EmployeeAddScreen" component={EmployeeAddScreen} />
      <Stack.Screen name="EmployeeEdit" component={EmployeeEdits} />
      <Stack.Screen name="EmployeeEditScreen" component={EmployeeEditScreen} />
    </Stack.Navigator>
  );
};

const DrawerStack = ({ route }) => {
  const { email } = route.params;
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation(); // Obtiene la navegación

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://172.20.10.7:3000/api/EFC_client/Clients?email=${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [email]);

  const handleLogout = () => {
    navigation.navigate('SignIn');
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <View style={styles.header}>
            <FontAwesome name="user-circle-o" size={35} color="#fff" style={styles.icon} /> 
            <Text style={styles.headerText}>
              {userData ? `${userData.first_name} ${userData.last_name}` : 'Encabezado del Drawer'}
            </Text>
          </View>
          <DrawerItemList {...props} />
          <TouchableOpacity onPress={handleLogout} style={styles.logout}>
            <Icon name="sign-out" size={24} color="#000" />
            <Text style={styles.logoutText}>LogOut</Text>
          </TouchableOpacity>
        </DrawerContentScrollView>
      )}
      drawerContentContainerStyle={{ paddingTop: 20, borderColor: 'red', borderWidth: 1 }}
    >
      <Drawer.Screen
        name="QRcodes"
        initialParams={{ email }}
        component={QRCode}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="qrcode" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Gym Attendance List" 
        initialParams={{ email }}
        component={ListScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <FontAwesome6 name="clipboard-list" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Exercises" 
        component={ExerciseScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <Icons name="dumbbell" size={size} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="About-us" 
        component={AcercaScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <Icon name="info-circle" size={size} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Personal" 
        component={PersonalScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <Icons name="people-group" size={size} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Announcement" 
        component={EventScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <Ico name="announcement" size={size} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Gym Store" 
        component={StoreClientScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <Ico name="store" size={size} color={color} />
          ),
        }} 
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#3b5998', // Color de Facebook
    flexDirection: 'row', // Alineación horizontal
    alignItems: 'center', // Centrar verticalmente
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Color de texto blanco
    marginLeft: 10, // Espacio entre el icono y el texto
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 230,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default Navigation;
