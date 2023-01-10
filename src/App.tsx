import React from "react";
import Button from "./components/Button";

const App: React.FC = () => {
    return(
        <div>
            <Button 
                className="ddw"
                size='lg'
                btnType = "link"
                disable =  {true}
                onClick = {() => {alert('1')}}
                // href = 'www.baidu.com'
            >
                btn
            </Button>
        </div>
    )
}

export default App