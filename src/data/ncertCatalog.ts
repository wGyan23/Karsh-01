import type {
  ChapterInfo,
  ClassLevel,
  EducationStage,
  OfficialResource,
  PlannerTask,
  QuizAttempt,
  QuizQuestion,
  StreamType,
  StudyNote,
  SubjectItem,
} from '../types/edugenius';

export const CLASS_LEVELS: ClassLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const STAGE_METADATA: Record<
  EducationStage,
  { label: string; labelHi: string; classes: ClassLevel[]; rangeLabel: string }
> = {
  primary: {
    label: 'Primary',
    labelHi: 'प्राथमिक',
    classes: [1, 2, 3, 4, 5],
    rangeLabel: 'Classes 1–5',
  },
  middle: {
    label: 'Middle',
    labelHi: 'माध्यमिक',
    classes: [6, 7, 8],
    rangeLabel: 'Classes 6–8',
  },
  secondary: {
    label: 'Secondary',
    labelHi: 'उच्च माध्यमिक',
    classes: [9, 10],
    rangeLabel: 'Classes 9–10',
  },
  senior_secondary: {
    label: 'Sr. Secondary',
    labelHi: 'वरिष्ठ माध्यमिक',
    classes: [11, 12],
    rangeLabel: 'Classes 11–12',
  },
};

export function getStageForClass(classLevel: ClassLevel): EducationStage {
  if (classLevel <= 5) return 'primary';
  if (classLevel <= 8) return 'middle';
  if (classLevel <= 10) return 'secondary';
  return 'senior_secondary';
}

function makeChapters(
  subjectSlug: string,
  bookTitle: string,
  items: Array<[string, string, string, string[]]>
): ChapterInfo[] {
  return items.map(([title, titleHi, summary, keyTopics], idx) => ({
    id: `${subjectSlug}-ch-${idx + 1}`,
    number: idx + 1,
    title,
    titleHi,
    bookTitle,
    summary,
    keyTopics,
    officialUrl: 'https://ncert.nic.in/textbook.php',
  }));
}

