import test from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import {
  analyzeResume,
  buildImprovementTips,
  buildJobRecommendations,
  buildLearningPlan,
  buildMissingSkills,
  buildSummary,
  extractSkills,
  normalizeText,
  scoreResume,
} from '../resume-analyzer/server/utils/resumeAnalyzer.js';

const expectedLearningTip =
  'Complete at least 2 practical exercises and one project-based assessment.';

test('normalizeText lowercases, collapses whitespace, and trims', () => {
  assert.equal(normalizeText('  React \n  DEVELOPER\t '), 'react developer');
  assert.equal(normalizeText(' \n\t '), '');
  assert.equal(normalizeText(), '');
});

test('analysis functions reject non-string resume input', () => {
  assert.throws(() => analyzeResume(null), TypeError);
  assert.throws(() => extractSkills(null), TypeError);
  assert.throws(() => scoreResume(null), TypeError);
  assert.throws(() => buildSummary(null), TypeError);
});

test('extractSkills detects known skills without duplicates', () => {
  assert.deepEqual(extractSkills('React react REACT and JavaScript'), ['javascript', 'react', 'java']);
  assert.deepEqual(extractSkills('No listed technology'), []);
});

test('extractSkills does not treat part of a longer skill name as a match', () => {
  assert.deepEqual(extractSkills('javascript'), ['javascript']);
});

test('scoreResume applies its baseline, signals, and upper bound', () => {
  assert.equal(scoreResume(''), 58);
  assert.equal(scoreResume('experience'), 58);
  assert.equal(scoreResume('experience project team managed developed implemented'), 65);
  assert.equal(scoreResume('react javascript node express python java sql postgresql mongodb aws docker kubernetes typescript nextjs tailwind css html api graphql redux cypress jest testing machine learning ai data analysis excel power bi figma uiux project management agile communication leadership'), 100);
});

test('buildSummary limits previews to 120 words and truncates long previews', () => {
  const short120Words = Array.from({ length: 120 }, () => 'word').join(' ');
  const exactly120Words = Array.from({ length: 120 }, (_, index) => `word${index}`).join(' ');
  const over120Words = `${exactly120Words} extra words`;

  assert.equal(buildSummary(short120Words), `${short120Words.slice(0, 260)}...`);
  assert.equal(buildSummary(exactly120Words), `${exactly120Words.slice(0, 260)}...`);
  assert.equal(buildSummary(over120Words), `${exactly120Words.slice(0, 260)}...`);
  assert.equal(buildSummary(''), '');
  assert.equal(buildSummary('word '.repeat(60)).length, 263);
  assert.equal(buildSummary('word '.repeat(100)), `${'word '.repeat(52).slice(0, 260)}...`);
});

test('buildJobRecommendations returns matching roles once and preserves library order', () => {
  assert.deepEqual(buildJobRecommendations(['react', 'javascript']), [
    'Frontend Developer',
    'Full Stack Developer',
  ]);
  assert.deepEqual(buildJobRecommendations([]), []);
  assert.deepEqual(buildJobRecommendations(['unlisted-skill']), []);
});

test('buildJobRecommendations accepts supported partial keyword matches', () => {
  assert.deepEqual(buildJobRecommendations(['wind']), ['Frontend Developer']);
  assert.deepEqual(buildJobRecommendations(['kube']), ['DevOps Engineer']);
});

test('buildMissingSkills reports preferred skills not present', () => {
  assert.deepEqual(buildMissingSkills([]), [
    'javascript',
    'react',
    'sql',
    'python',
    'communication',
    'project management',
  ]);
  assert.deepEqual(buildMissingSkills(['react', 'sql']), [
    'javascript',
    'python',
    'communication',
    'project management',
  ]);
  assert.deepEqual(buildMissingSkills(['javascript', 'react', 'sql', 'python', 'communication', 'project management']), []);
});

test('buildMissingSkills does not mutate the supplied skills', () => {
  const skills = ['react', 'python'];
  const originalSkills = [...skills];

  buildMissingSkills(skills);

  assert.deepEqual(skills, originalSkills);
});

test('buildLearningPlan handles missing skills and a complete skill set', () => {
  assert.deepEqual(buildLearningPlan(['react', 'sql']), [
    `react: ${expectedLearningTip}`,
    `sql: ${expectedLearningTip}`,
  ]);
  assert.deepEqual(buildLearningPlan([]), [
    'No major gaps detected. Focus on advanced portfolio work and leadership case studies.',
  ]);
});

test('buildImprovementTips reports each missing signal and the all-clear case', () => {
  assert.equal(buildImprovementTips('').length, 4);
  assert.deepEqual(
    buildImprovementTips('experience project team keywords'),
    ['Your resume already reads strongly. Improve by tightening bullets and adding metrics.'],
  );
  assert.equal(buildImprovementTips('experience project leadership keywords').length, 1);
});

