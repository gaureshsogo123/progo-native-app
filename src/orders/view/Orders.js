import React from 'react'
import { View,StyleSheet,FlatList,Text,TouchableOpacity } from 'react-native'
import { TextInput } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";



 export default  function Orders() {
    const data = [
        { name: "Ganesh Stores" },
        { name: "Krishna tores" },
        { name: "Krishna tores" },
        { name: "Krishna tores" },
        { name: "Krishna tores" },
        { name: "Krishna tores" },
        { name: "Krishna tores" },
        { name: "Krishna tores" },
      ];
    
  return (
    <>
    <View style={styles.container}>
        <View style={styles.pagecontainer}>

        <TextInput style={styles.input} placeholder="Search Suppliers" />
<View
  style={{ width: "100%", borderBottomWidth: 1, marginTop: 10 }}
></View>

        </View>
    </View>


    <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <View style={styles.listcontainer}>
              <Text style={{ fontWeight: "600", paddingBottom: 10 }}>
                {item.name}
              </Text>
              <Text style={{ fontWeight: "400" }}>
                26 Oct Status : Delivered
              </Text>
              <View style={styles.rightitems}>
                <Text style={{ paddingTop: 10 }}>Amt : Rs.100</Text>
                <TouchableOpacity>
                  <AntDesign name="edit" size={25} style={{ paddingTop: 10 }} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
container:{
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
    width: "100%",
  
},
pagecontainer:{
    width: "100%",
    padding: 10,
 
},
input:{
    width: "100%",
    height: 50,
    marginBottom: "5%",
    marginTop:"3%"
  
},
listcontainer:{
    width: "95%",
    height: 100,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginLeft: "3%",
    padding: 10,
    marginBottom: "3%",
    position: "relative",
    borderColor:"silver",
    borderWidth:1
},
rightitems:{
    position: "absolute",
    right: 10,
}
})

