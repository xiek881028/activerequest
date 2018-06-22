/*!
 * User
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2018/06/22
 * since: 0.0.1
 */
'use strict';

const ActiveRequestBase = require('./active_request_base');

module.exports = module.exports.default = class User extends ActiveRequestBase {

  constructor(attributes = {}, options = {}) {
    super(attributes, options);
  }

  /**
   * 缓存描述
   *
   * @since 0.0.1
   * @return {none}
   */
  caches() {
    // this.cache('key', 'value');
    // this.has_many('users', () => await User.list());
    // this.has_one('user', () => await User.find(1));
    // ...
  }

  /**
   * 定义属性(字段)配置
   * 保留字: _attributes, _attributes_changed, _attributes_stored, _caches, _primary_key, add_error, api, assign_attributes, attribute, attributes, belongs_to, cache, caches, clear_errors, error_messages, errors, extract_attributes, has_many, has_one, is_changed, is_new_record, is_valid, store_attributes
   * 属性(字段)名如果和保留字冲突, 请适当调整, 以避免覆盖model定义好的方法
   *
   * @since 0.0.1
   * @param {boolean} absence 校验必须为空
   * @param {string} default 默认值
   * @param {boolean} confirmation 校验两个文本字段的值是否完全相同
   * @param {array} exclusion 校验是否不在指定的集合中
   * @param {function} if 判断是否需要校验
   * @param {array} inclusion 校验是否在指定的集合中
   * @param {object} length 长度校验
   * @param {integer} length.is 校验长度必须等于指定值
   * @param {integer} length.maximum 校验长度不能比指定的长度长
   * @param {integer} length.minimum 校验长度不能比指定的长度短
   * @param {regex} match 校验是否匹配指定的正则表达式
   * @param {object} numericality 校验是否只包含数字
   * @param {number} numericality.equal_to 校验必须等于指定的值
   * @param {number} numericality.greater_than 校验必须比指定的值大
   * @param {number} numericality.greater_than_or_equal_to 校验必须大于或等于指定的值
   * @param {number} numericality.less_than 校验必须比指定的值小
   * @param {number} numericality.less_than_or_equal_to 校验必须小于或等于指定的值
   * @param {boolean} numericality.only_integer 校验是否只接受整数, 默认false
   * @param {number} numericality.other_than 校验必须与指定的值不同
   * @param {boolean} numericality.odd 校验必须是奇数, 默认false
   * @param {boolean} numericality.even 校验必须是偶数, 默认false
   * @param {array} on 触发校验事件列表
   * @param {string} original_name 原始属性名
   * @param {boolean} presence 校验必须为非空
   * @param {boolean} primary_key 是否为主键
   * @param {regex} unmatch 校验是否不匹配指定的正则表达式
   * @param {function|string} validator 自定义验证
   * @param {array} validators 验证器
   * @return {object}
   */
  get attributes() {
    return {
      id: {original_name: 'userId', primary_key: true, presence: true}, // 用户ID
      avatar_id: {original_name: 'avatarId', presece: true}, // 用户头像MONGOID
      mobile: { // 手机号
        original_name: 'mobilePhone',
        validators: [
          {presence: true, on: ['login', 'signup', 'update_mobile']},
          {match: /^\d{11}$/, on: ['signup', 'update_mobile']},
        ],
      },
      password: { // 密码
        original_name: 'loginPwd',
        validators: [
          {confirmation: true, on: ['reset_password', 'signup', 'update_password']},
          {presence: true, on: ['login', 'reset_password', 'signup', 'update_password']},
        ],
      },
      password_confirmation: {original_name: 'loginPwdAgain', presence: true}, // 确认密码
      status_code: {original_name: 'registState'}, // 注册状态：1 校验手机号、保存登录密码，2 交易密码保存，3 实名认证已通过
      username: {original_name: 'userName'}, // 用户名
    };
  }

  /**
   * 状态
   *
   * @since 0.0.1
   * @return {string}
   */
  get status() {
    if(this.status_code == 3) {
      return 'authenticated';
    }
    if(this.status_code == 2) {
      return 'payment_password_setup';
    }

    return 'registered';
  }

  /**
   * 状态检测
   *
   * @since 0.0.1
   * @return {string}
   */
  is_status(status) {
    return status == this.status;
  }

  /**
   * 用户注册
   *
   * @since 0.0.1
   * @param {object} [attributes={}] 属性值
   * @return {promise}
   */
  signup(attributes = {}) {
    this.clear_errors()
        .assign_attributes(attributes)
        ;

    let params = this.extract_attributes([], 'signup');
    let data = this.extract_attributes( [
                                          'mobile',
                                          'password',
                                          'password_confirmation',
                                          'terms_of_service',
                                          'verified_token',
                                        ], 'signup');

    if(!this.is_valid) {
      return this.promise;
    }

    return this.api .uc({
                      method: 'post',
                      url: '/uc/base/register',
                      params,
                      data,
                    })
                    .then(response => {
                      return {
                        error: !response.data.success,
                        message: response.data.message,
                        data: response.data.body,
                      };
                    })
                    .then(response => {
                      if(response.error) {
                        return this.add_error('default', response.message);
                      }

                      this.assign_attributes(response.data);

                      return this.store_attributes();
                    })
                    ;
  }

  /**
   * 用户登录
   *
   * @since 0.0.1
   * @param {object} [attributes={}] 属性值
   * @return {promise}
   */
  login(attributes = {}) {
    this.clear_errors()
        .assign_attributes(attributes)
        ;

    let params = this.extract_attributes([], 'login');
    let data = this.extract_attributes(['mobile', 'password'], 'login');

    if(!this.is_valid) {
      return this.promise;
    }

    return this.api .uc({
                      method: 'post',
                      url: '/uc/base/login',
                      params,
                      data,
                    })
                    .then(response => {
                      return {
                        error: !response.data.success,
                        message: response.data.message,
                        data: response.data.body,
                      };
                    })
                    .then(response => {
                      if(response.error) {
                        return this.add_error('default', response.message);
                      }

                      this.assign_attributes(response.data);

                      return this.store_attributes();
                    })
                    ;
  }

  /**
   * 修改用户头像
   *
   * @since 0.0.1
   * @param {object} [attributes={}] 属性值
   * @return {promise}
   */
  update_avatar(attributes = {}) {
    this.clear_errors()
        .assign_attributes(attributes)
        ;

    let params = this.extract_attributes( [
                                            'id',
                                            'avatar_id',
                                          ], 'update_avatar');
    let data = this.extract_attributes([], 'update_avatar');

    if(!this.is_valid) {
      return this.promise;
    }

    return this.api .uc({
                      method: 'post',
                      url: '/uc/base/changeAvatar',
                      params,
                      data,
                    })
                    .then(response => {
                      return {
                        error: !response.data.success,
                        message: response.data.message,
                        data: response.data.body,
                      };
                    })
                    .then(response => {
                      if(response.error) {
                        return this.add_error('default', response.message);
                      }

                      return this.store_attributes();
                    })
                    ;
  }

  /**
   * 刷新
   *
   * @since 0.0.1
   * @return {promise}
   */
  get refresh() {
    this.clear_errors();

    let params = this.extract_attributes(['id'], 'refresh');
    let data = this.extract_attributes([], 'refresh');

    if(!this.is_valid) {
      return this.promise;
    }

    return this.api .uc({
                      method: 'post',
                      url: '/uc/base/queryUserinfo',
                      params,
                      data,
                    })
                    .then(response => {
                      return {
                        error: !response.data.success,
                        message: response.data.message,
                        data: response.data.body,
                      };
                    })
                    .then(response => {
                      if(response.error) {
                        return this.add_error('default', response.message);
                      }

                      this.assign_attributes(response.data);

                      return this.store_attributes();
                    })
                    ;
  }

  /**
   * 根据ID查询单条记录
   *
   * @since 0.0.1
   * @param {integer} id 用户ID
   * @return {promise}
   */
  static find(id) {
    return this.api .uc({
                      method: 'post',
                      url: '/uc/base/queryUserinfo',
                      params: {userId: id},
                      data: {},
                    })
                    .then(response => {
                      return {
                        error: !response.data.success,
                        message: response.data.message,
                        data: !!response.data.success && response.data.body || null,
                      };
                    })
                    .then(response => response.data && new this(response.data))
                    ;
  }

};
