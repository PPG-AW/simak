-- ============================================
-- SIMAK-ITS: SEED DATA
-- ============================================

TRUNCATE attempt_logs, student_mastery, questions, knowledge_points, students CASCADE;

-- ============================================
-- A. AKUN DUMMY
-- ============================================

INSERT INTO students (id, name, role, last_login_at) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Andi Pratama', 'siswa', NOW() - INTERVAL '1 day'),
    ('22222222-2222-2222-2222-222222222222', 'Budi Santoso', 'siswa', NOW() - INTERVAL '2 hours'),
    ('33333333-3333-3333-3333-333333333333', 'Citra Dewi', 'siswa', NOW() - INTERVAL '2 days'),
    ('44444444-4444-4444-4444-444444444444', 'Dina Amelia', 'siswa', NOW() - INTERVAL '1 day'),
    ('55555555-5555-5555-5555-555555555555', 'Eka Saputra', 'siswa', NOW() - INTERVAL '5 hours'),
    ('66666666-6666-6666-6666-666666666666', 'Fajar Hidayat', 'siswa', NOW() - INTERVAL '14 days'),
    ('99999999-9999-9999-9999-999999999999', 'Pak Guru', 'guru', NOW() - INTERVAL '1 hour');

-- ============================================
-- B. KNOWLEDGE POINTS (9 KP)
-- ============================================

INSERT INTO knowledge_points (id, topic_number, topic_title, kp_title, kp_description, prerequisite_id, order_num, material_content, example_content) VALUES

('KP1.1', 1, 'Pemahaman Konsep Persamaan Kuadrat',
 'Mengenali Bentuk Umum',
 'Siswa dapat mengenali bahwa bentuk umum persamaan kuadrat adalah ax² + bx + c = 0 dengan a ≠ 0',
 NULL, 1,
 E'Persamaan kuadrat adalah persamaan yang memiliki variabel dengan pangkat tertinggi 2.\n\nBentuk umumnya adalah:\n\nax² + bx + c = 0,   dengan a ≠ 0\n\nDi mana:\n• a = koefisien x² (tidak boleh 0)\n• b = koefisien x\n• c = konstanta (bilangan tanpa variabel)\n\n⚠️ Syarat a ≠ 0 memastikan suku x² benar-benar ada. Jika a = 0, persamaan berubah menjadi persamaan linear.',
 E'Contoh persamaan kuadrat:\n• 2x² + 3x − 5 = 0 → a = 2, b = 3, c = −5\n• x² − 4x + 1 = 0 → a = 1, b = −4, c = 1\n• −3x² + x = 0 → a = −3, b = 1, c = 0\n\n✅ Kunci: selalu cocokkan dengan bentuk umum, satu suku demi satu suku.'
),

('KP1.2', 1, 'Pemahaman Konsep Persamaan Kuadrat',
 'Membedakan PK dan Bukan PK',
 'Siswa dapat membedakan mana yang termasuk persamaan kuadrat dan mana yang bukan',
 'KP1.1', 2,
 E'Syarat suatu persamaan disebut persamaan kuadrat:\n1. Pangkat tertinggi variabelnya adalah 2\n2. Koefisien x² (nilai a) tidak boleh nol\n\n⚠️ Bentuknya tidak harus standar! x² = 9 juga persamaan kuadrat karena bisa ditulis x² − 9 = 0.\n\nYang BUKAN persamaan kuadrat:\n• 3x + 5 = 0 → pangkat tertinggi 1 (linear)\n• x³ − 2x = 0 → pangkat tertinggi 3 (kubik)\n• 0x² + 3x + 1 = 0 → a = 0, jadi linear',
 E'Tentukan apakah persamaan berikut termasuk PK:\n\n1. 5x² − x + 3 = 0 → ✅ PK (pangkat tertinggi 2, a = 5 ≠ 0)\n2. 4x − 7 = 0 → ❌ Bukan PK (pangkat tertinggi 1)\n3. x² = 9 → ✅ PK (bisa ditulis x² − 9 = 0, a = 1 ≠ 0)\n4. x³ + x² = 0 → ❌ Bukan PK (pangkat tertinggi 3)'
),

('KP1.3', 1, 'Pemahaman Konsep Persamaan Kuadrat',
 'Memahami Syarat a ≠ 0',
 'Siswa memahami mengapa koefisien a tidak boleh nol dalam persamaan kuadrat',
 'KP1.2', 3,
 E'Mengapa a tidak boleh 0?\n\nJika a = 0, maka suku x² hilang:\n\n0x² + bx + c = 0  →  bx + c = 0\n\nIni menjadi persamaan LINEAR, bukan kuadrat lagi.\n\nJadi syarat a ≠ 0 memastikan persamaan BENAR-BENAR memiliki suku x² dan berderajat 2.',
 E'Contoh:\n• 0x² + 3x + 1 = 0 → menjadi 3x + 1 = 0 → LINEAR ❌\n• 1x² + 0x + 5 = 0 → tetap x² + 5 = 0 → KUADRAT ✅ (b boleh 0)\n• 2x² + 4x + 0 = 0 → tetap 2x² + 4x = 0 → KUADRAT ✅ (c boleh 0)\n\n💡 Kesimpulan: b dan c BOLEH nol, tapi a TIDAK BOLEH nol.'
),

('KP2.1', 2, 'Identifikasi Koefisien a, b, c',
 'Identifikasi dari Bentuk Standar',
 'Siswa dapat menentukan nilai a, b, c dari persamaan yang sudah dalam bentuk ax² + bx + c = 0',
 'KP1.3', 4,
 E'Cara menentukan a, b, c:\n\nCocokkan persamaan yang diberikan dengan bentuk umum:\n\nax² + bx + c = 0\n\n⚠️ PENTING:\n• Tanda (+ atau −) adalah BAGIAN dari koefisien. Jangan buang tandanya!\n• Jika tidak ada angka di depan x², maka a = 1\n• Jika ada tanda − di depan x² tanpa angka, maka a = −1',
 E'Contoh: Tentukan a, b, c dari 3x² − 5x + 2 = 0\n\nLangkah 1: Tulis lengkap termasuk koefisien dan tanda\n(3)x² + (−5)x + (2) = 0\n\nLangkah 2: Cocokkan dengan bentuk umum\n  3x²  − 5x  + 2  = 0\n  ax²  + bx   + c  = 0\n   ↓       ↓      ↓\n  a=3    b=−5   c=2\n\n⚠️ Perhatikan: b = −5, BUKAN 5! Tanda minus adalah bagian dari koefisien.'
),

('KP2.2', 2, 'Identifikasi Koefisien a, b, c',
 'Identifikasi dari Bentuk Tidak Standar',
 'Siswa dapat menyusun persamaan ke bentuk standar terlebih dahulu, lalu menentukan a, b, c',
 'KP2.1', 5,
 E'Jika persamaan BELUM dalam bentuk standar:\n\nLangkah 1: Pindahkan semua suku ke satu ruas (ruas lain = 0)\nLangkah 2: Susun berdasarkan pangkat menurun (x², lalu x, lalu konstanta)\nLangkah 3: Baru tentukan a, b, c\n\n⚠️ JANGAN langsung mengambil angka dari bentuk yang belum tersusun! Suku yang berpindah ruas BERUBAH TANDA.',
 E'Contoh: Tentukan a, b, c dari 3x = x² + 2\n\nLangkah 1: Pindahkan semua ke ruas kiri\n3x − x² − 2 = 0\n\nLangkah 2: Susun berdasarkan pangkat menurun\n−x² + 3x − 2 = 0\nkalikan −1 agar a positif (opsional):\nx² − 3x + 2 = 0\n\nLangkah 3: Cocokkan\na = 1, b = −3, c = 2\n\n✅ Setiap suku yang pindah ruas berubah tanda: 3x tetap, x² jadi −x², +2 jadi −2.'
),

