import React, { useEffect } from 'react'
import { View,Text } from 'react-native'

export const Signout = ({navigation}) => {
    useEffect(()=>{
        navigation.navigate("mobilenum")
    },[]);
  return (
    <View>
        <Text>Signout</Text>
    </View>
  )
}

