export interface Club {
  id: string;
  name: string;
  fullName: string;
  category: string;
  tags: string[];
  description: string;
  shortDescription: string;
  website: string;
  socialLinks: {
    linktree?: string;
    website?: string;
    instagram?: string;
    discord?: string;
    github?: string;
  };
  activities: string[];
  skillsOffered: string[];
  meetingFrequency: string;
  membershipLevel: string;
  timeCommitment: string;
  establishedYear: number | null;
  clubSize: string;
  keyPrograms: string[];
}

export interface SearchFilters {
  category?: string;
  tags?: string[];
  timeCommitment?: string;
  membershipLevel?: string;
  query?: string;
}

export interface ClubWithSimilarity extends Club {
  similarity: number;
}

export const clubsData: Club[] = [
  {
    id: "acm",
    name: "ACM",
    fullName: "Association for Computing Machinery @ UCI",
    category: "Computer Science",
    tags: [
      "programming",
      "competition",
      "academic",
      "professional-development",
    ],
    description:
      "ACM@UCI, the UC Irvine Chapter of the Association of Computer Machinery (ACM), is dedicated to advancing computing as a science and a profession. They work toward accommodating the needs of students as an investment for brilliant minds in academia and successful men and women in business. ACM's active competition participants train rigorously to compete in nationally renowned competitions, including IEEExtreme, HackerRank and ICPC. The club also evaluates and supports student project proposals.",
    shortDescription:
      "Advancing computing as a science and profession through competitions and project support.",
    website: "https://linktr.ee/acmuci",
    socialLinks: {
      linktree: "https://linktr.ee/acmuci",
    },
    activities: [
      "IEEExtreme Competition",
      "HackerRank Challenges",
      "ICPC Training",
      "Student Project Evaluation",
      "Professional Development Workshops",
    ],
    skillsOffered: [
      "Competitive Programming",
      "Algorithm Design",
      "Problem Solving",
      "Team Collaboration",
    ],
    meetingFrequency: "Weekly",
    membershipLevel: "Open to all skill levels",
    timeCommitment: "Medium to High",
    establishedYear: null,
    clubSize: "Large (100+ members)",
    keyPrograms: [
      "Competition Teams",
      "Project Incubator",
      "Industry Mentorship",
    ],
  },
  {
    id: "ai",
    name: "AI @ UCI",
    fullName: "Artificial Intelligence @ UCI",
    category: "Artificial Intelligence",
    tags: ["ai", "machine-learning", "workshops", "real-world-applications"],
    description:
      "AI@UCI is to introduce students to the latest tools and concepts in AI. By providing real word examples and application based workshops, students can use these skills to navigate their own journey into the dynamic world of AI in addition to gaining in demand skills outside of the classroom.",
    shortDescription:
      "Introducing students to AI tools and concepts through practical workshops.",
    website: "https://linktr.ee/aiatuci",
    socialLinks: {
      linktree: "https://linktr.ee/aiatuci",
    },
    activities: [
      "AI Workshops",
      "Real-world Application Projects",
      "Tool Training Sessions",
      "Industry Case Studies",
    ],
    skillsOffered: [
      "Machine Learning",
      "AI Development",
      "Data Analysis",
      "Python Programming",
    ],
    meetingFrequency: "Bi-weekly",
    membershipLevel: "Beginner to Advanced",
    timeCommitment: "Medium",
    establishedYear: null,
    clubSize: "Medium (50-100 members)",
    keyPrograms: [
      "Hands-on Workshops",
      "AI Project Showcase",
      "Industry Partnerships",
    ],
  },
  {
    id: "blackInTech",
    name: "Black in Tech",
    fullName: "Black in Tech @ UCI",
    category: "Diversity & Inclusion",
    tags: [
      "diversity",
      "networking",
      "professional-development",
      "minority-support",
    ],
    description:
      "Black in Tech is a student-run organization dedicated to empowering minority voices in tech by hosting tech talks, workshops, networking events, offering internship guidance, and providing industry exposure through partnerships with tech companies and site visits.",
    shortDescription:
      "Empowering minority voices in tech through networking and professional development.",
    website: "https://linktr.ee/BIT_UCI",
    socialLinks: {
      linktree: "https://linktr.ee/BIT_UCI",
    },
    activities: [
      "Tech Talks",
      "Professional Workshops",
      "Networking Events",
      "Company Site Visits",
      "Internship Guidance",
    ],
    skillsOffered: [
      "Professional Networking",
      "Interview Preparation",
      "Career Development",
      "Industry Insight",
    ],
    meetingFrequency: "Monthly",
    membershipLevel: "Open to all",
    timeCommitment: "Low to Medium",
    establishedYear: null,
    clubSize: "Medium (30-80 members)",
    keyPrograms: [
      "Industry Partnerships",
      "Mentorship Program",
      "Career Development Track",
    ],
  },
  {
    id: "blockchain",
    name: "Blockchain @ UCI",
    fullName: "Blockchain at UCI",
    category: "Blockchain & Cryptocurrency",
    tags: ["blockchain", "cryptocurrency", "web3", "hackathons", "education"],
    description:
      "Blockchain at UCI is an ecosystem for blockchain education, development, and networking at UC Irvine and surrounding areas. We organize workshops, educational seminars, hackathons, and networking events to facilitate the growth of blockchain awareness, technical understanding, and thorough training.",
    shortDescription:
      "Building a blockchain ecosystem through education, development, and networking.",
    website: "https://www.blockchainuci.org/",
    socialLinks: {
      website: "https://www.blockchainuci.org/",
    },
    activities: [
      "Blockchain Workshops",
      "Educational Seminars",
      "Hackathons",
      "Networking Events",
      "Technical Training",
    ],
    skillsOffered: [
      "Blockchain Development",
      "Smart Contracts",
      "Cryptocurrency",
      "Web3 Technologies",
    ],
    meetingFrequency: "Weekly",
    membershipLevel: "Beginner to Advanced",
    timeCommitment: "Medium",
    establishedYear: null,
    clubSize: "Medium (40-70 members)",
    keyPrograms: [
      "Blockchain Bootcamp",
      "DeFi Projects",
      "Industry Partnerships",
    ],
  },
  {
    id: "commit-the-change",
    name: "Commit the Change",
    fullName: "Commit the Change @ UCI",
    category: "Social Impact",
    tags: [
      "social-good",
      "nonprofit",
      "software-development",
      "community-service",
    ],
    description:
      "Commit the Change is a community service organization dedicated to working with nonprofit organizations to develop tech for social good. Students who join as members are matched with nonprofits as designers or developers and spend the entire school year creating a software application that will reduce operating costs or improve a given workflow for their nonprofit once completed. While doing so, they follow industry best practices such as version control, code reviews, and iterative design which are taught by project leads in order to prepare them for work in internships and other roles related to software development and design.",
    shortDescription:
      "Developing technology for social good through nonprofit partnerships.",
    website: "https://linktr.ee/ctc.uci",
    socialLinks: {
      linktree: "https://linktr.ee/ctc.uci",
    },
    activities: [
      "Nonprofit Software Development",
      "Code Reviews",
      "Design Workshops",
      "Project Management Training",
      "Community Impact Projects",
    ],
    skillsOffered: [
      "Full-Stack Development",
      "UI/UX Design",
      "Project Management",
      "Version Control",
    ],
    meetingFrequency: "Weekly",
    membershipLevel: "Intermediate to Advanced",
    timeCommitment: "High (Year-long commitment)",
    establishedYear: null,
    clubSize: "Medium (50-80 members)",
    keyPrograms: [
      "Nonprofit Matching Program",
      "Technical Mentorship",
      "Social Impact Showcase",
    ],
  },
  {
    id: "cyber",
    name: "Cyber @ UCI",
    fullName: "Cyber @ UCI",
    category: "Cybersecurity",
    tags: ["cybersecurity", "hacking", "ctf", "security-research"],
    description:
      "Cyber@UCI was created from a desire to have more cybersecurity exposure and learning at UCI. Despite being a rapidly growing, and extremely important field, cybersecurity is often only relegated to a couple upper division classes. That just isn't right! At its core, being 'good' at cybersecurity necessitates being plugged into the security community, and keeping up to date with all the latest developments. Cyber @ UCI offers such a place, bringing people from all levels of experience together with one common interest: cybersecurity.",
    shortDescription:
      "Building a cybersecurity community for all experience levels.",
    website: "https://linktr.ee/cyberuci",
    socialLinks: {
      linktree: "https://linktr.ee/cyberuci",
    },
    activities: [
      "Capture The Flag (CTF) Competitions",
      "Security Research",
      "Penetration Testing Workshops",
      "Industry Guest Speakers",
      "Security Tool Training",
    ],
    skillsOffered: [
      "Ethical Hacking",
      "Network Security",
      "Cryptography",
      "Incident Response",
    ],
    meetingFrequency: "Weekly",
    membershipLevel: "All levels welcome",
    timeCommitment: "Medium",
    establishedYear: null,
    clubSize: "Medium (60-90 members)",
    keyPrograms: ["CTF Team", "Security Research Lab", "Industry Partnerships"],
  },
  {
    id: "data",
    name: "Data @ UCI",
    fullName: "Data @ UCI",
    category: "Data Science",
    tags: [
      "data-science",
      "analytics",
      "workshops",
      "professional-development",
    ],
    description:
      "Data@UCI aims to nurture a community of Anteaters exploring their place in an increasingly data-driven world. Through workshops, professional panels, and speaker events, we provide resources and a network for students to grow their analytical skills and gain a deeper appreciation for data — helping them to succeed in college and in their careers. We are a student-run organization ultimately dedicated to the UCI and larger Orange County communities.",
    shortDescription:
      "Nurturing a data science community through workshops and professional development.",
    website: "https://linktr.ee/DataAtUCIrvine",
    socialLinks: {
      linktree: "https://linktr.ee/DataAtUCIrvine",
    },
    activities: [
      "Data Science Workshops",
      "Professional Panels",
      "Speaker Events",
      "Analytics Projects",
      "Community Outreach",
    ],
    skillsOffered: [
      "Data Analysis",
      "Statistical Modeling",
      "Python/R Programming",
      "Data Visualization",
    ],
    meetingFrequency: "Bi-weekly",
    membershipLevel: "Beginner to Advanced",
    timeCommitment: "Medium",
    establishedYear: null,
    clubSize: "Large (80-120 members)",
    keyPrograms: [
      "Data Analytics Bootcamp",
      "Industry Connections",
      "Research Opportunities",
    ],
  },
  {
    id: "design",
    name: "Design @ UCI",
    fullName: "Design at UCI",
    category: "Design",
    tags: ["ux-ui", "product-design", "visual-design", "creativity"],
    description:
      "Design at UCI is a community for designers of all skill levels and backgrounds. Here, we provide the resources and space for students to innovate, create, and ultimately grow as designers. Through community, education, and collaboration, we strive to spark and foster creativity in our members and throughout the UCI community. Our primary focus is within the digital design disciplines: user-experience/user-interface (UX/UI) design, product design, and visual design.",
    shortDescription:
      "A community for digital designers focused on UX/UI, product, and visual design.",
    website: "https://linktr.ee/designatuci",
    socialLinks: {
      linktree: "https://linktr.ee/designatuci",
    },
    activities: [
      "Design Workshops",
      "Portfolio Reviews",
      "Design Challenges",
      "Industry Mentorship",
      "Creative Collaborations",
    ],
    skillsOffered: [
      "UX/UI Design",
      "Product Design",
      "Visual Design",
      "Design Thinking",
    ],
    meetingFrequency: "Weekly",
    membershipLevel: "All skill levels",
    timeCommitment: "Medium",
    establishedYear: null,
    clubSize: "Large (100+ members)",
    keyPrograms: [
      "Design Mentorship",
      "Portfolio Development",
      "Industry Partnerships",
    ],
  },
  {
    id: "hack",
    name: "Hack @ UCI",
    fullName: "Hack at UCI",
    category: "Hackathons",
    tags: ["hackathons", "innovation", "entrepreneurship", "technology"],
    description:
      "Hack at UCI is a student-run organization established to provide students with a platform to learn, grow, and develop technology of the future. Established in 2013, our mission is to promote, educate, and enhance the community around us by giving students the platform to learn and create technology. Our organization hosts hackathons, technical workshops, career panels, and other events that bring in over 1000+ attendees in total each year. For hackathons, we organize Orange County's biggest annual hackathon, HackUCI, with 500+ students, 1600+ applicants, and 90+ projects submitted as well as ZotHacks, a beginner level hackathon with 50+ students at UCI.",
    shortDescription:
      "Organizing hackathons and tech events to promote innovation and learning.",
    website: "https://linktr.ee/HackAtUCI",
    socialLinks: {
      linktree: "https://linktr.ee/HackAtUCI",
    },
    activities: [
      "HackUCI (Major Annual Hackathon)",
      "ZotHacks (Beginner Hackathon)",
      "Technical Workshops",
      "Career Panels",
      "Innovation Showcases",
    ],
    skillsOffered: [
      "Rapid Prototyping",
      "Full-Stack Development",
      "Innovation",
      "Teamwork",
    ],
    meetingFrequency: "Weekly",
    membershipLevel: "All levels",
    timeCommitment: "High during events, Medium otherwise",
    establishedYear: 2013,
    clubSize: "Large (200+ members)",
    keyPrograms: ["HackUCI", "ZotHacks", "Tech Workshop Series"],
  },
  {
    id: "icssc",
    name: "ICSSC",
    fullName: "ICS Student Council",
    category: "Student Government",
    tags: [
      "student-government",
      "advocacy",
      "community-building",
      "professional-development",
    ],
    description:
      "The official student government for the Donald Bren School of ICS, the ICS Student Council (ICSSC) seeks to improve student life of the Donald Bren School of Information and Computer Sciences academically, socially, and professionally, as well as create and deepen bonds between students, faculty, administration, companies, and alumni of the ICS School. We believe that through a strong community, we will enhance the quality of student life and ensure great jobs for students of all majors and minors within the Donald Bren School of Information and Computer Science.",
    shortDescription:
      "Official student government representing ICS students and improving their academic and professional experience.",
    website: "https://linktr.ee/icssc.uci",
    socialLinks: {
      linktree: "https://linktr.ee/icssc.uci",
    },
    activities: [
      "WebJam Competition",
      "Brain Games",
      "ICS Week Festival",
      "Company Info Sessions",
      "Humans of ICS Interviews",
      "Student Advocacy",
    ],
    skillsOffered: [
      "Leadership",
      "Event Planning",
      "Public Speaking",
      "Community Building",
    ],
    meetingFrequency: "Weekly",
    membershipLevel: "Open to ICS students",
    timeCommitment: "High",
    establishedYear: null,
    clubSize: "Medium (40-60 members)",
    keyPrograms: [
      "ICS Week",
      "Student Representation",
      "Professional Development",
    ],
  },
  {
    id: "quantum",
    name: "QC @ UCI",
    fullName: "Quantum Computing @ UCI",
    category: "Quantum Computing",
    tags: ["quantum-computing", "research", "algorithms", "interdisciplinary"],
    description:
      "QC@UCI, a student-led organization, empowers students to explore and advance the field of quantum computation and software. Not only do members learn foundational quantum algorithms through educational seminars and hands-on workshops, but they also engage in interdisciplinary research projects that connect quantum computing to fields like machine learning and chemistry. The club fosters a vibrant quantum information science community, facilitating collaboration among students and providing them with valuable insights from industry and academic leaders through regular guest speaker events. QC@UCI equips its Anteaters with the knowledge and skills to navigate the rapidly evolving quantum computing landscape.",
    shortDescription:
      "Exploring quantum computing through education, research, and interdisciplinary collaboration.",
    website: "https://linktr.ee/qcatuci",
    socialLinks: {
      linktree: "https://linktr.ee/qcatuci",
    },
    activities: [
      "Quantum Algorithm Seminars",
      "Hands-on Workshops",
      "Research Projects",
      "Guest Speaker Events",
      "Interdisciplinary Collaborations",
    ],
    skillsOffered: [
      "Quantum Algorithms",
      "Quantum Programming",
      "Research Methods",
      "Physics Fundamentals",
    ],
    meetingFrequency: "Weekly",
    membershipLevel: "Intermediate to Advanced",
    timeCommitment: "Medium to High",
    establishedYear: null,
    clubSize: "Small (20-40 members)",
    keyPrograms: [
      "Quantum Research Lab",
      "Industry Speaker Series",
      "Interdisciplinary Projects",
    ],
  },
  {
    id: "vgdc",
    name: "VGDC",
    fullName: "Video Game Development Club",
    category: "Game Development",
    tags: ["game-development", "programming", "art", "game-design"],
    description:
      "VGDC supports student game developers in developing portfolios, enhancing skills, and connecting to industry professionals. VGDC provides a variety of events and programs to engage with student game developers from UCI and beyond, including quarterly student-pitched game projects, learning workshops for art, audio, game design, production, programming, UI/UX, and writing, industry speakers including Game Developer's Week, game jams, and socials.",
    shortDescription:
      "Supporting game developers through projects, workshops, and industry connections.",
    website: "https://linktr.ee/vgdc.uci",
    socialLinks: {
      linktree: "https://linktr.ee/vgdc.uci",
    },
    activities: [
      "Quarterly Game Projects",
      "Game Development Workshops",
      "Game Developer's Week",
      "Game Jams",
      "Industry Speaker Events",
      "Portfolio Development",
    ],
    skillsOffered: [
      "Game Programming",
      "Game Art",
      "Game Design",
      "Audio Design",
      "UI/UX for Games",
    ],
    meetingFrequency: "Weekly",
    membershipLevel: "All skill levels",
    timeCommitment: "Medium to High",
    establishedYear: null,
    clubSize: "Large (80-120 members)",
    keyPrograms: [
      "Student Game Projects",
      "Industry Mentorship",
      "Portfolio Showcase",
    ],
  },
  {
    id: "wics",
    name: "WICS",
    fullName: "Women in Information and Computer Sciences",
    category: "Diversity & Inclusion",
    tags: [
      "women-in-tech",
      "diversity",
      "mentorship",
      "professional-development",
    ],
    description:
      "WICS is a social and professional nonprofit organization at UCI established to encourage women to pursue a college degree and a successful career in the computer science field. WICS provides support for women and other minorities through various activities, hosts company networking opportunities, organizes sponsored trips to the Grace Hopper Celebration, outreaches to middle and high school students, and hosts VenusHacks, UCI's women-centric hackathon. WICS is open to people of all genders.",
    shortDescription:
      "Encouraging women in computer science through mentorship, networking, and professional development.",
    website: "https://linktr.ee/wicsuci",
    socialLinks: {
      linktree: "https://linktr.ee/wicsuci",
    },
    activities: [
      "Mentorship Programs",
      "Mock Technical Interviews",
      "WICS Games Networking",
      "Grace Hopper Celebration Trip",
      "VenusHacks Hackathon",
      "NetWICS High School Conference",
      "IrisHacks",
    ],
    skillsOffered: [
      "Technical Interview Prep",
      "Professional Networking",
      "Leadership",
      "Mentorship",
    ],
    meetingFrequency: "Weekly",
    membershipLevel: "Open to all genders",
    timeCommitment: "Medium",
    establishedYear: null,
    clubSize: "Large (150+ members)",
    keyPrograms: [
      "Grace Hopper Partnership",
      "VenusHacks",
      "High School Outreach",
    ],
  },
];

