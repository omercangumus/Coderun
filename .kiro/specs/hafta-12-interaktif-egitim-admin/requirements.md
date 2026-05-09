# Requirements Document

## Introduction

Bu spec, Coderun platformuna interaktif ders tipleri, pekiştirme algoritması ve admin paneli eklenmesini kapsar. Coderun; Python/DevOps/Cloud konularını Duolingo benzeri gamification mekanikleriyle öğreten bir mobil (Flutter) ve web (Next.js) platformudur. Mascot adı **Ghostie**, AI mentor adı **Ghostie AI**'dır.

Mevcut altyapı üzerine şu üç ana bileşen eklenmektedir:
1. **İnteraktif Soru Tipleri** — `fill_in_blank`, `reorder`, `true_false_reason`, `spot_the_bug`, `multi_select`, `code_completion` (mevcut) + yeni alanlar
2. **Pekiştirme Algoritması** — Yanlış cevap sonrası otomatik tetiklenen, tek seferlik takip sorusu
3. **Admin Paneli** — Süper kullanıcılar için içerik yönetim arayüzü (web + backend)

Tasarım referansları:
- Mobil: `docs/design/stitch/mobile/MobilDers Ekranları/`
- Web ders ekranları: `docs/design/stitch/web/WebDersEkranları/`
- Web admin: `docs/design/stitch/web/WebAdmin/`

---

## Glossary

- **Coderun**: Platformun adı.
- **Ghostie**: Platformun maskotu; ders ekranlarında rehberlik eden karakter.
- **Ghostie_AI**: OpenRouter tabanlı AI mentor servisi.
- **Question_Type**: Soru türünü belirten enum değeri.
- **Reinforcement_Question**: Yanlış cevap sonrası gösterilen, kavramı pekiştiren takip sorusu.
- **Word_Bank**: `fill_in_blank` soruları için kullanıcıya sunulan kelime/ifade havuzu.
- **Code_Block**: `spot_the_bug` ve `code_completion` sorularında gösterilen kod parçası.
- **Buggy_Line_Index**: `spot_the_bug` sorusunda hatalı satırın sıfır tabanlı indeksi.
- **Superuser**: `is_superuser=True` olan, admin paneline erişim yetkisi bulunan kullanıcı.
- **Admin_Panel**: Süper kullanıcıların içerik (path, ders, soru, kullanıcı) yönettiği web arayüzü.
- **LessonResultResponse**: Ders cevap gönderimi sonucunu döndüren API yanıt şeması.
- **UserProgress**: Kullanıcının bir dersteki ilerleme kaydı.
- **Alembic**: SQLAlchemy için veritabanı migrasyon aracı.
- **Flutter**: Mobil uygulama geliştirme çerçevesi.
- **Next.js**: Web uygulaması geliştirme çerçevesi.
- **FastAPI**: Backend REST API çerçevesi.

---

## Requirements

### Requirement 1: Yeni Soru Tipleri — Backend Model ve Şema Güncellemesi

**User Story:** Bir içerik editörü olarak, farklı öğrenme stillerine hitap eden çeşitli soru tiplerini sisteme eklemek istiyorum; böylece öğrenciler daha etkileşimli dersler deneyimleyebilsin.

#### Acceptance Criteria

1. THE Backend SHALL `question_type` alanı için şu değerleri desteklemelidir (mevcut değerler korunur): `multiple_choice`, `code_completion`, `code_editor`, `fill_in_blank`, `reorder`, `true_false_reason`, `spot_the_bug`, `multi_select`.
2. THE `Question` modeli SHALL şu yeni alanları içermelidir: `word_bank: list[str] | None`, `code_block: str | None`, `buggy_line_index: int | None`, `explanation: str | None`, `reinforcement_question_id: UUID | None` (self-referential FK, nullable), `is_reinforcement: bool = False`.
3. THE `QuestionResponse` şeması SHALL yeni alanları (`word_bank`, `code_block`, `buggy_line_index`, `explanation`, `is_reinforcement`) içermelidir; `correct_answer` client'a asla gönderilmemelidir.
4. WHEN `question_type` değeri `fill_in_blank` ise, THE Backend SHALL `word_bank` alanının dolu olduğunu doğrulamalıdır.
5. WHEN `question_type` değeri `spot_the_bug` ise, THE Backend SHALL `code_block` ve `buggy_line_index` alanlarının dolu olduğunu doğrulamalıdır.
6. WHEN `question_type` değeri `reorder` ise, THE Backend SHALL `options` alanının sıralanacak kod satırlarını içerdiğini doğrulamalıdır.
7. THE Backend SHALL `reinforcement_question_id` için self-referential foreign key kısıtı tanımlamalıdır; bir pekiştirme sorusunun kendisi başka bir pekiştirme sorusuna sahip olamaz (`is_reinforcement=True` olan sorular için `reinforcement_question_id` NULL olmalıdır).
8. THE Backend SHALL yeni alanlar için Alembic migrasyonu oluşturmalı ve uygulamalıdır.

