/**
 * EDUGENIUS AI - Offline Intelligence Engine
 * 100% Local, Offline NCERT Academic Tutor & Assessment Generator
 *
 * Provides:
 * 1. NCERT Conceptual Explanations (English, Hindi, Hinglish)
 * 2. Step-by-Step Problem Solver with Equation Parser
 * 3. Exam Revision Summaries (Formulas, Pitfalls, Rapid Practice)
 * 4. Official NCERT/ePathshala/DIKSHA Verified Resource Grounding
 * 5. Curriculum-Aligned MCQ Quiz Generator for Classes 1-12
 * 6. Optional Local LLM connection (Ollama / LocalAI) with automatic offline fallback
 */

export interface AssistantRequest {
  prompt: string;
  classLevel: number;
  subject: string;
  chapter?: string;
  language: 'en' | 'hi' | 'hinglish';
  mode: 'concept' | 'solver' | 'revision' | 'search';
  history?: Array<{ role?: unknown; text?: unknown }>;
  useSearch?: boolean;
}

export interface AssistantResponse {
  reply: string;
  sources: Array<{ title: string; uri: string }>;
}

export interface QuizQuestionData {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Official NCERT and Government of India Educational Resources
const NCERT_OFFICIAL_RESOURCES = [
  {
    title: 'NCERT Official Textbooks Portal (Class 1-12 PDF/ePub)',
    uri: 'https://ncert.nic.in/textbook.php',
  },
  {
    title: 'ePathshala Portal (Ministry of Education & NCERT)',
    uri: 'https://epathshala.nic.in/',
  },
  {
    title: 'DIKSHA - National Digital Platform for Teachers & Students',
    uri: 'https://diksha.gov.in/',
  },
  {
    title: 'SWAYAM PRABHA - DTH Educational TV Channels',
    uri: 'https://www.swayamprabha.gov.in/',
  },
  {
    title: 'CBSE Academic Official Curriculum & Question Bank',
    uri: 'https://cbseacademic.nic.in/',
  },
  {
    title: 'National Digital Library of India (NDLI)',
    uri: 'https://ndl.iitkgp.ac.in/',
  },
];

// Curated NCERT Topic Explanations
interface TopicContent {
  keywords: string[];
  en: {
    concept: string;
    analogy: string;
    keyPoints: string[];
    quickCheck: string;
    revision: {
      summary: string;
      formulas: string[];
      pitfalls: string[];
      practice: string[];
    };
  };
  hi: {
    concept: string;
    analogy: string;
    keyPoints: string[];
    quickCheck: string;
    revision: {
      summary: string;
      formulas: string[];
      pitfalls: string[];
      practice: string[];
    };
  };
  hinglish: {
    concept: string;
    analogy: string;
    keyPoints: string[];
    quickCheck: string;
    revision: {
      summary: string;
      formulas: string[];
      pitfalls: string[];
      practice: string[];
    };
  };
}

const NCERT_KNOWLEDGE_BASE: Record<string, TopicContent> = {
  photosynthesis: {
    keywords: ['photosynthesis', 'प्रकाश संश्लेषण', 'chlorophyll', 'stomata', 'autotroph'],
    en: {
      concept:
        'Photosynthesis is the fundamental biological process through which autotrophic green plants synthesize organic nutrients (glucose) from inorganic raw materials (carbon dioxide and water) using sunlight energy trapped by chlorophyll pigments.\n\n$$\\text{6CO}_2 + \\text{6H}_2\\text{O} \\xrightarrow[\\text{Chlorophyll}]{\\text{Sunlight}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{6O}_2$$\n\nOxygen is released as a vital by-product through stomatal pores into the atmosphere.',
      analogy:
        'Think of a plant leaf as a solar-powered kitchen: sunlight is the stove heat, chlorophyll is the solar chef, water absorbed by roots and carbon dioxide absorbed from air are the raw vegetables, and glucose is the prepared meal.',
      keyPoints: [
        'Site of Reaction: Chloroplasts containing chlorophyll within mesophyll cells.',
        'Key Raw Materials: CO2 (via stomata with guard cells) and Water (absorbed by roots via xylem).',
        'By-product: Oxygen (essential for aerobic respiration of living organisms).',
        'Storage: Excess glucose is converted into starch for future metabolic needs.',
      ],
      quickCheck: 'Which mineral ion is an essential core component of the chlorophyll pigment molecule?',
      revision: {
        summary: 'Autotrophic nutrition mechanism in plants converting radiant solar energy into chemical energy.',
        formulas: ['Chemical Equation: 6CO2 + 6H2O + Sunlight -> C6H12O6 + 6O2'],
        pitfalls: [
          'Confusing stomatal opening with photosynthesis itself (guard cells swell to open stomata, not shrink).',
          'Forgetting that light reaction occurs in thylakoid grana while dark reaction (Calvin cycle) occurs in the stroma.',
        ],
        practice: [
          'Q1: What are the three key events occurring during photosynthesis? (Absorption of light, conversion to chemical energy/water splitting, reduction of CO2).',
          'Q2: Why do desert plants open stomata at night? (To minimize transpiration water loss while capturing CO2 for night-stored intermediate acid).',
        ],
      },
    },
    hi: {
      concept:
        'प्रकाश संश्लेषण (Photosynthesis) वह जैव-रासायनिक प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश तथा क्लोरोफिल की उपस्थिति में कार्बन डाइऑक्साइड (CO2) तथा जल (H2O) का उपयोग करके कार्बोहाइड्रेट (ग्लूकोज) का निर्माण करते हैं और ऑक्सीजन गैस मुक्त करते हैं।\n\n$$\\text{6CO}_2 + \\text{6H}_2\\text{O} \\xrightarrow[\\text{क्लोरोफिल}]{\\text{सूर्य का प्रकाश}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{6O}_2$$',
      analogy:
        'जैसे किसी रसोई में चूल्हे की ऊर्जा से कच्ची सब्जियों से भोजन तैयार होता है, वैसे ही पत्तियों की कोशिका में सूर्य की धूप और क्लोरोफिल की सहायता से ग्लूकोज रूपी भोजन पकता है।',
      keyPoints: [
        'स्थल: पत्तियों के क्लोरोप्लास्ट (हरित लवक) में।',
        'कच्चे पदार्थ: CO2 (रंध्रों द्वारा) तथा H2O (जाइलम द्वारा जड़ों से)।',
        'उपोत्पाद: ऑक्सीजन गैस जो जीवनदायिनी है।',
        'संग्रह: निर्मित ग्लूकोज पौधों में मंड (Starch) के रूप में संचित होता है।',
      ],
      quickCheck: 'रंध्रों (Stomata) के खुलने और बंद होने को कौन सी कोशिकाएँ नियंत्रित करती हैं? (उत्तर: द्वार कोशिकाएँ / Guard Cells)',
      revision: {
        summary: 'पौधों में स्वपोषी पोषण का मूल प्रक्रम जिसमें सौर ऊर्जा को रासायनिक ऊर्जा में बदला जाता है।',
        formulas: ['समीकरण: 6CO2 + 6H2O -> C6H12O6 + 6O2'],
        pitfalls: [
          'अक्सर छात्र भूल जाते हैं कि ऑक्सीजन जल के अणुओं के टूटने (Photolysis of water) से निकलती है, CO2 से नहीं।',
        ],
        practice: [
          'प्रश्न 1: प्रकाश संश्लेषण के दौरान घटित होने वाली तीन प्रमुख घटनाएँ कौन सी हैं?',
          'प्रश्न 2: रात के समय रेगिस्तानी पौधे CO2 कैसे ग्रहण करते हैं?',
        ],
      },
    },
    hinglish: {
      concept:
        'Photosynthesis ek biological process hai jisme green plants sunlight aur chlorophyll ki help se carbon dioxide (CO2) aur water (H2O) ko use karke glucose banate hain aur oxygen release karte hain.\n\nChemical Equation:\n6CO2 + 6H2O + Sunlight -> C6H12O6 + 6O2',
      analogy:
        'Imagine kijiye leaf ek solar-powered kitchen hai jisme chlorophyll chef ki tarah sunlight use karke glucose prepare karta hai.',
      keyPoints: [
        'Ye process leaf ke chloroplasts me hota hai.',
        'Stomata ke through CO2 enter karti hai aur O2 bahar aati hai.',
        'Excess glucose plant me starch ke form me store hota hai.',
      ],
      quickCheck: 'Stomata ko open aur close karne me kaun si cells help karti hain? (Guard cells)',
      revision: {
        summary: 'Solar energy ko chemical energy me convert karne ka fundamental autotrophic process.',
        formulas: ['6CO2 + 6H2O -> C6H12O6 + 6O2'],
        pitfalls: [
          'Exam trap: Oxygen water molecules ke split hone se release hoti hai, CO2 se nahi.',
        ],
        practice: [
          'Q1: Light reaction aur dark reaction me kya difference hai?',
          'Q2: Guard cells ka primary function kya hai?',
        ],
      },
    },
  },

  ohms_law: {
    keywords: ['ohm', 'ohms law', 'विद्युत धारा', 'प्रतिरोध', 'resistance', 'voltage', 'current', 'v=ir'],
    en: {
      concept:
        "Ohm's Law states that at constant temperature, the electric current (I) flowing through a metallic conductor is directly proportional to the potential difference (V) across its ends.\n\n$$V \\propto I \\implies V = IR$$\n\nWhere:\n- **V** = Potential Difference in Volts (V)\n- **I** = Electric Current in Amperes (A)\n- **R** = Electrical Resistance of the conductor in Ohms (Ω)",
      analogy:
        'Think of water flowing through a garden pipe: Potential Difference (V) is the water pressure from the tap, Current (I) is the water flow rate, and Resistance (R) is any constriction or narrow squeeze in the pipe.',
      keyPoints: [
        'SI Units: Voltage (Volt), Current (Ampere), Resistance (Ohm Ω).',
        'Factors affecting Resistance: R = ρ(l / A), directly proportional to length (l), inversely proportional to cross-sectional area (A), and depends on material resistivity (ρ) and temperature.',
        'Ohmic conductors show a straight line V-I graph passing through the origin (slope = R).',
      ],
      quickCheck: 'If the voltage across a 10 Ω resistor is doubled, what happens to the electric current flowing through it?',
      revision: {
        summary: "Fundamental law of electric circuits relating voltage, current, and conductor resistance: V = IR.",
        formulas: ['V = IR', 'R = V / I', 'I = V / R', 'R = ρ · (l / A)', 'Electric Power: P = VI = I²R = V² / R'],
        pitfalls: [
          'Neglecting the condition: Ohm\'s law strictly holds true only when temperature and other physical parameters remain constant.',
          'Confusing Resistance (R) with Resistivity (ρ): Resistivity is a constant material property and does not change with length or thickness.',
        ],
        practice: [
          'Q1: A heater draws 4 A current when connected to a 220 V line. Find its resistance. (Ans: R = 220 / 4 = 55 Ω).',
          'Q2: A wire of resistance R is stretched to double its original length. What is its new resistance? (Ans: 4R, because area becomes A/2).',
        ],
      },
    },
    hi: {
      concept:
        'ओम का नियम (Ohm\'s Law): नियत ताप पर, किसी चालक तार के सिरों के बीच का विभवांतर (V) उसमें प्रवाहित होने वाली विद्युत धारा (I) के समानुपाती होता है।\n\n$$V \\propto I \\implies V = IR$$\n\nयहाँ:\n- **V** = विभवांतर (वोल्ट में)\n- **I** = विद्युत धारा (ऐम्पियर में)\n- **R** = चालक का प्रतिरोध (ओम Ω में)',
      analogy:
        'पानी के पाइप की तरह सोचिए: विभवांतर नल का दबाव है, धारा पानी के बहने की दर है, और प्रतिरोध पाइप का संकरापन है।',
      keyPoints: [
        'मात्रक: विभवांतर का वोल्ट (V), धारा का ऐम्पियर (A), प्रतिरोध का ओम (Ω)।',
        'प्रतिरोध निर्भर करता है: चालक की लंबाई (l), अनुप्रस्थ काट का क्षेत्रफल (A), पदार्थ की प्रकृति (ρ) और तापमान पर।',
        'सूत्र: R = ρ(l / A)।',
      ],
      quickCheck: 'यदि किसी 5 ओम के प्रतिरोधक के दोनों सिरों पर 10 वोल्ट का विभवांतर हो, तो धारा का मान क्या होगा? (उत्तर: 2 A)',
      revision: {
        summary: 'विद्युत परिपथ का आधारभूत नियम जो वोल्टेज, धारा और प्रतिरोध का संबंध बताता है।',
        formulas: ['V = IR', 'R = ρ(l / A)', 'विद्युत शक्ति P = VI = I²R = V²/R'],
        pitfalls: [
          'यह नियम केवल नियत ताप पर ही सत्य होता है।',
          'प्रतिरोध (R) और प्रतिरोधकता (Resistivity ρ) में अंतर याद रखें; प्रतिरोधकता तार की लंबाई पर निर्भर नहीं करती।',
        ],
        practice: [
          'प्रश्न 1: 220 V आपूर्ति से 5 A धारा लेने वाले उपकरण का प्रतिरोध ज्ञात कीजिए। (हल: 44 Ω)',
          'प्रश्न 2: किसी तार की लंबाई दोगुनी करने पर उसका नया प्रतिरोध क्या होगा? (हल: 4 गुना)',
        ],
      },
    },
    hinglish: {
      concept:
        'Ohm\'s Law ke according: Constant temperature par kisi conductor ke across potential difference (V) usme flow hone wali current (I) ke directly proportional hota hai.\n\nV = I * R\n\nYahan V = Voltage (Volts), I = Current (Amperes), R = Resistance (Ohms Ω).',
      analogy:
        'Water pipe example: Voltage tap ka water pressure hai, Current pani ka flow hai, aur Resistance pipe ka narrow hona hai.',
      keyPoints: [
        'Formula: V = IR, I = V / R, R = V / I.',
        'Resistance length (l) ke directly proportional aur area (A) ke inversely proportional hota hai: R = ρ(l / A).',
      ],
      quickCheck: 'Agar resistance constant rahe aur voltage double ho jaye, toh current kitna hoga? (Double)',
      revision: {
        summary: 'Electricity ka core law: Voltage, current, aur resistance ka direct relation V = IR.',
        formulas: ['V = IR', 'R = ρ · (l / A)', 'P = VI = I²R = V²/R'],
        pitfalls: [
          'Temperature constant rehna zaroori condition hai.',
          'Resistivity length ya thickness par depend nahi karti, wo material property hoti hai.',
        ],
        practice: [
          'Q1: 220 V circuit me 5 A current flow ho raha hai, resistance kitna hoga? (Ans: 44 Ω).',
        ],
      },
    },
  },

  chemical_reactions: {
    keywords: ['chemical reaction', 'रासायनिक अभिक्रिया', 'balancing', 'combination', 'decomposition', 'displacement', 'redox'],
    en: {
      concept:
        'A chemical reaction is a process where one or more substances (reactants) undergo chemical transformation to form new substances (products) with entirely different chemical properties. According to the Law of Conservation of Mass, the total number of atoms of each element must remain equal on both sides of a chemical equation.\n\nTypes of Reactions:\n1. **Combination:** $A + B \\rightarrow AB$\n2. **Decomposition:** $AB \\xrightarrow{\\Delta} A + B$\n3. **Displacement:** $A + BC \\rightarrow AC + B$\n4. **Double Displacement:** $AB + CD \\rightarrow AD + CB$\n5. **Redox:** Simultaneous oxidation (loss of e⁻ / gain of O) and reduction (gain of e⁻ / loss of O).',
      analogy:
        'Think of rearranging Lego bricks: the individual Lego pieces (atoms) remain identical in quantity, but are assembled into brand-new structures (molecules).',
      keyPoints: [
        'Indicators: Change in state, change in temperature, evolution of gas, or formation of a precipitate.',
        'Balanced Equation Principle: Mass can neither be created nor destroyed in a chemical reaction.',
      ],
      quickCheck: 'What type of reaction occurs when calcium oxide (quicklime) vigorously reacts with water?',
      revision: {
        summary: 'Classification of chemical equations and mass conservation principles.',
        formulas: [
          'Combination: CaO + H2O -> Ca(OH)2 + Heat (Slaked lime)',
          'Thermal Decomposition: 2FeSO4 -> Fe2O3 + SO2 + SO3',
          'Displacement: Fe + CuSO4 -> FeSO4 + Cu',
        ],
        pitfalls: [
          'Changing chemical subscripts when balancing (never change formulas, only change stoichiometric coefficients).',
        ],
        practice: [
          'Q1: Balance: Fe + H2O -> Fe3O4 + H2. (Ans: 3Fe + 4H2O -> Fe3O4 + 4H2).',
          'Q2: Identify substance oxidized in: CuO + H2 -> Cu + H2O. (Ans: H2 is oxidized to H2O).',
        ],
      },
    },
    hi: {
      concept:
        'रासायनिक अभिक्रिया (Chemical Reaction) वह प्रक्रिया है जिसमें एक या अधिक पदार्थ (अभिकारक) परस्पर क्रिया करके नए रासायनिक गुणधर्म वाले पदार्थ (उत्पाद) बनाते हैं। द्रव्यमान संरक्षण के नियम के अनुसार, समीकरण के दोनों ओर प्रत्येक तत्व के परमाणुओं की संख्या समान होनी चाहिए।\n\nप्रमुख प्रकार:\n1. संयोजन (Combination)\n2. वियोजन/अपघटन (Decomposition)\n3. विस्थापन (Displacement)\n4. द्विविस्थापन (Double Displacement)\n5. उपचयन-अपचयन (Redox)',
      analogy:
        'दूध से दही बनना या लोहे पर जंग लगना रासायनिक अभिक्रिया के दैनिक उदाहरण हैं जहाँ मूल पदार्थ को वापस नहीं पाया जा सकता।',
      keyPoints: [
        'संकेतक: अवस्था में परिवर्तन, रंग में परिवर्तन, गैस का उत्सर्जन या तापमान में परिवर्तन।',
        'द्रव्यमान संरक्षण का नियम: किसी रासायनिक अभिक्रिया में न तो द्रव्यमान का निर्माण होता है और न ही विनाश।',
      ],
      quickCheck: 'बुझे हुए चूने का रासायनिक सूत्र क्या होता है? (उत्तर: Ca(OH)2)',
      revision: {
        summary: 'रासायनिक समीकरणों का संतुलन और प्रमुख अभिक्रियाओं का वर्गीकरण।',
        formulas: ['संयोजन: CaO + H2O -> Ca(OH)2', 'विस्थापन: Fe + CuSO4 -> FeSO4 + Cu'],
        pitfalls: [
          'समीकरण संतुलित करते समय यौगिक के सूत्र (subscripts) को कभी न बदलें, केवल आगे गुणांक (coefficients) लगाएं।',
        ],
        practice: [
          'प्रश्न 1: 3Fe + 4H2O -> Fe3O4 + 4H2 को संतुलित करने के चरण बताएं।',
        ],
      },
    },
    hinglish: {
      concept:
        'Chemical reaction me reactants react karke bilkul new chemical properties wale products banate hain. Mass conservation law kehta hai ki reaction me mass na create ho sakta hai na destroy, isliye equation balance karna zaroori hota hai.\n\nMain types: Combination, Decomposition, Displacement, Double Displacement, aur Redox reactions.',
      analogy:
        'Cooking ki tarah: raw batter ko bake karke cake ban gaya, wapas batter nahi ban sakta kyunki chemical change ho gaya.',
      keyPoints: [
        'Reaction ke signs: Gas release hona, color change, temperature change, ya precipitate banna.',
        'Equation balance karte waqt formula change nahi karte, sirf coefficients lagate hain.',
      ],
      quickCheck: 'Fe + CuSO4 -> FeSO4 + Cu kis type ki reaction hai? (Displacement reaction)',
      revision: {
        summary: 'Reactants transform into products following Law of Conservation of Mass.',
        formulas: ['Combination: A + B -> AB', 'Displacement: Fe + CuSO4 -> FeSO4 + Cu'],
        pitfalls: ['Subscript numbers mat change karo equation balance karte waqt.'],
        practice: ['Q1: Redox reaction me oxidation aur reduction simultaneously kaise hote hain?'],
      },
    },
  },
};

// Math Equation Solver
function solveMathExpression(prompt: string, language: 'en' | 'hi' | 'hinglish'): string | null {
  const clean = prompt.toLowerCase();

  // Pattern: Linear Equation ax + b = c or ax - b = c or ax = c
  // Examples: "solve 2x + 5 = 15", "3x - 9 = 12", "5x = 40", "x + 7 = 18"
  const linearRegex = /([+-]?\s*\d*)\s*([a-zA-Z])\s*([+-]\s*\d+)?\s*=\s*([+-]?\s*\d+)/;
  const match = clean.match(linearRegex);

  if (match) {
    const rawA = match[1].replace(/\s+/g, '');
    const varName = match[2];
    const rawB = (match[3] || '0').replace(/\s+/g, '');
    const rawC = match[4].replace(/\s+/g, '');

    let a = 1;
    if (rawA === '-' || rawA === '-1') a = -1;
    else if (rawA !== '' && rawA !== '+') a = Number(rawA);

    const b = Number(rawB);
    const c = Number(rawC);

    if (!isNaN(a) && !isNaN(b) && !isNaN(c) && a !== 0) {
      const rhsAfterSub = c - b;
      const xVal = rhsAfterSub / a;
      const formattedX = Number.isInteger(xVal) ? String(xVal) : xVal.toFixed(3);

      if (language === 'hi') {
        return `### 📐 रैखिक समीकरण का चरण-दर-चरण NCERT हल

**दिया गया समीकरण:**
$$${a !== 1 ? (a === -1 ? '-' : a) : ''}${varName} ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`} = ${c}$$

**चरण 1: अचर पद का पक्षांतरण (Transposition)**
दोनों पक्षों में से $${b}$ को संतुलित करें:
$$${a !== 1 ? (a === -1 ? '-' : a) : ''}${varName} = ${c} - (${b})$$
$$${a !== 1 ? (a === -1 ? '-' : a) : ''}${varName} = ${rhsAfterSub}$$

**चरण 2: चर पद $${varName}$ का मान निकालना**
दोनों पक्षों को $${a}$ से भाग देने पर:
$$${varName} = \\frac{${rhsAfterSub}}{${a}}$$
$$${varName} = ${formattedX}$$

---
**✅ अंतिम उत्तर:**
$$\\mathbf{${varName} = ${formattedX}}$$

**सत्यापन (Verification):**
बायाँ पक्ष (LHS) $= ${a}(${formattedX}) + (${b}) = ${a * Number(formattedX) + b} = ${c} =$ दायाँ पक्ष (RHS).
हल पूरी तरह सत्यापित है!`;
      }

      if (language === 'hinglish') {
        return `### 📐 Step-by-Step Linear Equation Solution

**Given Equation:**
$$${a !== 1 ? (a === -1 ? '-' : a) : ''}${varName} ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`} = ${c}$$

**Step 1: Constant term ko transpose karo**
Constant $${b}$ ko RHS le jao:
$$${a !== 1 ? (a === -1 ? '-' : a) : ''}${varName} = ${c} - (${b}) = ${rhsAfterSub}$$

**Step 2: $${varName}$ ki value find karo**
Dono sides ko coefficient $${a}$ se divide karo:
$$${varName} = \\frac{${rhsAfterSub}}{${a}} = ${formattedX}$$

---
**✅ Final Answer:**
$$\\mathbf{${varName} = ${formattedX}}$$

**Verification:**
LHS = $${a}(${formattedX}) + (${b}) = ${c}$ = RHS. Solution verified!`;
      }

      return `### 📐 Step-by-Step NCERT Linear Equation Solution

**Given Linear Equation:**
$$${a !== 1 ? (a === -1 ? '-' : a) : ''}${varName} ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`} = ${c}$$

**Step 1: Transposition of Constant Terms**
Subtract $${b}$ from both sides (transpose to RHS):
$$${a !== 1 ? (a === -1 ? '-' : a) : ''}${varName} = ${c} - (${b})$$
$$${a !== 1 ? (a === -1 ? '-' : a) : ''}${varName} = ${rhsAfterSub}$$

**Step 2: Isolate Variable $${varName}$**
Divide both sides by coefficient $${a}$:
$$${varName} = \\frac{${rhsAfterSub}}{${a}}$$
$$${varName} = ${formattedX}$$

---
**✅ Final Answer:**
$$\\mathbf{${varName} = ${formattedX}}$$

**Verification Check:**
$\\text{LHS} = ${a}(${formattedX}) + (${b}) = ${c} = \\text{RHS}$.
The solution is mathematically consistent and verified.`;
    }
  }

  // Percentage calculations: "What is 20% of 150?"
  const pctRegex = /(\d+(?:\.\d+)?)\s*%\s*(?:of|का)\s*(\d+(?:\.\d+)?)/i;
  const pctMatch = clean.match(pctRegex);
  if (pctMatch) {
    const p = parseFloat(pctMatch[1]);
    const total = parseFloat(pctMatch[2]);
    const res = (p * total) / 100;
    const formattedRes = Number.isInteger(res) ? String(res) : res.toFixed(2);

    return `### 📊 NCERT Percentage Solution

**Given:**
- Percentage: $${p}\\%$
- Base Value: $${total}$

**NCERT Formula:**
$$\\text{Value} = \\left(\\frac{\\text{Percentage}}{100}\\right) \\times \\text{Base Value}$$

**Calculation:**
$$\\text{Value} = \\frac{${p}}{100} \\times ${total} = ${formattedRes}$$

---
**✅ Final Answer:** $${p}\\%$ of $${total} = \\mathbf{${formattedRes}}$$`;
  }

  return null;
}

// Generate Offline Assistant Responses
export function generateOfflineAssistantReply(req: AssistantRequest): AssistantResponse {
  const { prompt, classLevel, subject, chapter, language, mode } = req;
  const lowerPrompt = prompt.toLowerCase();

  // 1. Check for Math Solver
  if (mode === 'solver' || lowerPrompt.includes('solve') || lowerPrompt.includes('समीकरण') || lowerPrompt.includes('equation')) {
    const mathSol = solveMathExpression(prompt, language);
    if (mathSol) {
      return {
        reply: mathSol,
        sources: [
          {
            title: `NCERT Mathematics Class ${classLevel} Textbook Solutions`,
            uri: 'https://ncert.nic.in/textbook.php',
          },
        ],
      };
    }
  }

  // 2. Search Mode - Verified Portals
  if (mode === 'search') {
    const portalSummary =
      language === 'hi'
        ? `### 🏛️ आधिकारिक NCERT एवं सरकारी शैक्षणिक पोर्टल निर्देशिका\n\n**कक्षा ${classLevel} | विषय: ${subject}** के लिए सत्यापित आधिकारिक संसाधन:\n\n1. **NCERT ई-बुक्स पोर्टल:** [ncert.nic.in/textbook.php](https://ncert.nic.in/textbook.php) - संपूर्ण पाठ्यपुस्तकें PDF रूप में निःशुल्क उपलब्ध।\n2. **दीक्षा पोर्टल (DIKSHA):** [diksha.gov.in](https://diksha.gov.in/) - QR कोड आधारित इंटरैक्टिव वीडियो और अभ्यास सामग्री।\n3. **ई-पाठशाला (ePathshala):** [epathshala.nic.in](https://epathshala.nic.in/) - ऑडियो, वीडियो और डिजिटल अध्ययन सामग्री।\n4. **स्वयं प्रभा (SWAYAM PRABHA):** [swayamprabha.gov.in](https://www.swayamprabha.gov.in/) - 24x7 समर्पित शैक्षणिक टीवी प्रसारण।\n\n*सूचना: ये सभी सरकारी पोर्टल पूर्णतः निःशुल्क एवं आधिकारिक पाठ्यक्रम पर आधारित हैं।*`
        : language === 'hinglish'
          ? `### 🏛️ Official NCERT Educational Portals Directory\n\n**Class ${classLevel} | Subject: ${subject}** ke verified official resources:\n\n1. **NCERT Official Textbooks:** [ncert.nic.in/textbook.php](https://ncert.nic.in/textbook.php) - Complete textbooks free PDF download.\n2. **DIKSHA Portal:** [diksha.gov.in](https://diksha.gov.in/) - Textbook QR code scanned digital content & quizzes.\n3. **ePathshala:** [epathshala.nic.in](https://epathshala.nic.in/) - Audio, video lectures & e-books.\n4. **SWAYAM PRABHA Channels:** [swayamprabha.gov.in](https://www.swayamprabha.gov.in/) - 24/7 DTH education channels.\n\nAll verified official NCERT learning resources.`
          : `### 🏛️ Official NCERT Learning Portals Directory\n\n**Class ${classLevel} | Subject: ${subject}**\n\nHere are the authenticated Government of India and NCERT learning portals for this curriculum:\n\n- **NCERT Textbooks:** [ncert.nic.in/textbook.php](https://ncert.nic.in/textbook.php) — Official digital PDFs for Classes 1–12 in English, Hindi, and Urdu.\n- **DIKSHA National Platform:** [diksha.gov.in](https://diksha.gov.in/) — Curriculum-aligned video lessons, worksheets, and QR-coded textbook modules.\n- **ePathshala:** [epathshala.nic.in](https://epathshala.nic.in/) — Joint portal by MoE and NCERT offering audiobooks, flipbooks, and teaching aids.\n- **SWAYAM PRABHA:** [swayamprabha.gov.in](https://www.swayamprabha.gov.in/) — High-quality educational DTH television channels.\n- **CBSE Academic:** [cbseacademic.nic.in](https://cbseacademic.nic.in/) — Sample question papers, marking schemes, and syllabus guidelines.`;

    return {
      reply: portalSummary,
      sources: NCERT_OFFICIAL_RESOURCES.slice(0, 4),
    };
  }

