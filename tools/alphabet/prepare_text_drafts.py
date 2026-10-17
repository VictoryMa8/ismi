#!/usr/bin/env python3
"""Rebuild private AI-authored text-only candidates. No approval, network or DB writes."""
import copy
import hashlib
import json
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'content/alphabet/text-only'
OUT.mkdir(parents=True, exist_ok=True)
PENDING = 'AI-authored draft; exact text, teaching guidance and rights disposition await human acceptance.'

def clip(text=''):
    return dict(url='', transcript=text, speaker='', variety='', reviewer='', reviewEvidence='', rightsEvidence='', humanRecording=False, offlineCleared=False)

def source(id, citation, locator):
    return dict(id=id, citation=citation, locator=locator, version='2026-10-17', rightsEvidence=PENDING,
                textCleared=False, adaptationCleared=False, offlineCleared=False)

# Original candidate words/glosses, not excerpts from a dictionary or scripture.
# Both word choice and linguistic explanations require exact human acceptance.
AR = '''ا|alif|A vowel carrier; hamza and long aa have different roles.|اسم:name|باب:door
ب|baa|The b sound, with one dot below.|باب:door|بيت:home
ت|taa|The t sound, with two dots above.|تمر:dates|بنت:girl
ث|thaa|The th sound in careful reading; conversational realizations vary.|ثوب:garment|ثلاثة:three
ج|jiim|A consonant whose realization depends on the course variety.|جبل:mountain|جار:neighbor
ح|haa (ح)|A voiceless pharyngeal sound; distinguish it from ه and خ.|حب:love|ملح:salt
خ|khaa|A voiceless back fricative; distinguish it from ح.|خبز:bread|أخ:brother
د|daal|The d sound; this letter does not join the following letter.|دار:house|يد:hand
ذ|dhaal|The voiced th sound in careful reading; conversational realizations vary.|ذهب:gold|ذرة:corn
ر|raa|A tapped or trilled r; it does not join the following letter.|رأس:head|برد:cold
ز|zaay|The z sound; it does not join the following letter.|زيت:oil|موز:bananas
س|siin|The s sound; compare its dots with ش.|سمك:fish|درس:lesson
ش|shiin|The sh sound, with three dots above.|شاي:tea|شمس:sun
ص|saad|An emphatic s; distinguish it from س.|صوت:voice|بصل:onions
ض|daad|An emphatic d; distinguish it from د.|ضيف:guest|بيض:eggs
ط|taa (ط)|An emphatic t; distinguish it from ت.|طعام:food|مطر:rain
ظ|dhaa (ظ)|An emphatic voiced dental sound in careful reading; dialect realizations vary.|ظل:shade|نظيف:clean
ع|ayn|A voiced pharyngeal consonant; it is not a vowel.|عين:eye|مع:with
غ|ghayn|A voiced back fricative; distinguish it from ع and خ.|غرفة:room|صغير:small
ف|faa|The f sound, with one dot above.|فم:mouth|رفيق:companion
ق|qaaf|A back stop in careful reading; Palestinian conversation may use a glottal stop.|قلب:heart|وقت:time
ك|kaaf|The k sound; distinguish it from ق.|كتاب:book|سمك:fish
ل|laam|The l sound; joining with alif can form a connected lam-alif shape.|ليل:night|ملح:salt
م|miim|The m sound; its shape changes in connected writing.|ماء:water|أم:mother
ن|nuun|The n sound, with one dot above.|نار:fire|بنت:girl
ه|haa (ه)|The h sound; distinguish it from ح and final ة.|هو:he|وجه:face
و|waaw|Can represent w or a long vowel; determine its role from the word.|ورد:roses|يوم:day
ي|yaa|Can represent y or a long vowel; distinguish final ي from ى.|يد:hand|بيت:home'''
AR_SUPPORT = [
 ('ء','hamza','ماء','water','A glottal stop; hamza may stand alone or use a carrier.'),
 ('أ','alif with hamza above','أب','father','Preserve the hamza above its carrier.'),
 ('إ','alif with hamza below','إبرة','needle','Preserve the hamza below its carrier.'),
 ('آ','alif with madda','آخر','other','The madda is part of the written form.'),
 ('ؤ','hamza on waaw','سؤال','question','This carrier does not make the hamza a w sound.'),
 ('ئ','hamza on yaa carrier','بئر','well','The carrier and hamza belong to one written cluster.'),
 ('ة','taa marbuuta','قهوة','coffee','Word-final ending; realization depends on grammatical and spoken context.'),
 ('ى','alif maqsura','على','on','An alif-like vowel spelling; not final dotted yaa.'),
 ('َ','fatha','بَ','Practice syllable: ba','A short-vowel mark above the base; this demonstration is not a word.'),
 ('ِ','kasra','بِ','Practice syllable: bi','A short-vowel mark below the base; this demonstration is not a word.'),
 ('ُ','damma','بُ','Practice syllable: bu','A short-vowel mark above the base; this demonstration is not a word.'),
 ('ْ','sukuun','بْ','Consonant demonstration','Marks absence of a short vowel here; not a pronounceable isolated word.'),
 ('ّ','shadda','أمّ','mother','Marks a doubled consonant; preserve the base and mark as a cluster.'),
 ('ً','fathatan','كتابًا','a book (accusative indefinite)','A reading/grammar support example; not everyday Palestinian conversation.'),
 ('ٍ','kasratan','كتابٍ','a book (genitive indefinite)','A reading/grammar support example; not everyday Palestinian conversation.'),
 ('ٌ','dammatan','كتابٌ','a book (nominative indefinite)','A reading/grammar support example; not everyday Palestinian conversation.'),
 ('لا','laam-alif','لا','no','Two letters joining; a shaping combination, not an additional basic letter.')]

