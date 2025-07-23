import { Card, Typography } from 'antd';
import { useEffect, useRef } from 'react';

const { Paragraph } = Typography;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={{ 
      height: '100%', 
      overflowY: 'auto', 
      padding: '1rem', 
      background: '#fafafa',
      boxSizing: 'border-box'
    }}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '1rem',
          }}
        >
          <Card
            style={{
              background: msg.role === 'user' ? '#e6f7ff' : '#f5f5f5',
              maxWidth: '75%',
              borderRadius: 8,
            }}
          >
            <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </Paragraph>
          </Card>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;