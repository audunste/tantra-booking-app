// src/Terms.js
import React from 'react';
import Header from './components/Header';
import ContentWrapper from './components/ContentWrapper';

const Terms = () => {

  return (
    <div>
      <Header
        title="Tantra Masseur Booking System"
        logoUrl="/tantra_logo_colours3.png"
        menuItems={null}
      />
      <main>
        <ContentWrapper>
          <h1>Terms and Conditions</h1>
          <p>Last updated: August 4, 2024</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Tantra Masseur Booking System, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
          </p>

          <h2>2. Compliance with Laws</h2>
          <p>
            Users agree to use the Tantra Masseur Booking System only for lawful purposes and in a manner that does not infringe the rights of or restrict or inhibit the use and enjoyment of this site by any third party. Prohibited behavior includes but is not limited to harassing or causing distress or inconvenience to any other user, or transmitting or publishing obscene or offensive content.
          </p>

          <h2>3. Limitation of Liability</h2>
          <p>
            Audun Steinholm is not responsible for any losses or damages, whether direct, indirect, incidental, or consequential, arising from the use or inability to use the Tantra Masseur Booking System. This includes but is not limited to damages for loss of profits, use, data, or other intangibles.
          </p>

          <h2>4. Disclaimer of Warranties</h2>
          <p>
            The service is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>

          <h2>5. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Audun Steinholm from any claims, liabilities, damages, losses, and expenses, including without limitation, reasonable legal fees and costs, arising out of or in any way connected with your access to or use of the service.
          </p>

          <h2>6. Changes to the Terms</h2>
          <p>
            Audun Steinholm reserves the right to modify these terms at any time. Any changes will be posted on this page, and it is your responsibility to review these terms periodically. Your continued use of the site after any changes indicates your acceptance of the new terms.
          </p>

          <h2>7. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Norway. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Norway. This is applicable even when masseurs and clients are located in different countries.
          </p>

          <p>
            If you have any questions about these terms, please contact Audun Steinholm at <a href="mailto:audunste@gmail.com">audunste@gmail.com</a>.
          </p>
        </ContentWrapper>
      </main>
    </div>
  );
};

export default Terms;
