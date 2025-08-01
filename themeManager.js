// 主题管理模块
class ThemeManager {
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
    this.themeSwitch.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      this.setTheme(theme);
      localStorage.setItem('themePreference', theme);
    });
  }
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // 更新特殊元素样式
    if (theme === 'dark') {
      this.adjustDarkModeElements();
    } else {
      this.adjustLightModeElements();
    }
  }
  
  adjustDarkModeElements() {
    // 表格特殊样式
    document.querySelectorAll('.time-slot').forEach(el => {
      el.style.color = 'rgba(255, 255, 255, 0.8)';
    });
    
    // 选中单元格样式
    document.querySelectorAll('.selected').forEach(el => {
      el.style.transition = 'background 0.3s ease';
    });
  }
  
  adjustLightModeElements() {
    // 恢复默认样式
    document.querySelectorAll('.time-slot').forEach(el => {
      el.style.color = '';
    });
  }
}