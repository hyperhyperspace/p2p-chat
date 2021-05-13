import { HashedLiteral, HashedObject, Hashing, Identity, MutableReference } from '@hyper-hyper-space/core';

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
            this.setId(this.computeId());
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
               this.getId() === this.computeId() &&
               this.checkDerivedField('authorIdentity') &&
               this.authorIdentity instanceof MutableReference &&
               this.checkDerivedField('archiveLocally') &&
               this.archiveLocally instanceof MutableReference;
    }

    private computeId() {
        return Hashing.forString(this.chatRoomWordCodeLang + '/' + (this.chatRoomWordCode as string[]).join('-'));
    }
}

HashedObject.registerClass(ChatRoomConfig.className, ChatRoomConfig);

export { ChatRoomConfig };