export function getSubjectsForClass(classLevel: ClassLevel, stream?: StreamType): SubjectItem[] {
  if (classLevel <= 2) {
    return [
      {
        id: `c${classLevel}-math`,
        name: 'Mathematics (Joyful Math)',
        nameHi: 'गणित (आनंदमय गणित)',
        category: 'core',
        bookName: `Joyful Mathematics Class ${classLevel}`,
        accentTone: 'indigo',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-math`, `Joyful Mathematics ${classLevel}`, [
          ['Shapes and Space', 'आकृतियाँ और स्थान', 'Visualizing basic 2D and 3D spatial relationships.', ['Shapes', 'Spatial sense', 'Sorting']],
          ['Numbers 1 to 99', '1 से 99 तक संख्याएँ', 'Counting, place value bundles, and number patterns.', ['Counting', 'Tens & Ones', 'Comparing']],
          ['Addition & Subtraction', 'जोड़ और घटाव', 'Everyday story problems using single and two-digit operations.', ['Number line', 'Word problems']],
          ['Measurement & Time', 'मापन और समय', 'Non-standard length, weight comparisons, and daily routines.', ['Length', 'Weight', 'Calendar']],
        ]),
      },
      {
        id: `c${classLevel}-english`,
        name: 'English (Mridang)',
        nameHi: 'अंग्रेज़ी (मृदंग)',
        category: 'language',
        bookName: `Mridang Class ${classLevel}`,
        accentTone: 'blue',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-english`, `Mridang ${classLevel}`, [
          ['My Family and Home', 'मेरा परिवार और घर', 'Foundational phonics, greetings, and picture reading.', ['Phonics', 'Vocabulary', 'Rhymes']],
          ['Life Around Us', 'हमारे आस-पास का जीवन', 'Short stories on nature, animals, and sharing.', ['Reading aloud', 'Comprehension']],
          ['Fun with Sounds', 'ध्वनियों के साथ खेल', 'Sight words, blends, and simple sentence formation.', ['Sight words', 'Writing']],
        ]),
      },
      {
        id: `c${classLevel}-hindi`,
        name: 'Hindi (Sarangi)',
        nameHi: 'हिन्दी (सारंगी)',
        category: 'language',
        bookName: `Sarangi Class ${classLevel}`,
        accentTone: 'violet',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-hindi`, `Sarangi ${classLevel}`, [
          ['परिवार और मित्र', 'परिवार और मित्र', 'वर्णमाला, स्वर-व्यंजन अभ्यास और सरल कविताएँ।', ['वर्णमाला', 'मात्राएँ']],
          ['प्रकृति और जीव-जंतु', 'प्रकृति और जीव-जंतु', 'बाल कहानियाँ और चित्र-कथा पठन।', ['कहानी वाचन', 'शब्द ज्ञान']],
          ['त्योहार और मेले', 'त्योहार और मेले', 'संवाद और रचनात्मक लेखन की शुरुआत।', ['संवाद', 'लेखन']],
        ]),
      },
    ];
  }

  if (classLevel <= 5) {
    return [
      {
        id: `c${classLevel}-math`,
        name: 'Mathematics',
        nameHi: 'गणित',
        category: 'core',
        bookName: `Math-Magic / Maths Mela Class ${classLevel}`,
        accentTone: 'indigo',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-math`, `Mathematics Class ${classLevel}`, [
          ['Large Numbers & Place Value', 'बड़ी संख्याएँ और स्थानीय मान', 'Reading, writing, and expanding multi-digit numbers.', ['Place value', 'Estimation']],
          ['Shapes and Angles', 'आकृतियाँ और कोण', 'Identifying right, acute, and obtuse angles in surroundings.', ['Angles', 'Symmetry']],
          ['Fractions and Parts', 'भिन्न और हिस्से', 'Equivalence, halves, quarters, and visual shading.', ['Fractions', 'Comparison']],
          ['Area and Perimeter', 'क्षेत्रफल और परिमाप', 'Measuring boundaries and square unit grids.', ['Grid area', 'Perimeter']],
          ['Patterns & Smart Charts', 'पैटर्न और चार्ट', 'Tally marks, bar diagrams, and number sequences.', ['Data handling', 'Patterns']],
        ]),
      },
      {
        id: `c${classLevel}-evs`,
        name: 'Environmental Studies (EVS)',
        nameHi: 'पर्यावरण अध्ययन',
        category: 'core',
        bookName: `Our Wondrous World / Looking Around ${classLevel}`,
        accentTone: 'cyan',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-evs`, `EVS Class ${classLevel}`, [
          ['Super Senses & Wildlife', 'सुपर सेंसेस और वन्यजीव', 'How animals navigate, communicate, and adapt.', ['Senses', 'Conservation']],
          ['Water and Community', 'जल और समुदाय', 'Traditional water harvesting, rivers, and conservation.', ['Stepwells', 'Water cycle']],
          ['From Tasting to Digesting', 'स्वाद से पाचन तक', 'Balanced nutrition, food preservation, and digestion.', ['Nutrition', 'Health']],
          ['Mapping Our Neighbourhood', 'हमारा परिवेश और मानचित्र', 'Reading directions, symbols, and local landmarks.', ['Directions', 'Symbols']],
        ]),
      },
      {
        id: `c${classLevel}-english`,
        name: 'English (Santoor)',
        nameHi: 'अंग्रेज़ी (संतूर)',
        category: 'language',
        bookName: `Santoor / Marigold Class ${classLevel}`,
        accentTone: 'blue',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-english`, `English Class ${classLevel}`, [
          ['Prose & Reading Comprehension', 'गद्य और पठन कौशल', 'Stories building empathy, curiosity, and inference.', ['Inference', 'Grammar']],
          ['Poetry & Expression', 'कविता और अभिव्यक्ति', 'Rhythm, imagery, and creative paragraph writing.', ['Rhyme', 'Composition']],
          ['Grammar in Context', 'व्यावहारिक व्याकरण', 'Nouns, tenses, punctuation, and sentence building.', ['Parts of speech', 'Tenses']],
        ]),
      },
      {
        id: `c${classLevel}-hindi`,
        name: 'Hindi (Veena / Rimjhim)',
        nameHi: 'हिन्दी (वीणा / रिमझिम)',
        category: 'language',
        bookName: `Veena / Rimjhim Class ${classLevel}`,
        accentTone: 'violet',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-hindi`, `Hindi Class ${classLevel}`, [
          ['लोककथाएँ और संस्कृति', 'लोककथाएँ और संस्कृति', 'भारतीय लोककथाओं के माध्यम से भाषा समृद्धि।', ['शब्दावली', 'मुहावरे']],
          ['कविता पाठ और भावार्थ', 'कविता पाठ और भावार्थ', 'प्रकृति और देशप्रेम से जुड़ी कविताएँ।', ['भावार्थ', 'लय']],
          ['व्याकरण और रचना', 'व्याकरण और रचना', 'संज्ञा, सर्वनाम, विशेषण और अनुच्छेद लेखन।', ['व्याकरण', 'लेखन']],
        ]),
      },
    ];
  }

  if (classLevel <= 8) {
    return [
      {
        id: `c${classLevel}-math`,
        name: 'Mathematics',
        nameHi: 'गणित',
        category: 'core',
        bookName: `Ganita Prakash / NCERT Mathematics ${classLevel}`,
        accentTone: 'indigo',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-math`, `Mathematics Class ${classLevel}`, [
          ['Rational Numbers & Integers', 'परिमेय संख्याएँ एवं पूर्णांक', 'Properties of number systems and number-line representation.', ['Closure', 'Distributive law']],
          ['Linear Equations in One Variable', 'एक चर वाले रैखिक समीकरण', 'Solving algebraic equations and real-world word models.', ['Balancing', 'Transposition']],
          ['Understanding Quadrilaterals', 'चतुर्भुजों को समझना', 'Angle sum properties of polygons, parallelograms, and rhombuses.', ['Polygons', 'Interior angles']],
          ['Mensuration & Surface Area', 'क्षेत्रमिति', 'Area of trapeziums, polygons, and volume of solids.', ['Surface area', 'Volume']],
          ['Exponents, Powers & Data', 'घातांक, घात एवं आँकड़ों का प्रबंधन', 'Laws of exponents, scientific notation, and probability.', ['Exponents', 'Pie charts']],
        ]),
      },
      {
        id: `c${classLevel}-science`,
        name: 'Science',
        nameHi: 'विज्ञान',
        category: 'core',
        bookName: `Curiosity / NCERT Science ${classLevel}`,
        accentTone: 'blue',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-science`, `Science Class ${classLevel}`, [
          ['Crop Production & Microorganisms', 'फसल उत्पादन एवं सूक्ष्मजीव', 'Agricultural practices, nitrogen cycle, and helpful microbes.', ['Nitrogen fixation', 'Preservation']],
          ['Force, Pressure & Friction', 'बल, दाब और घर्षण', 'Contact/non-contact forces, atmospheric pressure, and drag.', ['Newtons', 'Fluid friction']],
          ['Light & Reflection', 'प्रकाश और परावर्तन', 'Laws of reflection, human eye anatomy, and optical aids.', ['Plane mirror', 'Dispersion']],
          ['Chemical Effects of Electric Current', 'विद्युत धारा के रासायनिक प्रभाव', 'Conductivity of liquids and electroplating principles.', ['Electrolysis', 'LEDs']],
          ['Conservation of Plants & Animals', 'पौधों एवं जंतुओं का संरक्षण', 'Biodiversity, endemic species, and biosphere reserves.', ['Ecosystem', 'Red Data Book']],
        ]),
      },
      {
        id: `c${classLevel}-sst`,
        name: 'Social Science',
        nameHi: 'सामाजिक विज्ञान',
        category: 'core',
        bookName: `Exploring Society / Our Pasts & Resources ${classLevel}`,
        accentTone: 'violet',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-sst`, `Social Science Class ${classLevel}`, [
          ['Indian Heritage & Modern History', 'भारतीय विरासत और आधुनिक इतिहास', 'Regional kingdoms, colonial administration, and freedom movements.', ['Chronology', 'Primary sources']],
          ['Resources & Sustainable Land Use', 'संसाधन और सतत भूमि उपयोग', 'Soil, water, mineral resources, and agriculture patterns.', ['Conservation', 'Crop belts']],
          ['The Indian Constitution & Parliament', 'भारतीय संविधान और संसद', 'Fundamental rights, secularism, and parliamentary governance.', ['Constitution', 'Judiciary']],
        ]),
      },
      {
        id: `c${classLevel}-english`,
        name: 'English',
        nameHi: 'अंग्रेज़ी',
        category: 'language',
        bookName: `Poorvi / Honeydew Class ${classLevel}`,
        accentTone: 'cyan',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-english`, `English Class ${classLevel}`, [
          ['Prose Literary Analysis', 'गद्य साहित्य विश्लेषण', 'Narrative perspective, character motivation, and vocabulary.', ['Comprehension', 'Tone']],
          ['Poetry Appreciation', 'काव्य विश्लेषण', 'Metaphor, simile, personification, and theme.', ['Poetic devices', 'Rhyme']],
          ['Formal Writing & Grammar', 'औपचारिक लेखन और व्याकरण', 'Active/passive voice, reported speech, and notice writing.', ['Voice', 'Clauses']],
        ]),
      },
      {
        id: `c${classLevel}-hindi`,
        name: 'Hindi',
        nameHi: 'हिन्दी',
        category: 'language',
        bookName: `Malhar / Vasant Class ${classLevel}`,
        accentTone: 'indigo',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-hindi`, `Hindi Class ${classLevel}`, [
          ['गद्य खंड: निबंध व संस्मरण', 'गद्य खंड', 'साहित्यिक गद्य पाठ, आशय स्पष्टीकरण एवं प्रश्नोत्तर।', ['संधि', 'समास']],
          ['काव्य खंड: दोहे व कविताएँ', 'काव्य खंड', 'कबीर, सूरदास तथा आधुनिक कवियों की रचनाएँ।', ['अलंकार', 'छंद परिचय']],
        ]),
      },
    ];
  }

  if (classLevel <= 10) {
    return [
      {
        id: `c${classLevel}-math`,
        name: 'Mathematics',
        nameHi: 'गणित',
        category: 'core',
        bookName: `NCERT Mathematics Class ${classLevel}`,
        accentTone: 'indigo',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-math`, `Mathematics Class ${classLevel}`, [
          ['Real Numbers & Polynomials', 'वास्तविक संख्याएँ और बहुपद', 'Fundamental Theorem of Arithmetic, irrationality proofs, and zeroes of polynomials.', ['Euclid/Prime factorization', 'Factor theorem']],
          ['Quadratic Equations & AP', 'द्विघात समीकरण और समांतर श्रेढ़ी', 'Roots by discriminant, quadratic formula, and nth-term / sum of AP.', ['Discriminant', 'Arithmetic Progression']],
          ['Triangles & Coordinate Geometry', 'त्रिभुज और निर्देशांक ज्यामिति', 'BPT (Thales theorem), similarity criteria, distance & section formulas.', ['Similarity', 'Section formula']],
          ['Introduction to Trigonometry', 'त्रिकोणमिति का परिचय', 'Trigonometric ratios, standard identities, and heights & distances.', ['Identities', 'Angles of elevation']],
          ['Surface Areas, Volumes & Statistics', 'पृष्ठीय क्षेत्रफल, आयतन और सांख्यिकी', 'Combined solids, mean, median, mode, and classical probability.', ['Grouped data', 'Probability']],
        ]),
      },
      {
        id: `c${classLevel}-science`,
        name: 'Science',
        nameHi: 'विज्ञान',
        category: 'core',
        bookName: `NCERT Science Class ${classLevel}`,
        accentTone: 'blue',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-science`, `Science Class ${classLevel}`, [
          ['Chemical Reactions & Acids/Bases', 'रासायनिक अभिक्रियाएँ एवं अम्ल-क्षार', 'Balancing equations, redox reactions, pH scale, and salts.', ['Redox', 'pH scale']],
          ['Carbon and Its Compounds', 'कार्बन एवं उसके यौगिक', 'Covalent bonding, homologous series, IUPAC naming, and ethanol/ethanoic acid.', ['Catenation', 'Functional groups']],
          ['Life Processes & Control', 'जैव प्रक्रम और नियंत्रण', 'Nutrition, respiration, human transport, excretion, and nervous coordination.', ['Photosynthesis', 'Nephron']],
          ['Light: Reflection & Refraction', 'प्रकाश: परावर्तन तथा अपवर्तन', 'Spherical mirrors, lenses, magnification, and Snell’s law.', ['Mirror formula', 'Refractive index']],
          ['Electricity & Magnetic Effects', 'विद्युत एवं चुंबकीय प्रभाव', 'Ohm’s law, series/parallel resistors, Joule heating, and domestic circuits.', ['Ohm’s law', 'Fleming’s rules']],
        ]),
      },
      {
        id: `c${classLevel}-sst`,
        name: 'Social Science',
        nameHi: 'सामाजिक विज्ञान',
        category: 'core',
        bookName: `India & Contemporary World / Democratic Politics ${classLevel}`,
        accentTone: 'violet',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-sst`, `Social Science Class ${classLevel}`, [
          ['Nationalism in Europe & India', 'यूरोप और भारत में राष्ट्रवाद', '19th-century nation-states, Non-Cooperation, and Civil Disobedience.', ['Treaty of Vienna', 'Satyagraha']],
          ['Resources, Agriculture & Minerals', 'संसाधन, कृषि और खनिज', 'Cropping seasons, soil classification, and energy resources in India.', ['Kharif/Rabi', 'Conservation']],
          ['Power Sharing & Federalism', 'सत्ता की साझेदारी और संघवाद', 'Constitutional division of powers, linguistic states, and decentralization.', ['Union/State lists', 'Panchayati Raj']],
          ['Development & Sectors of Economy', 'विकास और अर्थव्यवस्था के क्षेत्रक', 'HDI indicators, GDP, primary/secondary/tertiary sectors, and money/credit.', ['GDP', 'Formal credit']],
        ]),
      },
      {
        id: `c${classLevel}-english`,
        name: 'English (First Flight & Footprints)',
        nameHi: 'अंग्रेज़ी',
        category: 'language',
        bookName: `First Flight / Beehive Class ${classLevel}`,
        accentTone: 'cyan',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-english`, `English Class ${classLevel}`, [
          ['Prose & Theme Interpretation', 'गद्य एवं विषय-वस्तु विश्लेषण', 'Critical reading of literary prose and character arcs.', ['Theme', 'Inference']],
          ['Poetry & Literary Devices', 'काव्य एवं अलंकार', 'Imagery, symbolism, and tone across NCERT poems.', ['Symbolism', 'Alliteration']],
          ['Analytical Paragraphs & Letters', 'विश्लेषणात्मक लेखन', 'Formal letters of enquiry/complaint and data paragraph synthesis.', ['Formal format', 'Modals & Determiners']],
        ]),
      },
      {
        id: `c${classLevel}-hindi`,
        name: 'Hindi (Kshitij / Kritika)',
        nameHi: 'हिन्दी (क्षितिज / कृतिका)',
        category: 'language',
        bookName: `Kshitij / Sparsh Class ${classLevel}`,
        accentTone: 'indigo',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-hindi`, `Hindi Class ${classLevel}`, [
          ['गद्य एवं काव्य व्याख्या', 'गद्य एवं काव्य व्याख्या', 'प्रमुख कवियों व लेखकों की रचनाओं की सप्रसंग व्याख्या।', ['रस', 'वाच्य']],
          ['व्याकरण और रचनात्मक लेखन', 'व्याकरण और रचनात्मक लेखन', 'पद-परिचय, अलंकार, अनुच्छेद और पत्र लेखन।', ['पद परिचय', 'विज्ञापन लेखन']],
        ]),
      },
    ];
  }

  // Classes 11-12 Senior Secondary (Stream-aware)
  const activeStream: StreamType = stream || 'science';

  const languageSubjects: SubjectItem[] = [
    {
      id: `c${classLevel}-english`,
      name: 'English Core',
      nameHi: 'अंग्रेज़ी कोर',
      category: 'language',
      streams: ['science', 'commerce', 'humanities'],
      bookName: classLevel === 12 ? 'Flamingo & Vistas' : 'Hornbill & Snapshots',
      accentTone: 'cyan',
      ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
      epathshalaUrl: 'https://epathshala.nic.in/',
      chapters: makeChapters(`c${classLevel}-english`, `English Core Class ${classLevel}`, [
        ['Unseen Reading & Note-Making', 'अपठित गद्यांश और नोट्स', 'Inference, vocabulary in context, and structured précis.', ['Inference', 'Summary']],
        ['Flamingo / Hornbill Prose & Poetry', 'मुख्य पाठ्यपुस्तक गद्य व काव्य', 'Textual analysis, thematic essays, and extract-based questions.', ['Extracts', 'Literary devices']],
        ['Advanced Writing Skills', 'उच्च स्तरीय लेखन कौशल', 'Invitations, job applications, reports, and articles.', ['Report writing', 'Editorial letter']],
      ]),
    },
    {
      id: `c${classLevel}-hindi`,
      name: 'Hindi Core (Aroh / Vitan)',
      nameHi: 'हिन्दी कोर (आरोह / वितान)',
      category: 'language',
      streams: ['science', 'commerce', 'humanities'],
      bookName: `Aroh & Vitan Class ${classLevel}`,
      accentTone: 'violet',
      ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
      epathshalaUrl: 'https://epathshala.nic.in/',
      chapters: makeChapters(`c${classLevel}-hindi`, `Hindi Core Class ${classLevel}`, [
        ['आरोह काव्य व गद्य खंड', 'आरोह काव्य व गद्य खंड', 'भाव-सौंदर्य, शिल्प-सौंदर्य एवं संदर्भ सहित व्याख्या।', ['काव्य सौंदर्य', 'लेखक परिचय']],
        ['अभिव्यक्ति और माध्यम', 'अभिव्यक्ति और माध्यम', 'जनसंचार माध्यम, फीचर, आलेख और रचनात्मक लेखन।', ['पत्रकारिता', 'आलेख']],
      ]),
    },
  ];

  const streamSubjects: Record<StreamType, SubjectItem[]> = {
    science: [
      {
        id: `c${classLevel}-physics`,
        name: 'Physics',
        nameHi: 'भौतिक विज्ञान',
        category: 'core',
        streams: ['science'],
        bookName: `NCERT Physics Part I & II Class ${classLevel}`,
        accentTone: 'indigo',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-physics`, `Physics Class ${classLevel}`, [
          classLevel === 12
            ? ['Electrostatics & Gauss’s Law', 'स्थिरवैद्युतिकी और गॉस नियम', 'Coulomb’s law, electric dipole, flux, and Gauss theorem applications.', ['Electric field', 'Capacitors']]
            : ['Motion in a Plane & Laws of Motion', 'समतल में गति और गति के नियम', 'Vectors, projectile motion, Newton’s laws, and circular dynamics.', ['Projectiles', 'Friction']],
          classLevel === 12
            ? ['Current Electricity & Kirchhoff Rules', 'विद्युत धारा और किरचॉफ नियम', 'Drift velocity, Ohm’s law, Wheatstone bridge, and cell EMF.', ['Drift velocity', 'Kirchhoff']]
            : ['Work, Energy, Power & Gravitation', 'कार्य, ऊर्जा, शक्ति और गुरुत्वाकर्षण', 'Work-energy theorem, conservation, and Kepler’s orbital laws.', ['Potential energy', 'Escape velocity']],
          classLevel === 12
            ? ['Electromagnetic Induction & Optics', 'विद्युतचुंबकीय प्रेरण एवं प्रकाशिकी', 'Faraday’s laws, AC circuits, wave optics, and interference.', ['Lenz’s law', 'Young’s double slit']]
            : ['Thermodynamics & Oscillations', 'ऊष्मागतिकी और दोलन', 'First/second laws of thermodynamics, Carnot engine, and SHM.', ['Carnot cycle', 'SHM']],
        ]),
      },
      {
        id: `c${classLevel}-chemistry`,
        name: 'Chemistry',
        nameHi: 'रसायन विज्ञान',
        category: 'core',
        streams: ['science'],
        bookName: `NCERT Chemistry Part I & II Class ${classLevel}`,
        accentTone: 'blue',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-chemistry`, `Chemistry Class ${classLevel}`, [
          classLevel === 12
            ? ['Solutions & Electrochemistry', 'विलयन और वैद्युत रसायन', 'Raoult’s law, colligative properties, Nernst equation, and conductance.', ['Molarity', 'Nernst equation']]
            : ['Structure of Atom & Bonding', 'परमाणु संरचना और रासायनिक आबंधन', 'Quantum numbers, VSEPR theory, hybridization, and MO theory.', ['Orbitals', 'Hybridization']],
          classLevel === 12
            ? ['Chemical Kinetics & Coordination', 'रासायनिक बलगतिकी और उपसहसंयोजन', 'Rate laws, Arrhenius equation, crystal field theory, and IUPAC naming.', ['Half-life', 'CFT']]
            : ['Equilibrium & Thermodynamics', 'साम्यावस्था और ऊष्मागतिकी', 'Enthalpy, Gibbs energy, Le Chatelier principle, and ionic buffers.', ['Gibbs energy', 'pH buffers']],
          ['Organic Chemistry Mechanisms', 'कार्बनिक रसायन अभिक्रिया क्रियाविधि', 'Reaction intermediates, stereochemistry, carbonyls, and biomolecules.', ['SN1/SN2', 'Aldol & Cannizzaro']],
        ]),
      },
      {
        id: `c${classLevel}-math`,
        name: 'Mathematics',
        nameHi: 'गणित',
        category: 'core',
        streams: ['science', 'commerce'],
        bookName: `NCERT Mathematics Part I & II Class ${classLevel}`,
        accentTone: 'violet',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-math`, `Mathematics Class ${classLevel}`, [
          classLevel === 12
            ? ['Relations, Functions & Matrices', 'संबंध, फलन एवं आव्यूह', 'Equivalence relations, inverse trig functions, and matrix determinants.', ['Invertible functions', 'Determinants']]
            : ['Sets, Relations & Trigonometry', 'समुच्चय, संबंध एवं त्रिकोणमिति', 'Venn operations, domain/range, and trigonometric identities.', ['Sets', 'Domain & Range']],
          classLevel === 12
            ? ['Calculus: Continuity, Integrals & DE', 'कलन: सांतत्य, समाकलन और अवकल समीकरण', 'Chain rule, maxima/minima, definite integrals, and first-order ODEs.', ['Derivatives', 'Integration by parts']]
            : ['Limits, Derivatives & Conic Sections', 'सीमा, अवकलज और शांकव परिच्छेद', 'First principles, parabolas, ellipses, and hyperbolas.', ['Limits', 'Conics']],
          ['Vectors, 3D Geometry & Probability', 'सदिश, त्रिविमीय ज्यामिति और प्रायिकता', 'Dot/cross products, shortest distance, and Bayes’ theorem.', ['Bayes theorem', 'Direction cosines']],
        ]),
      },
      {
        id: `c${classLevel}-biology`,
        name: 'Biology',
        nameHi: 'जीव विज्ञान',
        category: 'elective',
        streams: ['science'],
        bookName: `NCERT Biology Class ${classLevel}`,
        accentTone: 'cyan',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-biology`, `Biology Class ${classLevel}`, [
          classLevel === 12
            ? ['Molecular Basis of Inheritance', 'वंशागति का आणविक आधार', 'DNA replication, transcription, genetic code, and Lac operon.', ['DNA structure', 'Central dogma']]
            : ['Cell: The Unit of Life & Biomolecules', 'कोशिका और जैव अणु', 'Prokaryotic vs eukaryotic organelles, enzymes, and cell cycle.', ['Mitosis/Meiosis', 'Enzymes']],
          classLevel === 12
            ? ['Biotechnology & Ecology', 'जैव प्रौद्योगिकी और पारिस्थितिकी', 'Recombinant DNA tools, PCR, ecological pyramids, and biodiversity.', ['PCR', 'Ecosystem productivity']]
            : ['Plant & Human Physiology', 'पादप एवं मानव कार्यिकी', 'C3/C4 photosynthesis, cardiac cycle, neural transmission, and hormones.', ['Calvin cycle', 'Cardiac cycle']],
        ]),
      },
    ],
    commerce: [
      {
        id: `c${classLevel}-accountancy`,
        name: 'Accountancy',
        nameHi: 'लेखाशास्त्र',
        category: 'core',
        streams: ['commerce'],
        bookName: `NCERT Accountancy Class ${classLevel}`,
        accentTone: 'indigo',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-accountancy`, `Accountancy Class ${classLevel}`, [
          classLevel === 12
            ? ['Accounting for Partnership Firms', 'साझेदारी फर्मों का लेखांकन', 'Goodwill valuation, admission, retirement, and dissolution entries.', ['Profit sharing', 'Revaluation']]
            : ['Recording of Transactions & Trial Balance', 'लेन-देन का अभिलेखन और तलपट', 'Double-entry journal, ledger posting, and bank reconciliation.', ['Journal', 'BRS']],
          classLevel === 12
            ? ['Company Accounts & Cash Flow', 'कंपनी खाते और रोकड़ प्रवाह', 'Issue of shares/debentures, financial ratios, and cash flow statements.', ['Share capital', 'Liquidity ratios']]
            : ['Financial Statements & Adjustments', 'वित्तीय विवरण', 'Trading, P&L account, and Balance Sheet preparation.', ['Depreciation', 'Balance Sheet']],
        ]),
      },
      {
        id: `c${classLevel}-bst`,
        name: 'Business Studies',
        nameHi: 'व्यवसाय अध्ययन',
        category: 'core',
        streams: ['commerce'],
        bookName: `NCERT Business Studies Class ${classLevel}`,
        accentTone: 'blue',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-bst`, `Business Studies Class ${classLevel}`, [
          ['Principles & Functions of Management', 'प्रबंध के सिद्धांत एवं कार्य', 'Fayol & Taylor principles, planning, organizing, staffing, and controlling.', ['Fayol 14 principles', 'Delegation']],
          ['Financial Markets & Marketing Mix', 'वित्तीय बाज़ार और विपणन मिश्रण', 'SEBI functions, money/capital markets, and the 4Ps of marketing.', ['Capital market', '4Ps']],
        ]),
      },
      {
        id: `c${classLevel}-economics`,
        name: 'Economics',
        nameHi: 'अर्थशास्त्र',
        category: 'core',
        streams: ['commerce', 'humanities'],
        bookName: classLevel === 12 ? 'Introductory Macroeconomics & Indian Economic Dev.' : 'Statistics & Microeconomics',
        accentTone: 'violet',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-economics`, `Economics Class ${classLevel}`, [
          classLevel === 12
            ? ['National Income & Money/Banking', 'राष्ट्रीय आय और मुद्रा व बैंकिंग', 'GDP methods, RBI credit control, and government budget deficits.', ['Value added method', 'Repo rate']]
            : ['Consumer Equilibrium & Demand', 'उपभोक्ता संतुलन और माँग', 'Utility analysis, indifference curves, and price elasticity.', ['Elasticity', 'Supply curves']],
          classLevel === 12
            ? ['Indian Economic Development (1947–Present)', 'भारतीय अर्थव्यवस्था का विकास', 'Five-year plans, 1991 LPG reforms, and human capital.', ['1991 Reforms', 'Sustainable growth']]
            : ['Statistical Tools & Correlation', 'सांख्यिकीय उपकरण', 'Measures of central tendency, dispersion, and index numbers.', ['Mean/Median', 'Index numbers']],
        ]),
      },
    ],
    humanities: [
      {
        id: `c${classLevel}-history`,
        name: 'History',
        nameHi: 'इतिहास',
        category: 'core',
        streams: ['humanities'],
        bookName: `Themes in Indian / World History Class ${classLevel}`,
        accentTone: 'indigo',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-history`, `History Class ${classLevel}`, [
          ['Harappan Civilisation to Mauryan Empire', 'हड़प्पा सभ्यता से मौर्य साम्राज्य', 'Archaeological evidence, urban planning, and Ashokan inscriptions.', ['Indus Valley', 'Epigraphy']],
          ['Bhakti-Sufi Traditions & Mughal Chronicles', 'भक्ति-सूफी परंपराएँ', 'Cultural synthesis, agrarian society, and court chronicles.', ['Ain-i-Akbari', 'Bhakti saints']],
          ['Framing the Constitution & Partition', 'संविधान निर्माण और विभाजन', 'Constituent Assembly debates, fundamental ideals, and source analysis.', ['Constituent Assembly', 'Oral histories']],
        ]),
      },
      {
        id: `c${classLevel}-polsci`,
        name: 'Political Science',
        nameHi: 'राजनीति विज्ञान',
        category: 'core',
        streams: ['humanities'],
        bookName: `Indian Constitution / Contemporary World Politics ${classLevel}`,
        accentTone: 'blue',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-polsci`, `Political Science Class ${classLevel}`, [
          ['Constitutional Philosophy & Rights', 'संवैधानिक दर्शन और अधिकार', 'Fundamental rights, directive principles, and election commission.', ['Writ jurisdiction', 'Federalism']],
          ['Contemporary World Politics & India', 'समकालीन विश्व राजनीति', 'Multipolar world, international organizations, and India’s foreign policy.', ['UN reforms', 'Non-alignment']],
        ]),
      },
      {
        id: `c${classLevel}-geography`,
        name: 'Geography',
        nameHi: 'भूगोल',
        category: 'core',
        streams: ['humanities'],
        bookName: `Fundamentals of Human & Indian Geography ${classLevel}`,
        accentTone: 'violet',
        ncertPortalUrl: 'https://ncert.nic.in/textbook.php',
        epathshalaUrl: 'https://epathshala.nic.in/',
        chapters: makeChapters(`c${classLevel}-geography`, `Geography Class ${classLevel}`, [
          ['Geomorphology, Climate & Monsoon', 'भू-आकृति विज्ञान और मानसून', 'Plate tectonics, atmospheric circulation, and Indian monsoon dynamics.', ['ITCZ', 'Drainage basins']],
          ['Human Settlements & Resource Planning', 'मानव बस्तियाँ और संसाधन नियोजन', 'Population demographics, transport corridors, and regional planning.', ['Demographic transition', 'Urbanization']],
        ]),
      },
    ],
  };

  return [...streamSubjects[activeStream], ...languageSubjects];
}

