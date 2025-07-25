import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import { Card, Typography, Space } from 'antd';
import ChatDialog from '../components/AiAssistant/ChatDialog'; // Adjust the import path as needed

const { Title, Paragraph } = Typography;

const Welcome: React.FC = () => {
  return (
    <PageContainer title={false}>
      <div style={{ padding: '24px' }}>
        {/* Основной контент страницы */}
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card>
            <Title level={2}>Добро пожаловать!</Title>
            <Paragraph>
              Это главная страница вашего приложения. Теперь у вас есть встроенный чат-помощник,
              который доступен через плавающую кнопку в правом нижнем углу.
            </Paragraph>
            <Paragraph>
              Вы можете легко добавить этот чат на любую другую страницу, просто импортировав
              компонент <code>ChatDialog</code>.
            </Paragraph>
          </Card>

          <Card title="Функциональность чата">
            <ul>
              <li>Отправка текстовых сообщений</li>
              <li>Загрузка файлов</li>
              <li>История сообщений</li>
              <li>Автоматическая прокрутка к последнему сообщению</li>
              <li>Модальное окно для удобного взаимодействия</li>
            </ul>
          </Card>
        </Space>

        {/* Чат-диалог - теперь это всего одна строка! */}
        <ChatDialog/>
      </div>
    </PageContainer>
  );
};

export default Welcome;