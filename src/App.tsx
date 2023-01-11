import React from "react";
import Button from "./components/Button";
import Menu from "./components/Menu/menu";
import MenuItem from "./components/Menu/menuItem";
import SubMenu from "./components/Menu/subMenu";

const App: React.FC = () => {
    return(
        <div>
            {/* <Menu defaultIndex="1" onSelect={(index) => {alert(index)}} mode='vertical' defaultOpenSubMenus={['3']}>
                    <MenuItem>1</MenuItem>
                    <MenuItem disabled>2</MenuItem>
                    <MenuItem>3</MenuItem>
                    <SubMenu title="ddw">
                        <MenuItem>1</MenuItem>
                        <MenuItem>2</MenuItem>
                    </SubMenu>
                </Menu> */}
        </div>
    )
}

export default App