---

### Requirement 2: Pekiştirme Algoritması

**User Story:** Bir öğrenci olarak, yanlış cevap verdiğimde ilgili kavramı pekiştiren basit bir takip sorusu görmek istiyorum; böylece konuyu daha iyi anlayabileyim.

#### Acceptance Criteria

1. WHEN bir kullanıcı soruya yanlış cevap verdiğinde VE sorunun `reinforcement_question_id` alanı dolu ise, THEN THE `LessonResultResponse` SHALL `reinforcement_question` alanını içermelidir (doğru cevap olmadan).
2. WHEN pekiştirme sorusu gönderildiğinde VE cevap doğru ise, THEN THE Backend SHALL `UserProgress.reinforcement_passed = True` olarak güncellemeli ve derse devam etmelidir.
3. WHEN pekiştirme sorusu gönderildiğinde VE cevap yanlış ise, THEN THE Backend SHALL yalnızca `explanation` alanını göstermeli ve derse devam etmelidir; ikinci bir pekiştirme sorusu tetiklenmemelidir.
4. THE Backend SHALL pekiştirme döngüsünü önlemelidir: `is_reinforcement=True` olan sorular için `reinforcement_question_id` her zaman NULL olmalıdır.
5. THE `UserProgress` modeli SHALL `reinforcement_triggered: bool = False` ve `reinforcement_passed: bool = False` alanlarını içermelidir.
6. THE `LessonResultResponse` şeması SHALL `reinforcement_question: QuestionResponse | None = None` alanını içermelidir.
7. THE Backend SHALL pekiştirme sorusu için Alembic migrasyonu oluşturmalı ve uygulamalıdır.

---

### Requirement 3: Kullanıcı Modeli — Süper Kullanıcı Alanı

**User Story:** Bir sistem yöneticisi olarak, belirli kullanıcılara admin yetkisi verebilmek istiyorum; böylece içerik yönetimi için güvenli bir erişim kontrolü sağlanabilsin.

#### Acceptance Criteria

1. THE `User` modeli SHALL `is_superuser: bool = False` alanını içermelidir.
2. THE Backend SHALL `is_superuser` alanı için Alembic migrasyonu oluşturmalı ve uygulamalıdır.
3. THE `UserResponse` şeması SHALL `is_superuser` alanını içermelidir.
4. THE Backend SHALL `get_current_superuser` dependency fonksiyonunu sağlamalıdır; bu fonksiyon `is_superuser=False` olan kullanıcılar için HTTP 403 döndürmelidir.
5. IF bir kullanıcı `is_superuser=False` iken admin endpoint'lerine erişmeye çalışırsa, THEN THE Backend SHALL HTTP 403 yanıtı döndürmelidir.

---

### Requirement 4: Admin Backend Endpoint'leri

**User Story:** Bir içerik yöneticisi olarak, öğrenme yollarını, dersleri ve soruları API üzerinden yönetebilmek istiyorum; böylece içerik güncellemeleri hızlı ve güvenli şekilde yapılabilsin.

#### Acceptance Criteria

