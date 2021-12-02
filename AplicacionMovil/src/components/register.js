import React,{Component, useEffect} from "react";
import {Alert, StyleSheet,Text,TextInput,TouchableHighlight,View
} from "react-native";

export default class register extends Component{
    constructor(){
        super()
        this.state={
            userR:'',
            passwor:'',
            mensaje:''
        }
    }

    changeUsuario(usuario){
        this.setState({userR : usuario})
    }
    changeClave(clave){
        this.setState({passwor : clave})
    }
    register = () =>{
        this.props.navigation.navigate('Ini')
    }
    componentDidMount(){
           
        fetch(`http://181.43.109.53:8080/registro/${this.state.userR}&${this.state.passwor}`, {
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
    cambio(){
        this.componentDidMount()
        setTimeout(()=>{
            Alert.alert(this.state.mensaje)
        },500)
    }

    render(){


        return(
            <View style={styles.container}>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de usuario"
                        value={this.state.userR}
                        onChangeText={(usuario)=>this.changeUsuario(usuario)}
                    />
                    <TextInput                    
                        style={styles.input}
                        placeholder="Contraseña"
                        value={this.state.passwor}
                        onChangeText={(clave)=>this.changeClave(clave)}
                    /> 
                    <TouchableHighlight 
                        style={styles.submitButton}
                        onPress={ /*this.buttonPressed();*/()=>{ this.cambio()} }
                        >
                        <Text style={styles.submitButtonText}> Enviar </Text>
                        
                    </TouchableHighlight>               
                </View> 
                <Text></Text>          
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        
    },
    input:{
        margin: 15,
        height: 40,
        padding:10,
        borderColor: '#7a42f4',
        borderWidth: 1
    },
    submitButton: {
        margin: 15,
        height: 40,
        padding: 10,
        backgroundColor: '#7a42f4',
     },/*
     padding: 10,
        margin: 15,
        height: 40,*/
     submitButtonText:{
        color: 'white'
     }
})

