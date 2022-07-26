import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {Store} from "@ngrx/store";
import {CurrencyEnumType} from "../../models/currency-enum-type";
import {Observable} from "rxjs";
import {selectByStore, selectCurrencyType, selectExchangeRate, StoreData} from "../../state/app.selectors";

@Component({
  selector: 'app-store-table',
  templateUrl: './store-table.component.html',
  styleUrls: ['./store-table.component.scss']
})
export class StoreTableComponent implements OnInit {

  public displayedColumnsNames!: string[];
  public selectedCurrency$: Observable<CurrencyEnumType>;
  public exchangeRate$: Observable<number>;
  public usd = CurrencyEnumType.USD;
  public dataSource!: MatTableDataSource<StoreData>;

  constructor(private dialog: MatDialog,
              private store: Store) {
  }

  @Input()
  public set inputData(data: Array<StoreData>) {
    if (data) {
      this.dataSource = new MatTableDataSource([...data]);
    }
  }

  @Input()
  public displayedColumns!: string[];

  @Input()
  public title!: string;

  @Input()
  public isAddButton!: boolean;

  @Input()
  public addButtonText!: string;

  @Output()
  public addClick = new EventEmitter();

  @Output()
  public clickRow = new EventEmitter();


  public ngOnInit(): void {
    this.displayedColumnsNames = this.displayedColumns.map((column) => {
      return column;
    });

    this.selectedCurrency$ = this.store.select(selectCurrencyType);
    this.exchangeRate$ = this.store.select(selectExchangeRate);
  }

  public get totalPrice() {
    let total = 0;
    this.store.select(selectByStore).forEach((stores) => {
      stores.filter(x => {
        total += (x.sum * x.quantity);
      })
    })
    return total;
  }
}
