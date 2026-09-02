const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generatePost() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    process.exit(1);
  }

  // 한 번 배포(Build)할 때 3개의 글을 한꺼번에 생성하여 배포 비효율 극복
  const POSTS_PER_RUN = 3;
  let successCount = 0;

  for (let p = 0; p < POSTS_PER_RUN; p++) {
    console.log(`\nGenerating post ${p + 1} of ${POSTS_PER_RUN}...`);
    
    const prompt = `당신은 네이버 스마트스토어, 쿠팡 등에서 활동하는 한국의 온라인 쇼핑몰 초보 셀러들을 위한 전문 블로거입니다.
다음 조건에 맞춰 블로그 글을 하나 작성해주세요. 

[조건]
1. 주제: '초보 셀러의 마진 계산', '키워드 소싱', '세금 절세', '마케팅 기법', '해외대량등록' 중 무작위로 하나 선택 (매번 다른 각도로 작성)
2. 포맷: 반드시 아래와 같은 Markdown 형식이어야 함 (맨 위에 Frontmatter 필수 포함)
3. 제목과 내용은 실전적이고 아주 구체적인 팁을 담을 것
4. excerpt(요약문)에는 절대 ** 등 마크다운 특수문자를 쓰지 말고 순수 텍스트만 쓸 것
5. 띄어쓰기와 맞춤법을 정확히 할 것

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
        
        let text = response.text;
        
        // AI가 마크다운 코드블록(```markdown ... ```)으로 감싸서 대답할 경우를 대비해 껍데기 제거
        text = text.replace(/^```(markdown)?\n/i, '').replace(/\n```$/i, '');
        
        // AI 작성 명시 문구 하단에 강제 추가
        text += '\n\n---\n> *💡 이 글은 최신 쇼핑몰 트렌드 데이터를 기반으로 AI에 의해 자동 작성되었습니다.*';
        
        // 정규식으로 title 추출해서 파일명 생성
        const titleMatch = text.match(/title:\s*"([^"]+)"/);
        let filename = `post-${Date.now()}.md`;
        if (titleMatch && titleMatch[1]) {
          const slug = titleMatch[1]
            .replace(/[^a-zA-Z0-9가-힣\s]/g, '')
            .trim()
            .replace(/\s+/g, '-');
          filename = `${slug}-${Date.now()}.md`; // 파일명 중복 방지
        }

        const filepath = path.join(__dirname, '../src/content/tips', filename);
        fs.writeFileSync(filepath, text, 'utf8');
        
        console.log(`Successfully generated post: ${filename}`);
        successCount++;
        break; 
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error.message);
        if (i < retries - 1) {
          console.log("Retrying in 5 seconds...");
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }
    
    // 다음 글 작성 전 3초 대기 (API Rate Limit 방지)
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  if (successCount === 0) {
    console.error("All posts failed to generate.");
    process.exit(1);
  } else {
    console.log(`\nSuccessfully batched ${successCount} posts!`);
  }
}

generatePost();
