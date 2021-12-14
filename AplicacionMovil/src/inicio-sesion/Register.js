import React from 'react'
import {Alert,Text,TextInput,StyleSheet,TouchableHighlight,View} from 'react-native'
export default class Register extends React.Component{
    constructor(props){
        super(props)
        this.state={
            userR:'',
            passwor:'',
            mensaje:'Ingrese Usuario y Contraseña',
            temperatura:''
        }
    }
    changeUsuario(usuario){
        this.setState({userR: usuario})
    }
    changePasswor(clave){
        this.setState({passwor: clave})
    }
    changeTemperatura(temp){
        this.setState({temperatura: temp})
    }
    componentWillUnmount(){
        fetch(`http://181.43.109.244:8080/registro/${this.state.userR}&${this.state.passwor}&${this.state.temperatura}`, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            //mode:'no-cors'
        }).then(response => {console.log(response); return response.json()})
        .then( user =>{this.setState({
            mensaje: user.msg
        })});
    }
    /*componentDidMount(){
        fetch(`http://181.43.109.244:8080/registro/${this.state.userR}&${this.state.passwor}`, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            //mode:'no-cors'
        }).then(response => {console.log(response); return response.json()})
        .then( user =>{this.setState({
            mensaje: user.msg
        })});
    }*/
    cambio(){
        this.componentWillUnmount()
        setTimeout(()=>{
            Alert.alert(this.state.mensaje)
        },500)
    }

    render(){
        return(
            <View style={styles.container}>
                <View>
                    <TextInput 
                        style={styles.row}
                        placeholder="Nombre de usuario"
                        value={this.state.userR}
                        onChangeText={(usuario)=>this.changeUsuario(usuario)}                    
                    />
                    <TextInput 
                        style={styles.row}
                        placeholder="Contraseña"
                        value={this.state.passwor}
                        onChangeText={(clave)=>this.changePasswor(clave)}                    
                    />
                    <TextInput 
                        style={styles.row}
                        placeholder="Temperatura Ideal"
                        value={this.state.temperatura}
                        onChangeText={(temp)=>this.changeTemperatura(temp)}                    
                    />
                    <TouchableHighlight
                        style={styles.submitButton}
                        onPress={()=>{this.cambio()}}
                    >
                        <Text style={styles.submitButtonText}> Registrarse</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )

    }

}
const styles=StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent:'center',
        alignItems:'center',
    },
    row: {
        padding: 4,
        borderBottomColor: "#6495ED",
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    input:{
          margin: 15,
          height: 40,
          padding:10,
          borderColor: '#7a42f4',
          borderWidth: 1
    },
    submitButton: {
        backgroundColor: '#6495ED',
        padding: 10,
        margin: 15,
        height: 40,
     },
     submitButtonText:{
        color: 'white'
     }
})