export const OFFICIAL_RESOURCES: OfficialResource[] = [
  {
    id: 'ncert-textbooks',
    title: 'NCERT Official Textbooks Portal',
    titleHi: 'एनसीईआरटी आधिकारिक पाठ्यपुस्तक पोर्टल',
    provider: 'NCERT',
    description:
      'Authorized chapter-wise PDFs for Classes 1–12 across English, Hindi, and Urdu mediums published directly by NCERT.',
    descriptionHi:
      'कक्षा 1–12 के लिए अंग्रेजी, हिंदी और उर्दू माध्यम में एनसीईआरटी द्वारा प्रकाशित आधिकारिक अध्याय-वार पीडीएफ।',
    stages: 'Classes 1–12 · All Subjects',
    url: 'https://ncert.nic.in/textbook.php',
  },
  {
    id: 'epathshala',
    title: 'ePathshala Digital Textbooks & E-Content',
    titleHi: 'ई-पाठशाला डिजिटल पाठ्यपुस्तकें',
    provider: 'ePathshala',
    description:
      'Joint initiative by Ministry of Education & NCERT providing e-textbooks, audio books, and interactive resources.',
    descriptionHi:
      'शिक्षा मंत्रालय और एनसीईआरटी की संयुक्त पहल — ई-पुस्तकें, ऑडियो सामग्री और इंटरैक्टिव संसाधन।',
    stages: 'Classes 1–12 · Flipbooks & Audio',
    url: 'https://epathshala.nic.in/',
  },
  {
    id: 'ncert-exemplar',
    title: 'NCERT Exemplar Problems & Lab Manuals',
    titleHi: 'एनसीईआरटी एक्ज़ेम्पलर प्रश्न व प्रयोगशाला पुस्तिकाएँ',
    provider: 'NCERT Exemplar',
    description:
      'Higher-order conceptual problems for Mathematics and Science in Classes 6–12, ideal for board and competitive prep.',
    descriptionHi:
      'कक्षा 6–12 के गणित और विज्ञान के लिए उच्च-स्तरीय वैचारिक प्रश्न और अभ्यास सामग्री।',
    stages: 'Classes 6–12 · Maths & Science',
    url: 'https://ncert.nic.in/exemplar-problems.php',
  },
  {
    id: 'diksha',
    title: 'DIKSHA Energized Textbooks & QR Lessons',
    titleHi: 'दीक्षा (DIKSHA) पोर्टल व क्यूआर पाठ',
    provider: 'DIKSHA',
    description:
      'National digital infrastructure for school education featuring NCERT QR-coded video explainers and practice worksheets.',
    descriptionHi:
      'एनसीईआरटी क्यूआर-कोड आधारित वीडियो व्याख्या और अभ्यास कार्यपत्रकों का राष्ट्रीय मंच।',
    stages: 'Classes 1–12 · Multilingual',
    url: 'https://diksha.gov.in/',
  },
  {
    id: 'swayam-ncert',
    title: 'SWAYAM NCERT MOOCs (Classes 11–12)',
    titleHi: 'स्वयं (SWAYAM) एनसीईआरटी पाठ्यक्रम',
    provider: 'SWAYAM',
    description:
      'Free structured online courses developed by NCERT faculty for Senior Secondary Physics, Chemistry, Maths, Accountancy, and Humanities.',
    descriptionHi:
      'कक्षा 11–12 के लिए एनसीईआरटी संकाय द्वारा संचालित निःशुल्क ऑनलाइन पाठ्यक्रम।',
    stages: 'Classes 11–12 · Video + Assessments',
    url: 'https://swayam.gov.in/NCERT',
  },
];

