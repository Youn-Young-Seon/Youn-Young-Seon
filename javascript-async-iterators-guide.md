# JavaScript/TypeScript 비동기 반복자 완벽 가이드

## 목차
1. [Iterator와 Iterable](#iterator와-iterable)
2. [Generator](#generator)
3. [Promise](#promise)
4. [Async/Await](#asyncawait)
5. [AsyncIterator와 AsyncIterable](#asynciterator와-asynciterable)
6. [실질적인 활용 예제](#실질적인-활용-예제)

---

## Iterator와 Iterable

### 기본 개념

**Iterator**는 다음 값에 접근할 수 있는 객체입니다. `next()` 메서드를 가지고 있으며, 이 메서드는 `{value, done}` 형태의 객체를 반환합니다.

**Iterable**은 `Symbol.iterator` 메서드를 가진 객체로, 이 메서드는 Iterator를 반환합니다.

### 기본 예제

```javascript
// 1. 기본 Iterator 구현
class NumberIterator {
    constructor(start, end) {
        this.current = start;
        this.end = end;
    }
    
    next() {
        if (this.current <= this.end) {
            return { value: this.current++, done: false };
        }
        return { value: undefined, done: true };
    }
}

// 2. Iterable 객체 구현
class NumberRange {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    
    [Symbol.iterator]() {
        return new NumberIterator(this.start, this.end);
    }
}

// 사용 예제
const range = new NumberRange(1, 5);

// for...of 사용
for (const num of range) {
    console.log(num); // 1, 2, 3, 4, 5
}

// 수동 반복
const iterator = range[Symbol.iterator]();
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
```

### 상세 설명

- **Iterator Protocol**: `next()` 메서드를 가진 객체
- **Iterable Protocol**: `Symbol.iterator` 메서드를 가진 객체
- **내장 Iterable**: Array, String, Map, Set 등
- **for...of 루프**: Iterable 객체와 함께 사용 가능

---

## Generator

### 기본 개념

Generator는 실행을 일시 중단하고 재개할 수 있는 함수입니다. `function*` 문법을 사용하고, `yield` 키워드로 값을 반환합니다.

### 기본 예제

```javascript
// 1. 기본 Generator 함수
function* simpleGenerator() {
    console.log('Generator 시작');
    yield 1;
    console.log('첫 번째 yield 이후');
    yield 2;
    console.log('두 번째 yield 이후');
    yield 3;
    console.log('Generator 끝');
}

const gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// 2. 무한 시퀀스 Generator
function* infiniteSequence() {
    let i = 0;
    while (true) {
        yield i++;
    }
}

const infinite = infiniteSequence();
console.log(infinite.next().value); // 0
console.log(infinite.next().value); // 1
console.log(infinite.next().value); // 2

// 3. 피보나치 수열 Generator
function* fibonacci() {
    let [prev, curr] = [0, 1];
    while (true) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}

const fib = fibonacci();
for (let i = 0; i < 10; i++) {
    console.log(fib.next().value); // 1, 1, 2, 3, 5, 8, 13, 21, 34, 55
}
```

### 고급 Generator 예제

```javascript
// 4. yield* 사용 (다른 Generator 위임)
function* generator1() {
    yield 1;
    yield 2;
}

function* generator2() {
    yield 3;
    yield 4;
}

function* combinedGenerator() {
    yield* generator1();
    yield* generator2();
    yield 5;
}

const combined = combinedGenerator();
console.log([...combined]); // [1, 2, 3, 4, 5]

// 5. Generator에 값 전달
function* generatorWithInput() {
    const input1 = yield 'First yield';
    console.log('Received:', input1);
    
    const input2 = yield 'Second yield';
    console.log('Received:', input2);
    
    return 'Done';
}

const genInput = generatorWithInput();
console.log(genInput.next());           // { value: 'First yield', done: false }
console.log(genInput.next('Hello'));    // { value: 'Second yield', done: false }
console.log(genInput.next('World'));    // { value: 'Done', done: true }
```

### 상세 설명

- **Generator 함수**: `function*` 문법으로 정의
- **yield**: 값을 반환하고 실행을 일시 중단
- **yield***: 다른 Generator나 Iterable을 위임
- **Generator 객체**: Iterator 프로토콜을 구현
- **상태 보존**: Generator는 지역 변수와 실행 위치를 기억

---

## Promise

### 기본 개념

Promise는 비동기 작업의 최종 완료 또는 실패를 나타내는 객체입니다.

### 기본 예제

```javascript
// 1. 기본 Promise 생성
const basicPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        const success = Math.random() > 0.5;
        if (success) {
            resolve('성공!');
        } else {
            reject(new Error('실패!'));
        }
    }, 1000);
});

// 2. Promise 사용
basicPromise
    .then(result => console.log('Result:', result))
    .catch(error => console.log('Error:', error.message));

// 3. Promise 체이닝
function fetchUserData(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id, name: `User ${id}`, email: `user${id}@example.com` });
        }, 500);
    });
}

function fetchUserPosts(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, title: 'Post 1', userId },
                { id: 2, title: 'Post 2', userId }
            ]);
        }, 300);
    });
}

fetchUserData(1)
    .then(user => {
        console.log('User:', user);
        return fetchUserPosts(user.id);
    })
    .then(posts => {
        console.log('Posts:', posts);
    })
    .catch(error => {
        console.log('Error:', error);
    });
```

### Promise 유틸리티 메서드

```javascript
// 4. Promise.all - 모든 Promise가 성공해야 함
const promise1 = Promise.resolve(3);
const promise2 = new Promise(resolve => setTimeout(() => resolve('foo'), 1000));
const promise3 = Promise.resolve(42);

Promise.all([promise1, promise2, promise3])
    .then(values => console.log('All values:', values)) // [3, 'foo', 42]
    .catch(error => console.log('Error:', error));

// 5. Promise.allSettled - 모든 Promise의 결과를 기다림
const promises = [
    Promise.resolve('성공'),
    Promise.reject('실패'),
    Promise.resolve('또 성공')
];

Promise.allSettled(promises)
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Promise ${index}: ${result.value}`);
            } else {
                console.log(`Promise ${index}: ${result.reason}`);
            }
        });
    });

