import { ISelectedPageProps, NavItems } from './TableContainer.types';
import TableContainer from './TableContainer';
import DescriptionTableContainer from './DescriptionTableContainer';

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
