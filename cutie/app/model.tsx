'use client';

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Model = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the model file content.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});

export default Model;