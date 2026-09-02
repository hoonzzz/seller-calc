const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generatePost() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    process.exit(1);
  }

  const prompt = `당신은 네이버 스마트스토어, 쿠팡 등에서 활동하는 한국의 온라인 쇼핑몰 초보 셀러들을 위한 전문 블로거입니다.
다음 조건에 맞춰 블로그 글을 하나 작성해주세요. 

[조건]
1. 주제: '초보 셀러의 마진 계산', '키워드 소싱', '세금 절세', '마케팅 기법' 중 무작위로 하나 선택
2. 포맷: 반드시 아래와 같은 Markdown 형식이어야 함 (맨 위에 Frontmatter 필수 포함)
3. 제목과 내용은 실전적이고 아주 구체적인 팁을 담을 것
4. 띄어쓰기와 맞춤법을 정확히 할 것

[형식]
---
title: "블로그 제목"
date: "YYYY-MM-DD"
excerpt: "목록에 보여질 요약 설명 (1-2줄)"
---

본문 내용...
`;

  let success = false;
  let retries = 3;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });
      
      const text = response.text;
      
      // YYYY-MM-DD 추출 혹은 생성
      const today = new Date();
      
      // 정규식으로 title 추출해서 파일명 생성
      const titleMatch = text.match(/title:\s*"([^"]+)"/);
      let filename = `post-${Date.now()}.md`;
      if (titleMatch && titleMatch[1]) {
        // 영문, 숫자, 한글만 남기고 공백은 하이픈으로 변경
        const slug = titleMatch[1]
          .replace(/[^a-zA-Z0-9가-힣\s]/g, '')
          .trim()
          .replace(/\s+/g, '-');
        filename = `${slug}.md`;
      }

      const filepath = path.join(__dirname, '../src/content/tips', filename);
      fs.writeFileSync(filepath, text, 'utf8');
      
      console.log(`Successfully generated post: ${filename}`);
      success = true;
      break; // 성공하면 루프 탈출
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        console.log("Retrying in 5 seconds...");
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.error("All retries failed. Exiting.");
        process.exit(1);
      }
    }
  }
}

generatePost();
