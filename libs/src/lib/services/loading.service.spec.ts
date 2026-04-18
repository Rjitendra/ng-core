import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should show and hide a spinner by key', () => {
    service.show({ key: 'users', label: 'Loading users' });

    expect(service.isLoading()).toBe(true);
    expect(service.primarySpinner()?.key).toBe('users');

    service.hide('users');

    expect(service.isLoading()).toBe(false);
    expect(service.primarySpinner()).toBeNull();
  });

  it('should track concurrent requests with the same key', () => {
    service.show({ key: 'users' });
    service.show({ key: 'users' });

    service.hide('users');
    expect(service.isLoading()).toBe(true);

    service.hide('users');
    expect(service.isLoading()).toBe(false);
  });
});