('KP2.3', 2, 'Identifikasi Koefisien a, b, c',
 'Kasus Khusus (b=0, c=0, koefisien negatif)',
 'Siswa dapat menangani kasus khusus seperti suku yang hilang atau koefisien negatif',
 'KP2.2', 6,
 E'Kasus-kasus khusus:\n\n1. Jika tidak ada suku x → b = 0\n   Contoh: x² − 9 = 0 → a = 1, b = 0, c = −9\n\n2. Jika tidak ada konstanta → c = 0\n   Contoh: 2x² + 4x = 0 → a = 2, b = 4, c = 0\n\n3. Jika koefisien x² negatif → a negatif\n   Contoh: −x² + 4x − 3 = 0 → a = −1, b = 4, c = −3\n\n⚠️ Ingat: −x² artinya (−1)x², jadi a = −1. Suku yang tidak muncul artinya koefisiennya 0, bukan "tidak ada".',
 E'Contoh lengkap:\n\n1. x² = 25\n→ x² − 25 = 0\n→ a = 1, b = 0, c = −25\n\n2. 3x² = 6x\n→ 3x² − 6x = 0\n→ a = 3, b = −6, c = 0\n\n3. −2x² + x + 1 = 0\n→ a = −2, b = 1, c = 1\n\n💡 Selalu tulis persamaan secara lengkap: (a)x² + (b)x + (c) = 0, isi 0 untuk suku yang hilang.'
),

('KP3.1', 3, 'Faktorisasi Persamaan Kuadrat (a=1)',
 'Mencari Dua Bilangan (p × q = c, p + q = b)',
 'Siswa dapat mencari dua bilangan yang hasil kalinya = c dan hasil jumlahnya = b',
 'KP2.3', 7,
 E'Untuk memfaktorkan x² + bx + c = 0, cari dua bilangan p dan q sehingga:\n\n• p × q = c  (hasil kali = konstanta)\n• p + q = b  (hasil jumlah = koefisien x)\n\nStrategi menentukan tanda p dan q:\n• c POSITIF dan b POSITIF → p dan q keduanya POSITIF\n• c POSITIF dan b NEGATIF → p dan q keduanya NEGATIF\n• c NEGATIF → p dan q BEDA TANDA (satu positif, satu negatif)\n\n💡 Daftar semua pasangan faktor dari c, lalu uji jumlahnya satu per satu.',
 E'Contoh 1: x² + 5x + 6 = 0\np × q = 6 dan p + q = 5\nc positif, b positif → keduanya positif\nPasangan faktor 6: (1, 6) dan (2, 3)\nUji: 2 + 3 = 5 ✅ → p = 2, q = 3\n\nContoh 2: x² − 7x + 12 = 0\np × q = 12 dan p + q = −7\nc positif, b negatif → keduanya negatif\nPasangan: (−1,−12), (−2,−6), (−3,−4)\nUji: −3 + (−4) = −7 ✅ → p = −3, q = −4'
),

('KP3.2', 3, 'Faktorisasi Persamaan Kuadrat (a=1)',
 'Menulis Bentuk Faktor (x+p)(x+q) = 0',
 'Siswa dapat menuliskan bentuk faktor dari dua bilangan yang ditemukan',
 'KP3.1', 8,
 E'Setelah menemukan p dan q, tulis bentuk faktor:\n\n(x + p)(x + q) = 0\n\n⚠️ PENTING: Masukkan nilai p dan q LENGKAP DENGAN TANDANYA!\n\nJika p = −3, maka:\n(x + (−3)) = (x − 3)\nBUKAN (x + 3)!\n\n💡 Cara verifikasi: kalikan kembali faktornya dan cocokkan dengan persamaan awal.',
 E'Contoh 1: p = 2, q = 3\n→ (x + 2)(x + 3) = 0 ✅\n\nContoh 2: p = −3, q = −4\n→ (x + (−3))(x + (−4)) = (x − 3)(x − 4) = 0 ✅\n\nContoh 3: p = 5, q = −3\n→ (x + 5)(x + (−3)) = (x + 5)(x − 3) = 0 ✅\n\nVerifikasi contoh 2:\n(x − 3)(x − 4) = x² − 4x − 3x + 12 = x² − 7x + 12 ✅'
),

('KP3.3', 3, 'Faktorisasi Persamaan Kuadrat (a=1)',
 'Menentukan Akar-akar dari Bentuk Faktor',
 'Siswa dapat menentukan nilai x (akar) dari bentuk faktor menggunakan sifat perkalian nol',
 'KP3.2', 9,
 E'Sifat Perkalian Nol:\nJika A × B = 0, maka A = 0 ATAU B = 0\n\nDari (x + p)(x + q) = 0:\n• x + p = 0  →  x = −p\n• x + q = 0  →  x = −q\n\n⚠️ PERHATIKAN: Tanda akar BERLAWANAN dengan tanda di dalam faktor!\nJika faktornya (x + 3), maka x = −3\nJika faktornya (x − 5), maka x = +5',
 E'Contoh: (x − 3)(x − 4) = 0\n\nFaktor 1: x − 3 = 0 → x = 3\nFaktor 2: x − 4 = 0 → x = 4\n\nJadi akar-akarnya: x = 3 atau x = 4\n\nVerifikasi dengan substitusi ke x² − 7x + 12:\n• x = 3: (3)² − 7(3) + 12 = 9 − 21 + 12 = 0 ✅\n• x = 4: (4)² − 7(4) + 12 = 16 − 28 + 12 = 0 ✅\n\n💡 Himpunan penyelesaian sering ditulis HP = {3, 4}.'
);

-- ============================================
-- C. BANK SOAL (3+ soal per KP)
-- ============================================

INSERT INTO questions (id, kp_id, question_text, question_type, correct_answer, feedback_level_1, feedback_level_2, feedback_level_3, feedback_correct, common_errors, difficulty, order_num) VALUES

-- === KP 1.1: Mengenali Bentuk Umum ===
('Q1.1.1', 'KP1.1',
 E'Manakah yang merupakan bentuk umum persamaan kuadrat?\nA) ax + b = 0,  a ≠ 0\nB) ax² + bx + c = 0,  a ≠ 0\nC) ax³ + bx² + cx + d = 0,  a ≠ 0\nD) ax² + bx + c = 0,  a = 0',
 'multiple_choice',
 '{"answer": "B"}',
 E'💡 Persamaan kuadrat memiliki pangkat tertinggi x = 2. Cari pilihan yang memiliki suku x² dan memenuhi syarat a ≠ 0.',
 E'🔍 Perhatikan setiap pilihan:\n• Pilihan A: pangkat tertinggi x adalah 1 (linear)\n• Pilihan C: pangkat tertinggi x adalah 3 (kubik)\n• Pilihan D: a = 0 artinya suku x² hilang\nManakah yang pangkat tertingginya 2 DAN a ≠ 0?',
 E'📖 Bentuk umum persamaan kuadrat adalah ax² + bx + c = 0 dengan syarat a ≠ 0.\n\n• A) ax + b = 0 → linear (pangkat 1) ❌\n• B) ax² + bx + c = 0, a ≠ 0 → KUADRAT ✅\n• C) ax³ + bx² + cx + d = 0 → kubik (pangkat 3) ❌\n• D) ax² + bx + c = 0, a = 0 → jika a = 0 menjadi linear ❌',
 E'✅ Tepat! Bentuk umum persamaan kuadrat adalah ax² + bx + c = 0 dengan syarat utama a ≠ 0. Syarat ini memastikan suku x² benar-benar ada.',
 '[{"wrong": {"answer": "A"}, "type": "pangkat_salah"}, {"wrong": {"answer": "D"}, "type": "syarat_a_salah"}, {"wrong": {"answer": "C"}, "type": "pangkat_salah"}]',
 1, 1),

