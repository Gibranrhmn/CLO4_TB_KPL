
class QuizDataManager {
    constructor() {
        this.apiBaseUrl = 'https://opentdb.com/api.php';
        this.localQuestions = this.initializeLocalQuestions();
        this.categoryNames = this.initializeCategoryNames();
    }

    /* Pertanyaan Lokal */
    initializeLocalQuestions() {
        return {
            18: [ // Komputer
                {
                    question: "Apa kepanjangan dari CPU?",
                    correct_answer: "Central Processing Unit",
                    incorrect_answers: ["Central Performance Unit", "Control Processing Unit", "Central Process Unit"],
                    hint: "Unit pemrosesan utama pada komputer"
                },
                {
                    question: "Bahasa pemrograman mana yang digunakan untuk pengembangan web frontend?",
                    correct_answer: "JavaScript",
                    incorrect_answers: ["Python", "C++", "Java"],
                    hint: "Bahasa yang berjalan di browser web"
                },
                {
                    question: "Apa singkatan dari HTML?",
                    correct_answer: "HyperText Markup Language",
                    incorrect_answers: ["High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
                    hint: "Bahasa markup untuk membuat halaman web"
                },
                {
                    question: "Berapa bit dalam 1 byte?",
                    correct_answer: "8",
                    incorrect_answers: ["4", "16", "32"],
                    hint: "Jumlah bit standar dalam satu byte"
                },
                {
                    question: "Protokol apa yang digunakan untuk mengirim email?",
                    correct_answer: "SMTP",
                    incorrect_answers: ["HTTP", "FTP", "TCP"],
                    hint: "Simple Mail Transfer Protocol"
                }
            ],
            19: [ // Matematika
                {
                    question: "Berapa hasil dari 15 × 8?",
                    correct_answer: "120",
                    incorrect_answers: ["110", "130", "115"],
                    hint: "15 dikali 8"
                },
                {
                    question: "Apa nama sudut yang besarnya 90 derajat?",
                    correct_answer: "Sudut siku-siku",
                    incorrect_answers: ["Sudut tumpul", "Sudut lancip", "Sudut refleks"],
                    hint: "Sudut yang membentuk huruf L"
                },
                {
                    question: "Berapa nilai π (pi) yang dibulatkan ke 2 desimal?",
                    correct_answer: "3.14",
                    incorrect_answers: ["3.12", "3.16", "3.18"],
                    hint: "Konstanta matematika untuk lingkaran"
                },
                {
                    question: "Apa rumus luas segitiga?",
                    correct_answer: "½ × alas × tinggi",
                    incorrect_answers: ["alas × tinggi", "2 × alas × tinggi", "alas + tinggi"],
                    hint: "Setengah kali alas kali tinggi"
                },
                {
                    question: "Berapa akar kuadrat dari 144?",
                    correct_answer: "12",
                    incorrect_answers: ["11", "13", "14"],
                    hint: "Angka yang jika dikuadratkan menghasilkan 144"
                }
            ],
            23: [ // Sejarah
                {
                    question: "Siapa presiden pertama Indonesia?",
                    correct_answer: "Soekarno",
                    incorrect_answers: ["Soeharto", "Habibie", "Megawati"],
                    hint: "Proklamator kemerdekaan Indonesia"
                },
                {
                    question: "Tahun berapa Proklamasi Kemerdekaan Indonesia dibacakan?",
                    correct_answer: "1945",
                    incorrect_answers: ["1946", "1944", "1950"],
                    hint: "Tanggal 17 Agustus tahun ini"
                },
                {
                    question: "Siapa yang merancang teks Proklamasi Kemerdekaan Indonesia?",
                    correct_answer: "Soekarno-Hatta",
                    incorrect_answers: ["Soekarno saja", "Ahmad Soebardjo", "Tan Malaka"],
                    hint: "Dua tokoh proklamator"
                },
                {
                    question: "Kapan Perang Diponegoro terjadi?",
                    correct_answer: "1825-1830",
                    incorrect_answers: ["1820-1825", "1830-1835", "1815-1820"],
                    hint: "Perang melawan Belanda di Jawa"
                },
                {
                    question: "Siapa sultan pertama Kesultanan Mataram?",
                    correct_answer: "Panembahan Senopati",
                    incorrect_answers: ["Sultan Agung", "Amangkurat I", "Pakubuwono I"],
                    hint: "Pendiri dinasti Mataram"
                }
            ],
            17: [ // Biologi
                {
                    question: "Organel sel yang bertugas sebagai pusat pengendali aktivitas sel adalah?",
                    correct_answer: "Nukleus",
                    incorrect_answers: ["Mitokondria", "Ribosom", "Lisosom"],
                    hint: "Inti sel yang mengandung DNA"
                },
                {
                    question: "Proses fotosintesis pada tumbuhan menghasilkan?",
                    correct_answer: "Glukosa dan oksigen",
                    incorrect_answers: ["Karbon dioksida", "Air", "Nitrogen"],
                    hint: "Produk dari proses fotosintesis"
                },
                {
                    question: "Bagian tumbuhan yang berfungsi untuk menyerap air adalah?",
                    correct_answer: "Akar",
                    incorrect_answers: ["Batang", "Daun", "Bunga"],
                    hint: "Bagian yang berada di dalam tanah"
                },
                {
                    question: "Sistem peredaran darah manusia terdiri dari berapa ruang jantung?",
                    correct_answer: "4",
                    incorrect_answers: ["2", "3", "5"],
                    hint: "Dua atrium dan dua ventrikel"
                },
                {
                    question: "Apa nama proses pernapasan sel?",
                    correct_answer: "Respirasi selular",
                    incorrect_answers: ["Fotosintesis", "Osmosis", "Difusi"],
                    hint: "Proses mengubah glukosa menjadi energi"
                }
            ],
            24: [ // Kimia
                {
                    question: "Simbol kimia untuk air adalah?",
                    correct_answer: "H₂O",
                    incorrect_answers: ["O₂", "CO₂", "HO"],
                    hint: "Dua atom hidrogen dan satu atom oksigen"
                },
                {
                    question: "Asam sulfat memiliki rumus kimia?",
                    correct_answer: "H₂SO₄",
                    incorrect_answers: ["HCl", "NaOH", "H₂O₂"],
                    hint: "Asam kuat yang mengandung sulfur"
                },
                {
                    question: "Unsur dengan nomor atom 1 adalah?",
                    correct_answer: "Hidrogen",
                    incorrect_answers: ["Helium", "Karbon", "Oksigen"],
                    hint: "Unsur paling ringan di alam semesta"
                },
                {
                    question: "Apa nama proses perubahan wujud dari gas ke cair?",
                    correct_answer: "Kondensasi",
                    incorrect_answers: ["Evaporasi", "Sublimasi", "Solidifikasi"],
                    hint: "Kebalikan dari penguapan"
                },
                {
                    question: "pH air murni adalah?",
                    correct_answer: "7",
                    incorrect_answers: ["0", "14", "1"],
                    hint: "Netral, tidak asam tidak basa"
                }
            ],
            22: [ // Geografi
                {
                    question: "Apa nama pulau terbesar di Indonesia?",
                    correct_answer: "Kalimantan",
                    incorrect_answers: ["Sumatra", "Papua", "Jawa"],
                    hint: "Pulau yang berbagi dengan Malaysia dan Brunei"
                },
                {
                    question: "Gunung tertinggi di dunia adalah?",
                    correct_answer: "Mount Everest",
                    incorrect_answers: ["K2", "Kilimanjaro", "Mont Blanc"],
                    hint: "Terletak di perbatasan Nepal-Tibet"
                },
                {
                    question: "Benua apa yang memiliki luas terkecil?",
                    correct_answer: "Australia",
                    incorrect_answers: ["Eropa", "Antartika", "Amerika Selatan"],
                    hint: "Benua yang juga merupakan negara"
                },
                {
                    question: "Sungai terpanjang di dunia adalah?",
                    correct_answer: "Sungai Nil",
                    incorrect_answers: ["Sungai Amazon", "Sungai Mississippi", "Sungai Yangtze"],
                    hint: "Mengalir melalui Mesir"
                },
                {
                    question: "Ibu kota Australia adalah?",
                    correct_answer: "Canberra",
                    incorrect_answers: ["Sydney", "Melbourne", "Perth"],
                    hint: "Bukan Sydney atau Melbourne"
                }
            ]
        };
    }

    /* Kategori */
    initializeCategoryNames() {
        return {
            18: "Komputer",
            19: "Matematika", 
            23: "Sejarah",
            17: "Biologi",
            24: "Kimia",
            22: "Geografi"
        };
    }

    /*API Pertanyaan*/
    async fetchQuestionsFromAPI(amount, category, difficulty) {
        const url = `${this.apiBaseUrl}?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.response_code !== 0) {
                throw new Error(`API Error: ${this.getApiErrorMessage(data.response_code)}`);
            }
            
            return this.formatApiQuestions(data.results);
            
        } catch (error) {
            console.warn('API fetch failed:', error.message);
            return null;
        }
    }

    /* Pemformataan Pertanyaan API */
    formatApiQuestions(apiResults) {
        return apiResults.map(question => ({
            question: this.decodeHtml(question.question),
            correct_answer: this.decodeHtml(question.correct_answer),
            incorrect_answers: question.incorrect_answers.map(answer => this.decodeHtml(answer)),
            hint: this.generateHint(question.question),
            difficulty: question.difficulty,
            category: question.category
        }));
    }

    /* Mengambil Soal dari API*/
    async getQuestions(amount, category, difficulty) {
        // API
        const apiQuestions = await this.fetchQuestionsFromAPI(amount, category, difficulty);
        
        if (apiQuestions && apiQuestions.length >= amount) {
            return {
                questions: apiQuestions.slice(0, amount),
                source: 'api'
            };
        }
        
        // Fallback ke Lokal
        const localQuestions = this.getLocalQuestions(amount, category, difficulty);
        return {
            questions: localQuestions,
            source: 'local'
        };
    }

    /*Mengambil pertnyaan lokal*/
    getLocalQuestions(amount, category, difficulty) {
        let questions = this.localQuestions[category] || [];
        
        // Filter kesulitan
        if (difficulty && questions.length > 0 && questions[0].difficulty) {
            questions = questions.filter(q => q.difficulty === difficulty);
        }
        
        // Handling kekurangan soal
        while (questions.length < amount && questions.length > 0) {
            questions = [...questions, ...this.localQuestions[category]];
        }
        
        // Acak Soal
        return this.shuffleArray([...questions]).slice(0, amount);
    }

    /* Random Hint*/
    generateHint(question) {
        const hints = [
            "Pikirkan dengan baik...",
            "Ingat pelajaran sekolah...",
            "Gunakan logika...",
            "Pertimbangkan semua pilihan...",
            "Jawaban ada dalam pikiran Anda..."
        ];
        
        return hints[Math.floor(Math.random() * hints.length)];
    }

    /*Decode HTML */
    decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    /*Acak Soal*/
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /*Handling Error API*/
    getApiErrorMessage(code) {
        const messages = {
            1: "No Results - Could not return results.",
            2: "Invalid Parameter - Arguments passed are not valid.",
            3: "Token Not Found - Session Token not found.",
            4: "Token Empty - Token has returned all possible questions.",
            5: "Rate Limit - Too many requests."
        };
        return messages[code] || `Unknown error (Code: ${code})`;
    }

    /*Get Kategori*/
    getCategoryName(categoryId) {
        return this.categoryNames[categoryId] || 'Unknown';
    }

    /*Kategori Tersedia*/
    getAvailableCategories() {
        return Object.keys(this.categoryNames).map(id => ({
            id: parseInt(id),
            name: this.categoryNames[id]
        }));
    }

    /*Hitung Stat*/
    getLocalStats() {
        const stats = {};
        Object.keys(this.localQuestions).forEach(category => {
            stats[category] = {
                name: this.categoryNames[category],
                count: this.localQuestions[category].length
            };
        });
        return stats;
    }
}