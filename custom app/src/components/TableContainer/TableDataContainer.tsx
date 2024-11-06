import { useState } from 'react';
import Text from '@commercetools-uikit/text';
import styles from './TableContainer.module.css';
import { TableContainerNavMock } from './TableContainer.mock';
import TableData from './TableData';
import { Link, useRouteMatch } from 'react-router-dom';
import { GearIcon } from '@commercetools-uikit/icons';
import TabToggler from '../TabToggler/TabToggler';
import { ISelectedPageProps } from '../SettingsData/Settings.types';

const TableDataContainer = () => {
  const [selectedPage, setSelectedPage] = useState<ISelectedPageProps[]>(
    TableContainerNavMock
  );
  const defaultPage = selectedPage?.find((item) => item.isDefaultSelected);
  const match = useRouteMatch();
  return (
    <div className={`${styles.tableContainer}`}>
      <Text.Headline as="h2">{'Generate Product information'}</Text.Headline>
      <div className={`${styles.navContainer}`}>
        <TabToggler
          defaultPage={defaultPage}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
        <Link to={`${match.url}/settings`} className={`${styles.settingIcon}`}>
          <GearIcon size="scale" color="primary40" />
        </Link>
      </div>

      {defaultPage && <TableData defaultPage={defaultPage} />}
    </div>
  );
};

export default TableDataContainer;
