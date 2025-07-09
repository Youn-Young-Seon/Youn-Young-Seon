// ============================
// AsyncIterator와 AsyncIterable 예제
// ============================

// 유틸리티 함수
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('=== 1. 기본 AsyncIterator 구현 ===');

// 1. 기본 AsyncIterator 구현
class AsyncNumberIterator {
    constructor(start, end) {
        this.current = start;
        this.end = end;
    }
    
    async next() {
        if (this.current <= this.end) {
            // 비동기 지연 시뮬레이션
            await delay(100);
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
    
    console.log('for await...of 사용:');
    for await (const num of asyncRange) {
        console.log(`  ${num}`);
    }
}

// 4. 수동 AsyncIterator 사용
async function manualAsyncIteration() {
    console.log('\n수동 AsyncIterator 사용:');
    const asyncRange = new AsyncNumberRange(1, 3);
    const iterator = asyncRange[Symbol.asyncIterator]();
    
    let result = await iterator.next();
    while (!result.done) {
        console.log(`  수동 반복: ${result.value}`);
        result = await iterator.next();
    }
}

// 실행
(async () => {
    await useAsyncIterable();
    await manualAsyncIteration();
})();

// 5. Async Generator 함수
setTimeout(async () => {
    console.log('\n=== 2. Async Generator 함수 ===');
    
    async function* asyncGenerator() {
        console.log('  Async Generator 시작');
        
        yield await delay(200).then(() => '첫 번째 값');
        yield await delay(200).then(() => '두 번째 값');
        yield await delay(200).then(() => '세 번째 값');
        
        console.log('  Async Generator 끝');
    }
    
    async function useAsyncGenerator() {
        const gen = asyncGenerator();
        
        for await (const value of gen) {
            console.log(`  Generator 값: ${value}`);
        }
    }
    
    await useAsyncGenerator();
}, 1000);

// 6. 스트림 처리를 위한 Async Generator
setTimeout(async () => {
    console.log('\n=== 3. 스트림 처리를 위한 Async Generator ===');
    
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
                    }, Math.random() * 500);
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
                console.log(`  오류: ${result.url} - ${result.error}`);
            } else {
                console.log(`  성공: ${result.url} - ${result.data}`);
            }
        }
    }
    
    await processDataStream();
}, 2000);

// 7. 파일 처리 시뮬레이션
setTimeout(async () => {
    console.log('\n=== 4. 파일 처리 시뮬레이션 ===');
    
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
                }, Math.random() * 300);
            });
        }
        
        async processFile(content) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(content.toUpperCase());
                }, Math.random() * 200);
            });
        }
    }
    
    async function processFiles() {
        const files = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt'];
        const processor = new FileProcessor(files);
        
        for await (const result of processor) {
            if (result.status === 'success') {
                console.log(`  ✓ ${result.filename}: ${result.content}`);
            } else {
                console.log(`  ✗ ${result.filename}: ${result.error}`);
            }
        }
    }
    
    await processFiles();
}, 3500);

// 8. 배치 처리 시스템
setTimeout(async () => {
    console.log('\n=== 5. 배치 처리 시스템 ===');
    
    class BatchProcessor {
        constructor(batchSize = 3) {
            this.batchSize = batchSize;
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
                    if (Math.random() > 0.3) {
                        resolve(`Processed: ${item}`);
                    } else {
                        reject(new Error(`Failed to process: ${item}`));
                    }
                }, Math.random() * 500);
            });
        }
    }
    
    async function runBatchProcessing() {
        const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
        const processor = new BatchProcessor(3);
        
        for await (const batch of processor.processBatch(items)) {
            console.log(`\n  === Batch ${batch.batchNumber} ===`);
            batch.results.forEach(result => {
                if (result.status === 'fulfilled') {
                    console.log(`    ✓ ${result.item}: ${result.value}`);
                } else {
                    console.log(`    ✗ ${result.item}: ${result.reason}`);
                }
            });
        }
    }
    
    await runBatchProcessing();
}, 5000);

