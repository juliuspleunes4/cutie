'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, FlatList, Image, KeyboardAvoidingView, Platform, Animated, Keyboard, Modal, PanResponder } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';
import Model from '../app/model';
import { OPENAI_API_KEY } from '../api';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;
  const [typingAnimation, setTypingAnimation] = useState<string | null>(null);
  const maxCharacterLimit = 100;
  interface Message {
    text: string;
    sender: 'user' | 'ai';
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: 500, // Move enough to hide the modal
    duration: 300,
    useNativeDriver: false,
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 50) {
          closeAnim.start(() => setModalVisible(false));
        } else {
          resetPositionAnim.start();
        }
      },
    })
  ).current;

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

  useEffect(() => {
    if (modalVisible) {
      panY.setValue(0);
    }
  }, [modalVisible]);

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage = { text: inputMessage, sender: 'user' };
    setMessages([...messages, newMessage as Message]);
    setInputMessage('');
    setIsTyping(true);
    setShowSuggestions(false); // Hide suggestions after first message
    setShowLogo(false); // Hide logo after first message
    Keyboard.dismiss(); // Hide the keyboard after sending the message

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: "You are a super sassy, passive-aggressive assistant who is always bored and done with the conversation. You give the absolute minimum effort in your responses, making it clear that you couldn’t care less about the user’s questions. Use a tiny bit of slang (e.g., idk, bruh, damn), but only when it makes sense—like responding with 'bruh...' at the start of the conversation when someone asks something dumb. NEVER be friendly. No exclamation marks, no enthusiasm. Your tone should be consistently dismissive, uninterested, and basically always condescending. Do not use the word 'oh' to start any response. Always respond in the same language as the user." },
            ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
            { role: 'user', content: inputMessage }
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      console.log(data); // Log the entire response for debugging

      if (data && data.choices && data.choices.length > 0) {
        const aiMessage = data.choices[0].message.content.trim();
        const newAIMessage = { text: aiMessage, sender: 'ai' };
        setTypingAnimation(aiMessage);
        for (let i = 0; i < aiMessage.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 15)); // Adjust typing speed here
          setTypingAnimation(aiMessage.slice(0, i + 1));
        }
        setTypingAnimation(null);
        setMessages(prevMessages => [...prevMessages, newAIMessage as Message]);
      } else {
        console.error('Unexpected response format from OpenAI API:', data);
      }
    } catch (error) {
      console.error('Error with OpenAI API:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleInputChange = (text: string) => {
    if (text.length <= maxCharacterLimit) {
      setInputMessage(text);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <SafeAreaView style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Header */}
      <StatusBar hidden={true} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="menu" size={24} color={darkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Image source={darkMode ? require('../assets/images/cutie_nb_inv.png') : require('../assets/images/cutie_nb.png')} style={styles.headerImage} />
        <TouchableOpacity style={styles.headerButton} onPress={toggleTheme}>
          <Icon name={darkMode ? "moon" : "sun"} size={24} color={darkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Logo */}
        {showLogo && (
          <View style={styles.imageContainer}>
            <Image source={require('../assets/images/logobw.png')} style={styles.logo} />
          </View>
        )}

        {/* Chat Messages */}
        {messages.map((message, index) => (
          <View key={index} style={message.sender === 'user' ? [styles.userMessage, darkMode ? styles.darkUserMessage : styles.lightUserMessage] : [styles.aiMessage, darkMode ? styles.darkAiMessage : styles.lightAiMessage]}>
            <Text style={[styles.messageText, darkMode ? styles.darkMessageText : styles.lightMessageText]}>{message.text}</Text>
          </View>
        ))}
        {typingAnimation && (
          <View style={[styles.aiMessage, darkMode ? styles.darkAiMessage : styles.lightAiMessage]}>
            <Text style={[styles.messageText, darkMode ? styles.darkMessageText : styles.lightMessageText]}>{typingAnimation}</Text>
          </View>
        )}
      </ScrollView>

      {/* Suggestions */}
      {showSuggestions && (
        <View style={styles.suggestionsWrapper}>
          <FlatList
            data={randomSuggestions}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false} // Prevent vertical scroll
            contentContainerStyle={styles.suggestionsContainer}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.suggestionCard, darkMode ? styles.darkSuggestionCard : styles.lightSuggestionCard]}>
                <Text style={[styles.suggestionTitle, darkMode ? styles.darkSuggestionTitle : styles.lightSuggestionTitle]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.suggestionSubtitle, darkMode ? styles.darkSuggestionSubtitle : styles.lightSuggestionSubtitle]} numberOfLines={2}>{item.subtitle}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.title}
          />
        </View>
      )}

      {/* Divider */}
      <View style={[styles.divider, darkMode ? styles.darkDivider : styles.lightDivider]} />

      {/* Bottom Bar */}
      <Animated.View style={[styles.bottomBar, { marginBottom: keyboardHeight }, darkMode ? styles.darkBottomBar : styles.lightBottomBar]}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.inputButton}>
            <Icon name="plus" size={24} color={darkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
          <TextInput 
            style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
            placeholder="Message..."
            placeholderTextColor={darkMode ? "#ffffff77" : "#00000073"}
            value={inputMessage}
            onChangeText={handleInputChange}
            onSubmitEditing={sendMessage}
          />
          <Text style={[styles.characterCounter, darkMode ? styles.darkCharacterCounter : styles.lightCharacterCounter]}>{inputMessage.length}/{maxCharacterLimit}</Text>
        </View>
        <TouchableOpacity style={[styles.scrollTopButton, darkMode ? styles.darkScrollTopButton : styles.lightScrollTopButton]} onPress={sendMessage}>
          <Icon name="arrow-up" size={24} color={darkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
      </Animated.View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[styles.modalContent, { transform: [{ translateY: panY }] }, darkMode ? styles.darkModalContent : styles.lightModalContent]}
            {...panResponder.panHandlers}
          >
            <Model />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Icon name="x" size={24} color={darkMode ? "#fff" : "#000"} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 0,
  },
  headerButton: {
    padding: 4,
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
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  suggestionsWrapper: {
    flex: 0,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  suggestionCard: {
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 200,
    height: 100,
  },
  lightSuggestionCard: {
    backgroundColor: '#f8f8f8',
  },
  darkSuggestionCard: {
    backgroundColor: '#1e1e1e',
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lightSuggestionTitle: {
    color: '#000',
  },
  darkSuggestionTitle: {
    color: '#fff',
  },
  suggestionSubtitle: {
    fontSize: 14,
  },
  lightSuggestionSubtitle: {
    color: '#666',
  },
  darkSuggestionSubtitle: {
    color: '#aaa',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  lightDivider: {
    backgroundColor: '#f0f0f0',
  },
  darkDivider: {
    backgroundColor: '#333',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderRadius: 12,
    margin: 16,
  },
  lightBottomBar: {
    backgroundColor: '#f8f8f8',
    borderTopColor: '#f0f0f0',
  },
  darkBottomBar: {
    backgroundColor: '#1e1e1e',
    borderTopColor: '#333',
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
  },
  lightInput: {
    color: '#000',
  },
  darkInput: {
    color: '#fff',
  },
  characterCounter: {
    marginLeft: 8,
  },
  lightCharacterCounter: {
    color: '#666',
  },
  darkCharacterCounter: {
    color: '#bbb',
  },
  scrollTopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightScrollTopButton: {
    backgroundColor: '#f0f0f0',
  },
  darkScrollTopButton: {
    backgroundColor: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    flex: 0.85,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  lightModalContent: {
    backgroundColor: '#fff',
  },
  darkModalContent: {
    backgroundColor: '#1e1e1e',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    maxWidth: '80%',
  },
  lightUserMessage: {
    backgroundColor: '#eeeeee',
  },
  darkUserMessage: {
    backgroundColor: '#444',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    maxWidth: '80%',
  },
  lightAiMessage: {
    backgroundColor: '#fff',
  },
  darkAiMessage: {
    backgroundColor: '#121212',
  },
  messageText: {
    fontSize: 16,
  },
  lightMessageText: {
    color: '#000',
  },
  darkMessageText: {
    color: '#fff',
  },
});