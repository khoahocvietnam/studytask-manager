// script.js - JavaScript dùng chung cho toàn bộ ứng dụng

// ==================== HÀM DÙNG CHUNG ====================

// Hiển thị thông báo
function showNotification(message, type = 'info') {
    const oldNotif = document.querySelector('.custom-notification');
    if (oldNotif) oldNotif.remove();

    const notif = document.createElement('div');
    notif.className = 'custom-notification';
    
    let bgColor = '#3498db';
    let icon = 'ℹ️';
    if (type === 'success') {
        bgColor = '#27ae60';
        icon = '✅';
    } else if (type === 'error') {
        bgColor = '#e74c3c';
        icon = '❌';
    } else if (type === 'warning') {
        bgColor = '#f39c12';
        icon = '⚠️';
    }
    
    notif.style.background = bgColor;
    notif.innerHTML = `${icon} ${message}`;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Đăng xuất
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Kiểm tra đăng nhập
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(user);
}

// Hiển thị thông tin user
function displayUserInfo() {
    const user = checkAuth();
    if (user) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userRole').textContent = user.role === 'teacher' ? 'Giáo viên CN' : 'Học sinh';
        document.getElementById('userAvatar').textContent = user.name.charAt(0);
    }
    return user;
}

// Chuyển tab trong dashboard
function switchDashboardTab(tabId) {
    document.querySelectorAll('.dash-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.dash-panel').forEach(panel => panel.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`${tabId}Panel`).classList.add('active');
}

// Format ngày
function formatDate(date) {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

// Lấy thứ trong tuần
function getWeekday() {
    const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return weekdays[new Date().getDay()];
}
