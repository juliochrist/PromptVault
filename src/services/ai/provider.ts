export interface AIScore {
  clarity: number;
  context: number;
  specificity: number;
  consistency: number;
  suggestions: string[];
}

export interface AIProvider {
  improve(prompt: string): Promise<string>;
  explain(prompt: string): Promise<string>;
  summarise(prompt: string): Promise<string>;
  translate(prompt: string, language: string): Promise<string>;
  score(prompt: string): Promise<AIScore>;
  generateBetter(prompt: string): Promise<string>;
}