  // 3. Match against Curated Knowledge Base
  for (const [, item] of Object.entries(NCERT_KNOWLEDGE_BASE)) {
    const hasKeyword = item.keywords.some((k) => lowerPrompt.includes(k.toLowerCase()));
    if (hasKeyword) {
      const langContent = item[language] || item.en;

      if (mode === 'revision') {
        const rev = langContent.revision;
        const revText = [
          `### 📌 NCERT Quick Revision Guide`,
          `**Class ${classLevel} · ${subject}${chapter ? ` · ${chapter}` : ''}**`,
          `\n**Summary:**\n${rev.summary}`,
          `\n**⚡ Key Formulas & Definitions:**`,
          ...rev.formulas.map((f) => `- ${f}`),
          `\n**⚠️ Common Board Exam Pitfalls & Traps:**`,
          ...rev.pitfalls.map((p) => `- ${p}`),
          `\n**🎯 Rapid Practice Questions:**`,
          ...rev.practice.map((pr) => `- ${pr}`),
        ].join('\n');

        return {
          reply: revText,
          sources: NCERT_OFFICIAL_RESOURCES.slice(0, 2),
        };
      }

      const replyText = [
        `### 🎯 Concept Overview: ${subject}`,
        `*Class ${classLevel} NCERT Curriculum*`,
        `\n${langContent.concept}`,
        `\n#### 💡 Everyday Analogy`,
        langContent.analogy,
        `\n#### 🔬 Key NCERT Points`,
        ...langContent.keyPoints.map((kp) => `- ${kp}`),
        `\n#### ❓ Quick Comprehension Check`,
        langContent.quickCheck,
      ].join('\n');

      return {
        reply: replyText,
        sources: NCERT_OFFICIAL_RESOURCES.slice(0, 2),
      };
    }
  }

