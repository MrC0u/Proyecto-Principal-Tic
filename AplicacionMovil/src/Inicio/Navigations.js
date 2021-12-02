import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import Estatico from '../screens/Estatico'
import Informacion from '../screens/Informacion'
import Iniciar from '../screens/Inicio'
import Vivo from '../screens/Vivo'
import { Component } from 'react'
//import {StyleSheet,Text,View} from 'react-native'
const Tab=createBottomTabNavigator()
//export default function Navigation(){

export default class Navigations extends Component{
    constructor (props){
        super(props);
    }
    render(){

        
        //console.log('ESTOY ACA',id)
        return(
            //<NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen
                        name="Estatico"
                        component={Estatico} 
                    />
                    <Tab.Screen
                        name="Informacion"
                        component={Informacion} 
                    />
                    <Tab.Screen
                        name="Inicio"
                        component={Iniciar} 
                    />
                    <Tab.Screen
                        name="Vivo"
                        component={Vivo} 
                    />
    
                </Tab.Navigator>
            //</NavigationContainer>
        )
    }
}
