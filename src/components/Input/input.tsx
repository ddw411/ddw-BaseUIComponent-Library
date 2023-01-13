import React, { FC, InputHTMLAttributes, ReactElement } from "react";
import { IconProp} from '@fortawesome/fontawesome-svg-core'
import classNames from "classnames";
import Icon from "../Icon/icon";

type InputSize = 'lg' | 'sm'
// InputProps自定义size与InputHTMLAttributes自带size重合，
// 用omit删除原生size
export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>,'size'> {
    disabled?: boolean;
    size?: InputSize;
    icon?: IconProp;
    prepend?: string | ReactElement;
    append?: string | ReactElement;
}

// 受控组件的状态由state控制；
// 非受控组件的状态由ref控制
export const Input: FC<InputProps> = (props)  => {
    // 取出props
    const {disabled, size, icon, prepend, append, style, ...restProps} = props
    // 根据props计算classname
    const classes = classNames("ddw-input-wrapper", {
        [`input-size-${size}`]: size,
        'is-disabled': disabled,
        'input-group': prepend || append,
        'input-group-append': !!append,
        'input-group-prepend': !!prepend
    })
    
    // 防止受控组件输入值为空
    const fixControlledValue = (value: any) => {
        if(typeof value === 'undefined' || value === null) {
            return ' '
        }
        return value
    }
    // value（受控）和defaultvalue（非受控）不能同时出现
    if('value' in props) {
        delete restProps.defaultValue
        restProps.value = fixControlledValue(props.value)
    }

    return (
        <div className={classes} style={style}>
            {prepend && <div className="ddw-input-group-prepend">{prepend}</div>}
            {icon && <div className="icon-wrapper"><Icon icon={icon} title={`title-${icon}`}/></div>}
            <input
                className="ddw-input-inner"
                disabled={disabled}
                {...restProps}
            />
            {append && <div className="ddw-input-group-append">{append}</div>}
        </div>
    )
}

export default Input