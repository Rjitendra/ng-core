import {
  EnvironmentProviders,
  Injectable,
  InjectionToken,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  provideHttpClient,
} from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { LoadingService, LoadingSpinnerOptions } from './loading.service';

export type ApiPrimitive = string | number | boolean;
export type ApiParamValue = ApiPrimitive | readonly ApiPrimitive[] | null | undefined;
export type ApiQueryParams = Record<string, ApiParamValue>;
export type ApiHeaders = Record<string, string | number | boolean>;
export type ApiResponseType = 'json' | 'text' | 'blob' | 'arraybuffer';
export type ApiObserve = 'body' | 'response' | 'events';
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface ApiError {
  message: string;
  status: number;
  statusText: string;
  url: string | null;
  method: string;
  code?: string;
  details?: unknown;
  originalError: unknown;
}

export interface ApiErrorContext {
  error: ApiError;
  request: ResolvedApiRequestOptions;
}

export interface ApiRequestOptions {
  baseUrl?: string;
  endpoint?: string;
  params?: ApiQueryParams;
  headers?: ApiHeaders | HttpHeaders;
  context?: HttpContext;
  withCredentials?: boolean;
  observe?: ApiObserve;
  responseType?: ApiResponseType;
  reportProgress?: boolean;
  timeoutMs?: number;
  spinner?: boolean | LoadingSpinnerOptions;
  suppressGlobalErrorHandler?: boolean;
  mapError?: (error: ApiError) => ApiError;
  onError?: (context: ApiErrorContext) => void;
}

export interface ApiBodyRequestOptions<TBody> extends ApiRequestOptions {
  body?: TBody;
}

export interface ApiClientConfig {
  baseUrl?: string;
  defaultHeaders?: ApiHeaders;
  withCredentials?: boolean;
  timeoutMs?: number;
  spinner?: boolean | LoadingSpinnerOptions;
  errorMessageResolver?: (error: HttpErrorResponse) => string;
  errorMapper?: (error: ApiError) => ApiError;
  errorHandler?: (context: ApiErrorContext) => void;
}

export interface ResolvedApiRequestOptions extends ApiRequestOptions {
  url: string;
  method: ApiMethod;
}

