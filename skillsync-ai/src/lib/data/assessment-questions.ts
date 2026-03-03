import type { AssessmentQuestion, LikertOption } from "@/lib/types/assessment";

const likertOptions: LikertOption[] = [
  { value: 0, label: "Strongly Disagree" },
  { value: 1, label: "Disagree" },
  { value: 2, label: "Neutral" },
  { value: 3, label: "Agree" },
  { value: 4, label: "Strongly Agree" },
];

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  { id: 1, text: "I would enjoy repairing mechanical equipment or electronics.", category: "riasec", subcategory: "realistic", options: likertOptions },
  { id: 2, text: "I prefer outdoor or hands-on work over desk-based work.", category: "riasec", subcategory: "realistic", options: likertOptions },
  { id: 3, text: "I enjoy researching complex problems to find solutions.", category: "riasec", subcategory: "investigative", options: likertOptions },
  { id: 4, text: "Reading scientific articles or research papers interests me.", category: "riasec", subcategory: "investigative", options: likertOptions },
  { id: 5, text: "I enjoy creating visual designs, artwork, or creative content.", category: "riasec", subcategory: "artistic", options: likertOptions },
  { id: 6, text: "Writing stories, poetry, or creative content is enjoyable to me.", category: "riasec", subcategory: "artistic", options: likertOptions },
  { id: 7, text: "I find satisfaction in teaching or explaining concepts to others.", category: "riasec", subcategory: "social", options: likertOptions },
  { id: 8, text: "Working in healthcare or counseling appeals to me.", category: "riasec", subcategory: "social", options: likertOptions },
  { id: 9, text: "I enjoy leading teams and making strategic decisions.", category: "riasec", subcategory: "enterprising", options: likertOptions },
  { id: 10, text: "Selling products or services and persuading others sounds interesting.", category: "riasec", subcategory: "enterprising", options: likertOptions },
  { id: 11, text: "I like organizing information, files, or data in systematic ways.", category: "riasec", subcategory: "conventional", options: likertOptions },
  { id: 12, text: "Following established procedures and guidelines is important to me.", category: "riasec", subcategory: "conventional", options: likertOptions },
  { id: 13, text: "Making a positive impact through my work is very important to me.", category: "values", subcategory: "impact", options: likertOptions },
  { id: 14, text: "Earning a high income is a major career priority for me.", category: "values", subcategory: "income", options: likertOptions },
  { id: 15, text: "I highly value creative freedom and independence at work.", category: "values", subcategory: "autonomy", options: likertOptions },
  { id: 16, text: "Maintaining healthy work-life balance is essential to me.", category: "values", subcategory: "balance", options: likertOptions },
  { id: 17, text: "I am motivated by continuous growth and career advancement.", category: "values", subcategory: "growth", options: likertOptions },
  { id: 18, text: "Long-term job security and predictability matter a lot to me.", category: "values", subcategory: "stability", options: likertOptions },
  { id: 19, text: "I enjoy exploring new ideas and trying unconventional approaches.", category: "bigFive", subcategory: "openness", options: likertOptions },
  { id: 20, text: "I make detailed plans before starting projects.", category: "bigFive", subcategory: "conscientiousness", options: likertOptions },
  { id: 21, text: "I often complete tasks at the last minute.", category: "bigFive", subcategory: "conscientiousness_reverse", options: likertOptions },
  { id: 22, text: "I feel energized after spending time with large groups of people.", category: "bigFive", subcategory: "extraversion", options: likertOptions },
  { id: 23, text: "I enjoy frequent collaboration with larger teams.", category: "environment", subcategory: "team_collaboration", options: likertOptions },
  { id: 24, text: "I perform best in predictable environments with clear routines.", category: "environment", subcategory: "pace_predictable", options: likertOptions },
  { id: 25, text: "I like taking ownership and leading group efforts.", category: "environment", subcategory: "leadership", options: likertOptions },
];

export const TOTAL_ASSESSMENT_QUESTIONS = ASSESSMENT_QUESTIONS.length;
