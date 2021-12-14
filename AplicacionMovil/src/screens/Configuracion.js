import React from "react";
import {Alert,StyleSheet,Text,TextInput,Touchable,TouchableHighlight,View} from "react-native";

export default class Configuracion extends React.Component{
    constructor(props){
        super(props)
        this.state={
            id:this.props.route.params.id,
            user:this.props.route.params.user,
            psw:this.props.route.params.psw,
            temperatura:this.props.route.params.temp,
            nTemp:'',
            mensaje:''
        }
    }
    componentWillUnmount(){
           //enviar el ID //:userid&:clave&:temperatura
        fetch(`http://181.43.109.244:8080/configuracion/${this.state.id}&${this.state.psw}&${this.state.nTemp}`, {
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
    /*funcion(idd,userr,psww){
        this.setState({
            id:idd,
            user:userr,
            psw:psww
        })
    }*/
    changeTemperatura(temperatura){
        this.setState({nTemp:temperatura})
    }
    changePsw(clave){
        this.setState({psw:clave})
    }
    cambio(){
        this.componentWillUnmount()
        setTimeout(()=>{
                Alert.alert(this.state.mensaje)
        },600)
    }

    render(){
        
        return(
            
            <View style={styles.container}>        
                <View >
                    <Text  style={styles.text2}> Bienvenido usuario { this.state.user } </Text>
                    <Text style ={styles.text3}> Desea modificar:</Text>
                </View>
                <View >
                    
                    <Text> Temperatura ideal </Text>
                    <TextInput
                        style={styles.row} 
                        placeholder=""
                        value={this.state.temperatura}
                        onChangeText={(temp)=>{this.changeTemperatura(temp);
                        
                        }}
                    />
                    <Text> Contraseña </Text>
                    <TextInput
                        style={styles.row} 
                        placeholder=""
                        value={this.state.psw}
                        onChangeText={(pasw)=>{this.changePsw(pasw)}}
                    />
                    <TouchableHighlight style={styles.submitButton} onPress={()=>{this.cambio();
                    /*this.props.navigation.setParams({
                            temp: 22
                        })*/
                    }}>
                        <Text style={styles.submitButtonText} > Modificar </Text>
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
        borderWidth:1
    },
    text2: {
        fontWeight: "bold",
        fontSize:20,
        margin:10
    },
    text3:{
        fontSize:15,
        margin:20
    },
    row: {
        padding: 4,
        borderBottomColor: "#6495ED",
        borderBottomWidth: StyleSheet.hairlineWidth
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