export const API_CLIENT_CONFIG = new InjectionToken<ApiClientConfig>(
  'API_CLIENT_CONFIG'
);

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CLIENT_CONFIG, { optional: true });
  private readonly loadingService = inject(LoadingService);

  get<TResponse>(endpoint: string, options?: ApiRequestOptions): Observable<TResponse> {
    return this.request<TResponse>('GET', endpoint, options);
  }

  post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: ApiBodyRequestOptions<TBody>
  ): Observable<TResponse> {
    return this.request<TResponse>('POST', endpoint, { ...options, body });
  }

  put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: ApiBodyRequestOptions<TBody>
  ): Observable<TResponse> {
    return this.request<TResponse>('PUT', endpoint, { ...options, body });
  }

  patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: ApiBodyRequestOptions<TBody>
  ): Observable<TResponse> {
    return this.request<TResponse>('PATCH', endpoint, { ...options, body });
  }

  delete<TResponse>(
    endpoint: string,
    options?: ApiBodyRequestOptions<unknown>
  ): Observable<TResponse> {
    return this.request<TResponse>('DELETE', endpoint, options);
  }

  request<TResponse>(
    method: ApiMethod,
    endpoint: string,
    options: ApiBodyRequestOptions<unknown> = {}
  ): Observable<TResponse> {
    const request = this.resolveRequestOptions(method, endpoint, options);
    const spinnerKey = this.showSpinner(request.spinner);

    let stream = this.http.request<TResponse>(method, request.url, {
      body: options.body,
      params: this.buildParams(request.params),
      headers: this.buildHeaders(request.headers),
      context: request.context,
      withCredentials: request.withCredentials,
      observe: request.observe ?? 'body',
      responseType: request.responseType ?? 'json',
      reportProgress: request.reportProgress,
    } as never);

    if (request.timeoutMs) {
      stream = stream.pipe(timeout(request.timeoutMs));
    }

    return stream.pipe(
      catchError((error) => this.handleError(error, request)),
      finalize(() => {
        if (spinnerKey) {
          this.loadingService.hide(spinnerKey);
        }
      })
    ) as Observable<TResponse>;
  }

  private resolveRequestOptions(
    method: ApiMethod,
    endpoint: string,
    options: ApiBodyRequestOptions<unknown>
  ): ResolvedApiRequestOptions {
    const baseUrl = options.baseUrl ?? this.config?.baseUrl ?? '';
    const normalizedEndpoint = options.endpoint ?? endpoint;

    return {
      ...options,
      method,
      endpoint: normalizedEndpoint,
      url: this.createUrl(baseUrl, normalizedEndpoint),
      headers:
        options.headers instanceof HttpHeaders
          ? options.headers
          : {
              ...(this.config?.defaultHeaders ?? {}),
              ...(options.headers ?? {}),
            },
      withCredentials:
        options.withCredentials ?? this.config?.withCredentials ?? false,
      timeoutMs: options.timeoutMs ?? this.config?.timeoutMs,
      spinner: options.spinner ?? this.config?.spinner ?? false,
    };
  }

  private showSpinner(spinner: boolean | LoadingSpinnerOptions | undefined) {
    if (!spinner) {
      return null;
    }

    return this.loadingService.show(
      typeof spinner === 'boolean' ? {} : spinner
    );
  }

  private createUrl(baseUrl: string, endpoint: string) {
    if (!baseUrl) {
      return endpoint;
    }

    const trimmedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const trimmedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${trimmedBaseUrl}/${trimmedEndpoint}`;
  }

  private buildHeaders(headers?: ApiHeaders | HttpHeaders) {
    if (!headers) {
      return undefined;
    }

    if (headers instanceof HttpHeaders) {
      return headers;
    }

    let httpHeaders = new HttpHeaders();
    for (const [key, value] of Object.entries(headers)) {
      httpHeaders = httpHeaders.set(key, String(value));
    }

    return httpHeaders;
  }

  private buildParams(params?: ApiQueryParams) {
    if (!params) {
      return undefined;
    }

    let httpParams = new HttpParams();

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          httpParams = httpParams.append(key, String(item));
        }
        continue;
      }

      httpParams = httpParams.set(key, String(value));
    }

    return httpParams;
  }

  private handleError(error: unknown, request: ResolvedApiRequestOptions) {
    const mappedError = this.mapToApiError(error, request);
    const finalError = request.mapError?.(mappedError) ?? this.config?.errorMapper?.(mappedError) ?? mappedError;

    const context: ApiErrorContext = {
      error: finalError,
      request,
    };

    request.onError?.(context);

    if (!request.suppressGlobalErrorHandler) {
      this.config?.errorHandler?.(context);
    }

    return throwError(() => finalError);
  }

  private mapToApiError(error: unknown, request: ResolvedApiRequestOptions): ApiError {
    if (error instanceof TimeoutError) {
      return {
        message: `Request timed out after ${request.timeoutMs}ms.`,
        status: 0,
        statusText: 'Timeout',
        url: request.url,
        method: request.method,
        code: 'REQUEST_TIMEOUT',
        details: null,
        originalError: error,
      };
    }

    if (error instanceof HttpErrorResponse) {
      return {
        message:
          this.config?.errorMessageResolver?.(error) ??
          error.error?.message ??
          error.message ??
          'Something went wrong while calling the API.',
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        method: request.method,
        code: typeof error.error?.code === 'string' ? error.error.code : undefined,
        details: error.error,
        originalError: error,
      };
    }

    return {
      message: 'An unexpected error occurred while processing the API request.',
      status: 0,
      statusText: 'Unknown Error',
      url: request.url,
      method: request.method,
      details: null,
      originalError: error,
    };
  }
}

export function provideApiClient(config?: ApiClientConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(),
    {
      provide: API_CLIENT_CONFIG,
      useValue: config ?? {},
    },
  ]);
}
