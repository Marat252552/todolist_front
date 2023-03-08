import { connect } from "react-redux";
import styles from './MainBody.module.css'
import { Checkbox, Popconfirm, Popover, Button } from "antd";
import { PlusOutlined, StarFilled, StarOutlined } from '@ant-design/icons'
import React from "react";
import { Formik, useFormik } from "formik";
import { AppStateType } from "../../Redux/Redux";
import { ChangeCardFormType, CreateNewCardPropsType, MainBodyPropsType, MakeCardPropsType, mapDispatchType, MapStateType, NewCardFormType } from "./MainBodyTypes";
import { addCardAPI, deleteCardAPI } from "../../../Api/Api";
import { addNewCard_Thunk, deleteCard_Thunk, addGroupID_Thunk, deleteGroupID_Thunk, changeCardThunk, switchCompleteCard_Thunk, pullAllCards_Thunk, addGroupID_Thunk2, deleteGroupID_Thunk2, updateCard_Thunk } from "../../Redux/Thunks";
import { U_T } from "../../Redux/ReduxTypes";


const ChangeCardForm = (props: ChangeCardFormType) => {
    const formik = useFormik({
        initialValues: {
            card: props.text
        },
        onSubmit: (values: any) => {
            console.log(values.card)
            props.changeCardThunk(values.card, props.cardID)
        }
    })
    return <form onSubmit={formik.handleSubmit}>
            <input 
            value={formik.values.card}
            id='card'
            type='text'
            name='card'
            onChange={formik.handleChange}
            className={(props.isCompleted)? styles.inputCompleted : styles.input}
            />
        </form>
}

const NewCardForm = (props: NewCardFormType) => {
    const formik = useFormik({
        initialValues: {
            card: '',
        },
        onSubmit: async (values: any, { resetForm }: any) => {
            await addCardAPI(values.card, props.currentCardGroup.groupID.toString())
            props.PullAllCardsThunk()
            resetForm({ values: '' })
        },
    })
    return <form onSubmit={formik.handleSubmit}>
            <input
                className={styles.input}
                placeholder='Добавить карточку'
                id="card"
                name='card'
                type='text'
                onChange={formik.handleChange}
                value={formik.values.card}
            />
        </form>
}

const CreateNewCard = (props: CreateNewCardPropsType) => {
    return <div className={styles.createCard}>
        <div className={styles.plusOutlined}>
            <PlusOutlined />
        </div>
        <div className={styles.createNewCard}>
            <NewCardForm PullAllCardsThunk={props.PullAllCardsThunk} currentCardGroup={props.currentCardGroup} groupID={props.groupID} addNewCardThunk={props.addNewCardThunk}/>
        </div>
    </div>
}

const MakeCard = (props: MakeCardPropsType) => {
    let addGroup = async (groupID: number, card: U_T["cardType"]) => {
        let updatedCard = card
        updatedCard.groupsIDs.push(groupID)
        props.updateCard_Thunk(updatedCard)
    }
    let deleteGroup = async (groupID: number, card: U_T["cardType"]) => {
        let updatedCard = card
        updatedCard.groupsIDs = updatedCard.groupsIDs.filter(ID => {return ID !== groupID})
        props.updateCard_Thunk(updatedCard)
    }
    let completeCard = async (card: U_T["cardType"]) => {
        let updatedCard = card
        updatedCard.isCompleted = true
        props.updateCard_Thunk(updatedCard)
    }
    let incompleteCard = async (card: U_T["cardType"]) => {
        let updatedCard = card
        updatedCard.isCompleted = false
        props.updateCard_Thunk(updatedCard)
    }
    let deleteCard = async () => {
        await deleteCardAPI(props.cardID.toString())
        props.PullAllCardsThunk()
    }
    // Массив со всеми группами карточки
    let requiredGroupsArray = props.groupsIDs.filter(groupID => {
        return groupID !== props.currentCardGroup.groupID
    }).map(groupID => {
        return props.allCardGroups.filter(group => { return groupID === group.groupID })[0].name
    })
    
    return <>
        <Popover
            placement="bottomLeft"
            style={{ padding: '0' }}
            content={<div>
            <Button
                danger
                type='primary'
                style={{ width: '100%' }}
                onClick={deleteCard}>
                Delete
            </Button>
            {(props.groupsIDs.find(el => el === 1))? 
            <Button type="default" onClick={() => {deleteGroup(1, props.card)}}>Убрать из представления Мой день</Button>
            :
            <Button type="default" onClick={() => {addGroup(1, props.card)}}>Добавить в представление мой день</Button>}
            </div>
            }
            trigger="contextMenu">
            <div className={styles.card}>
                <div className={styles.checkbox}>
                    <input style={{margin: '12px'}} type='checkbox' checked={props.isCompleted} id='chbox' onChange={() => {
                        if(props.isCompleted) {incompleteCard(props.card)} else {completeCard(props.card)} 
                        }} />
                </div>
                <div className={styles.cardInfo}>
                    <ChangeCardForm changeCardThunk={props.changeCardThunk} text={props.text} cardID={props.cardID} isCompleted={props.isCompleted}/>
                    <span className={styles.groupName}>{requiredGroupsArray.map(groupName => { 
                        if(groupName !== 'Важно') {
                            return <span key={groupName}>{groupName} </span> }
                        }
                        )}</span>
                </div>
                <div>
                    {(props.groupsIDs.find(el => el === 2) !== undefined)? 
                        <Button className={styles.starButton} onClick={() => {deleteGroup(2, props.card)}} shape="circle">
                        <StarFilled />
                        </Button>
                        :
                        <Button className={styles.starButton} onClick={() => {addGroup(2, props.card)}} shape="circle">
                        <StarOutlined />
                        </Button>
                }
                </div>
            </div>
        </Popover>
    </>
}

