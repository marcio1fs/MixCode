
import React from 'react';
import AiChat from './AiChat';
import TechDebtRadar from './TechDebtRadar';
import { ChatMessage, TechDebtReport } from '../types';

type RightPaneView = 'chat' | 'radar';

interface RightPaneProps {
    activeTab: RightPaneView;
    onTabChange: (tab: RightPaneView) => void;
    // AI Chat props
    chatMessages: ChatMessage[];
    isChatLoading: boolean;
    onSendMessage: (text: string) => void;
    initialPrompt: string | null;
    onPromptHandled: () => void;
    // Tech Debt Radar props
    techDebtReport: TechDebtReport | null;
    isRadarLoading: boolean;
}

const RightPane: React.FC<RightPaneProps> = (props) => {
    const { activeTab, onTabChange } = props;

    const getTabClass = (tabName: RightPaneView) => {
        return activeTab === tabName 
            ? 'border-[var(--color-accent)] text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)]' 
            : 'border-transparent text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-quaternary)]';
    };

    return (
        <div className="w-[450px] bg-[var(--color-bg-secondary)] flex flex-col border-l border-[var(--color-border-primary)]">
            <div className="flex-shrink-0 border-b border-[var(--color-border-primary)] flex">
                <button 
                    onClick={() => onTabChange('chat')} 
                    className={`flex-1 p-3 text-center font-semibold border-b-2 transition-colors duration-150 text-sm ${getTabClass('chat')}`}
                >
                    AI Assistant
                </button>
                <button 
                    onClick={() => onTabChange('radar')} 
                    className={`flex-1 p-3 text-center font-semibold border-b-2 transition-colors duration-150 text-sm ${getTabClass('radar')}`}
                >
                    Tech-Debt Radar
                </button>
            </div>
            <div className="flex-1 min-h-0 bg-[var(--color-bg-secondary)]">
                {activeTab === 'chat' && (
                    <AiChat 
                        messages={props.chatMessages}
                        isLoading={props.isChatLoading}
                        onSendMessage={props.onSendMessage}
                        initialPrompt={props.initialPrompt}
                        onPromptHandled={props.onPromptHandled}
                    />
                )}
                {activeTab === 'radar' && (
                    <TechDebtRadar
                        report={props.techDebtReport}
                        isLoading={props.isRadarLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default RightPane;