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

      {/* <div
        style={{
          backgroundColor: '#0C0E16',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        <div
          style={{ marginBottom: '20px' }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Introducing
          </span>
        </div>
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            margin: '0',
          }}
        >
          AIread
        </h1>
        <p
          style={{
            fontSize: '24px',
            margin: '30px 0',
          }}
        >
          An AI-driven PDF analysis tool for an enriched reading experience
        </p>
        <button type="button"
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            backgroundColor: '#6E00FF',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 30px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Sign up
        </button>

        <h3
          style={{
            textAlign: 'center',
            fontSize: '48px',
            marginTop: '100px',
            marginBottom: '60px',
          }}
        >
          Analyze your documents by entering custom prompts. View the original text and summaries side by side for increased comprehension.
        </h3>

      </div> */}

    </div>
  );
}
