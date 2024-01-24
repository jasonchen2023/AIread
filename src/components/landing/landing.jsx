import React from 'react';
import { toast } from 'react-toastify';
import SelectFileButton from '../selectFile/SelectFileButton';
import { uploadFile, uploadDocumentSummary } from '../../services/firebase';
import styles from './styles.module.scss';
import demo from '../../assets/aiReadDemo.png';
import { saveTextForChat } from '../../services/TextProcess';

export default function Landing(props) {
  const failureToast = (err) => {
    toast(err);
  };

  const handleFileSelect = async (file) => {
    const { fileId, rawContent } = await uploadFile(file, file.name, failureToast);
    const res = await saveTextForChat(fileId, rawContent);
    const summaryRes = await uploadDocumentSummary(fileId, rawContent);

    window.location.href = `/demo/${fileId}`;
  };

  return (
    <div className={styles.page}> {/* Use the styles from the CSS file */}
      {/* ... (existing code) */}
      <button className={styles.signUp} type="button">Sign up</button>
      <div className={styles.headerContainer}>
        <h1 className={styles.heading}>AIread</h1> {/* Use the specific style for heading */}
        <p className={styles.paragraph}>
          An AI-driven PDF analysis tool for an enriched reading experience
        </p>
      </div>
      <SelectFileButton onFileSelect={handleFileSelect} />
      <div className={styles.featureContainer}>
        <div className={styles.featureBox}>
          <p className={styles.featureDescription}>Generate document summaries and analysis. View the original texts and their analysis side by side.</p>
          <img src={demo} alt="Demo" className={styles.featureImage} />
        </div>
        <div className={styles.featureBox}>
          <img src={demo} alt="Demo" className={styles.featureImage} />
          <p className={styles.featureDescription}> Get quick document insights through interactive chat</p>
        </div>
        <div className={styles.featureBox}>
          <p className={styles.featureDescription}> Add notes to your summaries! Highlight key points, add your own insights, and make AI summaries your own.</p>
          <img src={demo} alt="Demo" className={styles.featureImage} />
        </div>
      </div>

      {/* ... (existing code) */}
    </div>
  );

  // return (
  //   <div className="page">
  //     {/* <ReactFullpage
  //       licenseKey="V7KL9-7M8AI-WJJ8I-K9I6H-OMAXN"
  //       scrollingSpeed={1000}
  //       render={({ state, fullpageApi }) => {
  //         return (
  //           <ReactFullpage.Wrapper>
  //             <div className="section">
  //               <AIreadTitle />
  //             </div>
  //             <div className="section">
  //               <AIreadIntro />
  //             </div>
  //             <div className="section">
  //               <LoginSignup fullpageApi={fullpageApi} />
  //             </div>
  //           </ReactFullpage.Wrapper>
  //         );
  //       }}
  //     /> */}

  //     <div
  //       style={{
  //         // backgroundColor: '#0C0E16',
  //         color: 'black',
  //         fontFamily: 'Arial, sans-serif',
  //         height: '100vh',
  //         display: 'flex',
  //         flexDirection: 'column',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         textAlign: 'center',
  //         padding: '0 20px',
  //         marginTop: '100px',
  //       }}
  //     >
  //       <h1
  //         style={{
  //           fontSize: '72px',
  //           fontWeight: 'bold',
  //           margin: '0',
  //         }}
  //       >
  //         AIread
  //       </h1>
  //       <p
  //         style={{
  //           fontSize: '24px',
  //           margin: '30px 0',
  //         }}
  //       >
  //         An AI-driven PDF analysis tool for an enriched reading experience
  //       </p>
  //       <SelectFileButton onFileSelect={handleFileSelect} />

  //       <div style={{
  //         // backgroundColor: '#0C0E16',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         textAlign: 'center',
  //         padding: '0 20px',
  //       }}
  //       >
  //         <h3
  //           style={{
  //             textAlign: 'center',
  //             fontSize: '48px',
  //             marginTop: '100px',
  //             marginBottom: '60px',
  //           }}
  //         >
  //           Generate document summaries and analysis.
  //           View the original texts and their analysis side by side.
  //         </h3>
  //         <h3
  //           style={{
  //             textAlign: 'center',
  //             fontSize: '48px',
  //             marginTop: '100px',
  //             marginBottom: '60px',
  //           }}
  //         >
  //           Get quick document insights through interactive chat
  //         </h3>
  //         <h3
  //           style={{
  //             textAlign: 'center',
  //             fontSize: '48px',
  //             marginTop: '100px',
  //             marginBottom: '60px',
  //           }}
  //         >
  //           Add notes to your summaries! Highlight key points, add your own insights, and make AI summaries your own.
  //         </h3>
  //       </div>

  //     </div>

  //   </div>
  // );
}
