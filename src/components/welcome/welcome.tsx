import type { ReactNode } from 'react';
import { useRouteMatch, Link as RouterLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Constraints from '@commercetools-uikit/constraints';
import Grid from '@commercetools-uikit/grid';
import { AngleRightIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import messages from './messages';
import styles from './welcome.module.css';
import WebDeveloperSvg from './web-developer.svg';

type TWrapWithProps = {
  children: ReactNode;
  condition: boolean;
  wrapper: (children: ReactNode) => ReactNode;
};
const WrapWith = (props: TWrapWithProps) => (
  <>{props.condition ? props.wrapper(props.children) : props.children}</>
);
WrapWith.displayName = 'WrapWith';

type TInfoCardProps = {
  title: string;
  content: string;
  linkTo: string;
  isExternal?: boolean;
};

type TChildWrapperProps = {
  isExternal?: boolean;
  linkTo: string;
  children: ReactNode;
};
const ChildWrapper = ({ isExternal, linkTo, children }: TChildWrapperProps) => {
  if (isExternal) {
    return (
      <a
        className={styles.infoCardLink}
        href={linkTo}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  } else {
    return (
      <RouterLink className={styles.infoCardLink} to={linkTo}>
        {children}
      </RouterLink>
    );
  }
};

const createWrapper =
  (linkTo: string, isExternal?: boolean) => (children: ReactNode) =>
    (
      <ChildWrapper isExternal={isExternal} linkTo={linkTo}>
        {children}
      </ChildWrapper>
    );

const InfoCard = (props: TInfoCardProps) => (
  <Grid.Item>
    <div className={styles.infoCard}>
      <Spacings.Stack scale="m">
        <Text.Headline as="h3">
          <WrapWith
            condition={true}
            wrapper={createWrapper(props.linkTo, props.isExternal)}
          >
            <Spacings.Inline scale="s" alignItems="center">
              <span>{props.title}</span>
              <AngleRightIcon size="big" color="primary" />
            </Spacings.Inline>
          </WrapWith>
        </Text.Headline>
        <Text.Body>{props.content}</Text.Body>
      </Spacings.Stack>
    </div>
  </Grid.Item>
);
InfoCard.displayName = 'InfoCard';

const Welcome = () => {
  const match = useRouteMatch();
  const intl = useIntl();

  return (
    <Constraints.Horizontal max={16}>
      <Spacings.Stack scale="xl">
        <Text.Headline as="h1" intlMessage={messages.title} />
        <div>
          <div className={styles.imageContainer}>
            <img
              alt="web developer"
              src={WebDeveloperSvg}
              width="100%"
              height="100%"
            />
          </div>
        </div>

        <Spacings.Stack scale="l">
          <Text.Subheadline as="h4" intlMessage={messages.subtitle} />
          <Grid
            gridGap="16px"
            gridAutoColumns="1fr"
            gridTemplateColumns="repeat(3, 1fr)"
          >
            <InfoCard
              title={intl.formatMessage(messages.cardDocumentationTitle)}
              content={intl.formatMessage(messages.cardDocumentationContent)}
              linkTo="https://docs.commercetools.com/custom-applications/what-is-a-custom-application"
              isExternal
            />
            <InfoCard
              title={intl.formatMessage(messages.cardDesignSystemTitle)}
              content={intl.formatMessage(messages.cardDesignSystemContent)}
              linkTo="https://uikit.commercetools.com"
              isExternal
            />
            <InfoCard
              title={intl.formatMessage(messages.cardChannelsTitle)}
              content={intl.formatMessage(messages.cardChannelsContent)}
              linkTo={`${match.url}/channels`}
            />
          </Grid>
        </Spacings.Stack>
      </Spacings.Stack>
    </Constraints.Horizontal>
  );
};
Welcome.displayName = 'Welcome';

export default Welcome;
