// 主题管理服务
class ThemeService {
  constructor(switchId) {
    this.themeSwitch = document.getElementById(switchId);
    this.init();
  }
  
  init() {
    // 初始化主题
    const savedTheme = localStorage.getItem('themePreference') || 'light';
    this.setTheme(savedTheme);
    this.themeSwitch.checked = savedTheme === 'dark';
    
    // 监听切换事件
    this.themeSwitch.addEventListener('change', () => {
      const theme = this.themeSwitch.checked ? 'dark' : 'light';
      this.setTheme(theme);
      localStorage.setItem('themePreference', theme);
    });
  }
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // 更新特殊元素样式
    if (theme === 'dark') {
      this.adjustForDarkMode();
    } else {
      this.adjustForLightMode();
    }
  }
  
  adjustForDarkMode() {
    // 表格特殊样式
    document.querySelectorAll('.time-slot').forEach(el => {
      el.style.color = 'rgba(255, 255, 255, 0.8)';
    });
    
    // 选中单元格样式
    document.querySelectorAll('.selected').forEach(el => {
      el.style.transition = 'background 0.3s ease';
    });
  }
  
  adjustForLightMode() {
    // 恢复默认样式
    document.querySelectorAll('.time-slot').forEach(el => {
      el.style.color = '';
    });
  }
}