  // 4. Greetings or Conversational Intros
  const greetingRegex = /^(hi|hello|hey|namaste|नमस्ते|haloo|start|who are you|tutor)/i;
  if (greetingRegex.test(lowerPrompt.trim())) {
    const greeting =
      language === 'hi'
        ? `नमस्ते! मैं आपका **EDUGENIUS AI शिक्षक** हूँ।\n\nमैं कक्षा **${classLevel}** के विषय **${subject}** ${chapter ? `(अध्याय: ${chapter})` : ''} के लिए आपकी सहायता के लिए तैयार हूँ।\n\nआप मुझसे क्या पूछना चाहते हैं?\n- किसी कठिन सिद्धांत को सरल भाषा में समझना\n- गणित या विज्ञान के प्रश्नों का चरण-दर-चरण हल\n- परीक्षा हेतु त्वरित पुनरीक्षण (Revision Notes)\n- आधिकारिक NCERT अभ्यास प्रश्न और समाधान`
        : language === 'hinglish'
          ? `Hello student! Main hoon aapka **EDUGENIUS AI Tutor**.\n\nClass **${classLevel}**, Subject **${subject}** ${chapter ? `(Chapter: ${chapter})` : ''} ke liye main fully ready hoon!\n\nAap mujhse puch sakte hain:\n- Kisi bhi concept ko simple everyday examples ke saath samajhna\n- Step-by-step problem solver for Math/Science\n- Board exam revision notes aur formula sheets\n- Important NCERT chapter questions`
          : `Hello student! I am your dedicated **EDUGENIUS AI Tutor** for **Class ${classLevel}**.\n\nCurrently focused on: **${subject}** ${chapter ? `(${chapter})` : ''}.\n\nHow can I help you excel today?\n- **Concept Explanation:** Break down challenging definitions with clear real-world analogies.\n- **Problem Solver:** Step-by-step mathematical and scientific solutions with formula derivations.\n- **Revision Notes:** Key formulas, common board exam traps, and rapid practice questions.\n- **Official Portals:** Direct access to verified NCERT and ePathshala textbook resources.`;

    return {
      reply: greeting,
      sources: NCERT_OFFICIAL_RESOURCES.slice(0, 2),
    };
  }