FR = '''A|a|ami:friend|avec:with|a has different values in words; its name is not a rule for every spelling.
B|bé|bonjour:hello|bébé:baby|Usually represents /b/.
C|cé|café:coffee|cinéma:cinema|c is usually /k/ before a, o, u and /s/ before e, i, y.
D|dé|demain:tomorrow|dîner:dinner|Usually /d/; some word-final d letters are silent.
E|e|merci:thank you|petit:small|e can be silent or have different vowel values; accents matter.
F|effe|famille:family|café:coffee|Usually /f/.
G|gé|gare:station|gilet:vest|g usually differs before a, o, u and e, i, y.
H|ache|heure:hour|haricot:bean|h is not pronounced as English h; h muet and h aspiré affect linking.
I|i|ici:here|ami:friend|Often /i/; combinations can have other values.
J|ji|jour:day|jardin:garden|Usually /ʒ/, as in the middle of English measure.
K|ka|kilo:kilogram|kiwi:kiwi|Usually /k/; frequent in borrowed words.
L|elle|lait:milk|lune:moon|Usually /l/; combinations such as ill need separate attention.
M|emme|maison:house|maman:mom|Can represent /m/ or contribute to a nasal-vowel spelling.
N|enne|nous:we|nuit:night|Can represent /n/ or contribute to a nasal-vowel spelling.
O|o|mot:word|porte:door|o has open and closed values depending on the word and variety.
P|pé|papa:dad|repas:meal|Usually /p/; some final p letters are silent.
Q|ku|qui:who|quatre:four|qu usually represents /k/ in these examples.
R|erre|rue:street|rire:laugh|A French r; its production differs from English r.
S|esse|salut:hi|maison:house|s can be /s/ or /z/; many word-final s letters are silent.
T|té|table:table|petit:small|Usually /t/; many final t letters are silent.
U|u|tu:you (singular)|rue:street|French /y/ differs from both English oo and French ou.
V|vé|vous:you|avec:with|Usually /v/.
W|double vé|wagon:railway carriage|week-end:weekend|Borrowings vary: wagon and week-end do not begin with the same sound.
X|iks|taxi:taxi|examen:exam|x can represent different consonant combinations or be silent.
Y|i grec|yaourt:yogurt|stylo:pen|Can represent a consonant-like glide or the vowel /i/.
Z|zède|zéro:zero|zone:zone|Usually /z/.'''
FR_SUPPORT = [
 ('à','a with grave accent','à','to / at','The accent distinguishes the word and is retained on capitals.'),
 ('â','a with circumflex','pâte','pasta / dough','Vowel realization varies; retain the circumflex in this spelling.'),
 ('æ','a-e ligature','ex æquo','tied (same rank)','A ligature used in a small set of learned expressions; extended support.'),
 ('ç','c with cedilla','ça','that','The cedilla gives c its /s/ value before a, o or u.'),
 ('é','e with acute accent','café','coffee','Usually the closed /e/ vowel.'),
 ('è','e with grave accent','mère','mother','Usually the open /ɛ/ vowel.'),
 ('ê','e with circumflex','fête','celebration','Retain the circumflex; this is not the letter name e.'),
 ('ë','e with diaeresis','Noël','Christmas','The diaeresis signals separate vowel treatment here.'),
 ('î','i with circumflex','île','island','Retain the authored spelling.'),
 ('ï','i with diaeresis','naïf','naive','The vowels are pronounced separately here.'),
 ('ô','o with circumflex','hôtel','hotel','Usually a closed o in this word.'),
 ('œ','o-e ligature','sœur','sister','Keep œ as authored; its sound depends on the word.'),
 ('ù','u with grave accent','où','where','Distinguishes où from ou; the accent does not supply a new letter name.'),
 ('û','u with circumflex','sûr','sure','Preserve the accent in this spelling.'),
 ('ü','u with diaeresis','aigüe','acute / sharp (feminine)','Marks separate vowel treatment; spelling variants require review.'),
 ('ÿ','y with diaeresis','L’Haÿ-les-Roses','French place name','Rare proper-name spelling; extended support, not everyday core vocabulary.'),
 ('ch','c-h combination','chat','cat','Usually /ʃ/ in this word; exceptions exist.'),
 ('ou','o-u combination','vous','you','Usually /u/; distinguish it from French u.'),
 ('oi','o-i combination','moi','me','Usually /wa/ in this word.'),
 ('ai','a-i combination','maison','house','Often /ɛ/; context and word matter.'),
 ('au','a-u combination','chaud','hot','Usually /o/ in this word.'),
 ('eau','e-a-u combination','eau','water','Three letters represent one vowel here.'),
 ('on','o-n combination','bonjour','hello','A nasal vowel here; n is not a separate consonant in this syllable.'),
 ('an','a-n combination','maman','mom','A nasal vowel here; the final n is not separately pronounced.'),
 ('in','i-n combination','matin','morning','A nasal-vowel spelling in this word.'),
 ('un','u-n combination','un','one / a','Nasal-vowel realizations vary across speakers.'),
 ('gn','g-n combination','montagne','mountain','Usually /ɲ/ in this word.'),
 ('ill','i-l-l combination','famille','family','Represents a glide here; ville has a different pattern.'),
 ('ph','p-h combination','photo','photo','Usually /f/.'),
 ('qu','q-u combination','qui','who','Represents /k/ here, not an extra vowel.'),
 ('s','final silent s','repas','meal','The final s is silent in isolation; linking is context-dependent.'),
 ('t','final silent t','petit','small','The final t is silent in isolation; liaison depends on context.')]

