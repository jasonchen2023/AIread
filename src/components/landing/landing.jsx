import React from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import AIreadIntro from '../aiReadIntro/aiReadIntro';
import AIreadTitle from '../aiReadTitle/aiReadTitle';
import LoginSignup from '../loginSignup/loginSignup';
import './styles.module.scss';

export default function Landing(props) {
  return (
    <div className="page">
      <ReactFullpage
        licenseKey="V7KL9-7M8AI-WJJ8I-K9I6H-OMAXN"
        scrollingSpeed={1000}
        render={({ state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              <div className="section">
                <AIreadTitle />
              </div>
              <div className="section">
                <AIreadIntro />
              </div>
              <div className="section">
                <LoginSignup fullpageApi={fullpageApi} />
              </div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    </div>
  );
}
