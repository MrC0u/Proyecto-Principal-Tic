import React, { Component } from 'react'
import {StyleSheet,Text,View} from 'react-native'
export default class Informacion extends Component{
    constructor(props){
        super(props);
    }
    
    render(){
        const {usuario,contraseña,id} =this.props.route.params
        console.log('jajaj',id);
        return(
            <View>
                <Text>
                    Informacion {}
                </Text>
            </View>
        )

    }
}
const styles=StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent:'center',
        alignItems:'center',
    }
})