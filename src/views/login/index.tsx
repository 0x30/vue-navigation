import { defineComponent, ref } from 'vue'
import { SidePage, back, useToast } from '@0x30/navigation-vue'
import styles from './index.module.scss'

export const LoginPage = defineComponent({
  name: 'LoginPage',
  setup() {
    const loginForm = ref({
      username: '',
      password: '',
      rememberMe: false,
    })

    const isLoading = ref(false)
    const loginType = ref<'login' | 'register'>('login')

    const handleLogin = async () => {
      if (!loginForm.value.username || !loginForm.value.password) {
        useToast('请填写完整的登录信息')
        return
      }

      isLoading.value = true

      // 模拟登录请求
      setTimeout(() => {
        isLoading.value = false
        useToast('🎉 登录成功！欢迎回来')

        // 存储用户信息到 localStorage
        const userInfo = {
          username: loginForm.value.username,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${loginForm.value.username}`,
          loginTime: new Date().toISOString(),
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo))

        // 触发自定义事件通知父组件
        window.dispatchEvent(new CustomEvent('userLogin', { detail: userInfo }))

        back()
      }, 1500)
    }

    const handleRegister = async () => {
      if (!loginForm.value.username || !loginForm.value.password) {
        useToast('请填写完整的注册信息')
        return
      }

      isLoading.value = true

      setTimeout(() => {
        isLoading.value = false
        useToast('🎊 注册成功！请登录')
        loginType.value = 'login'
      }, 1500)
    }

    const switchLoginType = (type: 'login' | 'register') => {
      loginType.value = type
      loginForm.value = { username: '', password: '', rememberMe: false }
    }

    const handleQuickLogin = (username: string) => {
      loginForm.value.username = username
      loginForm.value.password = '123456'
      handleLogin()
    }

    return () => (
      <SidePage
        position="bottom"
        onClickBack={back}
        class={styles.loginSidePage}
      >
        <div class={styles.loginContainer}>
          <div class={styles.loginHeader}>
            <div class={styles.dragHandle}></div>
            <h2 class="title title-lg">
              {loginType.value === 'login' ? '👋 欢迎回来' : '🚀 加入我们'}
            </h2>
            <p class={styles.loginSubtitle}>
              {loginType.value === 'login'
                ? '登录您的账户，继续精彩体验'
                : '创建新账户，开启全新旅程'}
            </p>
          </div>

          <div class={styles.loginForm}>
            <div class={styles.inputGroup}>
              <label class={styles.inputLabel}>
                <span class={styles.labelIcon}>👤</span>
                用户名
              </label>
              <input
                type="text"
                class={styles.input}
                placeholder="请输入用户名"
                v-model={loginForm.value.username}
              />
            </div>

            <div class={styles.inputGroup}>
              <label class={styles.inputLabel}>
                <span class={styles.labelIcon}>🔐</span>
                密码
              </label>
              <input
                type="password"
                class={styles.input}
                placeholder="请输入密码"
                v-model={loginForm.value.password}
              />
            </div>

            {loginType.value === 'login' && (
              <div class={styles.checkboxGroup}>
                <label class={styles.checkbox}>
                  <input type="checkbox" v-model={loginForm.value.rememberMe} />
                  <span class={styles.checkmark}></span>
                  记住我
                </label>
                <button class={styles.forgotPassword}>忘记密码？</button>
              </div>
            )}

            <button
              class={`btn btn-primary ${styles.loginButton}`}
              onClick={
                loginType.value === 'login' ? handleLogin : handleRegister
              }
              disabled={isLoading.value}
            >
              {isLoading.value ? (
                <>
                  <span class={styles.spinner}></span>
                  {loginType.value === 'login' ? '登录中...' : '注册中...'}
                </>
              ) : (
                <>
                  <span>{loginType.value === 'login' ? '🚪' : '✨'}</span>
                  {loginType.value === 'login' ? '立即登录' : '立即注册'}
                </>
              )}
            </button>

            <div class={styles.switchType}>
              <span class={styles.switchText}>
                {loginType.value === 'login' ? '还没有账户？' : '已有账户？'}
              </span>
              <button
                class={styles.switchButton}
                onClick={() =>
                  switchLoginType(
                    loginType.value === 'login' ? 'register' : 'login',
                  )
                }
              >
                {loginType.value === 'login' ? '立即注册' : '立即登录'}
              </button>
            </div>
          </div>

          {loginType.value === 'login' && (
            <div class={styles.quickLogin}>
              <div class={styles.divider}>
                <span class={styles.dividerText}>快速登录</span>
              </div>

              <div class={styles.quickLoginButtons}>
                <button
                  class="btn btn-ghost"
                  onClick={() => handleQuickLogin('demo_user')}
                >
                  <span>🎯</span>
                  演示账户
                </button>
                <button
                  class="btn btn-ghost"
                  onClick={() => handleQuickLogin('guest')}
                >
                  <span>👤</span>
                  游客登录
                </button>
              </div>
            </div>
          )}
        </div>
      </SidePage>
    )
  },
})
