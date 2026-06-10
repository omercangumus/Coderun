// Kayıt ekranı — Stitch mobile register design.
// GhostieReaction ile state-based mascot, gradient button, error banner, tip card.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/assets/ghostie_assets.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/utils/validators.dart';
import '../../../providers/auth_provider.dart';
import 'widgets/auth_hero_header.dart';
import 'widgets/auth_text_field.dart';
import 'widgets/auth_error_banner.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirm = true;
  GhostieState _ghostieState = GhostieState.idle;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _usernameController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) {
      setState(() => _ghostieState = GhostieState.angry);
      return;
    }
    setState(() {
      _errorMessage = null;
      _ghostieState = GhostieState.idle;
    });
    await ref.read(authProvider.notifier).register(
          _emailController.text.trim(),
          _usernameController.text.trim(),
          _passwordController.text,
        );
  }

  void _resetGhostie() {
    if (_ghostieState != GhostieState.idle && _errorMessage == null) {
      setState(() => _ghostieState = GhostieState.idle);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final isLoading =
        authState.maybeWhen(loading: () => true, orElse: () => false);

    ref.listen<AuthState>(authProvider, (_, next) {
      next.whenOrNull(
        error: (message) {
          if (!mounted) return;
          setState(() {
            _errorMessage = message;
            _ghostieState = GhostieState.wrong;
          });
        },
        authenticated: (_) {
          if (!mounted) return;
          setState(() => _ghostieState = GhostieState.veryHappy);
        },
      );
    });

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // ── Hero header with Ghostie ──
                AuthHeroHeader(
                  ghostieState: _ghostieState,
                  title: 'Maceraya Katıl',
                  subtitle: 'Kodlamayı oyunlaştırarak öğrenmeye başla.',
                ),
                const SizedBox(height: 20),

                // ── Tip card ──
                Container(
                  width: double.infinity,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: AppColors.primaryFixed.withValues(alpha: 0.5),
                    borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.lightbulb_outline_rounded,
                            color: AppColors.primary,
                            size: 20,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Text(
                          'İlk yolculuğuna Python ile başlayabilirsin!',
                          style: TextStyle(
                            fontFamily: 'Lexend',
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: AppColors.onSurfaceVariant,
                            height: 1.4,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // ── Form fields ──
                // Error banner
                if (_errorMessage != null) ...[
                  AuthErrorBanner(message: _errorMessage!),
                  const SizedBox(height: 16),
                ],

                // Email
                AuthTextField(
                  label: 'E-posta',
                  hint: 'ornek@email.com',
                  controller: _emailController,
                  validator: Validators.validateEmail,
                  keyboardType: TextInputType.emailAddress,
                  prefixIcon: Icons.email_outlined,
                  onChanged: (_) => _resetGhostie(),
                ),
                const SizedBox(height: 16),

                // Username
                AuthTextField(
                  label: 'Kullanıcı Adı',
                  hint: 'kullanici_adi',
                  controller: _usernameController,
                  validator: Validators.validateUsername,
                  prefixIcon: Icons.person_outline,
                  onChanged: (_) => _resetGhostie(),
                ),
                const SizedBox(height: 16),

                // Password
                AuthTextField(
                  label: 'Şifre',
                  hint: 'Min. 8 karakter, büyük harf ve rakam',
                  controller: _passwordController,
                  validator: Validators.validatePassword,
                  obscureText: _obscurePassword,
                  prefixIcon: Icons.lock_outline,
                  onChanged: (_) => _resetGhostie(),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword
                          ? Icons.visibility_outlined
                          : Icons.visibility_off_outlined,
                      color: AppColors.grey,
                    ),
                    onPressed: () =>
                        setState(() => _obscurePassword = !_obscurePassword),
                  ),
                ),
                const SizedBox(height: 16),

                // Confirm password
                AuthTextField(
                  label: 'Şifre Tekrar',
                  hint: '••••••••',
                  controller: _confirmPasswordController,
                  validator: (value) => Validators.validatePasswordMatch(
                    value,
                    _passwordController.text,
                  ),
                  obscureText: _obscureConfirm,
                  prefixIcon: Icons.lock_outline,
                  onChanged: (_) => _resetGhostie(),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscureConfirm
                          ? Icons.visibility_outlined
                          : Icons.visibility_off_outlined,
                      color: AppColors.grey,
                    ),
                    onPressed: () =>
                        setState(() => _obscureConfirm = !_obscureConfirm),
                  ),
                ),
                const SizedBox(height: 24),

                // Loading indicator
                if (isLoading)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: const LinearProgressIndicator(
                        backgroundColor: AppColors.primaryFixed,
                        color: AppColors.primary,
                        minHeight: 3,
                      ),
                    ),
                  ),

                // Register button
                SizedBox(
                  width: double.infinity,
                  height: AppSpacing.buttonHeight,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          AppColors.primary,
                          AppColors.primaryContainer,
                        ],
                      ),
                      borderRadius:
                          BorderRadius.circular(AppSpacing.radiusLg),
                      boxShadow: isLoading
                          ? []
                          : [
                              BoxShadow(
                                color:
                                    AppColors.primary.withValues(alpha: 0.3),
                                blurRadius: 12,
                                offset: const Offset(0, 4),
                              ),
                            ],
                    ),
                    child: ElevatedButton(
                      onPressed: isLoading ? null : _handleRegister,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(AppSpacing.radiusLg),
                        ),
                      ),
                      child: isLoading
                          ? const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                ),
                                SizedBox(width: 12),
                                Text(
                                  'Kayıt yapılıyor...',
                                  style: TextStyle(
                                    fontFamily: 'Lexend',
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            )
                          : const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Kayıt Ol',
                                  style: TextStyle(
                                    fontFamily: 'Lexend',
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                SizedBox(width: 8),
                                Icon(Icons.arrow_forward, size: 18),
                              ],
                            ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // ── Login link ──
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Zaten hesabın var mı? ',
                      style: TextStyle(
                        fontFamily: 'Lexend',
                        fontSize: 14,
                        color: AppColors.onSurfaceVariant,
                      ),
                    ),
                    GestureDetector(
                      onTap: () => context.go('/login'),
                      child: const Text(
                        'Giriş yap',
                        style: TextStyle(
                          fontFamily: 'Lexend',
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
