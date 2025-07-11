// 역할: 파라미터 추출 관련 순수 함수들
export const parameterExtractor = {
  // 패턴과 실제 경로에서 파라미터 추출
  extract(pattern, actualPath) {
    const patternSegments = this.parsePattern(pattern);
    const actualSegments = this.parsePattern(actualPath);

    // 세그먼트 개수가 다르면 빈 객체 반환
    if (patternSegments.length !== actualSegments.length) {
      return {};
    }

    const params = {};

    // 각 세그먼트에서 파라미터 추출
    for (let i = 0; i < patternSegments.length; i++) {
      const patternSegment = patternSegments[i];
      const actualSegment = actualSegments[i];

      // 동적 세그먼트(:productId)인 경우 파라미터로 추출
      if (patternSegment.startsWith(":")) {
        const paramName = patternSegment.slice(1); // ':' 제거
        params[paramName] = actualSegment;
      }
    }

    return params;
  },

  // 패턴에서 파라미터 이름들 추출
  getParameterNames(pattern) {
    const segments = this.parsePattern(pattern);
    const paramNames = [];

    for (const segment of segments) {
      if (segment.startsWith(":")) {
        const paramName = segment.slice(1); // ':' 제거
        paramNames.push(paramName);
      }
    }

    return paramNames;
  },

  // 패턴을 세그먼트로 분해 (pathMatcher와 동일한 로직)
  parsePattern(pattern) {
    return pattern.split("/").filter(Boolean);
  },
};
