import { clubsData, Club } from './clubDatabase';

interface SurveyAnswer {
  questionId: string;
  answer: string | string[];
}

interface ClubMatch {
  club: Club;
  score: number;
  matchReasons: string[];
}

export function getTop3ClubMatches(surveyAnswers: SurveyAnswer[]): ClubMatch[] {
  // Convert survey answers to a map for easy lookup
  const answerMap = new Map<string, string | string[]>();
  surveyAnswers.forEach(answer => {
    answerMap.set(answer.questionId, answer.answer);
  });

  // Calculate match scores for all clubs
  const clubScores = clubsData.map(club => {
    const matchData = calculateClubMatch(club, answerMap);
    return {
      club,
      score: matchData.score,
      matchReasons: matchData.reasons
    };
  });

  // Sort by score (descending) and return top 3
  return clubScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function calculateClubMatch(club: Club, answers: Map<string, string | string[]>): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Major alignment (25 points max)
  const major = answers.get('major') as string;
  if (major) {
    const majorScore = calculateMajorMatch(club, major);
    score += majorScore;
    if (majorScore > 15) {
      reasons.push(`Perfect major match for ${major}`);
    } else if (majorScore > 5) {
      reasons.push(`Good cross-discipline fit for ${major}`);
    }
  }

  // 2. Interests alignment (30 points max)
  const interests = answers.get('interests') as string[];
  if (interests && interests.length > 0) {
    const interestScore = calculateInterestMatch(club, interests);
    score += interestScore;
    if (interestScore > 20) {
      reasons.push(`Strong interest alignment`);
    } else if (interestScore > 10) {
      reasons.push(`Some shared interests`);
    }
  }

  // 3. Goals alignment (20 points max)
  const goals = answers.get('goals') as string[];
  if (goals && goals.length > 0) {
    const goalScore = calculateGoalMatch(club, goals);
    score += goalScore;
    if (goalScore > 10) {
      reasons.push(`Matches your career goals`);
    }
  }

  // 4. Time commitment compatibility (15 points max)
  const timeCommitment = answers.get('time-commitment') as string;
  if (timeCommitment) {
    const timeScore = calculateTimeMatch(club, timeCommitment);
    score += timeScore;
    if (timeScore > 10) {
      reasons.push(`Perfect time commitment match`);
    }
  }

  // 5. Experience level compatibility (10 points max)
  const experience = answers.get('experience') as string;
  if (experience) {
    const expScore = calculateExperienceMatch(club, experience);
    score += expScore;
    if (expScore > 5) {
      reasons.push(`Great for your experience level`);
    }
  }

  return { score, reasons };
}

function calculateMajorMatch(club: Club, userMajor: string): number {
  const majorMappings: Record<string, string[]> = {
    'computer-science': ['Computer Science', 'Artificial Intelligence', 'Cybersecurity', 'Data Science', 'Hackathons', 'Game Development'],
    'business': ['Student Government', 'Social Impact'],
    'design': ['Design', 'Game Development'],
    'engineering': ['Computer Science', 'Artificial Intelligence', 'Blockchain & Cryptocurrency', 'Quantum Computing'],
    'life-sciences': ['Data Science', 'Social Impact'],
    'social-sciences': ['Diversity & Inclusion', 'Social Impact', 'Student Government'],
    'other': ['Design', 'Social Impact', 'Diversity & Inclusion']
  };

  const relevantCategories = majorMappings[userMajor] || [];
  
  if (relevantCategories.includes(club.category)) {
    return userMajor === 'computer-science' && 
           ['Computer Science', 'Artificial Intelligence', 'Cybersecurity'].includes(club.category) ? 25 : 20;
  }
  
  // Cross-disciplinary bonus
  if (club.category === 'Diversity & Inclusion' || club.category === 'Social Impact') {
    return 10;
  }
  
  return 0;
}

