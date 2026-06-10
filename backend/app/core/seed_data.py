# Coderun backend — kapsamlı ders içeriği seed verisi.
# Python (25 ders + 1 kodlama ödevi = 26), DevOps (8 ders), Cloud (8 ders)
# Her derste: multiple_choice, fill_in_blank, reorder, spot_the_bug, true_false_reason, multi_select karışık
# Pekiştirme soruları: is_reinforcement=True, has_reinforcement=True bağlantısıyla

SEED_DATA: list[dict] = [
    {
        'slug': 'python',
        'title': 'Python',
        'description': 'Python programlama dilinin temellerinden ileri seviyeye kadar kapsamlı öğrenme yolu.',
        'order': 1,
        'lessons': [
            {
                'title': 'Değişkenler ve Veri Tipleri',
                'lesson_type': 'quiz',
                'order': 1,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': "Python'da değişken tanımlamak için hangi anahtar kelime kullanılır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'var',
                                'let',
                                'Anahtar kelime gerekmez',
                                'dim',
                            ],
                        },
                        'correct_answer': 'Anahtar kelime gerekmez',
                        'hint': 'Python dinamik tipli bir dil.',
                        'explanation': "Python'da değişken tanımlamak için özel bir anahtar kelime gerekmez. Doğrudan `x = 5` yazılır.",
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': "Hangi ifade Python'da geçerli bir değişken atamasıdır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '1sayi = 10',
                                'sayi 1 = 10',
                                'sayi_1 = 10',
                                'sayi-1 = 10',
                            ],
                        },
                        'correct_answer': 'sayi_1 = 10',
                        'hint': 'Python değişken adları harf veya _ ile başlamalıdır.',
                        'explanation': "Python'da değişken adları harf veya alt çizgi ile başlamalıdır. Rakamla veya tire ile başlayamaz.",
                        'order': 2,
                    },
                    {
                        'question_text': 'type(True) ifadesinin sonucu nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                "<class 'int'>",
                                "<class 'bool'>",
                                "<class 'str'>",
                                "<class 'float'>",
                            ],
                        },
                        'correct_answer': "<class 'bool'>",
                        'hint': "True ve False Python'da bool tipindedir.",
                        'explanation': "Python'da True ve False değerleri bool tipindedir.",
                        'order': 3,
                    },
                    {
                        'question_text': "Python'da değişken adları rakamla başlayabilir.",
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğrudur, değişkenler herhangi bir karakterle başlayabilir.',
                                'Yanlıştır, değişken adları rakamla başlayamaz, sadece harf veya alt çizgi ile başlayabilir.',
                            ],
                        },
                        'correct_answer': 'false|1',
                        'hint': 'Değişken adlandırma kurallarını düşünün.',
                        'explanation': 'Değişken adları rakamla başlayamaz.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': "Aşağıdakilerden hangisi Python'da geçersiz bir değişken adıdır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'my_var',
                                'var_1',
                                'class',
                                '_temp',
                            ],
                        },
                        'correct_answer': 'class',
                        'hint': "Python'daki ayrılmış anahtar kelimelere (keywords) dikkat edin.",
                        'explanation': "class anahtar kelimesi Python'da sınıfları tanımlamak için ayrılmıştır ve değişken adı olarak kullanılamaz. Diğer seçenekler geçerlidir.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "a = 10\n"
                            "b = a\n"
                            "a = 20\n"
                            "print(b)"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '10',
                                '20',
                                'a',
                                'Hata',
                            ],
                        },
                        'correct_answer': '10',
                        'hint': 'Değişkenlerin değer atama sırasını takip edin.',
                        'explanation': "b değişkenine a'nın o anki değeri olan 10 atanmıştır. Sonrasında a'nın değiştirilmesi b'nin değerini etkilemez.",
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Fonksiyon parametre boşluğunu doldurarak toplama sonucunu döndürün:\n"
                            "def topla(a, b):\n"
                            "    return ___"
                        ),
                        'question_type': 'code_completion',
                        'correct_answer': 'a + b',
                        'hint': 'a ve b parametrelerini toplama operatörüyle birleştirin.',
                        'explanation': 'İki sayıyı toplamak için standart + operatörü kullanılır: a + b.',
                        'code_block': (
                            "def topla(a, b):\n"
                            "    return ___"
                        ),
                        'word_bank': {
                            'words': [
                                'a + b',
                                'a - b',
                                'a * b',
                                'a / b',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Hatalı satırı bulun: \n"
                            "x = 5\n"
                            "y = '10'\n"
                            "print(x + y)"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "x = 5\n"
                            "y = '10'\n"
                            "print(x + y)"
                        ),
                        'correct_answer': '2|print(x + int(y))',
                        'correct_line_index': 2,
                        'options': {
                            'fix_options': [
                                'print(x + int(y))',
                                'print(str(x) + y)',
                            ],
                        },
                        'hint': 'Farklı türdeki verileri doğrudan toplayamazsınız.',
                        'explanation': 'Integer (x) ve String (y) değerleri doğrudan toplanamaz. Tür dönüşümü yapılmalıdır: x + int(y) veya str(x) + y.',
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Sayılar ve Stringler',
                'lesson_type': 'quiz',
                'order': 2,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': "Python'da string'leri birleştirmek için hangi operatör kullanılır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '&',
                                '.',
                                '+',
                                '||',
                            ],
                        },
                        'correct_answer': '+',
                        'hint': 'Toplama işareti.',
                        'explanation': 'String birleştirme için + operatörü kullanılır: "a" + "b" -> "ab".',
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': "Python'da float tipi neyi temsil eder?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Tam sayıları',
                                'Metinsel ifadeleri',
                                'Ondalıklı sayıları',
                                'Mantıksal değerleri',
                            ],
                        },
                        'correct_answer': 'Ondalıklı sayıları',
                        'hint': '3.14 gibi sayılar.',
                        'explanation': 'Float tipi ondalıklı sayıları temsil eder.',
                        'order': 2,
                    },
                    {
                        'question_text': 'len("Python") ifadesinin sonucu nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '5',
                                '6',
                                '7',
                                'Hata',
                            ],
                        },
                        'correct_answer': '6',
                        'hint': "String'in karakter sayısını sayın.",
                        'explanation': "len() fonksiyonu string'in uzunluğunu (karakter sayısını) döner.",
                        'order': 3,
                    },
                    {
                        'question_text': 'type(3.0) ifadesinin sonucu nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                "<class 'int'>",
                                "<class 'float'>",
                                "<class 'str'>",
                                "<class 'bool'>",
                            ],
                        },
                        'correct_answer': "<class 'float'>",
                        'hint': 'Noktalı sayılara dikkat edin.',
                        'explanation': '3.0 ondalık nokta içerdiği için float tipindedir.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': "Python'da bir sayının üssünü (kuvvetini) almak için hangi operatör kullanılır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '^',
                                '**',
                                '*',
                                'pow',
                            ],
                        },
                        'correct_answer': '**',
                        'hint': 'Çarpma operatörünün çift hali.',
                        'explanation': "Python'da üs alma operatörü **'dır. Örneğin 2**3 ifadesi 8 sonucunu verir.",
                        'order': 5,
                    },
                    {
                        'question_text': 'String nesnesini tamamen büyük harflere dönüştüren metod hangisidir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'upper()',
                                'capitalize()',
                                'title()',
                                'lower()',
                            ],
                        },
                        'correct_answer': 'upper()',
                        'hint': "İngilizce 'üst' veya 'büyük' anlamına gelen kelime.",
                        'explanation': "upper() metodu string'deki tüm harfleri büyük harfe çevirir. capitalize() sadece ilk harfi büyütür.",
                        'order': 6,
                    },
                    {
                        'question_text': "print('Python'[1:4]) ifadesinin çıktısı nedir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Pyt',
                                'yth',
                                'ytho',
                                'tho',
                            ],
                        },
                        'correct_answer': 'yth',
                        'hint': "Dilimleme işlemlerinde başlangıç indeksi dahil, bitiş indeksi hariçtir. İndeksleme 0'dan başlar.",
                        'explanation': "Python string'inde 1. indeks 'y', 4. indeks ise 'o' harfidir. 1:4 dilimi yth karakterlerini döndürür.",
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "print('a' * 3)"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'aaa',
                                'a 3',
                                'Hata',
                                'a*3',
                            ],
                        },
                        'correct_answer': 'aaa',
                        'hint': "String çarpma işlemi string'i tekrar ettirir.",
                        'explanation': "Python'da string ile tamsayıyı çarpmak, o string'i belirtilen sayıda tekrarlayarak birleştirir.",
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Bool ve Karşılaştırma',
                'lesson_type': 'quiz',
                'order': 3,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'Mantıksal VE işlemini gerçekleştiren Python anahtar kelimesi hangisidir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '&&',
                                'and',
                                'or',
                                'not',
                            ],
                        },
                        'correct_answer': 'and',
                        'hint': "İngilizce 've' anlamına gelir.",
                        'explanation': "Python'da mantıksal VE için `and` kullanılır.",
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'Eşitlik kontrolü yapmak için hangi operatör kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '=',
                                '==',
                                '===',
                                'equals',
                            ],
                        },
                        'correct_answer': '==',
                        'hint': 'Tek eşittir atama yapar, çift eşittir karşılaştırır.',
                        'explanation': 'Eşitlik karşılaştırması için == kullanılır.',
                        'order': 2,
                    },
                    {
                        'question_text': 'True and False ifadesinin sonucu nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'True',
                                'False',
                                'None',
                                'Hata',
                            ],
                        },
                        'correct_answer': 'False',
                        'hint': 'VE işleminde her iki taraf da doğru olmalıdır.',
                        'explanation': 'and işleminde taraflardan biri False ise sonuç False olur.',
                        'order': 3,
                    },
                    {
                        'question_text': '5 != 3 ifadesinin sonucu nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'True',
                                'False',
                                'None',
                                'Hata',
                            ],
                        },
                        'correct_answer': 'True',
                        'hint': '!= eşit değildir anlamına gelir.',
                        'explanation': "5, 3'e eşit olmadığı için 5 != 3 ifadesi True döndürür.",
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': 'Hangisi mantıksal VEYA (OR) işlemini gerçekleştirir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '||',
                                'or',
                                'and',
                                'not',
                            ],
                        },
                        'correct_answer': 'or',
                        'hint': 'İngilizce veya anlamına gelen anahtar kelime.',
                        'explanation': "Python'da mantıksal veya işlemi için 'or' kelimesi kullanılır.",
                        'order': 5,
                    },
                    {
                        'question_text': 'not True or False ifadesinin sonucu nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'True',
                                'False',
                                'None',
                                'Hata',
                            ],
                        },
                        'correct_answer': 'False',
                        'hint': 'Mantıksal not önceliğine dikkat edin.',
                        'explanation': 'not True ifadesi False olur. False or False ise False sonucunu verir.',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Değerleri karşılaştırmak için boşluğu doldurun:\n"
                            "sayi = 10\n"
                            "is_even = (sayi % 2 ___ 0)"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': '==',
                        'hint': 'Eşitlik kontrolü operatörünü kullanın.',
                        'explanation': 'Eşitlik kontrolü için == kullanılır. sayi % 2 == 0 çift sayı kontrolüdür.',
                        'code_block': (
                            "sayi = 10\n"
                            "is_even = (sayi % 2 ___ 0)"
                        ),
                        'word_bank': {
                            'words': [
                                '==',
                                '=',
                                '!=',
                                '>',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': 'Aşağıdaki ifadelerden hangisi True döndürür?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '3 > 5',
                                'not (2 == 2)',
                                '5 >= 5',
                                '10 < 9',
                            ],
                        },
                        'correct_answer': '5 >= 5',
                        'hint': 'Büyük veya eşit operatörünü inceleyin.',
                        'explanation': "5 >= 5 ifadesi 5, 5'e eşit olduğu için True döndürür. Diğerleri False döndürür.",
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Basit Input/Output',
                'lesson_type': 'quiz',
                'order': 4,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'Ekrana çıktı vermek için hangi yerleşik fonksiyon kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'log()',
                                'print()',
                                'write()',
                                'output()',
                            ],
                        },
                        'correct_answer': 'print()',
                        'hint': 'Yazdırmak anlamına gelir.',
                        'explanation': "Python'da standart çıktı için print() kullanılır.",
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'Kullanıcıdan girdi almak için hangi fonksiyon kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'get()',
                                'read()',
                                'input()',
                                'scan()',
                            ],
                        },
                        'correct_answer': 'input()',
                        'hint': 'Girdi anlamına gelen kelime.',
                        'explanation': 'Kullanıcıdan veri almak için input() kullanılır.',
                        'order': 2,
                    },
                    {
                        'question_text': 'input() fonksiyonu verileri her zaman hangi tipte döndürür?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'int',
                                'float',
                                'str',
                                'Kullanıcının girdiğine göre değişir',
                            ],
                        },
                        'correct_answer': 'str',
                        'hint': 'Metinsel tip.',
                        'explanation': 'input() her zaman string (str) tipinde veri döndürür.',
                        'order': 3,
                    },
                    {
                        'question_text': 'Kullanıcıdan alınan sayıyı tam sayıya dönüştürmek için ne yapılmalıdır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'str(input())',
                                'int(input())',
                                'float(input())',
                                'convert(input())',
                            ],
                        },
                        'correct_answer': 'int(input())',
                        'hint': 'Tip dönüşümü yapmak gerekir.',
                        'explanation': 'input() str döndürdüğü için tam sayı işlemleri için int() içine alınmalıdır.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': "print('A', 'B', sep='-') ifadesinin çıktısı nedir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'A B',
                                'A-B',
                                'AB',
                                'Hata',
                            ],
                        },
                        'correct_answer': 'A-B',
                        'hint': 'sep parametresi elemanlar arasına ne konulacağını belirler.',
                        'explanation': 'print fonksiyonunda sep parametresi yazdırılan değerlerin arasına konulacak karakteri ayarlar.',
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "print('Merhaba', end='!')\n"
                            "print('Dünya')"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                (
                                    "Merhaba!\n"
                                    "Dünya"
                                ),
                                'Merhaba!Dünya',
                                (
                                    "Merhaba\n"
                                    "!Dünya"
                                ),
                                'Merhaba! Dünya',
                            ],
                        },
                        'correct_answer': 'Merhaba!Dünya',
                        'hint': (
                            "end parametresi satır sonuna ne ekleneceğini belirtir ve varsayılan yeni satır karakterini (\n"
                            ") iptal eder."
                        ),
                        'explanation': "end='!' ile ilk print sonunda yeni satıra geçmek yerine '!' eklenir, ardından gelen Dünya aynı satıra basılır.",
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Kullanıcıdan alınan yaş bilgisini integer'a dönüştürmek için boşluğu doldurun:\n"
                            "yas = ___(input('Yaşınız: '))"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'int',
                        'hint': 'Tam sayı dönüşüm fonksiyonu.',
                        'explanation': "Kullanıcı girdisi her zaman string'dir. Tam sayıya dönüştürmek için int() kullanılır.",
                        'code_block': "yas = ___(input('Yaşınız: '))",
                        'word_bank': {
                            'words': [
                                'int',
                                'str',
                                'float',
                                'val',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Hatalı satırı bulun:\n"
                            "yas_str = input('Yasiniz: ')\n"
                            "yas = int(yas_str)\n"
                            "print('Seneye yasiniz: ' + yas + 1)"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "yas_str = input('Yasiniz: ')\n"
                            "yas = int(yas_str)\n"
                            "print('Seneye yasiniz: ' + yas + 1)"
                        ),
                        'correct_answer': "2|print('Seneye yasiniz: ' + str(yas + 1))",
                        'correct_line_index': 2,
                        'options': {
                            'fix_options': [
                                "print('Seneye yasiniz: ' + str(yas + 1))",
                                "print('Seneye yasiniz: ' + (yas + 1))",
                            ],
                        },
                        'hint': 'Metinle tam sayıyı doğrudan birleştiremezsiniz.',
                        'explanation': 'Hesaplanan yeni yaş tam sayı olduğundan, metinle birleştirmek için str() içine alınmalıdır.',
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Mini Pratik',
                'lesson_type': 'quiz',
                'order': 5,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "x = 5\n"
                            "y = 3\n"
                            "x, y = y, x\n"
                            "print(x)"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '5',
                                '3',
                                'None',
                                'Hata',
                            ],
                        },
                        'correct_answer': '3',
                        'hint': "Python'da tek satırda değişken takası yapılabilir.",
                        'explanation': "x, y = y, x ifadesi x ve y'nin değerlerini yer değiştirir. x 3 olur.",
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'int(3.99) işleminin sonucu nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '3',
                                '4',
                                'Hata',
                                '3.0',
                            ],
                        },
                        'correct_answer': '3',
                        'hint': 'int() ondalıklı kısmı kesip atar, yuvarlama yapmaz.',
                        'explanation': "int() ondalıklı kısmı atarak tam sayıya çevirir. Sonuç 3'tür.",
                        'order': 2,
                    },
                    {
                        'question_text': (
                            "Boşluğu doldurarak 'a b' çıktısını elde edin:\n"
                            "print('a' ___ 'b')"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': "+ ' ' +",
                        'hint': 'Araya bir boşluk karakteri eklemeniz gerekir.',
                        'explanation': "print('a' + ' ' + 'b') ifadesi araya boşluk koyarak iki string'i birleştirir.",
                        'code_block': "print('a' ___ 'b')",
                        'word_bank': {
                            'words': [
                                "+ ' ' +",
                                '+',
                                "','",
                                'and',
                            ],
                        },
                        'order': 3,
                    },
                    {
                        'question_text': 'type("10") ifadesinin sonucu nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                "<class 'int'>",
                                "<class 'str'>",
                                "<class 'float'>",
                                'Hata',
                            ],
                        },
                        'correct_answer': "<class 'str'>",
                        'hint': 'Tırnak işaretlerine dikkat edin.',
                        'explanation': "Tırnak içindeki her şey string'dir.",
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': (
                            "a = 5\n"
                            "b = 2\n"
                            "print(a % b) çıktısı nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '2.5',
                                '2',
                                '1',
                                '0',
                            ],
                        },
                        'correct_answer': '1',
                        'hint': 'Modulo (%) operatörü bölme işleminden kalan sayıyı verir.',
                        'explanation': "5'in 2'ye bölümünden kalan 1'dir. Modulo operatörü (%) kalanı döndürür.",
                        'order': 5,
                    },
                    {
                        'question_text': 'print(float(5)) ifadesinin çıktısı nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '5',
                                '5.0',
                                'Hata',
                                '5f',
                            ],
                        },
                        'correct_answer': '5.0',
                        'hint': 'float fonksiyonu tam sayıları ondalıklıya dönüştürür.',
                        'explanation': 'float() fonksiyonu parametresini ondalıklı sayı tipine çevirir. 5 tam sayısı 5.0 olur.',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "String'in uzunluğunu ekrana yazdırmak için boşluğu doldurun:\n"
                            "print(___('kodlama'))"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'len',
                        'hint': 'Uzunluk (length) kelimesinin kısaltması.',
                        'explanation': 'Koleksiyonların veya stringlerin karakter uzunluğunu bulmak için len() fonksiyonu kullanılır.',
                        'code_block': "print(___('kodlama'))",
                        'word_bank': {
                            'words': [
                                'len',
                                'length',
                                'size',
                                'count',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "a = 10\n"
                            "b = 3\n"
                            "print(a // b) çıktısı nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '3.33',
                                '3',
                                '4',
                                '1',
                            ],
                        },
                        'correct_answer': '3',
                        'hint': 'Çift bölme işareti taban bölme (floor division) yapar.',
                        'explanation': "a // b ifadesi bölme sonucunu aşağıya yuvarlayarak tam sayı kısmı olan 3'ü verir.",
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Liste Nedir?',
                'lesson_type': 'quiz',
                'order': 6,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': "Python'da listeleri tanımlamak için hangi parantez türü kullanılır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '()',
                                '{}',
                                '[]',
                                '<>',
                            ],
                        },
                        'correct_answer': '[]',
                        'hint': 'Köşeli parantez.',
                        'explanation': 'Listeler köşeli parantezler `[]` kullanılarak tanımlanır.',
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'Listeler değiştirilebilir (mutable) veri tipleridir.',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğrudur, listeler üzerinde ekleme ve silme yapılabilir.',
                                'Yanlıştır, listeler bir kere oluştuktan sonra değiştirilemez.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'Listelerin elemanlarını değiştirebilir miyiz?',
                        'explanation': "Listeler mutable'dır, yani içerikleri değiştirilebilir.",
                        'order': 2,
                    },
                    {
                        'question_text': 'Boş bir liste oluşturmak için hangisi kullanılabilir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '[]',
                                'list()',
                                'Her ikisi de',
                                'Hiçbiri',
                            ],
                        },
                        'correct_answer': 'Her ikisi de',
                        'hint': 'Boş liste köşeli parantez veya kurucu fonksiyon ile oluşturulur.',
                        'explanation': 'Hem `[]` hem de `list()` boş liste oluşturur.',
                        'order': 3,
                    },
                    {
                        'question_text': 'Bir Python listesi aynı anda farklı veri tiplerini barındırabilir.',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                "Doğrudur, [1, 'iki', True] şeklinde tanımlanabilir.",
                                'Yanlıştır, listeler homojen olmalı, sadece tek veri tipi barındırmalıdır.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'Listelerin esnekliğini düşünün.',
                        'explanation': 'Listeler heterojendir, farklı veri tiplerini aynı anda içerebilirler.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': "Python'da listenin elemanlarını virgülle ayırırız.",
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğrudur, her eleman arasına virgül konmalıdır.',
                                'Yanlıştır, elemanlar boşlukla ayrılır.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'Listenin yazım biçimini düşünün.',
                        'explanation': 'Listede elemanlar arasında virgül kullanılır: [1, 2, 3].',
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "liste = [10, 20, 30]\n"
                            "liste2 = liste\n"
                            "liste[0] = 99\n"
                            "print(liste2[0]) çıktısı nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '10',
                                '99',
                                'Hata',
                                '30',
                            ],
                        },
                        'correct_answer': '99',
                        'hint': 'Referans atama durumuna dikkat edin.',
                        'explanation': "liste2 = liste ataması referans kopyalamadır. liste üzerinde yapılan değişiklik liste2'yi de etkiler.",
                        'order': 6,
                    },
                    {
                        'question_text': 'Aşağıdakilerden hangisi geçerli bir Python listesidir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '{1, 2, 3}',
                                '[1; 2; 3]',
                                "[1, 'iki', True]",
                                '(1, 2, 3)',
                            ],
                        },
                        'correct_answer': "[1, 'iki', True]",
                        'hint': 'Köşeli parantez ve virgül kullanımına bakın.',
                        'explanation': 'Listeler köşeli parantezle tanımlanır ve heterojen (farklı türden) elemanlar içerebilir.',
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Hatalı satırı bulun:\n"
                            "liste = [1, 2, 3]\n"
                            "print(liste.length)"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "liste = [1, 2, 3]\n"
                            "print(liste.length)"
                        ),
                        'correct_answer': '1|print(len(liste))',
                        'correct_line_index': 1,
                        'options': {
                            'fix_options': [
                                'print(len(liste))',
                                'print(liste.size())',
                            ],
                        },
                        'hint': 'Python listelerinde uzunluğu bulmak için yerleşik bir fonksiyon kullanılır.',
                        'explanation': "Python'da listelerin length adında bir özniteliği yoktur. Uzunluk len(liste) ile bulunur.",
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Liste Elemanlarına Erişim',
                'lesson_type': 'quiz',
                'order': 7,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'Listenin ilk elemanına erişmek için hangi indeks kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '0',
                                '1',
                                '-1',
                                'ilk',
                            ],
                        },
                        'correct_answer': '0',
                        'hint': 'Programlama dillerinde sayma sıfırdan başlar.',
                        'explanation': "Python'da indeksleme 0'dan başlar.",
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'Listenin son elemanına erişmek için en pratik negatif indeks hangisidir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '0',
                                '-1',
                                'len()',
                                '-len()',
                            ],
                        },
                        'correct_answer': '-1',
                        'hint': 'Geriden sayma.',
                        'explanation': '-1 indeksi listenin son elemanını verir.',
                        'order': 2,
                    },
                    {
                        'question_text': '[10, 20, 30][1] ifadesinin sonucu nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '10',
                                '20',
                                '30',
                                'Hata',
                            ],
                        },
                        'correct_answer': '20',
                        'hint': 'İkinci elemanı arıyoruz.',
                        'explanation': "0. indeks 10, 1. indeks 20'dir.",
                        'order': 3,
                    },
                    {
                        'question_text': '[5, 6, 7, 8][-2] ifadesinin sonucu nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '5',
                                '6',
                                '7',
                                '8',
                            ],
                        },
                        'correct_answer': '7',
                        'hint': 'Sondan ikinci eleman.',
                        'explanation': "Sondan birinci 8, sondan ikinci 7'dir.",
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': (
                            "liste = [1, 2, 3, 4, 5]\n"
                            "print(liste[1:3]) çıktısı nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '[1, 2]',
                                '[2, 3]',
                                '[2, 3, 4]',
                                '[3, 4]',
                            ],
                        },
                        'correct_answer': '[2, 3]',
                        'hint': '1. indeksten başla, 3. indekse kadar git (3 hariç).',
                        'explanation': "1. indeks 2, 2. indeks 3'tür. 3. indeks 4 dahil edilmez. Sonuç [2, 3] listesidir.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "liste = [10, 20, 30]\n"
                            "print(liste[3]) çıktısı nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '30',
                                'None',
                                'Hata (IndexError)',
                                '0',
                            ],
                        },
                        'correct_answer': 'Hata (IndexError)',
                        'hint': 'Listenin sınırlarını kontrol edin.',
                        'explanation': 'Liste 3 elemanlıdır (indeksler 0, 1, 2). 3. indeks olmadığı için IndexError hatası alınır.',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Bir listenin son 2 elemanını almak için boşluğu doldurun:\n"
                            "liste = [1, 2, 3, 4]\n"
                            "son_iki = liste[___:]"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': '-2',
                        'hint': 'Negatif dilimleme indeksini düşünün.',
                        'explanation': "-2 indeksi sondan ikinci elemanı belirtir. -2'den sonuna kadar gitmek son iki elemanı verir.",
                        'code_block': (
                            "liste = [1, 2, 3, 4]\n"
                            "son_iki = liste[___:]"
                        ),
                        'word_bank': {
                            'words': [
                                '-2',
                                '2',
                                '-1',
                                '3',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "liste = [1, 2, [3, 4]]\n"
                            "print(liste[2][0]) ifadesinin çıktısı nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '3',
                                '4',
                                '[3, 4]',
                                '2',
                            ],
                        },
                        'correct_answer': '3',
                        'hint': 'İç içe geçmiş listelere erişimi düşünün.',
                        'explanation': "liste[2] ifadesi içteki listeyi [3, 4] verir. liste[2][0] ise bu listenin ilk elemanı olan 3'tür.",
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Listeye Eleman Ekleme/Silme',
                'lesson_type': 'quiz',
                'order': 8,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'Listenin sonuna eleman eklemek için hangi metod kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'add()',
                                'push()',
                                'append()',
                                'insert()',
                            ],
                        },
                        'correct_answer': 'append()',
                        'hint': 'Eke eklemek anlamına gelir.',
                        'explanation': 'append() metodu listenin sonuna yeni bir eleman ekler.',
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'Belirli bir indekse eleman eklemek için hangi metod kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'add()',
                                'insert()',
                                'append()',
                                'put()',
                            ],
                        },
                        'correct_answer': 'insert()',
                        'hint': 'Araya eklemek anlamındaki kelime.',
                        'explanation': 'insert(indeks, eleman) metodu belirtilen indekse eleman yerleştirir.',
                        'order': 2,
                    },
                    {
                        'question_text': 'Listenin son elemanını silen ve silinen değeri döndüren metod hangisidir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'remove()',
                                'delete()',
                                'pop()',
                                'clear()',
                            ],
                        },
                        'correct_answer': 'pop()',
                        'hint': 'Balon patlatmak gibi.',
                        'explanation': 'pop() parametresiz çağrıldığında son elemanı siler ve döndürür.',
                        'order': 3,
                    },
                    {
                        'question_text': 'Listeden belirli bir değere sahip ilk elemanı silmek için hangisi kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'remove()',
                                'pop()',
                                'delete()',
                                'discard()',
                            ],
                        },
                        'correct_answer': 'remove()',
                        'hint': 'Kaldırmak anlamında.',
                        'explanation': 'remove(değer) metodu belirtilen değeri listeden kaldırır.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': (
                            "liste = [1, 2]\n"
                            "liste.extend([3, 4])\n"
                            "print(len(liste)) çıktısı nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '3',
                                '4',
                                '5',
                                'Hata',
                            ],
                        },
                        'correct_answer': '4',
                        'hint': 'extend metodu verilen listenin elemanlarını tek tek ekler.',
                        'explanation': "extend([3, 4]) listenin sonuna 3 ve 4'ü ekleyerek [1, 2, 3, 4] yapar. Uzunluk 4 olur.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "liste = [1, 2]\n"
                            "liste.append([3, 4])\n"
                            "print(len(liste)) çıktısı nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '3',
                                '4',
                                '2',
                                'Hata',
                            ],
                        },
                        'correct_answer': '3',
                        'hint': 'append metodu verilen nesneyi tek bir eleman olarak sonuna ekler.',
                        'explanation': 'append([3, 4]) listeyi olduğu gibi ekleyerek [1, 2, [3, 4]] yapar. Bu durumda 3 eleman vardır.',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Listeyi tamamen boşaltmak için boşluğu doldurun:\n"
                            "liste = [1, 2, 3]\n"
                            "liste.___()"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'clear',
                        'hint': 'Temizlemek anlamına gelen İngilizce kelime.',
                        'explanation': 'clear() metodu listedeki tüm elemanları silerek boş liste haline getirir.',
                        'code_block': (
                            "liste = [1, 2, 3]\n"
                            "liste.___()"
                        ),
                        'word_bank': {
                            'words': [
                                'clear',
                                'empty',
                                'remove',
                                'pop',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "liste = [1, 2, 3]\n"
                            "del liste[1]\n"
                            "print(liste) çıktısı nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '[1, 3]',
                                '[1, 2]',
                                '[2, 3]',
                                '[3]',
                            ],
                        },
                        'correct_answer': '[1, 3]',
                        'hint': 'del anahtar kelimesi belirtilen indeksteki elemanı siler.',
                        'explanation': "1. indeksteki eleman 2'dir. del liste[1] ile 2 silinir ve geriye [1, 3] kalır.",
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Liste Üzerinde Döngü',
                'lesson_type': 'quiz',
                'order': 9,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'Listenin her elemanını sırayla dönmek için hangi döngü türü tercih edilir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'while',
                                'for',
                                'do-while',
                                'foreach',
                            ],
                        },
                        'correct_answer': 'for',
                        'hint': "Python'da in yapısıyla birlikte kullanılan döngü.",
                        'explanation': "Python'da koleksiyonlar üzerinde dönmek için en uygun yapı `for x in liste:` yapısıdır.",
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'Sayısal elemanlardan oluşan bir listenin elemanları toplamını en kolay nasıl buluruz?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'total()',
                                'sum()',
                                'count()',
                                'add()',
                            ],
                        },
                        'correct_answer': 'sum()',
                        'hint': 'Yerleşik toplama fonksiyonu.',
                        'explanation': 'sum(liste) fonksiyonu listedeki tüm sayıların toplamını döner.',
                        'order': 2,
                    },
                    {
                        'question_text': 'Listenin toplam kaç elemanı olduğunu bulmak için hangisi kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'size()',
                                'length()',
                                'len()',
                                'count()',
                            ],
                        },
                        'correct_answer': 'len()',
                        'hint': 'String uzunluğunu bulmak için de kullanılan fonksiyon.',
                        'explanation': 'len(liste) listenin eleman sayısını verir.',
                        'order': 3,
                    },
                    {
                        'question_text': 'for i in [1, 2, 3] döngüsü kaç kez çalışır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '1',
                                '2',
                                '3',
                                'Sonsuz',
                            ],
                        },
                        'correct_answer': '3',
                        'hint': 'Listedeki eleman sayısını sayın.',
                        'explanation': 'Döngü listedeki her eleman için bir kez çalışır.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': (
                            "liste = ['a', 'b', 'c']\n"
                            "for idx, val in enumerate(liste):\n"
                            "    if val == 'b':\n"
                            "        print(idx)\n"
                            "çıktısı nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '0',
                                '1',
                                '2',
                                'b',
                            ],
                        },
                        'correct_answer': '1',
                        'hint': 'enumerate fonksiyonu (indeks, değer) ikililerini döndürür.',
                        'explanation': "val 'b' olduğunda indeks (idx) 1'dir. Dolayısıyla ekrana 1 yazdırılır.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Döngüyü tamamlayıp elemanları yazdırmak için boşluğu doldurun:\n"
                            "liste = [1, 2]\n"
                            "___ x in liste:\n"
                            "    print(x)"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'for',
                        'hint': "Python'daki standart yineleme döngüsü anahtar kelimesi.",
                        'explanation': "Koleksiyon elemanları üzerinde dönmek için 'for' döngüsü kullanılır.",
                        'code_block': (
                            "liste = [1, 2]\n"
                            "___ x in liste:\n"
                            "    print(x)"
                        ),
                        'word_bank': {
                            'words': [
                                'for',
                                'while',
                                'each',
                                'in',
                            ],
                        },
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "liste = [1, 2, 3]\n"
                            "carpim = 1\n"
                            "for x in liste:\n"
                            "    carpim *= x\n"
                            "print(carpim) çıktısı nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '6',
                                '5',
                                '3',
                                '0',
                            ],
                        },
                        'correct_answer': '6',
                        'hint': 'Listedeki tüm elemanları sırayla çarparak carpim değişkeninde biriktirin.',
                        'explanation': 'Carpim: 1 * 1 = 1 -> 1 * 2 = 2 -> 2 * 3 = 6 olur.',
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Hatalı satırı bulun:\n"
                            "liste = [1, 2, 3]\n"
                            "for i in range(liste):\n"
                            "    print(liste[i])"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "liste = [1, 2, 3]\n"
                            "for i in range(liste):\n"
                            "    print(liste[i])"
                        ),
                        'correct_answer': '1|for i in range(len(liste)):',
                        'correct_line_index': 1,
                        'options': {
                            'fix_options': [
                                'for i in range(len(liste)):',
                                'for i in len(liste):',
                            ],
                        },
                        'hint': 'range() fonksiyonu sadece tamsayı alabilir, liste alamaz.',
                        'explanation': 'range(liste) geçersizdir çünkü range() parametre olarak tamsayı bekler. Listenin boyutu için range(len(liste)) olmalıdır.',
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Liste Mini Görevi',
                'lesson_type': 'quiz',
                'order': 10,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': 'Bir listeyi orijinalini bozmadan kopyalamak için hangisi kullanılabilir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'liste.copy()',
                                'liste.clone()',
                                'liste2 = liste',
                                'copy(liste)',
                            ],
                        },
                        'correct_answer': 'liste.copy()',
                        'hint': 'Doğrudan eşitlemek referans kopyalar, kopyalama yapmaz.',
                        'explanation': 'liste.copy() veya liste[:] yeni bir liste nesnesi oluşturarak kopyalama yapar.',
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'Bir listenin elemanlarını küçükten büyüğe sıralamak için hangi metod kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'order()',
                                'sort()',
                                'arrange()',
                                'sequence()',
                            ],
                        },
                        'correct_answer': 'sort()',
                        'hint': 'Sıralamak anlamına gelir.',
                        'explanation': 'sort() metodu listeyi yerinde (in-place) sıralar.',
                        'order': 2,
                    },
                    {
                        'question_text': 'Listenin elemanlarını tersine çevirmek için hangi slicing (dilimleme) ifadesi kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'liste[::1]',
                                'liste[::-1]',
                                'liste[0:-1]',
                                'liste[-1:0]',
                            ],
                        },
                        'correct_answer': 'liste[::-1]',
                        'hint': 'Step kısmına -1 yazılır.',
                        'explanation': '[::-1] tüm listeyi sondan başa doğru kopyalar.',
                        'order': 3,
                    },
                    {
                        'question_text': 'Bir elemanın listede olup olmadığını sorgulamak için hangi operatör kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'has',
                                'exists',
                                'in',
                                'contains',
                            ],
                        },
                        'correct_answer': 'in',
                        'hint': 'İçinde anlamına gelen kelime.',
                        'explanation': '`x in liste` ifadesi x listede varsa True döner.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': 'Bir listenin eleman sayısını doğrudan bulan yerleşik fonksiyon hangisidir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'size()',
                                'count()',
                                'len()',
                                'length()',
                            ],
                        },
                        'correct_answer': 'len()',
                        'hint': 'String uzunluğunda da kullanılır.',
                        'explanation': 'len() fonksiyonu listenin eleman sayısını döner.',
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "liste = [5, 2, 8]\n"
                            "liste.reverse()\n"
                            "print(liste) çıktısı nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '[8, 2, 5]',
                                '[2, 5, 8]',
                                '[8, 5, 2]',
                                'None',
                            ],
                        },
                        'correct_answer': '[8, 2, 5]',
                        'hint': 'reverse metodu listeyi yerinde ters çevirir.',
                        'explanation': 'reverse() listenin sıralamasını sondan başa doğru tersine çevirerek listeyi [8, 2, 5] yapar.',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Listenin en büyük elemanını bulmak için boşluğu doldurun:\n"
                            "liste = [1, 5, 3]\n"
                            "en_buyuk = ___(liste)"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'max',
                        'hint': 'Maximum kelimesinin kısaltması.',
                        'explanation': 'max() fonksiyonu koleksiyondaki en büyük değeri döndürür.',
                        'code_block': (
                            "liste = [1, 5, 3]\n"
                            "en_buyuk = ___(liste)"
                        ),
                        'word_bank': {
                            'words': [
                                'max',
                                'min',
                                'top',
                                'greatest',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "liste = [1, 2, 3]\n"
                            "print(liste.index(2))"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '1',
                                '2',
                                '0',
                                'Hata',
                            ],
                        },
                        'correct_answer': '1',
                        'hint': 'index() metodu aranan elemanın indeksini döner.',
                        'explanation': "2 elemanı listenin 1. indeksinde yer almaktadır (0. indeks 1'dir).",
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'if Mantığı',
                'lesson_type': 'quiz',
                'order': 11,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': "Python'da if ifadesinin satır sonuna hangi karakter konulmalıdır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                ';',
                                ':',
                                '{',
                                'Hiçbiri',
                            ],
                        },
                        'correct_answer': ':',
                        'hint': 'İki nokta.',
                        'explanation': "Python'da blok oluşturan ifadelerin (if, for, while, def vb.) sonuna `:` konur.",
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': "Python'da kod bloklarını (örneğin if'in gövdesini) belirlemek için ne kullanılır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Süslü parantezler {}',
                                'Girintiler (Indentation)',
                                'begin/end',
                                'Parantezler ()',
                            ],
                        },
                        'correct_answer': 'Girintiler (Indentation)',
                        'hint': 'Genellikle 4 boşluk.',
                        'explanation': "Python'da kod blokları girintilerle belirlenir.",
                        'order': 2,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kod çalıştırıldığında ne yazar?\n"
                            "if True:\n"
                            "    print('A')\n"
                            "print('B')"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'A',
                                'B',
                                'A ve B',
                                'Hiçbir şey',
                            ],
                        },
                        'correct_answer': 'A ve B',
                        'hint': 'Koşul True olduğu için if gövdesi çalışır, sonraki satır ise zaten dışarıdadır.',
                        'explanation': "if bloğu çalıştığı için 'A' yazılır, sonra ana akışta 'B' yazdırılır.",
                        'order': 3,
                    },
                    {
                        'question_text': "Python'da standart kod girintisi kaç boşluktan oluşur?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '2',
                                '4',
                                '8',
                                'Fark etmez',
                            ],
                        },
                        'correct_answer': '4',
                        'hint': 'PEP 8 standartlarına göre.',
                        'explanation': 'PEP 8 standartlarına göre girinti için 4 boşluk kullanılması önerilir.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': "Python'da if koşulunun parantez içine alınması zorunludur.",
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğrudur, if (x > 5): yazılması şarttır.',
                                'Yanlıştır, parantez yazılmasa da çalışır, isteğe bağlıdır.',
                            ],
                        },
                        'correct_answer': 'false|1',
                        'hint': "Python'ın sade sözdizimini düşünün.",
                        'explanation': "Python'da if koşullarında parantez zorunlu değildir. if x > 5: yazmak standarttır.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "x = 10\n"
                            "if x > 5:\n"
                            "print('Buyuk')\n"
                            "kodunun çalıştırılma sonucu nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Buyuk yazar',
                                'Hiçbir şey yazmaz',
                                'IndentationError (Girinti Hatası)',
                                'SyntaxError',
                            ],
                        },
                        'correct_answer': 'IndentationError (Girinti Hatası)',
                        'hint': 'if gövdesinin girintili olup olmadığını kontrol edin.',
                        'explanation': 'if satırından sonra gelen blok girintili olmalıdır. Girinti yapılmadığı için IndentationError oluşur.',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Koşul ifadesini tamamlamak için boşluğu doldurun:\n"
                            "x = 5\n"
                            "___ x == 5:\n"
                            "    print('Esit')"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'if',
                        'hint': 'Eğer anlamına gelen İngilizce kelime.',
                        'explanation': "Koşul kontrolü başlatmak için 'if' kelimesi kullanılır.",
                        'code_block': (
                            "x = 5\n"
                            "___ x == 5:\n"
                            "    print('Esit')"
                        ),
                        'word_bank': {
                            'words': [
                                'if',
                                'when',
                                'check',
                                'cond',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "x = 0\n"
                            "if x:\n"
                            "    print('Doğru')\n"
                            "else:\n"
                            "    print('Yanlış')"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Doğru',
                                'Yanlış',
                                'Hiçbiri',
                                'Hata',
                            ],
                        },
                        'correct_answer': 'Yanlış',
                        'hint': '0 sayısı mantıksal olarak False kabul edilir.',
                        'explanation': "Python'da 0 sayısı, boş stringler ve boş koleksiyonlar mantıksal olarak False kabul edilir. Bu nedenle else bloğu çalışır.",
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'elif / else',
                'lesson_type': 'quiz',
                'order': 12,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'if koşulu yanlış olduğunda varsayılan olarak çalışacak blok hangisidir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'elif',
                                'else',
                                'then',
                                'otherwise',
                            ],
                        },
                        'correct_answer': 'else',
                        'hint': 'Aksi takdirde anlamına gelir.',
                        'explanation': 'Koşulların hiçbiri sağlanmadığında else bloğu çalışır.',
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': "Python'da 'else if' ifadesinin kısaltılmış hali nedir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'elseif',
                                'elsif',
                                'elif',
                                'else if',
                            ],
                        },
                        'correct_answer': 'elif',
                        'hint': 'Dört harfli kısaltma.',
                        'explanation': "Python'da çoklu koşul dallanmaları için `elif` kullanılır.",
                        'order': 2,
                    },
                    {
                        'question_text': 'elif ifadesi tek başına (if olmadan) kullanılabilir.',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğrudur, elif bağımsız bir koşuldur.',
                                'Yanlıştır, elif mutlaka bir if bloğundan sonra gelmelidir.',
                            ],
                        },
                        'correct_answer': 'false|1',
                        'hint': "elif'in 'else if' olduğunu unutmayın.",
                        'explanation': 'elif, bir if bloğunun alternatifi olarak zincirleme kullanılabilir.',
                        'order': 3,
                    },
                    {
                        'question_text': 'Bir if-elif-else yapısında kaç tane else bloğu bulunabilir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '0 veya 1',
                                'Sınırsız',
                                'En az 1',
                                '2',
                            ],
                        },
                        'correct_answer': '0 veya 1',
                        'hint': 'else son çare bloğudur.',
                        'explanation': 'else isteğe bağlıdır ve en fazla bir adet bulunabilir.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': 'Birden fazla koşul zinciri kurarken if ve else arasına hangi anahtar kelime eklenir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'elseif',
                                'elif',
                                'else if',
                                'elsif',
                            ],
                        },
                        'correct_answer': 'elif',
                        'hint': 'Else ve if kelimelerinin birleşimi.',
                        'explanation': "Python'da 'else if' yerine 'elif' anahtar kelimesi kullanılır.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "x = 10\n"
                            "if x > 20:\n"
                            "    print('A')\n"
                            "elif x > 5:\n"
                            "    print('B')\n"
                            "else:\n"
                            "    print('C')"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'A',
                                'B',
                                'C',
                                'B ve C',
                            ],
                        },
                        'correct_answer': 'B',
                        'hint': 'İlk doğru olan koşul çalışır.',
                        'explanation': "10 > 20 False'tur. 10 > 5 True'dur ve B basılır. Bir koşul uyunca if-elif zincirinden çıkılır.",
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Koşullar sağlanmadığında varsayılan olarak çalışacak bloğu doldurun:\n"
                            "x = 3\n"
                            "if x > 5:\n"
                            "    print('A')\n"
                            "___:\n"
                            "    print('B')"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'else',
                        'hint': 'Aksi takdirde anlamına gelen kelime.',
                        'explanation': "Koşulların hiçbiri uymadığında varsayılan olarak çalışan blok 'else' bloğudur.",
                        'code_block': (
                            "x = 3\n"
                            "if x > 5:\n"
                            "    print('A')\n"
                            "___:\n"
                            "    print('B')"
                        ),
                        'word_bank': {
                            'words': [
                                'else',
                                'elif',
                                'default',
                                'otherwise',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Hatalı satırı bulun:\n"
                            "x = 5\n"
                            "else:\n"
                            "    print('A')"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "x = 5\n"
                            "else:\n"
                            "    print('A')"
                        ),
                        'correct_answer': (
                            "1|if x != 5:\n"
                            "    pass\n"
                            "else:"
                        ),
                        'correct_line_index': 1,
                        'options': {
                            'fix_options': [
                                (
                                    "if x != 5:\n"
                                    "    pass\n"
                                    "else:"
                                ),
                                'elif x == 5:',
                            ],
                        },
                        'hint': 'else ifadesi tek başına kullanılamaz, mutlaka bir if bloğuna bağlı olmalıdır.',
                        'explanation': "Bir if koşulu olmadan else kullanılamaz. else'ten önce bir if koşulu olmalıdır.",
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Karşılaştırma Operatörleri',
                'lesson_type': 'quiz',
                'order': 13,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': "Hangi operatör 'büyüktür veya eşittir' anlamına gelir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '>',
                                '=>',
                                '>=',
                                '=<',
                            ],
                        },
                        'correct_answer': '>=',
                        'hint': 'Büyüktür ve eşittir yan yana.',
                        'explanation': "Python'da büyüktür veya eşittir `>=` şeklinde yazılır.",
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': "Hangi operatör 'eşit değildir' kontrolü yapar?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '!=',
                                '<>',
                                'not ==',
                                '~=',
                            ],
                        },
                        'correct_answer': '!=',
                        'hint': 'Ünlem ve eşittir.',
                        'explanation': 'Eşit değildir karşılaştırması `!=` operatörüyle yapılır.',
                        'order': 2,
                    },
                    {
                        'question_text': '"elma" == "ELMA" karşılaştırmasının sonucu nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'True',
                                'False',
                                'Hata',
                                'None',
                            ],
                        },
                        'correct_answer': 'False',
                        'hint': 'Python büyük-küçük harfe duyarlıdır.',
                        'explanation': 'Python case-sensitive (harf duyarlı) bir dildir. İki string farklıdır.',
                        'order': 3,
                    },
                    {
                        'question_text': '10 > 5 and 3 < 1 ifadesinin sonucu nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'True',
                                'False',
                                'Hata',
                                'None',
                            ],
                        },
                        'correct_answer': 'False',
                        'hint': 've (and) işleminde iki tarafın da True olması gerekir.',
                        'explanation': '10 > 5 (True) ama 3 < 1 (False) olduğu için sonuç False olur.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': "Python'da büyük veya eşit karşılaştırma operatörü hangisidir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '>=',
                                '=>',
                                '>',
                                '==',
                            ],
                        },
                        'correct_answer': '>=',
                        'hint': 'Önce büyüktür, sonra eşittir işareti.',
                        'explanation': 'Büyük veya eşit operatörü >= şeklinde yazılır. => geçersizdir.',
                        'order': 5,
                    },
                    {
                        'question_text': 'print(10 != 10) ifadesinin çıktısı nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'True',
                                'False',
                                'None',
                                'Hata',
                            ],
                        },
                        'correct_answer': 'False',
                        'hint': '!= operatörü eşit değildir anlamına gelir.',
                        'explanation': "10, 10'a eşit olduğundan 10 != 10 (eşit değildir) ifadesi False sonucunu verir.",
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Eşit değildir kontrolü yapmak için boşluğu doldurun:\n"
                            "sayi = 5\n"
                            "if sayi ___ 0:\n"
                            "    print('Sıfır değil')"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': '!=',
                        'hint': 'Ünlem ve eşittir işaretleri.',
                        'explanation': 'Eşit değildir kontrolü yapmak için != operatörü kullanılır.',
                        'code_block': (
                            "sayi = 5\n"
                            "if sayi ___ 0:\n"
                            "    print('Sıfır değil')"
                        ),
                        'word_bank': {
                            'words': [
                                '!=',
                                '==',
                                '=',
                                '<>',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': 'Aşağıdaki ifadelerden hangisi True döndürür?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                "'abc' < 'abcd'",
                                '5 < 3',
                                '10 == 10.1',
                                'False != False',
                            ],
                        },
                        'correct_answer': "'abc' < 'abcd'",
                        'hint': 'Stringlerin alfabetik olarak karşılaştırıldığını hatırlayın.',
                        'explanation': "'abc' stringi alfabetik sırada 'abcd' den önce gelir ve daha kısadır, bu yüzden ifade True döner.",
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'İç İçe Koşullar',
                'lesson_type': 'quiz',
                'order': 14,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': "İç içe (nested) if yapısında, içteki if'in girinti seviyesi dıştaki if'e göre nasıldır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Aynıdır',
                                'Daha derindedir (fazladır)',
                                'Daha geridedir',
                                'Fark etmez',
                            ],
                        },
                        'correct_answer': 'Daha derindedir (fazladır)',
                        'hint': 'İçteki kod bloğu dıştakine bağımlıdır.',
                        'explanation': 'Her iç içe blok için 4 boşluk daha girinti eklenir.',
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'İç içe if koşullarını azaltmak için genellikle hangi mantıksal operatörler kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'and / or',
                                '+ / -',
                                'in / not in',
                                'is / is not',
                            ],
                        },
                        'correct_answer': 'and / or',
                        'hint': 'İki koşulu tek satırda birleştiren operatörler.',
                        'explanation': "and/or kullanarak iç içe if yapılarını tek bir if'e indirgeyebiliriz.",
                        'order': 2,
                    },
                    {
                        'question_text': 'İç içe if yapısı çok derinleşirse ne olur?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Kod daha hızlı çalışır',
                                'Okunabilirlik azalır (spaghetti code)',
                                'Hata olasılığı sıfıra iner',
                                'Bellek tüketimi azalır',
                            ],
                        },
                        'correct_answer': 'Okunabilirlik azalır (spaghetti code)',
                        'hint': 'Kodun okunmasının zorlaşması.',
                        'explanation': 'Çok derin iç içe yapılar kodun anlaşılmasını zorlaştırır.',
                        'order': 3,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "x = 10\n"
                            "if x > 5:\n"
                            "    if x < 15:\n"
                            "        print('Evet')\n"
                            "    else:\n"
                            "        print('Hayır')"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Evet',
                                'Hayır',
                                'Çıktı vermez',
                                'Hata',
                            ],
                        },
                        'correct_answer': 'Evet',
                        'hint': 'Koşulları tek tek kontrol edin.',
                        'explanation': "10 > 5 (True) ve 10 < 15 (True) olduğu için 'Evet' yazdırılır.",
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': 'İç içe koşullarda içteki bloğu oluştururken girinti seviyesi nasıl olmalıdır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Aynı kalmalıdır',
                                '4 boşluk daha içeri girintilenmelidir',
                                'Geriye alınmalıdır',
                                'Fark etmez',
                            ],
                        },
                        'correct_answer': '4 boşluk daha içeri girintilenmelidir',
                        'hint': 'Her yeni blokta girinti artar.',
                        'explanation': "Python'da her alt blok (iç içe if gibi) 4 boşluk daha içeri girintilenerek yazılmalıdır.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "x = 10\n"
                            "y = 20\n"
                            "if x > 5:\n"
                            "    if y > 15:\n"
                            "        print('A')\n"
                            "    else:\n"
                            "        print('B')"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'A',
                                'B',
                                'Hiçbir şey',
                                'Hata',
                            ],
                        },
                        'correct_answer': 'A',
                        'hint': 'Koşulları dıştan içe doğru takip edin.',
                        'explanation': "x > 5 (10 > 5) True'dur ve içteki if'e girilir. y > 15 (20 > 15) de True olduğundan A yazdırılır.",
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "İç içe if yapısını tek satırda birleştirmek için boşluğu doldurun:\n"
                            "if x > 0 ___ y > 0:\n"
                            "    print('İkisi de pozitif')"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'and',
                        'hint': 'VE anlamına gelen mantıksal bağlaç.',
                        'explanation': "İki koşulun da aynı anda sağlanması gerekiyorsa 'and' operatörü ile birleştirilir.",
                        'code_block': (
                            "if x > 0 ___ y > 0:\n"
                            "    print('İkisi de pozitif')"
                        ),
                        'word_bank': {
                            'words': [
                                'and',
                                'or',
                                '&&',
                                'with',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "x = 3\n"
                            "if x > 5:\n"
                            "    if x < 10:\n"
                            "        print('A')\n"
                            "else:\n"
                            "    print('B')"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'A',
                                'B',
                                'Hiçbir şey',
                                'Hata',
                            ],
                        },
                        'correct_answer': 'B',
                        'hint': 'İlk koşulun False olduğunu unutmayın.',
                        'explanation': 'x > 5 (3 > 5) False olduğundan en dıştaki else bloğu çalışır ve B basılır.',
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Koşul Mini Görevi',
                'lesson_type': 'quiz',
                'order': 15,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': 'Bir sayının çift olup olmadığını kontrol eden doğru koşul hangisidir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'sayi % 2 == 0',
                                'sayi / 2 == 0',
                                'sayi // 2 == 0',
                                'sayi % 2 != 0',
                            ],
                        },
                        'correct_answer': 'sayi % 2 == 0',
                        'hint': "2'ye bölümünden kalan sıfır olmalı.",
                        'explanation': "Kalan bulma operatörü %'dir. `sayi % 2 == 0` çift sayıları bulur.",
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': "Bir sayının 3 ve 5'e tam bölündüğünü doğrulayan koşul hangisidir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'sayi % 15 == 0',
                                'sayi % 3 == 0 and sayi % 5 == 0',
                                'Her ikisi de doğrudur',
                                'Hiçbiri',
                            ],
                        },
                        'correct_answer': 'Her ikisi de doğrudur',
                        'hint': '3 ve 5 aralarında asaldır.',
                        'explanation': "Hem 3'e hem 5'e bölünen bir sayı 15'e de tam bölünür. İki ifade de mantıksal olarak aynıdır.",
                        'order': 2,
                    },
                    {
                        'question_text': (
                            "Boşluğu doldurarak pozitif sayıları yakalayın:\n"
                            "sayi = 5\n"
                            "if sayi ___ 0:\n"
                            "    print('Pozitif')"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': '>',
                        'hint': 'Sıfırdan büyük sayılar pozitiftir.',
                        'explanation': 'sayi > 0 pozitif sayıları kontrol eder.',
                        'code_block': (
                            "sayi = 5\n"
                            "if sayi ___ 0:\n"
                            "    print('Pozitif')"
                        ),
                        'word_bank': {
                            'words': [
                                '>',
                                '<',
                                '==',
                                '!=',
                            ],
                        },
                        'order': 3,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "notu = 85\n"
                            "if notu >= 90:\n"
                            "    print('A')\n"
                            "elif notu >= 80:\n"
                            "    print('B')\n"
                            "else:\n"
                            "    print('C')"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'A',
                                'B',
                                'C',
                                'Hata',
                            ],
                        },
                        'correct_answer': 'B',
                        'hint': '85 >= 80 koşulu doğrudur.',
                        'explanation': "İlk uyan koşul elif bloğundaki notu >= 80 olduğu için 'B' basılır.",
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': "Bir sayının 5'e bölünüp bölünmediğini kontrol eden koşul hangisidir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'sayi / 5 == 0',
                                'sayi % 5 == 0',
                                'sayi // 5 == 0',
                                'sayi % 5 != 0',
                            ],
                        },
                        'correct_answer': 'sayi % 5 == 0',
                        'hint': 'Kalanı bulmak için % operatörünü kullanın.',
                        'explanation': "Bir sayının 5'e kalansız bölündüğünü sayi % 5 == 0 ifadesi kontrol eder.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "yas = 18\n"
                            "ehliyet = True\n"
                            "if yas >= 18 and ehliyet:\n"
                            "    print('Giriş')\n"
                            "çıktısı nedir?"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Giriş',
                                'Hiçbir şey',
                                'Hata',
                                'False',
                            ],
                        },
                        'correct_answer': 'Giriş',
                        'hint': 'yas >= 18 ve ehliyet koşullarının ikisi de True mu?',
                        'explanation': 'İki koşul da True olduğundan if bloğu çalışır ve Giriş yazdırılır.',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Metin uzunluğu kontrolü için boşluğu doldurun:\n"
                            "s = 'python'\n"
                            "if ___ > 5:\n"
                            "    print('Uzun')"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'len(s)',
                        'hint': 'String uzunluk bulma fonksiyonunu s ile çağırın.',
                        'explanation': "String s'in uzunluğu len(s) ile bulunur ve 6 sayısı 5'ten büyüktür.",
                        'code_block': (
                            "s = 'python'\n"
                            "if ___ > 5:\n"
                            "    print('Uzun')"
                        ),
                        'word_bank': {
                            'words': [
                                'len(s)',
                                's.length()',
                                'size(s)',
                                's.len',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "x = 10\n"
                            "if x > 5:\n"
                            "    x += 5\n"
                            "elif x > 10:\n"
                            "    x += 10\n"
                            "print(x)"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '10',
                                '15',
                                '25',
                                'Hata',
                            ],
                        },
                        'correct_answer': '15',
                        'hint': 'if-elif yapısında sadece ilk doğru blok çalışır.',
                        'explanation': 'x > 5 True olduğu için x += 5 çalışır ve x 15 olur. elif bloğu atlanır.',
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'for Döngüsü',
                'lesson_type': 'quiz',
                'order': 16,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'for döngüsünde üzerinde gezineceğimiz diziyi belirtmek için hangi anahtar kelime kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'in',
                                'on',
                                'at',
                                'through',
                            ],
                        },
                        'correct_answer': 'in',
                        'hint': 'İçinde anlamına gelir.',
                        'explanation': 'for eleman in koleksiyon: yapısı kullanılır.',
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki döngü kaç kez çalışır?\n"
                            "for harf in 'Python':\n"
                            "    print(harf)"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '1',
                                '5',
                                '6',
                                'Sonsuz',
                            ],
                        },
                        'correct_answer': '6',
                        'hint': "'Python' kelimesindeki harf sayısını sayın.",
                        'explanation': "Stringler karakter dizisidir. Her karakter için bir kez döner. 'Python' 6 harflidir.",
                        'order': 2,
                    },
                    {
                        'question_text': 'for döngüsünde iterasyon değişkeni (örn: for x in... ifadesindeki x) önceden tanımlanmak zorundadır.',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğrudur, tanımlanmazsa NameError alınır.',
                                'Yanlıştır, döngü başlatılırken otomatik olarak oluşturulur.',
                            ],
                        },
                        'correct_answer': 'false|1',
                        'hint': "Döngü değişkeninin scope'unu düşünün.",
                        'explanation': 'Döngü değişkeni önceden tanımlanmaya ihtiyaç duymaz.',
                        'order': 3,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "toplam = 0\n"
                            "for x in [1, 2, 3]:\n"
                            "    toplam += x\n"
                            "print(toplam)"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '3',
                                '5',
                                '6',
                                'Hata',
                            ],
                        },
                        'correct_answer': '6',
                        'hint': '1 + 2 + 3 toplamını hesaplayın.',
                        'explanation': 'Döngü her adımdaki sayıyı toplama ekler. 1 + 2 + 3 = 6.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': 'for döngüleri sadece sayı listelerinde çalışabilir.',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğrudur, sadece int listelerinde döngü kurulabilir.',
                                'Yanlıştır, string, liste, demet gibi tüm yinelenebilir nesnelerde çalışabilir.',
                            ],
                        },
                        'correct_answer': 'false|1',
                        'hint': 'Farklı türdeki veriler üzerinde dönebilir miyiz?',
                        'explanation': "for döngüsü Python'daki tüm iterable (yinelenebilir) nesnelerin (list, str, dict vb.) elemanları üzerinde dönebilir.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "for i in 'ab':\n"
                            "    print(i, end='')"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'ab',
                                (
                                    "a\n"
                                    "b"
                                ),
                                (
                                    "ab\n"
                                    ""
                                ),
                                'Hata',
                            ],
                        },
                        'correct_answer': 'ab',
                        'hint': "end='' ile yeni satıra geçiş iptal edilmiştir.",
                        'explanation': "Döngü 'a' ve 'b' harfleri için çalışır, end='' sebebiyle yan yana 'ab' yazarlar.",
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Döngüyü tamamlamak için boşluğu doldurun:\n"
                            "renkler = ['kırmızı', 'mavi']\n"
                            "for renk ___ renkler:\n"
                            "    print(renk)"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'in',
                        'hint': 'İçinde anlamına gelen kelime.',
                        'explanation': "for eleman in koleksiyon: sözdizimi için 'in' kelimesi kullanılır.",
                        'code_block': (
                            "renkler = ['kırmızı', 'mavi']\n"
                            "for renk ___ renkler:\n"
                            "    print(renk)"
                        ),
                        'word_bank': {
                            'words': [
                                'in',
                                'on',
                                'into',
                                'at',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kod kaç kez çalışır?\n"
                            "for i in []:\n"
                            "    print(i)"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '0',
                                '1',
                                'Sonsuz',
                                'Hata',
                            ],
                        },
                        'correct_answer': '0',
                        'hint': 'Listenin eleman sayısına bakın.',
                        'explanation': 'Liste boş olduğundan döngü gövdesi hiç çalıştırılmaz.',
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'while Döngüsü',
                'lesson_type': 'quiz',
                'order': 17,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'while döngüsü ne zamana kadar çalışmaya devam eder?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Koşul True olduğu sürece',
                                'Koşul False olduğu sürece',
                                'Belirli bir sayıda',
                                'Sonsuza kadar',
                            ],
                        },
                        'correct_answer': 'Koşul True olduğu sürece',
                        'hint': 'while, -ken / sürece anlamına gelir.',
                        'explanation': 'while döngüsü koşul True olduğu sürece bloğu tekrarlar.',
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'Sonsuz döngü (infinite loop) nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Hiç çalışmayan döngü',
                                'Koşulu hiçbir zaman False olmayan ve durmayan döngü',
                                'Çok hızlı çalışan döngü',
                                'Sadece 100 kere dönen döngü',
                            ],
                        },
                        'correct_answer': 'Koşulu hiçbir zaman False olmayan ve durmayan döngü',
                        'hint': 'Bitiş koşulu sağlanmadığında olur.',
                        'explanation': 'Döngünün bitiş koşulu hiç sağlanmazsa döngü sonsuza dek çalışır.',
                        'order': 2,
                    },
                    {
                        'question_text': 'while döngüsünde kullanılan sayacın güncellenmesi nerede yapılmalıdır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Döngünün dışında, üstünde',
                                'Döngünün gövdesi içinde',
                                'Döngüden hemen sonra',
                                'Gerekli değildir',
                            ],
                        },
                        'correct_answer': 'Döngünün gövdesi içinde',
                        'hint': 'Döngü her döndüğünde sayacın değişmesi gerekir.',
                        'explanation': 'Sayaç güncellenmezse koşul sürekli True kalır ve sonsuz döngüye girer.',
                        'order': 3,
                    },
                    {
                        'question_text': 'while True: döngüsünden çıkış yapmak için hangi anahtar kelime kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'exit',
                                'break',
                                'stop',
                                'end',
                            ],
                        },
                        'correct_answer': 'break',
                        'hint': 'Kırmak / kesmek anlamında.',
                        'explanation': 'break ifadesi döngü koşuluna bakılmaksızın döngüyü anında bitirir.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': 'while döngüsünün sonsuz döngüye girmemesi için ne yapılmalıdır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Koşul değişkeni döngü içinde güncellenmelidir',
                                'if ifadesi eklenmelidir',
                                'pass yazılmalıdır',
                                'Hiçbir şey gerekmez',
                            ],
                        },
                        'correct_answer': 'Koşul değişkeni döngü içinde güncellenmelidir',
                        'hint': 'Döngü koşulunun bir noktada False olması gerekir.',
                        'explanation': 'while döngüsünün durması için, test edilen koşulun bir aşamada False olması gerekir. Bu da koşul değişkeninin güncellenmesiyle sağlanır.',
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "i = 3\n"
                            "while i > 0:\n"
                            "    print(i, end='')\n"
                            "    i -= 1"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '321',
                                '3210',
                                (
                                    "3\n"
                                    "2\n"
                                    "1"
                                ),
                                'Sonsuz döngü',
                            ],
                        },
                        'correct_answer': '321',
                        'hint': "i'nin değerinin her adımda azaldığını takip edin.",
                        'explanation': 'i sırasıyla 3, 2, 1 olur. 0 olduğunda i > 0 koşulu bozulur ve döngü biter. Ekrana 321 basılır.',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Döngü koşulunu tamamlamak için boşluğu doldurun:\n"
                            "i = 0\n"
                            "___ i < 3:\n"
                            "    print(i)\n"
                            "    i += 1"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'while',
                        'hint': '-ken veya sürece anlamına gelen döngü kelimesi.',
                        'explanation': "Belirli bir koşul doğru olduğu sürece çalışacak döngüyü 'while' kelimesiyle başlatırız.",
                        'code_block': (
                            "i = 0\n"
                            "___ i < 3:\n"
                            "    print(i)\n"
                            "    i += 1"
                        ),
                        'word_bank': {
                            'words': [
                                'while',
                                'for',
                                'if',
                                'until',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Hatalı satırı bulun:\n"
                            "i = 0\n"
                            "while i < 5\n"
                            "    print(i)\n"
                            "    i += 1"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "i = 0\n"
                            "while i < 5\n"
                            "    print(i)\n"
                            "    i += 1"
                        ),
                        'correct_answer': '1|while i < 5:',
                        'correct_line_index': 1,
                        'options': {
                            'fix_options': [
                                'while i < 5:',
                                'while (i < 5):',
                            ],
                        },
                        'hint': 'while satırının sonundaki eksik karakteri bulun.',
                        'explanation': "Python'da while satırının sonuna iki nokta (:) konmalıdır.",
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'range Kullanımı',
                'lesson_type': 'quiz',
                'order': 18,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'range(5) ifadesi hangi sayıları üretir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '1, 2, 3, 4, 5',
                                '0, 1, 2, 3, 4',
                                '0, 1, 2, 3, 4, 5',
                                '1, 2, 3, 4',
                            ],
                        },
                        'correct_answer': '0, 1, 2, 3, 4',
                        'hint': "0'dan başlar, son sayı dahil değildir.",
                        'explanation': "range(n) 0'dan başlar ve n-1'e kadar gider.",
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'range(1, 5) ifadesi hangi sayıları üretir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '1, 2, 3, 4, 5',
                                '1, 2, 3, 4',
                                '0, 1, 2, 3, 4',
                                'Hata',
                            ],
                        },
                        'correct_answer': '1, 2, 3, 4',
                        'hint': 'Başlangıç değeri 1, bitiş 5 (dahil değil).',
                        'explanation': "range(start, stop) start'tan stop-1'e kadar üretir.",
                        'order': 2,
                    },
                    {
                        'question_text': 'range(1, 10, 2) ifadesindeki 2 neyi temsil eder?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Bitiş değerini',
                                'Artış miktarını (step)',
                                'Üretilecek sayı adedini',
                                'Başlangıç değerini',
                            ],
                        },
                        'correct_answer': 'Artış miktarını (step)',
                        'hint': 'Adım sayısı.',
                        'explanation': 'Üçüncü parametre artış (adım) miktarını belirtir.',
                        'order': 3,
                    },
                    {
                        'question_text': 'list(range(3)) ifadesinin sonucu nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '[1, 2, 3]',
                                '[0, 1, 2]',
                                '[0, 1, 2, 3]',
                                'Hata',
                            ],
                        },
                        'correct_answer': '[0, 1, 2]',
                        'hint': "0'dan 2'ye kadar sayıların listesi.",
                        'explanation': 'range(3) -> 0, 1, 2 üretir. list() bunu listeye çevirir.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': 'range(5) ifadesi hangi sayıları üretir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '1, 2, 3, 4, 5',
                                '0, 1, 2, 3, 4',
                                '0, 1, 2, 3, 4, 5',
                                '1, 2, 3, 4',
                            ],
                        },
                        'correct_answer': '0, 1, 2, 3, 4',
                        'hint': "Varsayılan başlangıç değeri 0'dır ve sınır hariçtir.",
                        'explanation': "range(N) ifadesi 0'dan N-1'e kadar olan tam sayıları üretir. range(5) -> 0, 1, 2, 3, 4.",
                        'order': 5,
                    },
                    {
                        'question_text': 'range(2, 8, 2) ifadesinin ürettiği sayılar hangileridir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '2, 4, 6',
                                '2, 4, 6, 8',
                                '4, 6, 8',
                                '2, 3, 4, 5, 6, 7',
                            ],
                        },
                        'correct_answer': '2, 4, 6',
                        'hint': 'Başlangıç, bitiş (hariç) ve artış miktarına bakın.',
                        'explanation': "2'den başlar, 8'e kadar 2'şer artar: 2, 4, 6. 8 hariçtir.",
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Geriye doğru sayılar üretmek için boşluğu doldurun:\n"
                            "for i in range(5, 0, ___):\n"
                            "    print(i)"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': '-1',
                        'hint': 'Azalış miktarını belirtmelisiniz.',
                        'explanation': "range(5, 0, -1) ifadesi 5'ten 1'e kadar (0 hariç) geriye doğru sayılar üretir.",
                        'code_block': (
                            "for i in range(5, 0, ___):\n"
                            "    print(i)"
                        ),
                        'word_bank': {
                            'words': [
                                '-1',
                                '0',
                                '1',
                                '-2',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "print(list(range(3)))"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '[0, 1, 2]',
                                '[1, 2, 3]',
                                '[0, 1, 2, 3]',
                                'range(3)',
                            ],
                        },
                        'correct_answer': '[0, 1, 2]',
                        'hint': 'range nesnesini listeye dönüştürün.',
                        'explanation': 'list() fonksiyonu range üreticisini listeye çevirir. range(3) -> 0, 1, 2 olduğundan [0, 1, 2] olur.',
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'break / continue',
                'lesson_type': 'quiz',
                'order': 19,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'Döngüyü tamamen sonlandırıp döngüden çıkmak için hangisi kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'continue',
                                'break',
                                'pass',
                                'skip',
                            ],
                        },
                        'correct_answer': 'break',
                        'hint': 'Kırmak anlamındaki kelime.',
                        'explanation': 'break döngüyü tamamen bitirir ve döngüden sonraki satırdan devam eder.',
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'Döngünün mevcut adımını atlayıp bir sonraki iterasyona geçmek için hangisi kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'continue',
                                'break',
                                'pass',
                                'next',
                            ],
                        },
                        'correct_answer': 'continue',
                        'hint': 'Devam etmek anlamındaki kelime.',
                        'explanation': 'continue döngünün o adımdaki kalan kodlarını çalıştırmadan bir sonraki adıma geçer.',
                        'order': 2,
                    },
                    {
                        'question_text': 'continue anahtar kelimesinden sonra gelen döngü içi satırlar o adımda çalıştırılır mı?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Evet',
                                'Hayır',
                                'Koşula bağlı olarak',
                                'Hata verir',
                            ],
                        },
                        'correct_answer': 'Hayır',
                        'hint': 'continue döngüyü bir sonraki tura zorlar.',
                        'explanation': 'continue görüldüğü an, altındaki kodlar çalıştırılmadan döngünün başına dönülür.',
                        'order': 3,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "for i in range(5):\n"
                            "    if i == 2:\n"
                            "        break\n"
                            "    print(i, end='')"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '01',
                                '012',
                                '0134',
                                '01234',
                            ],
                        },
                        'correct_answer': '01',
                        'hint': 'i, 2 olduğunda döngü anında kesilir.',
                        'explanation': 'i=0 yazılır, i=1 yazılır, i=2 olunca döngüden çıkılır.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': 'Döngüyü tamamen sonlandırmak için hangi anahtar kelime kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'continue',
                                'break',
                                'exit',
                                'stop',
                            ],
                        },
                        'correct_answer': 'break',
                        'hint': 'Kırmak anlamına gelen İngilizce kelime.',
                        'explanation': 'break ifadesi içinde bulunulan döngüyü derhal sonlandırır.',
                        'order': 5,
                    },
                    {
                        'question_text': 'Döngünün o anki adımını atlayıp bir sonraki adıma geçmesini sağlayan ifade hangisidir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'break',
                                'continue',
                                'skip',
                                'next',
                            ],
                        },
                        'correct_answer': 'continue',
                        'hint': 'Devam etmek anlamına gelen İngilizce kelime.',
                        'explanation': 'continue ifadesi döngünün geri kalan kodlarını çalıştırmadan bir sonraki iterasyona geçer.',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "for i in range(4):\n"
                            "    if i == 2:\n"
                            "        continue\n"
                            "    print(i, end='')"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '013',
                                '0123',
                                '01',
                                '3',
                            ],
                        },
                        'correct_answer': '013',
                        'hint': 'i, 2 olduğunda continue nedeniyle print edilmez.',
                        'explanation': '0, 1 yazdırılır. 2 olunca continue ile adım atlanır. Sonra 3 yazdırılır. Sonuç 013 olur.',
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "for i in range(4):\n"
                            "    if i == 2:\n"
                            "        break\n"
                            "    print(i, end='')"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '01',
                                '013',
                                '012',
                                '0123',
                            ],
                        },
                        'correct_answer': '01',
                        'hint': 'break döngüyü tamamen bitirir.',
                        'explanation': '0, 1 yazdırılır. 2 olunca break ile döngü tamamen sonlandırılır. Sonuç 01 olur.',
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Döngü Mini Görevi',
                'lesson_type': 'quiz',
                'order': 20,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': (
                            "1'den 5'e kadar (5 dahil) sayıların çarpımını hesaplayan döngüdeki boşluğu doldurun:\n"
                            "carpim = 1\n"
                            "for i in range(1, 6):\n"
                            "    ___"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'carpim *= i',
                        'hint': 'Her adımda carpim değişkenini i ile çarpmalısınız.',
                        'explanation': 'Faktöriyel / çarpım biriktirmek için *= operatörü kullanılır.',
                        'code_block': (
                            "carpim = 1\n"
                            "for i in range(1, 6):\n"
                            "    ___"
                        ),
                        'word_bank': {
                            'words': [
                                'carpim *= i',
                                'carpim += i',
                                'carpim = i',
                                'carpim += 1',
                            ],
                        },
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "toplam = 0\n"
                            "for i in range(5):\n"
                            "    if i % 2 == 1:\n"
                            "        continue\n"
                            "    toplam += i\n"
                            "print(toplam)"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '6',
                                '10',
                                '4',
                                'Hata',
                            ],
                        },
                        'correct_answer': '6',
                        'hint': 'Sadece çift sayıları (0, 2, 4) topluyor.',
                        'explanation': 'Tek sayılar atlanır. Çift sayılar: 0, 2, 4 toplanır. 0+2+4=6.',
                        'order': 2,
                    },
                    {
                        'question_text': "Hangi döngü yapısı koşul başlangıçta yanlış olsa bile en az bir kere çalışır? (Genel programlama bilgisi, Python'da doğrudan yoktur)",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'while',
                                'for',
                                'do-while',
                                'Hiçbiri',
                            ],
                        },
                        'correct_answer': 'do-while',
                        'hint': 'Önce yap, sonra kontrol et yapısı.',
                        'explanation': "do-while önce gövdeyi çalıştırır, sonra koşulu kontrol eder. Python'da bulunmaz.",
                        'order': 3,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kod kaç kez döner?\n"
                            "i = 0\n"
                            "while i < 3:\n"
                            "    print(i)\n"
                            "    i += 1"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '2',
                                '3',
                                '4',
                                'Sonsuz',
                            ],
                        },
                        'correct_answer': '3',
                        'hint': 'i = 0, 1, 2 durumlarını sayın.',
                        'explanation': 'i=0, i=1 ve i=2 için döner. i=3 olunca koşul bozulur.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': 'Sonsuz döngü oluşturan geçerli yapı hangisidir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'while True:',
                                'for i in range(inf):',
                                'while False:',
                                'for i in infinite:',
                            ],
                        },
                        'correct_answer': 'while True:',
                        'hint': 'Koşulun her zaman doğru olacağı bir while döngüsü düşünün.',
                        'explanation': 'while True: ifadesi koşul her zaman True kalacağı için sonsuz döngü oluşturur.',
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "10'dan 1'e kadar geriye doğru sayan döngü parametre boşluğunu doldurun:\n"
                            "for i in range(10, 0, ___):\n"
                            "    print(i)"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': '-1',
                        'hint': 'Adım miktarını negatif olarak ayarlayın.',
                        'explanation': "Geriye doğru 1'er azalma için adım parametresi -1 olmalıdır.",
                        'code_block': (
                            "for i in range(10, 0, ___):\n"
                            "    print(i)"
                        ),
                        'word_bank': {
                            'words': [
                                '-1',
                                '1',
                                '0',
                                '-2',
                            ],
                        },
                        'order': 6,
                    },
                    {
                        'question_text': 'print([x * 2 for x in range(3)]) ifadesinin çıktısı nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '[0, 2, 4]',
                                '[2, 4, 6]',
                                '[0, 1, 2]',
                                '[0, 2, 4, 6]',
                            ],
                        },
                        'correct_answer': '[0, 2, 4]',
                        'hint': 'range(3) 0, 1, 2 üretir. Her birini 2 ile çarpın.',
                        'explanation': 'range(3) -> 0, 1, 2. List comprehension ile her eleman 2 ile çarpılır: [0, 2, 4].',
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Hatalı satırı bulun:\n"
                            "i = 5\n"
                            "while i > 0:\n"
                            "    print(i)\n"
                            "    i = i + 1"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "i = 5\n"
                            "while i > 0:\n"
                            "    print(i)\n"
                            "    i = i + 1"
                        ),
                        'correct_answer': '3|    i = i - 1',
                        'correct_line_index': 3,
                        'options': {
                            'fix_options': [
                                '    i = i - 1',
                                '    i -= 1',
                            ],
                        },
                        'hint': "i'nin değerinin sürekli arttığını ve döngü koşulunun hiçbir zaman bozulmayacağını fark edin.",
                        'explanation': 'i arttıkça i > 0 koşulu hep doğru kalır ve sonsuz döngü oluşur. Döngünün bitmesi için i azaltılmalıdır: i = i - 1 veya i -= 1.',
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Fonksiyon Nedir?',
                'lesson_type': 'quiz',
                'order': 21,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': "Python'da fonksiyon tanımlamak için hangi anahtar kelime kullanılır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'func',
                                'function',
                                'def',
                                'define',
                            ],
                        },
                        'correct_answer': 'def',
                        'hint': 'Define kelimesinin kısaltması.',
                        'explanation': "Python'da fonksiyonlar `def` anahtar kelimesiyle tanımlanır.",
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': "'selamla' adındaki bir fonksiyonu doğru çağırma yöntemi hangisidir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'selamla',
                                'selamla()',
                                'call selamla',
                                'run selamla()',
                            ],
                        },
                        'correct_answer': 'selamla()',
                        'hint': 'Parantez kullanmalısınız.',
                        'explanation': 'Fonksiyonları tetiklemek/çağırmak için sonlarına `()` eklenir.',
                        'order': 2,
                    },
                    {
                        'question_text': 'Fonksiyon kullanmanın temel amacı nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Kodun daha yavaş çalışması',
                                'Kod tekrarını önlemek ve tekrar kullanılabilirliği artırmak',
                                'Değişken tanımlamak',
                                'Döngü oluşturmak',
                            ],
                        },
                        'correct_answer': 'Kod tekrarını önlemek ve tekrar kullanılabilirliği artırmak',
                        'hint': "DRY (Don't Repeat Yourself) prensibi.",
                        'explanation': 'Fonksiyonlar kod bloklarını isimlendirerek tekrar kullanmayı sağlar.',
                        'order': 3,
                    },
                    {
                        'question_text': 'Boş bir fonksiyon gövdesine hata almamak için geçici olarak ne yazılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'null',
                                'none',
                                'pass',
                                'empty',
                            ],
                        },
                        'correct_answer': 'pass',
                        'hint': 'Geçmek / atlamak anlamında.',
                        'explanation': "Python'da boş bloklar geçersizdir. Boşluğu doldurmak için `pass` yazılır.",
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': "Python'da bir fonksiyon tanımlamak için hangi anahtar kelime kullanılır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'func',
                                'def',
                                'function',
                                'define',
                            ],
                        },
                        'correct_answer': 'def',
                        'hint': 'Define kelimesinin ilk üç harfi.',
                        'explanation': "Python'da fonksiyonlar 'def' (definition) anahtar kelimesiyle tanımlanır.",
                        'order': 5,
                    },
                    {
                        'question_text': 'Bir fonksiyonu çalıştırmak (çağırmak) için hangi sözdizimi kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'fonksiyon_adi',
                                'fonksiyon_adi()',
                                'call fonksiyon_adi',
                                'run fonksiyon_adi',
                            ],
                        },
                        'correct_answer': 'fonksiyon_adi()',
                        'hint': 'Fonksiyon adının arkasından gelen parantezler.',
                        'explanation': 'Fonksiyonları parantez ekleyerek çağırırız: fonksiyon_adi().',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Fonksiyon tanımlamak için boşluğu doldurun:\n"
                            "___ selamla():\n"
                            "    print('Merhaba')"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'def',
                        'hint': 'Fonksiyon tanımlama kelimesi.',
                        'explanation': "Fonksiyon 'def selamla():' şeklinde tanımlanır.",
                        'code_block': (
                            "___ selamla():\n"
                            "    print('Merhaba')"
                        ),
                        'word_bank': {
                            'words': [
                                'def',
                                'func',
                                'selamla',
                                'define',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': 'Bir fonksiyon tanımlandığı anda otomatik olarak çalışır.',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğrudur, tanımlandığı yerde hemen yürütülür.',
                                'Yanlıştır, sadece çağrıldığı (invoke edildiği) zaman çalışır.',
                            ],
                        },
                        'correct_answer': 'false|1',
                        'hint': 'Fonksiyonun çağrılma mantığını düşünün.',
                        'explanation': 'Fonksiyon tanımlanmakla çalışmaz. Çalışması için açıkça çağrılması gerekir.',
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Parametreler',
                'lesson_type': 'quiz',
                'order': 22,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'Fonksiyon tanımlanırken parantez içine yazılan değişkenlere ne denir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Argüman',
                                'Parametre',
                                'Global değişken',
                                'Sabit',
                            ],
                        },
                        'correct_answer': 'Parametre',
                        'hint': 'Fonksiyon şablonundaki değişkenler.',
                        'explanation': 'Tanımdaki girdilere parametre, çağrılırken gönderilen gerçek değerlere argüman denir.',
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'Fonksiyon çağrılırken gönderilen gerçek değerlere ne denir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Parametre',
                                'Argüman',
                                'Değişken',
                                'Çıktı',
                            ],
                        },
                        'correct_answer': 'Argüman',
                        'hint': 'Çağrı esnasında iletilen veri.',
                        'explanation': 'Çağrılırken aktarılan değerlere argüman (argument) adı verilir.',
                        'order': 2,
                    },
                    {
                        'question_text': 'Bir parametreye varsayılan (default) değer nasıl atanır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'def topla(x, y=0):',
                                'def topla(x, y): y=0',
                                'def topla(x, default y):',
                                'topla(x, y=0)',
                            ],
                        },
                        'correct_answer': 'def topla(x, y=0):',
                        'hint': 'Tanım satırında eşittir ile atanır.',
                        'explanation': 'Parametre tanımında `=` ile varsayılan değer verilir: `y=0`.',
                        'order': 3,
                    },
                    {
                        'question_text': 'Bir fonksiyona birden fazla parametre tanımlanırken aralarına hangi karakter konur?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                ';',
                                ',',
                                '.',
                                '/',
                            ],
                        },
                        'correct_answer': ',',
                        'hint': 'Virgül.',
                        'explanation': 'Parametreler virgülle ayrılır.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "def yaz(metin='test'):\n"
                            "    print(metin)\n"
                            "yaz()"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'test',
                                'None',
                                'Hata',
                                'Boş satır',
                            ],
                        },
                        'correct_answer': 'test',
                        'hint': 'Varsayılan (default) parametre değerini göz önünde bulundurun.',
                        'explanation': "metin parametresine varsayılan olarak 'test' atanmıştır. Argümansız çağrıda varsayılan değer yazdırılır.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "def topla(a, b):\n"
                            "    print(a + b)\n"
                            "topla(b=3, a=2)"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '5',
                                'Hata',
                                'None',
                                '23',
                            ],
                        },
                        'correct_answer': '5',
                        'hint': 'İsimlendirilmiş argümanlar (keyword arguments) sırayı bozsa da eşlemeyi doğru yapar.',
                        'explanation': 'b=3 ve a=2 atamasıyla parametreler isimlerine göre eşleşir. Toplam 5 olur.',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Varsayılan parametreli fonksiyonu tamamlamak için boşluğu doldurun:\n"
                            "def selamla(isim___'Ziyaretçi'):\n"
                            "    print('Merhaba ' + isim)"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': '=',
                        'hint': 'Değer atama operatörü.',
                        'explanation': "Parametrelere varsayılan değer atamak için = operatörü kullanılır: isim='Ziyaretçi'.",
                        'code_block': (
                            "def selamla(isim___'Ziyaretçi'):\n"
                            "    print('Merhaba ' + isim)"
                        ),
                        'word_bank': {
                            'words': [
                                '=',
                                '==',
                                ':',
                                'as',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': 'Bir fonksiyona sınırsız sayıda pozisyonel argüman göndermek için hangi parametre yapısı kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '*args',
                                '**kwargs',
                                'args*',
                                'list args',
                            ],
                        },
                        'correct_answer': '*args',
                        'hint': 'Tek yıldızlı parametre.',
                        'explanation': '*args yapısı fonksiyona gönderilen tüm pozisyonel argümanları bir demet (tuple) olarak toplar.',
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'return',
                'lesson_type': 'quiz',
                'order': 23,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'Fonksiyonun ürettiği sonucu çağrıldığı yere geri döndürmek için hangi anahtar kelime kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'send',
                                'output',
                                'return',
                                'back',
                            ],
                        },
                        'correct_answer': 'return',
                        'hint': 'Geri vermek anlamında.',
                        'explanation': 'Fonksiyondan değer döndürmek için `return` kullanılır.',
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'return anahtar kelimesinden sonra yazılan fonksiyon içi kodlar çalıştırılır mı?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Evet',
                                'Hayır',
                                'Bazen',
                                'Hata verir',
                            ],
                        },
                        'correct_answer': 'Hayır',
                        'hint': 'return fonksiyonu anında sonlandırır.',
                        'explanation': 'return görüldüğü an fonksiyondan çıkılır, altındaki kodlar çalışmaz.',
                        'order': 2,
                    },
                    {
                        'question_text': 'Herhangi bir return ifadesi bulundurmayan fonksiyonlar varsayılan olarak ne döndürür?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '0',
                                'False',
                                'None',
                                'Hata',
                            ],
                        },
                        'correct_answer': 'None',
                        'hint': "Python'daki boş değer nesnesi.",
                        'explanation': "Python'da return içermeyen fonksiyonlar None döndürür.",
                        'order': 3,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "def topla(a, b):\n"
                            "    return a + b\n"
                            "    print('Bitti')\n"
                            "print(topla(2, 3))"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '5',
                                'Bitti \\n 5',
                                '5 \\n Bitti',
                                'Hata',
                            ],
                        },
                        'correct_answer': '5',
                        'hint': "return sonrasındaki print('Bitti') satırına dikkat edin.",
                        'explanation': "return sonrası kodlar çalışmadığı için 'Bitti' yazılmaz. Sadece 5 yazılır.",
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': 'Bir fonksiyondan değer döndürmek için hangi anahtar kelime kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'give',
                                'send',
                                'return',
                                'output',
                            ],
                        },
                        'correct_answer': 'return',
                        'hint': 'Geri döndürmek anlamındaki kelime.',
                        'explanation': "Fonksiyonların değer üretip çağıran yere geri göndermesi için 'return' kullanılır.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "def f():\n"
                            "    return 5\n"
                            "    return 10\n"
                            "print(f())"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '5',
                                '10',
                                '15',
                                'Hata',
                            ],
                        },
                        'correct_answer': '5',
                        'hint': 'return ifadesi fonksiyonu sonlandırır.',
                        'explanation': 'İlk return 5 ifadesi değeri döndürür ve fonksiyondan çıkılmasını sağlar. Sonraki satır çalıştırılmaz.',
                        'order': 6,
                    },
                    {
                        'question_text': 'Herhangi bir return ifadesi içermeyen Python fonksiyonları varsayılan olarak ne döndürür?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'None',
                                '0',
                                'Boş string',
                                'Hata',
                            ],
                        },
                        'correct_answer': 'None',
                        'hint': "Python'daki özel boş değer tipi.",
                        'explanation': 'Değer döndürmeyen fonksiyonlar varsayılan olarak None nesnesini döner.',
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Fonksiyonun karesini döndürmesi için boşluğu doldurun:\n"
                            "def kare_al(x):\n"
                            "    ___ x * x"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'return',
                        'hint': 'Değeri geri gönderme ifadesi.',
                        'explanation': "Kare sonucunu döndürmek için 'return x * x' yazılır.",
                        'code_block': (
                            "def kare_al(x):\n"
                            "    ___ x * x"
                        ),
                        'word_bank': {
                            'words': [
                                'return',
                                'give',
                                'result',
                                'output',
                            ],
                        },
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Scope Mantığı',
                'lesson_type': 'quiz',
                'order': 24,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'Bir fonksiyonun içinde tanımlanan değişkenlere ne ad verilir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Lokal (Yerel) Değişken',
                                'Global Değişken',
                                'Statik Değişken',
                                'Sınıf Değişkeni',
                            ],
                        },
                        'correct_answer': 'Lokal (Yerel) Değişken',
                        'hint': 'Sadece o bölgeye özel.',
                        'explanation': "Fonksiyon içinde tanımlanan değişkenler yerel (lokal) scope'a aittir.",
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': 'Fonksiyon dışında tanımlanan ve her yerden erişilebilen değişkenlere ne ad verilir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Lokal Değişken',
                                'Global Değişken',
                                'Özel Değişken',
                                'Dinamik Değişken',
                            ],
                        },
                        'correct_answer': 'Global Değişken',
                        'hint': 'Küresel anlamında.',
                        'explanation': "Fonksiyonların dışında tanımlanan değişkenler global scope'a aittir.",
                        'order': 2,
                    },
                    {
                        'question_text': 'Bir fonksiyonun içinden, orada tanımlanmamış bir lokal değişkene dışarıdan erişilebilir mi?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Evet',
                                'Hayır',
                                'Sadece global ise',
                                'Hata ile',
                            ],
                        },
                        'correct_answer': 'Hayır',
                        'hint': 'Lokal değişkenler fonksiyon dışından görünmez.',
                        'explanation': 'Lokal değişkenlerin ömrü fonksiyon bittiğinde sona erer, dışarıdan erişilemez.',
                        'order': 3,
                    },
                    {
                        'question_text': 'Fonksiyon içinden global bir değişkeni değiştirmek/güncellemek için hangi anahtar kelimeyle deklare edilmelidir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'global',
                                'outer',
                                'public',
                                'nonlocal',
                            ],
                        },
                        'correct_answer': 'global',
                        'hint': 'Global olduğunu belirtmek için kullanılır.',
                        'explanation': 'Global değişkeni fonksiyon içinde modifiye etmek için `global degisken_adi` yazılır.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': 'Fonksiyon dışında tanımlanan bir değişken fonksiyon içinden okunabilir.',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                "Doğrudur, global scope'taki değişkenler lokalden okunabilir.",
                                'Yanlıştır, lokal scope dışını göremez.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'Global ve lokal değişken ilişkisini düşünün.',
                        'explanation': "Global scope'taki değişkenler fonksiyon içinden doğrudan okunabilir, ancak yazmak için global anahtar kelimesi gerekir.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "x = 10\n"
                            "def f():\n"
                            "    x = 20\n"
                            "f()\n"
                            "print(x)"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '10',
                                '20',
                                'Hata',
                                'None',
                            ],
                        },
                        'correct_answer': '10',
                        'hint': 'Fonksiyon içindeki x değişkeni lokal bir değişkendir.',
                        'explanation': "Fonksiyon içindeki x = 20 ifadesi lokal x tanımlar. Dıştaki global x'in değerini (10) değiştirmez.",
                        'order': 6,
                    },
                    {
                        'question_text': 'Fonksiyon içinden global bir değişkeni değiştirmek için hangi anahtar kelime kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'global',
                                'outer',
                                'public',
                                'extern',
                            ],
                        },
                        'correct_answer': 'global',
                        'hint': 'Evrensel / küresel anlamına gelen kelime.',
                        'explanation': "Global scope'taki bir değişkene yazmak için fonksiyon başında 'global x' bildirimi yapılmalıdır.",
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "def f():\n"
                            "    lokal_var = 5\n"
                            "f()\n"
                            "print(lokal_var)"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '5',
                                'None',
                                'NameError (Hata)',
                                '0',
                            ],
                        },
                        'correct_answer': 'NameError (Hata)',
                        'hint': 'Lokal değişkenlerin fonksiyon dışındaki varlığını düşünün.',
                        'explanation': "lokal_var sadece f() fonksiyonunun lokal scope'unda geçerlidir. Fonksiyon bittikten sonra erişilemez ve NameError hatası verir.",
                        'order': 8,
                    },
                ],
            },
            {
                'title': 'Fonksiyon Mini Görevi',
                'lesson_type': 'quiz',
                'order': 25,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': (
                            "Bir sayının çift olup olmadığını dönen fonksiyonun boşluğunu doldurun:\n"
                            "def cift_mi(sayi):\n"
                            "    ___"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': 'return sayi % 2 == 0',
                        'hint': 'Çift ise True dönecek bir return ifadesi yazın.',
                        'explanation': 'return sayi % 2 == 0 ifadesi sayı çift ise True, tek ise False döner.',
                        'code_block': (
                            "def cift_mi(sayi):\n"
                            "    ___"
                        ),
                        'word_bank': {
                            'words': [
                                'return sayi % 2 == 0',
                                'print(sayi % 2 == 0)',
                                'return sayi % 2',
                                'pass',
                            ],
                        },
                        'has_reinforcement': True,
                        'order': 1,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki fonksiyon çağrıldığında ne döner?\n"
                            "def selamla(isim='Misafir'):\n"
                            "    return 'Merhaba ' + isim\n"
                            "selamla()"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                "'Merhaba Misafir'",
                                "'Merhaba '",
                                'Hata',
                                'None',
                            ],
                        },
                        'correct_answer': "'Merhaba Misafir'",
                        'hint': 'Argüman gönderilmediğinde varsayılan parametre değeri kullanılır.',
                        'explanation': "selamla() parametresiz çağrıldığı için varsayılan 'Misafir' değeri kullanılır ve 'Merhaba Misafir' döner.",
                        'order': 2,
                    },
                    {
                        'question_text': 'Bir fonksiyon birden fazla return ifadesi barındırabilir mi?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                "Evet, koşullara bağlı olarak farklı return'ler çalışabilir",
                                'Hayır, sadece tek bir return bulunabilir',
                                'Evet, ama hepsi aynı anda çalışır',
                                'Hayır, return sadece en sonda olur',
                            ],
                        },
                        'correct_answer': "Evet, koşullara bağlı olarak farklı return'ler çalışabilir",
                        'hint': "if-else yapısı içinde return'ler düşünülebilir.",
                        'explanation': 'Koşullu dallanmalarda (if/else) birden fazla return bulunabilir, ancak hangisi önce tetiklenirse o çalışır.',
                        'order': 3,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "def kare_al(x):\n"
                            "    print(x * x)\n"
                            "sonuc = kare_al(4)\n"
                            "print(sonuc)"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '16 \\n None',
                                '16',
                                'None \\n 16',
                                'Hata',
                            ],
                        },
                        'correct_answer': (
                            "16 \n"
                            " None"
                        ),
                        'hint': 'kare_al() fonksiyonunda return olmadığına dikkat edin.',
                        'explanation': 'İlk olarak fonksiyon çalışır ve print(16) yapar. Return olmadığı için sonuc None olur, en son print(sonuc) -> None yazar.',
                        'is_reinforcement': True,
                        'order': 4,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "def selamla(isim):\n"
                            "    return 'Merhaba ' + isim\n"
                            "print(selamla('Ahmet'))"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Merhaba Ahmet',
                                'Merhaba ',
                                'Ahmet',
                                'Hata',
                            ],
                        },
                        'correct_answer': 'Merhaba Ahmet',
                        'hint': 'Fonksiyona gelen argümanı metne birleştirip geri döndürüyoruz.',
                        'explanation': "selamla('Ahmet') Ahmet ismini parametre olarak alır ve 'Merhaba Ahmet' metnini döner.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki kodun çıktısı nedir?\n"
                            "def f(x):\n"
                            "    return x + 1\n"
                            "print(f(f(1)))"
                        ),
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '2',
                                '3',
                                '4',
                                'Hata',
                            ],
                        },
                        'correct_answer': '3',
                        'hint': "Önce içteki f(1) ifadesini hesaplayın, sonra sonucu dıştaki f'e geçirin.",
                        'explanation': "İçteki f(1) = 2'dir. Dıştaki f(2) ise 2 + 1 = 3 sonucunu verir.",
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Fonksiyonun parametre almadığında varsayılan olarak 1 eklemesi için boşluğu doldurun:\n"
                            "def ekle(sayi, miktar___1):\n"
                            "    return sayi + miktar"
                        ),
                        'question_type': 'fill_in_blank',
                        'correct_answer': '=',
                        'hint': 'Parametre atama operatörü.',
                        'explanation': 'Varsayılan değer tanımlamak için miktar=1 şeklinde eşittir kullanılır.',
                        'code_block': (
                            "def ekle(sayi, miktar___1):\n"
                            "    return sayi + miktar"
                        ),
                        'word_bank': {
                            'words': [
                                '=',
                                '==',
                                'default',
                                'is',
                            ],
                        },
                        'order': 7,
                    },
                    {
                        'question_text': (
                            "Hatalı satırı bulun:\n"
                            "def carp(a, b)\n"
                            "    return a * b"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "def carp(a, b)\n"
                            "    return a * b"
                        ),
                        'correct_answer': '0|def carp(a, b):',
                        'correct_line_index': 0,
                        'options': {
                            'fix_options': [
                                'def carp(a, b):',
                                'def carp(a, b) -> int:',
                            ],
                        },
                        'hint': 'Fonksiyon imzasının sonundaki eksik karakteri bulun.',
                        'explanation': "Python'da fonksiyon tanımının (def) sonuna iki nokta (:) konmalıdır.",
                        'order': 8,
                    },
                ],
            },
        ],
    },
    {
        'slug': 'devops',
        'title': 'DevOps',
        'description': 'Linux, Docker, Git ve CI/CD araçlarıyla modern yazılım geliştirme ve dağıtım süreçleri.',
        'order': 2,
        'lessons': [
            {
                'title': 'Linux Temelleri',
                'lesson_type': 'quiz',
                'order': 1,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'ls -la komutunda -l ve -a ne anlama gelir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '-l liste formatı, -a gizli dosyaları göster',
                                '-l boyut sırala, -a yazar göster',
                                '-l son değişiklik, -a alfabetik',
                                '-l link say, -a tümü',
                            ],
                        },
                        'correct_answer': '-l liste formatı, -a gizli dosyaları göster',
                        'hint': 'l = long format, a = all (gizliler dahil).',
                        'explanation': 'ls -l uzun liste formatı (izinler, boyut, tarih), -a tümü (. ile başlayan gizli dosyalar dahil).',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'chmod 755 ne anlama gelir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Sahip: rwx, Grup: r-x, Diğer: r-x',
                                'Herkes tam izin',
                                'Sadece sahip okuyabilir',
                                'Tam kısıtlama',
                            ],
                        },
                        'correct_answer': 'Sahip: rwx, Grup: r-x, Diğer: r-x',
                        'hint': '7=rwx(4+2+1), 5=r-x(4+0+1).',
                        'explanation': '7=rwx(4+2+1), 5=r-x(4+0+1). 755: sahip her şeyi yapabilir, diğerleri okuyup çalıştırabilir.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'Linux komutlarını doğru sıraya koyun (dizin oluşturup içine girmek için):',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'mkdir proje',
                                'cd proje',
                                'ls',
                                'pwd',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': 'Önce oluştur, sonra gir, sonra listele, sonra nerede olduğunu gör.',
                        'explanation': 'Mantıksal sıra: mkdir ile oluştur → cd ile içine gir → ls ile içeriği gör → pwd ile nerede olduğunu kontrol et.',
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': "Linux'ta mevcut dizini görüntülemek için hangi komut kullanılır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'ls',
                                'pwd',
                                'cd',
                                'dir',
                            ],
                        },
                        'correct_answer': 'pwd',
                        'hint': 'pwd = print working directory.',
                        'explanation': 'pwd (print working directory) mevcut dizini gösterir. ls dosyaları listeler, cd dizin değiştirir.',
                        'order': 2,
                    },
                    {
                        'question_text': (
                            "Boşluğu doldurun:\n"
                            "# /home/kullanici dizininden /tmp'ye git\n"
                            "___ /tmp\n"
                            "\n"
                            "# Bir üst dizine git\n"
                            "___ .."
                        ),
                        'question_type': 'fill_in_blank',
                        'code_block': (
                            "# Bir üst dizine git\n"
                            "___ .."
                        ),
                        'word_bank': {
                            'words': [
                                'cd',
                                'ls',
                                'pwd',
                                'mv',
                                'cp',
                            ],
                        },
                        'correct_answer': 'cd',
                        'hint': 'cd = change directory.',
                        'explanation': 'cd (change directory) komutunun sözdizimi: cd [dizin]. cd .. bir üst dizine gider. cd ~ home dizinine gider.',
                        'order': 3,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': "Linux'ta aşağıdaki komutların hangisi dosya/dizini siler? (Birden fazla seçin)",
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'rm dosya.txt',
                                'rm -rf dizin/',
                                'rmdir bos_dizin',
                                'delete dosya',
                                'unlink dosya',
                            ],
                        },
                        'correct_answer': 'rm dosya.txt,rm -rf dizin/,rmdir bos_dizin,unlink dosya',
                        'hint': 'delete geçerli bir Linux komutu değil.',
                        'explanation': 'rm dosya siler, rm -rf dizin ve içeriğini siler, rmdir boş dizin siler, unlink dosya bağlantısını kaldırır.',
                        'order': 4,
                    },
                    {
                        'question_text': "Linux'ta root kullanıcısının home dizini hangisidir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '/home/root',
                                '/root',
                                '/usr/root',
                                '/admin',
                            ],
                        },
                        'correct_answer': '/root',
                        'hint': 'Normal kullanıcılar /home/kullanici, root özeldir.',
                        'explanation': "root kullanıcısının home dizini /root'tur. Normal kullanıcılar /home/kullaniciadi dizinini kullanır.",
                        'order': 5,
                    },
                    {
                        'question_text': 'grep komutu ne için kullanılır?',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                "Doğru; grep dosyalarda veya komut çıktısında metin arar: grep 'kelime' dosya.txt",
                                'Yanlış; grep dosya kopyalamak için kullanılır.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'grep = global regular expression print.',
                        'explanation': "grep metin arama aracıdır. grep 'hata' log.txt → log.txt içinde 'hata' geçen satırları gösterir.",
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki komutta hata nerede?\n"
                            "\n"
                            "# /tmp dizinindeki tüm .log dosyalarını sil\n"
                            "rm /tmp/*.txt"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "# /tmp dizinindeki tüm .log dosyalarını sil\n"
                            "rm /tmp/*.txt"
                        ),
                        'correct_answer': '1|rm /tmp/*.log',
                        'correct_line_index': 1,
                        'options': {
                            'fix_options': [
                                'rm /tmp/*.log',
                                'rm -f /tmp/*.log',
                            ],
                        },
                        'hint': 'Yorum .log diyor ama komut .txt siliyor.',
                        'explanation': "Yorum 'tüm .log dosyalarını sil' diyor ama rm /tmp/*.txt .txt dosyalarını siler. *.log olmalı.",
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'Dosya Sistemi ve İzinler',
                'lesson_type': 'quiz',
                'order': 2,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': "Linux'ta r, w, x izinleri ne anlama gelir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'read/write/execute',
                                'run/write/exit',
                                'read/work/exec',
                                'root/write/extra',
                            ],
                        },
                        'correct_answer': 'read/write/execute',
                        'hint': 'İngilizce okuma/yazma/çalıştırma.',
                        'explanation': 'r=read(okuma), w=write(yazma), x=execute(çalıştırma). Sayısal: r=4, w=2, x=1.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'chown komutu ne yapar?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Dosya izinlerini değiştirir',
                                'Dosya sahibini değiştirir',
                                'Dosyayı şifreler',
                                'Dosyayı kopyalar',
                            ],
                        },
                        'correct_answer': 'Dosya sahibini değiştirir',
                        'hint': 'ch=change, own=owner.',
                        'explanation': 'chown (change owner) dosyanın sahibini değiştirir. chmod izinleri, chown sahibi değiştirir.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'chmod 644 dosya.txt komutunda dosya sahipliği nasıldır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Sahip: rw-, Grup: r--, Diğer: r--',
                                'Herkes rw-',
                                'Sadece sahip okur',
                                'Sahip rwx, diğerleri ---',
                            ],
                        },
                        'correct_answer': 'Sahip: rw-, Grup: r--, Diğer: r--',
                        'hint': '6=rw(4+2), 4=r(4).',
                        'explanation': '644: 6=rw-(4+2+0), 4=r--(4+0+0), 4=r--(4+0+0). Sahip okur/yazar, diğerleri sadece okur.',
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': "Linux'ta sembolik link oluşturmak için:",
                        'question_type': 'fill_in_blank',
                        'code_block': '___ -s /gercek/dosya /link/yolu',
                        'word_bank': {
                            'words': [
                                'ln',
                                'link',
                                'cp',
                                'mv',
                                'touch',
                            ],
                        },
                        'correct_answer': 'ln',
                        'hint': 'ln = link. -s = symbolic.',
                        'explanation': 'ln -s kaynak hedef → sembolik link oluşturur. ln (sansız -s) hard link oluşturur.',
                        'order': 2,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'Linux dosya sisteminde /etc dizini ne içerir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Kullanıcı dosyaları',
                                'Sistem yapılandırma dosyaları',
                                'Geçici dosyalar',
                                'Binary programlar',
                            ],
                        },
                        'correct_answer': 'Sistem yapılandırma dosyaları',
                        'hint': '/etc = et cetera. Sistem ayarları burada.',
                        'explanation': '/etc sistem geneli yapılandırma dosyalarını içerir. /tmp geçici, /usr programlar, /home kullanıcı dizinleri.',
                        'order': 3,
                    },
                    {
                        'question_text': 'Linux dizin yapısını doğru hiyerarşik sıraya koyun (en üstten):',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                '/ (root)',
                                '/home',
                                '/home/kullanici',
                                '/home/kullanici/belgeler',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': '/ en üstte, her şey onun altında.',
                        'explanation': 'Linux dosya sistemi ağaç yapısı: / (kök) → /home → /home/kullanici → belgeler...',
                        'order': 4,
                    },
                    {
                        'question_text': 'sudo komutu ne işe yarar?',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğru; sudo geçici olarak root yetkisiyle komut çalıştırır.',
                                'Yanlış; sudo sadece dosya kopyalama için kullanılır.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'sudo = super user do.',
                        'explanation': 'sudo (super user do) komutu root yetkisiyle çalıştırır. /etc/sudoers dosyasında kimin kullanabileceği tanımlıdır.',
                        'order': 5,
                    },
                    {
                        'question_text': 'Aşağıdaki Linux komutlarından hangileri dosya kopyalamak için kullanılır? (Birden fazla seçin)',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'cp dosya.txt yedek.txt',
                                'mv dosya.txt yedek.txt',
                                'rsync dosya.txt yedek.txt',
                                'cat dosya.txt > yedek.txt',
                            ],
                        },
                        'correct_answer': 'cp dosya.txt yedek.txt,rsync dosya.txt yedek.txt,cat dosya.txt > yedek.txt',
                        'hint': 'mv taşır (kopyalamaz). Diğerleri kopyalar.',
                        'explanation': 'cp direkt kopyalar, rsync gelişmiş kopyalama, cat > yönlendirme ile kopyalar. mv taşır (orijinali siler).',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki komutta hata nerede?\n"
                            "\n"
                            "# Tüm kullanıcılara execute izni ver\n"
                            "chmod a-x script.sh"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "# Tüm kullanıcılara execute izni ver\n"
                            "chmod a-x script.sh"
                        ),
                        'correct_answer': '1|chmod a+x script.sh',
                        'correct_line_index': 1,
                        'options': {
                            'fix_options': [
                                'chmod a+x script.sh',
                                'chmod +x script.sh',
                            ],
                        },
                        'hint': '+ ekle, - kaldır.',
                        'explanation': "a-x execute iznini kaldırır. 'vermek' için a+x (all+execute) kullanılmalı.",
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'Bash Scripting',
                'lesson_type': 'quiz',
                'order': 3,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': "Bash'te if ifadesinin doğru sözdizimi hangisidir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'if [ $x -gt 5 ]',
                                'if ($x > 5)',
                                'if $x > 5:',
                                'if {$x > 5}',
                            ],
                        },
                        'correct_answer': 'if [ $x -gt 5 ]',
                        'hint': "Bash'te köşeli parantez ve -gt (greater than) kullanılır.",
                        'explanation': 'Bash koşul: [ ] veya [[ ]] kullanır. -gt (greater than), -lt (less than), -eq (equal), -ne (not equal).',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': '#!/bin/bash satırı (shebang) ne işe yarar?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Yorum satırıdır',
                                "Script'i çalıştıracak interpreter'ı belirtir",
                                'Bash versiyonunu gösterir',
                                "Script'i root olarak çalıştırır",
                            ],
                        },
                        'correct_answer': "Script'i çalıştıracak interpreter'ı belirtir",
                        'hint': '#! = shebang. Hangi program çalıştıracak?',
                        'explanation': "Shebang (#!) hangi interpreter'ın kullanılacağını belirtir. #!/bin/bash → bash ile çalıştır.",
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'Bash script oluşturup çalıştırma adımlarını doğru sıraya koyun:',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'nano script.sh ile dosyayı oluştur',
                                '#!/bin/bash ekle ve kodu yaz',
                                'chmod +x script.sh ile çalıştırılabilir yap',
                                './script.sh ile çalıştır',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': 'Oluştur → yaz → izin ver → çalıştır.',
                        'explanation': 'Script oluşturma akışı: editörle oluştur → shebang ve kodu yaz → +x izni ver → ./ile çalıştır.',
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': (
                            "Boşluğu doldurun:\n"
                            "#!/bin/bash\n"
                            "AD=___\n"
                            "echo \"Merhaba $AD\""
                        ),
                        'question_type': 'fill_in_blank',
                        'code_block': (
                            "#!/bin/bash\n"
                            "AD=___\n"
                            "echo \"Merhaba $AD\""
                        ),
                        'word_bank': {
                            'words': [
                                '"Dünya"',
                                '$Dünya',
                                '"$Dünya"',
                                'Dünya',
                                "'Dünya'",
                            ],
                        },
                        'correct_answer': '"Dünya"',
                        'hint': 'String değerler tırnak içinde yazılır.',
                        'explanation': 'AD="Dünya" değişken ataması. $AD değişkene erişim. Bash\'te = iki yanında boşluk olmamalı.',
                        'order': 2,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': "Bash'te for döngüsünün doğru sözdizimi hangisidir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'for i in 1 2 3; do echo $i; done',
                                'for(i=1; i<=3; i++) echo $i',
                                'foreach i in [1,2,3]: echo $i',
                                'loop i from 1 to 3: echo $i',
                            ],
                        },
                        'correct_answer': 'for i in 1 2 3; do echo $i; done',
                        'hint': 'Bash sözdizimi do...done kullanır.',
                        'explanation': "Bash for: for i in liste; do komutlar; done. Python'dan farklı sözdizimi var.",
                        'order': 3,
                    },
                    {
                        'question_text': "Bash'te $? ne anlama gelir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Rastgele sayı',
                                'Son çalışan komutun çıkış kodu',
                                'Process ID',
                                'Kullanıcı ID',
                            ],
                        },
                        'correct_answer': 'Son çalışan komutun çıkış kodu',
                        'hint': '$? = exit status.',
                        'explanation': "$? son komutun exit code'unu döndürür. 0 = başarı, 0 dışı = hata. if [ $? -eq 0 ] ile kontrol edilir.",
                        'order': 4,
                    },
                    {
                        'question_text': "Bash'te $0, $1, $2 ne anlama gelir?",
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğru; $0 script adı, $1 ilk argüman, $2 ikinci argüman vb.',
                                'Yanlış; bunlar ortam değişkenleridir.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': './script.sh arg1 arg2 → $0=script.sh, $1=arg1.',
                        'explanation': '$0 script adı, $1-$9 pozisyonel parametreler (argümanlar), $# argüman sayısı, $@ tüm argümanlar.',
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki Bash script'inde hata nerede?\n"
                            "\n"
                            "#!/bin/bash\n"
                            "SAYI = 10\n"
                            "echo $SAYI"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "#!/bin/bash\n"
                            "SAYI = 10\n"
                            "echo $SAYI"
                        ),
                        'correct_answer': '1|SAYI=10',
                        'correct_line_index': 1,
                        'options': {
                            'fix_options': [
                                'SAYI=10',
                                'SAYI=$(echo 10)',
                            ],
                        },
                        'hint': "Bash'te değişken atamada boşluk olmaz.",
                        'explanation': "SAYI = 10 Bash'te geçersiz. Bash'te = etrafında boşluk OLMAMALI: SAYI=10",
                        'order': 6,
                    },
                    {
                        'question_text': "Bash'te komut çıktısını değişkene atamak için hangi sözdizimi kullanılır? (Birden fazla seçin)",
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'TARIH=$(date)',
                                'TARIH=`date`',
                                'TARIH = date',
                                '$TARIH = date',
                                'set TARIH date',
                            ],
                        },
                        'correct_answer': 'TARIH=$(date),TARIH=`date`',
                        'hint': '$() ve backtick `` komut ikamesi (command substitution) yapır.',
                        'explanation': '$() modern ve tercih edilen yol. Backtick `` eski yol ama çalışır. İkisi de command substitution yapar.',
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'Git Temelleri',
                'lesson_type': 'quiz',
                'order': 4,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'git init ne yapar?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                "Uzak repo'ya bağlanır",
                                'Yeni bir local Git deposu oluşturur',
                                'Branch oluşturur',
                                "İlk commit'i yapar",
                            ],
                        },
                        'correct_answer': 'Yeni bir local Git deposu oluşturur',
                        'hint': 'init = initialize.',
                        'explanation': 'git init mevcut dizinde .git klasörü oluşturarak Git deposu başlatır.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'git add . komutu ne yapar?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Tüm değişiklikleri commit eder',
                                "Tüm değişiklikleri staging area'ya ekler",
                                'Yeni dosya oluşturur',
                                "Remote'a push eder",
                            ],
                        },
                        'correct_answer': "Tüm değişiklikleri staging area'ya ekler",
                        'hint': '. = mevcut dizindeki her şey. Commit değil, hazırlama.',
                        'explanation': "git add . tüm değiştirilmiş/yeni dosyaları staging area'ya (index) ekler. Commit için hazırlama aşamasıdır.",
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'İlk kez Git kullanımının adımlarını doğru sıraya koyun:',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'git init',
                                'Dosyaları oluştur/değiştir',
                                'git add .',
                                "git commit -m 'ilk commit'",
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': 'Init → değişiklik → staging → commit.',
                        'explanation': 'Git iş akışı: init → değişiklik yap → add ile stage et → commit ile kaydet.',
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'git status komutu ne gösterir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Commit geçmişi',
                                'Staged, unstaged ve untracked dosyalar',
                                'Remote repo bilgisi',
                                'Branch listesi',
                            ],
                        },
                        'correct_answer': 'Staged, unstaged ve untracked dosyalar',
                        'hint': 'Mevcut durumu gösterir.',
                        'explanation': 'git status: hangi dosyaların staged, unstaged veya untracked olduğunu gösterir.',
                        'order': 2,
                    },
                    {
                        'question_text': (
                            "git commit için boşluğu doldurun:\n"
                            "git commit ___ \"feat: yeni özellik eklendi\""
                        ),
                        'question_type': 'fill_in_blank',
                        'code_block': 'git commit ___ "feat: yeni özellik eklendi"',
                        'word_bank': {
                            'words': [
                                '-m',
                                '-a',
                                '--message',
                                '-msg',
                                '-text',
                            ],
                        },
                        'correct_answer': '-m',
                        'hint': '-m = message.',
                        'explanation': "git commit -m 'mesaj' commit mesajını satır içinde belirtir. -m = --message.",
                        'order': 3,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': "Git'te üç alan (area) hangilerdir?",
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'Working Directory',
                                'Staging Area (Index)',
                                'Repository (.git)',
                                'Remote',
                                'Cache',
                            ],
                        },
                        'correct_answer': 'Working Directory,Staging Area (Index),Repository (.git)',
                        'hint': 'Çalışma alanı → hazırlama → depo.',
                        'explanation': "Git'in 3 alanı: Working Directory (değişiklikler), Staging Area (commit için hazır), Repository (commit'ler).",
                        'order': 4,
                    },
                    {
                        'question_text': "git pull = git fetch + git merge'dir.",
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğru; git pull uzaktan değişiklikleri çekip mevcut branch ile birleştirir.',
                                'Yanlış; git pull sadece değişiklikleri indirir, birleştirmez.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'pull = fetch + merge.',
                        'explanation': 'git fetch değişiklikleri indirir (merge etmez). git pull = fetch + merge (veya rebase). git pull origin main.',
                        'order': 5,
                    },
                    {
                        'question_text': 'Aşağıdaki Git komutlarından hangileri commit geçmişini görüntüler? (Birden fazla seçin)',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'git log',
                                'git log --oneline',
                                'git history',
                                'git show',
                                'git status',
                            ],
                        },
                        'correct_answer': 'git log,git log --oneline',
                        'hint': 'log geçmişi gösterir. git history ve git status farklı amaçlı.',
                        'explanation': 'git log commit geçmişi, git log --oneline kısa format. git show belirli commit detayı. git history geçersiz komut.',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki Git komutunda hata nerede?\n"
                            "\n"
                            "git commit \"İlk değişiklikler\""
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': 'git commit "İlk değişiklikler"',
                        'correct_answer': '0|git commit -m "İlk değişiklikler"',
                        'correct_line_index': 0,
                        'options': {
                            'fix_options': [
                                'git commit -m "İlk değişiklikler"',
                                'git commit --message "İlk değişiklikler"',
                            ],
                        },
                        'hint': '-m bayrağı eksik.',
                        'explanation': 'git commit sadece mesaj alınca -m bayrağı gerekli. Bayrak olmadan editör açar veya hata verir.',
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'Git Dallanma ve Birleştirme',
                'lesson_type': 'quiz',
                'order': 5,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': 'git checkout -b yeni-branch ne yapar?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Sadece branch oluşturur',
                                'Hem branch oluşturur hem geçer',
                                'Branch siler',
                                "Remote branch'e bağlanır",
                            ],
                        },
                        'correct_answer': 'Hem branch oluşturur hem geçer',
                        'hint': '-b = branch oluştur. checkout = geç.',
                        'explanation': "git checkout -b isim → yeni branch oluşturur ve o branch'e geçer. git branch isim sadece oluşturur.",
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'git merge feature-branch ne yapar?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                "feature-branch'i siler",
                                "Mevcut branch'e feature-branch'i birleştirir",
                                "feature-branch'e geçer",
                                "Remote'a push eder",
                            ],
                        },
                        'correct_answer': "Mevcut branch'e feature-branch'i birleştirir",
                        'hint': "merge = birleştirme. Önce hedef branch'e geç.",
                        'explanation': "Önce main'e geç (git checkout main), sonra git merge feature-branch → feature'ı main ile birleştirir.",
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'Feature branch iş akışını doğru sıraya koyun:',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'git checkout -b feature/yeni-ozellik',
                                'Kodu geliştir ve commit yap',
                                'git checkout main',
                                'git merge feature/yeni-ozellik',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': "Branch oluştur → geliştir → main'e dön → merge et.",
                        'explanation': "Feature branch workflow: dal → geliştir → main'e dön → birleştir (→ dal'ı sil).",
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'git rebase ve git merge arasındaki fark nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Fark yoktur',
                                "rebase commit geçmişini düzelterek lineer tutar, merge birleştirme commit'i oluşturur",
                                'rebase uzak repo için, merge local için',
                                'rebase daha yavaştır',
                            ],
                        },
                        'correct_answer': "rebase commit geçmişini düzelterek lineer tutar, merge birleştirme commit'i oluşturur",
                        'hint': 'rebase = tabanı yenile.',
                        'explanation': "rebase commit geçmişini temiz ve lineer tutar. merge birleştirme commit'i oluşturur. Public branch'lerde rebase tehlikeli.",
                        'order': 2,
                    },
                    {
                        'question_text': 'git stash komutu ne işe yarar?',
                        'question_type': 'fill_in_blank',
                        'code_block': (
                            "# Commit hazır olmayan değişiklikleri geçici sakla\n"
                            "git ___\n"
                            "\n"
                            "# Saklananları geri al\n"
                            "git ___ pop"
                        ),
                        'word_bank': {
                            'words': [
                                'stash',
                                'save',
                                'hide',
                                'temp',
                                'cache',
                            ],
                        },
                        'correct_answer': 'stash',
                        'hint': 'stash = gizli yer, geçici saklama.',
                        'explanation': 'git stash değişiklikleri geçici saklar (working directory temizlenir). git stash pop geri getirir.',
                        'order': 3,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'Merge conflict nedir?',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğru; iki branch aynı dosyanın aynı satırını farklı şekilde değiştirince Git otomatik birleştiremez.',
                                'Yanlış; merge conflict hiç oluşmaz, Git her zaman otomatik çözer.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'Çakışma durumu.',
                        'explanation': 'Merge conflict: aynı satır farklı değiştirilince Git <<< === >>> işaretleriyle çakışmayı gösterir, manuel çözüm gerekir.',
                        'order': 4,
                    },
                    {
                        'question_text': 'Aşağıdaki Git komutlarından hangileri branch yönetimi için kullanılır? (Birden fazla seçin)',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'git branch -a',
                                'git branch -d branch-adi',
                                'git checkout branch-adi',
                                'git switch branch-adi',
                                'git log branch-adi',
                            ],
                        },
                        'correct_answer': 'git branch -a,git branch -d branch-adi,git checkout branch-adi,git switch branch-adi',
                        'hint': 'git log geçmişi görür, branch yönetimi değil.',
                        'explanation': "branch -a: tüm branch'leri listele, branch -d: sil, checkout/switch: geç. git log geçmiş için.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki komutta hata nerede?\n"
                            "\n"
                            "# feature branch'i main ile birleştir\n"
                            "git merge main\n"
                            "# (feature branch üzerindeyken)"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "# feature branch'i main ile birleştir\n"
                            "git merge main\n"
                            "# (feature branch üzerindeyken)"
                        ),
                        'correct_answer': '1|git checkout main && git merge feature',
                        'correct_line_index': 1,
                        'options': {
                            'fix_options': [
                                'git checkout main && git merge feature',
                                'git rebase main',
                            ],
                        },
                        'hint': "Merge yönü önemli. Feature'ı main'e merge etmek için nerede olmalıyız?",
                        'explanation': "Feature'ı main'e merge etmek için önce main'e geçmeli: git checkout main → git merge feature-branch.",
                        'order': 6,
                    },
                    {
                        'question_text': 'git cherry-pick ne yapar?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                "Tüm branch'i kopyalar",
                                "Belirli bir commit'i mevcut branch'e uygular",
                                'Commit mesajını değiştirir',
                                "Branch'i siler",
                            ],
                        },
                        'correct_answer': "Belirli bir commit'i mevcut branch'e uygular",
                        'hint': 'Cherry-pick = kirazları tek tek seç.',
                        'explanation': "git cherry-pick <commit-hash> belirli bir commit'i seçip mevcut branch'e uygular. Tüm branch değil, tek commit.",
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'Docker Temelleri',
                'lesson_type': 'quiz',
                'order': 6,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': 'Docker container ve VM (sanal makine) arasındaki fark nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Fark yoktur',
                                'Container OS kernel paylaşır, VM tam OS çalıştırır',
                                'VM daha hafiftir',
                                'Container daha güvenlidir',
                            ],
                        },
                        'correct_answer': 'Container OS kernel paylaşır, VM tam OS çalıştırır',
                        'hint': 'Container = process izolasyonu, VM = tam sanallaştırma.',
                        'explanation': "Container host OS kernel'ini paylaşır (hafif, hızlı). VM tam işletim sistemi çalıştırır (ağır ama tam izolasyon).",
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': "Dockerfile'da COPY ve ADD arasındaki fark nedir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Fark yoktur',
                                "ADD URL'den indirme ve tar çıkarma yapabilir, COPY sadece yerel kopyalar",
                                'COPY daha yavaştır',
                                'ADD sadece binary dosyalar için',
                            ],
                        },
                        'correct_answer': "ADD URL'den indirme ve tar çıkarma yapabilir, COPY sadece yerel kopyalar",
                        'hint': 'ADD daha güçlü ama COPY tercih edilir.',
                        'explanation': "COPY sadece yerel dosyaları kopyalar. ADD URL'den indirebilir ve tar.gz çıkarabilir. Basit kullanımda COPY tercih edilir.",
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'Temel Docker iş akışını doğru sıraya koyun:',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'Dockerfile yaz',
                                'docker build ile image oluştur',
                                'docker run ile container başlat',
                                'docker ps ile kontrol et',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': 'Dockerfile → build → run → kontrol.',
                        'explanation': 'Docker workflow: Dockerfile yaz → image build et → container çalıştır → durumunu kontrol et.',
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': (
                            "Boşluğu doldurun (basit Dockerfile):\n"
                            "___ node:18\n"
                            "___ /app\n"
                            "___ package*.json ./\n"
                            "RUN npm install\n"
                            "___ .\n"
                            "CMD [\"node\", \"app.js\"]"
                        ),
                        'question_type': 'fill_in_blank',
                        'code_block': (
                            "___ node:18\n"
                            "WORKDIR /app\n"
                            "COPY package*.json ./\n"
                            "RUN npm install\n"
                            "COPY . .\n"
                            "CMD [\"node\", \"app.js\"]"
                        ),
                        'word_bank': {
                            'words': [
                                'FROM',
                                'BASE',
                                'USE',
                                'IMAGE',
                                'IMPORT',
                            ],
                        },
                        'correct_answer': 'FROM',
                        'hint': "Dockerfile'ın ilk satırında temel image belirlenir.",
                        'explanation': "FROM temel image'ı belirtir. FROM node:18 → Node.js 18 imajını kullan.",
                        'order': 2,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'docker run -d -p 8080:80 nginx komutunda -d ve -p ne anlama gelir?',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                '-d: arka planda çalıştır (detached)',
                                '-p: host:container port eşlemesi',
                                '-d: debug modu',
                                '-p: proje adı belirt',
                            ],
                        },
                        'correct_answer': '-d: arka planda çalıştır (detached),-p: host:container port eşlemesi',
                        'hint': 'd=detach, p=port.',
                        'explanation': "-d container'ı arka planda çalıştırır. -p 8080:80 host'un 8080 portunu container'ın 80'ine bağlar.",
                        'order': 3,
                    },
                    {
                        'question_text': 'Docker image ve Docker container arasındaki fark nedir?',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                "Doğru; image şablon (blueprint), container image'ın çalışan örneğidir.",
                                'Yanlış; image ve container aynı şeydir.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'Image = sınıf tanımı, container = nesne örneği (OOP analoji).',
                        'explanation': "Image: değiştirilemez şablon. Container: image'dan oluşturulan çalışan process. 1 image'dan N container oluşturulabilir.",
                        'order': 4,
                    },
                    {
                        'question_text': "Çalışan tüm container'ları durdurmak için:",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'docker stop all',
                                'docker stop $(docker ps -q)',
                                'docker kill --all',
                                'docker rm -f all',
                            ],
                        },
                        'correct_answer': 'docker stop $(docker ps -q)',
                        'hint': "docker ps -q çalışan container ID'lerini verir.",
                        'explanation': "docker ps -q sadece ID'leri döndürür. docker stop $(docker ps -q) tümünü durdurur.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki Dockerfile'da hata nerede?\n"
                            "\n"
                            "FROM python:3.11\n"
                            "WORKDIR app\n"
                            "COPY . .\n"
                            "RUN pip install -r requirements.txt\n"
                            "CMD python app.py"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "FROM python:3.11\n"
                            "WORKDIR app\n"
                            "COPY . .\n"
                            "RUN pip install -r requirements.txt\n"
                            "CMD python app.py"
                        ),
                        'correct_answer': '1|WORKDIR /app',
                        'correct_line_index': 1,
                        'options': {
                            'fix_options': [
                                'WORKDIR /app',
                                'WORKDIR /usr/src/app',
                            ],
                        },
                        'hint': "WORKDIR'de mutlak yol kullanılmalı.",
                        'explanation': "WORKDIR mutlak yol almalı: /app. 'app' göreli yoldur ve kötü pratiktir. /app tercih edilir.",
                        'order': 6,
                    },
                    {
                        'question_text': 'Docker volume ne için kullanılır? (Birden fazla seçin)',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'Container silinse bile veriyi sakla',
                                "Container'lar arası veri paylaşımı",
                                'Container ağını yapılandır',
                                "Geliştirme sırasında kodu container'a bağla",
                            ],
                        },
                        'correct_answer': "Container silinse bile veriyi sakla,Container'lar arası veri paylaşımı,Geliştirme sırasında kodu container'a bağla",
                        'hint': 'Volume = kalıcı depolama.',
                        'explanation': "Volume: 1) veri kalıcılığı, 2) container'lar arası paylaşım, 3) dev mode'da bind mount. Ağ yapılandırması için değil.",
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'Docker Compose',
                'lesson_type': 'quiz',
                'order': 7,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': 'Docker Compose ne işe yarar?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Tek container yönetir',
                                'Çoklu container uygulamaları tanımlar ve yönetir',
                                'Docker image oluşturur',
                                'Kubernetes alternatifidir',
                            ],
                        },
                        'correct_answer': 'Çoklu container uygulamaları tanımlar ve yönetir',
                        'hint': 'Compose = birleştir.',
                        'explanation': 'Docker Compose docker-compose.yml ile çoklu servisleri (web, db, cache) tanımlar ve tek komutla yönetir.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': "docker-compose.yml'de 'depends_on' ne anlama gelir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Servis bağımlılığını belirtir (başlama sırası)',
                                'Docker versiyonunu belirtir',
                                "Volume'ları tanımlar",
                                'Port eşlemesini yapar',
                            ],
                        },
                        'correct_answer': 'Servis bağımlılığını belirtir (başlama sırası)',
                        'hint': "depends_on = 'önce bunu başlat'.",
                        'explanation': 'depends_on servis başlama sırasını belirtir. web: depends_on: [db] → db başlamadan web başlamaz.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'Docker Compose komutlarını doğru sıraya koyun (başlatmadan durmaya):',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'docker compose up -d',
                                'Uygulama çalışıyor...',
                                'docker compose logs -f',
                                'docker compose down',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': 'Başlat → çalış → logları izle → durdur.',
                        'explanation': "up -d arka planda başlatır, logs -f logları takip eder, down container ve network'ü durdurur.",
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': (
                            "Boşluğu doldurun:\n"
                            "services:\n"
                            "  web:\n"
                            "    image: nginx\n"
                            "    ___:\n"
                            "      - \"80:80\""
                        ),
                        'question_type': 'fill_in_blank',
                        'code_block': (
                            "services:\n"
                            "  web:\n"
                            "    image: nginx\n"
                            "    ___:\n"
                            "      - \"80:80\""
                        ),
                        'word_bank': {
                            'words': [
                                'ports',
                                'expose',
                                'network',
                                'links',
                                'volumes',
                            ],
                        },
                        'correct_answer': 'ports',
                        'hint': 'Port eşlemesi için kullanılan YAML anahtarı.',
                        'explanation': "ports: host:container port eşlemesi. expose: sadece container içinde açar, host'a kapalı.",
                        'order': 2,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'docker compose up --build ne zaman kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Her seferinde',
                                "Dockerfile değiştiğinde image'ı yeniden oluşturmak için",
                                'Sadece ilk kurulumda',
                                'Container durdurmak için',
                            ],
                        },
                        'correct_answer': "Dockerfile değiştiğinde image'ı yeniden oluşturmak için",
                        'hint': '--build = rebuild before starting.',
                        'explanation': "docker compose up --build Dockerfile'daki değişiklikleri yansıtmak için image'ı yeniden build eder.",
                        'order': 3,
                    },
                    {
                        'question_text': 'docker compose down ve docker compose stop arasındaki fark nedir?',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                "Doğru; stop sadece container'ları durdurur, down container ve ağları kaldırır.",
                                'Yanlış; ikisi de aynı şeyi yapar.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'down daha kapsamlı temizleme yapar.',
                        'explanation': "stop container'ları durdurur (siler değil). down container'ları, ağları kaldırır. down -v volume'ları da siler.",
                        'order': 4,
                    },
                    {
                        'question_text': "docker-compose.yml'de hangi alanlar zorunludur? (Birden fazla seçin)",
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'version',
                                'services',
                                'networks',
                                'volumes',
                                'Her alan opsiyoneldir',
                            ],
                        },
                        'correct_answer': 'services',
                        'hint': 'En az bir servis tanımı gerekli.',
                        'explanation': 'services zorunludur. version artık opsiyonel (Compose v2+). networks ve volumes ihtiyaca göre eklenir.',
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki docker-compose.yml'de hata nerede?\n"
                            "\n"
                            "services:\n"
                            "  db:\n"
                            "    image: postgres\n"
                            "  web:\n"
                            "    build: .\n"
                            "    ports:\n"
                            "      - 3000:3000\n"
                            "    depends_on:\n"
                            "      - redis"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "services:\n"
                            "  db:\n"
                            "    image: postgres\n"
                            "  web:\n"
                            "    build: .\n"
                            "    ports:\n"
                            "      - 3000:3000\n"
                            "    depends_on:\n"
                            "      - redis"
                        ),
                        'correct_answer': '8|      - db',
                        'correct_line_index': 8,
                        'options': {
                            'fix_options': [
                                '      - db',
                                (
                                    "      - db\n"
                                    "      - redis"
                                ),
                            ],
                        },
                        'hint': "web, redis'e depends_on yapıyor ama redis tanımlı mı?",
                        'explanation': 'web → redis depends_on var ama redis servisi tanımlı değil. Ya redis servisi eklenmeli ya depends_on düzeltilmeli.',
                        'order': 6,
                    },
                    {
                        'question_text': "Docker network'te container'lar nasıl birbirini bulur?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'IP adresiyle',
                                'Servis adıyla (hostname olarak)',
                                'Container ID ile',
                                'Port numarasıyla',
                            ],
                        },
                        'correct_answer': 'Servis adıyla (hostname olarak)',
                        'hint': "compose ağında servis adı DNS hostname'i olur.",
                        'explanation': "Docker Compose aynı ağdaki container'lar servis adını hostname olarak kullanır. web → db:5432 gibi.",
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'CI/CD ve GitHub Actions',
                'lesson_type': 'quiz',
                'order': 8,
                'xp_reward': 30,
                'questions': [
                    {
                        'question_text': "CI/CD'nin açılımı nedir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Code Integration/Code Deploy',
                                'Continuous Integration/Continuous Delivery',
                                'Container Infrastructure/Container Deployment',
                                'Core Integration/Core Deployment',
                            ],
                        },
                        'correct_answer': 'Continuous Integration/Continuous Delivery',
                        'hint': 'CI = sürekli entegrasyon, CD = sürekli dağıtım.',
                        'explanation': 'CI: kodu sık sık entegre et ve otomatik test et. CD: test geçen kodu otomatik deploy et.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': "GitHub Actions workflow'u tetikleyen olay nasıl tanımlanır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'trigger:',
                                'on:',
                                'when:',
                                'event:',
                            ],
                        },
                        'correct_answer': 'on:',
                        'hint': 'YAML anahtar kelimesi.',
                        'explanation': "GitHub Actions'da on: olayları tanımlar. on: push, pull_request, schedule gibi.",
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'CI pipeline adımlarını doğru sıraya koyun:',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'Kod push edilir',
                                'Testler çalıştırılır',
                                'Build yapılır',
                                'Deploy edilir',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': 'Push → test → build → deploy.',
                        'explanation': 'CI/CD akışı: kod push → otomatik test → başarılı build → otomatik deploy.',
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': (
                            "GitHub Actions'da boşluğu doldurun:\n"
                            "jobs:\n"
                            "  test:\n"
                            "    runs-on: ___\n"
                            "    steps:\n"
                            "      - uses: actions/checkout@v3"
                        ),
                        'question_type': 'fill_in_blank',
                        'code_block': (
                            "jobs:\n"
                            "  test:\n"
                            "    runs-on: ___\n"
                            "    steps:\n"
                            "      - uses: actions/checkout@v3"
                        ),
                        'word_bank': {
                            'words': [
                                'ubuntu-latest',
                                'linux',
                                'github-runner',
                                'ubuntu',
                                'node',
                            ],
                        },
                        'correct_answer': 'ubuntu-latest',
                        'hint': 'GitHub hosted runner için en yaygın değer.',
                        'explanation': "runs-on: ubuntu-latest GitHub'ın sunduğu Ubuntu runner'ı kullanır. windows-latest, macos-latest de mevcuttur.",
                        'order': 2,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': "GitHub Actions'da secret nasıl kullanılır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Direkt .env dosyasından',
                                '${{ secrets.SECRET_ADI }} syntax ile',
                                "config.yml'den",
                                'Ortam değişkeni olarak .github/env',
                            ],
                        },
                        'correct_answer': '${{ secrets.SECRET_ADI }} syntax ile',
                        'hint': '${{ }} GitHub Actions ifade sözdizimi.',
                        'explanation': "Secrets Settings > Secrets'tan eklenir, workflow'da ${{ secrets.SECRET_ADI }} ile kullanılır.",
                        'order': 3,
                    },
                    {
                        'question_text': 'CI/CD ile manuel deployment arasındaki avantajlar nelerdir? (Birden fazla seçin)',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'Tutarlılık (her deploy aynı süreç)',
                                'İnsan hatası azaltır',
                                'Daha yavaş deployment',
                                'Otomatik test entegrasyonu',
                                'Rollback kolaylığı',
                            ],
                        },
                        'correct_answer': 'Tutarlılık (her deploy aynı süreç),İnsan hatası azaltır,Otomatik test entegrasyonu,Rollback kolaylığı',
                        'hint': 'CI/CD neden avantajlı? Hız değil kalite.',
                        'explanation': 'CI/CD avantajları: tutarlı süreç, az insan hatası, otomatik test, kolay rollback. Daha yavaş değil, daha güvenilir.',
                        'order': 4,
                    },
                    {
                        'question_text': "GitHub Actions'da bir önceki step başarısız olunca sonraki step hâlâ çalışabilir.",
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğru; if: always() veya if: failure() ile başarısız step sonrası da çalışabilir.',
                                'Yanlış; bir step başarısız olunca workflow tamamen durur.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'if: koşulu ile kontrol edilebilir.',
                        'explanation': 'Varsayılan davranış: hata olursa durur. Ama if: always() veya if: failure() ile kontrol edilebilir.',
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki GitHub Actions workflow'unda hata nerede?\n"
                            "\n"
                            "name: CI\n"
                            "on:\n"
                            "  push:\n"
                            "    branches: [main]\n"
                            "jobs:\n"
                            "  test:\n"
                            "    runs-on: ubuntu-latest\n"
                            "    steps:\n"
                            "      - run: npm test"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "name: CI\n"
                            "on:\n"
                            "  push:\n"
                            "    branches: [main]\n"
                            "jobs:\n"
                            "  test:\n"
                            "    runs-on: ubuntu-latest\n"
                            "    steps:\n"
                            "      - run: npm test"
                        ),
                        'correct_answer': (
                            "8|      - uses: actions/checkout@v3\n"
                            "      - run: npm test"
                        ),
                        'correct_line_index': 8,
                        'options': {
                            'fix_options': [
                                (
                                    "      - uses: actions/checkout@v3\n"
                                    "      - run: npm test"
                                ),
                                (
                                    "      - uses: actions/setup-node@v3\n"
                                    "      - run: npm test"
                                ),
                            ],
                        },
                        'hint': "npm test öncesinde kod repo'dan çekilmeli.",
                        'explanation': "actions/checkout@v3 eksik. Kod checkout edilmeden npm test çalıştırılamaz. Her workflow'un ilk adımı checkout olmalı.",
                        'order': 6,
                    },
                    {
                        'question_text': "GitHub Actions'da matrix strategy ne işe yarar?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Paralel job çalıştırma',
                                'Birden fazla OS veya versiyon kombinasyonu test etme',
                                'Secret yönetimi',
                                'Deployment ortamı seçme',
                            ],
                        },
                        'correct_answer': 'Birden fazla OS veya versiyon kombinasyonu test etme',
                        'hint': 'matrix = tablo/matris. Kombinasyonlar.',
                        'explanation': 'matrix strategy: node: [14, 16, 18] → her versiyon için ayrı job çalıştırır. OS/versiyon kombinasyonları test edilir.',
                        'order': 7,
                    },
                ],
            },
        ],
    },
    {
        'slug': 'cloud',
        'title': 'Cloud',
        'description': 'AWS bulut hizmetleri, cloud mimarisi ve best practices ile modern altyapı yönetimi.',
        'order': 3,
        'lessons': [
            {
                'title': 'Cloud Temelleri',
                'lesson_type': 'quiz',
                'order': 1,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': 'SaaS, PaaS, IaaS arasındaki fark nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'SaaS uygulamalar, PaaS platform, IaaS altyapı sunar',
                                'Hepsi aynıdır',
                                'SaaS en az, IaaS en çok kontrol sağlar',
                                'Sadece A ve C doğru',
                            ],
                        },
                        'correct_answer': 'Sadece A ve C doğru',
                        'hint': 'SaaS kullanmak için, PaaS geliştirmek için, IaaS altyapı için.',
                        'explanation': 'SaaS: hazır uygulama (Gmail). PaaS: geliştirme platformu (Heroku). IaaS: ham altyapı (EC2). IaaS en fazla kontrol.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': "AWS'de Region ve Availability Zone (AZ) arasındaki fark nedir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Aynı şeydir',
                                'Region coğrafi bölge, AZ o bölgedeki fiziksel veri merkezleri grubu',
                                'AZ daha büyük ölçektir',
                                'Region sadece Avrupa için',
                            ],
                        },
                        'correct_answer': 'Region coğrafi bölge, AZ o bölgedeki fiziksel veri merkezleri grubu',
                        'hint': 'us-east-1 region, us-east-1a AZ.',
                        'explanation': 'Region: coğrafi bölge (us-east-1, eu-west-1). AZ: aynı region içinde izole veri merkezleri (us-east-1a, 1b, 1c).',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'Cloud deployment modellerini kontrolden en azdan en çoğa doğru sırala:',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'Public Cloud',
                                'Community Cloud',
                                'Hybrid Cloud',
                                'Private Cloud',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': 'Public herkes paylaşır (az kontrol), Private sadece sizin (çok kontrol).',
                        'explanation': 'Kontrol az→çok: Public (AWS) → Community (sektör paylaşımlı) → Hybrid (karma) → Private (kendi veri merkezi).',
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': "AWS'de 'Pay-as-you-go' modeli ne anlama gelir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Aylık sabit ücret',
                                'Yıllık peşin ödeme',
                                'Kullandığın kadar öde',
                                'Ücretsiz kullanım',
                            ],
                        },
                        'correct_answer': 'Kullandığın kadar öde',
                        'hint': 'pay-as-you-go = kullandıkça öde.',
                        'explanation': "Cloud'un temel avantajı: kullandığın kadar öde. Başlangıç maliyeti yok, ölçeklendirme kolay.",
                        'order': 2,
                    },
                    {
                        'question_text': (
                            "Boşluğu doldurun:\n"
                            "Cloud'un temel özelliklerinden biri ___ (talep üzerine anında kaynak sağlama)."
                        ),
                        'question_type': 'fill_in_blank',
                        'code_block': "Cloud'un temel özelliklerinden biri ___ (talep üzerine anında kaynak sağlama).",
                        'word_bank': {
                            'words': [
                                'on-demand self-service',
                                'always-on',
                                'manual provisioning',
                                'fixed capacity',
                                'pay-later',
                            ],
                        },
                        'correct_answer': 'on-demand self-service',
                        'hint': 'NIST cloud tanımındaki 5 temel özellikten biri.',
                        'explanation': "NIST'in 5 cloud özelliği: on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service.",
                        'order': 3,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'CapEx ve OpEx arasındaki fark cloud bağlamında ne anlama gelir?',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğru; CapEx fiziksel donanım satın alma (geleneksel), OpEx bulut hizmetleri aboneliği (cloud).',
                                "Yanlış; cloud kullanımı her zaman CapEx'tir.",
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'Capital Expenditure vs Operational Expenditure.',
                        'explanation': 'Geleneksel IT: CapEx (sunucu satın al). Cloud: OpEx (aylık fatura). Cloud OpEx modelini benimser.',
                        'order': 4,
                    },
                    {
                        'question_text': "AWS'nin temel servis kategorileri hangileridir? (Birden fazla seçin)",
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'Compute (EC2, Lambda)',
                                'Storage (S3, EBS)',
                                'Database (RDS, DynamoDB)',
                                'Networking (VPC, Route53)',
                                'Social Media',
                            ],
                        },
                        'correct_answer': 'Compute (EC2, Lambda),Storage (S3, EBS),Database (RDS, DynamoDB),Networking (VPC, Route53)',
                        'hint': "Social media AWS'nin servisi değil.",
                        'explanation': 'AWS ana kategoriler: Compute, Storage, Database, Networking, Security, AI/ML, Analytics ve daha fazlası.',
                        'order': 5,
                    },
                    {
                        'question_text': "Shared Responsibility Model'de AWS'nin sorumluluğu nedir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Sadece veri güvenliği',
                                'Fiziksel altyapı, hypervisor, ağ güvenliği',
                                'Uygulama kodu güvenliği',
                                'IAM politikaları',
                            ],
                        },
                        'correct_answer': 'Fiziksel altyapı, hypervisor, ağ güvenliği',
                        'hint': "'Security OF the cloud' vs 'Security IN the cloud'.",
                        'explanation': "AWS: fiziksel güvenlik, hardware, network, hypervisor (cloud'un güvenliği). Müşteri: veri, IAM, uygulama (cloud içindeki güvenlik).",
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki cloud kavramlarında hata nerede?\n"
                            "\n"
                            "Elasticity = Talebe göre kaynak otomatik ölçeklenir\n"
                            "Scalability = Yalnızca küçülme (scale-down)\n"
                            "High Availability = Her zaman erişilebilir\n"
                            "Fault Tolerance = Hata anında bile çalışmaya devam eder"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "Elasticity = Talebe göre kaynak otomatik ölçeklenir\n"
                            "Scalability = Yalnızca küçülme (scale-down)\n"
                            "High Availability = Her zaman erişilebilir\n"
                            "Fault Tolerance = Hata anında bile çalışmaya devam eder"
                        ),
                        'correct_answer': '1|Scalability = Hem büyüme (scale-up/out) hem küçülme (scale-down/in)',
                        'correct_line_index': 1,
                        'options': {
                            'fix_options': [
                                'Scalability = Hem büyüme (scale-up/out) hem küçülme (scale-down/in)',
                                'Scalability = Yalnızca büyüme (scale-up)',
                            ],
                        },
                        'hint': 'Scalability sadece küçülme değil.',
                        'explanation': 'Scalability hem büyüme (scale-up/out) hem küçülme (scale-down/in) kapasitesidir. Elasticity otomatik ölçeklenmedir.',
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'AWS EC2',
                'lesson_type': 'quiz',
                'order': 2,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': "EC2'nin açılımı nedir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Elastic Cloud Compute',
                                'Elastic Compute Cloud',
                                'Extended Computing Cluster',
                                'Enterprise Cloud Controller',
                            ],
                        },
                        'correct_answer': 'Elastic Compute Cloud',
                        'hint': 'Elastic = esneklik, Cloud, Compute = hesaplama.',
                        'explanation': "EC2 = Elastic Compute Cloud. AWS'nin sanal sunucu hizmetidir.",
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': "EC2 instance türlerinde 't' harfi ne anlama gelir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Tamamen optimize',
                                'Turbo hızlı',
                                'Burstable (ani yüke göre ölçeklenebilir)',
                                'Trainable (ML için)',
                            ],
                        },
                        'correct_answer': 'Burstable (ani yüke göre ölçeklenebilir)',
                        'hint': 't2.micro, t3.small → t serisi.',
                        'explanation': 't serisi burstable performance: normal kullanımda düşük CPU, ani yük gelince burst eder. Geliştirme için idealdir.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'EC2 instance başlatma adımlarını doğru sıraya koyun:',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'AMI seç',
                                'Instance türü seç',
                                'Security Group yapılandır',
                                'Key pair seç ve launch et',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': 'AMI (OS) → kapasite → güvenlik → erişim.',
                        'explanation': 'EC2 launch: AMI (işletim sistemi seç) → instance type (kapasite) → security group (güvenlik duvarı) → key pair (SSH erişimi).',
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': (
                            "Boşluğu doldurun:\n"
                            "EC2'ye SSH ile bağlanmak için:\n"
                            "ssh -i ___.pem ec2-user@<public-ip>"
                        ),
                        'question_type': 'fill_in_blank',
                        'code_block': 'ssh -i ___.pem ec2-user@<public-ip>',
                        'word_bank': {
                            'words': [
                                'my-key',
                                'my-password',
                                'my-token',
                                'my-cert',
                                'ssh-key',
                            ],
                        },
                        'correct_answer': 'my-key',
                        'hint': "Oluşturduğunuz key pair'ın adı.",
                        'explanation': "ssh -i key-pair.pem user@ip. Key pair AWS'den indirilir (.pem formatında). chmod 400 gereklidir.",
                        'order': 2,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'EC2 fiyatlandırma modelleri hangileridir? (Birden fazla seçin)',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'On-Demand',
                                'Reserved (1 veya 3 yıllık)',
                                'Spot Instance',
                                'Dedicated Host',
                                'Free Forever',
                            ],
                        },
                        'correct_answer': 'On-Demand,Reserved (1 veya 3 yıllık),Spot Instance,Dedicated Host',
                        'hint': 'Free Forever yoktur.',
                        'explanation': 'On-Demand: kullandıkça öde. Reserved: indirimli uzun dönem. Spot: atıl kapasiteyi ucuza al. Dedicated Host: fiziksel sunucu.',
                        'order': 3,
                    },
                    {
                        'question_text': 'Security Group, EC2 instance için ağ güvenlik duvarı görevi görür.',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğru; Security Group inbound/outbound trafiği kontrol eden sanal güvenlik duvarıdır.',
                                'Yanlış; Security Group sadece monitoring içindir.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': "Hangi portlara izin verileceği Security Group'ta belirlenir.",
                        'explanation': "Security Group instance'a gelen ve giden trafiği kontrol eder. Port 22 (SSH), 80 (HTTP), 443 (HTTPS) kuralları burada.",
                        'order': 4,
                    },
                    {
                        'question_text': 'EBS (Elastic Block Store) ne için kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Nesne depolama',
                                "EC2 instance'lar için kalıcı disk depolama",
                                'Statik web sitesi',
                                'Database yönetimi',
                            ],
                        },
                        'correct_answer': "EC2 instance'lar için kalıcı disk depolama",
                        'hint': 'Block storage = disk.',
                        'explanation': "EBS EC2'ye bağlanan kalıcı blok depolamadır. Instance durduğunda veriler korunur. S3 nesne depolama içindir.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki EC2 kavramlarında hata nerede?\n"
                            "\n"
                            "AMI = Amazon Machine Image (EC2 başlatmak için şablon)\n"
                            "Instance Type = CPU/RAM/Network kapasitesi\n"
                            "Elastic IP = Dinamik IP (her restart değişir)\n"
                            "Key Pair = SSH erişimi için public/private key"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "AMI = Amazon Machine Image (EC2 başlatmak için şablon)\n"
                            "Instance Type = CPU/RAM/Network kapasitesi\n"
                            "Elastic IP = Dinamik IP (her restart değişir)\n"
                            "Key Pair = SSH erişimi için public/private key"
                        ),
                        'correct_answer': "2|Elastic IP = Statik IP (instance restart'ta değişmez)",
                        'correct_line_index': 2,
                        'options': {
                            'fix_options': [
                                "Elastic IP = Statik IP (instance restart'ta değişmez)",
                                "Elastic IP = AWS'nin IP havuzundan alınan sabit IP",
                            ],
                        },
                        'hint': "Elastic IP'nin amacı tam tersi.",
                        'explanation': "Elastic IP statik IP adresidir. Normal EC2 IP'si restart'ta değişir, Elastic IP sabit kalır. Ücretlidir (kullanılmayınca).",
                        'order': 6,
                    },
                    {
                        'question_text': 'Auto Scaling ne sağlar?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Manuel sunucu yönetimi',
                                'Talebe göre EC2 instance sayısını otomatik artırıp azaltır',
                                'Sadece monitoring',
                                'Instance türünü otomatik değiştirir',
                            ],
                        },
                        'correct_answer': 'Talebe göre EC2 instance sayısını otomatik artırıp azaltır',
                        'hint': 'Scale-out ve scale-in otomatik.',
                        'explanation': 'Auto Scaling yük arttığında instance ekler (scale-out), azaldığında azaltır (scale-in). Maliyet optimizasyonu ve yüksek erişilebilirlik sağlar.',
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'AWS S3',
                'lesson_type': 'quiz',
                'order': 3,
                'xp_reward': 20,
                'questions': [
                    {
                        'question_text': "S3'te bir nesnenin maksimum boyutu nedir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '1 GB',
                                '5 TB',
                                '100 GB',
                                'Sınırsız',
                            ],
                        },
                        'correct_answer': '5 TB',
                        'hint': 'Tek nesne için limit.',
                        'explanation': "S3'te tek bir nesne maksimum 5 TB olabilir. Bucket kapasitesi ise sınırsızdır.",
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': "S3 storage class'lardan hangisi en düşük maliyetlidir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'S3 Standard',
                                'S3 Intelligent-Tiering',
                                'S3 Glacier Deep Archive',
                                'S3 One Zone-IA',
                            ],
                        },
                        'correct_answer': 'S3 Glacier Deep Archive',
                        'hint': 'Glacier = buz dağı. Erişim nadirse.',
                        'explanation': 'Glacier Deep Archive en ucuzdur ama erişim 12 saat sürer. Nadiren erişilen arşivler için idealdir.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'S3 bucket politikası açısından doğru sıraya koyun (en kısıtlıdan en açığa):',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'Private (varsayılan)',
                                'Bucket Policy ile kısmi erişim',
                                'ACL ile nesne erişimi',
                                'Public Read',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': 'Private tam kapalı, Public Read tam açık.',
                        'explanation': 'S3 erişim kontrolü: Private (tamamen kapalı) → Bucket Policy → ACL → Public (herkes okur).',
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': (
                            "S3'te statik web sitesi için boşluğu doldurun:\n"
                            "# Bucket'ı public read yapan bucket policy alanı:\n"
                            "\"Effect\": \"___\",\n"
                            "\"Action\": \"s3:GetObject\""
                        ),
                        'question_type': 'fill_in_blank',
                        'code_block': (
                            "\"Effect\": \"___\",\n"
                            "\"Action\": \"s3:GetObject\""
                        ),
                        'word_bank': {
                            'words': [
                                'Allow',
                                'Deny',
                                'Permit',
                                'Grant',
                                'Enable',
                            ],
                        },
                        'correct_answer': 'Allow',
                        'hint': 'İzin vermek için Allow, engellemek için Deny.',
                        'explanation': "IAM/Bucket Policy'de Effect: Allow (izin ver) veya Deny (engelle). s3:GetObject + Allow = herkes okuyabilir.",
                        'order': 2,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'S3 versioning ne sağlar? (Birden fazla seçin)',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'Silinen nesneleri geri getirme',
                                'Eski versiyonlara erişim',
                                'Otomatik yedekleme',
                                'Maliyet azaltma',
                                'MFA Delete koruması',
                            ],
                        },
                        'correct_answer': 'Silinen nesneleri geri getirme,Eski versiyonlara erişim,MFA Delete koruması',
                        'hint': 'Versioning ücretlidir, maliyet azaltmaz.',
                        'explanation': 'Versioning: eski versiyonlara erişim, silinen nesneleri kurtarma, MFA Delete ile ek güvenlik. Maliyet artırır, azaltmaz.',
                        'order': 3,
                    },
                    {
                        'question_text': "S3 bucket adları globally unique (tüm AWS'de benzersiz) olmalıdır.",
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğru; S3 bucket adları AWS genelinde benzersiz olmalıdır, aynı ada birden fazla hesapta da olamaz.',
                                'Yanlış; bucket adları sadece kendi hesabınızda benzersiz olmalıdır.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'my-bucket deneyin, muhtemelen alınmış.',
                        'explanation': 'S3 bucket adları küresel olarak benzersizdir. URL formatı: bucket-adi.s3.amazonaws.com. Adlar küçük harf, sayı, tire içerebilir.',
                        'order': 4,
                    },
                    {
                        'question_text': 'S3 lifecycle policy ne işe yarar?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Nesne boyutunu sınırlar',
                                'Belirli süreden sonra nesneleri otomatik storage class değiştirir veya siler',
                                'Bucket erişimini izler',
                                'Nesne şifreler',
                            ],
                        },
                        'correct_answer': 'Belirli süreden sonra nesneleri otomatik storage class değiştirir veya siler',
                        'hint': 'Lifecycle = yaşam döngüsü yönetimi.',
                        'explanation': 'Lifecycle policy: 30 gün → Standard-IA, 90 gün → Glacier, 365 gün → sil. Maliyet optimizasyonu için kullanılır.',
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki S3 özelliklerinde hata nerede?\n"
                            "\n"
                            "Durability = %99.999999999 (11 nines)\n"
                            "Availability = %99.99\n"
                            "Storage Class = Standard, IA, Glacier\n"
                            "Bucket = Global namespace, region'dan bağımsız"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "Durability = %99.999999999 (11 nines)\n"
                            "Availability = %99.99\n"
                            "Storage Class = Standard, IA, Glacier\n"
                            "Bucket = Global namespace, region'dan bağımsız"
                        ),
                        'correct_answer': "3|Bucket = Global namespace ama fiziksel olarak belirli bir region'da oluşturulur",
                        'correct_line_index': 3,
                        'options': {
                            'fix_options': [
                                "Bucket = Global namespace ama fiziksel olarak belirli bir region'da oluşturulur",
                                "Bucket = Her region'da ayrı ayrı oluşturulur",
                            ],
                        },
                        'hint': 'Bucket adı global benzersiz ama verisi nerede?',
                        'explanation': 'Bucket adları globally unique ama oluşturulurken region seçilir (veri orada saklanır). Adı global, verisi regional.',
                        'order': 6,
                    },
                    {
                        'question_text': 'S3 Cross-Region Replication ne sağlar?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                "Bucket'ı farklı hesaba taşır",
                                "Nesneleri başka region'daki bucket'a otomatik kopyalar",
                                'Daha hızlı yükleme sağlar',
                                'Bucket adını değiştirir',
                            ],
                        },
                        'correct_answer': "Nesneleri başka region'daki bucket'a otomatik kopyalar",
                        'hint': 'Cross-Region = farklı bölgeler arası.',
                        'explanation': "CRR nesneleri başka region'da otomatik çoğaltır. Disaster recovery, latency azaltma için kullanılır.",
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'AWS IAM',
                'lesson_type': 'quiz',
                'order': 4,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': "IAM'ın açılımı nedir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Internet Access Management',
                                'Identity and Access Management',
                                'Integrated Application Module',
                                'Internal Authorization Method',
                            ],
                        },
                        'correct_answer': 'Identity and Access Management',
                        'hint': 'Kim olduğunuzu ve ne yapabileceğinizi yönetir.',
                        'explanation': 'IAM = Identity and Access Management. AWS kaynaklarına kimin, ne yapabileceğini kontrol eder.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': "IAM Policy'de 'Deny' ve 'Allow' çakışınca hangisi kazanır?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Allow',
                                'Deny',
                                'Son yazılan',
                                'Daha spesifik olan',
                            ],
                        },
                        'correct_answer': 'Deny',
                        'hint': 'Güvenlik tarafında: şüphe varsa engelle.',
                        'explanation': "Explicit Deny her zaman Allow'u ezer. Bu güvenlik prensibi: bir kural Allow etse bile başka bir Deny varsa erişim engellenir.",
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'En az ayrıcalık (Least Privilege) prensibini doğru adımlarla uygulayın:',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'Sıfır izinle başla',
                                'Görevi tanımla',
                                'Sadece gerekli izinleri ver',
                                'Düzenli olarak gözden geçir',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': 'Sıfırdan başla, ihtiyaç oldukça ekle.',
                        'explanation': 'Least privilege: hiç izin vermeden başla → görevi anla → minimum gerekli izinleri ekle → periyodik audit.',
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'IAM Role ile IAM User arasındaki fark nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Fark yoktur',
                                'User uzun süreli, Role geçici kimlik bilgileri sağlar',
                                'Role sadece insanlar için, User servisler için',
                                'User daha güvenlidir',
                            ],
                        },
                        'correct_answer': 'User uzun süreli, Role geçici kimlik bilgileri sağlar',
                        'hint': 'Servisler (EC2, Lambda) role kullanır.',
                        'explanation': "IAM User: kalıcı kimlik bilgileri (access key). IAM Role: geçici kimlik (assume role). EC2'nin S3'e erişmesi için role kullanılır.",
                        'order': 2,
                    },
                    {
                        'question_text': (
                            "IAM Policy JSON'da boşluğu doldurun:\n"
                            "{\n"
                            "  \"Effect\": \"Allow\",\n"
                            "  \"Action\": \"s3:*\",\n"
                            "  \"___\": \"arn:aws:s3:::my-bucket/*\"\n"
                            "}"
                        ),
                        'question_type': 'fill_in_blank',
                        'code_block': (
                            "{\n"
                            "  \"Effect\": \"Allow\",\n"
                            "  \"Action\": \"s3:*\",\n"
                            "  \"___\": \"arn:aws:s3:::my-bucket/*\"\n"
                            "}"
                        ),
                        'word_bank': {
                            'words': [
                                'Resource',
                                'Target',
                                'Bucket',
                                'ARN',
                                'Service',
                            ],
                        },
                        'correct_answer': 'Resource',
                        'hint': 'Hangi kaynağa uygulanacak?',
                        'explanation': 'IAM Policy yapısı: Effect (Allow/Deny) + Action (ne yapılabilir) + Resource (hangi kaynak). Resource ARN formatında belirtilir.',
                        'order': 3,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': "MFA (Multi-Factor Authentication) IAM'da neden önemlidir? (Birden fazla seçin)",
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'Root hesabını korur',
                                'Access key çalınmasına karşı ek güvenlik',
                                'Şifre gerekliliğini ortadan kaldırır',
                                'Brute force saldırılarını zorlaştırır',
                            ],
                        },
                        'correct_answer': 'Root hesabını korur,Access key çalınmasına karşı ek güvenlik,Brute force saldırılarını zorlaştırır',
                        'hint': 'MFA şifreyi kaldırmaz, ikinci faktör ekler.',
                        'explanation': 'MFA şifre + fiziksel/yazılım token gerektirir. Şifreyi ortadan kaldırmaz, ek güvenlik katmanı ekler.',
                        'order': 4,
                    },
                    {
                        'question_text': 'IAM Groups ne işe yarar?',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                "Doğru; Group'a policy atanır, gruba eklenen tüm user'lar o policy'yi miras alır.",
                                "Yanlış; Group'lara policy atanamaz, sadece User'lara atanabilir.",
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'Geliştiriciler grubu tüm geliştiricilere aynı izni verir.',
                        'explanation': 'IAM Group: aynı izinlere ihtiyaç duyan kullanıcıları gruplar. Gruba policy atayınca hepsi alır. Yönetimi kolaylaştırır.',
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki IAM konfigürasyonunda güvenlik hatası nerede?\n"
                            "\n"
                            "Root hesabı aktif\n"
                            "Root hesabında MFA yok\n"
                            "Geliştirici: AdministratorAccess policy\n"
                            "EC2 instance'ta IAM Role yok, access key kullanıyor"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "Root hesabı aktif (günlük kullanım için)\n"
                            "Root hesabında MFA yok\n"
                            "Geliştirici: AdministratorAccess policy\n"
                            "EC2 instance'ta IAM Role yok, access key kullanıyor"
                        ),
                        'correct_answer': '0|Root hesabı sadece fatura/hesap yönetimi için kullanılmalı',
                        'correct_line_index': 0,
                        'options': {
                            'fix_options': [
                                'Root hesabı sadece fatura/hesap yönetimi için kullanılmalı',
                                'Root hesabı devre dışı bırakılmalı',
                            ],
                        },
                        'hint': 'Root hesabının günlük kullanımı büyük risk.',
                        'explanation': 'Root hesabı en az kullanılmalı, MFA ekle, günlük işler için IAM user. Tüm satırlarda hata var ama root en kritik.',
                        'order': 6,
                    },
                    {
                        'question_text': "Access Key'in güvenli kullanımı için doğru pratikler hangileridir? (Birden fazla seçin)",
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'Kodu içine göm (hardcode)',
                                'Rotasyonu düzenli yap',
                                'Sadece gerekli izinleri ver',
                                "GitHub'a commit etme",
                                'Ortam değişkeni olarak sakla',
                            ],
                        },
                        'correct_answer': "Rotasyonu düzenli yap,Sadece gerekli izinleri ver,GitHub'a commit etme,Ortam değişkeni olarak sakla",
                        'hint': 'Hardcode = kötü pratik. Diğerleri iyi.',
                        'explanation': "Access key güvenliği: asla hardcode etme, rotasyonu yap, GitHub'a commit etme (secrets scanning var), env var veya AWS Secrets Manager kullan.",
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'AWS VPC ve Networking',
                'lesson_type': 'quiz',
                'order': 5,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': "VPC'nin açılımı nedir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Virtual Private Cloud',
                                'Virtual Public Container',
                                'Verified Private Connection',
                                'Virtual Processing Cluster',
                            ],
                        },
                        'correct_answer': 'Virtual Private Cloud',
                        'hint': 'Kendi özel ağ ortamınız.',
                        'explanation': "VPC = Virtual Private Cloud. AWS'de izole, özel sanal ağ ortamı. Kendi IP aralığınızı, subnet'lerinizi, routing'inizi kontrol edersiniz.",
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'Public subnet ve Private subnet arasındaki fark nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Fark yoktur',
                                "Public subnet internet gateway'e, Private subnet yok veya NAT'a bağlıdır",
                                'Public daha güvenlidir',
                                'Private daha pahalıdır',
                            ],
                        },
                        'correct_answer': "Public subnet internet gateway'e, Private subnet yok veya NAT'a bağlıdır",
                        'hint': 'Public = internet erişimli, Private = kapalı.',
                        'explanation': 'Public subnet: internet gateway ile doğrudan internet erişimi (web sunucuları). Private: NAT üzerinden tek yönlü internet veya tamamen izole (DB).',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': '3-tier mimari katmanlarını doğru sıraya koyun (internetten içeriye):',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'Web Tier (Public Subnet)',
                                'Application Tier (Private Subnet)',
                                'Database Tier (Private Subnet)',
                                'Internet Gateway',
                            ],
                        },
                        'correct_answer': '["3","0","1","2"]',
                        'hint': 'Internet → IGW → Web → App → DB.',
                        'explanation': '3-tier: İnternet → IGW → Web (public) → App (private) → DB (private). Her katman daha kapalı.',
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'CIDR notasyonunda /24 ne anlama gelir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '24 IP adresi',
                                '256 IP adresi (254 kullanılabilir)',
                                '24 subnet',
                                "/16'nın yarısı",
                            ],
                        },
                        'correct_answer': '256 IP adresi (254 kullanılabilir)',
                        'hint': '32 - 24 = 8 bit host kısmı. 2^8 = 256.',
                        'explanation': '10.0.0.0/24: 24 bit ağ, 8 bit host. 2^8 = 256 adres. İlk (ağ) ve son (broadcast) kullanılamaz = 254 kullanılabilir.',
                        'order': 2,
                    },
                    {
                        'question_text': (
                            "VPC'de boşluğu doldurun:\n"
                            "# Private subnet'teki EC2'nun internete çıkması için:\n"
                            "Private Subnet → ___ → Internet Gateway → Internet"
                        ),
                        'question_type': 'fill_in_blank',
                        'code_block': 'Private Subnet → ___ → Internet Gateway → Internet',
                        'word_bank': {
                            'words': [
                                'NAT Gateway',
                                'VPN Gateway',
                                'Direct Connect',
                                'Route Table',
                                'Load Balancer',
                            ],
                        },
                        'correct_answer': 'NAT Gateway',
                        'hint': 'NAT = Network Address Translation.',
                        'explanation': "Private subnet → NAT Gateway (public subnet'te) → Internet Gateway → Internet. NAT tek yönlü (içeriden dışarıya).",
                        'order': 3,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'Security Group ve Network ACL (NACL) arasındaki farklar hangileridir? (Birden fazla seçin)',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'Security Group instance seviyesinde, NACL subnet seviyesinde',
                                'Security Group stateful, NACL stateless',
                                'Security Group sadece Allow, NACL hem Allow hem Deny',
                                'NACL daha yüksek öncelikli',
                            ],
                        },
                        'correct_answer': 'Security Group instance seviyesinde, NACL subnet seviyesinde,Security Group stateful, NACL stateless,Security Group sadece Allow, NACL hem Allow hem Deny',
                        'hint': 'Her ifadeyi tek tek değerlendirin.',
                        'explanation': 'SG: instance-level, stateful, sadece Allow. NACL: subnet-level, stateless, Allow+Deny. NACL daha düşük öncelikli değil, katmanlı çalışır.',
                        'order': 4,
                    },
                    {
                        'question_text': 'VPC Peering ne sağlar?',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                "Doğru; iki VPC'nin private IP üzerinden özel ağda iletişim kurmasını sağlar.",
                                'Yanlış; VPC Peering internet üzerinden şifreli bağlantı sağlar.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'Internet üzerinden değil, AWS ağı üzerinden.',
                        'explanation': "VPC Peering: iki VPC'yi özel AWS ağı üzerinden bağlar. İnternet üzerinden değil, düşük latency, güvenli.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki VPC konfigürasyonunda hata nerede?\n"
                            "\n"
                            "VPC CIDR: 10.0.0.0/16\n"
                            "Public Subnet: 10.0.1.0/24 (web sunucuları)\n"
                            "Private Subnet: 10.0.2.0/24 (veritabanı)\n"
                            "Internet Gateway: VPC'ye bağlı\n"
                            "Route Table: Private subnet → 0.0.0.0/0 → Internet Gateway"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "VPC CIDR: 10.0.0.0/16\n"
                            "Public Subnet: 10.0.1.0/24\n"
                            "Private Subnet: 10.0.2.0/24\n"
                            "Internet Gateway: VPC'ye bağlı\n"
                            "Route Table: Private subnet → 0.0.0.0/0 → Internet Gateway"
                        ),
                        'correct_answer': '4|Route Table: Private subnet → 0.0.0.0/0 → NAT Gateway',
                        'correct_line_index': 4,
                        'options': {
                            'fix_options': [
                                'Route Table: Private subnet → 0.0.0.0/0 → NAT Gateway',
                                'Route Table: Private subnet → Internet Gateway yok (tamamen izole)',
                            ],
                        },
                        'hint': "Private subnet IGW'ye direkt bağlanmamalı.",
                        'explanation': "Private subnet doğrudan IGW'ye bağlanırsa public olur! Çıkış için NAT Gateway kullanılmalı.",
                        'order': 6,
                    },
                    {
                        'question_text': 'Route 53 ne için kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Güvenlik duvarı',
                                'DNS hizmeti ve domain yönetimi',
                                'VPN bağlantısı',
                                'IP adresi atama',
                            ],
                        },
                        'correct_answer': 'DNS hizmeti ve domain yönetimi',
                        'hint': "53 = DNS'in port numarası.",
                        'explanation': "Route 53 AWS'nin DNS hizmetidir. Domain kayıt, DNS yönetimi, health check, routing policies (latency, geolocation, failover).",
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'AWS RDS ve Database',
                'lesson_type': 'quiz',
                'order': 6,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': "RDS'in açılımı ve amacı nedir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Rapid Data Store — hızlı veri depolama',
                                'Relational Database Service — yönetilen ilişkisel veritabanı',
                                'Remote Data Sync — uzak veri senkronizasyonu',
                                'Redundant Data System — yedekli veri sistemi',
                            ],
                        },
                        'correct_answer': 'Relational Database Service — yönetilen ilişkisel veritabanı',
                        'hint': 'Patch, backup, scaling AWS yönetiyor.',
                        'explanation': 'RDS = Relational Database Service. AWS yönetimli: otomatik backup, patch, failover. MySQL, PostgreSQL, Aurora, Oracle, SQL Server destekler.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'DynamoDB hangi tür veritabanıdır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'İlişkisel (Relational)',
                                'NoSQL (Key-Value/Document)',
                                'Grafik veritabanı',
                                'Zaman serisi veritabanı',
                            ],
                        },
                        'correct_answer': 'NoSQL (Key-Value/Document)',
                        'hint': 'RDS ilişkisel, DynamoDB NoSQL.',
                        'explanation': "DynamoDB AWS'nin tamamen yönetilen NoSQL veritabanıdır. Milisaniye altı gecikme, sınırsız ölçeklenme.",
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'RDS high availability için adımları doğru sıraya koyun:',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'Multi-AZ aktif et',
                                "Primary DB'ye yaz",
                                "Standby DB'ye otomatik replikasyon",
                                'Primary çöküncı → otomatik failover',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': 'Aktif et → yaz → replike → çöktüğünde geç.',
                        'explanation': "Multi-AZ: primary ve standby farklı AZ'larda. Primary çöküncı DNS otomatik standby'ı gösterir (failover ~1-2 dk).",
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': (
                            "Boşluğu doldurun:\n"
                            "# Okuma performansını artırmak için:\n"
                            "RDS ___ oluştur ve okuma sorgularını yönlendir."
                        ),
                        'question_type': 'fill_in_blank',
                        'code_block': (
                            "# Okuma performansını artırmak için:\n"
                            "RDS ___ oluştur ve okuma sorgularını yönlendir."
                        ),
                        'word_bank': {
                            'words': [
                                'Read Replica',
                                'Multi-AZ',
                                'Snapshot',
                                'Clone',
                                'Backup',
                            ],
                        },
                        'correct_answer': 'Read Replica',
                        'hint': 'Sadece okuma için ikinci bir DB.',
                        'explanation': "Read Replica okuma trafiğini primary'den alır. Primary sadece yazma, Read Replica sadece okuma. Performans artışı sağlar.",
                        'order': 2,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'ElastiCache ne için kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Dosya depolama',
                                'In-memory önbellek (Redis/Memcached)',
                                'Veritabanı yedeği',
                                'DNS önbelleği',
                            ],
                        },
                        'correct_answer': 'In-memory önbellek (Redis/Memcached)',
                        'hint': "Cache = önbellek. Memory'de tutar.",
                        'explanation': 'ElastiCache Redis veya Memcached yönetilen in-memory cache. DB sorgu önbellekleme, session storage için kullanılır.',
                        'order': 3,
                    },
                    {
                        'question_text': 'RDS otomatik backup hangi özelliklere sahiptir? (Birden fazla seçin)',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'Varsayılan 7 gün retention',
                                'Point-in-time recovery',
                                'Sıfır ek maliyet',
                                "S3'te saklanır",
                                'Manuel tetikleme gerektirir',
                            ],
                        },
                        'correct_answer': "Varsayılan 7 gün retention,Point-in-time recovery,S3'te saklanır",
                        'hint': 'Otomatik = AWS halleder. Ek maliyet ve manuel değil.',
                        'explanation': "RDS auto backup: 7 gün retention (1-35 arası ayarlanabilir), point-in-time recovery, S3'te saklanır, ek maliyet var, otomatik.",
                        'order': 4,
                    },
                    {
                        'question_text': 'Aurora ve MySQL arasındaki temel fark nedir?',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                "Doğru; Aurora AWS'nin optimize ettiği, MySQL/PostgreSQL uyumlu ama 5x daha hızlı veritabanıdır.",
                                'Yanlış; Aurora ve MySQL tamamen aynı performansı gösterir.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': "Aurora AWS'nin kendi geliştirdiği.",
                        'explanation': "Aurora MySQL ve PostgreSQL uyumlu ama AWS'nin cloud-native motorudur. MySQL'den 5x, PostgreSQL'den 3x daha hızlı olduğu iddia edilir.",
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki database seçiminde hata nerede?\n"
                            "\n"
                            "'Sosyal medya uygulaması için kullanıcı profilleri' → DynamoDB\n"
                            "'E-ticaret siparişler ve ilişkiler' → RDS PostgreSQL\n"
                            "'Gerçek zamanlı oyun skorları' → RDS MySQL\n"
                            "'Makine öğrenmesi veri ambarı' → Redshift"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "'Sosyal medya kullanıcı profilleri' → DynamoDB\n"
                            "'E-ticaret siparişler ve ilişkiler' → RDS PostgreSQL\n"
                            "'Gerçek zamanlı oyun skorları' → RDS MySQL\n"
                            "'Makine öğrenmesi veri ambarı' → Redshift"
                        ),
                        'correct_answer': "2|'Gerçek zamanlı oyun skorları' → ElastiCache (Redis)",
                        'correct_line_index': 2,
                        'options': {
                            'fix_options': [
                                "'Gerçek zamanlı oyun skorları' → ElastiCache (Redis)",
                                "'Gerçek zamanlı oyun skorları' → DynamoDB",
                            ],
                        },
                        'hint': 'Gerçek zamanlı skorlar için in-memory çözüm lazım.',
                        'explanation': 'Gerçek zamanlı liderboard için ElastiCache Redis idealdir (in-memory, milisaniye gecikme). RDS MySQL çok yavaş kalır.',
                        'order': 6,
                    },
                    {
                        'question_text': 'Veritabanı migration için AWS Database Migration Service (DMS) ne sağlar?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Sadece same-engine migration',
                                "Farklı engine'ler arası migration ve minimal downtime ile canlı migration",
                                "Sadece S3'ten migration",
                                'Sadece backup restore',
                            ],
                        },
                        'correct_answer': "Farklı engine'ler arası migration ve minimal downtime ile canlı migration",
                        'hint': "Oracle'dan PostgreSQL'e geçiş mümkün mü?",
                        'explanation': 'DMS: MySQL → Aurora, Oracle → PostgreSQL gibi cross-engine migration. Canlı trafikle minimal downtime. Schema Conversion Tool ile birlikte kullanılır.',
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'AWS Lambda ve Serverless',
                'lesson_type': 'quiz',
                'order': 7,
                'xp_reward': 25,
                'questions': [
                    {
                        'question_text': "Serverless computing'in temel anlamı nedir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Hiç sunucu yoktur',
                                'Sunucu yönetimi kullanıcıdan gizlidir, AWS yönetir',
                                'Sadece containerlar kullanılır',
                                'Fonksiyonlar CPU kullanmaz',
                            ],
                        },
                        'correct_answer': 'Sunucu yönetimi kullanıcıdan gizlidir, AWS yönetir',
                        'hint': 'Sunucu var ama siz yönetmiyorsunuz.',
                        'explanation': 'Serverless: sunucular var ama AWS yönetiyor. Siz sadece kodu yazıyorsunuz. EC2/patch/scaling yok.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'Lambda fonksiyonu için maksimum çalışma süresi (timeout) nedir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '1 dakika',
                                '5 dakika',
                                '15 dakika',
                                'Sınırsız',
                            ],
                        },
                        'correct_answer': '15 dakika',
                        'hint': 'Uzun süren işlemler için Lambda uygun değil.',
                        'explanation': 'Lambda max timeout 15 dakikadır. Uzun işlemler için Step Functions, EC2 veya Fargate kullanılır.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'Lambda fonksiyonu tetiklenme adımlarını doğru sıraya koyun:',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'Event oluşur (S3, API Gateway, vb.)',
                                'Lambda tetiklenir',
                                'Kod çalıştırılır',
                                'Sonuç döndürülür/kaydedilir',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': 'Event → trigger → execute → result.',
                        'explanation': 'Lambda event-driven: event → Lambda trigger → kod çalışır → sonuç (response veya başka servise). Durum saklamaz.',
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'Lambda fiyatlandırması neye göre hesaplanır? (Birden fazla seçin)',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'İstek sayısı',
                                'Çalışma süresi × Memory',
                                'Instance tipi',
                                'Kullanılan dil',
                                'GB-saniye',
                            ],
                        },
                        'correct_answer': 'İstek sayısı,Çalışma süresi × Memory,GB-saniye',
                        'hint': 'Kaç kez çağrıldı ve ne kadar sürdü.',
                        'explanation': 'Lambda: istek sayısı + GB-saniye (memory × süre). İlk 1M istek/ay ücretsiz. Instance tipi veya dil farkı yok.',
                        'order': 2,
                    },
                    {
                        'question_text': 'API Gateway ile Lambda kombinasyonu ne oluşturur?',
                        'question_type': 'fill_in_blank',
                        'code_block': (
                            "Client → API Gateway → Lambda → (DB/S3/vb.)\n"
                            "# Bu yapı ___ mimarisinin temelidir."
                        ),
                        'word_bank': {
                            'words': [
                                'Serverless API',
                                'Monolith',
                                'Microservice VM',
                                'Container API',
                                'REST Server',
                            ],
                        },
                        'correct_answer': 'Serverless API',
                        'hint': 'Sunucu yönetimi gerektirmeyen API.',
                        'explanation': 'API Gateway + Lambda = Serverless REST API. Sunucu yönetimi yok, pay-per-request, otomatik ölçeklenme.',
                        'order': 3,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'Lambda Cold Start nedir?',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğru; Lambda uzun süre çağrılmayınca container dondurulur, yeni çağrıda başlatma gecikmesi olur.',
                                'Yanlış; Lambda her zaman aynı hızda başlar, cold start diye bir şey yoktur.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'Duran container yeniden başlamak zaman alır.',
                        'explanation': 'Cold Start: Lambda uzun süre bekledikten sonra çağrılınca ilk request yavaş olur (10-1000ms). Provisioned Concurrency ile önlenebilir.',
                        'order': 4,
                    },
                    {
                        'question_text': 'Lambda için hangi diller desteklenir? (Birden fazla seçin)',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'Python',
                                'Node.js',
                                'Java',
                                'Go',
                                'Ruby',
                                'COBOL',
                            ],
                        },
                        'correct_answer': 'Python,Node.js,Java,Go,Ruby',
                        'hint': 'COBOL desteklenmiyor.',
                        'explanation': 'Lambda desteklenen diller: Python, Node.js, Java, Go, Ruby, .NET (C#), Rust (custom runtime). COBOL yok.',
                        'order': 5,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki Lambda konfigürasyonunda hata nerede?\n"
                            "\n"
                            "Memory: 128 MB\n"
                            "Timeout: 30 dakika\n"
                            "Runtime: Python 3.11\n"
                            "Trigger: S3 bucket"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "Memory: 128 MB\n"
                            "Timeout: 30 dakika\n"
                            "Runtime: Python 3.11\n"
                            "Trigger: S3 bucket"
                        ),
                        'correct_answer': '1|Timeout: 15 dakika (maksimum)',
                        'correct_line_index': 1,
                        'options': {
                            'fix_options': [
                                'Timeout: 15 dakika (maksimum)',
                                'Timeout: 900 saniye (15 dakika)',
                            ],
                        },
                        'hint': "Lambda'nın maksimum timeout limiti kaç dakika?",
                        'explanation': 'Lambda maksimum timeout 15 dakikadır (900 saniye). 30 dakika ayarlanamaz, hata verir.',
                        'order': 6,
                    },
                    {
                        'question_text': 'Step Functions ne için kullanılır?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Lambda loglarını görüntülemek',
                                'Birden fazla Lambda fonksiyonunu iş akışı olarak orkestrate etmek',
                                "Lambda'yı hızlandırmak",
                                'API Gateway alternatifi',
                            ],
                        },
                        'correct_answer': 'Birden fazla Lambda fonksiyonunu iş akışı olarak orkestrate etmek',
                        'hint': 'Uzun işlemleri adımlara böler.',
                        'explanation': "Step Functions: birden fazla Lambda'yı sıralı/paralel iş akışına bağlar. 15 dk sınırını aşan işlemler için idealdir.",
                        'order': 7,
                    },
                ],
            },
            {
                'title': 'Cloud Mimari Best Practices',
                'lesson_type': 'quiz',
                'order': 8,
                'xp_reward': 30,
                'questions': [
                    {
                        'question_text': 'AWS Well-Architected Framework kaç pilara sahiptir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                '3',
                                '5',
                                '6',
                                '8',
                            ],
                        },
                        'correct_answer': '6',
                        'hint': "2022'de Sustainability eklendi.",
                        'explanation': 'AWS Well-Architected Framework 6 pilar: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': "'Design for failure' prensibi ne anlama gelir?",
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'Kasıtlı hatalar oluşturmak',
                                'Her bileşenin başarısız olabileceğini varsayarak dayanıklı sistem tasarlamak',
                                'Hataları görmezden gelmek',
                                'Sadece test ortamında kullanmak',
                            ],
                        },
                        'correct_answer': 'Her bileşenin başarısız olabileceğini varsayarak dayanıklı sistem tasarlamak',
                        'hint': 'Hiçbir sistem %100 güvenilir değildir.',
                        'explanation': 'Design for failure: sunucu, ağ, AZ çöküncü sistem çalışmaya devam etmeli. Multi-AZ, auto scaling, retry logic bunun için.',
                        'order': 0,
                        'is_reinforcement': True,
                    },
                    {
                        'question_text': 'Yüksek erişilebilirlik mimarisi adımlarını doğru sıraya koyun:',
                        'question_type': 'reorder',
                        'options': {
                            'items': [
                                'Birden fazla AZ kullan',
                                'Load Balancer ekle',
                                'Auto Scaling Group kur',
                                'Health check yapılandır',
                            ],
                        },
                        'correct_answer': '["0","1","2","3"]',
                        'hint': 'Altyapı → trafik dağıtımı → ölçekleme → sağlık kontrolü.',
                        'explanation': 'HA mimarisi: Multi-AZ (altyapı) → ALB (trafik dağıtımı) → ASG (ölçekleme) → Health Check (otomatik iyileştirme).',
                        'order': 1,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'RTO ve RPO ne anlama gelir?',
                        'question_type': 'multiple_choice',
                        'options': {
                            'choices': [
                                'RTO = kurtarma süresi, RPO = veri kaybı toleransı',
                                'RTO = veri kaybı, RPO = kurtarma süresi',
                                'İkisi de kurtarma süresini ifade eder',
                                'İkisi de veri kaybını ifade eder',
                            ],
                        },
                        'correct_answer': 'RTO = kurtarma süresi, RPO = veri kaybı toleransı',
                        'hint': 'Time to recover vs Point of data loss.',
                        'explanation': 'RTO (Recovery Time Objective): ne kadar sürede normale döneriz? RPO (Recovery Point Objective): ne kadar veri kaybedebiliriz?',
                        'order': 2,
                    },
                    {
                        'question_text': (
                            "Boşluğu doldurun:\n"
                            "# Uygulama için en az ayrıcalık prensibini uygula:\n"
                            "EC2 instance sadece S3'e okuma erişimi için:\n"
                            "IAM Role → Policy: ___"
                        ),
                        'question_type': 'fill_in_blank',
                        'code_block': (
                            "# EC2'nun sadece S3 okuma erişimi için:\n"
                            "IAM Role → Policy: Action: ___, Resource: arn:aws:s3:::my-bucket/*"
                        ),
                        'word_bank': {
                            'words': [
                                's3:GetObject',
                                's3:*',
                                's3:PutObject',
                                's3:DeleteObject',
                                '*',
                            ],
                        },
                        'correct_answer': 's3:GetObject',
                        'hint': 'Sadece okuma. GetObject = nesne okuma.',
                        'explanation': 's3:GetObject sadece okuma izni verir. s3:* tüm S3 izinleri (aşırı). Least privilege: sadece ne gerekiyorsa.',
                        'order': 3,
                        'has_reinforcement': True,
                    },
                    {
                        'question_text': 'CloudWatch ne için kullanılır? (Birden fazla seçin)',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'Metrik toplama ve izleme',
                                'Log yönetimi',
                                'Alarm oluşturma',
                                'Auto Scaling tetikleme',
                                'Veritabanı yönetimi',
                            ],
                        },
                        'correct_answer': 'Metrik toplama ve izleme,Log yönetimi,Alarm oluşturma,Auto Scaling tetikleme',
                        'hint': "CloudWatch AWS'nin monitoring hizmetidir.",
                        'explanation': 'CloudWatch: metrik izleme, log toplama, alarm (CPU > 80% → email), auto scaling tetikleme. DB yönetimi için değil.',
                        'order': 4,
                    },
                    {
                        'question_text': 'Infrastructure as Code (IaC) ile manuel infrastructure arasındaki avantajlar nelerdir? (Birden fazla seçin)',
                        'question_type': 'multi_select',
                        'options': {
                            'choices': [
                                'Tekrarlanabilirlik',
                                'Version control (git)',
                                'Hata azaltma',
                                'Daha hızlı ilk kurulum',
                                'İnsan gözden geçirmesi gerekmez',
                            ],
                        },
                        'correct_answer': 'Tekrarlanabilirlik,Version control (git),Hata azaltma',
                        'hint': 'IaC her şeyi çözmez, ilk kurulum daha yavaş olabilir.',
                        'explanation': 'IaC avantajları: tutarlılık, version control, hata azaltma, otomatizasyon. İlk öğrenme eğrisi yüksek, gözden geçirme hâlâ gerekli.',
                        'order': 5,
                    },
                    {
                        'question_text': 'Microservice ve Monolith mimarisi arasındaki fark nedir?',
                        'question_type': 'true_false_reason',
                        'options': {
                            'reasons': [
                                'Doğru; microservice bağımsız deploy edilebilir küçük servislerden oluşur, monolith tek büyük uygulamadır.',
                                'Yanlış; ikisi de aynı deploy sürecini kullanır.',
                            ],
                        },
                        'correct_answer': 'true|0',
                        'hint': 'micro = küçük, mono = tek.',
                        'explanation': 'Monolith: tüm özellikler tek codebase. Microservice: her özellik bağımsız servis. MS daha karmaşık ama ölçeklenebilir.',
                        'order': 6,
                    },
                    {
                        'question_text': (
                            "Aşağıdaki cloud mimari kararında hata nerede?\n"
                            "\n"
                            "Single AZ deployment\n"
                            "EC2'ya hardcode edilmiş secrets\n"
                            "No monitoring/alerting\n"
                            "Manuel scaling"
                        ),
                        'question_type': 'spot_the_bug',
                        'code_block': (
                            "Single AZ deployment (High Availability yok)\n"
                            "EC2'ya hardcode edilmiş secrets (güvenlik açığı)\n"
                            "No monitoring/alerting (körlük)\n"
                            "Manuel scaling (verimsiz)"
                        ),
                        'correct_answer': '0|Multi-AZ deployment (en az 2 AZ)',
                        'correct_line_index': 0,
                        'options': {
                            'fix_options': [
                                'Multi-AZ deployment (en az 2 AZ)',
                                'Single AZ + yedekleme',
                            ],
                        },
                        'hint': 'Tüm satırlarda sorun var ama hangisi en kritik?',
                        'explanation': 'Tüm kararlar hatalı ama Single AZ = tek nokta arızası (SPOF). Bir AZ çökünce tüm sistem çöker. Multi-AZ en kritik düzeltme.',
                        'order': 7,
                    },
                ],
            },
        ],
    },
]

