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
    
    const prompt = `당신은 네이버 스마트스토어, 쿠팡 등에서 활동하는 한국의 온라인 쇼핑몰 초보 셀러들을 위한 전문 SEO 블로거입니다.
다음 조건에 맞춰 블로그 글을 하나 작성해주세요. 

[조건]
1. 주제: '초보 셀러의 마진 계산', '키워드 소싱 전략', '세금 절세 노하우', '쇼핑몰 마케팅 기법', '해외 대량 등록', '수수료 완벽 분석', '반품/교환 정책 운영', '배송비 절감 방법' 중 무작위로 하나 선택 (매번 완전히 다른 각도와 세부 주제로 작성)
2. 길이: 반드시 최소 2,500자 이상의 장문으로 작성할 것 (구글 SEO 최적화를 위한 필수 요건)
3. 구조: 아래 포맷을 반드시 따를 것
   - H2(##) 소제목 5개 이상 필수
   - 각 소제목 아래 최소 3~5문단의 본문 작성
   - 실전 예시, 수치, 구체적인 팁 반드시 포함
   - 글 말미에 "핵심 정리" 또는 "마무리" 섹션 추가
4. 포맷: 반드시 아래와 같은 Markdown 형식이어야 함 (맨 위에 Frontmatter 필수 포함)
5. excerpt(요약문)에는 절대 ** 등 마크다운 특수문자를 쓰지 말고 순수 텍스트만 쓸 것
6. 띄어쓰기와 맞춤법을 정확히 할 것

[형식]
---
title: "블로그 제목 (검색자가 클릭하고 싶을 만큼 구체적이고 매력적으로)"
date: "YYYY-MM-DD"
excerpt: "목록에 보여질 요약 설명 2~3줄 (마크다운 기호 없이 순수 텍스트)"
---

본문 내용 (최소 2,500자 이상)...
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
        text += '\n\n---\n> **📢 안내:** 본 정보성 콘텐츠는 구글 및 국내 생성형 AI 콘텐츠 표기 가이드라인에 따라, 최신 이커머스 트렌드 및 판매자 데이터를 바탕으로 생성형 AI를 활용하여 작성되었습니다.';
        
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