// 6. Promise.race - 가장 빨리 완료되는 Promise
const slowPromise = new Promise(resolve => setTimeout(() => resolve('slow'), 2000));
const fastPromise = new Promise(resolve => setTimeout(() => resolve('fast'), 500));

Promise.race([slowPromise, fastPromise])
    .then(result => console.log('Winner:', result)); // 'fast'
```

### 상세 설명

- **Promise 상태**: pending, fulfilled, rejected
- **Executor 함수**: Promise 생성자에 전달되는 함수
- **Thenable**: then 메서드를 가진 객체
- **Promise 체이닝**: then/catch 메서드로 연결
- **에러 처리**: reject 상태나 예외 발생 시 catch로 처리

---

## Async/Await

### 기본 개념

async/await는 Promise를 더 동기적으로 작성할 수 있게 해주는 문법적 설탕입니다.

### 기본 예제

```javascript
// 1. 기본 async/await 사용
async function fetchData() {
    try {
        const response = await new Promise((resolve) => {
            setTimeout(() => resolve('데이터 가져오기 완료'), 1000);
        });
        console.log(response);
        return response;
    } catch (error) {
        console.log('오류 발생:', error);
        throw error;
    }
}

fetchData();

// 2. 순차적 비동기 처리
async function sequentialAsync() {
    console.log('시작');
    
    const result1 = await new Promise(resolve => 
        setTimeout(() => resolve('첫 번째 결과'), 1000)
    );
    console.log(result1);
    
    const result2 = await new Promise(resolve => 
        setTimeout(() => resolve('두 번째 결과'), 1000)
    );
    console.log(result2);
    
    return [result1, result2];
}

sequentialAsync().then(results => console.log('최종 결과:', results));

