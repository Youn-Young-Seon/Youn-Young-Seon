// ============================
// Iterator와 Iterable 예제
// ============================

console.log('=== 1. 기본 Iterator 구현 ===');

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

console.log('for...of 사용:');
for (const num of range) {
    console.log(`  ${num}`);
}

console.log('\n수동 반복:');
const iterator = range[Symbol.iterator]();
console.log('  next():', iterator.next());
console.log('  next():', iterator.next());
console.log('  next():', iterator.next());

console.log('\n=== 2. 고급 Iterator 예제 ===');

// 3. 무한 반복자 (주의: 무한 루프를 방지하기 위해 제한)
class InfiniteIterator {
    constructor() {
        this.current = 0;
    }
    
    next() {
        return { value: this.current++, done: false };
    }
}

class InfiniteIterable {
    [Symbol.iterator]() {
        return new InfiniteIterator();
    }
}

const infinite = new InfiniteIterable();
const infiniteIterator = infinite[Symbol.iterator]();

console.log('무한 반복자 (처음 5개만):');
for (let i = 0; i < 5; i++) {
    console.log(`  ${infiniteIterator.next().value}`);
}

console.log('\n=== 3. 실제 사용 예제: 페이지네이션 ===');

// 4. 페이지네이션 Iterator
class PaginationIterator {
    constructor(data, pageSize = 3) {
        this.data = data;
        this.pageSize = pageSize;
        this.currentPage = 0;
    }
    
    next() {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        
        if (startIndex >= this.data.length) {
            return { value: undefined, done: true };
        }
        
        const page = this.data.slice(startIndex, endIndex);
        this.currentPage++;
        
        return { 
            value: {
                page: this.currentPage,
                data: page,
                hasMore: endIndex < this.data.length
            }, 
            done: false 
        };
    }
}

class PaginatedData {
    constructor(data, pageSize = 3) {
        this.data = data;
        this.pageSize = pageSize;
    }
    
    [Symbol.iterator]() {
        return new PaginationIterator(this.data, this.pageSize);
    }
}

const users = [
    'Alice', 'Bob', 'Charlie', 'David', 'Eve', 
    'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'
];

const paginatedUsers = new PaginatedData(users, 3);

console.log('페이지네이션 결과:');
for (const page of paginatedUsers) {
    console.log(`  페이지 ${page.page}:`, page.data, `(더 있음: ${page.hasMore})`);
}

console.log('\n=== 4. 내장 Iterable 활용 ===');

// 5. 내장 Iterable들
console.log('Array:');
const arr = [1, 2, 3];
for (const item of arr) {
    console.log(`  ${item}`);
}

console.log('\nString:');
const str = 'Hello';
for (const char of str) {
    console.log(`  ${char}`);
}

console.log('\nMap:');
const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
for (const [key, value] of map) {
    console.log(`  ${key}: ${value}`);
}

console.log('\nSet:');
const set = new Set([1, 2, 3, 3, 2, 1]);
for (const value of set) {
    console.log(`  ${value}`);
}

console.log('\n=== 5. 커스텀 Iterator 실용 예제 ===');

// 6. 파일 경로 반복자 (시뮬레이션)
class FileSystemIterator {
    constructor(paths) {
        this.paths = paths;
        this.index = 0;
    }
    
    next() {
        if (this.index >= this.paths.length) {
            return { value: undefined, done: true };
        }
        
        const path = this.paths[this.index++];
        const pathParts = path.split('/');
        const filename = pathParts[pathParts.length - 1];
        const directory = pathParts.slice(0, -1).join('/');
        const extension = filename.split('.').pop();
        
        return {
            value: {
                fullPath: path,
                directory,
                filename,
                extension,
                isDirectory: !filename.includes('.')
            },
            done: false
        };
    }
}

class FileSystem {
    constructor(paths) {
        this.paths = paths;
    }
    
    [Symbol.iterator]() {
        return new FileSystemIterator(this.paths);
    }
}

const filePaths = [
    '/home/user/documents/file1.txt',
    '/home/user/documents/subfolder',
    '/home/user/images/photo.jpg',
    '/home/user/scripts/script.js'
];

const fileSystem = new FileSystem(filePaths);

console.log('파일 시스템 반복:');
for (const file of fileSystem) {
    console.log(`  ${file.filename} (${file.extension}) in ${file.directory}`);
    console.log(`    디렉토리: ${file.isDirectory}`);
}

console.log('\n=== 완료 ===');