// 9. 실시간 데이터 스트림
setTimeout(async () => {
    console.log('\n=== 6. 실시간 데이터 스트림 ===');
    
    class DataStream {
        constructor(source) {
            this.source = source;
            this.count = 0;
        }
        
        async *[Symbol.asyncIterator]() {
            while (this.count < 10) { // 10개 데이터로 제한
                const data = await this.fetchData();
                if (data === null) break;
                yield data;
                this.count++;
            }
        }
        
        async fetchData() {
            return new Promise(resolve => {
                setTimeout(() => {
                    const random = Math.random();
                    if (random > 0.95) {
                        resolve(null); // 스트림 종료
                    } else {
                        resolve({
                            id: this.count + 1,
                            timestamp: Date.now(),
                            value: Math.floor(Math.random() * 100),
                            source: this.source
                        });
                    }
                }, 150);
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
            .batch(2);
        
        for await (const batch of processedStream) {
            console.log('  처리된 배치:', batch.map(item => 
                `${item.id}:${item.value}(${item.category})`
            ));
        }
    }
    
    await processDataStream();
}, 7000);

// 10. Promise와 Generator를 결합한 상태 관리
setTimeout(async () => {
    console.log('\n=== 7. Promise와 Generator를 결합한 상태 관리 ===');
    
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
                }, Math.random() * 200);
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
            console.log(`  액션: ${transition.action.type}`, transition.currentState);
        }
        
        console.log('  최종 상태:', machine.state);
        console.log('  상태 히스토리:', machine.history);
    }
    
    await runStateMachine();
}, 9000);

// 11. 비동기 파이프라인
setTimeout(async () => {
    console.log('\n=== 8. 비동기 파이프라인 ===');
    
    async function* dataSource() {
        for (let i = 1; i <= 20; i++) {
            await delay(50);
            yield i;
        }
    }
    
    async function* asyncFilter(source, predicate) {
        for await (const item of source) {
            if (await predicate(item)) {
                yield item;
            }
        }
    }
    
    async function* asyncMap(source, transform) {
        for await (const item of source) {
            yield await transform(item);
        }
    }
    
    async function* asyncTake(source, count) {
        let taken = 0;
        for await (const item of source) {
            if (taken >= count) break;
            yield item;
            taken++;
        }
    }
    
    // 비동기 파이프라인 구성
    const numbers = dataSource();
    
    const evenNumbers = asyncFilter(numbers, async n => {
        await delay(10);
        return n % 2 === 0;
    });
    
    const squares = asyncMap(evenNumbers, async n => {
        await delay(10);
        return n * n;
    });
    
    const firstFive = asyncTake(squares, 5);
    
    console.log('  비동기 파이프라인 결과 (1~20 → 짝수 → 제곱 → 첫 5개):');
    for await (const result of firstFive) {
        console.log(`    ${result}`);
    }
}, 11000);

// 12. 에러 처리가 포함된 AsyncIterator
setTimeout(async () => {
    console.log('\n=== 9. 에러 처리가 포함된 AsyncIterator ===');
    
    class ResilientAsyncIterator {
        constructor(items) {
            this.items = items;
            this.index = 0;
        }
        
        async next() {
            if (this.index >= this.items.length) {
                return { value: undefined, done: true };
            }
            
            const item = this.items[this.index++];
            
            try {
                const result = await this.processItem(item);
                return { value: result, done: false };
            } catch (error) {
                // 에러 발생 시 스킵하고 다음 아이템으로
                console.log(`    에러 발생: ${error.message}, 다음 아이템으로 진행`);
                return this.next(); // 재귀 호출로 다음 아이템 처리
            }
        }
        
        async processItem(item) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.3) {
                        resolve(`Processed: ${item}`);
                    } else {
                        reject(new Error(`Failed to process: ${item}`));
                    }
                }, 100);
            });
        }
    }
    
    class ResilientAsyncIterable {
        constructor(items) {
            this.items = items;
        }
        
        [Symbol.asyncIterator]() {
            return new ResilientAsyncIterator(this.items);
        }
    }
    
    async function useResilientIterator() {
        const items = ['item1', 'item2', 'item3', 'item4', 'item5'];
        const resilientIterable = new ResilientAsyncIterable(items);
        
        for await (const result of resilientIterable) {
            console.log(`    성공: ${result}`);
        }
    }
    
    await useResilientIterator();
}, 13000);

setTimeout(() => {
    console.log('\n=== 모든 예제 완료 ===');
}, 15000);