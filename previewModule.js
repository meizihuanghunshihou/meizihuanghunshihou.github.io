// 新版预览模块
export function initPreview() {
  const previewSection = document.getElementById('previewSection');
  
  // 创建容器
  previewSection.innerHTML = `
    <div class="preview-container">
      <div class="preview-header">
        <h3 id="weekTitle">单周空闲时间表</h3>
        <div class="stats">
          <span id="totalPeople">0人</span>
          <span id="totalSlots">0个时段</span>
        </div>
      </div>
      <table id="previewTable" class="preview-grid"></table>
    </div>
  `;
  
  // 初始化表格
  updatePreview();
}

// 更新预览
export function updatePreview(data, currentWeek) {
  const table = document.getElementById('previewTable');
  if (!table) return;
  
  // 更新标题
  document.getElementById('weekTitle').textContent = 
    `${currentWeek === 'single' ? '单周' : '双周'}空闲时间表`;
  
  const days = ['周一', '周二', '周三', '周四', '周五'];
  const timeSlots = ['1-2节', '3-4节', '5-6节', '7-8节', '9-10节'];
  
  // 清空表格
  table.innerHTML = '';
  
  // 创建表头
  const headerRow = table.insertRow();
  headerRow.insertCell().textContent = '时间/星期';
  days.forEach(day => {
    const th = headerRow.insertCell();
    th.textContent = day;
    th.className = 'day-header';
  });
  
  // 填充数据
  let totalPeople = 0;
  let totalSlots = 0;
  
  timeSlots.forEach((slot, slotIndex) => {
    const row = table.insertRow();
    const timeCell = row.insertCell();
    timeCell.textContent = slot;
    timeCell.className = 'time-slot';
    
    days.forEach((day, dayIndex) => {
      const cell = row.insertCell();
      const people = [];
      
      // 查找空闲人员
      Object.keys(data[currentWeek]).forEach(name => {
        const hasClass = data[currentWeek][name].some(
          item => item.day === dayIndex && item.timeSlot === slotIndex
        );
        if (!hasClass) people.push(name);
      });
      
      // 更新统计
      if (people.length > 0) {
        totalPeople = Math.max(totalPeople, people.length);
        totalSlots++;
      }
      
      cell.textContent = people.join('、');
      cell.title = `${day} ${slot}\n空闲人员: ${people.join('、')}`;
      cell.className = 'availability-cell';
      
      // 设置视觉反馈
      if (people.length > 3) {
        cell.classList.add('high-availability');
      } else if (people.length > 0) {
        cell.classList.add('medium-availability');
      }
      
      // 添加交互
      cell.addEventListener('click', () => {
        if (people.length > 0) {
          const nameInput = document.getElementById('nameInput');
          nameInput.value = people[0];
          nameInput.focus();
          
          // 高亮相关时段
          highlightAvailability(people[0]);
        }
      });
    });
  });
  
  // 更新统计
  document.getElementById('totalPeople').textContent = `${totalPeople}人`;
  document.getElementById('totalSlots').textContent = `${totalSlots}个时段`;
}

// 高亮显示人员可用时段
function highlightAvailability(name) {
  const cells = document.querySelectorAll('.availability-cell');
  cells.forEach(cell => {
    cell.classList.remove('highlight');
    if (cell.textContent.includes(name)) {
      cell.classList.add('highlight');
    }
  });
}