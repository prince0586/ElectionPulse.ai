/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FAQS } from '../constants';

/**
 * Frequently Asked Questions logic.
 */
const FAQSection: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {FAQS.map((faq, i) => (
        <div key={i} className="pro-card flex flex-col gap-4 border-brand-blue/5 hover:border-brand-blue/20">
          <h4 className="font-display font-bold text-lg text-ink-900 leading-tight">{faq.question}</h4>
          <p className="text-sm text-ink-700/60 leading-relaxed font-medium">{faq.answer}</p>
        </div>
      ))}
    </section>
  );
};

export default React.memo(FAQSection);
