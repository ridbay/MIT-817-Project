import { Student } from '../data/students';
import { Course, UG_COURSES, PG_COURSES } from '../data/curriculum';
import { CourseAttempt } from './gpa-engine';
import { ProgrammeType, UG_GRADE_MAPPING, PG_GRADE_MAPPING } from '../data/rules';

const getGradesForGPA = (targetGPA: number, category: 'UG' | 'PG' = 'UG'): { grade: string, point: number }[] => {
  const mapping = category === 'PG' ? PG_GRADE_MAPPING : UG_GRADE_MAPPING;
  
  // Refined mapping to better match target GPA
  if (targetGPA >= 4.5) return mapping.filter(m => m.point >= 4);
  if (targetGPA >= 3.5) return mapping.filter(m => m.point >= 3);
  if (targetGPA >= 2.0) return mapping.filter(m => m.point >= 2);
  return mapping.filter(m => m.point <= 2);
};

export const seedCourseRecords = (student: Student): CourseAttempt[] => {
  const programme = student.programme as ProgrammeType;
  let relevantCourses: Course[] = [];
  const category = (programme === 'UG-CS') ? 'UG' : 'PG';

  if (category === 'UG') {
    // For UG, pick courses up to their level (or current level)
    const currentLevel = typeof student.level === 'number' ? student.level : 100;
    relevantCourses = UG_COURSES.filter(c => c.level < currentLevel).slice(0, 10); 
  } else {
    // For PG, pick courses from their programme
    relevantCourses = (PG_COURSES[programme] || []).slice(0, 6); 
  }

  const grades = getGradesForGPA(student.cgpa, category);
  
  return relevantCourses.map((course, index) => {
    const gradeInfo = grades[index % grades.length];
    return {
      courseCode: course.code,
      courseTitle: course.title,
      units: course.units,
      grade: gradeInfo.grade,
      point: gradeInfo.point,
      semesterId: index < relevantCourses.length / 2 ? '1' : '2',
      programmeId: programme
    };
  });
};
