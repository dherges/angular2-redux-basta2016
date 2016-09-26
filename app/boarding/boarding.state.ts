export interface AppState {
    boarding: BoardingState;

    // ... here you could find further properties ...    
}

export interface BoardingState {
    undoStack: Array<BoardingState>;
    redoStack: Array<BoardingState>;
    bookings: Array<any>,
    message: string,
    statistics: BoardingStatistic;
}

export interface BoardingStatistic {
    countBoarded: number;
    countCheckedIn: number;
    countBooked: number;
}