import ViewSwitcher from '@commercetools-uikit/view-switcher';
import { ISelectedPageProps } from '../SettingsData/Settings.types';

interface ITabHeaderProps {
  defaultPage: ISelectedPageProps | undefined;
  selectedPage: ISelectedPageProps[];
  setSelectedPage: (pages: ISelectedPageProps[]) => void;
}
const TabToggler = ({
  defaultPage,
  selectedPage,
  setSelectedPage,
}: ITabHeaderProps) => {
  const menuToggleHandler = (pageName: string) => {
    const updatedActivePages = selectedPage.map(
      (navMenu: ISelectedPageProps) => {
        if (navMenu.name === pageName) {
          return {
            ...navMenu,
            isDefaultSelected: true,
          };
        } else {
          return {
            ...navMenu,
            isDefaultSelected: false,
          };
        }
      }
    );
    setSelectedPage(updatedActivePages);
  };

  return (
    <div>
      <ViewSwitcher.Group
        defaultSelected={defaultPage?.name}
        onChange={(value) => menuToggleHandler(value)}
      >
        {selectedPage.map((navMenu) => {
          return (
            <ViewSwitcher.Button key={navMenu?.name} value={navMenu?.name}>
              {navMenu?.title}
            </ViewSwitcher.Button>
          );
        })}
      </ViewSwitcher.Group>
    </div>
  );
};

export default TabToggler;
