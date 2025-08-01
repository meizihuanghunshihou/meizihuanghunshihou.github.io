// 新版时间表选择模块
class ScheduleTable {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.days = ['周一', '周二', '周三', '周四', '周五'];
    this.timeSlots = ['1-2节', '3-4节', '5-6节', '7-8节', '9-10节'];
    this.selectedCells = new Set();
    this.init();
  }
  
  init() {
    this.createTable();
    this.setupEvents();
  }
  
  createTable() {
    this.container.innerHTML = `
      <div class="schedule-container glass-panel">
        <h3><i class="fas fa-edit"></i> 请选择空闲时间段</h3>
        <div class="table-scroll">
          <table class="selection-table">
            <thead>
              <tr>
                <th>时间/星期</th>
                ${this.days.map(day => `<th>${day}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${this.timeSlots.map((slot, slotIndex) => `
                <tr>
                  <td class="time-slot">${slot}</td>
                  ${this.days.map((day, dayIndex) => 
                    `<td data-day="${dayIndex}" data-slot="${slotIndex}"></td>`
                  ).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="hint">
          <i class="fas fa-mouse-pointer"></i> 点击选择/取消选择时间段
        </div>
      </div>
    `;
  }
  
  setupEvents() {
    const cells = this.container.querySelectorAll('td[data-day]');
    cells.forEach(cell => {
      // 点击选择
      cell.addEventListener('click', () => {
        cell.classList.toggle('selected');
        
        // 添加动画反馈
        this.animateSelection(cell);
        
        // 更新选择状态
        const cellId = `${cell.dataset.day}-${cell.dataset.slot}`;
        if (cell.classList.contains('selected')) {
          this.selectedCells.add(cellId);
        } else {
          this.selectedCells.delete(cellId);
        }
      });
      
      // 悬停效果
      cell.addEventListener('mouseenter', () => {
        if (!cell.classList.contains('selected')) {
          cell.style.transform = 'scale(1.03)';
        }
      });
      
      cell.addEventListener('mouseleave', () => {
        cell.style.transform = '';
      });
    });
  }
  
  animateSelection(cell) {
    if (cell.classList.contains('selected')) {
      cell.style.transform = 'scale(0.95)';
      setTimeout(() => {
        cell.style.transform = 'scale(1)';
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
    this.container.querySelectorAll('.selected').forEach(cell => {
      cell.classList.remove('selected');
    });
    this.selectedCells.clear();
  }
}