KH = '''ក|ka|a|កូន:child|កាហ្វេ:coffee
ខ|kha|a|ខ្មែរ:Khmer|ខ្ញុំ:I
គ|ko|o|គាត់:he / she (respectful)|គ្រូ:teacher
ឃ|kho|o|ឃើញ:see|ឃ្លាន:hungry
ង|ngo|o|ងាយ:easy|ល្ងាច:evening
ច|cha|a|ចង់:want|ចាន:plate
ឆ|chha|a|ឆ្ងាញ់:delicious|ឆ្មា:cat
ជ|cho|o|ជា:be / as|ជួប:meet
ឈ|chho|o|ឈ្មោះ:name|ឈឺ:hurt / ill
ញ|nyo|o|ញ៉ាំ:eat|ខ្ញុំ:I
ដ|da|a|ដៃ:hand|ដើរ:walk
ឋ|tha|a|ឋាន:place / rank (formal)|អធិដ្ឋាន:pray (formal)
ឌ|do|o|បណ្ឌិត:doctor / scholar (title)|មណ្ឌល:center
ឍ|tho|o|អភិវឌ្ឍន៍:development (formal)|វឌ្ឍនភាព:progress (formal)
ណ|na|a|ណា:which / where|អរគុណ:thank you
ត|ta|a|តែ:tea / but|ត្រី:fish
ថ|tha|a|ថ្ងៃ:day|ថ្មី:new
ទ|to|o|ទឹក:water|ទៅ:go
ធ|tho|o|ធំ:big|ធ្វើ:do / make
ន|no|o|នេះ:this|នោះ:that
ប|ba|a|បាយ:cooked rice / meal|បង:older sibling / familiar address
ផ|pha|a|ផ្ទះ:house|ផ្លូវ:road
ព|po|o|ពេល:time|ពីរ:two
ភ|pho|o|ភាសា:language|ភ្ញៀវ:guest
ម|mo|o|ម្តាយ:mother|មិត្ត:friend
យ|yo|o|យើង:we|យប់:night
រ|ro|o|រៀន:learn|រស់:live
ល|lo|o|ល្អ:good|លុយ:money
វ|vo|o|វា:it|វិញ:back / again
ស|sa|a|សួស្តី:hello|សុខ:well-being
ហ|ha|a|ហើយ:already / and then|ហាង:shop
ឡ|la|a|ឡាន:car|ឡើង:go up
អ|a|a|អ្នក:you / person|អរគុណ:thank you'''

