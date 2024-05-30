import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';

const App = () => {
  const { linkWeb } = useLocalSearchParams();

  // Ensure linkWeb is a string
  const uri = Array.isArray(linkWeb) ? linkWeb[0] : linkWeb;

  return (
    <View style={styles.container}>
      {uri ? (
        <WebView 
          source={{ uri }} 
          style={styles.webview}
        />
      ) : (
        <Text>No URL provided</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default App;
