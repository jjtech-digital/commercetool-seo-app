import { useState } from 'react';
import Text from '@commercetools-uikit/text';
import styles from './TableContainer.module.css';
import { ISelectedPageProps } from './TableContainer.types';
import { TableContainerNavMock } from './TableContainer.mock';
import TableNavHeader from './TableNavHeader';
import TableData from './TableData';
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
      <Text.Headline as="h2">
        {'Generate SEO title and description'}
      </Text.Headline>
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
