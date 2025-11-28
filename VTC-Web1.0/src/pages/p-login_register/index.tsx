

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface FormErrors {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

type FormType = 'login' | 'register' | 'forgotPassword';

const LoginRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 页面状态
  const [currentForm, setCurrentForm] = useState<FormType>('login');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // 登录表单状态
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // 注册表单状态
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({});
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  
  // 忘记密码表单状态
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: ''
  });
  const [forgotPasswordErrors, setForgotPasswordErrors] = useState<FormErrors>({});
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '登录注册 - 链文';
    return () => { document.title = originalTitle; };
  }, []);

  // 验证函数
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // 手机号可选
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateUsername = (username: string): boolean => {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
  };

  // 错误处理函数
  const showError = (errors: FormErrors, field: keyof FormErrors, message: string): FormErrors => {
    return {
      ...errors,
      [field]: message
    };
  };

  const hideError = (errors: FormErrors, field: keyof FormErrors): FormErrors => {
    const newErrors = { ...errors };
    delete newErrors[field];
    return newErrors;
  };

  // 表单切换函数
  const switchToLogin = () => {
    setCurrentForm('login');
    setLoginErrors({});
    setRegisterErrors({});
    setForgotPasswordErrors({});
  };

  const switchToRegister = () => {
    setCurrentForm('register');
    setLoginErrors({});
    setRegisterErrors({});
    setForgotPasswordErrors({});
  };

  const switchToForgotPassword = () => {
    setCurrentForm('forgotPassword');
    setLoginErrors({});
    setRegisterErrors({});
    setForgotPasswordErrors({});
  };

  // 登录表单处理
  const handleLoginInputChange = (field: keyof typeof loginForm, value: string | boolean) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
    if (typeof value === 'string' && field !== 'rememberMe') {
      setLoginErrors(prev => hideError(prev, field));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { username, password } = loginForm;
    let errors: FormErrors = {};
    
    // 验证用户名/邮箱
    if (!username.trim()) {
      errors = showError(errors, 'username', '请输入用户名或邮箱');
    } else if (!validateEmail(username) && !validateUsername(username)) {
      errors = showError(errors, 'username', '请输入有效的用户名或邮箱');
    }
    
    // 验证密码
    if (!password) {
      errors = showError(errors, 'password', '请输入密码');
    }
    
    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }
    
    setIsLoginLoading(true);
    
    // 模拟登录过程
    setTimeout(() => {
      setIsLoginLoading(false);
      navigate('/home');
    }, 2000);
  };

  // 注册表单处理
  const handleRegisterInputChange = (field: keyof typeof registerForm, value: string) => {
    setRegisterForm(prev => ({ ...prev, [field]: value }));
    setRegisterErrors(prev => hideError(prev, field));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { username, email, phone, password, confirmPassword } = registerForm;
    let errors: FormErrors = {};
    
    // 验证用户名
    if (!username.trim()) {
      errors = showError(errors, 'username', '请输入用户名');
    } else if (!validateUsername(username)) {
      errors = showError(errors, 'username', '用户名长度应为3-20个字符');
    }
    
    // 验证邮箱
    if (!email.trim()) {
      errors = showError(errors, 'email', '请输入邮箱地址');
    } else if (!validateEmail(email)) {
      errors = showError(errors, 'email', '请输入有效的邮箱地址');
    }
    
    // 验证手机号（可选）
    if (phone && !validatePhone(phone)) {
      errors = showError(errors, 'phone', '请输入有效的手机号');
    }
    
    // 验证密码
    if (!password) {
      errors = showError(errors, 'password', '请输入密码');
    } else if (password.length < 6 || password.length > 20) {
      errors = showError(errors, 'password', '密码长度应为6-20个字符');
    }
    
    // 验证确认密码
    if (!confirmPassword) {
      errors = showError(errors, 'confirmPassword', '请确认密码');
    } else if (password !== confirmPassword) {
      errors = showError(errors, 'confirmPassword', '两次输入的密码不一致');
    }
    
    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }
    
    setIsRegisterLoading(true);
    
    // 模拟注册过程
    setTimeout(() => {
      setIsRegisterLoading(false);
      navigate('/home');
    }, 2000);
  };

  // 忘记密码表单处理
  const handleForgotPasswordInputChange = (value: string) => {
    setForgotPasswordForm({ email: value });
    setForgotPasswordErrors(prev => hideError(prev, 'email'));
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { email } = forgotPasswordForm;
    let errors: FormErrors = {};
    
    // 验证邮箱
    if (!email.trim()) {
      errors = showError(errors, 'email', '请输入邮箱地址');
    } else if (!validateEmail(email)) {
      errors = showError(errors, 'email', '请输入有效的邮箱地址');
    }
    
    if (Object.keys(errors).length > 0) {
      setForgotPasswordErrors(errors);
      return;
    }
    
    setIsForgotPasswordLoading(true);
    
    // 模拟发送重置链接
    setTimeout(() => {
      setIsForgotPasswordLoading(false);
      setSuccessMessage('重置密码链接已发送到您的邮箱，请查收');
      setShowSuccessModal(true);
      setForgotPasswordForm({ email: '' });
    }, 2000);
  };

  // 成功模态框处理
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
  };

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC键关闭模态框
      if (e.key === 'Escape' && showSuccessModal) {
        handleSuccessModalClose();
      }
      
      // Enter键提交表单
      if (e.key === 'Enter') {
        if (currentForm === 'login') {
          handleLoginSubmit(e as any);
        } else if (currentForm === 'register') {
          handleRegisterSubmit(e as any);
        } else if (currentForm === 'forgotPassword') {
          handleForgotPasswordSubmit(e as any);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentForm, showSuccessModal, loginForm, registerForm, forgotPasswordForm]);

  return (
    <div className={styles.pageWrapper}>
      {/* 主容器 */}
      <div className="w-full max-w-md">
        {/* Logo区域 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <i className="fas fa-link text-white text-2xl"></i>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${styles.gradientText}`}>链文</h1>
          <p className="text-white/80 text-sm">高效视频文案提取工具</p>
        </div>
        
        {/* 表单容器 */}
        <div className={`${styles.cardGradient} rounded-3xl shadow-card p-8 ${styles.formContainer}`}>
          {/* 标签页切换 */}
          {currentForm !== 'forgotPassword' && (
            <div className="flex mb-8 rounded-2xl overflow-hidden bg-gray-100">
              <button 
                onClick={switchToLogin}
                className={`flex-1 py-3 px-4 text-center font-medium transition-all ${
                  currentForm === 'login' ? styles.tabActive : styles.tabInactive
                }`}
              >
                <i className="fas fa-sign-in-alt mr-2"></i>登录
              </button>
              <button 
                onClick={switchToRegister}
                className={`flex-1 py-3 px-4 text-center font-medium transition-all ${
                  currentForm === 'register' ? styles.tabActive : styles.tabInactive
                }`}
              >
                <i className="fas fa-user-plus mr-2"></i>注册
              </button>
            </div>
          )}
          
          {/* 登录表单 */}
          {currentForm === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {/* 用户名/邮箱输入 */}
              <div className="space-y-2">
                <label htmlFor="login-username" className="block text-sm font-medium text-gray-700">
                  <i className="fas fa-user mr-2"></i>用户名/邮箱
                </label>
                <input 
                  type="text" 
                  id="login-username" 
                  name="username"
                  value={loginForm.username}
                  onChange={(e) => handleLoginInputChange('username', e.target.value)}
                  placeholder="请输入用户名或邮箱"
                  className={`w-full px-4 py-3 border rounded-xl ${styles.inputFocus} text-gray-800 ${
                    loginErrors.username ? 'border-danger' : 'border-gray-300'
                  }`}
                  required
                />
                {loginErrors.username && (
                  <div className={`text-danger text-sm ${styles.errorMessage}`}>
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    <span>{loginErrors.username}</span>
                  </div>
                )}
              </div>
              
              {/* 密码输入 */}
              <div className="space-y-2">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                  <i className="fas fa-lock mr-2"></i>密码
                </label>
                <div className="relative">
                  <input 
                    type={showLoginPassword ? 'text' : 'password'}
                    id="login-password" 
                    name="password"
                    value={loginForm.password}
                    onChange={(e) => handleLoginInputChange('password', e.target.value)}
                    placeholder="请输入密码"
                    className={`w-full px-4 py-3 pr-12 border rounded-xl ${styles.inputFocus} text-gray-800 ${
                      loginErrors.password ? 'border-danger' : 'border-gray-300'
                    }`}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fas ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {loginErrors.password && (
                  <div className={`text-danger text-sm ${styles.errorMessage}`}>
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    <span>{loginErrors.password}</span>
                  </div>
                )}
              </div>
              
              {/* 记住密码和忘记密码 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={loginForm.rememberMe}
                    onChange={(e) => handleLoginInputChange('rememberMe', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-600">记住密码</span>
                </label>
                <button 
                  type="button" 
                  onClick={switchToForgotPassword}
                  className="text-sm text-primary hover:text-secondary transition-colors"
                >
                  忘记密码？
                </button>
              </div>
              
              {/* 登录按钮 */}
              <button 
                type="submit" 
                disabled={isLoginLoading}
                className={`${styles.btnGradient} w-full py-3 px-6 text-white font-semibold rounded-xl shadow-glow`}
              >
                <i className={`fas ${isLoginLoading ? 'fa-spinner fa-spin' : 'fa-sign-in-alt'} mr-2`}></i>
                <span>{isLoginLoading ? '登录中...' : '立即登录'}</span>
              </button>
              
              {/* 切换到注册 */}
              <div className="text-center">
                <span className="text-gray-600 text-sm">还没有账号？</span>
                <button 
                  type="button" 
                  onClick={switchToRegister}
                  className="text-primary font-medium hover:text-secondary transition-colors ml-1"
                >
                  立即注册
                </button>
              </div>
            </form>
          )}
          
          {/* 注册表单 */}
          {currentForm === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              {/* 用户名输入 */}
              <div className="space-y-2">
                <label htmlFor="register-username" className="block text-sm font-medium text-gray-700">
                  <i className="fas fa-user mr-2"></i>用户名
                </label>
                <input 
                  type="text" 
                  id="register-username" 
                  name="username"
                  value={registerForm.username}
                  onChange={(e) => handleRegisterInputChange('username', e.target.value)}
                  placeholder="请输入用户名（3-20个字符）"
                  className={`w-full px-4 py-3 border rounded-xl ${styles.inputFocus} text-gray-800 ${
                    registerErrors.username ? 'border-danger' : 'border-gray-300'
                  }`}
                  required
                />
                {registerErrors.username && (
                  <div className={`text-danger text-sm ${styles.errorMessage}`}>
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    <span>{registerErrors.username}</span>
                  </div>
                )}
              </div>
              
              {/* 邮箱输入 */}
              <div className="space-y-2">
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                  <i className="fas fa-envelope mr-2"></i>邮箱
                </label>
                <input 
                  type="email" 
                  id="register-email" 
                  name="email"
                  value={registerForm.email}
                  onChange={(e) => handleRegisterInputChange('email', e.target.value)}
                  placeholder="请输入邮箱地址"
                  className={`w-full px-4 py-3 border rounded-xl ${styles.inputFocus} text-gray-800 ${
                    registerErrors.email ? 'border-danger' : 'border-gray-300'
                  }`}
                  required
                />
                {registerErrors.email && (
                  <div className={`text-danger text-sm ${styles.errorMessage}`}>
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    <span>{registerErrors.email}</span>
                  </div>
                )}
              </div>
              
              {/* 手机号输入 */}
              <div className="space-y-2">
                <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700">
                  <i className="fas fa-mobile-alt mr-2"></i>手机号
                </label>
                <input 
                  type="tel" 
                  id="register-phone" 
                  name="phone"
                  value={registerForm.phone}
                  onChange={(e) => handleRegisterInputChange('phone', e.target.value)}
                  placeholder="请输入手机号（可选）"
                  className={`w-full px-4 py-3 border rounded-xl ${styles.inputFocus} text-gray-800 ${
                    registerErrors.phone ? 'border-danger' : 'border-gray-300'
                  }`}
                />
                {registerErrors.phone && (
                  <div className={`text-danger text-sm ${styles.errorMessage}`}>
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    <span>{registerErrors.phone}</span>
                  </div>
                )}
              </div>
              
              {/* 密码输入 */}
              <div className="space-y-2">
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                  <i className="fas fa-lock mr-2"></i>密码
                </label>
                <div className="relative">
                  <input 
                    type={showRegisterPassword ? 'text' : 'password'}
                    id="register-password" 
                    name="password"
                    value={registerForm.password}
                    onChange={(e) => handleRegisterInputChange('password', e.target.value)}
                    placeholder="请输入密码（6-20个字符）"
                    className={`w-full px-4 py-3 pr-12 border rounded-xl ${styles.inputFocus} text-gray-800 ${
                      registerErrors.password ? 'border-danger' : 'border-gray-300'
                    }`}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fas ${showRegisterPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {registerErrors.password && (
                  <div className={`text-danger text-sm ${styles.errorMessage}`}>
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    <span>{registerErrors.password}</span>
                  </div>
                )}
              </div>
              
              {/* 确认密码输入 */}
              <div className="space-y-2">
                <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700">
                  <i className="fas fa-lock mr-2"></i>确认密码
                </label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="register-confirm-password" 
                    name="confirm-password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => handleRegisterInputChange('confirmPassword', e.target.value)}
                    placeholder="请再次输入密码"
                    className={`w-full px-4 py-3 pr-12 border rounded-xl ${styles.inputFocus} text-gray-800 ${
                      registerErrors.confirmPassword ? 'border-danger' : 'border-gray-300'
                    }`}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {registerErrors.confirmPassword && (
                  <div className={`text-danger text-sm ${styles.errorMessage}`}>
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    <span>{registerErrors.confirmPassword}</span>
                  </div>
                )}
              </div>
              
              {/* 注册按钮 */}
              <button 
                type="submit" 
                disabled={isRegisterLoading}
                className={`${styles.btnGradient} w-full py-3 px-6 text-white font-semibold rounded-xl shadow-glow`}
              >
                <i className={`fas ${isRegisterLoading ? 'fa-spinner fa-spin' : 'fa-user-plus'} mr-2`}></i>
                <span>{isRegisterLoading ? '注册中...' : '立即注册'}</span>
              </button>
              
              {/* 切换到登录 */}
              <div className="text-center">
                <span className="text-gray-600 text-sm">已有账号？</span>
                <button 
                  type="button" 
                  onClick={switchToLogin}
                  className="text-primary font-medium hover:text-secondary transition-colors ml-1"
                >
                  立即登录
                </button>
              </div>
            </form>
          )}
          
          {/* 忘记密码表单 */}
          {currentForm === 'forgotPassword' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-tertiary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-key text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">重置密码</h3>
                <p className="text-gray-600 text-sm">请输入您的邮箱地址，我们将发送重置密码的链接</p>
              </div>
              
              {/* 邮箱输入 */}
              <div className="space-y-2">
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700">
                  <i className="fas fa-envelope mr-2"></i>邮箱地址
                </label>
                <input 
                  type="email" 
                  id="forgot-email" 
                  name="email"
                  value={forgotPasswordForm.email}
                  onChange={(e) => handleForgotPasswordInputChange(e.target.value)}
                  placeholder="请输入注册时使用的邮箱"
                  className={`w-full px-4 py-3 border rounded-xl ${styles.inputFocus} text-gray-800 ${
                    forgotPasswordErrors.email ? 'border-danger' : 'border-gray-300'
                  }`}
                  required
                />
                {forgotPasswordErrors.email && (
                  <div className={`text-danger text-sm ${styles.errorMessage}`}>
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    <span>{forgotPasswordErrors.email}</span>
                  </div>
                )}
              </div>
              
              {/* 操作按钮 */}
              <div className="space-y-3">
                <button 
                  type="submit" 
                  disabled={isForgotPasswordLoading}
                  className={`${styles.btnGradient} w-full py-3 px-6 text-white font-semibold rounded-xl shadow-glow`}
                >
                  <i className={`fas ${isForgotPasswordLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'} mr-2`}></i>
                  <span>{isForgotPasswordLoading ? '发送中...' : '发送重置链接'}</span>
                </button>
                <button 
                  type="button" 
                  onClick={switchToLogin}
                  className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  <i className="fas fa-arrow-left mr-2"></i>返回登录
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* 底部链接 */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/help" className="text-white/80 hover:text-white transition-colors">使用教程</Link>
            <Link to="/help" className="text-white/80 hover:text-white transition-colors">常见问题</Link>
            <a href="#" className="text-white/80 hover:text-white transition-colors">隐私政策</a>
          </div>
          <p className="text-white/60 text-xs">© 2024 链文. 保留所有权利</p>
        </div>
      </div>
      
      {/* 成功提示模态框 */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleSuccessModalClose}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">操作成功</h3>
            <p className="text-gray-600 text-sm mb-6">{successMessage}</p>
            <button 
              onClick={handleSuccessModalClose}
              className={`${styles.btnGradient} w-full py-3 px-6 text-white font-semibold rounded-xl`}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginRegisterPage;