// 3. 병렬 비동기 처리
async function parallelAsync() {
    console.log('병렬 처리 시작');
    
    const promise1 = new Promise(resolve => 
        setTimeout(() => resolve('병렬 결과 1'), 1000)
    );
    const promise2 = new Promise(resolve => 
        setTimeout(() => resolve('병렬 결과 2'), 1000)
    );
    
    const [result1, result2] = await Promise.all([promise1, promise2]);
    console.log('병렬 결과:', result1, result2);
    
    return [result1, result2];
}

parallelAsync();
```

### 실제 활용 예제

```javascript
// 4. API 호출 시뮬레이션
class APIClient {
    async get(url) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve({ data: `Data from ${url}`, status: 200 });
                } else {
                    reject(new Error('Network error'));
                }
            }, Math.random() * 1000);
        });
    }
}

const client = new APIClient();

async function fetchUserProfile(userId) {
    try {
        const [user, posts, comments] = await Promise.all([
            client.get(`/users/${userId}`),
            client.get(`/users/${userId}/posts`),
            client.get(`/users/${userId}/comments`)
        ]);
        
        return {
            user: user.data,
            posts: posts.data,
            comments: comments.data
        };
    } catch (error) {
        console.log('프로필 가져오기 실패:', error.message);
        throw error;
    }
}

// 5. 재시도 로직이 있는 async 함수
async function retryAsync(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            console.log(`재시도 ${i + 1}/${maxRetries}`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

// 사용 예제
retryAsync(() => fetchUserProfile(1))
    .then(profile => console.log('프로필:', profile))
    .catch(error => console.log('최종 실패:', error.message));
```

### 상세 설명

- **async 함수**: 항상 Promise를 반환
- **await**: Promise가 resolved될 때까지 대기
- **에러 처리**: try/catch로 비동기 에러 처리
- **순차 vs 병렬**: await의 위치에 따라 실행 순서 결정
- **Top-level await**: 모듈 최상위에서 await 사용 가능 (ES2022)

---

## AsyncIterator와 AsyncIterable

### 기본 개념

AsyncIterator는 `next()` 메서드가 Promise를 반환하는 Iterator입니다.
AsyncIterable은 `Symbol.asyncIterator` 메서드를 가진 객체입니다.

### 기본 예제

```javascript
// 1. 기본 AsyncIterator 구현
class AsyncNumberIterator {
    constructor(start, end) {
        this.current = start;
        this.end = end;
    }
    
    async next() {
        if (this.current <= this.end) {
            // 비동기 지연 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 100));
            return { value: this.current++, done: false };
        }
        return { value: undefined, done: true };
    }
}

// 2. AsyncIterable 객체 구현
class AsyncNumberRange {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    
    [Symbol.asyncIterator]() {
        return new AsyncNumberIterator(this.start, this.end);
    }
}

// 3. for await...of 사용
async function useAsyncIterable() {
    const asyncRange = new AsyncNumberRange(1, 5);
    
    for await (const num of asyncRange) {
        console.log(num); // 1, 2, 3, 4, 5 (각각 100ms 간격)
    }
}

useAsyncIterable();

// 4. 수동 AsyncIterator 사용
async function manualAsyncIteration() {
    const asyncRange = new AsyncNumberRange(1, 3);
    const iterator = asyncRange[Symbol.asyncIterator]();
    
    let result = await iterator.next();
    while (!result.done) {
        console.log('수동 반복:', result.value);
        result = await iterator.next();
    }
}

manualAsyncIteration();
```

### Async Generator

```javascript
// 5. Async Generator 함수
async function* asyncGenerator() {
    console.log('Async Generator 시작');
    
    yield await new Promise(resolve => 
        setTimeout(() => resolve('첫 번째 값'), 500)
    );
    
    yield await new Promise(resolve => 
        setTimeout(() => resolve('두 번째 값'), 500)
    );
    
    yield await new Promise(resolve => 
        setTimeout(() => resolve('세 번째 값'), 500)
    );
    
    console.log('Async Generator 끝');
}

async function useAsyncGenerator() {
    const gen = asyncGenerator();
    
    for await (const value of gen) {
        console.log('Generator 값:', value);
    }
}

useAsyncGenerator();

// 6. 스트림 처리를 위한 Async Generator
async function* fetchDataStream(urls) {
    for (const url of urls) {
        try {
            const response = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.2) {
                        resolve({ url, data: `Data from ${url}`, timestamp: Date.now() });
                    } else {
                        reject(new Error(`Failed to fetch ${url}`));
                    }
                }, Math.random() * 1000);
            });
            yield response;
        } catch (error) {
            yield { url, error: error.message, timestamp: Date.now() };
        }
    }
}

