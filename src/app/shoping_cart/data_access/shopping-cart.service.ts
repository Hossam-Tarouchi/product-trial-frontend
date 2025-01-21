import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from 'app/products/data-access/product.model';
import { CustomHttpResponse } from 'app/shared/models/customhttpresponse.model';
import { environment } from 'environments/environment';
import { Observable, catchError, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShoppingCartService {

    private readonly http = inject(HttpClient);
    private readonly shopping_cart_endpoint = environment.API_BASE_HOST + "/api/v1/shoppingcart";

    private readonly _shopping_cart_products = signal<Product[]>([]);
    public readonly shopping_cart_products = this._shopping_cart_products.asReadonly();

    private readonly _token = environment.TOKEN

    private getAuthHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Authorization': `Bearer ${this._token}`
        });
    }

    public get(): Observable<CustomHttpResponse> {
        return this.http.get<CustomHttpResponse>(this.shopping_cart_endpoint, {
            headers: this.getAuthHeaders()
        }).pipe(
            tap((products) => this._shopping_cart_products.set(products.data)),
        );
    }

    public add(product: Product): Observable<CustomHttpResponse> {
        return this.http.post<CustomHttpResponse>(this.shopping_cart_endpoint, product, {
            headers: this.getAuthHeaders()
        }).pipe(
            tap(() => this._shopping_cart_products.update(products => [product, ...products])),
        );
    }

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.shopping_cart_endpoint}/${productId}`, {
            headers: this.getAuthHeaders()
        }).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._shopping_cart_products.update(products => products.filter(product => product.id !== productId))),
        );
    }
}
