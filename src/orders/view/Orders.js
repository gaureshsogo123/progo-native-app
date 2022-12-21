import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { TextInput, useTheme,Modal,
  Portal,Provider,  Button} from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import DropdownSelect from "../../component/DropdownSelect";
import DatePicker from "../../component/DatePicker";


const {height} = Dimensions.get("screen")



export default function Orders() {
  const containerStyle = {
    backgroundColor: "#eeeeee",
    width: "100%",
    minHeight: 300,
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  };


  const theme = useTheme();
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

  const statuses = [
    { key: 1, value: "Placed" },
    { key: 2, value: "Accepted" },
    { key: 3, value: "In-Process" },
    { key: 4, value: "Completed" },
    { key: 0, value: "All" },
  ];

  const cities =[
    { key: 1, value: "Mumbai" },
    { key: 2, value: "Delhi" },
    { key: 3, value: "Chennai" },
  ]

  const[status,setStatus]=useState("");
  const[startDate,setStartDate]=useState(new Date());
  const[endDate,setEndDate]=useState(new Date());
  const[shown,setShown]=useState(false);
  const[selectedCity,setSelectedCity]=useState("");

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pagecontainer}>
          <TextInput style={styles.input} placeholder="Search Suppliers" />
          
          <View style={styles.filtericon}>
            <TouchableOpacity  onPress={()=>setShown(true)}>
          <AntDesign name="filter" size={22} color="#6a1b9a" />
                <Text style={{ fontSize: 10, color: "#6a1b9a" }}>Filters</Text>
                </TouchableOpacity>
          </View>

          <View
            style={{ width: "100%", borderBottomWidth: 1, marginTop: 10,borderColor:"silver" }}
          ></View>
        </View>
      </View>

<>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <View style={styles.listcontainer}>
              <Text style={{ fontWeight: "400", paddingBottom: 10,fontSize:16 }}>
                {item.name}
              </Text>
              <Text style={{ fontWeight: "400",color:'#757575' }}>
                Order Date : 26 Oct 2022               </Text>
              <View style={styles.rightitems}>
                <Text style={{ paddingTop: 10,paddingBottom:10,color:'#757575' }}>Amt : Rs.100</Text>
                <View style={{         
                 padding: 5,
                borderRadius: 5,
                backgroundColor: theme.colors.secondaryContainer,
}}>
                  <Text style={{padding:5,color:"#424242"}}>Status: Placed</Text>
                  
                </View>
                {/*<TouchableOpacity>
                  <AntDesign name="edit" size={25} style={{ paddingTop: 10 }} />
          </TouchableOpacity>*/}
              </View>
            </View>
          );
        }}
      />



        
      </>

      <>
            <Provider>
              <Portal>
                <Modal
                  visible={shown}
                  onDismiss={() => setShown(false)}
                  contentContainerStyle={containerStyle}
                >

<View style={styles.datecontainer}>
                    <Text
                      variant="titleMedium"
                      style={{ textAlignVertical: "center" }}
                    >
                      From :{" "}
                    </Text>
                    <DatePicker
                      date={startDate}
                      setDate={setStartDate}
                      text={"From"}
                      showFlag={true}
                    />
                    <Text
                      variant="titleMedium"
                      style={{ textAlignVertical: "center" }}
                    >
                      To :{" "}
                    </Text>
                    <DatePicker
                      date={endDate}
                      setDate={setEndDate}
                      text={"To"}
                      showFlag={true}
                    />
                  </View>


                  <View style={styles.locationcontainer}>
                      <Text
                        variant="titleMedium"
                        style={{ textAlignVertical: "center" }}
                      >
                        Status :
                      </Text>
                      <View style={{ marginLeft: "4%" }}>
                        <DropdownSelect
                          options={statuses}
                          setValue={setStatus}
                          placeholder={status}
                        />
                      </View>
                    </View>
                    

                    <View style={styles.locationcontainer}>
                      <Text
                        variant="titleMedium"
                        style={{ textAlignVertical: "center" }}
                      >
                        City :
                      </Text>
                      <View style={{ marginLeft: "4%" }}>
                        <DropdownSelect
                          options={statuses}
                          setValue={setStatus}
                          placeholder={status}
                        />
                      </View>
                    </View>
                    



                  <Button
                    mode="contained"
                    style={{
                      borderRadius: 3,
                      width: "95%",
                      marginLeft: "3%",
                      marginTop: "5%",
                      marginBottom:"2%",
                      
                    }}
                    onPress={() => setShown(false)}
                  >
                    View Result
                  </Button> 
                </Modal>
              </Portal>
            </Provider>
          </>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    padding:10,
  },
  pagecontainer: {
    width: "100%",
  },
  input: {
    width: "88%",
    height: height-"60%",
    marginBottom: 8,
    borderRadius:5
  },
  listcontainer: {
    width: "95%",
    minHeight:120,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    marginLeft: "3%",
    padding: 10,
    marginBottom: "3%",
    position: "relative",
    paddingTop:"5%",
    marginTop:"2%",
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 2,
},
shadowOpacity: 0.23,
shadowRadius: 2.62,

elevation: 4,
    
  },
  rightitems: {
    position: "absolute",
    right: 10,
    paddingTop:"5%"
  },
  filtericon:{
    position: "absolute",
    right: 0,
    width: "10%",
    top: 4,
  },
  datecontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding:"3%",
  },
  locationcontainer: {
    display: "flex",
    flexDirection: "row",
    padding: "3%",
    width: "100%",
    paddingTop:"5%",
    paddingBottom:'5%'
  }
});
