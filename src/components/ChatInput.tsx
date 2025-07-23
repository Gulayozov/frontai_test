import { Input, Button, Upload } from 'antd';
import { useState, KeyboardEvent } from 'react';
import { PlusOutlined, AudioOutlined, SendOutlined, PaperClipOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

const { TextArea } = Input;

interface ChatInputProps {
  onSend: (message: string, files: UploadFile[]) => void;
  loading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, loading }) => {
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

export default ChatInput;
