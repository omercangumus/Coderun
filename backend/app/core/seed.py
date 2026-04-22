# Coderun backend — başlangıç verisi (seed); Python, DevOps, Cloud modülleri ve dersleri.

import logging
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.lesson import Lesson
from app.models.module import Module
from app.models.question import Question

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Seed verisi tanımları
# ---------------------------------------------------------------------------

SEED_DATA: list[dict[str, object]] = [
    {
        "slug": "python",
        "title": "Python",
        "description": "Python programlama dilinin temellerini öğren.",
        "order": 1,
        "lessons": [
            {
                "title": "Değişkenler ve Veri Tipleri",
                "lesson_type": "quiz",
                "order": 1,
                "xp_reward": 10,
                "questions": [
                    {
                        "question_text": "Python'da değişken tanımlamak için hangi anahtar kelime kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["var", "let", "Anahtar kelime gerekmez", "def"]},
                        "correct_answer": "Anahtar kelime gerekmez",
                        "order": 1,
                    },
                    {
                        "question_text": "x = 5 ifadesinde x'in tipi nedir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["str", "int", "float", "bool"]},
                        "correct_answer": "int",
                        "order": 2,
                    },
                    {
                        "question_text": "Python'da string tipi nasıl tanımlanır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ['x = "merhaba"', "x = 'merhaba'", "İkisi de doğru", "x := merhaba"]},
                        "correct_answer": "İkisi de doğru",
                        "order": 3,
                    },
                    {
                        "question_text": "type(3.14) ifadesinin sonucu nedir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["int", "str", "float", "number"]},
                        "correct_answer": "float",
                        "order": 4,
                    },
                ],
            },
            {
                "title": "Listeler",
                "lesson_type": "quiz",
                "order": 2,
                "xp_reward": 10,
                "questions": [
                    {
                        "question_text": "Python'da boş liste nasıl oluşturulur?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["list()", "[]", "İkisi de doğru", "{}"]},
                        "correct_answer": "İkisi de doğru",
                        "order": 1,
                    },
                    {
                        "question_text": "liste = [1,2,3] için liste[0] nedir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["1", "2", "3", "Hata"]},
                        "correct_answer": "1",
                        "order": 2,
                    },
                    {
                        "question_text": "Listeye eleman eklemek için hangi metod kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["add()", "append()", "insert()", "push()"]},
                        "correct_answer": "append()",
                        "order": 3,
                    },
                    {
                        "question_text": "len([1,2,3,4]) ifadesinin sonucu nedir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["3", "4", "5", "Hata"]},
                        "correct_answer": "4",
                        "order": 4,
                    },
                ],
            },
            {
                "title": "Koşullar",
                "lesson_type": "quiz",
                "order": 3,
                "xp_reward": 15,
                "questions": [
                    {
                        "question_text": "Python'da koşul ifadesi hangi anahtar kelime ile başlar?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["if", "when", "case", "check"]},
                        "correct_answer": "if",
                        "order": 1,
                    },
                    {
                        "question_text": "if bloğunun alternatifi için hangi anahtar kelime kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["else if", "elif", "elseif", "otherwise"]},
                        "correct_answer": "elif",
                        "order": 2,
                    },
                    {
                        "question_text": "Python'da eşitlik kontrolü için hangi operatör kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["=", "==", "===", "!="]},
                        "correct_answer": "==",
                        "order": 3,
                    },
                    {
                        "question_text": "x = 10 için 'if x > 5: print(\"büyük\")' çıktısı nedir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["büyük", "küçük", "Hata", "None"]},
                        "correct_answer": "büyük",
                        "order": 4,
                    },
                ],
            },
            {
                "title": "Döngüler",
                "lesson_type": "quiz",
                "order": 4,
                "xp_reward": 15,
                "questions": [
                    {
                        "question_text": "Python'da for döngüsü hangi yapıyla kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["for i in range()", "for(i=0;i<n;i++)", "foreach i", "loop i"]},
                        "correct_answer": "for i in range()",
                        "order": 1,
                    },
                    {
                        "question_text": "while döngüsünü durdurmak için hangi anahtar kelime kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["stop", "exit", "break", "end"]},
                        "correct_answer": "break",
                        "order": 2,
                    },
                    {
                        "question_text": "range(5) kaç eleman üretir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["4", "5", "6", "Hata"]},
                        "correct_answer": "5",
                        "order": 3,
                    },
                    {
                        "question_text": "Döngünün bir sonraki iterasyonuna geçmek için hangi anahtar kelime kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["skip", "next", "continue", "pass"]},
                        "correct_answer": "continue",
                        "order": 4,
                    },
                ],
            },
            {
                "title": "Fonksiyonlar",
                "lesson_type": "quiz",
                "order": 5,
                "xp_reward": 20,
                "questions": [
                    {
                        "question_text": "Python'da fonksiyon tanımlamak için hangi anahtar kelime kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["func", "function", "def", "fn"]},
                        "correct_answer": "def",
                        "order": 1,
                    },
                    {
                        "question_text": "Fonksiyondan değer döndürmek için hangi anahtar kelime kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["send", "output", "return", "yield"]},
                        "correct_answer": "return",
                        "order": 2,
                    },
                    {
                        "question_text": "def greet(name='Dünya') tanımında 'name' parametresi ne tür bir parametredir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Zorunlu parametre", "Varsayılan parametre", "Anahtar kelime parametresi", "Değişken parametre"]},
                        "correct_answer": "Varsayılan parametre",
                        "order": 3,
                    },
                    {
                        "question_text": "*args parametresi ne işe yarar?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Tek argüman alır", "Sözlük argüman alır", "Değişken sayıda argüman alır", "Zorunlu argüman belirtir"]},
                        "correct_answer": "Değişken sayıda argüman alır",
                        "order": 4,
                    },
                ],
            },
        ],
    },
    {
        "slug": "devops",
        "title": "DevOps",
        "description": "Linux, Docker, Git ve CI/CD araçlarını öğren.",
        "order": 2,
        "lessons": [
            {
                "title": "Linux Temelleri",
                "lesson_type": "quiz",
                "order": 1,
                "xp_reward": 10,
                "questions": [
                    {
                        "question_text": "Linux'ta mevcut dizini görüntülemek için hangi komut kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["ls", "pwd", "cd", "dir"]},
                        "correct_answer": "pwd",
                        "order": 1,
                    },
                    {
                        "question_text": "Dosya içeriğini görüntülemek için hangi komut kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["show", "print", "cat", "read"]},
                        "correct_answer": "cat",
                        "order": 2,
                    },
                    {
                        "question_text": "Yeni bir dizin oluşturmak için hangi komut kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["newdir", "mkdir", "createdir", "md"]},
                        "correct_answer": "mkdir",
                        "order": 3,
                    },
                    {
                        "question_text": "Dosya izinlerini değiştirmek için hangi komut kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["chown", "chmod", "chperm", "setperm"]},
                        "correct_answer": "chmod",
                        "order": 4,
                    },
                ],
            },
            {
                "title": "Bash Scripting",
                "lesson_type": "quiz",
                "order": 2,
                "xp_reward": 15,
                "questions": [
                    {
                        "question_text": "Bash script dosyasının ilk satırı ne olmalıdır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["#!/bin/bash", "#bash", "//bash", "#!/usr/bin/bash"]},
                        "correct_answer": "#!/bin/bash",
                        "order": 1,
                    },
                    {
                        "question_text": "Bash'te değişken nasıl tanımlanır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["var NAME=value", "NAME = value", "NAME=value", "$NAME=value"]},
                        "correct_answer": "NAME=value",
                        "order": 2,
                    },
                    {
                        "question_text": "Bash'te değişken değerine nasıl erişilir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["NAME", "@NAME", "#NAME", "$NAME"]},
                        "correct_answer": "$NAME",
                        "order": 3,
                    },
                    {
                        "question_text": "Script'i çalıştırılabilir yapmak için hangi komut kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["chmod +x script.sh", "exec script.sh", "run script.sh", "bash -x script.sh"]},
                        "correct_answer": "chmod +x script.sh",
                        "order": 4,
                    },
                ],
            },
            {
                "title": "Git ve GitHub",
                "lesson_type": "quiz",
                "order": 3,
                "xp_reward": 10,
                "questions": [
                    {
                        "question_text": "Yeni bir Git deposu başlatmak için hangi komut kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["git start", "git init", "git new", "git create"]},
                        "correct_answer": "git init",
                        "order": 1,
                    },
                    {
                        "question_text": "Değişiklikleri commit için hazırlamak hangi komutla yapılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["git commit", "git stage", "git add", "git prepare"]},
                        "correct_answer": "git add",
                        "order": 2,
                    },
                    {
                        "question_text": "Yeni bir branch oluşturmak için hangi komut kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["git new branch", "git branch -n", "git checkout -b", "git create branch"]},
                        "correct_answer": "git checkout -b",
                        "order": 3,
                    },
                    {
                        "question_text": "Remote'a push etmek için hangi komut kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["git upload", "git send", "git push", "git sync"]},
                        "correct_answer": "git push",
                        "order": 4,
                    },
                ],
            },
            {
                "title": "Docker Temelleri",
                "lesson_type": "quiz",
                "order": 4,
                "xp_reward": 20,
                "questions": [
                    {
                        "question_text": "Docker image'dan container başlatmak için hangi komut kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["docker start", "docker run", "docker create", "docker launch"]},
                        "correct_answer": "docker run",
                        "order": 1,
                    },
                    {
                        "question_text": "Çalışan container'ları listelemek için hangi komut kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["docker list", "docker show", "docker ps", "docker containers"]},
                        "correct_answer": "docker ps",
                        "order": 2,
                    },
                    {
                        "question_text": "Dockerfile'dan image oluşturmak için hangi komut kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["docker create", "docker make", "docker build", "docker compile"]},
                        "correct_answer": "docker build",
                        "order": 3,
                    },
                    {
                        "question_text": "Container'ı durdurmak için hangi komut kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["docker kill", "docker stop", "docker end", "docker halt"]},
                        "correct_answer": "docker stop",
                        "order": 4,
                    },
                ],
            },
            {
                "title": "GitHub Actions",
                "lesson_type": "quiz",
                "order": 5,
                "xp_reward": 20,
                "questions": [
                    {
                        "question_text": "GitHub Actions workflow dosyaları nerede saklanır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": [".github/actions/", ".github/workflows/", "workflows/", ".actions/"]},
                        "correct_answer": ".github/workflows/",
                        "order": 1,
                    },
                    {
                        "question_text": "Workflow'u tetikleyen olay hangi anahtar kelimeyle tanımlanır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["trigger", "on", "when", "event"]},
                        "correct_answer": "on",
                        "order": 2,
                    },
                    {
                        "question_text": "Hazır action kullanmak için hangi anahtar kelime kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["import", "include", "uses", "run"]},
                        "correct_answer": "uses",
                        "order": 3,
                    },
                    {
                        "question_text": "Shell komutu çalıştırmak için hangi anahtar kelime kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["exec", "shell", "run", "cmd"]},
                        "correct_answer": "run",
                        "order": 4,
                    },
                ],
            },
        ],
    },
    {
        "slug": "cloud",
        "title": "Cloud",
        "description": "AWS bulut hizmetlerini ve cloud mimarisini öğren.",
        "order": 3,
        "lessons": [
            {
                "title": "Cloud Temelleri",
                "lesson_type": "quiz",
                "order": 1,
                "xp_reward": 10,
                "questions": [
                    {
                        "question_text": "IaaS ne anlama gelir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Internet as a Service", "Infrastructure as a Service", "Integration as a Service", "Interface as a Service"]},
                        "correct_answer": "Infrastructure as a Service",
                        "order": 1,
                    },
                    {
                        "question_text": "Hangi cloud modeli en fazla kontrol sağlar?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["SaaS", "PaaS", "IaaS", "FaaS"]},
                        "correct_answer": "IaaS",
                        "order": 2,
                    },
                    {
                        "question_text": "AWS'nin tam açılımı nedir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Amazon Web Services", "Advanced Web Systems", "Automated Web Solutions", "Amazon World Services"]},
                        "correct_answer": "Amazon Web Services",
                        "order": 3,
                    },
                    {
                        "question_text": "Cloud'un temel avantajı nedir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Sabit maliyet", "Ölçeklenebilirlik", "Tek lokasyon", "Manuel yönetim"]},
                        "correct_answer": "Ölçeklenebilirlik",
                        "order": 4,
                    },
                ],
            },
            {
                "title": "AWS EC2",
                "lesson_type": "quiz",
                "order": 2,
                "xp_reward": 15,
                "questions": [
                    {
                        "question_text": "EC2 ne anlama gelir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Elastic Cloud Compute", "Elastic Compute Cloud", "Extended Cloud Computing", "Enterprise Cloud Cluster"]},
                        "correct_answer": "Elastic Compute Cloud",
                        "order": 1,
                    },
                    {
                        "question_text": "EC2 instance'a SSH ile bağlanmak için ne gerekir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Kullanıcı adı/şifre", "Key pair (.pem dosyası)", "API key", "OAuth token"]},
                        "correct_answer": "Key pair (.pem dosyası)",
                        "order": 2,
                    },
                    {
                        "question_text": "EC2 instance türlerinden hangisi ücretsiz kullanım kapsamındadır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["t2.micro", "t2.small", "t3.medium", "m5.large"]},
                        "correct_answer": "t2.micro",
                        "order": 3,
                    },
                    {
                        "question_text": "Security Group ne işe yarar?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Kullanıcı yönetimi", "Ağ trafiği kontrolü", "Depolama yönetimi", "Maliyet kontrolü"]},
                        "correct_answer": "Ağ trafiği kontrolü",
                        "order": 4,
                    },
                ],
            },
            {
                "title": "AWS S3",
                "lesson_type": "quiz",
                "order": 3,
                "xp_reward": 15,
                "questions": [
                    {
                        "question_text": "S3 ne anlama gelir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Simple Storage Service", "Secure Storage System", "Scalable Storage Solution", "Standard Storage Service"]},
                        "correct_answer": "Simple Storage Service",
                        "order": 1,
                    },
                    {
                        "question_text": "S3'te dosyalar nerede saklanır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Folder", "Directory", "Bucket", "Container"]},
                        "correct_answer": "Bucket",
                        "order": 2,
                    },
                    {
                        "question_text": "S3 bucket adları nasıl olmalıdır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Sadece büyük harf", "Globally unique", "Sadece sayı", "En az 20 karakter"]},
                        "correct_answer": "Globally unique",
                        "order": 3,
                    },
                    {
                        "question_text": "S3 versioning ne işe yarar?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Dosya şifreleme", "Eski versiyonları saklama", "Erişim kontrolü", "Maliyet azaltma"]},
                        "correct_answer": "Eski versiyonları saklama",
                        "order": 4,
                    },
                ],
            },
            {
                "title": "AWS RDS",
                "lesson_type": "quiz",
                "order": 4,
                "xp_reward": 20,
                "questions": [
                    {
                        "question_text": "RDS ne anlama gelir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Remote Database Service", "Relational Database Service", "Rapid Data Storage", "Redundant Data System"]},
                        "correct_answer": "Relational Database Service",
                        "order": 1,
                    },
                    {
                        "question_text": "RDS hangi veritabanı motorlarını destekler?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Sadece MySQL", "Sadece PostgreSQL", "MySQL, PostgreSQL, Oracle ve diğerleri", "Sadece NoSQL"]},
                        "correct_answer": "MySQL, PostgreSQL, Oracle ve diğerleri",
                        "order": 2,
                    },
                    {
                        "question_text": "RDS Multi-AZ ne sağlar?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Daha hızlı sorgu", "Yüksek erişilebilirlik", "Daha ucuz depolama", "Otomatik şifreleme"]},
                        "correct_answer": "Yüksek erişilebilirlik",
                        "order": 3,
                    },
                    {
                        "question_text": "RDS Read Replica ne işe yarar?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Yazma performansını artırır", "Okuma performansını artırır", "Yedekleme sağlar", "Şifreleme sağlar"]},
                        "correct_answer": "Okuma performansını artırır",
                        "order": 4,
                    },
                ],
            },
            {
                "title": "AWS IAM",
                "lesson_type": "quiz",
                "order": 5,
                "xp_reward": 20,
                "questions": [
                    {
                        "question_text": "IAM ne anlama gelir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Internet Access Management", "Identity and Access Management", "Integrated Application Manager", "Internal Access Module"]},
                        "correct_answer": "Identity and Access Management",
                        "order": 1,
                    },
                    {
                        "question_text": "IAM Policy ne tanımlar?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Kullanıcı şifresi", "İzinler ve erişim kuralları", "Ağ yapılandırması", "Depolama limitleri"]},
                        "correct_answer": "İzinler ve erişim kuralları",
                        "order": 2,
                    },
                    {
                        "question_text": "En az ayrıcalık prensibi ne anlama gelir?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Tüm izinleri ver", "Sadece gerekli izinleri ver", "Admin izni ver", "Hiç izin verme"]},
                        "correct_answer": "Sadece gerekli izinleri ver",
                        "order": 3,
                    },
                    {
                        "question_text": "IAM Role ne zaman kullanılır?",
                        "question_type": "multiple_choice",
                        "options": {"choices": ["Sadece kullanıcılar için", "AWS servisleri arası erişim için", "Sadece gruplar için", "Şifre yönetimi için"]},
                        "correct_answer": "AWS servisleri arası erişim için",
                        "order": 4,
                    },
                ],
            },
        ],
    },
]


