// api/timetable.js - Quản lý thời khóa biểu
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Demo data
    let timetables = {
        'LOP10A1': {
            classId: 'LOP10A1',
            className: '10A1',
            schedule: {
                'Thứ 2': ['Toán', 'Vật lý'],
                'Thứ 3': ['Hóa học', 'Ngữ văn'],
                'Thứ 4': ['Toán', 'Lịch sử'],
                'Thứ 5': ['Hóa học', 'Địa lý'],
                'Thứ 6': ['Vật lý', 'Ngữ văn'],
                'Thứ 7': ['Sinh học', 'Tin học'],
                'Chủ nhật': []
            }
        }
    };
    
    // GET - Lấy TKB
    if (req.method === 'GET') {
        const { classId } = req.query;
        const timetable = timetables[classId];
        
        if (!timetable) {
            return res.status(404).json({ error: 'Không tìm thấy thời khóa biểu' });
        }
        
        return res.status(200).json(timetable);
    }
    
    // POST - Tạo TKB
    if (req.method === 'POST') {
        const { classId, className, schedule } = req.body;
        
        timetables[classId] = {
            classId,
            className,
            schedule
        };
        
        return res.status(201).json(timetables[classId]);
    }
    
    // PUT - Cập nhật TKB
    if (req.method === 'PUT') {
        const { classId, schedule } = req.body;
        
        if (!timetables[classId]) {
            return res.status(404).json({ error: 'Không tìm thấy thời khóa biểu' });
        }
        
        timetables[classId].schedule = schedule;
        return res.status(200).json(timetables[classId]);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
