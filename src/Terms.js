// src/Terms.js
import React from 'react';
import Header from './components/Header';
import ContentWrapper from './components/ContentWrapper';
import { useTranslation } from 'react-i18next';

const Terms = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Header
        title={t('header_title')}
        logoUrl="/tantra_logo_colours3.png"
        menuItems={null}
      />
      <main>
        <ContentWrapper>
          <h1>{t('terms-and-conditions.title')}</h1>
          <p>{t('last-updated.msg')}</p>

          <h2>{t('1-acceptance-of-terms.title')}</h2>
          <p>
            {t('acceptance-of-terms.msg')}
          </p>

          <h2>{t('2-compliance-with-laws.title')}</h2>
          <p>
            {t('compliance-with-laws.msg')}
          </p>

          <h2>{t('3-limitation-of-liability.title')}</h2>
          <p>
            {t('limitation-of-liability.msg')}
          </p>

          <h2>{t('4-disclaimer-of-warranties.title')}</h2>
          <p>
            {t('disclaimer-of-warranties.msg')}
          </p>

          <h2>{t('5-indemnification.title')}</h2>
          <p>
            {t('indemnification.msg')}
          </p>

          <h2>{t('6-changes-to-the-terms.title')}</h2>
          <p>
            {t('changes-to-terms.msg')}
          </p>

          <h2>{t('7-governing-law.title')}</h2>
          <p>
            {t('governing-law.msg')}
          </p>

          <p>
            {t('terms-questions.prefix')} <a href="mailto:audunste@gmail.com">audunste@gmail.com</a>.
          </p>
        </ContentWrapper>
      </main>
    </div>
  );
};

export default Terms;
