import React from "react";
import Button from "./components/Button";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import Menu from "./components/Menu/menu";
import MenuItem from "./components/Menu/menuItem";
import SubMenu from "./components/Menu/subMenu";
import Icon from "./components/Icon/icon";
import Upload from "./components/Upload/upload";

library.add(fas)
const App: React.FC = () => {
    return(
        <div>
            <Menu defaultIndex="1" onSelect={(index) => {alert(index)}} mode='vertical' defaultOpenSubMenus={['3']}>
                <MenuItem>1</MenuItem>
                <MenuItem disabled>2</MenuItem>
                <MenuItem>3</MenuItem>
                <SubMenu title="ddw">
                    <MenuItem>1</MenuItem>
                    <MenuItem>2</MenuItem>
                </SubMenu>
            </Menu>
            <Icon icon="coffee" theme="danger" size="10x"/>
            <Upload
                action="https://jsonplaceholder.typicode.com/posts"
                onProgress={(precentage, file) => {console.log(precentage,file.name);}}
                onSuccess={data => {console.log(data);
                }}
                onError={(err) => {console.log(err);
                }}
            />
        </div>
    )
}

export default App