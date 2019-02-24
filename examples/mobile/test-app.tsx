import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
//import Svg, { Circle, Rect } from 'react-native-svg';
import Logo from './air-freshener.svg';

const instructions = Platform.select({
   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
   android:
      'Double tap R on your keyboard to reload,\n' +
      'Shake or press menu button for dev menu'
});

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF'
   },
   welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10
   },
   instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5
   }
});

//<Logo width={120} height={120} />

export class ExampleApp extends Component {
   render() {
      return (
         <View style={styles.container}>
            <Text style={styles.welcome}>Welcome to React Native!</Text>
            <Text style={styles.instructions}>
               To get started, edit app.tsx
            </Text>
            <Text style={styles.instructions}>{instructions}</Text>
            <Logo width={120} height={120} />
         </View>
      );
   }
}

// <Svg height="50%" width="50%" viewBox="0 0 100 100">
// <Circle
//    cx="50"
//    cy="50"
//    r="45"
//    stroke="blue"
//    strokeWidth="2.5"
//    fill="green"
// />
// <Rect
//    x="15"
//    y="15"
//    width="70"
//    height="70"
//    stroke="red"
//    strokeWidth="2"
//    fill="yellow"
// />
// </Svg>
