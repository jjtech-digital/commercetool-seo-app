import Spacings from '@commercetools-uikit/spacings';
import FlatButton from '@commercetools-uikit/flat-button';
import { BackIcon } from '@commercetools-uikit/icons';
import Text from '@commercetools-uikit/text';
import { Link as RouterLink } from 'react-router-dom';
import SettingsData from '../SettingsData/SettingsData';
import { useState } from 'react';
import { settingsNavMock } from '../SettingsData/Settings.mock';
import { ISelectedPageProps } from '../SettingsData/Settings.types';
import TabToggler from '../TabToggler/TabToggler';

const Settings = (props: { linkToProducts: any }) => {
  const [selectedPage, setSelectedPage] =
    useState<ISelectedPageProps[]>(settingsNavMock);
  const defaultPage = selectedPage?.find((item) => item.isDefaultSelected);
  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <FlatButton
          as={RouterLink}
          to={props.linkToProducts}
          label={'Back to Products'}
          icon={<BackIcon />}
        />
        <Text.Headline as="h2">{'Settings'}</Text.Headline>
      </Spacings.Stack>
      <TabToggler
        defaultPage={defaultPage}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
      {defaultPage && <SettingsData defaultPage={defaultPage} />}
    </Spacings.Stack>
  );
};

export default Settings;
