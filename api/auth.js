// api/auth.js - Xử lý đăng nhập, đăng ký
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { action, email, password, name, role, classCode } = req.body;
    
    // Demo database (trong thực tế dùng Firebase hoặc Supabase)
    const users = {
        'gvcn@school.edu.vn': {
            id: '1',
            name: 'Cô Nguyễn Thị B',
            email: 'gvcn@school.edu.vn',
            password: '123456',
            role: 'teacher',
            classId: 'LOP10A1',
            className: '10A1'
        },
        'student@school.edu.vn': {
            id: '2',
            name: 'Nguyễn Văn A',
            email: 'student@school.edu.vn',
            password: '123456',
            role: 'student',
            classId: 'LOP10A1',
            className: '10A1'
        }
    };
    
    // ĐĂNG NHẬP
    if (action === 'login') {
        const user = users[email];
        
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
        }
        
        const { password: _, ...userWithoutPassword } = user;
        
        return res.status(200).json({
            success: true,
            user: userWithoutPassword,
            token: `token_${user.id}_${Date.now()}`
        });
    }
    
    // ĐĂNG KÝ
    if (action === 'register') {
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
        }
        
        if (users[email]) {
            return res.status(400).json({ error: 'Email đã được đăng ký' });
        }
        
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            role,
            classId: role === 'student' ? classCode : null,
            createdAt: new Date().toISOString()
        };
        
        return res.status(201).json({
            success: true,
            user: newUser,
            message: 'Đăng ký thành công! Vui lòng đăng nhập.'
        });
    }
    
    return res.status(400).json({ error: 'Invalid action' });
}