('Q1.1.2', 'KP1.1',
 E'Dalam bentuk umum ax² + bx + c = 0, apa nama dari b?\nA) Koefisien x²\nB) Koefisien x\nC) Konstanta\nD) Variabel bebas',
 'multiple_choice',
 '{"answer": "B"}',
 E'💡 Ingat: a adalah koefisien x², b adalah koefisien x, dan c adalah konstanta. Mana yang merupakan koefisien x?',
 E'🔍 Dalam ax² + bx + c = 0:\n• a disebut koefisien x² (angka di depan x²)\n• b disebut koefisien x (angka di depan x)\n• c disebut konstanta (angka tanpa variabel)\nJadi b adalah…',
 E'📖 Jawaban: b adalah koefisien x.\n\nDalam persamaan ax² + bx + c = 0:\n• a = koefisien dari x² (koefisien kuadrat)\n• b = koefisien dari x (koefisien linear)\n• c = konstanta\n\nContoh: 3x² + 5x + 2 = 0 → a = 3, b = 5, c = 2',
 E'✅ Benar! b adalah koefisien dari x, yaitu angka yang berada di depan variabel x berpangkat 1.',
 '[{"wrong": {"answer": "A"}, "type": "konsep_salah"}, {"wrong": {"answer": "C"}, "type": "konsep_salah"}]',
 1, 2),

('Q1.1.3', 'KP1.1',
 'Persamaan kuadrat memiliki pangkat tertinggi variabel x sebesar…',
 'input',
 '{"answer": "2"}',
 E'💡 Kata "kuadrat" berasal dari kata "kuadro" yang berarti… berapa?',
 E'🔍 Bandingkan:\n• Persamaan linear: pangkat tertinggi x = 1\n• Persamaan kuadrat: pangkat tertinggi x = ?\n• Persamaan kubik: pangkat tertinggi x = 3',
 E'📖 Jawaban: 2.\n\nPersamaan kuadrat disebut "kuadrat" karena pangkat tertinggi variabelnya adalah 2 (x²). Kata kuadrat berarti "pangkat dua" atau "dikuadratkan".',
 E'✅ Tepat! Pangkat tertinggi variabel dalam persamaan kuadrat adalah 2. Itulah mengapa ada suku x² di dalamnya.',
 '[{"wrong": {"answer": "1"}, "type": "pangkat_salah"}, {"wrong": {"answer": "3"}, "type": "pangkat_salah"}]',
 1, 3),

-- === KP 1.2: Membedakan PK dan Bukan PK ===
('Q1.2.1', 'KP1.2',
 'Apakah 3x² − 2x + 1 = 0 merupakan persamaan kuadrat?',
 'multiple_choice',
 '{"answer": "YA"}',
 E'💡 Periksa dua syarat: (1) Apakah pangkat tertinggi x = 2? (2) Apakah koefisien x² ≠ 0?',
 E'🔍 Identifikasi: suku x² adalah 3x². Koefisien x² = 3. Apakah 3 ≠ 0? Apakah ada pangkat yang lebih tinggi dari 2?',
 E'📖 Jawaban: YA.\n3x² − 2x + 1 = 0 adalah persamaan kuadrat karena:\n✅ Pangkat tertinggi x = 2 (ada suku x²)\n✅ Koefisien x² = 3 ≠ 0\nKedua syarat terpenuhi.',
 E'✅ Benar! 3x² − 2x + 1 = 0 memenuhi kedua syarat: pangkat tertinggi 2 dan a = 3 ≠ 0.',
 '[{"wrong": {"answer": "TIDAK"}, "type": "konsep_salah"}]',
 1, 1),

('Q1.2.2', 'KP1.2',
 'Apakah 5x + 7 = 0 merupakan persamaan kuadrat?',
 'multiple_choice',
 '{"answer": "TIDAK"}',
 E'💡 Periksa: adakah suku x² di persamaan ini?',
 E'🔍 Pada 5x + 7 = 0:\n• Suku dengan pangkat tertinggi: 5x (pangkat 1)\n• Tidak ada suku x²\nPersamaan dengan pangkat tertinggi 1 disebut…',
 E'📖 Jawaban: TIDAK.\n5x + 7 = 0 bukan persamaan kuadrat karena tidak ada suku x². Pangkat tertinggi x = 1, sehingga ini adalah persamaan LINEAR.',
 E'✅ Benar! 5x + 7 = 0 adalah persamaan linear (pangkat tertinggi 1), bukan kuadrat.',
 '[{"wrong": {"answer": "YA"}, "type": "konsep_salah"}]',
 1, 2),

('Q1.2.3', 'KP1.2',
 'Apakah x² = 4x merupakan persamaan kuadrat?',
 'multiple_choice',
 '{"answer": "YA"}',
 E'💡 Persamaan ini belum dalam bentuk standar. Coba pindahkan semua suku ke satu ruas dulu. Apa yang kamu dapatkan?',
 E'🔍 Pindahkan 4x ke kiri: x² − 4x = 0. Sekarang periksa: apakah ada suku x²? Apakah koefisien x² ≠ 0?',
 E'📖 Jawaban: YA.\nx² = 4x → x² − 4x = 0\nIni adalah persamaan kuadrat dengan a = 1, b = −4, c = 0.\n\n⚠️ Ingat: persamaan kuadrat tidak harus memiliki ketiga suku. c boleh = 0.',
 E'✅ Tepat! Meskipun bentuknya berbeda dari biasanya, x² = 4x bisa disusun menjadi x² − 4x = 0 yang merupakan persamaan kuadrat (a = 1 ≠ 0).',
 '[{"wrong": {"answer": "TIDAK"}, "type": "bentuk_tidak_standar"}]',
 2, 3),

-- === KP 1.3: Syarat a ≠ 0 ===
('Q1.3.1', 'KP1.3',
 E'Mengapa 0x² + 3x + 1 = 0 BUKAN persamaan kuadrat?\nA) Karena c = 1 bukan bilangan genap\nB) Karena tidak bisa difaktorkan\nC) Karena a = 0 sehingga suku x² hilang dan menjadi linear\nD) Karena b = 3 terlalu besar',
 'multiple_choice',
 '{"answer": "C"}',
 E'💡 Jika koefisien x² adalah 0, apa yang terjadi pada suku x²?',
 E'🔍 Hitung: 0 × x² = 0. Suku x² hilang! Persamaan menjadi 3x + 1 = 0. Ini persamaan jenis apa?',
 E'📖 Jawaban: C — karena a = 0, suku x² hilang.\n\n0x² + 3x + 1 = 0 → 0 + 3x + 1 = 0 → 3x + 1 = 0\n\nIni menjadi persamaan LINEAR, bukan kuadrat. Itulah mengapa syarat a ≠ 0 sangat penting: untuk memastikan suku x² benar-benar ada.',
 E'✅ Tepat! Jika a = 0, maka suku x² hilang dan persamaan menjadi linear. Syarat a ≠ 0 menjamin persamaan benar-benar berderajat 2.',
 '[{"wrong": {"answer": "B"}, "type": "konsep_salah"}, {"wrong": {"answer": "A"}, "type": "konsep_salah"}, {"wrong": {"answer": "D"}, "type": "konsep_salah"}]',
 1, 1),

