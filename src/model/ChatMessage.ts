import { HashedObject, Identity } from '@hyper-hyper-space/core';

// A message from a given author, to be used within ChatRooms.

class ChatMessage extends HashedObject {

    static className = 'p2p-chat/v0/model/ChatMessage';

    text?: string;
    timestamp?: number;

    constructor(author?: Identity, text?: string, timestamp?: number) {
        super();
    
        if (author !== undefined) {
            this.setAuthor(author);
            this.text = text;
            this.timestamp = timestamp !== undefined? timestamp : Date.now();
        }
    }

    getClassName(): string {
        return ChatMessage.className;
    }

    init(): void {
        
    }

    async validate(_references: Map<string, HashedObject>): Promise<boolean> {
        return this.text !== undefined && this.getAuthor() !== undefined && this.timestamp !== undefined;
    }

}

HashedObject.registerClass(ChatMessage.className, ChatMessage);

export { ChatMessage };