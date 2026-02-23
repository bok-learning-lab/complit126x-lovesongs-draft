export interface Trait {
  id: string;
  name: string;
  description: string;
  rubric: string;
}

export interface TraitScore {
  trait: string;
  score: number;
  reasoning: string;
}

export interface AnalysisResult {
  analysis: TraitScore[];
}

export interface AnalyzeRequest {
  poem: string;
  traits: Trait[];
}

export interface AveragedScore {
  trait: string;
  score: number;
}

export interface GenerateLyricsRequest {
  averagedScores: AveragedScore[];
}

export interface PoemAnalysis {
  id: string;
  name: string;
  poemSnippet: string;
  scores: TraitScore[];
  color: string;
}
