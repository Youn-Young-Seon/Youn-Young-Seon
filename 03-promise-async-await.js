// ============================
// Promise와 Async/Await 예제
// ============================

console.log('=== 1. 기본 Promise 사용 ===');

// 1. 기본 Promise 생성
function createBasicPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.3;
            if (success) {
                resolve('성공!');
            } else {
                reject(new Error('실패!'));
            }
        }, 1000);
    });
}

// Promise 사용
createBasicPromise()
    .then(result => console.log('  Result:', result))
    .catch(error => console.log('  Error:', error.message));

console.log('  Promise 실행 중...');

// 2. Promise 체이닝
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchUserData(id) {
    return delay(200).then(() => {
        return { id, name: `User ${id}`, email: `user${id}@example.com` };
    });
}

function fetchUserPosts(userId) {
    return delay(150).then(() => {
        return [
            { id: 1, title: 'Post 1', userId },
            { id: 2, title: 'Post 2', userId }
        ];
    });
}

setTimeout(() => {
    console.log('\n=== 2. Promise 체이닝 ===');
    
    fetchUserData(1)
        .then(user => {
            console.log('  User:', user);
            return fetchUserPosts(user.id);
        })
        .then(posts => {
            console.log('  Posts:', posts);
        })
        .catch(error => {
            console.log('  Error:', error);
        });
}, 1200);

// 3. Promise.all 예제
setTimeout(() => {
    console.log('\n=== 3. Promise.all - 모든 Promise가 성공해야 함 ===');
    
    const promise1 = Promise.resolve(3);
    const promise2 = delay(500).then(() => 'foo');
    const promise3 = Promise.resolve(42);
    
    Promise.all([promise1, promise2, promise3])
        .then(values => console.log('  All values:', values))
        .catch(error => console.log('  Error:', error));
}, 1500);

// 4. Promise.allSettled 예제
setTimeout(() => {
    console.log('\n=== 4. Promise.allSettled - 모든 Promise의 결과를 기다림 ===');
    
    const promises = [
        Promise.resolve('성공'),
        Promise.reject('실패'),
        Promise.resolve('또 성공')
    ];
    
    Promise.allSettled(promises)
        .then(results => {
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    console.log(`  Promise ${index}: ${result.value}`);
                } else {
                    console.log(`  Promise ${index}: ${result.reason}`);
                }
            });
        });
}, 2200);

// 5. Promise.race 예제
setTimeout(() => {
    console.log('\n=== 5. Promise.race - 가장 빨리 완료되는 Promise ===');
    
    const slowPromise = delay(1000).then(() => 'slow');
    const fastPromise = delay(300).then(() => 'fast');
    
    Promise.race([slowPromise, fastPromise])
        .then(result => console.log('  Winner:', result));
}, 2500);

// 6. 기본 async/await 사용
setTimeout(async () => {
    console.log('\n=== 6. 기본 async/await 사용 ===');
    
    async function fetchData() {
        try {
            console.log('  데이터 가져오기 시작');
            const response = await delay(500).then(() => '데이터 가져오기 완료');
            console.log('  Response:', response);
            return response;
        } catch (error) {
            console.log('  오류 발생:', error);
            throw error;
        }
    }
    
    await fetchData();
}, 3000);

// 7. 순차적 비동기 처리
setTimeout(async () => {
    console.log('\n=== 7. 순차적 비동기 처리 ===');
    
    async function sequentialAsync() {
        console.log('  시작');
        
        const result1 = await delay(300).then(() => '첫 번째 결과');
        console.log('  1:', result1);
        
        const result2 = await delay(300).then(() => '두 번째 결과');
        console.log('  2:', result2);
        
        const result3 = await delay(300).then(() => '세 번째 결과');
        console.log('  3:', result3);
        
        return [result1, result2, result3];
    }
    
    const results = await sequentialAsync();
    console.log('  최종 결과:', results);
}, 3800);

// 8. 병렬 비동기 처리
setTimeout(async () => {
    console.log('\n=== 8. 병렬 비동기 처리 ===');
    
    async function parallelAsync() {
        console.log('  병렬 처리 시작');
        
        const promise1 = delay(400).then(() => '병렬 결과 1');
        const promise2 = delay(400).then(() => '병렬 결과 2');
        const promise3 = delay(400).then(() => '병렬 결과 3');
        
        const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);
        console.log('  병렬 결과:', result1, result2, result3);
        
        return [result1, result2, result3];
    }
    
    await parallelAsync();
}, 5000);

// 9. API 호출 시뮬레이션
class APIClient {
    async get(url) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.2) {
                    resolve({ data: `Data from ${url}`, status: 200 });
                } else {
                    reject(new Error('Network error'));
                }
            }, Math.random() * 500);
        });
    }
}

setTimeout(async () => {
    console.log('\n=== 9. API 호출 시뮬레이션 ===');
    
    const client = new APIClient();
    
    async function fetchUserProfile(userId) {
        try {
            console.log(`  사용자 ${userId} 프로필 가져오기 시작`);
            
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
            console.log('  프로필 가져오기 실패:', error.message);
            throw error;
        }
    }
    
    try {
        const profile = await fetchUserProfile(1);
        console.log('  프로필 성공:', profile);
    } catch (error) {
        console.log('  프로필 실패:', error.message);
    }
}, 5700);