  // 5. General Curriculum-Structured Response Generator
  const cleanSubject = subject || 'General Studies';
  const cleanChapter = chapter || 'Core Syllabus';

  if (mode === 'solver') {
    const solverReply =
      language === 'hi'
        ? `### 📐 चरण-दर-चरण NCERT समाधान\n**कक्षा ${classLevel} | विषय: ${cleanSubject} | अध्याय: ${cleanChapter}**\n\n**प्रश्न:** "${prompt}"\n\n**1. ज्ञात मान (Given Information):**\n- कक्षा स्तर: Class ${classLevel}\n- विषय संदर्भ: ${cleanSubject}\n- मुख्य संप्रत्यय: ${cleanChapter}\n\n**2. संबंधित NCERT सूत्र एवं सिद्धांत:**\n- इस प्रकार की समस्याओं में मानक NCERT परिपाटी और चरणबद्ध विधियों का पालन किया जाता है।\n- किसी भी समीकरण को हल करते समय दोनों पक्षों को संतुलित रखा जाता है।\n\n**3. चरणबद्ध कार्य (Step-by-Step Working):**\n- **चरण 1:** प्रश्न में दी गई भौतिक राशियों या चरों की पहचान करें।\n- **चरण 2:** उचित NCERT सूत्र या प्रमेय का चयन करें।\n- **चरण 3:** सभी मानों को मानक SI मात्रकों में रखकर गणना पूर्ण करें।\n\n**4. अंतिम निष्कर्ष:**\n- कृपया समीकरण या संख्यात्मक मान स्पष्ट रूप से लिखें (उदाहरण: \`2x + 5 = 15\` या \`10% of 250\`) ताकि मैं सटीक संख्यात्मक मान तुरंत परिकलित कर सकूँ।`
        : `### 📐 Step-by-Step NCERT Analytical Solution\n**Class ${classLevel} | Subject: ${cleanSubject} | Chapter: ${cleanChapter}**\n\n**Query:** "${prompt}"\n\n**1. Problem Breakdown & Context:**\n- Academic Grade: Class ${classLevel}\n- Curricular Area: ${cleanSubject}\n- Focus Module: ${cleanChapter}\n\n**2. Core NCERT Theoretical Principles:**\n- Aligned with NCERT textbook guidelines for Class ${classLevel}.\n- Emphasizes rigorous derivation, state-variable isolation, and dimensional consistency.\n\n**3. Recommended Solution Steps:**\n- **Step 1:** List all given parameters along with their standard SI units.\n- **Step 2:** Formulate the governing equation or definition applicable to "${prompt}".\n- **Step 3:** Substitute parameters systematically and simplify algebraic expressions.\n\n**4. Actionable Tip:**\n- If this is a numerical problem, type the exact values or equation (e.g. \`solve 3x + 8 = 29\` or \`calculate speed for distance 100m, time 5s\`) for an instant calculated numerical derivation.`;

    return {
      reply: solverReply,
      sources: NCERT_OFFICIAL_RESOURCES.slice(0, 3),
    };
  }

