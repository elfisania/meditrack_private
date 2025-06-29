// ===== GENERAL FUNCTIONS (Used across multiple pages) =====
function checkLogin() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function redirectToLogin() {
    alert("Silakan login terlebih dahulu untuk mengakses fitur ini.");
    window.location.href = "Login.html";
}

function updateAuthUI() {
    const isLoggedIn = checkLogin();
    const userRole = localStorage.getItem('userRole');
    const navLogin = document.getElementById('nav-login');
    const navLogout = document.getElementById('nav-logout');
    const navDoctorDashboard = document.getElementById('nav-doctor-dashboard');
    
    if (navLogin && navLogout) {
        navLogin.style.display = isLoggedIn ? 'none' : 'inline';
        navLogout.style.display = isLoggedIn ? 'inline' : 'none';
    }
    
    if (navDoctorDashboard) {
        navDoctorDashboard.style.display = (isLoggedIn && userRole === 'doctor') ? 'inline' : 'none';
    }
    
    document.querySelectorAll('.card').forEach(card => {
        if (isLoggedIn) {
            card.classList.remove('locked');
        } else {
            card.classList.add('locked');
        }
    });
}

function handleLogout() {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = 'Login.html';
}

// ===== LOGIN/SIGNUP PAGE =====
function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const terms = document.getElementById('terms').checked;
    const role = document.getElementById('signup-role').value;

    if (!name || !email || !password || !confirm || !role) {
        alert('Harap isi semua field.');
        return;
    }

    if (password !== confirm) {
        alert('Password tidak cocok!');
        return;
    }

    if (!terms) {
        alert('Anda harus menyetujui syarat dan ketentuan.');
        return;
    }

    // Validasi khusus untuk dokter
    if (role === 'doctor') {
        const doctorCode = prompt('Masukkan Kode Dokter (Harus dari admin):');
        if (doctorCode !== 'MEDITRACKDOC2025') {
            alert('Kode dokter tidak valid. Hanya dokter yang terdaftar yang bisa membuat akun dokter.');
            return;
        }
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email || u.name === name);
    if (existingUser) {
        alert('Username atau email sudah digunakan.');
        return;
    }

    users.push({ name, email, password, role });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Akun berhasil dibuat!');
    
    // Jika mendaftar sebagai dokter, langsung login
    if (role === 'doctor') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', name);
        window.location.href = 'Home_Dokter.html';
    }
}

function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const matchedUser = users.find(u => 
        (u.name === username || u.email === username) && u.password === password
    );

    if (matchedUser) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', matchedUser.role);
        localStorage.setItem('userName', matchedUser.name);
        
        const notif = document.createElement('div');
        notif.innerText = 'Login berhasil!';
        notif.style.position = 'fixed';
        notif.style.top = '20px';
        notif.style.right = '20px';
        notif.style.backgroundColor = '#4caf50';
        notif.style.color = 'white';
        notif.style.padding = '12px 20px';
        notif.style.borderRadius = '8px';
        notif.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        notif.style.zIndex = '9999';
        document.body.appendChild(notif);
        
        if (matchedUser.role === 'doctor') {
            window.location.href = 'Home_Dokter.html';
        } else {
            if (window.location.pathname.includes('Home_Dokter')) {
                alert('Anda tidak memiliki akses ke halaman dokter');
                window.location.href = 'index.html';
            } else {
                window.location.href = 'index.html';
            }
        }
        setTimeout(() => notif.remove(), 10000);
    } else {
        alert('Username atau password salah.');
    }
}

function handleForgotPassword() {
    const email = prompt('Masukkan email Anda:');
    if (!email) return;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);
    
    if (user) {
        if (user.role === 'doctor') {
            const doctorCode = prompt('Masukkan Kode Dokter untuk verifikasi:');
            if (doctorCode === 'MEDTRACKDOC2024') {
                alert(`Password untuk ${user.email} adalah: ${user.password}`);
            } else {
                alert('Kode dokter tidak valid.');
            }
        } else {
            alert(`Password untuk ${user.email} adalah: ${user.password}`);
        }
    } else {
        alert('Email tidak ditemukan.');
    }
}

