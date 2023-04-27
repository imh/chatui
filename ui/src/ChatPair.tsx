import React from 'react';
import StreamingDataDisplay from './StreamingDataDisplay';

function ChatPair() {
    const dogMessage = "Please write me a funny limerick about my dog. For information, she's an old red pit bull with greying fur. She's a goober and a bit of a potato. She's totally deaf now. Her name is Akira.";
    const [message, setMessage] = React.useState<string>(dogMessage);
    const [lastSubmittedMessage, setLastSubmittedMessage] = React.useState<string>('');
    const [shouldComplete, setShouldComplete] = React.useState<boolean>(false);

    const hasSubmitted = message === lastSubmittedMessage;

    const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setShouldComplete(false);
        setMessage(event.target.value);
    }

    const handleSubmit = () => {
        setLastSubmittedMessage(message);
        setShouldComplete(true);
    }

    return (
        <div className="chatPair">
        <textarea
            value={message}
            onChange={handleMessageChange}
        />
            <button onClick={handleSubmit} disabled={hasSubmitted}>Submit</button>
            <StreamingDataDisplay message={message} shouldComplete={shouldComplete}></StreamingDataDisplay>
        </div>
    );
}

export default ChatPair;
