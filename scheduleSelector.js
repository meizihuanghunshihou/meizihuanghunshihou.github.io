// 新版时间表选择模块
class ScheduleSelector {
  constructor(tableId, nameInputId) {
    this.table = document.getElementById(tableId);
    this.nameInput = document.getElementById(nameInputId);
    this.selectedCells = new Set();
    this.init();
  }
  
  init() {
    this.createTable();
    this.setupEvents();
  }
  
  createTable() {
    const days = ['周一', '周二', '周三', '周四', '周五'];
    const timeSlots = ['1-2节', '3-4节', '5-6节', '7-8节', '9-10节'];
    
    // 创建表头
    const thead = this.table.createTHead();
    const headerRow = thead.insertRow();
    headerRow.insertCell().textContent = '时间/星期';
    
    days.forEach(day => {
      const th = headerRow.insertCell();
      th.textContent = day;
      th.className = 'day-header';
    });
    
    // 创建表格内容
    const tbody = this.table.createTBody();
    
    timeSlots.forEach((slot, slotIndex) => {
      const row = tbody.insertRow();
      const timeCell = row.insertCell();
      timeCell.textContent = slot;
      timeCell.className = 'time-slot';
      
      days.forEach((day, dayIndex) => {
        const cell = row.insertCell();
        cell.dataset.day = dayIndex;
        cell.dataset.slot = slotIndex;
        cell.className = 'schedule-cell';
      });
    });
  }
  
  setupEvents() {
    this.table.addEventListener('click', (e) => {
      const cell = e.target.closest('td.schedule-cell');
      if (!cell) return;
      
      // 切换选择状态
      cell.classList.toggle('selected');
      
      // 更新选择集合
      const cellId = `${cell.dataset.day}-${cell.dataset.slot}`;
      if (cell.classList.contains('selected')) {
        this.selectedCells.add(cellId);
      } else {
        this.selectedCells.delete(cellId);
      }
      
      // 添加动画反馈
      this.animateSelection(cell);
    });
    
    // 姓名输入联动
    this.nameInput.addEventListener('focus', () => {
      this.table.classList.add('highlight');
    });
    
    this.nameInput.addEventListener('blur', () => {
      this.table.classList.remove('highlight');
    });
  }
  
  animateSelection(cell) {
    if (cell.classList.contains('selected')) {
      cell.style.transform = 'scale(0.95)';
      setTimeout(() => {
        cell.style.transform = '';
      }, 150);
    }
  }
  
  getSelectedSlots() {
    return Array.from(this.selectedCells).map(id => {
      const [day, slot] = id.split('-');
      return { day: parseInt(day), slot: parseInt(slot) };
    });
  }
  
  clearSelection() {
    this.selectedCells.clear();
    this.table.querySelectorAll('.selected').forEach(cell => {
      cell.classList.remove('selected');
    });
  }
}