('Q1.3.2', 'KP1.3',
 'Persamaan x² + 3 = 0. Apakah ini persamaan kuadrat meskipun tidak ada suku x?',
 'multiple_choice',
 '{"answer": "YA"}',
 E'💡 Ingat: yang TIDAK BOLEH nol hanyalah a (koefisien x²). Bagaimana dengan b dan c?',
 E'🔍 Pada x² + 3 = 0: a = 1, b = 0, c = 3.\nSyarat persamaan kuadrat: a ≠ 0. Apakah a = 1 memenuhi syarat ini?',
 E'📖 Jawaban: YA.\nx² + 3 = 0 → a = 1, b = 0, c = 3\nMeskipun b = 0 (tidak ada suku x), a = 1 ≠ 0.\n\nIngat: Hanya a yang TIDAK BOLEH nol. Nilai b dan c BOLEH nol.',
 E'✅ Benar! x² + 3 = 0 tetap persamaan kuadrat. Yang penting a ≠ 0. Nilai b dan c boleh nol.',
 '[{"wrong": {"answer": "TIDAK"}, "type": "syarat_b_c_salah"}]',
 2, 2),

('Q1.3.3', 'KP1.3',
 E'Manakah yang BUKAN persamaan kuadrat?\nA) x² = 0\nB) x² + x = 0\nC) x + 5 = 0\nD) −x² + 1 = 0',
 'multiple_choice',
 '{"answer": "C"}',
 E'💡 Periksa setiap pilihan: adakah suku x² dengan koefisien ≠ 0?',
 E'🔍 Cek satu per satu:\n• A) x² = 0 → a = 1 ≠ 0 → PK ✅\n• B) x² + x = 0 → a = 1 ≠ 0 → PK ✅\n• C) x + 5 = 0 → tidak ada x² → ?\n• D) −x² + 1 = 0 → a = −1 ≠ 0 → PK ✅',
 E'📖 Jawaban: C.\n\nA) x² = 0 → a = 1, b = 0, c = 0 → PK ✅\nB) x² + x = 0 → a = 1, b = 1, c = 0 → PK ✅\nC) x + 5 = 0 → tidak ada suku x² → LINEAR ❌\nD) −x² + 1 = 0 → a = −1, b = 0, c = 1 → PK ✅\n\n⚠️ Koefisien negatif (a = −1) tetap memenuhi syarat a ≠ 0.',
 E'✅ Tepat! x + 5 = 0 adalah persamaan linear karena tidak memiliki suku x².',
 '[{"wrong": {"answer": "D"}, "type": "koef_negatif_bingung"}, {"wrong": {"answer": "A"}, "type": "konsep_salah"}]',
 2, 3),

-- === KP 2.1: Identifikasi dari Bentuk Standar ===
('Q2.1.1', 'KP2.1',
 'Tentukan nilai a, b, dan c dari:  2x² + 3x − 5 = 0',
 'input',
 '{"a": "2", "b": "3", "c": "-5"}',
 E'💡 Cocokkan dengan bentuk umum ax² + bx + c = 0. Perhatikan tanda di depan angka 5!',
 E'🔍 Bandingkan suku per suku:\n  2x² + 3x − 5 = 0\n  ax² + bx + c = 0\n\n• Suku x²: 2x² → a = 2\n• Suku x: +3x → b = 3\n• Konstanta: −5 → c = ? (perhatikan tandanya!)',
 E'📖 2x² + 3x − 5 = 0\n\nCocokkan:\n• 2x² → a = 2\n• +3x → b = 3\n• −5 → c = −5 (BUKAN 5! Tanda minus termasuk)\n\nJadi: a = 2, b = 3, c = −5',
 E'✅ Tepat! a = 2, b = 3, c = −5. Kamu benar memasukkan tanda minus pada c.',
 '[{"wrong": {"c": "5"}, "type": "sign_error"}]',
 1, 1),

('Q2.1.2', 'KP2.1',
 'Tentukan nilai a, b, dan c dari:  x² − 7x + 12 = 0',
 'input',
 '{"a": "1", "b": "-7", "c": "12"}',
 E'💡 Perhatikan: di depan x² tidak ada angka. Itu berarti koefisiennya = 1. Dan perhatikan tanda di depan 7x!',
 E'🔍 Bandingkan:\n  x²   − 7x   + 12  = 0\n  ax²  + bx   + c   = 0\n\n• x² artinya 1·x², jadi a = ?\n• Suku kedua: −7x. Tandanya minus, jadi b = ? (hati-hati tanda!)\n• Suku ketiga: +12, jadi c = ?',
 E'📖 x² − 7x + 12 = 0\nTulis lengkap: (1)x² + (−7)x + (12) = 0\n\n• a = 1 (jika tidak ada angka, koefisien = 1)\n• b = −7 (BUKAN 7! Tanda minus adalah bagian dari koefisien)\n• c = 12\n\n⚠️ Ingat: SELALU sertakan tanda sebagai bagian dari koefisien.',
 E'✅ Tepat! a = 1, b = −7, c = 12. Bagus, kamu ingat bahwa tanda minus adalah bagian dari koefisien!',
 '[{"wrong": {"b": "7"}, "type": "sign_error"}, {"wrong": {"a": "0"}, "type": "missing_coefficient"}]',
 1, 2),

('Q2.1.3', 'KP2.1',
 'Tentukan nilai a, b, dan c dari:  −4x² + x − 3 = 0',
 'input',
 '{"a": "-4", "b": "1", "c": "-3"}',
 E'💡 Perhatikan dua hal: (1) tanda minus di depan 4x², dan (2) koefisien x yang tidak tertulis angkanya.',
 E'🔍 Bandingkan:\n  −4x²  + x   − 3  = 0\n  ax²   + bx  + c  = 0\n\n• −4x² → a = ? (ingat tanda!)\n• +x → hanya "x" tanpa angka, berarti b = ?\n• −3 → c = ?',
 E'📖 −4x² + x − 3 = 0\nTulis lengkap: (−4)x² + (1)x + (−3) = 0\n\n• a = −4 (tanda minus termasuk!)\n• b = 1 (jika hanya tertulis "x" tanpa angka, koefisiennya 1)\n• c = −3\n\nDua jebakan sekaligus: koefisien negatif dan koefisien 1 yang tidak tertulis.',
 E'✅ Luar biasa! a = −4, b = 1, c = −3. Kamu berhasil menangani koefisien negatif DAN koefisien yang tidak tertulis.',
 '[{"wrong": {"a": "4"}, "type": "sign_error"}, {"wrong": {"b": "0"}, "type": "missing_coefficient"}]',
 2, 3),

-- === KP 2.2: Bentuk Tidak Standar ===
('Q2.2.1', 'KP2.2',
 'Tentukan a, b, c dari:  3x = x² + 2\n(Tulis dalam bentuk standar dengan a positif)',
 'input',
 '{"a": "1", "b": "-3", "c": "2"}',
 E'💡 Persamaan ini BELUM dalam bentuk standar! Langkah pertama: pindahkan semua suku ke satu ruas sehingga ruas lain = 0.',
 E'🔍 Pindahkan semua ke kiri:\n3x = x² + 2\n3x − x² − 2 = 0\n\nSusun berdasarkan pangkat menurun:\n−x² + 3x − 2 = 0\n\nAtau kalikan seluruhnya dengan −1 agar a positif:\nx² − 3x + 2 = 0\n\nSekarang tentukan a, b, c.',
 E'📖 Langkah lengkap:\n1. 3x = x² + 2\n2. Pindahkan: 0 = x² − 3x + 2\n3. Balik: x² − 3x + 2 = 0\n4. Cocokkan: a = 1, b = −3, c = 2\n\n⚠️ Selalu susun ke bentuk standar DULU sebelum identifikasi!',
 E'✅ Benar! Kamu berhasil menyusun ke bentuk standar terlebih dahulu. a = 1, b = −3, c = 2.',
 '[{"wrong": {"a": "3", "b": "-1", "c": "-2"}, "type": "no_rearrange_partial"}]',
 2, 1),

