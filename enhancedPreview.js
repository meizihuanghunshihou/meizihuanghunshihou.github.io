// 增强版预览模块
class EnhancedPreview {
  constructor(data) {
    this.data = data;
    this.currentWeek = 'single';
    this.init();
  }
  
  init() {
    this.createContainer();
    this.renderGrid();
    this.setupEvents();
  }
  
  createContainer() {
    const container = document.createElement('div');
    container.className = 'enhanced-preview glass-panel';
    container.innerHTML = `
      <div class="ep-header">
        <h3><i class="fas fa-calendar"></i> ${this.getWeekTitle()}空闲时间表</h3>
        <div class="ep-controls">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="搜索人员..." class="name-filter">
          </div>
          <div class="ep-stats">
            <span class="stat"><i class="fas fa-user-friends"></i> <span class="people-count">0</span>人</span>
            <span class="stat"><i class="fas fa-clock"></i> <span class="slots-count">0</span>时段</span>
          </div>
        </div>
      </div>
      <div class="ep-grid-container">
        <table class="ep-grid">
          <thead>
            <tr>
              <th>时间/星期</th>
              <th>周一</th>
              <th>周二</th>
              <th>周三</th>
              <th>周四</th>
              <th>周五</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="ep-footer">
        <button class="ep-btn export-btn"><i class="fas fa-file-excel"></i> 导出Excel</button>
      </div>
    `;
    
    document.getElementById('previewSection').replaceWith(container);
    this.container = container;
  }
  
  renderGrid() {
    const days = ['周一', '周二', '周三', '周四', '周五'];
    const timeSlots = ['1-2节', '3-4节', '5-6节', '7-8节', '9-10节'];
    const tbody = this.container.querySelector('.ep-grid tbody');
    tbody.innerHTML = '';
    
    let totalPeople = new Set();
    let totalSlots = 0;
    
    timeSlots.forEach((slot, slotIndex) => {
      const row = document.createElement('tr');
      const timeCell = document.createElement('td');
      timeCell.textContent = slot;
      timeCell.className = 'time-slot';
      row.appendChild(timeCell);
      
      days.forEach((day, dayIndex) => {
        const cell = document.createElement('td');
        const people = this.getAvailablePeople(dayIndex, slotIndex);
        
        // 更新统计
        people.forEach(p => totalPeople.add(p));
        if (people.length > 0) totalSlots++;
        
        // 渲染单元格
        this.renderCell(cell, people, day, slot);
        row.appendChild(cell);
      });
      
      tbody.appendChild(row);
    });
    
    // 更新统计
    this.container.querySelector('.people-count').textContent = totalPeople.size;
    this.container.querySelector('.slots-count').textContent = totalSlots;
  }
  
  renderCell(cell, people, day, slot) {
    cell.className = 'availability-cell';
    cell.dataset.day = day;
    cell.dataset.slot = slot;
    
    if (people.length > 0) {
      // 添加人数标记
      const badge = document.createElement('span');
      badge.className = 'people-badge';
      badge.textContent = people.length;
      cell.appendChild(badge);
      
      // 添加人员列表
      const list = document.createElement('div');
      list.className = 'people-list';
      
      people.forEach(person => {
        const tag = document.createElement('span');
        tag.className = 'person-tag';
        tag.textContent = person;
        tag.dataset.person = person;
        list.appendChild(tag);
      });
      
      cell.appendChild(list);
      
      // 设置视觉反馈
      if (people.length > 3) {
        cell.classList.add('high-availability');
      } else {
        cell.classList.add('medium-availability');
      }
    } else {
      cell.classList.add('no-availability');
      cell.textContent = '无'; 
    }
  }
  
  getAvailablePeople(dayIndex, slotIndex) {
    const people = [];
    Object.keys(this.data[this.currentWeek]).forEach(name => {
      const hasClass = this.data[this.currentWeek][name].some(
        item => item.day === dayIndex && item.timeSlot === slotIndex
      );
      if (!hasClass) people.push(name);
    });
    return people;
  }
  
  setupEvents() {
    // 人员筛选
    this.container.querySelector('.name-filter').addEventListener('input', (e) => {
      const filter = e.target.value.trim().toLowerCase();
      this.highlightPeople(filter);
    });
    
    // 单元格点击
    this.container.querySelectorAll('.availability-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const people = Array.from(cell.querySelectorAll('.person-tag')).map(t => t.textContent);
        if (people.length > 0) {
          this.showQuickActions(cell, people);
        }
      });
    });
    
    // 导出按钮
    this.container.querySelector('.export-btn').addEventListener('click', () => {
      this.exportToExcel();
    });
  }
  
  highlightPeople(filter) {
    this.container.querySelectorAll('.person-tag').forEach(tag => {
      tag.classList.toggle('highlight', 
        filter && tag.textContent.toLowerCase().includes(filter)
      );
    });
  }
  
  showQuickActions(cell, people) {
    // 实现快捷操作菜单
    console.log('快捷操作:', cell.dataset.day, cell.dataset.slot, people);
  }
  
  exportToExcel() {
    // 实现Excel导出
    console.log('导出Excel');
  }
  
  getWeekTitle() {
    return this.currentWeek === 'single' ? '单周' : '双周';
  }
  
  updateData(newData) {
    this.data = newData;
    this.renderGrid();
  }
  
  switchWeek(weekType) {
    this.currentWeek = weekType;
    this.container.querySelector('h3').innerHTML = 
      `<i class="fas fa-calendar"></i> ${this.getWeekTitle()}空闲时间表`;
    this.renderGrid();
  }
}

// 使用示例:
// const enhancedPreview = new EnhancedPreview(data);
// enhancedPreview.switchWeek('double');