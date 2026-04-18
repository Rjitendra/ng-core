import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  ApiError,
  ApiService,
  provideApiClient,
} from './api.service';
import { LoadingService } from './loading.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideApiClient({
          baseUrl: 'https://api.example.com',
          defaultHeaders: {
            'x-client': 'shared-lib',
          },
        }),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(LoadingService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a GET request with query params and default headers', () => {
    const response = { id: 1, name: 'Angular' };

    service
      .get<typeof response>('/projects', {
        params: {
          page: 1,
          tags: ['ui', 'core'],
        },
      })
      .subscribe((result) => {
        expect(result).toEqual(response);
      });

    const req = httpMock.expectOne(
      'https://api.example.com/projects?page=1&tags=ui&tags=core'
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('x-client')).toBe('shared-lib');
    req.flush(response);
  });

  it('should send body data for post patch and delete requests', () => {
    service.post('/projects', { name: 'Shared' }).subscribe();
    service.patch('/projects/1', { active: true }).subscribe();
    service.delete('/projects/1', { body: { hardDelete: true } }).subscribe();

    const postReq = httpMock.expectOne('https://api.example.com/projects');
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body).toEqual({ name: 'Shared' });
    postReq.flush({});

    const patchReq = httpMock.expectOne((request) =>
      request.method === 'PATCH' &&
      request.url === 'https://api.example.com/projects/1'
    );
    expect(patchReq.request.method).toBe('PATCH');
    expect(patchReq.request.body).toEqual({ active: true });
    patchReq.flush({});

    const deleteReq = httpMock.expectOne((request) =>
      request.method === 'DELETE' &&
      request.url === 'https://api.example.com/projects/1'
    );
    expect(deleteReq.request.method).toBe('DELETE');
    expect(deleteReq.request.body).toEqual({ hardDelete: true });
    deleteReq.flush({});
  });

  it('should expose normalized api errors and call custom handlers', () => {
    const localHandler = vi.fn();
    const errors: ApiError[] = [];

    service
      .get('/secure-data', {
        onError: ({ error }) => localHandler(error),
        mapError: (error) => ({
          ...error,
          message: 'Mapped locally',
        }),
      })
      .subscribe({
        error: (error: ApiError) => errors.push(error),
      });

    const req = httpMock.expectOne('https://api.example.com/secure-data');
    req.flush(
      {
        message: 'Access denied',
        code: 'AUTH_403',
      },
      {
        status: 403,
        statusText: 'Forbidden',
      }
    );

    expect(localHandler).toHaveBeenCalled();
    expect(errors[0]).toMatchObject({
      message: 'Mapped locally',
      status: 403,
      statusText: 'Forbidden',
      code: 'AUTH_403',
      method: 'GET',
    });
  });

  it('should show and hide a customizable spinner around the request lifecycle', () => {
    service.get('/projects', {
      spinner: {
        key: 'projects',
        label: 'Loading projects',
        variant: 'dots',
        color: 'success',
      },
    }).subscribe();

    expect(loadingService.isLoading()).toBe(true);
    expect(loadingService.primarySpinner()).toMatchObject({
      key: 'projects',
      label: 'Loading projects',
      variant: 'dots',
      color: 'success',
    });

    const req = httpMock.expectOne('https://api.example.com/projects');
    req.flush([]);

    expect(loadingService.isLoading()).toBe(false);
  });
});
