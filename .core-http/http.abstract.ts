import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "environments/environment";

/**
 * This will be removed in the upcoming versions
 */
export type TRest = "symphony" | "jvm";

@Injectable({ providedIn: 'root' })
export abstract class EaHttpAbstract {
    // env
    readonly #_url = environment.url_api;
    readonly #_urlJvm = environment.url_api_jvm;

    // injections
    #_http = inject(HttpClient);

    get<T> (endPoint: string, params: HttpParams = new HttpParams(), restType?: TRest): Observable<T> {
        return this.#_http.get<T>(`${this.#_getRestPrefix(restType)}${endPoint}`, {
            headers: this._getHeaders(),
            params,
        });
    }

    post<T, D> (endPoint: string, data?: D, restType?: TRest): Observable<T> {
        return this.#_http.post<T>(
            `${this.#_getRestPrefix(restType)}${endPoint}`,
            this._getParams(data),
            {
                withCredentials: true,
                responseType: "json",
            }
        );
    }

    put<T, D> (endPoint: string, data: D, restType?: TRest): Observable<T> {
        return this.#_http.put<T>(`${this.#_getRestPrefix(restType)}${endPoint}`, JSON.stringify(data), {
            headers: this._getHeaders(),
            params: this._getParams(data),
        });
    }

    delete<T, D> (endPoint: string, data: D, restType?: TRest): Observable<T> {
        return this.#_http.delete<T>(`${this.#_getRestPrefix(restType)}${endPoint}`, {
            headers: this._getHeaders(),
            params: this._getParams(data),
        });
    }

    private _getHeaders (): HttpHeaders {
        const headersConfig = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };

        return new HttpHeaders(headersConfig);
    }

    private _getParams<D> (data: D): HttpParams {
        let params = new HttpParams();

        Object.keys(data).forEach(
            (key) => {
                if (!!data[key] || data[key] === false)
                { // falsy should not be ignored
                    params = params.append(`${key}`, `${data[key]}`); // `` => string
                }
            }
        );

        return params;
    }

    #_getRestPrefix(_direction: TRest): string {
        return !(!!_direction) ? this.#_url : _direction === "symphony" ? this.#_url : this.#_urlJvm;
    }
}
