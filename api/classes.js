// api/classes.js - Quản lý lớp học
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Demo data
    const classes = {
        'LOP10A1': {
            id: 'LOP10A1',
            name: '10A1',
            teacherId: '1',
            teacherName: 'Cô Nguyễn Thị B',
            studentCount: 35,
            inviteCode: '10A1-2024',
            students: [
                { id: '2', name: 'Nguyễn Văn A', email: 'student@school.edu.vn', status: 'active' },
                { id: '3', name: 'Trần Thị B', email: 'b.tran@school.edu.vn', status: 'active' },
                { id: '4', name: 'Lê Văn C', email: 'c.le@school.edu.vn', status: 'active' }
            ]
        }
    };
    
    // GET - Lấy thông tin lớp
    if (req.method === 'GET') {
        const { classId } = req.query;
        const classData = classes[classId];
        
        if (!classData) {
            return res.status(404).json({ error: 'Không tìm thấy lớp học' });
        }
        
        return res.status(200).json(classData);
    }
    
    // POST - Tạo lớp mới
    if (req.method === 'POST') {
        const { className, teacherId, teacherName } = req.body;
        
        const newClass = {
            id: `LOP${className}`,
            name: className,
            teacherId,
            teacherName,
            studentCount: 0,
            inviteCode: `${className}-${Date.now()}`,
            students: []
        };
        
        return res.status(201).json(newClass);
    }
    
    // PUT - Cập nhật lớp
    if (req.method === 'PUT') {
        const { classId, ...updates } = req.body;
        
        if (!classes[classId]) {
            return res.status(404).json({ error: 'Không tìm thấy lớp học' });
        }
        
        classes[classId] = { ...classes[classId], ...updates };
        return res.status(200).json(classes[classId]);
    }
    
    // DELETE - Xóa lớp
    if (req.method === 'DELETE') {
        const { classId } = req.query;
        
        if (!classes[classId]) {
            return res.status(404).json({ error: 'Không tìm thấy lớp học' });
        }
        
        delete classes[classId];
        return res.status(200).json({ success: true });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
