import { Modal, Button, FloatButton, Input, Upload, Card, Typography } from 'antd';
import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { 
  MessageOutlined, 
  CloseOutlined, 
  PlusOutlined, 
  AudioOutlined, 
  SendOutlined, 
  PaperClipOutlined 
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

const { TextArea } = Input;
const { Paragraph } = Typography;

// Types
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatDialogProps {
  /**
   * Позиция плавающей кнопки
   * @default { right: 24, bottom: 24 }
   */
  position?: {
    right?: number;
    bottom?: number;
    left?: number;
    top?: number;
  };
  
  /**
   * Размер модального окна
   */
  modalWidth?: number | string;
  modalHeight?: number | string;
  /**
   * Заголовок модального окна
   */
  title?: string;
  
  /**
   * Кастомная иконка для плавающей кнопки
   */
  icon?: React.ReactNode;
  
  /**
   * Показывать ли диалог изначально открытым
   */
  defaultOpen?: boolean;
  
  /**
   * Кастомная функция для отправки сообщений (если не указана, используется дефолтная)
   */
  onSendMessage?: (message: string, files: UploadFile[]) => Promise<string>;
  
  /**
   * Начальные сообщения в диалоге
   */
  initialMessages?: Message[];
  
  /**
   * Стиль для плавающей кнопки
   */
  buttonStyle?: React.CSSProperties;
  
  /**
   * Дополнительные пропсы для модального окна
   */
  modalProps?: any;
}

// Chat Messages Component
const ChatMessages: React.FC<{ messages: Message[] }> = ({ messages }) => {
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

// Chat Input Component
const ChatInput: React.FC<{
  onSend: (message: string, files: UploadFile[]) => void;
  loading: boolean;
}> = ({ onSend, loading }) => {
  const [value, setValue] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() || fileList.length > 0) {
        onSend(value.trim(), fileList);
        setValue('');
        setFileList([]);
      }
    }
  };

  const handleSendClick = () => {
    if (value.trim() || fileList.length > 0) {
      onSend(value.trim(), fileList);
      setValue('');
      setFileList([]);
    }
  };

  const handleUploadChange: UploadProps['onChange'] = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-2);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
  };

  const uploadProps: UploadProps = {
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange: handleUploadChange,
    multiple: true,
    showUploadList: false,
  };

  return (
    <div
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: 8,
        padding: '8px 12px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* File preview */}
      {fileList.length > 0 && (
        <div style={{ marginBottom: 6 }}>
          {fileList.map((file) => (
            <div key={file.uid} style={{ fontSize: 13, color: '#555', display: 'flex', alignItems: 'center', gap: 6 }}>
              <PaperClipOutlined />
              <span>{file.name}</span>
              {file.status === 'uploading' && <em style={{ color: '#999' }}>(Uploading...)</em>}
            </div>
          ))}
        </div>
      )}

      {/* Text area */}
      <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Send a message…"
        autoSize={{ minRows: 2, maxRows: 6 }}
        disabled={loading}
        style={{
          resize: 'none',
          border: 'none',
          padding: 0,
          outline: 'none',
          boxShadow: 'none',
        }}
      />

      {/* Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 8,
          alignItems: 'center',
        }}
      >
        <Upload {...uploadProps} fileList={fileList}>
          <Button
            type="text"
            shape="circle"
            icon={<PlusOutlined />}
            style={{ fontSize: 18 }}
          />
        </Upload>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="text"
            shape="circle"
            icon={<AudioOutlined />}
            style={{ fontSize: 18 }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={handleSendClick}
            disabled={loading || (!value.trim() && fileList.length === 0)}
          />
        </div>
      </div>
    </div>
  );
};

// Main Chat Dialog Component
const ChatDialog: React.FC<ChatDialogProps> = ({
  position = { right: 24, bottom: 24 },
  modalWidth = 1000,
  title = 'Чат-помощник',
  icon = <MessageOutlined />,
  defaultOpen = false,
  onSendMessage,
  initialMessages = [],
  buttonStyle,
  modalProps = {},
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);

  // Default message sending function
  const defaultSendMessage = async (userMessage: string, files: UploadFile[]): Promise<string> => {
    try {
      // Replace this with your actual API call
      // const response = await askQuestion(userMessage);
      // return response.result;
      
      // Mock response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `Это ответ на ваше сообщение: "${userMessage}"`;
    } catch (error) {
      console.error('Error calling API:', error);
      throw new Error('Извините, произошла ошибка при обработке вашего запроса. Попробуйте еще раз.');
    }
  };

  const handleSend = async (userMessage: string, files: UploadFile[]) => {
    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Use custom function or default
      const sendFunction = onSendMessage || defaultSendMessage;
      const response = await sendFunction(userMessage, files);
      
      // Add assistant response
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ]);
    } catch (error) {
      // Add error message
      setMessages((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: error instanceof Error ? error.message : 'Произошла ошибка при обработке запроса.' 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <>
      {/* Floating button to open dialog */}
      <FloatButton
        icon={isOpen ? <CloseOutlined /> : icon}
        onClick={() => handleOpenChange(!isOpen)}
        style={{
          position: 'fixed',
          ...position,
          ...buttonStyle,
        }}
        type={isOpen ? 'default' : 'primary'}
        tooltip={isOpen ? 'Закрыть чат' : 'Открыть чат'}
      />

      {/* Modal dialog */}
      <Modal
        title={title}
        open={isOpen}
        onCancel={() => handleOpenChange(false)}
        footer={null}
        width={modalWidth}
        style={{ top: 20 }}
        styles={{
          body: { 
            padding: 0, 
            height: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
        destroyOnClose={false}
        {...modalProps}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Messages area - takes all available space */}
          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              minHeight: 0,
            }}
          >
            <ChatMessages messages={messages} />
          </div>

          {/* Input area - fixed at bottom */}
          <div
            style={{
              flexShrink: 0,
              borderTop: '1px solid #f0f0f0',
              padding: '16px',
              backgroundColor: 'white',
            }}
          >
            <ChatInput onSend={handleSend} loading={loading} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChatDialog;