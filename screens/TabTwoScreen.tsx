import { Button, TextInput,TouchableOpacity,StyleSheet } from 'react-native';
import React,{useState,useEffect} from 'react';
import axios from 'axios';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import * as SecureStore from 'expo-secure-store';
import {Ionicons,AntDesign,MaterialCommunityIcons,Feather,MaterialIcons} from '@expo/vector-icons'
import MapView from 'react-native-maps';
import * as Location from 'expo-location';


export default function TabTwoScreen() {
  const [text,setText]=useState('')
  const [ntext,setNText]=useState('');
  const [pesquisa,setPesquisa]=useState('sdsd');
  const [desintala,setDesintala]=useState(null);
  const [token,setToken]=useState();
  const [dados,setDados]=useState(null);
  const [origin,setOrigin]=useState(null);
  const [barcode,setbarcode]=useState(false);
  useEffect(()=>{
    (async function(){
      const {status,permissions}=await Location.requestForegroundPermissionsAsync();
    
      if (status=='granted'){
        let location=await Location.getCurrentPositionAsync({enableHighAccuracy:true});
        setOrigin({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })
      }
      else{
        throw new Error('sdsdsd')
      }
    })()
  },)
  
  const Obter_token=()=>{
    (async ()=>{
        let result = await SecureStore.getItemAsync('token');
        setToken(result)
      })()
    
    }
    
  const Procura=()=>{
    axios({
      method:"get",
      url:`https://2cf5-197-249-5-223.in.ngrok.io/web/contadorInstalados/`,
      headers:{'Authorization':`token ${token}`,'Content-Type':'application/json' },
      params:{contador:text}
  }).then(dat=>{ if(dat.status!==200){
      throw Error('Dados de acesso invalidos');  
          }
      
      return dat
   } ).then( d=>{ 
          setDesintala('Tue');
                }
     ).catch(e=>{
      alert('O numero de Contador digitado nao existe!');
    })
     
  
  }
  const Update_meter=()=>{
    axios({
      method:"post",
      url:`https://2cf5-197-249-5-223.in.ngrok.io/web/contadorUpdate/`,
      headers:{'Authorization':`token ${token}`,'Content-Type':'application/json' },
      data:{contador:text,contadornovo:ntext}
  }).then(dat=>{ if(dat.status!==200){
      throw Error('Dados de acesso invalidos');  
          }
      
      return dat
   } ).then( d=>{ 
    alert('Contador Actualizado com Sucesso!!');
    setDesintala(null);
                }
     ).catch(e=>{
      alert('O numero de Contador digitado nao existe!');
    })
     
  
  }
      useEffect(()=>{
        Obter_token();
        },)
  const Handler=()=>{
    Procura();
  }
  const   UHandler=()=>{
    Update_meter();
  }
  return (
    <View style={styles.container}>
    <View style={styles.barcode}>
      

      <Text style={styles.word}>Numero de Contador</Text>
      {barcode ? <BarCodeScanner
                  onBarCodeScanned={scanner?undefined:handlercodigo}
        style={{height:100,width:'100%'}}/>:true }  
        
                 <View style={styles.action}>
                
                 
                 <TextInput placeholder='Digite o numero de contador' 
                 style={styles.TextInput}
                 autoCapitalize="none"
                 onChangeText={(val)=>setText(val)}
                 maxLength={13}
                 value={text}
                
                />
      
                <TouchableOpacity onPress={()=>Barcode()}>
                 {barcode ?<MaterialCommunityIcons name='barcode-off' 
                 size={20} 
                 color="#019d95"/>:<MaterialCommunityIcons name='barcode-scan' 
                 size={20} 
                 color="#019d95"/>} 
                  
          </TouchableOpacity>
         
                 </View>
                 <Text style={styles.word}>Descricao</Text>
                 <View style={styles.action}>
                 <TextInput placeholder='' 
                 style={styles.TextInput}
                 autoCapitalize="none"
                 maxLength={25}
                />
      

                 </View>
            
      
                
              {pesquisa &&       <TouchableOpacity
                    style={styles.loginScreenButton}
                    underlayColor='#fff'>
          <Text style={styles.loginText} onPress={()=>{Handler()}}>Pesquisar</Text>
    
             </TouchableOpacity>
    
    }
    
    {desintala &&     <MapView
      style={styles.map}
    initialRegion={origin}
    showsUserLocation={true}
    zoomEnabled={true}
    
    loadingEnabled={true}
  > 

  </MapView>
 } 
 {desintala && <View>
   
  <Text style={styles.word}>Numero de Novo Contador</Text>
      {barcode ? <BarCodeScanner
                  onBarCodeScanned={scanner?undefined:handlercodigo}
        style={{height:100,width:'100%'}}/>:true }  
                 <View style={styles.action}>
                
                 
                 <TextInput placeholder='Digite o numero de contador' 
                 style={styles.TextInput}
                 autoCapitalize="none"
                 onChangeText={(val)=>setNText(val)}
                 maxLength={13}
                 value={ntext}
                />
               
                <TouchableOpacity onPress={()=>Barcode()}>
                 {barcode ?<MaterialCommunityIcons name='barcode-off' 
                 size={20} 
                 color="#019d95"/>:<MaterialCommunityIcons name='barcode-scan' 
                 size={20} 
                 color="#019d95"/>} 
                  
          </TouchableOpacity>
         
                 </View>
              {desintala &&       <TouchableOpacity
                    style={styles.loginScreenButton}
                    underlayColor='#fff'>
          <Text style={styles.loginText} onPress={()=>{
         UHandler();
       }}>Actualizar meter</Text>
    
             </TouchableOpacity>
    
    }
    
   
   
   </View>}
     
        </View>
        
      
    
      </View>
  );
}

const styles = StyleSheet.create({
  TextInputvalor:{
    marginTop: 22,
    height: '50%',
    width:'100%', 
    backgroundColor:'#fff',
  },
  image: {
    
    width: '5%',
    height: '200%',
},
  container: {
    flex: 1,
    backgroundColor:'#019d96',
    
  },infos:{
    backgroundColor:'#019d95',
  
    display: 'flex',
   flexDirection:'row',
  },
  infosa:{
    height: '50%',
    backgroundColor:'#019d95',
  
  }
  ,barcode:{
            flex:6 ,
        backgroundColor:'#fff',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingVertical:30,
        paddingHorizontal:20,
},
  title: {
    color:'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },  action:{
    flexDirection:'row',
    margin:10 ,
    borderBottomWidth:1,
    borderBottomColor:'#f2f2f2',
    paddingBottom:5,
},  word:{
  paddingTop:20,
},  loginScreenButton:{
 marginTop:10,
  paddingTop:10,
  paddingBottom:10,
  width:'100%' ,
  backgroundColor:'#019d95',
  borderRadius:10,
  borderWidth: 1,
  borderColor: '#fff'
},


  words:{
    color:'#fff',
  paddingTop:20,
},wordsa:{
  color:'#fff',
paddingTop:1,
},
loginText:{
    color:'#fff',
    textAlign:'center',
    paddingLeft : 10,
    paddingRight : 10
}
,  
TextInput:{
    flex:1 ,
    marginTop:Platform.OS=='ios' ? 0:-12,
    paddingLeft:10,
    color:'#019d95'
},
TextInputs:{
  flex:1 ,
  width: '10%',
  height: '100%',
  marginTop:'-0.3%',
  paddingLeft:10,
  backgroundColor:'#fff',
  color:'#019d95'
},map:{
    width:'100%',
    height: '60%',
  }
});
