import { ISelectedPageProps, NavItems } from './Settings.types';
import SettingsRulesData from './SettingsRulesData';
import SettingsOpenAiData from './SettingsOpenAiData';
export interface ISetingDataProps {
  defaultPage: ISelectedPageProps | undefined;
}
const SettingsData = ({ defaultPage }: ISetingDataProps) => {
  return (
    <div>
      {(() => {
        switch (defaultPage?.title) {
          case NavItems.RULES:
            return <SettingsRulesData />;
          case NavItems.OPENAI:
            return <SettingsOpenAiData />;
          default:
            return null;
        }
      })()}
    </div>
  );
};

export default SettingsData;