// 10. 재시도 로직이 있는 async 함수
setTimeout(async () => {
    console.log('\n=== 10. 재시도 로직이 있는 async 함수 ===');
    
    async function unreliableOperation() {
        if (Math.random() > 0.7) {
            return '성공!';
        } else {
            throw new Error('임시 오류');
        }
    }
    
    async function retryAsync(fn, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                console.log(`  재시도 ${i + 1}/${maxRetries}: ${error.message}`);
                await delay(200 * (i + 1)); // 지수 백오프
            }
        }
    }
    
    try {
        const result = await retryAsync(unreliableOperation);
        console.log('  최종 성공:', result);
    } catch (error) {
        console.log('  최종 실패:', error.message);
    }
}, 6500);

// 11. 타임아웃이 있는 Promise
setTimeout(async () => {
    console.log('\n=== 11. 타임아웃이 있는 Promise ===');
    
    function timeout(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), ms);
        });
    }
    
    async function withTimeout(promise, ms) {
        return Promise.race([promise, timeout(ms)]);
    }
    
    async function slowOperation() {
        await delay(2000);
        return '느린 작업 완료';
    }
    
    try {
        const result = await withTimeout(slowOperation(), 1000);
        console.log('  결과:', result);
    } catch (error) {
        console.log('  타임아웃 발생:', error.message);
    }
}, 7200);

// 12. 복잡한 비동기 워크플로우
setTimeout(async () => {
    console.log('\n=== 12. 복잡한 비동기 워크플로우 ===');
    
    async function complexWorkflow() {
        console.log('  1. 초기 설정');
        await delay(200);
        
        console.log('  2. 사용자 인증');
        const user = await delay(300).then(() => ({ id: 1, name: 'John' }));
        
        console.log('  3. 권한 확인');
        const permissions = await delay(200).then(() => ['read', 'write']);
        
        console.log('  4. 데이터 로딩 (병렬)');
        const [config, data, metadata] = await Promise.all([
            delay(400).then(() => ({ theme: 'dark', lang: 'ko' })),
            delay(350).then(() => [1, 2, 3, 4, 5]),
            delay(300).then(() => ({ version: '1.0', updated: new Date() }))
        ]);
        
        console.log('  5. 데이터 처리');
        const processedData = await delay(250).then(() => {
            return data.map(x => x * 2);
        });
        
        console.log('  6. 결과 반환');
        return {
            user,
            permissions,
            config,
            processedData,
            metadata
        };
    }
    
    try {
        const result = await complexWorkflow();
        console.log('  워크플로우 완료:', result);
    } catch (error) {
        console.log('  워크플로우 실패:', error.message);
    }
}, 8000);

// 13. 에러 전파와 처리
setTimeout(async () => {
    console.log('\n=== 13. 에러 전파와 처리 ===');
    
    class CustomError extends Error {
        constructor(message, code) {
            super(message);
            this.code = code;
        }
    }
    
    async function step1() {
        console.log('  Step 1 실행');
        await delay(100);
        return 'Step 1 완료';
    }
    
    async function step2() {
        console.log('  Step 2 실행');
        await delay(100);
        throw new CustomError('Step 2에서 오류 발생', 'STEP2_ERROR');
    }
    
    async function step3() {
        console.log('  Step 3 실행');
        await delay(100);
        return 'Step 3 완료';
    }
    
    async function runSteps() {
        try {
            const result1 = await step1();
            console.log('  →', result1);
            
            const result2 = await step2();
            console.log('  →', result2);
            
            const result3 = await step3();
            console.log('  →', result3);
            
            return 'All steps completed';
        } catch (error) {
            console.log('  에러 감지:', error.message);
            if (error.code === 'STEP2_ERROR') {
                console.log('  Step 2 에러 처리 중...');
                // 복구 로직
                return 'Recovered from Step 2 error';
            }
            throw error;
        }
    }
    
    try {
        const result = await runSteps();
        console.log('  최종 결과:', result);
    } catch (error) {
        console.log('  처리되지 않은 에러:', error.message);
    }
}, 9500);

// 14. Promise와 Generator 결합
setTimeout(async () => {
    console.log('\n=== 14. Promise와 Generator 결합 ===');
    
    function* taskGenerator() {
        console.log('  태스크 1 시작');
        yield delay(300).then(() => 'Task 1 완료');
        
        console.log('  태스크 2 시작');
        yield delay(200).then(() => 'Task 2 완료');
        
        console.log('  태스크 3 시작');
        yield delay(400).then(() => 'Task 3 완료');
    }
    
    async function runGeneratorTasks() {
        const generator = taskGenerator();
        const results = [];
        
        let current = generator.next();
        while (!current.done) {
            const result = await current.value;
            console.log('  →', result);
            results.push(result);
            current = generator.next();
        }
        
        return results;
    }
    
    const results = await runGeneratorTasks();
    console.log('  모든 태스크 완료:', results);
}, 10500);

setTimeout(() => {
    console.log('\n=== 모든 예제 완료 ===');
}, 12000);