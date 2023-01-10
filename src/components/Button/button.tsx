import React, { FC, ButtonHTMLAttributes, AnchorHTMLAttributes} from "react";
import classNames from "classnames";

export type ButtonSize = 'lg' | 'sm'
export type ButtonType = 'primary' | 'default' | 'danger' | 'link'

// 延展出用户可定义属性
interface BaseButtonProps {
    className?: string;
    disable?: boolean;
    size?: ButtonSize;
    btnType?: ButtonType;
    children: React.ReactNode;
    // link类button所需属性
    href?: string;
}

type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>
// link类button props别名
type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>

export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>

const Button: FC<ButtonProps> = (props) => {
    // restProps例如点击事件等
    const {className, btnType, size, href, children, disable, ...restProps} = props
    
    // 动态合并类名
    const classes = classNames('btn', className, {
        [`btn-${btnType}`]: btnType,
        [`btn-${size}`]: size,
        'disable': (btnType === 'link') && disable
    })
    console.log(classes);
    // 当btnType === 'link' && href，disable不生效
    if (btnType === 'link' && href) {
        return (
            <a
                className={classes}
                href={href}
                {...restProps}
            >
                {children}
            </a>
        )
    } else {
        return (
            <button
                className={classes}
                disabled={disable}
                {...restProps}
            >
                {children}
            </button>
        )
    }
}

Button.defaultProps = {
    disable: false,
    btnType: 'default'
}

export default Button