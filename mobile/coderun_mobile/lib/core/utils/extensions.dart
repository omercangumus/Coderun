// Dart extension metodları.

extension StringExtensions on String {
  /// String'in ilk harfini büyük yapar.
  String get capitalize {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }

  /// Email formatında mı kontrol eder.
  bool get isValidEmail {
    final emailRegex = RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    return emailRegex.hasMatch(this);
  }
}

extension NullableStringExtensions on String? {
  /// Null veya boş mu kontrol eder.
  bool get isNullOrEmpty => this == null || this!.isEmpty;
}
