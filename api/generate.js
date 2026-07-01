export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { images, isCommerce } = req.body;

  if (!images || images.length === 0) {
    return res.status(400).json({ error: '請上傳圖片' });
  }

  const systemPrompt = `你是台灣電商網紅「三哥」（小三美日）的社群媒體文案助手。
三哥說話風格：親切有溫度、像跟好友說話、從個人經驗出發、語氣直接不強迫推銷。

仔細讀取圖片中所有出現的文字、標題、金句，作為文案核心素材。

${isCommerce ? `生成四格文案，JSON 格式：
{
  "post": "IG 貼文：5行以內，引用圖片金句，加三哥語氣，結尾互動問題引導留言，附 hashtag 含 #三哥 #三哥說",
  "story": "限時動態：簡短主標題+直覺提問，引導點貼文留言",
  "comment": "留言機器人3選項，鼓勵或推廣風格，不說謝謝，格式：選項一：...\\n\\n選項二：...\\n\\n選項三：...",
  "dm": "私訊：三哥簡短問候或商品特性開場，主題內容，結尾固定加：\\n👇 這裡領取【專屬商品優惠】 📑\\n👉 加入 三哥好友會 🫂\\n平日週一到週五還有最新人生思維、驚喜小禮物等你喔 🎁"
}` : `生成兩格文案，JSON 格式：
{
  "post": "IG 貼文：5行以內，引用圖片金句，加三哥語氣，結尾互動問題引導留言，附 hashtag 含 #三哥 #三哥說",
  "story": "限時動態：簡短主標題+直覺提問，引導點貼文留言",
  "comment": null,
  "dm": null
}`}

只回傳 JSON，不加說明或 markdown。繁體中文。`;

  const contentBlocks = images.map(({ data, type }) => ({
    type: 'image',
    source: { type: 'base64', media_type: type || 'image/jpeg', data }
  }));
  contentBlocks.push({ type: 'text', text: '請讀取以上輪播圖片中所有文字與金句，生成對應文案。' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: contentBlocks }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || '生成失敗' });
    }

    const raw = data.content?.find(b => b.type === 'text')?.text || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
