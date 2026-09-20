import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/tips');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content?: string;
}

/**
 * AI가 생성한 마크다운의 프론트매터(---) 들여쓰기 공백 및 문법 오류 자동 정제 함수
 */
function sanitizeMarkdown(content: string): string {
  // 프론트매터 영역(--- 사이)을 찾아 각 줄의 불필요한 앞뒤 공백 제거
  return content.replace(/^---\r?\n([\s\S]*?)\r?\n---/, (match, frontmatter) => {
    const cleanedLines = frontmatter
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => Boolean(line));
    return `---\n${cleanedLines.join('\n')}\n---`;
  });
}

export function getSortedPostsData(): PostData[] {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      try {
        const rawContent = fs.readFileSync(fullPath, 'utf8');
        const fileContents = sanitizeMarkdown(rawContent);
        const matterResult = matter(fileContents);

        return {
          slug,
          title: String(matterResult.data.title || slug),
          date: String(matterResult.data.date || new Date().toISOString().split('T')[0]),
          excerpt: String(matterResult.data.excerpt || ''),
        };
      } catch (err) {
        console.error(`[Posts Warning] 포스트 파싱 실패 (${fileName}), 정규식 대체 추출 시도:`, err);
        // YAML 파싱 실패 시 정규식으로 안전하게 추출
        try {
          const raw = fs.readFileSync(fullPath, 'utf8');
          const titleMatch = raw.match(/title:\s*["']?([^"'\n]+)["']?/i);
          const dateMatch = raw.match(/date:\s*["']?([^"'\n]+)["']?/i);
          const excerptMatch = raw.match(/excerpt:\s*["']?([^"'\n]+)["']?/i);

          return {
            slug,
            title: titleMatch ? titleMatch[1].trim() : slug,
            date: dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0],
            excerpt: excerptMatch ? excerptMatch[1].trim() : '',
          };
        } catch {
          return null;
        }
      }
    })
    .filter((post): post is PostData => post !== null);

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostData(slug: string): PostData | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  
  try {
    const rawContent = fs.readFileSync(fullPath, 'utf8');
    const fileContents = sanitizeMarkdown(rawContent);
    const matterResult = matter(fileContents);

    return {
      slug,
      title: String(matterResult.data.title || slug),
      date: String(matterResult.data.date || new Date().toISOString().split('T')[0]),
      excerpt: String(matterResult.data.excerpt || ''),
      content: matterResult.content,
    };
  } catch (err) {
    console.error(`[Posts Warning] getPostData 파싱 실패 (${slug}.md):`, err);
    try {
      const raw = fs.readFileSync(fullPath, 'utf8');
      const titleMatch = raw.match(/title:\s*["']?([^"'\n]+)["']?/i);
      const dateMatch = raw.match(/date:\s*["']?([^"'\n]+)["']?/i);
      const excerptMatch = raw.match(/excerpt:\s*["']?([^"'\n]+)["']?/i);
      const content = raw.replace(/^---[\s\S]*?---/, '').trim();

      return {
        slug,
        title: titleMatch ? titleMatch[1].trim() : slug,
        date: dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0],
        excerpt: excerptMatch ? excerptMatch[1].trim() : '',
        content,
      };
    } catch {
      return null;
    }
  }
}
