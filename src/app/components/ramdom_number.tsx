"use client"
import { useEffect, useState } from "react";

type NumberOfList = {
    num: number;
    positonX: number,
    positonY: number,
    zIndex: number,
}

const RandomNumberGame = () => {
    const [numbers, setNumbers] = useState<NumberOfList[]>([]);
    const [qualityNumber, setQualityNumber] = useState<number>(0);
    const [textButton, setTextButton] = useState<string>("Play");
    const [status, setStatus] = useState<string>("LET'S PLAY");
    const [currentNumber, setCurrentNumber] = useState<number>(0);
    const [hiddenNumbers, setHiddenNumbers] = useState<number[]>([]);
    const [seconds, setSeconds] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (isRunning) {
            timer = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 0.1);
            }, 100);
        } else if (!isRunning && seconds !== 0) {
            clearInterval(timer);
        }

        return () => clearInterval(timer);
    }, [isRunning, seconds]);

    const start = () => setIsRunning(true);
    const stop = () => setIsRunning(false);
    const reset = () => {
        setIsRunning(false);
        setSeconds(0);
    }


    function generateRandomNumbers(length: number) {
        if (length > 0) {
            setHiddenNumbers([])
            setCurrentNumber(0);
            setTextButton("Restart");
            setStatus("LET'S PLAY");
            reset()
            start()
        }
        return Array.from({ length: length }, (_, i) => {
            return {
                num: i + 1,
                positonX: Math.floor(Math.random() * (window.innerWidth - 120)),
                positonY: Math.floor(Math.random() * 650),
                zIndex: length - i,
            };
        });
    }

    const handleClick = (index: number, num: number) => {
        const newNumbers = [...numbers];
        if (currentNumber + 1 == num) {
            setCurrentNumber(num);
            setHiddenNumbers([...hiddenNumbers, num]);
            setTimeout(() => {
                newNumbers[index].num = 0;
                setNumbers(newNumbers);
                if (newNumbers.filter(item => item.num > 0).length === 0) {
                    stop()
                    setStatus("ALL CLEARED");
                }
            }, 1000);
        } else {
            stop()
            setStatus("GAME OVER");
        }

    };

    const numberIngame = (num: number, positonX: number, positonY: number, zIndex: number) => {
        return (
            <div
                className={`w-12 h-12 rounded-3xl border-solid border-[1px] border-[#999] font-bold flex justify-center items-center cursor-pointer}`}
                style={{
                    position: 'absolute',
                    top: `${positonY}px`,
                    left: `${positonX}px`,
                    zIndex: zIndex,
                    opacity: hiddenNumbers.includes(num) ? 0 : 1,
                    transition: "opacity 1s ease-out",
                    background: hiddenNumbers.includes(num) ? "red" : "white"
                }}
            >
                {num}
            </div>
        );
    };



    return (
        <div className="flex flex-col p-4 w-full h-[1000px] gap-2 bg-white">
            <p className={`text-lg font-bold ${status === "GAME OVER" && "text-red-500"} ${status === "ALL CLEARED" && "text-green-500"}`}>{status}</p>
            <div className="flex">
                <p className="text-lg w-20">Points:</p>
                <input className="pl-2 rounded border-solid border-[1px] border-[#999]" value={qualityNumber} onChange={(e) => {
                    setQualityNumber(Number(e.target.value) || 0)
                }} />
            </div>
            <div className="flex">
                <p className="text-lg w-20">Time:</p>
                <p className="text-lg">{seconds.toFixed(1)}</p>
            </div>
            <button className=" w-[100px] bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold  rounded border-solid border-[1px] border-[#999]" onClick={() => setNumbers(generateRandomNumbers(qualityNumber))
            }
            >{textButton}</button>
            <div className=" border-solid border-[1px] w-full h-[750px] rounded border-[#999] p-1 relative">
                {numbers.map((item, index) => (
                    <div key={index} onClick={() => status === "GAME OVER" ? null : handleClick(index, item.num)}>
                        {item.num > 0 ? numberIngame(item.num, item.positonX, item.positonY, item.zIndex) : <></>}
                    </div>
                ))}
            </div>
        </div >

    );
};

export default RandomNumberGame;