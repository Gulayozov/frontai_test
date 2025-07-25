// import Password from 'antd/es/input/Password';
// import { Request, Response } from 'express';

// type Email = string & { __brand: 'email' };

// type User = {
//   id: number;
//   login: Email;
//   name: string;
//   password: string;
//   created_dt?: string;
//   updated_dt?: string;
//   deleted_dt?: string | null;
// };

// const users: User[] = [
//   {
//     id: 1,
//     login: 'john@example.com' as Email,
//     name: 'John',
//     password: '1',
//   },
//   {
//     id: 2,
//     login: 'jim@example.com' as Email,
//     name: 'Jim',
//     password: '1',
//   },
//   {
//     id: 3,
//     login: 'joe@example.com' as Email,
//     name: 'Joe',
//     password: '1',
//   },
// ];

// let nextId = users.length + 1;

// const waitTime = (time: number = 100) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(true);
//     }, time);
//   });
// };

// async function getFakeCaptcha(req: Request, res: Response) {
//   await waitTime(2000);
//   return res.json('captcha-xxx');
// }

// const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

// /**
//  * 当前用户的权限，如果为空代表没登录
//  * current user access， if is '', user need login
//  * 如果是 pro 的预览，默认是有权限的
//  */
// let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

// const getAccess = () => {
//   return access;
// };

// // 代码中会兼容本地 service mock 以及部署站点的静态数据
// export default {
//   // 支持值为 Object 和 Array
//   'GET /api/currentUser': (req: Request, res: Response) => {
//     if (!getAccess()) {
//       res.status(401).send({
//         data: {
//           isLogin: false,
//         },
//         errorCode: '401',
//         errorMessage: '请先登录！',
//         success: true,
//       });
//       return;
//     }
//     res.send({
//       success: true,
//       data: {
//         name: 'Serati Ma',
//         avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
//         userid: '00000001',
//         email: 'antdesign@alipay.com',
//         signature: '海纳百川，有容乃大',
//         title: '交互专家',
//         group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
//         tags: [
//           {
//             key: '0',
//             label: '很有想法的',
//           },
//           {
//             key: '1',
//             label: '专注设计',
//           },
//           {
//             key: '2',
//             label: '辣~',
//           },
//           {
//             key: '3',
//             label: '大长腿',
//           },
//           {
//             key: '4',
//             label: '川妹子',
//           },
//           {
//             key: '5',
//             label: '海纳百川',
//           },
//         ],
//         notifyCount: 12,
//         unreadCount: 11,
//         country: 'China',
//         access: getAccess(),
//         geographic: {
//           province: {
//             label: '浙江省',
//             key: '330000',
//           },
//           city: {
//             label: '杭州市',
//             key: '330100',
//           },
//         },
//         address: '西湖区工专路 77 号',
//         phone: '0752-268888888',
//       },
//     });
//   },
//   // GET POST 可省略
//   'GET /api/users': users,

//   // 'POST /api/v1/users/register': async (req: Request, res: Response) => {
//   //   const { login, password, name } = req.body;

//   //   await waitTime(1000); // simulate delay

//   //   // Basic validation
//   //   if (!login || !name || !password) {
//   //     res.status(400).send({ message: 'All fields are required.' });
//   //     return;
//   //   }

//   //   // Check if email already exists
//   //   const existingUser = users.find((u) => u.login === login && !u.deleted_dt);
//   //   if (existingUser) {
//   //     res.status(409).send({ message: 'Email is already registered.' });
//   //     return;
//   //   }

//   //   // Add new user
//   //   const newUser = {
//   //     id: nextId++,
//   //     login: login,
//   //     name,
//   //     password,
//   //     created_dt: new Date().toISOString(),
//   //   };

//   //   users.push(newUser);

//   //   res.status(201).send({
//   //     message: 'User registered successfully.',
//   //     user: {
//   //       id: newUser.id,
//   //       name: newUser.name,
//   //       login: newUser.login,
//   //     },
//   //   });

//   //   console.log('New user registered:', newUser);
//   // },

//   // 'POST /api/login/account': async (req: Request, res: Response) => {
//   //   const { password, login, type } = req.body;
//   //   await waitTime(2000);
//   //   if (password === 'ant.design' && login === 'admin@gmail.com') {
//   //     res.send({
//   //       status: 'ok',
//   //       type,
//   //       currentAuthority: 'admin',
//   //     });
//   //     access = 'admin';
//   //     return;
//   //   }

//   //   const user = users.find((u) => u.login === login && u.password === password && !u.deleted_dt);
//   //   if (user) {
//   //     res.send({
//   //       status: 'ok',
//   //       type,
//   //       currentAuthority: 'user',
//   //     });
//   //     access = 'user';
//   //     return;
//   //   }
//   //   if (type === 'mobile') {
//   //     res.send({
//   //       status: 'ok',
//   //       type,
//   //       currentAuthority: 'admin',
//   //     });
//   //     access = 'admin';
//   //     return;
//   //   }

//   //   res.send({
//   //     status: 'error',
//   //     type,
//   //     currentAuthority: 'guest',
//   //   });
//   //   access = 'guest';
//   // },
//   'POST /api/login/outLogin': (req: Request, res: Response) => {
//     access = '';
//     res.send({ data: {}, success: true });
//   },
//   // 'POST /api/register': (req: Request, res: Response) => {
//   //   res.send({ status: 'ok', currentAuthority: 'user', success: true });
//   // },
//   'GET /api/500': (req: Request, res: Response) => {
//     res.status(500).send({
//       timestamp: 1513932555104,
//       status: 500,
//       error: 'error',
//       message: 'error',
//       path: '/base/category/list',
//     });
//   },
//   'GET /api/404': (req: Request, res: Response) => {
//     res.status(404).send({
//       timestamp: 1513932643431,
//       status: 404,
//       error: 'Not Found',
//       message: 'No message available',
//       path: '/base/category/list/2121212',
//     });
//   },
//   'GET /api/403': (req: Request, res: Response) => {
//     res.status(403).send({
//       timestamp: 1513932555104,
//       status: 403,
//       error: 'Forbidden',
//       message: 'Forbidden',
//       path: '/base/category/list',
//     });
//   },
//   'GET /api/401': (req: Request, res: Response) => {
//     res.status(401).send({
//       timestamp: 1513932555104,
//       status: 401,
//       error: 'Unauthorized',
//       message: 'Unauthorized',
//       path: '/base/category/list',
//     });
//   },

//   'GET  /api/login/captcha': getFakeCaptcha,
// };
