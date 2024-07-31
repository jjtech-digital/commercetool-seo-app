import Text from '@commercetools-uikit/text';

type SearchPerformedProps = {
    searchPerformed: boolean
}

const SearchPerformed = (props : SearchPerformedProps) => {
    const { searchPerformed } = props;
    if (searchPerformed) {
        return (
          <Text.Body>
            {'No products found matching your search criteria.'}
          </Text.Body>
        );
      } else {
        return <Text.Body>{'No products available.'}</Text.Body>;
      }
}

export default SearchPerformed