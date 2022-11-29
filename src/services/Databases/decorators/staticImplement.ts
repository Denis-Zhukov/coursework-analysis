export function staticImplement<T>() {
    return <U extends T>(constructor: U) => {constructor}
}