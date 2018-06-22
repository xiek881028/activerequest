/*!
 * Test
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2018/06/22
 * since: 0.0.1
 */
'use strict';

const assert = require('assert');
const faker = require('faker/locale/zh_CN');
const User = require('./user');

// const mobile = faker.phone.phoneNumber('188########');
// const mobile_final = faker.phone.phoneNumber('188########');
// // const mobile_final = '18888888888';
// const password = '123456';
// const password_updated = '012345';
// const id_card_number = '123456789012345678';
// const mongoid = '5b2b58e29c66f22aa192a9e9';
// const sms_code = '123456';
// const user = new User;

// describe(`Model User - 用户`, async () => {

//   it(`signup({mobile: '${mobile}', sms_code: '${sms_code}'}) - 验证注册短信验证码`, async () => {
//     let sms = new Sms;
//     await sms.send({business: 'signup', mobile});
//     !sms.is_valid && assert.fail(sms.error_messages.join(','));

//     await user.signup_sms_verify({mobile, sms_code});
//     assert.equal(user.is_valid, true, user.error_messages.join(','));
//   });

// });