// ===== HOME PAGE =====
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    document.getElementById('nav-home')?.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'index.html';
    });

    document.getElementById('nav-about')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('nav-contact')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('btnLearn')?.addEventListener('click', function() {
        document.querySelector('.features')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Feature Cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            if (!checkLogin()) {
                redirectToLogin();
            } else {
                const feature = this.getAttribute('data-feature');
                if (feature === 'input-gejala') {
                    window.location.href = 'Input Gejala Pasien.html';
                } else if (feature === 'grafik-kesehatan') {
                    window.location.href = 'Grafik Kesehatan.html';
                } else if (feature === 'komunikasi-dokter') {
                    window.location.href = 'Chat.html';
                }
            }
        });
    });

    // Logout
    const navLogout = document.getElementById('nav-logout');
    if (navLogout) {
        navLogout.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    updateAuthUI();
});

// ===== DOCTOR DASHBOARD PAGE =====
function checkDoctorAccess() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (window.location.pathname.includes('Home_Dokter') && (!isLoggedIn || userRole !== 'doctor')) {
        alert('Akses ditolak. Hanya dokter yang bisa mengakses halaman ini.');
        window.location.href = 'Login.html';
        return false;
    }
    return true;
}

function updateDoctorDashboard() {
    const gejalaPasien = JSON.parse(localStorage.getItem('gejalaPasien')) || [];
    const messages = JSON.parse(localStorage.getItem('doctorMessages')) || {};

    // Hitung statistik
    const totalPasien = new Set(gejalaPasien.map(data => data.nama)).size;
    const aktifPasien = gejalaPasien.filter(data => 
        new Date(data.tanggal) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;
    const gejalaBaru = gejalaPasien.filter(data => 
        new Date(data.tanggal) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    ).length;
    const pesanBaru = Object.values(messages).filter(msgs => 
        msgs.some(msg => !msg.read && !msg.isDoctor)
    ).length;

    // Update UI
    document.getElementById('total-patients').textContent = totalPasien;
    document.getElementById('active-patients').textContent = aktifPasien;
    document.getElementById('new-symptoms').textContent = gejalaBaru;
    document.getElementById('new-messages').textContent = pesanBaru;

    // Update aktivitas terbaru
    updateRecentActivity();
}

function updateRecentActivity() {
    const gejalaPasien = JSON.parse(localStorage.getItem('gejalaPasien')) || [];
    const activitySection = document.querySelector('.activity-section');
    const emptyState = activitySection.querySelector('.empty-state');
    
    // Ambil 5 gejala terbaru
    const recentSymptoms = gejalaPasien
        .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
        .slice(0, 5);
    
    if (recentSymptoms.length > 0) {
        if (emptyState) emptyState.remove();
        
        let activityList = activitySection.querySelector('.activity-list');
        if (!activityList) {
            activityList = document.createElement('div');
            activityList.className = 'activity-list';
            activitySection.appendChild(activityList);
        }
        
        activityList.innerHTML = recentSymptoms.map(symptom => `
            <div class="activity-item" style="padding: 12px; border-bottom: 1px solid rgba(142, 224, 252, 0.2); margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${symptom.nama}</strong> - ${symptom.gejala || 'Tidak ada keluhan'}
                        <br><small>Tekanan Darah: ${symptom.sistolik}/${symptom.diastolik} mmHg</small>
                    </div>
                    <div style="text-align: right; font-size: 0.9rem; color: #8ee0fc;">
                        ${new Date(symptom.tanggal).toLocaleDateString('id-ID')}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function initDoctorDashboard() {
    updateDoctorDashboard();
    initializeDoctorChat();
    loadPatientSymptoms();
}

function loadPatientSymptoms() {
    const gejalaPasien = JSON.parse(localStorage.getItem('gejalaPasien')) || [];
    console.log('Data gejala pasien:', gejalaPasien); // Debug
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('Home_Dokter')) {
        const userName = localStorage.getItem('userName');
        if (userName) {
            document.getElementById('welcome-name').textContent = userName;
            document.getElementById('doctor-name').textContent = userName;
        }
        
        checkDoctorAccess();
        initDoctorDashboard();
        
        // Refresh data setiap 10 detik
        setInterval(updateDoctorDashboard, 10000);
    }
});

// ===== DOCTOR CHAT FUNCTIONS =====
function initializeDoctorChat() {
    if (document.getElementById('patientMessagesList')) {
        loadPatientMessages();
        
        document.getElementById('sendDoctorReplyBtn')?.addEventListener('click', sendDoctorReply);
        document.getElementById('doctorChatInput')?.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendDoctorReply();
        });
    }
}

function loadPatientMessages() {
    const container = document.getElementById('patientMessagesList');
    if (!container) return;
    
    const messages = JSON.parse(localStorage.getItem('doctorMessages')) || {};
    container.innerHTML = '';
    
    let hasMessages = false;
    let unreadCount = 0;
    
    for (const [patientName, patientMsgs] of Object.entries(messages)) {
        if (patientName === 'doctor') continue;
        
        hasMessages = true;
        const lastMsg = patientMsgs[patientMsgs.length - 1];
        const hasUnread = patientMsgs.some(msg => !msg.isDoctor && !msg.read);
        
        if (hasUnread) unreadCount++;
        
        const patientDiv = document.createElement('div');
        patientDiv.className = `patient-item ${hasUnread ? 'unread' : ''}`;
        patientDiv.style.cursor = 'pointer';
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'patient-info';
        
        const img = document.createElement('img');
        img.src = 'images/profil kosong.jpg';
        img.alt = patientName;
        img.style.width = '45px';
        img.style.height = '45px';
        img.style.borderRadius = '50%';
        img.style.border = '2px solid #8ee0fc';
        
        const detailDiv = document.createElement('div');
        const nameDiv = document.createElement('div');
        nameDiv.className = 'patient-name';
        nameDiv.textContent = patientName;
        
        const statusDiv = document.createElement('div');
        statusDiv.className = 'patient-status';
        statusDiv.textContent = lastMsg.text.length > 30 ? 
            lastMsg.text.substring(0, 30) + '...' : lastMsg.text;
        
        detailDiv.appendChild(nameDiv);
        detailDiv.appendChild(statusDiv);
        infoDiv.appendChild(img);
        infoDiv.appendChild(detailDiv);
        patientDiv.appendChild(infoDiv);
        
        // Tambahkan badge unread
        if (hasUnread) {
            const badge = document.createElement('span');
            badge.style.cssText = 'background: #ff4444; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; margin-left: auto;';
            badge.textContent = patientMsgs.filter(msg => !msg.isDoctor && !msg.read).length;
            patientDiv.appendChild(badge);
        }
        
        patientDiv.addEventListener('click', () => {
            openDoctorChat(patientName);
        });
        
        container.appendChild(patientDiv);
    }
    
    document.getElementById('new-messages').textContent = unreadCount;
    
    if (!hasMessages) {
        container.innerHTML = '<div class="empty-state">Belum ada pesan dari pasien</div>';
    }
}

function openDoctorChat(patientName) {
    localStorage.setItem('currentChatPatient', patientName);
    
    // Update modal title
    document.getElementById('doctorChatTitle').textContent = `Chat dengan ${patientName}`;
    
    // Load chat messages
    loadDoctorChat(patientName);
    
    // Mark messages as read
    const messages = JSON.parse(localStorage.getItem('doctorMessages')) || {};
    if (messages[patientName]) {
        messages[patientName].forEach(msg => {
            if (!msg.isDoctor) msg.read = true;
        });
        localStorage.setItem('doctorMessages', JSON.stringify(messages));
    }
    
    // Show modal
    const modalElement = document.getElementById('doctorChatModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    // Update unread count
    setTimeout(() => {
        loadPatientMessages();
        updateDoctorDashboard();
    }, 500);
}

function loadDoctorChat(patientName) {
    const container = document.getElementById('doctorChatMessages');
    if (!container) return;
    
    const messages = JSON.parse(localStorage.getItem('doctorMessages')) || {};
    const patientMessages = messages[patientName] || [];
    
    container.innerHTML = '';
    
    if (patientMessages.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #ccc;">Belum ada pesan</div>';
        return;
    }
    
    patientMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            margin-bottom: 15px; 
            padding: 12px 15px; 
            border-radius: 18px; 
            max-width: 80%; 
            ${msg.isDoctor ? 
                'background: #608b9c; color: white; margin-left: auto; border-bottom-right-radius: 5px;' : 
                'background: #e3f2fd; color: #333; margin-right: auto; border-bottom-left-radius: 5px;'
            }
        `;
        
        // Tambahkan nama pengirim yang jelas
        const sender = document.createElement('div');
        sender.style.fontWeight = 'bold';
        sender.style.marginBottom = '5px';
        sender.style.fontSize = '12px';
        sender.style.opacity = '0.8';
        
        // Pastikan nama pengirim ditampilkan dengan benar
        if (msg.isDoctor) {
            sender.textContent = msg.sender || 'Dokter';
        } else {
            sender.textContent = msg.sender || patientName;
        }
        
        const text = document.createElement('div');
        text.textContent = msg.text;
        
        const time = document.createElement('div');
        time.style.cssText = 'font-size: 12px; text-align: right; margin-top: 5px; opacity: 0.7;';
        time.textContent = new Date(msg.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.appendChild(sender);
        messageDiv.appendChild(text);
        messageDiv.appendChild(time);
        container.appendChild(messageDiv);
    });
    
    container.scrollTop = container.scrollHeight;
}

function sendDoctorReply() {
    const input = document.getElementById('doctorChatInput');
    const messageText = input.value.trim();
    if (!messageText) return;

    const patientName = localStorage.getItem('currentChatPatient');
    if (!patientName) return;

    const messages = JSON.parse(localStorage.getItem('doctorMessages')) || {};
    const patientMessages = messages[patientName] || [];

    const doctorName = localStorage.getItem('userName') || 'Dokter';
    
    const newMessage = {
        sender: 'Dr. ' + doctorName, // KONSISTEN DENGAN PREFIX Dr.
        text: messageText,
        timestamp: new Date().toISOString(),
        isDoctor: true,
        read: true
    };

    patientMessages.push(newMessage);
    messages[patientName] = patientMessages;
    localStorage.setItem('doctorMessages', JSON.stringify(messages));

    input.value = '';
    loadDoctorChat(patientName);
    
    // Update patient messages list
    setTimeout(() => {
        loadPatientMessages();
    }, 100);
}

// ===== INPUT GEJALA PAGE =====
document.getElementById('form-gejala')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nama = document.getElementById('nama').value;
    const tanggal = document.getElementById('tanggal').value;
    const sistolik = document.getElementById('sistolik').value;
    const diastolik = document.getElementById('diastolik').value;
    const gejala = document.getElementById('gejala').value;

    const gejalaData = {
        nama,
        tanggal,
        sistolik: parseInt(sistolik),
        diastolik: parseInt(diastolik),
        gejala,
        timestamp: new Date().toISOString()
    };

    const gejalaPasien = JSON.parse(localStorage.getItem('gejalaPasien')) || [];
    gejalaPasien.push(gejalaData);
    localStorage.setItem('gejalaPasien', JSON.stringify(gejalaPasien));

    const notif = document.getElementById('notif');
    notif.classList.remove('d-none');
    setTimeout(() => notif.classList.add('d-none'), 3000);

    this.reset();
    
    console.log('Data gejala disimpan:', gejalaData); // Debug
});

