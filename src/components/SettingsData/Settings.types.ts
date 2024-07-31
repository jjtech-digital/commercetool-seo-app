import { FieldValues, SubmitHandler } from "react-hook-form";
import { IAppContext } from "../../context/AppContext";

export enum NavItems {
  RULES = 'Rules',
  OPENAI = 'Open AI',
}

export interface ISelectedPageProps {
  title: string;
  isDefaultSelected: boolean;
  name: string;
}

export interface RuleComponent {
  heading?: string;
  handleSubmit?: any;
  onSubmitFunction?: SubmitHandler<FieldValues>;
  fields?: any;
  register?: any;
  errors?: any;
  currentIndex?: number;
  handleAddField?: () => void;
  handleRemoveField?: any;
}

export interface SettingRuleProps {
  ruleComponents: RuleComponent[];
  state: IAppContext;
}

export interface RuleInputFieldProps {
  item: {
    deletable: boolean;
    id: string;
    rulesInput: string;
  };
  index: number;
  component: RuleComponent;
}

export interface RuleFormProps {
  component: RuleComponent;
  isApiFetching: boolean;
}

export interface RuleContentItem {
  rulesInput: string;
  deletable: boolean;
}
export interface FormData {
  rulesContent: RuleContentItem[];
}
export interface SubmitEvent {
  preventDefault: () => void;
}