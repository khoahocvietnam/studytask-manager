// api/tasks.js - Quản lý bài tập
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Demo data
    let tasks = [
        {
            id: '1',
            title: 'Bài tập chương 2',
            subject: 'Toán',
            description: 'Giải các bài tập 1-5 trang 45',
            classId: 'LOP10A1',
            dueDate: '2024-04-15',
            status: 'active',
            createdAt: '2024-04-01',
            totalStudents: 35,
            completedCount: 18
        },
        {
            id: '2',
            title: 'Báo cáo thí nghiệm',
            subject: 'Vật lý',
            description: 'Làm báo cáo thí nghiệm định luật Ohm',
            classId: 'LOP10A1',
            dueDate: '2024-04-12',
            status: 'active',
            createdAt: '2024-04-05',
            totalStudents: 35,
            completedCount: 25
        }
    ];
    
    // GET - Lấy danh sách bài tập
    if (req.method === 'GET') {
        const { classId, taskId } = req.query;
        
        if (taskId) {
            const task = tasks.find(t => t.id === taskId);
            return res.status(200).json(task || { error: 'Không tìm thấy' });
        }
        
        const classTasks = tasks.filter(t => t.classId === classId);
        return res.status(200).json(classTasks);
    }
    
    // POST - Tạo bài tập mới
    if (req.method === 'POST') {
        const { title, subject, description, classId, dueDate } = req.body;
        
        const newTask = {
            id: Date.now().toString(),
            title,
            subject,
            description,
            classId,
            dueDate,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
            totalStudents: 35,
            completedCount: 0
        };
        
        tasks.push(newTask);
        return res.status(201).json(newTask);
    }
    
    // PUT - Cập nhật bài tập
    if (req.method === 'PUT') {
        const { taskId, ...updates } = req.body;
        const index = tasks.findIndex(t => t.id === taskId);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Không tìm thấy bài tập' });
        }
        
        tasks[index] = { ...tasks[index], ...updates };
        return res.status(200).json(tasks[index]);
    }
    
    // DELETE - Xóa bài tập
    if (req.method === 'DELETE') {
        const { taskId } = req.query;
        tasks = tasks.filter(t => t.id !== taskId);
        return res.status(200).json({ success: true });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
