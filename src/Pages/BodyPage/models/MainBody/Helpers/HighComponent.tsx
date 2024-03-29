import { PlusOutlined } from "@ant-design/icons"
import { Popover } from "antd"
import { useFormik, FormikProvider, Field } from "formik"
import { observer } from "mobx-react-lite"
import LocalStorage from "../../../../../App/state/LocalStorage"
import { U_T } from "../../../../../Shared/Types/typessss"
import { CreateNewCardPropsType, NewCardFormType, ChangeCardFormType, MakeCardPropsType } from "../lib/types"
import Actions from "./Actions"
import LowComponent from "./LowComponent"
import styles from './../lib/styles.module.css'
import { useState } from "react"
import CardsState from "../../../../../App/state/CardsState"
import GroupsState from "../../../../../App/state/GroupsState"

let emptyField = (value: string) => {
    if (!value) {
        return 'Поле не может быть пустым'
    }
}

const HighComponent = {
    CreateNewCardForm: (props: CreateNewCardPropsType) => {
        return <div className={styles.createCard}>
            <div className={styles.plusOutlined}>
                <PlusOutlined />
            </div>
            <div className={styles.createNewCard}>
                <HighComponent.NewCardForm setError={props.setError} />
            </div>
        </div>
    },
    NewCardForm: (props: NewCardFormType) => {
        const formik = useFormik({
            initialValues: {
                card: '',
            },
            onSubmit: async (values: any, { resetForm }: any) => {
                let content = values.card
                Actions.addCard(content, props.setError, resetForm)
            },
        })
        return <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
                <Field
                    className={styles.input}
                    placeholder='Добавить карточку'
                    id="card"
                    name='card'
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.card}
                    validate={emptyField}
                />
            </form>
        </FormikProvider>
    },
    DrawerChangeCardForm: (props: ChangeCardFormType) => {
        const formik = useFormik({
            initialValues: {
                card: props.card.content
            },
            onSubmit: (values: any) => {
                let content = values.card
                Actions.changeCardText(props.card, content, props.setError)
            }
        })
        return <form onSubmit={formik.handleSubmit}>
            <input
                value={formik.values.card}
                id='card'
                type='text'
                name='card'
                onChange={formik.handleChange}
                className={styles.input2}
            />
        </form>
    },
    CurrentCards: (props: { setid: any, showDrawer: any, cards: { incompletedCards: Array<U_T["cardType"]>, completedCards: Array<U_T["cardType"]> }, setError: (value: string) => void }) => {
        return <div className={styles.scroll} >
            {/* Невыполненные карточки */}
            {props.cards.incompletedCards.map((card: U_T["cardType"]) => {
                return <HighComponent.MakeCard key={card.id} setid={props.setid} showDrawer={props.showDrawer} setError={props.setError} card={card} />
            })}
            {/* Выполненные карточки */}
            {(props.cards.completedCards[0]) ?
                <span style={{ background: 'rgba(245, 245, 245, 0.8)', borderRadius: '2px', margin: '0 40px 5px 40px' }}>Выполненные задачи</span>
                :
                undefined
            }

            {props.cards.completedCards.map((card: U_T["cardType"]) => {
                return <HighComponent.MakeCard key={card.id} setid={props.setid} showDrawer={props.showDrawer} setError={props.setError} card={card} />
            })}
        </div>
    },
    SearchedCards: (props: { cards: any, setCard: any, showDrawer: any, setid: any, searchInputValue: string, setError: (value: string) => void }) => {
        return <div>{CardsState.allCards.filter(card => {
            return card.content.includes(props.searchInputValue)
        }).map(card => {
            return <HighComponent.MakeCard setid={props.setid} showDrawer={props.showDrawer} setError={props.setError} card={card} key={card.id} />
        })}</div>
    },
    MakeCard: observer((props: MakeCardPropsType) => {
        // Массив со всеми группами карточки
        let requiredGroupsArray = props.card.groupsIDs.filter(groupID => {
            return groupID !== GroupsState.currentCardGroup.groupID
        }).map(groupID => {
            try {
                return GroupsState.allCardGroups.filter(group => { return groupID === group.groupID })[0]
            } catch (e) {
                return undefined
            }
        })
        if (requiredGroupsArray === undefined) {
            return <div></div>
        } else {
            return <>
            <div className={styles.test}>
            <Popover
                    placement="bottomLeft"
                    style={{ padding: '0', width: '40px' }}
                    content={<div>
                        <LowComponent.Buttons.DeleteCard setError={props.setError} id={props.card.id} />
                        <LowComponent.Buttons.MyDay setError={props.setError} card={props.card} groupsIDs={props.card.groupsIDs} />
                    </div>
                    }
                    trigger="contextMenu">
                    <div className={styles.card} onClick={() => {
                        props.showDrawer(props.card)
                    }}>
                        <LowComponent.CheckBox card={props.card} stopPropagation={false} setError={props.setError} />
                        {(props.card.is_completed) ?
                            <LowComponent.CompletedCardInfo requiredGroupsArray={requiredGroupsArray!} content={props.card.content} />
                            :
                            <LowComponent.CardInfo requiredGroupsArray={requiredGroupsArray!} content={props.card.content} />
                        }
                        <LowComponent.Buttons.Important card={props.card} setError={props.setError} />
                    </div>
                </Popover>
            </div>
                
            </>
        }

    })
}

export default HighComponent