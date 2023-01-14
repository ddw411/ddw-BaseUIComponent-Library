import React, { ChangeEvent, FC, useRef, useState } from "react";
import axios from "axios";
import UploadList from "./uploadList";
import Dragger from "./dragger";


export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'
export interface UploadFile {
    uid: string;
    size: number;
    name: string;
    status?: UploadFileStatus;
    percent?: number;
    raw?: File;
    response?: any;
    error?: any;
}

export interface UploadProps {
    action: string;
    // 添加验证，如文件大小
    beforeUpload?: (file: File) => boolean | Promise<File>
    onProgress?: (precentage: number, file: File) => void;
    onSuccess?: (data: any, file: File) => void;
    onError?: (err:any, file: File) => void;
    onChange?: (file: File) => void;
    onRemove?: (file: UploadFile) => void;
    name?: string;
    headers?: {[keys: string]: any};
    data?: {[key: string]: any};
    withCredentials?: boolean;
    accept?: string;
    multiple?: boolean;
    drag?: boolean
}

export const Upload: FC<UploadProps> = (props) => {
    // 用户自定义props：action, onProgress, onSuccess, onError
    const {
        action, 
        onProgress, 
        onSuccess, 
        onError, 
        beforeUpload, 
        onChange,
        onRemove,
        name,
        headers,
        data,
        withCredentials,
        accept,
        multiple,
        children,
        drag
    } = props
    const fileInput = useRef<HTMLInputElement>(null)
    // 上传文件信息列表
    const [fileList, setFileList] = useState<UploadFile[]>([])
    
    // 更新文件上传状态
    const updataFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
        // 当更新的内容是多个的时候（例如遍历数组的item），用用setXxxx的callback形式
        // 出现上述情况的原因：函数组件每一帧都有自己独立的状态，通过回调形成闭包去获取最新的（上次的）状态
        // setFunction(() => {})传入回调形式，能拿到最新的state
        setFileList(prevlist => {
            return prevlist.map(file => {
                if(file.uid === updateFile.uid) {
                    // 覆盖更新
                    return {...file, ...updateObj}
                } else {
                    return file
                }
            })
        })
    } 
    
    const handleClick = () => {
        if(fileInput.current) {
            fileInput.current.click()
        }
    }

    const handleRemove = (file: UploadFile) => {
        setFileList((prevList) => {
            return prevList.filter(item => item.uid !== file.uid)
        })
        if(onRemove) {
            onRemove(file)
        }
    }

    const post = (file: File) => {
        // 封装上传file，提供附加信息
        let _file: UploadFile = {
            uid: Date.now() + 'upload-file',
            status: 'ready',
            name: file.name,
            size: file.size,
            percent: 0,
            raw: file
        }
        setFileList(prevList => {
            return [_file,...prevList]
        })
        // 建立formData结构方便文件数据上传
        const formData = new FormData()
        // append参数为键，值向formData添加数据
        formData.append(name || 'file', file)
        // 用户自定义附加信息
        if(data) {
            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })
        }
        axios.post(action, formData, {
            headers: {
                ...headers,
                // 文件数据上传类型
                'Content-Type': 'multipart/form-data'
            },
            withCredentials,
            // axios自带进度显示
            onUploadProgress: (e) => {
                let percentage = Math.round((e.loaded * 100) / e.total) || 0
                if(percentage < 100) {
                    updataFileList(_file, {percent: percentage, status:'uploading'})
                    if(onProgress) {
                        onProgress(percentage, file)
                    }
                }
            }
        }).then(res => {
            updataFileList(_file, {status:'success', response: res.data})
            if(onSuccess) {
                onSuccess(res.data, file)
            }
            if(onChange) {
                onChange(file)
            }
        }).catch(err => {
            updataFileList(_file, {status:'error'})
            if(onError) {
                onError(err, file)
            }
            if(onChange) {
                onChange(file)
            }
        })
    }

    const uploadFiles = (files: FileList) => {
        // FileList是类数组，转换为数组
        let postFiles = Array.from(files)
        postFiles.forEach(file => {
            if(!beforeUpload) {
                post(file)
            } else {
                // 用户自定义异步处理
                const result = beforeUpload(file)
                if(result && result instanceof Promise) {
                    result.then(processedFile => {
                        post(processedFile)
                    })
                } else if (result !== false) {
                    post(file)
                }
            }
        })
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if(!files) return
        uploadFiles(files)
        // 上传后置空
        if(fileInput.current) {
            fileInput.current.value = ' '
        }
    }

    return (
        <div className="ddw-upload-component">
            <div
                className="ddw-upload-input"
                style={{display:'inline-block'}}
                onClick={handleClick}
            >
                {
                    drag ? <Dragger
                        onFile={files => uploadFiles(files)}
                    >
                        {children}
                    </Dragger>
                    : {children}
                }
                <input
                    className="ddw-file-input"
                    style={{display:'none'}}
                    ref={fileInput}
                    onChange={handleFileChange}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                />
            </div>
            
            <UploadList 
                fileList={fileList}
                onRemove={handleRemove}
            />
        </div>
    )
}

Upload.defaultProps = {
    name: 'file'
}

export default Upload