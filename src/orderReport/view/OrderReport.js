import { useState } from "react";
import { View,Text,StyleSheet } from "react-native"
import DatePicker from "../../component/DatePicker";
import DropdownSelect from "../../component/DropdownSelect";
import Table from "./Table";

export const OrderReport = (()=>{
    const[startDate,setStartDate]=useState(new Date());
    const[endDate,setEndDate]=useState(new Date());
    const[city,setCity]=useState("")


    const cities =[
        { key: 1, value: "Mumbai" },
        { key: 2, value: "Delhi" },
        { key: 3, value: "Chennai" },
      ]
    
    return(
        <View style={styles.container}>
            <View style={styles.pagecontainer}>
                <View style={styles.filtercontainer}>



                <View style={{display:'flex',flexDirection:'row'}}>
            <Text
                      variant="titleMedium"
                      style={{textAlignVertical:"center" }}
                    >
                      From : {" "}
                    </Text>
                    <DatePicker
                      date={startDate}
                      setDate={setStartDate}
                      text={"From"}
                      showFlag={true}
                    />
                    </View>



                    <View style={{display:'flex',flexDirection:'row'}}>
                    <Text
                      variant="titleMedium"
                      style={{ textAlignVertical: "center" }}
                    >
                      To : {" "}
                    </Text>
                    <DatePicker
                      date={endDate}
                      setDate={setEndDate}
                      text={"To"}
                      showFlag={true}
                    />
            
                    </View>


                    <View style={{display:'flex',flexDirection:'row',marginTop:'3%'}}>
                    <Text
                        variant="titleMedium"
                        style={{ textAlignVertical: "center" }}
                      >
                        City : {" "}
                      </Text>
                    
                        <DropdownSelect
                          options={cities}
                          setValue={setCity}
                          placeholder={city}
                        />
                  

                    </View>
            </View>
            <Text style={{textAlign:"center",fontWeight:'500',fontSize:15,marginTop:'2%',marginBottom:'3%'}}>Order Report</Text>
            <Table/>
            </View>
        </View>
    )
})


const styles = StyleSheet.create({
    container:{
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",    
    },
    pagecontainer:{
        width: "100%",
        padding: 10,
        paddingLeft:"4%"    
    },
    filtercontainer:{
        display:'flex',
        justifyContent:'space-between',
        flexDirection:'row',
        flexWrap:"wrap",
        borderBottomColor:'silver',
        borderBottomWidth:1,
        paddingBottom:'5%'
    }
  });
  