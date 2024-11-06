import Text from '@commercetools-uikit/text';

type SearchPerformedProps = {
  searchPerformed: boolean;
};

const SearchPerformed = (props: SearchPerformedProps) => {
  const { searchPerformed } = props;
  return (
    <Text.Body>
      {searchPerformed
        ? 'No products found matching your search criteria.'
        : 'No products available.'}
    </Text.Body>
  );
};

export default SearchPerformed;
