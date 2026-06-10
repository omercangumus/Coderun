// Ghostie AI Mentor Ekranı — Ghostie ile interaktif sohbet ve rehberlik arayüzü.
import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GhostieImage } from '../../src/components/GhostieImage';
import type { GhostieState } from '../../src/components/GhostieImage';
import { askMentor } from '../../src/api/mentor';
import { useHaptic } from '../../src/hooks/useHaptic';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ghostie';
  timestamp: Date;
}

const QUICK_SUGGESTIONS = [
  'Python\'da değişken nedir? 🐍',
  'Docker neden kullanılır? ⚙️',
  'Cloud bilişim ne işe yarar? ☁️',
  'Bana bir programlama ipucu ver! 💡',
];

export default function MentorScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [ghostieState, setGhostieState] = useState<GhostieState>('idle');
  const [loading, setLoading] = useState(false);
  const { lightImpact, successNotification } = useHaptic();
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    lightImpact();
    const userMsg: Message = {
      id: Math.random().toString(),
      text: textToSend.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setGhostieState('thinking');

    try {
      const response = await askMentor({ question: userMsg.text });
      
      const ghostieMsg: Message = {
        id: Math.random().toString(),
        text: response.answer,
        sender: 'ghostie',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, ghostieMsg]);
      setGhostieState('happy');
      successNotification();
    } catch (err) {
      const errorMsg: Message = {
        id: Math.random().toString(),
        text: 'Üzgünüm, şu an bağlantı kuramıyorum. Lütfen daha sonra tekrar dene! 🤖',
        sender: 'ghostie',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setGhostieState('sad');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, loading]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.ghostieWrapper}>
          <GhostieImage state={ghostieState} size={48} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Ghostie AI Mentor</Text>
            <Text style={styles.headerSubtitle}>
              {loading ? 'Düşünüyor...' : 'Çevrimiçi • Sana yardıma hazır'}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {messages.length === 0 ? (
          /* Welcome Screen with suggestions */
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.welcomeContainer}
            showsVerticalScrollIndicator={false}
          >
            <GhostieImage state="happy" size={100} />
            <Text style={styles.welcomeTitle}>Selam! Ben Ghostie 👻</Text>
            <Text style={styles.welcomeSubtitle}>
              Yazılım, Python, DevOps veya Cloud konularında aklına takılan her şeyi bana sorabilirsin. Sana rehberlik etmek için buradayım!
            </Text>

            <Text style={styles.suggestionHeader}>ÖNERİLEN SORULAR</Text>
            <View style={styles.suggestionsGrid}>
              {QUICK_SUGGESTIONS.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  style={styles.suggestionCard}
                  onPress={() => sendMessage(suggestion)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          /* Chat History List */
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isUser = item.sender === 'user';
              return (
                <View style={[styles.messageRow, isUser ? styles.rowUser : styles.rowGhostie]}>
                  {!isUser && (
                    <View style={styles.avatarMini}>
                      <GhostieImage state={ghostieState === 'thinking' ? 'thinking' : 'idle'} size={24} />
                    </View>
                  )}
                  <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleGhostie]}>
                    <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextGhostie]}>
                      {item.text}
                    </Text>
                    <Text style={[styles.timeText, isUser ? styles.timeTextUser : styles.timeTextGhostie]}>
                      {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              );
            }}
            ListFooterComponent={
              loading ? (
                <View style={styles.typingIndicatorRow}>
                  <View style={styles.avatarMini}>
                    <GhostieImage state="thinking" size={24} />
                  </View>
                  <View style={styles.typingBubble}>
                    <ActivityIndicator size="small" color="#A78BFA" />
                  </View>
                </View>
              ) : null
            }
          />
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Ghostie'ye sor..."
            placeholderTextColor="#6B7280"
            onSubmitEditing={() => sendMessage(input)}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendButtonText}>Gönder</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F1A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A2E',
    backgroundColor: '#111124',
  },
  ghostieWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '500',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingTop: 48,
    gap: 16,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  suggestionHeader: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 32,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  suggestionsGrid: {
    width: '100%',
    gap: 10,
  },
  suggestionCard: {
    width: '100%',
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2D2D44',
    borderRadius: 14,
    padding: 16,
  },
  suggestionText: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '85%',
  },
  rowUser: {
    alignSelf: 'flex-end',
  },
  rowGhostie: {
    alignSelf: 'flex-start',
  },
  avatarMini: {
    width: 24,
    height: 24,
    marginBottom: 2,
  },
  bubble: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  bubbleUser: {
    backgroundColor: '#7C3AED',
    borderBottomRightRadius: 4,
  },
  bubbleGhostie: {
    backgroundColor: '#1A1A2E',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  bubbleTextGhostie: {
    color: '#E5E7EB',
  },
  timeText: {
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  timeTextUser: {
    color: 'rgba(255,255,255,0.6)',
  },
  timeTextGhostie: {
    color: '#6B7280',
  },
  typingIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  typingBubble: {
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2D2D44',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#1A1A2E',
    backgroundColor: '#111124',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    borderWidth: 1,
    borderColor: '#2D2D44',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#2D2D44',
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
