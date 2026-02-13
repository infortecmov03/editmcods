import React from 'react';
import './statusbar.css';

interface StatusBarProps {
  lineNumber: number;
  column: number;
  totalLines: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ lineNumber, column, totalLines }) => {
  return (
    <div className="status-bar">
      <div className="status-group">
        <span>Ln {lineNumber}, Col {column}</span>
      </div>
      <div className="status-group">
        <span>Linhas: {totalLines}</span>
      </div>
    </div>
  );
};

export default StatusBar;
