import { useState } from 'react';
import Text from '@commercetools-uikit/text';
import styles from './tableContainer.module.css';
import { ISelectedPageProps } from './tableContainer.types';
import { TableContainerNavMock } from './tableContainer.mock';
import TableNavHeader from './tableNavHeader';
import TableData from './tableData';
import { Link, useRouteMatch } from 'react-router-dom';
import { GearIcon } from '@commercetools-uikit/icons';

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
        <TableNavHeader
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
