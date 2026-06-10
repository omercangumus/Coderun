// Giriş ekranı — Stitch mobile auth design.
// GhostieReaction ile state-based mascot, gradient button, error banner, feature chips.

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
import 'widgets/auth_feature_chip.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  GhostieState _ghostieState = GhostieState.idle;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) {
      setState(() => _ghostieState = GhostieState.wrong);
      return;
    }
    setState(() {
      _errorMessage = null;
      _ghostieState = GhostieState.idle;
    });
    await ref.read(authProvider.notifier).login(
          _emailController.text.trim(),
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
                  title: 'Tekrar hoş geldin!',
                  subtitle: 'Öğrenmeye kaldığın yerden devam et.',
                ),
                const SizedBox(height: 28),

                // ── Form card ──
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.cardPaddingLg),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainerLowest,
                    borderRadius: BorderRadius.circular(AppSpacing.radiusXxl),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.onSurface.withValues(alpha: 0.04),
                        blurRadius: 20,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Error banner
                      if (_errorMessage != null) ...[
                        AuthErrorBanner(message: _errorMessage!),
                        const SizedBox(height: 16),
                      ],

                      // Email field
                      AuthTextField(
                        label: 'E-posta Adresi',
                        hint: 'ornek@email.com',
                        controller: _emailController,
                        validator: Validators.validateLoginIdentifier,
                        keyboardType: TextInputType.emailAddress,
                        prefixIcon: Icons.email_outlined,
                        onChanged: (_) => _resetGhostie(),
                      ),
                      const SizedBox(height: 16),

                      // Password label row with forgot password
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Şifre',
                            style: TextStyle(
                              fontFamily: 'Lexend',
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppColors.onSurface,
                            ),
                          ),
                          GestureDetector(
                            onTap: () => context.push('/forgot-password'),
                            child: const Text(
                              'Şifremi Unuttum',
                              style: TextStyle(
                                fontFamily: 'Lexend',
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: AppColors.primary,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),

                      // Password field (no label, label is above)
                      AuthTextField(
                        label: '',
                        hint: '••••••••',
                        controller: _passwordController,
                        validator: Validators.validateLoginPassword,
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
                          onPressed: () => setState(
                              () => _obscurePassword = !_obscurePassword),
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

                      // Login button
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
                                      color: AppColors.primary
                                          .withValues(alpha: 0.3),
                                      blurRadius: 12,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                          ),
                          child: ElevatedButton(
                            onPressed: isLoading ? null : _handleLogin,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(
                                    AppSpacing.radiusLg),
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
                                        'Giriş yapılıyor...',
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
                                        'Giriş Yap',
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
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // ── Register link ──
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Hesabın yok mu? ',
                      style: TextStyle(
                        fontFamily: 'Lexend',
                        fontSize: 14,
                        color: AppColors.onSurfaceVariant,
                      ),
                    ),
                    GestureDetector(
                      onTap: () => context.go('/register'),
                      child: const Text(
                        'Ücretsiz kayıt ol',
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
                const SizedBox(height: 28),

                // ── Feature chips ──
                const Text(
                  'POPÜLER TEKNOLOJİLER',
                  style: TextStyle(
                    fontFamily: 'SpaceGrotesk',
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1.5,
                    color: AppColors.outline,
                  ),
                ),
                const SizedBox(height: 12),
                const Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  alignment: WrapAlignment.center,
                  children: [
                    AuthFeatureChip(emoji: '🐍', label: 'Python'),
                    AuthFeatureChip(emoji: '⚙️', label: 'DevOps'),
                    AuthFeatureChip(emoji: '☁️', label: 'Cloud'),
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
