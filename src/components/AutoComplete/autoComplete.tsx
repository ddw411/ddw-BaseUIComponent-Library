import classNames from "classnames";
import React, { FC, ReactElement, useEffect, useState, KeyboardEvent, useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import useDebounce from "../../hooks/useDebounce";
import Icon from "../Icon/icon";
import Input, { InputProps } from "../Input/input";

interface DataSourceObject {
    value: string
}
// 交叉类型
export type DataSourceType<T = {}> = T & DataSourceObject

export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>
    onSelect?: (item: DataSourceType) => void
    renderOption?: (item: DataSourceType) => ReactElement
}

export const AutoComplete: FC<AutoCompleteProps> = (props) => {
    const {fetchSuggestions, onSelect, value, renderOption, ...restProps} = props
    // 管理用户输入与匹配数据
    const [ inputValue, setInputValue] = useState(value)
    const [suggestions, setSuggestions] = useState<DataSourceType[]>([])
    // 条件渲染
    const [loading, setLoading] = useState(false)
    const [highlightIndex, setHighlightIndex] = useState(-1)
    // select后不能再请求，change时可以请求
    const triggerSearch = useRef(false)
    // 获取dom
    const componentRef = useRef<HTMLDivElement>(null)
    const debouncedValue = useDebounce(value, 500)
    // 点击div外，置空  
    useClickOutside(componentRef, () => { setSuggestions([])})
    
    useEffect(() => {
        if(debouncedValue && triggerSearch.current) {
            const results = fetchSuggestions(debouncedValue)
            if(results instanceof Promise) {
                setLoading(true)
                results.then(data => {
                    setLoading(false)
                    setSuggestions(data)
                })
            } else {
                setSuggestions(results)
            }
            setHighlightIndex(-1)
        }
    },[debouncedValue])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        setInputValue(value)
        triggerSearch.current = true
    }

    const handleSelect = (item: DataSourceType) => {
        setInputValue(item.value)
        setSuggestions([])
        if(onSelect) {
            onSelect(item)
        }
        triggerSearch.current = false
    }

    const highlight = (index: number) => {
        if(index < 0 ) index = 0
        if(index >= suggestions.length) {
            index = suggestions.length - 1
        }
        setHighlightIndex(index)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch(e.keyCode) {
            case 13: //回车
                if(suggestions[highlightIndex]) {
                    handleSelect(suggestions[highlightIndex])
                }
                break
            case 38: //向上
                highlight(highlightIndex - 1)
                break
            case 40: //向下
                highlight(highlightIndex + 1)
                break
            case 27:
                setSuggestions([])
                break
        }
    }

    const renderTemplate = (item: DataSourceType) => {
        return renderOption ? renderOption(item) : item.value
    }
    const generateDropdown = () => {
        return (
            <ul>
                {
                    suggestions.map((item, index) => {
                        const cnames = classNames('suggestion-item', {
                            'item-highlighted': index === highlightIndex
                        })
                        return (
                            <li key={index} className={cnames} onClick={() => handleSelect(item)}>
                                {renderTemplate(item)}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
    return (
        <div className="ddw-auto-complete" ref={componentRef}>
            <Input
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                {...restProps}
            />
            { loading && <ul><Icon icon="spinner" spin/></ul>}
            {(suggestions.length > 0) && generateDropdown()}
        </div>
    )
}