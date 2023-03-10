import React, { FC } from 'react'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionProps } from 'react-transition-group/CSSTransition'

type AnimationName = 'zoom-in-top' | 'zoom-in-left' | 'zoom-in-bottom' | 'zoom-in-right'

type TransitionProps = CSSTransitionProps & {
    animation?: AnimationName,
    wrapper?: boolean
}

const Transition: FC<TransitionProps> = (props) => {
    const {children, classNames, animation, wrapper, ...restProps} = props
    return (
        <CSSTransition
            classNames={ classNames ? classNames : animation}
            {...restProps}
        >
            {wrapper ? <div>{children}</div> : children}
        </CSSTransition>
    )
}

Transition.defaultProps = {
    // 不显示样式时，移除元素
    unmountOnExit: true,
    appear: true,
}
  
export default Transition