async function processDataStream() {
    const urls = ['/api/data1', '/api/data2', '/api/data3', '/api/data4'];
    
    for await (const result of fetchDataStream(urls)) {
        if (result.error) {
            console.log(`오류: ${result.url} - ${result.error}`);
        } else {
            console.log(`성공: ${result.url} - ${result.data}`);
        }
    }
}

processDataStream();
```

### 상세 설명

- **AsyncIterator Protocol**: `next()` 메서드가 Promise를 반환
- **AsyncIterable Protocol**: `Symbol.asyncIterator` 메서드를 가진 객체
- **for await...of**: AsyncIterable 객체와 함께 사용
- **Async Generator**: `async function*` 문법으로 정의
- **스트림 처리**: 대량의 비동기 데이터를 순차적으로 처리

---

## 실질적인 활용 예제

### 1. 파일 처리 시뮬레이션

```javascript
// 파일 처리를 위한 AsyncIterable 클래스
class FileProcessor {
    constructor(filenames) {
        this.filenames = filenames;
    }
    
    async *[Symbol.asyncIterator]() {
        for (const filename of this.filenames) {
            try {
                const content = await this.readFile(filename);
                const processed = await this.processFile(content);
                yield { filename, content: processed, status: 'success' };
            } catch (error) {
                yield { filename, error: error.message, status: 'error' };
            }
        }
    }
    
    async readFile(filename) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve(`Content of ${filename}`);
                } else {
                    reject(new Error(`Cannot read ${filename}`));
                }
            }, Math.random() * 1000);
        });
    }
    
    async processFile(content) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(content.toUpperCase());
            }, Math.random() * 500);
        });
    }
}

async function processFiles() {
    const files = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt'];
    const processor = new FileProcessor(files);
    
    for await (const result of processor) {
        if (result.status === 'success') {
            console.log(`✓ ${result.filename}: ${result.content}`);
        } else {
            console.log(`✗ ${result.filename}: ${result.error}`);
        }
    }
}

processFiles();
```

### 2. 배치 처리 시스템

```javascript
// 배치 처리를 위한 클래스
class BatchProcessor {
    constructor(batchSize = 3) {
        this.batchSize = batchSize;
        this.queue = [];
    }
    
    async *processBatch(items) {
        for (let i = 0; i < items.length; i += this.batchSize) {
            const batch = items.slice(i, i + this.batchSize);
            const results = await Promise.allSettled(
                batch.map(item => this.processItem(item))
            );
            
            yield {
                batchNumber: Math.floor(i / this.batchSize) + 1,
                results: results.map((result, index) => ({
                    item: batch[index],
                    status: result.status,
                    value: result.value,
                    reason: result.reason?.message
                }))
            };
        }
    }
    
    async processItem(item) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.2) {
                    resolve(`Processed: ${item}`);
                } else {
                    reject(new Error(`Failed to process: ${item}`));
                }
            }, Math.random() * 1000);
        });
    }
}

async function runBatchProcessing() {
    const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
    const processor = new BatchProcessor(3);
    
    for await (const batch of processor.processBatch(items)) {
        console.log(`\n=== Batch ${batch.batchNumber} ===`);
        batch.results.forEach(result => {
            if (result.status === 'fulfilled') {
                console.log(`✓ ${result.item}: ${result.value}`);
            } else {
                console.log(`✗ ${result.item}: ${result.reason}`);
            }
        });
    }
}

runBatchProcessing();
```

### 3. 실시간 데이터 스트림

```javascript
// 실시간 데이터 스트림 시뮬레이션
class DataStream {
    constructor(source) {
        this.source = source;
        this.subscribers = new Set();
    }
    
    async *[Symbol.asyncIterator]() {
        while (true) {
            const data = await this.fetchData();
            if (data === null) break; // 스트림 종료
            yield data;
        }
    }
    
