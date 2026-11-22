# Angular 16 integration

Prerequisites: Node 18.10+ (Angular 16 supports ^16.14 or ^18.10), Angular CLI 16.

```bash
npm i -g @angular/cli@16
ng new client --routing --style=scss
cd client
```

## environment (src/environments/environment.ts)
```ts
export const environment = { production: false, apiUrl: 'http://localhost:3000/api/v1' };
```

## app.module.ts
```ts
import { HttpClientModule } from '@angular/common/http';
@NgModule({ imports: [BrowserModule, AppRoutingModule, HttpClientModule], ... })
```

## src/app/core/task.service.ts
```ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
  id: string; title: string; description?: string;
  status: 'todo' | 'in_progress' | 'done'; dueDate?: string; userId: string;
}
export interface Paged<T> { success: boolean; data: T[]; meta: { page: number; limit: number; total: number; totalPages: number } }

@Injectable({ providedIn: 'root' })
export class TaskService {
  private url = `${environment.apiUrl}/tasks`;
  constructor(private http: HttpClient) {}

  list(page = 1, limit = 10, status?: string): Observable<Paged<Task>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (status) params = params.set('status', status);
    return this.http.get<Paged<Task>>(this.url, { params });
  }
  create(t: Partial<Task>) { return this.http.post(this.url, t); }
  update(id: string, t: Partial<Task>) { return this.http.patch(`${this.url}/${id}`, t); }
  remove(id: string) { return this.http.delete(`${this.url}/${id}`); }
}
```
CORS: the API already allows `http://localhost:4200`; add production origins to `CORS_ORIGINS`.
