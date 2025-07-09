// ============================
// 통합 예제: 모든 개념 결합
// ============================

// 유틸리티 함수
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('=== 통합 예제: 실시간 데이터 처리 시스템 ===');

// 1. 데이터 소스 (Iterator + Generator)
class DataSource {
    constructor(name) {
        this.name = name;
        this.count = 0;
    }
    
    // Iterator 인터페이스
    [Symbol.iterator]() {
        return this;
    }
    
    next() {
        if (this.count >= 10) {
            return { value: undefined, done: true };
        }
        
        return {
            value: {
                id: this.count++,
                source: this.name,
                timestamp: Date.now(),
                value: Math.floor(Math.random() * 100)
            },
            done: false
        };
    }
    
    // Generator 버전
    *generate() {
        for (let i = 0; i < 10; i++) {
            yield {
                id: i,
                source: this.name,
                timestamp: Date.now(),
                value: Math.floor(Math.random() * 100)
            };
        }
    }
}

// 2. 비동기 데이터 처리기 (AsyncIterator + Promise)
class AsyncDataProcessor {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    
    // AsyncIterable 인터페이스
    [Symbol.asyncIterator]() {
        return this;
    }
    
    async next() {
        const item = this.dataSource.next();
        if (item.done) {
            return { value: undefined, done: true };
        }
        
        // 비동기 처리 시뮬레이션
        const processedData = await this.processData(item.value);
        return { value: processedData, done: false };
    }
    
    async processData(data) {
        // Promise를 사용한 비동기 처리
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve({
                        ...data,
                        processed: true,
                        processedAt: Date.now(),
                        category: data.value >= 70 ? 'high' : data.value >= 40 ? 'medium' : 'low'
                    });
                } else {
                    reject(new Error(`Processing failed for ${data.id}`));
                }
            }, Math.random() * 200);
        });
    }
}

// 3. 배치 처리기 (AsyncGenerator + async/await)
class BatchProcessor {
    constructor(batchSize = 3) {
        this.batchSize = batchSize;
    }
    
    async *processBatches(asyncIterable) {
        let batch = [];
        
        try {
            for await (const item of asyncIterable) {
                batch.push(item);
                
                if (batch.length >= this.batchSize) {
                    yield await this.processBatch(batch);
                    batch = [];
                }
            }
            
            // 남은 데이터 처리
            if (batch.length > 0) {
                yield await this.processBatch(batch);
            }
        } catch (error) {
            console.log(`배치 처리 중 오류: ${error.message}`);
        }
    }
    
    async processBatch(batch) {
        // 배치 내의 모든 아이템을 병렬로 처리
        const results = await Promise.allSettled(
            batch.map(item => this.enrichData(item))
        );
        
        return {
            batchId: Math.floor(Math.random() * 1000),
            processedAt: Date.now(),
            items: results.map((result, index) => ({
                original: batch[index],
                status: result.status,
                data: result.value,
                error: result.reason?.message
            }))
        };
    }
    
    async enrichData(item) {
        await delay(50);
        return {
            ...item,
            enriched: true,
            score: item.value * 1.5,
            grade: this.calculateGrade(item.value)
        };
    }
    
    calculateGrade(value) {
        if (value >= 90) return 'A';
        if (value >= 80) return 'B';
        if (value >= 70) return 'C';
        if (value >= 60) return 'D';
        return 'F';
    }
}

// 4. 결과 수집기 (Promise + async/await)
class ResultCollector {
    constructor() {
        this.results = [];
        this.statistics = {
            totalBatches: 0,
            totalItems: 0,
            successCount: 0,
            errorCount: 0,
            categories: { high: 0, medium: 0, low: 0 },
            grades: { A: 0, B: 0, C: 0, D: 0, F: 0 }
        };
    }
    
    async collect(batchGenerator) {
        for await (const batch of batchGenerator) {
            this.results.push(batch);
            this.updateStatistics(batch);
            
            console.log(`배치 ${batch.batchId} 처리 완료:`);
            batch.items.forEach(item => {
                if (item.status === 'fulfilled') {
                    console.log(`  ✓ ${item.original.id}: ${item.data.category} (${item.data.grade})`);
                } else {
                    console.log(`  ✗ ${item.original.id}: ${item.error}`);
                }
            });
        }
        
        return this.getReport();
    }
    
    updateStatistics(batch) {
        this.statistics.totalBatches++;
        this.statistics.totalItems += batch.items.length;
        
        batch.items.forEach(item => {
            if (item.status === 'fulfilled') {
                this.statistics.successCount++;
                this.statistics.categories[item.data.category]++;
                this.statistics.grades[item.data.grade]++;
            } else {
                this.statistics.errorCount++;
            }
        });
    }
    
    getReport() {
        return {
            summary: {
                totalBatches: this.statistics.totalBatches,
                totalItems: this.statistics.totalItems,
                successRate: (this.statistics.successCount / this.statistics.totalItems * 100).toFixed(2) + '%',
                errorRate: (this.statistics.errorCount / this.statistics.totalItems * 100).toFixed(2) + '%'
            },
            categories: this.statistics.categories,
            grades: this.statistics.grades,
            processingTime: Date.now()
        };
    }
}