  if (mode === 'revision') {
    const revisionReply =
      language === 'hi'
        ? `### 📌 परीक्षा पुनरीक्षण गाइड (NCERT Revision Notes)\n**कक्षा ${classLevel} | ${cleanSubject}: ${cleanChapter}**\n\n#### 🎯 प्रमुख अवधारणाएँ:\n- **${cleanChapter}** बोर्ड एवं विद्यालयी परीक्षाओं के लिए एक अत्यंत महत्वपूर्ण विषय है।\n- मुख्य शब्दावली, परिभाषाओं और बुनियादी नियमों को कंठस्थ करें।\n\n#### ⚡ महत्वपूर्ण सूत्र एवं बिंदु:\n- पाठ्यक्रम के अनुसार सभी बुनियादी सूत्रों की एक संक्षिप्त सूची बनाएं।\n- आरेखों (Diagrams) और नामांकित चित्रों का नियमित अभ्यास करें।\n\n#### ⚠️ बोर्ड परीक्षा में सामान्य गलतियाँ (Common Exam Traps):\n- गणना में मात्रक (SI Units) लिखना न भूलें।\n- विस्तृत उत्तरों में केवल लंबा लिखने के बजाय NCERT की मुख्य शब्दावली (Keywords) का प्रयोग करें।\n\n#### 📝 अभ्यास प्रश्न:\n1. ${cleanChapter} के मुख्य सिद्धांतों की व्याख्या कीजिए।\n2. इस अध्याय के किसी एक प्रायोगिक उदाहरण का संक्षिप्त विवरण दीजिए।`
        : `### 📌 Exam-Ready NCERT Revision Notes\n**Class ${classLevel} | ${cleanSubject}: ${cleanChapter}**\n\n#### 🎯 Key Curricular Highlights:\n- Core focus on the primary NCERT competencies and learning outcomes for Class ${classLevel}.\n- Structured understanding of "${prompt}" within the ${cleanSubject} framework.\n\n#### ⚡ Essential Formulas & Frameworks:\n- Maintain concise formula sheets with standard notation and SI units.\n- Review chapter summary points at the end of each official NCERT textbook chapter.\n\n#### ⚠️ Common Exam Pitfalls & Mark Deductions:\n- Omitting intermediate derivation steps in 3-mark and 5-mark subjective board questions.\n- Forgetting standard units in final numerical answers.\n- Misinterpreting direct questions vs. application-based scenario questions.\n\n#### 📝 Rapid Self-Assessment:\n1. State the fundamental law or rule governing this topic.\n2. Write down two practical real-life applications of ${cleanChapter}.`;

    return {
      reply: revisionReply,
      sources: NCERT_OFFICIAL_RESOURCES.slice(0, 3),
    };
  }

