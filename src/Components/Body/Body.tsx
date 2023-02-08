import MainBody from "./MainBody/MainBody"
import Menu from "./Menu/Menu"
import styles from './Body.module.css';
import {BrowserRouter} from 'react-router-dom'


const Body = () => {
    return <div className={styles.body}>
        <Menu />        
        <BrowserRouter>
            <MainBody />
        </BrowserRouter>
    </div>
}

export default Body