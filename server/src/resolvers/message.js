import { writeDB } from "../dbController.js";
import { v4 } from "uuid";

const setMsgs = (data) => writeDB("messages", data);

/*
 * obj: parent 객체, 거의 사용하지 않음
 * args: Query에 필요한 필드에 제공되는 인수(파라미터)
 * context: 로그인한 사용자, DB Access 등 중요한 정보
 * */
const messageResolver = {
  Query: {
    messages: (obj, args, { models }) => {
      return models.messages;
    },
    message: (obj, { id = "" }, { models }) => {
      return models.messages.find((msg) => msg.id === id);
    },
  },
  Mutation: {
    createMessage: (obj, { text, userId }, { models }) => {
      const newMsgs = {
        id: v4(),
        text,
        userId,
        timestamp: Date.now(),
      };
      models.messages.unshift(newMsgs);
      setMsgs(models.messages);
      return newMsgs;
    },
    updateMessage: (obj, { id, text, userId }, { models }) => {
      const targetIdx = models.messages.findIndex((msg) => msg.id === id);
      if (targetIdx < 0) throw new Error("해당 메시지가 없습니다.");
      if (models.messages[targetIdx].userId !== userId)
        throw new Error("사용자가 다릅니다.");
      const newMsgs = { ...models.messages[targetIdx], text };
      models.messages.splice(targetIdx, 1, newMsgs);
      setMsgs(models.messages);
      return newMsgs;
    },
    deleteMessage: (obj, { id, userId }, { models }) => {
      const targetIdx = models.messages.findIndex((msg) => msg.id === id);
      if (targetIdx < 0) throw new Error("해당 메시지가 없습니다.");
      if (models.messages[targetIdx].userId !== userId)
        throw new Error("사용자가 다릅니다.");
      models.messages.splice(targetIdx, 1);
      setMsgs(models.messages);
      return id;
    },
  },
};

export default messageResolver;
