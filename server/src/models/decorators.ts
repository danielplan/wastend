import 'reflect-metadata';

const ignoredSymbol = Symbol('dbIgnored');

export function DBIgnore() {
    return Reflect.metadata(ignoredSymbol, true);
}

export function isDBIgnored(target: any, propertyKey: string) {
    return Reflect.getMetadata(ignoredSymbol, target, propertyKey);
}

export function Table(name: string) {
    return function(constructor: Function) {
        constructor.prototype.TABLE_NAME = name;
    };
}
