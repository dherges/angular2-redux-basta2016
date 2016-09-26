
import {ActionReducer, Action} from '@ngrx/store';
import {BoardingState} from './boarding.state';

export const BOOKINGS_LOADED = 'BOOKINGS_LOADED';
export const BOOKING_STATE_CHANGED = 'BOOKING_STATE_CHANGED';
export const BOOKING_UNDO = "BOOKING_UNDO";
export const BOOKING_REDO = "BOOKING_REDO";

export var initialBoardingState: BoardingState = {
    undoStack: [],
    redoStack: [],
    bookings: [],
    message: "",
    statistics: {
        countBoarded: 0,
        countBooked: 0,
        countCheckedIn: 0
    }
};

export const boardingReducer: ActionReducer<BoardingState> = (state: BoardingState, action:Action) => {
    switch (action.type) {
        case BOOKINGS_LOADED: return bookingsLoaded(state, action.payload);
        case BOOKING_STATE_CHANGED: return bookingStateChanged(state, action.payload);
        case BOOKING_UNDO: return undo(state);
        case BOOKING_REDO: return redo(state);
        default: return state;
    }
}

function calcStatistic(buchungen: Array<any>) {
    var statistik = {
        countBoarded: 0,
        countBooked: 0,
        countCheckedIn: 0
    }
            
    for(var buchung of buchungen) {
        switch(buchung.buchungsStatus) {
            case 0: statistik.countBooked++; break;
            case 1: statistik.countCheckedIn++; break;
            case 2: statistik.countBoarded++; break;
        }
    }
    return statistik;
}

function bookingsLoaded(state: BoardingState, bookings): BoardingState {

    return {
        undoStack: [...state.undoStack, state],
        redoStack: [],
        message : "",
        bookings: bookings,
        statistics: calcStatistic(bookings)
    };

}

function bookingStateChanged(state: BoardingState, booking): BoardingState {

    let idx = state.bookings.findIndex(b => b.flugID == booking.flugID && b.passagierID == booking.passagierID);

    let bookings = [
        ...state.bookings.slice(0, idx),
        booking,
        ...state.bookings.slice(idx+1)
    ];

    return {
        undoStack: [...state.undoStack, state],
        redoStack: [],
        message: "",
        bookings: bookings,
        statistics: calcStatistic(bookings)
    }
}

function undo(state: BoardingState): BoardingState {
    var oldState = state;
    var prevState = state.undoStack[state.undoStack.length-1];
    var newUndoStack = state.undoStack.slice(0, state.undoStack.length-1);
    
    return {
        undoStack: newUndoStack,
        redoStack: [...oldState.redoStack, oldState],
        bookings: prevState.bookings,
        message: prevState.message,
        statistics: prevState.statistics
    }
}

function redo(state: BoardingState): BoardingState {
    var oldState = state;
    var redoState = state.redoStack[state.redoStack.length-1];
    var newRedoStack = oldState.redoStack.slice(0, oldState.redoStack.length-1);
    
    return {
        undoStack: redoState.undoStack,
        redoStack: newRedoStack,
        message: redoState.message,
        bookings: redoState.bookings,
        statistics: redoState.statistics 
    }    
}

