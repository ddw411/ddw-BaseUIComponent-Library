import React, { FC, FunctionComponentElement, useContext, useState } from 'react'
import classNames from 'classnames'
import { MenuContext } from './menu'
import { MenuItemProps } from './menuItem';

// 采用string作为index的数据结构，组成
// MenuItem-SubMenuItem: "1-1"
export interface SubMenuProps {
    index?: string;
    title: string;
    className?: string;
}

const SubMenu: FC<SubMenuProps> = (props) => {
    const {index, title, className, children} = props
    const context = useContext(MenuContext)
    const openedSubMenus = context.defaultOpenSubMenus as Array<string>
    const isOpen = (index && context.mode === 'vertical') ? openedSubMenus.includes(index) : false
    // 控制submenu展开状态
    const [menuOpen, setOpen] = useState(isOpen)

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setOpen(!menuOpen)
        console.log("1");
    }
    let timer: any
    // 处理鼠标移入移出
    const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
        clearTimeout(timer)
        e.preventDefault()
        timer = setTimeout(() => {
            setOpen(toggle)
        }, 300);
    }
    // 竖直模式需点击(click)展开下拉；水平模式鼠标停留定时器控制(hover)
    const clickEvents = context.mode === 'vertical' ? {
        onClick: handleClick
    } : { }
    const hoverEvents = context.mode !== 'vertical' ? {
        onMouseEnter: (e: React.MouseEvent) => { handleMouse(e, true)},
        onMouseLeave: (e: React.MouseEvent) => { handleMouse(e, false)}
    } : { }
    
    const classes = classNames('menu-item submenu-item', className, {
        'is-active': context.activeIndex === index
    })

    const renderChildren = () => {
        const subMenuClasses = classNames('ddw-submenu', {
            'menu-opened': menuOpen
        })
        const childrenComponent = React.Children.map(children, (child, i) => {
            const childElement = child as FunctionComponentElement<MenuItemProps>
            if(childElement.type.displayName === 'MenuItem') {
                // 给subMenu赋值上index
                return React.cloneElement(childElement, {
                    index:`${index}-${i}`
                })
            } else {
                console.error("Warning: SubMenu has a child which is not a MenuItem component")
            }
        })
        return (
            <ul className={subMenuClasses}>
                {childrenComponent}
            </ul>
        )
    }

    return (
        <li key={index} className={classes} {...hoverEvents}>
            <div className='submenu-title' {...clickEvents}>
                {title}
            </div>
            {renderChildren()}
        </li>
    )
}

SubMenu.displayName = 'SubMenu'
export default SubMenu



// Menu结构：
// <ul> //menu
//     //menuitem
//     <li>1</li>
//     <li>2</li>
//     <li> //submenu
//         <div>title</div>
//         <ul> 
//             <li>0</li> //submenuitem
//             <li>1</li>
//         </ul>
//     </li>
// </ul>