import sys
import os

# Set backend path
sys.path.append(r'c:\Users\omerc\Desktop\coderun\backend')

from app.core.seed_data import SEED_DATA, PYTHON_EXTRA_QUIZ_LESSON, CODING_ASSIGNMENTS_LESSON

# Define extra questions for all 25 Python lessons
# Each lesson gets 4 extra questions (some MC, code_completion, spot_the_bug, predict_output, reorder)
EXTRA_QUESTIONS = {
    "Değişkenler ve Veri Tipleri": [
        {
            "question_text": "Aşağıdakilerden hangisi Python'da geçersiz bir değişken adıdır?",
            "question_type": "multiple_choice",
            "options": {"choices": ["my_var", "var_1", "class", "_temp"]},
            "correct_answer": "class",
            "hint": "Python'daki ayrılmış anahtar kelimelere (keywords) dikkat edin.",
            "explanation": "class anahtar kelimesi Python'da sınıfları tanımlamak için ayrılmıştır ve değişken adı olarak kullanılamaz. Diğer seçenekler geçerlidir.",
            "order": 5,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\na = 10\nb = a\na = 20\nprint(b)",
            "question_type": "multiple_choice",
            "options": {"choices": ["10", "20", "a", "Hata"]},
            "correct_answer": "10",
            "hint": "Değişkenlerin değer atama sırasını takip edin.",
            "explanation": "b değişkenine a'nın o anki değeri olan 10 atanmıştır. Sonrasında a'nın değiştirilmesi b'nin değerini etkilemez.",
            "order": 6,
        },
        {
            "question_text": "Fonksiyon parametre boşluğunu doldurarak toplama sonucunu döndürün:\ndef topla(a, b):\n    return ___",
            "question_type": "code_completion",
            "correct_answer": "a + b",
            "hint": "a ve b parametrelerini toplama operatörüyle birleştirin.",
            "explanation": "İki sayıyı toplamak için standart + operatörü kullanılır: a + b.",
            "code_block": "def topla(a, b):\n    return ___",
            "word_bank": {"words": ["a + b", "a - b", "a * b", "a / b"]},
            "order": 7,
        },
        {
            "question_text": "Hatalı satırı bulun: \nx = 5\ny = '10'\nprint(x + y)",
            "question_type": "spot_the_bug",
            "code_block": "x = 5\ny = '10'\nprint(x + y)",
            "correct_answer": "2|print(x + int(y))",
            "correct_line_index": 2,
            "options": {"fix_options": ["print(x + int(y))", "print(str(x) + y)"]},
            "hint": "Farklı türdeki verileri doğrudan toplayamazsınız.",
            "explanation": "Integer (x) ve String (y) değerleri doğrudan toplanamaz. Tür dönüşümü yapılmalıdır: x + int(y) veya str(x) + y.",
            "order": 8,
        }
    ],
    "Sayılar ve Stringler": [
        {
            "question_text": "Python'da bir sayının üssünü (kuvvetini) almak için hangi operatör kullanılır?",
            "question_type": "multiple_choice",
            "options": {"choices": ["^", "**", "*", "pow"]},
            "correct_answer": "**",
            "hint": "Çarpma operatörünün çift hali.",
            "explanation": "Python'da üs alma operatörü **'dır. Örneğin 2**3 ifadesi 8 sonucunu verir.",
            "order": 5,
        },
        {
            "question_text": "String nesnesini tamamen büyük harflere dönüştüren metod hangisidir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["upper()", "capitalize()", "title()", "lower()"]},
            "correct_answer": "upper()",
            "hint": "İngilizce 'üst' veya 'büyük' anlamına gelen kelime.",
            "explanation": "upper() metodu string'deki tüm harfleri büyük harfe çevirir. capitalize() sadece ilk harfi büyütür.",
            "order": 6,
        },
        {
            "question_text": "print('Python'[1:4]) ifadesinin çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["Pyt", "yth", "ytho", "tho"]},
            "correct_answer": "yth",
            "hint": "Dilimleme işlemlerinde başlangıç indeksi dahil, bitiş indeksi hariçtir. İndeksleme 0'dan başlar.",
            "explanation": "Python string'inde 1. indeks 'y', 4. indeks ise 'o' harfidir. 1:4 dilimi yth karakterlerini döndürür.",
            "order": 7,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\nprint('a' * 3)",
            "question_type": "multiple_choice",
            "options": {"choices": ["aaa", "a 3", "Hata", "a*3"]},
            "correct_answer": "aaa",
            "hint": "String çarpma işlemi string'i tekrar ettirir.",
            "explanation": "Python'da string ile tamsayıyı çarpmak, o string'i belirtilen sayıda tekrarlayarak birleştirir.",
            "order": 8,
        }
    ],
    "Bool ve Karşılaştırma": [
        {
            "question_text": "Hangisi mantıksal VEYA (OR) işlemini gerçekleştirir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["||", "or", "and", "not"]},
            "correct_answer": "or",
            "hint": "İngilizce veya anlamına gelen anahtar kelime.",
            "explanation": "Python'da mantıksal veya işlemi için 'or' kelimesi kullanılır.",
            "order": 5,
        },
        {
            "question_text": "not True or False ifadesinin sonucu nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["True", "False", "None", "Hata"]},
            "correct_answer": "False",
            "hint": "Mantıksal not önceliğine dikkat edin.",
            "explanation": "not True ifadesi False olur. False or False ise False sonucunu verir.",
            "order": 6,
        },
        {
            "question_text": "Değerleri karşılaştırmak için boşluğu doldurun:\nsayi = 10\nis_even = (sayi % 2 ___ 0)",
            "question_type": "fill_in_blank",
            "correct_answer": "==",
            "hint": "Eşitlik kontrolü operatörünü kullanın.",
            "explanation": "Eşitlik kontrolü için == kullanılır. sayi % 2 == 0 çift sayı kontrolüdür.",
            "code_block": "sayi = 10\nis_even = (sayi % 2 ___ 0)",
            "word_bank": {"words": ["==", "=", "!=", ">"]},
            "order": 7,
        },
        {
            "question_text": "Aşağıdaki ifadelerden hangisi True döndürür?",
            "question_type": "multiple_choice",
            "options": {"choices": ["3 > 5", "not (2 == 2)", "5 >= 5", "10 < 9"]},
            "correct_answer": "5 >= 5",
            "hint": "Büyük veya eşit operatörünü inceleyin.",
            "explanation": "5 >= 5 ifadesi 5, 5'e eşit olduğu için True döndürür. Diğerleri False döndürür.",
            "order": 8,
        }
    ],
    "Basit Input/Output": [
        {
            "question_text": "print('A', 'B', sep='-') ifadesinin çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["A B", "A-B", "AB", "Hata"]},
            "correct_answer": "A-B",
            "hint": "sep parametresi elemanlar arasına ne konulacağını belirler.",
            "explanation": "print fonksiyonunda sep parametresi yazdırılan değerlerin arasına konulacak karakteri ayarlar.",
            "order": 5,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\nprint('Merhaba', end='!')\nprint('Dünya')",
            "question_type": "multiple_choice",
            "options": {"choices": ["Merhaba!\nDünya", "Merhaba!Dünya", "Merhaba\n!Dünya", "Merhaba! Dünya"]},
            "correct_answer": "Merhaba!Dünya",
            "hint": "end parametresi satır sonuna ne ekleneceğini belirtir ve varsayılan yeni satır karakterini (\n) iptal eder.",
            "explanation": "end='!' ile ilk print sonunda yeni satıra geçmek yerine '!' eklenir, ardından gelen Dünya aynı satıra basılır.",
            "order": 6,
        },
        {
            "question_text": "Kullanıcıdan alınan yaş bilgisini integer'a dönüştürmek için boşluğu doldurun:\nyas = ___(input('Yaşınız: '))",
            "question_type": "fill_in_blank",
            "correct_answer": "int",
            "hint": "Tam sayı dönüşüm fonksiyonu.",
            "explanation": "Kullanıcı girdisi her zaman string'dir. Tam sayıya dönüştürmek için int() kullanılır.",
            "code_block": "yas = ___(input('Yaşınız: '))",
            "word_bank": {"words": ["int", "str", "float", "val"]},
            "order": 7,
        },
        {
            "question_text": "Hatalı satırı bulun:\nyas_str = input('Yasiniz: ')\nyas = int(yas_str)\nprint('Seneye yasiniz: ' + yas + 1)",
            "question_type": "spot_the_bug",
            "code_block": "yas_str = input('Yasiniz: ')\nyas = int(yas_str)\nprint('Seneye yasiniz: ' + yas + 1)",
            "correct_answer": "2|print('Seneye yasiniz: ' + str(yas + 1))",
            "correct_line_index": 2,
            "options": {"fix_options": ["print('Seneye yasiniz: ' + str(yas + 1))", "print('Seneye yasiniz: ' + (yas + 1))"]},
            "hint": "Metinle tam sayıyı doğrudan birleştiremezsiniz.",
            "explanation": "Hesaplanan yeni yaş tam sayı olduğundan, metinle birleştirmek için str() içine alınmalıdır.",
            "order": 8,
        }
    ],
    "Mini Pratik": [
        {
            "question_text": "a = 5\nb = 2\nprint(a % b) çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["2.5", "2", "1", "0"]},
            "correct_answer": "1",
            "hint": "Modulo (%) operatörü bölme işleminden kalan sayıyı verir.",
            "explanation": "5'in 2'ye bölümünden kalan 1'dir. Modulo operatörü (%) kalanı döndürür.",
            "order": 5,
        },
        {
            "question_text": "print(float(5)) ifadesinin çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["5", "5.0", "Hata", "5f"]},
            "correct_answer": "5.0",
            "hint": "float fonksiyonu tam sayıları ondalıklıya dönüştürür.",
            "explanation": "float() fonksiyonu parametresini ondalıklı sayı tipine çevirir. 5 tam sayısı 5.0 olur.",
            "order": 6,
        },
        {
            "question_text": "String'in uzunluğunu ekrana yazdırmak için boşluğu doldurun:\nprint(___('kodlama'))",
            "question_type": "fill_in_blank",
            "correct_answer": "len",
            "hint": "Uzunluk (length) kelimesinin kısaltması.",
            "explanation": "Koleksiyonların veya stringlerin karakter uzunluğunu bulmak için len() fonksiyonu kullanılır.",
            "code_block": "print(___('kodlama'))",
            "word_bank": {"words": ["len", "length", "size", "count"]},
            "order": 7,
        },
        {
            "question_text": "a = 10\nb = 3\nprint(a // b) çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["3.33", "3", "4", "1"]},
            "correct_answer": "3",
            "hint": "Çift bölme işareti taban bölme (floor division) yapar.",
            "explanation": "a // b ifadesi bölme sonucunu aşağıya yuvarlayarak tam sayı kısmı olan 3'ü verir.",
            "order": 8,
        }
    ],
    "Liste Nedir?": [
        {
            "question_text": "Python'da listenin elemanlarını virgülle ayırırız.",
            "question_type": "true_false_reason",
            "options": {"reasons": ["Doğrudur, her eleman arasına virgül konmalıdır.", "Yanlıştır, elemanlar boşlukla ayrılır."]},
            "correct_answer": "true|0",
            "hint": "Listenin yazım biçimini düşünün.",
            "explanation": "Listede elemanlar arasında virgül kullanılır: [1, 2, 3].",
            "order": 5,
        },
        {
            "question_text": "liste = [10, 20, 30]\nliste2 = liste\nliste[0] = 99\nprint(liste2[0]) çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["10", "99", "Hata", "30"]},
            "correct_answer": "99",
            "hint": "Referans atama durumuna dikkat edin.",
            "explanation": "liste2 = liste ataması referans kopyalamadır. liste üzerinde yapılan değişiklik liste2'yi de etkiler.",
            "order": 6,
        },
        {
            "question_text": "Aşağıdakilerden hangisi geçerli bir Python listesidir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["{1, 2, 3}", "[1; 2; 3]", "[1, 'iki', True]", "(1, 2, 3)"]},
            "correct_answer": "[1, 'iki', True]",
            "hint": "Köşeli parantez ve virgül kullanımına bakın.",
            "explanation": "Listeler köşeli parantezle tanımlanır ve heterojen (farklı türden) elemanlar içerebilir.",
            "order": 7,
        },
        {
            "question_text": "Hatalı satırı bulun:\nliste = [1, 2, 3]\nprint(liste.length)",
            "question_type": "spot_the_bug",
            "code_block": "liste = [1, 2, 3]\nprint(liste.length)",
            "correct_answer": "1|print(len(liste))",
            "correct_line_index": 1,
            "options": {"fix_options": ["print(len(liste))", "print(liste.size())"]},
            "hint": "Python listelerinde uzunluğu bulmak için yerleşik bir fonksiyon kullanılır.",
            "explanation": "Python'da listelerin length adında bir özniteliği yoktur. Uzunluk len(liste) ile bulunur.",
            "order": 8,
        }
    ],
    "Liste Elemanlarına Erişim": [
        {
            "question_text": "liste = [1, 2, 3, 4, 5]\nprint(liste[1:3]) çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["[1, 2]", "[2, 3]", "[2, 3, 4]", "[3, 4]"]},
            "correct_answer": "[2, 3]",
            "hint": "1. indeksten başla, 3. indekse kadar git (3 hariç).",
            "explanation": "1. indeks 2, 2. indeks 3'tür. 3. indeks 4 dahil edilmez. Sonuç [2, 3] listesidir.",
            "order": 5,
        },
        {
            "question_text": "liste = [10, 20, 30]\nprint(liste[3]) çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["30", "None", "Hata (IndexError)", "0"]},
            "correct_answer": "Hata (IndexError)",
            "hint": "Listenin sınırlarını kontrol edin.",
            "explanation": "Liste 3 elemanlıdır (indeksler 0, 1, 2). 3. indeks olmadığı için IndexError hatası alınır.",
            "order": 6,
        },
        {
            "question_text": "Bir listenin son 2 elemanını almak için boşluğu doldurun:\nliste = [1, 2, 3, 4]\nson_iki = liste[___:]",
            "question_type": "fill_in_blank",
            "correct_answer": "-2",
            "hint": "Negatif dilimleme indeksini düşünün.",
            "explanation": "-2 indeksi sondan ikinci elemanı belirtir. -2'den sonuna kadar gitmek son iki elemanı verir.",
            "code_block": "liste = [1, 2, 3, 4]\nson_iki = liste[___:]",
            "word_bank": {"words": ["-2", "2", "-1", "3"]},
            "order": 7,
        },
        {
            "question_text": "liste = [1, 2, [3, 4]]\nprint(liste[2][0]) ifadesinin çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["3", "4", "[3, 4]", "2"]},
            "correct_answer": "3",
            "hint": "İç içe geçmiş listelere erişimi düşünün.",
            "explanation": "liste[2] ifadesi içteki listeyi [3, 4] verir. liste[2][0] ise bu listenin ilk elemanı olan 3'tür.",
            "order": 8,
        }
    ],
    "Listeye Eleman Ekleme/Silme": [
        {
            "question_text": "liste = [1, 2]\nliste.extend([3, 4])\nprint(len(liste)) çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["3", "4", "5", "Hata"]},
            "correct_answer": "4",
            "hint": "extend metodu verilen listenin elemanlarını tek tek ekler.",
            "explanation": "extend([3, 4]) listenin sonuna 3 ve 4'ü ekleyerek [1, 2, 3, 4] yapar. Uzunluk 4 olur.",
            "order": 5,
        },
        {
            "question_text": "liste = [1, 2]\nliste.append([3, 4])\nprint(len(liste)) çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["3", "4", "2", "Hata"]},
            "correct_answer": "3",
            "hint": "append metodu verilen nesneyi tek bir eleman olarak sonuna ekler.",
            "explanation": "append([3, 4]) listeyi olduğu gibi ekleyerek [1, 2, [3, 4]] yapar. Bu durumda 3 eleman vardır.",
            "order": 6,
        },
        {
            "question_text": "Listeyi tamamen boşaltmak için boşluğu doldurun:\nliste = [1, 2, 3]\nliste.___()",
            "question_type": "fill_in_blank",
            "correct_answer": "clear",
            "hint": "Temizlemek anlamına gelen İngilizce kelime.",
            "explanation": "clear() metodu listedeki tüm elemanları silerek boş liste haline getirir.",
            "code_block": "liste = [1, 2, 3]\nliste.___()",
            "word_bank": {"words": ["clear", "empty", "remove", "pop"]},
            "order": 7,
        },
        {
            "question_text": "liste = [1, 2, 3]\ndel liste[1]\nprint(liste) çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["[1, 3]", "[1, 2]", "[2, 3]", "[3]"]},
            "correct_answer": "[1, 3]",
            "hint": "del anahtar kelimesi belirtilen indeksteki elemanı siler.",
            "explanation": "1. indeksteki eleman 2'dir. del liste[1] ile 2 silinir ve geriye [1, 3] kalır.",
            "order": 8,
        }
    ],
    "Liste Üzerinde Döngü": [
        {
            "question_text": "liste = ['a', 'b', 'c']\nfor idx, val in enumerate(liste):\n    if val == 'b':\n        print(idx)\nçıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["0", "1", "2", "b"]},
            "correct_answer": "1",
            "hint": "enumerate fonksiyonu (indeks, değer) ikililerini döndürür.",
            "explanation": "val 'b' olduğunda indeks (idx) 1'dir. Dolayısıyla ekrana 1 yazdırılır.",
            "order": 5,
        },
        {
            "question_text": "Döngüyü tamamlayıp elemanları yazdırmak için boşluğu doldurun:\nliste = [1, 2]\n___ x in liste:\n    print(x)",
            "question_type": "fill_in_blank",
            "correct_answer": "for",
            "hint": "Python'daki standart yineleme döngüsü anahtar kelimesi.",
            "explanation": "Koleksiyon elemanları üzerinde dönmek için 'for' döngüsü kullanılır.",
            "code_block": "liste = [1, 2]\n___ x in liste:\n    print(x)",
            "word_bank": {"words": ["for", "while", "each", "in"]},
            "order": 6,
        },
        {
            "question_text": "liste = [1, 2, 3]\ncarpim = 1\nfor x in liste:\n    carpim *= x\nprint(carpim) çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["6", "5", "3", "0"]},
            "correct_answer": "6",
            "hint": "Listedeki tüm elemanları sırayla çarparak carpim değişkeninde biriktirin.",
            "explanation": "Carpim: 1 * 1 = 1 -> 1 * 2 = 2 -> 2 * 3 = 6 olur.",
            "order": 7,
        },
        {
            "question_text": "Hatalı satırı bulun:\nliste = [1, 2, 3]\nfor i in range(liste):\n    print(liste[i])",
            "question_type": "spot_the_bug",
            "code_block": "liste = [1, 2, 3]\nfor i in range(liste):\n    print(liste[i])",
            "correct_answer": "1|for i in range(len(liste)):",
            "correct_line_index": 1,
            "options": {"fix_options": ["for i in range(len(liste)):", "for i in len(liste):"]},
            "hint": "range() fonksiyonu sadece tamsayı alabilir, liste alamaz.",
            "explanation": "range(liste) geçersizdir çünkü range() parametre olarak tamsayı bekler. Listenin boyutu için range(len(liste)) olmalıdır.",
            "order": 8,
        }
    ],
    "Liste Mini Görevi": [
        {
            "question_text": "Bir listenin eleman sayısını doğrudan bulan yerleşik fonksiyon hangisidir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["size()", "count()", "len()", "length()"]},
            "correct_answer": "len()",
            "hint": "String uzunluğunda da kullanılır.",
            "explanation": "len() fonksiyonu listenin eleman sayısını döner.",
            "order": 5,
        },
        {
            "question_text": "liste = [5, 2, 8]\nliste.reverse()\nprint(liste) çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["[8, 2, 5]", "[2, 5, 8]", "[8, 5, 2]", "None"]},
            "correct_answer": "[8, 2, 5]",
            "hint": "reverse metodu listeyi yerinde ters çevirir.",
            "explanation": "reverse() listenin sıralamasını sondan başa doğru tersine çevirerek listeyi [8, 2, 5] yapar.",
            "order": 6,
        },
        {
            "question_text": "Listenin en büyük elemanını bulmak için boşluğu doldurun:\nliste = [1, 5, 3]\nen_buyuk = ___(liste)",
            "question_type": "fill_in_blank",
            "correct_answer": "max",
            "hint": "Maximum kelimesinin kısaltması.",
            "explanation": "max() fonksiyonu koleksiyondaki en büyük değeri döndürür.",
            "code_block": "liste = [1, 5, 3]\nen_buyuk = ___(liste)",
            "word_bank": {"words": ["max", "min", "top", "greatest"]},
            "order": 7,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\nliste = [1, 2, 3]\nprint(liste.index(2))",
            "question_type": "multiple_choice",
            "options": {"choices": ["1", "2", "0", "Hata"]},
            "correct_answer": "1",
            "hint": "index() metodu aranan elemanın indeksini döner.",
            "explanation": "2 elemanı listenin 1. indeksinde yer almaktadır (0. indeks 1'dir).",
            "order": 8,
        }
    ],
    "if Mantığı": [
        {
            "question_text": "Python'da if koşulunun parantez içine alınması zorunludur.",
            "question_type": "true_false_reason",
            "options": {"reasons": ["Doğrudur, if (x > 5): yazılması şarttır.", "Yanlıştır, parantez yazılmasa da çalışır, isteğe bağlıdır."]},
            "correct_answer": "false|1",
            "hint": "Python'ın sade sözdizimini düşünün.",
            "explanation": "Python'da if koşullarında parantez zorunlu değildir. if x > 5: yazmak standarttır.",
            "order": 5,
        },
        {
            "question_text": "x = 10\nif x > 5:\nprint('Buyuk')\nkodunun çalıştırılma sonucu nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["Buyuk yazar", "Hiçbir şey yazmaz", "IndentationError (Girinti Hatası)", "SyntaxError"]},
            "correct_answer": "IndentationError (Girinti Hatası)",
            "hint": "if gövdesinin girintili olup olmadığını kontrol edin.",
            "explanation": "if satırından sonra gelen blok girintili olmalıdır. Girinti yapılmadığı için IndentationError oluşur.",
            "order": 6,
        },
        {
            "question_text": "Koşul ifadesini tamamlamak için boşluğu doldurun:\nx = 5\n___ x == 5:\n    print('Esit')",
            "question_type": "fill_in_blank",
            "correct_answer": "if",
            "hint": "Eğer anlamına gelen İngilizce kelime.",
            "explanation": "Koşul kontrolü başlatmak için 'if' kelimesi kullanılır.",
            "code_block": "x = 5\n___ x == 5:\n    print('Esit')",
            "word_bank": {"words": ["if", "when", "check", "cond"]},
            "order": 7,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\nx = 0\nif x:\n    print('Doğru')\nelse:\n    print('Yanlış')",
            "question_type": "multiple_choice",
            "options": {"choices": ["Doğru", "Yanlış", "Hiçbiri", "Hata"]},
            "correct_answer": "Yanlış",
            "hint": "0 sayısı mantıksal olarak False kabul edilir.",
            "explanation": "Python'da 0 sayısı, boş stringler ve boş koleksiyonlar mantıksal olarak False kabul edilir. Bu nedenle else bloğu çalışır.",
            "order": 8,
        }
    ],
    "elif / else": [
        {
            "question_text": "Birden fazla koşul zinciri kurarken if ve else arasına hangi anahtar kelime eklenir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["elseif", "elif", "else if", "elsif"]},
            "correct_answer": "elif",
            "hint": "Else ve if kelimelerinin birleşimi.",
            "explanation": "Python'da 'else if' yerine 'elif' anahtar kelimesi kullanılır.",
            "order": 5,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\nx = 10\nif x > 20:\n    print('A')\nelif x > 5:\n    print('B')\nelse:\n    print('C')",
            "question_type": "multiple_choice",
            "options": {"choices": ["A", "B", "C", "B ve C"]},
            "correct_answer": "B",
            "hint": "İlk doğru olan koşul çalışır.",
            "explanation": "10 > 20 False'tur. 10 > 5 True'dur ve B basılır. Bir koşul uyunca if-elif zincirinden çıkılır.",
            "order": 6,
        },
        {
            "question_text": "Koşullar sağlanmadığında varsayılan olarak çalışacak bloğu doldurun:\nx = 3\nif x > 5:\n    print('A')\n___:\n    print('B')",
            "question_type": "fill_in_blank",
            "correct_answer": "else",
            "hint": "Aksi takdirde anlamına gelen kelime.",
            "explanation": "Koşulların hiçbiri uymadığında varsayılan olarak çalışan blok 'else' bloğudur.",
            "code_block": "x = 3\nif x > 5:\n    print('A')\n___:\n    print('B')",
            "word_bank": {"words": ["else", "elif", "default", "otherwise"]},
            "order": 7,
        },
        {
            "question_text": "Hatalı satırı bulun:\nx = 5\nelse:\n    print('A')",
            "question_type": "spot_the_bug",
            "code_block": "x = 5\nelse:\n    print('A')",
            "correct_answer": "1|if x != 5:\n    pass\nelse:",
            "correct_line_index": 1,
            "options": {"fix_options": ["if x != 5:\n    pass\nelse:", "elif x == 5:"]},
            "hint": "else ifadesi tek başına kullanılamaz, mutlaka bir if bloğuna bağlı olmalıdır.",
            "explanation": "Bir if koşulu olmadan else kullanılamaz. else'ten önce bir if koşulu olmalıdır.",
            "order": 8,
        }
    ],
    "Karşılaştırma Operatörleri": [
        {
            "question_text": "Python'da büyük veya eşit karşılaştırma operatörü hangisidir?",
            "question_type": "multiple_choice",
            "options": {"choices": [">=", "=>", ">", "=="]},
            "correct_answer": ">=",
            "hint": "Önce büyüktür, sonra eşittir işareti.",
            "explanation": "Büyük veya eşit operatörü >= şeklinde yazılır. => geçersizdir.",
            "order": 5,
        },
        {
            "question_text": "print(10 != 10) ifadesinin çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["True", "False", "None", "Hata"]},
            "correct_answer": "False",
            "hint": "!= operatörü eşit değildir anlamına gelir.",
            "explanation": "10, 10'a eşit olduğundan 10 != 10 (eşit değildir) ifadesi False sonucunu verir.",
            "order": 6,
        },
        {
            "question_text": "Eşit değildir kontrolü yapmak için boşluğu doldurun:\nsayi = 5\nif sayi ___ 0:\n    print('Sıfır değil')",
            "question_type": "fill_in_blank",
            "correct_answer": "!=",
            "hint": "Ünlem ve eşittir işaretleri.",
            "explanation": "Eşit değildir kontrolü yapmak için != operatörü kullanılır.",
            "code_block": "sayi = 5\nif sayi ___ 0:\n    print('Sıfır değil')",
            "word_bank": {"words": ["!=", "==", "=", "<>"]},
            "order": 7,
        },
        {
            "question_text": "Aşağıdaki ifadelerden hangisi True döndürür?",
            "question_type": "multiple_choice",
            "options": {"choices": ["'abc' < 'abcd'", "5 < 3", "10 == 10.1", "False != False"]},
            "correct_answer": "'abc' < 'abcd'",
            "hint": "Stringlerin alfabetik olarak karşılaştırıldığını hatırlayın.",
            "explanation": "'abc' stringi alfabetik sırada 'abcd' den önce gelir ve daha kısadır, bu yüzden ifade True döner.",
            "order": 8,
        }
    ],
    "İç İçe Koşullar": [
        {
            "question_text": "İç içe koşullarda içteki bloğu oluştururken girinti seviyesi nasıl olmalıdır?",
            "question_type": "multiple_choice",
            "options": {"choices": ["Aynı kalmalıdır", "4 boşluk daha içeri girintilenmelidir", "Geriye alınmalıdır", "Fark etmez"]},
            "correct_answer": "4 boşluk daha içeri girintilenmelidir",
            "hint": "Her yeni blokta girinti artar.",
            "explanation": "Python'da her alt blok (iç içe if gibi) 4 boşluk daha içeri girintilenerek yazılmalıdır.",
            "order": 5,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\nx = 10\ny = 20\nif x > 5:\n    if y > 15:\n        print('A')\n    else:\n        print('B')",
            "question_type": "multiple_choice",
            "options": {"choices": ["A", "B", "Hiçbir şey", "Hata"]},
            "correct_answer": "A",
            "hint": "Koşulları dıştan içe doğru takip edin.",
            "explanation": "x > 5 (10 > 5) True'dur ve içteki if'e girilir. y > 15 (20 > 15) de True olduğundan A yazdırılır.",
            "order": 6,
        },
        {
            "question_text": "İç içe if yapısını tek satırda birleştirmek için boşluğu doldurun:\nif x > 0 ___ y > 0:\n    print('İkisi de pozitif')",
            "question_type": "fill_in_blank",
            "correct_answer": "and",
            "hint": "VE anlamına gelen mantıksal bağlaç.",
            "explanation": "İki koşulun da aynı anda sağlanması gerekiyorsa 'and' operatörü ile birleştirilir.",
            "code_block": "if x > 0 ___ y > 0:\n    print('İkisi de pozitif')",
            "word_bank": {"words": ["and", "or", "&&", "with"]},
            "order": 7,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\nx = 3\nif x > 5:\n    if x < 10:\n        print('A')\nelse:\n    print('B')",
            "question_type": "multiple_choice",
            "options": {"choices": ["A", "B", "Hiçbir şey", "Hata"]},
            "correct_answer": "B",
            "hint": "İlk koşulun False olduğunu unutmayın.",
            "explanation": "x > 5 (3 > 5) False olduğundan en dıştaki else bloğu çalışır ve B basılır.",
            "order": 8,
        }
    ],
    "Koşul Mini Görevi": [
        {
            "question_text": "Bir sayının 5'e bölünüp bölünmediğini kontrol eden koşul hangisidir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["sayi / 5 == 0", "sayi % 5 == 0", "sayi // 5 == 0", "sayi % 5 != 0"]},
            "correct_answer": "sayi % 5 == 0",
            "hint": "Kalanı bulmak için % operatörünü kullanın.",
            "explanation": "Bir sayının 5'e kalansız bölündüğünü sayi % 5 == 0 ifadesi kontrol eder.",
            "order": 5,
        },
        {
            "question_text": "yas = 18\nehliyet = True\nif yas >= 18 and ehliyet:\n    print('Giriş')\nçıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["Giriş", "Hiçbir şey", "Hata", "False"]},
            "correct_answer": "Giriş",
            "hint": "yas >= 18 ve ehliyet koşullarının ikisi de True mu?",
            "explanation": "İki koşul da True olduğundan if bloğu çalışır ve Giriş yazdırılır.",
            "order": 6,
        },
        {
            "question_text": "Metin uzunluğu kontrolü için boşluğu doldurun:\ns = 'python'\nif ___ > 5:\n    print('Uzun')",
            "question_type": "fill_in_blank",
            "correct_answer": "len(s)",
            "hint": "String uzunluk bulma fonksiyonunu s ile çağırın.",
            "explanation": "String s'in uzunluğu len(s) ile bulunur ve 6 sayısı 5'ten büyüktür.",
            "code_block": "s = 'python'\nif ___ > 5:\n    print('Uzun')",
            "word_bank": {"words": ["len(s)", "s.length()", "size(s)", "s.len"]},
            "order": 7,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\nx = 10\nif x > 5:\n    x += 5\nelif x > 10:\n    x += 10\nprint(x)",
            "question_type": "multiple_choice",
            "options": {"choices": ["10", "15", "25", "Hata"]},
            "correct_answer": "15",
            "hint": "if-elif yapısında sadece ilk doğru blok çalışır.",
            "explanation": "x > 5 True olduğu için x += 5 çalışır ve x 15 olur. elif bloğu atlanır.",
            "order": 8,
        }
    ],
    "for Döngüsü": [
        {
            "question_text": "for döngüleri sadece sayı listelerinde çalışabilir.",
            "question_type": "true_false_reason",
            "options": {"reasons": ["Doğrudur, sadece int listelerinde döngü kurulabilir.", "Yanlıştır, string, liste, demet gibi tüm yinelenebilir nesnelerde çalışabilir."]},
            "correct_answer": "false|1",
            "hint": "Farklı türdeki veriler üzerinde dönebilir miyiz?",
            "explanation": "for döngüsü Python'daki tüm iterable (yinelenebilir) nesnelerin (list, str, dict vb.) elemanları üzerinde dönebilir.",
            "order": 5,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\nfor i in 'ab':\n    print(i, end='')",
            "question_type": "multiple_choice",
            "options": {"choices": ["ab", "a\nb", "ab\n", "Hata"]},
            "correct_answer": "ab",
            "hint": "end='' ile yeni satıra geçiş iptal edilmiştir.",
            "explanation": "Döngü 'a' ve 'b' harfleri için çalışır, end='' sebebiyle yan yana 'ab' yazarlar.",
            "order": 6,
        },
        {
            "question_text": "Döngüyü tamamlamak için boşluğu doldurun:\nrenkler = ['kırmızı', 'mavi']\nfor renk ___ renkler:\n    print(renk)",
            "question_type": "fill_in_blank",
            "correct_answer": "in",
            "hint": "İçinde anlamına gelen kelime.",
            "explanation": "for eleman in koleksiyon: sözdizimi için 'in' kelimesi kullanılır.",
            "code_block": "renkler = ['kırmızı', 'mavi']\nfor renk ___ renkler:\n    print(renk)",
            "word_bank": {"words": ["in", "on", "into", "at"]},
            "order": 7,
        },
        {
            "question_text": "Aşağıdaki kod kaç kez çalışır?\nfor i in []:\n    print(i)",
            "question_type": "multiple_choice",
            "options": {"choices": ["0", "1", "Sonsuz", "Hata"]},
            "correct_answer": "0",
            "hint": "Listenin eleman sayısına bakın.",
            "explanation": "Liste boş olduğundan döngü gövdesi hiç çalıştırılmaz.",
            "order": 8,
        }
    ],
    "while Döngüsü": [
        {
            "question_text": "while döngüsünün sonsuz döngüye girmemesi için ne yapılmalıdır?",
            "question_type": "multiple_choice",
            "options": {"choices": ["Koşul değişkeni döngü içinde güncellenmelidir", "if ifadesi eklenmelidir", "pass yazılmalıdır", "Hiçbir şey gerekmez"]},
            "correct_answer": "Koşul değişkeni döngü içinde güncellenmelidir",
            "hint": "Döngü koşulunun bir noktada False olması gerekir.",
            "explanation": "while döngüsünün durması için, test edilen koşulun bir aşamada False olması gerekir. Bu da koşul değişkeninin güncellenmesiyle sağlanır.",
            "order": 5,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\ni = 3\nwhile i > 0:\n    print(i, end='')\n    i -= 1",
            "question_type": "multiple_choice",
            "options": {"choices": ["321", "3210", "3\n2\n1", "Sonsuz döngü"]},
            "correct_answer": "321",
            "hint": "i'nin değerinin her adımda azaldığını takip edin.",
            "explanation": "i sırasıyla 3, 2, 1 olur. 0 olduğunda i > 0 koşulu bozulur ve döngü biter. Ekrana 321 basılır.",
            "order": 6,
        },
        {
            "question_text": "Döngü koşulunu tamamlamak için boşluğu doldurun:\ni = 0\n___ i < 3:\n    print(i)\n    i += 1",
            "question_type": "fill_in_blank",
            "correct_answer": "while",
            "hint": "-ken veya sürece anlamına gelen döngü kelimesi.",
            "explanation": "Belirli bir koşul doğru olduğu sürece çalışacak döngüyü 'while' kelimesiyle başlatırız.",
            "code_block": "i = 0\n___ i < 3:\n    print(i)\n    i += 1",
            "word_bank": {"words": ["while", "for", "if", "until"]},
            "order": 7,
        },
        {
            "question_text": "Hatalı satırı bulun:\ni = 0\nwhile i < 5\n    print(i)\n    i += 1",
            "question_type": "spot_the_bug",
            "code_block": "i = 0\nwhile i < 5\n    print(i)\n    i += 1",
            "correct_answer": "1|while i < 5:",
            "correct_line_index": 1,
            "options": {"fix_options": ["while i < 5:", "while (i < 5):"]},
            "hint": "while satırının sonundaki eksik karakteri bulun.",
            "explanation": "Python'da while satırının sonuna iki nokta (:) konmalıdır.",
            "order": 8,
        }
    ],
    "range Kullanımı": [
        {
            "question_text": "range(5) ifadesi hangi sayıları üretir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4", "0, 1, 2, 3, 4, 5", "1, 2, 3, 4"]},
            "correct_answer": "0, 1, 2, 3, 4",
            "hint": "Varsayılan başlangıç değeri 0'dır ve sınır hariçtir.",
            "explanation": "range(N) ifadesi 0'dan N-1'e kadar olan tam sayıları üretir. range(5) -> 0, 1, 2, 3, 4.",
            "order": 5,
        },
        {
            "question_text": "range(2, 8, 2) ifadesinin ürettiği sayılar hangileridir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["2, 4, 6", "2, 4, 6, 8", "4, 6, 8", "2, 3, 4, 5, 6, 7"]},
            "correct_answer": "2, 4, 6",
            "hint": "Başlangıç, bitiş (hariç) ve artış miktarına bakın.",
            "explanation": "2'den başlar, 8'e kadar 2'şer artar: 2, 4, 6. 8 hariçtir.",
            "order": 6,
        },
        {
            "question_text": "Geriye doğru sayılar üretmek için boşluğu doldurun:\nfor i in range(5, 0, ___):\n    print(i)",
            "question_type": "fill_in_blank",
            "correct_answer": "-1",
            "hint": "Azalış miktarını belirtmelisiniz.",
            "explanation": "range(5, 0, -1) ifadesi 5'ten 1'e kadar (0 hariç) geriye doğru sayılar üretir.",
            "code_block": "for i in range(5, 0, ___):\n    print(i)",
            "word_bank": {"words": ["-1", "0", "1", "-2"]},
            "order": 7,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\nprint(list(range(3)))",
            "question_type": "multiple_choice",
            "options": {"choices": ["[0, 1, 2]", "[1, 2, 3]", "[0, 1, 2, 3]", "range(3)"]},
            "correct_answer": "[0, 1, 2]",
            "hint": "range nesnesini listeye dönüştürün.",
            "explanation": "list() fonksiyonu range üreticisini listeye çevirir. range(3) -> 0, 1, 2 olduğundan [0, 1, 2] olur.",
            "order": 8,
        }
    ],
    "break / continue": [
        {
            "question_text": "Döngüyü tamamen sonlandırmak için hangi anahtar kelime kullanılır?",
            "question_type": "multiple_choice",
            "options": {"choices": ["continue", "break", "exit", "stop"]},
            "correct_answer": "break",
            "hint": "Kırmak anlamına gelen İngilizce kelime.",
            "explanation": "break ifadesi içinde bulunulan döngüyü derhal sonlandırır.",
            "order": 5,
        },
        {
            "question_text": "Döngünün o anki adımını atlayıp bir sonraki adıma geçmesini sağlayan ifade hangisidir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["break", "continue", "skip", "next"]},
            "correct_answer": "continue",
            "hint": "Devam etmek anlamına gelen İngilizce kelime.",
            "explanation": "continue ifadesi döngünün geri kalan kodlarını çalıştırmadan bir sonraki iterasyona geçer.",
            "order": 6,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\nfor i in range(4):\n    if i == 2:\n        continue\n    print(i, end='')",
            "question_type": "multiple_choice",
            "options": {"choices": ["013", "0123", "01", "3"]},
            "correct_answer": "013",
            "hint": "i, 2 olduğunda continue nedeniyle print edilmez.",
            "explanation": "0, 1 yazdırılır. 2 olunca continue ile adım atlanır. Sonra 3 yazdırılır. Sonuç 013 olur.",
            "order": 7,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\nfor i in range(4):\n    if i == 2:\n        break\n    print(i, end='')",
            "question_type": "multiple_choice",
            "options": {"choices": ["01", "013", "012", "0123"]},
            "correct_answer": "01",
            "hint": "break döngüyü tamamen bitirir.",
            "explanation": "0, 1 yazdırılır. 2 olunca break ile döngü tamamen sonlandırılır. Sonuç 01 olur.",
            "order": 8,
        }
    ],
    "Döngü Mini Görevi": [
        {
            "question_text": "Sonsuz döngü oluşturan geçerli yapı hangisidir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["while True:", "for i in range(inf):", "while False:", "for i in infinite:"]},
            "correct_answer": "while True:",
            "hint": "Koşulun her zaman doğru olacağı bir while döngüsü düşünün.",
            "explanation": "while True: ifadesi koşul her zaman True kalacağı için sonsuz döngü oluşturur.",
            "order": 5,
        },
        {
            "question_text": "10'dan 1'e kadar geriye doğru sayan döngü parametre boşluğunu doldurun:\nfor i in range(10, 0, ___):\n    print(i)",
            "question_type": "fill_in_blank",
            "correct_answer": "-1",
            "hint": "Adım miktarını negatif olarak ayarlayın.",
            "explanation": "Geriye doğru 1'er azalma için adım parametresi -1 olmalıdır.",
            "code_block": "for i in range(10, 0, ___):\n    print(i)",
            "word_bank": {"words": ["-1", "1", "0", "-2"]},
            "order": 6,
        },
        {
            "question_text": "print([x * 2 for x in range(3)]) ifadesinin çıktısı nedir?",
            "question_type": "multiple_choice",
            "options": {"choices": ["[0, 2, 4]", "[2, 4, 6]", "[0, 1, 2]", "[0, 2, 4, 6]"]},
            "correct_answer": "[0, 2, 4]",
            "hint": "range(3) 0, 1, 2 üretir. Her birini 2 ile çarpın.",
            "explanation": "range(3) -> 0, 1, 2. List comprehension ile her eleman 2 ile çarpılır: [0, 2, 4].",
            "order": 7,
        },
        {
            "question_text": "Hatalı satırı bulun:\ni = 5\nwhile i > 0:\n    print(i)\n    i = i + 1",
            "question_type": "spot_the_bug",
            "code_block": "i = 5\nwhile i > 0:\n    print(i)\n    i = i + 1",
            "correct_answer": "3|    i = i - 1",
            "correct_line_index": 3,
            "options": {"fix_options": ["    i = i - 1", "    i -= 1"]},
            "hint": "i'nin değerinin sürekli arttığını ve döngü koşulunun hiçbir zaman bozulmayacağını fark edin.",
            "explanation": "i arttıkça i > 0 koşulu hep doğru kalır ve sonsuz döngü oluşur. Döngünün bitmesi için i azaltılmalıdır: i = i - 1 veya i -= 1.",
            "order": 8,
        }
    ],
    "Fonksiyon Nedir?": [
        {
            "question_text": "Python'da bir fonksiyon tanımlamak için hangi anahtar kelime kullanılır?",
            "question_type": "multiple_choice",
            "options": {"choices": ["func", "def", "function", "define"]},
            "correct_answer": "def",
            "hint": "Define kelimesinin ilk üç harfi.",
            "explanation": "Python'da fonksiyonlar 'def' (definition) anahtar kelimesiyle tanımlanır.",
            "order": 5,
        },
        {
            "question_text": "Bir fonksiyonu çalıştırmak (çağırmak) için hangi sözdizimi kullanılır?",
            "question_type": "multiple_choice",
            "options": {"choices": ["fonksiyon_adi", "fonksiyon_adi()", "call fonksiyon_adi", "run fonksiyon_adi"]},
            "correct_answer": "fonksiyon_adi()",
            "hint": "Fonksiyon adının arkasından gelen parantezler.",
            "explanation": "Fonksiyonları parantez ekleyerek çağırırız: fonksiyon_adi().",
            "order": 6,
        },
        {
            "question_text": "Fonksiyon tanımlamak için boşluğu doldurun:\n___ selamla():\n    print('Merhaba')",
            "question_type": "fill_in_blank",
            "correct_answer": "def",
            "hint": "Fonksiyon tanımlama kelimesi.",
            "explanation": "Fonksiyon 'def selamla():' şeklinde tanımlanır.",
            "code_block": "___ selamla():\n    print('Merhaba')",
            "word_bank": {"words": ["def", "func", "selamla", "define"]},
            "order": 7,
        },
        {
            "question_text": "Bir fonksiyon tanımlandığı anda otomatik olarak çalışır.",
            "question_type": "true_false_reason",
            "options": {"reasons": ["Doğrudur, tanımlandığı yerde hemen yürütülür.", "Yanlıştır, sadece çağrıldığı (invoke edildiği) zaman çalışır."]},
            "correct_answer": "false|1",
            "hint": "Fonksiyonun çağrılma mantığını düşünün.",
            "explanation": "Fonksiyon tanımlanmakla çalışmaz. Çalışması için açıkça çağrılması gerekir.",
            "order": 8,
        }
    ],
    "Parametreler": [
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\ndef yaz(metin='test'):\n    print(metin)\nyaz()",
            "question_type": "multiple_choice",
            "options": {"choices": ["test", "None", "Hata", "Boş satır"]},
            "correct_answer": "test",
            "hint": "Varsayılan (default) parametre değerini göz önünde bulundurun.",
            "explanation": "metin parametresine varsayılan olarak 'test' atanmıştır. Argümansız çağrıda varsayılan değer yazdırılır.",
            "order": 5,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\ndef topla(a, b):\n    print(a + b)\ntopla(b=3, a=2)",
            "question_type": "multiple_choice",
            "options": {"choices": ["5", "Hata", "None", "23"]},
            "correct_answer": "5",
            "hint": "İsimlendirilmiş argümanlar (keyword arguments) sırayı bozsa da eşlemeyi doğru yapar.",
            "explanation": "b=3 ve a=2 atamasıyla parametreler isimlerine göre eşleşir. Toplam 5 olur.",
            "order": 6,
        },
        {
            "question_text": "Varsayılan parametreli fonksiyonu tamamlamak için boşluğu doldurun:\ndef selamla(isim___'Ziyaretçi'):\n    print('Merhaba ' + isim)",
            "question_type": "fill_in_blank",
            "correct_answer": "=",
            "hint": "Değer atama operatörü.",
            "explanation": "Parametrelere varsayılan değer atamak için = operatörü kullanılır: isim='Ziyaretçi'.",
            "code_block": "def selamla(isim___'Ziyaretçi'):\n    print('Merhaba ' + isim)",
            "word_bank": {"words": ["=", "==", ":", "as"]},
            "order": 7,
        },
        {
            "question_text": "Bir fonksiyona sınırsız sayıda pozisyonel argüman göndermek için hangi parametre yapısı kullanılır?",
            "question_type": "multiple_choice",
            "options": {"choices": ["*args", "**kwargs", "args*", "list args"]},
            "correct_answer": "*args",
            "hint": "Tek yıldızlı parametre.",
            "explanation": "*args yapısı fonksiyona gönderilen tüm pozisyonel argümanları bir demet (tuple) olarak toplar.",
            "order": 8,
        }
    ],
    "return": [
        {
            "question_text": "Bir fonksiyondan değer döndürmek için hangi anahtar kelime kullanılır?",
            "question_type": "multiple_choice",
            "options": {"choices": ["give", "send", "return", "output"]},
            "correct_answer": "return",
            "hint": "Geri döndürmek anlamındaki kelime.",
            "explanation": "Fonksiyonların değer üretip çağıran yere geri göndermesi için 'return' kullanılır.",
            "order": 5,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\ndef f():\n    return 5\n    return 10\nprint(f())",
            "question_type": "multiple_choice",
            "options": {"choices": ["5", "10", "15", "Hata"]},
            "correct_answer": "5",
            "hint": "return ifadesi fonksiyonu sonlandırır.",
            "explanation": "İlk return 5 ifadesi değeri döndürür ve fonksiyondan çıkılmasını sağlar. Sonraki satır çalıştırılmaz.",
            "order": 6,
        },
        {
            "question_text": "Herhangi bir return ifadesi içermeyen Python fonksiyonları varsayılan olarak ne döndürür?",
            "question_type": "multiple_choice",
            "options": {"choices": ["None", "0", "Boş string", "Hata"]},
            "correct_answer": "None",
            "hint": "Python'daki özel boş değer tipi.",
            "explanation": "Değer döndürmeyen fonksiyonlar varsayılan olarak None nesnesini döner.",
            "order": 7,
        },
        {
            "question_text": "Fonksiyonun karesini döndürmesi için boşluğu doldurun:\ndef kare_al(x):\n    ___ x * x",
            "question_type": "fill_in_blank",
            "correct_answer": "return",
            "hint": "Değeri geri gönderme ifadesi.",
            "explanation": "Kare sonucunu döndürmek için 'return x * x' yazılır.",
            "code_block": "def kare_al(x):\n    ___ x * x",
            "word_bank": {"words": ["return", "give", "result", "output"]},
            "order": 8,
        }
    ],
    "Scope Mantığı": [
        {
            "question_text": "Fonksiyon dışında tanımlanan bir değişken fonksiyon içinden okunabilir.",
            "question_type": "true_false_reason",
            "options": {"reasons": ["Doğrudur, global scope'taki değişkenler lokalden okunabilir.", "Yanlıştır, lokal scope dışını göremez."]},
            "correct_answer": "true|0",
            "hint": "Global ve lokal değişken ilişkisini düşünün.",
            "explanation": "Global scope'taki değişkenler fonksiyon içinden doğrudan okunabilir, ancak yazmak için global anahtar kelimesi gerekir.",
            "order": 5,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\nx = 10\ndef f():\n    x = 20\nf()\nprint(x)",
            "question_type": "multiple_choice",
            "options": {"choices": ["10", "20", "Hata", "None"]},
            "correct_answer": "10",
            "hint": "Fonksiyon içindeki x değişkeni lokal bir değişkendir.",
            "explanation": "Fonksiyon içindeki x = 20 ifadesi lokal x tanımlar. Dıştaki global x'in değerini (10) değiştirmez.",
            "order": 6,
        },
        {
            "question_text": "Fonksiyon içinden global bir değişkeni değiştirmek için hangi anahtar kelime kullanılır?",
            "question_type": "multiple_choice",
            "options": {"choices": ["global", "outer", "public", "extern"]},
            "correct_answer": "global",
            "hint": "Evrensel / küresel anlamına gelen kelime.",
            "explanation": "Global scope'taki bir değişkene yazmak için fonksiyon başında 'global x' bildirimi yapılmalıdır.",
            "order": 7,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\ndef f():\n    lokal_var = 5\nf()\nprint(lokal_var)",
            "question_type": "multiple_choice",
            "options": {"choices": ["5", "None", "NameError (Hata)", "0"]},
            "correct_answer": "NameError (Hata)",
            "hint": "Lokal değişkenlerin fonksiyon dışındaki varlığını düşünün.",
            "explanation": "lokal_var sadece f() fonksiyonunun lokal scope'unda geçerlidir. Fonksiyon bittikten sonra erişilemez ve NameError hatası verir.",
            "order": 8,
        }
    ],
    "Fonksiyon Mini Görevi": [
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\ndef selamla(isim):\n    return 'Merhaba ' + isim\nprint(selamla('Ahmet'))",
            "question_type": "multiple_choice",
            "options": {"choices": ["Merhaba Ahmet", "Merhaba ", "Ahmet", "Hata"]},
            "correct_answer": "Merhaba Ahmet",
            "hint": "Fonksiyona gelen argümanı metne birleştirip geri döndürüyoruz.",
            "explanation": "selamla('Ahmet') Ahmet ismini parametre olarak alır ve 'Merhaba Ahmet' metnini döner.",
            "order": 5,
        },
        {
            "question_text": "Aşağıdaki kodun çıktısı nedir?\ndef f(x):\n    return x + 1\nprint(f(f(1)))",
            "question_type": "multiple_choice",
            "options": {"choices": ["2", "3", "4", "Hata"]},
            "correct_answer": "3",
            "hint": "Önce içteki f(1) ifadesini hesaplayın, sonra sonucu dıştaki f'e geçirin.",
            "explanation": "İçteki f(1) = 2'dir. Dıştaki f(2) ise 2 + 1 = 3 sonucunu verir.",
            "order": 6,
        },
        {
            "question_text": "Fonksiyonun parametre almadığında varsayılan olarak 1 eklemesi için boşluğu doldurun:\ndef ekle(sayi, miktar___1):\n    return sayi + miktar",
            "question_type": "fill_in_blank",
            "correct_answer": "=",
            "hint": "Parametre atama operatörü.",
            "explanation": "Varsayılan değer tanımlamak için miktar=1 şeklinde eşittir kullanılır.",
            "code_block": "def ekle(sayi, miktar___1):\n    return sayi + miktar",
            "word_bank": {"words": ["=", "==", "default", "is"]},
            "order": 7,
        },
        {
            "question_text": "Hatalı satırı bulun:\ndef carp(a, b)\n    return a * b",
            "question_type": "spot_the_bug",
            "code_block": "def carp(a, b)\n    return a * b",
            "correct_answer": "0|def carp(a, b):",
            "correct_line_index": 0,
            "options": {"fix_options": ["def carp(a, b):", "def carp(a, b) -> int:"]},
            "hint": "Fonksiyon imzasının sonundaki eksik karakteri bulun.",
            "explanation": "Python'da fonksiyon tanımının (def) sonuna iki nokta (:) konmalıdır.",
            "order": 8,
        }
    ]
}

