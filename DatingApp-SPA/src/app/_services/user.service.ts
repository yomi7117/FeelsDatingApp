import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
   baseUrl =  'http://localhost:5000/api/';

 constructor(private http: HttpClient) { }

 getUsers(page?, itemsPerPage?, userParams?, likesParma?): Observable<PaginatedResult<User[]>> {
  const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

  let params = new HttpParams();

  if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
  }

   if (userParams != null) {
     params = params.append('minAge', userParams.minAge);
     params = params.append('maxAge', userParams.maxAge);
     params = params.append('gender', userParams.gender);
     params = params.append('orderBy', userParams.orderBy);
   }

   if (likesParma === 'Likers') {
    params = params.append('Likers', 'true');
   }
    if (likesParma === 'Likees') {
     params = params.append('Likees', 'true');
   }
  return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params})
  .pipe (
    map(response => {
      paginatedResult.result = response.body;
      if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResult;
    })
  );
 }
 getUser(id): Observable<User> {

  return this.http.get<User>(this.baseUrl + 'users/' + id);
 }

 updateUser(id: number, user: User) {
  return this.http.put(this.baseUrl + 'users/' + id, user);

 }
 sendLike(id: number, recipientId: number) {
  return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
}

 SetMainPhoto(userId: number, id: number) {
  return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
 }

 deletePhoto(userId: number, id: number) {
  return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
 }


}
