import React from 'react';

interface HtmlContentProps {
  html: string;
}

const HtmlContent: React.FC<HtmlContentProps> = ({ html }) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default HtmlContent;