('Q2.2.2', 'KP2.2',
 'Tentukan a, b, c dari:  x² = 9',
 'input',
 '{"a": "1", "b": "0", "c": "-9"}',
 E'💡 Pindahkan 9 ke ruas kiri. Lalu perhatikan: apakah ada suku x di persamaan ini?',
 E'🔍 x² = 9 → x² − 9 = 0\nTulis lengkap: x² + 0x − 9 = 0\n\nPerhatikan: tidak ada suku x, jadi b = ?\nDan 9 dipindah ke kiri menjadi…?',
 E'📖 x² = 9\n→ x² − 9 = 0\n→ (1)x² + (0)x + (−9) = 0\n\na = 1, b = 0, c = −9\n\nIngat:\n• Tidak ada suku x → b = 0\n• 9 pindah ke kiri → tanda berubah menjadi −9',
 E'✅ Tepat! a = 1, b = 0, c = −9. Kamu ingat bahwa jika tidak ada suku x maka b = 0, dan 9 berubah tanda saat dipindah ruas.',
 '[{"wrong": {"c": "9"}, "type": "sign_error"}, {"wrong": {"b": "9"}, "type": "no_rearrange"}]',
 2, 2),

('Q2.2.3', 'KP2.2',
 'Tentukan a, b, c dari:  5x − 2 = 3x²\n(Susun dengan suku x² di ruas kiri)',
 'input',
 '{"a": "-3", "b": "5", "c": "-2"}',
 E'💡 Pindahkan 3x² ke ruas kiri (atau pindahkan semua ke ruas kanan). Yang penting salah satu ruas = 0.',
 E'🔍 Pindahkan 3x² ke kiri:\n5x − 2 − 3x² = 0\n\nSusun berdasarkan pangkat menurun:\n−3x² + 5x − 2 = 0\n\nSekarang cocokkan dengan ax² + bx + c = 0.',
 E'📖 5x − 2 = 3x²\n→ 5x − 2 − 3x² = 0\n→ −3x² + 5x − 2 = 0\n\nCocokkan: a = −3, b = 5, c = −2\n\nAlternatif: kalikan −1 → 3x² − 5x + 2 = 0 → a = 3, b = −5, c = 2 (keduanya benar)',
 E'✅ Benar! a = −3, b = 5, c = −2. Kamu berhasil menyusun ke bentuk standar dengan tepat.',
 '[{"wrong": {"a": "3", "b": "-5", "c": "2"}, "type": "no_rearrange_sign"}, {"wrong": {"a": "5", "b": "-2", "c": "3"}, "type": "no_rearrange"}]',
 3, 3),

-- === KP 2.3: Kasus Khusus ===
('Q2.3.1', 'KP2.3',
 'Tentukan a, b, c dari:  x² − 9 = 0',
 'input',
 '{"a": "1", "b": "0", "c": "-9"}',
 E'💡 Tidak ada suku x dalam persamaan ini. Jika suku x tidak ada, berapa koefisiennya?',
 E'🔍 Tulis lengkap: x² + 0x − 9 = 0. Sekarang cocokkan dengan ax² + bx + c = 0.',
 E'📖 x² − 9 = 0\nTulis lengkap: (1)x² + (0)x + (−9) = 0\n\na = 1, b = 0, c = −9\n\n⚠️ Jika suatu suku tidak muncul, koefisiennya = 0 (bukan "tidak ada").',
 E'✅ Tepat! b = 0 karena tidak ada suku x. Bagus!',
 '[{"wrong": {"b": "-9", "c": "0"}, "type": "posisi_salah"}]',
 1, 1),

('Q2.3.2', 'KP2.3',
 'Tentukan a, b, c dari:  2x² + 4x = 0',
 'input',
 '{"a": "2", "b": "4", "c": "0"}',
 E'💡 Tidak ada konstanta (angka tanpa x) di persamaan ini. Jika konstanta tidak ada, berapa nilainya?',
 E'🔍 Tulis lengkap: 2x² + 4x + 0 = 0. Cocokkan dengan ax² + bx + c = 0.',
 E'📖 2x² + 4x = 0\nTulis lengkap: (2)x² + (4)x + (0) = 0\n\na = 2, b = 4, c = 0\n\n⚠️ Tidak ada konstanta → c = 0.',
 E'✅ Benar! c = 0 karena tidak ada konstanta. Persamaan ini tetap kuadrat karena a = 2 ≠ 0.',
 '[{"wrong": {"c": "4", "b": "0"}, "type": "posisi_salah"}]',
 1, 2),

('Q2.3.3', 'KP2.3',
 'Tentukan a, b, c dari:  −x² + 4x − 3 = 0',
 'input',
 '{"a": "-1", "b": "4", "c": "-3"}',
 E'💡 Di depan x² hanya ada tanda minus tanpa angka. Ingat: −x² sama dengan berapa kali x²?',
 E'🔍 −x² sama dengan (−1) × x². Jadi a = −1, bukan 1 atau 0.\nSekarang tentukan b dan c (perhatikan tanda!)',
 E'📖 −x² + 4x − 3 = 0\nTulis lengkap: (−1)x² + (4)x + (−3) = 0\n\na = −1 (bukan 1! tanda minus termasuk)\nb = 4\nc = −3\n\n⚠️ −x² = (−1)x², bukan (0)x² atau (1)x²',
 E'✅ Luar biasa! a = −1, b = 4, c = −3. Kamu menangani koefisien −1 dengan benar.',
 '[{"wrong": {"a": "1"}, "type": "sign_error"}, {"wrong": {"a": "0"}, "type": "missing_coefficient"}]',
 2, 3),

-- === KP 3.1: Mencari Dua Bilangan ===
('Q3.1.1', 'KP3.1',
 'Untuk x² + 5x + 6 = 0, cari dua bilangan yang hasil kalinya = 6 dan hasil jumlahnya = 5.',
 'input',
 '{"p": "2", "q": "3"}',
 E'💡 c = 6 (positif) dan b = 5 (positif). Jika keduanya positif, maka kedua bilangan yang kamu cari juga harus POSITIF. Coba daftar pasangan faktor dari 6.',
 E'🔍 Pasangan faktor dari 6:\n• 1 dan 6 → jumlah: 1 + 6 = 7 ❌\n• 2 dan 3 → jumlah: 2 + 3 = ?\nMana yang jumlahnya = 5?',
 E'📖 p × q = 6 dan p + q = 5\n\nc positif, b positif → kedua bilangan positif\n\nPasangan faktor 6:\n• 1 × 6 = 6, tapi 1 + 6 = 7 ≠ 5 ❌\n• 2 × 3 = 6, dan 2 + 3 = 5 ✅\n\nJawaban: p = 2, q = 3',
 E'✅ Tepat! 2 × 3 = 6 ✅ dan 2 + 3 = 5 ✅. Kedua syarat terpenuhi.',
 '[{"wrong": {"p": "1", "q": "6"}, "type": "pasangan_salah"}]',
 1, 1),

