export enum NavItems {
  RULES = 'Rules',
  OPENAI = 'Open AI',
}

export interface ISelectedPageProps {
  title: string;
  isDefaultSelected: boolean;
  name: string;
}