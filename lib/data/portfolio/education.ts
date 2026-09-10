export interface Education {
  degree: string;
  institution: string;
  gpa?: string;
  percentage?: string;
  period: string;
  location: string;
  highlights?: string[];
}

export const education: Education[] = [
  {
    degree: "Bachelor of Computer Applications",
    institution: "Dr. P.A. Inamdar University",
    gpa: "9.1 CGPA",
    period: "Aug 2023 – May 2026",
    location: "Pune, India",
    highlights: [
      "Strong academic performer with 9.1 CGPA",
      "Developed early knowledge of programming, software testing, and software development",
      "Learned database fundamentals and SAP modules",
      "Gained application testing experience"
    ]
  },
  {
    degree: "HSC — Computer Science",
    institution: "Vishwakarma College of Arts, Science and Commerce",
    percentage: "64.17%",
    period: "Aug 2021 – Mar 2023",
    location: "Pune, India"
  },
  {
    degree: "SSC",
    institution: "MCES English Medium High School",
    percentage: "71.60%",
    period: "Aug 2020 – Feb 2021",
    location: "Pune, India"
  }
];