PYTHON_EXTRA_QUIZ_LESSON: dict = {
    'title': 'Python Hızlı Pratik',
    'lesson_type': 'quiz',
    'order': 26,
    'xp_reward': 25,
    'questions': [
        {
            'question_text': "Python dilinde kodlarımızın sonuçlarını terminale yazdırmak ve kullanıcıya bilgi göstermek için hangi standart fonksiyon kullanılır? Örneğin, ekrana 'Merhaba Dünya' yazdırmak istediğimizde tercih ettiğimiz yerleşik fonksiyon hangisidir?",
            'question_type': 'multiple_choice',
            'options': {
                'choices': [
                    'write()',
                    'print()',
                    'echo()',
                    'output()',
                ],
            },
            'correct_answer': 'print()',
            'hint': "Konsola çıktı vermeyi sağlayan ve en temel fonksiyon olan bu yapının adı, İngilizce 'yazdırmak' anlamına gelir.",
            'explanation': "Python'da standart çıktıya (stdout/konsol) veri yazdırmak için yerleşik 'print()' fonksiyonu kullanılır. write() genellikle dosya yazma işlemlerinde tercih edilir.",
            'order': 1,
        },
        {
            'question_text': "Elimizde kelimelerden oluşan bir liste olduğunu varsayalım: `liste = ['Python', 'öğreniyorum', 'çok', 'keyifli']`. Bu listedeki kelimeleri aralarına birer boşluk karakteri koyarak birleştirip tek bir metin (String) haline getirmek istiyoruz. Bu birleştirme işlemini gerçekleştiren en doğru ve yaygın Python metodu/yöntemi hangisidir?",
            'question_type': 'multiple_choice',
            'options': {
                'choices': [
                    '" ".join(liste)',
                    "liste.merge(' ')",
                    "concat(liste, ' ')",
                    "liste + ' '",
                ],
            },
            'correct_answer': '" ".join(liste)',
            'hint': 'String nesnelerine ait olan ve parametre olarak bir liste alan bir birleştirme metodunu düşünmelisiniz.',
            'explanation': "Python'da bir liste dolusu string elemanı aralarına belirli bir ayrıcı (separator) koyarak birleştirmek için separator_string.join(liste) yapısı kullanılır. Örneğin: ' '.join(liste) ifadesi listedeki elemanları boşlukla birleştirerek tek bir metin üretir.",
            'order': 2,
        },
        {
            'question_text': (
                "Python'da döngülerde sıklıkla kullanılan `range()` fonksiyonu belirli aralıklarda sayılar üretir. Aşağıdaki döngü yapısı çalıştırıldığında döngü bloğu tam olarak kaç kez tekrarlanır ve ekrana hangi sayılar yazdırılır?\n"
                "\n"
                "```python\n"
                "for i in range(3):\n"
                "    print(i)\n"
                "```"
            ),
            'question_type': 'multiple_choice',
            'options': {
                'choices': [
                    '2 kez döner, 1 ve 2 sayılarını yazdırır',
                    '3 kez döner, 0, 1 ve 2 sayılarını yazdırır',
                    '4 kez döner, 0, 1, 2 ve 3 sayılarını yazdırır',
                    'Sonsuz döngüye girer',
                ],
            },
            'correct_answer': '3 kez döner, 0, 1 ve 2 sayılarını yazdırır',
            'hint': 'range(N) fonksiyonu varsayılan olarak sıfırdan başlar ve belirtilen N sayısına kadar (N hariç) ardışık tam sayılar üretir.',
            'explanation': "range(3) ifadesi 0'dan başlayarak 3'e kadar (3 hariç) sayılar üretir: yani 0, 1 ve 2. Dolayısıyla döngü 3 kez çalışır ve bu üç sayıyı alt alta yazdırır.",
            'order': 3,
        },
        {
            'question_text': (
                "Bir karakter dizisinin (String) toplam karakter uzunluğunu bulmak için yerleşik bir fonksiyon kullanırız. Aşağıdaki Python kod parçacığında 'Coderun' kelimesinin harf/karakter sayısını hesaplamak istiyoruz. Boş bırakılan yere hangi yerleşik fonksiyon gelmelidir?\n"
                "\n"
                "```python\n"
                "sonuc = ___('Coderun')  # sonuc değişkeninin değeri 7 olur\n"
                "```"
            ),
            'question_type': 'code_completion',
            'options': None,
            'correct_answer': 'len',
            'hint': "Karakter dizisinin uzunluğunu ölçmek için 'length' kelimesinin kısaltması olan yerleşik fonksiyonu düşünün.",
            'explanation': "len() fonksiyonu kendisine verilen nesnenin uzunluğunu veya eleman sayısını döner. 'Coderun' kelimesi 7 harften oluştuğu için len('Coderun') ifadesinin sonucu 7 olacaktır.",
            'code_block': "sonuc = ___('Coderun')",
            'order': 4,
        },
        {
            'question_text': 'Python dilinde değişkenleri isimlendirirken uyulması gereken belirli kurallar vardır. Bazı karakterler veya kelimeler değişken isminin başında veya içerisinde kullanılamaz. Buna göre, aşağıdakilerden hangisi Python kurallarına göre geçersiz bir değişken ismidir?',
            'question_type': 'multiple_choice',
            'options': {
                'choices': [
                    'sayi_degeri',
                    '_kullanici_adi',
                    '2_kullanici',
                    'yeniKullanici',
                ],
            },
            'correct_answer': '2_kullanici',
            'hint': 'Değişken isimleri rakamla başlayamaz ve özel karakter olarak sadece alt tire (_) barındırabilir.',
            'explanation': "Python'da değişken isimleri harf veya alt tire (_) ile başlamak zorundadır; rakamla (örneğin 2) başlayamazlar. Dolayısıyla '2_kullanici' geçersiz bir tanımlamadır.",
            'order': 5,
        },
        {
            'question_text': (
                "Python'da listeler üzerinde dilimleme (slicing) işlemi yaparak listenin belirli bir aralığını elde edebiliriz. Elimizde `sayilar = [10, 20, 30, 40, 50]` şeklinde bir liste olduğunu düşünelim. Aşağıdaki dilimleme işleminin sonucu olarak elde edeceğimiz yeni liste hangisi olacaktır?\n"
                "\n"
                "```python\n"
                "sonuc = sayilar[1:4]\n"
                "```"
            ),
            'question_type': 'multiple_choice',
            'options': {
                'choices': [
                    '[10, 20, 30]',
                    '[20, 30, 40]',
                    '[20, 30, 40, 50]',
                    '[10, 20, 30, 40]',
                ],
            },
            'correct_answer': '[20, 30, 40]',
            'hint': "Dilimleme işleminde `list[baslangic:bitis]` formülünde baslangic indeksi dahil edilirken, bitis indeksi dahil edilmez (hariç tutulur). İndekslerin 0'dan başladığını unutmayın.",
            'explanation': "Python'da indeksleme 0'dan başlar. 1. indeksteki eleman 20, 2. indekste 30, 3. indekste 40 ve 4. indekste 50 vardır. `sayilar[1:4]` ifadesi 1. indeksten başlayıp 4. indekse kadar (4 hariç) olan elemanları dilimler, yani [20, 30, 40] değerini döner.",
            'order': 6,
        },
        {
            'question_text': (
                "Python sözlüklerinde (dictionary) anahtarlara (key) güvenli bir şekilde erişmek ve eğer anahtar mevcut değilse hata almak yerine varsayılan bir değer (None veya özel bir metin) dönmek için hangi metot kullanılır? Aşağıdaki kod bloğunda boşluğu doldurun.\n"
                "\n"
                "```python\n"
                "sozluk = {'dil': 'Python', 'seviye': 'Başlangıç'}\n"
                "yanit = sozluk.___('sure', 'Belirtilmedi')  # 'sure' anahtarı yoksa 'Belirtilmedi' döner\n"
                "```"
            ),
            'question_type': 'code_completion',
            'options': None,
            'correct_answer': 'get',
            'hint': "İngilizce'de 'almak/elde etmek' anlamına gelen ve sözlüklerde anahtar kontrolünü hata fırlatmadan yapan fonksiyonu düşünün.",
            'explanation': "Sözlüklerde `sozluk['anahtar']` şeklinde erişim yapmak, anahtar mevcut değilse KeyError hatası fırlatır. Bunun yerine `sozluk.get('anahtar', varsayilan_deger)` kullanmak güvenlidir.",
            'code_block': (
                "sozluk = {'dil': 'Python', 'seviye': 'Başlangıç'}\n"
                "yanit = sozluk.___('sure', 'Belirtilmedi')"
            ),
            'order': 7,
        },
        {
            'question_text': "Bir sayının çift mi yoksa tek mi olduğunu kontrol etmek için kalan (modulo - `%`) operatörünü kullanırız. Sayının 2'ye bölümünden kalan 0 ise o sayı çifttir. Aşağıdaki if-else yapısında sayının çift olup olmadığını kontrol eden koşulu tamamlamak için boş bırakılan yere ne yazılmalıdır?",
            'question_type': 'code_completion',
            'options': None,
            'correct_answer': '0',
            'hint': "Sayının 2'ye göre modu alınmalı ve sıfıra eşitliği kontrol edilmelidir. Çift sayılarda kalan daima sıfırdır.",
            'explanation': "Modulo operatörü (%) kalan sayıyı bulur. Bir sayının 2'ye bölümünden kalan 0 ise sayı çifttir. Dolayısıyla karşılaştırmada boşluğa 0 gelmelidir.",
            'code_block': (
                "sayi = 82\n"
                "if sayi % 2 == ___:\n"
                "    print('Çift')\n"
                "else:\n"
                "    print('Tek')"
            ),
            'order': 8,
        },
        {
            'question_text': (
                "Python'da f-string (biçimlendirilmiş string) ifadeleri, değişken değerlerini metin içine gömerek okunabilir çıktılar üretmemizi sağlar. Aşağıdaki kod parçasında `kullanici` değişkeninin değerini ekrana 'Merhaba, Ali!' şeklinde yazdırmak istiyoruz. Hangi f-string sözdizimi doğrudur?\n"
                "\n"
                "```python\n"
                "kullanici = 'Ali'\n"
                "# Hangisi doğru?\n"
                "```"
            ),
            'question_type': 'multiple_choice',
            'options': {
                'choices': [
                    "print(f'Merhaba, {kullanici}!')",
                    "print('Merhaba, {kullanici}!')",
                    'print(f"Merhaba, kullanici!")',
                    "print('Merhaba, ' + kullanici)",
                ],
            },
            'correct_answer': "print(f'Merhaba, {kullanici}!')",
            'hint': "f-string ifadelerinde string'in başına küçük 'f' harfi eklenir ve süslü parantez içinde değişken adı yazılır.",
            'explanation': "f'Merhaba, {kullanici}!' ifadesi f-string sözdizimidir; süslü parantez içindeki değişken çalışma anında değeriyle değiştirilir. Düz string veya yanlış f-string kullanımı beklenen çıktıyı vermez.",
            'order': 9,
        },
        {
            'question_text': "List comprehension (liste üreteci), Python'da kısa ve okunaklı şekilde yeni listeler oluşturmamızı sağlar. Elimizde `sayilar = [1, 2, 3, 4, 5]` listesi var. Bu listedeki her elemanın karesini alıp yeni bir liste oluşturmak için aşağıdaki ifadelerden hangisi doğru liste üreteci sözdizimini kullanır?",
            'question_type': 'multiple_choice',
            'options': {
                'choices': [
                    '[x * x for x in sayilar]',
                    '[x ** 2 in sayilar]',
                    'for x in sayilar: x * x',
                    'map(square, sayilar)',
                ],
            },
            'correct_answer': '[x * x for x in sayilar]',
            'hint': 'Liste üreteci `[ifade for öğe in liste]` kalıbını takip eder; her öğe için ifade hesaplanır ve sonuçlar yeni listeye eklenir.',
            'explanation': '[x * x for x in sayilar] ifadesi sayilar listesindeki her x için x*x değerini hesaplayıp [1, 4, 9, 16, 25] listesini üretir.',
            'order': 10,
        },
        {
            'question_text': (
                "Python listeleri değiştirilebilir (mutable) veri yapılarıdır; sonuna yeni eleman eklemek için yaygın bir metot kullanılır. Aşağıdaki kodda `gorevler` listesine 'Kod yaz' öğesini eklemek için boşluğa hangi metot adı gelmelidir?\n"
                "\n"
                "```python\n"
                "gorevler = ['Oku', 'Çalış']\n"
                "gorevler.___('Kod yaz')\n"
                "print(gorevler)  # ['Oku', 'Çalış', 'Kod yaz']\n"
                "```"
            ),
            'question_type': 'code_completion',
            'options': None,
            'correct_answer': 'append',
            'hint': "Listenin sonuna tek bir eleman ekleyen ve İngilizce 'eklemek/iliştirmek' anlamına gelen metodu düşünün.",
            'explanation': 'append() metodu listenin sonuna tek bir öğe ekler. extend() birden fazla öğe eklemek için, insert() belirli indekse eklemek için kullanılır.',
            'code_block': (
                "gorevler = ['Oku', 'Çalış']\n"
                "gorevler.___('Kod yaz')\n"
                "print(gorevler)"
            ),
            'order': 11,
        },
        {
            'question_text': "Python'da boolean (mantıksal) ifadeler True veya False değerlerini temsil eder. Karşılaştırma operatörleri bu değerleri üretir. Aşağıdaki ifadelerden hangisi `10 > 3 and 5 < 2` koşulunun sonucunu doğru verir?",
            'question_type': 'multiple_choice',
            'options': {
                'choices': [
                    'True — her iki karşılaştırma da doğru',
                    'False — ikinci karşılaştırma (5 < 2) yanlış',
                    'True — and operatörü her zaman True döner',
                    'Hata fırlatır',
                ],
            },
            'correct_answer': 'False — ikinci karşılaştırma (5 < 2) yanlış',
            'hint': 'and operatörü her iki tarafın da True olmasını bekler. 10 > 3 doğru ama 5 < 2 doğru mu?',
            'explanation': '10 > 3 ifadesi True döner, ancak 5 < 2 ifadesi False döner. and operatörü her iki koşul da True olmadığı için sonuç False olur.',
            'order': 12,
        },
    ],
}

