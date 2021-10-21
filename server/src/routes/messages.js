import {readDB, writeDB} from "../dbController.js";
import {v4} from 'uuid';

const getMsgs = () => readDB('messages');
const setMsgs = (data) => writeDB('messages', data);

const messagesRoute = [{
    method: "get",
    route: '/messages',
    handler: (req, res) => {
        const msgs = getMsgs();
        res.send(msgs);
    }
}, {
    method: "get",
    route: '/messages/:id',
    handler: ({params: {id}}, res) => {
        try {
            const msgs = getMsgs();
            const msg = msgs.find((msg) => msg.id === id);
            if (!msg) throw new Error('메시지를 찾을 수 없습니다.');
            res.send(msg);
        } catch (err) {
            res.status(404).send({error: err});
        }
    }
}, {
    method: "post",
    route: '/messages',
    handler: ({body, params, query}, res) => {
        const msgs = getMsgs();
        const newMsgs = {
            id: v4(),
            text: body.text,
            userId: body.userId,
            timestamp: Date.now()
        }
        msgs.unshift(newMsgs)
        setMsgs(msgs)
        res.send(newMsgs)
    }
}, {
    method: "put",
    route: '/messages/:id',
    handler: ({body, params: {id}}, res) => {
        try {
            const msgs = getMsgs()
            const targetIdx = msgs.findIndex(msg => msg.id === id);
            if (targetIdx < 0) throw new Error('해당 메시지가 없습니다.')
            if (msgs[targetIdx].userId !== body.userId) throw new Error('사용자가 다릅니다.')
            const newMsgs = {...msgs[targetIdx], text: body.text}
            msgs.splice(targetIdx, 1, newMsgs)
            setMsgs(msgs)
            res.send(newMsgs)
        } catch (err) {
            res.status(500).send({error: err})
        }
    }
}, {
    method: "delete",
    route: '/messages/:id',
    // params로 보내는 데 서버에서 받을 때는 query로 받아야 한다.
    handler: ({query: {userId}, params: {id}}, res) => {
        try {
            const msgs = getMsgs()
            const targetIdx = msgs.findIndex(msg => msg.id === id);
            if (targetIdx < 0) throw new Error('해당 메시지가 없습니다.')
            if (msgs[targetIdx].userId !== userId) throw new Error('사용자가 다릅니다.')
            msgs.splice(targetIdx, 1)
            setMsgs(msgs)
            res.send(id)
        } catch (err) {
            res.status(500).send({error: err})
        }
    }
}]

export default messagesRoute