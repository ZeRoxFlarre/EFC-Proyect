import React from "react";
import {View, Text, TextInput, StyleSheet} from 'react-native'

const CustomImput = ({value, setValue, placeholder, secureTextEntry}) => {

return(
    <View style= {style.container}>
          <TextInput
   value ={value}
   onChangeText= {setValue} 
   placeholder= {placeholder}
   style = {style.input}
  secureTextEntry={secureTextEntry}
         />
    </View>
);
};
const style = StyleSheet.create({
   container:{
      backgroundColor: 'white',
      width: '100%',

        borderColor: '#e8e8e8',
        borderWidth : 1,
        borderRadius:5,

        paddingHorizontal:10,
        marginVertical:5,
      
    },
      input:{},
    })
export default CustomImput;