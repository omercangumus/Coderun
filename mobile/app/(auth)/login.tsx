// Giriş ekranı — Flutter login_screen.dart'tan, koyu tema, mor birincil renk

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

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.status === 'loading');
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const { errorNotification, successNotification } = useHaptic();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ghostieState, setGhostieState] = useState<GhostieState>('idle');
  const [localError, setLocalError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!email.trim()) {
      setLocalError('E-posta adresi gerekli');
      return false;
    }
    if (!password) {
      setLocalError('Şifre gerekli');
      return false;
    }
    if (password.length < 8) {
      setLocalError('Şifre en az 8 karakter olmalı');
      return false;
    }
    setLocalError(null);
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) {
      setGhostieState('sad');
      errorNotification();
      return;
    }
    clearError();
    setLocalError(null);
    try {
      await login(email.trim(), password);
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
          {/* Hero Header */}
          <View style={styles.hero}>
            <GhostieImage state={ghostieState} size={100} />
            <Text style={styles.title}>Tekrar hoş geldin!</Text>
            <Text style={styles.subtitle}>
              Öğrenmeye kaldığın yerden devam et.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {displayError ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            ) : null}

            {/* Email */}
            <Text style={styles.label}>E-posta Adresi</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (ghostieState !== 'idle') setGhostieState('idle');
              }}
              placeholder="ornek@email.com"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            {/* Password label row */}
            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>Şifre</Text>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Şifremi Unuttum</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (ghostieState !== 'idle') setGhostieState('idle');
                }}
                placeholder="••••••••"
                placeholderTextColor="#6B7280"
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((v) => !v)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
              </TouchableOpacity>
            </View>

            {isLoading && (
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            )}

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Giriş Yap →</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Hesabın yok mu? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Ücretsiz kayıt ol</Text>
            </TouchableOpacity>
          </View>

          {/* Feature chips */}
          <Text style={styles.chipsTitle}>POPÜLER TEKNOLOJİLER</Text>
          <View style={styles.chipsRow}>
            {['🐍 Python', '⚙️ DevOps', '☁️ Cloud'].map((chip) => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
  },
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
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
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
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotText: {
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: '600',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 0,
  },
  passwordInput: {
    paddingRight: 48,
    marginBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  eyeIcon: {
    fontSize: 18,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderRadius: 2,
    marginTop: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '60%',
    backgroundColor: '#7C3AED',
    borderRadius: 2,
  },
  loginButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  registerLink: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '700',
  },
  chipsTitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  chipText: {
    color: '#D1D5DB',
    fontSize: 13,
  },
});
