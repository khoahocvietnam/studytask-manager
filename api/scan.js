// api/scan.js - Đọc ảnh TKB với API key từ Vercel
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'Vui lòng cung cấp ảnh' });
    
    // Lấy API key từ environment variables (BẢO MẬT)
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API key chưa được cấu hình trên Vercel' });
    }
    
    const prompt = `Nhận dạng thời khóa biểu từ ảnh. Trả về CHỈ JSON: {"Thứ 2":[],"Thứ 3":[],"Thứ 4":[],"Thứ 5":[],"Thứ 6":[],"Thứ 7":[],"Chủ nhật":[]}`;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-04-09:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }] }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 1000 }
            })
        });
        
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const match = text.match(/\{[\s\S]*\}/);
        
        if (!match) throw new Error('Không đọc được ảnh');
        
        return res.status(200).json({ success: true, timetable: JSON.parse(match[0]) });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
