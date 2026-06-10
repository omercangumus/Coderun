// Kayıt ekranı — Flutter register_screen.dart'tan

import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GhostieImage } from '../../src/components/GhostieImage';
import type { GhostieState } from '../../src/components/GhostieImage';
import { useAuthStore } from '../../src/store/authStore';
import { useHaptic } from '../../src/hooks/useHaptic';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.status === 'loading');
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const { errorNotification, successNotification } = useHaptic();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ghostieState, setGhostieState] = useState<GhostieState>('idle');
  const [localError, setLocalError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!email.trim() || !email.includes('@')) {
      setLocalError('Geçerli bir e-posta adresi girin');
      return false;
    }
    if (!username.trim()) {
      setLocalError('Kullanıcı adı gerekli');
      return false;
    }
    if (username.length < 3 || username.length > 30) {
      setLocalError('Kullanıcı adı 3 ila 30 karakter arasında olmalı');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setLocalError('Kullanıcı adı sadece harf, rakam ve alt çizgi (_) içerebilir');
      return false;
    }
    if (password.length < 8) {
      setLocalError('Şifre en az 8 karakter olmalı');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setLocalError('Şifre en az bir büyük harf içermelidir');
      return false;
    }
    if (!/\d/.test(password)) {
      setLocalError('Şifre en az bir rakam içermelidir');
      return false;
    }
    setLocalError(null);
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) {
      setGhostieState('sad');
      errorNotification();
      return;
    }
    clearError();
    setLocalError(null);
    try {
      await register(email.trim(), username.trim(), password);
      setGhostieState('happy');
      successNotification();
    } catch {
      setGhostieState('sad');
      errorNotification();
    }
  };

  const displayError = localError ?? error;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.hero}>
            <GhostieImage state={ghostieState} size={90} />
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>
              Ücretsiz başla, bugün öğrenmeye başla!
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {displayError ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            ) : null}

            <Text style={styles.label}>E-posta Adresi</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@email.com"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />

            <Text style={styles.label}>Kullanıcı Adı</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="kullaniciadi"
              placeholderTextColor="#6B7280"
              autoCapitalize="none"
              returnKeyType="next"
            />

            <Text style={styles.label}>Şifre</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="En az 6 karakter"
                placeholderTextColor="#6B7280"
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((v) => !v)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.disabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>Kayıt Ol →</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Zaten hesabın var mı? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F1A' },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  hero: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
    gap: 12,
  },
  title: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#9CA3AF', textAlign: 'center' },
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  errorBanner: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '500' },
  label: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#0F0F1A',
    borderWidth: 1,
    borderColor: '#2D2D44',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 16,
  },
  passwordContainer: { position: 'relative', marginBottom: 0 },
  passwordInput: { paddingRight: 48, marginBottom: 0 },
  eyeButton: { position: 'absolute', right: 14, top: 14 },
  eyeIcon: { fontSize: 18 },
  registerButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  disabled: { opacity: 0.7 },
  registerButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: { color: '#9CA3AF', fontSize: 14 },
  loginLink: { color: '#7C3AED', fontSize: 14, fontWeight: '700' },
});
