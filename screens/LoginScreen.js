import React,{useState} from 'react';
import { StyleSheet, Text, View,Image,TextInput,TouchableOpacity,Button, Alert} from 'react-native';
import {Ionicons,AntDesign,Feather} from '@expo/vector-icons'
import { Platform } from 'react-native-web';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

async function save(key, value) {
    await SecureStore.setItemAsync('token', value);
     
}
  
export default function LoginScreen({navigation}){
    
    const [data,setData]=React.useState({
        username:'',password:'',check_Change:false,securityEntry:true})
    const textInputChange=(val)=>{
        if(val.length != 0){
            setData({...data,
                username:val,
                check_Change:true,
           }
                 )
        }else{setData({...data,
            username:val,
            check_Change:false,
       }
             )}
    }
    const handlePassword=(val)=>{
        setData({
            ...data,
            password:val,
        })
    }
    const textsecurity=(val)=>{
        setData(
            {
                ...data,
                securityEntry:!data.securityEntry
            }
        )
    }
    const [error,setError]=useState(null);
        
    const LogHandler=()=>{
        axios({
            method:"post",
            url:`http://172.104.116.201/web/login/`,
            data:{username:data.username,password:data.password}
        }).then(dat=>{ if(dat.status!==200){
            throw Error('Dados de acesso invalidos');  
                }
            return dat
         } ).then( d=>{
         save('token',d.data.token);
         navigation.navigate('Root');

        }
       
           ).catch(e=>{
               alert('As credenciais username e password estao incorrectas!')
        })
    
  
   
    }
        return(
         <View style={styles.container}>
             <View style={styles.form}> 
             <View style={styles.corpo}>
                 <Image style={styles.logotipo} source={require('../images/ENH.png')}/>
                
             </View>
         
                 <Text style={styles.word}>Nome do usuário</Text>
                 
                 <View style={styles.action}>
                
                 <AntDesign name='user' 
                 size={20} 
                 color="#019d95"/>
          
                 <TextInput placeholder='Username' 
                 style={styles.TextInput}
                 autoCapitalize="none"
                 onChangeText={(val)=>textInputChange(val)}

                 />
                {data.check_Change ?<Feather name='check-circle' 
                    color='#019d95' 
                 size={20} />
                 :null}
          
                 </View>
                 <Text style={styles.word}>Password</Text>
                 
                 <View style={styles.action}>
                 <AntDesign name='key' 
                 size={20} 
                 color="#019d95"/>

                 <TextInput placeholder='palavra passe'
                 secureTextEntry={data.securityEntry?true:false} 
                 style={styles.TextInput}
                 autoCapitalize="none"
                 onChangeText={(val)=>handlePassword(val)}/>
                <TouchableOpacity onPress={textsecurity}>
                {data.securityEntry ?<Feather name='eye-off' 
                 color='#019d95' 
                 
                 size={20}/>
                 :
                 <Feather name='eye' 
                 color='#019d95' 
                 
                 size={20}/>
                 }

                </TouchableOpacity>
                 </View>
                 <View style={styles.button}>
                 <TouchableOpacity
                    style={styles.loginScreenButton}
                    underlayColor='#fff'
                    onPress={() =>LogHandler()}>
          <Text style={styles.loginText}>Login</Text>
             </TouchableOpacity>
                 </View>
           
                             </View>
         </View>
    )
}
const styles=StyleSheet.create({
    container:{
        flex:1 ,
        width:'100%' ,
        height:'100%' ,
        backgroundColor:'#019d95',
    },
    text:{
        
        color:"#fff",
        fontWeight:"bold",
        fontSize:30,
    },
    logotipo:{
        width: '80%',
        height: "70%",
    }
    ,
    action:{
        flexDirection:'row',
        margin:10 ,
        borderBottomWidth:1,
        borderBottomColor:'#f2f2f2',
        paddingBottom:5,
    },
    corpo:{
        height:'30%' ,
        width: '80%',
        
        backgroundColor:'#ffffff',
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        borderBottomLeftRadius:50,
        borderBottomRightRadius:50,
        marginLeft:'10%',
        margin: '15%',
        justifyContent:'center',
        alignItems:'center',
    }
    ,
    TextInput:{
        flex:1 ,
        marginTop: Platform.OS=='ios' ? 0:-12,
        paddingLeft:10,
        color:'#019d95'
    },
    button:{
        width:"100%" ,
        alignItems:'center',
        marginTop:50
    },
    word:{
        paddingTop:20,
    },
    form:{
        flex:6 ,
        backgroundColor:'#fff',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingVertical:30,
        paddingHorizontal:20,

    },
    signIn:{
        width:'100%' ,
        height:50 ,
        justifyContent:'center',
        borderRadius:10,

    },
    sd:{width:"100%",
        backgroundColor:'#1E6738'},  loginScreenButton:{
            marginRight:40,
            marginLeft:40,
           marginTop:10,
            paddingTop:10,
            paddingBottom:10,
            width:'100%' ,
            backgroundColor:'#019d95',
            borderRadius:10,
            borderWidth: 1,
            borderColor: '#fff'
          },
          loginText:{
              color:'#fff',
              textAlign:'center',
              paddingLeft : 10,
              paddingRight : 10
          }
})