1. THE Backend SHALL `/admin` prefix'i ve `admin` tag'i ile bir admin router sağlamalıdır; tüm endpoint'ler `get_current_superuser` dependency'sini kullanmalıdır.
2. THE Admin_Panel SHALL şu istatistik endpoint'ini sağlamalıdır: `GET /admin/stats` — toplam kullanıcı, aktif kullanıcı, tamamlanan ders sayısı.
3. THE Admin_Panel SHALL öğrenme yolları (paths/modules) için CRUD endpoint'leri sağlamalıdır: `GET /admin/paths`, `POST /admin/paths`, `PATCH /admin/paths/{id}`, `DELETE /admin/paths/{id}`, `PATCH /admin/paths/reorder`.
4. THE Admin_Panel SHALL birimler (units/lessons) için CRUD endpoint'leri sağlamalıdır: `GET /admin/paths/{path_id}/units`, `POST /admin/paths/{path_id}/units`, `PATCH /admin/units/{id}`, `DELETE /admin/units/{id}`, `PATCH /admin/units/reorder`.
5. THE Admin_Panel SHALL dersler için CRUD endpoint'leri sağlamalıdır: `GET /admin/units/{unit_id}/lessons`, `POST /admin/units/{unit_id}/lessons`, `PATCH /admin/lessons/{id}`, `DELETE /admin/lessons/{id}`, `GET /admin/lessons/{id}/stats`.
6. THE Admin_Panel SHALL sorular için CRUD endpoint'leri sağlamalıdır: `GET /admin/lessons/{lesson_id}/questions`, `POST /admin/lessons/{lesson_id}/questions`, `PATCH /admin/questions/{id}`, `DELETE /admin/questions/{id}`.
7. THE Admin_Panel SHALL kullanıcı yönetimi için salt okunur endpoint'ler sağlamalıdır: `GET /admin/users`, `GET /admin/users/{id}/progress`.
8. THE Backend SHALL admin router'ı `backend/app/api/v1/router.py` dosyasına eklenmelidir.
9. WHEN bir admin endpoint'i çağrıldığında VE kullanıcı `is_superuser=False` ise, THEN THE Backend SHALL HTTP 403 döndürmelidir.

---

### Requirement 5: Seed Verisi Güncellemesi

**User Story:** Bir geliştirici olarak, yeni soru tiplerinin her biri için örnek veri görmek istiyorum; böylece geliştirme ve test süreçleri kolaylaşsın.

#### Acceptance Criteria

1. THE Backend SHALL her yeni soru tipi için en az 2 örnek soru içeren seed verisi sağlamalıdır: `fill_in_blank`, `reorder`, `true_false_reason`, `spot_the_bug`, `multi_select`.
2. THE Seed verisi SHALL en az 1 pekiştirme sorusu örneği içermelidir; bu soru `is_reinforcement=True` ve `reinforcement_question_id=NULL` olmalıdır.
3. THE Seed verisi SHALL mevcut `multiple_choice` ve `code_completion` sorularını koruyarak yeni sorular eklenmelidir.

---

### Requirement 6: Flutter Mobil — İnteraktif Ders Widget'ları

**User Story:** Bir mobil kullanıcı olarak, farklı soru tiplerini görsel olarak ayırt edebilen ve etkileşimli olan widget'larla ders yapmak istiyorum; böylece öğrenme deneyimim daha ilgi çekici olsun.

#### Acceptance Criteria

1. THE Flutter_App SHALL `fill_in_blank` soru tipi için `FillInBlankWidget` widget'ını sağlamalıdır; bu widget kelime bankasından sürükle-bırak veya dokunarak boşluk doldurma desteklemelidir.
2. THE Flutter_App SHALL `reorder` soru tipi için `ReorderWidget` widget'ını sağlamalıdır; bu widget kod satırlarını sürükleyerek yeniden sıralama desteklemelidir.
3. THE Flutter_App SHALL `true_false_reason` soru tipi için `TrueFalseReasonWidget` widget'ını sağlamalıdır; bu widget Doğru/Yanlış seçimi ve kısa gerekçe girişi içermelidir.
4. THE Flutter_App SHALL `spot_the_bug` soru tipi için `SpotTheBugWidget` widget'ını sağlamalıdır; bu widget kod satırlarını tıklanabilir olarak göstermeli ve seçilen satırı vurgulamalıdır.
5. THE Flutter_App SHALL `multi_select` soru tipi için `MultiSelectWidget` widget'ını sağlamalıdır; bu widget birden fazla seçeneğin seçilmesine izin vermelidir.
6. THE Flutter_App SHALL `ReinforcementCardWidget` widget'ını sağlamalıdır; bu widget pekiştirme sorusunu Ghostie maskotu ile birlikte göstermelidir.
7. THE Flutter_App SHALL `GhostieReaction` widget'ını sağlamalıdır; bu widget doğru/yanlış/pekiştirme durumlarına göre farklı Ghostie ifadeleri göstermelidir.
8. THE `LessonScreen` SHALL `question_type` değerine göre doğru widget'ı yönlendirmelidir; bilinmeyen tipler için `MultipleChoiceWidget` varsayılan olarak kullanılmalıdır.
9. WHEN bir ders cevabı gönderildiğinde VE yanıtta `reinforcement_question` alanı dolu ise, THEN THE Flutter_App SHALL `ReinforcementCardWidget`'ı göstermelidir.
10. THE Flutter_App SHALL her cevap sonrası `GhostieReaction` widget'ını göstermelidir.
11. THE Flutter_App SHALL tasarım referanslarındaki renk paleti ve tipografi sistemini kullanmalıdır: primary `#3d4ad8`, secondary `#006d37`, font ailesi Lexend/Plus Jakarta Sans/Space Grotesk.