export const STARTER_QUIZ_BANK: QuizQuestion[] = [
  {
    id: 'q-c10-sci-1',
    classLevel: 10,
    subjectId: 'c10-science',
    chapterTitle: 'Chemical Reactions & Acids/Bases',
    question: 'A solution turns red litmus blue. Its pH is most likely to be:',
    options: ['1', '4', '5', '10'],
    correctIndex: 3,
    explanation: 'Bases turn red litmus paper blue and have a pH greater than 7 (here, 10).',
  },
  {
    id: 'q-c10-sci-2',
    classLevel: 10,
    subjectId: 'c10-science',
    chapterTitle: 'Light: Reflection & Refraction',
    question: 'Where should an object be placed in front of a convex lens to obtain a real image of the same size as the object?',
    options: [
      'At the principal focus F₁',
      'At twice the focal length (2F₁)',
      'At infinity',
      'Between the optical centre O and focus F₁',
    ],
    correctIndex: 1,
    explanation: 'When an object is placed at 2F₁ of a convex lens, the real inverted image forms at 2F₂ with magnification m = -1 (same size).',
  },
  {
    id: 'q-c10-sci-3',
    classLevel: 10,
    subjectId: 'c10-science',
    chapterTitle: 'Electricity & Magnetic Effects',
    question: 'If two resistors of 4 Ω and 12 Ω are connected in parallel, their equivalent resistance is:',
    options: ['16 Ω', '8 Ω', '3 Ω', '48 Ω'],
    correctIndex: 2,
    explanation: '1/R_eq = 1/4 + 1/12 = 4/12 = 1/3, so R_eq = 3 Ω.',
  },
  {
    id: 'q-c10-math-1',
    classLevel: 10,
    subjectId: 'c10-math',
    chapterTitle: 'Quadratic Equations & AP',
    question: 'What is the 10th term of the Arithmetic Progression 2, 7, 12, ...?',
    options: ['45', '47', '49', '52'],
    correctIndex: 1,
    explanation: 'Using a_n = a + (n − 1)d with a = 2, d = 5, n = 10: a_10 = 2 + 9(5) = 47.',
  },
  {
    id: 'q-c10-math-2',
    classLevel: 10,
    subjectId: 'c10-math',
    chapterTitle: 'Introduction to Trigonometry',
    question: 'What is the exact value of (1 − tan² 45°) / (1 + tan² 45°)?',
    options: ['1', '0', 'sin 45°', 'tan 90°'],
    correctIndex: 1,
    explanation: 'Since tan 45° = 1, the numerator becomes 1 − 1 = 0, so the fraction equals 0.',
  },
  {
    id: 'q-c8-sci-1',
    classLevel: 8,
    subjectId: 'c8-science',
    chapterTitle: 'Crop Production & Microorganisms',
    question: 'Which bacterium lives in the root nodules of leguminous plants and fixes atmospheric nitrogen?',
    options: ['Lactobacillus', 'Rhizobium', 'Penicillium', 'Amoeba'],
    correctIndex: 1,
    explanation: 'Rhizobium forms a symbiotic association in leguminous root nodules and converts atmospheric nitrogen into usable compounds.',
  },
  {
    id: 'q-c12-phy-1',
    classLevel: 12,
    subjectId: 'c12-physics',
    chapterTitle: 'Electrostatics & Gauss’s Law',
    question: 'According to Gauss’s law, the total electric flux through a closed surface depends on:',
    options: [
      'The shape of the Gaussian surface only',
      'Charges located outside the closed surface',
      'The net charge enclosed inside the surface',
      'The radius of the enclosing sphere',
    ],
    correctIndex: 2,
    explanation: 'Gauss’s law states Φ = q_enclosed / ε₀, which depends solely on the net enclosed charge and permittivity, independent of surface shape.',
  },
  {
    id: 'q-c5-math-1',
    classLevel: 5,
    subjectId: 'c5-math',
    chapterTitle: 'Shapes and Angles',
    question: 'An angle measuring 90° is called a:',
    options: ['Acute angle', 'Right angle', 'Obtuse angle', 'Straight angle'],
    correctIndex: 1,
    explanation: 'A 90° angle (like the corner of a textbook page) is a right angle.',
  },
];

