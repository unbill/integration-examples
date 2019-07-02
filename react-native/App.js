import React from 'react'
import { Alert, StyleSheet, WebView, SafeAreaView } from 'react-native'

// Fix for known issue - prevents the need for app ejection from Expo
// https://github.com/facebook/react-native/issues/10865
const patchPostMessageFunction = function() {
  var originalPostMessage = window.postMessage

  var patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer)
  }

  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
  }

  window.postMessage = patchedPostMessage
}
const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();'

const receiveEvent = event => {
  console.log('New event!', event)
  if (event == 'alive') {
    console.log('User is still active.')
  } else if (event == 'auth') {
    Alert.alert('Auth', 'The "auth" event was successfully received.', [{ text: 'OK' }])
  } else if (event == 'exit') {
    Alert.alert('Exit', 'The "exit" event was successfully received.', [{ text: 'OK' }])
  }
}

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <WebView
          injectedJavaScript={patchPostMessageJsCode}
          source={{ uri: 'https://connect.q2open.io' }}
          useWebKit={true}
          onMessage={event => receiveEvent(event.nativeEvent.data)}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ddd'
  }
})