('Q3.1.2', 'KP3.1',
 'Untuk x² − 7x + 12 = 0, cari dua bilangan yang hasil kalinya = 12 dan hasil jumlahnya = −7.',
 'input',
 '{"p": "-3", "q": "-4"}',
 E'💡 c = 12 (positif) dan b = −7 (negatif). Jika hasil kali positif tapi jumlah negatif, maka kedua bilangan harus sama-sama… POSITIF atau NEGATIF?',
 E'🔍 Kedua bilangan harus NEGATIF (karena negatif × negatif = positif, dan negatif + negatif = negatif).\n\nPasangan faktor negatif dari 12:\n• −1 dan −12 → jumlah = −13 ❌\n• −2 dan −6 → jumlah = −8 ❌\n• −3 dan −4 → jumlah = ?',
 E'📖 p × q = 12 (positif) dan p + q = −7 (negatif)\n\nKarena kali positif tapi jumlah negatif → keduanya NEGATIF\n\n(−3) × (−4) = 12 ✅\n(−3) + (−4) = −7 ✅\n\nJawaban: p = −3, q = −4',
 E'✅ Tepat! (−3) × (−4) = 12 dan (−3) + (−4) = −7. Kamu menentukan tanda dengan benar!',
 '[{"wrong": {"p": "3", "q": "4"}, "type": "sign_error"}, {"wrong": {"p": "-2", "q": "-6"}, "type": "pasangan_salah"}]',
 2, 2),

('Q3.1.3', 'KP3.1',
 'Untuk x² + 2x − 15 = 0, cari dua bilangan yang hasil kalinya = −15 dan hasil jumlahnya = 2.',
 'input',
 '{"p": "5", "q": "-3"}',
 E'💡 c = −15 (negatif). Jika hasil kali negatif, maka kedua bilangan harus BEDA TANDA (satu positif, satu negatif). Karena jumlah = +2, bilangan positifnya harus lebih besar.',
 E'🔍 Pasangan faktor beda tanda dari 15:\n• 1 dan −15 → jumlah: 1 + (−15) = −14 ❌\n• 3 dan −5 → jumlah: 3 + (−5) = −2 ❌\n• 5 dan −3 → jumlah: 5 + (−3) = ?\n• 15 dan −1 → jumlah: 15 + (−1) = 14 ❌\nMana yang jumlahnya = +2?',
 E'📖 p × q = −15 (negatif → beda tanda) dan p + q = +2 (positif → yang positif lebih besar)\n\n5 × (−3) = −15 ✅\n5 + (−3) = 2 ✅\n\nJawaban: p = 5, q = −3\n\n⚠️ Bukan −5 dan 3! Karena (−5) + 3 = −2 ≠ +2',
 E'✅ Luar biasa! 5 × (−3) = −15 dan 5 + (−3) = 2. Kamu menangani kasus beda tanda dengan benar!',
 '[{"wrong": {"p": "-5", "q": "3"}, "type": "sign_error"}, {"wrong": {"p": "3", "q": "-5"}, "type": "sign_error_partial"}]',
 3, 3),

-- === KP 3.2: Menulis Bentuk Faktor ===
('Q3.2.1', 'KP3.2',
 'Jika dua bilangan untuk x² + 5x + 6 = 0 adalah 2 dan 3, tulis bentuk faktornya.\nFormat jawaban: (x+...)(x+...) tanpa spasi',
 'input',
 '{"answer": "(x+2)(x+3)"}',
 E'💡 Bentuk faktor: (x + p)(x + q) = 0. Masukkan p = 2 dan q = 3 langsung ke dalam bentuk ini.',
 E'🔍 p = 2 dan q = 3. Substitusi:\n(x + 2)(x + 3) = 0\n\nPastikan kamu menulis dengan format yang benar: (x+2)(x+3)',
 E'📖 Dua bilangan: p = 2, q = 3\nBentuk faktor: (x + p)(x + q) = 0\n→ (x + 2)(x + 3) = 0\n\nVerifikasi: (x+2)(x+3) = x² + 3x + 2x + 6 = x² + 5x + 6 ✅',
 E'✅ Tepat! (x+2)(x+3) = 0. Kamu bisa verifikasi dengan mengalikan kembali.',
 NULL, 1, 1),

('Q3.2.2', 'KP3.2',
 'Jika dua bilangan untuk x² − 7x + 12 = 0 adalah −3 dan −4, tulis bentuk faktornya.\nFormat jawaban: (x−...)(x−...) tanpa spasi',
 'input',
 '{"answer": "(x-3)(x-4)"}',
 E'💡 Ingat: jika p = −3, maka (x + p) = (x + (−3)) = (x − 3). Tanda di dalam kurung BERUBAH!',
 E'🔍 p = −3 → (x + (−3)) = (x − 3)\nq = −4 → (x + (−4)) = (x − 4)\n\nJadi bentuk faktornya: (x − 3)(x − 4) = 0',
 E'📖 p = −3, q = −4\n(x + (−3))(x + (−4)) = (x − 3)(x − 4) = 0\n\n⚠️ BUKAN (x+3)(x+4)! Karena bilangannya negatif, tanda di dalam kurung menjadi minus.\n\nVerifikasi: (x−3)(x−4) = x² − 4x − 3x + 12 = x² − 7x + 12 ✅',
 E'✅ Tepat! (x−3)(x−4) = 0. Kamu benar memasukkan tanda negatif.',
 '[{"wrong": {"answer": "(x+3)(x+4)"}, "type": "sign_error"}]',
 2, 2),

('Q3.2.3', 'KP3.2',
 'Jika dua bilangan untuk x² + 2x − 15 = 0 adalah 5 dan −3, tulis bentuk faktornya.\nFormat jawaban: (x+...)(x−...) tanpa spasi',
 'input',
 '{"answer": "(x+5)(x-3)"}',
 E'💡 p = 5 (positif) → (x + 5). q = −3 (negatif) → (x + (−3)) = (x − 3). Gabungkan keduanya.',
 E'🔍 p = 5 → (x + 5)\nq = −3 → (x + (−3)) = (x − 3)\n\nBentuk faktor: (x + 5)(x − 3) = 0',
 E'📖 p = 5, q = −3\n(x + 5)(x + (−3)) = (x + 5)(x − 3) = 0\n\nVerifikasi: (x+5)(x−3) = x² − 3x + 5x − 15 = x² + 2x − 15 ✅',
 E'✅ Tepat! (x+5)(x−3) = 0. Satu faktor positif, satu negatif — sesuai dengan bilangan yang ditemukan.',
 '[{"wrong": {"answer": "(x-5)(x+3)"}, "type": "sign_error"}, {"wrong": {"answer": "(x+5)(x+3)"}, "type": "sign_error"}]',
 2, 3),

-- === KP 3.3: Menentukan Akar ===
('Q3.3.1', 'KP3.3',
 'Dari (x + 2)(x + 3) = 0, tentukan akar-akarnya.\nIsi dari yang terkecil: x₁ = …, x₂ = …',
 'input',
 '{"x1": "-3", "x2": "-2"}',
 E'💡 Gunakan sifat perkalian nol: jika A × B = 0, maka A = 0 atau B = 0. Selesaikan masing-masing faktor.',
 E'🔍 Faktor 1: x + 2 = 0 → x = ?\n(pindahkan +2 ke kanan, tanda berubah!)\n\nFaktor 2: x + 3 = 0 → x = ?\n(pindahkan +3 ke kanan)',
 E'📖 (x + 2)(x + 3) = 0\n\nFaktor 1: x + 2 = 0 → x = −2\nFaktor 2: x + 3 = 0 → x = −3\n\nAkar-akar: x₁ = −3, x₂ = −2\n\n⚠️ Tanda akar BERLAWANAN dengan tanda di dalam faktor.\n(x + 2) → x = −2 (bukan +2!)',
 E'✅ Tepat! x₁ = −3 dan x₂ = −2. Tanda berubah saat memindahkan ruas!',
 '[{"wrong": {"x1": "2", "x2": "3"}, "type": "sign_error"}]',
 1, 1),

