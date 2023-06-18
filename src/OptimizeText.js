import React, { useEffect, useState } from "react";

// const TextView = React.memo(({text}) => {
//     useEffect(() => {
//         console.log(`Update:: Text : ${text}`);
//     })
//     return <div>{text}</div>
// });

// const CountView = React.memo(({count}) => {
//     useEffect(()=> {
//         console.log(`Update:: Text : ${count}`);
//     })
//     return <div>{count}</div>
// })

const CounterA = React.memo(({count}) => {
    useEffect(() => {
        console.log(`CounterA update - count: ${count}`);
    })

    return <div>{count}</div>
});

// 얕은 복사 때문에 obj 값이 변경 안돼도 리렌더링 발생
const CounterB = ({obj}) => {
    useEffect(() => {
        console.log(`CounterB update - count: ${obj.count}`);
    })

    return <div>{obj.count}</div>
};

const areEqual = (prevProps, nextProps) => {
    // true -> 이전 프롭스 현재 프롭스가 같다 -> 리렌더링을 일으키지 않게됨.
    // false -> 이전과 현재과 다른다 -> 리렌더링을 일으킴.
    if(prevProps.obj.count === nextProps.obj.count) {
        return true;
    }
    return false;
}

// areEqual 함수의 판단으로 리렌더링 결정
const MemoizesCounterB = React.memo(CounterB, areEqual);

const OptimizeTest = () => {
    // const [text, setText] = useState('');
    const [count, setCount] = useState(1); 
    const [obj, setObj] = useState({
        count: 1
    })

    return <div style={{padding: 50}}>
        <div>
            <h2>Counter A</h2>
            <CounterA count={count} />
            <button onClick={() => setCount(count)}>A button</button>
        </div>
        <div>
            <h2>Counter B</h2>
            <MemoizesCounterB obj={obj} />
            <button onClick={() => setObj({
                count: obj.count
            })}
            >B button</button>
        </div>
        {/* <div>
            <h2>count</h2>
            <CountView count={count} />
            <button onClick={() => setCount(count + 1)}>+</button>
        </div>
        <div>
            <h2>text</h2>
            <TextView text={text} />
            <input value={text} onChange={(e) => setText(e.target.value)} />
        </div> */}
    </div>
}

export default OptimizeTest;

/**
 * React.memo
 * 함수형 컴포넌트에게 업데이트 조건을 걸자
 */