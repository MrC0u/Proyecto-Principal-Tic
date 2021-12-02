import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Login from './src/components/login'
import register from'./src/components/register'
import Navigation from './src/Inicio/Navigations'


const Stack = createStackNavigator();

class App extends React.Component {
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component ={Login}/>
          <Stack.Screen name="Register" component ={register}/>
          <Stack.Screen options={{headerShown: false}} name="Ini" component ={Navigation}/>
        </Stack.Navigator>   
      </NavigationContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;