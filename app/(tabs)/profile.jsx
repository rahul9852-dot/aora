import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
const Profile = () => {
  return (
    <View>
      <Text>Aora!</Text>
      <StatusBar style='auto'/>
      <Link href="/profile" style={{color:'blue'}}>Got to Profile</Link>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})