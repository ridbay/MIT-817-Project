import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { UG_COURSES, PG_COURSES, Course } from '../data/curriculum';
import { PROGRAMME_RULES, UG_GRADE_MAPPING, ProgrammeType } from '../data/rules';
import { calculateGPA, getUGClassification, getPGStatus, scoreToGrade, gradeToPoint, CourseAttempt, getUnitProgress } from '../lib/gpa-engine';
import UnitProgress from '../components/UnitProgress';
import './CGPACalculator.css';

const CGPACalculator: React.FC = () => {
  const { studentType, user, setCourseRecords, courseRecords } = useAppContext();
  const [academicYear, setAcademicYear] = useState('2023/2024');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState<ProgrammeType>(
    (user?.programme || (studentType === 'pg' ? 'MIT' : 'UG-CS')) as ProgrammeType
  );
  const [selectedLevel, setSelectedLevel] = useState<number>(100);
  const [activeCourses, setActiveCourses] = useState<CourseAttempt[]>([]);

  // Load curriculum based on selection
  const curriculum: Course[] = useMemo(() => {
    if (selectedProgramme === 'UG-CS') {
      return UG_COURSES.filter(c => c.level === selectedLevel);
    }
    return PG_COURSES[selectedProgramme] || [];
  }, [selectedProgramme, selectedLevel]);

  const addCourseFromCurriculum = (course: Course) => {
    if (activeCourses.find(c => c.courseCode === course.code)) return;
    setActiveCourses([...activeCourses, {
      courseCode: course.code,
      courseTitle: course.title,
      units: course.units,
      semesterId: 'current'
    }]);
  };

  const updateAttempt = (idx: number, field: keyof CourseAttempt, value: any) => {
    const updated = [...activeCourses];
    const attempt = { ...updated[idx], [field]: value };

    // Auto-calculate point if grade is selected
    if (field === 'grade') {
      const mapping = UG_GRADE_MAPPING; // Default mapping
      attempt.point = gradeToPoint(value, mapping);
    }

    updated[idx] = attempt;
    setActiveCourses(updated);
  };

  const handleRemoveCourse = (idx: number) => {
    setActiveCourses(activeCourses.filter((_, i) => i !== idx));
  };

  const handleSaveRecords = () => {
    if (activeCourses.length === 0) return;
    
    setCourseRecords(prev => {
      // Avoid duplicate courses by checking combination of courseCode and semesterId
      const existingKey = (c: CourseAttempt) => `${c.courseCode}-${c.semesterId}`;
      const existingIds = new Set(prev.map(existingKey));
      
      const newRecords: CourseAttempt[] = activeCourses
        .filter(ac => !existingIds.has(`${ac.courseCode}-${ac.semesterId}`))
        .map(ac => ({
          courseCode: ac.courseCode,
          courseTitle: ac.courseTitle,
          units: ac.units,
          grade: ac.grade || '',
          point: ac.point || 0,
          semesterId: ac.semesterId,
          programmeId: selectedProgramme, // Tag with the active programme
        }));
        
      return [...prev, ...newRecords];
    });
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const totalUnits = useMemo(() => activeCourses.reduce((acc, c) => acc + c.units, 0), [activeCourses]);
  const totalPoints = useMemo(() => activeCourses.reduce((acc, c) => acc + (c.units * (c.point || 0)), 0), [activeCourses]);
  const currentGPA = calculateGPA(activeCourses);
  const rules = PROGRAMME_RULES[selectedProgramme];
  
  const standing = selectedProgramme === 'UG-CS' 
    ? getUGClassification(currentGPA)
    : getPGStatus(currentGPA, rules);

  return (
    <div className="cgpa-page">
      <div className="cgpa-main-content">
        <div className="cgpa-header">
          <h1 className="cgpa-title">Academic Rules Engine</h1>
          <p className="cgpa-desc">
            Computer Science Department | {selectedProgramme} Rules Applied
          </p>
        </div>

        <div className="cgpa-card">
          <div className="cgpa-config-row">
            <div className="cgpa-config-item">
              <span className="cgpa-config-label">SELECT PROGRAMME:</span>
              <select 
                className="cgpa-select-main"
                value={selectedProgramme}
                onChange={(e) => {
                  setSelectedProgramme(e.target.value as ProgrammeType);
                  setActiveCourses([]);
                }}
              >
                <option value="UG-CS">B.Sc Computer Science</option>
                <option value="PGD">PGD Computer Science</option>
                <option value="MSC">M.Sc Computer Science</option>
                <option value="MIT">Master of Info. Tech (MIT)</option>
                <option value="PHD">Ph.D Computer Science</option>
              </select>
            </div>
            
            {selectedProgramme === 'UG-CS' && (
              <div className="cgpa-config-item">
                <span className="cgpa-config-label">LEVEL:</span>
                <div className="cgpa-toggle-group">
                  {[100, 200, 300, 400, 500].map(lvl => (
                    <button
                      key={lvl}
                      className={`cgpa-toggle-btn ${selectedLevel === lvl ? 'active' : ''}`}
                      onClick={() => setSelectedLevel(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="cgpa-curriculum-shelf">
             <span className="cgpa-shelf-label">AVAILABLE CURRICULUM:</span>
             <div className="cgpa-shelf-items">
                {curriculum.map(course => (
                  <button 
                    key={course.code} 
                    className="cgpa-shelf-btn"
                    onClick={() => addCourseFromCurriculum(course)}
                  >
                    {course.code} ({course.units}U)
                  </button>
                ))}
             </div>
          </div>

          <div className="cgpa-table-labels">
            <span>COURSE</span>
            <span>UNITS</span>
            <span>SCORE (0-100)</span>
            <span>GRADE</span>
            <span>ACTION</span>
          </div>

          <div className="cgpa-course-list">
            {activeCourses.map((attempt, idx) => (
              <div key={idx} className="cgpa-course-row">
                <div className="cgpa-course-info">
                  <span className="cgpa-course-code">{attempt.courseCode}</span>
                  <span className="cgpa-course-title-sub">{attempt.courseTitle}</span>
                </div>
                <span className="cgpa-course-units">{attempt.units}</span>
                <select
                  className="cgpa-input-score"
                  value={attempt.grade || ''}
                  onChange={(e) => updateAttempt(idx, 'grade', e.target.value)}
                >
                  <option value="">Grade</option>
                  {UG_GRADE_MAPPING.map(m => (
                    <option key={m.grade} value={m.grade}>{m.grade}</option>
                  ))}
                </select>
                <span className={`cgpa-grade-display ${attempt.grade ? `grade-${attempt.grade.toLowerCase()}` : ''}`}>
                  {attempt.grade || '-'} ({attempt.point || '0.0'})
                </span>
                <button className="cgpa-row-remove" onClick={() => handleRemoveCourse(idx)}>×</button>
              </div>
            ))}
            {activeCourses.length === 0 && (
              <div className="cgpa-empty-state">
                Select courses from the curriculum shelf above to begin calculation.
              </div>
            )}
          </div>
        </div>
      </div>

      <aside className="cgpa-side">
        <div className="cgpa-standing-card">
          <div className="cgpa-standing-label">CURRENT GPA</div>
          <div className="cgpa-standing-value">
            {currentGPA.toFixed(2)}<span className="cgpa-standing-max">/ 5.0</span>
          </div>
          <div className="cgpa-standing-info">
            <div className="cgpa-stat-split">
              <div className="cgpa-stat-item">
                <div className="cgpa-stat-label">TOTAL UNITS</div>
                <div className="cgpa-stat-val">{totalUnits}</div>
              </div>
              <div className="cgpa-stat-sep" />
              <div className="cgpa-stat-item">
                <div className="cgpa-stat-label">GRADE POINTS</div>
                <div className="cgpa-stat-val">{totalPoints.toFixed(1)}</div>
              </div>
            </div>
          </div>
          <div className="cgpa-standing-badge">
            {standing.toUpperCase()}
          </div>
        </div>

        <UnitProgress 
          progress={getUnitProgress(activeCourses, rules)} 
          programmeName={selectedProgramme} 
        />

        <div className="cgpa-breakdown-card">
          <h3 className="cgpa-breakdown-title">Programme Validation</h3>
          <div className="cgpa-val-item">
             <div className="cgpa-val-label">Pass Threshold:</div>
             <div className="cgpa-val-data">{rules.minPassMark}% (Grade {selectedProgramme.startsWith('PHD') ? 'D' : 'E'})</div>
          </div>
          <div className="cgpa-val-item">
             <div className="cgpa-val-label">Withdraw CGPA:</div>
             <div className="cgpa-val-data">{rules.withdrawCgpa.toFixed(2)}</div>
          </div>
          {rules.failedUnitLimit && (
            <div className="cgpa-val-item">
               <div className="cgpa-val-label">Failed Unit Limit:</div>
               <div className="cgpa-val-data">{rules.failedUnitLimit} Units</div>
            </div>
          )}
        </div>

        <div className="cgpa-side-actions">
           <button 
             className={`cgpa-save-btn ${saveSuccess ? 'cgpa-save-btn--success' : ''}`}
             onClick={handleSaveRecords}
             disabled={activeCourses.length === 0}
           >
             {saveSuccess ? (
               <>
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                   <polyline points="20 6 9 17 4 12" />
                 </svg>
                 Saved Successfully
               </>
             ) : 'Save to Academic Records'}
           </button>
        </div>
      </aside>
    </div>
  );
};

export default CGPACalculator;
