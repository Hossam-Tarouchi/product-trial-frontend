import {
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from "@angular/common";
import { ShoppingCartService } from "./shoping_cart/data_access/shopping-cart.service";
import { ButtonModule } from "primeng/button";
import { BadgeModule } from "primeng/badge";
import { Product } from "./products/data-access/product.model";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, SidebarModule, ButtonModule, CommonModule, BadgeModule],
})
export class AppComponent implements OnInit{
  title = "ALTEN SHOP";
  cartVisible = false;
  private readonly shoppingCartService = inject(ShoppingCartService);
  shoppingCartproductsSignal = this.shoppingCartService.shopping_cart_products;
  shoppingCartproducts: Product[] = []


  ngOnInit() {
    this.shoppingCartService.get().subscribe();
    this.shoppingCartproducts = this.shoppingCartService.shopping_cart_products()
  }

  toggleCart() {
    this.cartVisible = !this.cartVisible;
    if(this.cartVisible){
      this.shoppingCartService.get().subscribe();
      this.shoppingCartproducts = this.shoppingCartService.shopping_cart_products()
    }

  }

  get totalPrice(): number {
    return this.shoppingCartproducts.reduce((total, item) => total + item.price, 0);
  }

  addToCart(product: Product) {
    this.shoppingCartService.add(product).subscribe();
    const existingProduct = this.shoppingCartproducts.find(item => item.id === product.id);
    if (existingProduct) {
      // Update the qte in the sidbar
    } else {
      this.shoppingCartproducts.push({ ...product});
    }
  }


  removeItemFromCart(itemToRemove: Product) {
    this.shoppingCartService.delete(itemToRemove.id).subscribe();
    this.shoppingCartproducts = this.shoppingCartproducts.filter(item => item.id !== itemToRemove.id);

  }

}