// 5. 메인 실행 함수 (모든 개념 통합)
async function runDataProcessingSystem() {
    console.log('데이터 처리 시스템 시작...\n');
    
    // 1. 데이터 소스 생성 (Iterator/Generator)
    const dataSource = new DataSource('sensor-alpha');
    
    // 2. 비동기 처리기 생성 (AsyncIterator/Promise)
    const processor = new AsyncDataProcessor(dataSource);
    
    // 3. 배치 처리기 생성 (AsyncGenerator/async-await)
    const batchProcessor = new BatchProcessor(3);
    
    // 4. 결과 수집기 생성
    const collector = new ResultCollector();
    
    // 5. 전체 파이프라인 실행
    try {
        const report = await collector.collect(
            batchProcessor.processBatches(processor)
        );
        
        console.log('\n=== 처리 완료 보고서 ===');
        console.log('요약:', report.summary);
        console.log('카테고리별 분포:', report.categories);
        console.log('성적별 분포:', report.grades);
        
    } catch (error) {
        console.error('시스템 오류:', error.message);
    }
}

// 6. 실행
runDataProcessingSystem();

// 7. 고급 예제: 재시도 메커니즘이 있는 비동기 스트림
setTimeout(async () => {
    console.log('\n=== 고급 예제: 재시도 메커니즘 ===');
    
    class RetryableAsyncStream {
        constructor(maxRetries = 3) {
            this.maxRetries = maxRetries;
            this.retryCount = 0;
        }
        
        async *processWithRetry(operations) {
            for (const operation of operations) {
                let success = false;
                let attempts = 0;
                
                while (!success && attempts < this.maxRetries) {
                    try {
                        attempts++;
                        const result = await this.executeOperation(operation);
                        yield { operation, result, attempts, success: true };
                        success = true;
                    } catch (error) {
                        if (attempts >= this.maxRetries) {
                            yield { operation, error: error.message, attempts, success: false };
                            success = true; // 종료하기 위해
                        } else {
                            console.log(`  재시도 ${attempts}/${this.maxRetries}: ${operation.name}`);
                            await delay(100 * attempts); // 지수 백오프
                        }
                    }
                }
            }
        }
        
        async executeOperation(operation) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.6) {
                        resolve(`${operation.name} 성공`);
                    } else {
                        reject(new Error(`${operation.name} 실패`));
                    }
                }, Math.random() * 300);
            });
        }
    }
    
    const operations = [
        { name: 'DB 연결' },
        { name: 'API 호출' },
        { name: '파일 저장' },
        { name: '캐시 업데이트' },
        { name: '알림 전송' }
    ];
    
    const retryStream = new RetryableAsyncStream(3);
    
    for await (const result of retryStream.processWithRetry(operations)) {
        if (result.success) {
            console.log(`  ✓ ${result.operation.name}: ${result.result} (${result.attempts}회 시도)`);
        } else {
            console.log(`  ✗ ${result.operation.name}: ${result.error} (${result.attempts}회 시도)`);
        }
    }
}, 3000);

// 8. 실시간 모니터링 시스템
setTimeout(async () => {
    console.log('\n=== 실시간 모니터링 시스템 ===');
    
    class MonitoringSystem {
        constructor() {
            this.metrics = new Map();
            this.alerts = [];
        }
        
        // 실시간 메트릭 생성기
        async *generateMetrics() {
            for (let i = 0; i < 15; i++) {
                await delay(200);
                
                const metric = {
                    timestamp: Date.now(),
                    cpu: Math.random() * 100,
                    memory: Math.random() * 100,
                    disk: Math.random() * 100,
                    network: Math.random() * 1000
                };
                
                yield metric;
            }
        }
        
        // 메트릭 분석기
        async *analyzeMetrics(metricStream) {
            for await (const metric of metricStream) {
                const analysis = this.analyzeMetric(metric);
                
                if (analysis.alerts.length > 0) {
                    this.alerts.push(...analysis.alerts);
                }
                
                yield analysis;
            }
        }
        
        analyzeMetric(metric) {
            const alerts = [];
            
            if (metric.cpu > 80) alerts.push({ type: 'CPU', value: metric.cpu, severity: 'high' });
            if (metric.memory > 85) alerts.push({ type: 'Memory', value: metric.memory, severity: 'high' });
            if (metric.disk > 90) alerts.push({ type: 'Disk', value: metric.disk, severity: 'critical' });
            
            return {
                timestamp: metric.timestamp,
                metrics: metric,
                alerts,
                status: alerts.length === 0 ? 'healthy' : 'warning'
            };
        }
        
        // 대시보드 업데이트
        async updateDashboard() {
            const analysisStream = this.analyzeMetrics(this.generateMetrics());
            
            for await (const analysis of analysisStream) {
                this.displayMetrics(analysis);
                
                if (analysis.alerts.length > 0) {
                    this.handleAlerts(analysis.alerts);
                }
            }
            
            console.log(`\n모니터링 완료. 총 ${this.alerts.length}개 알림 생성됨`);
        }
        
        displayMetrics(analysis) {
            const status = analysis.status === 'healthy' ? '✓' : '⚠';
            console.log(`  ${status} CPU: ${analysis.metrics.cpu.toFixed(1)}%, Memory: ${analysis.metrics.memory.toFixed(1)}%, Disk: ${analysis.metrics.disk.toFixed(1)}%`);
        }
        
        handleAlerts(alerts) {
            alerts.forEach(alert => {
                const icon = alert.severity === 'critical' ? '🚨' : '⚠️';
                console.log(`    ${icon} ${alert.type} 알림: ${alert.value.toFixed(1)}%`);
            });
        }
    }
    
    const monitoring = new MonitoringSystem();
    await monitoring.updateDashboard();
}, 5000);

setTimeout(() => {
    console.log('\n=== 모든 통합 예제 완료 ===');
}, 10000);