# 1. Update existing questions to have order 1,2,3,4 and ensure they have explanations (default if missing)
# 2. Append new questions with order 5,6,7,8
python_module = [m for m in SEED_DATA if m["slug"] == "python"][0]

for lesson in python_module["lessons"]:
    title = lesson["title"]
    if title in EXTRA_QUESTIONS:
        existing_qs = lesson["questions"]
        
        # Format existing questions' order and make sure explanation is set
        for idx, q in enumerate(existing_qs):
            q["order"] = idx + 1
            if "explanation" not in q or not q["explanation"]:
                q["explanation"] = f"Doğru cevap '{q['correct_answer']}' seçeneğidir."
        
        # Add new questions
        new_qs = EXTRA_QUESTIONS[title]
        # Avoid duplicate addition if run twice
        if len(existing_qs) < 8:
            existing_qs.extend(new_qs)
            
        print(f"Updated lesson: {title} - now has {len(existing_qs)} questions")

# Implement clean serializer
def serialize(obj, indent=0):
    ind = " " * indent
    if isinstance(obj, dict):
        items = []
        for k, v in obj.items():
            items.append(f"{ind}    {repr(k)}: {serialize(v, indent + 4)},")
        return "{\n" + "\n".join(items) + "\n" + ind + "}"
    elif isinstance(obj, list):
        items = []
        for v in obj:
            items.append(f"{ind}    {serialize(v, indent + 4)},")
        return "[\n" + "\n".join(items) + "\n" + ind + "]"
    elif isinstance(obj, str):
        # Format strings nicely
        if "\n" in obj:
            # Multi-line string format
            escaped = obj.replace('"', '\\"')
            lines = escaped.split('\n')
            formatted_lines = []
            for i, line in enumerate(lines):
                suffix = "\\n" if i < len(lines) - 1 else ""
                formatted_lines.append(f'{ind}    "{line}{suffix}"')
            return "(\n" + "\n".join(formatted_lines) + "\n" + ind + ")"
        return repr(obj)
    else:
        return repr(obj)

# Output updated code to seed_data.py
output_file = r'c:\Users\omerc\Desktop\coderun\backend\app\core\seed_data.py'

content = f"""# Coderun backend — kapsamlı ders içeriği seed verisi.
# Python (25 ders + 1 kodlama ödevi = 26), DevOps (8 ders), Cloud (8 ders)
# Her derste: multiple_choice, fill_in_blank, reorder, spot_the_bug, true_false_reason, multi_select karışık
# Pekiştirme soruları: is_reinforcement=True, has_reinforcement=True bağlantısıyla

SEED_DATA: list[dict] = {serialize(SEED_DATA)}

PYTHON_EXTRA_QUIZ_LESSON: dict = {serialize(PYTHON_EXTRA_QUIZ_LESSON)}

CODING_ASSIGNMENTS_LESSON: dict = {serialize(CODING_ASSIGNMENTS_LESSON)}
"""

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated and serialized seed_data.py!")
