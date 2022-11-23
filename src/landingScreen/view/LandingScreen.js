import React, { useState } from 'react'

import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    
  } from "react-native";
import { TextInput } from 'react-native-paper';
  
  

  


export default function LandingScreen({navigation}) {

    const info = [
        { id: 1, name: "Ganesh Stores" },
  { id: 2, name: "Krishna Stores" },
  { id: 3, name: "Raja Kirana Shop" },
  { id: 4, name: "Raja Kirana Shop" },
    ]
    const [data, setData] = useState(info);

    const handlePress = ((item)=>{
        navigation.navigate(`purchaseorder`, {
            retailerName: item.name,
            retailerId: item.id,
          });
      
    })
  return (
    <>
      <View style={styles.container}>
        <View style={styles.pagecontainer}>
        <Text
            style={{ fontWeight: "700", fontSize: 18, paddingBottom: "5%" }}
          >
            Vignesh Foods
          </Text>
         
          <TextInput style={styles.input} placeholder="Search Supplier" />
 
         
        </View>
      </View>

      

      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={()=>handlePress(item)}>
              <View style={styles.list}>
                <Text style={{ fontSize: 15, fontWeight: "600" }}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
  
    </>

  )
}
 
const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
      },
      pagecontainer: {
        width: "100%",
        padding: 10,
      },
      input:{
        width: "100%",
    height: 60,
    borderRadius: 10,
      },
      list:{
      width: "95%",
    height: "auto",
    padding: 20,
    borderRadius: 15,
    marginBottom: "3%",
    alignItems: "center",
    marginLeft: "3%",
    backgroundColor: "#fafafa",
    borderColor: "silver",
    borderWidth: 1,
      }
})



  