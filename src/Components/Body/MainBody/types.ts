import { T_cT, U_T } from "../../Redux/ReduxTypes"







export type MakeCardPropsType = {
    SetMessageError: (value: string) => void,
    key: number,
    card: U_T["cardType"],
    showDrawer: any,
    setCardID: any
}

export type CreateNewCardPropsType = {
    SetMessageError: (value: string) => void
}

export type NewCardFormType = {
    SetMessageError: (value: string) => void
}

export type ChangeCardFormType = {
    card: U_T["cardType"],
    SetMessageError: (value: any) => void
}