# Grapheme targets are finalized by the .NET check: never mark a combining base
# alone. The broad cluster candidate is reduced to exact .NET text elements below.
def preliminary_target(text, needle):
    start = text.index(needle)
    # Extend over Khmer/Arabic marks. Khmer coeng + next consonant is one cluster.
    left = start
    while left and (unicodedata.category(text[left]).startswith('M') or text[left-1] == '\u17d2'):
        left -= 1
    end = start + len(needle)
    while end < len(text):
        if unicodedata.category(text[end]).startswith('M') or text[end-1] == '\u17d2':
            end += 1
        else:
            break
    return text[left:end]


def make(course, variety, help_convention):
    script = 'arabic' if course in ['levantine','msa','quranic'] else 'latin' if course=='french' else 'khmer'
    return dict(id=course+'-alphabet', courseId=course, title='Alphabet — unreviewed text-only draft',
        variety=variety, helpConvention=help_convention, textOnly=True,
        inventory=dict(id=script+'-text-draft', version=1, basicEntryIds=[], entries=[], reviewer='', reviewEvidence=''),
        entries=[], sources=[source('draft-authoring','Ismi original AI-assisted candidate text; no external lexical acceptance claimed','repo:content/alphabet/text-only/README.md')],
        reviewer='', reviewEvidence='', engineeringFixture=False,
        fonts=[dict(url='/fonts/NotoSansKhmer.ttf',hash='f37a8431a0c5d5ed2f81a767417546aca576a81fb7eff9c924d46aecf828f2ca')] if course=='khmer' else [])


def add(pack, text, name, sound, examples, category='basic', help='', forms=None, id=None):
    id = id or 'u'+'-'.join(f'{ord(c):04x}' for c in text)
    inv = pack['inventory']
    if category == 'basic': inv['basicEntryIds'].append(id)
    inv['entries'].append(dict(id=id, category=category, text=text, forms=forms or [dict(label='Written form', text=text, note='Exact draft form; human acceptance pending.')]))
    words=[]
    for i, (word, meaning) in enumerate(examples):
        target=preliminary_target(word,text)
        offsets=[n for n in range(len(word)-len(target)+1) if word[n:n+len(target)]==target]
        # All current draft text is BMP: Python offsets equal UTF-16 offsets.
        words.append(dict(id=id+'-word-'+str(i+1), text=word, meaning=meaning, help='', target=target, occurrences=offsets,
            note=('Read this as an ordinary script-support example, not a Quran quotation or interpretation. ' if pack['courseId']=='quranic' else '')+
            'The marked text includes its attached signs where needed. '+PENDING, sourceIds=['draft-authoring'], audio=clip(word)))
    if pack['courseId'] in ['levantine','msa','quranic']:
        inv['entries'][-1]['forms'] += [dict(label='Word context '+str(n+1),text=w['text'],note='Whole-word context; target '+w['target']+'. '+PENDING) for n,w in enumerate(words)]
    entry=dict(id=id, name=name, help=help, note=PENDING, soundContext=sound, sourceIds=['draft-authoring'],
        nameAudio=clip(name), soundAudio=clip(), examples=words, activities=[])
    pack['entries'].append(entry)


