import { Dispatch } from 'react';
import { ADD_GROUP_ID, ADD_NEW_CARD, CHANGE_TEXT_CARD, CHANGE_CURRENT_GROUP_ID, CLEAR_ALL_CARDS, CLEAR_CONTROLLERS, DELETE_CARD, DELETE_GROUP_ID, LOGIN, LOGOUT, PULL_CARDS, SWITCH_COMPLETE_CARD, TOGGLE_SEARCH, UPDATE_CURRENT_CARDS, UPDATE_SEARCH_INPUT_VALUE, CHANGE_CARD } from "./DataReducer"
import { AppStateType } from './Redux';


// ACTION CREATORS
//action creators' types
export type AC_T = {
    addNewCardAC_T: (id: number, text: string, groupsIDs: Array<number>, isCompleted: boolean) => {
        type: typeof ADD_NEW_CARD,
        id: number,
        text: string,
        groupsIDs: Array<number>,
        isCompleted: boolean
    },
    changeCardAC_T: (id: number, text: string, groupsIDs: Array<number>, isCompleted: boolean) => {
        type: typeof CHANGE_CARD,
        id: number,
        text: string,
        groupsIDs: Array<number>,
        isCompleted: boolean
    },
    clearAllCardsAC_T: () => {
        type: typeof CLEAR_ALL_CARDS
    },
    clearControllersAC_T: (controller: number) => {
        type: typeof CLEAR_CONTROLLERS,
        controller: number
    }
    pullCardsAC_T: (id: number, text: string, groupsIDs: Array<number>, isCompleted: boolean) => {
        type: typeof PULL_CARDS,
        id: number,
        text: string,
        groupsIDs: Array<number>,
        isCompleted: boolean
    }
    changeTextCardAC_T: (text: string, cardID: number) => {
        type: typeof CHANGE_TEXT_CARD,
        text: string,
        cardID: number
    },
    toggleSearchAC_T: (isSearchOn: boolean) => {
        type: typeof TOGGLE_SEARCH,
        isSearchOn: boolean
    },
    updateCurrentCardsAC_T: () => {
        type: typeof UPDATE_CURRENT_CARDS
    },
    deleteCardAC_T: (cardID: number) => {
        type: typeof DELETE_CARD,
        cardID: number
    },
    changeCurrentCardGroupIDAC_T: (groupID: number) => {
        type: typeof CHANGE_CURRENT_GROUP_ID,
        groupID: number
    },
    switchCompleteCardAC_T: (cardID: number) => {
        type: typeof SWITCH_COMPLETE_CARD,
        cardID: number
    },
    addGroupIDAC_T: (groupID: number, cardID: number) => {
        type: typeof ADD_GROUP_ID,
        groupID: number,
        cardID: number
    },
    deleteCardGroupIDAC_T: (groupID: number, cardID: number) => {
        type: typeof DELETE_GROUP_ID,
        groupID: number,
        cardID: number
    },
    updateSearchInputValueTypeAC_T: (text: string) => {
        type: typeof UPDATE_SEARCH_INPUT_VALUE,
        text: string
    },
    loginAC_T: (email: string, name: string, lastName: string) => {
        type: typeof LOGIN,
        email: string,
        name: string,
        lastName: string
    },
    logoutAC_T: () => {
        type: typeof LOGOUT
    }
}
//action creators' connected types
export type AC_cT = {
    LoginAC_cT: (email: string, name: string, lastName: string) => void,
    changeCurrentCardGroupIDAC_cT: (groupID: number) => void,
    toggleSearchAC_cT: (isSearchOn: boolean) => void,
    updateSearchInputValueTypeAC_cT: (text: string) => void
}

