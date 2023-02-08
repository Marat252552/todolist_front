import { connect } from "react-redux/es/exports"
import CardsInfo from "./CardsInfo/CardsInfo"
import MainBox from "./MainInfo/MainBox"
import styles from './Menu.module.css'
import {changeCurrentCardGroupID} from '../../Redux/DataReducer'
import { AppStateType } from "../../Redux/Redux"
import { MapDispatchType, MapStateType, MenuPropsType } from "./MenuTypes"


const Menu = (props: MenuPropsType) => {
    return <div className={styles.menu}>
        <MainBox/>
        <CardsInfo menuCardGroups={props.menuCardGroups} changeCurrentCardGroupID={props.changeCurrentCardGroupID}/>
    </div>
}

const mapStateToProps = (state: AppStateType) => {
    return {
        menuCardGroups: state.data.menuCardGroups
    }
}

const MenuContainer = connect<MapStateType, MapDispatchType, void, AppStateType>(mapStateToProps, {changeCurrentCardGroupID})(Menu);

export default MenuContainer