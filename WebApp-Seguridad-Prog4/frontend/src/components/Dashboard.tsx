import React, { useState } from 'react';
import { Vulnerability, VulnerabilityType } from '../types';
import BruteForce from './vulnerabilities/BruteForce';
import CommandInjection from './vulnerabilities/CommandInjection';
import CSRF from './vulnerabilities/CSRF';
import FileInclusion from './vulnerabilities/FileInclusion';
import FileUpload from './vulnerabilities/FileUpload';
import InsecureCaptcha from './vulnerabilities/InsecureCaptcha';
import SQLInjection from './vulnerabilities/SQLInjection';
import BlindSQLInjection from './vulnerabilities/BlindSQLInjection';

interface DashboardProps {
  username: string;
}

const Dashboard: React.FC<DashboardProps> = ({ username }) => {
  const [activeVulnerability, setActiveVulnerability] = useState<VulnerabilityType>(
    VulnerabilityType.BRUTE_FORCE
  );

  const vulnerabilities: Vulnerability[] = [
    { 
      id: VulnerabilityType.BRUTE_FORCE, 
      name: 'Brute Force', 
      component: BruteForce 
    },
    { 
      id: VulnerabilityType.COMMAND_INJECTION, 
      name: 'Command Injection', 
      component: CommandInjection 
    },
    { 
      id: VulnerabilityType.CSRF, 
      name: 'CSRF', 
      component: CSRF 
    },
    { 
      id: VulnerabilityType.FILE_INCLUSION, 
      name: 'File Inclusion', 
      component: FileInclusion 
    },
    { 
      id: VulnerabilityType.FILE_UPLOAD, 
      name: 'File Upload', 
      component: FileUpload 
    },
    { 
      id: VulnerabilityType.INSECURE_CAPTCHA, 
      name: 'Insecure CAPTCHA', 
      component: InsecureCaptcha 
    },
    { 
      id: VulnerabilityType.SQL_INJECTION, 
      name: 'SQL Injection', 
      component: SQLInjection 
    },
    { 
      id: VulnerabilityType.BLIND_SQL_INJECTION, 
      name: 'SQL Injection (Blind)', 
      component: BlindSQLInjection 
    }
  ];

  const ActiveComponent = vulnerabilities.find(v => v.id === activeVulnerability)?.component;

  return (
    <div className="dashboard">
      <div className="vulnerability-buttons">
        {vulnerabilities.map(vuln => (
          <button
            key={vuln.id}
            className={`vulnerability-btn ${activeVulnerability === vuln.id ? 'active' : ''}`}
            onClick={() => setActiveVulnerability(vuln.id)}
          >
            {vuln.name}
          </button>
        ))}
      </div>
      
      <div className="vulnerability-content">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default Dashboard;
