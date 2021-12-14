import React from "react";
import {Alert,StyleSheet,Text,TextInput,TouchableHighlight,View} from "react-native";

export default class TiempoReal extends React.Component{
    constructor(props){
        super(props)
        this.state={
            id:this.props.route.params.id
        }
    }
    componentDidMount(){
           //enviar el ID
        fetch(`http://181.43.109.244:8080/consultaTiempoReal/${this.state.id}`, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            //mode:'no-cors'
        }).then(response => response.json()).then( user =>this.setState({
            mensaje: user.msg
        }));        
    }
    render(){
        return(
            <View>
                <Text>xd</Text>
            </View>
        )
    }
}