export const INITIAL_NOTES: StudyNote[] = [
  {
    id: 'note-1',
    title: 'Class 10 Science — Mirror & Lens Sign Convention Summary',
    classLevel: 10,
    subjectName: 'Science',
    content:
      '1. All distances are measured from the pole (mirror) or optical centre (lens).\n2. Distances in the direction of incident light are positive; opposite are negative.\n3. Convex lens focal length is positive (+f); concave lens focal length is negative (−f).\n4. Mirror formula: 1/v + 1/u = 1/f | Lens formula: 1/v − 1/u = 1/f.',
    updatedAt: '2026-11-24',
    source: 'manual',
  },
  {
    id: 'note-2',
    title: 'Class 10 Maths — Quadratic Discriminant Cases',
    classLevel: 10,
    subjectName: 'Mathematics',
    content:
      'For ax² + bx + c = 0 (a ≠ 0), Discriminant D = b² − 4ac:\n• D > 0: Two distinct real roots\n• D = 0: Two equal real roots (−b / 2a)\n• D < 0: No real roots',
    updatedAt: '2026-11-22',
    source: 'ai',
  },
];

export const INITIAL_PLANNER_TASKS: PlannerTask[] = [
  {
    id: 'task-1',
    title: 'Revise Ohm’s Law & Circuit Numericals (Ch. 11)',
    classLevel: 10,
    subjectName: 'Science',
    day: 'Today',
    durationMin: 45,
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Solve 10 Quadratic Equations Word Problems',
    classLevel: 10,
    subjectName: 'Mathematics',
    day: 'Today',
    durationMin: 40,
    completed: true,
  },
  {
    id: 'task-3',
    title: 'Map Practice: Major Soil Types & Dams in India',
    classLevel: 10,
    subjectName: 'Social Science',
    day: 'Tomorrow',
    durationMin: 30,
    completed: false,
  },
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'attempt-1',
    dateIso: '2026-11-25',
    classLevel: 10,
    subjectName: 'Science',
    chapterTitle: 'Light & Electricity Mixed Check',
    score: 3,
    total: 3,
    accuracy: 100,
    durationSec: 112,
    details: [
      {
        questionId: 'q-c10-sci-1',
        question: 'A solution turns red litmus blue. Its pH is most likely to be:',
        options: ['1', '4', '5', '10'],
        selectedIndex: 3,
        correctIndex: 3,
        isCorrect: true,
        explanation: 'Bases turn red litmus paper blue and have a pH greater than 7 (here, 10).',
      },
      {
        questionId: 'q-c10-sci-2',
        question:
          'Where should an object be placed in front of a convex lens to obtain a real image of the same size as the object?',
        options: [
          'At the principal focus F₁',
          'At twice the focal length (2F₁)',
          'At infinity',
          'Between the optical centre O and focus F₁',
        ],
        selectedIndex: 1,
        correctIndex: 1,
        isCorrect: true,
        explanation:
          'When an object is placed at 2F₁ of a convex lens, the real inverted image forms at 2F₂ with magnification m = -1 (same size).',
      },
      {
        questionId: 'q-c10-sci-3',
        question:
          'If two resistors of 4 Ω and 12 Ω are connected in parallel, their equivalent resistance is:',
        options: ['16 Ω', '8 Ω', '3 Ω', '48 Ω'],
        selectedIndex: 2,
        correctIndex: 2,
        isCorrect: true,
        explanation: '1/R_eq = 1/4 + 1/12 = 4/12 = 1/3, so R_eq = 3 Ω.',
      },
    ],
  },
  {
    id: 'attempt-2',
    dateIso: '2026-11-23',
    classLevel: 10,
    subjectName: 'Mathematics',
    chapterTitle: 'AP & Trigonometry Basics',
    score: 1,
    total: 2,
    accuracy: 50,
    durationSec: 95,
    details: [
      {
        questionId: 'q-c10-math-1',
        question: 'What is the 10th term of the Arithmetic Progression 2, 7, 12, ...?',
        options: ['45', '47', '49', '52'],
        selectedIndex: 1,
        correctIndex: 1,
        isCorrect: true,
        explanation: 'Using a_n = a + (n − 1)d with a = 2, d = 5, n = 10: a_10 = 2 + 9(5) = 47.',
      },
      {
        questionId: 'q-c10-math-2',
        question: 'What is the exact value of (1 − tan² 45°) / (1 + tan² 45°)?',
        options: ['1', '0', 'sin 45°', 'tan 90°'],
        selectedIndex: 0,
        correctIndex: 1,
        isCorrect: false,
        explanation: 'Since tan 45° = 1, the numerator becomes 1 − 1 = 0, so the fraction equals 0.',
      },
    ],
  },
];

