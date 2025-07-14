import smartLinterPlugin from './lint-smart';
import codeDiagrammerPlugin from './code-diagrammer';
import { codeOptimizerPlugin } from './code-optimizer';
import { securityAnalyzerPlugin } from './security-analyzer';
import { accessibilityCheckerPlugin } from './accessibility-checker';
import { mixMusePlugin } from './mix-muse';

export const plugins = {
  "Smart Linter": smartLinterPlugin,
  "Code Diagrammer": codeDiagrammerPlugin,
  "Code Optimizer": codeOptimizerPlugin,
  "Security Analyzer": securityAnalyzerPlugin,
  "Accessibility Checker": accessibilityCheckerPlugin,
  "Mix Muse": mixMusePlugin,
};

// Initialize the plugin system
export default plugins;