const MainBody = (props: MainBodyPropsType) => {
    // Функция для выбора обоев
    const wallpaper = (background: string) => {
        return (background === 'wallpaper1') ? styles.wallpaper1 :
            (background === 'wallpaper2') ? styles.wallpaper2 :
                (background === 'green') ? styles.green :
                    (background === 'orange') ? styles.orange :
                        (background === 'red') ? styles.red :
                            (background === 'blue') ? styles.blue : undefined
    }
    // Массив с невыполненным карточками
    let incompletedCards = props.currentCards.filter(card => {
        return card.isCompleted === false
    })
    // Массив с выполненным карточками
    let completedCards = props.currentCards.filter(card => {
        return card.isCompleted === true
    })
    // Условие, которое показывает либо поиск либо выбранную колоду карточек
    if(props.isSearchOn) {
        return <div>{props.allCards.filter(card => {
            return card.text.includes(props.searchInputValue)
        }).map(card => {
            return <MakeCard updateCard_Thunk={props.updateCard_Thunk} deleteGroupID_Thunk2={props.deleteGroupID_Thunk2} addGroupID_Thunk2={props.addGroupID_Thunk2} PullAllCardsThunk={props.PullAllCardsThunk} switchCompleteCardThunk={props.switchCompleteCardThunk} changeCardThunk={props.changeCardThunk} deleteGroupIDThunk={props.deleteGroupIDThunk} addGroupIDThunk={props.addGroupIDThunk} deleteCardThunk={props.deleteCardThunk} card={card} key={card.cardID} cardID={card.cardID} text={card.text} currentCardGroup={props.currentCardGroup} groupsIDs={card.groupsIDs} allCardGroups={props.allCardGroups} isCompleted={card.isCompleted}/>
        })}</div>
    } else {
        return <div className={wallpaper(props.background)}>
        <div style={{ height: '80vh' }}>
            {/* Название выбранной группы */}
            <div className={styles.header}>
                <h1>{props.currentCardGroup.name}</h1>
            </div>
            {/* Карточки */}
            <div className={styles.scroll}>
                {/* Невыполненные карточки */}
                {incompletedCards.map(card => {
                    return <MakeCard updateCard_Thunk={props.updateCard_Thunk} deleteGroupID_Thunk2={props.deleteGroupID_Thunk2} addGroupID_Thunk2={props.addGroupID_Thunk2} card={card} PullAllCardsThunk={props.PullAllCardsThunk} switchCompleteCardThunk={props.switchCompleteCardThunk} changeCardThunk={props.changeCardThunk} deleteGroupIDThunk={props.deleteGroupIDThunk} addGroupIDThunk={props.addGroupIDThunk} deleteCardThunk={props.deleteCardThunk} key={card.cardID} cardID={card.cardID} text={card.text} currentCardGroup={props.currentCardGroup} groupsIDs={card.groupsIDs} allCardGroups={props.allCardGroups} isCompleted={card.isCompleted}/>
                })}
                {/* Выполненные карточки */}
                <p>Выполненные задач</p>
                {completedCards.map(card => {
                    return <MakeCard updateCard_Thunk={props.updateCard_Thunk} deleteGroupID_Thunk2={props.deleteGroupID_Thunk2} addGroupID_Thunk2={props.addGroupID_Thunk2} card={card} PullAllCardsThunk={props.PullAllCardsThunk} switchCompleteCardThunk={props.switchCompleteCardThunk} changeCardThunk={props.changeCardThunk} deleteGroupIDThunk={props.deleteGroupIDThunk} addGroupIDThunk={props.addGroupIDThunk} deleteCardThunk={props.deleteCardThunk} key={card.cardID} cardID={card.cardID} text={card.text} currentCardGroup={props.currentCardGroup} groupsIDs={card.groupsIDs} allCardGroups={props.allCardGroups} isCompleted={card.isCompleted}/>
                })}
            </div>
        </div>
        {/* Окно создания новой карточки */}
        <div>
            <CreateNewCard PullAllCardsThunk={props.PullAllCardsThunk} currentCardGroup={props.currentCardGroup} addNewCardThunk={props.addNewCardThunk} groupID={props.currentCardGroup.groupID} />
        </div>
    </div>
    }
}

const mapStateToProps = (state: AppStateType) => {
    return {
        currentCardGroup: state.data.currentCardGroup,
        allCardGroups: state.data.allCardGroups,
        background: state.data.currentCardGroup.background,
        currentCards: state.data.currentCards,
        isSearchOn: state.data.isSearchOn,
        allCards: state.data.allCards,
        searchInputValue: state.data.searchInputValue
    }
}

const MainBodyContainer = connect<MapStateType, mapDispatchType, void, AppStateType>(mapStateToProps, { addNewCardThunk: addNewCard_Thunk, deleteCardThunk: deleteCard_Thunk, addGroupIDThunk: addGroupID_Thunk, deleteGroupIDThunk: deleteGroupID_Thunk, changeCardThunk, updateCard_Thunk, switchCompleteCardThunk: switchCompleteCard_Thunk, PullAllCardsThunk: pullAllCards_Thunk, addGroupID_Thunk2, deleteGroupID_Thunk2 })(MainBody)

export default MainBodyContainer