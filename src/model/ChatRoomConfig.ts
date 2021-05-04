import { HashedLiteral, HashedObject, Identity, MutableReference } from '@hyper-hyper-space/core';

class ChatRoomConfig extends HashedObject {

    static className = 'p2p-chat/v0/model/ChatRoomConfig';

    chatRoomWordCode?: string[];
    chatRoomWordCodeLang?: string; 
    authorIdentity?: MutableReference<Identity>;
    archiveLocally?: MutableReference<HashedLiteral>;

    constructor(chatRoomWordCode?: string[], chatRoomWordCodeLang='en') {
        super();

        if (chatRoomWordCode !== undefined) {
            this.chatRoomWordCode = chatRoomWordCode;
            this.chatRoomWordCodeLang = chatRoomWordCodeLang;
            this.addDerivedField('authorIdentity', new MutableReference());
            this.addDerivedField('archiveLocally', new MutableReference());
        }
    }
    
    getClassName(): string {
        return ChatRoomConfig.className;
    }

    init(): void {
        
    }

    async validate(_references: Map<string, HashedObject>): Promise<boolean> {
        return this.chatRoomWordCode !== undefined &&
               this.chatRoomWordCodeLang !== undefined &&
               this.checkDerivedField('authorIdentity') &&
               this.authorIdentity instanceof MutableReference &&
               this.checkDerivedField('archiveLocally') &&
               this.archiveLocally instanceof MutableReference;
    }

}

HashedObject.registerClass(ChatRoomConfig.className, ChatRoomConfig);

export { ChatRoomConfig };