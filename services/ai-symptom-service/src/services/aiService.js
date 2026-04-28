const MOCK_DATA = [
    {
        keywords: ["fever", "cough", "throat", "shivering", "chills", "runny nose", "cold"],
        condition: "Viral Respiratory Infection or Influenza",
        specialty: "General Physician",
        advice: "Ensure plenty of rest and hydration. Monitor temperature regularly."
    },
    {
        keywords: ["headache", "migraine", "dizziness", "vertigo", "confusion", "numbness"],
        condition: "Neurological Concern (Possible Migraine or Tension Headache)",
        specialty: "Neurologist",
        advice: "Rest in a dark, quiet room. Avoid screen time and bright lights."
    },
    {
        keywords: ["chest pain", "short of breath", "palpitations", "rapid heartbeat", "tightness"],
        condition: "Cardiovascular Distress (Immediate Evaluation Recommended)",
        specialty: "Cardiologist / Emergency Medicine",
        advice: "Seek immediate medical attention if pain is severe or radiating to the arm/jaw."
    },
    {
        keywords: ["stomach pain", "nausea", "vomiting", "diarrhea", "bloating", "acid", "heartburn"],
        condition: "Gastrointestinal Disorder (Gastritis or Acid Reflux)",
        specialty: "Gastroenterologist",
        advice: "Avoid spicy or oily foods. Try small, frequent meals."
    },
    {
        keywords: ["back pain", "joint pain", "swelling", "fracture", "sprane", "muscle ache"],
        condition: "Musculoskeletal Issue / Orthopedic Strain",
        specialty: "Orthopedic Surgeon / Physiotherapist",
        advice: "Avoid heavy lifting. Use cold or warm compresses depending on inflammation."
    },
    {
        keywords: ["rash", "itchy", "skin", "acne", "burn", "redness", "lesion"],
        condition: "Dermatological Condition",
        specialty: "Dermatologist",
        advice: "Avoid scratching. Apply hypoallergenic moisturizers if needed."
    },
    {
        keywords: ["ear pain", "hearing loss", "ringing", "nose bleed", "difficulty swallowing"],
        condition: "ENT (Ear, Nose, and Throat) Condition",
        specialty: "Otolaryngologist (ENT Specialist)",
        advice: "Avoid inserting anything into the ear canal."
    },
    {
        keywords: ["blurry vision", "eye pain", "red eyes", "dry eyes", "seeing spots"],
        condition: "Ocular Concern / Vision Impairment",
        specialty: "Ophthalmologist",
        advice: "Restrict screen time and avoid rubbing the eyes."
    },
    {
        keywords: ["thirsty", "tired", "weight loss", "frequent urination", "sugar"],
        condition: "Metabolic Concern (Possible Endocrine Issue)",
        specialty: "Endocrinologist",
        advice: "Monitor fluid intake and dietary habits."
    },
    {
        keywords: ["anxiety", "depression", "panic", "sleep issues", "mood swings"],
        condition: "Mental Health Concern",
        specialty: "Psychiatrist / Psychologist",
        advice: "Practice mindfulness and consider talking to a counselor."
    },
    {
        keywords: ["urinary", "kidney", "bladder", "burning sensation"],
        condition: "Urological Infection or Condition",
        specialty: "Urologist",
        advice: "Increase water intake and avoid caffeine."
    }
];

export const analyzeSymptoms = async (symptoms) => {
    console.log("Analyzing symptoms (Enhanced Mock Mode):", symptoms);
    
    const input = symptoms.toLowerCase();
    
    // Logic to find the best match based on keyword frequency or first match
    // Here we use find but we could also sort by number of matches for better accuracy
    let match = MOCK_DATA.find(m => m.keywords.some(k => input.includes(k)));

    if (!match) {
        match = {
            condition: "Undetermined Symptom Complex",
            specialty: "Internal Medicine Specialist",
            advice: "Please provide more details or consult a general practitioner for an initial screening."
        };
    }

    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 1200));

    return `### 🩺 BioGrid AI Analysis Result

**Symptoms Analyzed:** "${symptoms}"

---

**1. Primary Suggestion:** 
The symptoms provided are consistent with a **${match.condition}**.

**2. Recommended Specialist:** 
We recommend consulting a **${match.specialty}** for a thorough examination.

**3. Initial Guidance:**
${match.advice}

---
*Disclaimer: This is a simulated analysis based on predefined medical patterns. It is NOT a professional diagnosis. If you are experiencing an emergency, please call your local emergency services immediately.*`;
};