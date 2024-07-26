import { ISelectedPageProps, NavItems } from './tableContainer.types';
import TableContainer from './tableContainer';
import DescriptionTableContainer from './descriptionTableContainer';

export interface ITableDataProps {
  defaultPage: ISelectedPageProps | undefined;
}

const TableData = ({ defaultPage }: ITableDataProps) => {
  return (
    <div>
      {(() => {
        switch (defaultPage?.title) {
          case NavItems.SEO:
            return <TableContainer />;
          case NavItems.DESCRIPTION:
            return <DescriptionTableContainer />;
          default:
            return null;
        }
      })()}
    </div>
  );
};

export default TableData;
