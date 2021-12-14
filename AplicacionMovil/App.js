//import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet,Text,View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Log from './src/inicio-sesion/Login'
import Reg from './src/inicio-sesion/Register'
import Ini from './src/screens/Inicio'
import Treal from './src/screens/TiempoReal'
import Confi from './src/screens/Configuracion'
import Csemanal from './src/screens/ConsultaSemanal'


const Stack = createStackNavigator();

export default class App extends React.Component{
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Log}/>
          <Stack.Screen name="Register" component={Reg}/>
          <Stack.Screen name="Inicio" component={Ini}/>
          <Stack.Screen name="TiempoReal" component={Treal}/>
          <Stack.Screen name="Configuracion" component={Confi}/>
          <Stack.Screen name="ConsultaSemanal" component={Csemanal}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
//<Stack.Screen name="" component={}/>
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
