export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Demo data
    let submissions = [
        {
            id: '1',
            taskId: '1',
            studentId: '2',
            studentName: 'Nguyễn Văn A',
            status: 'completed',
            submittedAt: '2024-04-10',
            score: null
        },
        {
            id: '2',
            taskId: '2',
            studentId: '2',
            studentName: 'Nguyễn Văn A',
            status: 'pending',
            submittedAt: null,
            score: null
        }
    ];
    
    // GET - Lấy bài nộp
    if (req.method === 'GET') {
        const { taskId, studentId } = req.query;
        
        let result = submissions;
        if (taskId) result = result.filter(s => s.taskId === taskId);
        if (studentId) result = result.filter(s => s.studentId === studentId);
        
        return res.status(200).json(result);
    }
    
    // POST - Nộp bài
    if (req.method === 'POST') {
        const { taskId, studentId, studentName } = req.body;
        
        const existing = submissions.find(s => s.taskId === taskId && s.studentId === studentId);
        
        if (existing) {
            existing.status = 'completed';
            existing.submittedAt = new Date().toISOString().split('T')[0];
            return res.status(200).json(existing);
        }
        
        const newSubmission = {
            id: Date.now().toString(),
            taskId,
            studentId,
            studentName,
            status: 'completed',
            submittedAt: new Date().toISOString().split('T')[0],
            score: null
        };
        
        submissions.push(newSubmission);
        return res.status(201).json(newSubmission);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
