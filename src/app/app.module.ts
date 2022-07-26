import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {FlexModule} from "@angular/flex-layout";
import {AddItemComponent} from './components/add-item/add-item.component';
import {ItemTableComponent} from "./components/item-table/item-table.component";
import {HttpClientModule} from "@angular/common/http";
import {ItemComponent} from "./pages/item/item.component";
import {StoreComponent} from "./pages/store/store.component";
import {StoreModule} from '@ngrx/store';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {currencyReducer, itemsReducer, productsReducer} from './state/app.reducer';
import {StoreTableComponent} from "./components/store-table/store-table.component";
import {EffectsModule} from '@ngrx/effects';
import {AppEffects} from './state/app.effects'
import {NotFoundComponent} from "./pages/not-found.component";

@NgModule({
  declarations: [
    AppComponent,
    ItemTableComponent,
    StoreTableComponent,
    AddItemComponent,
    ItemComponent,
    StoreComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    FlexModule,
    ReactiveFormsModule,
    StoreModule.forRoot({items: itemsReducer, currency: currencyReducer, products: productsReducer}),
    EffectsModule.forRoot([AppEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