    async fetchData() {
        return new Promise(resolve => {
            setTimeout(() => {
                const random = Math.random();
                if (random > 0.9) {
                    resolve(null); // 스트림 종료
                } else {
                    resolve({
                        id: Math.floor(Math.random() * 1000),
                        timestamp: Date.now(),
                        value: Math.floor(Math.random() * 100),
                        source: this.source
                    });
                }
            }, 200);
        });
    }
    
    // 스트림 데이터 필터링
    async *filter(predicate) {
        for await (const data of this) {
            if (predicate(data)) {
                yield data;
            }
        }
    }
    
    // 스트림 데이터 변환
    async *map(transform) {
        for await (const data of this) {
            yield transform(data);
        }
    }
    
    // 스트림 데이터 집계
    async *batch(size) {
        let batch = [];
        for await (const data of this) {
            batch.push(data);
            if (batch.length >= size) {
                yield batch;
                batch = [];
            }
        }
        if (batch.length > 0) {
            yield batch;
        }
    }
}

async function processDataStream() {
    const stream = new DataStream('sensor-1');
    
    // 값이 50 이상인 데이터만 필터링하고 변환
    const processedStream = stream
        .filter(data => data.value >= 50)
        .map(data => ({
            ...data,
            processed: true,
            category: data.value >= 80 ? 'high' : 'medium'
        }))
        .batch(3);
    
    for await (const batch of processedStream) {
        console.log('처리된 배치:', batch);
    }
}

processDataStream();
```

### 4. Promise와 Generator를 결합한 상태 관리

```javascript
// 상태 관리를 위한 클래스
class AsyncStateMachine {
    constructor(initialState) {
        this.state = initialState;
        this.history = [initialState];
    }
    
    async *run(actions) {
        for (const action of actions) {
            const newState = await this.applyAction(action);
            this.state = newState;
            this.history.push(newState);
            yield {
                action,
                previousState: this.history[this.history.length - 2],
                currentState: newState,
                timestamp: Date.now()
            };
        }
    }
    
    async applyAction(action) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const newState = { ...this.state };
                    
                    switch (action.type) {
                        case 'increment':
                            newState.count = (newState.count || 0) + (action.value || 1);
                            break;
                        case 'decrement':
                            newState.count = (newState.count || 0) - (action.value || 1);
                            break;
                        case 'set':
                            newState[action.key] = action.value;
                            break;
                        case 'reset':
                            Object.keys(newState).forEach(key => delete newState[key]);
                            break;
                        default:
                            throw new Error(`Unknown action type: ${action.type}`);
                    }
                    
                    resolve(newState);
                } catch (error) {
                    reject(error);
                }
            }, Math.random() * 300);
        });
    }
}

async function runStateMachine() {
    const machine = new AsyncStateMachine({ count: 0 });
    
    const actions = [
        { type: 'increment', value: 5 },
        { type: 'increment', value: 3 },
        { type: 'set', key: 'name', value: 'AsyncMachine' },
        { type: 'decrement', value: 2 },
        { type: 'set', key: 'status', value: 'running' }
    ];
    
    for await (const transition of machine.run(actions)) {
        console.log(`액션: ${transition.action.type}`, transition.currentState);
    }
    
    console.log('최종 상태:', machine.state);
    console.log('상태 히스토리:', machine.history);
}

runStateMachine();
```

---

## 요약

이 가이드에서 다룬 주요 개념들:

1. **Iterator/Iterable**: 순차적 데이터 접근을 위한 프로토콜
2. **Generator**: 실행을 일시 중단할 수 있는 함수
3. **Promise**: 비동기 작업의 결과를 나타내는 객체
4. **Async/Await**: Promise를 더 직관적으로 사용하는 문법
5. **AsyncIterator/AsyncIterable**: 비동기 데이터 스트림 처리
6. **실제 활용**: 파일 처리, 배치 처리, 스트림 처리, 상태 관리

이러한 개념들을 조합하면 복잡한 비동기 로직을 깔끔하고 읽기 쉬운 코드로 구현할 수 있습니다.