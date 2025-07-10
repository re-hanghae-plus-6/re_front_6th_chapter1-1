// 훨씬 단순한 제네릭 타입 -----------------------------
// 기본값 타입 하나만 알면 나머지는 unknown 으로 둡니다.

export interface SimpleCodec<T> {
  default: T;
  parse?: (raw: string) => T;
  serialize?: (val: T) => string;
}

export type SimpleSchema = Record<string, SimpleCodec<any>>;

/**
 * createQueryParams
 *  - read():  URL -> object
 *  - push():  object -> URL (pushState)
 */
export function createQueryParams<S extends SimpleSchema>(schema: S) {
  // Result 타입: 각 키의 default 타입을 그대로 사용
  type Result = { [K in keyof S]: S[K]["default"] };

  const read = (): Result => {
    const search = new URLSearchParams(window.location.search);
    const obj: any = {};

    for (const key in schema) {
      const codec = schema[key as keyof S];
      const raw = search.get(key);
      obj[key] = raw !== null ? (codec.parse ? codec.parse(raw) : (raw as any)) : codec.default;
    }

    return obj as Result;
  };

  const append = (partial: Partial<Result>) => {
    const search = new URLSearchParams(window.location.search);

    for (const key in partial) {
      const codec = schema[key as keyof S];
      const val = partial[key as keyof Result] as any;

      if (val === codec.default || val === null || val === undefined) search.delete(key);
      else search.set(key, codec.serialize ? codec.serialize(val) : String(val));
    }

    const qs = search.toString();
    const newURL = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    history.pushState(null, "", newURL);
  };

  return {
    read,
    append,
  };
}
