import { View,StyleSheet,Text } from "react-native"
import { Button, TextInput } from "react-native-paper"


 export const MobilenumScreen = (({navigation})=>{
    const press = (()=>{
        navigation.navigate("otpscreen")
    })
    return(
        <>
        <View style={styles.topContainer}>
            <Text style={{fontWeight:"600",fontSize:30}}>PROGO</Text>
        </View>
        <View style={styles.bottcontainer}>
            <Text style={{alignSelf:"flex-start",marginLeft:'12%'}}>Mobile Number</Text>
            <TextInput
             style={styles.textInput}
             mode="outlined"
             label={"Phone number"}
             keyboardType={"numeric"}
            >

            </TextInput>
            <Button
            style={styles.button}
            mode="contained"
            onPress={press}
            >Continue</Button>

        </View>
        </>
    )
})

export const OtpScreen = (({navigation})=>{
    const press = ()=>{
        navigation.navigate("bottomnav")
    }
    return (
        <>
        
        <View style={styles.bottcontainer}>
            <Text style={{alignSelf:"flex-start",marginLeft:'12%',marginBottom:50}}>
                Otp has been sent to your registered mobile number
                +91 9876543210
            </Text>
        <Text style={{alignSelf:"flex-start",marginLeft:'12%'}}>Enter Otp</Text>
            <TextInput
             style={styles.textInput}
             mode="outlined"
             label={"Enter otp"}
             keyboardType={"numeric"}
            >

            </TextInput>
            <Button
            style={styles.button}
            mode="contained"
            
            onPress={press}>Verify OTP</Button>

        </View>
        </>

    )

})

const styles = StyleSheet.create({
    topContainer:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"lightgray"
    },
    bottcontainer:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"

    },
    textInput:{
        height: 50,
    width: 300,
    padding: 0,
    fontSize: 20,
    },
    button:{
        width: 300,
        borderRadius: 7,
        marginTop:"6%",

     
    }
})