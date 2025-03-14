"use client";

import { ChangeEvent, useEffect, useState } from 'react'
import { Race } from '@/utils/race.class'
import axios from 'axios'

export default function Video() {
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [race, setRace] = useState<any | null>(null);
    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length) {
            return;
        }
        setFile(e.target.files[0])
    }
    const handleButton = () => {
        console.log('клик');
    }
    const handleUrl = (e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.currentTarget.value);
    }
    useEffect(() => {
        const handle = async () => {
            if (!url) {
                return;
            }
            console.log(url);
            const race = await axios.get(`http://localhost:3010/parser?url=${url}`) as any;
            setRace(race.data);
        }
        const interval = setInterval(() => handle().catch(console.error), 1e3);
        handle().catch(console.error);
        return () => clearInterval(interval);
    }, [url])
    return <div>
        <input type="file" accept="video/mp4" onChange={handleInput} />
        <br/>
        {file?.name}
        <br/>
        <button className="bg-white text-blue-600 rounded-xl p-5" onClick={handleButton}>Жеска нагрузить пк Платона шоб не втыкал</button>
        <br/>
        <div className="mt-10 whitespace-pre-wrap">
            <input accept="text" onChange={handleUrl} placeholder="url" />
            <br/>
            {/*{JSON.stringify(race)}*/}
            {race && race.drivers.map(driver => `${driver.name} ${driver.karts.join(' -> ')}`).join('\n')}
            <br/>
            Питы: {race && race.pitlane[0].join(", ")}
        </div>
    </div>
}