CODING_ASSIGNMENTS_LESSON: dict = {
    "title": "Hello Coderun — İlk Adımlar",
    "lesson_type": "code_editor",
    "order": 27,
    "xp_reward": 50,
    "questions": [
        # ------------------------------------------------------------------
        # 1. İlk Çıktın (easy)
        # ------------------------------------------------------------------
        {
            "question_text": "İlk Çıktın",
            "question_type": "code_editor",
            "language": "python",
            "difficulty": "easy",
            "assignment_instructions": (
                "Ekrana 'Merhaba Dünya!' yazdıran bir program yaz.\n\n"
                "Beklenen çıktı:\nMerhaba Dünya!"
            ),
            "starter_code": "# Çözümünü buraya yaz\n",
            "correct_answer": "__code_editor__",
            "hint": "print() fonksiyonunu kullan. Metin tırnak içinde olmalı.",
            "explanation": "print() fonksiyonu parantez içindeki değeri ekrana yazdırır.",
            "max_runtime_ms": 5000,
            "memory_limit_mb": 128,
            "order": 1,
            "test_cases": [
                {
                    "name": "Merhaba Dünya çıktısı",
                    "stdin": "",
                    "expected_stdout": "Merhaba Dünya!",
                    "hidden": False,
                },
                {
                    "name": "Gizli doğrulama",
                    "stdin": "",
                    "expected_stdout": "Merhaba Dünya!",
                    "hidden": True,
                },
            ],
        },
        # ------------------------------------------------------------------
        # 2. Çoklu Satır (easy)
        # ------------------------------------------------------------------
        {
            "question_text": "Çoklu Satır",
            "question_type": "code_editor",
            "language": "python",
            "difficulty": "easy",
            "assignment_instructions": (
                "Ekrana alt alta şu iki satırı yazdır:\n"
                "Python öğreniyorum\n"
                "Coderun ile pratik yapıyorum"
            ),
            "starter_code": "# İki ayrı print() kullan\n",
            "correct_answer": "__code_editor__",
            "hint": "Her satır için ayrı bir print() kullan.",
            "explanation": "Her print() çağrısı yeni bir satıra yazar.",
            "max_runtime_ms": 5000,
            "memory_limit_mb": 128,
            "order": 2,
            "test_cases": [
                {
                    "name": "İki satır çıktı",
                    "stdin": "",
                    "expected_stdout": "Python öğreniyorum\nCoderun ile pratik yapıyorum",
                    "hidden": False,
                },
                {
                    "name": "Gizli doğrulama",
                    "stdin": "",
                    "expected_stdout": "Python öğreniyorum\nCoderun ile pratik yapıyorum",
                    "hidden": True,
                },
            ],
        },
        # ------------------------------------------------------------------
        # 3. String Birleştirme (medium)
        # ------------------------------------------------------------------
        {
            "question_text": "String Birleştirme",
            "question_type": "code_editor",
            "language": "python",
            "difficulty": "medium",
            "assignment_instructions": (
                "ad değişkenine 'Coderun' değerini ata ve ekrana 'Hoş geldin, Coderun!' yazdır."
            ),
            "starter_code": "ad = ___\nprint(___)\n",
            "correct_answer": "__code_editor__",
            "hint": "f-string: f'Hoş geldin, {ad}!' veya + ile birleştir.",
            "explanation": "f-string ile değişkenleri metin içinde {süslü parantez} ile kullanabilirsin.",
            "max_runtime_ms": 5000,
            "memory_limit_mb": 128,
            "order": 3,
            "test_cases": [
                {
                    "name": "Hoş geldin Coderun",
                    "stdin": "",
                    "expected_stdout": "Hoş geldin, Coderun!",
                    "hidden": False,
                },
                {
                    "name": "Gizli doğrulama",
                    "stdin": "",
                    "expected_stdout": "Hoş geldin, Coderun!",
                    "hidden": True,
                },
            ],
        },
        # ------------------------------------------------------------------
        # 4. Tekrarlı Çıktı (medium)
        # ------------------------------------------------------------------
        {
            "question_text": "Tekrarlı Çıktı",
            "question_type": "code_editor",
            "language": "python",
            "difficulty": "medium",
            "assignment_instructions": (
                "Bir for döngüsü kullanarak 'Python' kelimesini 3 kez alt alta yazdır.\n\n"
                "Beklenen çıktı:\nPython\nPython\nPython"
            ),
            "starter_code": "# for döngüsü kullan\n",
            "correct_answer": "__code_editor__",
            "hint": "for i in range(3): kullanarak döngü kur.",
            "explanation": "range(3) → 0, 1, 2 değerlerini üretir. Döngü 3 kez çalışır.",
            "max_runtime_ms": 5000,
            "memory_limit_mb": 128,
            "order": 4,
            "test_cases": [
                {
                    "name": "Python 3 kez",
                    "stdin": "",
                    "expected_stdout": "Python\nPython\nPython",
                    "hidden": False,
                },
                {
                    "name": "Gizli doğrulama",
                    "stdin": "",
                    "expected_stdout": "Python\nPython\nPython",
                    "hidden": True,
                },
            ],
        },
        # ------------------------------------------------------------------
        # 5. Formatlı Çıktı (hard)
        # ------------------------------------------------------------------
        {
            "question_text": "Formatlı Çıktı",
            "question_type": "code_editor",
            "language": "python",
            "difficulty": "hard",
            "assignment_instructions": (
                "1'den 5'e kadar (dahil) sayıları 'Sayı: X' formatında alt alta yazdır.\n\n"
                "Beklenen çıktı:\nSayı: 1\nSayı: 2\nSayı: 3\nSayı: 4\nSayı: 5"
            ),
            "starter_code": "# range ve f-string kullan\n",
            "correct_answer": "__code_editor__",
            "hint": "for i in range(1, 6): ile döngü kur, f-string ile formatla.",
            "explanation": (
                "range(1, 6) → 1, 2, 3, 4, 5 üretir. "
                "Son değer dahil değildir bu yüzden 6 yazıyoruz."
            ),
            "max_runtime_ms": 5000,
            "memory_limit_mb": 128,
            "order": 5,
            "test_cases": [
                {
                    "name": "Sayı 1-5 formatlı",
                    "stdin": "",
                    "expected_stdout": "Sayı: 1\nSayı: 2\nSayı: 3\nSayı: 4\nSayı: 5",
                    "hidden": False,
                },
                {
                    "name": "Gizli doğrulama",
                    "stdin": "",
                    "expected_stdout": "Sayı: 1\nSayı: 2\nSayı: 3\nSayı: 4\nSayı: 5",
                    "hidden": True,
                },
            ],
        },
    ],
}


