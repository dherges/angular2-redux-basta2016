import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BOOKING_STATE_CHANGED, BOOKING_UNDO, BOOKING_REDO, BOOKINGS_LOADED } from './boarding.reducer';
import {BoardingService} from "./boarding.service";
import {AppState, BoardingStatistic} from "./boarding.state";
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

@Component({
    templateUrl: 'app/boarding/boarding.component.html',
    providers: [BoardingService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardingComponent {

    constructor(private boardingService: BoardingService, private store: Store<AppState>) {
    }

    statistics: Observable<BoardingStatistic>;

    createBookingLoadedAction(bookings) {
        return { type: BOOKINGS_LOADED, payload: bookings};
    }

    // Lifecycle-Hooks
    ngOnInit() {
        const FLIGHT_ID = 1;

        var that = this;
        this.boardingService.find(FLIGHT_ID).subscribe(
            (bookings) => {
                this.store.dispatch(this.createBookingLoadedAction(bookings));
            },
            (err) => {
                console.debug(err);
            }  
        );
 
        this.statistics = this.store.select(s => s.boarding.statistics);
    }
    
    get bookings() {
        return this.store.select(s => s.boarding.bookings);
    }
    
    get message() {
      return this.store.select(s => s.boarding.message);
    }
    
    get countBoarded() {
        return this.statistics.map(s => s.countBoarded);
    }

    get countBooked() {
        return this.statistics.map(s => s.countBooked);
    }

    get countCheckedIn() {
        return this.statistics.map(s => s.countCheckedIn);
    }
    
    get undoDisabled() {
        return this.store.select(s => s.boarding.undoStack).map(s => s.length <= 1);
    }

    get redoDisabled() {
        return this.store.select(s => s.boarding.redoStack).map(s => s.length == 0);
    }

    public changeState(buchung, state) {
        if (buchung.buchungsStatus == state) return;

        // Mutable
        // buchung.bookingState = state;

        // Immutable // Immtuable.js
        let newBuchung = Object.assign({}, buchung, { buchungsStatus: state } );
        this.store.dispatch({type: BOOKING_STATE_CHANGED, payload: newBuchung });

    }
    
    public undo() {
        this.store.dispatch({ type: BOOKING_UNDO });
    }
    
    public redo() {
        this.store.dispatch({ type: BOOKING_REDO });
    }

}