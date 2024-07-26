import { ISelectedPageProps, NavItems } from './settings.types';
import SettingsRulesData from './settingsRulesData';
import SettingsOpenAiData from './settingsOpenAiData';
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
