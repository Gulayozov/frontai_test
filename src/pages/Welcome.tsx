import { PageContainer } from '@ant-design/pro-components';
// import { useModel } from '@umijs/max';
// import { theme } from 'antd';
import React, { useState } from 'react';

import ChatInput from '../components/ChatInput';
import ChatMessages from '../components/ChatMessages';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Welcome: React.FC = () => {
  //  const { token } = theme.useToken();
  //  const { initialState } = useModel('@@initialState');

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (userMessage: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Simulated assistant response (replace with API call)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'This is a simulated response.' },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <PageContainer title={false}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 120px)', // Adjust based on your header/navigation height
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
          background: '#fafafa',
        }}
      >
        {/* Messages area - takes all available space and scrolls */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden', // Let ChatMessages handle the scrolling
            minHeight: 0, // Important: allows flex item to shrink below content size
          }}
        >
          <ChatMessages messages={messages} />
        </div>

        {/* Input area - fixed at bottom */}
        <div
          style={{
            flexShrink: 0, // Prevents this from shrinking
            borderTop: '1px solid #ddd',
            padding: '1rem',
            backgroundColor: 'white',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          <ChatInput onSend={handleSend} loading={loading} />
        </div>
      </div>
    </PageContainer>
  );
};

export default Welcome;
