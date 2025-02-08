'use client';

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, FlatList, Image } from 'react-native';
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

  useEffect(() => {
    const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
    setRandomSuggestions(shuffled.slice(0, 3));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <StatusBar hidden={true} />
      <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton}>
        <Icon name="menu" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>cutie</Text>
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
    bounces={false} // Voorkomt omhoog swipen
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
      <View style={styles.bottomBar}>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.inputButton}>
        <Icon name="plus" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.inputButton}>
        <Icon name="globe" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput 
        style={styles.input}
        placeholder="Message"
        placeholderTextColor="#999"
        />
      </View>
      <TouchableOpacity style={styles.scrollTopButton}>
        <Icon name="arrow-up" size={24} color="#666" />
      </TouchableOpacity>
      </View>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  imageContainer: {
    flex: 1, // Zorgt ervoor dat het de resterende ruimte gebruikt
    justifyContent: 'center', // Centreert verticaal
    alignItems: 'center', // Centreert horizontaal
  },
  logo: {
    width: '10%',
    height: undefined, // Houdt de aspect ratio intact
    aspectRatio: 1, // Houdt de breedte/hoogte verhouding gelijk
  },
  
  
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 1, // Belangrijk! Dit laat horizontaal swipen toe, maar voorkomt omhoog swipen
    justifyContent: 'flex-end', // Duwt het naar beneden
  },
  
  suggestionsWrapper: {
    flex: 0, // Belangrijk! Dit voorkomt dat het omhoog kan swipen
    justifyContent: 'flex-end', // Zorgt ervoor dat de suggesties naar beneden gedrukt worden
    paddingBottom: 20, // Extra ruimte zodat het niet tegen de rand zit
  },
  
  
  
  
  suggestionCard: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 200,
    height: 100, // Fixed height for the card
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
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
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