# =============================================================================
# PYTHON DEĞİŞKENLER — Ek ders 2 (code_editor tipi)
# =============================================================================

CODING_VARIABLES_LESSON: dict = {
    "title": "Değişkenler — Kod Pratiği",
    "lesson_type": "code_editor",
    "order": 28,
    "xp_reward": 50,
    "questions": [
        # ------------------------------------------------------------------
        # 1. Değişken Tanımlama (easy)
        # ------------------------------------------------------------------
        {
            "question_text": "Değişken Tanımlama",
            "question_type": "code_editor",
            "language": "python",
            "difficulty": "easy",
            "assignment_instructions": (
                "isim adlı bir değişkene herhangi bir isim ata ve ekrana yazdır.\n\n"
                "Örnek çıktı: Ömer (ya da seçtiğin herhangi bir isim)"
            ),
            "starter_code": "isim = ___\nprint(___)\n",
            "correct_answer": "__code_editor__",
            "hint": "isim = 'Ömer' gibi bir atama yap, sonra print(isim)",
            "explanation": "Python'da değişken tanımlamak için = operatörü kullanılır.",
            "max_runtime_ms": 5000,
            "memory_limit_mb": 128,
            "order": 1,
            "test_cases": [],  # Herhangi bir isim geçerlidir, test cases yok
        },
        # ------------------------------------------------------------------
        # 2. Sayı İşlemi (easy)
        # ------------------------------------------------------------------
        {
            "question_text": "Sayı İşlemi",
            "question_type": "code_editor",
            "language": "python",
            "difficulty": "easy",
            "assignment_instructions": (
                "a değişkenine 10, b değişkenine 20 ata. İkisinin toplamını ekrana yazdır.\n\n"
                "Beklenen çıktı: 30"
            ),
            "starter_code": "a = ___\nb = ___\nprint(___)\n",
            "correct_answer": "__code_editor__",
            "hint": "print(a + b) veya toplam = a + b",
            "explanation": "Python'da sayılar + operatörü ile toplanır.",
            "max_runtime_ms": 5000,
            "memory_limit_mb": 128,
            "order": 2,
            "test_cases": [
                {
                    "name": "10 + 20 = 30",
                    "stdin": "",
                    "expected_stdout": "30",
                    "hidden": False,
                },
                {
                    "name": "Gizli doğrulama",
                    "stdin": "",
                    "expected_stdout": "30",
                    "hidden": True,
                },
            ],
        },
        # ------------------------------------------------------------------
        # 3. Tip Dönüşümü (medium)
        # ------------------------------------------------------------------
        {
            "question_text": "Tip Dönüşümü",
            "question_type": "code_editor",
            "language": "python",
            "difficulty": "medium",
            "assignment_instructions": (
                "yas değişkenine 25 ata. Ekrana 'Yaşım: 25' yazdır.\n\n"
                "Beklenen çıktı: Yaşım: 25"
            ),
            "starter_code": "yas = 25\nprint(___)\n",
            "correct_answer": "__code_editor__",
            "hint": "f'Yaşım: {yas}' veya 'Yaşım: ' + str(yas)",
            "explanation": "String ile integer'ı birleştirmek için str() veya f-string kullan.",
            "max_runtime_ms": 5000,
            "memory_limit_mb": 128,
            "order": 3,
            "test_cases": [
                {
                    "name": "Yaşım: 25",
                    "stdin": "",
                    "expected_stdout": "Yaşım: 25",
                    "hidden": False,
                },
                {
                    "name": "Gizli doğrulama",
                    "stdin": "",
                    "expected_stdout": "Yaşım: 25",
                    "hidden": True,
                },
            ],
        },
        # ------------------------------------------------------------------
        # 4. Çoklu Değişken (medium)
        # ------------------------------------------------------------------
        {
            "question_text": "Çoklu Değişken",
            "question_type": "code_editor",
            "language": "python",
            "difficulty": "medium",
            "assignment_instructions": (
                "ad='Python', versiyon=3.12, yil=1991 tanımla.\n"
                "Ekrana 'Python 3.12 yılında 1991 çıktı' yazdır.\n\n"
                "Beklenen çıktı: Python 3.12 yılında 1991 çıktı"
            ),
            "starter_code": (
                "ad = 'Python'\n"
                "versiyon = ___\n"
                "yil = ___\n"
                "print(___)\n"
            ),
            "correct_answer": "__code_editor__",
            "hint": "f'{ad} {versiyon} yılında {yil} çıktı' şeklinde f-string kullan.",
            "explanation": "f-string ile birden fazla değişkeni tek bir string içinde kullanabilirsin.",
            "max_runtime_ms": 5000,
            "memory_limit_mb": 128,
            "order": 4,
            "test_cases": [
                {
                    "name": "Python 3.12 yılında 1991 çıktı",
                    "stdin": "",
                    "expected_stdout": "Python 3.12 yılında 1991 çıktı",
                    "hidden": False,
                },
                {
                    "name": "Gizli doğrulama",
                    "stdin": "",
                    "expected_stdout": "Python 3.12 yılında 1991 çıktı",
                    "hidden": True,
                },
            ],
        },
        # ------------------------------------------------------------------
        # 5. Takas Problemi (hard)
        # ------------------------------------------------------------------
        {
            "question_text": "Takas Problemi",
            "question_type": "code_editor",
            "language": "python",
            "difficulty": "hard",
            "assignment_instructions": (
                "a=5 ve b=10 değerlerini üçüncü bir değişken kullanmadan takas et.\n"
                "Son olarak 'a=10, b=5' yazdır.\n\n"
                "Beklenen çıktı: a=10, b=5"
            ),
            "starter_code": (
                "a = 5\n"
                "b = 10\n"
                "# Takas yap\n\n"
                "print(f'a={a}, b={b}')\n"
            ),
            "correct_answer": "__code_editor__",
            "hint": "Python'da a, b = b, a ile tek satırda takas yapabilirsin.",
            "explanation": "Python'da a, b = b, a ifadesi geçici değişken kullanmadan takas yapar.",
            "max_runtime_ms": 5000,
            "memory_limit_mb": 128,
            "order": 5,
            "test_cases": [
                {
                    "name": "a=10, b=5",
                    "stdin": "",
                    "expected_stdout": "a=10, b=5",
                    "hidden": False,
                },
                {
                    "name": "Gizli doğrulama",
                    "stdin": "",
                    "expected_stdout": "a=10, b=5",
                    "hidden": True,
                },
            ],
        },
    ],
}

