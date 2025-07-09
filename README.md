# JavaScript/TypeScript 비동기 반복자 예제 모음

이 프로젝트는 JavaScript/TypeScript의 **Iterator**, **Iterable**, **Generator**, **AsyncIterator**, **AsyncIterable**, **Promise**, **async/await** 등의 개념을 실제 예제를 통해 학습할 수 있도록 구성되었습니다.

## 📁 파일 구조

```
├── javascript-async-iterators-guide.md    # 완벽한 이론 및 예제 가이드
├── 01-iterator-iterable.js                # Iterator와 Iterable 기본 예제
├── 02-generator.js                         # Generator 활용 예제
├── 03-promise-async-await.js               # Promise와 async/await 예제
├── 04-async-iterator-iterable.js           # AsyncIterator와 AsyncIterable 예제
├── 05-combined-examples.js                 # 모든 개념을 통합한 실제 활용 예제
└── README.md                               # 이 파일
```

## 🚀 실행 방법

각 파일을 Node.js로 실행하면 됩니다:

```bash
# 기본 예제들
node 01-iterator-iterable.js
node 02-generator.js
node 03-promise-async-await.js
node 04-async-iterator-iterable.js

# 통합 예제
node 05-combined-examples.js
```

## 📖 각 파일별 설명

### 1. `01-iterator-iterable.js`
- **Iterator Protocol**과 **Iterable Protocol**의 기본 구현
- 커스텀 Iterator/Iterable 클래스 생성
- 페이지네이션, 파일 시스템 등 실제 활용 예제
- 내장 Iterable 객체들 (Array, String, Map, Set) 사용법

**실행 예시:**
```bash
node 01-iterator-iterable.js
```

**주요 학습 내용:**
- `next()` 메서드와 `{value, done}` 객체
- `Symbol.iterator` 사용법
- `for...of` 루프와의 연동
- 실제 사용 사례들

### 2. `02-generator.js`
- **Generator 함수** (`function*`)의 기본 사용법
- `yield`와 `yield*` 키워드 활용
- 무한 시퀀스, 피보나치 수열 등 다양한 예제
- 상태 관리와 데이터 파이프라인 구현

**실행 예시:**
```bash
node 02-generator.js
```

**주요 학습 내용:**
- Generator 함수의 일시 중단/재개 매커니즘
- 값 전달과 양방향 통신
- 메모리 효율적인 대용량 데이터 처리
- 상태 기반 로직 구현

### 3. `03-promise-async-await.js`
- **Promise**의 기본 사용법과 체이닝
- **async/await** 문법 활용
- 병렬 처리와 순차 처리 비교
- 에러 처리와 재시도 로직

**실행 예시:**
```bash
node 03-promise-async-await.js
```

**주요 학습 내용:**
- Promise 생성과 사용
- `Promise.all`, `Promise.allSettled`, `Promise.race` 활용
- async/await의 장점과 사용법
- 복잡한 비동기 워크플로우 구현
- 타임아웃과 에러 처리 패턴

### 4. `04-async-iterator-iterable.js`
- **AsyncIterator**와 **AsyncIterable** 구현
- **Async Generator** 함수 활용
- 실시간 데이터 스트림 처리
- 비동기 파이프라인 구축

**실행 예시:**
```bash
node 04-async-iterator-iterable.js
```

**주요 학습 내용:**
- `Symbol.asyncIterator` 사용법
- `for await...of` 루프 활용
- 스트림 데이터 필터링과 변환
- 배치 처리와 에러 복구 메커니즘

### 5. `05-combined-examples.js`
- 모든 개념을 통합한 **실제 활용 예제**
- 실시간 데이터 처리 시스템 구현
- 재시도 메커니즘과 모니터링 시스템
- 실무에서 사용할 수 있는 패턴들

**실행 예시:**
```bash
node 05-combined-examples.js
```

**주요 학습 내용:**
- Iterator → AsyncIterator → 배치 처리 파이프라인
- 에러 처리와 재시도 로직
- 실시간 모니터링과 알림 시스템
- 실제 프로덕션 환경에서의 활용 패턴

## 🎯 핵심 개념 요약

### Iterator & Iterable
```javascript
// Iterator Protocol
const iterator = {
    next() {
        return { value: someValue, done: false };
    }
};

// Iterable Protocol
const iterable = {
    [Symbol.iterator]() {
        return iterator;
    }
};
```

### Generator
```javascript
function* generator() {
    yield 1;
    yield 2;
    yield 3;
}
```

### Promise & async/await
```javascript
// Promise
const promise = new Promise((resolve, reject) => {
    // 비동기 작업
});

// async/await
async function example() {
    const result = await promise;
    return result;
}
```

### AsyncIterator & AsyncIterable
```javascript
// AsyncIterator
const asyncIterator = {
    async next() {
        return { value: await someAsyncOperation(), done: false };
    }
};

// AsyncIterable
const asyncIterable = {
    [Symbol.asyncIterator]() {
        return asyncIterator;
    }
};

// 사용법
for await (const item of asyncIterable) {
    console.log(item);
}
```

### Async Generator
```javascript
async function* asyncGenerator() {
    yield await fetch('/api/data1');
    yield await fetch('/api/data2');
    yield await fetch('/api/data3');
}
```

## 💡 실행 시 참고사항

1. **Node.js 버전**: 14 이상 권장 (ES2020+ 기능 지원)
2. **실행 시간**: 각 파일은 비동기 예제를 포함하므로 완전히 실행되는데 시간이 걸립니다
3. **출력 확인**: 콘솔에 단계별로 실행 결과가 출력됩니다
4. **랜덤 요소**: 일부 예제는 랜덤한 동작을 포함하므로 실행할 때마다 결과가 달라질 수 있습니다

## 🔄 학습 순서 추천

1. **기본 개념 이해**: `javascript-async-iterators-guide.md` 문서 읽기
2. **기초 예제**: `01-iterator-iterable.js` → `02-generator.js`
3. **비동기 기초**: `03-promise-async-await.js`
4. **고급 비동기**: `04-async-iterator-iterable.js`
5. **통합 활용**: `05-combined-examples.js`

## 📚 추가 학습 자료

- [MDN - Iterator Protocol](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Iteration_protocols)
- [MDN - Generators](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Iterators_and_Generators)
- [MDN - Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN - async/await](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/async_function)

## 🛠️ 실습 과제

각 파일을 실행한 후 다음과 같은 변형을 시도해보세요:

1. **Iterator**: 자신만의 커스텀 Iterator 클래스 만들기
2. **Generator**: 다른 수열이나 패턴을 생성하는 Generator 구현
3. **Promise**: 실제 API 호출이나 파일 읽기 작업에 적용
4. **AsyncIterator**: 실시간 데이터 소스 연결 시뮬레이션
5. **통합**: 여러 개념을 결합한 자신만의 데이터 처리 시스템 구축

---

이 예제들을 통해 JavaScript/TypeScript의 강력한 비동기 처리 능력을 마스터하세요! 🚀
