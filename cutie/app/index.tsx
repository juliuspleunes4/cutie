'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, FlatList, Image, KeyboardAvoidingView, Platform, Animated, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';

const suggestions = [
  { title: "Write an email", subtitle: "to communicate professionally or casually" },
  { title: "Summarize a text", subtitle: "to quickly grasp the key points" },
  { title: "Generate a code snippet", subtitle: "to solve a programming challenge efficiently" },
  { title: "Translate a document", subtitle: "to make it accessible in another language" },
  { title: "Brainstorm a business idea", subtitle: "to explore new opportunities in the market" },
  { title: "Solve a math problem", subtitle: "to understand complex calculations step by step" },
  { title: "Create a practice exam", subtitle: "to test your knowledge before an important test" },
  { title: "Plan a weekly meal", subtitle: "to maintain a balanced and healthy diet" },
  { title: "Rewrite a paragraph", subtitle: "to improve clarity and engagement" },
  { title: "Explain a difficult concept", subtitle: "to make learning easier and more intuitive" },
  { title: "Draft a cover letter", subtitle: "to make a strong impression on employers" },
  { title: "Craft a social media post", subtitle: "to capture attention and boost engagement" },
  { title: "Analyze a dataset", subtitle: "to extract meaningful insights and trends" },
  { title: "Invent a movie plot", subtitle: "to create an exciting and original story" },
  { title: "Give strategic advice", subtitle: "to optimize business decisions and performance" }
];

export default function App() {
  const [randomSuggestions, setRandomSuggestions] = useState<typeof suggestions>([]);
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
    setRandomSuggestions(shuffled.slice(0, 3));

    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', (event) => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }).start();
    });

    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', (event) => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <StatusBar hidden={true} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
        <Image source={require('../assets/images/cutie_text.png')} style={styles.headerImage} />
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="edit-2" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Centered Image */}
        <View style={styles.imageContainer}>
          <Image source={require('../assets/images/logobw.png')} style={styles.logo} />
        </View>
      </ScrollView>

      {/* Suggestions */}
      <View style={styles.suggestionsWrapper}>
        <FlatList
          data={randomSuggestions}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false} // Prevent vertical scroll
          contentContainerStyle={styles.suggestionsContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionCard}>
              <Text style={styles.suggestionTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.suggestionSubtitle} numberOfLines={2}>{item.subtitle}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.title}
        />
      </View>

      {/* Bottom Bar */}
      <Animated.View style={[styles.bottomBar, { marginBottom: keyboardHeight }]}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.inputButton}>
            <Icon name="plus" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.inputButton}>
            <Icon name="layers" size={24} color="#000000" />
          </TouchableOpacity>
          <TextInput 
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor="#000000"
          />
        </View>
        <TouchableOpacity style={styles.scrollTopButton}>
          <Icon name="arrow-up" size={24} color="#000000" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4, // Adjusted padding for more top space
    marginTop: 0, // Removed margin
  },
  headerButton: {
    padding: 4, // Reduced padding
  },
  headerImage: {
    width: 100,
    height: 32,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  imageContainer: {
    flex: 1, // occupy remaining space
    justifyContent: 'center', // center vertically
    alignItems: 'center', // center horizontally
  },
  logo: {
    width: '10%',
    height: undefined, // maintain aspect ratio
    aspectRatio: 1, // keep width/height ratio
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 1, // allow horizontal scroll but prevent vertical
    justifyContent: 'flex-end', // push to bottom
  },
  suggestionsWrapper: {
    flex: 0, // prevent vertical scroll
    justifyContent: 'flex-end', // push suggestions to bottom
    paddingBottom: 20, // extra spacing from edge
  },
  suggestionCard: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 200,
    height: 100, // fixed height for the card
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  suggestionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10, // Adjusted padding
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#f8f8f8', // Same background color as suggestion cards
    borderRadius: 12, // Rounded corners
    margin: 16, // Margin to separate from screen edges
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  inputButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  scrollTopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});