test('analyzeResume returns complete results and a fallback for unmatched roles', () => {
  const result = analyzeResume('');

  assert.deepEqual(Object.keys(result), [
    'summary',
    'skills',
    'softSkills',
    'experience',
    'qualifications',
    'score',
    'jobMatches',
    'missingSkills',
    'learningPlan',
    'improvements',
    'recommendations',
  ]);
  assert.deepEqual(result.skills, []);
  assert.deepEqual(result.jobMatches, ['Generalist Developer', 'Analyst']);
  assert.equal(result.score, 58);
  assert.ok(result.recommendations.length >= 3);

  const relevant = analyzeResume('React JavaScript HTML CSS experience project team');
  assert.ok(relevant.jobMatches.includes('Frontend Developer'));
  assert.ok(relevant.score > result.score);
});

test('analyzeResume selects experience level and recommendation count from its inputs', () => {
  const earlyCareer = analyzeResume('react javascript node express python');
  const moreMissingSkills = analyzeResume('react javascript sql python communication project management');

  assert.equal(earlyCareer.experience, 'Mid to senior professional with hands-on cross-functional experience.');
  assert.equal(moreMissingSkills.experience, 'Mid to senior professional with hands-on cross-functional experience.');
  assert.equal(moreMissingSkills.recommendations.length, 3);
  assert.equal(analyzeResume('react').recommendations.length, 5);
  assert.equal(analyzeResume('react javascript sql python communication project management').recommendations.length, 3);
});

test('property: normalization is idempotent', () => {
  fc.assert(
    fc.property(fc.string(), (text) => {
      const normalized = normalizeText(text);
      assert.equal(normalizeText(normalized), normalized);
    }),
    { numRuns: 300 },
  );
});

test('property: score stays an integer within its documented bounds', () => {
  fc.assert(
    fc.property(fc.string(), (text) => {
      const score = scoreResume(text);
      assert.ok(Number.isInteger(score));
      assert.ok(score >= 58 && score <= 100);
    }),
    { numRuns: 500 },
  );
});

test('property: adding resume text never reduces its score', () => {
  fc.assert(
    fc.property(fc.string(), fc.string(), (text, additionalText) => {
      assert.ok(scoreResume(`${text} ${additionalText}`) >= scoreResume(text));
    }),
    { numRuns: 300 },
  );
});

test('property: skill extraction is unique and stable across case changes', () => {
  const skill = fc.constantFrom(
    'javascript', 'react', 'node', 'express', 'python', 'java', 'sql',
    'postgresql', 'mongodb', 'aws', 'docker', 'kubernetes', 'typescript',
  );

  fc.assert(
    fc.property(fc.array(skill, { maxLength: 30 }), (skills) => {
      const text = skills.join(' ');
      const extracted = extractSkills(text);
      const upperCaseExtracted = extractSkills(text.toUpperCase());

      assert.equal(new Set(extracted).size, extracted.length);
      assert.deepEqual(extracted, upperCaseExtracted);
    }),
    { numRuns: 300 },
  );
});

test('property: summaries stay within word and character limits', () => {
  fc.assert(
    fc.property(fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 250 }), (words) => {
      const summary = buildSummary(words.join(' '));
      assert.ok(summary.length <= 263);
      assert.ok(summary.split(/\s+/).filter(Boolean).length <= 120);
    }),
    { numRuns: 300 },
  );
});

test('property: analyzer output remains internally consistent for arbitrary text', () => {
  fc.assert(
    fc.property(fc.string(), (text) => {
      const result = analyzeResume(text);
      assert.ok(result.score >= 58 && result.score <= 100);
      assert.equal(new Set(result.skills).size, result.skills.length);
      assert.ok(result.jobMatches.length > 0);
      assert.equal(new Set(result.missingSkills).size, result.missingSkills.length);
      assert.equal(result.learningPlan.length, result.missingSkills.length || 1);
      assert.ok(result.recommendations.length >= 3);
      assert.ok(result.recommendations.length <= 6);
    }),
    { numRuns: 300 },
  );
});

test('property: missing skills are a unique, ordered subset of preferred skills', () => {
  const preferred = ['javascript', 'react', 'sql', 'python', 'communication', 'project management'];

  fc.assert(
    fc.property(fc.array(fc.string()), (skills) => {
      const missing = buildMissingSkills(skills);
      const expected = preferred.filter((skill) => !skills.includes(skill));

      assert.deepEqual(missing, expected);
    }),
    { numRuns: 300 },
  );
});
