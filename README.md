# http-utils

This is a package to abstract all boilerplate configurations for a production http client library. Axios is used as base provider

## Configuration / Initialization

```ts
import { HttpClient } from '.';
export const Http = HttpClient.getOrCreateInstance<'LEGACY_API' | 'ANOTHER_API' | 'PUBLIC'>();

Http.register('LEGACY_API', {
  baseURL: 'http://legacy.company.com/api/v1',
  getToken: () return localStorage.getItem('token') ?? "",
  beforeRedirect(options, responseDetails) {
    console.log(options, responseDetails);
  },
  onSessionExpired(error) {
    console.log(error);
  },
  onUnauthorized(error) {
    console.log(error);
  },
});

Http.register('ANOTHER_API', {
  baseURL: 'http://another.company.com/api/v1',
  getToken: () return process.env.ACCESS_TOKEN ?? "",
  beforeRedirect(options, responseDetails) {
    console.log(options, responseDetails);
  },
  onSessionExpired(error) {
    console.log(error);
  },
  onUnauthorized(error) {
    console.log(error);
  },
});
```

## Basic Usage

```TypeScript
Http.getInstance('ANOTHER_API')
  .get('/customers')
  .then(console.log)
  .catch((err) => console.log(HttpClient.parseError(err)));
```

## Using Http Methods

| Method             | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| GetMethod          | Retrieves data from a specified resource.                               |
| PostMethod         | Submits data to be processed to a specified resource.                   |
| PatchMethod        | Partially updates data on a specified resource.                         |
| PutMethod          | Updates a resource or creates it if it doesn't exist.                   |
| DeleteMethod       | Removes data from a specified resource.                                 |
| DownloadFileMethod | Downloads a file from a specified resource. The progress is trackeable. |
| UploadFileMethod   | Uploads a file to a specified resource. The progress is trackeable.     |

### Declarative way

```ts
import { GetMethod } from '.';

GetMethod.build(Http.getInstance('ANOTHER_API'))
  .send('/customers')
  .then(console.log)
  .catch((err) => console.log(HttpClient.parseError(err)));
```

#### Abort Calls

```ts
import { GetMethod } from '.';

const instance = GetMethod.build(Http.getInstance('ANOTHER_API'));

instance
  .send('/customers')
  .then(console.log)
  .catch((err) => console.log(HttpClient.parseError(err)));

instance.abort();
```

### Imperative way

```ts
import { PostMethod } from '.';

type LogicResponse = {};
type BasicCredentials = { email: string; password: string };

class LoginUseCase extends PostMethod<BasicCredentials, BackendResponse<LogicResponse>> {
  constructor(instance: AxiosInstance) {
    super(instance);
  }
  public async execute(credentials: BasicCredentials): Promise<void> {
    Assert.assertBasicCredentials(credentials);
    const { data: userSession } = await this.send('/customers', credentials);

    DomainStorage.persistSession(userSession);
    DomainBus.dispatch(DomainEvents.SessionSuccess, userSession);
  }
}
```

## DownloadFileMethod

Here an example of how to use it. In this example I am creating a hoc that will create a downloadable generic component.

```ts
import { DownloadFileMethod } from '.';

const instance = DownloadFileMethod.build(Http.getInstance('ANOTHER_API'));

type ProgressState = { progress: number; loading: boolean; error?: string };
type DownloadComponentProps = { onClick(): void; progress: ProgressState };

function createDownloadComponent(Component: ComponentType<DownloadComponentProps>): ComponentType<Props> {
  return function DownloadComponent({ src, children }: Props): JSX.Element {
    const [progress, setProgress] = useState<ProgressState>({ loading: false, progress: 0 });

    useEffect(() => {
      instance.subscribeToProgress(({ progress }) => setProgress((pre) => ({ ...pre, progress })));
      return () => instance.abort();
    }, []);

    const handleOnClick = () => {
      setProgress((pre) => ({ ...pre, loading: true }));
      instance
        .send(src)
        .then((response) => MediaUtils.download(response.data))
        .catch((error) => setProgress((pre) => ({ ...pre, error: HttpClient.parseError(error).message })))
        .finally(() => setProgress((pre) => ({ ...pre, loading: false })));
    };

    return (
      <Component onClick={handleOnClick} progress={progress}>
        {children}
      </Component>
    );
  };
}
```

## UploadFileMethod

`UploadFileMethod` is similar than `DownloadFileMethod`, both extends from some base class `ProgressiveFileMethod`. So use it like the same.

### Similarities and Differences

```ts
// DownloadFileMethod
abort(): void
send(endpoint: string): Promise<AxiosResponse<Blob>> // 👈🏼 Check this
subscribeToProgress(subscriber: ProgressSubscriber)

// UploadFileMethod
abort(): void
send(endpoint: string, formData: FormData): Promise<AxiosResponse<T>> // 👈🏼 The difference is here, we need the `FormData` payload for uploading.
subscribeToProgress(subscriber: ProgressSubscriber)
```

## Error Handling

The `HttpClient` class has an static method called `parseError` for parsing errors from http calls.

```ts
(async function () {
  try {
    await Http.getInstance('ANOTHER_API').get('/customers');
  } catch (error) {
    const { code, status, message, context } = HttpClient.parseError(normalError);
    // Frontend side Example
    Application.showToast('error', message);
  }
})();
```
