import React, {useEffect, useState} from "react";

const UnmountText = () => {
    useEffect(() => {
        console.log('Mount')
        // unmount할때는 콜백 함수가 return하게 하면 된다.
        //Unmount 시점에 실행되게 됨
        return () => {
            console.log('Unmount!');
        }
    }, [])
    return <div>Unmount Testing Component</div>
}

const Lifecycle = () => {
    // const [count, setCount] = useState(0);
    // const [text, setText] = useState('');

    // // []
    // useEffect(() => {
    //     console.log("mount");
    // }, []);

    // useEffect(() => {
    //     console.log('Update')
    // })

    // // []안에 값이 변하게 되면 콜백 함수가 실행된다.
    // useEffect(() => {
    //     console.log(`count is update: ${count}`)
    //     if(count > 5) {
    //         alert('count가 5를 넘었습니다 따라서 1로 초기화합니다.');
    //         setCount(1);
    //     }
    // }, [count])

    // useEffect(() => {
    //     console.log(`count is update: ${text}`)
    // }, [text])

    const[isVisible, setIsVisible] = useState(false);
    const toggle = () => setIsVisible(!isVisible)

    return (
    <div style={{padding: 20}}>
        <button onClick={toggle}>ON/OFF</button>
        {isVisible && <UnmountText />}
        {/* <div>
            {count}
            <button onClick={()=> setCount(count + 1)}> + </button>
        </div>
        <div>
            <input value={text} onChange={(e) => setText(e.target.value)} />
        </div> */}
    </div>
    );
};

export default Lifecycle;