// ===== GRAFIK KESEHATAN PAGE =====
function checkPatientAccess() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    if (!isLoggedIn) {
        redirectToLogin();
        return false;
    }
    
    // Jika pasien mencoba melihat grafik pasien lain
    if (userRole === 'patient') {
        const filterNama = document.getElementById('filterNama')?.value;
        if (filterNama && filterNama !== userName) {
            document.getElementById('accessDeniedMessage').classList.remove('d-none');
            document.getElementById('grafikKesehatan').style.display = 'none';
            return false;
        } else {
            document.getElementById('accessDeniedMessage').classList.add('d-none');
            document.getElementById('grafikKesehatan').style.display = 'block';
        }
    }
    
    return true;
}

function renderGrafik() {
    if (!checkPatientAccess()) return;
    
    const ctx = document.getElementById('grafikKesehatan');
    if (!ctx) return;

    const gejalaPasien = JSON.parse(localStorage.getItem('gejalaPasien')) || [];
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    // Filter berdasarkan nama pasien jika ada
    const filterNama = document.getElementById('filterNama')?.value;
    let filteredData = gejalaPasien;
    
    // Jika pasien, hanya tampilkan data mereka sendiri
    if (userRole === 'patient') {
        filteredData = gejalaPasien.filter(data => data.nama === userName);
    } 
    // Jika dokter dan memilih filter nama tertentu
    else if (filterNama) {
        filteredData = gejalaPasien.filter(data => data.nama === filterNama);
    }
    
    // Sort by date
    filteredData.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    
    const labels = filteredData.map(data => new Date(data.tanggal).toLocaleDateString('id-ID'));
    const dataSistolik = filteredData.map(data => data.sistolik);
    const dataDiastolik = filteredData.map(data => data.diastolik);

    // Destroy existing chart if exists
    if (window.healthChart) {
        window.healthChart.destroy();
    }

    window.healthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Tekanan Sistolik',
                    data: dataSistolik,
                    borderColor: '#608b9c',
                    backgroundColor: 'rgba(96, 139, 156, 0.1)',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Tekanan Diastolik',
                    data: dataDiastolik,
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: filterNama ? `Grafik Kesehatan - ${filterNama}` : 'Grafik Kesehatan - Semua Pasien'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Tekanan Darah (mmHg)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tanggal'
                    }
                }
            }
        }
    });
}

