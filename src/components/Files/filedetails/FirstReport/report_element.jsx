import React from 'react';

const RenderContent = ({ content }) => {
    return (
      <div>
        {content instanceof Array ? (
          content.map((item, index) => (
            <p key={index} style={{ fontWeight: item.bold ? 'bold' : 'normal' }}>{item.text}</p>
          ))
        ) : (
          <p style={{ fontWeight: content?.bold ? 'bold' : 'normal' }}>{content}</p>
        )}
      </div>
    );
  };


  export default RenderContent;