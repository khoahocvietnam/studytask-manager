// api/scan.js
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Xử lý preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // ✅ ĐÚNG: Chỉ cho phép POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
        return res.status(400).json({ error: 'Vui lòng cung cấp ảnh' });
    }
    
    // ✅ ĐÚNG: Tên biến phải là GEMINI_API_KEY
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API key chưa được cấu hình trên Vercel' });
    }
    
    const prompt = `Bạn là AI chuyên nhận dạng thời khóa biểu.
Hãy nhìn vào ảnh và trả về CHÍNH XÁC thời khóa biểu theo định dạng JSON dưới đây.
KHÔNG thêm bất kỳ giải thích hay text nào khác ngoài JSON.

Định dạng JSON trả về:
{
    "Thứ 2": ["môn1", "môn2"],
    "Thứ 3": ["môn1", "môn2"],
    "Thứ 4": ["môn1", "môn2"],
    "Thứ 5": ["môn1", "môn2"],
    "Thứ 6": ["môn1", "môn2"],
    "Thứ 7": ["môn1", "môn2"],
    "Chủ nhật": []
}

Bắt đầu phân tích ảnh ngay bây giờ:`;

    try {
        const model = 'gemini-2.5-flash-lite-preview-04-09';
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
                    ]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 1000
                }
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error('Gemini API Error:', data);
            return res.status(500).json({ error: 'Lỗi từ Gemini API: ' + JSON.stringify(data) });
        }
        
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const match = text.match(/\{[\s\S]*\}/);
        
        if (!match) {
            return res.status(422).json({ error: 'Không thể đọc được nội dung từ ảnh' });
        }
        
        const timetable = JSON.parse(match[0]);
        
        const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
        for (let day of days) {
            if (!timetable[day]) timetable[day] = [];
        }
        
        return res.status(200).json({ success: true, timetable });
        
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
