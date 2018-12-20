import { Observable, Subject } from 'rxjs';
import { ajax }                from 'rxjs/ajax';

export interface Paged<T> {
    items: T[];
    total: number;
    query: {
        pager: {
            limit: number;
            offset: number;
        }
    }
}

export interface Api<T, C, U> {
    findOne(id: string): Observable<T>;
    findMany(query: string | null): Observable<Paged<T>>;
    create(payload: C): Observable<T>;
    update(id: string, payload: U): Observable<T>;
    delete(id: string): Observable<void>;
}

export function api<T, C = Partial<T>, U = Partial<T>>(
    prefix: string,
    mapper?: (v: any) => T
): Api<T, C, U> {
    return {
        findOne(id: string): Observable<T> {
            const result = new Subject<T>();
            ajax.get(`${prefix}/${encodeURI(id)}`).subscribe(next => {
                if (next.status >= 400) {
                    result.error({
                        code: next.status,
                        data: next.response,
                    });
                    return;
                }
                result.next(mapper ? mapper(next.response) : next.response as T);
            }, error => {
                result.error({
                    code: 500,
                    data: error,
                });
            });
            return result.asObservable();
        },
        findMany(query: string | null): Observable<Paged<T>> {
            const result = new Subject<Paged<T>>();
            ajax.get(`${prefix}?query=${encodeURI(query || '')}`).subscribe(next => {
                if (next.status >= 400) {
                    result.error({
                        code: next.status,
                        data: next.response,
                    });
                    return;
                }
                const r = (next.response || {}) as Paged<any>;
                result.next({
                    ...r,
                    items: mapper ? (r.items || []).map(mapper) : (r.items || []) as T[],
                });
            }, error => {
                result.error({
                    code: 500,
                    data: error,
                });
            });
            return result.asObservable();
        },
        create(payload: C): Observable<T> {
            const result = new Subject<T>();
            ajax.post(
                `${prefix}`,
                JSON.stringify(payload),
                {'Content-Type': 'application/json'}
            ).subscribe(next => {
                    if (next.status >= 400) {
                        result.error({
                            code: next.status,
                            data: next.response,
                        });
                        return
                    }
                    result.next(mapper ? mapper(next.response) : next.response as T);
                },
                error => {
                    result.error({
                        code: 500,
                        data: error,
                    });
                });
            return result.asObservable();
        },
        update(id: string, payload: U): Observable<T> {
            const result = new Subject<T>();
            ajax.put(
                `${prefix}/${encodeURI(id)}`,
                JSON.stringify(payload),
                {'Content-Type': 'application/json'}
            ).subscribe(next => {
                    if (next.status >= 400) {
                        result.error({
                            code: next.status,
                            data: next.response,
                        });
                        return;
                    }
                    result.next(mapper ? mapper(next.response) : next.response as T);
                },
                error => {
                    result.error({
                        code: 500,
                        data: error,
                    });
                });
            return result.asObservable();
        },
        delete(id: string): Observable<void> {
            const result = new Subject<void>();
            ajax.delete(`${prefix}/${encodeURI(id)}`).subscribe(
                next => {
                    if (next.status >= 400) {
                        result.error({
                            code: next.status,
                            data: next.response,
                        });
                        return;
                    }
                    result.next();
                }
            );
            return result.asObservable();
        }
    }
}

