import React from 'react'
import {StyleSheet,Text,View,TextInput,TouchableHighlight, Alert} from 'react-native'
export default class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={
            user:'',
            password:'',
            sesion:'',
            mensaje:'ingrese usuario y contraseña',
            id:'',
            temp:''
        }
    }
    changeUsuario(usuario){
        this.setState({user: usuario})
    }
    changePassword(clave){
        this.setState({password: clave})
    }
    changeInicioSesion(sesion){
        this.setState({sesion: sesion})
    }
    componentWillUnmount(){
        fetch(`http://181.43.109.244:8080/ingreso/${this.state.user}&${this.state.password}`, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',            
            }
        }).then(response =>{console.log(response);
        return response.json()}
        
        ).then(data =>{console.log(data);
            if(data.log==true){
                this.setState({
                    id: data.id,
                    sesion: data.log,
                    mensaje:data.msg,
                    temp:data.temperatura
                })

            }else if(data.log==false){
                this.setState({
                    sesion: data.log,
                    mensaje:data.msg
                })
            }
        })
    }
    /*componentDidMount(){
        fetch(`http://181.43.109.244:8080/ingreso/${this.state.user}&${this.state.password}`, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',            
            }
        }).then(response =>{console.log(response);
        return response.json()}
        
        ).then(data =>{console.log(data);
            if(data.log==true){
                this.setState({
                    id: data.id,
                    sesion: data.log,
                    mensaje:data.msg
                })

            }else if(data.log==false){
                this.setState({
                    sesion: data.log,
                    mensaje:data.msg
                })
            }
        })
    }*/

    register = () =>{
        this.props.navigation.navigate('Register')
    }

    inicio = () =>{
        this.props.navigation.navigate('Inicio',{
            id:this.state.id,
            user:this.state.user,
            psw:this.state.password,
            temp:this.state.temp
        })
    }
    cambio(){
        this.componentWillUnmount()
        //------------------------------------------
        setTimeout(()=>{
            if(this.state.sesion==true){
                this.inicio()
            }else if(this.state.sesion==false){
                Alert.alert(this.state.mensaje)
            }
        
        },600)

    }
    
    render(){
        return(
            <View style={styles.container}>
                <View>
                    <TextInput
                    style={styles.row}
                        placeholder="Nombre de usuario"
                        Value={this.state.user}
                        onChangeText={(usuario)=> this.changeUsuario(usuario)}
                    
                    />
                    <TextInput
                        style={styles.row}
                        placeholder="contraseña de usuario"
                        Value={this.state.user}
                        onChangeText={(clave)=> this.changePassword(clave)}
                    
                    /> 
                    <TouchableHighlight style={styles.submitButton} onPress={()=>
                        this.cambio()
                    }>
                        <Text style={styles.submitButtonText}>LOGIN</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.submitButton} onPress={()=>
                        this.register()
                    }>
                        <Text style={styles.submitButtonText}>Registrarse</Text>
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