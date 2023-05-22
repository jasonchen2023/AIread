import React from 'react';
import {
  SectionsContainer, Section, ScrollToTopOnMount,
} from 'react-fullpage';
import AIreadIntro from '../aiReadIntro/aiReadIntro';
import AIreadTitle from '../aiReadTitle/aiReadTitle';
import LoginSignup from '../loginSignup/loginSignup';
import './styles.module.scss';

export default function Landing(props) {
  const anchors = ['p1', 'p2', 'p3'];
  const options = {
    sectionClassName: 'section',
    scrollBar: false,
    anchors,
    navigation: true,
    verticalAlign: false,
    arrowNavigation: true,
    sectionPaddingTop: '0',
    sectionPaddingBottom: '0',
  };

  const sectionContainer = (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SectionsContainer {...options}>
      <div>
        <Section>
          <AIreadTitle />
        </Section>
        <Section>
          <AIreadIntro />
        </Section>
        <Section>
          <LoginSignup />
        </Section>
      </div>
    </SectionsContainer>
  );

  return (
    <>
      <ScrollToTopOnMount />
      <div className="page">
        {sectionContainer}
      </div>
    </>

  );
}