function calculateInterestMatch(club: Club, userInterests: string[]): number {
  let score = 0;
  const interestTagMappings: Record<string, string[]> = {
    'programming': ['programming', 'hackathons', 'ai', 'blockchain', 'cybersecurity'],
    'networking': ['networking', 'professional-development', 'diversity'],
    'leadership': ['student-government', 'professional-development', 'mentorship'],
    'research': ['research', 'ai', 'quantum-computing', 'data-science'],
    'creative': ['ux-ui', 'design', 'game-development', 'visual-design'],
    'entrepreneurship': ['hackathons', 'blockchain', 'innovation'],
    'social-impact': ['social-good', 'diversity', 'community-service', 'nonprofit'],
    'competition': ['competition', 'hackathons', 'ctf', 'programming'],
    'mentorship': ['mentorship', 'diversity', 'professional-development'],
    'volunteering': ['social-good', 'community-service', 'nonprofit']
  };

  userInterests.forEach(interest => {
    const relevantTags = interestTagMappings[interest] || [];
    const matchingTags = club.tags.filter(tag => relevantTags.includes(tag));
    score += matchingTags.length * 3; // 3 points per matching tag

    // Bonus for direct category match
    if (interest === 'programming' && 
        ['Computer Science', 'Artificial Intelligence', 'Hackathons'].includes(club.category)) {
      score += 5;
    }
    if (interest === 'social-impact' && club.category === 'Social Impact') {
      score += 5;
    }
  });

  return Math.min(score, 30); // Cap at 30 points
}

function calculateGoalMatch(club: Club, userGoals: string[]): number {
  let score = 0;
  const goalClubMappings: Record<string, string[]> = {
    'career-preparation': ['Computer Science', 'Data Science', 'Cybersecurity', 'Diversity & Inclusion'],
    'networking': ['Diversity & Inclusion', 'Student Government', 'Hackathons'],
    'skill-building': ['Computer Science', 'Artificial Intelligence', 'Design', 'Game Development'],
    'leadership': ['Student Government', 'Hackathons', 'Social Impact'],
    'portfolio': ['Design', 'Game Development', 'Social Impact', 'Hackathons'],
    'fun': ['Game Development', 'Hackathons', 'Design'],
    'research': ['Artificial Intelligence', 'Quantum Computing', 'Data Science']
  };

  userGoals.forEach(goal => {
    const relevantCategories = goalClubMappings[goal] || [];
    if (relevantCategories.includes(club.category)) {
      score += 4;
    }
    
    // Check for goal-related skills offered
    const goalSkillMappings: Record<string, string[]> = {
      'career-preparation': ['Professional Networking', 'Interview Preparation', 'Career Development'],
      'skill-building': ['Programming', 'Design', 'Technical', 'Development'],
      'leadership': ['Leadership', 'Management', 'Public Speaking'],
      'portfolio': ['Portfolio', 'Project', 'Development']
    };
    
    const relevantSkills = goalSkillMappings[goal] || [];
    const hasRelevantSkills = club.skillsOffered.some(skill => 
      relevantSkills.some(relevant => skill.toLowerCase().includes(relevant.toLowerCase()))
    );
    
    if (hasRelevantSkills) {
      score += 2;
    }
  });

  return Math.min(score, 20); // Cap at 20 points
}

function calculateTimeMatch(club: Club, userTimeCommitment: string): number {
  const timeMap: Record<string, string[]> = {
    'low': ['Low', 'Medium'],
    'medium': ['Low', 'Medium', 'High'],
    'high': ['Medium', 'High']
  };

  const compatibleCommitments = timeMap[userTimeCommitment] || [];
  const clubTime = club.timeCommitment.toLowerCase();
  
  for (const compatible of compatibleCommitments) {
    if (clubTime.includes(compatible.toLowerCase())) {
      return userTimeCommitment === 'medium' ? 15 : 12; // Perfect match for medium
    }
  }
  
  return 0;
}

function calculateExperienceMatch(club: Club, userExperience: string): number {
  const membershipLevel = club.membershipLevel.toLowerCase();
  
  const experienceMap: Record<string, number> = {
    'beginner': membershipLevel.includes('beginner') || membershipLevel.includes('all') ? 10 : 
                membershipLevel.includes('open') ? 8 : 3,
    'intermediate': membershipLevel.includes('intermediate') || membershipLevel.includes('all') ? 10 :
                   membershipLevel.includes('beginner') || membershipLevel.includes('advanced') ? 7 : 5,
    'advanced': membershipLevel.includes('advanced') || membershipLevel.includes('intermediate') ? 10 :
               membershipLevel.includes('all') ? 8 : 4
  };

  return experienceMap[userExperience] || 5;
}

// Integration function for the existing addDoc
export async function generateClubMatches(userId: string, surveyAnswers: SurveyAnswer[]): Promise<string[]> {
  const matches = getTop3ClubMatches(surveyAnswers);
  
  console.log("🎯 Top 3 club matches:", matches); // DEBUG
  
  // Return just the club names as an array of 3 strings
  const clubNames = matches.map(match => match.club.name);
  
  console.log("📝 Final club names:", clubNames); // DEBUG
  
  return clubNames;
}