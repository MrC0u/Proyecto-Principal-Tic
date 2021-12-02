import React, {Component, useEffect} from "react";
import {
    StyleSheet,
    Alert,
    View,
    Text,
    TouchableHighlight,
    TextInput
} from "react-native";

export default class login extends Component{
    
    constructor(props){
        super(props)
        this.state={
            user:'',
            password:'',
            stat:'',
            idUser:''
        }
    }

    changeUsuario(usuario){
        this.setState({user : usuario})
    }
    changeClave(clave){
        this.setState({password : clave})
    }
    changeInicioSesion(stat){
        this.setState({stat: stat})
    }
    cambio(){
        this.componentDidMount()
        setTimeout(()=>{
            if(this.state.stat==200){
                this.inicio()
            }else if(this.state.stat==404){
                Alert.alert("usuario o contraseña incorrecta")
            }
        
        },500)
    }

    componentDidMount(){
           
        fetch(`http://181.43.109.53:8080/ingreso/${this.state.user}&${this.state.password}`, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',            
            }
        }).then(response => {
            this.setState({
                stat:response.status
            })
            console.log('QUE SALE DE ACA: ',response )
            return response.json()
        })
        .then(data => {
            this.setState({
                idUser: data.id
            })            
            console.log('CTM: ',data)})
        .catch((error) => {
            //Alert.alert('hola: ',error.status)
            console.log(error)
          });
    }

    register = () =>{
        this.props.navigation.navigate('Register')
    }
    inicio = () =>{
        this.props.navigation.navigate('Ini',{
            usuario:this.state.user,
            contraseña:this.state.password,
            id:this.state.idUser

        })
    }

    render(){
        return(
            <View style={styles.container}>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de usuario"
                        value={this.state.user}
                        onChangeText={(usuario)=>this.changeUsuario(usuario)}
                    />
                    <TextInput                    
                        style={styles.input}
                        placeholder="Contraseña"
                        value={this.state.password}
                        onChangeText={(clave)=>this.changeClave(clave)}
                    /> 

                    {/* BOTON PARA INICIAR SESION*/ }
                    <TouchableHighlight onPress={() => {
                        this.cambio()/*buttonPressed()*/;
                        
                        //if(this.state.stat=this.state.stat3){
                            // Alert.alert("Usuario o contraseña incorrecta")
                        //}
                        /*this.inicio();*/ }  /*()=> 
                        this.buttonPressed()*/
                        //console.log('preciono boton')
                        }/*()=> Alert.alert('hola que hace')}*/>
                        <Text style={styles.button} >LOGIN</Text>
                    </TouchableHighlight>
                    <Text>{/*this.state.stat*/} </Text>
                    
                    {/* BOTON PARA REGISTRARCE*/ }
                    <TouchableHighlight onPress={ this.register}/*()=> Alert.alert('hola que hace')}*/>
                        <Text style={styles.button} > Registrarse </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 10
    },
    button: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10
    },
    input:{
        margin: 15,
        height: 40,
        padding:10,
        borderColor: '#7a42f4',
        borderWidth: 1
    },
})
