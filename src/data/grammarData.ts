export interface GrammarExample {
  english: string;
  uzbek: string;
  audio?: string; // Optional for future TTS integration
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation?: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  level: 'A1 – Beginner (Asoslar)' | 'A2 – Elementary' | 'B1 – Intermediate' | 'B2 – Upper-Intermediate' | 'C1 – Advanced';
  description: string;
  content: {
    rule: string;
    formulas: {
      type: 'positive' | 'negative' | 'question';
      structure: string;
      example: string;
    }[];
    examples: GrammarExample[];
    note?: string;
  };
  quiz?: QuizQuestion[];
}

export const grammarTopics: GrammarTopic[] = [
  {
    id: 'alphabet',
    title: 'Alphabet & Pronunciation',
    level: 'A1 – Beginner (Asoslar)',
    description: "Ingliz tili alifbosi va harflarning o'qilishi.",
    content: {
      rule: "Ingliz alifbosida 26 ta harf bor: 5 ta unli (Vowels: A, E, I, O, U) va 21 ta undosh (Consonants). Harflarning nomi va so'z ichida o'qilishi farq qilishi mumkin. Unli harflar tovushni ochiq chiqaradi, undosh harflar esa tovushni to'sib turadi.",
      formulas: [
        {
          type: 'positive',
          structure: 'Unlilar (Vowels)',
          example: 'A [ei], E [i:], I [ai], O [ou], U [ju:]'
        },
        {
          type: 'positive',
          structure: 'Undoshlar (Consonants)',
          example: 'B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z'
        }
      ],
      examples: [
        { english: 'Apple', uzbek: 'Olma (A - [æ] tovushi)' },
        { english: 'Book', uzbek: 'Kitob (B - [b] tovushi)' },
        { english: 'Cat', uzbek: 'Mushuk (C - [k] tovushi)' },
        { english: 'Dog', uzbek: 'It (D - [d] tovushi)' },
        { english: 'Elephant', uzbek: 'Fil (E - [e] tovushi)' },
        { english: 'Fish', uzbek: 'Baliq (F - [f] tovushi)' },
        { english: 'Hello', uzbek: 'Salom (H - [h] tovushi)' },
        { english: 'Yes', uzbek: 'Ha (Y - [j] tovushi)' }
      ],
      note: "Eslab qoling: Harf nomi va so'z ichidagi tovushi har doim bir xil emas. Masalan, 'A' harfi [ei] deb o'qiladi, lekin 'Apple' so'zida [æ] tovushini beradi. Ingliz tilida bir harf turli tovushlarni berishi mumkin."
    },
    quiz: [
      {
        question: "Ingliz tilida nechta unli harf bor?",
        options: ["5", "6", "21", "26"],
        correctAnswer: 0
      },
      {
        question: "Qaysi biri undosh harf?",
        options: ["A", "E", "B", "I"],
        correctAnswer: 2
      },
      {
        question: "'Apple' so'zi qaysi harf bilan boshlanadi?",
        options: ["B", "A", "C", "D"],
        correctAnswer: 1
      },
      {
        question: "Ingliz alifbosida jami nechta harf bor?",
        options: ["24", "25", "26", "27"],
        correctAnswer: 2
      },
      {
        question: "Qaysi harflar unli hisoblanadi?",
        options: ["A, B, C, D, E", "A, E, I, O, U", "B, C, D, F, G", "X, Y, Z"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'nouns',
    title: 'Nouns (Otlar)',
    level: 'A1 – Beginner (Asoslar)',
    description: "Sanaladigan va sanalmaydigan otlar.",
    content: {
      rule: "Otlar (Nouns) - shaxs, narsa yoki joy nomlari. Ular ikki turga bo'linadi:\n\n1. SANALADIGAN OTLAR (Countable Nouns):\n- Dona-dona sanash mumkin (1 book, 2 books, 3 books)\n- Birlik va ko'plik shakli bor\n- Ko'plikda odatda '-s' yoki '-es' qo'shiladi\n- Oldidan 'a/an' ishlatiladi (birlikda)\n\n2. SANALMAYDIGAN OTLAR (Uncountable Nouns):\n- Sanab bo'lmaydi (water, milk, sugar, love, music)\n- Faqat birlik shaklida ishlatiladi\n- Oldidan 'a/an' ishlatilmaydi\n- Ko'plik shakli yo'q",
      formulas: [
        {
          type: 'positive',
          structure: 'Singular (Birlik)',
          example: 'a book, a pen, an apple'
        },
        {
          type: 'positive',
          structure: 'Plural (Ko\'plik) + s/es/ies',
          example: 'books, pens, boxes, babies'
        }
      ],
      examples: [
        { english: 'I have a book.', uzbek: 'Menda kitob bor. (Sanaladigan - birlik)' },
        { english: 'I have three books.', uzbek: 'Menda uchta kitob bor. (Sanaladigan - ko\'plik)' },
        { english: 'Water is important.', uzbek: 'Suv muhim. (Sanalmaydigan)' },
        { english: 'She has two cats.', uzbek: 'Uning ikkita mushuki bor. (Sanaladigan)' },
        { english: 'I need some milk.', uzbek: 'Menga sut kerak. (Sanalmaydigan)' },
        { english: 'There are many students.', uzbek: 'Ko\'p talabalar bor. (Sanaladigan)' },
        { english: 'Love is beautiful.', uzbek: 'Sevgi go\'zal. (Sanalmaydigan)' }
      ],
      note: "Ko'plik yasash qoidalari:\n- Odatda: book → books, car → cars\n- -s, -sh, -ch, -x, -o bilan tugasa: box → boxes, bus → buses\n- Undosh + y bilan tugasa: baby → babies, city → cities\n- Istisnolar: child → children, man → men, woman → women, tooth → teeth"
    },
    quiz: [
      {
        question: "Qaysi biri sanalmaydigan ot?",
        options: ["Apple", "Car", "Water", "Pen"],
        correctAnswer: 2
      },
      {
        question: "'Book' so'zining ko'pligi qanday?",
        options: ["Bookes", "Books", "Book", "Bookies"],
        correctAnswer: 1
      },
      {
        question: "To'g'ri gapni toping.",
        options: ["I have two pen.", "I have two pens.", "I has two pens.", "I have two penes."],
        correctAnswer: 1
      },
      {
        question: "'Baby' so'zining ko'plik shakli qanday?",
        options: ["Babys", "Babies", "Babyes", "Babyies"],
        correctAnswer: 1
      },
      {
        question: "Qaysi gap to'g'ri?",
        options: ["I drink a water.", "I drink water.", "I drink waters.", "I drink a waters."],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'articles',
    title: 'Articles (A/An/The)',
    level: 'A1 – Beginner (Asoslar)',
    description: "Artikllarning ishlatilishi.",
    content: {
      rule: "Ingliz tilida otlar oldida artikl ishlatiladi. Uch xil artikl bor:\n\n1. 'A' - Undosh TOVUSH bilan boshlanadigan birlik otlar oldidan\n   (a book, a car, a university)\n\n2. 'AN' - Unli TOVUSH bilan boshlanadigan birlik otlar oldidan\n   (an apple, an hour, an umbrella)\n\n3. 'THE' - Aniq, ma'lum narsalar uchun\n   - Ikkinchi marta eslatilganda\n   - Yagona narsalar (the sun, the moon)\n   - Suhbatdoshga ma'lum narsa",
      formulas: [
        {
          type: 'positive',
          structure: 'a + Undosh tovush',
          example: 'a car, a university [ju:], a European [jo:]'
        },
        {
          type: 'positive',
          structure: 'an + Unli tovush',
          example: 'an apple, an hour [au], an honest [o]'
        },
        {
          type: 'positive',
          structure: 'the + Aniq ot',
          example: 'the sun, the book (ma\'lum kitob)'
        }
      ],
      examples: [
        { english: 'I have a pen.', uzbek: 'Menda ruchka bor. (Biror ruchka)' },
        { english: 'This is an orange.', uzbek: 'Bu apelsin. (Unli tovush)' },
        { english: 'The pen is blue.', uzbek: 'Ruchka ko\'k. (Aniq ruchka)' },
        { english: 'She is a teacher.', uzbek: 'U o\'qituvchi. (Kasb)' },
        { english: 'An hour has 60 minutes.', uzbek: 'Bir soatda 60 daqiqa bor. (hour - [au])' },
        { english: 'The Earth goes around the Sun.', uzbek: 'Yer Quyosh atrofida aylanadi. (Yagona)' },
        { english: 'I saw a cat. The cat was black.', uzbek: 'Men mushuk ko\'rdim. Mushuk qora edi. (Ikkinchi marta)' },
        { english: 'He is a university student.', uzbek: 'U universitet talabasi. (university - [ju:])' }
      ],
      note: "MUHIM: Harf emas, TOVUSHGA qarang!\n- 'a' university (yu-ni-ver-si-ty - undosh tovush)\n- 'an' hour (au-r - unli tovush, 'h' o'qilmaydi)\n- 'a' European (yo-ro-pi-an - undosh tovush)\n- 'an' honest (o-nist - unli tovush, 'h' o'qilmaydi)\n\nKo'plik va sanalmaydigan otlar bilan 'a/an' ishlatilmaydi!"
    },
    quiz: [
      {
        question: "This is ___ apple.",
        options: ["a", "an", "the", "-"],
        correctAnswer: 1
      },
      {
        question: "I see ___ car.",
        options: ["a", "an", "two", "none"],
        correctAnswer: 0
      },
      {
        question: "___ sun is hot.",
        options: ["A", "An", "The", "-"],
        correctAnswer: 2
      },
      {
        question: "She is ___ honest girl.",
        options: ["a", "an", "the", "-"],
        correctAnswer: 1
      },
      {
        question: "He goes to ___ university.",
        options: ["a", "an", "the", "-"],
        correctAnswer: 0
      },
      {
        question: "I bought a book. ___ book is interesting.",
        options: ["A", "An", "The", "-"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'pronouns',
    title: 'Pronouns (Olmoshlar)',
    level: 'A1 – Beginner (Asoslar)',
    description: "Kishilik va egalik olmoshlari.",
    content: {
      rule: "Kishilik olmoshlari (Personal Pronouns) gapda ega bo'lib keladi. Egalik olmoshlari (Possessive Adjectives) narsaning kimga tegishli ekanligini bildiradi va o'zidan keyin ot talab qiladi.",
      formulas: [
        {
          type: 'positive',
          structure: 'I -> My',
          example: 'I am Ali. My name is Ali.'
        },
        {
          type: 'positive',
          structure: 'You -> Your',
          example: 'You are student. Your book is here.'
        },
        {
          type: 'positive',
          structure: 'He -> His | She -> Her',
          example: 'He is Tom. His car is red.'
        }
      ],
      examples: [
        { english: 'I like my cat.', uzbek: 'Men mushugimni yaxshi ko\'raman.' },
        { english: 'She loves her family.', uzbek: 'U oilasini sevadi.' },
        { english: 'They clean their room.', uzbek: 'Ular xonasini tozalaydi.' }
      ],
      note: "Eslab qoling: \nI-My, You-Your, He-His, She-Her, It-Its, We-Our, They-Their"
    },
    quiz: [
      {
        question: "I am a student. ___ name is Akmal.",
        options: ["My", "Your", "His", "Her"],
        correctAnswer: 0
      },
      {
        question: "She is a doctor. ___ coat is white.",
        options: ["His", "Her", "My", "Its"],
        correctAnswer: 1
      },
      {
        question: "We love ___ country.",
        options: ["their", "your", "our", "my"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'adjectives',
    title: 'Adjectives (Sifatlar)',
    level: 'A1 – Beginner (Asoslar)',
    description: "Sifatlar va so'z tartibi.",
    content: {
      rule: "Sifatlar (Adjectives) otni tasvirlaydi (qanday?). Ingliz tilida sifat har doim otdan OLDIN keladi yoki 'to be' fe'lidan KEYIN keladi.",
      formulas: [
        {
          type: 'positive',
          structure: 'Adjective + Noun',
          example: 'A red car (Qizil mashina)'
        },
        {
          type: 'positive',
          structure: 'To be + Adjective',
          example: 'The car is red. (Mashina qizil)'
        }
      ],
      examples: [
        { english: 'It is a big house.', uzbek: 'Bu katta uy.' },
        { english: 'She is beautiful.', uzbek: 'U chiroyli.' },
        { english: 'I have a new phone.', uzbek: 'Menda yangi telefon bor.' }
      ],
      note: "O'zbek tilidagi kabi sifat otdan keyin kelmaydi (Car red EMAS)."
    },
    quiz: [
      {
        question: "To'g'ri so'z tartibini toping.",
        options: ["A car red", "A red car", "Car a red", "Red a car"],
        correctAnswer: 1
      },
      {
        question: "He is a ___ boy.",
        options: ["good", "well", "fine", "nice to"],
        correctAnswer: 0
      },
      {
        question: "The movie is ___.",
        options: ["interest", "interesting", "interests", "interested"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'prepositions-place',
    title: 'Prepositions of Place (In/On/At)',
    level: 'A1 – Beginner (Asoslar)',
    description: "Joy predloglari: In, On, At.",
    content: {
      rule: "Joylashuvni ifodalash uchun:\n'In' - ichida yoki yopiq hududda (in the box, in London).\n'On' - ustida yoki yuzada (on the table, on the wall).\n'At' - aniq bir nuqtada yoki muassasada (at home, at school, at the bus stop).",
      formulas: [
        {
          type: 'positive',
          structure: 'in + enclosed space',
          example: 'in the room, in the bag'
        },
        {
          type: 'positive',
          structure: 'on + surface',
          example: 'on the floor, on the chair'
        },
        {
          type: 'positive',
          structure: 'at + specific point',
          example: 'at the door, at work'
        }
      ],
      examples: [
        { english: 'The pen is on the table.', uzbek: 'Ruchka stol ustida.' },
        { english: 'We live in Tashkent.', uzbek: 'Biz Toshkentda yashaymiz.' },
        { english: 'He is at school.', uzbek: 'U maktabda.' }
      ],
      note: "Istisnolar ko'p, lekin asosiysi: In (ichida), On (ustida), At (yonida/da)."
    },
    quiz: [
      {
        question: "The book is ___ the bag.",
        options: ["on", "at", "in", "to"],
        correctAnswer: 2
      },
      {
        question: "The picture is ___ the wall.",
        options: ["in", "on", "at", "under"],
        correctAnswer: 1
      },
      {
        question: "She is waiting ___ the bus stop.",
        options: ["in", "on", "at", "for"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'to-be',
    title: 'To Be (Am/Is/Are)',
    level: 'A1 – Beginner (Asoslar)',
    description: "Ingliz tilidagi eng muhim yordamchi fe'l.",
    content: {
      rule: "\"To be\" fe'li o'zbek tiliga \"bo'lmoq\" deb tarjima qilinadi, lekin ko'pincha gapda tushib qoladi (masalan: Men talabaman). U shaxs va narsaning holatini, kimligini yoki qayerdaligini bildiradi.",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + am/is/are + ...',
          example: 'I am a student.'
        },
        {
          type: 'negative',
          structure: 'Subject + am/is/are + not + ...',
          example: 'She is not (isn\'t) busy.'
        },
        {
          type: 'question',
          structure: 'Am/Is/Are + Subject + ...?',
          example: 'Are they happy?'
        }
      ],
      examples: [
        { english: 'I am happy.', uzbek: 'Men xursandman.' },
        { english: 'She is a doctor.', uzbek: 'U shifokor.' },
        { english: 'We are friends.', uzbek: 'Biz do\'stlarmiz.' },
        { english: 'It is a book.', uzbek: 'Bu kitob.' }
      ],
      note: "Eslab qoling: \nI -> am\nHe/She/It -> is\nWe/You/They -> are"
    },
    quiz: [
      {
        question: "She ___ a teacher.",
        options: ["am", "is", "are", "be"],
        correctAnswer: 1
      },
      {
        question: "___ they at home?",
        options: ["Am", "Is", "Are", "Be"],
        correctAnswer: 2
      },
      {
        question: "I ___ not hungry.",
        options: ["am", "is", "are", "be"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'there-is-are',
    title: 'There is / There are',
    level: 'A1 – Beginner (Asoslar)',
    description: "Borligini ifodalash.",
    content: {
      rule: "Biror narsaning borligini aytish uchun ishlatiladi.\n'There is' - birlikdagi narsalar uchun (There is a car).\n'There are' - ko'plikdagi narsalar uchun (There are cars).",
      formulas: [
        {
          type: 'positive',
          structure: 'There is + a/an + Singular Noun',
          example: 'There is a cat in the garden.'
        },
        {
          type: 'positive',
          structure: 'There are + Plural Noun',
          example: 'There are two books on the table.'
        },
        {
          type: 'question',
          structure: 'Is there ...? / Are there ...?',
          example: 'Is there a problem?'
        }
      ],
      examples: [
        { english: 'There is a pen on the desk.', uzbek: 'Partada ruchka bor.' },
        { english: 'There are apples in the box.', uzbek: 'Qutida olmalar bor.' },
        { english: 'There is no water.', uzbek: 'Suv yo\'q.' }
      ],
      note: "O'zbek tiliga ko'pincha gapning oxiridan tarjima qilinadi (... bor)."
    },
    quiz: [
      {
        question: "___ a book on the table.",
        options: ["There are", "There is", "It is", "They are"],
        correctAnswer: 1
      },
      {
        question: "___ many people in the park.",
        options: ["There is", "There are", "This is", "That is"],
        correctAnswer: 1
      },
      {
        question: "___ a TV in your room?",
        options: ["Are there", "Is there", "Example", "There is"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'present-simple',
    title: 'Present Simple',
    level: 'A1 – Beginner (Asoslar)',
    description: "Oddiy hozirgi zamon va takroriylik.",
    content: {
      rule: "Present Simple (Oddiy hozirgi zamon) har doim, odatda sodir bo'ladigan ish-harakatlar uchun ishlatiladi. \nTez-tezlik ravishlari (Adverbs of Frequency) - always (doim), usually (odatda), often (tez-tez), sometimes (ba'zan), never (hech qachon) - odatda egadan keyin, lekin 'to be' dan keyin keladi.",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + V1 (s/es)',
          example: 'He always plays football.'
        },
        {
          type: 'negative',
          structure: 'Subject + do/does + not + V1',
          example: 'I usually do not (don\'t) sleep late.'
        },
        {
          type: 'question',
          structure: 'Do/Does + Subject + V1 ...?',
          example: 'Do you speak English?'
        }
      ],
      examples: [
        { english: 'I always wake up at 7 AM.', uzbek: 'Men doim soat 7 da uyg\'onaman.' },
        { english: 'He often watches TV.', uzbek: 'U tez-tez televizor ko\'radi.' },
        { english: 'We never smoke.', uzbek: 'Biz hech qachon chekmaymiz.' }
      ],
      note: "Eslab qoling: He/She/It uchun fe'lga 's' yoki 'es' qo'shiladi."
    },
    quiz: [
      {
        question: "He ___ football every Sunday.",
        options: ["play", "plays", "playing", "played"],
        correctAnswer: 1
      },
      {
        question: "I ___ go to strict gym.",
        options: ["usually", "is", "does", "are"],
        correctAnswer: 0
      },
      {
        question: "She ___ usually eat breakfast.",
        options: ["doesn't", "don't", "not", "isn't"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'have-has',
    title: 'Have / Has got',
    level: 'A1 – Beginner (Asoslar)',
    description: "'Bor bo'lmoq' fe'li.",
    content: {
      rule: "Have (bor bo'lmoq) egalikni bildiradi. \nI/You/We/They -> have\nHe/She/It -> has",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + have/has',
          example: 'I have a car. She has a doll.'
        },
        {
          type: 'negative',
          structure: 'Subject + do/does + not + have',
          example: 'I don\'t have money. He doesn\'t have time.'
        },
        {
          type: 'question',
          structure: 'Do/Does + Subject + have ...?',
          example: 'Do you have a pen?'
        }
      ],
      examples: [
        { english: 'I have two brothers.', uzbek: 'Mening ikkita akam bor.' },
        { english: 'She has a beautiful house.', uzbek: 'Uning chiroyli uyi bor.' },
        { english: 'Do you have a question?', uzbek: 'Savolingiz bormi?' }
      ],
      note: "Ko'pincha 'have got' / 'has got' shaklida ham ishlatiladi (I have got = I have)."
    },
    quiz: [
      {
        question: "I ___ a big family.",
        options: ["has", "have", "haves", "is"],
        correctAnswer: 1
      },
      {
        question: "She ___ new shoes.",
        options: ["have", "has", "is", "are"],
        correctAnswer: 1
      },
      {
        question: "___ you have a car?",
        options: ["Does", "Do", "Is", "Are"],
        correctAnswer: 1
      }
    ]
  },
  // ============ ELEMENTARY (A2) LEVEL ============
  {
    id: 'present-continuous',
    title: 'Present Continuous',
    level: 'A2 – Elementary',
    description: "Hozir sodir bo'layotgan harakatlar.",
    content: {
      rule: "Present Continuous (Hozirgi davomiy zamon) ayni paytda sodir bo'layotgan harakatlarni bildiradi. 'To be' + V-ing shakli bilan yasaladi.",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + am/is/are + V-ing',
          example: 'I am reading a book now.'
        },
        {
          type: 'negative',
          structure: 'Subject + am/is/are + not + V-ing',
          example: 'She is not (isn\'t) watching TV.'
        },
        {
          type: 'question',
          structure: 'Am/Is/Are + Subject + V-ing?',
          example: 'Are you listening to me?'
        }
      ],
      examples: [
        { english: 'I am studying English now.', uzbek: 'Men hozir ingliz tilini o\'rganyapman.' },
        { english: 'They are playing football.', uzbek: 'Ular futbol o\'ynayapti.' },
        { english: 'She is cooking dinner.', uzbek: 'U kechki ovqat tayyorlayapti.' }
      ],
      note: "Vaqt ko'rsatkichlari: now (hozir), at the moment (ayni paytda), right now (hozir)."
    },
    quiz: [
      {
        question: "I ___ a book right now.",
        options: ["read", "am reading", "reads", "reading"],
        correctAnswer: 1
      },
      {
        question: "___ she working today?",
        options: ["Does", "Do", "Is", "Are"],
        correctAnswer: 2
      },
      {
        question: "They ___ not listening.",
        options: ["is", "am", "are", "be"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'present-simple-vs-continuous',
    title: 'Present Simple vs Present Continuous',
    level: 'A2 – Elementary',
    description: "Ikki zamonning farqi.",
    content: {
      rule: "Present Simple - odatiy, takrorlanadigan harakatlar uchun.\nPresent Continuous - hozir sodir bo'layotgan harakatlar uchun.",
      formulas: [
        {
          type: 'positive',
          structure: 'Simple: Subject + V1(s/es)',
          example: 'I work every day. (Har kuni)'
        },
        {
          type: 'positive',
          structure: 'Continuous: Subject + am/is/are + V-ing',
          example: 'I am working now. (Hozir)'
        }
      ],
      examples: [
        { english: 'I usually drink coffee. (odatda)', uzbek: 'Men odatda qahva ichaman.' },
        { english: 'I am drinking tea now. (hozir)', uzbek: 'Men hozir choy ichyapman.' },
        { english: 'He plays tennis on Sundays.', uzbek: 'U yakshanba kunlari tennis o\'ynaydi.' },
        { english: 'He is playing tennis now.', uzbek: 'U hozir tennis o\'ynayapti.' }
      ],
      note: "Simple - always, usually, often, sometimes, never\nContinuous - now, at the moment, right now"
    },
    quiz: [
      {
        question: "I ___ English every day. (odatda)",
        options: ["study", "am studying", "studies", "studying"],
        correctAnswer: 0
      },
      {
        question: "She ___ TV right now. (hozir)",
        options: ["watches", "watch", "is watching", "watching"],
        correctAnswer: 2
      },
      {
        question: "They usually ___ at 7 AM.",
        options: ["are waking up", "wake up", "waking up", "wakes up"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'past-simple-be',
    title: 'Past Simple: To Be (Was/Were)',
    level: 'A2 – Elementary',
    description: "O'tmishdagi holat.",
    content: {
      rule: "'To be' fe'lining o'tmish shakli. Was - I/He/She/It uchun. Were - You/We/They uchun.",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + was/were',
          example: 'I was happy yesterday.'
        },
        {
          type: 'negative',
          structure: 'Subject + was/were + not',
          example: 'She was not (wasn\'t) at home.'
        },
        {
          type: 'question',
          structure: 'Was/Were + Subject ...?',
          example: 'Were you at school?'
        }
      ],
      examples: [
        { english: 'I was tired yesterday.', uzbek: 'Kecha men charchagan edim.' },
        { english: 'They were at the cinema.', uzbek: 'Ular kinoteatrda edilar.' },
        { english: 'It was cold last winter.', uzbek: 'O\'tgan qishda sovuq edi.' }
      ],
      note: "Vaqt ko'rsatkichlari: yesterday, last week, last year, ago."
    },
    quiz: [
      {
        question: "I ___ at home yesterday.",
        options: ["am", "is", "was", "were"],
        correctAnswer: 2
      },
      {
        question: "___ they happy?",
        options: ["Was", "Were", "Are", "Is"],
        correctAnswer: 1
      },
      {
        question: "She ___ not at school last Monday.",
        options: ["was", "were", "is", "are"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'past-simple-regular',
    title: 'Past Simple: Regular Verbs',
    level: 'A2 – Elementary',
    description: "O'tmish zamon - muntazam fe'llar.",
    content: {
      rule: "Past Simple (O'tmish zamon) o'tmishda tugallangan harakatlar uchun ishlatiladi. Muntazam fe'llarga -ed qo'shiladi.",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + V-ed',
          example: 'I worked yesterday.'
        },
        {
          type: 'negative',
          structure: 'Subject + did not (didn\'t) + V1',
          example: 'I didn\'t work yesterday.'
        },
        {
          type: 'question',
          structure: 'Did + Subject + V1 ...?',
          example: 'Did you work yesterday?'
        }
      ],
      examples: [
        { english: 'I watched a movie last night.', uzbek: 'Kecha men film tomosha qildim.' },
        { english: 'She cooked dinner yesterday.', uzbek: 'Kecha u kechki ovqat tayyorladi.' },
        { english: 'They played football last Sunday.', uzbek: 'O\'tgan yakshanba ular futbol o\'ynashdi.' }
      ],
      note: "Fe'lga -ed qo'shish: work → worked, play → played, study → studied (y → ied)"
    },
    quiz: [
      {
        question: "I ___ TV last night.",
        options: ["watch", "watched", "watching", "watches"],
        correctAnswer: 1
      },
      {
        question: "She ___ not call me yesterday.",
        options: ["does", "do", "did", "didn't"],
        correctAnswer: 2
      },
      {
        question: "___ you finish your homework?",
        options: ["Do", "Does", "Did", "Are"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'past-simple-irregular',
    title: 'Past Simple: Irregular Verbs',
    level: 'A2 – Elementary',
    description: "O'tmish zamon - nomuntazam fe'llar.",
    content: {
      rule: "Nomuntazam fe'llar (Irregular Verbs) o'tmish shaklini yodlash kerak. Ular -ed qo'shimchasini olmaydi.",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + V2 (irregular)',
          example: 'I went to school. (go → went)'
        },
        {
          type: 'negative',
          structure: 'Subject + didn\'t + V1',
          example: 'I didn\'t go to school.'
        },
        {
          type: 'question',
          structure: 'Did + Subject + V1?',
          example: 'Did you go to school?'
        }
      ],
      examples: [
        { english: 'I went to Tashkent last week.', uzbek: 'O\'tgan hafta men Toshkentga bordim. (go-went)' },
        { english: 'She ate pizza yesterday.', uzbek: 'Kecha u pitsa yedi. (eat-ate)' },
        { english: 'We saw a movie.', uzbek: 'Biz film ko\'rdik. (see-saw)' },
        { english: 'He bought a car.', uzbek: 'U mashina sotib oldi. (buy-bought)' }
      ],
      note: "Mashhur nomuntazam fe'llar: go-went, eat-ate, see-saw, buy-bought, come-came, make-made, take-took, get-got."
    },
    quiz: [
      {
        question: "I ___ to the park yesterday. (go)",
        options: ["go", "goes", "went", "going"],
        correctAnswer: 2
      },
      {
        question: "She ___ a book last week. (buy)",
        options: ["buy", "buys", "bought", "buyed"],
        correctAnswer: 2
      },
      {
        question: "We ___ not see him. (see)",
        options: ["did", "do", "does", "didn't"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'be-going-to',
    title: 'Be Going To',
    level: 'A2 – Elementary',
    description: "Rejalar va bashoratlar.",
    content: {
      rule: "'Be going to' kelajakdagi rejalar va bashoratlar uchun ishlatiladi. To be + going to + V1 shakli bilan yasaladi.",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + am/is/are + going to + V1',
          example: 'I am going to study tonight.'
        },
        {
          type: 'negative',
          structure: 'Subject + am/is/are + not + going to + V1',
          example: 'She is not going to come.'
        },
        {
          type: 'question',
          structure: 'Am/Is/Are + Subject + going to + V1?',
          example: 'Are you going to travel?'
        }
      ],
      examples: [
        { english: 'I am going to visit my friend tomorrow.', uzbek: 'Ertaga men do\'stimga boraman.' },
        { english: 'She is going to buy a new phone.', uzbek: 'U yangi telefon sotib olmoqchi.' },
        { english: 'They are going to watch a movie tonight.', uzbek: 'Ular bugun kechqurun film tomosha qilishadi.' }
      ],
      note: "Vaqt ko'rsatkichlari: tomorrow, next week, next year, tonight, soon."
    },
    quiz: [
      {
        question: "I ___ going to study tomorrow.",
        options: ["am", "is", "are", "be"],
        correctAnswer: 0
      },
      {
        question: "___ she going to come?",
        options: ["Am", "Is", "Are", "Do"],
        correctAnswer: 1
      },
      {
        question: "They ___ not going to play.",
        options: ["am", "is", "are", "be"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'will-future',
    title: 'Future Simple: Will / Won\'t',
    level: 'A2 – Elementary',
    description: "Kelajak zamon - Will.",
    content: {
      rule: "'Will' kelajakdagi spontan qarorlar, bashoratlar va va'dalar uchun ishlatiladi. Will + V1 shakli bilan yasaladi.",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + will + V1',
          example: 'I will help you.'
        },
        {
          type: 'negative',
          structure: 'Subject + will not (won\'t) + V1',
          example: 'She won\'t come tomorrow.'
        },
        {
          type: 'question',
          structure: 'Will + Subject + V1?',
          example: 'Will you call me?'
        }
      ],
      examples: [
        { english: 'I will call you later.', uzbek: 'Men sizga keyinroq qo\'ng\'iroq qilaman.' },
        { english: 'It will rain tomorrow.', uzbek: 'Ertaga yomg\'ir yog\'adi.' },
        { english: 'We will not be late.', uzbek: 'Biz kechikmaymiz.' }
      ],
      note: "Will barcha shaxslar bilan bir xil. Qisqartma: I'll, you'll, he'll, won't."
    },
    quiz: [
      {
        question: "I ___ help you.",
        options: ["will", "am", "going", "do"],
        correctAnswer: 0
      },
      {
        question: "___ it rain tomorrow?",
        options: ["Does", "Is", "Will", "Do"],
        correctAnswer: 2
      },
      {
        question: "She ___ come to the party.",
        options: ["will not", "not will", "won't not", "doesn't will"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'will-vs-going-to',
    title: 'Will vs Going To',
    level: 'A2 – Elementary',
    description: "Ikki kelajak shaklining farqi.",
    content: {
      rule: "'Going to' - oldindan rejalashtirilgan harakatlar uchun.\n'Will' - spontan qarorlar, bashoratlar va va'dalar uchun.",
      formulas: [
        {
          type: 'positive',
          structure: 'Going to (reja)',
          example: 'I am going to study medicine. (Oldindan reja)'
        },
        {
          type: 'positive',
          structure: 'Will (spontan)',
          example: 'I will help you! (Hozir qaror qildim)'
        }
      ],
      examples: [
        { english: 'I am going to visit Paris next year. (reja)', uzbek: 'Kelasi yil men Parijga boraman (reja).' },
        { english: 'I will answer the phone! (spontan)', uzbek: 'Men telefonga javob beraman! (hozir qaror)' },
        { english: 'Look at those clouds! It is going to rain.', uzbek: 'Bulutlarga qarang! Yomg\'ir yog\'adi (bashorat).' }
      ],
      note: "Going to - ko'rinadigan dalillar bilan bashorat.\nWill - umumiy bashorat yoki spontan qaror."
    },
    quiz: [
      {
        question: "I ___ buy a car next month. (reja)",
        options: ["will", "am going to", "going", "will going"],
        correctAnswer: 1
      },
      {
        question: "The phone is ringing. I ___ answer it! (spontan)",
        options: ["am going to", "going to", "will", "go to"],
        correctAnswer: 2
      },
      {
        question: "Look! He ___ fall! (dalil bor)",
        options: ["will", "is going to", "going", "will going"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'modal-can',
    title: 'Modal: Can / Can\'t',
    level: 'A2 – Elementary',
    description: "Qobiliyat va ruxsat.",
    content: {
      rule: "'Can' qobiliyat (ability) va ruxsat (permission) bildiradi. Can + V1 shakli bilan ishlatiladi.",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + can + V1',
          example: 'I can swim.'
        },
        {
          type: 'negative',
          structure: 'Subject + cannot (can\'t) + V1',
          example: 'She can\'t drive.'
        },
        {
          type: 'question',
          structure: 'Can + Subject + V1?',
          example: 'Can you speak English?'
        }
      ],
      examples: [
        { english: 'I can speak three languages.', uzbek: 'Men uchta tilda gapira olaman.' },
        { english: 'Can I use your phone?', uzbek: 'Telefoningizdan foydalansam bo\'ladimi?' },
        { english: 'He can\'t play the piano.', uzbek: 'U pianino chala olmaydi.' }
      ],
      note: "Can barcha shaxslar bilan bir xil. 's' qo'shilmaydi (He can, NOT He cans)."
    },
    quiz: [
      {
        question: "I ___ swim very well.",
        options: ["can", "cans", "am can", "can to"],
        correctAnswer: 0
      },
      {
        question: "___ you help me?",
        options: ["Do", "Are", "Can", "Is"],
        correctAnswer: 2
      },
      {
        question: "She ___ speak French.",
        options: ["can't", "not can", "cann't", "doesn't can"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'modal-must-have-to',
    title: 'Modal: Must / Have To',
    level: 'A2 – Elementary',
    description: "Majburiyat va shart.",
    content: {
      rule: "'Must' va 'Have to' majburiyat bildiradi.\nMust - ichki his, o'z fikri.\nHave to - tashqi qoida, shart.",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + must + V1',
          example: 'I must study. (O\'zim bilaman)'
        },
        {
          type: 'positive',
          structure: 'Subject + have/has to + V1',
          example: 'I have to wear uniform. (Qoida)'
        },
        {
          type: 'negative',
          structure: 'Subject + don\'t/doesn\'t have to + V1',
          example: 'You don\'t have to come. (Shart emas)'
        }
      ],
      examples: [
        { english: 'I must finish this today.', uzbek: 'Men buni bugun tugatishim kerak (o\'zim bilaman).' },
        { english: 'Students have to wear uniforms.', uzbek: 'O\'quvchilar forma kiyishlari shart (qoida).' },
        { english: 'You don\'t have to wait.', uzbek: 'Kutishingiz shart emas.' }
      ],
      note: "Must - mustn't (taqiq)\nHave to - don't have to (shart emas, xohishingizga bog'liq)"
    },
    quiz: [
      {
        question: "I ___ go to the doctor. (Kasal)",
        options: ["must", "musts", "have", "can"],
        correctAnswer: 0
      },
      {
        question: "She ___ to work on Sundays. (Ish qoidasi)",
        options: ["must", "has", "have to", "has to"],
        correctAnswer: 3
      },
      {
        question: "You ___ have to come if you're busy.",
        options: ["must", "don't", "doesn't", "not"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'modal-should',
    title: 'Modal: Should',
    level: 'A2 – Elementary',
    description: "Maslahat va tavsiya.",
    content: {
      rule: "'Should' maslahat berish va tavsiya uchun ishlatiladi. Should + V1 shakli bilan yasaladi.",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + should + V1',
          example: 'You should study more.'
        },
        {
          type: 'negative',
          structure: 'Subject + should not (shouldn\'t) + V1',
          example: 'You shouldn\'t smoke.'
        },
        {
          type: 'question',
          structure: 'Should + Subject + V1?',
          example: 'Should I call him?'
        }
      ],
      examples: [
        { english: 'You should see a doctor.', uzbek: 'Siz shifokorga ko\'rinishingiz kerak.' },
        { english: 'We should leave now.', uzbek: 'Biz hozir ketishimiz kerak.' },
        { english: 'You shouldn\'t eat too much sugar.', uzbek: 'Siz juda ko\'p shakar yemasligingiz kerak.' }
      ],
      note: "Should - kuchsiz maslahat (tavsiya).\nMust - kuchli majburiyat."
    },
    quiz: [
      {
        question: "You ___ drink more water.",
        options: ["should", "shoulds", "should to", "are should"],
        correctAnswer: 0
      },
      {
        question: "___ I take an umbrella?",
        options: ["Do", "Am", "Should", "Can"],
        correctAnswer: 2
      },
      {
        question: "He ___ eat junk food.",
        options: ["should", "shouldn't", "should not to", "not should"],
        correctAnswer: 1
      }
    ],
  },
  {
    id: 'comparatives-superlatives',
    title: 'Comparatives and Superlatives',
    level: 'A2 – Elementary',
    description: "Qiyoslash va eng yuqori daraja.",
    content: {
      rule: "Sifatlarni qiyoslash uchun Comparatives (qiyoslash daraja) va Superlatives (eng yuqori daraja) ishlatiladi.\n\nQIYOSLASH DARAJA (Comparatives):\n- Qisqa sifatlar (1-2 bo'g'in): -er qo'shiladi (tall → taller)\n- Uzun sifatlar (3+ bo'g'in): more + sifat (beautiful → more beautiful)\n- 'than' bilan ishlatiladi\n\nENG YUQORI DARAJA (Superlatives):\n- Qisqa sifatlar: -est qo'shiladi (tall → tallest)\n- Uzun sifatlar: most + sifat (beautiful → most beautiful)\n- 'the' bilan ishlatiladi",
      formulas: [
        {
          type: 'positive',
          structure: 'Short adj + -er + than',
          example: 'Ali is taller than Vali.'
        },
        {
          type: 'positive',
          structure: 'more + Long adj + than',
          example: 'This book is more interesting than that one.'
        },
        {
          type: 'positive',
          structure: 'the + Short adj + -est / the + most + Long adj',
          example: 'She is the tallest girl. / This is the most beautiful place.'
        }
      ],
      examples: [
        { english: 'My car is faster than yours.', uzbek: 'Mening mashinam senikidan tezroq.' },
        { english: 'This test is easier than the last one.', uzbek: 'Bu test avvalgisidan osonroq.' },
        { english: 'She is more intelligent than her brother.', uzbek: 'U akasidan aqlliroq.' },
        { english: 'Mount Everest is the highest mountain.', uzbek: 'Everest eng baland tog\'.' },
        { english: 'This is the most expensive hotel.', uzbek: 'Bu eng qimmat mehmonxona.' },
        { english: 'He is the best student in class.', uzbek: 'U sinfda eng yaxshi o\'quvchi.' },
        { english: 'Today is hotter than yesterday.', uzbek: 'Bugun kechadan issiqroq.' }
      ],
      note: "NOMUNTAZAM SHAKLLAR:\n- good → better → best (yaxshi)\n- bad → worse → worst (yomon)\n- far → farther/further → farthest/furthest (uzoq)\n- little → less → least (kam)\n- much/many → more → most (ko'p)\n\nQOIDALAR:\n- big → bigger → biggest (oxirgi harf ikkilanadi)\n- happy → happier → happiest (y → i)\n- as...as = bir xil (as tall as = bir xil baland)"
    },
    quiz: [
      {
        question: "My house is ___ than yours.",
        options: ["big", "bigger", "biggest", "more big"],
        correctAnswer: 1
      },
      {
        question: "This is the ___ book I've ever read.",
        options: ["interesting", "more interesting", "most interesting", "interestinger"],
        correctAnswer: 2
      },
      {
        question: "She is ___ than her sister.",
        options: ["beautiful", "more beautiful", "most beautiful", "beautifuler"],
        correctAnswer: 1
      },
      {
        question: "Today is the ___ day of the year.",
        options: ["hot", "hotter", "hottest", "most hot"],
        correctAnswer: 2
      },
      {
        question: "This exercise is ___ than the previous one.",
        options: ["easy", "easier", "easiest", "more easy"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'adverbs-manner',
    title: 'Adverbs of Manner',
    level: 'A2 – Elementary',
    description: "Ravish ravishlari - harakatning qanday bajarilishini bildiradi.",
    content: {
      rule: "Adverbs of Manner (Ravish ravishlari) harakatning QANDAY bajarilishini bildiradi. Ko'pincha sifatga -ly qo'shish orqali yasaladi.\n\nYASALISHI:\n- Sifat + -ly: quick → quickly, slow → slowly\n- -y bilan tugasa: happy → happily (y → ily)\n- -le bilan tugasa: terrible → terribly (le → ly)\n- -ic bilan tugasa: basic → basically (ic → ically)\n\nJOYLASHUVI:\n- Odatda fe'ldan keyin: He speaks English fluently.\n- Fe'l + to'ldiruvchi + ravish: She plays the piano beautifully.",
      formulas: [
        {
          type: 'positive',
          structure: 'Adjective + -ly → Adverb',
          example: 'careful → carefully, quick → quickly'
        },
        {
          type: 'positive',
          structure: 'Subject + Verb + Adverb',
          example: 'She sings beautifully.'
        },
        {
          type: 'positive',
          structure: 'Subject + Verb + Object + Adverb',
          example: 'He drives the car carefully.'
        }
      ],
      examples: [
        { english: 'She speaks English fluently.', uzbek: 'U ingliz tilida ravon gapiradi.' },
        { english: 'He drives carefully.', uzbek: 'U ehtiyotkorlik bilan haydaydi.' },
        { english: 'They work hard every day.', uzbek: 'Ular har kuni qattiq ishlaydi.' },
        { english: 'She answered the question correctly.', uzbek: 'U savolga to\'g\'ri javob berdi.' },
        { english: 'The children played happily.', uzbek: 'Bolalar xursand o\'ynashdi.' },
        { english: 'He walked slowly to school.', uzbek: 'U maktabga sekin yurdi.' },
        { english: 'She dances gracefully.', uzbek: 'U nafis raqsga tushadi.' }
      ],
      note: "NOMUNTAZAM SHAKLLAR:\n- good (sifat) → well (ravish): He is a good student. / He studies well.\n- fast (sifat) → fast (ravish): a fast car / He runs fast.\n- hard (sifat) → hard (ravish): hard work / work hard\n- late (sifat) → late (ravish): a late train / arrive late\n- early (sifat) → early (ravish): early morning / wake up early\n\nESLATMA: 'hardly' ≠ 'hard'. 'Hardly' = deyarli emas (I hardly know him = Men uni deyarli tanimayman)"
    },
    quiz: [
      {
        question: "She speaks English ___.",
        options: ["good", "well", "goodly", "fine"],
        correctAnswer: 1
      },
      {
        question: "He drives very ___.",
        options: ["careful", "carefully", "care", "careless"],
        correctAnswer: 1
      },
      {
        question: "They work ___ every day.",
        options: ["hard", "hardly", "hardily", "harder"],
        correctAnswer: 0
      },
      {
        question: "She answered the question ___.",
        options: ["correct", "correctly", "corrected", "correction"],
        correctAnswer: 1
      },
      {
        question: "The children played ___.",
        options: ["happy", "happily", "happiness", "happyly"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'prepositions-time',
    title: 'Prepositions of Time (In/On/At)',
    level: 'A2 – Elementary',
    description: "Vaqt predloglari: In, On, At.",
    content: {
      rule: "Vaqtni ifodalash uchun uchta asosiy predlog ishlatiladi:\n\n'IN' - Uzun vaqt davrlari uchun:\n- Oylar: in January, in March\n- Yillar: in 2024, in 1990\n- Fasllar: in summer, in winter\n- Kun qismlari: in the morning, in the afternoon, in the evening\n- Asrlar: in the 21st century\n\n'ON' - Aniq kunlar uchun:\n- Haftaning kunlari: on Monday, on Friday\n- Sanalar: on May 5th, on the 1st of January\n- Maxsus kunlar: on my birthday, on New Year's Day\n\n'AT' - Aniq vaqt nuqtalari uchun:\n- Soat: at 5 o'clock, at 7:30\n- Maxsus vaqtlar: at night, at midnight, at noon\n- Bayramlar: at Christmas, at Easter",
      formulas: [
        {
          type: 'positive',
          structure: 'in + month/year/season/part of day',
          example: 'in May, in 2024, in summer, in the morning'
        },
        {
          type: 'positive',
          structure: 'on + day/date',
          example: 'on Monday, on May 5th, on my birthday'
        },
        {
          type: 'positive',
          structure: 'at + specific time',
          example: 'at 3 PM, at night, at Christmas'
        }
      ],
      examples: [
        { english: 'I was born in 1995.', uzbek: 'Men 1995 yilda tug\'ilganman.' },
        { english: 'The meeting is on Monday.', uzbek: 'Yig\'ilish dushanba kuni.' },
        { english: 'School starts at 8 o\'clock.', uzbek: 'Maktab soat 8 da boshlanadi.' },
        { english: 'We go swimming in summer.', uzbek: 'Biz yozda suzishga boramiz.' },
        { english: 'My birthday is on June 15th.', uzbek: 'Mening tug\'ilgan kunim 15-iyun.' },
        { english: 'I study in the evening.', uzbek: 'Men kechqurun o\'qiyman.' },
        { english: 'We celebrate at midnight.', uzbek: 'Biz yarim tunda nishonlaymiz.' },
        { english: 'She arrived on Tuesday morning.', uzbek: 'U seshanba kuni ertalab keldi.' }
      ],
      note: "ISTISNOLAR VA MAXSUS HOLATLAR:\n- at night (kechasi) LEKIN in the morning/afternoon/evening\n- at the weekend (Britaniya) yoki on the weekend (Amerika)\n- at Christmas, at Easter (bayramlar)\n- on Christmas Day, on Easter Sunday (aniq kun)\n- Predlogsiz: yesterday, today, tomorrow, last week, next month, this year\n\nESDA TUTING: in the morning, in the afternoon, in the evening, LEKIN at night!"
    },
    quiz: [
      {
        question: "I was born ___ 1995.",
        options: ["in", "on", "at", "for"],
        correctAnswer: 0
      },
      {
        question: "The meeting is ___ Monday.",
        options: ["in", "on", "at", "for"],
        correctAnswer: 1
      },
      {
        question: "School starts ___ 8 o'clock.",
        options: ["in", "on", "at", "for"],
        correctAnswer: 2
      },
      {
        question: "We go on vacation ___ summer.",
        options: ["in", "on", "at", "for"],
        correctAnswer: 0
      },
      {
        question: "My birthday is ___ June 15th.",
        options: ["in", "on", "at", "for"],
        correctAnswer: 1
      },
      {
        question: "I usually study ___ the evening.",
        options: ["in", "on", "at", "for"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'question-words',
    title: 'Question Words (Wh-questions)',
    level: 'A2 – Elementary',
    description: "So'roq so'zlar: Who, What, Where, When, Why, How.",
    content: {
      rule: "So'roq so'zlar (Question Words) batafsil ma'lumot olish uchun ishlatiladi. Ular 'Wh-questions' deb ham ataladi.\n\nASOSIY SO'ROQ SO'ZLAR:\n- WHO (Kim?) - odamlar haqida\n- WHAT (Nima?) - narsalar, harakatlar haqida\n- WHERE (Qayer?) - joy haqida\n- WHEN (Qachon?) - vaqt haqida\n- WHY (Nega?) - sabab haqida\n- HOW (Qanday?) - usul, holat haqida\n- WHICH (Qaysi?) - tanlov haqida\n- WHOSE (Kimniki?) - egalik haqida\n\nTARTIB: Question word + Auxiliary verb + Subject + Main verb?",
      formulas: [
        {
          type: 'question',
          structure: 'Who + verb ...?',
          example: 'Who is that man? / Who are you?'
        },
        {
          type: 'question',
          structure: 'What/Where/When + do/does/is/are + subject + verb?',
          example: 'What do you do? / Where is he? / When does she arrive?'
        },
        {
          type: 'question',
          structure: 'Why + do/does/is/are + subject + verb?',
          example: 'Why are you late? / Why does he study English?'
        }
      ],
      examples: [
        { english: 'Who is your teacher?', uzbek: 'Sizning o\'qituvchingiz kim?' },
        { english: 'What is your name?', uzbek: 'Ismingiz nima?' },
        { english: 'Where do you live?', uzbek: 'Qayerda yashaysiz?' },
        { english: 'When does the class start?', uzbek: 'Dars qachon boshlanadi?' },
        { english: 'Why are you crying?', uzbek: 'Nega yig\'layapsiz?' },
        { english: 'How do you go to school?', uzbek: 'Maktabga qanday borasiz?' },
        { english: 'Which book do you want?', uzbek: 'Qaysi kitobni xohlaysiz?' },
        { english: 'Whose pen is this?', uzbek: 'Bu kimning ruchkasi?' },
        { english: 'How old are you?', uzbek: 'Necha yoshdasiz?' },
        { english: 'How much does it cost?', uzbek: 'Bu qancha turadi?' }
      ],
      note: "HOW BILAN BIRIKMALAR:\n- How old? (Necha yosh?)\n- How much? (Qancha? - narx yoki miqdor)\n- How many? (Nechta? - sanaladigan)\n- How long? (Qancha vaqt?)\n- How often? (Qancha tez-tez?)\n- How far? (Qancha uzoq?)\n- How tall? (Qancha baland?)\n\nQISQA JAVOBLAR:\n- Who? → My teacher. / Ali.\n- Where? → In Tashkent. / At home.\n- When? → Tomorrow. / At 5 PM.\n- Why? → Because I'm tired."
    },
    quiz: [
      {
        question: "___ is your name?",
        options: ["Who", "What", "Where", "When"],
        correctAnswer: 1
      },
      {
        question: "___ do you live?",
        options: ["Who", "What", "Where", "Why"],
        correctAnswer: 2
      },
      {
        question: "___ are you late?",
        options: ["What", "Where", "When", "Why"],
        correctAnswer: 3
      },
      {
        question: "___ is your teacher?",
        options: ["Who", "What", "Where", "How"],
        correctAnswer: 0
      },
      {
        question: "___ does the class start?",
        options: ["Who", "What", "Where", "When"],
        correctAnswer: 3
      },
      {
        question: "___ old are you?",
        options: ["What", "How", "When", "Why"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'quantifiers',
    title: 'Some/Any/Much/Many/A lot of',
    level: 'A2 – Elementary',
    description: "Miqdor ko'rsatkichlari.",
    content: {
      rule: "Miqdor ko'rsatkichlari (Quantifiers) narsalarning miqdorini bildiradi.\n\nSOME vs ANY:\n- SOME - tasdiq gaplarda va taklif/so'rovlarda: I have some money. / Would you like some tea?\n- ANY - inkor va savol gaplarda: I don't have any money. / Do you have any questions?\n\nMUCH vs MANY:\n- MUCH - sanalmaydigan otlar bilan (uncountable): much water, much time\n- MANY - sanaladigan otlar bilan (countable): many books, many people\n- Ko'pincha savol va inkor gaplarda ishlatiladi\n\nA LOT OF / LOTS OF:\n- Ham sanaladigan, ham sanalmaydigan otlar bilan\n- Tasdiq gaplarda ko'proq ishlatiladi\n- A lot of books / A lot of water",
      formulas: [
        {
          type: 'positive',
          structure: 'some + noun (tasdiq)',
          example: 'I have some friends. / There is some milk.'
        },
        {
          type: 'negative',
          structure: 'any + noun (inkor/savol)',
          example: 'I don\'t have any money. / Do you have any time?'
        },
        {
          type: 'positive',
          structure: 'much/many + noun / a lot of + noun',
          example: 'many students / much water / a lot of books'
        }
      ],
      examples: [
        { english: 'I have some books.', uzbek: 'Menda bir nechta kitob bor.' },
        { english: 'Do you have any questions?', uzbek: 'Savollaringiz bormi?' },
        { english: 'There isn\'t any water.', uzbek: 'Suv yo\'q.' },
        { english: 'How many students are there?', uzbek: 'Qancha talaba bor?' },
        { english: 'How much money do you need?', uzbek: 'Qancha pul kerak?' },
        { english: 'I don\'t have much time.', uzbek: 'Menda ko\'p vaqt yo\'q.' },
        { english: 'There are many people here.', uzbek: 'Bu yerda ko\'p odamlar bor.' },
        { english: 'She has a lot of friends.', uzbek: 'Uning ko\'p do\'stlari bor.' },
        { english: 'We need a lot of sugar.', uzbek: 'Bizga ko\'p shakar kerak.' }
      ],
      note: "QO'SHIMCHA MIQDOR KO'RSATKICHLARI:\n- A FEW (bir nechta - sanaladigan): I have a few friends.\n- A LITTLE (ozgina - sanalmaydigan): I have a little money.\n- FEW (kam - sanaladigan, salbiy ma'no): Few people came. (Kam odam keldi)\n- LITTLE (kam - sanalmaydigan, salbiy ma'no): I have little time. (Vaqtim kam)\n\nTASHDIQ GAPLARDA:\n- A lot of / Lots of (ko'p)\n- Plenty of (yetarlicha)\n\nSAVOL/INKOR GAPLARDA:\n- Much / Many\n- Any"
    },
    quiz: [
      {
        question: "I have ___ books. (tasdiq)",
        options: ["any", "some", "much", "many"],
        correctAnswer: 1
      },
      {
        question: "Do you have ___ questions? (savol)",
        options: ["some", "any", "a", "much"],
        correctAnswer: 1
      },
      {
        question: "How ___ students are there? (sanaladigan)",
        options: ["much", "many", "some", "any"],
        correctAnswer: 1
      },
      {
        question: "How ___ water do you need? (sanalmaydigan)",
        options: ["many", "much", "some", "any"],
        correctAnswer: 1
      },
      {
        question: "There isn't ___ milk. (inkor)",
        options: ["some", "many", "any", "a lot"],
        correctAnswer: 2
      },
      {
        question: "She has ___ friends. (tasdiq, ko'p)",
        options: ["any", "much", "a lot of", "many of"],
        correctAnswer: 2
      }
    ]
  },
  // ============ PRE-INTERMEDIATE (B1) LEVEL ============
  {
    id: 'present-perfect',
    title: 'Present Perfect Simple',
    level: 'B1 – Intermediate',
    description: "Hozirgi tugallangan zamon.",
    content: {
      rule: "Present Perfect (Hozirgi tugallangan zamon) o'tmishda boshlangan va hozirgi vaqtga ta'sir qilayotgan yoki hali ham davom etayotgan harakatlar uchun ishlatiladi.\n\nYASALISHI: have/has + V3 (Past Participle)\n\nISHLATILISHI:\n1. O'tmishda sodir bo'lgan, lekin aniq vaqt aytilmagan harakatlar\n2. Hayot tajribasi (ever, never)\n3. Yaqinda tugagan harakatlar (just, recently)\n4. Hali tugamagan harakatlar (yet, already)\n5. O'tmishdan hozirgi vaqtgacha davom etgan holat (for, since)",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + have/has + V3',
          example: 'I have visited Paris. / She has finished her work.'
        },
        {
          type: 'negative',
          structure: 'Subject + have/has + not + V3',
          example: 'I haven\'t seen that movie. / He hasn\'t arrived yet.'
        },
        {
          type: 'question',
          structure: 'Have/Has + Subject + V3?',
          example: 'Have you ever been to London? / Has she finished?'
        }
      ],
      examples: [
        { english: 'I have lived here for 5 years.', uzbek: 'Men bu yerda 5 yil yashayman (hali ham yashayman).' },
        { english: 'She has just arrived.', uzbek: 'U hozirgina keldi.' },
        { english: 'Have you ever eaten sushi?', uzbek: 'Siz hech qachon sushi yeganmisiz?' },
        { english: 'They haven\'t finished yet.', uzbek: 'Ular hali tugatolmadilar.' },
        { english: 'I have already done my homework.', uzbek: 'Men uyga vazifamni allaqachon qildim.' },
        { english: 'He has never been to America.', uzbek: 'U hech qachon Amerikada bo\'lmagan.' },
        { english: 'We have known each other since 2010.', uzbek: 'Biz bir-birimizni 2010 yildan beri tanymiz.' }
      ],
      note: "VAQT KO'RSATKICHLARI:\n- just (hozirgina) - I have just finished.\n- already (allaqachon) - She has already left.\n- yet (hali) - Have you finished yet? / I haven't finished yet.\n- ever (hech qachon) - Have you ever...?\n- never (hech qachon...magan) - I have never seen...\n- for (davomiylik) - for 3 years, for 2 months\n- since (boshlanish nuqtasi) - since 2020, since Monday\n- recently (yaqinda) - I have recently moved.\n\nV3 SHAKLLAR: work-worked-worked, go-went-gone, see-saw-seen"
    },
    quiz: [
      {
        question: "I ___ never ___ to Paris.",
        options: ["have / been", "has / been", "have / be", "had / been"],
        correctAnswer: 0
      },
      {
        question: "She ___ just ___ her homework.",
        options: ["have / finished", "has / finish", "has / finished", "have / finish"],
        correctAnswer: 2
      },
      {
        question: "___ you ever ___ sushi?",
        options: ["Have / eat", "Has / eaten", "Have / eaten", "Do / eat"],
        correctAnswer: 2
      },
      {
        question: "They ___ here ___ 2010.",
        options: ["have lived / since", "has lived / for", "have lived / for", "lived / since"],
        correctAnswer: 0
      },
      {
        question: "I haven't finished ___.",
        options: ["already", "just", "yet", "never"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'present-perfect-vs-past-simple',
    title: 'Present Perfect vs Past Simple',
    level: 'B1 – Intermediate',
    description: "Hozirgi tugallangan va oddiy o'tmish zamonning farqi.",
    content: {
      rule: "PRESENT PERFECT vs PAST SIMPLE - bu ikki zamonning farqini tushunish juda muhim!\n\nPRESENT PERFECT (have/has + V3):\n- Aniq vaqt AYTILMAYDI\n- Hozirgi vaqtga BOG'LIQ\n- Natija muhim\n- Vaqt ko'rsatkichlari: just, already, yet, ever, never, for, since\n\nPAST SIMPLE (V2):\n- Aniq vaqt AYTILADI\n- Tugallangan, o'tmishda qolgan\n- Harakat muhim\n- Vaqt ko'rsatkichlari: yesterday, last week, ago, in 2020, when I was young",
      formulas: [
        {
          type: 'positive',
          structure: 'Present Perfect (aniq vaqt yo\'q)',
          example: 'I have seen that movie. (Qachon? - muhim emas)'
        },
        {
          type: 'positive',
          structure: 'Past Simple (aniq vaqt bor)',
          example: 'I saw that movie yesterday. (Qachon? - kecha)'
        }
      ],
      examples: [
        { english: 'I have been to Paris. (Hayot tajribasi)', uzbek: 'Men Parijda bo\'lganman (qachon - muhim emas).' },
        { english: 'I went to Paris last year. (Aniq vaqt)', uzbek: 'Men o\'tgan yili Parijga bordim (aniq vaqt).' },
        { english: 'She has lost her keys. (Natija - hozir yo\'q)', uzbek: 'U kalitlarini yo\'qotdi (hozir yo\'q).' },
        { english: 'She lost her keys yesterday. (Aniq vaqt)', uzbek: 'U kecha kalitlarini yo\'qotdi.' },
        { english: 'Have you ever eaten sushi? (Hayotda)', uzbek: 'Siz hech qachon sushi yeganmisiz?' },
        { english: 'Did you eat sushi yesterday? (Aniq vaqt)', uzbek: 'Kecha sushi yedingizmi?' },
        { english: 'I have lived here for 5 years. (Hali ham)', uzbek: 'Men bu yerda 5 yil yashayman (hali ham).' },
        { english: 'I lived there for 5 years. (Endi yo\'q)', uzbek: 'Men u yerda 5 yil yashadim (endi yo\'q).' }
      ],
      note: "QOIDALAR:\n\n1. ANIQ VAQT bilan FAQAT Past Simple:\n   ✓ I saw him yesterday.\n   ✗ I have seen him yesterday.\n\n2. Just, already, yet, ever, never bilan FAQAT Present Perfect:\n   ✓ I have just arrived.\n   ✗ I just arrived. (Informal AmE da ishlatiladi)\n\n3. For/Since:\n   - Present Perfect: hali davom etayotgan (I have lived here for 5 years - hali yashayman)\n   - Past Simple: tugagan (I lived there for 5 years - endi yashamayman)\n\n4. When bilan FAQAT Past Simple:\n   ✓ When did you see him?\n   ✗ When have you seen him?"
    },
    quiz: [
      {
        question: "I ___ to London last year.",
        options: ["have been", "went", "have gone", "go"],
        correctAnswer: 1
      },
      {
        question: "I ___ never ___ to America.",
        options: ["did / go", "have / been", "have / go", "did / been"],
        correctAnswer: 1
      },
      {
        question: "She ___ her keys yesterday.",
        options: ["has lost", "have lost", "lost", "lose"],
        correctAnswer: 2
      },
      {
        question: "I ___ here for 5 years. (hali yashayman)",
        options: ["lived", "have lived", "live", "am living"],
        correctAnswer: 1
      },
      {
        question: "When ___ you ___ him?",
        options: ["have / seen", "did / see", "have / saw", "do / see"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'past-continuous',
    title: 'Past Continuous',
    level: 'B1 – Intermediate',
    description: "O'tmishdagi davomiy harakat.",
    content: {
      rule: "Past Continuous (O'tmishdagi davomiy zamon) o'tmishning ma'lum bir vaqtida davom etayotgan harakatni bildiradi.\n\nYASALISHI: was/were + V-ing\n\nISHLATILISHI:\n1. O'tmishda ma'lum vaqtda davom etgan harakat (at 5 PM yesterday)\n2. Uzilgan harakat (I was reading when he called)\n3. Parallel harakatlar (While I was cooking, he was watching TV)\n4. Tasvir, atmosfera (The sun was shining, birds were singing)",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + was/were + V-ing',
          example: 'I was studying at 8 PM yesterday.'
        },
        {
          type: 'negative',
          structure: 'Subject + was/were + not + V-ing',
          example: 'She wasn\'t listening to me.'
        },
        {
          type: 'question',
          structure: 'Was/Were + Subject + V-ing?',
          example: 'Were you sleeping when I called?'
        }
      ],
      examples: [
        { english: 'I was watching TV at 9 PM.', uzbek: 'Men soat 9 da televizor ko\'rayotgan edim.' },
        { english: 'They were playing football yesterday afternoon.', uzbek: 'Ular kecha tushdan keyin futbol o\'ynayotgan edilar.' },
        { english: 'What were you doing at 5 PM?', uzbek: 'Soat 5 da nima qilayotgan edingiz?' },
        { english: 'She was cooking when I arrived.', uzbek: 'Men kelganimda u ovqat tayyorlayotgan edi.' },
        { english: 'While I was studying, my brother was playing games.', uzbek: 'Men o\'qiyotganimda, akam o\'yin o\'ynayotgan edi.' },
        { english: 'It was raining all day yesterday.', uzbek: 'Kecha kun bo\'yi yomg\'ir yog\'ayotgan edi.' },
        { english: 'We weren\'t working at that time.', uzbek: 'Biz o\'sha paytda ishlamayotgan edik.' }
      ],
      note: "VAQT KO'RSATKICHLARI:\n- at 5 PM yesterday\n- at that time/moment\n- all day/night/morning\n- while (parallel harakatlar)\n- when (uzilish)\n\nWHILE vs WHEN:\n- While + Past Continuous (davomiy harakat)\n  While I was cooking, he called.\n- When + Past Simple (qisqa harakat)\n  When he called, I was cooking.\n\nPast Continuous ishlatilMAYDI:\n- State verbs bilan: know, like, want, need\n  ✗ I was knowing\n  ✓ I knew"
    },
    quiz: [
      {
        question: "I ___ TV at 9 PM yesterday.",
        options: ["watched", "was watching", "am watching", "watch"],
        correctAnswer: 1
      },
      {
        question: "What ___ you ___ at 5 PM?",
        options: ["did / do", "were / doing", "are / doing", "do / do"],
        correctAnswer: 1
      },
      {
        question: "She ___ when I called.",
        options: ["sleeps", "slept", "was sleeping", "is sleeping"],
        correctAnswer: 2
      },
      {
        question: "While I ___ studying, he ___ playing.",
        options: ["was / was", "were / were", "was / were", "am / is"],
        correctAnswer: 0
      },
      {
        question: "They ___ working at that time.",
        options: ["wasn't", "weren't", "isn't", "aren't"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'past-continuous-vs-past-simple',
    title: 'Past Continuous vs Past Simple',
    level: 'B1 – Intermediate',
    description: "O'tmishdagi davomiy va oddiy zamonning farqi.",
    content: {
      rule: "PAST CONTINUOUS vs PAST SIMPLE - bu ikki zamonning farqini tushunish muhim!\n\nPAST CONTINUOUS (was/were + V-ing):\n- DAVOM ETAYOTGAN harakat\n- FON, tasvir\n- UZILGAN harakat\n- Parallel harakatlar (while)\n\nPAST SIMPLE (V2):\n- TUGALLANGAN harakat\n- ASOSIY voqea\n- UZUVCHI harakat\n- Ketma-ket harakatlar (then, after)",
      formulas: [
        {
          type: 'positive',
          structure: 'Past Continuous (fon) + when + Past Simple (asosiy)',
          example: 'I was reading when the phone rang.'
        },
        {
          type: 'positive',
          structure: 'While + Past Continuous, Past Continuous',
          example: 'While I was cooking, he was watching TV.'
        },
        {
          type: 'positive',
          structure: 'Past Simple, then Past Simple',
          example: 'I came home, then I had dinner.'
        }
      ],
      examples: [
        { english: 'I was walking when I saw him. (Fon + Asosiy)', uzbek: 'Men yurayotgan edim, keyin uni ko\'rdim.' },
        { english: 'When the phone rang, I was sleeping. (Uzilish)', uzbek: 'Telefon jiringladi, men uxlayotgan edim.' },
        { english: 'While she was cooking, I was reading. (Parallel)', uzbek: 'U ovqat tayyorlayotganda, men kitob o\'qiyotgan edim.' },
        { english: 'The sun was shining and birds were singing. (Tasvir)', uzbek: 'Quyosh porlab turardi va qushlar sayrashardi.' },
        { english: 'I came home, had dinner, and watched TV. (Ketma-ket)', uzbek: 'Men uyga keldim, kechki ovqat yedim va televizor ko\'rdim.' },
        { english: 'What were you doing when I called? (Fon vaqt)', uzbek: 'Men qo\'ng\'iroq qilganimda nima qilayotgan edingiz?' },
        { english: 'I was studying all evening. (Davomiylik)', uzbek: 'Men butun kechqurun o\'qiyotgan edim.' }
      ],
      note: "WHEN vs WHILE:\n\n1. WHEN + Past Simple (qisqa harakat):\n   When he arrived, I was cooking.\n   (U keldi - qisqa harakat)\n\n2. WHILE + Past Continuous (davomiy harakat):\n   While I was cooking, he arrived.\n   (Men ovqat tayyorlayotgan edim - davomiy)\n\n3. PARALLEL HARAKATLAR (ikkalasi ham davomiy):\n   While I was studying, he was sleeping.\n\n4. KETMA-KET HARAKATLAR (ikkalasi ham Past Simple):\n   I woke up, had breakfast, and went to work.\n\nTASVIR (Past Continuous):\n   It was a beautiful day. The sun was shining..."
    },
    quiz: [
      {
        question: "I ___ when the phone ___.",
        options: ["slept / rang", "was sleeping / rang", "was sleeping / was ringing", "slept / was ringing"],
        correctAnswer: 1
      },
      {
        question: "While I ___ cooking, he ___ TV.",
        options: ["cooked / watched", "was cooking / watched", "was cooking / was watching", "cooked / was watching"],
        correctAnswer: 2
      },
      {
        question: "When he ___, I ___ a book.",
        options: ["arrived / read", "was arriving / read", "arrived / was reading", "was arriving / was reading"],
        correctAnswer: 2
      },
      {
        question: "I ___ home, ___ dinner, and ___ to bed.",
        options: ["came / had / went", "was coming / was having / was going", "came / was having / went", "was coming / had / was going"],
        correctAnswer: 0
      },
      {
        question: "The sun ___ and birds ___. (tasvir)",
        options: ["shone / sang", "was shining / were singing", "shone / were singing", "was shining / sang"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'used-to',
    title: 'Used to',
    level: 'B1 – Intermediate',
    description: "O'tmishdagi odatlar va holatlar.",
    content: {
      rule: "'Used to' o'tmishda mavjud bo'lgan, lekin HOZIR YO'Q bo'lgan odatlar va holatlarni bildiradi.\n\nYASALISHI: used to + V1\n\nISHLATILISHI:\n1. O'tmishdagi odatlar (hozir yo'q)\n   I used to play football. (Ilgari o'ynardim, hozir o'ynamayman)\n\n2. O'tmishdagi holatlar (hozir boshqa)\n   I used to live in Tashkent. (Ilgari yashar edim, hozir yashamayman)\n\nFARQI:\n- Used to ≠ Past Simple\n- Used to = o'tmishdagi odatiy harakat (hozir yo'q)\n- Past Simple = o'tmishdagi bir martalik harakat",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + used to + V1',
          example: 'I used to smoke. (Ilgari chekardim, hozir chekmayman)'
        },
        {
          type: 'negative',
          structure: 'Subject + didn\'t use to + V1',
          example: 'I didn\'t use to like coffee. (Ilgari yoqmardi, hozir yoqadi)'
        },
        {
          type: 'question',
          structure: 'Did + Subject + use to + V1?',
          example: 'Did you use to play tennis? (Ilgari o\'ynardingizmi?)'
        }
      ],
      examples: [
        { english: 'I used to play football every day.', uzbek: 'Men har kuni futbol o\'ynardim (hozir o\'ynamayman).' },
        { english: 'She used to live in London.', uzbek: 'U Londonda yashar edi (hozir yashamaydi).' },
        { english: 'Did you use to smoke?', uzbek: 'Siz chekardingizmi (ilgari)?' },
        { english: 'I didn\'t use to like vegetables.', uzbek: 'Menga sabzavotlar yoqmasdi (hozir yoqadi).' },
        { english: 'We used to go to the beach every summer.', uzbek: 'Biz har yoz dengizga borardik.' },
        { english: 'There used to be a cinema here.', uzbek: 'Bu yerda kinoteatr bor edi (hozir yo\'q).' },
        { english: 'He used to have long hair.', uzbek: 'Uning sochlari uzun edi (hozir qisqa).' }
      ],
      note: "USED TO vs WOULD:\n\n1. USED TO:\n   - Odatlar VA holatlar\n   - I used to live in Paris. ✓\n   - I used to be shy. ✓\n\n2. WOULD:\n   - FAQAT odatlar (holatlar emas)\n   - I would visit my grandma every week. ✓\n   - I would be shy. ✗\n\nBE USED TO (boshqa ma'no!):\n- be used to + V-ing = o'rganib qolgan\n- I am used to waking up early. (Men erta turganiga o'rganib qolganman)\n\nGET USED TO:\n- get used to + V-ing = o'rganib qolmoq\n- I'm getting used to the weather. (Men ob-havoga o'rganib qolyapman)\n\nDIQQAT: Inkor va savolda 'use to' (without 'd')!"
    },
    quiz: [
      {
        question: "I ___ play football every day. (hozir o'ynamayman)",
        options: ["use to", "used to", "am used to", "was used to"],
        correctAnswer: 1
      },
      {
        question: "She ___ live in London. (hozir yashamaydi)",
        options: ["use to", "used to", "uses to", "using to"],
        correctAnswer: 1
      },
      {
        question: "___ you ___ smoke?",
        options: ["Do / used to", "Did / used to", "Did / use to", "Do / use to"],
        correctAnswer: 2
      },
      {
        question: "I ___ like vegetables. (hozir yoqadi)",
        options: ["didn't used to", "didn't use to", "don't used to", "not used to"],
        correctAnswer: 1
      },
      {
        question: "There ___ a cinema here. (hozir yo'q)",
        options: ["use to be", "used to be", "used to being", "uses to be"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'future-forms-review',
    title: 'Future Forms Review',
    level: 'B1 – Intermediate',
    description: "Kelajak zamonlarining umumiy ko'rinishi.",
    content: {
      rule: "Ingliz tilida kelajakni ifodalashning bir necha usuli bor:\n\n1. WILL + V1: Spontan qarorlar, bashoratlar, va'dalar\n2. BE GOING TO + V1: Oldindan rejalashtirilgan, dalilga asoslangan bashorat\n3. PRESENT CONTINUOUS: Aniq kelishilgan rejalar, yaqin kelajak\n4. PRESENT SIMPLE: Jadval, tartib, rasmiy tadbirlar",
      formulas: [
        {
          type: 'positive',
          structure: 'will + V1',
          example: 'I will help you! (Spontan qaror)'
        },
        {
          type: 'positive',
          structure: 'be going to + V1',
          example: 'I am going to study medicine. (Reja)'
        },
        {
          type: 'positive',
          structure: 'Present Continuous',
          example: 'I am meeting him tomorrow. (Aniq reja)'
        }
      ],
      examples: [
        { english: 'I will call you later.', uzbek: 'Men sizga keyinroq qo\'ng\'iroq qilaman (spontan).' },
        { english: 'I am going to visit Paris next month.', uzbek: 'Men kelasi oy Parijga boraman (reja).' },
        { english: 'I am meeting John tomorrow.', uzbek: 'Men ertaga Jon bilan uchrashaman (kelishilgan).' },
        { english: 'The train leaves at 5 PM.', uzbek: 'Poyezd soat 5 da jo\'naydi (jadval).' },
        { english: 'Look! It is going to rain.', uzbek: 'Qarang! Yomg\'ir yog\'adi (dalil).' }
      ],
      note: "WILL: spontan qaror, fikr\nGOING TO: reja, dalilga asoslangan bashorat\nPRESENT CONTINUOUS: aniq reja\nPRESENT SIMPLE: jadval"
    },
    quiz: [
      {
        question: "I ___ help you! (spontan)",
        options: ["will", "am going to", "am helping", "help"],
        correctAnswer: 0
      },
      {
        question: "I ___ visit my grandma next week. (reja)",
        options: ["will", "am going to", "visit", "visited"],
        correctAnswer: 1
      },
      {
        question: "I ___ the doctor tomorrow at 3. (aniq)",
        options: ["will see", "am going to see", "am seeing", "see"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'first-conditional',
    title: 'First Conditional',
    level: 'B1 – Intermediate',
    description: "Birinchi shartli gap - real kelajak.",
    content: {
      rule: "First Conditional real kelajakdagi mumkin bo'lgan vaziyatlar uchun ishlatiladi.\n\nYASALISHI: If + Present Simple, will + V1\n\nMA'NOSI: Agar biror narsa bo'lsa (mumkin), keyin boshqa narsa bo'ladi.\n\nISHLATILISHI:\n- Real imkoniyatlar\n- Kelajakdagi ehtimollar\n- Ogohlantirishlar\n- Tahdidlar va va'dalar",
      formulas: [
        {
          type: 'positive',
          structure: 'If + Present Simple, will + V1',
          example: 'If it rains, I will stay home.'
        },
        {
          type: 'positive',
          structure: 'will + V1 + if + Present Simple',
          example: 'I will stay home if it rains.'
        },
        {
          type: 'negative',
          structure: 'If + Present Simple, won\'t + V1',
          example: 'If you don\'t study, you won\'t pass.'
        }
      ],
      examples: [
        { english: 'If it rains, I will take an umbrella.', uzbek: 'Agar yomg\'ir yog\'sa, men soyabon olaman.' },
        { english: 'If you study hard, you will pass the exam.', uzbek: 'Agar qattiq o\'qisangiz, imtihondan o\'tasiz.' },
        { english: 'I will call you if I have time.', uzbek: 'Agar vaqtim bo\'lsa, sizga qo\'ng\'iroq qilaman.' },
        { english: 'If she comes, we will go together.', uzbek: 'Agar u kelsa, biz birga boramiz.' },
        { english: 'You will be late if you don\'t hurry.', uzbek: 'Agar shoshilmasangiz, kechikasiz.' }
      ],
      note: "ESLATMA:\n- If qismida WILL ishlatilmaydi! (✗ If it will rain)\n- If qismida Present Simple ishlatiladi\n- Vergul if boshida bo'lganda qo'yiladi\n- Unless = if not (Agar...masa)\n  Unless you study = If you don't study"
    },
    quiz: [
      {
        question: "If it ___, I will stay home.",
        options: ["will rain", "rains", "rain", "raining"],
        correctAnswer: 1
      },
      {
        question: "I ___ you if I have time.",
        options: ["call", "will call", "called", "calling"],
        correctAnswer: 1
      },
      {
        question: "If you ___ study, you won't pass.",
        options: ["won't", "don't", "doesn't", "not"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'second-conditional',
    title: 'Second Conditional',
    level: 'B1 – Intermediate',
    description: "Ikkinchi shartli gap - xayoliy vaziyat.",
    content: {
      rule: "Second Conditional hozirgi yoki kelajakdagi XAYOLIY, ehtimoli kam vaziyatlar uchun ishlatiladi.\n\nYASALISHI: If + Past Simple, would + V1\n\nMA'NOSI: Agar (xayolan) biror narsa bo'lsa, keyin boshqa narsa bo'lardi.\n\nISHLATILISHI:\n- Xayoliy vaziyatlar\n- Ehtimoli kam holatlar\n- Maslahat berish\n- Orzu va istaklar",
      formulas: [
        {
          type: 'positive',
          structure: 'If + Past Simple, would + V1',
          example: 'If I had money, I would buy a car.'
        },
        {
          type: 'positive',
          structure: 'would + V1 + if + Past Simple',
          example: 'I would buy a car if I had money.'
        },
        {
          type: 'question',
          structure: 'What would you do if...?',
          example: 'What would you do if you won the lottery?'
        }
      ],
      examples: [
        { english: 'If I had a million dollars, I would travel the world.', uzbek: 'Agar million dollarim bo\'lsa, dunyo bo\'ylab sayohat qilardim.' },
        { english: 'If I were you, I would study more.', uzbek: 'Agar men siz bo\'lsam, ko\'proq o\'qirdim (maslahat).' },
        { english: 'What would you do if you saw a ghost?', uzbek: 'Agar arvoh ko\'rsangiz nima qilardingiz?' },
        { english: 'If she knew the answer, she would tell us.', uzbek: 'Agar u javobni bilsa, bizga aytardi.' },
        { english: 'I would help you if I could.', uzbek: 'Agar qo\'limdan kelsa, sizga yordam berardim.' }
      ],
      note: "MUHIM FARQLAR:\n\n1. FIRST vs SECOND:\n   - First: Real (If it rains, I will...)\n   - Second: Xayoliy (If I had wings, I would...)\n\n2. IF I WERE (maxsus holat):\n   - If I were you... (Har doim 'were', 'was' emas!)\n   - If he were rich...\n   - If she were here...\n\n3. COULD (would ning o'rnida):\n   - If I had time, I could help you.\n   - (Imkoniyat bildiradi)"
    },
    quiz: [
      {
        question: "If I ___ rich, I would buy a house.",
        options: ["am", "was", "were", "will be"],
        correctAnswer: 2
      },
      {
        question: "I ___ travel if I had money.",
        options: ["will", "would", "can", "could be"],
        correctAnswer: 1
      },
      {
        question: "If I ___ you, I would study more.",
        options: ["am", "was", "were", "will be"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'modal-could-would-might-may',
    title: 'Modals: Could/Would/Might/May',
    level: 'B1 – Intermediate',
    description: "Yordamchi modal fe'llar.",
    content: {
      rule: "COULD, WOULD, MIGHT, MAY - bu modal fe'llar turli ma'nolarni bildiradi.\n\nCOULD:\n1. Can ning o'tmishi (qobiliyat)\n2. Muloyim so'rov\n3. Ehtimollik\n\nWOULD:\n1. Will ning o'tmishi\n2. Muloyim so'rov\n3. O'tmishdagi odatlar\n4. Second Conditional da\n\nMIGHT/MAY:\n1. Ehtimollik (May kuchliroq, Might kuchsizroq)\n2. Ruxsat (May - rasmiy)\n3. Tilak (May you be happy!)",
      formulas: [
        {
          type: 'positive',
          structure: 'could/would/might/may + V1',
          example: 'I could swim. / Would you like tea? / It might rain. / You may go now.'
        },
        {
          type: 'negative',
          structure: 'modal + not + V1',
          example: 'I could not (couldn\'t) come. / It might not happen. / You may not smoke here.'
        }
      ],
      examples: [
        { english: 'I could speak English when I was 10.', uzbek: 'Men 10 yoshimda inglizcha gapira olardim.' },
        { english: 'Could you help me, please?', uzbek: 'Menga yordam bera olasizmi, iltimos?' },
        { english: 'Would you like some coffee?', uzbek: 'Kofe xohlaysizmi?' },
        { english: 'It might rain tomorrow.', uzbek: 'Ertaga yomg\'ir yog\'ishi mumkin (ehtimol).' },
        { english: 'You may start the exam now.', uzbek: 'Imtihonni hozir boshlashingiz mumkin (rasmiy ruxsat).' },
        { english: 'May I come in?', uzbek: 'Kirsam maylimi? (so\'rov)' }
      ],
      note: "EHTIMOLLIK DARAJASI:\n- will (100%) - aniq\n- should (80%) - kerak\n- may (50%) - mumkin\n- might (30%) - bo'lishi mumkin\n\nMAY vs CAN (Ruxsat uchun):\n- Can: norasmiy (do'stlar bilan)\n- May: rasmiy (ustoz, boshliq bilan)"
    },
    quiz: [
      {
        question: "I ___ swim when I was young.",
        options: ["can", "could", "would", "might"],
        correctAnswer: 1
      },
      {
        question: "___ you help me, please?",
        options: ["Can", "Could", "Would", "Might"],
        correctAnswer: 1
      },
      {
        question: "___ I come in? (rasmiy)",
        options: ["May", "Would", "Might", "Could"],
        correctAnswer: 0
      },
      {
        question: "It ___ rain tomorrow. (ehtimol)",
        options: ["will", "would", "might", "can"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'relative-clauses',
    title: 'Relative Clauses (Who/Which/That)',
    level: 'B1 – Intermediate',
    description: "Nisbiy ergash gaplar.",
    content: {
      rule: "Relative Clauses otni aniqlashtirish uchun ishlatiladi.\n\nRELATIVE PRONOUNS:\n- WHO: odamlar uchun\n- WHICH: narsalar uchun\n- THAT: odamlar VA narsalar uchun\n- WHERE: joylar uchun\n- WHEN: vaqt uchun\n- WHOSE: egalik uchun",
      formulas: [
        {
          type: 'positive',
          structure: 'Noun + who/that + verb (odamlar)',
          example: 'The man who lives next door is a teacher.'
        },
        {
          type: 'positive',
          structure: 'Noun + which/that + verb (narsalar)',
          example: 'The book which is on the table is mine.'
        },
        {
          type: 'positive',
          structure: 'Noun + where/when',
          example: 'The place where I was born... / The day when we met...'
        }
      ],
      examples: [
        { english: 'The man who lives next door is a doctor.', uzbek: 'Qo\'shni uyda yashaydigan odam shifokor.' },
        { english: 'The book which I bought is interesting.', uzbek: 'Men sotib olgan kitob qiziqarli.' },
        { english: 'The car that he drives is expensive.', uzbek: 'U haydaydigan mashina qimmat.' },
        { english: 'This is the house where I was born.', uzbek: 'Bu men tug\'ilgan uy.' },
        { english: 'I remember the day when we first met.', uzbek: 'Men birinchi uchrashgan kunimizni eslayman.' },
        { english: 'The woman whose car was stolen called the police.', uzbek: 'Mashinasi o\'g\'irlangan ayol politsiyaga qo\'ng\'iroq qildi.' }
      ],
      note: "DEFINING vs NON-DEFINING:\n\n1. DEFINING (aniqlovchi):\n   - Vergulsiz\n   - Muhim ma'lumot\n   - That ishlatish mumkin\n   - The man who called is my brother.\n\n2. NON-DEFINING (qo'shimcha):\n   - Vergul bilan\n   - Qo'shimcha ma'lumot\n   - That ishlatilmaydi\n   - My brother, who lives in London, is a doctor.\n\nTUSHIRIB QOLDIRISH:\n- Object relative pronoun tushirilishi mumkin:\n  The book (which) I bought...\n- Subject relative pronoun tushirilmaydi:\n  The man who lives... (who ni tushirib bo'lmaydi)"
    },
    quiz: [
      {
        question: "The man ___ lives next door is a doctor.",
        options: ["which", "who", "where", "when"],
        correctAnswer: 1
      },
      {
        question: "The book ___ I bought is interesting.",
        options: ["who", "which", "where", "whose"],
        correctAnswer: 1
      },
      {
        question: "This is the house ___ I was born.",
        options: ["which", "who", "where", "when"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'passive-voice-simple',
    title: 'Passive Voice (Present/Past Simple)',
    level: 'B1 – Intermediate',
    description: "Majhul nisbat - oddiy zamonlar.",
    content: {
      rule: "Passive Voice (Majhul nisbat) harakat qiluvchi emas, balki harakat qabul qiluvchi muhim bo'lganda ishlatiladi.\n\nYASALISHI: be + V3 (Past Participle)\n\nPRESENT SIMPLE PASSIVE: am/is/are + V3\nPAST SIMPLE PASSIVE: was/were + V3\n\nISHLATILISHI:\n- Harakat qiluvchi noma'lum\n- Harakat qiluvchi muhim emas\n- Rasmiy yozuvlar\n- Jarayonlarni tasvirlash",
      formulas: [
        {
          type: 'positive',
          structure: 'Present Simple Passive: am/is/are + V3',
          example: 'English is spoken here. / The car is washed every week.'
        },
        {
          type: 'positive',
          structure: 'Past Simple Passive: was/were + V3',
          example: 'The house was built in 1990. / The letters were sent yesterday.'
        },
        {
          type: 'positive',
          structure: 'by + agent (agar muhim bo\'lsa)',
          example: 'The book was written by Shakespeare.'
        }
      ],
      examples: [
        { english: 'English is spoken in many countries.', uzbek: 'Ingliz tili ko\'p mamlakatlarda gapriladi.' },
        { english: 'The car is washed every week.', uzbek: 'Mashina har hafta yuviladi.' },
        { english: 'The house was built in 1990.', uzbek: 'Uy 1990 yilda qurilgan.' },
        { english: 'The letters were sent yesterday.', uzbek: 'Xatlar kecha yuborilgan.' },
        { english: 'The book was written by Tolstoy.', uzbek: 'Kitob Tolstoy tomonidan yozilgan.' },
        { english: 'Rice is grown in Asia.', uzbek: 'Guruch Osiyoda yetishtiriladi.' }
      ],
      note: "ACTIVE vs PASSIVE:\n\nACTIVE: Subject + Verb + Object\n- Shakespeare wrote this book.\n  (Harakat qiluvchi muhim)\n\nPASSIVE: Object + be + V3 (+ by agent)\n- This book was written by Shakespeare.\n  (Kitob muhim)\n\nBY AGENT:\n- Muhim bo'lsa qo'shiladi\n- Noma'lum yoki muhim emas bo'lsa tushiriladi\n  ✓ The window was broken. (Kim? - noma'lum/muhim emas)\n  ✓ The window was broken by Tom. (Tom muhim)\n\nPASSIVE QUESTIONS:\n- Is English spoken here?\n- Was the house built in 1990?"
    },
    quiz: [
      {
        question: "English ___ in many countries.",
        options: ["speaks", "is spoken", "was spoken", "speak"],
        correctAnswer: 1
      },
      {
        question: "The house ___ in 1990.",
        options: ["built", "is built", "was built", "builds"],
        correctAnswer: 2
      },
      {
        question: "The book ___ by Shakespeare.",
        options: ["wrote", "is written", "was written", "writes"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'reported-speech-statements',
    title: 'Reported Speech (Statements)',
    level: 'B1 – Intermediate',
    description: "O'zlashtirma gap - tasdiq gaplar.",
    content: {
      rule: "Reported Speech (O'zlashtirma gap) birovning so'zlarini o'z so'zlarimiz bilan aytish.\n\nASOS QOIDALAR:\n1. Say vs Tell:\n   - say (to someone)\n   - tell someone\n2. Zamon o'zgaradi (backshift)\n3. Olmoshlar o'zgaradi\n4. Vaqt so'zlari o'zgaradi",
      formulas: [
        {
          type: 'positive',
          structure: 'say/said (that) + statement',
          example: 'He says (that) he is tired. / He said (that) he was tired.'
        },
        {
          type: 'positive',
          structure: 'tell/told + person + (that) + statement',
          example: 'She tells me (that) she is busy. / She told me (that) she was busy.'
        }
      ],
      examples: [
        { english: 'Direct: "I am tired." → Reported: He said he was tired.', uzbek: 'To\'g\'ridan-to\'g\'ri → O\'zlashtirma' },
        { english: 'Direct: "I live in London." → Reported: She said she lived in London.', uzbek: 'U Londonda yashashini aytdi.' },
        { english: 'Direct: "I will call you." → Reported: He said he would call me.', uzbek: 'U menga qo\'ng\'iroq qilishini aytdi.' },
        { english: 'She told me that she was happy.', uzbek: 'U menga baxtli ekanligini aytdi.' },
        { english: 'They said they were going to Paris.', uzbek: 'Ular Parijga borishlarini aytishdi.' }
      ],
      note: "ZAMON O'ZGARISHI (BACKSHIFT):\n\nDirect → Reported\n- Present Simple → Past Simple\n  \"I work\" → He said he worked\n- Present Continuous → Past Continuous\n  \"I am working\" → He said he was working\n- Past Simple → Past Perfect\n  \"I worked\" → He said he had worked\n- Will → Would\n  \"I will go\" → He said he would go\n- Can → Could\n  \"I can swim\" → He said he could swim\n\nVAQT SO'ZLARI:\n- today → that day\n- yesterday → the day before\n- tomorrow → the next day\n- now → then\n- here → there\n- this → that\n\nSAY vs TELL:\n- say (to someone): He said (to me) that...\n- tell someone: He told me that...\n- ✗ He said me (XATO!)"
    },
    quiz: [
      {
        question: "\"I am tired.\" → He said he ___ tired.",
        options: ["is", "was", "were", "am"],
        correctAnswer: 1
      },
      {
        question: "\"I will call you.\" → She said she ___ call me.",
        options: ["will", "would", "can", "could"],
        correctAnswer: 1
      },
      {
        question: "She ___ me that she was happy.",
        options: ["said", "told", "said to", "tell"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'gerunds-infinitives',
    title: 'Gerunds and Infinitives',
    level: 'B1 – Intermediate',
    description: "Gerund va Infinitive shakllar.",
    content: {
      rule: "Ba'zi fe'llardan keyin GERUND (V-ing), ba'zilaridan keyin INFINITIVE (to + V1) keladi.\n\nGERUND (V-ing):\n- enjoy, finish, mind, avoid, suggest, keep, stop\n\nINFINITIVE (to + V1):\n- want, need, hope, decide, plan, promise, agree\n\nIKKALASI HAM (ma'no o'zgarmaydi):\n- like, love, hate, start, begin, continue\n\nIKKALASI HAM (ma'no o'zgaradi):\n- stop, remember, forget, try",
      formulas: [
        {
          type: 'positive',
          structure: 'Verb + Gerund (V-ing)',
          example: 'I enjoy reading. / She finished working.'
        },
        {
          type: 'positive',
          structure: 'Verb + Infinitive (to + V1)',
          example: 'I want to go. / She decided to study.'
        },
        {
          type: 'positive',
          structure: 'Verb + both (ma\'no bir xil)',
          example: 'I like reading. = I like to read.'
        }
      ],
      examples: [
        { english: 'I enjoy playing football.', uzbek: 'Men futbol o\'ynashni yaxshi ko\'raman.' },
        { english: 'She finished doing her homework.', uzbek: 'U uyga vazifasini tugatdi.' },
        { english: 'I want to learn English.', uzbek: 'Men ingliz tilini o\'rganmoqchiman.' },
        { english: 'They decided to travel.', uzbek: 'Ular sayohat qilishga qaror qilishdi.' },
        { english: 'I like reading books.', uzbek: 'Men kitob o\'qishni yaxshi ko\'raman.' },
        { english: 'He stopped smoking.', uzbek: 'U chekishni tashladi (chekishni to\'xtatdi).' },
        { english: 'He stopped to smoke.', uzbek: 'U chekish uchun to\'xtadi (boshqa ish bilan band edi).' }
      ],
      note: "ASOSIY FE'LLAR:\n\nGERUND (V-ing):  \n- enjoy, finish, mind, avoid\n- suggest, keep, stop (doing)\n- give up, put off\n\nINFINITIVE (to + V1):\n- want, need, hope, decide\n- plan, promise, agree, refuse\n- would like, would love\n\nMA'NO O'ZGARADI:\n1. STOP:\n   - stop + V-ing = to'xtatish\n     I stopped smoking. (Chekishni tashladim)\n   - stop + to V = to'xtab, boshqa ish qilish\n     I stopped to smoke. (To'xtab chekdim)\n\n2. REMEMBER/FORGET:\n   - remember + V-ing = eslash (o'tmish)\n     I remember meeting him. (Uni uchrashganimni eslayman)\n   - remember + to V = eslab qolish (kelajak)\n     Remember to call me. (Menga qo'ng'iroq qilishni unutma)"
    },
    quiz: [
      {
        question: "I enjoy ___ football.",
        options: ["play", "to play", "playing", "played"],
        correctAnswer: 2
      },
      {
        question: "I want ___ English.",
        options: ["learn", "to learn", "learning", "learned"],
        correctAnswer: 1
      },
      {
        question: "She finished ___ her homework.",
        options: ["do", "to do", "doing", "done"],
        correctAnswer: 2
      },
      {
        question: "He stopped ___ (chekishni tashladi).",
        options: ["smoke", "to smoke", "smoking", "smoked"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'phrasal-verbs',
    title: 'Phrasal Verbs (Common)',
    level: 'B1 – Intermediate',
    description: "Umumiy frazeologik fe'llar.",
    content: {
      rule: "Phrasal Verbs - fe'l + predlog/ravish kombinatsiyasi. Ma'nosi ko'pincha asl fe'ldan farq qiladi.\n\nTURLARI:\n1. SEPARABLE (ajraladigan):\n   - turn off the TV = turn the TV off\n   - Olmosh bilan: turn it off (✓), turn off it (✗)\n\n2. INSEPARABLE (ajralmaydigan):\n   - look after my sister (✓)\n   - look my sister after (✗)",
      formulas: [
        {
          type: 'positive',
          structure: 'Verb + Particle (inseparable)',
          example: 'look after, look for, get on'
        },
        {
          type: 'positive',
          structure: 'Verb + Particle + Object (separable)',
          example: 'turn off the TV / turn the TV off'
        },
        {
          type: 'positive',
          structure: 'Verb + Pronoun + Particle',
          example: 'turn it off (✓), turn off it (✗)'
        }
      ],
      examples: [
        { english: 'Please turn off the TV.', uzbek: 'Iltimos, televizorni o\'chiring.' },
        { english: 'I need to look after my sister.', uzbek: 'Men singlimga qarashim kerak.' },
        { english: 'Can you pick me up at 5?', uzbek: 'Meni soat 5 da olib keta olasizmi?' },
        { english: 'I gave up smoking.', uzbek: 'Men chekishni tashladim.' },
        { english: 'The plane took off at 8 AM.', uzbek: 'Samolyot soat 8 da uchdi.' },
        { english: 'I ran into an old friend.', uzbek: 'Men eski do\'stimga tasodifan duch keldim.' },
        { english: 'Please fill in this form.', uzbek: 'Iltimos, bu shaklni to\'ldiring.' }
      ],
      note: "UMUMIY PHRASAL VERBS:\n\nSEPARABLE:\n- turn on/off (yoqish/o'chirish)\n- put on/take off (kiyish/yechish)\n- give up (tashlamoq)\n- fill in/out (to'ldirmoq)\n- pick up (olib kelmoq)\n- put off (kechiktirmoq)\n\nINSEPARABLE:\n- look after (qaramoq)\n- look for (qidirmoq)\n- look forward to (intiqlik bilan kutmoq)\n- get on/off (minmoq/tushmoq)\n- run into (tasodifan uchrashmoq)\n- come across (topmoq)\n\n3-WORD PHRASAL VERBS:\n- look forward to\n- get on with\n- put up with (chidamoq)\n- run out of (tugamoq)"
    },
    quiz: [
      {
        question: "Please turn ___ the TV.",
        options: ["on", "off", "up", "down"],
        correctAnswer: 1
      },
      {
        question: "I need to look ___ my sister.",
        options: ["at", "for", "after", "forward"],
        correctAnswer: 2
      },
      {
        question: "Turn ___ off. (televizorni)",
        options: ["it", "them", "TV", "television"],
        correctAnswer: 0
      },
      {
        question: "I gave ___ smoking.",
        options: ["up", "off", "on", "in"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'present-perfect-markers',
    title: 'Present Perfect: Markers (Ever, Never, Just, Already, Yet)',
    level: 'B1 – Intermediate',
    description: "Zamon ko'rsatkichlarining ishlatilishi.",
    content: {
      rule: "Present Perfect zamonida markers (vaqt ko'rsatkichlari) gapning ma'nosini aniqlashtiradi.\n\nEVER: Hayotingizda biror marta (Savolda)\nNEVER: Hech qachon...magan (Tasdiqda, inkor ma'no)\nJUST: Hozirgina (Harakat yangi tugagan)\nALREADY: Allaqachon (Kutilganidan oldin tugagan)\nYET: Hali (Inkor va Savolda, gap oxirida)",
      formulas: [
        {
          type: 'positive',
          structure: 'have/has + just/already/never + V3',
          example: 'I have just eaten. / She has never been to China.'
        },
        {
          type: 'question',
          structure: 'Have/Has + subject + ever + V3?',
          example: 'Have you ever seen a lion?'
        },
        {
          type: 'negative',
          structure: 'Subject + have/hasnot + V3 + yet',
          example: 'I haven\'t finished yet.'
        }
      ],
      examples: [
        { english: 'Have you ever visited London?', uzbek: 'Siz hech London (shahrida) bo\'lganmisiz?' },
        { english: 'I have never seen such a beautiful place.', uzbek: 'Men hech qachon bunday chiroyli joyni ko\'rmaganman.' },
        { english: 'She has just finished her project.', uzbek: 'U hozirgina loyihasini tugatdi.' },
        { english: 'We have already seen this movie.', uzbek: 'Biz bu filmni allaqachon ko\'rganmiz.' },
        { english: 'Has he arrived yet?', uzbek: 'U hali kelmadimi?' },
        { english: 'I haven\'t done my homework yet.', uzbek: 'Men hali uyga vazifamni qilmadim.' }
      ],
      note: "JOYLASHUVI:\n- just, already, ever, never: have/has va V3 orasida keladi.\n- yet: har doim gapning OXIRIDA keladi."
    },
    quiz: [
      {
        question: "Have you ___ eaten sushi?",
        options: ["never", "ever", "just", "yet"],
        correctAnswer: 1
      },
      {
        question: "I have ___ finished my work.",
        options: ["yet", "ever", "already", "since"],
        correctAnswer: 2
      },
      {
        question: "They haven't arrived ___.",
        options: ["just", "already", "never", "yet"],
        correctAnswer: 3
      }
    ]
  },
  {
    id: 'present-perfect-for-since',
    title: 'Present Perfect: For vs Since',
    level: 'B1 – Intermediate',
    description: "Davomiylik va boshlanish nuqtasi.",
    content: {
      rule: "Present Perfect bilan harakatning qancha davom etganini aytish uchun FOR va SINCE ishlatiladi.\n\nFOR: Vaqt oralig'i, davomiylik (period of time)\n- for 2 hours, for 5 days, for a long time, for 10 years\n\nSINCE: Harakat boshlangan aniq nuqta (point in time)\n- since 2010, since 8 o'clock, since Monday, since I was a child",
      formulas: [
        {
          type: 'positive',
          structure: 'have/has + V3 + for/since + time',
          example: 'I have lived here for 10 years. / I have lived here since 2014.'
        }
      ],
      examples: [
        { english: 'I have been a teacher for 5 years.', uzbek: 'Men 5 yildan beri o\'qituvchiman.' },
        { english: 'She has known him since high school.', uzbek: 'U uni litsey davridan beri taniydi.' },
        { english: 'We haven\'t seen them for ages.', uzbek: 'Biz ularni ancha vaqtdan beri ko\'rmadik.' },
        { english: 'It has been raining since morning.', uzbek: 'Ertalabdan beri yomg\'ir yog\'yapti.' },
        { english: 'How long have you lived here?', uzbek: 'Bu yerda qancha vaqtdan beri yashaysiz?' }
      ],
      note: "HOW LONG...? (Qancha vaqtdan beri...?)\nSavol har doim Present Perfect da beriladi, Present Simple da emas!\n- ✓ How long have you been married?\n- ✗ How long are you married?"
    },
    quiz: [
      {
        question: "I have lived here ___ 2010.",
        options: ["for", "since", "from", "at"],
        correctAnswer: 1
      },
      {
        question: "She has been a doctor ___ 10 years.",
        options: ["since", "from", "for", "ago"],
        correctAnswer: 2
      },
      {
        question: "We haven't seen each other ___ we left school.",
        options: ["for", "since", "while", "during"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'linking-words',
    title: 'Linking words (because, although, however)',
    level: 'B1 – Intermediate',
    description: "Gaplarni bog'lovchi so'zlar.",
    content: {
      rule: "Linking words gaplar orasidagi mantiqiy bog'liqlikni (sabab, zidlik, natija) ifodalaydi.\n\nBECAUSE: Sababni bildiradi (chunki)\n- I stayed at home because it was raining.\n\nALTHOUGH: Zidlikni bildiradi (garchi, ...sa ham)\n- Although it was raining, I went out.\n\nHOWEVER: Zidlikni bildiradi (biroq, lekın)\n- It was raining. However, I went out.",
      formulas: [
        {
          type: 'positive',
          structure: 'Sentence 1 + because + Sentence 2',
          example: 'I called her because I missed her.'
        },
        {
          type: 'positive',
          structure: 'Although + Sentence 1, Sentence 2',
          example: 'Although she was tired, she finished the work.'
        },
        {
          type: 'positive',
          structure: 'Sentence 1. However, Sentence 2',
          example: 'He is rich. However, he is not happy.'
        }
      ],
      examples: [
        { english: 'I went to bed early because I was tired.', uzbek: 'Men charchaganim sababli erta yotdim.' },
        { english: 'Although it was cold, she didn\'t wear a coat.', uzbek: 'Sovuq bo\'lishiga qaramay, u palto kiymadi.' },
        { english: 'The food was good. However, it was expensive.', uzbek: 'Ovqat yaxshi edi. Biroq, u qimmat edi.' },
        { english: 'I love London because there is so much to see.', uzbek: 'Men Londonni yaxshi ko\'raman, chunki u yerda ko\'radigan narsalar ko\'p.' },
        { english: 'Although he studied hard, he failed the exam.', uzbek: 'Garchi u qattiq o\'qigan bo\'lsa ham, imtihondan yiqildi.' }
      ],
      note: "PUNCTUATION (Tinish belgilari):\n\n1. BECAUSE: Odatda vergul bilan ajratilmaydi.\n2. ALTHOUGH: Gap boshida kelsa, o'rtada vergul qo'yiladi.\n3. HOWEVER: Yangi gapni boshlaydi va undan keyin har doim VERGUL qo'yiladi."
    },
    quiz: [
      {
        question: "I stayed at home ___ it was raining.",
        options: ["although", "however", "because", "but"],
        correctAnswer: 2
      },
      {
        question: "___ it was raining, I went out.",
        options: ["Because", "Although", "However", "So"],
        correctAnswer: 1
      },
      {
        question: "It was raining. ___, I went out.",
        options: ["Because", "Although", "However", "So"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'passive-voice-advanced',
    title: 'Passive Voice (All Tenses)',
    level: 'B2 – Upper-Intermediate',
    description: "Majhul nisbatning barcha zamonlarda ishlatilishi.",
    content: {
      rule: "Passive Voice (Majhul nisbat) barcha zamonlarda 'BE + V3' formulasi orqali yasaladi. Faqat 'BE' fe'li zamonga qarab o'zgaradi.\n\nASOSIY ZAMONLAR:\n- Present Continuous: is/are being + V3\n- Past Continuous: was/were being + V3\n- Present Perfect: have/has been + V3\n- Past Perfect: had been + V3\n- Future Simple: will be + V3\n- Modals: can/must/should be + V3",
      formulas: [
        {
          type: 'positive',
          structure: 'Object + be (zamon) + V3',
          example: 'The room is being cleaned. / The bill has been paid.'
        },
        {
          type: 'question',
          structure: 'Be (zamon) + Object + V3?',
          example: 'Is the house being painted? / Had the work been finished?'
        }
      ],
      examples: [
        { english: 'A new hospital is being built in our city.', uzbek: 'Shahrimizda yangi shifoxona qurilyapti.' },
        { english: 'The report has been finished by the team.', uzbek: 'Hisobot jamoa tomonidan yakunlandi.' },
        { english: 'The car was being repaired when I arrived.', uzbek: 'Men kelganimda mashina ta\'mirlanayotgan edi.' },
        { english: 'All the tickets will have been sold by tomorrow.', uzbek: 'Ertagacha barcha chiptalar sotib bo\'linadi.' },
        { english: 'The rules must be followed.', uzbek: 'Qoidalarga amal qilinishi shart.' }
      ],
      note: "Eslatma: Passive Voice asosan Continuous zamonlarda (Present/Past) va Perfect zamonlarda akademik tilda juda ko'p ishlatiladi."
    },
    quiz: [
      {
        question: "A new road ___ (build) at the moment.",
        options: ["is building", "is being built", "has been built", "was built"],
        correctAnswer: 1
      },
      {
        question: "All the homework ___ (finish) by 5 PM yesterday.",
        options: ["was finished", "has been finished", "had been finished", "is finished"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'reported-speech-questions-commands',
    title: 'Reported Speech (Questions & Commands)',
    level: 'B2 – Upper-Intermediate',
    description: "O'zlashtirma gapda savol va buyruqlar.",
    content: {
      rule: "1. SAVOLLAR:\n- Yes/No savollar: ASK + IF/WHETHER + Darak gap tartibi.\n- Wh- savollar: ASK + Wh-so'z + Darak gap tartibi.\n(Diqqat: Savol belgisi va yordamchi fe'llar - do/does/did - tushib qoladi!)\n\n2. BUYRUQ VA ILTIMOSLAR:\n- Tell/Ask/Order + Person + TO + V1.\n- Inkor bo'lsa: NOT TO + V1.",
      formulas: [
        {
          type: 'positive',
          structure: 'He asked me if I worked there.',
          example: 'Direct: "Do you work here?" -> Reported: He asked me if I worked there.'
        },
        {
          type: 'positive',
          structure: 'He told me to sit down.',
          example: 'Direct: "Sit down!" -> Reported: He told me to sit down.'
        }
      ],
      examples: [
        { english: 'He asked where I lived.', uzbek: 'U mendan qayerda yashashimni so\'radi.' },
        { english: 'She asked if I had seen that film.', uzbek: 'U mendan o\'sha filmni ko\'rgan-ko\'rmaganligimni so\'radi.' },
        { english: 'The doctor told me not to smoke.', uzbek: 'Shifokor menga chekmaslikni aytdi.' },
        { english: 'My mom asked me to help her with cleaning.', uzbek: 'Onam undan tozalashda yordam berishimni so\'radi.' }
      ],
      note: "Muhim: O'zlashtirma gapda savollardan keyin hech qachon savol belgisi qo'yilmaydi va so'z tartibi darak gapdagidek bo'ladi."
    },
    quiz: [
      {
        question: "\"Where is the bank?\" -> He asked me ___.",
        options: ["where is the bank", "where the bank was", "if the bank was there", "where the bank is"],
        correctAnswer: 1
      },
      {
        question: "\"Don't open the window!\" -> He told me ___.",
        options: ["to not open", "don't open", "not to open", "not open"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'relative-clauses-advanced',
    title: 'Relative Clauses (Advanced)',
    level: 'B2 – Upper-Intermediate',
    description: "Murakkab nisbiy ergash gaplar.",
    content: {
      rule: "Nisbiy ergash gaplar ikki turga bo'linadi:\n\n1. DEFINING: Kerakli ma'lumot beradi, vergul qo'yilmaydi. (The man who lives...)\n2. NON-DEFINING: Qo'shimcha ma'lumot beradi, har doim VERGUL bilan ajratiladi. (My boss, who is 50, is rich.)\n\nAdvanced holatlar: Preposition + Whom/Which (The house in which I live), Whose (egalik).",
      formulas: [
        {
          type: 'positive',
          structure: 'Noun, who/which/whose..., verb',
          example: 'My car, which I bought last month, has broken down.'
        }
      ],
      examples: [
        { english: 'Paris, which is the capital of France, is beautiful.', uzbek: 'Parij (Fransiyaning poytaxti) juda go\'zal.' },
        { english: 'The man whose car was stolen is very sad.', uzbek: 'Mashinasi o\'g\'irlangan odam juda xafa.' },
        { english: 'The company for which I work is international.', uzbek: 'Men ishlaydigan kompaniya xalqaro darajadagi.' }
      ],
      note: "Non-defining relative clauses da hech qachon 'THAT' ishlatib bo'lmaydi! Faqat who yoki which."
    },
    quiz: [
      {
        question: "My brother, ___ lives in London, is a doctor.",
        options: ["that", "which", "who", "whom"],
        correctAnswer: 2
      },
      {
        question: "The woman ___ handbag was stolen called the police.",
        options: ["who", "whose", "which", "whom"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'third-conditional',
    title: 'Third Conditional',
    level: 'B2 – Upper-Intermediate',
    description: "Uchinchi shart - o'tmishdagi xayoliy holat.",
    content: {
      rule: "Third Conditional o'tmishda sodir bo'lmagan, endi o'zgartirib bo'lmaydigan xayoliy vaziyatlar (pushaymonlik yoki tanqid) uchun ishlatiladi.\n\nYASALISHI: If + Past Perfect, WOULD HAVE + V3",
      formulas: [
        {
          type: 'positive',
          structure: 'If + had + V3, would have + V3',
          example: 'If I had studied harder, I would have passed the exam.'
        },
        {
          type: 'negative',
          structure: 'If + hadn\'t + V3, wouldn\'t have + V3',
          example: 'If he hadn\'t missed the bus, he wouldn\'t have been late.'
        }
      ],
      examples: [
        { english: 'If it hadn\'t rained, we would have gone for a walk.', uzbek: 'Agar yomg\'ir yog\'maganida, biz sayrga chiqqan bo\'lardik.' },
        { english: 'I would have called you if I had had your number.', uzbek: 'Agar raqamingiz bo\'lganida, sizga qo\'ng\'iroq qilgan bo\'lardik.' },
        { english: 'If they had invited me, I would have come.', uzbek: 'Agar meni taklif qilishganida, men kelgan bo\'lardim.' }
      ],
      note: "Third Conditional doim O'TMISH haqida gapiradi (lekin teskari holatni tasvirlaydi)."
    },
    quiz: [
      {
        question: "If I ___ (know) you were in hospital, I would have visited you.",
        options: ["knew", "know", "had known", "would know"],
        correctAnswer: 2
      },
      {
        question: "We would have won the match if we ___ (play) better.",
        options: ["played", "had played", "would play", "were playing"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'mixed-conditionals',
    title: 'Mixed Conditionals',
    level: 'B2 – Upper-Intermediate',
    description: "Aralash shartli gaplar.",
    content: {
      rule: "Mixed Conditionals o'tmish va hozirgi vaqtni bog'laydi. Ikki turi bor:\n\n1. O'TMISHDAGI SHART -> HOZIRGI NATIJA:\n- If + Past Perfect, WOULD + V1\n(If I had won the lottery, I would be rich now.)\n\n2. DOIMIY/HOZIRGI SHART -> O'TMISHDAGI NATIJA:\n- If + Past Simple, WOULD HAVE + V3\n(If I weren't so shy, I would have asked her out yesterday.)",
      formulas: [
        {
          type: 'positive',
          structure: 'If + had + V3, would + V1 (Past context -> Present result)',
          example: 'If I had taken the job, I would be living in London now.'
        }
      ],
      examples: [
        { english: 'If I had studied medicine, I would be a doctor now.', uzbek: 'Agar tibbiyotni o\'qiganimda, hozir shifokor bo\'lardim.' },
        { english: 'If he weren\'t so lazy, he would have finished the project yesterday.', uzbek: 'Agar u shunchalik dangasa bo\'lmaganida, kecha loyihani tugatgan bo\'lardik.' }
      ],
      note: "Mixed conditionals murakkab mantiqiy bog'liqliklar uchun ishlatiladi."
    },
    quiz: [
      {
        question: "If I ___ (take) that map, I wouldn't be lost now.",
        options: ["took", "had taken", "take", "would take"],
        correctAnswer: 1
      },
      {
        question: "If they ___ (be) more careful, the accident wouldn't have happened.",
        options: ["are", "had been", "were", "would be"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'modal-verbs-past',
    title: 'Modal Verbs in the Past',
    level: 'B2 – Upper-Intermediate',
    description: "Modal fe'llarning o'tmishdagi taxminiy ma'nolari.",
    content: {
      rule: "Modal fe'llardan keyin 'HAVE + V3' ishlatilsa, ular O'TMISH haqidagi taxmin, pushaymonlik yoki tanqidni bildiradi.\n\nASOSIY KONSTRUKTSIYALAR:\n- SHOULD HAVE + V3: Qilish kerak edi (lekin qilinmadi) - Pushaymonlik.\n- MUST HAVE + V3: Qilgan bo'lsa kerak - 100% ishonchli taxmin.\n- CAN'T HAVE + V3: Qilgan bo'lishi mumkin emas - Ishonchli rad etish.\n- MIGHT/COULD HAVE + V3: Qilgan bo'lishi mumkin - Kuchsiz taxmin.",
      formulas: [
        {
          type: 'positive',
          structure: 'Modal + have + V3',
          example: 'I should have studied more. / He must have forgotten.'
        }
      ],
      examples: [
        { english: 'I should have called her yesterday.', uzbek: 'Men kecha unga qo\'ng\'iroq qilishim kerak edi (qilmadim).' },
        { english: 'He has a new car. He must have won the lottery.', uzbek: 'Uning yangi mashinasi bor. U lotereyada yutgan bo\'lsa kerak.' },
        { english: 'She wasn\'t at home. She might have gone shopping.', uzbek: 'U uyda emas edi. U bozorlikka ketgan bo\'lishi mumkin.' },
        { english: 'You can\'t have seen him. He is in Paris!', uzbek: 'Siz uni ko\'rgan bo\'lishingiz mumkin emas. U Parijda!' }
      ],
      note: "Eslatma: Bu mavzu 'IELTS' va 'CEFR' imtihonlarida yuqori ball olish uchun muhimdir."
    },
    quiz: [
      {
        question: "I ___ (study) harder. I failed the exam.",
        options: ["should study", "must have studied", "should have studied", "could study"],
        correctAnswer: 2
      },
      {
        question: "The ground is wet. It ___ (rain) last night.",
        options: ["must have rained", "should have rained", "can't have rained", "might rain"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'causative-form',
    title: 'Causative Form (Have/Get something done)',
    level: 'B2 – Upper-Intermediate',
    description: "Biror ishni birovga qildirish.",
    content: {
      rule: "Causative form (Majburiy/Buyurtma nisbati) ish-harakatni gap egasi o'zi emas, balki boshqa birovga qildirganida ishlatiladi.\n\nYASALISHI:\n1. HAVE + something + V3 (xizmat ko'rsatuvchi muhim emas)\n2. GET + something + V3 (Xuddi shunday, norasmiyroq)",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + have/get + object + V3',
          example: 'I had my hair cut. / I am getting my car repaired.'
        }
      ],
      examples: [
        { english: 'I have my car washed every week.', uzbek: 'Men har hafta mashinamni yuvdiraman.' },
        { english: 'She is having her house painted.', uzbek: 'U uyini bo\'yatayapti (o\'zi emas, ustalarga).' },
        { english: 'I had my laptop repaired yesterday.', uzbek: 'Kecha noutbukimni ta\'mirlatdim.' },
        { english: 'You should have your eyes tested.', uzbek: 'Siz ko\'zlaringizni tekshirtirishingiz kerak.' }
      ],
      note: "Muhim: Active causative ham bor:\n- Have someone DO something (I had the mechanic fix my car)\n- Get someone TO DO something (I got the mechanic to fix my car)"
    },
    quiz: [
      {
        question: "I need to have my watch ___ (repair).",
        options: ["repair", "repairing", "repaired", "to repair"],
        correctAnswer: 2
      },
      {
        question: "She is getting her hair ___ at the moment.",
        options: ["cut", "cuts", "cutting", "to cut"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'wish-if-only',
    title: 'Wish / If only',
    level: 'B2 – Upper-Intermediate',
    description: "Orzu va pushaymonliklarni ifodalash.",
    content: {
      rule: "1. HOZIRGI VAQT UCHUN (Hozirgi holatdan norozilik):\n- Wish + Past Simple (I wish I were rich.)\n\n2. O'TMISH UCHUN (Pushaymonlik):\n- Wish + Past Perfect (I wish I had studied harder.)\n\n3. KELAJAK/XULQ-ATVOR UCHUN (O'zgarishni xohlash):\n- Wish + would + V1 (I wish it would stop raining.)",
      formulas: [
        {
          type: 'positive',
          structure: 'Wish + Past tense (Present meaning)',
          example: 'I wish I had a car. (Hozir yo\'q)'
        },
        {
          type: 'positive',
          structure: 'Wish + Past Perfect (Past meaning)',
          example: 'I wish I hadn\'t said that. (Aytib bo\'ldim)'
        }
      ],
      examples: [
        { english: 'I wish I knew English better.', uzbek: 'Qaniydi ingliz tilini yaxshiroq bilsam (hozir).' },
        { english: 'If only I had more money!', uzbek: 'Qaniydi ko\'proq pulim bo\'lsa!' },
        { english: 'I wish I hadn\'t missed the flight.', uzbek: 'Qaniydi parvozni o\'tkazib yubormagan bo\'lsam (o\'tmish).' },
        { english: 'I wish you would stop talking!', uzbek: 'Qaniydi sen gapirishdan to\'xtasang!' }
      ],
      note: "'If only' ko'proq emotsional va kuchliroq 'Wish' variantidir."
    },
    quiz: [
      {
        question: "I'm so busy. I wish I ___ (have) more free time.",
        options: ["have", "had", "would have", "had had"],
        correctAnswer: 1
      },
      {
        question: "I failed. I wish I ___ (study) more.",
        options: ["studied", "had studied", "would study", "study"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'used-to-would-advanced',
    title: 'Used to vs Would (Advanced)',
    level: 'B2 – Upper-Intermediate',
    description: "O'tmishdagi odatlar - nozik farqlar.",
    content: {
      rule: "Ikkala struktura ham o'tmishdagi takrorlanuvchi harakatlar uchun ishlatiladi, lekin muhim farqi bor:\n\n1. USED TO: O'tmishdagi odatlar VA holatlar (states) uchun ishlatiladi.\n(I used to live in Paris. / I used to be shy.)\n\n2. WOULD: FAQAT o'tmishdagi takrorlangan harakatlar (actions) uchun ishlatiladi. Holatlar (be, live, know, like) uchun ishlatilmaydi!",
      formulas: [
        {
          type: 'positive',
          structure: 'Used to / Would + V1',
          example: 'I would visit my grandma. / I used to visit my grandma.'
        }
      ],
      examples: [
        { english: 'Every summer, we would go to the beach.', uzbek: 'Har yozda biz dengizga borar edik (Action).' },
        { english: 'I used to have long hair.', uzbek: 'Mening sochlarim uzun edi (State - Bu yerda WOULD ishlatib bo\'lmaydi).' },
        { english: 'He would practice piano for hours.', uzbek: 'U soatlab pianino mashq qilar edi.' }
      ],
      note: "State verbs (be, have, live, believe) bilan faqat USED TO ishlatiladi."
    },
    quiz: [
      {
        question: "I ___ (be) very shy when I was a child.",
        options: ["would be", "used to be", "was used to being", "am used to"],
        correctAnswer: 1
      },
      {
        question: "We ___ (go) fishing every weekend.",
        options: ["used to go", "would go", "Both are correct", "None"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'inversion-advanced',
    title: 'Inversion (Never have I...)',
    level: 'B2 – Upper-Intermediate',
    description: "Gapning teskari tartibi.",
    content: {
      rule: "Inversion (Inversiya) - bu gap urg'usini (emphasis) kuchaytirish uchun yordamchi fe'lning egadan oldinga o'tishi. Asosan inkor so'zlar gap boshida kelsa ishlatiladi.\n\nISHLATILISHI:\n- Never, Seldom, Rarely boshida kelsa.\n- Little, Only then, Under no circumstances.\n- Not only... but also.",
      formulas: [
        {
          type: 'positive',
          structure: 'Negative word + Auxiliary + Subject + Main verb',
          example: 'Never have I seen such a beautiful view.'
        }
      ],
      examples: [
        { english: 'Never have I heard such a story.', uzbek: 'Hech qachon bunday hikoyani eshitmaganman.' },
        { english: 'Seldom do we see him these days.', uzbek: 'Shu kunlarda uni kamdan-kam ko\'ramiz.' },
        { english: 'Not only did he arrive late, but he also forgot his books.', uzbek: 'U nafaqat kechikib keldi, balki kitoblarini ham unutdi.' },
        { english: 'Under no circumstances should you open this door.', uzbek: 'Hech qanday holatda bu eshikni ochmasligingiz kerak.' }
      ],
      note: "Inversion asosan rasmiy yozma nutqda va ritorik nutqlarda ko'p uchraydi."
    },
    quiz: [
      {
        question: "Never ___ (I / see) such a big city.",
        options: ["I have seen", "have I seen", "did I saw", "I saw"],
        correctAnswer: 1
      },
      {
        question: "Rarely ___ (he / go) out at night.",
        options: ["he goes", "he did go", "does he go", "he go"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'advanced-passive',
    title: 'Advanced Passive Structures',
    level: 'C1 – Advanced',
    description: "Murakkab majhul nisbat shakllari.",
    content: {
      rule: "C1 darajasida Passive Voice (Majhul nisbat) faqat zamonlar bilan cheklanib qolmaydi. Quyidagi murakkab konstruksiyalar rasmiy va akademik tilda juda muhim:\n\n1. IMPERSONAL PASSIVE (Masofaviy majhul):\n- 'It is said that...' (Aytilishicha...)\n- 'He is thought to be...' (Uni ... deb o'ylashadi)\nKonstruktsiya: Subject + passive verb + to-infinitive (to be / to have been).\n\n2. PASSIVE INFINITIVES & GERUNDS:\n- Infinitive: to be + V3 (I want to be told the truth.)\n- Gerund: being + V3 (I hate being kept waiting.)\n- Perfect Passive: having been + V3\n\n3. PASSIVE WITH MODALS (Perfect):\n- must have been + V3\n- should have been + V3",
      formulas: [
        {
          type: 'positive',
          structure: 'It + is/was + V3 (said/thought/believed) + that + clause',
          example: 'It is expected that the prices will rise.'
        },
        {
          type: 'positive',
          structure: 'Subject + is/was + V3 + to + V1/have + V3',
          example: 'He is reported to have escaped.'
        }
      ],
      examples: [
        {
          english: "The bridge is believed to have been built in the 17th century.",
          uzbek: "Ko'prik 17-asrda qurilgan deb ishoniladi.",
          audio: "The bridge is believed to have been built in the 17th century."
        },
        {
          english: "I don't like being interrupted when I'm speaking.",
          uzbek: "Gapirayotganimda so'zim bo'linishini yoqtirmayman.",
          audio: "I don't like being interrupted when I'm speaking."
        }
      ]
    },
    quiz: [
      {
        question: "___ that the CEO will resign next month.",
        options: ["He is said", "It is said", "There is said", "It says"],
        correctAnswer: 1
      },
      {
        question: "The suspect is believed ___ the country already.",
        options: ["to leave", "leaving", "to have left", "had left"],
        correctAnswer: 2
      },
      {
        question: "I hate ___ what to do.",
        options: ["being told", "to be told", "telling", "having told"],
        correctAnswer: 0
      },
      {
        question: "The missing painting is thought ___ by a local artist.",
        options: ["to steal", "to have been stolen", "being stolen", "to have stolen"],
        correctAnswer: 1
      },
      {
        question: "This work needs ___ by tomorrow morning.",
        options: ["to finish", "being finished", "to be finished", "finishing"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'advanced-inversion-c1',
    title: 'Advanced Inversion',
    level: 'C1 – Advanced',
    description: "Inversiyaning murakkab va rasmiy tilda ishlatilishi.",
    content: {
      rule: "Inversiya (yordamchi fe'lning egadan oldinga o'tishi) urg'u berish va uslubni kuchaytirish uchun ishlatiladi. B2 dagi oddiy inversiyadan tashqari, C1 da quyidagilar muhim:\n\n1. SALBIY PREFIKSLAR:\n- Under no circumstances... (Hech qanday holatda...)\n- On no account... (Hech qanaqasiga...)\n- Little did she know... (U bilmas edi ham...)\n\n2. VAQT BOG'LOVCHILARI:\n- No sooner had I arrived than it started raining.\n- Hardly had I sat down when the phone rang.\n\n3. ONLY + VAQT/SHART:\n- Only after the meeting did I realize the truth.\n- Only when I saw him did I believe it.",
      formulas: [
        {
          type: 'negative',
          structure: 'Negative word + Auxiliary + Subject + Main Verb',
          example: 'Never have I seen such a beautiful sunset.'
        },
        {
          type: 'negative',
          structure: 'No sooner + had + Subject + V3 + than + Past Simple',
          example: 'No sooner had he left the house than it started to snow.'
        }
      ],
      examples: [
        {
          english: "Under no circumstances should you open that door.",
          uzbek: "Hech qanday holatda bu eshikni ochmasligingiz kerak.",
          audio: "Under no circumstances should you open that door."
        },
        {
          english: "Little did he realize that his life was about to change forever.",
          uzbek: "U hayoti abadiyga o'zgarishini xayoliga ham keltirmagan edi.",
          audio: "Little did he realize that his life was about to change forever."
        }
      ]
    },
    quiz: [
      {
        question: "___ should you give your password to anyone.",
        options: ["Only then", "Under no circumstances", "No sooner", "Hardly"],
        correctAnswer: 1
      },
      {
        question: "No sooner ___ the room than everyone started clapping.",
        options: ["he entered", "had he entered", "did he enter", "he has entered"],
        correctAnswer: 1
      },
      {
        question: "___ had I got into bed when the doorbell rang.",
        options: ["Seldom", "Barely", "Never", "Only then"],
        correctAnswer: 1
      },
      {
        question: "Little ___ that they were being watched.",
        options: ["they knew", "did they know", "have they known", "know they"],
        correctAnswer: 1
      },
      {
        question: "Only when she took off her hat ___ who she was.",
        options: ["I recognized", "did I recognize", "had I recognized", "I did recognize"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'ellipsis-substitution',
    title: 'Ellipsis & Substitution',
    level: 'C1 – Advanced',
    description: "Takroriylikni oldini olish: So'zlarni tushirib qoldirish va almashtirish.",
    content: {
      rule: "Rasmiy va ravon nutqda takrorlanadigan so'zlarni tushirib qoldirish (Ellipsis) yoki boshqa so'z bilan almashtirish (Substitution) juda muhim.\n\n1. ELLIPSIS (Tushirib qoldirish):\n- 'Are you coming?' 'I hope (to come).'\n- 'He came to the party and (he) stayed until midnight.'\n- 'She likes tea but I don't (like tea).'\n\n2. SUBSTITUTION (Almashtirish):\n- ONE/ONES: 'Which bag is yours?' 'The red one.'\n- DO SO: 'He promised to call and he did so.'\n- SO/NOT: 'Is it raining?' 'I think so / I hope not.'\n- SO/NEITHER + AUX: 'I like it.' 'So do I.'",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject + reporting verb + so/not',
          example: 'I suppose so. / I hope not.'
        },
        {
          type: 'question',
          structure: 'So / Neither + Auxiliary + Subject',
          example: 'So have I. / Neither does she.'
        }
      ],
      examples: [
        {
          english: "I'll help you if you want me to.",
          uzbek: "Agar xohlasangiz, sizga yordam beraman (me to 'help you' tushib qolgan).",
          audio: "I'll help you if you want me to."
        },
        {
          english: "Many people enjoy winter sports, but some don't.",
          uzbek: "Ko'pchilik qishki sportni yoqtiradi, lekin ba'zilar yoqtirmaydi.",
          audio: "Many people enjoy winter sports, but some don't."
        }
      ]
    },
    quiz: [
      {
        question: "Do you think it will snow tonight? I ___.",
        options: ["hope so", "hope it", "hope that", "hope snowing"],
        correctAnswer: 0
      },
      {
        question: "I've never been to Paris. ___.",
        options: ["So have I", "Neither have I", "I haven't so", "Neither am I"],
        correctAnswer: 1
      },
      {
        question: "If you want to leave now, you can ___.",
        options: ["do", "do it", "do so", "doing"],
        correctAnswer: 2
      },
      {
        question: "I'm not sure if he's coming, but I expect ___.",
        options: ["not", "so", "it", "to"],
        correctAnswer: 1
      },
      {
        question: "These biscuits are nice. Would you like ___?",
        options: ["one", "ones", "some", "it"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'discourse-markers-c1',
    title: 'Discourse Markers',
    level: 'C1 – Advanced',
    description: "Nutqni tartibga soluvchi va mantiqiy bog'lovchi so'zlar.",
    content: {
      rule: "Discourse markers (Nutqiy bog'lovchilar) gaplar orasidagi munosabatni ko'rsatadi va nutqni tabiiyroq qiladi.\n\n1. MAVZUNI O'ZGARTIRISH:\n- Anyway / Anyhow (Nima bo'lganda ham, har holda)\n- Incidentally / By the way (Aytgancha)\n\n2. UMUMLASHTIRISH:\n- On the whole / By and large (Umuman olganda)\n\n3. ANIQLASHTIRISH VA TUZATISH:\n- Mind you (Shuni aytish kerakki / Biroq)\n- In fact / As a matter of fact (Aslida)\n- At least (Hech bo'lmasa)\n\n4. NATIJA VA XULOSA:\n- Consequently (Natijada)\n- To sum up (Xulosa qilib aytganda)",
      formulas: [
        {
          type: 'positive',
          structure: 'Clause + Mind you + Clause',
          example: 'The hotel was great. Mind you, it was very expensive.'
        },
        {
          type: 'positive',
          structure: 'On the whole + Clause',
          example: 'On the whole, I think the project was a success.'
        }
      ],
      examples: [
        {
          english: "It's a tough job. Mind you, the pay is excellent.",
          uzbek: "Bu qiyin ish. Shuni aytish kerakki, maoshi juda yaxshi.",
          audio: "It's a tough job. Mind you, the pay is excellent."
        },
        {
          english: "Incidentally, where did you buy that suit?",
          uzbek: "Aytgancha, u kostyumni qayerdan sotib oldingiz?",
          audio: "Incidentally, where did you buy that suit?"
        }
      ]
    },
    quiz: [
      {
        question: "___, the weather wasn't that bad during our holiday.",
        options: ["Mind you", "On the whole", "Incidentally", "Consequently"],
        correctAnswer: 1
      },
      {
        question: "He's very intelligent. ___, he does make some silly mistakes.",
        options: ["Mind you", "By and large", "At least", "To sum up"],
        correctAnswer: 0
      },
      {
        question: "___, what time is the meeting tomorrow?",
        options: ["In fact", "By the way", "Consequently", "On the whole"],
        correctAnswer: 1
      },
      {
        question: "The company lost money and, ___, had to fire some workers.",
        options: ["incidentally", "consequently", "anyway", "at least"],
        correctAnswer: 1
      },
      {
        question: "___, the trip was a wonderful experience despite the rain.",
        options: ["Mind you", "Anyway", "By and large", "In fact"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'advanced-conditionals-c1',
    title: 'Advanced Conditionals',
    level: 'C1 – Advanced',
    description: "Murakkab va inversiyalangan shartli gaplar.",
    content: {
      rule: "C1 darajasida shartli gaplar (Conditionals) ko'proq inversiya va 'if' so'zining muqobillari bilan boyitiladi.\n\n1. INVERTED CONDITIONALS (If siz shartlar):\n- First: Should you need any help... (If you should need...)\n- Second: Were I in your position... (If I were...)\n- Third: Had I known the truth... (If I had known...)\n\n2. ALTERNATIVES TO 'IF':\n- Provided / Providing (that) - Sharti bilan\n- As long as / So long as - ...gan taqdirda\n- Supposing / Suppose - Faraz qilaylik\n- But for / If it weren't for - Agar ... bo'lmaganida\n\n3. MIXED CONDITIONALS (Advanced review):\n- O'tmishdagi harakatning hozirgi natijasi.\n- Hozirgi doimiy holatning o'tmishdagi natijasi.",
      formulas: [
        {
          type: 'question',
          structure: 'Were / Had / Should + Subject + ...',
          example: 'Had I known, I would have called you.'
        },
        {
          type: 'positive',
          structure: 'But for + Noun, Subject + would + have + V3',
          example: 'But for your help, I would have failed.'
        }
      ],
      examples: [
        {
          english: "Should you have any questions, please do not hesitate to contact us.",
          uzbek: "Agar savollaringiz bo'lsa, biz bilan bog'lanishga tortinmang.",
          audio: "Should you have any questions, please do not hesitate to contact us."
        },
        {
          english: "Were I to win the lottery, I would donate half to charity.",
          uzbek: "Agar lotereyada yutib olsam, yarmini xayriyaga bergan bo'lardim.",
          audio: "Were I to win the lottery, I would donate half to charity."
        }
      ]
    },
    quiz: [
      {
        question: "___ you need further assistance, please let us know.",
        options: ["Had", "Should", "Were", "If should"],
        correctAnswer: 1
      },
      {
        question: "___ he arrived 5 minutes earlier, he would have caught the train.",
        options: ["Were", "Should", "Had", "If had"],
        correctAnswer: 2
      },
      {
        question: "___ it not for your support, I wouldn't be here.",
        options: ["Were", "Had", "Should", "But"],
        correctAnswer: 0
      },
      {
        question: "We'll go to the beach ___ that it doesn't rain.",
        options: ["suppose", "but for", "provided", "unless that"],
        correctAnswer: 2
      },
      {
        question: "___ you were offered the job, would you take it?",
        options: ["Suppose", "Should", "Providing", "As long as"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'nominalisation',
    title: 'Nominalisation',
    level: 'C1 – Advanced',
    description: "Fe'l va sifatlarni otga aylantirish orqali akademik uslub yaratish.",
    content: {
      rule: "Nominalizatsiya (Nominalisation) - bu verb (fe'l) yoki adjective (sifat) ni noun (ot) ga aylantirish jarayoni. Bu asosan akademik va rasmiy yozuvda matnni ixchamroq va ob'ektivroq qilish uchun ishlatiladi.\n\nMISOLAR:\n- Verbal: They *analyzed* the data. (Oddiy)\n- Nominalised: The *analysis* of the data was conducted. (Akademik)\n\nAFZALLIKLARI:\n1. Ob'ektivlik: Harakat egasiga emas, harakatning o'ziga e'tibor qaratiladi.\n2. Ixchamlik: Bir nechta gapni bir guruhga birlashtirish mumkin.\n3. Rasmiylik: Ilmiy ishlar va hisobotlar uchun zarur.",
      formulas: [
        {
          type: 'positive',
          structure: 'Subject (Noun from Verb/Adj) + Verb + ...',
          example: 'The rapid growth of the economy is impressive.'
        },
        {
          type: 'positive',
          structure: 'There has been an increase (Noun) in ...',
          example: 'There has been a steady increase in sales.'
        }
      ],
      examples: [
        {
          english: "The discovery of the new planet caused much excitement.",
          uzbek: "Yangi sayyoraning kashf etilishi katta hayajonga sabab bo'ldi.",
          audio: "The discovery of the new planet caused much excitement."
        },
        {
          english: "Your refusal to cooperate is very disappointing.",
          uzbek: "Sizning hamkorlik qilishdan bosh tortishingiz juda achinarli.",
          audio: "Your refusal to cooperate is very disappointing."
        }
      ]
    },
    quiz: [
      {
        question: "The ___ of the new policy was met with opposition.",
        options: ["implement", "implementation", "implementing", "implemented"],
        correctAnswer: 1
      },
      {
        question: "There has been a sharp ___ in unemployment recently.",
        options: ["rise", "rising", "risen", "raised"],
        correctAnswer: 0
      },
      {
        question: "The ___ of the building will take several months.",
        options: ["construct", "construction", "constructive", "constructing"],
        correctAnswer: 1
      },
      {
        question: "The failure was a result of a lack of ___.",
        options: ["organize", "organizer", "organization", "organized"],
        correctAnswer: 2
      },
      {
        question: "___ of the crime is essential for the investigation.",
        options: ["Reporting", "Report", "The reporting", "To report"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'complex-sentence-structures',
    title: 'Complex Sentence Structures',
    level: 'C1 – Advanced',
    description: "Murakkab gap strukturalari: Cleft sentences va Participle clauses.",
    content: {
      rule: "C1 darajasida gaplarni boyitish uchun Cleft sentences va Participle clauses ishlatiladi.\n\n1. CLEFT SENTENCES (Urg'uli gaplar):\n- IT-CLEFT: It was Peter who broke the window. (Peter sindirdi, boshqasi emas)\n- WHAT-CLEFT: What I need is a coffee. (Menga aynan kofe kerak)\n\n2. PARTICIPLE CLAUSES (-ing / -ed / having + V3):\n- Bir vaqtda sodir bo'lgan harakatlar: *Walking* down the street, I saw him.\n- Sabab-natija: *Being* tired, I went to bed early.\n- Ketma-ket harakatlar: *Having finished* my work, I left.",
      formulas: [
        {
          type: 'positive',
          structure: 'It + is/was + [focus] + who/that + ...',
          example: 'It was my brother who called.'
        },
        {
          type: 'positive',
          structure: 'Having + V3 + , + Subject + Verb',
          example: 'Having lost my key, I had to wait outside.'
        }
      ],
      examples: [
        {
          english: "What worries me the most is the lack of transparency.",
          uzbek: "Meni eng ko'p tashvishga soladigan narsa - shaffoflikning yo'qligi.",
          audio: "What worries me the most is the lack of transparency."
        },
        {
          english: "Not knowing the language, he found it hard to get a job.",
          uzbek: "Tilni bilmaganligi sababli, u ish topishga qiynaldi.",
          audio: "Not knowing the language, he found it hard to get a job."
        }
      ]
    },
    quiz: [
      {
        question: "___ I need is a long holiday.",
        options: ["It", "What", "That", "Which"],
        correctAnswer: 1
      },
      {
        question: "___ the book, I returned it to the library.",
        options: ["Finished", "Having finished", "To finish", "Being finished"],
        correctAnswer: 1
      },
      {
        question: "It was in 1995 ___ we first met.",
        options: ["who", "what", "that", "where"],
        correctAnswer: 2
      },
      {
        question: "___ by the news, she couldn't speak.",
        options: ["Shocking", "Shocked", "Being shocked", "Having shocked"],
        correctAnswer: 1
      },
      {
        question: "___ the map, he quickly found his way.",
        options: ["Studying", "Studied", "To study", "By study"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'formal-informal-grammar',
    title: 'Formal vs Informal Grammar',
    level: 'C1 – Advanced',
    description: "Rasmiy va norasmiy tillarning nozik farqlari.",
    content: {
      rule: "Vaziyatga (register) qarab grammatika o'zgaradi.\n\n1. FORMAL (Rasmiy):\n- Passive voice ko'proq ishlatiladi.\n- Nominalisation (otli birikmalar) ishlatiladi.\n- To'liq shakllar (I am - I'm emas).\n- 'Whom' va predloglarning o'rni (The man with whom I spoke).\n\n2. INFORMAL (Norasmiy):\n- Phrasal verbs ko'p ishlatiladi.\n- Ellipsis (so'zlarni tushirib qoldirish).\n- Qisqartmalar (don't, can't).\n- Har kungi iboralar va jargonlar.",
      formulas: [
        {
          type: 'positive',
          structure: 'Formal: Preposition + whom/which',
          example: 'The person for whom this was intended.'
        },
        {
          type: 'negative',
          structure: 'Informal: No pronoun / Dropped subject',
          example: '(Are you) ready yet? / (I) don\'t know.'
        }
      ],
      examples: [
        {
          english: "I am writing with reference to your letter.",
          uzbek: "Sizning xatingizga asosan yozmoqdaman. (Formal)",
          audio: "I am writing with reference to your letter."
        },
        {
          english: "Thanks for the email. Just a quick note to say...",
          uzbek: "Email uchun rahmat. Shunchaki aytib qo'ymoqchi edimki... (Informal)",
          audio: "Thanks for the email. Just a quick note to say..."
        }
      ]
    },
    quiz: [
      {
        question: "Which one is MORE formal?",
        options: ["I want to let you know", "I am writing to inform you", "Just wanted to say", "I'm telling you"],
        correctAnswer: 1
      },
      {
        question: "Formal version: The man ___ I spoke to.",
        options: ["who", "that", "whom", "to whom"],
        correctAnswer: 3
      },
      {
        question: "Informal ellipsis: '(Do you) want a drink?' -> ___",
        options: ["Want a drink?", "Do want drink?", "Drink want?", "You want drink?"],
        correctAnswer: 0
      },
      {
        question: "Should we use 'don't' in formal academic writing?",
        options: ["Yes, always", "No, use 'do not'", "Only in quotes", "It doesn't matter"],
        correctAnswer: 1
      },
      {
        question: "Which sentence uses nominalisation (formal style)?",
        options: ["We decided to stop the project.", "The decision to terminate the project was made.", "We stopped it.", "They decided to end things."],
        correctAnswer: 1
      }
    ]
  }
];
