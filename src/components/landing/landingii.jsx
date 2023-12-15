import ReactFullpage from '@fullpage/react-fullpage';
import React from 'react';
import './styles.module.scss';

export default function Landing(props) {
  return (
    <div className="page">
      <ReactFullpage
        licenseKey="V7KL9-7M8AI-WJJ8I-K9I6H-OMAXN"
        scrollingSpeed={1000}
        render={({ state, fullpageApi }) => (
          <div
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
                Introducing Linear Asks
              </span>
            </div>
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                margin: '0',
              }}
            >
              Linear is a better way to build products
            </h1>
            <p
              style={{
                fontSize: '24px',
                margin: '30px 0',
              }}
            >
              Meet the new standard for modern software development.
              <br />
              Streamline issues, sprints, and product roadmaps.
            </p>

          </div>
        )}
      />
    </div>
  );
}
