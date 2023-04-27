import React, { useState, useEffect } from 'react';

async function _processStream(
    stream: ReadableStream<Uint8Array>,
    callback: (text: string | ((prevData: string) => string)) => void
): Promise<void> {
    let data = "";
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    function processChunk(chunk: ReadableStreamReadResult<Uint8Array>): void {
        if (chunk.done) {
            return;
        }
        const chunkDecoded = decoder.decode(chunk.value);
        data += chunkDecoded;
        callback(data);
        console.log(chunkDecoded);
        reader.read().then(processChunk);
    }
    reader.read().then(processChunk);
}

async function _fetchData(
    setStreamData: (text: string | ((prevData: string) => string)) => void,
    message: string
): Promise<void> {
    try {
        const response = await fetch('http://localhost:8000/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
        {message: message}
            ),
        });

        if (response.body) {
            _processStream(response.body, setStreamData);
        } else {
            console.error('Response body is null or undefined');
        }
    } catch (error) {
        console.error(error);
    }
};


const StreamingDataDisplay = (props: {message : string, shouldComplete: boolean}) => {
    const [streamData, setStreamData] = useState<string>('');

    useEffect(() => {
        if (!props.shouldComplete) {
            return () => {};
        }
        setStreamData('')
        _fetchData(setStreamData, props.message);
        // return () => {
        //     ;
        // };
    }, [props.message, props.shouldComplete]);

    const handleResample = () => {
        setStreamData('');
        _fetchData(setStreamData, props.message);
    };

    return (
        <div>
            {streamData && (
                <p style={{ whiteSpace: 'pre-wrap' }}>{streamData}</p>
            )}
            <button onClick={handleResample} disabled={!props.shouldComplete}>⟳</button>
        </div>
    );
};

export default StreamingDataDisplay;