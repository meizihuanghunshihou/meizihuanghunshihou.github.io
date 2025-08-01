document.addEventListener('DOMContentLoaded', () => {
    // 帮助面板交互
    const helpButton = document.getElementById('helpButton');
    const helpPanel = document.getElementById('helpPanel');
    const closeHelp = document.getElementById('closeHelp');
    
    helpButton.addEventListener('click', () => {
        helpPanel.style.display = 'flex';
    });
    
    closeHelp.addEventListener('click', () => {
        helpPanel.style.display = 'none';
    });
    
    helpPanel.addEventListener('click', (e) => {
        if (e.target === helpPanel) {
            helpPanel.style.display = 'none';
        }
    });
    // 强制重新初始化表格
    
  // DOM元素
  const nameInput = document.getElementById('nameInput');
  const addButton = document.getElementById('addButton');
  const weekToggle = document.getElementById('weekToggle');
  const clearSelection = document.getElementById('clearSelection');
  const themeSwitch = document.getElementById('themeSwitch');
  const scheduleTable = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
  const deletePersonButton = document.getElementById('deletePersonButton');
  const deleteAllButton = document.getElementById('deleteAllButton');
  
  // 数据状态（初始化为空）
  let currentWeek = 'single';
  let data = {
    single: {},
    double: {}
  };
  
  // 强制初始化表格并绑定数据
  initializeTable();
  
  // 强制刷新所有视图
  updatePreview();
  updateStats();
  document.getElementById('weekIndicator').textContent = `(当前：${currentWeek === 'single' ? '单周' : '双周'})`;
  
  // 强力主题切换（带动画）
  themeSwitch.addEventListener('change', (e) => {
    const isDark = e.target.checked;
    
    // 强制应用主题
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(isDark ? 'dark-mode' : 'light-mode');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // 添加切换动画
    document.body.style.transition = 'all 0.5s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 500);
    
    // 刷新所有组件
    initializeTable();
    updatePreview();
    updateStats();
    
    // 确保切换状态持久化
    localStorage.setItem('darkMode', isDark);
  });
  
  // 初始化时应用保存的主题
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  themeSwitch.checked = savedDarkMode;
  document.body.classList.add(savedDarkMode ? 'dark-mode' : 'light-mode');
  document.documentElement.setAttribute('data-theme', savedDarkMode ? 'dark' : 'light');
  
  // 周切换
  weekToggle.addEventListener('change', (e) => {
    currentWeek = e.target.checked ? 'double' : 'single';
    resetTable();
    updatePreview();
  });
  
  // 添加排班
  addButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      showToast('请输入姓名', 'error');
      return;
    }
    
    const selectedCells = document.querySelectorAll('#scheduleTable td.selected');
    if (selectedCells.length === 0) {
      showToast('请选择没课的时间段', 'error');
      return;
    }
    
    if (!data[currentWeek][name]) {
      data[currentWeek][name] = [];
    } else {
      // 清除该用户之前的选择
      data[currentWeek][name] = [];
    }
    
    selectedCells.forEach(cell => {
      const dayIndex = parseInt(cell.dataset.day);
      const timeSlot = parseInt(cell.dataset.timeSlot);
      
      if (!isNaN(dayIndex) && !isNaN(timeSlot)) {
        data[currentWeek][name].push({
          day: dayIndex,
          timeSlot: timeSlot
        });
      }
    });
    
    showToast(`${name}的没课时间已添加`, 'success');
    updatePreview();
    resetTable();
    nameInput.value = '';
  });
  
  // 清除选择
  clearSelection.addEventListener('click', () => {
    const cells = document.querySelectorAll('td.selected');
    cells.forEach(cell => cell.classList.remove('selected'));
  });
  
  // 删除单个人员
  deletePersonButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      showToast('请输入要删除的人员姓名', 'error');
      return;
    }
    
    if (!data[currentWeek][name]) {
      showToast(`${name}不存在于当前周的排班中`, 'error');
      return;
    }
    
    delete data[currentWeek][name];
    showToast(`${name}已从排班中删除`, 'success');
    updatePreview();
    nameInput.value = '';
  });
  
  // 删除所有人员
  deleteAllButton.addEventListener('click', () => {
    if (Object.keys(data[currentWeek]).length === 0) {
      showToast('当前周没有排班数据', 'warning');
      return;
    }
    
    if (confirm('确定要删除当前周的所有排班数据吗？此操作不可恢复。')) {
      data[currentWeek] = {};
      showToast('已删除所有排班数据', 'success');
      updatePreview();
    }
  });
  
  // 初始化选择表格
  function initializeTable() {
    const days = ['周一', '周二', '周三', '周四', '周五'];
    const timeSlots = ['1-2节', '3-4节', '5-6节', '7-8节', '9-10节'];
    const table = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
    
    // 清空现有内容
    table.innerHTML = '';
    
    // 创建表头
    const headerRow = document.createElement('tr');
    const firstCell = document.createElement('th');
    firstCell.textContent = '时间/星期';
    headerRow.appendChild(firstCell);
    
    days.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        th.className = 'day-header';
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
    // 填充表格内容
    timeSlots.forEach((slot, slotIndex) => {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = slot;
        timeCell.className = 'time-slot';
        row.appendChild(timeCell);
        
        days.forEach((day, dayIndex) => {
            const cell = document.createElement('td');
            cell.className = 'schedule-cell';
            cell.dataset.day = dayIndex;
            cell.dataset.timeSlot = slotIndex;
            cell.addEventListener('click', function() {
                this.classList.toggle('selected');
                updatePreview();
            });
            row.appendChild(cell);
        });
        table.appendChild(row);
    });
    
    // 强制刷新表格样式
    document.querySelectorAll('#scheduleTable td, #scheduleTable th').forEach(cell => {
      cell.style.display = 'table-cell';
    });
  }
  
  // 重置表格
  function resetTable() {
    const cells = document.querySelectorAll('td.selected');
    cells.forEach(cell => cell.classList.remove('selected'));
  }
  
  // 更新统计信息
  function updateStats() {
    const peopleCount = document.getElementById('peopleCount');
    const freeSlots = document.getElementById('freeSlots');
    const conflictCount = document.getElementById('conflictCount');
    
    // 计算已排班人数
    peopleCount.textContent = Object.keys(data[currentWeek]).length;
    
    // 计算空闲时间段
    const totalSlots = 5 * 5; // 5天 * 5个时间段
    let occupiedSlots = 0;
    let conflicts = 0;
    
    // 创建时间槽占用计数
    const slotCounts = Array(5).fill().map(() => Array(5).fill(0));
    
    // 统计每个时间槽的人数
    Object.values(data[currentWeek]).forEach(schedule => {
      schedule.forEach(item => {
        if (item.day >= 0 && item.day < 5 && item.timeSlot >= 0 && item.timeSlot < 5) {
          slotCounts[item.day][item.timeSlot]++;
          if (slotCounts[item.day][item.timeSlot] === 1) {
            occupiedSlots++;
          } else if (slotCounts[item.day][item.timeSlot] > 1) {
            conflicts++;
          }
        }
      });
    });
    
    freeSlots.textContent = totalSlots - occupiedSlots;
    conflictCount.textContent = conflicts;
  }
  
  // 更新预览
  function updatePreview() {
    const previewSection = document.getElementById('previewSection');
    previewSection.innerHTML = '<table id="previewTable" class="preview-table"></table>';
    
    const days = ['周一', '周二', '周三', '周四', '周五'];
    const timeSlots = ['1-2节', '3-4节', '5-6节', '7-8节', '9-10节'];
    const table = document.getElementById('previewTable');
    
    // 创建表头
    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = '时间/星期';
    days.forEach(day => {
      const th = headerRow.insertCell();
      th.textContent = day;
      th.className = 'day-header';
    });
    
    // 填充表格数据
    timeSlots.forEach((slot, slotIndex) => {
      const row = table.insertRow();
      const timeCell = row.insertCell();
      timeCell.textContent = slot;
      timeCell.className = 'time-cell';
      
      days.forEach((day, dayIndex) => {
        const cell = row.insertCell();
        const people = [];
        
        // 查找该时间段没课的人员
        Object.keys(data[currentWeek]).forEach(name => {
          const hasNoClass = data[currentWeek][name].some(
            item => item.day === dayIndex && item.timeSlot === slotIndex
          );
          if (!hasNoClass) people.push(name);
        });
        
        cell.textContent = people.join('、');
        cell.title = people.join('\r\n');
        cell.className = 'schedule-cell';
        
        // 根据人数设置不同样式
        if (people.length > 3) {
          cell.classList.add('many-available');
        } else if (people.length > 0) {
          cell.classList.add('few-available');
        }
        
        // 添加点击事件快速添加排班
        cell.addEventListener('click', () => {
          if (people.length > 0) {
            nameInput.value = people[0];
            nameInput.focus();
          }
        });
      });
    });
    
    // 强制刷新表格样式
    document.querySelectorAll('#previewTable td, #previewTable th').forEach(cell => {
      cell.style.display = 'table-cell';
    });
    
    // 更新周指示器
    document.getElementById('weekIndicator').textContent = `(当前：${currentWeek === 'single' ? '单周' : '双周'})`;
    
    // 更新统计信息
    updateStats();
  }
  
  // 显示提示
  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  
  // 导出Excel功能
  document.getElementById('exportButton').addEventListener('click', () => {
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    
    // 准备数据
    const days = ['周一', '周二', '周三', '周四', '周五'];
    const timeSlots = ['1-2节', '3-4节', '5-6节', '7-8节', '9-10节'];
    
    // 创建表头
    const wsData = [
      ['时间/星期', ...days]
    ];
    
    // 填充数据
    timeSlots.forEach((slot, slotIndex) => {
      const row = [slot];
      
      days.forEach((day, dayIndex) => {
        const people = [];
        
        // 查找该时间段没课的人员
        Object.keys(data[currentWeek]).forEach(name => {
          const hasNoClass = data[currentWeek][name].some(
            item => item.day === dayIndex && item.timeSlot === slotIndex
          );
          if (!hasNoClass) people.push(name);
        });
        
        row.push(people.join('、'));
      });
      
      wsData.push(row);
    });
    
    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // 设置列宽
    const colWidths = [{ wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
    ws['!cols'] = colWidths;
    
    // 添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, currentWeek === 'single' ? '单周没课表' : '双周没课表');
    
    // 导出文件
    XLSX.writeFile(wb, `没课表_${currentWeek === 'single' ? '单周' : '双周'}_${new Date().toLocaleDateString()}.xlsx`);
    
    showToast('导出成功！', 'success');
  });
});