('Q3.3.2', 'KP3.3',
 'Dari (x − 3)(x − 4) = 0, tentukan akar-akarnya.\nIsi dari yang terkecil: x₁ = …, x₂ = …',
 'input',
 '{"x1": "3", "x2": "4"}',
 E'💡 x − 3 = 0 → x = ? (pindahkan −3 ke kanan, tanda berubah jadi…)',
 E'🔍 Faktor 1: x − 3 = 0 → x = 0 + 3 = 3\nFaktor 2: x − 4 = 0 → x = 0 + 4 = 4',
 E'📖 (x − 3)(x − 4) = 0\n\nx − 3 = 0 → x = 3\nx − 4 = 0 → x = 4\n\nAkar-akar: x₁ = 3, x₂ = 4\n\nVerifikasi:\n• x = 3: (3)² − 7(3) + 12 = 9 − 21 + 12 = 0 ✅\n• x = 4: (4)² − 7(4) + 12 = 16 − 28 + 12 = 0 ✅',
 E'✅ Tepat! x₁ = 3 dan x₂ = 4. Verifikasi: substitusi ke persamaan awal menghasilkan 0.',
 '[{"wrong": {"x1": "-3", "x2": "-4"}, "type": "sign_error"}]',
 1, 2),

('Q3.3.3', 'KP3.3',
 'Dari (x + 5)(x − 3) = 0, tentukan akar-akarnya.\nIsi dari yang terkecil: x₁ = …, x₂ = …',
 'input',
 '{"x1": "-5", "x2": "3"}',
 E'💡 Selesaikan masing-masing faktor:\n• x + 5 = 0 → x = ?\n• x − 3 = 0 → x = ?',
 E'🔍 Faktor 1: x + 5 = 0 → x = −5 (bukan +5!)\nFaktor 2: x − 3 = 0 → x = 3 (bukan −3!)\n\nPerhatikan: tanda SELALU BERUBAH saat pindah ruas.',
 E'📖 (x + 5)(x − 3) = 0\n\nx + 5 = 0 → x = −5\nx − 3 = 0 → x = +3\n\nAkar-akar: x₁ = −5, x₂ = 3\n\nVerifikasi:\n• x = −5: (−5)² + 2(−5) − 15 = 25 − 10 − 15 = 0 ✅\n• x = 3: (3)² + 2(3) − 15 = 9 + 6 − 15 = 0 ✅',
 E'✅ Sempurna! x₁ = −5 dan x₂ = 3. Kamu sudah menguasai faktorisasi persamaan kuadrat!',
 '[{"wrong": {"x1": "5", "x2": "-3"}, "type": "sign_error"}, {"wrong": {"x1": "-5", "x2": "-3"}, "type": "sign_error_partial"}]',
 2, 3);

-- ============================================
-- D. PROGRES DUMMY
-- ============================================

