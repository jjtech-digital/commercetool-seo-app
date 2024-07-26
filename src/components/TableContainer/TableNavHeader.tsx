import { ISelectedPageProps } from './tableContainer.types';
import ViewSwitcher from '@commercetools-uikit/view-switcher';

interface ITableHeaderProps {
  defaultPage: ISelectedPageProps | undefined;
  selectedPage: ISelectedPageProps[];
  setSelectedPage: Function;
}
const TableNavHeader = ({
  defaultPage,
  selectedPage,
  setSelectedPage,
}: ITableHeaderProps) => {
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

export default TableNavHeader;
