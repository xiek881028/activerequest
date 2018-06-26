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

const user = new User;

describe(`Model User - 用户`, async () => {

  it(`assign_attributes({balance: 100}) - 非格式化赋属性值`, async () => {
    user.assign_attributes({balance: 100});
    assert.equal(user.balance, 100, 'It should be 100 when unformat assign');
  });

  it(`assign_attributes({balance: 100}, true) - 格式化赋属性值`, async () => {
    user.assign_attributes({balance: 100}, true);
    assert.equal(user.balance, 1, 'It should be 1 when format assign');
  });

  it(`extract_attributes(['balance']) - 非格式化提取属性值`, async () => {
    let attributes = user.extract_attributes(['balance']);
    assert.equal(attributes.balance, 1, 'It should be 1 when unformat extract');
  });

  it(`extract_attributes(['balance'], true) - 格式化提取属性值`, async () => {
    let attributes = user.extract_attributes(['balance'], true);
    assert.equal(attributes.balance, 100, 'It should be 1 when format extract');
  });

});
