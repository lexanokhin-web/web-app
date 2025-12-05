export interface SentenceExercise {
    id: string;
    level: 'A1' | 'A2' | 'B1' | 'B2';
    correctSentence: string[];
    translation: string;
    hint?: string;
    grammarFocus: string;
}

export const sentenceExercises: SentenceExercise[] = [
    // ========== A1 Level (Basic) - 15 exercises ==========
    {
        id: 'a1_1',
        level: 'A1',
        correctSentence: ['Ich', 'bin', 'Anna'],
        translation: 'Я - Анна',
        hint: 'verb "sein" (быть)',
        grammarFocus: 'Verb "sein" - present tense'
    },
    {
        id: 'a1_2',
        level: 'A1',
        correctSentence: ['Das', 'ist', 'ein', 'Apfel'],
        translation: 'Это яблоко',
        hint: 'Subject + verb + article + noun',
        grammarFocus: 'Article + noun'
    },
    {
        id: 'a1_3',
        level: 'A1',
        correctSentence: ['Ich', 'habe', 'einen', 'Hund'],
        translation: 'У меня есть собака',
        hint: 'Akkusativ for masculine',
        grammarFocus: 'Verb "haben" + Akkusativ'
    },
    {
        id: 'a1_4',
        level: 'A1',
        correctSentence: ['Wie', 'heißt', 'du', '?'],
        translation: 'Как тебя зовут?',
        hint: 'Question word first',
        grammarFocus: 'W-Frage (question)'
    },
    {
        id: 'a1_5',
        level: 'A1',
        correctSentence: ['Ich', 'komme', 'aus', 'Deutschland'],
        translation: 'Я из Германии',
        hint: 'aus + country name',
        grammarFocus: 'Preposition "aus"'
    },
    {
        id: 'a1_6',
        level: 'A1',
        correctSentence: ['Die', 'Katze', 'ist', 'klein'],
        translation: 'Кошка маленькая',
        grammarFocus: 'Adjective as predicate'
    },
    {
        id: 'a1_7',
        level: 'A1',
        correctSentence: ['Mein', 'Bruder', 'wohnt', 'in', 'Berlin'],
        translation: 'Мой брат живёт в Берлине',
        grammarFocus: 'Possessive pronoun + preposition "in"'
    },
    {
        id: 'a1_8',
        level: 'A1',
        correctSentence: ['Ich', 'trinke', 'gerne', 'Kaffee'],
        translation: 'Я люблю пить кофе',
        grammarFocus: 'Adverb "gerne"'
    },
    {
        id: 'a1_9',
        level: 'A1',
        correctSentence: ['Das', 'Buch', 'kostet', 'zehn', 'Euro'],
        translation: 'Книга стоит десять евро',
        grammarFocus: 'Numbers + currency'
    },
    {
        id: 'a1_10',
        level: 'A1',
        correctSentence: ['Wir', 'lernen', 'Deutsch'],
        translation: 'Мы учим немецкий',
        grammarFocus: 'Plural verb conjugation'
    },
    {
        id: 'a1_11',
        level: 'A1',
        correctSentence: ['Sie', 'arbeitet', 'nicht', 'heute'],
        translation: 'Она не работает сегодня',
        hint: 'nicht после глагола',
        grammarFocus: 'Negation with "nicht"'
    },
    {
        id: 'a1_12',
        level: 'A1',
        correctSentence: ['Der', 'Mann', 'fährt', 'Auto'],
        translation: 'Мужчина едет на машине',
        grammarFocus: 'Irregular verb "fahren"'
    },
    {
        id: 'a1_13',
        level: 'A1',
        correctSentence: ['Es', 'ist', 'kalt', 'draußen'],
        translation: 'На улице холодно',
        grammarFocus: 'Impersonal "es"'
    },
    {
        id: 'a1_14',
        level: 'A1',
        correctSentence: ['Wo', 'ist', 'die', 'Toilette', '?'],
        translation: 'Где туалет?',
        grammarFocus: 'Question with "wo"'
    },
    {
        id: 'a1_15',
        level: 'A1',
        correctSentence: ['Meine', 'Schwester', 'mag', 'Musik'],
        translation: 'Моя сестра любит музыку',
        grammarFocus: 'Verb "mögen"'
    },

    // ========== A2 Level (Elementary) - 20 exercises ==========
    {
        id: 'a2_1',
        level: 'A2',
        correctSentence: ['Ich', 'möchte', 'Deutsch', 'lernen'],
        translation: 'Я хочу учить немецкий',
        hint: 'Modalverb + Infinitiv',
        grammarFocus: 'Modal verb "möchte" + infinitive'
    },
    {
        id: 'a2_2',
        level: 'A2',
        correctSentence: ['Gestern', 'habe', 'ich', 'ein', 'Buch', 'gelesen'],
        translation: 'Вчера я читал книгу',
        hint: 'Perfekt: haben + Partizip II',
        grammarFocus: 'Perfekt tense'
    },
    {
        id: 'a2_3',
        level: 'A2',
        correctSentence: ['Ich', 'gehe', 'ins', 'Kino'],
        translation: 'Я иду в кино',
        hint: 'in + das = ins',
        grammarFocus: 'Preposition contraction'
    },
    {
        id: 'a2_4',
        level: 'A2',
        correctSentence: ['Kannst', 'du', 'mir', 'helfen', '?'],
        translation: 'Ты можешь мне помочь?',
        hint: 'Modalverb first in question',
        grammarFocus: 'Modal verb "können" + Dativ'
    },
    {
        id: 'a2_5',
        level: 'A2',
        correctSentence: ['Ich', 'treffe', 'mich', 'mit', 'meinen', 'Freunden'],
        translation: 'Я встречаюсь с моими друзьями',
        hint: 'Reflexive verb + Dativ plural',
        grammarFocus: 'Reflexive verb + preposition'
    },
    {
        id: 'a2_6',
        level: 'A2',
        correctSentence: ['Sie', 'ist', 'größer', 'als', 'ich'],
        translation: 'Она выше, чем я',
        hint: 'Komparativ + als',
        grammarFocus: 'Comparative adjectives'
    },
    {
        id: 'a2_7',
        level: 'A2',
        correctSentence: ['Ich', 'bin', 'nach', 'Wien', 'gefahren'],
        translation: 'Я поехал в Вену',
        hint: 'Perfekt mit "sein"',
        grammarFocus: 'Perfekt with "sein"'
    },
    {
        id: 'a2_8',
        level: 'A2',
        correctSentence: ['Der', 'Zug', 'fährt', 'um', 'acht', 'Uhr', 'ab'],
        translation: 'Поезд отправляется в восемь часов',
        hint: 'Separable verb at the end',
        grammarFocus: 'Separable verb "abfahren"'
    },
    {
        id: 'a2_9',
        level: 'A2',
        correctSentence: ['Ich', 'muss', 'heute', 'zu', 'Hause', 'bleiben'],
        translation: 'Я должен сегодня остаться дома',
        grammarFocus: 'Modal verb "müssen"'
    },
    {
        id: 'a2_10',
        level: 'A2',
        correctSentence: ['Gibst', 'du', 'mir', 'bitte', 'das', 'Salz', '?'],
        translation: 'Дашь мне, пожалуйста, соль?',
        hint: 'Dativ object "mir"',
        grammarFocus: 'Verb "geben" + Dativ'
    },
    {
        id: 'a2_11',
        level: 'A2',
        correctSentence: ['Wir', 'haben', 'uns', 'im', 'Café', 'getroffen'],
        translation: 'Мы встретились в кафе',
        grammarFocus: 'Reflexive verb in Perfekt'
    },
    {
        id: 'a2_12',
        level: 'A2',
        correctSentence: ['Das', 'Wetter', 'war', 'gestern', 'schön'],
        translation: 'Погода вчера была хорошей',
        grammarFocus: 'Präteritum of "sein"'
    },
    {
        id: 'a2_13',
        level: 'A2',
        correctSentence: ['Ich', 'freue', 'mich', 'auf', 'den', 'Urlaub'],
        translation: 'Я радуюсь отпуску',
        hint: 'sich freuen auf + Akkusativ',
        grammarFocus: 'Reflexive verb with preposition'
    },
    {
        id: 'a2_14',
        level: 'A2',
        correctSentence: ['Sie', 'hat', 'mir', 'ein', 'Geschenk', 'gegeben'],
        translation: 'Она дала мне подарок',
        grammarFocus: 'Dativ + Akkusativ objects'
    },
    {
        id: 'a2_15',
        level: 'A2',
        correctSentence: ['Wir', 'wollen', 'morgen', 'ins', 'Museum', 'gehen'],
        translation: 'Мы хотим завтра пойти в музей',
        grammarFocus: 'Modal verb "wollen"'
    },
    {
        id: 'a2_16',
        level: 'A2',
        correctSentence: ['Er', 'steht', 'jeden', 'Tag', 'um', 'sechs', 'auf'],
        translation: 'Он встаёт каждый день в шесть',
        hint: 'Separable verb',
        grammarFocus: 'Separable verb "aufstehen"'
    },
    {
        id: 'a2_17',
        level: 'A2',
        correctSentence: ['Die', 'Kinder', 'spielen', 'im', 'Garten'],
        translation: 'Дети играют в саду',
        grammarFocus: 'Preposition "in" + Dativ (location)'
    },
    {
        id: 'a2_18',
        level: 'A2',
        correctSentence: ['Ich', 'interessiere', 'mich', 'für', 'Geschichte'],
        translation: 'Я интересуюсь историей',
        hint: 'sich interessieren für',
        grammarFocus: 'Reflexive verb + für'
    },
    {
        id: 'a2_19',
        level: 'A2',
        correctSentence: ['Wann', 'bist', 'du', 'angekommen', '?'],
        translation: 'Когда ты приехал?',
        grammarFocus: 'Perfekt question with "sein"'
    },
    {
        id: 'a2_20',
        level: 'A2',
        correctSentence: ['Ich', 'habe', 'keine', 'Zeit'],
        translation: 'У меня нет времени',
        grammarFocus: 'Negation with "kein"'
    },

    // ========== B1 Level (Intermediate) - 25 exercises ==========
    {
        id: 'b1_1',
        level: 'B1',
        correctSentence: ['Obwohl', 'es', 'regnet', ',', 'gehe', 'ich', 'spazieren'],
        translation: 'Хотя идет дождь, я иду гулять',
        hint: 'Nebensatz: verb at the end',
        grammarFocus: 'Subordinate clause with "obwohl"'
    },
    {
        id: 'b1_2',
        level: 'B1',
        correctSentence: ['Ich', 'würde', 'gerne', 'nach', 'Berlin', 'fahren'],
        translation: 'Я бы хотел поехать в Берлин',
        hint: 'Konjunktiv II: würde + gerne',
        grammarFocus: 'Konjunktiv II (conditional)'
    },
    {
        id: 'b1_3',
        level: 'B1',
        correctSentence: ['Das', 'Buch', ',', 'das', 'ich', 'lese', ',', 'ist', 'interessant'],
        translation: 'Книга, которую я читаю, интересная',
        hint: 'Relativsatz: verb at the end',
        grammarFocus: 'Relative clause'
    },
    {
        id: 'b1_4',
        level: 'B1',
        correctSentence: ['Nachdem', 'ich', 'gegessen', 'hatte', ',', 'ging', 'ich', 'schlafen'],
        translation: 'После того как я поел, я пошел спать',
        hint: 'Plusquamperfekt + Präteritum',
        grammarFocus: 'Plusquamperfekt in subordinate clause'
    },
    {
        id: 'b1_5',
        level: 'B1',
        correctSentence: ['Je', 'mehr', 'ich', 'lerne', ',', 'desto', 'besser', 'verstehe', 'ich'],
        translation: 'Чем больше я учу, тем лучше я понимаю',
        hint: 'Je... desto...',
        grammarFocus: 'Comparative construction "je...desto"'
    },
    {
        id: 'b1_6',
        level: 'B1',
        correctSentence: ['Die', 'Tür', 'wurde', 'von', 'ihm', 'geöffnet'],
        translation: 'Дверь была открыта им',
        hint: 'Passiv: werden + Partizip II',
        grammarFocus: 'Passive voice (Präteritum)'
    },
    {
        id: 'b1_7',
        level: 'B1',
        correctSentence: ['Wenn', 'ich', 'Zeit', 'hätte', ',', 'würde', 'ich', 'reisen'],
        translation: 'Если бы у меня было время, я бы путешествовал',
        hint: 'Irreale Bedingung',
        grammarFocus: 'Unreal conditional (Konjunktiv II)'
    },
    {
        id: 'b1_8',
        level: 'B1',
        correctSentence: ['Er', 'sagte', ',', 'dass', 'er', 'morgen', 'komme'],
        translation: 'Он сказал, что придёт завтра',
        hint: 'Indirekte Rede',
        grammarFocus: 'Indirect speech (Konjunktiv I)'
    },
    {
        id: 'b1_9',
        level: 'B1',
        correctSentence: ['Während', 'ich', 'arbeitete', ',', 'hörte', 'ich', 'Musik'],
        translation: 'Пока я работал, я слушал музыку',
        grammarFocus: 'Temporal clause with "während"'
    },
    {
        id: 'b1_10',
        level: 'B1',
        correctSentence: ['Die', 'Aufgabe', 'muss', 'bis', 'morgen', 'erledigt', 'werden'],
        translation: 'Задание должно быть выполнено до завтра',
        hint: 'Passiv mit Modalverb',
        grammarFocus: 'Passive with modal verb'
    },
    {
        id: 'b1_11',
        level: 'B1',
        correctSentence: ['Falls', 'es', 'regnet', ',', 'bleiben', 'wir', 'zu', 'Hause'],
        translation: 'В случае дождя мы останемся дома',
        grammarFocus: 'Conditional clause with "falls"'
    },
    {
        id: 'b1_12',
        level: 'B1',
        correctSentence: ['Der', 'Film', ',', 'den', 'wir', 'gesehen', 'haben', ',', 'war', 'toll'],
        translation: 'Фильм, который мы посмотрели, был отличным',
        grammarFocus: 'Relative clause (Akkusativ)'
    },
    {
        id: 'b1_13',
        level: 'B1',
        correctSentence: ['Ich', 'würde', 'dir', 'helfen', ',', 'wenn', 'ich', 'könnte'],
        translation: 'Я бы тебе помог, если бы мог',
        grammarFocus: 'Conditional with Konjunktiv II'
    },
    {
        id: 'b1_14',
        level: 'B1',
        correctSentence: ['Bevor', 'ich', 'ausgehe', ',', 'muss', 'ich', 'aufräumen'],
        translation: 'Прежде чем выйти, я должен убраться',
        hint: 'Temporal clause with "bevor"',
        grammarFocus: 'Subordinate clause with "bevor"'
    },
    {
        id: 'b1_15',
        level: 'B1',
        correctSentence: ['Das', 'Haus', 'wird', 'gerade', 'renoviert'],
        translation: 'Дом сейчас ремонтируется',
        grammarFocus: 'Passive voice (Präsens)'
    },
    {
        id: 'b1_16',
        level: 'B1',
        correctSentence: ['Ich', 'weiß', 'nicht', ',', 'ob', 'er', 'kommt'],
        translation: 'Я не знаю, придёт ли он',
        hint: 'Indirekte Frage',
        grammarFocus: 'Indirect question with "ob"'
    },
    {
        id: 'b1_17',
        level: 'B1',
        correctSentence: ['Seitdem', 'ich', 'hier', 'wohne', ',', 'fühle', 'ich', 'mich', 'wohl'],
        translation: 'С тех пор как я здесь живу, я чувствую себя хорошо',
        grammarFocus: 'Temporal clause with "seitdem"'
    },
    {
        id: 'b1_18',
        level: 'B1',
        correctSentence: ['Je', 'älter', 'man', 'wird', ',', 'desto', 'weiser', 'wird', 'man'],
        translation: 'Чем старше становишься, тем мудрее становишься',
        grammarFocus: 'Je...desto construction'
    },
    {
        id: 'b1_19',
        level: 'B1',
        correctSentence: ['Damit', 'ich', 'pünktlich', 'bin', ',', 'stehe', 'ich', 'früh', 'auf'],
        translation: 'Чтобы быть вовремя, я встаю рано',
        hint: 'Final clause with "damit"',
        grammarFocus: 'Purpose clause with "damit"'
    },
    {
        id: 'b1_20',
        level: 'B1',
        correctSentence: ['Er', 'tut', 'so', ',', 'als', 'ob', 'er', 'nichts', 'wüsste'],
        translation: 'Он делает вид, будто ничего не знает',
        grammarFocus: 'Als ob + Konjunktiv II'
    },
    {
        id: 'b1_21',
        level: 'B1',
        correctSentence: ['Die', 'Frau', ',', 'deren', 'Auto', 'gestohlen', 'wurde', ',', 'war', 'verzweifelt'],
        translation: 'Женщина, чью машину украли, была в отчаянии',
        hint: 'Relativpronomen "deren"',
        grammarFocus: 'Relative pronoun "deren" (genitive)'
    },
    {
        id: 'b1_22',
        level: 'B1',
        correctSentence: ['Wäre', 'ich', 'reich', ',', 'würde', 'ich', 'ein', 'Haus', 'kaufen'],
        translation: 'Если бы я был богат, я бы купил дом',
        grammarFocus: 'Unreal condition (inverted)'
    },
    {
        id: 'b1_23',
        level: 'B1',
        correctSentence: ['Es', 'ist', 'wichtig', ',', 'dass', 'wir', 'zusammenarbeiten'],
        translation: 'Важно, чтобы мы работали вместе',
        grammarFocus: 'Dass-clause after adjective'
    },
    {
        id: 'b1_24',
        level: 'B1',
        correctSentence: ['Ohne', 'zu', 'überlegen', ',', 'sagte', 'er', 'ja'],
        translation: 'Не подумав, он сказал да',
        hint: 'Infinitiv mit zu',
        grammarFocus: 'Infinitive with "ohne...zu"'
    },
    {
        id: 'b1_25',
        level: 'B1',
        correctSentence: ['Die', 'Arbeit', 'ist', 'schwerer', ',', 'als', 'ich', 'dachte'],
        translation: 'Работа тяжелее, чем я думал',
        grammarFocus: 'Comparative + als-clause'
    },

    // ========== B2 Level (Upper Intermediate) - 30 exercises ==========
    {
        id: 'b2_1',
        level: 'B2',
        correctSentence: ['Hätte', 'ich', 'mehr', 'Zeit', 'gehabt', ',', 'wäre', 'ich', 'gekommen'],
        translation: 'Если бы у меня было больше времени, я бы пришел',
        hint: 'Konjunktiv II Vergangenheit',
        grammarFocus: 'Konjunktiv II past (irrealis)'
    },
    {
        id: 'b2_2',
        level: 'B2',
        correctSentence: ['Statt', 'zu', 'arbeiten', ',', 'hat', 'er', 'den', 'ganzen', 'Tag', 'geschlafen'],
        translation: 'Вместо того чтобы работать, он проспал весь день',
        hint: 'statt... zu + Infinitiv',
        grammarFocus: 'Infinitive construction with "statt...zu"'
    },
    {
        id: 'b2_3',
        level: 'B2',
        correctSentence: ['Es', 'ist', 'wichtig', ',', 'dass', 'du', 'pünktlich', 'kommst'],
        translation: 'Важно, чтобы ты пришел вовремя',
        hint: 'dass-Satz: verb at the end',
        grammarFocus: 'Subjunctive with "dass"'
    },
    {
        id: 'b2_4',
        level: 'B2',
        correctSentence: ['Angenommen', ',', 'du', 'hättest', 'Recht', ',', 'was', 'würdest', 'du', 'tun', '?'],
        translation: 'Предположим, ты был бы прав, что бы ты сделал?',
        hint: 'Konjunktiv II + conditional question',
        grammarFocus: 'Complex conditional with "angenommen"'
    },
    {
        id: 'b2_5',
        level: 'B2',
        correctSentence: ['Trotz', 'des', 'schlechten', 'Wetters', 'gingen', 'wir', 'wandern'],
        translation: 'Несмотря на плохую погоду, мы пошли в поход',
        hint: 'trotz + Genitiv',
        grammarFocus: 'Preposition "trotz" + Genitiv'
    },
    {
        id: 'b2_6',
        level: 'B2',
        correctSentence: ['Der', 'von', 'mir', 'empfohlene', 'Film', 'hat', 'einen', 'Oscar', 'gewonnen'],
        translation: 'Рекомендованный мной фильм получил Оскар',
        hint: 'Partizip II as adjective',
        grammarFocus: 'Extended adjective construction (Partizip II)'
    },
    {
        id: 'b2_7',
        level: 'B2',
        correctSentence: ['Anstatt', 'dass', 'er', 'hilft', ',', 'kritisiert', 'er', 'nur'],
        translation: 'Вместо того чтобы помогать, он только критикует',
        grammarFocus: 'Anstatt dass-clause'
    },
    {
        id: 'b2_8',
        level: 'B2',
        correctSentence: ['Um', 'erfolgreich', 'zu', 'sein', ',', 'muss', 'man', 'hart', 'arbeiten'],
        translation: 'Чтобы быть успешным, нужно усердно работать',
        hint: 'um...zu + Infinitiv',
        grammarFocus: 'Purpose infinitive with "um...zu"'
    },
    {
        id: 'b2_9',
        level: 'B2',
        correctSentence: ['Indem', 'er', 'fleißig', 'lernte', ',', 'bestand', 'er', 'die', 'Prüfung'],
        translation: 'Усердно учась, он сдал экзамен',
        grammarFocus: 'Modal clause with "indem"'
    },
    {
        id: 'b2_10',
        level: 'B2',
        correctSentence: ['Aufgrund', 'der', 'Verzögerung', 'verpassten', 'wir', 'den', 'Zug'],
        translation: 'Из-за задержки мы пропустили поезд',
        hint: 'aufgrund + Genitiv',
        grammarFocus: 'Preposition "aufgrund" + Genitiv'
    },
    {
        id: 'b2_11',
        level: 'B2',
        correctSentence: ['Die', 'in', 'Paris', 'lebende', 'Künstlerin', 'ist', 'sehr', 'bekannt'],
        translation: 'Живущая в Париже художница очень известна',
        hint: 'Partizip I as adjective',
        grammarFocus: 'Extended adjective (Partizip I)'
    },
    {
        id: 'b2_12',
        level: 'B2',
        correctSentence: ['Vorausgesetzt', ',', 'dass', 'das', 'Wetter', 'gut', 'ist', ',', 'fahren', 'wir'],
        translation: 'При условии, что будет хорошая погода, мы поедем',
        grammarFocus: 'Conditional with "vorausgesetzt, dass"'
    },
    {
        id: 'b2_13',
        level: 'B2',
        correctSentence: ['Sowohl', 'Deutschland', 'als', 'auch', 'Österreich', 'sprechen', 'Deutsch'],
        translation: 'Как Германия, так и Австрия говорят на немецком',
        grammarFocus: 'Conjunction "sowohl...als auch"'
    },
    {
        id: 'b2_14',
        level: 'B2',
        correctSentence: ['Abgesehen', 'davon', ',', 'dass', 'es', 'teuer', 'ist', ',', 'gefällt', 'es', 'mir'],
        translation: 'Помимо того, что это дорого, мне нравится',
        grammarFocus: 'Prepositional phrase "abgesehen davon"'
    },
    {
        id: 'b2_15',
        level: 'B2',
        correctSentence: ['Er', 'verhält', 'sich', ',', 'als', 'wäre', 'nichts', 'geschehen'],
        translation: 'Он ведёт себя, как будто ничего не случилось',
        grammarFocus: 'Als + Konjunktiv II (past)'
    },
    {
        id: 'b2_16',
        level: 'B2',
        correctSentence: ['Ungeachtet', 'der', 'Kritik', 'setzte', 'sie', 'ihr', 'Projekt', 'fort'],
        translation: 'Невзирая на критику, она продолжила свой проект',
        hint: 'ungeachtet + Genitiv',
        grammarFocus: 'Preposition "ungeachtet" + Genitiv'
    },
    {
        id: 'b2_17',
        level: 'B2',
        correctSentence: ['Der', 'Lehrer', 'besteht', 'darauf', ',', 'dass', 'wir', 'pünktlich', 'sind'],
        translation: 'Учитель настаивает на том, чтобы мы были пунктуальны',
        grammarFocus: 'Verb + darauf + dass-clause'
    },
    {
        id: 'b2_18',
        level: 'B2',
        correctSentence: ['Weder', 'hat', 'er', 'angerufen', ',', 'noch', 'ist', 'er', 'gekommen'],
        translation: 'Он ни позвонил, ни пришёл',
        hint: 'weder...noch mit Inversion',
        grammarFocus: 'Conjunction "weder...noch" with inversion'
    },
    {
        id: 'b2_19',
        level: 'B2',
        correctSentence: ['Angesichts', 'der', 'Situation', 'müssen', 'wir', 'handeln'],
        translation: 'Ввиду ситуации мы должны действовать',
        grammarFocus: 'Preposition "angesichts" + Genitiv'
    },
    {
        id: 'b2_20',
        level: 'B2',
        correctSentence: ['Je', 'nachdem', ',', 'wie', 'viel', 'Zeit', 'wir', 'haben', ',', 'entscheiden', 'wir'],
        translation: 'В зависимости от того, сколько у нас времени, мы решаем',
        grammarFocus: 'Je nachdem + question word'
    },
    {
        id: 'b2_21',
        level: 'B2',
        correctSentence: ['Zugunsten', 'der', 'Umwelt', 'sollten', 'wir', 'weniger', 'Auto', 'fahren'],
        translation: 'В пользу окружающей среды мы должны меньше ездить на машине',
        grammarFocus: 'Preposition "zugunsten" + Genitiv'
    },
    {
        id: 'b2_22',
        level: 'B2',
        correctSentence: ['Insofern', 'Sie', 'einverstanden', 'sind', ',', 'können', 'wir', 'beginnen'],
        translation: 'Поскольку вы согласны, мы можем начинать',
        grammarFocus: 'Subordinate conjunction "insofern"'
    },
    {
        id: 'b2_23',
        level: 'B2',
        correctSentence: ['Das', 'Problem', 'besteht', 'darin', ',', 'dass', 'niemand', 'hilft'],
        translation: 'Проблема в том, что никто не помогает',
        grammarFocus: 'Bestehen + darin + dass-clause'
    },
    {
        id: 'b2_24',
        level: 'B2',
        correctSentence: ['Laut', 'des', 'Berichts', 'steigen', 'die', 'Temperaturen'],
        translation: 'Согласно докладу, температуры растут',
        hint: 'laut + Genitiv',
        grammarFocus: 'Preposition "laut" + Genitiv'
    },
    {
        id: 'b2_25',
        level: 'B2',
        correctSentence: ['Nicht', 'nur', 'sprach', 'er', 'Deutsch', ',', 'sondern', 'auch', 'Französisch'],
        translation: 'Он говорил не только на немецком, но и на французском',
        hint: 'nicht nur...sondern auch',
        grammarFocus: 'Conjunction with inversion'
    },
    {
        id: 'b2_26',
        level: 'B2',
        correctSentence: ['Unter', 'der', 'Voraussetzung', ',', 'dass', 'alle', 'zustimmen', ',', 'können', 'wir', 'starten'],
        translation: 'При условии, что все согласятся, мы можем начать',
        grammarFocus: 'Complex conditional phrase'
    },
    {
        id: 'b2_27',
        level: 'B2',
        correctSentence: ['Der', 'zu', 'reparierende', 'Motor', 'wurde', 'ausgebaut'],
        translation: 'Мотор, который нужно отремонтировать, был демонтирован',
        hint: 'zu + Partizip I',
        grammarFocus: 'Future participle (zu + Partizip I)'
    },
    {
        id: 'b2_28',
        level: 'B2',
        correctSentence: ['Infolge', 'des', 'Unfalls', 'musste', 'die', 'Straße', 'gesperrt', 'werden'],
        translation: 'Вследствие аварии пришлось перекрыть дорогу',
        grammarFocus: 'Preposition "infolge" + Genitiv'
    },
    {
        id: 'b2_29',
        level: 'B2',
        correctSentence: ['Abgesehen', 'von', 'kleinen', 'Fehlern', 'war', 'die', 'Präsentation', 'gut'],
        translation: 'Не считая маленьких ошибок, презентация была хорошей',
        hint: 'abgesehen von + Dativ',
        grammarFocus: 'Prepositional phrase "abgesehen von"'
    },
    {
        id: 'b2_30',
        level: 'B2',
        correctSentence: ['Es', 'sei', 'denn', ',', 'es', 'gibt', 'Probleme', ',', 'treffen', 'wir', 'uns'],
        translation: 'Если не будет проблем, мы встретимся',
        hint: 'es sei denn',
        grammarFocus: 'Exception clause "es sei denn"'
    },
];

// Helper function to get exercises by level
export const getExercisesByLevel = (level: 'A1' | 'A2' | 'B1' | 'B2'): SentenceExercise[] => {
    return sentenceExercises.filter(ex => ex.level === level);
};

// Helper function to scramble words
export const scrambleWords = (sentence: string[]): string[] => {
    return [...sentence].sort(() => Math.random() - 0.5);
};