---

### Requirement 7: Next.js Web — İnteraktif Ders Bileşenleri

**User Story:** Bir web kullanıcısı olarak, masaüstü ekranında 3 sütunlu düzende interaktif ders sorularını çözebilmek istiyorum; böylece geniş ekrandan tam anlamıyla yararlanabileyim.

#### Acceptance Criteria

1. THE Web_App SHALL `fill_in_blank` soru tipi için `FillInBlankQuestion` bileşenini sağlamalıdır; bu bileşen kelime bankası chip'leri ve kod bloğu içindeki boşluk alanını göstermelidir.
2. THE Web_App SHALL `reorder` soru tipi için `ReorderQuestion` bileşenini sağlamalıdır; bu bileşen sürükle-bırak ile kod satırı sıralama desteklemelidir.
3. THE Web_App SHALL `true_false_reason` soru tipi için `TrueFalseReasonQuestion` bileşenini sağlamalıdır.
4. THE Web_App SHALL `spot_the_bug` soru tipi için `SpotTheBugQuestion` bileşenini sağlamalıdır; bu bileşen tıklanabilir kod satırları göstermelidir.
5. THE Web_App SHALL `multi_select` soru tipi için `MultiSelectQuestion` bileşenini sağlamalıdır.
6. THE Web_App SHALL `ReinforcementQuestion` bileşenini sağlamalıdır; bu bileşen tasarım referansındaki sağ panel (Ghostie Mentor) düzenini uygulamalıdır.
7. THE Ders sayfası SHALL `question_type` değerine göre doğru bileşeni yönlendirmelidir.
8. WHEN bir ders cevabı gönderildiğinde VE yanıtta `reinforcement_question` alanı dolu ise, THEN THE Web_App SHALL `ReinforcementQuestion` bileşenini sağ panelde göstermelidir.
9. THE Web_App SHALL tasarım referansındaki renk sistemini Tailwind konfigürasyonuna uygun şekilde uygulamalıdır.

---

### Requirement 8: Next.js Web — Admin Paneli

**User Story:** Bir içerik yöneticisi olarak, web tarayıcısından öğrenme yollarını, dersleri ve soruları yönetebilmek istiyorum; böylece içerik güncellemeleri teknik bilgi gerektirmeden yapılabilsin.

#### Acceptance Criteria

