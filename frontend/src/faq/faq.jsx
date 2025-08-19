import React, { useState } from 'react';
import './FAQ.css';

const faqData = [
  {
    question: "What is Career Pilot?",
    answer: "Career Pilot is an AI-powered platform that helps users discover career paths tailored to their skills, interests, and goals."
  },
  {
    question: "How does the AI recommend careers?",
    answer: "Our AI analyzes your input—skills, interests, and qualifications—and matches them with real-time job market data to suggest suitable roles."
  },
  {
    question: "Is Career Pilot free to use?",
    answer: "Yes, the basic features are free. Premium features like advanced analytics and personalized coaching may require a subscription."
  },
  {
    question: "What is Career Compass?",
    answer: "Career Compass is a feature within Career Pilot that uses job board data and AI to guide users toward high-demand roles."
  },
  {
    question: "How accurate are the recommendations?",
    answer: "Our recommendations are based on up-to-date job market trends and your personal profile, offering a high degree of relevance."
  },
  {
    question: "Can I track my progress?",
    answer: "Yes! The dashboard allows you to monitor your career exploration, saved roles, and salary insights."
  },
  {
    question: "Do I need to create an account?",
    answer: "You can explore some features without an account, but signing up unlocks personalized recommendations and dashboard tracking."
  },
  {
    question: "Is my data safe?",
    answer: "Absolutely. We use industry-standard encryption and never share your personal data without consent."
  },
  {
    question: "Can I update my profile later?",
    answer: "Yes, you can edit your skills, interests, and goals anytime to refine your recommendations."
  },
  {
    question: "What kind of careers are included?",
    answer: "We cover a wide range—from tech and healthcare to creative industries and skilled trades."
  },
  {
    question: "How often is the job data updated?",
    answer: "Our system syncs with major job boards daily to ensure recommendations reflect current market demand."
  },
  {
    question: "Can I get salary insights?",
    answer: "Yes, Career Compass provides salary ranges and trends for recommended roles."
  },
  {
    question: "Is there a mobile version?",
    answer: "Yes, Career Pilot is fully responsive and works seamlessly on mobile devices."
  },
  {
    question: "Can I share my dashboard with others?",
    answer: "You can export or share your dashboard insights with mentors, career coaches, or friends."
  },
  {
    question: "What makes Career Pilot different from other platforms?",
    answer: "We combine AI, real-time job data, and personalized input to offer a truly tailored career discovery experience."
  }
];

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="faq-item">
    <div className="faq-question" onClick={onClick}>
      {question}
    </div>
    {isOpen && <div className="faq-answer">{answer}</div>}
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2>Frequently Asked Questions</h2>
      {faqData.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onClick={() => toggleFAQ(index)}
        />
      ))}
    </div>
  );
};

export default FAQ;  