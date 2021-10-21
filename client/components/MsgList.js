import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import {useEffect, useState} from "react";
import fetcher from '../fetcher.js'
import {useRouter} from "next/router";

const UserIds = ["sean", "moon"];
const getRandomUserId = () => UserIds[Math.round(Math.random())];

// const originalMsgs = Array(50)
//     .fill(0)
//     .map((_, i) => ({
//         id: 50 - i,
//         userId: getRandomUserId(),
//         timestamp: 1234567890123 + (50 - i) + 1000 * 60,
//         text: `${50 - i} mock text`,
//     }));

// console.log(JSON.stringify(originalMsgs));

const MsgList = () => {
    const [msgs, setMsgs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const {query: {userId = ''}} = useRouter()

    const onCreate = async (text) => {
        const newMsg = await fetcher('post', '/messages', {text, userId})
        if (!newMsg) throw new Error('작업 도중 오류가 발생하였습니다.');
        // const newMsg = {
        //     id: msgs.length + 1,
        //     userId: getRandomUserId(),
        //     timestamp: Date.now(),
        //     text: `${msgs.length + 1} ${text}`,
        // };
        setMsgs((msgs) => [newMsg, ...msgs]);
    };

    const onUpdate = async (text, id) => {
        const newMsg = await fetcher('put', `/messages/${id}`, {text, userId})
        if (!newMsg) throw new Error('작업 도중 오류가 발생하였습니다.');
        setMsgs((msgs) => {
            const targetIdx = msgs.findIndex((msg) => msg.id === id);
            if (targetIdx < 0) return msgs;
            const newMsgs = [...msgs];
            // newMsgs.splice(targetIdx, 1, {
            //     ...msgs[targetIdx],
            //     text,
            // });
            newMsgs.splice(targetIdx, 1, newMsg);
            return newMsgs;
        });
        doneEdit();
    };

    const doneEdit = () => setEditingId(null);

    const onDelete = async (id) => {
        const receivedId = await fetcher('delete', `/messages/${id}`, {params: {userId}});
        setMsgs((msgs) => {
            const targetIdx = msgs.findIndex((msg) => msg.id === receivedId + '');
            if (targetIdx < 0) return msgs;
            const newMsgs = [...msgs];
            newMsgs.splice(targetIdx, 1);
            return newMsgs;
        });
    };

    const getMsgs = async () => {
        const msgs = await fetcher('get', '/messages')
        setMsgs(msgs)
    }
    useEffect(() => {
        getMsgs()
    }, [])


    return (
        <>
            <MsgInput mutate={onCreate}/>
            <ul className="messages">
                {msgs.map((x) => (
                    <MsgItem
                        key={x.id}
                        {...x}
                        onUpdate={onUpdate}
                        startEdit={() => setEditingId(x.id)}
                        isEditing={editingId === x.id}
                        onDelete={() => onDelete(x.id)}
                        myId={userId}
                    />
                ))}
            </ul>
        </>
    );
};

export default MsgList;