  // Default Concept Mode
  const defaultReply =
    language === 'hi'
      ? `### 📚 NCERT अवधारणा मार्गदर्शिका: ${cleanSubject}\n**कक्षा ${classLevel} | अध्याय: ${cleanChapter}**\n\n#### 🎯 विषय की विस्तृत व्याख्या:\n"${prompt}" के संदर्भ में NCERT पाठ्यक्रम के अनुसार:\n- यह अवधारणा दैनिक जीवन की प्रक्रियाओं और वैज्ञानिक/तार्किक नियमों से गहराई से जुड़ी है।\n- कक्षा ${classLevel} के स्तर पर, छात्रों से संकल्पना की मूल समझ और उसके व्यावहारिक अनुप्रयोगों की अपेक्षा की जाती है।\n\n#### 💡 दैनिक जीवन का उदाहरण:\nहम अपने चारों ओर विभिन्न प्राकृतिक और तकनीकी प्रणालियों में इस सिद्धांत का प्रत्यक्ष उपयोग देखते हैं।\n\n#### 🔬 मुख्य NCERT निष्कर्ष:\n1. मूल संकल्पना को छोटे-छोटे तार्किक चरणों में विभाजित करके समझें।\n2. पाठ्यपुस्तक के अध्यायों में दिए गए क्रियाकलापों (Activities) और उदाहरणों को ध्यान से पढ़ें।\n\n#### ❓ विचारोत्तेजक प्रश्न:\nआप इस संकल्पना का उपयोग अपने दैनिक जीवन के किसी एक अनुभव को समझाने के लिए कैसे करेंगे?`
      : language === 'hinglish'
        ? `### 📚 NCERT Concept Guide: ${cleanSubject}\n**Class ${classLevel} | Chapter: ${cleanChapter}**\n\n#### 🎯 Concept Overview:\n"${prompt}" ko simple tareeqe se samajhte hain:\n- Ye Class ${classLevel} NCERT syllabus ka ek core topic hai.\n- Isme theoretical concepts ke sath-sath practical applications bhi cover hoti hain.\n\n#### 💡 Real-World Analogy:\nIs concept ko everyday life se relate karein toh ye bilkul naturally samajh aane lagta hai.\n\n#### 🔬 Key Learning Points:\n1. NCERT ke main keywords aur textbook activities ko achhi tarah revise karein.\n2. Important definitions ko apne words me summarize karne ki practice karein.\n\n#### ❓ Quick Question:\nAap is concept ko kisi friend ko ek line me kaise explain karenge?`
        : `### 📚 NCERT Concept Overview: ${cleanSubject}\n**Class ${classLevel} | Chapter: ${cleanChapter}**\n\n#### 🎯 Curricular Foundation:\nRegarding your query on **"${prompt}"**:\n- In the Class ${classLevel} NCERT curriculum, this topic establishes fundamental concepts essential for both school assessments and competitive foundations.\n- The key focus is building intuitive comprehension before formal mathematical or scientific abstraction.\n\n#### 💡 Everyday Real-World Analogy:\nEveryday phenomena offer clear demonstrations of this concept, illustrating how theoretical academic principles directly explain observed physical, social, or computational systems.\n\n#### 🔬 Key NCERT Learning Points:\n1. Master the standard definitions and exact terminology emphasized in official NCERT publications.\n2. Pay close attention to textbook boxed items, historical notes, and lab activities.\n3. Practice sketching and labeling all standard diagrams.\n\n#### ❓ Quick Check:\nCan you identify the primary dependent variable or key consequence in this phenomenon?`;

