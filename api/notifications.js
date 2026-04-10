export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Demo data
    let notifications = [
        {
            id: '1',
            title: 'Thông báo kiểm tra',
            content: 'Tuần sau kiểm tra 1 tiết môn Toán, các em ôn tập kỹ nhé!',
            classId: 'LOP10A1',
            senderId: '1',
            senderName: 'Cô Nguyễn Thị B',
            createdAt: '2024-04-08',
            readBy: []
        },
        {
            id: '2',
            title: 'Lịch nghỉ lễ',
            content: 'Nghỉ lễ 30/4 - 1/5, lớp sẽ nghỉ từ ngày 29/4 đến hết 2/5',
            classId: 'LOP10A1',
            senderId: '1',
            senderName: 'Cô Nguyễn Thị B',
            createdAt: '2024-04-05',
            readBy: []
        }
    ];
    
    // GET - Lấy thông báo
    if (req.method === 'GET') {
        const { classId } = req.query;
        const classNotifications = notifications.filter(n => n.classId === classId);
        return res.status(200).json(classNotifications);
    }
    
    // POST - Gửi thông báo
    if (req.method === 'POST') {
        const { title, content, classId, senderId, senderName } = req.body;
        
        const newNotification = {
            id: Date.now().toString(),
            title,
            content,
            classId,
            senderId,
            senderName,
            createdAt: new Date().toISOString().split('T')[0],
            readBy: []
        };
        
        notifications.unshift(newNotification);
        return res.status(201).json(newNotification);
    }
    
    // DELETE - Xóa thông báo
    if (req.method === 'DELETE') {
        const { notifId } = req.query;
        notifications = notifications.filter(n => n.id !== notifId);
        return res.status(200).json({ success: true });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
