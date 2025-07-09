// ============================
// Generator 예제
// ============================

console.log('=== 1. 기본 Generator 함수 ===');

// 1. 기본 Generator 함수
function* simpleGenerator() {
    console.log('  Generator 시작');
    yield 1;
    console.log('  첫 번째 yield 이후');
    yield 2;
    console.log('  두 번째 yield 이후');
    yield 3;
    console.log('  Generator 끝');
}

const gen = simpleGenerator();
console.log('gen.next():', gen.next());
console.log('gen.next():', gen.next());
console.log('gen.next():', gen.next());
console.log('gen.next():', gen.next());

console.log('\n=== 2. 무한 시퀀스 Generator ===');

// 2. 무한 시퀀스 Generator
function* infiniteSequence() {
    let i = 0;
    while (true) {
        yield i++;
    }
}

const infinite = infiniteSequence();
console.log('무한 시퀀스 (처음 5개만):');
for (let i = 0; i < 5; i++) {
    console.log(`  ${infinite.next().value}`);
}

console.log('\n=== 3. 피보나치 수열 Generator ===');

// 3. 피보나치 수열 Generator
function* fibonacci() {
    let [prev, curr] = [0, 1];
    while (true) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}

const fib = fibonacci();
console.log('피보나치 수열 (처음 10개):');
for (let i = 0; i < 10; i++) {
    console.log(`  ${fib.next().value}`);
}

console.log('\n=== 4. yield* 사용 (Generator 위임) ===');

// 4. yield* 사용 (다른 Generator 위임)
function* generator1() {
    yield 'A';
    yield 'B';
}

function* generator2() {
    yield 'C';
    yield 'D';
}

function* combinedGenerator() {
    yield* generator1();
    yield* generator2();
    yield 'E';
}

const combined = combinedGenerator();
console.log('결합된 Generator:');
console.log('  결과:', [...combined]);

console.log('\n=== 5. Generator에 값 전달 ===');

// 5. Generator에 값 전달
function* generatorWithInput() {
    console.log('  Generator 시작');
    const input1 = yield 'First yield';
    console.log(`  받은 값: ${input1}`);
    
    const input2 = yield 'Second yield';
    console.log(`  받은 값: ${input2}`);
    
    return 'Done';
}

const genInput = generatorWithInput();
console.log('첫 번째 next():', genInput.next());
console.log('두 번째 next(값 전달):', genInput.next('Hello'));
console.log('세 번째 next(값 전달):', genInput.next('World'));

console.log('\n=== 6. 실제 사용 예제: 랜덤 데이터 생성기 ===');

// 6. 랜덤 데이터 생성기
function* randomDataGenerator() {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR'];
    
    let id = 1;
    while (true) {
        yield {
            id: id++,
            name: names[Math.floor(Math.random() * names.length)],
            department: departments[Math.floor(Math.random() * departments.length)],
            salary: Math.floor(Math.random() * 50000) + 30000,
            timestamp: new Date().toISOString()
        };
    }
}

const randomData = randomDataGenerator();
console.log('랜덤 데이터 생성 (5개):');
for (let i = 0; i < 5; i++) {
    const employee = randomData.next().value;
    console.log(`  ${employee.id}: ${employee.name} (${employee.department}) - $${employee.salary}`);
}

console.log('\n=== 7. 상태 기반 Generator ===');

// 7. 상태 기반 Generator
function* stateMachine() {
    let state = 'idle';
    let data = null;
    
    while (true) {
        switch (state) {
            case 'idle':
                console.log('  상태: 대기 중');
                const command = yield '대기 중 - 명령을 입력하세요';
                if (command === 'start') {
                    state = 'running';
                } else if (command === 'load') {
                    state = 'loading';
                }
                break;
                
            case 'loading':
                console.log('  상태: 로딩 중');
                data = yield '로딩 중 - 데이터를 준비하고 있습니다';
                state = 'loaded';
                break;
                
            case 'loaded':
                console.log('  상태: 로딩 완료');
                yield `로딩 완료 - 데이터: ${data}`;
                state = 'idle';
                break;
                
            case 'running':
                console.log('  상태: 실행 중');
                const result = yield '실행 중 - 작업을 수행하고 있습니다';
                console.log(`  작업 결과: ${result}`);
                state = 'idle';
                break;
        }
    }
}

