import React from "react";
import {Alert, StyleSheet,Text,TextInput,TouchableHighlight,View
} from "react-native";
/*export default function Inicio ({navigation,route}){
    const {id}=route.params;
    return(
        <View style={styles.container}>
            <View>
                <TouchableHighlight onPress={()=>navigation.navigate('TiempoReal')}>
                    <Text>Tiempo real</Text>
                </TouchableHighlight>
            </View>
            <View>
                <TouchableHighlight onPress={()=>{navigation.navigate('ConsultaSemanal')}}>
                    <Text>Sesiones</Text>
                </TouchableHighlight>
            </View>
            <View>
                <TouchableHighlight onPress={()=>{navigation.navigate('Configuracion')}}>
                    <Text>Informacion {id} </Text>

                </TouchableHighlight>
            </View>

        </View>
    )
}*/

export default class Inicio extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            id:'',
            user:'',
            psw:'',
            temp:this.props.route.params.temp
        }

    }
    tReal = () =>{
        this.props.navigation.navigate('TiempoReal')
    }
    cSemanl = () =>{
        const {id,user,psw,temp} = this.props.route.params
        this.props.navigation.navigate('ConsultaSemanal',{
            id:id,
            user:user,
            psw:psw,
            temp:temp
        })
    }
    configuracion = () =>{
        const {id,user,psw,temp} = this.props.route.params
        this.props.navigation.navigate('Configuracion',{
            id:id,
            user:user,
            psw:psw,
            temp:temp
        })
    }
    
    render(){
        
        //console.log('xd',id)
        return(
            <View style={styles.container}>
                <View  >
                    <TouchableHighlight style={styles.submitButton} onPress={()=>{this.tReal()}}>
                        <Text style={styles.submitButtonText}>Tiempo real</Text>
                    </TouchableHighlight>
                
                    <TouchableHighlight style={styles.submitButton} onPress={()=>{this.cSemanl()}}>
                        <Text style={styles.submitButtonText} >Sesiones</Text>
                    </TouchableHighlight>
                
                    <TouchableHighlight style={styles.submitButton} onPress={()=>{this.configuracion()}}>
                        <Text style={styles.submitButtonText}>Configuracion </Text>

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