// Helper functions for database operations
export const clubsDatabase = {
  // Get all clubs
  getAllClubs: (): Club[] => clubsData,

  // Get club by ID
  getClubById: (id: string): Club | undefined =>
    clubsData.find((club) => club.id === id),

  // Search clubs by name
  searchByName: (query: string): Club[] => {
    const searchTerm = query.toLowerCase();
    return clubsData.filter(
      (club) =>
        club.name.toLowerCase().includes(searchTerm) ||
        club.fullName.toLowerCase().includes(searchTerm)
    );
  },

  // Filter by category
  getClubsByCategory: (category: string): Club[] => {
    return clubsData.filter(
      (club) => club.category.toLowerCase() === category.toLowerCase()
    );
  },

  // Filter by tags
  getClubsByTag: (tag: string): Club[] => {
    return clubsData.filter((club) => club.tags.includes(tag.toLowerCase()));
  },

  // Search clubs by description/activities
  searchByDescription: (query: string): Club[] => {
    const searchTerm = query.toLowerCase();
    return clubsData.filter(
      (club) =>
        club.description.toLowerCase().includes(searchTerm) ||
        club.activities.some((activity) =>
          activity.toLowerCase().includes(searchTerm)
        ) ||
        club.skillsOffered.some((skill) =>
          skill.toLowerCase().includes(searchTerm)
        )
    );
  },

  // Get clubs by time commitment
  getClubsByTimeCommitment: (commitment: string): Club[] => {
    return clubsData.filter((club) =>
      club.timeCommitment.toLowerCase().includes(commitment.toLowerCase())
    );
  },

  // Get clubs by membership level
  getClubsByMembershipLevel: (level: string): Club[] => {
    return clubsData.filter((club) =>
      club.membershipLevel.toLowerCase().includes(level.toLowerCase())
    );
  },

  // Get all unique categories
  getCategories: (): string[] => {
    return [...new Set(clubsData.map((club) => club.category))];
  },

  // Get all unique tags
  getAllTags: (): string[] => {
    const allTags = clubsData.flatMap((club) => club.tags);
    return [...new Set(allTags)];
  },

  // Advanced search with multiple filters
  advancedSearch: (filters: SearchFilters): Club[] => {
    let results = clubsData;

    if (filters.category) {
      results = results.filter(
        (club) =>
          club.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((club) =>
        filters.tags!.some((tag) => club.tags.includes(tag.toLowerCase()))
      );
    }

    if (filters.timeCommitment) {
      results = results.filter((club) =>
        club.timeCommitment
          .toLowerCase()
          .includes(filters.timeCommitment!.toLowerCase())
      );
    }

    if (filters.membershipLevel) {
      results = results.filter((club) =>
        club.membershipLevel
          .toLowerCase()
          .includes(filters.membershipLevel!.toLowerCase())
      );
    }

    if (filters.query) {
      const searchTerm = filters.query.toLowerCase();
      results = results.filter(
        (club) =>
          club.name.toLowerCase().includes(searchTerm) ||
          club.fullName.toLowerCase().includes(searchTerm) ||
          club.description.toLowerCase().includes(searchTerm) ||
          club.activities.some((activity) =>
            activity.toLowerCase().includes(searchTerm)
          )
      );
    }

    return results;
  },

  // Get random clubs for recommendations
  getRandomClubs: (count: number = 3): Club[] => {
    const shuffled = [...clubsData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  // Get clubs with similar tags
  getSimilarClubs: (
    clubId: string,
    count: number = 3
  ): ClubWithSimilarity[] => {
    const targetClub = clubsData.find((club) => club.id === clubId);
    if (!targetClub) return [];

    const similarClubs = clubsData
      .filter((club) => club.id !== clubId)
      .map((club) => {
        const commonTags = club.tags.filter((tag) =>
          targetClub.tags.includes(tag)
        );
        return { ...club, similarity: commonTags.length };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, count);

    return similarClubs;
  },
};

// Export individual categories for easy access
export const categories = {
  COMPUTER_SCIENCE: "Computer Science",
  AI: "Artificial Intelligence",
  DIVERSITY: "Diversity & Inclusion",
  BLOCKCHAIN: "Blockchain & Cryptocurrency",
  SOCIAL_IMPACT: "Social Impact",
  CYBERSECURITY: "Cybersecurity",
  DATA_SCIENCE: "Data Science",
  DESIGN: "Design",
  HACKATHONS: "Hackathons",
  STUDENT_GOVERNMENT: "Student Government",
  QUANTUM: "Quantum Computing",
  GAME_DEV: "Game Development",
} as const;

// Export common tags for filtering
export const commonTags = {
  PROGRAMMING: "programming",
  NETWORKING: "networking",
  WORKSHOPS: "workshops",
  PROFESSIONAL_DEV: "professional-development",
  DIVERSITY: "diversity",
  HACKATHONS: "hackathons",
  RESEARCH: "research",
  MENTORSHIP: "mentorship",
  COMPETITIONS: "competition",
  SOCIAL_GOOD: "social-good",
} as const;

export default clubsDatabase;