// THUNKS
//thunks' types
export type T_T = {
    deleteCardThunk_T: (cardID: number) => (dispatch: Dispatch<AllActionsData>) => void,
    changeTextCardThunk_T: (text: string, cardID: number) => (dispatch: Dispatch<AllActionsData>) => void,
    switchCardGroupThunk_T: (groupID: number) => (dispatch: Dispatch<AllActionsData>) => void,
    addGroupIDThunk_T: (groupID: number, cardID: number) => (dispatch: Dispatch<AllActionsData>) => void,
    PullAllCardsThunk_T: () => (dispatch: Dispatch<AllActionsData>) => Promise<void>,
    deleteGroupIDThunk_T: (groupID: number, cardID: number) => (dispatch: Dispatch<AllActionsData>) => void,
    switchCompleteCardThunk_T: (cardID: number) => (dispatch: Dispatch<AllActionsData>) => void,
    logoutThunk_T: () => (dispatch: Dispatch<AllActionsData>) => Promise<void>,
    loginThunk_T: (login: string, password: string) => (dispatch: Dispatch<AllActionsData>) => Promise<void>,
    changeCardThunk_T: (cardID: number, text: string, groupsIDs: number[], isCompleted: boolean) => (dispatch: Dispatch<AllActionsData>) => void,
    syncChangedCardsThunk_T: (state: AppStateType) => (dispatch: Dispatch<AllActionsData>) => Promise<void>,
    PushDataThunk_T: (state: AppStateType) => (dispatch: Dispatch<AllActionsData>) => Promise<void>,
    syncDeletedCardsThunk_T: (state: AppStateType) => (dispatch: Dispatch<AllActionsData>) => Promise<void>,
    syncAddedCardsThunk_T: (state: AppStateType) => (dispatch: Dispatch<AllActionsData>) => Promise<void>,
    addCardThunk_T: (cardID: number, text: string, groupsIDs: Array<number>, isCompleted: boolean) => (dispatch: Dispatch<AllActionsData>) => void
}
// thunks connected' types
export type T_cT = {
    PullAllCardsThunk_cT: () => void,
    loginThunk_cT: (login: string, password: string) => void,
    switchCardGroupThunk_cT: (groupID: number) => void,
    logoutThunk_cT: () => void,
    changeCard_Thunk: (cardID: number, text: string, groupsIDs: number[], isCompleted: boolean) => void,
    PushDataThunk_cT: (state: AppStateType) => void
}

// other' types
export type U_T = {
    cardGroupType: {
        groupID: number,
        name: string,
        background: string,
        icon: string
    },
    menuCardGroupType: {
        groupID: number,
        name: string,
        background: string,
        icon: string
    },
    currentCardGroup_T: U_T["menuCardGroupType"],
    allCardGroups_T: Array<U_T["cardGroupType"]>
    menuCardGroups_T: Array<U_T["menuCardGroupType"]>,
    cardType: {cardID: number, text: string, groupsIDs: Array<number>, isCompleted: boolean}
}

export type ControllersThunks_T = {
    pullAllCards_Thunk: T_T["PullAllCardsThunk_T"],
    PushData_Thunk: T_T["PushDataThunk_T"],
    login_Thunk: T_T["loginThunk_T"],
    logout_Thunk: T_T["logoutThunk_T"]
}

export type StateControllerThunks_T = {
    addCard_Thunk: T_T["addCardThunk_T"],
    deleteCard_Thunk: T_T["deleteCardThunk_T"],
    changeCard_Thunk: T_T["changeCardThunk_T"]
}


export type AllActionsData = 
ReturnType<AC_T["changeCardAC_T"]> |
ReturnType<AC_T["pullCardsAC_T"]> |
ReturnType<AC_T["clearControllersAC_T"]> |
ReturnType<AC_T["logoutAC_T"]> | 
ReturnType<AC_T["switchCompleteCardAC_T"]> | 
ReturnType<AC_T["addNewCardAC_T"]> | 
ReturnType<AC_T["changeTextCardAC_T"]> | 
ReturnType<AC_T["deleteCardAC_T"]> | 
ReturnType<AC_T["changeCurrentCardGroupIDAC_T"]> | 
ReturnType<AC_T["updateCurrentCardsAC_T"]> | 
ReturnType<AC_T["addGroupIDAC_T"]> | 
ReturnType<AC_T["deleteCardGroupIDAC_T"]> | 
ReturnType<AC_T["switchCompleteCardAC_T"]> | 
ReturnType<AC_T["toggleSearchAC_T"]> | 
ReturnType<AC_T["updateSearchInputValueTypeAC_T"]> | 
ReturnType<AC_T["loginAC_T"]> | 
ReturnType<AC_T["clearAllCardsAC_T"]>