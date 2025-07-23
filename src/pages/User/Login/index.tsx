import { login, signup, tokenStorage } from '@/services/ant-design-pro/api';
import {
  AlipayCircleOutlined,
  LockOutlined,
  UserOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, Helmet, history, SelectLang, useIntl, useModel } from '@umijs/max';
import { Alert, message, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const ActionIcons = () => {
  const { styles } = useStyles();

  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.action} />
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} />
    </>
  );
};

const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

// Types based on backend API specification
interface LoginFormValues {
  login: string;
  password: string;
  autoLogin?: boolean;
}

interface SignupFormValues {
  login: string;
  name: string;
  password: string;
}

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const [loginError, setLoginError] = useState<string>('');
  const [signupError, setSignupError] = useState<string>('');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setLoginError('');
      
      // Send login request with only required fields
      const response = await login({
        login: values.login,
        password: values.password,
      });

      // Store the access token
      tokenStorage.set(response.access_token);

      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: '登录成功！',
      });
      message.success(defaultLoginSuccessMessage);

      await fetchUserInfo();
      
      // Redirect to original page or home
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle backend error response
      const errorMessage = error?.data?.detail || error?.message || intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      
      setLoginError(errorMessage);
      message.error(errorMessage);
    }
  };

  const handleSignup = async (values: SignupFormValues) => {
    try {
      setSignupError('');
      
      // Send signup request with only required fields
      const result = await signup({
        login: values.login,
        name: values.name,
        password: values.password,
      });

      message.success(
        intl.formatMessage({
          id: 'pages.signup.success',
          defaultMessage: '注册成功！请登录',
        }),
      );

      // Switch to login tab after successful registration
      setType('account');
      console.log('Signup successful:', result);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle backend error response
      const errorMessage = error?.data?.detail || error?.message || intl.formatMessage({
        id: 'pages.signup.failure',
        defaultMessage: '注册失败！',
      });
      
      setSignupError(errorMessage);
      message.error(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <Lang />
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ai Avicenna"
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            autoLogin: true,
          }}
          actions={[
            <FormattedMessage
              key="loginWith"
              id="pages.login.loginWith"
              defaultMessage="其他登录方式"
            />,
            <ActionIcons key="icons" />,
          ]}
          onFinish={async (values: LoginFormValues | SignupFormValues) => {
            if (type === 'account') {
              await handleSubmit(values as LoginFormValues);
            } else if (type === 'signup') {
              await handleSignup(values as SignupFormValues);
            }
          }}
          submitter={{
            searchConfig: {
              submitText:
                type === 'signup'
                  ? intl.formatMessage({ id: 'pages.signup.submit', defaultMessage: '注册' })
                  : intl.formatMessage({ id: 'pages.login.submit', defaultMessage: '登录' }),
            },
          }}
        >
          <Tabs
            activeKey={type}
            onChange={(newType) => {
              setType(newType);
              // Clear errors when switching tabs
              setLoginError('');
              setSignupError('');
            }}
            centered
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录',
                }),
              },
              {
                key: 'signup',
                label: intl.formatMessage({
                  id: 'pages.signup.tab',
                  defaultMessage: '注册',
                }),
              },
            ]}
          />

          {/* Show login error */}
          {loginError && type === 'account' && (
            <LoginMessage content={loginError} />
          )}

          {/* Show signup error */}
          {signupError && type === 'signup' && (
            <LoginMessage content={signupError} />
          )}

          {type === 'account' && (
            <>
              <ProFormText
                name="login"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.login.placeholder',
                  defaultMessage: '邮箱地址',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.login.required"
                        defaultMessage="请输入邮箱地址!"
                      />
                    ),
                  },
                  {
                    type: 'email',
                    message: (
                      <FormattedMessage
                        id="pages.login.login.invalid"
                        defaultMessage="邮箱格式不正确!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码 (最少6位)',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                  {
                    min: 6,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.min"
                        defaultMessage="密码至少6位！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {type === 'signup' && (
            <>
              <ProFormText
                name="login"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.signup.login.placeholder',
                  defaultMessage: '邮箱地址',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.signup.login.required',
                      defaultMessage: '请输入邮箱地址！',
                    }),
                  },
                  {
                    type: 'email',
                    message: intl.formatMessage({
                      id: 'pages.signup.login.invalid',
                      defaultMessage: '邮箱格式不正确！',
                    }),
                  },
                ]}
              />
              <ProFormText
                name="name"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.signup.name.placeholder',
                  defaultMessage: '姓名 (最多50字符)',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.signup.name.required',
                      defaultMessage: '请输入姓名！',
                    }),
                  },
                  {
                    max: 50,
                    message: intl.formatMessage({
                      id: 'pages.signup.name.max',
                      defaultMessage: '姓名不能超过50个字符！',
                    }),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.signup.password.placeholder',
                  defaultMessage: '密码 (6-255位)',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.signup.password.required',
                      defaultMessage: '请输入密码！',
                    }),
                  },
                  {
                    min: 6,
                    message: intl.formatMessage({
                      id: 'pages.signup.password.min',
                      defaultMessage: '密码至少6位！',
                    }),
                  },
                  {
                    max: 255,
                    message: intl.formatMessage({
                      id: 'pages.signup.password.max',
                      defaultMessage: '密码不能超过255位！',
                    }),
                  },
                ]}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
            {type === 'account' && (
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
              </ProFormCheckbox>
            )}
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;