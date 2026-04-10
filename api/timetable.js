// api/scan-timetable.js - Đọc ảnh thời khóa biểu bằng Gemini 2.5 Flash Lite
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { imageBase64, apiKey } = req.body;
    
    if (!imageBase64) {
        return res.status(400).json({ error: 'Vui lòng cung cấp ảnh' });
    }
    
    // Sử dụng Gemini 2.5 Flash Lite
    const GEMINI_API_KEY = apiKey || process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API key không được cấu hình' });
    }
    
    // Prompt chuyên nhận dạng thời khóa biểu
    const prompt = `Bạn là AI chuyên nhận dạng thời khóa biểu của học sinh THPT.
    
QUAN TRỌNG: Hãy nhìn kỹ vào ảnh và trả về CHÍNH XÁC thời khóa biểu theo định dạng JSON dưới đây.
KHÔNG thêm bất kỳ giải thích hay text nào khác ngoài JSON.

Định dạng JSON trả về:
{
    "Thứ 2": ["môn1", "môn2", "môn3"],
    "Thứ 3": ["môn1", "môn2", "môn3"],
    "Thứ 4": ["môn1", "môn2", "môn3"],
    "Thứ 5": ["môn1", "môn2", "môn3"],
    "Thứ 6": ["môn1", "môn2", "môn3"],
    "Thứ 7": ["môn1", "môn2", "môn3"],
    "Chủ nhật": ["môn1", "môn2", "môn3"]
}

Nếu một ngày không có môn học, trả về mảng rỗng [].
Hãy đọc chính xác tên môn học từ ảnh (Toán, Văn, Lý, Hóa, Sinh, Sử, Địa, Anh, GDCD, Tin, Công nghệ, Thể dục, Quốc phòng...).

Bắt đầu phân tích ảnh ngay bây giờ:`;

    try {
        // Sử dụng Gemini 2.5 Flash Lite model
        const model = 'gemini-2.5-flash-lite-preview-04-09'; // Model 2.5 Flash Lite mới nhất
        
        console.log(`📡 Gọi Gemini API với model: ${model}`);
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { 
                            inlineData: { 
                                mimeType: "image/jpeg", 
                                data: imageBase64 
                            } 
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.1,      // Thấp để kết quả chính xác
                    maxOutputTokens: 2000,
                    topP: 0.95,
                    topK: 40
                }
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error('Gemini API Error:', data);
            
            // Thử fallback với model gemini-1.5-flash nếu model 2.5 lỗi
            if (model === 'gemini-2.5-flash-lite-preview-04-09') {
                console.log('🔄 Thử fallback với gemini-1.5-flash...');
                const fallbackResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: prompt },
                                { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
                            ]
                        }],
                        generationConfig: { temperature: 0.1, maxOutputTokens: 2000 }
                    })
                });
                
                const fallbackData = await fallbackResponse.json();
                
                if (fallbackResponse.ok) {
                    const text = fallbackData.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    const jsonMatch = text.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const timetable = JSON.parse(jsonMatch[0]);
                        return res.status(200).json({ success: true, timetable, model: 'gemini-1.5-flash' });
                    }
                }
            }
            
            return res.status(500).json({ 
                error: 'Lỗi từ Gemini API', 
                details: data.error?.message || 'Unknown error' 
            });
        }
        
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log('📝 AI Response:', text.substring(0, 200));
        
        // Trích xuất JSON từ response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            return res.status(422).json({ 
                error: 'Không thể đọc được nội dung từ ảnh. Vui lòng chụp ảnh rõ nét hơn!' 
            });
        }
        
        const timetable = JSON.parse(jsonMatch[0]);
        
        // Validate dữ liệu
        const expectedDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
        for (let day of expectedDays) {
            if (!timetable[day]) {
                timetable[day] = [];
            }
        }
        
        return res.status(200).json({ 
            success: true, 
            timetable,
            model: 'gemini-2.5-flash-lite',
            message: 'Đã đọc thành công thời khóa biểu!'
        });
        
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
}
