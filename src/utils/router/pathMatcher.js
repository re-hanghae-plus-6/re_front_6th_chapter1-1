// 역할: 경로 매칭 관련 순수 함수들
export const pathMatcher = {
  // 패턴과 실제 경로가 매칭되는지 확인
  isMatch(pattern, actualPath) {
    const patternSegments = this.parsePattern(pattern);
    const actualSegments = this.parsePattern(actualPath);

    // 세그먼트 개수가 다르면 매칭 실패
    if (patternSegments.length !== actualSegments.length) {
      return false;
    }

    // 각 세그먼트 비교
    for (let i = 0; i < patternSegments.length; i++) {
      const patternSegment = patternSegments[i];
      const actualSegment = actualSegments[i];

      // 동적 세그먼트(:productId)가 아니면 정확히 일치해야 함
      if (!patternSegment.startsWith(":") && patternSegment !== actualSegment) {
        return false;
      }
    }

    return true;
  },

  // 여러 패턴 중 매칭되는 패턴 찾기
  findMatchedPattern(actualPath, patterns) {
    // 우선순위 기반 정렬 후 매칭
    const sortedPatterns = this.sortPatternsByPriority(patterns);

    for (const pattern of sortedPatterns) {
      if (this.isMatch(pattern, actualPath)) {
        return pattern;
      }
    }

    return null;
  },

  // 패턴을 세그먼트로 분해
  parsePattern(pattern) {
    // '/'로 분리하고 빈 문자열 제거
    return pattern.split("/").filter(Boolean);
  },

  // 패턴들을 우선순위별로 정렬 (정적 > 동적 > 와일드카드)
  sortPatternsByPriority(patterns) {
    return patterns.sort((a, b) => {
      const aScore = this.getPatternScore(a);
      const bScore = this.getPatternScore(b);
      return bScore - aScore; // 내림차순 (높은 점수가 우선)
    });
  },

  // 패턴의 우선순위 점수 계산
  getPatternScore(pattern) {
    const segments = this.parsePattern(pattern);
    let score = 0;

    for (const segment of segments) {
      if (segment === "*") {
        // 와일드카드는 가장 낮은 점수
        score += 1;
      } else if (segment.startsWith(":")) {
        // 동적 세그먼트는 중간 점수
        score += 10;
      } else {
        // 정적 세그먼트는 가장 높은 점수
        score += 100;
      }
    }

    return score;
  },
};