1. THE Admin_Panel SHALL `/admin` route'unda, öğrenci uygulamasından ayrı bir layout ile erişilebilir olmalıdır.
2. THE Web_App middleware'i SHALL `/admin` route'larına erişimde `is_superuser` kontrolü yapmalıdır; `is_superuser=False` olan kullanıcıları `/login` sayfasına yönlendirmelidir.
3. THE Admin_Panel SHALL şu sayfaları içermelidir: Dashboard (`/admin`), Öğrenme Yolları (`/admin/paths`), Ders Yönetimi (`/admin/lessons/[lessonId]`), Soru Editörü (`/admin/questions/new` ve `/admin/questions/[questionId]`), Kullanıcı Yönetimi (`/admin/users`).
4. THE Admin_Panel Dashboard SHALL toplam kullanıcı, aktif kullanıcı ve tamamlanan ders sayısı istatistiklerini göstermelidir.
5. THE Admin_Panel SHALL öğrenme yolları için listeleme, oluşturma, düzenleme ve silme işlemlerini desteklemelidir.
6. THE Admin_Panel SHALL soru editöründe tüm yeni soru tiplerini (`fill_in_blank`, `reorder`, `true_false_reason`, `spot_the_bug`, `multi_select`) desteklemelidir.
7. THE Admin_Panel SHALL soru editöründe pekiştirme sorusu ekleme/kaldırma toggle'ını içermelidir.
8. THE Admin_Panel SHALL tasarım referansındaki (`docs/design/stitch/web/WebAdmin/`) görsel düzeni uygulamalıdır: sol sidebar navigasyon, üst başlık, içerik alanı.
9. THE Admin_Panel SHALL `src/lib/api/admin-api.ts` dosyasında tüm admin API istemci fonksiyonlarını içermelidir.
10. IF backend API'leri hazır değilse, THEN THE Web_App SHALL izole mock veri dosyaları kullanmalıdır; mock veriler bileşen içine gömülmemelidir.

---

### Requirement 9: API Entegrasyonu ve Mock Veri

**User Story:** Bir geliştirici olarak, frontend bileşenlerinin backend API'leriyle doğru şekilde entegre olmasını istiyorum; API hazır olmadığında ise izole mock dosyalarından veri almasını istiyorum.

#### Acceptance Criteria

1. THE `module-api.ts` SHALL `LessonResultResponse` içindeki `reinforcement_question` alanını işleyecek şekilde güncellenmelidir.
2. THE `module.types.ts` SHALL yeni soru tipi alanlarını (`wordBank`, `codeBlock`, `buggyLineIndex`, `explanation`, `isReinforcement`) içerecek şekilde güncellenmelidir.
3. THE Flutter_App SHALL `QuestionModel`'i yeni alanları (`word_bank`, `code_block`, `buggy_line_index`, `explanation`, `is_reinforcement`) içerecek şekilde güncellenmelidir.
4. THE Flutter_App SHALL `LessonResultModel`'i `reinforcement_question` alanını içerecek şekilde güncellenmelidir.
5. IF backend API'leri hazır değilse, THEN THE Web_App SHALL `src/lib/mocks/` dizininde izole mock dosyaları kullanmalıdır; mock veriler bileşen içine gömülmemelidir.
6. IF backend API'leri hazır değilse, THEN THE Flutter_App SHALL `lib/data/mocks/` dizininde izole mock dosyaları kullanmalıdır.
7. THE Web_App SHALL mevcut `axios-client.ts` ve `module-api.ts` yapısını koruyarak yeni endpoint'leri eklemelidir.

---

### Requirement 10: Derleme ve Kalite Kontrolleri

**User Story:** Bir geliştirici olarak, tüm değişikliklerin mevcut testleri kırmadan ve derleme hatası olmadan çalışmasını istiyorum; böylece CI/CD pipeline'ı sağlıklı kalsın.

#### Acceptance Criteria

1. THE Backend SHALL `python -m compileall .` komutunu hatasız tamamlamalıdır.
2. THE Backend SHALL `alembic upgrade head` komutunu hatasız tamamlamalıdır.
3. THE Backend SHALL mevcut `pytest tests/ -v` testlerini kırmadan geçmelidir.
4. THE Web_App SHALL `npm run lint` komutunu hatasız tamamlamalıdır.
5. THE Web_App SHALL `npm run build` komutunu hatasız tamamlamalıdır.
6. THE Flutter_App SHALL `flutter analyze` komutunu hatasız tamamlamalıdır.
7. THE Flutter_App SHALL `flutter test` komutunu hatasız tamamlamalıdır.
8. THE Backend SHALL mevcut auth, routing, gamification, XP, streak ve leaderboard işlevselliğini koruyarak yeni özellikler eklemelidir.
9. THE Backend SHALL OpenRouter/Ghostie AI entegrasyonunu kaldırmamalı veya değiştirmemelidir.
10. THE Web_App VE Flutter_App SHALL API anahtarlarını frontend veya mobil kodda açık metin olarak içermemelidir.
