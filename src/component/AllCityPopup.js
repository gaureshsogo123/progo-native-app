import {
    Modal,
    Portal,
    Provider,
    TextInput,
    useTheme,
    Text
  } from "react-native-paper";
  
import {
    View,
    TouchableOpacity,
    Dimensions,
    FlatList,
  } from "react-native";
import useCities from "../hooks/useCities";
import { useMemo, useState } from "react";

const {height} = Dimensions.get("screen");
const {width} = Dimensions.get("screen");

function AllCityPopup(setValue,value,onDismiss,visible) {
    const { cities } = useCities();
    const[search,setSearch]=useState("");

    const updateValue=((item)=>{
        setValue(item)
    })
    const filterdata = useMemo(() => {
        return cities.filter((val) => {
          if (val==""||search=="") {
            return val;
          }
          return val.toLowerCase().includes(search.toLowerCase());
        });
      }, [search]);
    
    const renderData = ({ item }) => {
        return (
          <View style={{ marginLeft: (width * 4) / 100 }}>
            <TouchableOpacity
              onPress={() => updateValue(item)}
              style={{
                paddingBottom: (height * 2) / 100,
                paddingTop: (height * 2) / 100,
              }}
            >
              <Text
                variant="titleMedium"
                style={{
                  fontSize: (height * 1.7) / 100,
                  fontWeight: "500",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          </View>
        );
      };
    
  return (
        <Provider>
            <Portal>
                <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={{
                    width:"70%",
                    height:200,
                    justifyContent:"center",
                    display:"flex"
                }}>
                <TextInput
                style={{
                  width: "100%",
                  height: (height * 6) / 100,
                  marginBottom: (height * 1.6) / 100,
                }}
                onChangeText={(val) => setSearch(val)}
                placeholder="Search"
              />
            <FlatList
              data={filterdata}
              renderItem={renderData}
              keyboardShouldPersistTaps={"handled"}
              keyExtractor={(item, index) => index}
            />
                </Modal>
            </Portal>
        </Provider>
  )
}

export default AllCityPopup