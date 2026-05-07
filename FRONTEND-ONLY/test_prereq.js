import { generateOptimalPath } from './src/utils/degreeEngine/prereqGraph.js';

const targetCourses = ['MATH 203', 'MATH 204', 'MATH 205', 'PHYS 204', 'PHYS 205'];
const completedCourses = [];
const allCourses = {
  'MATH 203': { credits: 3.0, prerequisites: [] },
  'MATH 204': { credits: 3.0, prerequisites: [] },
  'MATH 205': { credits: 3.0, prerequisites: [['MATH 203']] },
  'PHYS 204': { credits: 3.0, prerequisites: [['MATH 203']] },
  'PHYS 205': { credits: 3.0, prerequisites: [['MATH 203'], ['PHYS 204']] }
};

const result = generateOptimalPath(targetCourses, completedCourses, allCourses, {}, 15.0);
console.log(JSON.stringify(result, null, 2));
