import './styles/global.scss'

// 渲染落地页
const app = document.getElementById('app')!

app.innerHTML = `
  <div class="landing-page">
    <div class="landing-content">
      <h1>🧭 Navigation Demo</h1>
      <p class="subtitle">选择你的框架开始体验</p>
      
      <div class="demo-cards">
        <a href="/vue/" class="demo-card vue-card">
          <div class="card-icon">💚</div>
          <h2>Vue Demo</h2>
          <p>Vue 3 + Composition API</p>
          <div class="features">
            <span>NavPage</span>
            <span>SidePage</span>
            <span>TabBar</span>
            <span>Toast</span>
            <span>Loading</span>
          </div>
        </a>
        
        <a href="/react/" class="demo-card react-card">
          <div class="card-icon">💙</div>
          <h2>React Demo</h2>
          <p>React 18 + Hooks</p>
          <div class="features">
            <span>NavPage</span>
            <span>SidePage</span>
            <span>TabBar</span>
            <span>Toast</span>
            <span>Loading</span>
          </div>
        </a>
      </div>
      
      <div class="info">
        <p>两个 Demo 都展示了微信风格的 TabBar 导航</p>
        <p>包含用户列表 → 用户详情的完整导航流程</p>
      </div>
    </div>
  </div>
`
