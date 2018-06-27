/*!
 * Active request
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2018/06/22
 * since: 0.0.1
 */
'use strict';

const DEFAULT_OPTIONS = {
  format: false, // 初始化时格式化赋属性值, 默认false
};

const DEFAULT_VALIDATE_ATTRIBUTE_NAMES = [
  'absence',
  'confirmation',
  'exclusion',
  'if',
  'inclusion',
  'length',
  'match',
  'numericality',
  'on',
  'presence',
  'unmatch',
  'validator',
];

module.exports = module.exports.default = class ActiveRequest {

  constructor(attributes = {}, options = {}) {
    Object.defineProperties(this, {
      _attributes: {
        configurable: true,
        enumerable: true,
        value: {},
        writable: true,
      },
      _attributes_changed: {
        configurable: true,
        enumerable: false,
        value: {},
        writable: true,
      },
      _attributes_stored: {
        configurable: true,
        enumerable: false,
        value: {},
        writable: true,
      },
      _caches: {
        configurable: true,
        enumerable: false,
        value: {},
        writable: true,
      },
      _primary_key: {
        configurable: true,
        enumerable: false,
        // value: undefined,
        writable: true,
      },
      errors: {
        configurable: true,
        enumerable: true,
        value: {},
        writable: true,
      },
      options: {
        configurable: true,
        enumerable: false,
        value: Object.assign({}, DEFAULT_OPTIONS, options),
        writable: true,
      },
    });

    for(let _attribute, _format_assign, _key, _attributes = this.attributes, _keys = Object.keys(_attributes), i = 0, len = _keys.length; i < len; i++) {
      _key = _keys[i];
      _attribute = _attributes[_key];

      Object.defineProperty(this, _key, {
        configurable: true,
        enumerable: false,
        get() {
          return this._attributes[_key];
        },
        set(value) {
          this._attributes[_key] = this._attributes_changed[_key] = value;
        },
      });

      if(!this._primary_key && _attribute.primary_key) {
        this._primary_key = _key;
      }

      _format_assign = (value) => value;
      if(this.options.format && _attribute.format && (_attribute.format.assign || _attribute.format.in)) {
        _format_assign = _attribute.format.assign || _attribute.format.in;
        if(typeof _format_assign == 'string') {
          _format_assign = this[_format_assign];
          if(!_format_assign) {
            throw new Error(`Attribute ${_key} format assign/in method is undefined`);
          }
        }
      }

      if(_attribute.original_name && attributes[_attribute.original_name] !== undefined) {
        this._attributes[_key] = this._attributes_stored[_key] = _format_assign.call(this, attributes[_attribute.original_name]);
        delete attributes[_attribute.original_name];
      } else if(attributes[_key] !== undefined) {
        this._attributes[_key] = this._attributes_stored[_key] = _format_assign.call(this, attributes[_key]);
        delete attributes[_key];
      } else if(_attribute.default !== undefined) {
        this._attributes[_key] = this._attributes_stored[_key] = _attribute.default;
      }
    }

    for(let key, keys = Object.keys(attributes), i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      this[key] = attributes[key];
    }

    this.caches();
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
   * 保留字: _attributes, _attributes_changed, _attributes_stored, _caches, _primary_key, add_error, assign_attributes, attribute, attributes, belongs_to, cache, caches, clear_errors, error_messages, errors, extract_attributes, has_many, has_one, is_changed, is_new_record, is_valid, store_attributes
   * 属性(字段)名如果和保留字冲突, 请适当调整, 以避免覆盖model定义好的方法
   *
   * @since 0.0.1
   * @param {boolean} absence 校验必须为空
   * @param {string} default 默认值
   * @param {boolean} confirmation 校验两个文本字段的值是否完全相同
   * @param {array} exclusion 校验是否不在指定的集合中
   * @param {object} format 格式化定义
   * @param {string|function} format.assign 格式化赋属性值, 优先级高于in
   * @param {string|function} format.extract 格式化提取属性值, 优先级高于out
   * @param {string|function} format.in 格式化赋属性值, assign的别名, 优先级低于assign
   * @param {string|function} format.out 格式化提取属性值, extract的别名, 优先级低于extract
   * @param {function} if 判断是否需要校验
   * @param {array} inclusion 校验是否在指定的集合中
   * @param {boolean|object} length 长度校验
   * @param {integer} length.is 校验长度必须等于指定值
   * @param {integer} length.maximum 校验长度不能比指定的长度长
   * @param {integer} length.minimum 校验长度不能比指定的长度短
   * @param {regex} match 校验是否匹配指定的正则表达式
   * @param {boolean|object} numericality 校验是否只包含数字
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
   * @param {string|function} validator 自定义验证
   * @param {array} validators 验证器
   * @return {object}
   */
  get attributes() {
    return {
      // id: {original_name: 'user_id', primary_key: true}, // ID
      // username: {original_name: 'userName'}, // 用户名
      // password: {original_name: 'password_hash'}, // 密码
      // ...
    };
  }

  /**
   * 获取属性(字段)配置
   *
   * @since 0.0.1
   * @param {name} name 属性名
   * @return {object}
   */
  attribute(name) {
    return this.attributes[name] || {};
  }

  /**
   * 赋属性值
   *
   * @since 0.0.1
   * @param {object} [attributes={}] 需要更新的属性值
   * @param {boolean} [format=false] 格式化赋属性值, 默认false
   * @return {this}
   */
  assign_attributes(attributes = {}, format = false) {
    if(!attributes || !Object.keys(attributes).length) {
      return this;
    };

    for(let _attribute, _format_assign, _key, _attributes = this.attributes, _keys = Object.keys(_attributes), i = 0, len = _keys.length; i < len; i++) {
      _key = _keys[i];
      _attribute = _attributes[_key];

      _format_assign = (value) => value;
      if(format && _attribute.format && (_attribute.format.assign || _attribute.format.in)) {
        _format_assign = _attribute.format.assign || _attribute.format.in;
        if(typeof _format_assign == 'string') {
          _format_assign = this[_format_assign];
          if(!_format_assign) {
            throw new Error(`Attribute ${_key} format assign/in method is undefined`);
          }
        }
      }

      if(_attribute.original_name && attributes[_attribute.original_name] !== undefined) {
        this[_key] = _format_assign.call(this, attributes[_attribute.original_name]);
        delete attributes[_attribute.original_name];
      } else if(attributes[_key] !== undefined) {
        this[_key] = _format_assign.call(this, attributes[_key]);
        delete attributes[_key];
      }
    }

    for(let key, keys = Object.keys(attributes), i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      this[key] = attributes[key];
    }

    return this;
  }

  /**
   * 提取属性值
   *
   * @since 0.0.1
   * @param {array} [attribute_names=[]] 要输出的属性名列表
   * @param {boolean} [format=false] 格式化提取属性值, 默认false
   * @param {string} [context] 校验上下文
   * @return {object}
   */
  extract_attributes(attribute_names = [], format = false, context) {
    if(!attribute_names || !attribute_names.length) {
      return {};
    }

    let attributes = this.attributes;
    let _attributes = {};
    for(let attribute, attribute_name, default_validator, format_extract, value, i = 0, len = attribute_names.length; i < len; i++) {
      attribute_name = attribute_names[i];
      attribute = attributes[attribute_name];

      if(!attribute) {
        throw new Error(`Attribute ${attribute_name} must be defined`);
      }

      format_extract = (value) => value;
      if(format && attribute.format && (attribute.format.extract || attribute.format.out)) {
        format_extract = attribute.format.extract || attribute.format.out;
        if(typeof format_extract == 'string') {
          format_extract = this[format_extract];
          if(!format_extract) {
            throw new Error(`Attribute ${_key} format extract/out method is undefined`);
          }
        }
      }

      value = this[attribute_name];
      _attributes[attribute && attribute.original_name || attribute_name] = format_extract.call(this, value);

      default_validator = {};
      for(let validate_attribute_name, j = 0, validate_attribute_names_len = DEFAULT_VALIDATE_ATTRIBUTE_NAMES.length; j < validate_attribute_names_len; j++) {
        validate_attribute_name = DEFAULT_VALIDATE_ATTRIBUTE_NAMES[j];
        if(attribute[validate_attribute_name] === undefined) continue;
        default_validator[validate_attribute_name] = attribute[validate_attribute_name];
      }
      if(Object.keys(default_validator).length) {
        if(!attribute.validators) {
          attribute.validators = [];
        }
        attribute.validators.unshift(default_validator);
      }

      if(!attribute.validators || !attribute.validators.length) {
        continue;
      }

      for(let _validator, if_false, numeric_regex, j = 0, validators_len = attribute.validators.length; j < validators_len; j++) {
        _validator = attribute.validators[j];
        if((_validator.if && !_validator.if.call(this)) || _validator.on && (!context || _validator.on.indexOf(context) === -1)) {
          continue;
        }

        if(_validator.presence && (value === undefined || value === null || value === '')) {
          this.add_error(attribute_name, `${attribute_name} is required`);
        }
        if(_validator.absence && (value !== undefined || value !== null || value !== '')) {
          this.add_error(attribute_name, `${attribute_name} is must be blank`);
        }
        if(_validator.inclusion && _validator.inclusion.indexOf(value) === -1) {
          this.add_error(attribute_name, `${attribute_name} is not in ${_validator.inclusion}`);
        }
        if(_validator.exclusion && _validator.exclusion.indexOf(value) === -1) {
          this.add_error(attribute_name, `${attribute_name} is in ${_validator.exclusion}`);
        }
        if(_validator.match && !_validator.match.test(value)) {
          this.add_error(attribute_name, `${attribute_name} is unmatch ${_validator.match}`);
        }
        if(_validator.unmatch && _validator.unmatch.test(value)) {
          this.add_error(attribute_name, `${attribute_name} is match ${_validator.unmatch}`);
        }
        if(_validator.confirmation && value != this[`${attribute_name}_confirmation`]) {
          this.add_error(attribute_name, `${attribute_name} doesn\'t match ${attribute_name}_confirmation`);
        }
        if(_validator.length) {
          _validator.length.is != undefined && value.length != _validator.length.is && this.add_error(attribute_name, `${attribute_name}'s length must be ${_validator.length.is} characters`);
          _validator.length.maximum != undefined && value.length > _validator.length.maximum && this.add_error(attribute_name, `${attribute_name}'s length minimum is ${_validator.length.maximum} characters`);
          _validator.length.minimum != undefined && value.length < _validator.length.minimum && this.add_error(attribute_name, `${attribute_name}'s length minimum is ${_validator.length.maximum} characters`);
        }
        if(_validator.numericality) {
          numeric_regex = _validator.numericality.only_integer && /^[+-]?\d+$/ || /^[+-]?\d+(\.\d+)?$/;
          if(!numeric_regex.test(value)) {
            this.add_error(attribute_name, `${attribute_name} must be ${_validator.numericality.only_integer && 'integer' || 'numeric'}`);
          } else {
            _validator.numericality.only_integer != undefined && value >= _validator.numericality.less_than_or_equal_to && this.add_error(attribute_name, `${attribute_name} must be less than or equal to ${_validator.numericality.less_than_or_equal_to}`);
            _validator.numericality.equal_to != undefined && value != _validator.numericality.equal_to && this.add_error(attribute_name, `${attribute_name} must be equal to ${_validator.numericality.equal_to}`);
            _validator.numericality.greater_than != undefined && value <= _validator.numericality.greater_than && this.add_error(attribute_name, `${attribute_name} must be greater than ${_validator.numericality.greater_than}`);
            _validator.numericality.greater_than_or_equal_to != undefined && value < _validator.numericality.greater_than_or_equal_to && this.add_error(attribute_name, `${attribute_name} must be greater than or equal to ${_validator.numericality.greater_than_or_equal_to}`);
            _validator.numericality.less_than != undefined && value >= _validator.numericality.less_than && this.add_error(attribute_name, `${attribute_name} must be less than ${_validator.numericality.less_than}`);
            _validator.numericality.less_than_or_equal_to != undefined && value >= _validator.numericality.less_than_or_equal_to && this.add_error(attribute_name, `${attribute_name} must be less than or equal to ${_validator.numericality.less_than_or_equal_to}`);
          }
        }

        if(_validator.validator) {
          if(typeof _validator.validator === 'string') {
            this[_validator.validator] && this[_validator.validator]();
          } else {
            _validator.validator.call(this);
          }
        }
      }
    };

    return _attributes;
  }

  /**
   * 储存属性值
   *
   * @since 0.0.1
   * @return {this}
   */
  store_attributes() {
    if(!Object.keys(this._attributes_changed).length) {
      return this;
    }
    for(let key, keys = Object.keys(this._attributes_stored), i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      this._attributes_stored[key] = this._attributes[key];
    }
    this._attributes_changed = {};

    return this;
  }

  /**
   * 检测属性值是否有变化
   *
   * @since 0.0.1
   * @return {boolean}
   */
  get is_changed() {
    return !!Object.keys(this._attributes_changed).length;
  }

  /**
   * 检测是否为新记录
   *
   * @since 0.0.1
   * @return {boolean}
   */
  get is_new_record() {
    if(!this._primary_key) {
      return false;
    }

    return !this._attributes_stored.hasOwnProperty(this._primary_key);
  }

  /**
   * 新增属性错误信息
   *
   * @since 0.0.1
   * @param {string} attribute_name 属性名
   * @param {string} error_message 错误信息
   * @return {this}
   */
  add_error(attribute_name, error_message) {
    if(!this.errors[attribute_name]) {
      this.errors[attribute_name] = [];
    }

    this.errors[attribute_name].push(error_message);

    return this;
  }

  /**
   * 输出所有错误信息
   *
   * @since 0.0.1
   * @return {array}
   */
  get error_messages() {
    let _error_messages = [];
    for(let error, keys = Object.keys(this.errors), i = 0, len = keys.length; i < len; i++) {
      _error_messages = _error_messages.concat(this.errors[keys[i]]);
    }

    return _error_messages;
  }

  /**
   * 检测是否通过检验
   *
   * @since 0.0.1
   * @return {boolean}
   */
  get is_valid() {
    return !Object.keys(this.errors).length;
  }

  /**
   * 清空属性错误信息
   *
   * @since 0.0.1
   * @return {this}
   */
  clear_errors() {
    this.errors = {};

    return this;
  }

  /**
   * 转换成纯json对象格式
   *
   * @since 0.0.1
   * @param {array} [attribute_names=[]] 要输出的属性名列表, 默认attributes中定义的所有
   * @return {object}
   */
  to_json(attribute_names = []) {
    if(!attribute_names) {
      return this;
    }
    if(attribute_names === true) {
      attribute_names = [];
    }
    if(!attribute_names.length) {
      attribute_names = Object.keys(this.attributes);
    }
    if(!attribute_names.length) {
      return {};
    }

    let _attributes = {};
    for(let attribute_name, i = 0, len = attribute_names.length; i < len; i++) {
      attribute_name = attribute_names[i];
      _attributes[attribute_name] = this[attribute_name];
    };

    return _attributes;
  }

  /**
   * 缓存
   *
   * @since 0.0.1
   * @param {string} key 键
   * @param {string|array|object|function} value 回调
   * @return {none}
   */
  cache(key, value) {
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: false,
      get() {
        return this._caches[key];
      },
      set(value) {
        this._caches[key] = value;
      },
    });

    this[key] = typeof value == 'function' && value() || value;
  }

  /**
   * 一对一关联
   *
   * @since 0.0.1
   * @param {string} key 键
   * @param {function} callback 回调
   * @return {none}
   */
  belongs_to(key, callback) {
    this.cache(key, callback);
  }

  /**
   * 一对多关联
   *
   * @since 0.0.1
   * @param {string} key 键
   * @param {function} callback 回调
   * @return {none}
   */
  has_many(key, callback) {
    this.cache(key, callback);
  }

  /**
   * 一对一关联
   *
   * @since 0.0.1
   * @param {string} key 键
   * @param {function} callback 回调
   * @return {none}
   */
  has_one(key, callback) {
    this.cache(key, callback);
  }

};