def finish(pack):
    # Deterministic candidates, not random distractors; each choice/rationale stays
    # in the authored pack for human review before any publication.
    for n, (s,e) in enumerate(zip(pack['inventory']['entries'],pack['entries'])):
        other=next(x for x in pack['inventory']['entries'][n+1:]+pack['inventory']['entries'][:n] if x['text']!=s['text'])
        e['activities'].append(dict(id=e['id']+'-shape',kind='shape',prompt='Choose the written form for '+e['name']+'.',
            choices=[dict(id='match',text=s['text']),dict(id='other',text=other['text'])],acceptedIds=['match'],
            explanation='The requested draft entry is '+s['text']+'. Compare the complete form, including dots or signs.',
            rationale='Only the complete authored target matches this entry; the other choice is a different written form. This checks visual recognition only.', exampleId=None,audioUrl=None))
        w=e['examples'][0]
        distractor=next(x['text'] for x in pack['inventory']['entries'] if x['text'] not in w['text'] and x['text'] != w['target'])
        e['activities'].append(dict(id=e['id']+'-spot',kind='spot',prompt='Choose the complete marked cluster to find in this example for '+e['name']+'.',
            choices=[dict(id='match',text=w['target']),dict(id='other',text=distractor)],acceptedIds=['match'],
            explanation='Find '+w['target']+' in '+w['text']+'. There '+('is one occurrence.' if len(w['occurrences'])==1 else 'are '+str(len(w['occurrences']))+' occurrences.'),
            rationale='The exact target occurs in the example; the other written form does not occur there. Attached signs stay with their base. This is a visual task, not sound assessment.', exampleId=w['id'],audioUrl=None))
    (OUT/(pack['courseId']+'.pack.json')).write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')


def word_pair(s): return tuple(s.split(':',1))

for course, variety in [('levantine','Urban Palestinian Levantine'),('msa','Modern Standard Arabic'),('quranic','Quranic course: ordinary Arabic decoding support; no canonical text')]:
    p=make(course,variety,'Draft English letter-name labels and short sound notes; Arabic script first. No assessed pronunciation.')
    original=json.loads((ROOT/'content/alphabet/drafts'/f'{course}.pack.json').read_text())
    for row, s in zip(AR.splitlines(), original['inventory']['entries']):
        c,name,sound,w1,w2=row.split('|')
        words=[word_pair(w1),word_pair(w2)]
        if course!='levantine' and c=='ر': words[0]=('رأس','head')
        if c=='ق' and course!='levantine': sound='The voiceless uvular stop /q/ in careful reading; do not substitute conversational glottal-stop guidance.'
        if c=='ج': sound='Common urban Palestinian /ʒ/ reference; regional realizations vary.' if course=='levantine' else 'Careful-reading /dʒ/ reference; do not inherit the conversational model.'
        if course=='levantine' and c in 'ثذظ': sound+=' These careful-reading examples are for script recognition; everyday Palestinian usage may replace the sound or word.'
        forms=copy.deepcopy(s['forms'])
        for f in forms: f['note']+=' See the exact whole-word examples for authentic contexts; positional acceptance is pending.'
        add(p,c,name,sound,words,forms=forms)
    for c,name,word,meaning,note in AR_SUPPORT:
        if c in 'ًٌٍ': category='formal-reading-support'
        else: category='reading-support'
        add(p,c,name,note,[(word,meaning)],category)
    finish(p)

p=make('french','Metropolitan French','Draft French letter names with English contextual notes; IPA only where given. Word-specific pronunciation remains unreviewed.')
for row in FR.splitlines():
    c,name,w1,w2,note=row.split('|')
    # Lowercase target links case pairs without changing stored word text.
    add(p,c.lower(),name,note,[word_pair(w1),word_pair(w2)],forms=[dict(label='Uppercase',text=c,note='Retain accents and authored case.'),dict(label='Lowercase',text=c.lower(),note='Case-pair demonstration.')])