export const UI_COPY = {
  en: {
    brand: 'EDUGENIUS AI',
    nav: {
      dashboard: 'Dashboard',
      classes: 'Classes 1–12',
      subjects: 'Subjects',
      library: 'NCERT Library',
      assistant: 'AI Assistant',
      notes: 'Notes',
      quizzes: 'Quizzes',
      results: 'Results',
      planner: 'Planner',
      components: 'UI Library',
      profile: 'Profile',
    },
    askTutor: 'Ask AI Tutor',
    welcomeBack: 'Welcome back,',
    activeClass: 'Active Class',
    exploreSubjects: 'Explore NCERT Subjects',
    officialLinksNotice: 'Authorized NCERT & ePathshala chapter indexes and study guides.',
  },
  hi: {
    brand: 'EDUGENIUS AI',
    nav: {
      dashboard: 'डैशबोर्ड',
      classes: 'कक्षा 1–12',
      subjects: 'विषय',
      library: 'NCERT पुस्तकालय',
      assistant: 'AI शिक्षक',
      notes: 'नोट्स',
      quizzes: 'क्विज़',
      results: 'परिणाम',
      planner: 'अध्ययन योजना',
      components: 'UI लाइब्रेरी',
      profile: 'प्रोफ़ाइल',
    },
    askTutor: 'AI शिक्षक से पूछें',
    welcomeBack: 'पुनः स्वागत है,',
    activeClass: 'सक्रिय कक्षा',
    exploreSubjects: 'NCERT विषय देखें',
    officialLinksNotice: 'आधिकारिक NCERT व ePathshala अध्याय सूची एवं अध्ययन सहायता।',
  },
} as const;