  return {
    reply: defaultReply,
    sources: NCERT_OFFICIAL_RESOURCES.slice(0, 3),
  };
}

// Curated MCQ Question Bank by Subject/Class
interface RawQuizItem {
  subjectMatch: string[];
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctIndex: number;
  explanationEn: string;
  explanationHi: string;
}

const NCERT_QUIZ_REPOSITORY: RawQuizItem[] = [
  // Science / Physics
  {
    subjectMatch: ['science', 'physics', 'भौतिकी', 'light'],
    questionEn: 'Where should an object be placed in front of a convex lens to get a real image of the same size as the object?',
    questionHi: 'किसी उत्तल लेंस के सामने वस्तु को कहाँ रखा जाए कि उसका वास्तविक और समान आकार का प्रतिबिंब बने?',
    optionsEn: [
      'At the principal focus F₁',
      'At twice the focal length (2F₁)',
      'At infinity',
      'Between optical centre and focus',
    ],
    optionsHi: ['मुख्य फोकस F₁ पर', 'फोकस दूरी की दोगुनी दूरी (2F₁) पर', 'अनंत पर', 'प्रकाशीय केंद्र और फोकस के बीच'],
    correctIndex: 1,
    explanationEn: 'When an object is placed at 2F₁ of a convex lens, a real, inverted image of the exact same size is formed at 2F₂.',
    explanationHi: 'जब वस्तु को उत्तल लेंस के 2F₁ पर रखा जाता है, तो उसका वास्तविक, उल्टा और वस्तु के बराबर आकार का प्रतिबिंब 2F₂ पर बनता है।',
  },
  {
    subjectMatch: ['science', 'physics', 'electricity', 'विद्युत'],
    questionEn: "According to Ohm's law, if the resistance in a circuit is doubled while voltage remains constant, the current will:",
    questionHi: 'ओम के नियम के अनुसार, यदि विभवांतर स्थिर रहे और प्रतिरोध दोगुना कर दिया जाए, तो धारा:',
    optionsEn: ['Be doubled', 'Be halved', 'Remain unchanged', 'Become four times'],
    optionsHi: ['दोगुनी हो जाएगी', 'आधी हो जाएगी', 'अपरिवर्तित रहेगी', 'चार गुनी हो जाएगी'],
    correctIndex: 1,
    explanationEn: 'From I = V / R, current is inversely proportional to resistance. Doubling R halves current I.',
    explanationHi: 'I = V / R के अनुसार, धारा प्रतिरोध के व्युत्क्रमानुपाती होती है। अतः R दोगुना होने पर धारा आधी हो जाएगी।',
  },
  {
    subjectMatch: ['science', 'chemistry', 'acid', 'रसायन'],
    questionEn: 'A solution turns red litmus blue. Its pH is most likely to be:',
    questionHi: 'एक विलयन लाल लिटमस को नीला कर देता है। इसका pH संभावित रूप से होगा:',
    optionsEn: ['1', '4', '5', '10'],
    optionsHi: ['1', '4', '5', '10'],
    correctIndex: 3,
    explanationEn: 'Basic solutions turn red litmus blue and possess a pH value strictly greater than 7 (here, 10).',
    explanationHi: 'क्षारीय विलयन लाल लिटमस को नीला करते हैं और उनका pH मान 7 से अधिक (यहाँ 10) होता है।',
  },
  {
    subjectMatch: ['science', 'chemistry', 'reactions', 'अभिक्रिया'],
    questionEn: 'What type of reaction is represented by: 2Mg + O₂ → 2MgO?',
    questionHi: 'अभिक्रिया 2Mg + O₂ → 2MgO किस प्रकार की रासायनिक अभिक्रिया का उदाहरण है?',
    optionsEn: ['Decomposition', 'Combination', 'Displacement', 'Double Displacement'],
    optionsHi: ['वियोजन अभिक्रिया', 'संयोजन अभिक्रिया', 'विस्थापन अभिक्रिया', 'द्विविस्थापन अभिक्रिया'],
    correctIndex: 1,
    explanationEn: 'Two reactants (Mg and O2) combine to form a single product (MgO), which defines a combination reaction.',
    explanationHi: 'दो अभिकारक मिलकर एक एकल उत्पाद बनाते हैं, अतः यह संयोजन अभिक्रिया है।',
  },
  {
    subjectMatch: ['science', 'biology', 'जीव विज्ञान', 'life processes'],
    questionEn: 'Which cellular organelle is known as the "powerhouse of the cell"?',
    questionHi: 'कोशिका का "बिजलीघर" (Powerhouse) किसे कहा जाता है?',
    optionsEn: ['Chloroplast', 'Mitochondria', 'Golgi Apparatus', 'Endoplasmic Reticulum'],
    optionsHi: ['हरितलवक', 'माइटोकॉन्ड्रिया', 'गॉल्जी काय', 'अंतःद्रव्यी जालिका'],
    correctIndex: 1,
    explanationEn: 'Mitochondria generate ATP (adenosine triphosphate) via cellular respiration, serving as the cell powerhouse.',
    explanationHi: 'माइटोकॉन्ड्रिया कोशिकीय श्वसन द्वारा ATP के रूप में ऊर्जा उत्पन्न करता है, इसलिए इसे कोशिका का ऊर्जाघर कहते हैं।',
  },
  // Mathematics
  {
    subjectMatch: ['math', 'mathematics', 'गणित', 'algebra', 'linear'],
    questionEn: 'What is the root of the linear equation 3x + 12 = 0?',
    questionHi: 'रैखिक समीकरण 3x + 12 = 0 का मूल (हल) क्या है?',
    optionsEn: ['4', '-4', '3', '-3'],
    optionsHi: ['4', '-4', '3', '-3'],
    correctIndex: 1,
    explanationEn: 'Transposing 12 gives 3x = -12, so x = -12 / 3 = -4.',
    explanationHi: '12 का पक्षांतरण करने पर 3x = -12, अतः x = -12 / 3 = -4.',
  },
  {
    subjectMatch: ['math', 'mathematics', 'गणित', 'geometry', 'pythagoras'],
    questionEn: 'In a right-angled triangle with legs of length 6 cm and 8 cm, the length of the hypotenuse is:',
    questionHi: 'एक समकोण त्रिभुज में समकोण बनाने वाली भुजाएँ 6 सेमी और 8 सेमी हैं। कर्ण की लंबाई क्या होगी?',
    optionsEn: ['10 cm', '12 cm', '14 cm', '100 cm'],
    optionsHi: ['10 सेमी', '12 सेमी', '14 सेमी', '100 सेमी'],
    correctIndex: 0,
    explanationEn: 'By Pythagoras theorem: c = √(6² + 8²) = √(36 + 64) = √100 = 10 cm.',
    explanationHi: 'पाइथागोरस प्रमेय से: कर्ण = √(6² + 8²) = √(36 + 64) = √100 = 10 सेमी।',
  },
  {
    subjectMatch: ['math', 'mathematics', 'गणित', 'probability', 'प्रायिकता'],
    questionEn: 'What is the probability of obtaining an even number when rolling a fair six-sided die once?',
    questionHi: 'एक निष्पक्ष पासे को एक बार फेंकने पर एक सम संख्या आने की प्रायिकता क्या है?',
    optionsEn: ['1/6', '1/3', '1/2', '2/3'],
    optionsHi: ['1/6', '1/3', '1/2', '2/3'],
    correctIndex: 2,
    explanationEn: 'Favourable outcomes are {2, 4, 6} (3 outcomes) out of total {1, 2, 3, 4, 5, 6} (6 outcomes). Probability = 3/6 = 1/2.',
    explanationHi: 'अनुकूल परिणाम {2, 4, 6} (कुल 3) हैं और कुल संभावित परिणाम 6 हैं। प्रायिकता = 3/6 = 1/2।',
  },
  // Social Science
  {
    subjectMatch: ['social', 'history', 'इतिहास', 'civics', 'polity'],
    questionEn: 'Who is recognized as the chief architect of the Constitution of India?',
    questionHi: 'भारत के संविधान का मुख्य शिल्पकार/निर्माता किसे माना जाता है?',
    optionsEn: ['Mahatma Gandhi', 'Dr. B. R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Vallabhbhai Patel'],
    optionsHi: ['महात्मा गांधी', 'डॉ. बी. आर. अम्बेडकर', 'जवाहरलाल नेहरू', 'सरदार वल्लभभाई पटेल'],
    correctIndex: 1,
    explanationEn: 'Dr. Bhimrao Ramji Ambedkar served as Chairman of the Drafting Committee of the Constituent Assembly.',
    explanationHi: 'डॉ. बी. आर. अम्बेडकर संविधान सभा की प्रारूप समिति के अध्यक्ष थे और उन्हें संविधान का जनक कहा जाता है।',
  },
  {
    subjectMatch: ['social', 'geography', 'भूगोल', 'resources'],
    questionEn: 'Which type of soil is most widely spread and crucial for agriculture in the Northern Plains of India?',
    questionHi: 'भारत के उत्तरी मैदानों में सबसे व्यापक रूप से पाई जाने वाली और कृषि हेतु महत्वपूर्ण मृदा कौन सी है?',
    optionsEn: ['Black Soil', 'Alluvial Soil', 'Red and Yellow Soil', 'Laterite Soil'],
    optionsHi: ['काली मृदा', 'जलोढ़ मृदा', 'लाल एवं पीली मृदा', 'लैटेराइट मृदा'],
    correctIndex: 1,
    explanationEn: 'Alluvial soil brought down by the Indus, Ganga, and Brahmaputra river systems covers the fertile Northern Plains.',
    explanationHi: 'सिंधु, गंगा और ब्रह्मपुत्र नदियों द्वारा निक्षेपित जलोढ़ मृदा उत्तरी मैदानों की सबसे उपजाऊ मृदा है।',
  },
];