for n,(c,name,word,meaning,note) in enumerate(FR_SUPPORT):
    add(p,c,name,note,[(word,meaning)],'spelling-support',id='support-'+str(n+1))
finish(p)

p=make('khmer','Contemporary Cambodian Khmer; Phnom Penh reference','Proposed a/o series with English sound context. Romanized labels are draft identifiers, not an accepted pronunciation convention; optional help, script first.')
for row in KH.splitlines():
    c,name,series,w1,w2=row.split('|')
    add(p,c,name,'Proposed '+series+'-series consonant. The vowel depends on its signs, cluster and word; this label is not a fixed word sound.',[word_pair(w1),word_pair(w2)],help=series+' series (draft)')
# Dependent signs are demonstrated with complete clusters on two registers.
for cp in range(0x17b6,0x17c6):
    c=chr(cp)
    add(p,c,unicodedata.name(c).replace('KHMER VOWEL SIGN ','').lower(),'Dependent vowel sign; its value depends on consonant register and context.',[(base+c,'Constructed '+label+'-series vowel demonstration; not a word') for base,label in [('ក','a'),('គ','o')]],'dependent-vowel',forms=[dict(label='a-series context',text='ក'+c,note='Constructed cluster, not vocabulary.'),dict(label='o-series context',text='គ'+c,note='Same sign, different register; no fixed pronunciation inferred.')])
for cp in range(0x17a5,0x17b4):
    c=chr(cp)
    note='Historical encoded ligature; obsolete, not modern beginner vocabulary.' if cp==0x17a8 else 'Independent-vowel support candidate; frequency, names and modern grouping need fluent acceptance.'
    add(p,c,unicodedata.name(c).replace('KHMER INDEPENDENT VOWEL ','').lower(),note,[(c,'Independent vowel demonstration; not a word')],'historical-reference' if cp==0x17a8 else 'independent-vowel-extended')
for c,name,word,meaning in [('ំ','nikahit','ដំ','pound'),('ះ','reahmuk','នេះ','this'),('ៈ','yuukaleapintu','កៈ','Constructed sign demonstration; not a word'),('៉','muusikatoan','ញ៉ាំ','eat'),('៊','triisap','ស៊ុប','soup'),('់','bantoc','ចង់','want'),('៌','robat','ពណ៌','color'),('៍','toandakhiat','អភិវឌ្ឍន៍','development'),('ុំ','composite om','ខ្ញុំ','I'),('ាំ','composite aam','ញ៉ាំ','eat')]:
    add(p,c,name,'Contextual sign or composite-vowel support; preserve base and all attached marks.',[(word,meaning)],'sign-support')
for text,name,word,meaning in [('្រ','coeng ro','គ្រូ','teacher'),('្ម','coeng mo','ខ្មែរ','Khmer'),('្ញ','coeng nyo','ខ្ញុំ','I'),('្ល','coeng lo','ផ្លូវ','road'),('្ន','coeng no','អ្នក','you / person'),('្ត','coeng ta','ម្តាយ','mother'),('្ទ','coeng to','ផ្ទះ','house'),('្ង','coeng ngo','ល្ងាច','evening')]:
    add(p,text,name,'Subscript combination; coeng and following consonant remain together in context.',[(word,meaning)],'subscript-support',forms=[dict(label='Whole-word context',text=word,note='Locate the subscript within the intact word; no isolated sound claim.')])
finish(p)

summary=[]
for f in sorted(OUT.glob('*.pack.json')):
    p=json.loads(f.read_text())
    summary.append(dict(courseId=p['courseId'],file=f.name,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),basicEntries=len(p['inventory']['basicEntryIds']),supportEntries=len(p['entries'])-len(p['inventory']['basicEntryIds']),examples=sum(len(e['examples']) for e in p['entries']),activities=sum(len(e['activities']) for e in p['entries']),reviewed=False,published=False,humanRecordings=0))
(OUT/'manifest.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2))