function populatePatientFilter() {
    const gejalaPasien = JSON.parse(localStorage.getItem('gejalaPasien')) || [];
    const filterSelect = document.getElementById('filterNama');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    if (!filterSelect) return;
    
    // Clear existing options except "Semua Pasien"
    filterSelect.innerHTML = '<option value="">Semua Pasien</option>';
    
    // Jika dokter, tampilkan semua pasien
    if (userRole === 'doctor') {
        const uniqueNames = [...new Set(gejalaPasien.map(data => data.nama))];
        uniqueNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            filterSelect.appendChild(option);
        });
    } 
    // Jika pasien, hanya tampilkan nama mereka sendiri
    else if (userRole === 'patient') {
        const option = document.createElement('option');
        option.value = userName;
        option.textContent = userName;
        filterSelect.appendChild(option);
        filterSelect.value = userName; // Otomatis pilih nama pasien
        filterSelect.disabled = true; // Nonaktifkan dropdown untuk pasien
    }
    
    // Add event listener for filter change
    filterSelect.addEventListener('change', renderGrafik);
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('Grafik')) {
        if (!checkLogin()) {
            redirectToLogin();
            return;
        }
        
        populatePatientFilter();
        renderGrafik();
    }
});

// ===== CHAT PAGE FUNCTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('Chat.html')) {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const chatMessages = document.getElementById('chatMessages');
        
        // Cek login
        if (!localStorage.getItem('isLoggedIn')) {
            window.location.href = 'Login.html';
            return;
        }
        
        const userName = localStorage.getItem('userName') || 'Pasien';
        
        // FUNGSI LOAD MESSAGES YANG DIPERBAIKI - KONSISTEN
        function loadMessages() {
            const messages = JSON.parse(localStorage.getItem('doctorMessages')) || {};
            const userMessages = messages[userName] || [];
            
            chatMessages.innerHTML = '';
            
            if (userMessages.length === 0) {
                chatMessages.innerHTML = '<div class="empty-chat">Belum ada pesan. Mulai konsultasi dengan dokter Anda.</div>';
                return;
            }
            
            userMessages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.isDoctor ? 'doctor-message' : 'patient-message'}`;
                
                // PASTIKAN NAMA PENGIRIM SELALU KONSISTEN
                const senderName = document.createElement('div');
                senderName.className = 'sender-name';
                
                // LOGIKA NAMA YANG KONSISTEN
                if (msg.isDoctor) {
                    // Untuk dokter, gunakan nama yang disimpan atau default
                    senderName.textContent = msg.sender || 'Dokter';
                } else {
                    // Untuk pasien, gunakan nama yang login atau nama yang disimpan
                    senderName.textContent = msg.sender || userName;
                }
                
                const text = document.createElement('div');
                text.textContent = msg.text;
                
                const time = document.createElement('div');
                time.className = 'message-time';
                time.textContent = new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                messageDiv.appendChild(senderName);
                messageDiv.appendChild(text);
                messageDiv.appendChild(time);
                chatMessages.appendChild(messageDiv);
            });
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // FUNGSI SEND MESSAGE YANG DIPERBAIKI
        function sendMessage() {
            const messageText = messageInput.value.trim();
            if (!messageText) return;

            const messages = JSON.parse(localStorage.getItem('doctorMessages')) || {};
            const userMessages = messages[userName] || [];

            userMessages.push({
                sender: userName, // PASTIKAN NAMA PENGIRIM SELALU DISIMPAN
                text: messageText,
                timestamp: new Date().toISOString(),
                isDoctor: false,
                read: false
            });

            messages[userName] = userMessages;
            localStorage.setItem('doctorMessages', JSON.stringify(messages));
            
            messageInput.value = '';
            loadMessages();
            
            // Show confirmation
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed; top: 20px; right: 20px; 
                background: #4caf50; color: white; 
                padding: 12px 20px; border-radius: 8px; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
                z-index: 9999;
            `;
            notification.textContent = 'Pesan terkirim! Dokter akan membalas segera.';
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 3000);
        }
        
        // Event listeners
        sendButton?.addEventListener('click', sendMessage);
        messageInput?.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
        
        // Load messages pertama kali
        loadMessages();
        
        // PERBAIKAN: Kurangi frekuensi auto-refresh untuk mengurangi flickering
        setInterval(loadMessages, 5000); // Dari 3 detik jadi 5 detik
    }
});
