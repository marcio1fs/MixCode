

import React, { useRef, useEffect } from 'react';
import Icon from './Icon';
import { TerminalLine } from '../types';

interface TerminalProps {
    lines: TerminalLine[];
    onClose: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ lines, onClose }) => {
    const endOfLinesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Automatically scroll to the bottom when new lines are added
        endOfLinesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [lines]);

    return (
        <div className="h-64 bg-[var(--color-bg-primary)]/80 backdrop-blur-sm flex flex-col font-mono text-sm border-t border-[var(--color-border-primary)] flex-shrink-0">
            <div className="flex items-center justify-between bg-[var(--color-bg-secondary)] px-4 py-1 text-xs text-[var(--color-text-tertiary)]">
                <div className="flex items-center space-x-4">
                    <span className="font-semibold uppercase">Terminal</span>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--color-bg-hover)]">
                    <Icon name="close" className="w-4 h-4" />
                </button>
            </div>
            <div 
                className="flex-1 p-4 overflow-y-auto"
            >
                {lines.map(line => (
                    <div key={line.id} className="whitespace-pre-wrap leading-relaxed">{line.text}</div>
                ))}
                <div ref={endOfLinesRef} />
            </div>
        </div>
    );
};

export default Terminal;