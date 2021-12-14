import React from "react";
import {FlatList,Alert,StyleSheet,Text,TextInput,TouchableHighlight,View} from "react-native";

export default class ConsultaSemanal extends React.Component{
    constructor(props){
        super(props)
        this.state={
            algo:[],
            id:this.props.route.params.id,
            tamaño:''
        }
    }
    componentDidMount(){
           //enviar el ID
        fetch(`http://181.43.109.244:8080/consultaSemanal/${this.state.id}`, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            //mode:'no-cors'
        }).then(response => {
            return response.json()
        })
        .then( user =>{
            console.log('hola:',user.sesiones.length);
            this.setState({
                algo:user.sesiones,
                tamaño:user.sesiones.length
            })

        });        
    }
    _renderItem =({item,index})=>{
        return(
            
            <View style={styles.item} >
                <Text> Cantidad total de agua: {item.dato} L</Text>
                <Text> Temperatura: {item.temperatura}</Text>
                <Text> Fecha: {item.date}</Text>
            </View>
        )

    }
    render(){
        return(
            <View>
                <FlatList
                inverted
                data={this.state.algo}
                renderItem={this._renderItem}
                keyExtractor={(item,index)=> {index.toString()}}
                    
            />
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
     },
     item: {
        backgroundColor: '#6495ED',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
      },
      
    text3:{
        fontSize:15,
        margin:20
    },
     
})

/*
<FlatList
    data={this.state.algo}
    renderItem={this._renderItem}
    keyExtractor={(item,index)=> console.log(index)}
/>*/