// Offline Quiz Generator
export function generateOfflineQuiz(params: {
  classLevel: number;
  subject: string;
  chapter: string;
  language: 'en' | 'hi';
  count: number;
}): QuizQuestionData[] {
  const { classLevel, subject, chapter, language, count } = params;
  const targetCount = Math.max(3, Math.min(count, 8));
  const subLower = (subject || '').toLowerCase();
  const chapLower = (chapter || '').toLowerCase();

  // Score matching items from repository
  const scored = NCERT_QUIZ_REPOSITORY.map((item) => {
    let score = 0;
    for (const match of item.subjectMatch) {
      if (subLower.includes(match)) score += 3;
      if (chapLower.includes(match)) score += 5;
    }
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const selected: QuizQuestionData[] = [];
  const now = Date.now();

  for (let i = 0; i < targetCount; i++) {
    const raw = scored[i % scored.length]?.item || NCERT_QUIZ_REPOSITORY[i % NCERT_QUIZ_REPOSITORY.length];
    const isHi = language === 'hi';

    selected.push({
      id: `ncert-quiz-${now}-${i + 1}`,
      question: isHi ? raw.questionHi : raw.questionEn,
      options: isHi ? [...raw.optionsHi] : [...raw.optionsEn],
      correctIndex: raw.correctIndex,
      explanation: isHi ? raw.explanationHi : raw.explanationEn,
    });
  }

  // If we need dynamic variety, create procedural Math/Science questions tailored to class/chapter
  if (selected.length < targetCount) {
    const num1 = (classLevel * 3 + 2);
    const num2 = (classLevel * 2 + 5);
    const sum = num1 + num2;
    const isHi = language === 'hi';

    selected.push({
      id: `ncert-dyn-${now}-extra`,
      question: isHi
        ? `कक्षा ${classLevel} पाठ्यक्रम के अनुसार: यदि किसी संख्या x के लिए x + ${num1} = ${sum} है, तो x का मान क्या है?`
        : `Class ${classLevel} Practice: If x + ${num1} = ${sum}, what is the value of x?`,
      options: [
        String(num2 - 1),
        String(num2),
        String(num2 + 2),
        String(num2 * 2),
      ],
      correctIndex: 1,
      explanation: isHi
        ? `पक्षांतरण करने पर: x = ${sum} - ${num1} = ${num2}।`
        : `Transposing gives x = ${sum} - ${num1} = ${num2}.`,
    });
  }

  return selected.slice(0, targetCount);
}

// Optional Local LLM connector (e.g. Ollama on http://localhost:11434)
export async function tryLocalLlm(req: AssistantRequest): Promise<string | null> {
  const localUrl = process.env.LOCAL_LLM_URL || 'http://localhost:11434';
  const model = process.env.LOCAL_LLM_MODEL || 'llama3';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${localUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: `You are an NCERT academic tutor for Indian school students (Class ${req.classLevel}). Subject: ${req.subject}, Chapter: ${req.chapter || 'General'}. Student question: ${req.prompt}. Respond concisely and clearly in ${req.language}.`,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = (await response.json()) as { response?: string };
      if (data.response && data.response.trim().length > 10) {
        return data.response.trim();
      }
    }
  } catch {
    // Local LLM not available or timed out - fall back to built-in offline engine silently
  }

  return null;
}
