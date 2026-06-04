
import accountancyBComm from './accountancy-bcomm.json';
import accountancyHonours from './accountancy-honours.json';
import accountancyCert from './accountancy-cert.json';
import btmBComm from './btm-bcomm.json';
import btmMinor from './btm-minor.json';
import economicsBComm from './economics-bcomm.json';
import economicsMinor from './economics-minor.json';
import financeBComm from './finance-bcomm.json';
import financeMinor from './finance-minor.json';
import hrmBComm from './hrm-bcomm.json';
import hrmMinor from './hrm-minor.json';
import internationalbusinessBComm from './international-business-bcomm.json';
import internationalbusinessMinor from './international-business-minor.json';
import managementBComm from './management-bcomm.json';
import managementMinor from './management-minor.json';
import marketingBComm from './marketing-bcomm.json';
import marketingMinor from './marketing-minor.json';
import supplychainBComm from './supply-chain-bcomm.json';
import supplychainMinor from './supply-chain-minor.json';
import minorassurance from './minor-assurance.json';
import minorbusinessstudies from './minor-business-studies.json';
import minorentrepreneurship from './minor-entrepreneurship.json';
import minorisaudit from './minor-is-audit.json';
import minorrealestate from './minor-real-estate.json';

export const JMSB_PROGRAMS = {
  'accountancy': {
    id: 'accountancy',
    name: 'Accountancy',
    category: 'Accounting',
    options: [
      { id: 'bcomm', name: 'Major in Accountancy (BComm)', data: accountancyBComm },
      { id: 'honours', name: 'Honours in Accountancy', data: accountancyHonours },
      { id: 'cert', name: 'Certificate in Accountancy', data: accountancyCert }
    ],
    weights: {}
  },
  'btm': {
    id: 'btm',
    name: 'Business Technology Management',
    category: 'Tech & Supply Chain',
    options: [
      { id: 'bcomm', name: 'Major in Business Technology Management (BComm)', data: btmBComm },
      { id: 'minor', name: 'Minor in Business Technology Management', data: btmMinor }
    ],
    weights: {}
  },
  'economics': {
    id: 'economics',
    name: 'Economics',
    category: 'Economics & Finance',
    options: [
      { id: 'bcomm', name: 'Major in Economics (BComm)', data: economicsBComm },
      { id: 'minor', name: 'Minor in Economics', data: economicsMinor }
    ],
    weights: {}
  },
  'finance': {
    id: 'finance',
    name: 'Finance',
    category: 'Economics & Finance',
    options: [
      { id: 'bcomm', name: 'Major in Finance (BComm)', data: financeBComm },
      { id: 'minor', name: 'Minor in Finance', data: financeMinor }
    ],
    weights: {}
  },
  'hrm': {
    id: 'hrm',
    name: 'Human Resource Management',
    category: 'Management & HR',
    options: [
      { id: 'bcomm', name: 'Major in Human Resource Management (BComm)', data: hrmBComm },
      { id: 'minor', name: 'Minor in Human Resource Management', data: hrmMinor }
    ],
    weights: {}
  },
  'international-business': {
    id: 'international-business',
    name: 'International Business',
    category: 'Marketing & IB',
    options: [
      { id: 'bcomm', name: 'Major in International Business (BComm)', data: internationalbusinessBComm },
      { id: 'minor', name: 'Minor in International Business', data: internationalbusinessMinor }
    ],
    weights: {}
  },
  'management': {
    id: 'management',
    name: 'Management',
    category: 'Management & HR',
    options: [
      { id: 'bcomm', name: 'Major in Management (BComm)', data: managementBComm },
      { id: 'minor', name: 'Minor in Management', data: managementMinor }
    ],
    weights: {}
  },
  'marketing': {
    id: 'marketing',
    name: 'Marketing',
    category: 'Marketing & IB',
    options: [
      { id: 'bcomm', name: 'Major in Marketing (BComm)', data: marketingBComm },
      { id: 'minor', name: 'Minor in Marketing', data: marketingMinor }
    ],
    weights: {}
  },
  'supply-chain': {
    id: 'supply-chain',
    name: 'Supply Chain Operations Management',
    category: 'Tech & Supply Chain',
    options: [
      { id: 'bcomm', name: 'Major in Supply Chain Operations Management (BComm)', data: supplychainBComm },
      { id: 'minor', name: 'Minor in Supply Chain Operations Management', data: supplychainMinor }
    ],
    weights: {}
  },
  'standalone-minors': {
    id: 'standalone-minors',
    name: 'Standalone Minors & Certificates',
    category: 'Minors & Certificates',
    options: [
      { id: 'minor-assurance', name: 'Minor in Assurance, Fraud Prevention and Investigative Services', data: minorassurance },
      { id: 'minor-business-studies', name: 'Minor in Business Studies', data: minorbusinessstudies },
      { id: 'minor-entrepreneurship', name: 'Minor in Entrepreneurship', data: minorentrepreneurship },
      { id: 'minor-is-audit', name: 'Minor in Information Systems Audit and Risk Management', data: minorisaudit },
      { id: 'minor-real-estate', name: 'Minor in Real Estate', data: minorrealestate },
    ],
    weights: {}
  }
};
