import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {
  const url = "https://www.cnnindonesia.com/hiburan/20240529104256-234-1103229/viral-nia-ramadhani-dan-ardi-bakrie-naik-mobil-polisi";

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: url }}
        style={styles.webview}
      />
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
