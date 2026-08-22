export type SchemeResult = {
  gesture: string;
  title: string;
  summary: string;
  eligibility: string[];
  documents: string[];
  applySteps: string[];
  source: string;
};

// Mock orchestrator responses — shape matches the /api/v1/process contract
// (response.title / summary / eligibility / documents, accessible_output.text).
// Real data will come from Tejasvi's RAG pipeline once it's connected; the
// gesture -> scheme mapping will come from Aditi's ISL classifier.
export const MOCK_SCHEMES: Record<string, SchemeResult> = {
  Scholarship: {
    gesture: "Scholarship",
    title: "National Scholarship for Students with Disabilities",
    summary:
      "A central government scholarship covering tuition and maintenance costs for students with disabilities enrolled in recognised institutions.",
    eligibility: [
      "Indian citizen with a certified disability of 40% or more",
      "Enrolled in a recognised school, college or university",
      "Family income below the prescribed annual limit",
    ],
    documents: ["Disability certificate", "Income certificate", "Previous year mark sheet", "Aadhaar card"],
    applySteps: [
      "Register on the National Scholarship Portal",
      "Fill in institution and course details",
      "Upload required documents",
      "Submit before the term deadline",
    ],
    source: "Department of Empowerment of Persons with Disabilities",
  },
  "Ration card": {
    gesture: "Ration card",
    title: "Ration Card Application (NFSA)",
    summary:
      "A subsidised food-grain entitlement for eligible households under the National Food Security Act, issued by the state government.",
    eligibility: [
      "Resident of the state where applying",
      "Household income within the state's eligibility ceiling",
      "No existing ration card in another state",
    ],
    documents: ["Aadhaar card", "Address proof", "Income certificate", "Passport-size photo"],
    applySteps: [
      "Apply on your state's food and civil supplies portal",
      "Enter household member details",
      "Upload address and income proof",
      "Visit the ration office for verification if requested",
    ],
    source: "Department of Food and Public Distribution",
  },
  Pension: {
    gesture: "Pension",
    title: "Indira Gandhi National Disability Pension Scheme",
    summary:
      "A monthly pension for persons with severe or multiple disabilities from households below the poverty line.",
    eligibility: [
      "Disability of 80% or more, or multiple disabilities",
      "Household below the poverty line (BPL)",
      "Age 18 years or above",
    ],
    documents: ["Disability certificate", "BPL card", "Age proof", "Bank account details"],
    applySteps: [
      "Apply at your local gram panchayat or municipal office",
      "Submit disability and BPL documents",
      "Get verified by the local welfare officer",
      "Pension is credited monthly to your bank account",
    ],
    source: "Ministry of Rural Development",
  },
};

export const GESTURE_WORDS = Object.keys(MOCK_SCHEMES);
