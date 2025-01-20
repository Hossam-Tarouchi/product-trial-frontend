import { Injectable, inject, signal } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";
import { environment } from "environments/environment";
import { CustomHttpResponse } from "app/shared/models/customhttpresponse.model";


@Injectable({
    providedIn: "root"
}) export class ProductsService {

    private readonly http = inject(HttpClient);
    
    private readonly product_endpoint = environment.API_BASE_HOST + "/api/v1/product";
    //private readonly path = "/api/products";
    
    private readonly _products = signal<Product[]>([]);

    public readonly products = this._products.asReadonly();

    private readonly _token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJob3NzYW1AZ21haWwuY29tIiwiaWF0IjoxNzM3MzY5MjcwLCJleHAiOjE3Mzc3MjkyNzB9.MYOa0K4v9jlRsmQAeiFdVuOJllh35FgzRu49P_LN4x8"
    private readonly _adminToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE3MzczNzgwNTUsImV4cCI6MTczNzczODA1NX0.CChK2uwyO7aFJ3zjXb5wma92AK55OqBeWLkPpYLGO30"
    // Method to get the Authorization headers
    private getAuthHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Authorization': `Bearer ${this._token}`// Only add the header if the token exists
        });
    }
    private getAdminAuthHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Authorization': `Bearer ${this._adminToken}`// Only add the header if the token exists
        });
    }

    public get(): Observable<CustomHttpResponse> {
        return this.http.get<CustomHttpResponse>(this.product_endpoint, {
            headers: this.getAuthHeaders()
        }).pipe(
            catchError((error) => {
                return this.http.get<CustomHttpResponse>("assets/products.json");
            }),
            tap((products) => this._products.set(products.data)),
        );
    }

    public create(product: Product): Observable<boolean> {
        return this.http.post<boolean>(this.product_endpoint, product, {
            headers: this.getAdminAuthHeaders()
        }).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => [product, ...products])),
        );
    }

    public update(product: Product): Observable<boolean> {
        return this.http.patch<boolean>(`${this.product_endpoint}/${product.id}`, product, {
            headers: this.getAdminAuthHeaders()
        }).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => {
                return products.map(p => p.id === product.id ? product : p)
            })),
        );
    }

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.product_endpoint}/${productId}`, {
            headers: this.getAdminAuthHeaders()
        }).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => products.filter(product => product.id !== productId))),
        );
    }
}