# ---------------------------------------------------------------------------
# Seed fonksiyonu
# ---------------------------------------------------------------------------


async def seed_database(db: AsyncSession) -> None:
    """Veritabanına başlangıç verilerini ekler.

    İdempotent: Modül zaten varsa seed çalıştırılmaz.
    Transaction içinde çalışır; hata olursa rollback yapar.

    Args:
        db: Aktif async veritabanı oturumu.
    """
    # Modül var mı kontrol et (idempotent)
    existing = await db.execute(select(Module).limit(1))
    if existing.scalars().first() is not None:
        logger.info("Seed verisi zaten mevcut, atlanıyor.")
        return

    logger.info("Seed verisi ekleniyor...")

    try:
        for module_data in SEED_DATA:
            # pop() yerine get() kullan — SEED_DATA global listesini mutate etme
            lessons_data = module_data.get("lessons", [])  # type: ignore[attr-defined]
            module_id = uuid4()

            module = Module(
                id=module_id,
                title=module_data["title"],
                slug=module_data["slug"],
                description=module_data["description"],
                order=module_data["order"],
                is_active=True,
                is_published=True,
            )
            db.add(module)
            await db.flush()

            for lesson_data in lessons_data:  # type: ignore[attr-defined]
                questions_data = lesson_data.get("questions", [])
                lesson_id = uuid4()

                lesson = Lesson(
                    id=lesson_id,
                    module_id=module_id,
                    title=lesson_data["title"],
                    lesson_type=lesson_data["lesson_type"],
                    order=lesson_data["order"],
                    xp_reward=lesson_data["xp_reward"],
                    content={},
                    is_active=True,
                )
                db.add(lesson)
                await db.flush()

                for question_data in questions_data:
                    question = Question(
                        id=uuid4(),
                        lesson_id=lesson_id,
                        question_type=question_data["question_type"],
                        question_text=question_data["question_text"],
                        options=question_data.get("options"),
                        correct_answer=question_data["correct_answer"],
                        order=question_data["order"],
                    )
                    db.add(question)

        await db.commit()
        logger.info("Seed verisi başarıyla eklendi.")

    except Exception as exc:
        await db.rollback()
        logger.error("Seed verisi eklenirken hata oluştu: %s", exc)
        raise