const machine = stateMachine();
console.log('상태 머신 예제:');
console.log('1.', machine.next());
console.log('2.', machine.next('load'));
console.log('3.', machine.next('some data'));
console.log('4.', machine.next('start'));
console.log('5.', machine.next('completed'));

console.log('\n=== 8. Generator를 이용한 파이프라인 ===');

// 8. Generator를 이용한 데이터 처리 파이프라인
function* numberSource() {
    for (let i = 1; i <= 10; i++) {
        yield i;
    }
}

function* filter(source, predicate) {
    for (const item of source) {
        if (predicate(item)) {
            yield item;
        }
    }
}

function* map(source, transform) {
    for (const item of source) {
        yield transform(item);
    }
}

function* take(source, count) {
    let taken = 0;
    for (const item of source) {
        if (taken >= count) break;
        yield item;
        taken++;
    }
}

// 파이프라인 구성
const numbers = numberSource();
const evenNumbers = filter(numbers, n => n % 2 === 0);
const squares = map(evenNumbers, n => n * n);
const firstThree = take(squares, 3);

console.log('데이터 처리 파이프라인:');
console.log('  1~10 → 짝수만 → 제곱 → 처음 3개');
console.log('  결과:', [...firstThree]);

console.log('\n=== 9. 제어 흐름 Generator ===');

// 9. 제어 흐름을 위한 Generator
function* taskRunner() {
    console.log('  작업 1 시작');
    yield 'Task 1 completed';
    
    console.log('  작업 2 시작');
    yield 'Task 2 completed';
    
    console.log('  작업 3 시작');
    yield 'Task 3 completed';
    
    console.log('  모든 작업 완료');
    return 'All tasks done';
}

function runTasks(generator) {
    const gen = generator();
    let result = gen.next();
    
    while (!result.done) {
        console.log(`  → ${result.value}`);
        result = gen.next();
    }
    
    console.log(`  최종 결과: ${result.value}`);
}

console.log('순차 작업 실행:');
runTasks(taskRunner);

console.log('\n=== 10. 메모리 효율적인 대용량 데이터 처리 ===');

// 10. 메모리 효율적인 대용량 데이터 처리
function* generateLargeDataset() {
    console.log('  대용량 데이터셋 시뮬레이션');
    for (let i = 0; i < 1000000; i++) {
        // 실제로는 파일이나 DB에서 한 번에 하나씩 읽는다고 가정
        yield {
            id: i,
            value: Math.random(),
            category: i % 3 === 0 ? 'A' : i % 3 === 1 ? 'B' : 'C'
        };
    }
}

function* processLargeData(dataGenerator) {
    let processed = 0;
    let sum = 0;
    
    for (const item of dataGenerator) {
        sum += item.value;
        processed++;
        
        if (processed % 100000 === 0) {
            yield {
                processed,
                averageSoFar: sum / processed,
                memoryUsage: '낮음' // Generator 덕분에 메모리 사용량이 낮음
            };
        }
    }
    
    return {
        totalProcessed: processed,
        finalAverage: sum / processed
    };
}

const largeData = generateLargeDataset();
const processor = processLargeData(largeData);

console.log('대용량 데이터 처리 (진행 상황):');
let processingResult = processor.next();
let progressCount = 0;

while (!processingResult.done && progressCount < 5) {
    console.log(`  진행률: ${processingResult.value.processed}개 처리됨`);
    console.log(`  평균: ${processingResult.value.averageSoFar.toFixed(4)}`);
    console.log(`  메모리 사용량: ${processingResult.value.memoryUsage}`);
    
    processingResult = processor.next();
    progressCount++;
}

console.log('\n=== 완료 ===');