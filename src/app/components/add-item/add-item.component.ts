import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {add, fetchProducts} from "../../state/app.actions";
import {Item} from "../../models/item";
import {MatSnackBar} from "@angular/material/snack-bar";
import {map, Observable, startWith} from 'rxjs';
import {selectFetchProductsError, selectProducts} from '../../state/app.selectors';
import {ProductsResponseData} from '../../models/product-response-data';
import * as moment from 'moment';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {

  public formTitle = 'Add Item';
  public addItemForm: FormGroup;
  public myControl = new FormControl('');
  public options: string[] = [];
  public filteredOptions: Observable<string[]>;
  public products$: Observable<ProductsResponseData[]>;
  public fetchProductsError$: any

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private store: Store,
    private snackBar: MatSnackBar
  ) {
  }

  public ngOnInit(): void {
    this.fetchProducts();
    this.initForm();
    this.filter();
    this.handleFetchProductsError();
  }

  public onAddItem(): void {
    const payload = this.addItemForm.value as Item;
    const nameFromApi = this.myControl.value as string;
    this.formatDate(payload)

    if (!payload.name) {
      payload.name = nameFromApi;
    }
    if (this.validatePayload(payload)) {
      this.store.dispatch(add({payload}));
      this.closeDialog();
      const msgSec = 'Item created successfully'
      this.snackBar.open(msgSec, 'Close', {duration: 3000});
      this.addItemForm.reset();

      return;
    }
    const msgErr = 'Item cannot be empty'
    this.snackBar.open(msgErr, 'Close', {duration: 3000});
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }

  private formatDate(payload: Item) {
    let date = this.addItemForm.get('estimatedDelivery').value;
    date = moment(date).format('DD-MMM-YYYY');
    payload.estimatedDelivery = date;
  }

  private filter() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private initForm() {
    this.addItemForm = this.fb.group({
      name: ['', []],
      store: ['', []],
      priceUSD: [0, []],
      estimatedDelivery: ['', []]
    });
  }

  private fetchProducts() {
    this.store.dispatch(fetchProducts())
    this.products$ = this.store.select(selectProducts);

    this.products$
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        res.map(prod => {
          this.options.push(prod.title);
        })
      })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private validatePayload(payload: Item): boolean {
    return !!(payload.name && payload.store && payload.priceUSD > 0 && payload.estimatedDelivery);
  }

  private handleFetchProductsError() {
    this.fetchProductsError$ = this.store.select(selectFetchProductsError)
      .pipe(untilDestroyed(this))
      .subscribe(
        errResponse => {
          if (errResponse) {
            this.snackBar.open(errResponse, 'Close', {duration: 3000});
          }
        }
      );
  }
}
