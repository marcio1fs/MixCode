
import React from 'react';
import { TechDebtReport } from '../types';
import Icon from './Icon';

interface TechDebtRadarProps {
  report: TechDebtReport | null;
  isLoading: boolean;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
    <div className={`bg-[var(--color-bg-tertiary)]/80 p-4 rounded-lg ${className}`}>
        <h3 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-2">{title}</h3>
        {children}
    </div>
);

const getComplexityClass = (score: number): string => {
    if (score > 15) return 'bg-[var(--color-danger)] text-[var(--color-text-inverted)]';
    if (score > 8) return 'bg-[var(--color-warning)] text-[var(--color-text-inverted)]';
    return 'bg-[var(--color-success)] text-[var(--color-text-inverted)]';
};

const TechDebtRadar: React.FC<TechDebtRadarProps> = ({ report, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full text-[var(--color-text-tertiary)]">
                <div className="text-center">
                    <Icon name="radar" className="w-10 h-10 mx-auto animate-pulse" />
                    <p className="mt-2">Analyzing project tech-debt...</p>
                </div>
            </div>
        );
    }
    
    if (!report) {
        return (
             <div className="flex items-center justify-center h-full text-[var(--color-text-quaternary)]">
                <div className="text-center p-4">
                    <Icon name="radar" className="w-10 h-10 mx-auto mb-2" />
                    <p>Click the Radar icon in the file explorer to generate a new tech-debt report.</p>
                </div>
            </div>
        );
    }
    
    const sortedHeatmap = Object.entries(report.heatmap).sort(([, a], [, b]) => b - a);

    return (
        <div className="h-full overflow-y-auto p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <InfoCard title="Code Coverage">
                    <p className="text-3xl font-bold text-[var(--color-text-primary)]">{report.coverage}</p>
                    <p className="text-xs text-[var(--color-text-quaternary)] mt-1">AI-based estimation</p>
                </InfoCard>
                <InfoCard title="Activity Trend">
                    <p className="text-3xl font-bold text-[var(--color-text-primary)]">{report.trend}</p>
                    <p className="text-xs text-[var(--color-text-quaternary)] mt-1">Total AI interactions</p>
                </InfoCard>
            </div>
            
            <InfoCard title="Complexity Heatmap">
                {sortedHeatmap.length > 0 ? (
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {sortedHeatmap.map(([func, score]) => (
                            <li key={func} className="flex justify-between items-center bg-[var(--color-bg-primary)]/50 p-2 rounded-md">
                                <span className="font-mono text-sm text-[var(--color-text-secondary)] truncate">{func}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getComplexityClass(score)}`}>
                                    {score}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                     <p className="text-sm text-[var(--color-text-quaternary)]">No function data available in ast-map.json.</p>
                )}
            </InfoCard>

            <InfoCard title="Security Risk Areas">
                {report.risk_areas.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                        {report.risk_areas.map((risk, index) => (
                            <li key={index} className="bg-danger/20 p-2 rounded-md">
                                <p className="font-mono text-[var(--color-danger-text)] text-xs truncate">{risk}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-[var(--color-text-quaternary)]">No high-risk patterns like 'eval()' found in chat history.</p>
                )}
            </InfoCard>
        </div>
    );
};

export default TechDebtRadar;