import { Button, TextInput,TouchableOpacity,StyleSheet ,Image} from 'react-native';
import React,{useState,useEffect} from 'react';
import { Text, View } from '../components/Themed';
import { Platform } from 'react-native';
import { RootTabScreenProps } from '../types';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {Ionicons,AntDesign,MaterialCommunityIcons,Feather,MaterialIcons} from '@expo/vector-icons'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import MapView from 'react-native-maps';
import RNPickerSelect from 'react-native-picker-select';
import * as Location from 'expo-location';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [TemPermissao,setTemPermissao]=useState(null);
  const [scanner,setScanner]=useState(false);
  const [token,setToken]=useState();
  const [text,setText]=useState('')
  const [barcode,setbarcode]=useState(false);
  const [dados,setDados]=useState(null);
  const [nome,setNome]=useState('');
  const [pesquisa,setPesquisa]=useState('sdsd');
  const [valor,setValor]=useState('');
  const [tarifas,setTarifas]=useState(null)
  const [tarifasb,setTarifasb]=useState('dfdf')
  const [origin,setOrigin]=useState(null);
  const [Kctu,setKctu]=useState(null);
  const [keychangetoken,setkeychange]=useState(null);
  const [sgci,setSgci]=useState(null);
  const [sgcf,setSgcf]=useState(null);
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
  const askForCameraPermission =()=>{
    
    (async ()=>{
      console.log('pass')
     
      const {status}=await  BarCodeScanner.requestPermissionsAsync();
      setTemPermissao(status=='granted')
    })()
  }
const Obter_token=()=>{
(async ()=>{
    let result = await SecureStore.getItemAsync('token');
    setToken(result)
  })()

}
useEffect(()=>{
  Obter_token();
   
},)
  useEffect(()=>{
    askForCameraPermission();
    console.log('sd')
  }, []);
  const Barcode=()=>{
    setScanner(false)
    setbarcode(!barcode);
  }
  const Paga_Mpesa=()=>{
    axios({
      method:"POST",
      url:`https://www.mapisis.com/web/paymethod/`,
      headers:{'Authorization':`token ${token}`,'Content-Type':'application/json' },
      data:{numero:dados.telefone,valor:valor}
  }).then(dat=>{ if(dat.status!==200){
      throw Error('Dados de acesso invalidos');  
          }
      
      return dat
   } ).then( d=>{ 
                 console.log(d.data)
                }
     ).catch(e=>{
      console.log(e.message) 
      console.log(token)
    })
    
  }
  const Step_tarif=()=>{
    axios({
      method:"POST",
      url:`https://www.mapisis.com/web/step_tarif/`,
      headers:{'Authorization':`token ${token}`,'Content-Type':'application/json' },
      data:{contador:text,valor:valor,unidade:'Mzn'}
  }).then(dat=>{ if(dat.status!==200){
      throw Error('Dados de acesso invalidos');  
          }
      
      return dat
   } ).then( d=>{ 
                  console.log(d.data); 
                  setTarifas(d.data);      
                setTarifasb(null);
                }
     ).catch(e=>{
      console.log(e.message) 
      console.log(token)
    })
    
  }
  const Mhandler=()=>{
    Paga_Mpesa();
  }
  const Assinalar_Meter=()=>{
    axios({
      method:"post",
      url:`https://2cf5-197-249-5-223.in.ngrok.io/web/assinalarcontador/`,
      headers:{'Authorization':`token ${token}`,'Content-Type':'application/json' },
      data:{contador:text,localizacao:origin}
  }).then(dat=>{ if(dat.status!==200){
      throw Error('Dados de acesso invalidos');  
          }
      
      return dat
   } ).then( d=>{ 
    alert('registrado com sucesso nas coordenas assinaladas');
            }
     ).catch(e=>{
      alert('Error!');
    })
    
  }
  const Procura=()=>{
    axios({
      method:"post",
      url:`https://2cf5-197-249-5-223.in.ngrok.io/web/KCT/`,
      headers:{'Authorization':`token ${token}`,'Content-Type':'application/json' },
      data:{contador:text,sgcis:sgci,sgcfs:sgcf}
  }).then(dat=>{ if(dat.status!==200){
      throw Error('Dados de acesso invalidos');  
          }
      
      return dat
   } ).then( d=>{ 
          setkeychange(d.data);
         setKctu('dfdf');
                }
     ).catch(e=>{
      alert('O numero de Contador digitado nao existe!');
    })
      }
  const Handler=()=>{
    Procura();
  }
  const handlercodigo=({type,data})=>{
    setScanner(true)
    setText(data)
    setbarcode(!barcode)
    
  }
  const Handertarif=()=>{
    Step_tarif();
  }
  if(TemPermissao==null){
    return(
      <View style={styles.container}>
        <Text>Requesting camera permissio</Text>
    </View>    
    )
  
  }
  if(TemPermissao==false){
    return(
      <View style={styles.container}>
        <Text>No acess </Text>
        <Button title={'allow'} onPress={()=>askForCameraPermission()}/>
    </View>    
    )
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
                {pesquisa && <View>
                  <Text>From SGC</Text>
                  <RNPickerSelect
            onValueChange={(value) => setSgci(value)}
            items={[
                { label: 'ENH', value: '600661' },
                { label: 'LAISON', value: '999120' },
                   ]}
        />
                  <Text>To SGC</Text>
                  <RNPickerSelect
            onValueChange={(value) => setSgcf(value)}
            items={[
                { label: 'MAPI', value: '600783' },
                   ]}
        />
                  
                  </View>}
              {pesquisa &&       <TouchableOpacity
                    style={styles.loginScreenButton}
                    underlayColor='#fff'>
          <Text style={styles.loginText} onPress={()=>{Handler()}}>Gerar KCT</Text>
    
             </TouchableOpacity>
    
    }
    {Kctu && <View>
      <Text>{keychangetoken}</Text>
      
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
  height: '70%',
}


});