-- Andi: selesai Topik 1, sedang di KP 2.1
INSERT INTO student_mastery (student_id, kp_id, status, correct_streak, total_attempts, total_correct, last_attempt_at, mastered_at) VALUES
('11111111-1111-1111-1111-111111111111', 'KP1.1', 'mastered', 3, 3, 3, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('11111111-1111-1111-1111-111111111111', 'KP1.2', 'mastered', 3, 4, 3, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('11111111-1111-1111-1111-111111111111', 'KP1.3', 'mastered', 3, 3, 3, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('11111111-1111-1111-1111-111111111111', 'KP2.1', 'learning', 1, 4, 2, NOW() - INTERVAL '1 day', NULL),
('11111111-1111-1111-1111-111111111111', 'KP2.2', 'untouched', 0, 0, 0, NULL, NULL),
('11111111-1111-1111-1111-111111111111', 'KP2.3', 'untouched', 0, 0, 0, NULL, NULL),
('11111111-1111-1111-1111-111111111111', 'KP3.1', 'untouched', 0, 0, 0, NULL, NULL),
('11111111-1111-1111-1111-111111111111', 'KP3.2', 'untouched', 0, 0, 0, NULL, NULL),
('11111111-1111-1111-1111-111111111111', 'KP3.3', 'untouched', 0, 0, 0, NULL, NULL);

-- Budi: paling maju, sudah di Topik 3
INSERT INTO student_mastery (student_id, kp_id, status, correct_streak, total_attempts, total_correct, last_attempt_at, mastered_at) VALUES
('22222222-2222-2222-2222-222222222222', 'KP1.1', 'mastered', 3, 3, 3, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('22222222-2222-2222-2222-222222222222', 'KP1.2', 'mastered', 3, 3, 3, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
('22222222-2222-2222-2222-222222222222', 'KP1.3', 'mastered', 3, 3, 3, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
('22222222-2222-2222-2222-222222222222', 'KP2.1', 'mastered', 3, 4, 3, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('22222222-2222-2222-2222-222222222222', 'KP2.2', 'mastered', 3, 5, 4, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('22222222-2222-2222-2222-222222222222', 'KP2.3', 'mastered', 3, 3, 3, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('22222222-2222-2222-2222-222222222222', 'KP3.1', 'learning', 1, 3, 1, NOW() - INTERVAL '1 day', NULL),
('22222222-2222-2222-2222-222222222222', 'KP3.2', 'untouched', 0, 0, 0, NULL, NULL),
('22222222-2222-2222-2222-222222222222', 'KP3.3', 'untouched', 0, 0, 0, NULL, NULL);

-- Citra: stuck di awal (KP 1.2)
INSERT INTO student_mastery (student_id, kp_id, status, correct_streak, total_attempts, total_correct, last_attempt_at, mastered_at) VALUES
('33333333-3333-3333-3333-333333333333', 'KP1.1', 'mastered', 3, 4, 3, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('33333333-3333-3333-3333-333333333333', 'KP1.2', 'learning', 0, 5, 1, NOW() - INTERVAL '2 days', NULL),
('33333333-3333-3333-3333-333333333333', 'KP1.3', 'untouched', 0, 0, 0, NULL, NULL),
('33333333-3333-3333-3333-333333333333', 'KP2.1', 'untouched', 0, 0, 0, NULL, NULL),
('33333333-3333-3333-3333-333333333333', 'KP2.2', 'untouched', 0, 0, 0, NULL, NULL),
('33333333-3333-3333-3333-333333333333', 'KP2.3', 'untouched', 0, 0, 0, NULL, NULL),
('33333333-3333-3333-3333-333333333333', 'KP3.1', 'untouched', 0, 0, 0, NULL, NULL),
('33333333-3333-3333-3333-333333333333', 'KP3.2', 'untouched', 0, 0, 0, NULL, NULL),
('33333333-3333-3333-3333-333333333333', 'KP3.3', 'untouched', 0, 0, 0, NULL, NULL);

-- Dina: progres bagus, hampir selesai Topik 2
INSERT INTO student_mastery (student_id, kp_id, status, correct_streak, total_attempts, total_correct, last_attempt_at, mastered_at) VALUES
('44444444-4444-4444-4444-444444444444', 'KP1.1', 'mastered', 3, 3, 3, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
('44444444-4444-4444-4444-444444444444', 'KP1.2', 'mastered', 3, 3, 3, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('44444444-4444-4444-4444-444444444444', 'KP1.3', 'mastered', 3, 4, 3, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('44444444-4444-4444-4444-444444444444', 'KP2.1', 'mastered', 3, 3, 3, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('44444444-4444-4444-4444-444444444444', 'KP2.2', 'mastered', 3, 5, 4, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('44444444-4444-4444-4444-444444444444', 'KP2.3', 'almost', 2, 4, 3, NOW() - INTERVAL '1 day', NULL),
('44444444-4444-4444-4444-444444444444', 'KP3.1', 'untouched', 0, 0, 0, NULL, NULL),
('44444444-4444-4444-4444-444444444444', 'KP3.2', 'untouched', 0, 0, 0, NULL, NULL),
('44444444-4444-4444-4444-444444444444', 'KP3.3', 'untouched', 0, 0, 0, NULL, NULL);

-- Eka: progres lambat tapi aktif
INSERT INTO student_mastery (student_id, kp_id, status, correct_streak, total_attempts, total_correct, last_attempt_at, mastered_at) VALUES
('55555555-5555-5555-5555-555555555555', 'KP1.1', 'mastered', 3, 5, 3, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('55555555-5555-5555-5555-555555555555', 'KP1.2', 'mastered', 3, 6, 4, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('55555555-5555-5555-5555-555555555555', 'KP1.3', 'mastered', 3, 5, 3, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('55555555-5555-5555-5555-555555555555', 'KP2.1', 'learning', 0, 4, 1, NOW() - INTERVAL '1 day', NULL),
('55555555-5555-5555-5555-555555555555', 'KP2.2', 'untouched', 0, 0, 0, NULL, NULL),
('55555555-5555-5555-5555-555555555555', 'KP2.3', 'untouched', 0, 0, 0, NULL, NULL),
('55555555-5555-5555-5555-555555555555', 'KP3.1', 'untouched', 0, 0, 0, NULL, NULL),
('55555555-5555-5555-5555-555555555555', 'KP3.2', 'untouched', 0, 0, 0, NULL, NULL),
('55555555-5555-5555-5555-555555555555', 'KP3.3', 'untouched', 0, 0, 0, NULL, NULL);

-- Fajar: hampir tidak aktif
INSERT INTO student_mastery (student_id, kp_id, status, correct_streak, total_attempts, total_correct, last_attempt_at, mastered_at) VALUES
('66666666-6666-6666-6666-666666666666', 'KP1.1', 'learning', 1, 2, 1, NOW() - INTERVAL '14 days', NULL),
('66666666-6666-6666-6666-666666666666', 'KP1.2', 'untouched', 0, 0, 0, NULL, NULL),
('66666666-6666-6666-6666-666666666666', 'KP1.3', 'untouched', 0, 0, 0, NULL, NULL),
('66666666-6666-6666-6666-666666666666', 'KP2.1', 'untouched', 0, 0, 0, NULL, NULL),
('66666666-6666-6666-6666-666666666666', 'KP2.2', 'untouched', 0, 0, 0, NULL, NULL),
('66666666-6666-6666-6666-666666666666', 'KP2.3', 'untouched', 0, 0, 0, NULL, NULL),
('66666666-6666-6666-6666-666666666666', 'KP3.1', 'untouched', 0, 0, 0, NULL, NULL),
('66666666-6666-6666-6666-666666666666', 'KP3.2', 'untouched', 0, 0, 0, NULL, NULL),
('66666666-6666-6666-6666-666666666666', 'KP3.3', 'untouched', 0, 0, 0, NULL, NULL);

-- ============================================
-- E. LOG PERCOBAAN DUMMY
-- ============================================

-- Andi: percobaan di KP 2.1 (salah tanda lalu benar)
INSERT INTO attempt_logs (student_id, kp_id, question_id, attempt_number, student_answer, is_correct, error_type, feedback_level, time_spent_seconds, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'KP2.1', 'Q2.1.1', 1, '{"a": "2", "b": "3", "c": "-5"}', true, NULL, 0, 95, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'KP2.1', 'Q2.1.2', 1, '{"a": "1", "b": "7", "c": "12"}', false, 'sign_error', 1, 60, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'KP2.1', 'Q2.1.2', 2, '{"a": "1", "b": "-7", "c": "12"}', true, NULL, 0, 45, NOW() - INTERVAL '1 day');

-- Citra: banyak percobaan di KP 1.2 (stuck)
INSERT INTO attempt_logs (student_id, kp_id, question_id, attempt_number, student_answer, is_correct, error_type, feedback_level, time_spent_seconds, created_at) VALUES
('33333333-3333-3333-3333-333333333333', 'KP1.2', 'Q1.2.3', 1, '{"answer": "TIDAK"}', false, 'bentuk_tidak_standar', 1, 80, NOW() - INTERVAL '3 days'),
('33333333-3333-3333-3333-333333333333', 'KP1.2', 'Q1.2.3', 2, '{"answer": "TIDAK"}', false, 'bentuk_tidak_standar', 2, 95, NOW() - INTERVAL '3 days'),
('33333333-3333-3333-3333-333333333333', 'KP1.2', 'Q1.2.3', 3, '{"answer": "TIDAK"}', false, 'bentuk_tidak_standar', 3, 105, NOW() - INTERVAL '3 days'),
('33333333-3333-3333-3333-333333333333', 'KP1.2', 'Q1.2.2', 1, '{"answer": "YA"}', false, 'konsep_salah', 1, 40, NOW() - INTERVAL '2 days'),
('33333333-3333-3333-3333-333333333333', 'KP1.2', 'Q1.2.2', 2, '{"answer": "TIDAK"}', true, NULL, 0, 35, NOW() - INTERVAL '2 days');

-- Budi: percobaan di KP 3.1 (salah tanda faktor)
INSERT INTO attempt_logs (student_id, kp_id, question_id, attempt_number, student_answer, is_correct, error_type, feedback_level, time_spent_seconds, created_at) VALUES
('22222222-2222-2222-2222-222222222222', 'KP3.1', 'Q3.1.2', 1, '{"p": "3", "q": "4"}', false, 'sign_error', 1, 70, NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'KP3.1', 'Q3.1.2', 2, '{"p": "-3", "q": "4"}', false, 'sign_error_partial', 2, 55, NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'KP3.1', 'Q3.1.2', 3, '{"p": "-3", "q": "-4"}', true, NULL, 0, 48, NOW() - INTERVAL '1 day');

-- Dina: salah tanda di KP 2.1 dulu, lalu mulus
INSERT INTO attempt_logs (student_id, kp_id, question_id, attempt_number, student_answer, is_correct, error_type, feedback_level, time_spent_seconds, created_at) VALUES
('44444444-4444-4444-4444-444444444444', 'KP2.1', 'Q2.1.2', 1, '{"a": "1", "b": "7", "c": "12"}', false, 'sign_error', 1, 62, NOW() - INTERVAL '4 days'),
('44444444-4444-4444-4444-444444444444', 'KP2.1', 'Q2.1.2', 2, '{"a": "1", "b": "-7", "c": "12"}', true, NULL, 0, 50, NOW() - INTERVAL '4 days'),
('44444444-4444-4444-4444-444444444444', 'KP2.2', 'Q2.2.2', 1, '{"a": "1", "b": "0", "c": "9"}', false, 'sign_error', 1, 75, NOW() - INTERVAL '3 days');

-- Eka: salah tanda dan koefisien di KP 2.1
INSERT INTO attempt_logs (student_id, kp_id, question_id, attempt_number, student_answer, is_correct, error_type, feedback_level, time_spent_seconds, created_at) VALUES
('55555555-5555-5555-5555-555555555555', 'KP2.1', 'Q2.1.2', 1, '{"a": "1", "b": "7", "c": "12"}', false, 'sign_error', 1, 88, NOW() - INTERVAL '2 days'),
('55555555-5555-5555-5555-555555555555', 'KP2.1', 'Q2.1.3', 1, '{"a": "4", "b": "1", "c": "-3"}', false, 'sign_error', 1, 90, NOW() - INTERVAL '1 day'),
('55555555-5555-5555-5555-555555555555', 'KP2.1', 'Q2.1.3', 2, '{"a": "-4", "b": "0", "c": "-3"}', false, 'missing_coefficient', 2, 70, NOW() - INTERVAL '1 day');

-- ============================================
-- SELESAI
-- ============================================
